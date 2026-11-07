"""
Application Configuration Settings for RoadSense AI.
"""

import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "RoadSense AI"
    PROJECT_TAGLINE: str = "Predictive Road Intelligence for Connected Vehicles"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Server Settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # Primary Demo City
    PRIMARY_CITY: str = "HYDERABAD"
    DEFAULT_LAT: float = 17.4435  # Cyber Towers, Hitec City
    DEFAULT_LON: float = 78.3772
    
    # Heading & Distance Geofence Defaults
    HEADING_TOLERANCE_DEG: float = 30.0
    DEFAULT_ACTIVATION_RADIUS_M: float = 250.0
    DEFAULT_TRIGGER_DISTANCE_M: float = 50.0
    DEFAULT_EXPIRY_DISTANCE_M: float = 60.0
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "roadsense-ai-secret-key-development-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./roadsense.db")
    
    # Model Weights
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/traffic_sign_v1.pt")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]

settings = Settings()
