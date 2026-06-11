import { api } from "./api";

// Fetch active plans (public)
export const getPlans = async () => {
  const response = await api.get('/api/payments/plans');
  return response.data;
};

// Validate a coupon code against a plan (auth required)
export const validateCoupon = async ({ code, planId }) => {
  const response = await api.post('/api/payments/validate-coupon', { code, planId });
  return response.data; // { valid, finalAmount, originalAmount, savings, spotsLeft, error }
};

// Create a Razorpay order for a plan (auth required)
export const createPaymentOrder = async ({ planId, amount, currency, couponCode }) => {
  const response = await api.post('/api/payments/orders', { planId, amount, currency, couponCode });
  return response.data; // { orderId, razorpayOrderId, amount, currency, keyId }
};

// Verify a completed payment's signature (auth required)
export const verifyPayment = async (payload) => {
  const response = await api.post('/api/payments/verify', payload);
  return response.data;
};

// Lazily load the Razorpay Checkout script once.
export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// Full one-time checkout flow: create order -> open Razorpay -> verify.
// `prefill` is optional { name, email }. Returns the verify response on success.
export const startCheckout = async ({ planId, amount, currency, couponCode, prefill = {} } = {}) => {
  const ok = await loadRazorpayScript();
  if (!ok) throw new Error('Failed to load Razorpay. Check your connection.');

  const order = await createPaymentOrder({ planId, amount, currency, couponCode });

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'OutMail',
      description: 'OutMail subscription',
      order_id: order.razorpayOrderId,
      prefill,
      theme: { color: '#6c00ff' },
      handler: async (response) => {
        try {
          const result = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    });
    rzp.on('payment.failed', (resp) => reject(new Error(resp?.error?.description || 'Payment failed')));
    rzp.open();
  });
};
