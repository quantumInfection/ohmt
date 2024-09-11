from dataclasses import dataclass
from uuid import uuid4
from enum import Enum


class Status(Enum):
    ACTIVE = "Active"
    REPAIR = "Repair"
    CALIBRATION = "Calibration"
    RETIRED = "Retired"


@dataclass
class Location:
    id: str
    name: str


@dataclass
class Category:
    id: str
    name: str


@dataclass
class Calibration:
    id: str
    # TODO: Grow


@dataclass
class Equipment:
    id: str  # uuid
    asset_id: str
    device_id: str
    model: str
    serial_number: str
    case_id: str
    location_id: str  # References Location
    image_url: str
    status: Status
    category_id: str
    calibration_id: str | None  # References Calibration
