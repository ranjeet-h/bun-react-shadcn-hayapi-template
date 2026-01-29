import dotenv from "dotenv"

dotenv.config()

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 8000),
  dbName: process.env.DB_NAME ?? "guidu",
  isProduction: process.env.NODE_ENV === "production",
  mongodbUri:
    process.env.MONGODB_URI ??
    `mongodb://mongodb:27017/${process.env.DB_NAME ?? "guidu"}`,
  mongodbUriLocal:
    process.env.MONGODB_URI_LOCAL ??
    `mongodb://localhost:27017/${process.env.DB_NAME ?? "guidu"}`,
} as const
