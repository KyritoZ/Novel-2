import Link from "next/link";

export default function Home() {
  const links = [
    { href: "/story", label: "Story", description: "Sandbox story creation mode" },
    { href: "/story/guided", label: "Guided Story", description: "Step-by-step wizard with coaching" },
    { href: "/character-studio", label: "Character Studio", description: "Build character assets" },
    { href: "/rules", label: "Rules", description: "Project rules and guidelines" },
    { href: "/docs", label: "Docs", description: "Documentation and architecture" },
  ];

  return (
    <main className="dashboard">
      <div style={{ width: "min(1000px, 100%)" }}>
        <section className="card">
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome</h1>
          <p className="lede">
            Choose a mode to start creating your graphic novel.
          </p>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginTop: "24px" }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="card">
              <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>{link.label}</h2>
              <p className="lede" style={{ marginBottom: "0" }}>{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
