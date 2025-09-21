import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TanstackQueryProvider } from "@/providers/tanstack-provider";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Header1 from "@/components/layout/Header1";
import Footer from "@/components/layout/Footer";

const font = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Wholesale Muradnagar",
    template: "%s | Wholesale Muradnagar",
  },
  description: "Wholesale products in Muradnagar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#212121" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>

      <body
        className={`${font.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryProvider>
            {/* <Header /> */}
            <Header1 />
            {children}
            <Footer />
          </TanstackQueryProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
