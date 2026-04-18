import { pageFileNames, pageOrder, siteContent } from "./site-content.js";

const pageSequence = [
  { lang: "nl", page: "home" },
  { lang: "nl", page: "product" },
  { lang: "nl", page: "pilot" },
  { lang: "nl", page: "trust" },
  { lang: "nl", page: "privacy" },
  { lang: "nl", page: "patientNotice" },
  { lang: "nl", page: "notFound" },
  { lang: "en", page: "home" },
  { lang: "en", page: "product" },
  { lang: "en", page: "pilot" },
  { lang: "en", page: "trust" },
  { lang: "en", page: "privacy" },
  { lang: "en", page: "patientNotice" },
  { lang: "en", page: "notFound" },
];

function prefixForLang(lang) {
  return lang === "en" ? ".." : ".";
}

function outputPathFor(lang, page) {
  const fileName = pageFileNames[page];
  return lang === "en" ? `en/${fileName}` : fileName;
}

function routeFor(currentLang, targetLang, page, hash = "") {
  const fileName = pageFileNames[page];
  const filePath =
    currentLang === targetLang
      ? `./${fileName}`
      : currentLang === "en"
        ? `../${fileName}`
        : `./en/${fileName}`;

  return `${filePath}${hash}`;
}

function assetPath(prefix, relativePath) {
  return `${prefix}/${relativePath}`;
}

function renderDocument({ lang, page, content }) {
  const prefix = prefixForLang(lang);
  const routes = {
    home: routeFor(lang, lang, "home"),
    product: routeFor(lang, lang, "product"),
    pilot: routeFor(lang, lang, "pilot"),
    trust: routeFor(lang, lang, "trust"),
    booking: routeFor(lang, lang, "pilot", "#booking"),
    privacy: routeFor(lang, lang, "privacy"),
    patientNotice: routeFor(lang, lang, "patientNotice"),
    switch: routeFor(lang, lang === "nl" ? "en" : "nl", page),
  };
  const pageCopy = content.pages[page];
  const switchLabel = content.switchLabel;
  const switchLang = lang === "nl" ? "en" : "nl";
  const bodyClass = `page-${page} lang-${lang}`;

  return `<!doctype html>
<html lang="${content.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageCopy.seo.title}</title>
    <meta name="description" content="${pageCopy.seo.description}" />
    <meta name="theme-color" content="#f4efe7" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${pageCopy.seo.title}" />
    <meta property="og:description" content="${pageCopy.seo.description}" />
    <meta property="og:url" content="__CANONICAL_URL__" />
    <meta property="og:image" content="__SOCIAL_IMAGE__" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageCopy.seo.title}" />
    <meta name="twitter:description" content="${pageCopy.seo.description}" />
    <meta name="twitter:image" content="__SOCIAL_IMAGE__" />
    <link rel="canonical" href="__CANONICAL_URL__" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,700&display=swap" rel="stylesheet" />
    <link rel="icon" type="image/png" href="${assetPath(prefix, "icons/favicon.png")}" />
    <link rel="stylesheet" href="${assetPath(prefix, "styles.css")}" />
  </head>
  <body class="${bodyClass}" data-lang="${lang}" data-page="${page}" data-prefix="${prefix}" data-switch-lang="${switchLang}">
    <a class="skip-link" href="#content">${lang === "nl" ? "Ga naar inhoud" : "Skip to content"}</a>
    <div class="page-aura page-aura-left" aria-hidden="true"></div>
    <div class="page-aura page-aura-right" aria-hidden="true"></div>
    ${renderHeader(content, page, routes)}
    <main id="content" class="site-main">
      ${renderPageBody({ lang, page, content, routes, prefix })}
    </main>
    ${renderFooter(content, lang, page)}
    <script type="module" src="${assetPath(prefix, "main.js")}"></script>
  </body>
</html>
`;
}

