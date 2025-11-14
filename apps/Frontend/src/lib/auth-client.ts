import { createAuthClient } from 'better-auth/react';
import { stripeClient } from "@better-auth/stripe/client"


export const client = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3333', // The base URL of your auth server

  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});

export type AuthClient = typeof client;
