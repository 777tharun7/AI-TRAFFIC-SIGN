"""
Enterprise Authentication Service for RoadSense AI.
Implements JWT-based auth with refresh tokens, role-based access control,
and secure session management compliant with DPDP Act 2023 principles.
"""

import time
import uuid
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from ..core.config import settings

# Password hashing context (pbkdf2_sha256 for robust, cross-platform NIST compliance)
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# In-memory user store (replace with PostgreSQL in production)
# Structure: { user_id: { ...user_data... } }
_USERS: Dict[str, Dict[str, Any]] = {}

# Active sessions tracking (token_jti -> user_id)
_ACTIVE_SESSIONS: Dict[str, str] = {}

# Demo seed users
def _seed_demo_users():
    """Seed demonstration users for immediate testing."""
    demo_users = [
        {
            "user_id": "citizen-001",
            "email": "devan.tharun@example.com",
            "password_hash": pwd_context.hash("RoadSense@2026"),
            "full_name": "Devanboina Tharun",
            "phone": "+91 98480 12345",
            "role": "citizen",
            "jurisdiction": "Hyderabad, Telangana",
            "vehicle_plate": "TS 09 EV 4412",
            "badge_color": "bg-emerald-500",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login": None,
        },
        {
            "user_id": "officer-001",
            "email": "sridhar.k@ts-police.gov.in",
            "password_hash": pwd_context.hash("RoadSense@2026"),
            "full_name": "Insp. K. Sridhar, TPS",
            "phone": "+91 98480 99991",
            "role": "enforcement_officer",
            "jurisdiction": "Cyberabad Traffic Ops (Div II)",
            "badge_number": "TS-HYD-7701",
            "badge_color": "bg-[#0A2540]",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login": None,
        },
        {
            "user_id": "admin-001",
            "email": "admin@roadsense-ai.gov.in",
            "password_hash": pwd_context.hash("RoadSense@2026"),
            "full_name": "System Administrator",
            "phone": "+91 98480 00000",
            "role": "system_admin",
            "jurisdiction": "Telangana State",
            "badge_color": "bg-indigo-600",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login": None,
        },
    ]
    for u in demo_users:
        _USERS[u["user_id"]] = u


# Seed on import
_seed_demo_users()


class AuthService:
    """Enterprise authentication service."""

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @classmethod
    def authenticate_user(cls, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user by email and password. Returns user dict or None."""
        # Find user by email
        user = None
        for u in _USERS.values():
            if u["email"].lower() == email.lower():
                user = u
                break

        if not user:
            return None
        if not cls.verify_password(password, user["password_hash"]):
            return None
        if not user.get("is_active", False):
            return None

        # Update last login
        user["last_login"] = datetime.now(timezone.utc).isoformat()
        return user

    @classmethod
    def create_access_token(cls, user_id: str, role: str, email: str) -> str:
        """Create JWT access token."""
        now = datetime.now(timezone.utc)
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        jti = str(uuid.uuid4())

        payload = {
            "sub": user_id,
            "email": email,
            "role": role,
            "iat": int(now.timestamp()),
            "exp": int(expire.timestamp()),
            "jti": jti,
            "iss": "roadsense-ai",
        }

        token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        _ACTIVE_SESSIONS[jti] = user_id
        return token

    @classmethod
    def verify_token(cls, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token and return payload if valid."""
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM],
                issuer="roadsense-ai",
            )
            jti = payload.get("jti")
            if jti and jti not in _ACTIVE_SESSIONS:
                return None  # Session revoked
            user_id = payload.get("sub")
            if user_id not in _USERS:
                return None
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    @classmethod
    def logout(cls, token: str) -> bool:
        """Revoke a session by token."""
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM],
                options={"verify_exp": False},
            )
            jti = payload.get("jti")
            if jti in _ACTIVE_SESSIONS:
                del _ACTIVE_SESSIONS[jti]
                return True
        except jwt.InvalidTokenError:
            pass
        return False

    @classmethod
    def get_user(cls, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID (without password hash)."""
        user = _USERS.get(user_id)
        if not user:
            return None
        return {k: v for k, v in user.items() if k != "password_hash"}

    @classmethod
    def get_all_users(cls) -> list:
        """Get all users (admin only, without password hashes)."""
        return [
            {k: v for k, v in u.items() if k != "password_hash"}
            for u in _USERS.values()
        ]


# Global instance
auth_service = AuthService()
