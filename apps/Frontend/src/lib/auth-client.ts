import { createAuthClient } from 'better-auth/react';

export interface MinimalAuthClient {
  signIn: (...args: any[]) => Promise<any>;
  signUp: (...args: any[]) => Promise<any>;
  signOut: (...args: any[]) => Promise<any>;
  useSession: (...args: any[]) => any;
  getSession: (...args: any[]) => Promise<any>;
}

export const authClient: MinimalAuthClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3333', // The base URL of your auth server
}) as unknown as MinimalAuthClient;

export type AuthClient = MinimalAuthClient;
export const signIn: AuthClient['signIn'] = authClient.signIn;
export const signUp: AuthClient['signUp'] = authClient.signUp;
export const useSession: AuthClient['useSession'] = authClient.useSession;
export const getSession: AuthClient['getSession'] = authClient.getSession;
