import { z } from "zod";

import { BOOKING_HOST_EMAIL, formatBookingDateTime } from "../site/lib/booking.js";

const DATETIME_LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const meetingRequestSchema = z.object({
  contactName: z.string().trim().min(1).max(160),
  contactEmail: z.string().trim().email().max(320),
  role: z.string().trim().min(1).max(160),
  clinicName: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(160),
  clinicSize: z.string().trim().min(1).max(120),
  primaryPain: z.string().trim().min(1).max(160),
  workflowNotes: z.string().trim().min(16).max(4000),
  meetingFormat: z.string().trim().min(1).max(120),
  preferredSlot: z.string().regex(DATETIME_LOCAL_PATTERN),
  backupSlot: z.string().trim().regex(DATETIME_LOCAL_PATTERN).optional().or(z.literal("")),
  submittedAt: z.string().datetime().optional(),
  locale: z.enum(["nl", "en"]).optional(),
  page: z.string().trim().min(1).max(120).optional(),
  mode: z.string().trim().min(1).max(120).optional(),
});

const roleLabels = {
  owner: "Clinic owner",
  manager: "Practice manager",
  operations: "Operations or front-desk lead",
  other: "Other planning stakeholder",
};

const clinicSizeLabels = {
  solo: "1 chair or solo clinic",
  small: "2-4 chairs",
  mid: "5-8 chairs",
  group: "Multi-location or larger group",
};

const primaryPainLabels = {
  "no-shows": "No-shows",
  "late-cancellations": "Late cancellations",
  backfill: "Backfilling open slots",
  "admin-load": "Too much manual front-desk work",
};

const meetingFormatLabels = {
  video: "Video call",
  phone: "Phone call",
  onsite: "On-site meeting",
};

export function parseMeetingRequest(input) {
  const parsed = meetingRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten(),
    };
  }

  return {
    ok: true,
    data: {
      ...parsed.data,
      backupSlot: parsed.data.backupSlot || "",
      locale: parsed.data.locale ?? "en",
      page: parsed.data.page ?? "pilot",
      mode: parsed.data.mode ?? "website",
      submittedAt: parsed.data.submittedAt ?? new Date().toISOString(),
    },
  };
}

export function getMeetingNotificationConfig(env = process.env) {
  return {
    apiKey: env.RESEND_API_KEY?.trim() ?? "",
    fromEmail: env.RESEND_FROM_EMAIL?.trim() ?? "",
    notificationEmail:
      env.RESEND_TO_EMAIL?.trim() ??
      env.MEETING_NOTIFICATION_EMAIL?.trim() ??
      env.SITE_CONTACT_EMAIL?.trim() ??
      BOOKING_HOST_EMAIL,
  };
}

export function buildMeetingNotificationEmail(payload) {
  const preferredSlot = formatBookingDateTime(payload.preferredSlot, payload.locale);
  const backupSlot = payload.backupSlot
    ? formatBookingDateTime(payload.backupSlot, payload.locale)
    : "—";

  const normalized = {
    role: roleLabels[payload.role] ?? payload.role,
    clinicSize: clinicSizeLabels[payload.clinicSize] ?? payload.clinicSize,
    primaryPain: primaryPainLabels[payload.primaryPain] ?? payload.primaryPain,
    meetingFormat: meetingFormatLabels[payload.meetingFormat] ?? payload.meetingFormat,
  };

  const subject = `[Renvoo] New meeting request from ${payload.clinicName}`;
  const text = [
    "New Renvoo meeting request",
    "",
    `Clinic: ${payload.clinicName}`,
    `Contact: ${payload.contactName}`,
    `Email: ${payload.contactEmail}`,
    `Role: ${normalized.role}`,
    `City: ${payload.city}`,
    `Clinic size: ${normalized.clinicSize}`,
    `Primary pain: ${normalized.primaryPain}`,
    `Meeting format: ${normalized.meetingFormat}`,
    `Preferred slot: ${preferredSlot}`,
    `Backup slot: ${backupSlot}`,
    `Submitted at: ${payload.submittedAt}`,
    `Locale: ${payload.locale}`,
    "",
    "Current workflow or tooling:",
    payload.workflowNotes,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#12343b;">
      <h1 style="font-size:20px;margin:0 0 16px;">New Renvoo meeting request</h1>
      <p style="margin:0 0 16px;">A clinic submitted a workflow review request through the Renvoo planner.</p>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">
        ${renderRow("Clinic", payload.clinicName)}
        ${renderRow("Contact", payload.contactName)}
        ${renderRow("Email", payload.contactEmail)}
        ${renderRow("Role", normalized.role)}
        ${renderRow("City", payload.city)}
        ${renderRow("Clinic size", normalized.clinicSize)}
        ${renderRow("Primary pain", normalized.primaryPain)}
        ${renderRow("Meeting format", normalized.meetingFormat)}
        ${renderRow("Preferred slot", preferredSlot)}
        ${renderRow("Backup slot", backupSlot)}
        ${renderRow("Submitted at", payload.submittedAt)}
        ${renderRow("Locale", payload.locale)}
      </table>
      <h2 style="font-size:16px;margin:24px 0 8px;">Current workflow or tooling</h2>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(payload.workflowNotes)}</p>
    </div>
  `.trim();

  return {
    subject,
    text,
    html,
  };
}

function renderRow(label, value) {
  return `
    <tr>
      <td style="padding:8px 12px;border:1px solid #d9e4df;font-weight:600;background:#f4efe7;width:180px;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;border:1px solid #d9e4df;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
