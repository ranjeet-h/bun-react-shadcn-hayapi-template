import compression from "compression"
import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import { apiRouter } from "./routes"
import { healthRouter } from "./routes/health"
import { setupSwagger } from "./docs/setupSwagger"

export function createApp() {
  const app = express()

  app.use(compression())
  app.use(bodyParser.json({ limit: "2mb" }))
  app.use(
    cors({
      origin: "*",
      methods: "*",
      allowedHeaders: "*",
    })
  )

  setupSwagger(app)

  app.use(healthRouter)

  app.use("/api", apiRouter)

  return app
}
