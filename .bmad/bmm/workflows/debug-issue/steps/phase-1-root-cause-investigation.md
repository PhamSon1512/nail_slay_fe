# Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix, complete this phase entirely.**

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If haven't completed Phase 1, cannot propose fixes.

## Steps

### 1.1 Read Error Messages Carefully

- Don't skip past errors/warnings
- Read stack traces completely
- Note exact error text and codes

### 1.2 Reproduce Consistently

- Can trigger reliably?
- Document exact steps
- If not reproducible → gather more data first

### 1.3 Check Recent Changes

What changed recently?

- Git diff
- Recent commits
- New dependencies
- Config changes
- Environment changes

### 1.4 Gather Evidence in Multi-Component Systems

For EACH component boundary:

- Log data entering/exiting
- Verify environment propagation
- Run once to gather evidence showing WHERE it breaks
- THEN analyze to identify failing component

### 1.5 Trace Data Flow

Where does bad value originate?

- Trace up call stack until finding source
- Ask: "What called this? What value was passed?"
- Keep tracing backward until finding original trigger

## Root Cause Tracing Technique

When error happens deep in execution:

```
1. Observe the Symptom
   Error: [exact error message]

2. Find Immediate Cause
   What code directly causes this?

3. Ask: What Called This?
   Trace the call chain backward

4. Keep Tracing Up
   What value was passed?
   Where did it come from?

5. Find Original Trigger
   The source where invalid data originated
```

### Adding Stack Traces

When can't trace manually:

```typescript
// Add instrumentation
const stack = new Error().stack;
console.error('DEBUG point:', {
  variable,
  cwd: process.cwd(),
  stack,
});
```

**Critical:** Use `console.error()` in tests (not logger - may not show)

**Run and capture:**

```bash
npm test 2>&1 | grep 'DEBUG point'
```

**Analyze stack traces:**

- Look for test file names
- Find line number triggering call
- Identify pattern (same test? same parameter?)

## Finding Which Test Causes Pollution

If something appears during tests but don't know which test:

Use bisection script: `scripts/find-polluter.sh`

```bash
./scripts/find-polluter.sh '.git' 'src/**/*.test.ts'
```

Runs tests one-by-one, stops at first polluter.

## Real Example

**Symptom:** `.git` created in `packages/core/` (source code)

**Trace chain:**

1. `git init` runs in `process.cwd()` ← empty cwd parameter
2. WorktreeManager called with empty projectDir
3. Session.create() passed empty string
4. Test accessed `context.tempDir` before beforeEach
5. setupCoreTest() returns `{ tempDir: '' }` initially

**Root cause:** Top-level variable initialization accessing empty value

**Fix:** Made tempDir a getter that throws if accessed before beforeEach

## Key Principle

**NEVER fix just where error appears.** Trace back to find original trigger.

When found immediate cause:

- Can trace one level up? → Trace backwards
- Is this the source? → Fix at source
- Then add validation at each layer (see Phase 4)

## Phase 1 Completion Criteria

- [ ] Error messages read completely
- [ ] Issue reproducible consistently
- [ ] Recent changes identified
- [ ] Evidence gathered from each component
- [ ] Data flow traced to source
- [ ] Root cause hypothesis formed with evidence

**Only proceed to Phase 2 when all criteria met.**
