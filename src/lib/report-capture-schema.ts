import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";

export type ReportCaptureInput = { email: string; consentPrivacy: true };

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateReportCapture = ajv.compile<ReportCaptureInput>({
  type: "object",
  additionalProperties: false,
  required: ["email", "consentPrivacy"],
  properties: {
    email: { type: "string", format: "email", maxLength: 254 },
    consentPrivacy: { const: true },
  },
});

export function parseReportCaptureInput(value: unknown): ReportCaptureInput | null {
  if (!validateReportCapture(value)) return null;
  const email = value.email.trim().toLowerCase();
  return email ? { email, consentPrivacy: true } : null;
}
