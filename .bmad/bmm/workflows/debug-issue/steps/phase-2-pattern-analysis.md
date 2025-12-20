# Phase 2: Pattern Analysis

**Find pattern before fixing. Complete Phase 1 first.**

## Prerequisites

- [ ] Phase 1 completed
- [ ] Root cause hypothesis formed with evidence

## Steps

### 2.1 Find Working Examples

- Locate similar working code in same codebase
- Find reference implementations
- Identify what works correctly in similar scenarios

### 2.2 Compare Against References

- Read reference implementation COMPLETELY
- Understand fully before applying
- Don't skim - read every line

### 2.3 Identify Differences

List every difference however small:

- Configuration differences
- Environment differences
- Import/dependency differences
- Initialization order differences
- Parameter differences

**Don't assume "that can't matter"** - list it anyway.

### 2.4 Understand Dependencies

What other components, settings, config, environment needed?

- Direct dependencies
- Transitive dependencies
- Environment variables
- Configuration files
- External services

## Pattern Comparison Template

```
Working Example:
- Location: [file path]
- Relevant code: [snippet]
- Configuration: [relevant config]
- Environment: [relevant env]

Broken Code:
- Location: [file path]
- Relevant code: [snippet]
- Configuration: [relevant config]
- Environment: [relevant env]

Differences Found:
1. [Difference 1]
2. [Difference 2]
3. [Difference 3]
...
```

## Common Difference Categories

| Category   | Check For                                           |
| ---------- | --------------------------------------------------- |
| Imports    | Missing, wrong version, wrong path                  |
| Config     | Missing fields, wrong values, wrong env             |
| Init order | Called before dependency ready                      |
| Types      | Wrong type, null/undefined, empty string            |
| Async      | Missing await, race condition, unhandled promise    |
| Paths      | Relative vs absolute, wrong separator, missing dirs |

## Phase 2 Completion Criteria

- [ ] Working examples found
- [ ] Reference implementation read completely
- [ ] All differences listed (however small)
- [ ] Dependencies understood
- [ ] Pattern for fix identified

**Only proceed to Phase 3 when all criteria met.**
