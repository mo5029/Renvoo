import {
  BOOKING_STORAGE_KEY,
  collectBookingValues,
  createBookingPayload,
  createDownloadFile,
  createGoogleCalendarUrl,
  createPlainTextSummary,
  formatBookingDateTime,
  getFirstInvalidField,
  persistBookingRequest,
  validateBookingStep,
} from "./lib/booking.js";
import {
  getStoredLocale,
  localizeInternalHref,
  setStoredLocale,
  translatePathname,
} from "./lib/locale.js";
import { siteContent } from "./lib/site-content.js";

const body = document.body;
const currentLang = body.dataset.lang === "en" ? "en" : "nl";
const copy = siteContent[currentLang];
const yearSlot = document.querySelector("[data-year]");
const isRedirectingForLocale = setupLocalePreference();

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}

if (!isRedirectingForLocale) {
  body.classList.add("js-ready");
  requestAnimationFrame(() => {
    body.classList.add("is-loaded");
  });

  setupHeader();
  setupRevealMotion();
  setupTracking();
  setupBookingFlow();
}

function setupHeader() {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navShell = document.querySelector("[data-site-nav-shell]");

  const syncHeaderState = () => {
    if (!header) {
      return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });

  if (!(navToggle instanceof HTMLButtonElement) || !(navShell instanceof HTMLElement)) {
    return;
  }

  const setNavState = (isOpen) => {
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navShell.classList.toggle("is-open", isOpen);
    body.classList.toggle("nav-open", isOpen);
  };

  navToggle.addEventListener("click", () => {
    const nextState = navToggle.getAttribute("aria-expanded") !== "true";
    setNavState(nextState);
  });

  navShell.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavState(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      setNavState(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavState(false);
    }
  });
}

function setupRevealMotion() {
  const revealElements = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupTracking() {
  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      emitFunnelEvent(element.getAttribute("data-track") ?? "interaction", {
        label: element.textContent?.trim() ?? "",
        href: element instanceof HTMLAnchorElement ? element.getAttribute("href") ?? "" : "",
      });
    });
  });
}

function emitFunnelEvent(eventName, detail = {}) {
  const payload = {
    event: eventName,
    lang: currentLang,
    page: body.dataset.page ?? "",
    timestamp: new Date().toISOString(),
    ...detail,
  };

  window.dispatchEvent(new CustomEvent("renvoo:funnel", { detail: payload }));

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  if (typeof window.renvooTrack === "function") {
    window.renvooTrack(payload);
  }
}

function setupLocalePreference() {
  const preferredLocale = getStoredLocale();
  const alternatePath =
    preferredLocale && preferredLocale !== currentLang
      ? translatePathname(window.location.pathname, preferredLocale)
      : null;

  if (alternatePath) {
    const nextUrl = `${alternatePath}${window.location.search}${window.location.hash}`;
    if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.location.replace(nextUrl);
      return true;
    }
  }

  if (!preferredLocale) {
    setStoredLocale(currentLang);
  }

  document.querySelectorAll("a[href]").forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    link.addEventListener("click", () => {
      const isLanguageSwitch =
        link.classList.contains("language-switch") ||
        link.getAttribute("data-track") === "language_switched" ||
        link.dataset.localeLink === "true";

      if (isLanguageSwitch) {
        const targetLang = link.dataset.targetLang === "en" ? "en" : link.dataset.targetLang === "nl" ? "nl" : currentLang === "en" ? "nl" : "en";
        setStoredLocale(targetLang);
        return;
      }

      const preferred = getStoredLocale() ?? currentLang;
      setStoredLocale(preferred);

      const localizedHref = localizeInternalHref(link.getAttribute("href") ?? "", preferred, window.location.href);
      if (localizedHref) {
        link.href = localizedHref;
      }
    });
  });

  return false;
}

