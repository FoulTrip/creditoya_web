import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/Auth";
import NavBar from "@/components/NavrBar/NavBarComponent";
import { Toaster } from "sonner";

// stats vercel
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { WsProvider } from "./WsProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credito Ya",
  description: "Developed by TripCode",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WsProvider>
          <GlobalProvider>
            <Toaster richColors position="top-center" />
            <NavBar />
            {children}
            <SpeedInsights />
            <Analytics />
          </GlobalProvider>
        </WsProvider>
      </body>
    </html>
  );
}
