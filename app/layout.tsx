import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumière Dental Studio — A new feeling of confidence",
  description:
    "Thoughtful dentistry, considered design, and a more human approach to your smile. Discover Lumière Dental Studio.",
  applicationName: "Lumière Dental Studio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}