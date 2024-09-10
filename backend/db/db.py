"""Base class for database connections."""

import os
from typing import Optional

from psycopg2 import connect as db_connect
from psycopg2.extensions import (
    connection as pg_connection,
    cursor as pg_cursor,
    register_adapter,
)
from psycopg2.extras import DictCursor, Json

# Config
SERIALIZATION_ERROR_SLEEP_BASE_TIME = 0.2  # Seconds
SERIALIZATION_ERROR_RETRIES = 4


class BaseDatabase:
    """Base database class."""

    def __init__(self):
        self._conn: Optional[pg_connection] = None  # Will be set by subclasses
        # This will tell psycopg adapter to convert the python dict, automatically to a jsonb
        # object, whenever we mogrify arguments of a query. This means, no need to do
        # %(data)s::json inside out query.
        register_adapter(dict, Json)

    def __enter__(self):
        return self

    def __exit__(self, typ, value, traceback):
        try:
            if typ or value or traceback:
                self.rollback()
            else:
                self.commit()
        # if couldn't commit due to some lock, still do cleanup
        finally:
            self.close()

    @staticmethod
    def _get_env_args() -> dict:
        return {
            "dbname": os.environ.get("POSTGRES_DB_NAME"),
            "user": os.environ.get("POSTGRES_DB_USERNAME"),
            "password": os.environ.get("POSTGRES_DB_PASSWORD"),
            "host": os.environ.get("POSTGRES_DB_HOST"),
            "port": os.environ.get("POSTGRES_DB_PORT"),
        }

    @staticmethod
    def _get_args(**kwargs) -> dict:
        """
        Returns a dictionary of arguments
        If connection parameters are provided as args, then these will override any environment var.
        """
        kwargs = {k: v for k, v in kwargs.items() if v}
        env_args = {k: v for k, v in BaseDatabase._get_env_args().items() if v}
        env_args.update(kwargs)
        return env_args

    def close(self) -> None:
        """Closes database connection."""
        self._conn.close()

    def commit(self) -> None:
        """Commits work."""
        self._conn.commit()

    def rollback(self) -> None:
        """Rollbacks work."""
        self._conn.rollback()

    def conn(self) -> Optional[pg_connection]:
        """Returns the psycopg2 DB connections."""
        return self._conn

    def cursor(self, *args, **kwargs) -> pg_cursor:
        """Returns a cursor to the DB. Caller is responsible for closing the cursor."""
        return self._conn.cursor(*args, **kwargs)

    def dict_cursor(self) -> DictCursor:
        """
        Returns a cursor to the DB with cursor_factory=DictCursor
        With this, you can access column values like this: curs.fetchone()["col1"]
        Instead of: curs.fetchone()[0]
        """
        return self.cursor(cursor_factory=DictCursor)


class Database(BaseDatabase):
    """Class for one-time-only Postgres connections."""

    def __init__(self, **kwargs):
        """
        Establishes DB connection. By default, pulls conn details from environment variables.
        All kwargs are Postgres connection parameters.
        """
        super().__init__()
        self._conn = db_connect(**self._get_args(**kwargs))
