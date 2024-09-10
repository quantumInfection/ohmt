"""
Contains all Postgres queries that use a connection pool.

The DBPool class uses pessimistic disconnect handling, described here:
    https://docs.sqlalchemy.org/en/latest/core/pooling.html#disconnect-handling-pessimistic

To summarize:
    - Previously, after a DB restart every connection in the pool would throw an error upon access
    - To fix this, emit a ping statement ("SELECT 1;") for every new connection
    - If ping fails, then restart the entire connection pool.
    - This ensures that stale connections are immediately recycled after a DB restart
"""

from psycopg2.extensions import ISOLATION_LEVEL_READ_COMMITTED
from db import db
from .pooler import ConnectionPooler


class DBPool(db.BaseDatabase):
    """
    Handler for Postgres queries managed by connection pooling.
    Initializes DB connection pool upon creation.
    """

    def __init__(self, isolation_level=ISOLATION_LEVEL_READ_COMMITTED, db_pool_name="default"):
        super().__init__()
        self._pool = ConnectionPooler.get_pool(db_pool_name)
        self._conn = self._pool.get_conn()
        self._conn.set_session(isolation_level=isolation_level)

    def close(self):
        """Releases connection back to pool."""
        self._pool.put_conn(self._conn)
        self._pool = None
        self._conn = None


class DbPoolFactory:
    """Db pool factory"""

    @staticmethod
    def build(isolation_level):
        return DBPool(isolation_level=isolation_level)
