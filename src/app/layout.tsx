"use client";
import type { Metadata } from "next";
import { Roboto, Sour_Gummy } from "next/font/google";
import "./globals.css";
import { NextAppProvider } from "@toolpad/core/nextjs";
import LinearProgress from "@mui/material/LinearProgress";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import * as React from "react";
import { NAVIGATION, BRANDING } from "@/lib/AppProvidor";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import * as client from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const sourGummy = Sour_Gummy({
  variable: "--font-sour-gummy",
  subsets: ["latin"],
});

const { data: session } = await client.getSession();


export default function DashboardPagesLayout(props: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        router.push("auth/signin");
      },
      signOut: async () => {
        await client.signOut();
      },
    };
  }, []);

  return (
    <html lang="de">
      <body className={`${roboto.variable} ${sourGummy.variable} antialiased`}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <React.Suspense fallback={<LinearProgress />}>
            <NextAppProvider
              navigation={NAVIGATION}
              branding={BRANDING}
              authentication={authentication}
              session={session}
            >
              <DashboardLayout branding={BRANDING}>
                <PageContainer>{props.children}</PageContainer>
              </DashboardLayout>{" "}
            </NextAppProvider>
          </React.Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
