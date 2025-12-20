# Debug Issue Workflow Instructions

Systematic debugging framework combining root cause investigation, pattern analysis, hypothesis testing, and verification protocols.

## Core Principle

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

Random fixes waste time and create new bugs. Find the root cause, fix at source, validate at every layer, verify before claiming success.

## Workflow Overview

```
Bug → Phase 1: Root Cause Investigation
  → Phase 2: Pattern Analysis
  → Phase 3: Hypothesis and Testing
  → Phase 4: Implementation and Verification
```

## Quick Reference

| Situation              | Action                           |
| ---------------------- | -------------------------------- |
| Error deep in stack    | Use root-cause-tracing technique |
| Found root cause       | Add defense-in-depth validation  |
| About to claim success | Run verification first           |
| Tried 3+ fixes failed  | STOP - question architecture     |

## Red Flags - STOP and Return to Phase 1

If catch yourself thinking:

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "One more fix attempt" (when already tried 2+)

## Human Partner Signals

- "Is that not happening?" - Assumed without verifying
- "Will it show us...?" - Should have added evidence gathering
- "Stop guessing" - Proposing fixes without understanding
- "We're stuck?" (frustrated) - Approach isn't working

## Real-World Impact

| Approach     | Time to Fix | First-Time Fix Rate | New Bugs  |
| ------------ | ----------- | ------------------- | --------- |
| Systematic   | 15-30 min   | 95%                 | Near zero |
| Random fixes | 2-3 hours   | 40%                 | Common    |

## Follow the Phases

Execute each phase completely before proceeding. Load step file for detailed instructions.