function setupBookingFlow() {
  const form = document.querySelector("[data-booking-form]");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const booking = copy.booking;
  const labels = booking.labels;
  const status = form.querySelector("[data-form-status]");
  const backButton = form.querySelector("[data-booking-back]");
  const nextButton = form.querySelector("[data-booking-next]");
  const submitButton = form.querySelector("[data-booking-submit]");
  const successPanel = document.querySelector("[data-booking-success]");
  const successHeading = successPanel?.querySelector("[data-success-heading]");
  const successBody = successPanel?.querySelector("[data-success-body]");
  const successSummary = successPanel?.querySelector("[data-success-summary]");
  const successStatus = successPanel?.querySelector("[data-success-status]");
  const calendarButton = successPanel?.querySelector("[data-booking-calendar]");
  const copyButton = successPanel?.querySelector("[data-booking-copy]");
  const downloadButton = successPanel?.querySelector("[data-booking-download]");
  const restartButton = successPanel?.querySelector("[data-booking-restart]");
  const panels = Array.from(form.querySelectorAll("[data-step-panel]"));
  const markers = Array.from(form.querySelectorAll("[data-step-marker]"));
  const reviewList = form.querySelector("[data-review-list]");
  const labelMaps = createLabelMaps(booking, labels);

  let currentStep = 1;
  let started = false;
  let latestSummary = "";

  primeDateTimeFields(form);
  setStep(1);

  form.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
      return;
    }

    clearFieldError(form, target.name);

    if (currentStep === 3 && reviewList instanceof HTMLElement) {
      renderReviewList(reviewList, collectBookingValues(form), labelMaps);
    }
  });

  form.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
      return;
    }

    clearFieldError(form, target.name);
  });

  nextButton?.addEventListener("click", () => {
    const values = collectBookingValues(form);
    const errors = validateBookingStep(currentStep, values);

    if (Object.keys(errors).length) {
      applyErrors(form, errors, labels.errors);
      focusFirstField(form, getFirstInvalidField(errors));
      return;
    }

    if (currentStep === 1 && !started) {
      started = true;
      emitFunnelEvent("booking_started", {
        mode: "preview",
        storageKey: BOOKING_STORAGE_KEY,
      });
    }

    setStep(currentStep + 1);
  });

  backButton?.addEventListener("click", () => {
    setStep(currentStep - 1);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const values = collectBookingValues(form);
    const step1Errors = validateBookingStep(1, values);
    const step2Errors = validateBookingStep(2, values);
    const combinedErrors = { ...step1Errors, ...step2Errors };

    if (Object.keys(combinedErrors).length) {
      const firstField = getFirstInvalidField(combinedErrors);
      setStep(["meetingFormat", "preferredSlot", "backupSlot"].includes(firstField ?? "") ? 2 : 1);
      applyErrors(form, combinedErrors, labels.errors);
      focusFirstField(form, firstField);
      return;
    }

    setSubmitting(true);

    const payload = createBookingPayload(values, {
      locale: copy.locale,
      page: body.dataset.page ?? "pilot",
      mode: "preview",
    });
    const bookingResult = await submitBookingRequest(payload, labels);
    persistBookingRequest({
      ...payload,
      deliveryMode: bookingResult.mode,
      eventId: bookingResult.eventId ?? "",
      warning: bookingResult.warning ?? "",
    });
    latestSummary = createPlainTextSummary(payload, labelMaps);

    if (successSummary instanceof HTMLElement) {
      successSummary.textContent = latestSummary;
    }

    if (successHeading instanceof HTMLElement) {
      successHeading.textContent = bookingResult.heading;
    }

    if (successBody instanceof HTMLElement) {
      successBody.textContent = bookingResult.body;
    }

    if (calendarButton instanceof HTMLAnchorElement) {
      calendarButton.hidden = !bookingResult.actionUrl;
      calendarButton.textContent = bookingResult.actionLabel;
      if (bookingResult.actionUrl) {
        calendarButton.href = bookingResult.actionUrl;
      }
    }

    form.hidden = true;
    if (successPanel instanceof HTMLElement) {
      successPanel.hidden = false;
    }

    if (status instanceof HTMLElement) {
      status.textContent = bookingResult.statusMessage;
    }

    emitFunnelEvent("booking_submitted", {
      mode: bookingResult.mode,
      hasBackupSlot: Boolean(payload.backupSlot),
      meetingFormat: payload.meetingFormat,
      hostCalendarBooking: bookingResult.mode === "calendar-event",
    });

    setSubmitting(false);
  });

  calendarButton?.addEventListener("click", () => {
    setSuccessStatus(labels.calendarReady);
  });

  copyButton?.addEventListener("click", async () => {
    if (!latestSummary) {
      return;
    }

    try {
      await navigator.clipboard.writeText(latestSummary);
      setSuccessStatus(labels.copySuccess);
    } catch {
      setSuccessStatus(labels.copyFallback);
    }
  });

  downloadButton?.addEventListener("click", () => {
    if (!latestSummary) {
      return;
    }

    const fileName =
      currentLang === "nl" ? "renvoo-gespreksaanvraag.txt" : "renvoo-meeting-request.txt";
    const download = createDownloadFile(latestSummary, fileName);
    const link = document.createElement("a");
    link.href = download.href;
    link.download = download.fileName;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(download.href), 500);
    setSuccessStatus(labels.downloadReady);
  });

  restartButton?.addEventListener("click", () => {
    form.reset();
    clearAllErrors(form);
    primeDateTimeFields(form);
    form.hidden = false;
    if (successPanel instanceof HTMLElement) {
      successPanel.hidden = true;
    }
    if (calendarButton instanceof HTMLAnchorElement) {
      calendarButton.hidden = true;
      calendarButton.href = "#";
    }
    latestSummary = "";
    setSuccessStatus("");
    setStep(1);
    const firstInput = form.querySelector("input, select, textarea");
    if (firstInput instanceof HTMLElement) {
      firstInput.focus();
    }
  });

  function setStep(step) {
    currentStep = Math.max(1, Math.min(3, step));

    panels.forEach((panel) => {
      const panelStep = Number(panel.getAttribute("data-step-panel"));
      panel.hidden = panelStep !== currentStep;
    });

    markers.forEach((marker) => {
      const markerStep = Number(marker.getAttribute("data-step-marker"));
      marker.classList.toggle("is-active", markerStep === currentStep);
      marker.classList.toggle("is-complete", markerStep < currentStep);
    });

    if (backButton instanceof HTMLElement) {
      backButton.hidden = currentStep !== 3;
    }

    if (nextButton instanceof HTMLElement) {
      nextButton.hidden = currentStep === 3;
    }

    if (submitButton instanceof HTMLElement) {
      submitButton.hidden = currentStep !== 3;
    }

    if (status instanceof HTMLElement) {
      status.textContent =
        currentStep === 1 ? labels.statusReady : currentStep === 2 ? labels.statusStep2 : labels.statusReview;
    }

    if (currentStep === 3 && reviewList instanceof HTMLElement) {
      renderReviewList(reviewList, collectBookingValues(form), labelMaps);
    }
  }

  function setSubmitting(isSubmitting) {
    if (!(submitButton instanceof HTMLButtonElement)) {
      return;
    }

    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting
      ? currentLang === "nl"
        ? "Aanvraag versturen…"
        : "Submitting request…"
      : labels.buttons.submit;
  }

  function setSuccessStatus(message) {
    if (successStatus instanceof HTMLElement) {
      successStatus.textContent = message;
    }
  }
}

