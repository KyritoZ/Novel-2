const docsLinks = [
  { href: "/docs/prd", label: "PRD" },
  { href: "/docs/architecture", label: "Architecture" },
  { href: "/docs/safety", label: "Safety" },
  { href: "/docs/costs-and-limits", label: "Costs and limits" },
  { href: "/docs/print", label: "Print" },
  { href: "/docs/licensing-registry", label: "Licensing registry" },
];

export default function DocsIndexPage() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Docs</p>
        <h1>Documentation</h1>
        <div className="links">
          {docsLinks.map((doc) => (
            <a key={doc.href} href={doc.href}>
              {doc.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
