import axios, { type AxiosInstance, type CancelTokenSource } from "axios";
import useApiLoadingStore from "../zustand-store/apiLoadingStore";

// Determine the correct API base URL based on environment
export const getApiBaseUrl = () => {
  const { hostname, port, protocol } = window.location;

  // 1. Docker Testing Environment (port 8001)
  if (hostname === "localhost" && port === "8001") {
    return "http://localhost:8001/api";
  }

  // 2. Local Development (port 3000 or 5173 for Vite dev server)
  if (
    (hostname === "localhost" || hostname === "192.168.31.15") &&
    (port === "3000" || port === "3001" || port === "5173" || port === "4173")
  ) {
    return "http://localhost:8000/api";
  }

  // 3. Production Environment (https with custom domain)
  if (protocol === "https:" || hostname !== "localhost") {
    // In production, the API is served from the same origin (nginx proxy)
    return `${protocol}//${hostname}${port ? `:${port}` : ""}/api`;
  }

  // 4. Fallback for development
  if (import.meta.env.DEV) {
    return "http://localhost:8000/api";
  }

  // 5. Default fallback
  return "/api";
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL for debugging (only in development)
if (import.meta.env.DEV) {
  // console.log("Public API Base URL:", API_BASE_URL);
}

// Create an Axios instance with default configurations
const publicApiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Map to track pending requests by key (method|url)
interface PendingEntry {
  source: CancelTokenSource;
  timestamp: number;
}
const pendingRequests = new Map<string, PendingEntry>();
const MAX_MAP_SIZE = 100;
const STALE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Periodic cleanup for stale entries
function cleanupStaleRequests() {
  const now = Date.now();
  for (const [key, entry] of pendingRequests.entries()) {
    if (now - entry.timestamp > STALE_TIMEOUT) {
      entry.source.cancel("Canceled due to timeout");
      pendingRequests.delete(key);
      if (import.meta.env.DEV) {
        console.log(`[PublicAPI] Cleaned stale request: ${key}`);
      }
    }
  }
  // Enforce max size
  if (pendingRequests.size > MAX_MAP_SIZE) {
    const entries = Array.from(pendingRequests.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < pendingRequests.size - MAX_MAP_SIZE; i++) {
      const [key, entry] = entries[i];
      entry.source.cancel("Canceled due to max pending limit");
      pendingRequests.delete(key);
      if (import.meta.env.DEV) {
        console.log(`[PublicAPI] Cleaned excess request: ${key}`);
      }
    }
  }
}

// Run cleanup every minute
setInterval(cleanupStaleRequests, 60 * 1000);

// Add loading interceptors
publicApiService.interceptors.request.use(
  (config) => {
    try {
      useApiLoadingStore.getState().startApiCall();

      // Generate unique key: method|url
      const method = config.method?.toUpperCase() || "GET";
      const url = config.url || "";
      const key = `${method}|${url}`;

      // Cancel previous if exists
      if (pendingRequests.has(key)) {
        const previous = pendingRequests.get(key);
        previous?.source.cancel("Canceled due to new request");
        if (import.meta.env.DEV) {
          console.log(`[PublicAPI] Canceled previous request: ${key}`);
        }
      }

      // Create and store new entry
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;
      pendingRequests.set(key, { source, timestamp: Date.now() });

      return config;
    } catch (err) {
      useApiLoadingStore.getState().endApiCall();
      return Promise.reject(err);
    }
  },
  (error) => {
    useApiLoadingStore.getState().endApiCall();
    return Promise.reject(error);
  },
);

publicApiService.interceptors.response.use(
  (response) => {
    useApiLoadingStore.getState().endApiCall();
    const method = response.config.method?.toUpperCase() || "GET";
    const url = response.config.url || "";
    const key = `${method}|${url}`;
    pendingRequests.delete(key);
    return response;
  },
  (error) => {
    useApiLoadingStore.getState().endApiCall();
    const method = error?.config?.method?.toUpperCase() || "GET";
    const url = error?.config?.url || "";
    const key = `${method}|${url}`;
    pendingRequests.delete(key);
    if (axios.isCancel(error)) {
      if (import.meta.env.DEV) {
        console.log(`[PublicAPI] Request canceled: ${key}`);
      }
      return Promise.reject({
        isManualCancelDueToNewRequest: true,
        isCanceled: true,
        message: "Request canceled due to new request",
      });
    }
    return Promise.reject(error);
  },
);

export default publicApiService;
