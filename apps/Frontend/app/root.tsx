import {
  Scripts,
  ScrollRestoration,
  type MetaFunction,
  type LinksFunction,
} from 'react-router';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './lib/theme';
import { authClient } from './lib/client';
import router from './routes';
import { RouterProvider } from 'react-router';


export const meta: MetaFunction = () => [
  {
    title: 'New Nx React Router App',
  },
];

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export async function Layout({ children }: { children: React.ReactNode }) {
  // Protect the dev server from crashing when the auth backend is down.
  // If fetching the session fails (ECONNREFUSED during local dev), continue without a session.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let session: any = null;
  try {
    const res = await authClient.getSession();
    session = res?.data ?? null;
  } catch (err) {
    // Avoid using `any` in this dev-only log; coerce to string instead.
    console.warn('[dev] authClient.getSession failed, continuing without session:', String(err));
    session = null;
  }

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router as any} />
      </ThemeProvider>
      <ScrollRestoration />
      <Scripts />
    </React.StrictMode>

  );
}
