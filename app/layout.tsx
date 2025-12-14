import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Repair Simulator",
  description: "Premium data cleaning simulator for modern teams"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={cn(font.className, "bg-surface text-gray-100")}> 
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
