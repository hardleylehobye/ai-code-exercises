# Factory Pattern: Database Connections

## What changed

- **Before:** A single `DatabaseConnection` class with `db_type` and a long `if/elif` in `connect()`. All DB-specific options lived in one constructor; adding a new DB type meant another branch and more parameters.
- **After:** A `BaseDatabaseConnection` ABC and one concrete class per DB (`MySQLConnection`, `PostgreSQLConnection`, `MongoDBConnection`, `RedisConnection`). `create_connection(db_type, ...)` is the factory: it picks the right class and constructs it. Each class knows only its own connection string format and options.

## Benefits

- **Maintainability:** Change MySQL connection logic only in `MySQLConnection`; no risk of breaking PostgreSQL.
- **Single responsibility:** Each class handles one DB; the factory handles "which type to create."
- **Extensibility:** Add "sqlite" by implementing `SQLiteConnection` and registering it in the factory; no edits to existing classes.
- **Testability:** Test each connection class in isolation; test the factory with a few `db_type` values and assert the correct class is returned.

## Future changes made easier

- New database type: add a subclass and one line in the factory map.
- Type-specific options (e.g. MongoDB read preference): add to `MongoDBConnection` only.
- Swap implementation (e.g. use a different MySQL driver): change only `MySQLConnection`.
- Configuration-driven creation: factory can read from config and still call `create_connection(db_type, ...)`.
