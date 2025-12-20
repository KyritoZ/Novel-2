import { readFile } from "fs/promises";
import path from "path";

export default async function RulesPage() {
  const filePath = path.join(process.cwd(), "AGENTS.md");
  let content: string | null = null;

  try {
    content = await readFile(filePath, "utf8");
  } catch {
    content = null;
  }

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Rules</p>
        <h1>AGENTS.md</h1>
        {content ? (
          <pre style={{ whiteSpace: "pre-wrap" }}>{content}</pre>
        ) : (
          <p className="lede">AGENTS.md was not found in the repo root.</p>
        )}
      </section>
    </main>
  );
}
