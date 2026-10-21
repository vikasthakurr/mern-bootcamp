import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "./env.js";

const definition = {
  openapi: "3.0.0",
  info: {
    title: "TalentBridge API",
    version: "1.0.0",
    description: "Freelance job marketplace backend API.",
  },
  servers: [{ url: `http://localhost:${env.port}/api` }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  tags: [
    { name: "Auth", description: "Register, login, and current user" },
    { name: "Jobs", description: "Create, read, update, delete jobs" },
    { name: "Proposals", description: "Freelancer bids on jobs" },
  ],
};

const options = {
  definition,
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export function mountSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (req, res) => {
    res.json(swaggerSpec);
  });
  console.log(`[swagger] docs at http://localhost:${env.port}/api/docs`);
}
