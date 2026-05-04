import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ptPLAN - Feng Shui Konsalting & Škola",
    template: "%s | ptPLAN",
  },
  description:
    "ptPLAN nudi premium Feng Shui konsalting usluge i 4-mesečnu online Feng Shui školu za transformaciju vašeg prostora i unapređenje života.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
