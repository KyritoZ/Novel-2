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

  // Normalize pathname (remove trailing slash except for root)
  const normalizedPathname = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  // Find the best matching link (longest match wins)
  let activeHref: string | null = null;
  let longestMatch = 0;

  for (const link of links) {
    const normalizedHref = link.href === "/" ? "/" : link.href.replace(/\/$/, "");
    
    // Root must be exact match
    if (normalizedHref === "/") {
      if (normalizedPathname === "/") {
        activeHref = link.href;
        longestMatch = 1;
      }
      continue;
    }

    // For non-root links: exact match or starts with href + "/"
    const isExactMatch = normalizedPathname === normalizedHref;
    const isPrefixMatch = normalizedPathname.startsWith(normalizedHref + "/");
    
    if (isExactMatch || isPrefixMatch) {
      // Choose longest match
      if (normalizedHref.length > longestMatch) {
        activeHref = link.href;
        longestMatch = normalizedHref.length;
      }
    }
  }

  return (
    <nav className="app-sidebar-nav">
      {links.map((link) => {
        const isActive = link.href === activeHref;
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

