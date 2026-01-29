export const healthPath = {
  "/health": {
    get: {
      summary: "Health check",
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { ok: { type: "boolean" } },
                required: ["ok"],
              },
            },
          },
        },
      },
    },
  },
} as const
