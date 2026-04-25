export interface BookingValues {
  contactName: string;
  contactEmail: string;
  role: string;
  clinicName: string;
  city: string;
  clinicSize: string;
  primaryPain: string;
  workflowNotes: string;
  meetingFormat: string;
  preferredSlot: string;
  backupSlot: string;
}

export interface BookingPayload extends BookingValues {
  submittedAt: string;
  locale: string;
  page: string;
  mode: string;
}

export declare const BOOKING_STORAGE_KEY: string;
export declare const BOOKING_TIME_ZONE: string;
export declare const BOOKING_DURATION_MINUTES: number;
export declare const BOOKING_HOST_EMAIL: string;
export declare const bookingFieldOrder: string[];

export declare function collectBookingValues(form: HTMLFormElement): BookingValues;
export declare function validateBookingStep(step: number, values: BookingValues): Record<string, string>;
export declare function getFirstInvalidField(errors: Record<string, string>): string | null;
export declare function createBookingPayload(
  values: BookingValues,
  meta?: Partial<Pick<BookingPayload, "submittedAt" | "locale" | "page" | "mode">>,
): BookingPayload;
export declare function persistBookingRequest(payload: BookingPayload): void;
export declare function readStoredBookingRequests(): BookingPayload[];
export declare function createPlainTextSummary(
  payload: BookingPayload,
  labels: {
    summaryTitle: string;
    submittedAt: string;
    mode: string;
    contactName: string;
    contactEmail: string;
    role: string;
    clinicName: string;
    city: string;
    clinicSize: string;
    primaryPain: string;
    workflowNotes: string;
    meetingFormat: string;
    preferredSlot: string;
    backupSlot: string;
    roles: Record<string, string>;
    clinicSizes: Record<string, string>;
    primaryPains: Record<string, string>;
    meetingFormats: Record<string, string>;
  },
): string;
export declare function createDownloadFile(summary: string, fileName: string): {
  fileName: string;
  href: string;
};
export declare function formatBookingDateTime(value: string, locale?: string): string;
export declare function createGoogleCalendarUrl(payload: BookingPayload): string;