async function submitBookingRequest(payload, labels) {
  const fallback = {
    mode: "draft-fallback",
    heading: labels.statusSuccess,
    body: labels.successBody,
    statusMessage: labels.statusSuccess,
    actionUrl: createGoogleCalendarUrl(payload),
    actionLabel: labels.buttons.calendar,
    eventId: "",
    warning: "",
  };

  try {
    const response = await fetch("/api/book-meeting", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.success) {
      return {
        ...fallback,
        heading: labels.statusFallback,
        body: labels.successBodyFallback,
        statusMessage: labels.statusFallback,
      };
    }

    if (json.mode === "calendar-event") {
      return {
        mode: "calendar-event",
        heading: labels.statusBooked,
        body: labels.successBodyBooked,
        statusMessage: labels.statusBooked,
        actionUrl: json.meetLink || json.htmlLink || "",
        actionLabel: json.meetLink ? labels.buttons.meet : labels.buttons.calendarBooked,
        eventId: json.eventId ?? "",
        warning: "",
      };
    }

    if (json.mode === "email-notification") {
      return {
        mode: "email-notification",
        heading: labels.statusNotified,
        body: labels.successBodyNotified,
        statusMessage: labels.statusNotified,
        actionUrl: "",
        actionLabel: "",
        eventId: json.emailId ?? "",
        warning: "",
      };
    }

    return {
      ...fallback,
      actionUrl: json.calendarUrl || fallback.actionUrl,
      warning: json.warning ?? "",
      heading: json.warning ? labels.statusFallback : fallback.heading,
      body: json.warning ? labels.successBodyFallback : fallback.body,
      statusMessage: json.warning ? labels.statusFallback : fallback.statusMessage,
    };
  } catch {
    return {
      ...fallback,
      heading: labels.statusFallback,
      body: labels.successBodyFallback,
      statusMessage: labels.statusFallback,
    };
  }
}

