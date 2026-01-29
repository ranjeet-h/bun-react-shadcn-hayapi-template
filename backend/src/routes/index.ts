import { Router } from "express"
import { healthRouter } from "./health"
import { helloRouter } from "./hello"

export const rootRouter = Router()
export const apiRouter = Router()

rootRouter.use(healthRouter)
apiRouter.use(helloRouter)
