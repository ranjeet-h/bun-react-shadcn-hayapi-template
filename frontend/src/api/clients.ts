import { createClient } from "./generated/client/client.gen";
import apiService from "../services/apiService";
import publicApiService from "../services/publicApiService";

export const privateClient = createClient({
  axios: apiService,
  baseURL: apiService.defaults.baseURL,
});

export const publicClient = createClient({
  axios: publicApiService,
  baseURL: publicApiService.defaults.baseURL,
});
