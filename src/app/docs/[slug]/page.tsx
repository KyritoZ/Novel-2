import { readFile } from "fs/promises";
import path from "path";

const docMap: Record<string, { label: string; file: string }> = {
  prd: { label: "PRD", file: "docs/PRD.md" },
  architecture: { label: "Architecture", file: "docs/ARCHITECTURE.md" },
  safety: { label: "Safety", file: "docs/SAFETY.md" },
  "costs-and-limits": {
    label: "Costs and limits",
    file: "docs/COSTS_AND_LIMITS.md",
  },
  print: { label: "Print", file: "docs/PRINT.md" },
  "licensing-registry": {
    label: "Licensing registry",
    file: "docs/LICENSING_REGISTRY.md",
  },
};

interface DocsPageProps {
  params: { slug: string };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = params;
  const doc = docMap[slug];

  if (!doc) {
    return (
      <main className="page">
        <section className="card">
          <p className="eyebrow">Docs</p>
          <h1>Document not found</h1>
          <p className="lede">
            The requested document does not exist. Head back to the docs index to
            choose another file.
          </p>
        </section>
      </main>
    );
  }

  const filePath = path.join(process.cwd(), doc.file);
  let content: string | null = null;

  try {
    content = await readFile(filePath, "utf8");
  } catch {
    content = null;
  }

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Docs</p>
        <h1>{doc.label}</h1>
        {content ? (
          <pre style={{ whiteSpace: "pre-wrap" }}>{content}</pre>
        ) : (
          <p className="lede">This document could not be loaded.</p>
        )}
      </section>
    </main>
  );
}
