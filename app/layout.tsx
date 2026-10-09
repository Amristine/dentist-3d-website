import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dentora — Dental Care",
  description:
    "Dentora Dental Care — a modern patient dashboard for appointments, treatments, and oral wellness.",
  applicationName: "Dentora Dental Care Portal",
  robots: { index: false, follow: false },
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
