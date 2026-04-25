import { describe, expect, it } from "vitest";

import {
  BOOKING_HOST_EMAIL,
  createBookingPayload,
  createGoogleCalendarUrl,
  createPlainTextSummary,
  getFirstInvalidField,
  validateBookingStep,
} from "../src/site/lib/booking.js";

describe("booking flow helpers", () => {
  it("validates required context fields on step 1", () => {
    const errors = validateBookingStep(1, {
      contactName: "",
      contactEmail: "not-an-email",
      role: "",
      clinicName: "",
      city: "",
      clinicSize: "",
      primaryPain: "",
      workflowNotes: "short",
      meetingFormat: "",
      preferredSlot: "",
      backupSlot: "",
    });

    expect(errors.contactName).toBe("required");
    expect(errors.contactEmail).toBe("email");
    expect(errors.workflowNotes).toBe("tooShort");
    expect(getFirstInvalidField(errors)).toBe("contactName");
  });

  it("requires a format and preferred slot on step 2", () => {
    const errors = validateBookingStep(2, {
      contactName: "Mohamed",
      contactEmail: "mohamed@clinic.nl",
      role: "owner",
      clinicName: "Bright Dental",
      city: "Eindhoven",
      clinicSize: "small",
      primaryPain: "no-shows",
      workflowNotes: "Manual reminders plus a backfill spreadsheet.",
      meetingFormat: "",
      preferredSlot: "",
      backupSlot: "",
    });

    expect(errors.meetingFormat).toBe("required");
    expect(errors.preferredSlot).toBe("required");
  });

  it("rejects the same backup slot twice", () => {
    const errors = validateBookingStep(2, {
      contactName: "Mohamed",
      contactEmail: "mohamed@clinic.nl",
      role: "owner",
      clinicName: "Bright Dental",
      city: "Eindhoven",
      clinicSize: "small",
      primaryPain: "no-shows",
      workflowNotes: "Manual reminders plus a backfill spreadsheet.",
      meetingFormat: "video",
      preferredSlot: "2026-04-24T10:00",
      backupSlot: "2026-04-24T10:00",
    });

    expect(errors.backupSlot).toBe("differentDateTime");
  });

  it("creates a stable plain-text summary for preview routing", () => {
    const payload = createBookingPayload(
      {
        contactName: "Mohamed Ibrahim",
        contactEmail: "mohamed@clinic.nl",
        role: "owner",
        clinicName: "Bright Dental",
        city: "Eindhoven",
        clinicSize: "small",
        primaryPain: "no-shows",
        workflowNotes: "Manual reminders plus a backfill spreadsheet.",
        meetingFormat: "video",
        preferredSlot: "2026-04-24T10:00",
        backupSlot: "2026-04-25T14:30",
      },
      {
        submittedAt: "2026-04-18T10:00:00.000Z",
        locale: "nl-NL",
        page: "pilot",
        mode: "preview",
      },
    );

    const summary = createPlainTextSummary(payload, {
      summaryTitle: "Renvoo booking request",
      submittedAt: "Submitted at",
      mode: "Mode",
      contactName: "Name",
      contactEmail: "Email",
      role: "Role",
      clinicName: "Clinic",
      city: "City",
      clinicSize: "Clinic size",
      primaryPain: "Pain",
      workflowNotes: "Workflow",
      meetingFormat: "Format",
      preferredSlot: "Preferred slot",
      backupSlot: "Backup slot",
      roles: { owner: "Clinic owner" },
      clinicSizes: { small: "2-4 chairs" },
      primaryPains: { "no-shows": "No-shows" },
      meetingFormats: { video: "Video call" },
    });

    expect(summary).toContain("Name: Mohamed Ibrahim");
    expect(summary).toContain("Format: Video call");
    expect(summary).toContain("Preferred slot:");
    expect(summary).toContain("Backup slot:");
    expect(summary).toContain("Mode: preview");
  });

  it("creates a Google Calendar draft that includes Mohamed as attendee", () => {
    const payload = createBookingPayload(
      {
        contactName: "Mohamed Ibrahim",
        contactEmail: "mohamed@clinic.nl",
        role: "owner",
        clinicName: "Bright Dental",
        city: "Eindhoven",
        clinicSize: "small",
        primaryPain: "no-shows",
        workflowNotes: "Manual reminders plus a backfill spreadsheet.",
        meetingFormat: "video",
        preferredSlot: "2026-04-24T10:00",
        backupSlot: "2026-04-25T14:30",
      },
      {
        locale: "nl-NL",
        page: "pilot",
        mode: "preview",
      },
    );

    const url = createGoogleCalendarUrl(payload);

    expect(url).toContain("calendar.google.com/calendar/render");
    expect(url).toContain(encodeURIComponent(BOOKING_HOST_EMAIL));
    expect(url).toContain("Renvoo+validation+meeting");
  });
});
