import type { Express, Request, Response } from "express"
import swaggerUi from "swagger-ui-express"
import { openapiDocument } from "./openapi"

export function setupSwagger(app: Express) {
  app.get("/openapi.json", (_req: Request, res: Response) =>
    res.json(openapiDocument)
  )
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument))
}
