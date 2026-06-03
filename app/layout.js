import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import SiteShell from "@/components/SiteShell";
import { schoolInfo } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: {
    default: `${schoolInfo.name} | Kalanki, Kathmandu`,
    template: `%s | ${schoolInfo.name}`,
  },
  description:
    "Janapath Secondary School in Kalanki-4, Kathmandu offers quality education and Computer Engineering technical program. Apply now for 2026 admissions.",
  keywords: [
    "Janapath Secondary School",
    "school Kathmandu",
    "Kalanki school",
    "Computer Engineering Nepal",
    "technical education",
  ],
  openGraph: {
    title: schoolInfo.name,
    description: schoolInfo.tagline,
    locale: "en_NP",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
