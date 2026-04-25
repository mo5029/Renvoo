export const BOOKING_STORAGE_KEY = "renvoo-booking-requests";
export const BOOKING_TIME_ZONE = "Europe/Amsterdam";
export const BOOKING_DURATION_MINUTES = 15;
export const BOOKING_HOST_EMAIL = "mohamed.ibrahim5029@gmail.com";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATETIME_LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

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
  "preferredSlot",
  "backupSlot",
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
    preferredSlot: formData.get("preferredSlot")?.toString().trim() ?? "",
    backupSlot: formData.get("backupSlot")?.toString().trim() ?? "",
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

    if (!values.preferredSlot) {
      errors.preferredSlot = "required";
    } else if (!DATETIME_LOCAL_PATTERN.test(values.preferredSlot)) {
      errors.preferredSlot = "dateTime";
    }

    if (values.backupSlot && !DATETIME_LOCAL_PATTERN.test(values.backupSlot)) {
      errors.backupSlot = "dateTime";
    } else if (values.backupSlot && values.backupSlot === values.preferredSlot) {
      errors.backupSlot = "differentDateTime";
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
    `${labels.preferredSlot}: ${formatBookingDateTime(payload.preferredSlot, payload.locale)}`,
    `${labels.backupSlot}: ${payload.backupSlot ? formatBookingDateTime(payload.backupSlot, payload.locale) : "—"}`,
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

export function formatBookingDateTime(value, locale = "en-US") {
  if (!DATETIME_LOCAL_PATTERN.test(value)) {
    return value;
  }

  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export function createGoogleCalendarUrl(payload) {
  if (!payload.preferredSlot || !DATETIME_LOCAL_PATTERN.test(payload.preferredSlot)) {
    return "";
  }

  const start = payload.preferredSlot;
  const end = addMinutesToDateTimeLocal(start, BOOKING_DURATION_MINUTES);
  const guests = [BOOKING_HOST_EMAIL].filter(Boolean).join(",");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Renvoo validation meeting",
    dates: `${toGoogleCalendarDate(start)}/${toGoogleCalendarDate(end)}`,
    ctz: BOOKING_TIME_ZONE,
    details: createCalendarDetails(payload),
    location: meetingLocationFor(payload.meetingFormat),
  });

  if (guests) {
    params.set("add", guests);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function createCalendarDetails(payload) {
  const lines = [
    `Clinic: ${payload.clinicName}`,
    `Contact: ${payload.contactName} (${payload.contactEmail})`,
    `Role: ${payload.role}`,
    `Primary pain: ${payload.primaryPain}`,
    `Current workflow: ${payload.workflowNotes}`,
  ];

  if (payload.backupSlot) {
    lines.push(`Backup time: ${formatBookingDateTime(payload.backupSlot, payload.locale)}`);
  }

  return lines.join("\n");
}

function meetingLocationFor(meetingFormat) {
  if (meetingFormat === "phone") {
    return "Phone call";
  }

  if (meetingFormat === "onsite") {
    return "Clinic location to confirm";
  }

  return "Google Meet link to follow";
}

function addMinutesToDateTimeLocal(value, minutesToAdd) {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  date.setUTCMinutes(date.getUTCMinutes() + minutesToAdd);

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function toGoogleCalendarDate(value) {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-");
  const [hours, minutes] = timePart.split(":");
  return `${year}${month}${day}T${hours}${minutes}00`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}
