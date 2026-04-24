const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navShell = document.querySelector("[data-nav-shell]");
const yearSlot = document.querySelector("[data-year]");

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}

setupHeader();
setupReveal();
setupTracking();
setupContactForm();

function setupHeader() {
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
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavState(!isOpen);
  });

  navShell.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavState(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      setNavState(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavState(false);
    }
  });
}

function setupReveal() {
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
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupTracking() {
  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      emitEvent(element.getAttribute("data-track") ?? "interaction", {
        label: element.textContent?.trim() ?? "",
        href: element.getAttribute("href") ?? "",
      });
    });
  });
}

function emitEvent(name, detail = {}) {
  const payload = {
    event: name,
    locale: body.dataset.locale ?? "nl",
    page: body.dataset.page ?? "",
    timestamp: new Date().toISOString(),
    ...detail,
  };

  window.dispatchEvent(new CustomEvent("renvoo:track", { detail: payload }));

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  if (typeof window.renvooTrack === "function") {
    window.renvooTrack(payload);
  }
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const status = form.querySelector("[data-contact-status]");
  const summary = form.querySelector("[data-contact-summary]");
  const copyButton = form.querySelector("[data-contact-copy]");
  const mailButton = form.querySelector("[data-contact-mail]");
  const contactEmail = form.dataset.contactEmail ?? "";
  const locale = body.dataset.locale === "en" ? "en" : "nl";
  const translations = {
    nl: {
      required: "Vul dit veld in.",
      email: "Gebruik een geldig e-mailadres.",
      success:
        "De samenvatting is klaar. Open de e-mail of kopieer de tekst voor uw follow-up.",
      copied: "De samenvatting is gekopieerd.",
      missingEmail:
        "Er is nog geen publiek contactadres ingesteld. Kopieer de samenvatting en verstuur die via uw gewenste kanaal.",
      subject: "Workflow review voor Renvoo",
    },
    en: {
      required: "Please fill in this field.",
      email: "Use a valid email address.",
      success: "The summary is ready. Open the email or copy the text for follow-up.",
      copied: "The summary has been copied.",
      missingEmail:
        "No public contact email is configured yet. Copy the summary and send it through your preferred channel.",
      subject: "Renvoo workflow review request",
    },
  }[locale];

  let latestSummary = "";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);

    const values = Object.fromEntries(new FormData(form).entries());
    const errors = validateContactValues(values, translations);

    if (Object.keys(errors).length > 0) {
      applyErrors(form, errors);
      const firstField = form.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      if (firstField instanceof HTMLElement) {
        firstField.focus();
      }
      return;
    }

    latestSummary = buildSummary(values, locale);
    if (summary instanceof HTMLElement) {
      summary.hidden = false;
      summary.textContent = latestSummary;
    }

    if (copyButton instanceof HTMLButtonElement) {
      copyButton.hidden = false;
    }

    if (mailButton instanceof HTMLButtonElement) {
      mailButton.hidden = false;
    }

    if (status instanceof HTMLElement) {
      status.textContent = contactEmail ? translations.success : translations.missingEmail;
    }

    emitEvent("contact_request_created", {
      hasConfiguredEmail: Boolean(contactEmail),
      role: String(values.role ?? ""),
      clinic: String(values.clinic ?? ""),
    });
  });

  copyButton?.addEventListener("click", async () => {
    if (!latestSummary) {
      return;
    }

    await navigator.clipboard.writeText(latestSummary);
    if (status instanceof HTMLElement) {
      status.textContent = translations.copied;
    }
  });

  mailButton?.addEventListener("click", () => {
    if (!latestSummary) {
      return;
    }

    if (!contactEmail) {
      if (status instanceof HTMLElement) {
        status.textContent = translations.missingEmail;
      }
      return;
    }

    const href = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(translations.subject)}&body=${encodeURIComponent(latestSummary)}`;
    window.location.href = href;
  });
}

function validateContactValues(values, translations) {
  const errors = {};
  const requiredFields = ["name", "clinic", "role", "email", "preferredTime", "challenge"];

  for (const field of requiredFields) {
    if (!String(values[field] ?? "").trim()) {
      errors[field] = translations.required;
    }
  }

  const email = String(values.email ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = translations.email;
  }

  return errors;
}

function buildSummary(values, locale) {
  const intro =
    locale === "en"
      ? "Renvoo workflow review request"
      : "Verzoek voor een Renvoo workflow review";

  const labels =
    locale === "en"
      ? {
          name: "Name",
          clinic: "Clinic",
          role: "Role",
          email: "Email",
          phone: "Phone",
          preferredTime: "Preferred time",
          challenge: "Main challenge",
          notes: "Extra context",
        }
      : {
          name: "Naam",
          clinic: "Praktijk",
          role: "Rol",
          email: "E-mail",
          phone: "Telefoon",
          preferredTime: "Voorkeurstijd",
          challenge: "Grootste pijnpunt",
          notes: "Extra context",
        };

  return [
    intro,
    "",
    `${labels.name}: ${String(values.name ?? "").trim()}`,
    `${labels.clinic}: ${String(values.clinic ?? "").trim()}`,
    `${labels.role}: ${String(values.role ?? "").trim()}`,
    `${labels.email}: ${String(values.email ?? "").trim()}`,
    `${labels.phone}: ${String(values.phone ?? "").trim() || "-"}`,
    `${labels.preferredTime}: ${String(values.preferredTime ?? "").trim()}`,
    "",
    `${labels.challenge}:`,
    String(values.challenge ?? "").trim(),
    "",
    `${labels.notes}:`,
    String(values.notes ?? "").trim() || "-",
  ].join("\n");
}

function applyErrors(form, errors) {
  for (const [name, message] of Object.entries(errors)) {
    const field = form.querySelector(`[name="${name}"]`);
    const errorSlot = form.querySelector(`[data-field-error="${name}"]`);

    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
      field.setAttribute("aria-invalid", "true");
    }

    if (errorSlot instanceof HTMLElement) {
      errorSlot.textContent = message;
    }
  }
}

function clearErrors(form) {
  form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
    field.removeAttribute("aria-invalid");
  });

  form.querySelectorAll("[data-field-error]").forEach((slot) => {
    slot.textContent = "";
  });
}
