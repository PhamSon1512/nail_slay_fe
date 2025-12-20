# Senior Developer Review - Validation Checklist

## 🔧 Setup & Context

- [ ] Story file loaded from `{{story_path}}`
- [ ] Story Status verified as reviewable (review)
- [ ] Epic and Story IDs resolved ({{epic_num}}.{{story_num}})
- [ ] Reference protocols loaded (reception-protocol.md, verification-gates.md)
- [ ] Architecture/standards docs loaded (as available)
- [ ] Tech stack detected and documented

## 🔍 Adversarial Review

- [ ] Acceptance Criteria cross-checked against implementation
- [ ] All tasks marked [x] verified as actually done
- [ ] File List reviewed and validated against git reality
- [ ] Git discrepancies documented (files changed but not in story, vice versa)
- [ ] Tests identified and mapped to ACs; gaps noted
- [ ] Code quality review performed on changed files
- [ ] Security review performed on changed files and dependencies
- [ ] Minimum 3-10 specific issues found (no lazy "looks good" reviews)

## 🚫 Forbidden Responses Check

- [ ] No performative agreement used ("You're absolutely right!", "Great point!")
- [ ] No gratitude expressions ("Thanks for catching that!")
- [ ] All feedback restated technically before implementation
- [ ] Pushback provided with technical reasoning where appropriate

## ✅ Verification Gates

- [ ] All claims have fresh verification evidence
- [ ] No "should"/"probably"/"seems to" without actual verification
- [ ] Test output shows actual pass/fail counts
- [ ] Build command exit codes captured
- [ ] Evidence format: "✅ [claim] - ran `[command]`, output shows [result]"

## 📝 Documentation & Status

- [ ] Outcome decided (Approve/Changes Requested/Blocked)
- [ ] Review notes appended under "Senior Developer Review (AI)"
- [ ] Change Log updated with review entry
- [ ] Status updated according to review outcome
- [ ] Sprint status synced (if sprint tracking enabled)
- [ ] Story saved successfully

_Reviewer: {{user_name}} on {{date}}_
_Protocol: Technical rigor over social comfort. Evidence before claims._
