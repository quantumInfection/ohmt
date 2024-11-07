from dataclasses import dataclass, field
from datetime import datetime, date


@dataclass
class Calibration:
    provider_id: str
    calibration_type: str
    completion_date: date
    expiry_date: date
    pdf_file_url: str
    notes: str | None
    updated_at: datetime

    def __eq__(self, other):
        if not isinstance(other, Calibration):
            return False
        return (
            self.provider_id == other.provider_id
            and self.calibration_type == other.calibration_type
            and self.completion_date == other.completion_date
            and self.expiry_date == other.expiry_date
            and self.pdf_file_url == other.pdf_file_url
            and self.notes == other.notes
            and self.updated_at == other.updated_at
        )
