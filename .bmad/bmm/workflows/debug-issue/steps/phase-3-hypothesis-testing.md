# Phase 3: Hypothesis and Testing

**Scientific method. Complete Phase 2 first.**

## Prerequisites

- [ ] Phase 1 completed (root cause traced)
- [ ] Phase 2 completed (pattern found)

## Steps

### 3.1 Form Single Hypothesis

Be specific, not vague:

- ✅ "I think X is root cause because Y" (specific)
- ❌ "It might be something with X" (vague)

**Hypothesis template:**

```
The root cause is: [specific cause]
Evidence supporting this:
1. [Evidence 1]
2. [Evidence 2]
3. [Evidence 3]
```

### 3.2 Test Minimally

- SMALLEST possible change to test hypothesis
- ONE variable at a time
- No "while I'm here" improvements
- No additional changes

### 3.3 Verify Before Continuing

| Result      | Action                 |
| ----------- | ---------------------- |
| Worked      | → Phase 4              |
| Didn't work | → NEW hypothesis       |
| Uncertain   | → Gather more evidence |

**DON'T add more fixes if didn't work.** Form new hypothesis instead.

### 3.4 When Don't Know

- Say "I don't understand X"
- Don't pretend
- Ask for help
- Gather more data

## The Three-Fix Rule

Count: How many fixes tried?

| Attempts | Action                                      |
| -------- | ------------------------------------------- |
| < 3      | If fix fails: Return to Phase 1, re-analyze |
| ≥ 3      | **STOP - Question Architecture**            |

### If 3+ Fixes Failed

Pattern indicates architectural problem:

- Each fix reveals new shared state/coupling elsewhere
- Problem keeps moving around
- Fixes cascade into more issues

**Actions:**

1. STOP attempting fixes
2. Question fundamentals:
   - Is the pattern sound?
   - Is this the wrong architecture?
   - Is there hidden coupling?
3. Discuss with human partner before more fixes

## Hypothesis Log Template

```
Attempt #1:
  Hypothesis: [what you thought]
  Test: [what you did]
  Result: [what happened]
  Learning: [what you learned]

Attempt #2:
  ...
```

## Common Rationalizations (STOP if thinking these)

| Excuse                                     | Reality                                     |
| ------------------------------------------ | ------------------------------------------- |
| "Issue is simple, don't need process"      | Simple issues have root causes too          |
| "Emergency, no time for process"           | Systematic is FASTER than guess-and-check   |
| "Just try this first, then investigate"    | First fix sets pattern. Do right from start |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem         |

## Phase 3 Completion Criteria

- [ ] Single hypothesis formed with specific reason
- [ ] Minimal change tested
- [ ] Result verified
- [ ] Either: Hypothesis confirmed OR new hypothesis formed
- [ ] Less than 3 unsuccessful attempts OR architecture questioned

**Only proceed to Phase 4 when hypothesis confirmed.**
