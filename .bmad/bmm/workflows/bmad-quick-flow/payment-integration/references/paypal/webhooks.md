# PayPal Webhooks

Webhooks cho phép nhận real-time notifications về các events từ PayPal.

## Setup Webhooks

1. Đăng nhập [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Vào **Apps & Credentials** → Select app
3. Scroll to **Webhooks** → **Add Webhook**
4. Nhập Webhook URL và chọn event types
5. Lưu **Webhook ID** để verify signatures

## Important Event Types

### Orders/Payments
| Event | Description |
|-------|-------------|
| `CHECKOUT.ORDER.APPROVED` | Customer approved order |
| `CHECKOUT.ORDER.COMPLETED` | Order captured successfully |
| `PAYMENT.CAPTURE.COMPLETED` | Payment captured |
| `PAYMENT.CAPTURE.REFUNDED` | Payment refunded |
| `PAYMENT.CAPTURE.DENIED` | Payment denied |

### Subscriptions
| Event | Description |
|-------|-------------|
| `BILLING.SUBSCRIPTION.CREATED` | New subscription created |
| `BILLING.SUBSCRIPTION.ACTIVATED` | Subscription activated |
| `BILLING.SUBSCRIPTION.SUSPENDED` | Subscription paused |
| `BILLING.SUBSCRIPTION.CANCELLED` | Subscription cancelled |
| `BILLING.SUBSCRIPTION.EXPIRED` | Subscription ended |
| `PAYMENT.SALE.COMPLETED` | Recurring payment successful |
| `PAYMENT.SALE.DENIED` | Recurring payment failed |

## Webhook Payload Structure

```json
{
  "id": "WH-xxx",
  "event_version": "1.0",
  "create_time": "2024-01-15T10:30:00.000Z",
  "resource_type": "checkout-order",
  "event_type": "CHECKOUT.ORDER.APPROVED",
  "summary": "An order has been approved by buyer",
  "resource": {
    "id": "ORDER_ID",
    "status": "APPROVED",
    "purchase_units": [...]
  },
  "links": [...]
}
```

## Webhook Handler

```javascript
import { Hono } from 'hono';
import crypto from 'crypto';

const app = new Hono();

app.post('/webhooks/paypal', async (c) => {
  const body = await c.req.text();
  const headers = c.req.header();

  // 1. Verify webhook signature
  const isValid = await verifyWebhookSignature(body, headers);
  if (!isValid) {
    console.error('Invalid webhook signature');
    return c.json({ error: 'Invalid signature' }, 401);
  }

  // 2. Parse event
  const event = JSON.parse(body);

  // 3. Handle event (idempotent)
  try {
    await handlePayPalEvent(event);
    return c.json({ received: true }, 200);
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Processing failed' }, 500);
  }
});

const handlePayPalEvent = async (event) => {
  const { event_type, resource } = event;

  switch (event_type) {
    // Orders
    case 'CHECKOUT.ORDER.APPROVED':
      await handleOrderApproved(resource);
      break;
    case 'CHECKOUT.ORDER.COMPLETED':
      await handleOrderCompleted(resource);
      break;

    // Subscriptions
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      await handleSubscriptionActivated(resource);
      break;
    case 'BILLING.SUBSCRIPTION.CANCELLED':
      await handleSubscriptionCancelled(resource);
      break;
    case 'PAYMENT.SALE.COMPLETED':
      await handleRecurringPayment(resource);
      break;

    default:
      console.log(`Unhandled event: ${event_type}`);
  }
};
```

## Signature Verification

### Option 1: API Verification (Recommended)

```javascript
const verifyWebhookSignature = async (body, headers) => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(body),
      }),
    }
  );

  const result = await response.json();
  return result.verification_status === 'SUCCESS';
};
```

### Option 2: Local Verification (Faster)

```javascript
const crypto = require('crypto');

const verifyWebhookSignatureLocal = async (body, headers) => {
  const transmissionId = headers['paypal-transmission-id'];
  const transmissionTime = headers['paypal-transmission-time'];
  const certUrl = headers['paypal-cert-url'];
  const transmissionSig = headers['paypal-transmission-sig'];
  const authAlgo = headers['paypal-auth-algo'];

  // 1. Fetch PayPal certificate
  const certResponse = await fetch(certUrl);
  const cert = await certResponse.text();

  // 2. Build expected signature string
  const expectedSig = `${transmissionId}|${transmissionTime}|${process.env.PAYPAL_WEBHOOK_ID}|${crypto.createHash('crc32').update(body).digest('hex')}`;

  // 3. Verify using certificate
  const verify = crypto.createVerify(authAlgo);
  verify.update(expectedSig);
  
  return verify.verify(cert, transmissionSig, 'base64');
};
```

## Required Headers

| Header | Description |
|--------|-------------|
| `paypal-transmission-id` | Unique webhook ID |
| `paypal-transmission-time` | Timestamp |
| `paypal-transmission-sig` | Signature |
| `paypal-cert-url` | Certificate URL |
| `paypal-auth-algo` | Algorithm (SHA256withRSA) |

## Retry Policy

PayPal retries failed webhooks:
- Immediate retry
- After 1 hour
- After 12 hours
- After 24 hours
- Up to 3 days total

**Respond with 2xx** to acknowledge successful processing.

## Idempotency

```javascript
const processedEvents = new Map(); // Use Redis in production

const handlePayPalEvent = async (event) => {
  const eventId = event.id;

  // Check if already processed
  if (processedEvents.has(eventId)) {
    console.log(`Event ${eventId} already processed`);
    return;
  }

  // Process event...
  
  // Mark as processed
  processedEvents.set(eventId, Date.now());
};
```

## Testing Webhooks

### Webhook Simulator
1. PayPal Dashboard → Webhooks → Webhook Simulator
2. Select event type
3. Send test webhook

### Local Testing with ngrok
```bash
ngrok http 3000
# Use ngrok URL as webhook endpoint
```

## Best Practices

1. **Always verify signatures** - Never trust unverified webhooks
2. **Respond quickly** - Return 200 within 30 seconds
3. **Process async** - Queue heavy processing for background jobs
4. **Implement idempotency** - Handle duplicate deliveries
5. **Log everything** - Keep audit trail for debugging
6. **Monitor failures** - Alert on verification failures
