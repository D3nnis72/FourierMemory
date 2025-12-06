import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Fourier Memory Arcade",
  description: "Two player Fourier memory game, learn and upload your own datasets.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      </body>
    </html>
  );
}

