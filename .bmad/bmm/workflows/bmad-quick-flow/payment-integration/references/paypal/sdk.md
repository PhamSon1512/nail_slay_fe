# PayPal SDK Usage

PayPal cung cấp official SDKs cho nhiều ngôn ngữ lập trình.

## Node.js - @paypal/paypal-server-sdk

### Installation

```bash
npm install @paypal/paypal-server-sdk
```

### Configuration

```javascript
import { PayPalHttpClient, SandboxEnvironment, LiveEnvironment } from '@paypal/paypal-server-sdk';

const getPayPalClient = () => {
  const environment = process.env.NODE_ENV === 'production'
    ? new LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_SECRET
      )
    : new SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_SECRET
      );

  return new PayPalHttpClient(environment);
};
```

### Create Order

```javascript
import { OrdersCreateRequest } from '@paypal/paypal-server-sdk';

const createOrder = async (orderData) => {
  const client = getPayPalClient();
  const request = new OrdersCreateRequest();
  
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: orderData.currency,
        value: orderData.amount,
      },
    }],
    application_context: {
      return_url: orderData.returnUrl,
      cancel_url: orderData.cancelUrl,
    },
  });

  const response = await client.execute(request);
  return response.result;
};
```

### Capture Order

```javascript
import { OrdersCaptureRequest } from '@paypal/paypal-server-sdk';

const captureOrder = async (orderId) => {
  const client = getPayPalClient();
  const request = new OrdersCaptureRequest(orderId);
  request.requestBody({});

  const response = await client.execute(request);
  return response.result;
};
```

## Alternative: Direct REST API

Nếu không muốn dùng SDK, có thể gọi trực tiếp REST API:

```javascript
// paypal-client.js
export class PayPalClient {
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
    
    return this.accessToken;
  }

  async request(method, path, body = null) {
    const token = await this.getAccessToken();
    
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': crypto.randomUUID(),
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${path}`, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'PayPal API error');
    }

    return response.json();
  }

  // Orders
  async createOrder(orderData) {
    return this.request('POST', '/v2/checkout/orders', orderData);
  }

  async captureOrder(orderId) {
    return this.request('POST', `/v2/checkout/orders/${orderId}/capture`, {});
  }

  async getOrder(orderId) {
    return this.request('GET', `/v2/checkout/orders/${orderId}`);
  }

  // Subscriptions
  async createProduct(productData) {
    return this.request('POST', '/v1/catalogs/products', productData);
  }

  async createPlan(planData) {
    return this.request('POST', '/v1/billing/plans', planData);
  }

  async createSubscription(subscriptionData) {
    return this.request('POST', '/v1/billing/subscriptions', subscriptionData);
  }

  async cancelSubscription(subscriptionId, reason) {
    return this.request(
      'POST',
      `/v1/billing/subscriptions/${subscriptionId}/cancel`,
      { reason }
    );
  }

  // Refunds
  async refundCapture(captureId, amount = null) {
    const body = amount ? { amount } : {};
    return this.request(
      'POST',
      `/v2/payments/captures/${captureId}/refund`,
      body
    );
  }
}

// Usage
const paypal = new PayPalClient();
const order = await paypal.createOrder({
  intent: 'CAPTURE',
  purchase_units: [{ amount: { currency_code: 'USD', value: '10.00' } }],
});
```

## Hono Integration

```javascript
import { Hono } from 'hono';
import { PayPalClient } from './paypal-client';

const app = new Hono();
const paypal = new PayPalClient();

// Create checkout
app.post('/api/checkout', async (c) => {
  const { items, returnUrl, cancelUrl } = await c.req.json();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await paypal.createOrder({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: total.toFixed(2),
        breakdown: {
          item_total: { currency_code: 'USD', value: total.toFixed(2) },
        },
      },
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity.toString(),
        unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
      })),
    }],
    application_context: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      user_action: 'PAY_NOW',
    },
  });

  const approveLink = order.links.find(link => link.rel === 'approve');
  
  return c.json({
    orderId: order.id,
    approveUrl: approveLink.href,
  });
});

// Capture after approval
app.post('/api/checkout/:orderId/capture', async (c) => {
  const { orderId } = c.req.param();
  
  const capture = await paypal.captureOrder(orderId);
  
  if (capture.status === 'COMPLETED') {
    // Fulfill order, send confirmation email, etc.
    return c.json({ success: true, capture });
  }
  
  return c.json({ success: false, status: capture.status }, 400);
});

export default app;
```

## Frontend Integration

### PayPal JavaScript SDK

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>

<div id="paypal-button-container"></div>

<script>
paypal.Buttons({
  createOrder: async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems }),
    });
    const data = await response.json();
    return data.orderId;
  },
  
  onApprove: async (data) => {
    const response = await fetch(`/api/checkout/${data.orderID}/capture`, {
      method: 'POST',
    });
    const result = await response.json();
    
    if (result.success) {
      window.location.href = '/order-success';
    }
  },
  
  onError: (err) => {
    console.error('PayPal error:', err);
    alert('Payment failed. Please try again.');
  },
}).render('#paypal-button-container');
</script>
```

## TypeScript Types

```typescript
interface PayPalOrder {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED';
  intent: 'CAPTURE' | 'AUTHORIZE';
  purchase_units: PurchaseUnit[];
  links: Link[];
}

interface PurchaseUnit {
  reference_id?: string;
  amount: {
    currency_code: string;
    value: string;
    breakdown?: {
      item_total?: Amount;
      shipping?: Amount;
      tax_total?: Amount;
    };
  };
  items?: Item[];
  payments?: {
    captures?: Capture[];
    authorizations?: Authorization[];
  };
}

interface Link {
  href: string;
  rel: string;
  method: string;
}
```
