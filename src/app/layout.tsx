import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Graphic Novel Toolkit",
  description: "Graphic Novel Toolkit scaffold",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="top-nav">
          <div className="nav-inner">
            <Link href="/">Home</Link>
            <Link href="/story">Story</Link>
            <Link href="/character-studio">Character Studio</Link>
            <Link href="/rules">Rules</Link>
            <Link href="/docs">Docs</Link>
          </div>
        </nav>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
