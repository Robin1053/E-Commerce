import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

// Ensure .env variables are loaded when this TypeScript config is imported
// (the Prisma language server may import this file without automatically
// loading .env). Loading dotenv here prevents `env("DATABASE_URL")`
// from throwing when DATABASE_URL is present in a workspace .env file.
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
