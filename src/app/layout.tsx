import "./globals.css";
import { GlobalProvider } from "@/context/Auth";
import NavBar from "@/components/NavrBar/NavBarComponent";
import { Toaster } from "sonner";

// stats vercel
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

export const metadata: Metadata = {
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
      <body>
          <GlobalProvider>
            <Toaster richColors position="top-center" />
            <NavBar />
            {children}
            <SpeedInsights />
            <Analytics />
          </GlobalProvider>
      </body>
    </html>
  );
}
