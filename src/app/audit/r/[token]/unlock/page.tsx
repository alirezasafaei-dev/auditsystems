"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function UnlockPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<"MOCK" | "ZARINPAL">("MOCK");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, provider })
    });

    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error ?? "Failed");
      return;
    }

    if (body.downloadUrl) {
      setMessage(`Order already paid. Download ready for order ${body.orderId}.`);
      router.push(`/audit/r/${token}/success?orderId=${body.orderId}&downloadUrl=${encodeURIComponent(body.downloadUrl)}`);
      return;
    }

    if (body.redirectUrl) {
      setMessage(`Redirecting to payment gateway for order ${body.orderId}...`);
      window.location.href = body.redirectUrl;
      return;
    }

    setMessage(`Order created: ${body.orderId}`);
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
          <label>
            Payment Provider
            <select value={provider} onChange={(event) => setProvider(event.target.value as "MOCK" | "ZARINPAL")}>
              <option value="MOCK">Mock</option>
              <option value="ZARINPAL">Zarinpal</option>
            </select>
          </label>
          <button type="submit">Submit</button>
        </form>
        {message ? <p>{message}</p> : null}
      </section>
    </main>
  );
}
