import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { CompanyProvider } from "@/context/CompanyContext";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Employee onboarding assistant",
  description:
    "First-week needs, handbook answers, and a private path for questions you do not want to take to your manager.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sourceSans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <CompanyProvider>
          <AppShell>{children}</AppShell>
        </CompanyProvider>
      </body>
    </html>
  );
}
