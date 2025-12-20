# PayPal Best Practices

## Security

### 1. Never Expose Credentials
```javascript
// ❌ BAD - Credentials in code
const client = new PayPalClient('live_id', 'live_secret');

// ✅ GOOD - Environment variables
const client = new PayPalClient(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
```

### 2. Always Verify Webhooks
```javascript
// ❌ BAD - Trust any request
app.post('/webhook', (req) => {
  processPayment(req.body); // DANGEROUS!
});

// ✅ GOOD - Verify signature first
app.post('/webhook', async (req) => {
  const isValid = await verifyWebhookSignature(req);
  if (!isValid) return res.status(401);
  processPayment(req.body);
});
```

### 3. Use HTTPS Only
```javascript
// Production webhook URL must be HTTPS
const webhookUrl = 'https://yourdomain.com/webhooks/paypal';
```

### 4. Validate Amounts Server-Side
```javascript
// ❌ BAD - Trust client amount
const amount = req.body.clientAmount;

// ✅ GOOD - Calculate server-side
const amount = calculateOrderTotal(cart);
```

## Idempotency

### Use PayPal-Request-Id
```javascript
const createOrder = async (orderData) => {
  const idempotencyKey = `order-${orderData.internalOrderId}`;
  
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'PayPal-Request-Id': idempotencyKey, // Prevents duplicate orders
      // ...
    },
  });
};
```

### Track Processed Events
```javascript
// Redis-based idempotency
const processWebhook = async (event) => {
  const key = `paypal:event:${event.id}`;
  
  // Check if already processed
  const exists = await redis.exists(key);
  if (exists) return { duplicate: true };
  
  // Process and mark as done
  await handleEvent(event);
  await redis.setex(key, 86400 * 7, 'processed'); // 7 days TTL
};
```

## Error Handling

### Comprehensive Error Handler
```javascript
const handlePayPalError = (error) => {
  const errorCode = error.details?.[0]?.issue || error.name;
  
  const errorMessages = {
    // Order errors
    'ORDER_NOT_APPROVED': 'Customer has not approved the payment',
    'ORDER_ALREADY_CAPTURED': 'This order was already paid',
    'ORDER_CANNOT_BE_SAVED': 'Unable to save order',
    
    // Payment errors
    'INSTRUMENT_DECLINED': 'Payment method was declined',
    'PAYER_CANNOT_PAY': 'Customer cannot complete payment',
    'TRANSACTION_REFUSED': 'Transaction was refused',
    
    // Subscription errors
    'SUBSCRIPTION_STATUS_INVALID': 'Cannot perform action on subscription',
    'PLAN_NOT_ACTIVE': 'Subscription plan is not active',
    
    // Auth errors
    'INVALID_CLIENT': 'Invalid API credentials',
    'AUTHENTICATION_FAILURE': 'Authentication failed',
  };

  return {
    code: errorCode,
    message: errorMessages[errorCode] || 'Payment processing failed',
    retry: ['INSTRUMENT_DECLINED', 'PAYER_CANNOT_PAY'].includes(errorCode),
  };
};
```

### Retry Logic
```javascript
const withRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isRetryable = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED']
        .includes(error.code);
      
      if (!isRetryable || i === maxRetries - 1) throw error;
      
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
};
```

## Testing

### Sandbox Test Accounts
| Type | Email | Password |
|------|-------|----------|
| Personal | sb-buyer@personal.example.com | From dashboard |
| Business | sb-merchant@business.example.com | From dashboard |

### Test Card Numbers
| Card | Number | Result |
|------|--------|--------|
| Visa | 4032039317984658 | Success |
| Decline | 4000000000000002 | Declined |

### Mock for Unit Tests
```javascript
// __mocks__/paypal-client.js
export class PayPalClient {
  async createOrder() {
    return {
      id: 'TEST-ORDER-123',
      status: 'CREATED',
      links: [{ rel: 'approve', href: 'https://sandbox.paypal.com/...' }],
    };
  }

  async captureOrder(orderId) {
    return {
      id: orderId,
      status: 'COMPLETED',
      purchase_units: [{
        payments: { captures: [{ id: 'CAPTURE-123', status: 'COMPLETED' }] },
      }],
    };
  }
}
```

## Monitoring

### Key Metrics to Track
```javascript
// Prometheus metrics example
const paymentMetrics = {
  ordersCreated: new Counter('paypal_orders_created_total'),
  ordersCaptured: new Counter('paypal_orders_captured_total'),
  ordersFailed: new Counter('paypal_orders_failed_total'),
  captureLatency: new Histogram('paypal_capture_duration_seconds'),
  webhooksReceived: new Counter('paypal_webhooks_received_total'),
  webhookErrors: new Counter('paypal_webhook_errors_total'),
};

// Usage
const captureOrder = async (orderId) => {
  const timer = paymentMetrics.captureLatency.startTimer();
  try {
    const result = await paypal.captureOrder(orderId);
    paymentMetrics.ordersCaptured.inc();
    return result;
  } catch (error) {
    paymentMetrics.ordersFailed.inc({ reason: error.name });
    throw error;
  } finally {
    timer();
  }
};
```

### Alerting Conditions
- Webhook verification failures > 5/hour
- Payment decline rate > 10%
- API error rate > 1%
- Capture latency > 5 seconds

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Standard API | 50 req/sec |
| Token generation | 2 req/sec per client |

```javascript
// Rate limiter implementation
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
  reservoir: 50,
  reservoirRefreshAmount: 50,
  reservoirRefreshInterval: 1000,
  maxConcurrent: 10,
});

const rateLimitedRequest = limiter.wrap(paypalRequest);
```

## Common Patterns

### Checkout Flow
```
1. Customer adds items to cart
2. Server creates PayPal order (intent=CAPTURE)
3. Redirect customer to PayPal approval URL
4. Customer approves payment
5. PayPal redirects to return_url with token
6. Server captures the order
7. Webhook confirms CHECKOUT.ORDER.COMPLETED
8. Fulfill order
```

### Subscription Flow
```
1. Create Product (one-time setup)
2. Create Plan with billing cycles
3. Customer initiates subscription
4. Redirect to PayPal for approval
5. Customer approves subscription
6. Webhook: BILLING.SUBSCRIPTION.ACTIVATED
7. Monthly: PAYMENT.SALE.COMPLETED webhooks
8. Handle cancellations/suspensions
```

## Environment Variables Checklist

```env
# Required
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_WEBHOOK_ID=

# Optional
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
NODE_ENV=development
```
