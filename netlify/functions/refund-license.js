/**
 * POST /.netlify/functions/refund-license
 * Body: { license_key: string }
 *
 * Proxies a full refund to LemonSqueezy so the LS_API_KEY never ships
 * inside the Electron app binary.
 *
 * Required env var in Netlify dashboard:
 *   LS_API_KEY  — your LemonSqueezy API key (Settings → API)
 */
exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.LS_API_KEY;
  if (!apiKey) {
    console.error('[refund] LS_API_KEY env var is not set');
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  let licenseKey;
  try {
    ({ license_key: licenseKey } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!licenseKey) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'license_key is required' }) };
  }

  const lsHeaders = {
    'Authorization':  `Bearer ${apiKey}`,
    'Accept':         'application/vnd.api+json',
    'Content-Type':   'application/vnd.api+json',
  };

  try {
    // ── Step 1: Validate license → get order ID ───────────────────────────────
    const validateRes = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method:  'POST',
      headers: { Accept: 'application/json' },
      body:    new URLSearchParams({ 
        license_key: licenseKey,
        product_id:  '948697' 
      }),
    });
    const validateData = await validateRes.json();

    if (!validateData.valid && !validateData.license_key) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'License key not found or already invalid' }),
      };
    }

    const orderId = String(validateData.meta?.order_id || '');
    if (!orderId) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'Could not find the order associated with this license' }),
      };
    }

    // ── Step 2: Issue full refund ─────────────────────────────────────────────
    const refundRes = await fetch('https://api.lemonsqueezy.com/v1/refunds', {
      method:  'POST',
      headers: lsHeaders,
      body: JSON.stringify({
        data: {
          type: 'refunds',
          attributes: {},                      // empty = full refund
          relationships: {
            order: { data: { type: 'orders', id: orderId } },
          },
        },
      }),
    });

    if (!refundRes.ok) {
      const errBody = await refundRes.json().catch(() => ({}));
      const detail  = errBody.errors?.[0]?.detail || `HTTP ${refundRes.status}`;
      console.error('[refund] LS refund API error:', detail);
      // Common case: already refunded
      if (detail.toLowerCase().includes('already') || refundRes.status === 422) {
        return {
          statusCode: 400,
          headers: CORS,
          body: JSON.stringify({ error: 'This order has already been refunded.' }),
        };
      }
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: `Refund failed: ${detail}` }),
      };
    }

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ refunded: true }) };

  } catch (err) {
    console.error('[refund] unexpected error:', err?.message);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Network error. Please try again or contact support.' }),
    };
  }
};