function renderHeader(content, page, routes) {
  const navItems = ["home", "product", "pilot", "trust"]
    .map((navPage) => {
      const isActive = page === navPage ? "is-active" : "";
      return `<a class="${isActive}" href="${routes[navPage]}">${content.nav[navPage]}</a>`;
    })
    .join("");

  const menuLabel = content.htmlLang === "nl" ? "Open navigatie" : "Open navigation";

  return `<header class="site-header" data-header>
  <div class="site-header-inner">
    <a class="brand-mark" href="${routes.home}" aria-label="Renvoo ${content.pageNames.home}">
      <img src="${assetPath(prefixForLang(content.htmlLang === "nl" ? "nl" : "en"), "assets/renvoo-logo-horizontal.png")}" alt="Renvoo" width="1200" height="320" />
      <span>${content.brandLine}</span>
    </a>
    <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav" aria-label="${menuLabel}">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="site-nav-shell" data-site-nav-shell>
      <nav class="site-nav" id="site-nav" aria-label="Primary">
        ${navItems}
      </nav>
      <div class="site-header-actions">
        <a class="language-switch" href="${routes.switch}" data-track="language_switched">${content.switchLabel}</a>
        <a class="header-cta" href="${routes.booking}" data-track="nav_book_meeting">${content.nav.cta}</a>
      </div>
    </div>
  </div>
</header>`;
}

function renderFooter(content, lang, page) {
  const quickLinks = ["home", "product", "pilot", "trust"]
    .map(
      (footerPage) =>
        `<li><a href="${routeFor(lang, lang, footerPage)}">${content.pageNames[footerPage]}</a></li>`,
    )
    .join("");

  const legalLinks = content.footer.legalLinks
    .map(
      (link) =>
        `<li><a href="${routeFor(lang, lang, link.page)}">${link.label}</a></li>`,
    )
    .join("");

  const languageLinks = content.footer.languageLinks
    .map((link) => {
      const targetPage = page === "notFound" ? "notFound" : link.page;
      return `<li><a href="${routeFor(lang, link.lang, targetPage)}">${link.label}</a></li>`;
    })
    .join("");

  return `<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-summary">
      <p class="footer-kicker">Renvoo</p>
      <p>${content.footer.summary}</p>
    </div>
    <div>
      <p class="footer-title">${content.footer.quickLinksTitle}</p>
      <ul class="footer-links">${quickLinks}</ul>
    </div>
    <div>
      <p class="footer-title">${content.footer.legalTitle}</p>
      <ul class="footer-links">${legalLinks}</ul>
    </div>
    <div>
      <p class="footer-title">${content.footer.languageTitle}</p>
      <ul class="footer-links">${languageLinks}</ul>
    </div>
  </div>
  <div class="footer-meta">
    <p>${content.footer.proofNote}</p>
    <p><span data-year></span> Renvoo</p>
  </div>
</footer>`;
}

function renderPageBody({ lang, page, content, routes, prefix }) {
  switch (page) {
    case "home":
      return renderHomePage(content, routes);
    case "product":
      return renderProductPage(content, routes);
    case "pilot":
      return renderPilotPage(content, routes);
    case "trust":
      return renderTrustPage(content, routes, prefix);
    case "privacy":
      return renderLegalPage(content.pages.privacy);
    case "patientNotice":
      return renderLegalPage(content.pages.patientNotice);
    case "notFound":
      return renderNotFoundPage(content, routes);
    default:
      return "";
  }
}

function renderSectionHeading(eyebrow, title, intro = "") {
  return `<div class="section-heading" data-reveal>
    <p class="eyebrow">${eyebrow}</p>
    <h2>${title}</h2>
    ${intro ? `<p class="section-intro">${intro}</p>` : ""}
  </div>`;
}

