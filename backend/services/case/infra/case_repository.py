from abc import ABC, abstractmethod

import services.case.model as case_model
from db.db_pool import DBPool


class AbstractCaseRepository(ABC):
    @abstractmethod
    def get(self, case_id: str, company_id: str) -> case_model.Case | None:
        """
        Get a case by its case_id and company_id
        :param case_id:
        :param company_id:
        :return:
        """
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id) -> case_model.Case | None:
        """
        Get a case by its id
        :param id:
        :return:
        """
        raise NotImplementedError

    @abstractmethod
    def upsert(self, case: case_model.Case):
        """
        Create a new case.
        :param case:
        """
        raise NotImplementedError


class CaseRepository(AbstractCaseRepository):
    """
    Repository for saving case data.
    """

    def __init__(self, db_pool: DBPool):
        super().__init__()
        self.db_pool = db_pool

    def dict_cursor(self):
        return self.db_pool.dict_cursor()

    def cursor(self, *args, **kwargs):
        return self.db_pool.cursor(*args, **kwargs)

    def get(self, case_id: str, company_id: str) -> case_model.Case:
        sql = """
            select
                id,
                case_id,
                company_id,
                name,
                location_id,
                created_at,
                updated_at
            from cases
            where case_id = %(case_id)s and company_id = %(company_id)s;
        """

        with self.db_pool.dict_cursor() as cursor:
            cursor.execute(sql, {"case_id": case_id, "company_id": company_id})
            r = cursor.fetchone()

        return case_model.Case(**r) if r else None

    def get_by_id(self, id) -> case_model.Case:
        sql = """
            select
                id,
                case_id,
                company_id,
                name,
                location_id,
                created_at,
                updated_at
            from cases
            where id = %(id)s;
        """

        with self.db_pool.dict_cursor() as cursor:
            cursor.execute(sql, {"id": id})
            r = cursor.fetchone()

        return case_model.Case(**r) if r else None

    def upsert(self, case: case_model.Case):
        sql = """
            insert into cases (
                id,
                case_id,
                company_id,
                name,
                location_id,
                created_at,
                updated_at    
            )
            values (
                %(id)s,
                %(case_id)s,
                %(company_id)s,
                %(name)s,
                %(location_id)s,
                %(created_at)s,
                %(updated_at)s
            )
            on conflict (company_id, case_id) do update
            set
                location_id = %(location_id)s,
                updated_at = %(updated_at)s
                ;
        """

        with self.db_pool.cursor() as cursor:
            cursor.execute(sql, case.__dict__)
