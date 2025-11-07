import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GSC Capital Group - Global Strategy Catalyst Group",
  description: "GSC Capital Group brings together five specialized companies under one strategic umbrella, delivering comprehensive solutions for real estate, technology, consulting, and investment.",
  keywords: ["GSC Capital Group", "Real Estate", "IT Solutions", "Consulting", "Investment", "Roomy Finder", "Business Strategy"],
  authors: [{ name: "GSC Capital Group" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "GSC Capital Group",
    description: "Empowering business excellence worldwide through five specialized companies",
    url: "https://gsccapitalgroup.com",
    siteName: "GSC Capital Group",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GSC Capital Group",
    description: "Empowering business excellence worldwide",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
