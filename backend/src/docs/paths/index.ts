import { healthPath } from "./health"
import { helloPath } from "./hello"

export const paths = {
  ...healthPath,
  ...helloPath,
} as const
