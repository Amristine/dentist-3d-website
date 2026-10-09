import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DentaCare — Your dental care, made personal",
  description:
    "A thoughtful dental patient portal to manage appointments, explore treatments, review oral wellness information, and keep your records together.",
  applicationName: "DentaCare Patient Portal",
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
