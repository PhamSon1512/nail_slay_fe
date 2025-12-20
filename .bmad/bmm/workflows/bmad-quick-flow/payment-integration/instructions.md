# Payment Integration - Quick Flow Workflow

<workflow>

<critical>Read and STRICTLY follow: {bmad_folder}/bmm/data/communication-rules.md</critical>

<critical>Communicate in {communication_language}, tailored to {user_skill_level}</critical>
<critical>Execute continuously until COMPLETE - do not stop for milestones</critical>
<critical>Load resources PROGRESSIVELY - only load what's needed for current step</critical>
<critical>ALWAYS respect {project_context} if it exists - it defines project standards</critical>

<checkpoint-handlers>
  <on-select key="a">Load and execute {advanced_elicitation}, then return</on-select>
  <on-select key="p">Load and execute {party_mode_exec}, then return</on-select>
  <on-select key="t">Load and execute {create_tech_spec_workflow}</on-select>
  <on-select key="q">Load and execute {quick_dev_workflow}</on-select>
</checkpoint-handlers>

<step n="1" goal="Load project context and determine payment platform">

<action>Check if {project_context} exists. If yes, load it - this is your foundational reference for ALL implementation decisions.</action>

<action>Determine payment platform based on user input or requirements:

**SePay** (Vietnamese Market):
- VND currency, bank transfers, VietQR/NAPAS
- Local payment methods (44+ Vietnamese banks)
- Direct bank account monitoring
- Keywords: "SePay", "Vietnamese", "VND", "VietQR", "bank transfer", "NAPAS"

**Polar** (Global SaaS):
- Multi-currency, global tax compliance (Merchant of Record)
- Subscriptions, usage-based billing
- Automated benefits (GitHub, Discord, licenses)
- Keywords: "Polar", "subscription", "SaaS", "global", "benefits", "MoR"

**PayPal** (Global Payments):
- 200+ countries, 25+ currencies
- One-time payments, subscriptions
- Express checkout with PayPal button
- Marketplace payments, payouts
- Keywords: "PayPal", "global", "international", "express checkout"

**Multiple** - User needs hybrid solution
</action>

<ask>Which payment platform do you need?

**[s] SePay** - Vietnamese payments (VietQR, bank transfer, cards)
**[p] Polar** - Global SaaS (subscriptions, usage-based, benefits)
**[y] PayPal** - Global payments (one-time, subscriptions, express checkout)
**[m] Multiple** - Hybrid solution for different markets
**[h] Help me decide** - Compare platforms based on requirements</ask>

<check if="h">
  <action>Ask clarifying questions:
  - Target market? (Vietnam only, global, or hybrid)
  - Business model? (one-time, subscription, usage-based)
  - Payment methods needed? (QR, bank transfer, cards)
  - Need automated benefits? (GitHub access, Discord roles, licenses)
  </action>
  <action>Recommend platform based on answers</action>
</check>

</step>

<step n="2" goal="Identify integration type and load relevant resources">

<action>Based on platform choice, identify specific integration needs:

**Checkout & Payments:**
- Payment form/checkout page
- QR code generation (SePay)
- Embedded checkout (Polar)

**Webhooks:**
- Payment notifications
- Subscription events
- Benefit delivery triggers

**Subscriptions** (Polar, PayPal):
- Lifecycle management
- Upgrades/downgrades
- Trials and billing

**Benefits** (Polar):
- GitHub repository access
- Discord role grants
- License key generation
- File downloads

**Bank Monitoring** (SePay):
- Transaction webhooks
- Virtual accounts
- Order matching

**Express Checkout** (PayPal):
- PayPal button integration
- Guest checkout
- Authorize/Capture flows
</action>

<ask>What do you want to implement?

**[c] Checkout flow** - Payment page, QR codes, checkout links, PayPal button
**[w] Webhook handler** - Payment notifications, event processing
**[u] Subscriptions** - Lifecycle, upgrades, trials (Polar, PayPal)
**[b] Benefits automation** - GitHub, Discord, licenses (Polar)
**[m] Bank monitoring** - Transactions, virtual accounts (SePay)
**[e] Express checkout** - PayPal button, guest checkout
**[f] Full integration** - Complete setup from scratch</ask>

</step>

<step n="3" goal="Load resources and implement">

<action>Load required resources based on selection:

