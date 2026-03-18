import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers/SessionProvider";
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
  title: "Brasileiras em KL",
  description: "Indicações de serviços para brasileiras que moram em Kuala Lumpur",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Brasileiras em KL",
    description: "Encontre indicações de serviços feitos por brasileiras em Kuala Lumpur",
    url: "https://service-tips.vercel.app/",
    siteName: "Brasileiras em KL",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Preview do Brasileiras em KL",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
