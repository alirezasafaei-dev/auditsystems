"use client";

import { FormEvent, useState } from "react";

export default function AuditPage() {
  const [url, setUrl] = useState("https://example.com");
  const [depth, setDepth] = useState<"QUICK" | "DEEP">("QUICK");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("Submitting...");

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

    setMessage(`Run created: ${body.runId}. Open report: /audit/r/${body.token}`);
  }

  return (
    <main className="grid">
      <section className="card">
        <h1>Run Audit</h1>
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
        {message ? <p>{message}</p> : null}
      </section>
    </main>
  );
}
