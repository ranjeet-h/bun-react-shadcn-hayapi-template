export const helloPath = {
  "/api/hello": {
    get: {
      summary: "Hello world",
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { message: { type: "string" } },
                required: ["message"],
              },
            },
          },
        },
      },
    },
  },
} as const