function renderHomePage(content, routes) {
  const copy = content.pages.home;

  return `
    <section class="chapter hero-home">
      <div class="hero-grid">
        <div class="hero-copy" data-motion="intro">
          <p class="eyebrow">${copy.hero.eyebrow}</p>
          <h1>${copy.hero.title}</h1>
          <p class="hero-lead">${copy.hero.body}</p>
          <div class="hero-actions">
            <a class="button button-primary" href="${routes.booking}" data-track="hero_cta">${copy.hero.primaryCta}</a>
            <a class="button button-secondary" href="${routes.product}">${copy.hero.secondaryCta}</a>
          </div>
          <ul class="hero-badges" aria-label="Key points">
            ${copy.hero.badges.map((badge) => `<li>${badge}</li>`).join("")}
          </ul>
        </div>
        <aside class="hero-rail" data-motion="intro" style="--motion-delay: 120ms;">
          <div class="hero-note">
            <p class="hero-note-kicker">${copy.hero.operatorCard.title}</p>
            <ul>
              ${copy.hero.operatorCard.items.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        </aside>
      </div>
    </section>

    <section class="chapter story-grid">
      ${renderSectionHeading(copy.pains.eyebrow, copy.pains.title, copy.pains.intro)}
      <div class="editorial-grid">
        ${copy.pains.items
          .map(
            (item, index) => `<article class="story-card" data-reveal style="--reveal-delay: ${index * 90}ms;">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </article>`,
          )
          .join("")}
      </div>
    </section>

    <section class="chapter workflow-preview">
      ${renderSectionHeading(copy.workflowTeaser.eyebrow, copy.workflowTeaser.title, copy.workflowTeaser.intro)}
      <div class="timeline-grid">
        ${copy.workflowTeaser.steps
          .map(
            (step, index) => `<article class="timeline-card" data-reveal style="--reveal-delay: ${index * 80}ms;">
            <span class="step-chip">${step.label}</span>
            <p>${step.body}</p>
          </article>`,
          )
          .join("")}
      </div>
    </section>

    <section class="chapter proof-grid">
      ${renderSectionHeading(copy.proof.eyebrow, copy.proof.title)}
      <div class="split-cards">
        ${copy.proof.cards
          .map(
            (card, index) => `<article class="glass-card" data-reveal style="--reveal-delay: ${index * 110}ms;">
            <h3>${card.title}</h3>
            <p>${card.body}</p>
          </article>`,
          )
          .join("")}
      </div>
    </section>

    <section class="chapter path-grid">
      ${renderSectionHeading(copy.paths.eyebrow, copy.paths.title)}
      <div class="path-cards">
        ${copy.paths.items
          .map(
            (item, index) => `<article class="path-card" data-reveal style="--reveal-delay: ${index * 90}ms;">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
            <a class="inline-link" href="${routes[item.page]}">${item.label}</a>
          </article>`,
          )
          .join("")}
      </div>
    </section>

    ${renderClosingBand(copy.closing, routes.booking, routes.pilot)}
  `;
}