**For SePay:**
1. ALWAYS load first: `{sepay_overview}` (auth setup)
2. For API integration: `{sepay_api}`
3. For SDK usage: `{sepay_sdk}`
4. For webhooks: `{sepay_webhooks}`
5. For QR codes: `{sepay_qr}`
6. For production: `{sepay_best_practices}`

**For Polar:**
1. ALWAYS load first: `{polar_overview}` (auth + MoR concept)
2. For products/pricing: `{polar_products}`
3. For checkout: `{polar_checkouts}`
4. For subscriptions: `{polar_subscriptions}`
5. For webhooks: `{polar_webhooks}`
6. For benefits: `{polar_benefits}`
7. For SDK: `{polar_sdk}`
8. For production: `{polar_best_practices}`

**For PayPal:**
1. ALWAYS load first: `{paypal_overview}` (auth setup)
2. For checkout/orders: `{paypal_api}`
3. For subscriptions: `{paypal_subscriptions}`
4. For webhooks: `{paypal_webhooks}`
5. For SDK: `{paypal_sdk}`
6. For production: `{paypal_best_practices}`
</action>

<action>Implement following Quick Flow methodology:

1. **Spec Phase (30min max)** - What exactly are we building?
   - Endpoints needed
   - Event types to handle
   - Data flow diagram
   
2. **Build Phase** - Vertical slice first!
   - Start with webhook verification (security first)
   - Then payment flow
   - Then event handling
   - Use helper scripts: `{sepay_webhook_verify}`, `{polar_webhook_verify}`, `{paypal_webhook_verify}`, `{checkout_helper}`
   
3. **Ship Phase** - Deploy with feature flag
   - Test in sandbox environment
   - Verify webhook signatures
   - Monitor payment success rate
</action>

<critical>Security Checklist (MANDATORY before commit):
- [ ] Webhook signatures verified (HMAC for SePay, SHA-256 for Polar, RSA for PayPal)
- [ ] API keys in environment variables, NOT in code
- [ ] No sensitive data in logs (card numbers, passwords)
- [ ] HTTPS only for all payment endpoints
- [ ] Idempotency keys for retries (prevent duplicate charges)
- [ ] Rate limiting respected (SePay: 2/s, Polar: 300/min, PayPal: 50/s)
</critical>

</step>

<step n="4" goal="Test and verify">

<action>Test implementation:

**SePay Testing:**
- Sandbox mode với SEPAY_ENV=sandbox
- Test webhook với `node {sepay_webhook_verify} '{payload}'`
- Verify QR code generation
- Test callback URL handling

**Polar Testing:**
- Sandbox mode với POLAR_SERVER=sandbox
- Test webhook với `node {polar_webhook_verify} '{payload}' secret`
- Verify checkout flow
- Test subscription lifecycle

**PayPal Testing:**
- Sandbox mode (api-m.sandbox.paypal.com)
- Test webhook với `node {paypal_webhook_verify} '{payload}' --headers='{...}'`
- Use sandbox test accounts
- Verify order capture flow
</action>

<action>Run verification:
```bash
# Run tests
cd {installed_path}/scripts
npm test
```
</action>

</step>

<step n="5" goal="Complete and document">

<action>Verify all acceptance criteria satisfied</action>

<action>Update environment variables documentation:
```env
# SePay (if used)
SEPAY_MERCHANT_ID=
SEPAY_SECRET_KEY=
SEPAY_ENV=sandbox|production
SEPAY_WEBHOOK_API_KEY=

# Polar (if used)
POLAR_ACCESS_TOKEN=
POLAR_SERVER=sandbox|production
POLAR_WEBHOOK_SECRET=

# PayPal (if used)
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
PAYPAL_WEBHOOK_ID=
```
</action>

<output>**Payment Integration Complete!**

**Platform:** {{platform}}
**Integration Type:** {{integration_type}}
**Files Created/Modified:** {{files_list}}

**Environment Variables Needed:**
{{env_vars}}

**Endpoints Created:**
{{endpoints}}

**Webhook Events Handled:**
{{events}}

**Testing Commands:**
```bash
{{test_commands}}
```

**Production Checklist:**
- [ ] Switch to production credentials
- [ ] Verify webhook URL is publicly accessible
- [ ] Set up monitoring for payment failures
- [ ] Configure error alerting
- [ ] Document rollback procedure

---

**Next Steps:**
- [q] Continue with quick-dev for additional features
- [t] Create tech-spec for payment-related features
</output>

</step>

</workflow>
