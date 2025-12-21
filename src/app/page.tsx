import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Graphic Novel Toolkit</p>
        <h1>Dashboard</h1>
        <p className="lede">
          Choose a mode to start creating your graphic novel.
        </p>
        <div className="links" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginTop: "24px" }}>
          <Link href="/story" className="button" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60px" }}>
            Story Mode
          </Link>
          <Link href="/story/guided" className="button" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60px" }}>
            Guided Story
          </Link>
          <Link href="/character-studio" className="button" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60px" }}>
            Character Studio
          </Link>
          <Link href="/rules" className="button" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60px" }}>
            Rules
          </Link>
          <Link href="/docs" className="button" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60px" }}>
            Docs
          </Link>
        </div>
      </section>
    </main>
  );
}
