// Custom client with dynamic base URL to match apiService
import { client as generatedClient } from "./generated/client.gen";
import { getApiBaseUrl } from "../services/apiService";

// Override the base URL dynamically
generatedClient.setConfig({
  baseURL: getApiBaseUrl(),
});

export const client = generatedClient;
