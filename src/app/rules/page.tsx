import Link from "next/link";

export default function RulesPage() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Rules</p>
        <h1>Platform Rules</h1>
        <p className="lede">
          This page contains the rules and guidelines for using the Graphic Novel Toolkit.
        </p>
        <p>
          <Link href="/">Back to Dashboard</Link>
        </p>
      </section>
    </main>
  );
}

