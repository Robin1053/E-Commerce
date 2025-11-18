import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";
import { type auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins";
import { lastLoginMethodClient } from "better-auth/client/plugins"

const client = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  google: {
    prompt: "select_account",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },

  plugins: [
    stripeClient({
      subscription: true,
    }),
    inferAdditionalFields<typeof auth>(),
    passkeyClient(),
    lastLoginMethodClient(),
  ],
  user: {
    additionalFields: {
      Birthday: {
        type: "date",
        input: true,
      },
    },
  },
});

export type AuthClient = typeof client;
export type Session = typeof client.$Infer.Session;
export const AuthClient = client;
