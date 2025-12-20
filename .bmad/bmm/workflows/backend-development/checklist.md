# Backend Development Checklist

## Technology Selection

- [ ] Use case identified (API, microservice, data processing, etc.)
- [ ] Language selected based on team expertise and requirements
- [ ] Framework chosen (NestJS, FastAPI, Gin, Axum, etc.)
- [ ] Database type selected (SQL vs NoSQL)
- [ ] API style determined (REST, GraphQL, gRPC)

## API Design

- [ ] API style appropriate for use case
- [ ] Endpoints/schema follow RESTful/GraphQL conventions
- [ ] Request/response schemas defined
- [ ] API versioning strategy implemented
- [ ] Pagination implemented for list endpoints
- [ ] Error response format standardized
- [ ] API documentation generated (OpenAPI/GraphQL schema)

## Authentication & Authorization

- [ ] OAuth 2.1/OIDC implemented for auth
- [ ] JWT tokens with appropriate expiry
- [ ] PKCE flow for public clients
- [ ] Refresh token rotation enabled
- [ ] RBAC/ABAC permissions defined
- [ ] Session management secure
- [ ] MFA support if required

## Security (OWASP Top 10)

- [ ] Input validation on all endpoints
- [ ] Parameterized queries (no SQL injection)
- [ ] XSS prevention (output encoding)
- [ ] CSRF tokens for state-changing requests
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Rate limiting implemented
- [ ] Secrets not in code (use env vars/vault)
- [ ] Dependencies scanned for vulnerabilities
- [ ] Password hashing with Argon2id/bcrypt
- [ ] HTTPS enforced

## Database

- [ ] Schema designed for query patterns
- [ ] Indexes created for frequent queries
- [ ] Connection pooling configured
- [ ] Migrations versioned and tested
- [ ] Backup strategy defined
- [ ] Query performance tested

## Performance

- [ ] Caching strategy implemented (Redis, etc.)
- [ ] Database queries optimized
- [ ] Response compression enabled (gzip/brotli)
- [ ] CDN configured for static assets
- [ ] N+1 query problems resolved
- [ ] Lazy loading where appropriate
- [ ] Load testing completed

## Testing

- [ ] Unit tests (70% target)
- [ ] Integration tests (20% target)
- [ ] E2E tests (10% target)
- [ ] Overall coverage ≥80%
- [ ] Tests deterministic (no flakes)
- [ ] Contract tests for microservices
- [ ] Load/stress tests for critical paths
- [ ] Security tests (SAST/DAST)

## Code Quality

- [ ] SOLID principles followed
- [ ] Design patterns appropriate
- [ ] Clean code practices
- [ ] Linting passes (zero warnings)
- [ ] TypeScript strict mode (if applicable)
- [ ] No console.log/debug statements
- [ ] Self-documenting code
- [ ] Comments for complex logic

## Error Handling

- [ ] Global error handler implemented
- [ ] Errors logged with context
- [ ] User-friendly error messages
- [ ] Stack traces hidden in production
- [ ] Error codes standardized
- [ ] Retry logic for transient failures
- [ ] Circuit breaker for dependencies

## Logging & Monitoring

- [ ] Structured logging (JSON format)
- [ ] Log levels appropriate (debug, info, warn, error)
- [ ] Request/response logging
- [ ] Correlation IDs for tracing
- [ ] Health check endpoints
- [ ] Metrics exposed (Prometheus format)
- [ ] Alerting configured

## DevOps & Deployment

- [ ] Dockerfile created and optimized
- [ ] CI pipeline configured
- [ ] CD pipeline with staging environment
- [ ] Blue-green or canary deployment
- [ ] Feature flags for risky features
- [ ] Rollback procedure documented
- [ ] Secrets managed securely
- [ ] Environment-specific configs

## Documentation

- [ ] API documentation complete
- [ ] README with setup instructions
- [ ] Architecture decisions documented
- [ ] Runbook for operations
- [ ] Postman/Insomnia collection
- [ ] Changelog maintained

## Scalability

- [ ] Stateless design (horizontal scaling)
- [ ] Database read replicas if needed
- [ ] Queue for async processing
- [ ] Auto-scaling configured
- [ ] Load balancer configured
- [ ] Resource limits defined
