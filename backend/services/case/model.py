from dataclasses import dataclass
from datetime import datetime
from uuid import uuid4


@dataclass
class Case:
    id: str
    case_id: str  # unique but human readable
    company_id: str
    name: str  # unique? maybe
    location_id: str
    created_at: datetime
    updated_at: datetime | None

    @classmethod
    def create(cls, case_id: str, company_id: str, name: str, location_id: str):
        return cls(
            id=str(uuid4()),
            case_id=case_id,
            company_id=company_id,
            name=name,
            location_id=location_id,
            created_at=datetime.now(),
            updated_at=None,
        )

    def update_location(self, location_id: str):
        self.location_id = location_id
        self.updated_at = datetime.now()
