// Re-export everything from generated API except ClientOptions
export * from "./generated";

// Override ClientOptions and client
export type { ClientOptions } from "./types";
export { client } from "./customClient";
