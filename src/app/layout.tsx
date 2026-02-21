import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Asdev Audit MVP",
  description: "Website audit MVP"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
