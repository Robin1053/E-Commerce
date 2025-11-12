import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./app.tsx"),
  route("about", "./routes/about.tsx"),
  route("auth/login", "./routes/auth/Login.tsx"),
] satisfies RouteConfig;