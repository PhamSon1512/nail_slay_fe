# PayPal Subscriptions API

PayPal Subscriptions cho phép tạo recurring billing với plans và billing agreements.

## Concepts

| Term | Description |
|------|-------------|
| **Product** | What you're selling (required for plans) |
| **Plan** | Pricing, billing cycle, trial periods |
| **Subscription** | Active agreement with a customer |

## Create Product

```javascript
const createProduct = async (accessToken, productData) => {
  const response = await fetch(`${PAYPAL_API_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      type: 'SERVICE', // SERVICE, PHYSICAL, DIGITAL
      category: 'SOFTWARE',
    }),
  });

  return response.json();
  // { id: "PROD-xxx", name: "...", ... }
};
```

## Create Plan

```javascript
const createPlan = async (accessToken, planData) => {
  const response = await fetch(`${PAYPAL_API_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify({
      product_id: planData.productId,
      name: planData.name,
      description: planData.description,
      status: 'ACTIVE',
      billing_cycles: [
        // Optional trial
        {
          frequency: { interval_unit: 'DAY', interval_count: 7 },
          tenure_type: 'TRIAL',
          sequence: 1,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: { value: '0', currency_code: 'USD' },
          },
        },
        // Regular billing
        {
          frequency: { interval_unit: 'MONTH', interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 2,
          total_cycles: 0, // 0 = unlimited
          pricing_scheme: {
            fixed_price: { value: planData.price, currency_code: 'USD' },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: { value: '0', currency_code: 'USD' },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  });

  return response.json();
  // { id: "P-xxx", status: "ACTIVE", ... }
};
```

## Frequency Options

| interval_unit | Common Use |
|---------------|------------|
| `DAY` | Daily billing, trials |
| `WEEK` | Weekly subscriptions |
| `MONTH` | Monthly billing |
| `YEAR` | Annual plans |

## Create Subscription

```javascript
const createSubscription = async (accessToken, subscriptionData) => {
  const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify({
      plan_id: subscriptionData.planId,
      start_time: new Date(Date.now() + 60000).toISOString(), // Start in 1 min
      subscriber: {
        name: { given_name: 'John', surname: 'Doe' },
        email_address: subscriptionData.email,
      },
      application_context: {
        brand_name: 'Your SaaS',
        locale: 'en-US',
        user_action: 'SUBSCRIBE_NOW',
        return_url: subscriptionData.returnUrl,
        cancel_url: subscriptionData.cancelUrl,
      },
    }),
  });

  return response.json();
  // { id: "I-xxx", status: "APPROVAL_PENDING", links: [...] }
};
```

## Get Subscription

```javascript
const getSubscription = async (accessToken, subscriptionId) => {
  const response = await fetch(
    `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );

  return response.json();
};
```

## Subscription Statuses

| Status | Description |
|--------|-------------|
| `APPROVAL_PENDING` | Waiting for customer approval |
| `APPROVED` | Customer approved, not yet activated |
| `ACTIVE` | Subscription is active |
| `SUSPENDED` | Temporarily paused |
| `CANCELLED` | Permanently cancelled |
| `EXPIRED` | Billing cycles completed |

## Suspend/Activate/Cancel

```javascript
// Suspend (pause billing)
const suspendSubscription = async (accessToken, subscriptionId, reason) => {
  await fetch(
    `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/suspend`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    }
  );
};

// Activate (resume)
const activateSubscription = async (accessToken, subscriptionId, reason) => {
  await fetch(
    `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/activate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    }
  );
};

// Cancel (permanent)
const cancelSubscription = async (accessToken, subscriptionId, reason) => {
  await fetch(
    `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    }
  );
};
```

## Revise Plan (Upgrade/Downgrade)

```javascript
const reviseSubscription = async (accessToken, subscriptionId, newPlanId) => {
  const response = await fetch(
    `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/revise`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: newPlanId,
        application_context: {
          return_url: 'https://example.com/upgrade-success',
          cancel_url: 'https://example.com/upgrade-cancel',
        },
      }),
    }
  );

  return response.json();
  // Returns approval link for customer to approve plan change
};
```

## List Transactions

```javascript
const getSubscriptionTransactions = async (accessToken, subscriptionId, startDate, endDate) => {
  const params = new URLSearchParams({
    start_time: startDate,
    end_time: endDate,
  });

  const response = await fetch(
    `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/transactions?${params}`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );

  return response.json();
};
```
