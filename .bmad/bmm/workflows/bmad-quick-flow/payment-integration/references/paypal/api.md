# PayPal Orders API (v2)

Orders API v2 là API chính để xử lý checkout và thanh toán.

## Payment Intents

| Intent | Use Case |
|--------|----------|
| `CAPTURE` | Immediately capture payment after approval |
| `AUTHORIZE` | Hold funds, capture later (up to 29 days) |

## Create Order

```javascript
const createOrder = async (accessToken, orderData) => {
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(), // Idempotency
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderData.orderId,
        amount: {
          currency_code: orderData.currency,
          value: orderData.amount,
          breakdown: {
            item_total: { currency_code: orderData.currency, value: orderData.amount },
          },
        },
        items: orderData.items.map(item => ({
          name: item.name,
          quantity: item.quantity.toString(),
          unit_amount: { currency_code: orderData.currency, value: item.price },
        })),
      }],
      application_context: {
        brand_name: 'Your Store',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: orderData.returnUrl,
        cancel_url: orderData.cancelUrl,
      },
    }),
  });

  return response.json();
};

// Response includes approval_url for redirect
// {
//   id: "ORDER_ID",
//   status: "CREATED",
//   links: [{ rel: "approve", href: "https://www.paypal.com/checkoutnow?token=..." }]
// }
```

## Capture Order

```javascript
const captureOrder = async (accessToken, orderId) => {
  const response = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.json();
};

// Response:
// {
//   id: "ORDER_ID",
//   status: "COMPLETED",
//   purchase_units: [{
//     payments: {
//       captures: [{ id: "CAPTURE_ID", status: "COMPLETED", amount: {...} }]
//     }
//   }]
// }
```

## Authorize Order (Hold Funds)

```javascript
const authorizeOrder = async (accessToken, orderId) => {
  const response = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/authorize`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.json();
};

// Later capture authorization
const captureAuthorization = async (accessToken, authorizationId, amount) => {
  const response = await fetch(
    `${PAYPAL_API_URL}/v2/payments/authorizations/${authorizationId}/capture`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: { currency_code: 'USD', value: amount },
        final_capture: true,
      }),
    }
  );

  return response.json();
};
```

## Get Order Details

```javascript
const getOrder = async (accessToken, orderId) => {
  const response = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );

  return response.json();
};
```

## Refund Capture

```javascript
const refundCapture = async (accessToken, captureId, amount = null) => {
  const body = amount ? {
    amount: { currency_code: 'USD', value: amount },
    note_to_payer: 'Refund for your order',
  } : {};

  const response = await fetch(
    `${PAYPAL_API_URL}/v2/payments/captures/${captureId}/refund`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  return response.json();
};
```

## Order Statuses

| Status | Description |
|--------|-------------|
| `CREATED` | Order created, waiting for approval |
| `SAVED` | Order saved for later |
| `APPROVED` | Buyer approved, ready to capture |
| `VOIDED` | Order cancelled |
| `COMPLETED` | Payment captured successfully |
| `PAYER_ACTION_REQUIRED` | Buyer needs to take action |

## Error Handling

```javascript
// Common error codes
const handlePayPalError = (error) => {
  switch (error.name) {
    case 'INVALID_RESOURCE_ID':
      return 'Order not found';
    case 'ORDER_ALREADY_CAPTURED':
      return 'Payment already processed';
    case 'INSTRUMENT_DECLINED':
      return 'Payment method declined';
    case 'PAYER_CANNOT_PAY':
      return 'Buyer cannot complete payment';
    default:
      return error.message;
  }
};
```
