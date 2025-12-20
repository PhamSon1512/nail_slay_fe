# Database Operations Workflow

Unified guide for working with MongoDB (document-oriented) and PostgreSQL (relational) databases.

## When to Use This Workflow

Use when:

- Designing database schemas and data models
- Writing queries (SQL or MongoDB query language)
- Building aggregation pipelines or complex joins
- Optimizing indexes and query performance
- Implementing database migrations
- Setting up replication, sharding, or clustering
- Configuring backups and disaster recovery
- Managing database users and permissions
- Analyzing slow queries and performance issues
- Administering production database deployments

## Database Selection Guide

### Choose MongoDB When:

| Criteria                 | Description                                    |
| ------------------------ | ---------------------------------------------- |
| Schema flexibility       | Frequent structure changes, heterogeneous data |
| Document-centric         | Natural JSON/BSON data model                   |
| Horizontal scaling       | Need to shard across multiple servers          |
| High write throughput    | IoT, logging, real-time analytics              |
| Nested/hierarchical data | Embedded documents preferred                   |
| Rapid prototyping        | Schema evolution without migrations            |

**Best for:** Content management, catalogs, IoT time series, real-time analytics, mobile apps, user profiles

### Choose PostgreSQL When:

| Criteria              | Description                                  |
| --------------------- | -------------------------------------------- |
| Strong consistency    | ACID transactions critical                   |
| Complex relationships | Many-to-many joins, referential integrity    |
| SQL requirement       | Team expertise, reporting tools, BI systems  |
| Data integrity        | Strict schema validation, constraints        |
| Mature ecosystem      | Extensive tooling, extensions                |
| Complex queries       | Window functions, CTEs, analytical workloads |

**Best for:** Financial systems, e-commerce transactions, ERP, CRM, data warehousing, analytics

### Both Support:

- JSON/JSONB storage and querying
- Full-text search capabilities
- Geospatial queries and indexing
- Replication and high availability
- ACID transactions (MongoDB 4.0+)
- Strong security features

## Quick Reference

### MongoDB Quick Start

```bash
# Connection
mongodb+srv://user:pass@cluster.mongodb.net/db

# Shell
mongosh "mongodb+srv://cluster.mongodb.net/mydb"

# Basic operations
db.users.insertOne({ name: "Alice", age: 30 })
db.users.find({ age: { $gte: 18 } })
db.users.updateOne({ name: "Alice" }, { $set: { age: 31 } })
db.users.deleteOne({ name: "Alice" })
```

### PostgreSQL Quick Start

```bash
# Connect
psql -U postgres -d mydb

# Basic operations
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, age INT);
INSERT INTO users (name, age) VALUES ('Alice', 30);
SELECT * FROM users WHERE age >= 18;
UPDATE users SET age = 31 WHERE name = 'Alice';
DELETE FROM users WHERE name = 'Alice';
```

## Reference Navigation

### MongoDB References

- **mongodb-crud.md** - CRUD operations, query operators, atomic updates
- **mongodb-aggregation.md** - Aggregation pipeline, stages, operators, patterns
- **mongodb-indexing.md** - Index types, compound indexes, performance optimization
- **mongodb-atlas.md** - Atlas cloud setup, clusters, monitoring, search

### PostgreSQL References

- **postgresql-queries.md** - SELECT, JOINs, subqueries, CTEs, window functions
- **postgresql-psql-cli.md** - psql commands, meta-commands, scripting
- **postgresql-performance.md** - EXPLAIN, query optimization, vacuum, indexes
- **postgresql-administration.md** - User management, backups, replication, maintenance

## Utility Scripts

```bash
# Generate migration
python scripts/db_migrate.py --db mongodb --generate "add_user_index"

# Run backup
python scripts/db_backup.py --db postgres --output /backups/

# Check performance
python scripts/db_performance_check.py --db mongodb --threshold 100ms
```

## Key Differences Summary

| Feature        | MongoDB                          | PostgreSQL                                  |
| -------------- | -------------------------------- | ------------------------------------------- |
| Data Model     | Document (JSON/BSON)             | Relational (Tables/Rows)                    |
| Schema         | Flexible, dynamic                | Strict, predefined                          |
| Query Language | MongoDB Query Language           | SQL                                         |
| Joins          | $lookup (limited)                | Native, optimized                           |
| Transactions   | Multi-document (4.0+)            | Native ACID                                 |
| Scaling        | Horizontal (sharding)            | Vertical (primary), Horizontal (extensions) |
| Indexes        | Single, compound, text, geo, etc | B-tree, hash, GiST, GIN, etc                |

## Best Practices

### MongoDB:

- Use embedded documents for 1-to-few relationships
- Reference documents for 1-to-many or many-to-many
- Index frequently queried fields
- Use aggregation pipeline for complex transformations
- Enable authentication and TLS in production
- Use Atlas for managed hosting

### PostgreSQL:

- Normalize schema to 3NF, denormalize for performance
- Use foreign keys for referential integrity
- Index foreign keys and frequently filtered columns
- Use EXPLAIN ANALYZE to optimize queries
- Regular VACUUM and ANALYZE maintenance
- Connection pooling (pgBouncer) for web apps
