from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import uuid
from typing import Any


class ChangeType(Enum):
    UPDATE = "update"


@dataclass
class Changelog:
    id: str
    user_id: str
    change_type: ChangeType
    timestamp: datetime
    entity_type: str
    entity_id: str
    changes: dict[str, Any]

    @classmethod
    def log_change(
        cls,
        user_id: str,
        change_type: ChangeType,
        entity_type: str,
        entity_id: str,
        changes: dict[str, Any],
    ):
        changelog = cls(
            id=str(uuid.uuid4()),
            user_id=user_id,
            change_type=change_type,
            timestamp=datetime.now(),
            entity_type=entity_type,
            entity_id=entity_id,
            changes=changes,
        )
        # Save the changelog to the database or any storage
        # Example: db.save(changelog)
        return changelog
