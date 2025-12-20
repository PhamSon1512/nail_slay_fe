# Debug Issue Workflow Checklist

## Pre-Investigation

- [ ] Error messages read completely (stack traces included)
- [ ] Issue reproducible consistently
- [ ] Recent changes identified (git diff, new deps, config)
- [ ] Affected components and timeframes documented

## Phase 1: Root Cause Investigation

- [ ] Symptoms and error messages gathered
- [ ] Data flow traced to find source of invalid data
- [ ] Evidence collected (logs, metrics)
- [ ] Component boundaries checked

## Phase 2: Pattern Analysis

- [ ] Working examples found in codebase
- [ ] Reference implementation read completely
- [ ] Differences listed (however small)
- [ ] Dependencies understood

## Phase 3: Hypothesis and Testing

- [ ] Single hypothesis formed with specific reason
- [ ] Minimal change made to test hypothesis
- [ ] Result verified before continuing
- [ ] If failed: new hypothesis formed (not more fixes added)

## Phase 4: Implementation

- [ ] Failing test case created first
- [ ] Single fix implemented for root cause
- [ ] No other tests broken
- [ ] Defense-in-depth validation added at each layer

## Verification

- [ ] Verification command executed (not assumed)
- [ ] Output read completely with exit code checked
- [ ] Evidence included in claim
- [ ] No "should", "probably", "seems to" language used

## Red Flags Check

- [ ] Not thinking "quick fix for now"
- [ ] Not trying random changes
- [ ] Not skipping test creation
- [ ] Not claiming without evidence
- [ ] Less than 3 fix attempts (or architecture questioned)

## Completion Criteria

- [ ] Root cause identified with evidence
- [ ] Fix validated with before/after comparison
- [ ] Regression tests added
- [ ] Defense-in-depth layers implemented
- [ ] All tests passing
