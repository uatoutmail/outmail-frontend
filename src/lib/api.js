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
    // Anything that is our fault takes over the whole page (OUT-205). A 5xx is
    // the server admitting it failed; a missing response means we never
    // reached it at all — backend down, DNS, or the user is offline. Either
    // way the app cannot work, and saying so once is kinder than letting them
    // discover it one failed action at a time.
    //
    // 4xx is deliberately excluded: 401 means sign in, 404 means wrong URL,
    // 400 means the request was wrong. Those are about the user's own action,
    // our own copy already describes them, and blanking the app for a
    // validation error would be absurd.
    //
    // A request can opt out with `{ quiet: true }`. That is for calls made on
    // public marketing pages, which must degrade in place rather than blank a
    // page that mostly needs no backend at all: the anonymous /api/user/me
    // bootstrap, the pricing fetch, the newsletter and the contact form all
    // have their own local error handling. Without this, a single backend
    // blip took down the entire marketing site — including the privacy policy,
    // which is static text.
    const status = error?.response?.status;
    const ourFault = !error?.response || status >= 500;
    const quiet = error?.config?.quiet === true;
    if (ourFault && !quiet && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('outmail:service-unavailable'));
    }
    return Promise.reject(error);
  }
);