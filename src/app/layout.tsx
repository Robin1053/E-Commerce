"use client";
import { Roboto, Sour_Gummy } from "next/font/google";
import "./globals.css";
import { NextAppProvider } from "@toolpad/core/nextjs";
import LinearProgress from "@mui/material/LinearProgress";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import * as React from "react";
import { NAVIGATION, BRANDING } from "@/lib/AppProvidor";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { AuthClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "@/theme/theme";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const sourGummy = Sour_Gummy({
  variable: "--font-sour-gummy",
  subsets: ["latin"],
});

const { data: session } = await AuthClient.getSession();

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
        await AuthClient.signOut();
      },
    };
  }, [router]);

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
              theme={theme}
            >
              <DashboardLayout branding={BRANDING}>
                <PageContainer>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {props.children}
                  </LocalizationProvider>
                </PageContainer>
              </DashboardLayout>{" "}
            </NextAppProvider>
          </React.Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
