import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlerPromise = toNextJsHandler(auth.handler);

export async function GET(request: Request) {
  const { GET } = await handlerPromise;
  return GET(request);
}

export async function POST(request: Request) {
  const { POST } = await handlerPromise;
  return POST(request);
}
