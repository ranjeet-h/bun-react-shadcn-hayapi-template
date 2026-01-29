import { defineConfig } from "@hey-api/openapi-ts";

const env = (
  globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  }
).process?.env;

const openApiBaseUrl = env?.OPENAPI_BASE_URL ?? "http://localhost:8000";

export default defineConfig({
  input: `${openApiBaseUrl}/openapi.json`,
  output: "src/api/generated",
  plugins: [
    {
      name: "@hey-api/client-axios",
      runtimeConfigPath: "./src/api/heyApiRuntime.ts",
    },
    "@hey-api/typescript",
    "@hey-api/sdk",
    {
      name: "@tanstack/react-query",
      queryKeys: true,
      queryOptions: true,
    },
  ],
});
