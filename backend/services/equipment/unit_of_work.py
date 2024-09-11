from abc import ABC

from psycopg2.extensions import ISOLATION_LEVEL_READ_COMMITTED

from db import db_pool


class AbstractUnitOfWork(ABC):
    def __enter__(self) -> "AbstractUnitOfWork":
        return self

    def __exit__(self, *args):
        pass

    def __call__(self, *args, **kwds):
        return self


DEFAULT_DB_POOL_FACTORY = db_pool.DbPoolFactory()


class DbPoolUnitOfWork(AbstractUnitOfWork):
    """DBPool unit of work class for production"""

    def __init__(
        self,
        db_pool_factory=DEFAULT_DB_POOL_FACTORY,
        isolation_level=ISOLATION_LEVEL_READ_COMMITTED,
    ):
        self._db_pool_factory = db_pool_factory
        self.isolation_level = isolation_level

    def __enter__(self):
        self.db_pool = self._db_pool_factory.build(isolation_level=self.isolation_level)
        self.db_pool.__enter__()
        return super().__enter__()

    def __exit__(self, *args):
        super().__exit__(*args)
        self.db_pool.__exit__(*args)

    def __call__(
        self, isolation_level=ISOLATION_LEVEL_READ_COMMITTED
    ) -> "DbPoolUnitOfWork":
        """
        https://stackoverflow.com/a/61919857/4441060
        NOTE: i wanted to pass the isolation level when we start the "with" block
        because i don't want a caller to forget about setting the isolation level to
        SERIALIZABLE before passing that DbPoolUnitOfWork to a command
        """
        self.isolation_level = isolation_level
        return self
