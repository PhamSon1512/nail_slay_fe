# Phase 4: Implementation

**Fix root cause, not symptom. Complete Phase 3 first.**

## Prerequisites

- [ ] Phase 1 completed (root cause traced)
- [ ] Phase 2 completed (pattern found)
- [ ] Phase 3 completed (hypothesis confirmed)

## Steps

### 4.1 Create Failing Test Case

Before any fix:

- Simplest reproduction possible
- Automated if possible
- MUST have test before fixing

```
RED: Test fails (proves bug exists)
→ Then proceed to fix
```

### 4.2 Implement Single Fix

- Address root cause identified
- ONE change only
- No "while I'm here" improvements
- No refactoring

### 4.3 Verify Fix

- Test passes? (GREEN)
- No other tests broken?
- Issue actually resolved?

### 4.4 Add Defense-in-Depth

**Why Multiple Layers?**

- Single validation: "We fixed bug"
- Multiple layers: "We made bug impossible"

Different layers catch different cases:

- Entry validation catches most bugs
- Business logic catches edge cases
- Environment guards prevent context-specific dangers
- Debug logging helps when other layers fail

Add validation at EVERY layer data passes through:

| Layer          | Purpose                         | Example                     |
| -------------- | ------------------------------- | --------------------------- |
| Entry Point    | Reject invalid input            | Validate not empty, exists  |
| Business Logic | Ensure data makes sense         | Check required fields       |
| Environment    | Prevent context-specific danger | Block dangerous ops in test |
| Debug          | Capture forensics               | Log with stack trace        |

**Example layers:**

```typescript
// Layer 1: Entry validation
if (!workingDirectory || workingDirectory.trim() === '') {
  throw new Error('workingDirectory cannot be empty');
}

// Layer 2: Business logic
if (!projectDir) {
  throw new Error('projectDir required');
}

// Layer 3: Environment guard
if (process.env.NODE_ENV === 'test' && !isInTmpDir(dir)) {
  throw new Error('Refusing dangerous operation in tests');
}

// Layer 4: Debug instrumentation
logger.debug('Operation', { dir, stack: new Error().stack });
```

**Applying the Pattern:**

1. Trace data flow - Where does bad value originate? Where used?
2. Map all checkpoints - List every point data passes through
3. Add validation at each layer - Entry, business, environment, debug
4. Test each layer - Try to bypass layer 1, verify layer 2 catches it

### 4.5 Verification Gate

**Iron Law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

```
1. IDENTIFY: What command proves this claim?
2. RUN: Execute FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm claim?
5. ONLY THEN: Make claim with evidence
```

**Correct format:**

- ✅ `Tests pass - ran npm test, 47/47 passing, 0 failures`
- ❌ "Should pass now" / "Looks correct"

## Verification Requirements

| Claim                 | Requires                      | Not Sufficient                 |
| --------------------- | ----------------------------- | ------------------------------ |
| Tests pass            | Test output: 0 failures       | Previous run, "should pass"    |
| Linter clean          | Linter output: 0 errors       | Partial check, extrapolation   |
| Build succeeds        | Build command: exit 0         | Linter passing, logs look good |
| Bug fixed             | Test original symptom: passes | Code changed, assumed fixed    |
| Regression test works | Red-green cycle verified      | Test passes once               |
| Agent completed       | VCS diff shows changes        | Agent reports "success"        |
| Requirements met      | Line-by-line checklist        | Tests passing                  |

## Verification Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting work over
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse                    | Reality                |
| ------------------------- | ---------------------- |
| "Should work now"         | RUN verification       |
| "I'm confident"           | Confidence ≠ evidence  |
| "Just this once"          | No exceptions          |
| "Linter passed"           | Linter ≠ compiler      |
| "Agent said success"      | Verify independently   |
| "Partial check is enough" | Partial proves nothing |

## Regression Test Verification

```
✅ Correct:
  Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)

❌ Incorrect:
  "I've written regression test" (without red-green verification)
```

## When To Apply Verification

**ALWAYS before:**

- ANY variation of success/completion claims
- ANY expression of satisfaction
- ANY positive statement about work state
- Committing, PR creation, task completion
- Moving to next task
- Delegating to agents

## Phase 4 Completion Criteria

- [ ] Failing test case created first
- [ ] Single fix implemented for root cause
- [ ] Test passes (GREEN)
- [ ] No other tests broken
- [ ] Defense-in-depth validation added at each layer
- [ ] Verification command executed with output included
- [ ] No "should", "probably", "seems" language used

## Final Report Template

```
## Issue
[Brief description]

## Root Cause
[Specific cause with evidence]

## Fix Applied
[What was changed]

## Defense Layers Added
- Layer 1: [Entry validation]
- Layer 2: [Business logic]
- Layer 3: [Environment guard]
- Layer 4: [Debug instrumentation]

## Verification
Command: [exact command]
Output: [actual output]
Result: [pass/fail count]

## Regression Test
- Red (before fix): [test fails]
- Green (after fix): [test passes]
```
