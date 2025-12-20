#!/usr/bin/env node
/**
 * PayPal Webhook Signature Verification
 * 
 * Usage:
 *   node paypal-webhook-verify.js '{"event":"..."}' --headers='{"paypal-transmission-id":"..."}'
 *   
 * Environment Variables:
 *   PAYPAL_CLIENT_ID - PayPal Client ID
 *   PAYPAL_SECRET - PayPal Client Secret
 *   PAYPAL_WEBHOOK_ID - Webhook ID from PayPal Dashboard
 *   PAYPAL_API_URL - API URL (default: sandbox)
 */

const crypto = require('crypto');

// Default to sandbox
const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

/**
 * Get PayPal access token
 */
async function getAccessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
        throw new Error('PAYPAL_CLIENT_ID and PAYPAL_SECRET are required');
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * Verify webhook signature using PayPal API
 * @param {string} body - Raw webhook body
 * @param {object} headers - Webhook headers
 * @returns {Promise<{valid: boolean, status: string}>}
 */
async function verifyWebhookSignature(body, headers) {
    if (!PAYPAL_WEBHOOK_ID) {
        throw new Error('PAYPAL_WEBHOOK_ID is required');
    }

    const requiredHeaders = [
        'paypal-auth-algo',
        'paypal-cert-url',
        'paypal-transmission-id',
        'paypal-transmission-sig',
        'paypal-transmission-time',
    ];

    for (const header of requiredHeaders) {
        if (!headers[header]) {
            return {
                valid: false,
                status: 'MISSING_HEADER',
                message: `Missing required header: ${header}`,
            };
        }
    }

    try {
        const accessToken = await getAccessToken();

        const verifyPayload = {
            auth_algo: headers['paypal-auth-algo'],
            cert_url: headers['paypal-cert-url'],
            transmission_id: headers['paypal-transmission-id'],
            transmission_sig: headers['paypal-transmission-sig'],
            transmission_time: headers['paypal-transmission-time'],
            webhook_id: PAYPAL_WEBHOOK_ID,
            webhook_event: typeof body === 'string' ? JSON.parse(body) : body,
        };

        const response = await fetch(
            `${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(verifyPayload),
            }
        );

        const result = await response.json();

        return {
            valid: result.verification_status === 'SUCCESS',
            status: result.verification_status,
            message: result.verification_status === 'SUCCESS'
                ? 'Webhook signature verified'
                : 'Signature verification failed',
        };
    } catch (error) {
        return {
            valid: false,
            status: 'ERROR',
            message: error.message,
        };
    }
}

/**
 * Parse webhook event and extract key information
 * @param {object} event - Parsed webhook event
 * @returns {object} Extracted event info
 */
function parseWebhookEvent(event) {
    const eventInfo = {
        id: event.id,
        type: event.event_type,
        createTime: event.create_time,
        resourceType: event.resource_type,
    };

    const resource = event.resource || {};

    switch (event.event_type) {
        // Orders
        case 'CHECKOUT.ORDER.APPROVED':
        case 'CHECKOUT.ORDER.COMPLETED':
            eventInfo.orderId = resource.id;
            eventInfo.status = resource.status;
            eventInfo.amount = resource.purchase_units?.[0]?.amount;
            break;

        // Captures
        case 'PAYMENT.CAPTURE.COMPLETED':
        case 'PAYMENT.CAPTURE.REFUNDED':
            eventInfo.captureId = resource.id;
            eventInfo.status = resource.status;
            eventInfo.amount = resource.amount;
            break;

        // Subscriptions
        case 'BILLING.SUBSCRIPTION.CREATED':
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
        case 'BILLING.SUBSCRIPTION.SUSPENDED':
        case 'BILLING.SUBSCRIPTION.CANCELLED':
            eventInfo.subscriptionId = resource.id;
            eventInfo.status = resource.status;
            eventInfo.planId = resource.plan_id;
            break;

        // Subscription payments
        case 'PAYMENT.SALE.COMPLETED':
        case 'PAYMENT.SALE.DENIED':
            eventInfo.saleId = resource.id;
            eventInfo.status = resource.state;
            eventInfo.amount = {
                currency_code: resource.amount?.currency,
                value: resource.amount?.total
            };
            eventInfo.billingAgreementId = resource.billing_agreement_id;
            break;

        default:
            eventInfo.resource = resource;
    }

    return eventInfo;
}

/**
 * Create webhook handler for Hono/Express
 */
function createWebhookHandler() {
    return async (c) => {
        const body = await c.req.text();
        const headers = {};

        // Extract PayPal headers
        [
            'paypal-auth-algo',
            'paypal-cert-url',
            'paypal-transmission-id',
            'paypal-transmission-sig',
            'paypal-transmission-time',
        ].forEach(header => {
            headers[header] = c.req.header(header);
        });

        // Verify signature
        const verification = await verifyWebhookSignature(body, headers);

        if (!verification.valid) {
            console.error('Webhook verification failed:', verification);
            return c.json({ error: 'Invalid signature' }, 401);
        }

        // Parse and process event
        const event = JSON.parse(body);
        const eventInfo = parseWebhookEvent(event);

        console.log('Verified PayPal webhook:', eventInfo);

        // Return 200 to acknowledge receipt
        return c.json({ received: true, eventId: event.id }, 200);
    };
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`
PayPal Webhook Verification Tool

Usage:
  node paypal-webhook-verify.js '<webhook_body>' --headers='<headers_json>'

Example:
  node paypal-webhook-verify.js '{"id":"WH-xxx","event_type":"CHECKOUT.ORDER.COMPLETED",...}' \\
    --headers='{"paypal-transmission-id":"xxx","paypal-transmission-sig":"xxx",...}'

Environment Variables Required:
  PAYPAL_CLIENT_ID    - PayPal Client ID
  PAYPAL_SECRET       - PayPal Client Secret  
  PAYPAL_WEBHOOK_ID   - Webhook ID from Dashboard
  PAYPAL_API_URL      - API URL (optional, defaults to sandbox)
`);
        process.exit(0);
    }

    // Parse arguments
    const body = args[0];
    let headers = {};

    for (const arg of args.slice(1)) {
        if (arg.startsWith('--headers=')) {
            try {
                headers = JSON.parse(arg.replace('--headers=', ''));
            } catch (e) {
                console.error('Invalid headers JSON');
                process.exit(1);
            }
        }
    }

    // Run verification
    (async () => {
        try {
            console.log('Verifying PayPal webhook...\n');

            // Parse event first
            const event = JSON.parse(body);
            const eventInfo = parseWebhookEvent(event);
            console.log('Event Info:', JSON.stringify(eventInfo, null, 2));

            // Verify if credentials available
            if (PAYPAL_CLIENT_ID && PAYPAL_SECRET && PAYPAL_WEBHOOK_ID) {
                const result = await verifyWebhookSignature(body, headers);
                console.log('\nVerification Result:', JSON.stringify(result, null, 2));
            } else {
                console.log('\nSkipping signature verification (credentials not set)');
                console.log('Set PAYPAL_CLIENT_ID, PAYPAL_SECRET, and PAYPAL_WEBHOOK_ID to verify');
            }
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    })();
}

module.exports = {
    verifyWebhookSignature,
    parseWebhookEvent,
    createWebhookHandler,
    getAccessToken,
};
