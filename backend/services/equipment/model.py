from dataclasses import dataclass
from uuid import uuid4
from enum import Enum
from datetime import date, datetime


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


@classmethod
class CalibrationProvider:
    id: str
    name: str


class CalibrationType(Enum):
    CONFORMANCE = "Conformance"
    INITIAL = "Initial"
    RECALIBRATION = "Re-Calibration"
    REPAIR = "Repair"


@dataclass
class Calibration:
    id: str
    provider_id: str  # References CalibrationProvider
    type: CalibrationType
    completion_date: date
    expiry_date: date
    pdf_file_url: str  # public or private url
    notes: str | None


class CalibrationCategory(Enum):
    NIL_CALIBRATION = "Nil Calibration"
    CONFORMANCE = "Conformance"
    NORMAL_CALIBRATION = "Normal Calibration"
    IANZ_NATA_CALIBRATION = "IANZ/NATA Calibration"


@dataclass
class Image:
    id: str
    url: str
    primary: bool
    created_at: datetime
    updated_at: datetime | None


@dataclass
class Equipment:
    id: str  # uuid
    company_id: str  # References Company
    name: str
    asset_id: str
    device_id: str
    model: str
    serial_number: str
    case_id: str  # References Case
    images: list[Image]
    status: Status
    category_id: str
    calibration_category: CalibrationCategory
    notes: str
    calibrations: list[Calibration] | None
    created_at: datetime
    updated_at: datetime | None

    @classmethod
    def create(
        cls,
        company_id: str,
        name: str,
        asset_id: str,
        device_id: str,
        model: str,
        serial_number: str,
        case_id: str,
        image_urls: list[str],
        primary_image_index: int,  # Should start from zero
        status: str,
        category_id: str,
        calibration_category: str,
        notes: str,
    ):
        return cls(
            id=str(uuid4()),
            name=name,
            company_id=company_id,
            asset_id=asset_id,
            device_id=device_id,
            model=model,
            serial_number=serial_number,
            case_id=case_id,
            images=[
                Image(
                    id=str(uuid4()),
                    url=url,
                    primary=i == primary_image_index,
                    created_at=datetime.now(),
                    updated_at=None,
                )
                for i, url in enumerate(image_urls)
            ],
            status=Status(status),
            category_id=category_id,
            calibration_category=CalibrationCategory(calibration_category),
            notes=notes,
            calibrations=None,
            created_at=datetime.now(),
            updated_at=None,
        )

    def add_calibration(
        self,
        provider_id: str,
        type: str,
        completion_date: date,
        expiry_date: date,
        pdf_file_url: str,
        notes: str | None,
    ):
        if self.calibrations is None:
            self.calibrations = []
        self.calibrations.append(
            Calibration(
                id=str(uuid4()),
                provider_id=provider_id,
                type=CalibrationType(type),
                completion_date=completion_date,
                expiry_date=expiry_date,
                pdf_file_url=pdf_file_url,
                notes=notes,
            )
        )

        self.updated_at = datetime.now()

    def add_calibrations(self, calibrations: list[dict]):
        if self.calibrations is None:
            self.calibrations = []
        for calibration in calibrations:
            self.add_calibration(**calibration)
