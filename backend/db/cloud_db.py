import os

import psycopg2.extras as pg_extras
import psycopg2.pool as pg_pool


class ConnectionManager:
    def __init__(self):
        self.connection_pool = None

    def initialize_pool(self):
        self.connection_pool = pg_pool.SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            dbname=os.environ.get("POSTGRES_DB_NAME"),
            user=os.environ.get("POSTGRES_DB_USERNAME"),
            password=os.environ.get("POSTGRES_DB_PASSWORD"),
            host=os.environ.get("POSTGRES_DB_HOST"),
            port=os.environ.get("POSTGRES_DB_PORT"),
        )

    def get_connection(self):
        if not self.connection_pool:
            self.initialize_pool()
        return self.connection_pool.getconn()

    def return_connection(self, conn):
        self.connection_pool.putconn(conn)

    def close_pool(self):
        if self.connection_pool:
            self.connection_pool.closeall()


class CloudDB:
    def __init__(self):
        self.connection_manager = ConnectionManager()

    def __enter__(self):
        self.conn = self.connection_manager.get_connection()
        self.cursor = self.conn.cursor(cursor_factory=pg_extras.DictCursor)
        return self.cursor

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            # Rollback if an exception occurred
            self.conn.rollback()
        else:
            # Commit if no exceptions occurred
            self.conn.commit()

        # Close the cursor and return the connection to the pool
        self.cursor.close()
        self.connection_manager.return_connection(self.conn)
