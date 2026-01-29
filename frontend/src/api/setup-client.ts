import { client } from "./generated/client.gen";
import publicApiService from "../services/publicApiService";

// Configure the default generated client to use the public axios instance
// and supply auth dynamically only for operations that declare security in the spec.
client.setConfig({
  axios: publicApiService,
  baseURL: publicApiService.defaults.baseURL,
  auth: () => localStorage.getItem("mauliCSPtoken") || undefined,
});
