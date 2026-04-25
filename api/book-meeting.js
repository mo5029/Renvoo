import {
  BOOKING_HOST_EMAIL,
  createGoogleCalendarUrl,
  validateBookingStep,
} from "../src/site/lib/booking.js";
import {
  createCalendarBookingEvent,
  isCalendarBookingConfigured,
} from "../src/lib/google-calendar-booking.js";

function normalizePayload(payload) {
  return {
    contactName: String(payload?.contactName ?? "").trim(),
    contactEmail: String(payload?.contactEmail ?? "").trim(),
    role: String(payload?.role ?? "").trim(),
    clinicName: String(payload?.clinicName ?? "").trim(),
    city: String(payload?.city ?? "").trim(),
    clinicSize: String(payload?.clinicSize ?? "").trim(),
    primaryPain: String(payload?.primaryPain ?? "").trim(),
    workflowNotes: String(payload?.workflowNotes ?? "").trim(),
    meetingFormat: String(payload?.meetingFormat ?? "").trim(),
    preferredSlot: String(payload?.preferredSlot ?? "").trim(),
    backupSlot: String(payload?.backupSlot ?? "").trim(),
    locale: String(payload?.locale ?? "en-US").trim(),
    page: String(payload?.page ?? "pilot").trim(),
    mode: String(payload?.mode ?? "website").trim(),
    submittedAt: String(payload?.submittedAt ?? new Date().toISOString()).trim(),
  };
}

export async function POST(request) {
  let payload;

  try {
    payload = normalizePayload(await request.json());
  } catch {
    return Response.json(
      {
        success: false,
        error: "Invalid booking request payload.",
      },
      { status: 400 },
    );
  }

  const validationErrors = {
    ...validateBookingStep(1, payload),
    ...validateBookingStep(2, payload),
  };

  if (Object.keys(validationErrors).length > 0) {
    return Response.json(
      {
        success: false,
        error: "Booking request failed validation.",
        fields: validationErrors,
      },
      { status: 400 },
    );
  }

  const fallbackCalendarUrl = createGoogleCalendarUrl(payload);
  const fallbackResponse = {
    success: true,
    mode: "draft-fallback",
    calendarUrl: fallbackCalendarUrl,
    hostEmail: BOOKING_HOST_EMAIL,
    note: "Live host-side calendar booking is not configured yet, so the site returned the Google Calendar draft flow instead.",
  };

  if (!isCalendarBookingConfigured()) {
    return Response.json(fallbackResponse);
  }

  try {
    const event = await createCalendarBookingEvent(payload);
    return Response.json({
      success: true,
      mode: "calendar-event",
      hostEmail: BOOKING_HOST_EMAIL,
      eventId: event.id,
      htmlLink: event.htmlLink ?? "",
      meetLink: event.hangoutLink ?? "",
      status: event.status ?? "confirmed",
      note: "The meeting was added to Mohamed's calendar and the contact email was invited.",
    });
  } catch (error) {
    return Response.json({
      ...fallbackResponse,
      warning: error instanceof Error ? error.message : String(error),
    });
  }
}
