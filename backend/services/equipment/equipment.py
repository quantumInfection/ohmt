from dataclasses import dataclass, field
from datetime import datetime
import uuid
from .image import Image
from .calibration import Calibration
from .changelog import Changelog, ChangeType


@dataclass
class Equipment:
    id: str
    company_id: str
    asset_id: str
    device_id: str
    model: str
    serial_number: str
    case_id: str | None
    location_id: str | None
    images: list[Image]
    status: str
    category_id: str
    calibration_category: str
    notes: str
    calibrations: dict[str, Calibration] | None
    created_at: datetime
    updated_at: datetime | None

    @staticmethod
    def create(
        company_id: str,
        asset_id: str,
        device_id: str,
        model: str,
        serial_number: str,
        case_id: str | None,
        location_id: str | None,
        images: list[Image],
        status: str,
        category_id: str,
        calibration_category: str,
        notes: str,
        calibrations: dict[str, Calibration] | None,
    ) -> "Equipment":
        return Equipment(
            id=str(uuid.uuid4()),
            company_id=company_id,
            asset_id=asset_id,
            device_id=device_id,
            model=model,
            serial_number=serial_number,
            case_id=case_id,
            location_id=location_id,
            images=images,
            status=status,
            category_id=category_id,
            calibration_category=calibration_category,
            notes=notes,
            calibrations=calibrations,
            created_at=datetime.now(),
            updated_at=None,
        )

    def update(self, **kwargs):
        old_obj = Equipment(**self.__dict__)  # Create a copy of the current state
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.now()
        changes = self._detect_changes(old_obj)
        return changes

    def _detect_changes(self, old_obj):
        changes = {}
        for key in old_obj.__dict__.keys():
            old_value = getattr(old_obj, key)
            new_value = getattr(self, key)
            if isinstance(old_value, dict) and isinstance(new_value, dict):
                dict_changes = {}
                for dict_key in old_value.keys() | new_value.keys():
                    old_dict_value = old_value.get(dict_key)
                    new_dict_value = new_value.get(dict_key)
                    if old_dict_value != new_dict_value:
                        dict_changes[dict_key] = {
                            "old": old_dict_value,
                            "new": new_dict_value,
                        }
                if dict_changes:
                    changes[key] = dict_changes
            elif old_value != new_value:
                changes[key] = {"old": old_value, "new": new_value}
        return changes

    def update_status(self, user_id: str, new_status: str):
        changes = self.update(status=new_status)
        if changes:
            Changelog.log_change(
                user_id, ChangeType.UPDATE, "Equipment", self.id, changes
            )

    def update_location(self, user_id: str, new_location_id: str):
        changes = self.update(location_id=new_location_id)
        if changes:
            Changelog.log_change(
                user_id, ChangeType.UPDATE, "Equipment", self.id, changes
            )

    def add_note(self, user_id: str, new_note: str):
        changes = self.update(notes=new_note)
        if changes:
            Changelog.log_change(
                user_id, ChangeType.UPDATE, "Equipment", self.id, changes
            )
