import json
from abc import ABC, abstractmethod
from db.db_pool import DBPool
import services.equipment.model as eq_model


class AbstractForecastSnapshotRepository(ABC):
    @abstractmethod
    def create_equipment(self, equipment: eq_model.Equipment):
        """
        Create a new equipment.
        :param snapshot:
        """
        raise NotImplementedError


class ForecastSnapshotRepository(AbstractForecastSnapshotRepository):
    """
    Repository for saving forecast snapshots.
    """

    def __init__(self, db_pool: DBPool):
        super().__init__()
        self.db_pool = db_pool

    def dict_cursor(self):
        return self.db_pool.dict_cursor()

    def cursor(self, *args, **kwargs):
        return self.db_pool.cursor(*args, **kwargs)

    def create_equipment(self, equipment: eq_model.Equipment):
        pass
