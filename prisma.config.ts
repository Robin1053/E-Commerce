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
  datasource: {
    url: env("DATABASE_URL"),
  },
});
