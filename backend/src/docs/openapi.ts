import { paths } from "./paths"

export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Guidu Backend",
    version: "0.0.0",
  },
  servers: [{ url: "/" }],
  paths,
} as const
