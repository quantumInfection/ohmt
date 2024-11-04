from dataclasses import dataclass, field
from datetime import datetime
import uuid

@dataclass
class Image:
    id: str
    url: str
    primary: bool
    created_at: datetime
    updated_at: datetime | None

    @staticmethod
    def create(url: str, primary: bool) -> 'Image':
        return Image(
            id=str(uuid.uuid4()),
            url=url,
            primary=primary,
            created_at=datetime.now(),
            updated_at=None
        )

