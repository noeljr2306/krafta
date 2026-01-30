import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/session-provider";
import { Nav } from "@/components/layout/nav";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KRAFTA – Local services, done right",
  description:
    "KRAFTA connects homeowners and businesses with verified local technicians for reliable repairs and maintenance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${poppins.variable} antialiased`}
      >
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
