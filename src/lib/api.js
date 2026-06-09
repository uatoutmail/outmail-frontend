import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add request interceptor for tokens
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add interceptor for authentication handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Helper for campaign API calls
export const createCampaign = async (campaignData) => {
  const response = await api.post('/api/campaigns', campaignData);
  return response.data;
};

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/api/user/me');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const response = await api.put('/api/user', userData);
  return response.data;
};

// ---------------- Payments (Razorpay) ----------------

// Fetch active plans (public)
export const getPlans = async () => {
  const response = await api.get('/api/payments/plans');
  return response.data;
};

// Create a Razorpay order for a plan (auth required)
export const createPaymentOrder = async ({ planId, amount, currency }) => {
  const response = await api.post('/api/payments/orders', { planId, amount, currency });
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
export const startCheckout = async ({ planId, amount, currency, prefill = {} } = {}) => {
  const ok = await loadRazorpayScript();
  if (!ok) throw new Error('Failed to load Razorpay. Check your connection.');

  const order = await createPaymentOrder({ planId, amount, currency });

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