import type { Metadata, Viewport } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { PWARegister } from "@/components/PWARegister";
import { TableSetter } from "@/components/TableSetter";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cafeteria App",
  description: "Order coffee and food right from your table.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cafeteria App",
  },
};

export const viewport: Viewport = {
  themeColor: "#14532d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <PWARegister />
          <TableSetter />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
