"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AuditPage() {
  const [url, setUrl] = useState("https://example.com");
  const [depth, setDepth] = useState<"QUICK" | "DEEP">("QUICK");
  const [message, setMessage] = useState("");
  const [reportPath, setReportPath] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("Submitting audit run...");
    setReportPath(null);

    const response = await fetch("/api/audit/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, depth })
    });

    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error ?? "Failed");
      return;
    }

    const nextPath = `/audit/r/${body.token}`;
    setReportPath(nextPath);
    setMessage(`Run created: ${body.runId}`);
  }

  return (
    <main>
      <section className="card hero">
        <h1>Run a New Audit</h1>
        <p>Submit a target URL and get a shareable report token. Worker execution starts automatically after enqueue.</p>
      </section>

      <section className="grid-2">
        <section className="card">
          <form onSubmit={onSubmit} className="grid">
            <label>
              Target URL
              <input value={url} onChange={(e) => setUrl(e.target.value)} required />
            </label>
            <label>
              Depth
              <select value={depth} onChange={(e) => setDepth(e.target.value as "QUICK" | "DEEP") }>
                <option value="QUICK">Quick</option>
                <option value="DEEP">Deep</option>
              </select>
            </label>
            <button type="submit">Create Audit Run</button>
          </form>
        </section>

        <section className="card grid">
          <h2>Run Status</h2>
          <p>{message || "No run submitted yet."}</p>
          {reportPath ? (
            <p>
              <Link href={reportPath}>Open Report</Link>
            </p>
          ) : null}
        </section>
      </section>
    </main>
  );
}
