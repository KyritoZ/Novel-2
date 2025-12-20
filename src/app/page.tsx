export default function Home() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Scaffold status</p>
        <h1>Graphic Novel Toolkit – Scaffold OK</h1>
        <p className="lede">
          The Next.js App Router scaffold is running. Use this shell to build the
          coaching-first graphic novel toolkit while honoring the rules in
          AGENTS.md.
        </p>
        <div className="links">
          <a href="/AGENTS.md">Rules (AGENTS.md)</a>
          <a href="/docs/PRD.md">Docs (PRD)</a>
          <a href="/character-studio">Character Studio</a>
        </div>
      </section>
    </main>
  );
}
