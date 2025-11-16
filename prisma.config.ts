import { defineConfig, env } from "prisma/config";
// Load .env into process.env so the config can access DATABASE_URL when Prisma loads this file.
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  // Use the `env()` helper so Prisma will load environment variables (from `.env`)
  // when a Prisma config is present. This prevents the CLI from skipping env loading
  // and resolves the `Environment variable not found: DATABASE_URL` error.
  datasource: {
    url: env("DATABASE_URL"),
  },
});
