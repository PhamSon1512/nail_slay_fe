# Code Standards and Patterns

> **Project**: {{project_name}}  
> **Version**: {{version}}  
> **Last Updated**: {{date}}  
> **Type**: {{project_type}}

## Overview

This document defines the coding standards, patterns, and best practices identified in this codebase. Following these standards ensures consistency, maintainability, and quality across the project.

---

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [Code Organization](#code-organization)
3. [Design Patterns](#design-patterns)
4. [Error Handling](#error-handling)
5. [Logging Conventions](#logging-conventions)
6. [Testing Standards](#testing-standards)
7. [Documentation Requirements](#documentation-requirements)
8. [Performance Considerations](#performance-considerations)
9. [Security Patterns](#security-patterns)
10. [Common Anti-Patterns to Avoid](#common-anti-patterns-to-avoid)

---

## 1. Naming Conventions

### Files and Directories

**Pattern Observed:**

```
{{file_naming_pattern}}
```

**Rules:**

- **Files**: {{file_naming_rule}} (e.g., `camelCase.ts`, `kebab-case.js`, `PascalCase.tsx`)
- **Directories**: {{directory_naming_rule}} (e.g., `lowercase`, `kebab-case`)
- **Test Files**: {{test_file_pattern}} (e.g., `*.test.ts`, `*.spec.ts`, `__tests__/*.ts`)
- **Config Files**: {{config_file_pattern}} (e.g., `*.config.ts`, `.*.rc`)

**Examples:**

```
{{file_naming_examples}}
```

---

### Variables and Constants

**Pattern Observed:**

```typescript
{
  {
    variable_naming_examples;
  }
}
```

**Rules:**

- **Local Variables**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE` or `camelCase` (depending on context)
- **Private Fields**: `_camelCase` or `#camelCase` (private class fields)
- **Boolean Variables**: Prefix with `is`, `has`, `should`, `can`
  - ✅ `isActive`, `hasPermission`, `shouldRetry`
  - ❌ `active`, `permission`, `retry`

---

### Functions and Methods

**Pattern Observed:**

```typescript
{
  {
    function_naming_examples;
  }
}
```

**Rules:**

- **Functions**: `camelCase` with verb prefix
  - `get*()`, `set*()`, `fetch*()`, `create*()`, `update*()`, `delete*()`
- **Event Handlers**: Prefix with `handle` or `on`
  - `handleClick()`, `onSubmit()`, `handleUserLogin()`
- **Utility Functions**: Descriptive verb + noun
  - `formatCurrency()`, `validateEmail()`, `parseQueryParams()`
- **Async Functions**: Should clearly indicate async nature or return Promise
  - `async fetchUserData()`, `loadResource()`

---

### Classes and Interfaces

**Pattern Observed:**

```typescript
{
  {
    class_naming_examples;
  }
}
```

**Rules:**

- **Classes**: `PascalCase`, noun-based
  - `UserService`, `DatabaseConnection`, `HttpClient`
- **Interfaces**: `PascalCase`, may use `I` prefix if convention
  - `IUserRepository`, `UserRepository`, `ApiResponse`
- **Types**: `PascalCase`
  - `UserProfile`, `ApiConfig`, `ErrorType`
- **Enums**: `PascalCase` for enum, `SCREAMING_SNAKE_CASE` for values
  ```typescript
  enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    GUEST = 'GUEST',
  }
  ```

---

## 2. Code Organization

### Directory Structure

**Current Structure:**

```
{{directory_structure}}
```

**Organizational Patterns:**

{{#if has_feature_based}}

#### Feature-Based Organization

- Each feature in its own directory
- Co-located components, services, and tests

```
src/
  features/
    auth/
      components/
      services/
      hooks/
      tests/
    dashboard/
```

{{/if}}

{{#if has_layer_based}}

#### Layer-Based Organization

- Separation by technical concern

```
src/
  components/
  services/
  utils/
  models/
  hooks/
```

{{/if}}

**Rules:**

- {{organization_rule_1}}
- {{organization_rule_2}}
- {{organization_rule_3}}

---

### File Structure

**Standard File Template:**

```typescript
{
  {
    file_structure_template;
  }
}
```

**Order of Declarations:**

1. Imports (grouped and sorted)
   - External libraries
   - Internal modules
   - Types/interfaces
   - Styles/assets
2. Type definitions
3. Constants
4. Main export (component/function/class)
5. Helper functions (internal)
6. Exports

---

### Import Organization

**Pattern Observed:**

```typescript
{
  {
    import_pattern_examples;
  }
}
```

**Rules:**

- Group imports by type (external → internal → types → assets)
- Use absolute imports for `src/` paths (if configured)
- Avoid circular dependencies
- Use barrel exports (`index.ts`) for cleaner imports

**Example:**

```typescript
// External libraries

// Types
import type { User, UserRole } from '@/types/user';
// Internal modules
import { UserService } from '@/services/UserService';
import { formatDate } from '@/utils/dateUtils';
import axios from 'axios';
import { useEffect, useState } from 'react';
// Styles
import styles from './Component.module.css';
```

---

## 3. Design Patterns

### Patterns Identified in Codebase

{{#each design_patterns}}

#### {{pattern_name}}

**Location:** {{location}}

**Purpose:** {{purpose}}

**Implementation:**

```{{language}}
{{implementation_example}}
```

**When to Use:** {{when_to_use}}

---

{{/each}}

### Common Patterns

{{#if uses_singleton}}

#### Singleton Pattern

Used for: {{singleton_usage}}

```typescript
{
  {
    singleton_example;
  }
}
```

{{/if}}

{{#if uses_factory}}

#### Factory Pattern

Used for: {{factory_usage}}

```typescript
{
  {
    factory_example;
  }
}
```

{{/if}}

{{#if uses_repository}}

#### Repository Pattern

Used for: Data access abstraction

```typescript
{
  {
    repository_example;
  }
}
```

{{/if}}

{{#if uses_dependency_injection}}

#### Dependency Injection

Used for: Service composition and testing

```typescript
{
  {
    di_example;
  }
}
```

{{/if}}

---

## 4. Error Handling

### Error Handling Strategy

**Current Approach:**

```typescript
{
  {
    error_handling_approach;
  }
}
```

### Standards

#### Custom Error Classes

```typescript
{
  {
    custom_error_examples;
  }
}
```

#### Try-Catch Patterns

```typescript
{
  {
    try_catch_examples;
  }
}
```

#### Error Propagation

- {{error_propagation_rule_1}}
- {{error_propagation_rule_2}}

#### API Error Handling

```typescript
{
  {
    api_error_handling_example;
  }
}
```

---

## 5. Logging Conventions

### Logging Levels

**Pattern Observed:**

```typescript
{
  {
    logging_pattern;
  }
}
```

### Standards

- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARN**: Warning messages for recoverable issues
- **ERROR**: Error messages for failures

**Examples:**

```typescript
{
  {
    logging_examples;
  }
}
```

### What to Log

- ✅ Request/response for API calls
- ✅ Important state transitions
- ✅ Error stack traces
- ✅ Performance metrics (when needed)
- ❌ Sensitive data (passwords, tokens, PII)
- ❌ Excessive debug info in production

---

## 6. Testing Standards

### Test File Organization

**Pattern:**

```
{{test_file_pattern}}
```

**Location:**
{{test_location}}

### Test Structure

```typescript
{
  {
    test_structure_example;
  }
}
```

### Naming Conventions

- **Test Files**: `{{test_file_naming}}`
- **Test Suites**: `describe('ComponentName', ...)`
- **Test Cases**: `it('should do something when condition', ...)`

### Coverage Standards

- **Minimum Coverage**: {{min_coverage}}%
- **Critical Paths**: {{critical_coverage}}%
- **Types of Tests**:
  - Unit tests
  - Integration tests
  - {{additional_test_types}}

---

## 7. Documentation Requirements

### Code Comments

**When to Comment:**

- Complex algorithms
- Non-obvious business logic
- Public API methods
- Workarounds and hacks (with explanation)

**When NOT to Comment:**

- Self-explanatory code
- Obvious functionality

### JSDoc/TSDoc Standards

```typescript
{
  {
    jsdoc_example;
  }
}
```

### README Requirements

Each feature/module should have:

- Purpose and overview
- Usage examples
- API documentation (if applicable)
- Dependencies
- Configuration options

---

## 8. Performance Considerations

### Identified Patterns

{{#each performance_patterns}}

#### {{pattern_name}}

- **Location**: {{location}}
- **Optimization**: {{optimization}}
- **Impact**: {{impact}}
  {{/each}}

### Best Practices

- {{performance_practice_1}}
- {{performance_practice_2}}
- {{performance_practice_3}}

### Code Examples

```typescript
// ✅ Good: Memoization for expensive calculations
{
  {
    good_performance_example;
  }
}

// ❌ Bad: Unnecessary re-renders
{
  {
    bad_performance_example;
  }
}
```

---

## 9. Security Patterns

### Authentication & Authorization

**Pattern:**

```typescript
{
  {
    auth_pattern;
  }
}
```

### Input Validation

**Standards:**

```typescript
{
  {
    validation_pattern;
  }
}
```

### Sensitive Data Handling

- ✅ {{security_practice_1}}
- ✅ {{security_practice_2}}
- ❌ {{security_antipattern_1}}
- ❌ {{security_antipattern_2}}

---

## 10. Common Anti-Patterns to Avoid

{{#each antipatterns}}

### ❌ {{antipattern_name}}

**What it is:**
{{description}}

**Why it's bad:**
{{why_bad}}

**Better approach:**

```{{language}}
{{better_approach}}
```

---

{{/each}}

### General Anti-Patterns

- **Magic Numbers**: Use named constants
- **God Objects**: Keep classes focused and single-purpose
- **Callback Hell**: Use async/await or Promises
- **Tight Coupling**: Depend on abstractions, not concretions
- **Premature Optimization**: Profile before optimizing

---

## Enforcement

### Code Quality Tools

{{#if has_linter}}
**Linter**: {{linter_name}}

- Config: `{{linter_config}}`
- Rules: {{linter_rules_count}} active
  {{/if}}

{{#if has_formatter}}
**Formatter**: {{formatter_name}}

- Config: `{{formatter_config}}`
  {{/if}}

{{#if has_type_checker}}
**Type Checker**: {{type_checker}}

- Strict mode: {{strict_mode}}
  {{/if}}

### Pre-commit Hooks

{{#if has_husky}}

- Linting: `{{lint_command}}`
- Testing: `{{test_command}}`
- Type checking: `{{typecheck_command}}`
  {{/if}}

### Code Review Checklist

- [ ] Follows naming conventions
- [ ] Properly organized and structured
- [ ] Uses established design patterns
- [ ] Includes error handling
- [ ] Has appropriate logging
- [ ] Includes tests
- [ ] Documented (where needed)
- [ ] No security vulnerabilities
- [ ] Passes linter and type checks

---

## References

- [Project README](../README.md)
- [Architecture Documentation](./architecture.md)
- [API Contracts](./api-contracts.md)
- [Contributing Guide](./contribution-guide.md)

---

**Note**: This document is auto-generated based on codebase analysis and should be reviewed and updated as patterns evolve.
