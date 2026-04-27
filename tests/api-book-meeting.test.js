import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "../api/book-meeting.js";

const originalEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  RESEND_TO_EMAIL: process.env.RESEND_TO_EMAIL,
  MEETING_NOTIFICATION_EMAIL: process.env.MEETING_NOTIFICATION_EMAIL,
  SITE_CONTACT_EMAIL: process.env.SITE_CONTACT_EMAIL,
};

function createRequest(body) {
  return new Request("http://localhost/api/book-meeting", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (typeof value === "string") {
      process.env[key] = value;
    } else {
      delete process.env[key];
    }
  }

  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("book meeting api", () => {
  it("sends a Resend notification when the booking request is valid", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM_EMAIL = "Renvoo <requests@renvoo.nl>";
    process.env.RESEND_TO_EMAIL = "mohamed.ibrahim5029@gmail.com";

    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({ id: "email_123" }, { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createRequest({
        contactName: "Clinic Owner",
        contactEmail: "owner@clinic.nl",
        role: "owner",
        clinicName: "Bright Dental",
        city: "Eindhoven",
        clinicSize: "small",
        primaryPain: "no-shows",
        workflowNotes: "Manual reminders and a spreadsheet for backfill.",
        meetingFormat: "video",
        preferredSlot: "2026-04-29T10:00",
        backupSlot: "2026-04-29T14:00",
        locale: "en",
        page: "pilot",
        mode: "website",
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.mode).toBe("email-notification");
    expect(payload.emailId).toBe("email_123");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer re_test");

    const resendPayload = JSON.parse(String(options.body));
    expect(resendPayload.to).toEqual(["mohamed.ibrahim5029@gmail.com"]);
    expect(resendPayload.reply_to).toBe("owner@clinic.nl");
    expect(resendPayload.subject).toContain("Bright Dental");
  });

  it("returns 503 when Resend is not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      createRequest({
        contactName: "Clinic Owner",
        contactEmail: "owner@clinic.nl",
        role: "owner",
        clinicName: "Bright Dental",
        city: "Eindhoven",
        clinicSize: "small",
        primaryPain: "no-shows",
        workflowNotes: "Manual reminders and a spreadsheet for backfill.",
        meetingFormat: "video",
        preferredSlot: "2026-04-29T10:00",
        backupSlot: "2026-04-29T14:00",
        locale: "en",
        page: "pilot",
        mode: "website",
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Resend is not configured.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects invalid booking payloads before any Resend call happens", async () => {
    const response = await POST(
      createRequest({
        contactName: "",
        contactEmail: "bad-email",
        role: "",
        clinicName: "",
        city: "",
        clinicSize: "",
        primaryPain: "",
        workflowNotes: "short",
        meetingFormat: "",
        preferredSlot: "",
        backupSlot: "",
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("Meeting request is invalid.");
    expect(payload.details.fieldErrors.contactName).toBeDefined();
    expect(payload.details.fieldErrors.contactEmail).toBeDefined();
    expect(payload.details.fieldErrors.workflowNotes).toBeDefined();
  });
});
