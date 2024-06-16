"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/Auth";
import NavBar from "@/components/NavrBar/NavBarComponent";
import { Toaster } from "sonner";
import { WebSocketProvider } from "next-ws/client";

// stats vercel
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Credito Ya",
  description: "Developed by TripCode",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebSocketProvider url={`${process.env.ENDPOINT_WS}`}>
          <GlobalProvider>
            <Toaster richColors />
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
