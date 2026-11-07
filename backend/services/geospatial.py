"""
Geospatial Mathematics & Map Matching Engine for RoadSense AI.
Includes:
- Haversine distance
- Bearing computation (0-360)
- Heading difference with cyclic angular modulo
- Along-track signed projection (Positive = Ahead/Approaching, Negative = Behind/Passed)
- Heading tolerance validation (default ±30°)
"""

import math
from typing import Tuple

EARTH_RADIUS_METERS = 6371000.0

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in meters."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_METERS * c

def calculate_bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates forward bearing from point 1 to point 2 in degrees [0, 360)."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)
    
    y = math.sin(delta_lambda) * math.cos(phi2)
    x = (math.cos(phi1) * math.sin(phi2) -
         math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda))
    
    bearing_rad = math.atan2(y, x)
    bearing_deg = (math.degrees(bearing_rad) + 360.0) % 360.0
    return bearing_deg

def angular_difference(angle1: float, angle2: float) -> float:
    """Returns absolute minimal difference between two angles in degrees [0, 180]."""
    diff = abs(angle1 - angle2) % 360.0
    if diff > 180.0:
        diff = 360.0 - diff
    return diff

def is_heading_aligned(vehicle_heading: float, event_direction: float, tolerance: float = 30.0) -> bool:
    """
    Validates whether the vehicle is traveling in the applicable direction of the event.
    Rejects opposite-traffic and perpendicular-street triggers.
    """
    return angular_difference(vehicle_heading, event_direction) <= tolerance

def calculate_along_track_distance(
    veh_lat: float, veh_lon: float, veh_heading: float,
    target_lat: float, target_lon: float
) -> Tuple[float, float]:
    """
    Calculates signed along-track distance and cross-track distance.
    Returns (along_track_m, direct_distance_m):
    - along_track_m > 0: Target is ahead of the vehicle in travel trajectory
    - along_track_m < 0: Vehicle has passed the trigger line of target
    """
    direct_dist = haversine_distance(veh_lat, veh_lon, target_lat, target_lon)
    if direct_dist < 0.5:
        return 0.0, direct_dist
        
    bearing_to_target = calculate_bearing(veh_lat, veh_lon, target_lat, target_lon)
    rel_angle = math.radians(bearing_to_target - veh_heading)
    
    along_track = direct_dist * math.cos(rel_angle)
    return along_track, direct_dist

def interpolate_segment(lat1: float, lon1: float, lat2: float, lon2: float, fraction: float) -> Tuple[float, float]:
    """Linearly interpolates along a road segment."""
    lat = lat1 + (lat2 - lat1) * fraction
    lon = lon1 + (lon2 - lon1) * fraction
    return lat, lon
