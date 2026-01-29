import { Router, type Request, type Response } from "express"

export const helloRouter = Router()

helloRouter.get("/hello", (_req: Request, res: Response) => {
  res.json({ message: "hello world" })
})
