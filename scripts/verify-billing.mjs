const API = 'https://api.sociobot.in/api/v1/products/podcast-recall-loop';
const maximumAttempts = 64;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function positiveRetryAfter(value) {
  if (!value) return false;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return seconds > 0;
  const date = Date.parse(value);
  return Number.isFinite(date) && date > Date.now();
}

const checkout = await fetch(`${API}/checkout`, { redirect: 'manual' });
assert(checkout.status === 303, `Checkout returned ${checkout.status}, expected 303.`);
const checkoutLocation = checkout.headers.get('location');
assert(Boolean(checkoutLocation), 'Checkout did not provide a redirect location.');
const hostedCheckoutUrl = new URL(checkoutLocation);
assert(
  hostedCheckoutUrl.protocol === 'https:' && hostedCheckoutUrl.hostname === 'checkout.dodopayments.com',
  `Checkout redirected to an unexpected host: ${hostedCheckoutUrl.hostname}.`
);
const hostedCheckout = await fetch(hostedCheckoutUrl, { redirect: 'error' });
assert(hostedCheckout.status === 200, `Hosted checkout returned ${hostedCheckout.status}, expected 200.`);
const hostedCheckoutPage = await hostedCheckout.text();
assert(/Podcast Recall Loop/.test(hostedCheckoutPage), 'Hosted checkout did not show Podcast Recall Loop.');
assert(/(?:USD|\$9\.00)/.test(hostedCheckoutPage), 'Hosted checkout did not show the advertised USD $9 price.');
assert(/one[ _-]?time/i.test(hostedCheckoutPage), 'Hosted checkout did not show one-time billing.');

const statuses = [];
let rateLimit = null;
for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
  const token = `repair-policy-${Date.now()}-${attempt}`;
  const response = await fetch(`${API}/verify?license=${encodeURIComponent(token)}`);
  statuses.push(response.status);
  if (response.status === 429) {
    const retryAfter = response.headers.get('retry-after');
    assert(positiveRetryAfter(retryAfter), `Rate limit returned an invalid Retry-After value: ${retryAfter}`);
    rateLimit = { attempt, retryAfter };
    break;
  }
  assert(response.status === 200, `Verification attempt ${attempt} returned ${response.status}, expected 200 or 429.`);
  const result = await response.json();
  assert(result.valid === false && result.reason === 'invalid', `Verification attempt ${attempt} did not reject the invalid token.`);
}

assert(rateLimit, `No rate limit was observed after ${maximumAttempts} requests.`);
console.log(JSON.stringify({
  checkedAt: new Date().toISOString(),
  checkout: { status: checkout.status, locationPresent: true },
  hostedCheckout: {
    status: hostedCheckout.status,
    productPresent: true,
    usdNineDollarPricePresent: true,
    oneTimeBillingPresent: true
  },
  verification: {
    successfulAllowance: rateLimit.attempt - 1,
    rateLimitStatus: 429,
    retryAfter: rateLimit.retryAfter,
    statuses
  }
}, null, 2));
