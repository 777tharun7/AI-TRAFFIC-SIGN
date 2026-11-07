"""
Main FastAPI Server & Real-Time Engine for RoadSense AI.
"""

import asyncio
import os
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .core.config import settings
from .api.routes import router as api_router
from .websocket.manager import ws_manager
from .services.vehicle_simulator import vehicle_simulator

# Background simulation ticker
simulation_task = None

async def run_simulation_ticker():
    """Advances vehicle movement and broadcasts updates every 500ms over WebSocket."""
    while True:
        try:
            state = vehicle_simulator.step(delta_seconds=0.5)
            # Broadcast to connected clients
            payload = state.model_dump()
            await ws_manager.broadcast_channel("vehicle", payload)
            await ws_manager.broadcast_channel("events", {
                "active_events": [e.model_dump() for e in state.active_events],
                "approaching_events": [e.model_dump() for e in state.approaching_events]
            })
            if state.active_signal:
                await ws_manager.broadcast_channel("signals", state.active_signal.model_dump())
        except Exception as e:
            print(f"[Simulation Ticker Error]: {e}")
            
        await asyncio.sleep(0.5)

@asynccontextmanager
async def lifespan(app: FastAPI):
    global simulation_task
    print("🚦 [RoadSense AI] Starting Predictive Road Intelligence Platform...")
    simulation_task = asyncio.create_task(run_simulation_ticker())
    yield
    print("🛑 [RoadSense AI] Shutting down simulation services...")
    if simulation_task:
        simulation_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"{settings.PROJECT_TAGLINE} — 100% Software + AI Simulation Platform (Hyderabad Demo)",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount data folder for real images and templates
base_project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_dir_path = os.path.join(base_project_dir, "data")
if os.path.exists(data_dir_path):
    app.mount("/data", StaticFiles(directory=data_dir_path), name="data")

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# ----------------- WEBSOCKET ENDPOINTS -----------------
@app.websocket("/ws/vehicle/{vehicle_id}")
async def websocket_vehicle_endpoint(websocket: WebSocket, vehicle_id: str):
    await ws_manager.connect(websocket, "vehicle")
    try:
        while True:
            # Keep alive and accept client commands if sent
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, "vehicle")

@app.websocket("/ws/events")
async def websocket_events_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket, "events")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, "events")

@app.websocket("/ws/signals")
async def websocket_signals_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket, "signals")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, "signals")

# Mount frontend build if available
frontend_dist_path = os.path.join(base_project_dir, "frontend", "dist")
if os.path.exists(frontend_dist_path):
    app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="frontend")
else:
    @app.get("/")
    def root():
        return {
            "project": settings.PROJECT_NAME,
            "tagline": settings.PROJECT_TAGLINE,
            "scope": "100% Software + AI Simulation Prototype",
            "city": "HYDERABAD",
            "status": "ONLINE",
            "docs_url": "/docs",
            "api_prefix": settings.API_V1_STR
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
