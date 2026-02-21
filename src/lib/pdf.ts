import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type FindingItem = {
  code: string;
  title: string;
  severity: string;
  recommendation?: string | null;
};

export async function buildAuditReportPdf(input: {
  reportTitle: string;
  targetUrl: string;
  status: string;
  findings: FindingItem[];
  generatedAt: string;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  let page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 800;

  function draw(text: string, opts?: { size?: number; bold?: boolean; color?: [number, number, number] }): void {
    const size = opts?.size ?? 12;
    const selectedFont = opts?.bold ? bold : font;
    const colorTuple = opts?.color ?? [0, 0, 0];

    page.drawText(text, {
      x: 40,
      y,
      size,
      font: selectedFont,
      color: rgb(colorTuple[0], colorTuple[1], colorTuple[2])
    });
    y -= size + 8;
  }

  draw(input.reportTitle, { size: 20, bold: true });
  draw(`Target: ${input.targetUrl}`);
  draw(`Status: ${input.status}`);
  draw(`Generated: ${input.generatedAt}`);

  y -= 8;
  draw("Top Findings", { size: 14, bold: true });

  const findings = input.findings.slice(0, 20);
  if (findings.length === 0) {
    draw("No findings available.");
  }

  for (const finding of findings) {
    if (y < 80) {
      y = 800;
      page = pdf.addPage([595, 842]);
      page.drawText("Continued findings", {
        x: 40,
        y,
        size: 14,
        font: bold,
        color: rgb(0, 0, 0)
      });
      y -= 28;
    }

    draw(`[${finding.severity}] ${finding.code} - ${finding.title}`, { size: 11, bold: true });
    if (finding.recommendation) {
      draw(`Recommendation: ${finding.recommendation}`, { size: 10, color: [0.2, 0.2, 0.2] });
    }
  }

  return pdf.save();
}
