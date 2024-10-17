from dataclasses import dataclass
from uuid import uuid4
from enum import Enum
from datetime import date, datetime


IMAGE_URL_CDN_PREFIX = "https://ohmt.syd1.digitaloceanspaces.com/images/equipment/"
PDF_URL_CDN_PREFIX = "https://ohmt.syd1.digitaloceanspaces.com/pdfs/calibrations/"

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
    calibration_type: CalibrationType
    completion_date: date
    expiry_date: date
    pdf_file_url: str  # public or private url
    notes: str | None
    created_at: datetime
    updated_at: datetime | None

    @classmethod
    def create(
        cls,
        provider_id: str,
        calibration_type: str,
        completion_date: date,
        expiry_date: date,
        pdf_file_url: str,
        notes: str | None,
    ):
        return cls(
            id=str(uuid4()),
            provider_id=provider_id,
            calibration_type=CalibrationType(calibration_type),
            completion_date=completion_date,
            expiry_date=expiry_date,
            pdf_file_url=f"{PDF_URL_CDN_PREFIX}{pdf_file_url}",
            notes=notes,
            created_at=datetime.now(),
            updated_at=None,
        )

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
    asset_id: str
    device_id: str
    model: str
    serial_number: str
    case_id: str | None  # References Case
    location_id: str | None  # References Location
    images: list[Image]
    status: Status
    category_id: str
    calibration_category: CalibrationCategory
    notes: str
    calibrations: dict[str, Calibration] | None
    created_at: datetime
    updated_at: datetime | None

    @classmethod
    def create(
        cls,
        company_id: str,
        asset_id: str,
        device_id: str,
        model: str,
        serial_number: str,
        case_id: str | None,
        location_id: str | None,
        image_urls: list[str],
        primary_image_index: int,  # Should start from zero
        status: str,
        category_id: str,
        calibration_category: str,
        notes: str,
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
            images=[
                Image(
                    id=str(uuid4()),
                    url=f"{IMAGE_URL_CDN_PREFIX}{url}",
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
        calibration_type: str,
        completion_date: date,
        expiry_date: date,
        pdf_file_url: str,
        notes: str | None,
    ):
        if self.calibrations is None:
            self.calibrations = dict()
        cal_id = str(uuid4())
        self.calibrations[cal_id] = Calibration.create(
            provider_id=provider_id,
            calibration_type=calibration_type,
            completion_date=completion_date,
            expiry_date=expiry_date,
            pdf_file_url=pdf_file_url,
            notes=notes,
        )

        self.updated_at = datetime.now()

    def update_calibration(
        self,
        cal_id: str,
        provider_id: str,
        calibration_type: str,
        completion_date: date,
        expiry_date: date,
        pdf_file_url: str,
        notes: str | None,
    ):
        if self.calibrations is None:
            raise ValueError("No calibration found to update.")
        if cal_id not in self.calibrations:
            raise ValueError("Calibration not found.")
        self.calibrations[cal_id] = Calibration.create(
            provider_id=provider_id,
            calibration_type=calibration_type,
            completion_date=completion_date,
            expiry_date=expiry_date,
            pdf_file_url=pdf_file_url,
            notes=notes,
        )
