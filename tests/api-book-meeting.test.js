import { afterEach, describe, expect, it } from "vitest";

import { POST } from "../api/book-meeting.js";
import { BOOKING_HOST_EMAIL } from "../src/site/lib/booking.js";

const originalEnv = {
  GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_CALENDAR_PRIVATE_KEY: process.env.GOOGLE_CALENDAR_PRIVATE_KEY,
  GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
  GOOGLE_CALENDAR_DELEGATED_USER: process.env.GOOGLE_CALENDAR_DELEGATED_USER,
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
});

describe("book meeting api", () => {
  it("returns a Google Calendar draft fallback when live calendar booking is not configured", async () => {
    delete process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL;
    delete process.env.GOOGLE_CALENDAR_PRIVATE_KEY;
    delete process.env.GOOGLE_CALENDAR_ID;
    delete process.env.GOOGLE_CALENDAR_DELEGATED_USER;

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
        locale: "en-US",
        page: "pilot",
        mode: "website",
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.mode).toBe("draft-fallback");
    expect(payload.hostEmail).toBe(BOOKING_HOST_EMAIL);
    expect(payload.calendarUrl).toContain("calendar.google.com/calendar/render");
  });

  it("rejects invalid booking payloads before any calendar call happens", async () => {
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
    expect(payload.fields.contactName).toBe("required");
    expect(payload.fields.contactEmail).toBe("email");
    expect(payload.fields.workflowNotes).toBe("tooShort");
  });
});
