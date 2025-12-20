# Backend Development Workflow

Production-ready backend development with modern technologies, best practices, and proven patterns.

## When to Use This Workflow

Use when:

- Designing RESTful, GraphQL, or gRPC APIs
- Building authentication/authorization systems
- Optimizing database queries and schemas
- Implementing caching and performance optimization
- OWASP Top 10 security mitigation
- Designing scalable microservices
- Testing strategies (unit, integration, E2E)
- CI/CD pipelines and deployment
- Monitoring and debugging production systems

## Technology Selection Guide

### Languages & Frameworks

| Need                | Language           | Framework       | Why                         |
| ------------------- | ------------------ | --------------- | --------------------------- |
| Fast development    | Node.js/TypeScript | NestJS, Hono    | Full-stack, huge ecosystem  |
| Data/ML integration | Python             | FastAPI, Django | pandas, numpy, scikit-learn |
| High concurrency    | Go                 | Gin, Echo       | Goroutines, lightweight     |
| Max performance     | Rust               | Axum, Actix     | Zero-cost abstractions      |

### Database Selection

| Need              | Choose        | Why                         |
| ----------------- | ------------- | --------------------------- |
| ACID transactions | PostgreSQL    | Strong consistency, SQL     |
| Flexible schema   | MongoDB       | Document-oriented, sharding |
| Caching           | Redis         | In-memory, sub-ms latency   |
| Time series       | TimescaleDB   | PostgreSQL extension        |
| Search            | Elasticsearch | Full-text, analytics        |

### API Style Selection

| Need              | Choose        | Why                     |
| ----------------- | ------------- | ----------------------- |
| Simple CRUD       | REST          | Universal, cacheable    |
| Flexible queries  | GraphQL       | Client-driven, typed    |
| Internal services | gRPC          | Binary, streaming, fast |
| Real-time         | WebSocket/SSE | Bidirectional, events   |

## Reference Navigation

### Core Technologies

- **backend-technologies.md** - Languages, frameworks, databases, message queues, ORMs

### API Design

- **backend-api-design.md** - REST, GraphQL, gRPC patterns and best practices

### Security & Authentication

- **backend-security.md** - OWASP Top 10 2025, security best practices, input validation
- **backend-authentication.md** - OAuth 2.1, JWT, RBAC, MFA, session management

### Performance & Architecture

- **backend-performance.md** - Caching, query optimization, load balancing, scaling
- **backend-architecture.md** - Microservices, event-driven, CQRS, saga patterns

### Quality & Operations

- **backend-testing.md** - Testing strategies, frameworks, tools, CI/CD testing
- **backend-code-quality.md** - SOLID principles, design patterns, clean code
- **backend-debugging.md** - Debugging strategies, profiling, logging, production debugging
- **backend-devops.md** - Docker, Kubernetes, deployment strategies, monitoring
- **backend-mindset.md** - Problem-solving, architectural thinking, collaboration

## Key Best Practices (2025)

### Security

| Practice              | Impact                       |
| --------------------- | ---------------------------- |
| Argon2id passwords    | Most secure hashing          |
| Parameterized queries | 98% SQL injection reduction  |
| OAuth 2.1 + PKCE      | Modern auth standard         |
| Rate limiting         | DDoS protection              |
| Security headers      | XSS, clickjacking prevention |

### Performance

| Practice                | Impact                   |
| ----------------------- | ------------------------ |
| Redis caching           | 90% DB load reduction    |
| Database indexing       | 30% I/O reduction        |
| CDN                     | 50%+ latency cut         |
| Connection pooling      | Resource optimization    |
| Gzip/Brotli compression | 60-80% payload reduction |

### Testing

| Practice          | Ratio |
| ----------------- | ----- |
| Unit tests        | 70%   |
| Integration tests | 20%   |
| E2E tests         | 10%   |
| Coverage target   | 80%+  |

### DevOps

| Practice           | Benefit                 |
| ------------------ | ----------------------- |
| Blue-green/canary  | Zero-downtime deploys   |
| Feature flags      | 90% fewer failures      |
| Kubernetes         | Container orchestration |
| Prometheus/Grafana | Metrics monitoring      |
| OpenTelemetry      | Distributed tracing     |

## Implementation Checklist

### API Development

1. Choose API style (REST/GraphQL/gRPC)
2. Design schema/endpoints
3. Validate all input
4. Add authentication
5. Implement rate limiting
6. Generate documentation
7. Add error handling

### Database Design

1. Choose database type
2. Design schema
3. Create indexes
4. Configure connection pooling
5. Plan migration strategy
6. Set up backup/restore
7. Test performance

### Security Implementation

1. Review OWASP Top 10
2. Use parameterized queries
3. Implement OAuth 2.1 + JWT
4. Add security headers
5. Configure rate limiting
6. Validate all input
7. Use Argon2id for passwords

### Testing Strategy

1. Unit tests (70%)
2. Integration tests (20%)
3. E2E tests (10%)
4. Load tests
5. Migration tests
6. Contract tests (microservices)

### Deployment Pipeline

1. Dockerize application
2. Set up CI/CD
3. Configure blue-green/canary
4. Implement feature flags
5. Add monitoring
6. Configure logging
7. Set up health checks

## Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OAuth 2.1: https://oauth.net/2.1/
- OpenTelemetry: https://opentelemetry.io/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- Clean Architecture: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
