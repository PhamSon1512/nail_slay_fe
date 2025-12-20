# PayPal Integration Overview

PayPal REST API v2 cho phép tích hợp thanh toán toàn cầu với hỗ trợ nhiều loại giao dịch.

## When to Use PayPal

- **Global payments** - 200+ countries, 25+ currencies
- **One-time payments** - Checkout orders with capture/authorize
- **Subscriptions** - Recurring billing, trials, upgrades
- **Marketplace** - Split payments, connected accounts
- **Express checkout** - PayPal button integration

## Authentication

### Get Credentials

1. Đăng ký tại [PayPal Developer](https://developer.paypal.com/)
2. Tạo app trong Dashboard → "Apps & Credentials"
3. Lấy **Client ID** và **Client Secret**

### Environments

| Environment | Base URL | Purpose |
|-------------|----------|---------|
| Sandbox | `https://api-m.sandbox.paypal.com` | Testing |
| Production | `https://api-m.paypal.com` | Live transactions |

### Get Access Token

```javascript
const getAccessToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  const data = await response.json();
  return data.access_token; // Valid for ~9 hours
};
```

## Key APIs

| API | Version | Purpose |
|-----|---------|---------|
| Orders | v2 | Checkout, capture, authorize payments |
| Subscriptions | v1 | Recurring billing, plans, agreements |
| Webhooks | v1 | Real-time event notifications |
| Payments | v2 | Refunds, captures |
| Payouts | v1 | Mass payments, marketplace |

## Rate Limits

- **Standard**: 50 requests/second per client
- **Webhooks**: Auto-retry on failure (up to 3 days)

## SDKs Available

- **JavaScript**: `@paypal/checkout-server-sdk`
- **Node.js**: `@paypal/paypal-server-sdk` (recommended)
- **Python**: `paypalserversdk`
- **PHP**: `paypal/paypal-server-sdk`
- **Java**: `com.paypal.sdk:paypal-server-sdk`

## Environment Variables

```env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_client_secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
PAYPAL_WEBHOOK_ID=your_webhook_id
```

## Quick Start

1. Get credentials from PayPal Developer Dashboard
2. Set up sandbox environment for testing
3. Implement Orders API for checkout
4. Configure webhooks for payment notifications
5. Test with sandbox accounts
6. Switch to production credentials

## Related Guides

- `api.md` - Orders API operations
- `subscriptions.md` - Recurring billing
- `webhooks.md` - Event handling
- `sdk.md` - SDK implementations
- `best-practices.md` - Security and patterns
