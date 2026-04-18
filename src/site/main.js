import {
  BOOKING_STORAGE_KEY,
  collectBookingValues,
  createBookingPayload,
  createDownloadFile,
  createPlainTextSummary,
  getFirstInvalidField,
  persistBookingRequest,
  validateBookingStep,
} from "./lib/booking.js";
import { siteContent } from "./lib/site-content.js";

const body = document.body;
const currentLang = body.dataset.lang === "en" ? "en" : "nl";
const copy = siteContent[currentLang];
const yearSlot = document.querySelector("[data-year]");

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}

body.classList.add("js-ready");
requestAnimationFrame(() => {
  body.classList.add("is-loaded");
});

setupHeader();
setupRevealMotion();
setupTracking();
setupBookingFlow();

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
  const successSummary = successPanel?.querySelector("[data-success-summary]");
  const successStatus = successPanel?.querySelector("[data-success-status]");
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
      setStep(["meetingFormat", "availability"].includes(firstField ?? "") ? 2 : 1);
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

    await new Promise((resolve) => window.setTimeout(resolve, 520));

    persistBookingRequest(payload);
    latestSummary = createPlainTextSummary(payload, labelMaps);

    if (successSummary instanceof HTMLElement) {
      successSummary.textContent = latestSummary;
    }

    form.hidden = true;
    if (successPanel instanceof HTMLElement) {
      successPanel.hidden = false;
    }

    if (status instanceof HTMLElement) {
      status.textContent = labels.statusSuccess;
    }

    emitFunnelEvent("booking_submitted", {
      mode: "preview",
      availabilityCount: payload.availability.length,
      meetingFormat: payload.meetingFormat,
    });

    setSubmitting(false);
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
    form.hidden = false;
    if (successPanel instanceof HTMLElement) {
      successPanel.hidden = true;
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
      backButton.hidden = currentStep === 1;
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
    availabilityTitle: labels.availabilityTitle,
    roles: Object.fromEntries(booking.roles.map((item) => [item.value, item.label])),
    clinicSizes: Object.fromEntries(booking.clinicSizes.map((item) => [item.value, item.label])),
    primaryPains: Object.fromEntries(booking.primaryPains.map((item) => [item.value, item.label])),
    meetingFormats: Object.fromEntries(booking.meetingFormats.map((item) => [item.value, item.label])),
    availability: Object.fromEntries(
      booking.availability.map((item) => [item.value, `${item.label} (${item.detail})`]),
    ),
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
    [
      labelMaps.availabilityTitle,
      values.availability.map((item) => labelMaps.availability[item] ?? item).join(", "),
    ],
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
    const message = fieldName === "availability" ? errorCopy.availability : errorCopy[errorKey];
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
