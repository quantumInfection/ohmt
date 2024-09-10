"""
Connection pooling module
Short tutorial: https://pynative.com/psycopg2-python-postgresql-connection-pooling/
"""

import atexit
import os
import threading

from psycopg2 import OperationalError
from psycopg2.pool import ThreadedConnectionPool

MIN_PG_CONNS = int(os.environ.get("POSTGRES_MIN_POOL_CONNS", 2))
MAX_PG_CONNS = int(os.environ.get("POSTGRES_MAX_POOL_CONNS", 5))
MAX_PG_CONNECT_RETRIES = int(os.environ.get("POSTGRES_MAX_CONN_RETRIES", 5))


class Pool:
    """
    Represents a psycopg2 connection pool
    """

    def __init__(self, min_pg_conns=MIN_PG_CONNS, max_pg_conns=MAX_PG_CONNS, **conn_args):
        self.min_pg_conns = min_pg_conns
        self.max_pg_conns = max_pg_conns
        self.conn_args = self._get_args(**conn_args)
        self.pool = None
        self.pool_lock = threading.Lock()

    def close_all_conns(self):
        """Close all connections if there is a pool"""
        with self.pool_lock:
            if not self.pool:
                return
            self.pool.closeall()
            self.pool = None

    def get_pool(self):
        """Returns the underlying pool, creates one if necessary"""
        with self.pool_lock:
            pool = self.pool
            if not pool:
                pool = ThreadedConnectionPool(
                    self.min_pg_conns, self.max_pg_conns, **self.conn_args
                )
                self.pool = pool
        return pool

    def put_conn(self, conn):
        """Return connection to pool"""
        self.get_pool().putconn(conn)

    def get_conn(self):
        """Retrieve a connection from the pool"""
        for _ in range(MAX_PG_CONNECT_RETRIES):  # Cycle through conns until we find an open one
            # acquire the pool inside the loop so that new pools are tried as they are created.
            pool = self.get_pool()
            conn = pool.getconn()

            if self._conn_is_closed(conn):
                self.close_all_conns()
                continue

            return conn
        raise Exception("No open connection available")

    @staticmethod
    def _conn_is_closed(conn) -> bool:
        """Verify connection health"""
        if conn.closed != 0:
            return True
        try:
            with conn.cursor() as curs:
                curs.execute("SELECT 1;")
            conn.commit()
            return False
        except OperationalError:
            return True

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
        env_args = {k: v for k, v in Pool._get_env_args().items() if v}
        env_args.update(kwargs)

        return env_args


class ConnectionPooler:
    """
    Connection pooler is a singleton which can hold connection pools to
    multiple databases identified by `pool_name`.
    Each pool can have it's own set of parameteres.
    """

    _pools = {}
    _pool_lock = threading.Lock()

    @classmethod
    def get_pool(cls, pool_name="default") -> Pool:
        """Retrives a connection FROM the pool"""
        with cls._pool_lock:
            return cls._pools[pool_name]

    @classmethod
    def register(cls, pool_name="default", **conn_args):
        """Creates a pool with a given name"""
        with cls._pool_lock:
            cls._pools[pool_name] = Pool(**conn_args)

    @staticmethod
    @atexit.register
    def _close_all_pools():
        with ConnectionPooler._pool_lock:
            for k in ConnectionPooler._pools:
                ConnectionPooler._pools[k].close_all_conns()


ConnectionPooler.register("default")
