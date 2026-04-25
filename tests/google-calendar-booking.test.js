import { describe, expect, it } from "vitest";

import {
  buildCalendarEvent,
  isCalendarBookingConfigured,
} from "../src/lib/google-calendar-booking.js";

describe("google calendar booking helpers", () => {
  it("detects when live calendar booking is configured", () => {
    expect(
      isCalendarBookingConfigured({
        GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL: "service@example.iam.gserviceaccount.com",
        GOOGLE_CALENDAR_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----",
        GOOGLE_CALENDAR_ID: "mohamed.ibrahim5029@gmail.com",
      }),
    ).toBe(true);

    expect(
      isCalendarBookingConfigured({
        GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL: "",
        GOOGLE_CALENDAR_PRIVATE_KEY: "",
        GOOGLE_CALENDAR_ID: "",
      }),
    ).toBe(false);
  });

  it("builds a host-side calendar event with the visitor invited", () => {
    const event = buildCalendarEvent({
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
    });

    expect(event.start.dateTime).toBe("2026-04-29T10:00:00");
    expect(event.end.dateTime).toBe("2026-04-29T10:15:00");
    expect(event.attendees).toEqual([
      {
        email: "owner@clinic.nl",
        displayName: "Clinic Owner",
      },
    ]);
    expect(event.conferenceData?.createRequest?.conferenceSolutionKey?.type).toBe("hangoutsMeet");
  });
});
