import type { Metadata } from "next";
import type { ReactNode } from "react";
import SidebarNav from "./components/SidebarNav";
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
        <div className="app-shell">
          <aside className="app-sidebar">
            <div className="app-sidebar-header">
              <p className="eyebrow">Graphic Novel Toolkit</p>
            </div>
            <SidebarNav />
          </aside>
          <div className="app-main">
            <header className="app-topbar">
              <h1 style={{ fontSize: "20px", fontWeight: 600 }}>Graphic Novel Toolkit</h1>
            </header>
            <div className="app-content">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
