"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/Auth";
import NavBar from "@/components/NavrBar/NavBarComponent";
import { Toaster } from "sonner";
import { WebSocketProvider } from "next-ws/client";

// stats vercel
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { metadata } from "./metadata";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebSocketProvider url={`${process.env.NEXT_PUBLIC_ENDPOINT_WS}`}>
          <GlobalProvider>
            <Toaster richColors position="top-center" />
            <NavBar />
            {children}
            <SpeedInsights />
            <Analytics />
          </GlobalProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}
