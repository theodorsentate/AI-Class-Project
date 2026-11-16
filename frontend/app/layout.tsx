import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { CompanyProvider } from "@/context/CompanyContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Employee onboarding assistant",
  description:
    "First-week needs, handbook answers, and a private path for questions you do not want to take to your manager.",
};

const themeBoot = `try{var t=localStorage.getItem('harbor-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sourceSans.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="min-h-full font-sans">
        <ThemeProvider>
          <ToastProvider>
            <CompanyProvider>
              <AppShell>{children}</AppShell>
            </CompanyProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
