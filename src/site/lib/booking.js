export const BOOKING_STORAGE_KEY = "renvoo-booking-requests";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const bookingFieldOrder = [
  "contactName",
  "contactEmail",
  "role",
  "clinicName",
  "city",
  "clinicSize",
  "primaryPain",
  "workflowNotes",
  "meetingFormat",
  "availability",
];

export function collectBookingValues(form) {
  const formData = new FormData(form);

  return {
    contactName: formData.get("contactName")?.toString().trim() ?? "",
    contactEmail: formData.get("contactEmail")?.toString().trim() ?? "",
    role: formData.get("role")?.toString().trim() ?? "",
    clinicName: formData.get("clinicName")?.toString().trim() ?? "",
    city: formData.get("city")?.toString().trim() ?? "",
    clinicSize: formData.get("clinicSize")?.toString().trim() ?? "",
    primaryPain: formData.get("primaryPain")?.toString().trim() ?? "",
    workflowNotes: formData.get("workflowNotes")?.toString().trim() ?? "",
    meetingFormat: formData.get("meetingFormat")?.toString().trim() ?? "",
    availability: formData
      .getAll("availability")
      .map((value) => value.toString().trim())
      .filter(Boolean),
  };
}

export function validateBookingStep(step, values) {
  const errors = {};

  if (step === 1) {
    if (!values.contactName) {
      errors.contactName = "required";
    }

    if (!values.contactEmail) {
      errors.contactEmail = "required";
    } else if (!EMAIL_PATTERN.test(values.contactEmail)) {
      errors.contactEmail = "email";
    }

    if (!values.role) {
      errors.role = "required";
    }

    if (!values.clinicName) {
      errors.clinicName = "required";
    }

    if (!values.city) {
      errors.city = "required";
    }

    if (!values.clinicSize) {
      errors.clinicSize = "required";
    }

    if (!values.primaryPain) {
      errors.primaryPain = "required";
    }

    if (!values.workflowNotes) {
      errors.workflowNotes = "required";
    } else if (values.workflowNotes.length < 16) {
      errors.workflowNotes = "tooShort";
    }
  }

  if (step === 2) {
    if (!values.meetingFormat) {
      errors.meetingFormat = "required";
    }

    if (!values.availability.length) {
      errors.availability = "required";
    }
  }

  return errors;
}

export function getFirstInvalidField(errors) {
  return bookingFieldOrder.find((field) => field in errors) ?? null;
}

export function createBookingPayload(values, meta = {}) {
  return {
    ...values,
    submittedAt: meta.submittedAt ?? new Date().toISOString(),
    locale: meta.locale ?? "en",
    page: meta.page ?? "pilot",
    mode: meta.mode ?? "preview",
  };
}

export function persistBookingRequest(payload) {
  const existing = readStoredBookingRequests();
  const updated = [payload, ...existing].slice(0, 20);
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updated));
}

export function readStoredBookingRequests() {
  if (typeof localStorage === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function createPlainTextSummary(payload, labels) {
  const availabilitySummary = payload.availability
    .map((value) => labels.availability[value] ?? value)
    .join(", ");

  return [
    `${labels.summaryTitle}`,
    "",
    `${labels.contactName}: ${payload.contactName}`,
    `${labels.contactEmail}: ${payload.contactEmail}`,
    `${labels.role}: ${labels.roles[payload.role] ?? payload.role}`,
    `${labels.clinicName}: ${payload.clinicName}`,
    `${labels.city}: ${payload.city}`,
    `${labels.clinicSize}: ${labels.clinicSizes[payload.clinicSize] ?? payload.clinicSize}`,
    `${labels.primaryPain}: ${labels.primaryPains[payload.primaryPain] ?? payload.primaryPain}`,
    `${labels.workflowNotes}: ${payload.workflowNotes}`,
    `${labels.meetingFormat}: ${labels.meetingFormats[payload.meetingFormat] ?? payload.meetingFormat}`,
    `${labels.availabilityTitle}: ${availabilitySummary}`,
    `${labels.submittedAt}: ${payload.submittedAt}`,
    `${labels.mode}: ${payload.mode}`,
  ].join("\n");
}

export function createDownloadFile(summary, fileName) {
  const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
  return {
    fileName,
    href: URL.createObjectURL(blob),
  };
}
