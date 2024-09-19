import json
from abc import ABC, abstractmethod
from db.db_pool import DBPool
import services.equipment.model as eq_model
from psycopg2.extras import execute_values


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
        equipments_sql = """
            insert into equipments (
                id,
                company_id,
                asset_id,
                device_id,
                model,
                serial_number,
                case_id,
                status,
                category_id,
                calibration_category,
                notes,
                created_at
            )
            values (
                %(id)s,
                %(company_id)s,
                %(asset_id)s,
                %(device_id)s,
                %(model)s,
                %(serial_number)s,
                %(case_id)s,
                %(status)s,
                %(category_id)s,
                %(calibration_category)s,
                %(notes)s,
                %(created_at)s
            );
        """

        with self.db_pool.cursor() as cursor:
            cursor.execute(
                equipments_sql,
                {
                    "id": equipment.id,
                    "company_id": equipment.company_id,
                    "asset_id": equipment.asset_id,
                    "device_id": equipment.device_id,
                    "model": equipment.model,
                    "serial_number": equipment.serial_number,
                    "case_id": equipment.case_id,
                    "status": equipment.status.value,
                    "category_id": equipment.category_id,
                    "calibration_category": equipment.calibration_category.value,
                    "notes": equipment.notes,
                    "created_at": equipment.created_at,
                },
            )

        images_sql = """
            insert into equipment_images (
                id,
                equipment_id,
                url,
                is_primary,
                created_at,
                updated_at
            )
            values %s
            ;
        """

        with self.db_pool.cursor() as cursor:
            execute_values(
                cursor,
                images_sql,
                [
                    (
                        image.id,
                        equipment.id,
                        image.url,
                        image.primary,
                        image.created_at,
                        image.updated_at,
                    )
                    for image in equipment.images
                ],
                template="(%s, %s, %s, %s, %s, %s)",
            )
