import Link from "next/link";

export default function HomePage() {
  return (
    <main className="grid">
      <section className="card">
        <h1>Asdev Audit MVP</h1>
        <p>Run a quick website audit and generate a tokenized report.</p>
        <Link href="/audit">Start Audit</Link>
      </section>
    </main>
  );
}
