import Link from "next/link";

export default function GuidedStoryPage() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Guided Story Mode</p>
        <h1>Guided Story Creation</h1>
        <p className="lede">
          This is the guided story mode. Work through a step-by-step wizard to create your graphic novel with coaching assistance.
        </p>
        <p>
          <Link href="/">Back to Dashboard</Link>
        </p>
      </section>
    </main>
  );
}

