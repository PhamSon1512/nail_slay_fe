# Database Operations Checklist

## Database Selection

- [ ] Use case identified (transactional, analytical, content, IoT, etc.)
- [ ] Schema flexibility requirements assessed
- [ ] Scaling requirements determined (vertical vs horizontal)
- [ ] Team expertise considered
- [ ] Database type selected (MongoDB or PostgreSQL)

## Schema Design

- [ ] Data model designed appropriately for database type
- [ ] Relationships properly defined (embedded vs referenced / normalized vs denormalized)
- [ ] Primary keys and unique constraints defined
- [ ] Indexes planned for query patterns
- [ ] Data types chosen appropriately

## Query Optimization

- [ ] Queries use indexes effectively
- [ ] Query execution plan analyzed (EXPLAIN / explain())
- [ ] No unnecessary full table/collection scans
- [ ] Projections used to limit returned fields
- [ ] Aggregations/joins optimized

## Indexing

- [ ] Frequently queried fields indexed
- [ ] Compound indexes for multi-field queries
- [ ] Index size and memory usage considered
- [ ] Unused indexes identified and removed
- [ ] Index maintenance scheduled

## Migrations

- [ ] Migration files generated with proper naming
- [ ] Up and down (rollback) scripts defined
- [ ] Migrations tested in non-production environment
- [ ] Migration history tracked
- [ ] Rollback plan documented

## Performance

- [ ] Slow queries identified and optimized
- [ ] Connection pooling configured (if applicable)
- [ ] Query caching implemented where beneficial
- [ ] Database monitoring in place
- [ ] Performance baselines established

## Security

- [ ] Authentication enabled
- [ ] User roles and permissions properly configured
- [ ] TLS/SSL enabled for connections
- [ ] Network access restricted
- [ ] Sensitive data encrypted at rest

## Backup & Recovery

- [ ] Backup strategy defined (full, incremental, point-in-time)
- [ ] Backup schedule configured
- [ ] Backup storage secured
- [ ] Recovery procedure documented
- [ ] Recovery tested periodically

## High Availability

- [ ] Replication configured (if required)
- [ ] Failover procedure documented
- [ ] Sharding configured (if required for MongoDB)
- [ ] Read replicas configured (if required for PostgreSQL)
- [ ] Health monitoring in place

## Maintenance

- [ ] VACUUM/ANALYZE scheduled (PostgreSQL)
- [ ] Collection compaction planned (MongoDB)
- [ ] Log rotation configured
- [ ] Disk space monitoring in place
- [ ] Version upgrade path planned
