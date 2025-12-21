"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/story", label: "Story" },
    { href: "/story/guided", label: "Guided Story" },
    { href: "/character-studio", label: "Character Studio" },
    { href: "/rules", label: "Rules" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <nav className="app-sidebar-nav">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`app-sidebar-link ${isActive ? "active" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

