"""
Database connections using Factory pattern.
Each DB type has its own connection class; the factory creates the right one from config.
"""

from abc import ABC, abstractmethod


class BaseDatabaseConnection(ABC):
    """Common interface and optional shared constructor logic."""
    def __init__(self, host, port, username, password, database,
                 use_ssl=False, connection_timeout=30, retry_attempts=3,
                 pool_size=5, charset='utf8'):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.database = database
        self.use_ssl = use_ssl
        self.connection_timeout = connection_timeout
        self.retry_attempts = retry_attempts
        self.pool_size = pool_size
        self.charset = charset
        self.connection = None

    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def build_connection_string(self):
        """For testing/logging; subclasses implement their format."""
        pass


class MySQLConnection(BaseDatabaseConnection):
    def build_connection_string(self):
        s = f"mysql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"
        s += f"?charset={self.charset}&connectionTimeout={self.connection_timeout}"
        if self.use_ssl:
            s += "&useSSL=true"
        return s

    def connect(self):
        print("Connecting to mysql database...")
        print(f"MySQL Connection: {self.build_connection_string()}")
        print("Connection successful!")
        return self.connection


class PostgreSQLConnection(BaseDatabaseConnection):
    def build_connection_string(self):
        s = f"postgresql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"
        if self.use_ssl:
            s += "?sslmode=require"
        return s

    def connect(self):
        print("Connecting to postgresql database...")
        print(f"PostgreSQL Connection: {self.build_connection_string()}")
        print("Connection successful!")
        return self.connection


class MongoDBConnection(BaseDatabaseConnection):
    def build_connection_string(self):
        s = f"mongodb://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"
        s += f"?retryAttempts={self.retry_attempts}&poolSize={self.pool_size}"
        if self.use_ssl:
            s += "&ssl=true"
        return s

    def connect(self):
        print("Connecting to mongodb database...")
        print(f"MongoDB Connection: {self.build_connection_string()}")
        print("Connection successful!")
        return self.connection


class RedisConnection(BaseDatabaseConnection):
    def build_connection_string(self):
        return f"{self.host}:{self.port}/{self.database}"

    def connect(self):
        print("Connecting to redis database...")
        print(f"Redis Connection: {self.build_connection_string()}")
        print("Connection successful!")
        return self.connection


# Factory
def create_connection(db_type, host, port, username, password, database,
                      use_ssl=False, connection_timeout=30, retry_attempts=3,
                      pool_size=5, charset='utf8'):
    common = dict(
        host=host, port=port, username=username, password=password, database=database,
        use_ssl=use_ssl, connection_timeout=connection_timeout,
        retry_attempts=retry_attempts, pool_size=pool_size, charset=charset
    )
    builders = {
        'mysql': lambda: MySQLConnection(**common),
        'postgresql': lambda: PostgreSQLConnection(**common),
        'mongodb': lambda: MongoDBConnection(**common),
        'redis': lambda: RedisConnection(**common),
    }
    if db_type not in builders:
        raise ValueError(f"Unsupported database type: {db_type}")
    return builders[db_type]()
