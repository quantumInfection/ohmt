import json
from abc import ABC, abstractmethod
from db.db_pool import DBPool
import services.equipment.model as eq_model
from psycopg2.extras import execute_values


class AbstractEquipmentsRepository(ABC):

    @abstractmethod
    def equipment_by_id(self, equipment_id: str) -> eq_model.Equipment | None:
        """
        Get equipment by its ID.
        :param equipment_id:
        :return:
        """
        raise NotImplementedError

    @abstractmethod
    def add(self, equipment: eq_model.Equipment):
        """
        Create a new equipment.
        :param equipment:
        """
        raise NotImplementedError

    @abstractmethod
    def save(self, equipment: eq_model.Equipment):
        """
        Update an existing equipment.
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

    def equipment_by_id(self, equipment_id: str) -> eq_model.Equipment | None:
        equipments_sql = """
            select
                id,
                company_id,
                asset_id,
                device_id,
                model,
                serial_number,
                case_id,
                location_id,
                status,
                category_id,
                calibration_category,
                notes,
                created_at,
                updated_at
            from equipments
            where id = %s;
        """

        with self.db_pool.dict_cursor() as cursor:
            cursor.execute(equipments_sql, (equipment_id,))
            equipment = cursor.fetchone()

        if not equipment:
            return None

        images_sql = """
            select
                id,
                url,
                is_primary,
                created_at,
                updated_at
            from equipment_images
            where equipment_id = %s;
        """

        with self.db_pool.dict_cursor() as cursor:
            cursor.execute(images_sql, (equipment_id,))
            images = cursor.fetchall()

        calibrations_sql = """
            select
                id,
                provider_id,
                calibration_type,
                completion_date,
                expiry_date,
                pdf_file_url,
                notes,
                created_at,
                updated_at
            from equipment_calibrations 
            where equipment_id = %s;
        """

        with self.db_pool.dict_cursor() as cursor:
            cursor.execute(calibrations_sql, (equipment_id,))
            calibrations = cursor.fetchall()

        return eq_model.Equipment(
            id=equipment["id"],
            company_id=equipment["company_id"],
            asset_id=equipment["asset_id"],
            device_id=equipment["device_id"],
            model=equipment["model"],
            serial_number=equipment["serial_number"],
            case_id=equipment["case_id"],
            location_id=equipment["location_id"],
            status=eq_model.Status(equipment["status"]),
            category_id=equipment["category_id"],
            calibration_category=eq_model.CalibrationCategory(
                equipment["calibration_category"]
            ),
            notes=equipment["notes"],
            created_at=equipment["created_at"],
            images=[
                eq_model.Image(
                    id=image["id"],
                    url=image["url"],
                    primary=image["is_primary"],
                    created_at=image["created_at"],
                    updated_at=image["updated_at"],
                )
                for image in images
            ],
            calibrations={
                calibration["id"]: eq_model.Calibration(
                    id=calibration["id"],
                    provider_id=calibration["provider_id"],
                    calibration_type=eq_model.CalibrationType(
                        calibration["calibration_type"]
                    ),
                    completion_date=calibration["completion_date"],
                    expiry_date=calibration["expiry_date"],
                    pdf_file_url=calibration["pdf_file_url"],
                    notes=calibration["notes"],
                    created_at=calibration["created_at"],
                    updated_at=calibration["updated_at"],
                )
                for calibration in calibrations
            },
            updated_at=equipment["updated_at"],
        )

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
                location_id,
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
                %(location_id)s,
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
                    "location_id": equipment.location_id,
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

    def save(self, equipment: eq_model.Equipment):
        equipments_sql = """
            update equipments
            set
                company_id = %(company_id)s,
                asset_id = %(asset_id)s,
                device_id = %(device_id)s,
                model = %(model)s,
                serial_number = %(serial_number)s,
                case_id = %(case_id)s,
                location_id = %(location_id)s,
                status = %(status)s,
                category_id = %(category_id)s,
                calibration_category = %(calibration_category)s,
                notes = %(notes)s,
                updated_at = %(updated_at)s
            where id = %(id)s;
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
                    "location_id": equipment.location_id,
                    "status": equipment.status.value,
                    "category_id": equipment.category_id,
                    "calibration_category": equipment.calibration_category.value,
                    "notes": equipment.notes,
                    "updated_at": equipment.updated_at,
                },
            )

        images_sql = """
            delete from equipment_images
            where equipment_id = %s;
        """

        with self.db_pool.cursor() as cursor:
            cursor.execute(images_sql, (equipment.id,))

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

        delete_calibrations_sql = """
            delete from equipment_calibrations
            where equipment_id = %s;
        """

        with self.db_pool.cursor() as cursor:
            cursor.execute(delete_calibrations_sql, (equipment.id,))

        insert_calibrations_sql = """
            insert into equipment_calibrations (
                id,
                equipment_id,
                provider_id,
                calibration_type,
                completion_date,
                expiry_date,
                pdf_file_url,
                notes,
                created_at,
                updated_at
            )
            
            values %s
            ;
            
        """

        with self.db_pool.cursor() as cursor:
            execute_values(
                cursor,
                insert_calibrations_sql,
                [
                    (
                        calibration.id,
                        equipment.id,
                        calibration.provider_id,
                        calibration.calibration_type.value,
                        calibration.completion_date,
                        calibration.expiry_date,
                        calibration.pdf_file_url,
                        calibration.notes,
                        calibration.created_at,
                        calibration.updated_at,
                    )
                    for calibration in equipment.calibrations.values()
                ],
                template="(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            )
