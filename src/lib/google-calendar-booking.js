import { createSign, randomUUID } from "node:crypto";

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const GOOGLE_CALENDAR_API_ROOT = "https://www.googleapis.com/calendar/v3";
const DEFAULT_TIME_ZONE = "Europe/Amsterdam";
const DEFAULT_DURATION_MINUTES = 15;

export function isCalendarBookingConfigured(env = process.env) {
  return Boolean(
    env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL?.trim() &&
      env.GOOGLE_CALENDAR_PRIVATE_KEY?.trim() &&
      env.GOOGLE_CALENDAR_ID?.trim(),
  );
}

export async function createCalendarBookingEvent(payload, options = {}) {
  const env = options.env ?? process.env;
  const token = await getGoogleAccessToken(env);
  const event = buildCalendarEvent(payload, options);
  const response = await fetch(
    `${GOOGLE_CALENDAR_API_ROOT}/calendars/${encodeURIComponent(env.GOOGLE_CALENDAR_ID)}/events?conferenceDataVersion=${event.conferenceData ? 1 : 0}&sendUpdates=all`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(event),
    },
  );

  if (!response.ok) {
    const details = await safeReadText(response);
    throw new Error(`Google Calendar booking failed (${response.status}): ${details}`);
  }

  return response.json();
}

export function buildCalendarEvent(payload, options = {}) {
  const timeZone = options.timeZone ?? DEFAULT_TIME_ZONE;
  const durationMinutes = options.durationMinutes ?? DEFAULT_DURATION_MINUTES;
  const end = addMinutesToDateTimeLocal(payload.preferredSlot, durationMinutes);
  const wantsMeet = payload.meetingFormat === "video";

  return {
    summary: "Renvoo validation meeting",
    description: buildCalendarDescription(payload),
    start: {
      dateTime: toCalendarDateTime(payload.preferredSlot),
      timeZone,
    },
    end: {
      dateTime: toCalendarDateTime(end),
      timeZone,
    },
    location: meetingLocationFor(payload.meetingFormat),
    attendees: payload.contactEmail
      ? [
          {
            email: payload.contactEmail,
            displayName: payload.contactName || undefined,
          },
        ]
      : [],
    guestsCanModify: false,
    guestsCanSeeOtherGuests: true,
    reminders: {
      useDefault: true,
    },
    extendedProperties: {
      private: {
        locale: payload.locale ?? "en-US",
        clinicName: payload.clinicName ?? "",
        role: payload.role ?? "",
        primaryPain: payload.primaryPain ?? "",
        mode: payload.mode ?? "website",
      },
    },
    conferenceData: wantsMeet
      ? {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        }
      : undefined,
  };
}

async function getGoogleAccessToken(env) {
  const assertion = buildServiceAccountAssertion(env);
  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const details = await safeReadText(response);
    throw new Error(`Google OAuth token request failed (${response.status}): ${details}`);
  }

  const json = await response.json();
  if (!json.access_token) {
    throw new Error("Google OAuth token response did not include an access token.");
  }

  return json.access_token;
}

function buildServiceAccountAssertion(env) {
  const serviceAccountEmail = env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

  if (!serviceAccountEmail || !privateKey) {
    throw new Error("Google Calendar service account credentials are incomplete.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64urlJson({
    alg: "RS256",
    typ: "JWT",
  });
  const claimSet = {
    iss: serviceAccountEmail,
    scope: GOOGLE_CALENDAR_SCOPE,
    aud: GOOGLE_OAUTH_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const subject = env.GOOGLE_CALENDAR_DELEGATED_USER?.trim();
  if (subject) {
    claimSet.sub = subject;
  }

  const payload = base64urlJson(claimSet);
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey).toString("base64url");

  return `${unsignedToken}.${signature}`;
}

function buildCalendarDescription(payload) {
  const lines = [
    "Renvoo website booking request",
    "",
    `Clinic: ${payload.clinicName ?? ""}`,
    `Contact: ${payload.contactName ?? ""} (${payload.contactEmail ?? ""})`,
    `Role: ${payload.role ?? ""}`,
    `Primary pain: ${payload.primaryPain ?? ""}`,
    `Current workflow: ${payload.workflowNotes ?? ""}`,
  ];

  if (payload.backupSlot) {
    lines.push(`Backup slot: ${payload.backupSlot}`);
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

  return "";
}

function addMinutesToDateTimeLocal(value, minutesToAdd) {
  const [datePart, timePart] = String(value).split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  date.setUTCMinutes(date.getUTCMinutes() + minutesToAdd);

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function toCalendarDateTime(value) {
  return `${value}:00`;
}

function base64urlJson(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch {
    return "Unable to read error body.";
  }
}

function pad(value) {
  return String(value).padStart(2, "0");
}
