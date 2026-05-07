import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Session expired or invalid credentials
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (status === 403) {
        // Card blocked
        const cardBlockedEvent = new CustomEvent('card-blocked', {
          detail: { message: data?.message || 'Your card is blocked. Please contact your bank.' },
        });
        window.dispatchEvent(cardBlockedEvent);
        return Promise.reject(error);
      }

      if (status === 400) {
        // Validation errors
        const errors = data?.errors || [];
        const message = data?.message || 'An error occurred';
        const apiError = new Error(message) as Error & { errors: string[] };
        apiError.errors = errors;
        return Promise.reject(apiError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
