import type { CreateClientConfig } from "./generated/client.gen";
import { createClient } from "./generated/client/client.gen";
import apiService, { getApiBaseUrl } from "../services/apiService";
import publicApiService, { getApiBaseUrl as getPublicApiBaseUrl } from "../services/publicApiService";

const stripApiSuffix = (baseUrl: string) => {
  if (baseUrl === "/api") return "/";
  if (baseUrl.endsWith("/api")) return baseUrl.slice(0, -4) || "/";
  return baseUrl;
};

export const createClientConfig: CreateClientConfig = (config) => ({
  ...(config ?? {}),
  // Use our authenticated Axios instance by default
  axios: apiService,
  baseURL: stripApiSuffix(apiService.defaults.baseURL ?? getApiBaseUrl()),
});

// Helper clients for explicit usage
export const privateClient = createClient({
  axios: apiService,
  baseURL: stripApiSuffix(apiService.defaults.baseURL ?? getApiBaseUrl()),
});

export const publicClient = createClient({
  axios: publicApiService,
  baseURL: stripApiSuffix(
    publicApiService.defaults.baseURL ?? getPublicApiBaseUrl(),
  ),
});
