# Payment Integration Checklist

## Platform Selection

- [ ] Target market identified (Vietnamese / Global / Both)
- [ ] Business model confirmed (one-time / subscription / usage-based)
- [ ] Payment methods determined (QR / bank transfer / cards / subscriptions / PayPal)
- [ ] Platform chosen (SePay / Polar / PayPal / Multiple)

## Authentication Setup

### SePay
- [ ] Merchant ID configured
- [ ] API Key / OAuth2 credentials obtained
- [ ] Webhook API Key set
- [ ] Sandbox environment configured for testing

### Polar
- [ ] Access Token generated
- [ ] Organization ID noted
- [ ] Webhook Secret obtained
- [ ] Sandbox mode enabled for testing

### PayPal
- [ ] Client ID obtained
- [ ] Client Secret obtained
- [ ] Webhook ID configured
- [ ] Sandbox environment configured
- [ ] Test accounts created

## Implementation

### Checkout Flow
- [ ] Payment endpoint created
- [ ] QR code generation working (SePay)
- [ ] Checkout link/embed working (Polar)
- [ ] Success/failure redirects configured
- [ ] Error handling implemented

### Webhook Handler
- [ ] Webhook endpoint created
- [ ] Signature verification implemented
- [ ] Event parsing logic complete
- [ ] Idempotency handling (prevent duplicates)
- [ ] Error responses correct (200 OK for processed)

### Subscriptions (Polar, PayPal)
- [ ] Product/pricing defined
- [ ] Subscription creation flow
- [ ] Upgrade/downgrade handling
- [ ] Cancellation flow
- [ ] Trial period handling (if applicable)
- [ ] Billing plan created (PayPal)

### Benefits Automation (Polar)
- [ ] Benefit type selected (GitHub / Discord / License / Files)
- [ ] Delivery logic implemented
- [ ] Revocation handling for cancelled subscriptions

### Bank Monitoring (SePay)
- [ ] Bank account linked
- [ ] Virtual accounts configured (if needed)
- [ ] Transaction matching logic
- [ ] Order reconciliation

### PayPal Checkout
- [ ] Orders API integration
- [ ] PayPal button rendered (frontend)
- [ ] Capture/Authorize flow working
- [ ] Refund handling implemented
- [ ] Express checkout tested

## Security (MANDATORY)

- [ ] Webhook signatures verified
- [ ] API keys in environment variables only
- [ ] No secrets in code or logs
- [ ] HTTPS enforced
- [ ] Rate limits respected
- [ ] Input validation on all endpoints
- [ ] PCI compliance considered (if handling card data)

## Testing

- [ ] Sandbox environment used
- [ ] Test payments successful
- [ ] Webhook delivery verified
- [ ] Error scenarios tested
- [ ] Retry logic verified
- [ ] Helper scripts validated

## Production Readiness

- [ ] Production credentials configured
- [ ] Webhook URL publicly accessible
- [ ] Monitoring dashboards set up
- [ ] Error alerting configured
- [ ] Logging in place (without sensitive data)
- [ ] Rollback procedure documented
- [ ] Team notified of deployment

## Documentation

- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Webhook events documented
- [ ] Error codes documented
- [ ] Troubleshooting guide created