function renderProductPage(content, routes) {
  const copy = content.pages.product;

  return `
    <section class="chapter hero-page hero-product">
      <div class="hero-grid hero-grid-wide">
        <div class="hero-copy" data-motion="intro">
          <p class="eyebrow">${copy.hero.eyebrow}</p>
          <h1>${copy.hero.title}</h1>
          <p class="hero-lead">${copy.hero.body}</p>
          <div class="hero-actions">
            <a class="button button-primary" href="${routes.booking}">${copy.hero.primaryCta}</a>
            <a class="button button-secondary" href="${routes.trust}">${copy.hero.secondaryCta}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="chapter compare-section">
      ${renderSectionHeading(copy.comparison.eyebrow, copy.comparison.title)}
      <div class="compare-grid">
        <article class="compare-card" data-reveal>
          <p class="eyebrow subdued">${copy.comparison.beforeTitle}</p>
          <ul class="bullet-list">
            ${copy.comparison.before.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
        <article class="compare-card compare-card-accent" data-reveal style="--reveal-delay: 110ms;">
          <p class="eyebrow subdued">${copy.comparison.afterTitle}</p>
          <ul class="bullet-list">
            ${copy.comparison.after.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      </div>
    </section>

    <section class="chapter workflow-detail">
      ${renderSectionHeading(copy.workflow.eyebrow, copy.workflow.title, copy.workflow.intro)}
      <div class="workflow-grid">
        ${copy.workflow.steps
          .map(
            (step, index) => `<article class="workflow-card" data-reveal style="--reveal-delay: ${index * 80}ms;">
            <div class="workflow-card-top">
              <span class="step-count">0${index + 1}</span>
              <h3>${step.title}</h3>
            </div>
            <p>${step.body}</p>
            <ul class="bullet-list compact">
              ${step.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
            </ul>
          </article>`,
          )
          .join("")}
      </div>
    </section>

    <section class="chapter fit-section">
      ${renderSectionHeading(copy.fit.eyebrow, copy.fit.title)}
      <div class="editorial-grid">
        ${copy.fit.items
          .map(
            (item, index) => `<article class="story-card" data-reveal style="--reveal-delay: ${index * 90}ms;">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </article>`,
          )
          .join("")}
      </div>
    </section>

    <section class="chapter why-section">
      ${renderSectionHeading(copy.whyDental.eyebrow, copy.whyDental.title)}
      <div class="why-list" data-reveal>
        <ol>
          ${copy.whyDental.items.map((item) => `<li>${item}</li>`).join("")}
        </ol>
      </div>
    </section>

    ${renderClosingBand(copy.closing, routes.booking, routes.pilot)}
  `;
}

function renderPilotPage(content, routes) {
  const copy = content.pages.pilot;
  const booking = content.booking;

  return `
    <section class="chapter hero-page hero-pilot">
      <div class="hero-grid hero-grid-wide">
        <div class="hero-copy" data-motion="intro">
          <p class="eyebrow">${copy.hero.eyebrow}</p>
          <h1>${copy.hero.title}</h1>
          <p class="hero-lead">${copy.hero.body}</p>
          <div class="hero-actions">
            <a class="button button-primary" href="#booking">${copy.hero.primaryCta}</a>
            <a class="button button-secondary" href="${routes.product}">${copy.hero.secondaryCta}</a>
          </div>
          <ul class="hero-badges" aria-label="Pilot facts">
            ${copy.hero.chips.map((chip) => `<li>${chip}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>

    <section class="chapter agenda-grid">
      ${renderSectionHeading(copy.agenda.eyebrow, copy.agenda.title)}
      <div class="editorial-grid">
        ${copy.agenda.items
          .map(
            (item, index) => `<article class="story-card" data-reveal style="--reveal-delay: ${index * 85}ms;">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </article>`,
          )
          .join("")}
      </div>
    </section>

    <section class="chapter pilot-split">
      <div>
        ${renderSectionHeading(copy.bookingIntro.eyebrow, copy.bookingIntro.title, copy.bookingIntro.body)}
        <ul class="bullet-list" data-reveal>
          ${copy.bookingIntro.support.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <aside class="pricing-panel" data-reveal style="--reveal-delay: 120ms;">
        <p class="eyebrow">${copy.pricing.eyebrow}</p>
        <h3>${copy.pricing.title}</h3>
        <p>${copy.pricing.body}</p>
        <p class="subdued-copy">${copy.pricing.note}</p>
      </aside>
    </section>

    <section class="chapter booking-chapter" id="booking">
      ${renderSectionHeading(content.nav.cta, copy.hero.title, booking.labels.previewMode)}
      <div class="booking-layout">
        ${renderBookingForm(content)}
        <aside class="booking-sidecard" data-reveal style="--reveal-delay: 120ms;">
          <h3>${copy.plannerAside.title}</h3>
          <ul class="bullet-list compact">
            ${copy.plannerAside.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <p class="support-note">${copy.plannerAside.responseExpectation}</p>
        </aside>
      </div>
    </section>

    <section class="chapter fallback-band">
      <div class="cta-strip" data-reveal>
        <div>
          <p class="eyebrow">${copy.fallback.title}</p>
          <p>${copy.fallback.body}</p>
        </div>
        <a class="button button-secondary" href="${routes.trust}">${copy.fallback.label}</a>
      </div>
    </section>
  `;
}

function renderBookingForm(content) {
  const booking = content.booking;
  const labels = booking.labels;

  return `<div class="booking-stack" data-reveal>
    <form class="booking-form" data-booking-form novalidate autocomplete="off">
      <ol class="booking-progress" aria-label="${labels.stepLabel}">
        <li class="is-active" data-step-marker="1"><span>${labels.stepLabel} 1</span><strong>${labels.step1}</strong></li>
        <li data-step-marker="2"><span>${labels.stepLabel} 2</span><strong>${labels.step2}</strong></li>
        <li data-step-marker="3"><span>${labels.stepLabel} 3</span><strong>${labels.step3}</strong></li>
      </ol>
      <p class="form-status" data-form-status aria-live="polite">${labels.statusReady}</p>

      <section class="booking-step" data-step-panel="1">
        <div class="field-grid">
          ${renderInputField({
            label: labels.contactName,
            id: "contactName",
            name: "contactName",
            type: "text",
            autocomplete: "name",
            placeholder: content.htmlLang === "nl" ? "Bijvoorbeeld Mohamed Ibrahim…" : "For example Mohamed Ibrahim…",
          })}
          ${renderInputField({
            label: labels.contactEmail,
            id: "contactEmail",
            name: "contactEmail",
            type: "email",
            autocomplete: "email",
            placeholder: content.htmlLang === "nl" ? "naam@praktijk.nl…" : "name@clinic.com…",
            spellcheck: false,
            inputmode: "email",
          })}
          ${renderSelectField({
            label: labels.role,
            id: "role",
            name: "role",
            placeholder: content.htmlLang === "nl" ? "Kies uw rol…" : "Choose your role…",
            options: booking.roles,
          })}
          ${renderInputField({
            label: labels.clinicName,
            id: "clinicName",
            name: "clinicName",
            type: "text",
            autocomplete: "organization",
            placeholder: content.htmlLang === "nl" ? "Naam van de praktijk…" : "Clinic name…",
          })}
          ${renderInputField({
            label: labels.city,
            id: "city",
            name: "city",
            type: "text",
            autocomplete: "address-level2",
            placeholder: content.htmlLang === "nl" ? "Bijvoorbeeld Eindhoven…" : "For example Eindhoven…",
          })}
          ${renderSelectField({
            label: labels.clinicSize,
            id: "clinicSize",
            name: "clinicSize",
            placeholder: content.htmlLang === "nl" ? "Kies de schaal…" : "Choose the clinic size…",
            options: booking.clinicSizes,
          })}
          ${renderSelectField({
            label: labels.primaryPain,
            id: "primaryPain",
            name: "primaryPain",
            placeholder: content.htmlLang === "nl" ? "Kies het grootste pijnpunt…" : "Choose the main pain point…",
            options: booking.primaryPains,
          })}
        </div>
        ${renderTextareaField({
          label: labels.workflowNotes,
          id: "workflowNotes",
          name: "workflowNotes",
          placeholder: labels.help.workflowNotes,
          rows: 4,
        })}
      </section>

      <section class="booking-step" data-step-panel="2" hidden>
        <fieldset class="choice-group">
          <legend>${labels.meetingFormat}</legend>
          <div class="choice-grid">
            ${booking.meetingFormats
              .map(
                (option) => `<label class="choice-card">
                <input type="radio" name="meetingFormat" value="${option.value}" />
                <span>${option.label}</span>
              </label>`,
              )
              .join("")}
          </div>
          <p class="field-error" id="meetingFormat-error" data-field-error="meetingFormat" aria-live="polite"></p>
        </fieldset>

        <fieldset class="choice-group">
          <legend>${labels.availabilityTitle}</legend>
          <p class="field-hint">${labels.help.availability}</p>
          <div class="choice-grid choice-grid-dense">
            ${booking.availability
              .map(
                (option) => `<label class="choice-card choice-card-multi">
                <input type="checkbox" name="availability" value="${option.value}" />
                <span>${option.label}</span>
                <small>${option.detail}</small>
              </label>`,
              )
              .join("")}
          </div>
          <p class="field-error" id="availability-error" data-field-error="availability" aria-live="polite"></p>
        </fieldset>
      </section>

      <section class="booking-step booking-review" data-step-panel="3" hidden>
        <div class="review-card">
          <h3>${labels.step3}</h3>
          <dl data-review-list></dl>
        </div>
      </section>

      <div class="form-actions">
        <button class="button button-secondary" type="button" data-booking-back hidden>${labels.buttons.back}</button>
        <button class="button button-primary" type="button" data-booking-next>${labels.buttons.next}</button>
        <button class="button button-primary" type="submit" data-booking-submit hidden>${labels.buttons.submit}</button>
      </div>

      <p class="booking-preview-note">${labels.previewMode}</p>
    </form>

    <section class="booking-success" data-booking-success hidden aria-live="polite">
      <div class="success-card">
        <p class="eyebrow">${labels.successTitle}</p>
        <h3>${labels.statusSuccess}</h3>
        <p>${labels.successBody}</p>
        <pre data-success-summary></pre>
        <div class="form-actions">
          <button class="button button-secondary" type="button" data-booking-copy>${labels.buttons.copy}</button>
          <button class="button button-secondary" type="button" data-booking-download>${labels.buttons.download}</button>
          <button class="button button-primary" type="button" data-booking-restart>${labels.buttons.restart}</button>
        </div>
        <p class="form-status" data-success-status aria-live="polite"></p>
      </div>
    </section>
  </div>`;
}

function renderInputField({
  label,
  id,
  name,
  type,
  autocomplete,
  placeholder,
  spellcheck,
  inputmode,
}) {
  return `<div class="field">
    <label for="${id}">${label}</label>
    <input id="${id}" name="${name}" type="${type}" autocomplete="${autocomplete}" placeholder="${placeholder}"${spellcheck === false ? ' spellcheck="false"' : ""}${inputmode ? ` inputmode="${inputmode}"` : ""} aria-describedby="${id}-error" />
    <p class="field-error" id="${id}-error" data-field-error="${name}" aria-live="polite"></p>
  </div>`;
}

function renderSelectField({ label, id, name, placeholder, options }) {
  return `<div class="field">
    <label for="${id}">${label}</label>
    <select id="${id}" name="${name}" autocomplete="off" aria-describedby="${id}-error">
      <option value="">${placeholder}</option>
      ${options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
    </select>
    <p class="field-error" id="${id}-error" data-field-error="${name}" aria-live="polite"></p>
  </div>`;
}

function renderTextareaField({ label, id, name, placeholder, rows }) {
  return `<div class="field field-full">
    <label for="${id}">${label}</label>
    <textarea id="${id}" name="${name}" rows="${rows}" autocomplete="off" placeholder="${placeholder}" aria-describedby="${id}-hint ${id}-error"></textarea>
    <p class="field-hint" id="${id}-hint">${placeholder}</p>
    <p class="field-error" id="${id}-error" data-field-error="${name}" aria-live="polite"></p>
  </div>`;
}

function renderTrustPage(content, routes, prefix) {
  const copy = content.pages.trust;

  return `
    <section class="chapter hero-page hero-trust">
      <div class="hero-grid hero-grid-wide">
        <div class="hero-copy" data-motion="intro">
          <p class="eyebrow">${copy.hero.eyebrow}</p>
          <h1>${copy.hero.title}</h1>
          <p class="hero-lead">${copy.hero.body}</p>
          <div class="hero-actions">
            <a class="button button-primary" href="${routes.booking}">${copy.hero.primaryCta}</a>
            <a class="button button-secondary" href="${routes.product}">${copy.hero.secondaryCta}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="chapter boundary-grid">
      ${renderSectionHeading(copy.boundary.eyebrow, copy.boundary.title)}
      <div class="editorial-grid">
        ${copy.boundary.items
          .map(
            (item, index) => `<article class="story-card" data-reveal style="--reveal-delay: ${index * 90}ms;">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </article>`,
          )
          .join("")}
      </div>
    </section>

    <section class="chapter trust-proof">
      ${renderSectionHeading(copy.proof.eyebrow, copy.proof.title)}
      <div class="split-cards">
        <article class="glass-card" data-reveal>
          <ul class="bullet-list">
            ${copy.proof.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
        <article class="glass-card founder-card" data-reveal style="--reveal-delay: 110ms;">
          <p class="eyebrow subdued">Founder</p>
          <p>${copy.proof.founderLine}</p>
        </article>
      </div>
    </section>

    <section class="chapter faq-section">
      ${renderSectionHeading(copy.faq.eyebrow, copy.faq.title)}
      <div class="faq-grid" data-reveal>
        ${copy.faq.items
          .map(
            (item) => `<details class="faq-item">
            <summary>${item.question}</summary>
            <p>${item.answer}</p>
          </details>`,
          )
          .join("")}
      </div>
    </section>

    <section class="chapter materials-section">
      ${renderSectionHeading(copy.materials.eyebrow, copy.materials.title, copy.materials.intro)}
      <div class="materials-layout">
        <div class="materials-copy" data-reveal>
          <div class="download-stack">
            ${copy.materials.downloads
              .map(
                (download) => `<article class="download-card">
                <h3>${download.title}</h3>
                <p>${download.description}</p>
                <a class="button button-secondary" href="${assetPath(prefix, download.href)}" download${
                  download.track ? ` data-track="${download.track}"` : ""
                }>${download.label}</a>
              </article>`,
              )
              .join("")}
          </div>
        </div>
        <div class="preview-grid" data-reveal style="--reveal-delay: 110ms;">
          ${copy.materials.previews
            .map(
              (preview) => `<figure class="preview-card">
              <img src="${assetPath(prefix, preview.src)}" alt="${preview.alt}" width="${preview.width}" height="${preview.height}" loading="lazy" />
              <figcaption>${preview.caption}</figcaption>
            </figure>`,
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="chapter legal-section">
      ${renderSectionHeading(copy.legal.eyebrow, copy.legal.title, copy.legal.body)}
      <div class="cta-row" data-reveal>
        ${copy.legal.links
          .map(
            (link) => `<a class="button button-secondary" href="${routes[link.page]}">${link.label}</a>`,
          )
          .join("")}
      </div>
    </section>

    ${renderClosingBand(copy.closing, routes.booking, routes.pilot)}
  `;
}

function renderLegalPage(copy) {
  return `
    <section class="chapter legal-hero">
      <div class="hero-grid hero-grid-wide">
        <div class="hero-copy" data-motion="intro">
          <p class="eyebrow">${copy.hero.eyebrow}</p>
          <h1>${copy.hero.title}</h1>
          <p class="hero-lead">${copy.hero.body}</p>
        </div>
      </div>
    </section>

    <section class="chapter legal-grid">
      <div class="legal-stack">
        ${copy.cards
          .map(
            (card, index) => `<article class="legal-card" data-reveal style="--reveal-delay: ${index * 70}ms;">
            <h2>${card.title}</h2>
            ${card.body ? `<p>${card.body}</p>` : ""}
            ${card.list ? `<ul class="bullet-list compact">${card.list.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
          </article>`,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderNotFoundPage(content, routes) {
  const copy = content.pages.notFound;
  return `
    <section class="chapter hero-page hero-not-found">
      <div class="hero-grid hero-grid-wide">
        <div class="hero-copy" data-motion="intro">
          <p class="eyebrow">${copy.hero.eyebrow}</p>
          <h1>${copy.hero.title}</h1>
          <p class="hero-lead">${copy.hero.body}</p>
          <div class="hero-actions">
            ${copy.actions
              .map(
                (action, index) => `<a class="button ${index === 0 ? "button-primary" : "button-secondary"}" href="${routes[action.page]}">${action.label}</a>`,
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderClosingBand(copy, primaryHref, secondaryHref) {
  return `<section class="chapter closing-band">
    <div class="cta-strip" data-reveal>
      <div>
        <p class="eyebrow">${copy.eyebrow ?? "Next step"}</p>
        <h2>${copy.title}</h2>
        <p>${copy.body}</p>
      </div>
      <div class="hero-actions">
        <a class="button button-primary" href="${primaryHref}">${copy.primaryCta}</a>
        <a class="button button-secondary" href="${secondaryHref}">${copy.secondaryCta}</a>
      </div>
    </div>
  </section>`;
}

export function renderAllPages() {
  return pageSequence.map(({ lang, page }) => ({
    path: outputPathFor(lang, page),
    html: renderDocument({
      lang,
      page,
      content: siteContent[lang],
    }),
  }));
}

export function getPagePaths() {
  return pageSequence.map(({ lang, page }) => outputPathFor(lang, page));
}

export { outputPathFor, pageOrder, routeFor };
