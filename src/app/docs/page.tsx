import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Documentation</p>
        <h1>Documentation</h1>
        <p className="lede">
          This page contains documentation for the Graphic Novel Toolkit.
        </p>
        <p>
          <Link href="/">Back to Dashboard</Link>
        </p>
      </section>
    </main>
  );
}

