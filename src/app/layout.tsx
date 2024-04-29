import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/Auth";
import NavBar from "@/components/NavrBar/NavBarComponent";
import { Toaster } from "sonner";
import IntFooter from "@/components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <GlobalProvider>
          <Toaster richColors />
          <NavBar />
          {children}
          <IntFooter />
        </GlobalProvider>
      </body>
    </html>
  );
}
