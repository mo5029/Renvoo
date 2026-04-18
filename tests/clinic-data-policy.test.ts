import { describe, expect, it } from "vitest";

import {
  normalizeClinicHeader,
  reviewClinicHeaders,
  sanitizeClinicRecord,
} from "../src/lib/clinic-data-policy.js";

describe("clinic data policy", () => {
  it("normalizes incoming clinic headers", () => {
    expect(normalizeClinicHeader(" Appointment Start At ")).toBe("appointment_start_at");
    expect(normalizeClinicHeader("Patient Mobile Phone")).toBe("patient_mobile_phone");
  });

  it("rejects clinical, note, and BSN fields while keeping approved operational fields", () => {
    const review = reviewClinicHeaders([
      "Appointment Start At",
      "Patient Mobile Phone",
      "BSN",
      "Clinical Notes",
      "Diagnosis Code",
      "Chair Label",
    ]);

    expect(review.acceptedHeaders).toEqual(["appointment_start_at", "patient_mobile_phone"]);
    expect(review.rejectedHeaders.map((field) => field.normalizedHeader)).toEqual([
      "bsn",
      "clinical_notes",
      "diagnosis_code",
    ]);
    expect(review.reviewHeaders.map((field) => field.normalizedHeader)).toEqual(["chair_label"]);
  });

  it("strips forbidden fields from clinic records by default", () => {
    const sanitized = sanitizeClinicRecord({
      "Appointment ID": "apt_123",
      "Patient First Name": "Sara",
      "Patient Last Name": "van Dijk",
      "Clinical Notes": "Prefers sedation for long visits",
      Medication: "Amoxicillin",
      "Custom Internal Flag": true,
    });

    expect(sanitized.allowedData).toEqual({
      appointment_id: "apt_123",
      patient_first_name: "Sara",
      patient_last_name: "van Dijk",
    });
    expect(sanitized.rejectedFields.map((field) => field.normalizedHeader)).toEqual([
      "clinical_notes",
      "medication",
    ]);
    expect(sanitized.reviewFields.map((field) => field.normalizedHeader)).toEqual([
      "custom_internal_flag",
    ]);
  });
});
