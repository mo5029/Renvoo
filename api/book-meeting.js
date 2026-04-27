import { buildMeetingNotificationEmail, getMeetingNotificationConfig, parseMeetingRequest } from "../src/lib/meeting-request.js";

export async function POST(request) {
  let input;

  try {
    input = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = parseMeetingRequest(input);
  if (!parsed.ok) {
    return Response.json(
      {
        success: false,
        error: "Meeting request is invalid.",
        details: parsed.errors,
      },
      { status: 400 },
    );
  }

  const config = getMeetingNotificationConfig();
  if (!config.apiKey || !config.fromEmail || !config.notificationEmail) {
    return Response.json(
      {
        success: false,
        error: "Resend is not configured.",
      },
      { status: 503 },
    );
  }

  const payload = parsed.data;
  const email = buildMeetingNotificationEmail(payload);

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "renvoo-booking/1.0",
        "Idempotency-Key": [
          payload.contactEmail,
          payload.clinicName,
          payload.preferredSlot,
        ].join(":"),
      },
      body: JSON.stringify({
        from: config.fromEmail,
        to: [config.notificationEmail],
        subject: email.subject,
        html: email.html,
        text: email.text,
        reply_to: payload.contactEmail,
        tags: [
          { name: "source", value: "website" },
          { name: "flow", value: "meeting-request" },
          { name: "locale", value: payload.locale },
        ],
      }),
    });

    const resendJson = await resendResponse.json().catch(() => null);
    if (!resendResponse.ok) {
      return Response.json(
        {
          success: false,
          error: resendJson?.message || "Resend failed to send the meeting notification.",
        },
        { status: 502 },
      );
    }

    return Response.json({
      success: true,
      mode: "email-notification",
      emailId: resendJson?.id ?? "",
      notificationEmail: config.notificationEmail,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: "Resend request failed before the notification could be sent.",
      },
      { status: 502 },
    );
  }
}
