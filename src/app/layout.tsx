import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Silkscreen } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });
const silkscreen = Silkscreen({ variable: "--font-silkscreen", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: {
    default: "CliffGuard: Take the gig. Keep your health subsidy.",
    template: "%s | CliffGuard",
  },
  description:
    "For freelancers on HealthCare.gov: see if extra work this year pushes you over the 2026 subsidy cliff, and the legal moves that let you take it anyway.",
};

export const viewport: Viewport = { themeColor: "#0c0c0c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${silkscreen.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="bg-night">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Logo />
            <nav aria-label="Main" className="flex gap-4 text-sm font-semibold text-white"><Link href="/unlock" className="underline">My plan</Link><Link href="/checkin" className="underline">Check-in</Link></nav>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
