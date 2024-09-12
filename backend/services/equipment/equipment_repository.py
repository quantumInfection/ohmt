import json
from abc import ABC, abstractmethod
from db.db_pool import DBPool
import services.equipment.model as eq_model


class AbstractEquipmentsRepository(ABC):
    @abstractmethod
    def add(self, equipment: eq_model.Equipment):
        """
        Create a new equipment.
        :param equipment:
        """
        raise NotImplementedError


class EquipmentsRepository(AbstractEquipmentsRepository):
    """
    Repository for saving equipment data.
    """

    def __init__(self, db_pool: DBPool):
        super().__init__()
        self.db_pool = db_pool

    def dict_cursor(self):
        return self.db_pool.dict_cursor()

    def cursor(self, *args, **kwargs):
        return self.db_pool.cursor(*args, **kwargs)

    def add(self, equipment: eq_model.Equipment):
        sql = """
            insert into equipment (
                id,
                company_id,
                asset_id,
                device_id,
                model,
                serial_number,
                case_id,
                location_id,
                image_url,
                status,
                category_id,
                calibration_id
            )
            values (
                %(id)s,
                %(company_id)s,
                %(asset_id)s,
                %(device_id)s,
                %(model)s,
                %(serial_number)s,
                %(case_id)s,
                %(location_id)s,
                %(image_url)s,
                %(status)s,
                %(category_id)s,
                %(calibration_id)s
            );
        """

        with self.db_pool.cursor() as cursor:
            cursor.execute(sql, equipment.__dict__)
