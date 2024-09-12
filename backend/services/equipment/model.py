from dataclasses import dataclass
from uuid import uuid4
from enum import Enum


@dataclass
class Company:
    id: str
    name: str
    # TODO: More details


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
    company_id: str  # References Company
    asset_id: str
    device_id: str
    model: str
    serial_number: str
    case_id: str
    location_id: str  # References Location
    image_url: str  # public or private url
    status: Status
    category_id: str
    calibration_id: str | None  # References Calibration

    @classmethod
    def create(
        cls,
        company_id: str,
        asset_id: str,
        device_id: str,
        model: str,
        serial_number: str,
        case_id: str,
        location_id: str,
        image_url: str,
        status: str,
        category_id: str,
        calibration_id: str | None,
    ):
        return cls(
            id=str(uuid4()),
            company_id=company_id,
            asset_id=asset_id,
            device_id=device_id,
            model=model,
            serial_number=serial_number,
            case_id=case_id,
            location_id=location_id,
            image_url=image_url,
            status=Status(status),
            category_id=category_id,
            calibration_id=calibration_id,
        )
