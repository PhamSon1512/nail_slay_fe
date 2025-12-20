# Hono Documentation Reference

This directory contains reference documentation for the Hono Expert Agent.

## Primary Documentation Source

The full Hono documentation is available at:

```
hono-documentation.txt
```

This file contains **13,683 lines** of comprehensive Hono documentation including:

### Content Overview

| Section | Topics |
|---------|--------|
| **Core Concepts** | Hono object, Routing, Context, Middleware |
| **Built-in Middleware** | cors, logger, jwt, bearer-auth, cache, etag, csrf, secure-headers, etc. |
| **Third-party Middleware** | Zod Validator, Valibot, OpenAPI, GraphQL, tRPC |
| **Helpers** | Cookie, HTML, CSS, Factory, Streaming, Testing |
| **Runtime Guides** | Cloudflare Workers, Pages, Bun, Deno, Node.js, AWS Lambda |
| **API Reference** | HonoRequest, Routing patterns, Context methods |
| **Best Practices** | Project structure, Performance, Security |

## How to Use

### For Agent Context Loading
When activating the Hono Expert agent, load this documentation for comprehensive knowledge:

```yaml
knowledge_sources:
  - path: '{project-root}/llms-full.txt'
    description: 'Full Hono Framework Documentation'
    format: 'markdown'
```

### For Specific Lookups
The documentation is organized by topic. Key sections:

- **Lines 1-200**: Overview, features, use cases
- **Lines 200-3000**: Built-in middleware (auth, cache, cors, etc.)
- **Lines 3000-4500**: Helpers (cookie, html, factory, streaming)
- **Lines 4500-8000**: Third-party middleware and adapters
- **Lines 8000-10000**: Runtime-specific guides (Workers, Bun, Deno, Lambda)
- **Lines 10000-13683**: API reference (Hono, Context, HonoRequest, Routing)

## External References

- **Official Docs**: https://hono.dev/
- **GitHub**: https://github.com/honojs/hono
- **Middleware**: https://github.com/honojs/middleware

## Version

This documentation corresponds to Hono v4.x (latest stable).
