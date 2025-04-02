import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { AuthProvider } from "../context/auth-context";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-dvh bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <AuthProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-dvh">
              <Navbar />
              <main className="container max-w-full max-h-full mx-auto pb-0 flex-grow z-0 pt-0 absolute">
                {children}
                <Footer />
              </main>
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
