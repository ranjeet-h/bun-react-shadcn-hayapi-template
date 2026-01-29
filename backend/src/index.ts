import { createApp } from "./app"
import { env } from "./config/env"
import { connectWithRetry } from "./db/mongoose"
import http from "http"
import mongoose from "mongoose"
import os from "os"
import webSocketService from "./services/websocketService"
import { createInitialAdminUser } from "./services/bootstrap"

const startApp = async () => {
  try {
    console.log("isProduction", env.isProduction, env.nodeEnv)
    await connectWithRetry({
      isProduction: env.isProduction,
      mongodbUri: env.mongodbUri,
      mongodbUriLocal: env.mongodbUriLocal,
    })
    await createInitialAdminUser()

    const app = createApp()
    const server = http.createServer(app)

    webSocketService.initialize(server)

    server.listen(env.port, () => {
      const serverAddress = server.address()

      if (serverAddress && typeof serverAddress !== "string") {
        console.log("\n🚀 Server Information:")
        console.log("------------------------")
        console.log(`🌐 Protocol: ${env.isProduction ? "https" : "http"}`)
        console.log(`🔌 Port: ${serverAddress.port}`)
        console.log(
          `📍 Host: ${
            serverAddress.address === "::" ? "localhost" : serverAddress.address
          }`
        )
        console.log(
          `🔗 Local URL: ${env.isProduction ? "https" : "http"}://localhost:${
            env.port
          }`
        )
        console.log(`🔌 WebSocket URL: ws://localhost:${env.port}/socket.io/`)

        const networkInterfaces = os.networkInterfaces()
        console.log("\n📡 Network Access URLs:")
        console.log("------------------------")
        Object.keys(networkInterfaces).forEach((interfaceName) => {
          const interfaces = networkInterfaces[interfaceName]
          interfaces?.forEach((interface_) => {
            if (interface_.family === "IPv4" && !interface_.internal) {
              console.log(
                `📍 ${interfaceName}: ${env.isProduction ? "https" : "http"}://${
                  interface_.address
                }:${env.port}`
              )
              console.log(
                `🔌 WebSocket: ws://${interface_.address}:${env.port}/socket.io/`
              )
            }
          })
        })

        console.log("\n⚙️  Environment:", env.nodeEnv)
        console.log("------------------------\n")
      }
    })
  } catch (error) {
    console.error("Failed to start application:", error)
    process.exit(1)
  }
}

if (import.meta.main) {
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected. Attempting to reconnect...")
    connectWithRetry({
      isProduction: env.isProduction,
      mongodbUri: env.mongodbUri,
      mongodbUriLocal: env.mongodbUriLocal,
    })
  })

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err)
  })

  mongoose.connection.once("open", () => {
    console.log("MongoDB connected successfully")
  })

  startApp()
}
