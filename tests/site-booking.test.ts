import { describe, expect, it } from "vitest";

import {
  createBookingPayload,
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
      availability: [],
    });

    expect(errors.contactName).toBe("required");
    expect(errors.contactEmail).toBe("email");
    expect(errors.workflowNotes).toBe("tooShort");
    expect(getFirstInvalidField(errors)).toBe("contactName");
  });

  it("requires a format and availability on step 2", () => {
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
      availability: [],
    });

    expect(errors.meetingFormat).toBe("required");
    expect(errors.availability).toBe("required");
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
        availability: ["tue-morning", "thu-afternoon"],
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
      availabilityTitle: "Availability",
      roles: { owner: "Clinic owner" },
      clinicSizes: { small: "2-4 chairs" },
      primaryPains: { "no-shows": "No-shows" },
      meetingFormats: { video: "Video call" },
      availability: {
        "tue-morning": "Tuesday morning (09:00-11:30 CET)",
        "thu-afternoon": "Thursday afternoon (13:30-16:30 CET)",
      },
    });

    expect(summary).toContain("Name: Mohamed Ibrahim");
    expect(summary).toContain("Format: Video call");
    expect(summary).toContain("Availability: Tuesday morning");
    expect(summary).toContain("Mode: preview");
  });
});
