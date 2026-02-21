"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";

export default function UnlockPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/reports/${token}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error ?? "Failed");
      return;
    }

    setMessage(`Lead captured. Mock order id: ${body.orderId}`);
  }

  return (
    <main>
      <section className="card">
        <h1>Unlock Report</h1>
        <form onSubmit={onSubmit} className="grid">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <button type="submit">Submit</button>
        </form>
        {message ? <p>{message}</p> : null}
      </section>
    </main>
  );
}
