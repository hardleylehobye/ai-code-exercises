"""Tests for Factory-based database connections: same behavior as original."""
import sys
import io
import unittest
from database_FACTORY import create_connection, MySQLConnection, MongoDBConnection


class TestDatabaseFactory(unittest.TestCase):
    def test_mysql_connection_string(self):
        conn = create_connection(
            db_type='mysql',
            host='localhost',
            port=3306,
            username='db_user',
            password='password123',
            database='app_db',
            use_ssl=True
        )
        self.assertIsInstance(conn, MySQLConnection)
        s = conn.build_connection_string()
        self.assertIn('mysql://', s)
        self.assertIn('db_user', s)
        self.assertIn('app_db', s)
        self.assertIn('useSSL=true', s)
        self.assertIn('charset=', s)

    def test_mongodb_connection_string(self):
        conn = create_connection(
            db_type='mongodb',
            host='mongodb.example.com',
            port=27017,
            username='mongo_user',
            password='mongo123',
            database='analytics',
            pool_size=10,
            retry_attempts=5
        )
        self.assertIsInstance(conn, MongoDBConnection)
        s = conn.build_connection_string()
        self.assertIn('mongodb://', s)
        self.assertIn('poolSize=10', s)
        self.assertIn('retryAttempts=5', s)

    def test_unsupported_type_raises(self):
        with self.assertRaises(ValueError) as ctx:
            create_connection(
                db_type='oracle',
                host='h', port=1, username='u', password='p', database='d'
            )
        self.assertIn("Unsupported database type", str(ctx.exception))

    def test_connect_prints_mysql(self):
        buf = io.StringIO()
        old_stdout = sys.stdout
        sys.stdout = buf
        try:
            conn = create_connection(
                db_type='mysql',
                host='localhost',
                port=3306,
                username='u',
                password='p',
                database='d'
            )
            conn.connect()
            out = buf.getvalue()
            self.assertIn("Connecting to mysql", out)
            self.assertIn("MySQL Connection:", out)
            self.assertIn("Connection successful!", out)
        finally:
            sys.stdout = old_stdout


if __name__ == '__main__':
    unittest.main()
