import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";

const client = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});

export type AuthClient = typeof client;
export const { signIn, signUp, useSession, signOut, getSession } = createAuthClient();
