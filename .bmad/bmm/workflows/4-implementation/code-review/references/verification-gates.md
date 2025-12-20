# Verification Gates Protocol

## The Iron Law

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE**

Skip any step = lying, not verifying.

## Gate Function

```
IDENTIFY command → RUN full command → READ output → VERIFY confirms claim → THEN claim
```

## Verification Requirements

| Claim            | Required Evidence               |
| ---------------- | ------------------------------- |
| Tests pass       | Test output shows 0 failures    |
| Build succeeds   | Build command exit 0            |
| Bug fixed        | Test original symptom passes    |
| Requirements met | Line-by-line checklist verified |
| Feature complete | All ACs have evidence           |
| Refactor safe    | All tests still pass            |

## Red Flags - STOP

Immediately stop and verify when you catch yourself:

- Using "should"/"probably"/"seems to"
- Expressing satisfaction before verification
- About to commit without verification
- Trusting agent reports without checking
- ANY wording implying success without running verification

## Before Any Status Claim

```
BEFORE saying "done", "complete", "pass", "works", "fixed":

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (not partial)
3. READ: Actually read the output (not just success indicator)
4. VERIFY: Does output confirm the specific claim?
5. THEN: State claim with evidence reference
```

## Evidence Format

```
✅ "Tests pass - ran `npm test`, output shows 47/47 passing, 0 failures"
✅ "Build succeeds - `npm run build` completed with exit code 0"
✅ "Bug fixed - symptom 'X error on submit' no longer occurs, added regression test"

❌ "Tests should pass"
❌ "The build seems to work"
❌ "I believe it's fixed"
❌ "That looks good"
```

## Common Verification Commands

```bash
# Tests
npm test
npm run test:coverage
npm run test:e2e

# Build
npm run build
npm run lint

# Type checking
npm run typecheck
tsc --noEmit

# Git status
git status --porcelain
git diff --name-only
git log -1 --oneline

# Specific file verification
grep -r "pattern" src/
cat path/to/file | head -20
```

## Integration with Code Review

When completing review fixes:

1. Fix the issue
2. Run relevant verification command
3. Capture output as evidence
4. Then claim "Fixed with evidence: [reference]"

## Anti-Pattern Detection

```
IF you're about to write:
  - "This should work"
  - "That looks correct"
  - "I think it's done"
  - "Everything seems fine"

THEN:
  - DELETE that sentence
  - Run verification command
  - State actual result with evidence
```
