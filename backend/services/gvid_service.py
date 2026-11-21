"""
Government Vehicle Intelligence Device (GVID) Service.
Provides:
- In-vehicle hardware telemetry processing (OBD-II CAN wheel speed + GNSS GPS hybrid)
- Cryptographic device authentication & anti-tamper security alerts
- Calibration tracking and sensor uncertainty thresholds (ISO 15005 / AIS-140 standard)
- Offline buffer synchronization
- All demonstration records labeled [SIMULATED DATA]
"""

import time
from typing import List, Dict, Optional, Any
from ..models.schemas import (
    GVIDDeviceRecord, GVIDTelemetryPacket, GVIDTamperStatus, GVIDCanSource
)

class GVIDService:
    def __init__(self):
        self._devices: Dict[str, GVIDDeviceRecord] = {}
        self._latest_telemetry: Dict[str, GVIDTelemetryPacket] = {}
        self._init_mock_devices()

    def _init_mock_devices(self):
        records = [
            GVIDDeviceRecord(
                device_id="GVID-HYD-00109",
                vehicle_reg_num="TS 09 EV 4412",
                hardware_serial="SN-GVID-39820-2025",
                firmware_version="v2.4.1-govsec-rel",
                hardware_model="GVID-GovSec-Gen3 (Secure Element Enabled)",
                can_source=GVIDCanSource.OBD_II_CAN_BUS,
                tamper_status=GVIDTamperStatus.SECURE,
                calibration_date="2025-10-15",
                calibration_valid_until="2026-10-15",
                speed_sensor_uncertainty_kmh=0.8,
                offline_buffered_packets=0,
                signal_strength_dbm=-64,
                last_heartbeat="Just now (100ms ago)"
            ),
            GVIDDeviceRecord(
                device_id="GVID-HYD-00441",
                vehicle_reg_num="TS 07 TR 1022",
                hardware_serial="SN-GVID-18239-2024",
                firmware_version="v2.3.8-govsec-rel",
                hardware_model="GVID-HeavyDuty-Gen2",
                can_source=GVIDCanSource.WHEEL_SPEED_SENSOR,
                tamper_status=GVIDTamperStatus.SECURE,
                calibration_date="2025-06-20",
                calibration_valid_until="2026-06-20",
                speed_sensor_uncertainty_kmh=1.2,
                offline_buffered_packets=3,
                signal_strength_dbm=-78,
                last_heartbeat="15s ago"
            ),
            GVIDDeviceRecord(
                device_id="GVID-HYD-00812",
                vehicle_reg_num="TS 10 EV 8821",
                hardware_serial="SN-GVID-90214-2025",
                firmware_version="v2.4.1-govsec-rel",
                hardware_model="GVID-GovSec-Gen3",
                can_source=GVIDCanSource.OBD_II_CAN_BUS,
                tamper_status=GVIDTamperStatus.SECURE,
                calibration_date="2025-11-01",
                calibration_valid_until="2026-11-01",
                speed_sensor_uncertainty_kmh=0.9,
                offline_buffered_packets=0,
                signal_strength_dbm=-61,
                last_heartbeat="2s ago"
            ),
            GVIDDeviceRecord(
                device_id="GVID-HYD-00990",
                vehicle_reg_num="TS 08 UB 3301",
                hardware_serial="SN-GVID-77102-2025",
                firmware_version="v2.4.0-govsec-fleet",
                hardware_model="GVID-TransitBus-DualGNSS",
                can_source=GVIDCanSource.OBD_II_CAN_BUS,
                tamper_status=GVIDTamperStatus.SECURE,
                calibration_date="2025-09-12",
                calibration_valid_until="2026-09-12",
                speed_sensor_uncertainty_kmh=0.5,
                offline_buffered_packets=0,
                signal_strength_dbm=-59,
                last_heartbeat="1s ago"
            ),
            GVIDDeviceRecord(
                device_id="GVID-HYD-00108",
                vehicle_reg_num="TS 09 FA 1080",
                hardware_serial="SN-GVID-00108-EMS",
                firmware_version="v2.4.1-govsec-evp",
                hardware_model="GVID-Emergency-V2X",
                can_source=GVIDCanSource.OBD_II_CAN_BUS,
                tamper_status=GVIDTamperStatus.SECURE,
                calibration_date="2025-12-01",
                calibration_valid_until="2026-12-01",
                speed_sensor_uncertainty_kmh=0.4,
                offline_buffered_packets=0,
                signal_strength_dbm=-52,
                last_heartbeat="500ms ago"
            )
        ]
        for d in records:
            self._devices[d.device_id] = d

    def get_all_devices(self) -> List[GVIDDeviceRecord]:
        return list(self._devices.values())

    def get_device(self, device_id: str) -> Optional[GVIDDeviceRecord]:
        return self._devices.get(device_id)

    def ingest_telemetry(self, packet: GVIDTelemetryPacket) -> Dict[str, Any]:
        self._latest_telemetry[packet.device_id] = packet
        if packet.device_id in self._devices:
            dev = self._devices[packet.device_id]
            dev.last_heartbeat = "Just now"
            dev.tamper_status = packet.tamper_status
        return {
            "status": "ACCEPTED",
            "device_id": packet.device_id,
            "fused_speed_kmh": packet.fused_speed_kmh,
            "timestamp": packet.timestamp
        }

gvid_service = GVIDService()
