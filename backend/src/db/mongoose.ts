import mongoose from "mongoose"

export async function connectMongo(mongodbUri: string) {
  mongoose.set("strictQuery", true)
  await mongoose.connect(mongodbUri)
}

export type ConnectWithRetryOptions = {
  isProduction: boolean
  mongodbUri: string
  mongodbUriLocal: string
  maxRetries?: number
  initialDelayMs?: number
  retryDelayMs?: number
}

export async function connectWithRetry(options: ConnectWithRetryOptions) {
  const {
    isProduction,
    mongodbUri,
    mongodbUriLocal,
    maxRetries = 5,
    initialDelayMs = 5000,
    retryDelayMs = 5000,
  } = options

  await new Promise((resolve) => setTimeout(resolve, initialDelayMs))

  let currentRetry = 0

  const tryConnect = async (): Promise<void> => {
    try {
      console.log("MongoDB connection attempt:", currentRetry + 1)
      await connectMongo(isProduction ? mongodbUri : mongodbUriLocal)
      console.log("MongoDB is connected")
    } catch (err) {
      console.error("MongoDB connection unsuccessful:", err)

      if (currentRetry < maxRetries) {
        currentRetry++
        console.log(
          `Retrying in ${Math.round(retryDelayMs / 1000)} seconds... (Attempt ${currentRetry} of ${maxRetries})`
        )
        setTimeout(tryConnect, retryDelayMs)
      } else {
        console.error("Max retries reached. Could not connect to MongoDB")
        process.exit(1)
      }
    }
  }

  await tryConnect()
}
