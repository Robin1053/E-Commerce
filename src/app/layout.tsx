"use client";
import { Roboto, Sour_Gummy } from "next/font/google";
import "./globals.css";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { Badge, IconButton, LinearProgress, } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import * as React from "react";
import { NAVIGATION, BRANDING } from "@/lib/AppProvidor";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { AuthClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "@/theme/theme";
import { ThemeProvider } from "@mui/material";
import 'material-symbols';
import { Account } from '@toolpad/core/Account';
import { CartProvider, useCart } from "@/contexts/CartContext";


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
        router.push("/auth/signin");
      },
      signOut: async () => {
        await AuthClient.signOut();
        router.push("/auth/signin");
        window.location.reload();
      },
    };
  }, [router]);


  function ToolbarActions() {
    const { cartCount } = useCart();
    
    return (
      <>
        <Badge
          badgeContent={cartCount}
          color="primary"
        >
          <IconButton color="tertiary" href="/cart">
            <span className="material-symbols-outlined">shopping_cart</span>
          </IconButton>
        </Badge>
        <ThemeSwitcher />
        <Account />
      </>
    );
  }
  return (
    <html lang="de">
      <body className={`${roboto.variable} ${sourGummy.variable} antialiased`}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <React.Suspense fallback={<LinearProgress />}>
            <CartProvider>
              <NextAppProvider
                navigation={NAVIGATION}
                branding={BRANDING}
                authentication={authentication}
                session={session}
              >
                <DashboardLayout
                  branding={BRANDING}
                  slots={
                    {
                      toolbarActions: ToolbarActions
                    }
                  }>
                  <ThemeProvider theme={theme}>
                    <PageContainer>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {props.children}
                      </LocalizationProvider>
                    </PageContainer>
                  </ThemeProvider>
                </DashboardLayout>{" "}
              </NextAppProvider>
            </CartProvider>
          </React.Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
