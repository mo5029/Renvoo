export const ALLOWED_CLINIC_FIELDS = [
  "appointment_id",
  "clinic_patient_id",
  "patient_first_name",
  "patient_last_name",
  "patient_mobile_phone",
  "patient_email",
  "preferred_contact_channel",
  "waitlist_opt_in",
  "appointment_type",
  "appointment_status",
  "appointment_start_at",
  "appointment_end_at",
  "duration_minutes",
  "location_id",
  "location_name",
  "practitioner_id",
  "practitioner_name",
  "booked_at",
  "confirmation_status",
  "reminder_channel",
  "reminder_sent_at",
  "response_status",
  "response_received_at",
  "cancellation_at",
  "cancellation_reason_category",
  "attendance_outcome",
  "slot_recovery_status",
].sort();

const FORBIDDEN_FIELD_RULES = [
  {
    pattern: /(bsn|burgerservice|citizen_service_number|citizenservice)/i,
    reason: "BSN and equivalent national ID fields are outside Renvoo's v1 scope.",
  },
  {
    pattern:
      /((^|_)(diagnosis|diagnostic|icd|dsm|condition|conditions|problem|problem_list|treatment|treatments|care_plan)(_|$)|diagnos)/i,
    reason: "Diagnosis and treatment-linked fields would blur the non-clinical product boundary.",
  },
  {
    pattern:
      /((^|_)(medication|medications|prescription|prescriptions|allergy|allergies|symptom|symptoms|lab|lab_result|test_result|history)(_|$)|medic|prescri|allerg)/i,
    reason: "Medication, symptoms, labs, and similar clinical data are out of scope for v1.",
  },
  {
    pattern:
      /((^|_)(note|notes|comment|comments|remark|remarks|vrije_tekst|free_text|soap)(_|$)|clinical_notes)/i,
    reason: "Free-text and note fields are excluded from the default clinic data policy.",
  },
  {
    pattern: /((^|_)(clinical|medical|triage|complaint|chief_complaint)(_|$)|clinical_)/i,
    reason: "Clinical or medical classification fields require a fresh legal review before use.",
  },
];

export type ClinicFieldStatus = "allowed" | "forbidden" | "review";

export interface ReviewedClinicField {
  originalHeader: string;
  normalizedHeader: string;
  status: ClinicFieldStatus;
  reason?: string;
}

export interface ClinicHeaderReview {
  acceptedHeaders: string[];
  rejectedHeaders: ReviewedClinicField[];
  reviewHeaders: ReviewedClinicField[];
}

export interface SanitizedClinicRecord {
  allowedData: Record<string, unknown>;
  rejectedFields: ReviewedClinicField[];
  reviewFields: ReviewedClinicField[];
}

export function normalizeClinicHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function reviewClinicField(header: string): ReviewedClinicField {
  const normalizedHeader = normalizeClinicHeader(header);

  if (ALLOWED_CLINIC_FIELDS.includes(normalizedHeader)) {
    return {
      originalHeader: header,
      normalizedHeader,
      status: "allowed",
    };
  }

  const forbiddenRule = FORBIDDEN_FIELD_RULES.find((rule) => rule.pattern.test(normalizedHeader));
  if (forbiddenRule) {
    return {
      originalHeader: header,
      normalizedHeader,
      status: "forbidden",
      reason: forbiddenRule.reason,
    };
  }

  return {
    originalHeader: header,
    normalizedHeader,
    status: "review",
    reason: "Field is not part of the approved v1 schema and needs explicit review before use.",
  };
}

export function reviewClinicHeaders(headers: string[]): ClinicHeaderReview {
  const acceptedHeaders: string[] = [];
  const rejectedHeaders: ReviewedClinicField[] = [];
  const reviewHeaders: ReviewedClinicField[] = [];

  for (const header of headers) {
    const result = reviewClinicField(header);

    if (result.status === "allowed") {
      acceptedHeaders.push(result.normalizedHeader);
    } else if (result.status === "forbidden") {
      rejectedHeaders.push(result);
    } else {
      reviewHeaders.push(result);
    }
  }

  return {
    acceptedHeaders,
    rejectedHeaders,
    reviewHeaders,
  };
}

export function sanitizeClinicRecord(record: Record<string, unknown>): SanitizedClinicRecord {
  const allowedData: Record<string, unknown> = {};
  const rejectedFields: ReviewedClinicField[] = [];
  const reviewFields: ReviewedClinicField[] = [];

  for (const [header, value] of Object.entries(record)) {
    const result = reviewClinicField(header);

    if (result.status === "allowed") {
      allowedData[result.normalizedHeader] = value;
    } else if (result.status === "forbidden") {
      rejectedFields.push(result);
    } else {
      reviewFields.push(result);
    }
  }

  return {
    allowedData,
    rejectedFields,
    reviewFields,
  };
}