function createLabelMaps(booking, labels) {
  return {
    summaryTitle: labels.summaryTitle,
    submittedAt: labels.submittedAt,
    mode: labels.mode,
    contactName: labels.contactName,
    contactEmail: labels.contactEmail,
    role: labels.role,
    clinicName: labels.clinicName,
    city: labels.city,
    clinicSize: labels.clinicSize,
    primaryPain: labels.primaryPain,
    workflowNotes: labels.workflowNotes,
    meetingFormat: labels.meetingFormat,
    preferredSlot: labels.preferredSlot,
    backupSlot: labels.backupSlot,
    roles: Object.fromEntries(booking.roles.map((item) => [item.value, item.label])),
    clinicSizes: Object.fromEntries(booking.clinicSizes.map((item) => [item.value, item.label])),
    primaryPains: Object.fromEntries(booking.primaryPains.map((item) => [item.value, item.label])),
    meetingFormats: Object.fromEntries(booking.meetingFormats.map((item) => [item.value, item.label])),
  };
}

function renderReviewList(reviewList, values, labelMaps) {
  const rows = [
    [labelMaps.contactName, values.contactName],
    [labelMaps.contactEmail, values.contactEmail],
    [labelMaps.role, labelMaps.roles[values.role] ?? values.role],
    [labelMaps.clinicName, values.clinicName],
    [labelMaps.city, values.city],
    [labelMaps.clinicSize, labelMaps.clinicSizes[values.clinicSize] ?? values.clinicSize],
    [labelMaps.primaryPain, labelMaps.primaryPains[values.primaryPain] ?? values.primaryPain],
    [labelMaps.workflowNotes, values.workflowNotes],
    [labelMaps.meetingFormat, labelMaps.meetingFormats[values.meetingFormat] ?? values.meetingFormat],
    [labelMaps.preferredSlot, formatBookingDateTime(values.preferredSlot, copy.locale)],
    [labelMaps.backupSlot, values.backupSlot ? formatBookingDateTime(values.backupSlot, copy.locale) : "—"],
  ];

  reviewList.innerHTML = rows
    .map(
      ([label, value]) => `<div><dt>${label}</dt><dd>${value || "—"}</dd></div>`,
    )
    .join("");
}

function applyErrors(form, errors, errorCopy) {
  clearAllErrors(form);

  Object.entries(errors).forEach(([fieldName, errorKey]) => {
    const message = errorCopy[errorKey] ?? errorCopy.required;
    const errorSlot = form.querySelector(`[data-field-error="${fieldName}"]`);
    if (errorSlot instanceof HTMLElement) {
      errorSlot.textContent = message;
    }

    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field instanceof HTMLElement) {
      field.setAttribute("aria-invalid", "true");
    }
  });
}

function clearAllErrors(form) {
  form.querySelectorAll("[data-field-error]").forEach((slot) => {
    if (slot instanceof HTMLElement) {
      slot.textContent = "";
    }
  });

  form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
    field.setAttribute("aria-invalid", "false");
  });
}

function clearFieldError(form, fieldName) {
  const errorSlot = form.querySelector(`[data-field-error="${fieldName}"]`);
  if (errorSlot instanceof HTMLElement) {
    errorSlot.textContent = "";
  }

  form.querySelectorAll(`[name="${fieldName}"]`).forEach((field) => {
    if (field instanceof HTMLElement) {
      field.setAttribute("aria-invalid", "false");
    }
  });
}

function focusFirstField(form, fieldName) {
  if (!fieldName) {
    return;
  }

  const field = form.querySelector(`[name="${fieldName}"]`);
  if (field instanceof HTMLElement) {
    field.focus();
  }
}

function primeDateTimeFields(form) {
  const dateInputs = form.querySelectorAll('input[type="datetime-local"]');
  if (!dateInputs.length) {
    return;
  }

  const minValue = getNextQuarterHourValue();
  dateInputs.forEach((input) => {
    if (input instanceof HTMLInputElement) {
      input.min = minValue;
    }
  });
}

function getNextQuarterHourValue() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 45);
  now.setSeconds(0, 0);
  const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
  if (roundedMinutes === 60) {
    now.setHours(now.getHours() + 1, 0, 0, 0);
  } else {
    now.setMinutes(roundedMinutes, 0, 0);
  }

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}
