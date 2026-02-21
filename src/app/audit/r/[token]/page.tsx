import Link from "next/link";
import { prisma } from "../../../../lib/db";
import { isReportShareAccessible } from "../../../../lib/reportShare";

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const share = await prisma.reportShare.findUnique({
    where: { token },
    include: {
      run: {
        include: {
          findings: { orderBy: { createdAt: "asc" } }
        }
      }
    }
  });

  if (!share || !isReportShareAccessible(share)) {
    return (
      <main>
        <section className="card">
          <h1>Report not found</h1>
          <p>This token is invalid or the report is unavailable.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid">
      <section className="card">
        <h1>Audit Report</h1>
        <p>
          <span className="badge">{share.run.status}</span>
        </p>
        <p>Target: {share.run.normalizedUrl ?? share.run.url}</p>
        <p>Token: {token}</p>
        <p>
          <Link href={`/audit/r/${token}/unlock`}>Unlock lead/order gate</Link>
        </p>
      </section>

      <section className="card">
        <h2>Findings</h2>
        {share.run.findings.map((finding) => (
          <article key={finding.id} className="finding">
            <strong>{finding.code}</strong>
            <p>{finding.title}</p>
            <small>
              {finding.severity} - {finding.recommendation}
            </small>
          </article>
        ))}
      </section>
    </main>
  );
}
