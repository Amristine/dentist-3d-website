import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumière — The Art of Your Smile",
  description:
    "A more considered kind of dental care. Discover Lumière Dental Studio, where science meets artistry and every detail begins with you.",
  applicationName: "Lumière Dental Studio",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Lumière — The Art of Your Smile",
    description:
      "Thoughtful people. Thoughtful care. A new perspective on dentistry.",
    type: "website",
  },
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
