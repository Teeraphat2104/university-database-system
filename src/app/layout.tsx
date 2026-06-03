import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getCachedSettings } from "@/lib/settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "University Database System",
  description: "Manage and browse university PDF archives",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getCachedSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        <ThemeProvider primaryColor={settings.primaryColor}>
          <div id="main-content">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
