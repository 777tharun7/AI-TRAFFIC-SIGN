"""
WebSocket Connection Manager for Real-Time Event & Telemetry Streaming.
Channels:
- /ws/vehicle/{vehicle_id} (High frequency vehicle telemetry & active alerts)
- /ws/events (Digital road event state changes)
- /ws/signals (Traffic signal phase transitions)
"""

import json
import asyncio
from typing import List, Dict, Set
from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {
            "vehicle": set(),
            "events": set(),
            "signals": set(),
            "general": set()
        }

    async def connect(self, websocket: WebSocket, channel: str = "general"):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = set()
        self.active_connections[channel].add(websocket)

    def disconnect(self, websocket: WebSocket, channel: str = "general"):
        if channel in self.active_connections and websocket in self.active_connections[channel]:
            self.active_connections[channel].remove(websocket)

    async def broadcast_channel(self, channel: str, message: dict):
        if channel in self.active_connections:
            dead_sockets = []
            for ws in self.active_connections[channel]:
                try:
                    await ws.send_json(message)
                except Exception:
                    dead_sockets.append(ws)
            for ws in dead_sockets:
                self.disconnect(ws, channel)

ws_manager = WebSocketManager()
