import { getSuggestedInternalLinks } from "../../lib/blog-content.js";
import { pageFileNames, pageOrder, siteContent } from "./site-content.js";

const localeOrder = ["nl", "en"];
const pageSequence = [
  { lang: "nl", page: "home" },
  { lang: "nl", page: "product" },
  { lang: "nl", page: "pilot" },
  { lang: "nl", page: "trust" },
  { lang: "nl", page: "blogIndex" },
  { lang: "nl", page: "privacy" },
  { lang: "nl", page: "patientNotice" },
  { lang: "nl", page: "notFound" },
  { lang: "en", page: "home" },
  { lang: "en", page: "product" },
  { lang: "en", page: "pilot" },
  { lang: "en", page: "trust" },
  { lang: "en", page: "blogIndex" },
  { lang: "en", page: "privacy" },
  { lang: "en", page: "patientNotice" },
];

function alternateLocale(lang) {
  return lang === "en" ? "nl" : "en";
}

function prefixForPath(filePath) {
  const depth = filePath.split("/").length - 1;
  return depth === 0 ? "." : Array.from({ length: depth }, () => "..").join("/");
}

function outputPathFor(lang, page) {
  const fileName = pageFileNames[page];
  return lang === "en" && page !== "notFound" ? `en/${fileName}` : fileName;
}

function hrefFor(lang, page, hash = "") {
  const filePath = outputPathFor(lang, page).replace(/\\/g, "/");
  let href = `/${filePath}`;

  if (href === "/index.html") {
    href = "/";
  } else if (href.endsWith("/index.html")) {
    href = href.slice(0, -"index.html".length);
  }

  return `${href}${hash}`;
}

function canonicalUrl(siteUrl, pathname) {
  return siteUrl ? `${siteUrl.replace(/\/+$/, "")}${pathname}` : pathname;
}

function assetPath(prefix, relativePath) {
  return `${prefix}/${relativePath}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderJsonLd(schemaObjects) {
  return schemaObjects
    .filter(Boolean)
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`)
    .join("\n");
}

function buildOrganizationSchema(lang, siteUrl) {
  const content = siteContent[lang];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Renvoo",
    url: canonicalUrl(siteUrl, hrefFor(lang, "home")),
    logo: canonicalUrl(siteUrl, "/social-preview.png"),
    description: content.footer.summary,
    areaServed: "NL",
  };
}

function buildWebsiteSchema(lang, siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Renvoo",
    url: canonicalUrl(siteUrl, hrefFor(lang, "home")),
    inLanguage: siteContent[lang].locale,
    description: siteContent[lang].footer.summary,
  };
}

function buildSoftwareSchema(lang, pathname, description) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Renvoo",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: siteContent[lang].locale,
    description,
    url: pathname,
    featureList: [
      "No-show reduction workflow",
      "Appointment confirmation support",
      "Late cancellation handling",
      "Recovered capacity and backfill support",
    ],
  };
}

function buildFaqSchema(items = []) {
  if (!items.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function buildBreadcrumbSchema(siteUrl, breadcrumbs) {
  if (!breadcrumbs.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: canonicalUrl(siteUrl, item.href),
    })),
  };
}

function buildArticleSchema(siteUrl, lang, post, breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.date,
    dateModified: post.updated,
    inLanguage: siteContent[lang].locale,
    mainEntityOfPage: canonicalUrl(
      siteUrl,
      lang === "en" ? `/en/blog/${post.slug}/` : `/blog/${post.slug}/`,
    ),
    author: {
      "@type": "Organization",
      name: "Renvoo",
    },
    publisher: {
      "@type": "Organization",
      name: "Renvoo",
      logo: {
        "@type": "ImageObject",
        url: canonicalUrl(siteUrl, "/social-preview.png"),
      },
    },
    image: canonicalUrl(siteUrl, "/social-preview.png"),
    articleSection: post.category,
    keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(", "),
    breadcrumb: buildBreadcrumbSchema(siteUrl, breadcrumbs),
  };
}

function breadcrumbsForPage(lang, page) {
  if (page === "home" || page === "notFound") {
    return [];
  }

  return [
    { href: hrefFor(lang, "home"), label: siteContent[lang].pageNames.home },
    { href: hrefFor(lang, page), label: siteContent[lang].pageNames[page] },
  ];
}

function renderBreadcrumbNav(breadcrumbs) {
  if (!breadcrumbs.length) {
    return "";
  }

  return `<nav class="breadcrumbs chapter" aria-label="Breadcrumb">
    <ol>
      ${breadcrumbs
        .map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return `<li>${isLast ? `<span>${item.label}</span>` : `<a href="${item.href}">${item.label}</a>`}</li>`;
        })
        .join("")}
    </ol>
  </nav>`;
}

function renderDocument({
  lang,
  page,
  content,
  filePath,
  pathname,
  mainContent,
  siteUrl = "",
  breadcrumbs = [],
  schema = [],
  extraHead = "",
  pageType = "website",
  switchTarget = null,
  seoOverride = null,
}) {
  const prefix = prefixForPath(filePath);
  const pageCopy = {
    ...(content.pages[page] ?? content.pages.home),
    seo: seoOverride ?? (content.pages[page] ?? content.pages.home).seo,
  };
  const canonical = canonicalUrl(siteUrl, pathname);
  const switchLang = alternateLocale(lang);
  const bodyClass = `page-${page} lang-${lang}`;
  const routes = {
    home: hrefFor(lang, "home"),
    product: hrefFor(lang, "product"),
    pilot: hrefFor(lang, "pilot"),
    trust: hrefFor(lang, "trust"),
    blogIndex: hrefFor(lang, "blogIndex"),
    booking: hrefFor(lang, "pilot", "#booking"),
    privacy: hrefFor(lang, "privacy"),
    patientNotice: hrefFor(lang, "patientNotice"),
    switch:
      switchTarget ?? (page === "notFound" ? hrefFor(switchLang, "home") : hrefFor(switchLang, page)),
  };

  const alternateHead = siteUrl
    ? page !== "notFound" && pageType !== "article"
      ? `<link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="${content.locale}" href="${canonical}" />
    <link rel="alternate" hreflang="${siteContent[switchLang].locale}" href="${canonicalUrl(siteUrl, hrefFor(switchLang, page))}" />
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl(siteUrl, hrefFor("nl", page === "notFound" ? "home" : page))}" />`
      : `<link rel="canonical" href="${canonical}" />`
    : "";

  return `<!doctype html>
<html lang="${content.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageCopy.seo.title}</title>
    <meta name="description" content="${pageCopy.seo.description}" />
    <meta name="theme-color" content="#f4efe7" />
    <meta name="robots" content="index,follow" />
    <meta property="og:type" content="${pageType}" />
    <meta property="og:title" content="${pageCopy.seo.title}" />
    <meta property="og:description" content="${pageCopy.seo.description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${canonicalUrl(siteUrl, "/social-preview.png")}" />
    <meta property="og:image:alt" content="Renvoo website preview" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageCopy.seo.title}" />
    <meta name="twitter:description" content="${pageCopy.seo.description}" />
    <meta name="twitter:image" content="${canonicalUrl(siteUrl, "/social-preview.png")}" />
    ${alternateHead}
    <link rel="icon" type="image/png" href="${assetPath(prefix, "icons/favicon.png")}" />
    <link rel="apple-touch-icon" href="${assetPath(prefix, "icons/favicon.png")}" />
    <link rel="manifest" href="${assetPath(prefix, "site.webmanifest")}" />
    <link rel="stylesheet" href="${assetPath(prefix, "styles.css")}" />
    ${extraHead}
    ${renderJsonLd(schema)}
  </head>
  <body class="${bodyClass}" data-lang="${lang}" data-page="${page}" data-prefix="${prefix}" data-switch-lang="${switchLang}">
    <a class="skip-link" href="#content">${lang === "nl" ? "Ga naar inhoud" : "Skip to content"}</a>
    <div class="page-aura page-aura-left" aria-hidden="true"></div>
    <div class="page-aura page-aura-right" aria-hidden="true"></div>
    ${renderHeader(content, page, routes).replace("./assets/renvoo-logo-horizontal.png", assetPath(prefix, "assets/renvoo-logo-horizontal.png"))}
    ${renderBreadcrumbNav(breadcrumbs)}
    <main id="content" class="site-main">
      ${mainContent}
    </main>
    ${renderFooter(content, lang, page)}
    <script type="module" src="${assetPath(prefix, "main.js")}"></script>
  </body>
</html>
`;
}

function renderHeader(content, page, routes) {
  const navItems = ["home", "product", "pilot", "trust", "blogIndex"]
    .map((navPage) => {
      const isActive = page === navPage ? "is-active" : "";
      return `<a class="${isActive}" href="${routes[navPage]}">${content.nav[navPage]}</a>`;
    })
    .join("");

  const menuLabel = content.htmlLang === "nl" ? "Open navigatie" : "Open navigation";

  return `<header class="site-header" data-header>
  <div class="site-header-inner">
    <a class="brand-mark" href="${routes.home}" aria-label="Renvoo ${content.pageNames.home}">
      <img src="${assetPath(".", "assets/renvoo-logo-horizontal.png")}" alt="Renvoo" width="1212" height="274" />
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
  const quickLinks = ["home", "product", "pilot", "trust", "blogIndex"]
    .map((footerPage) => `<li><a href="${hrefFor(lang, footerPage)}">${content.pageNames[footerPage]}</a></li>`)
    .join("");

  const legalLinks = content.footer.legalLinks
    .map((link) => `<li><a href="${hrefFor(lang, link.page)}">${link.label}</a></li>`)
    .join("");

  const languageLinks = content.footer.languageLinks
    .map((link) => {
      const targetPage = page === "notFound" ? "home" : link.page;
      return `<li><a href="${hrefFor(link.lang, targetPage)}" data-locale-link="true" data-target-lang="${link.lang}">${link.label}</a></li>`;
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

function renderPageBody({ lang, page, content, routes, prefix, posts = [] }) {
  switch (page) {
    case "home":
      return renderHomePage(content, routes, prefix);
    case "product":
      return renderProductPage(content, routes, prefix);
    case "pilot":
      return renderPilotPage(content, routes);
    case "trust":
      return renderTrustPage(content, routes, prefix);
    case "blogIndex":
      return renderBlogIndexPage(content, lang, posts);
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

function renderHomePage(content, routes, prefix) {
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
          ${copy.hero.badges.length ? `<ul class="hero-badges" aria-label="Key points">
            ${copy.hero.badges.map((badge) => `<li>${badge}</li>`).join("")}
          </ul>` : ""}
        </div>
        <aside class="hero-stage hero-stage-home" data-motion="intro" style="--motion-delay: 120ms;">
          <figure class="hero-preview-frame">
            <img src="${assetPath(prefix, "assets/previews/one-pager-preview.png")}" alt="${content.htmlLang === "nl" ? "Preview van de Renvoo one-pager met agenda- en no-show-visuals" : "Preview of the Renvoo one-pager with schedule and no-show visuals"}" width="1080" height="1528" loading="eager" />
          </figure>
          <div class="hero-note hero-note-floating">
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

function renderProductPage(content, routes, prefix) {
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
        <aside class="hero-stage hero-stage-product" data-motion="intro" style="--motion-delay: 120ms;">
          <figure class="hero-preview-frame hero-preview-frame-product">
            <img src="${assetPath(prefix, "assets/previews/deck-slide-07.png")}" alt="${content.htmlLang === "nl" ? "Preview van Renvoo's operationele workflowstappen" : "Preview of Renvoo's operational workflow steps"}" width="1280" height="720" loading="eager" />
          </figure>
          <div class="hero-note hero-note-inline">
            <p class="hero-note-kicker">${copy.workflow.title}</p>
            <div class="hero-chip-grid">
              ${copy.workflow.steps.map((step) => `<span class="step-chip">${step.title}</span>`).join("")}
            </div>
          </div>
        </aside>
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
        <aside class="hero-stage hero-stage-pilot" data-motion="intro" style="--motion-delay: 120ms;">
          <div class="hero-note">
            <p class="hero-note-kicker">${copy.bookingIntro.title}</p>
            <ul>
              ${copy.bookingIntro.support.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <div class="hero-stage-callout">
            <p class="hero-note-kicker">${copy.pricing.title}</p>
            <p>${copy.pricing.note}</p>
          </div>
        </aside>
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
      <div class="booking-layout booking-layout-single">
        ${renderBookingForm(content)}
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

        <div class="field-grid field-grid-datetime">
          ${renderDateTimeField({
            label: labels.preferredSlot,
            id: "preferredSlot",
            name: "preferredSlot",
            hint: labels.help.preferredSlot,
            required: true,
          })}
          ${renderDateTimeField({
            label: labels.backupSlot,
            id: "backupSlot",
            name: "backupSlot",
            hint: labels.help.backupSlot,
          })}
        </div>
      </section>

      <div class="form-actions">
        <button class="button button-primary" type="button" data-booking-next>${labels.buttons.next}</button>
      </div>

      <section class="booking-step booking-review" data-step-panel="3" hidden>
        <div class="review-card">
          <h3>${labels.step3}</h3>
          <dl data-review-list></dl>
        </div>
        <div class="form-actions">
          <button class="button button-secondary" type="button" data-booking-back hidden>${labels.buttons.back}</button>
          <button class="button button-primary" type="submit" data-booking-submit hidden>${labels.buttons.submit}</button>
        </div>
      </section>

      <p class="booking-preview-note">${labels.previewMode}</p>
    </form>

    <section class="booking-success" data-booking-success hidden aria-live="polite">
      <div class="success-card">
        <p class="eyebrow">${labels.successTitle}</p>
        <h3 data-success-heading>${labels.statusSuccess}</h3>
        <p data-success-body>${labels.successBody}</p>
        <pre data-success-summary></pre>
        <div class="form-actions">
          <a class="button button-primary" href="#" target="_blank" rel="noreferrer" data-booking-calendar hidden>${labels.buttons.calendar}</a>
          <button class="button button-secondary" type="button" data-booking-copy>${labels.buttons.copy}</button>
          <button class="button button-secondary" type="button" data-booking-download>${labels.buttons.download}</button>
          <button class="button button-secondary" type="button" data-booking-restart>${labels.buttons.restart}</button>
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

function renderDateTimeField({ label, id, name, hint, required = false }) {
  return `<div class="field">
    <label for="${id}">${label}</label>
    <input id="${id}" name="${name}" type="datetime-local" step="900"${required ? " required" : ""} aria-describedby="${id}-hint ${id}-error" />
    <p class="field-hint" id="${id}-hint">${hint}</p>
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
        <aside class="hero-stage hero-stage-trust" data-motion="intro" style="--motion-delay: 120ms;">
          <div class="hero-note">
            <p class="hero-note-kicker">${copy.boundary.title}</p>
            <ul>
              ${copy.boundary.items.map((item) => `<li>${item.title}</li>`).join("")}
            </ul>
          </div>
          <div class="hero-stage-callout">
            <p class="hero-note-kicker">${content.htmlLang === "nl" ? "Founder-led houding" : "Founder-led posture"}</p>
            <p>${copy.proof.founderLine}</p>
          </div>
        </aside>
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
      <div class="materials-layout${copy.materials.downloads.length === 1 ? " materials-layout-single" : ""}">
        <div class="materials-copy" data-reveal>
          <div class="download-stack${copy.materials.downloads.length === 1 ? " download-stack-single" : ""}">
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
        <div class="preview-grid${copy.materials.previews.length === 1 ? " preview-grid-single" : ""}" data-reveal style="--reveal-delay: 110ms;">
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

function renderBlogIndexPage(content, lang, posts = []) {
  const page = content.pages.blogIndex;
  const blog = content.blog;
  const publishedPosts = posts.filter((post) => post.locale === lang && post.status === "published");
  const locale = lang === "en" ? "en-US" : "nl-NL";
  const [featuredPost, ...remainingPosts] = publishedPosts;

  return `
    <section class="chapter hero-page hero-blog">
      <div class="hero-grid hero-grid-wide">
        <div class="hero-copy" data-motion="intro">
          <p class="eyebrow">${page.hero.eyebrow}</p>
          <h1>${page.hero.title}</h1>
          <p class="hero-lead">${page.hero.body}</p>
          <div class="hero-actions">
            <a class="button button-primary" href="${hrefFor(lang, "pilot", "#booking")}">${page.hero.primaryCta}</a>
            <a class="button button-secondary" href="${hrefFor(lang, "product")}">${page.hero.secondaryCta}</a>
          </div>
        </div>
        ${
          featuredPost
            ? `<aside class="hero-stage hero-stage-blog" data-motion="intro" style="--motion-delay: 120ms;">
          <div class="hero-note hero-note-featured">
            <p class="hero-note-kicker">${lang === "nl" ? "Uitgelicht artikel" : "Featured article"}</p>
            <h3>${escapeHtml(featuredPost.title)}</h3>
            <p>${escapeHtml(featuredPost.excerpt)}</p>
            <a class="inline-link" href="${lang === "en" ? `/en/blog/${featuredPost.slug}/` : `/blog/${featuredPost.slug}/`}">${blog.readMore}</a>
          </div>
        </aside>`
            : ""
        }
      </div>
    </section>

    <section class="chapter blog-index-section">
      ${renderSectionHeading(blog.eyebrow, blog.title, blog.intro)}
      ${
        publishedPosts.length
          ? `${featuredPost ? `<article class="featured-article" data-reveal>
          <div class="featured-article-copy">
            <p class="blog-meta">${new Date(featuredPost.date).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })} · ${escapeHtml(featuredPost.primaryKeyword)}</p>
            <h3>${escapeHtml(featuredPost.title)}</h3>
            <p>${escapeHtml(featuredPost.excerpt)}</p>
            <div class="blog-card-footer">
              <span class="step-chip">${escapeHtml(featuredPost.category)}</span>
              <a class="inline-link" href="${lang === "en" ? `/en/blog/${featuredPost.slug}/` : `/blog/${featuredPost.slug}/`}">${blog.readMore}</a>
            </div>
          </div>
        </article>` : ""}
        ${remainingPosts.length ? `<div class="blog-grid">
          ${remainingPosts
            .map(
              (post, index) => `<article class="blog-card" data-reveal style="--reveal-delay: ${index * 90}ms;">
              <p class="blog-meta">${new Date(post.date).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })} · ${escapeHtml(post.primaryKeyword)}</p>
              <h3>${escapeHtml(post.title)}</h3>
              <p>${escapeHtml(post.excerpt)}</p>
              <div class="blog-card-footer">
                <span class="step-chip">${escapeHtml(post.category)}</span>
                <a class="inline-link" href="${lang === "en" ? `/en/blog/${post.slug}/` : `/blog/${post.slug}/`}">${blog.readMore}</a>
              </div>
            </article>`,
            )
            .join("")}
        </div>` : ""}`
          : `<div class="empty-state" data-reveal><p>${blog.emptyLabel}</p></div>`
      }
    </section>

    ${renderClosingBand(
      {
        eyebrow: blog.eyebrow,
        title: blog.ctaTitle,
        body: blog.ctaBody,
        primaryCta: blog.ctaPrimary,
        secondaryCta: lang === "en" ? "See the trust page" : "Bekijk de trust-pagina",
      },
      hrefFor(lang, "pilot", "#booking"),
      hrefFor(lang, "trust"),
    )}
  `;
}

function renderBlogArticle(lang, post) {
  const blog = siteContent[lang].blog;
  const relatedLinks = getSuggestedInternalLinks(post);
  const locale = lang === "en" ? "en-US" : "nl-NL";

  return `<article class="chapter article-shell">
    <div class="article-head" data-reveal>
      <p class="eyebrow">${blog.eyebrow}</p>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="hero-lead">${escapeHtml(post.excerpt)}</p>
      <div class="article-meta">
        <span>${new Date(post.date).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}</span>
        <span>${escapeHtml(post.primaryKeyword)}</span>
      </div>
    </div>
    <section class="answer-card article-answer" data-reveal>
      <p class="eyebrow subdued">${lang === "en" ? "Short answer" : "Kort antwoord"}</p>
      <p class="answer-copy">${escapeHtml(post.answer || post.excerpt)}</p>
    </section>
    <div class="article-body prose" data-reveal>${post.contentHtml}</div>
  </article>
  ${renderSourcesSection(lang, post.sources)}
  ${renderFaqSection(lang, post.faq)}
  ${renderArticleRelated(lang, relatedLinks)}
  ${renderClosingBand(
    {
      eyebrow: blog.eyebrow,
      title: blog.ctaTitle,
      body: blog.ctaBody,
      primaryCta: blog.ctaPrimary,
      secondaryCta: blog.backToBlog,
    },
    hrefFor(lang, "pilot", "#booking"),
    hrefFor(lang, "blogIndex"),
  )}`;
}

function renderSourcesSection(lang, sources) {
  if (!sources?.length) {
    return "";
  }

  return `<section class="chapter">
    ${renderSectionHeading(lang === "en" ? "Sources" : "Bronnen", siteContent[lang].blog.sourcesTitle)}
    <div class="glass-card" data-reveal>
      <ul class="source-list">
        ${sources.map((source) => `<li><a href="${source.url}" rel="noreferrer">${escapeHtml(source.title)}</a></li>`).join("")}
      </ul>
    </div>
  </section>`;
}

function renderFaqSection(lang, items) {
  if (!items?.length) {
    return "";
  }

  return `<section class="chapter">
    ${renderSectionHeading("FAQ", lang === "en" ? "Frequent questions" : "Veelgestelde vragen")}
    <div class="faq-list">
      ${items
        .map(
          (item, index) => `<article class="faq-card" data-reveal style="--reveal-delay: ${index * 80}ms;">
          <h3>${escapeHtml(item.question)}</h3>
          <p>${escapeHtml(item.answer)}</p>
        </article>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderArticleRelated(lang, links) {
  if (!links?.length) {
    return "";
  }

  return `<section class="chapter">
    ${renderSectionHeading(lang === "en" ? "Internal links" : "Interne links", siteContent[lang].blog.relatedTitle)}
    <div class="path-cards">
      ${links
        .map(
          (link, index) => `<article class="path-card" data-reveal style="--reveal-delay: ${index * 90}ms;">
          <h3>${escapeHtml(link.label)}</h3>
          <p>${escapeHtml(link.href)}</p>
          <a class="inline-link" href="${link.href}">${escapeHtml(link.label)}</a>
        </article>`,
        )
        .join("")}
    </div>
  </section>`;
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

function faqItemsForPage(lang, page) {
  if (page === "trust") {
    return siteContent[lang].pages.trust.faq.items;
  }

  return [];
}

function schemaForStandardPage(lang, page, pathname, breadcrumbs, siteUrl) {
  const content = siteContent[lang];
  const pageCopy = content.pages[page];
  const description =
    pageCopy.hero?.body ??
    pageCopy.hero?.lead ??
    pageCopy.bookingIntro?.body ??
    pageCopy.seo.description;

  return [
    buildOrganizationSchema(lang, siteUrl),
    page === "home" || page === "blogIndex" ? buildWebsiteSchema(lang, siteUrl) : null,
    page !== "privacy" && page !== "patientNotice" && page !== "blogIndex"
      ? buildSoftwareSchema(lang, canonicalUrl(siteUrl, pathname), description)
      : null,
    buildFaqSchema(faqItemsForPage(lang, page)),
    buildBreadcrumbSchema(siteUrl, breadcrumbs),
  ];
}

export function renderAllPages({ siteUrl = "", contactEmail = "", posts = [] } = {}) {
  const pages = [];
  const routeManifest = [];

  for (const { lang, page } of pageSequence) {
    const content = siteContent[lang];
    const filePath = outputPathFor(lang, page);
    const pathname = hrefFor(lang, page);
    const breadcrumbs = breadcrumbsForPage(lang, page);
    const pageCopy = content.pages[page];
    const mainContent =
      page === "blogIndex"
        ? renderBlogIndexPage(content, lang, posts)
        : renderPageBody({ lang, page, content, routes: {
            home: hrefFor(lang, "home"),
            product: hrefFor(lang, "product"),
            pilot: hrefFor(lang, "pilot"),
            trust: hrefFor(lang, "trust"),
            blogIndex: hrefFor(lang, "blogIndex"),
            booking: hrefFor(lang, "pilot", "#booking"),
            privacy: hrefFor(lang, "privacy"),
            patientNotice: hrefFor(lang, "patientNotice"),
            switch: hrefFor(alternateLocale(lang), page === "notFound" ? "home" : page),
          }, prefix: prefixForPath(filePath), posts });

    pages.push({
      path: filePath,
      html: renderDocument({
        lang,
        page,
        content,
        filePath,
        pathname,
        mainContent,
        siteUrl,
        breadcrumbs,
        schema: schemaForStandardPage(lang, page, pathname, breadcrumbs, siteUrl),
        pageType: page === "blogIndex" ? "website" : "website",
        switchTarget: hrefFor(alternateLocale(lang), page === "notFound" ? "home" : page),
      }),
    });

    routeManifest.push({
      locale: lang,
      type: page === "notFound" ? "notFound" : page === "blogIndex" ? "blogIndex" : "page",
      filePath,
      pathname: page === "home" ? (lang === "en" ? "/en/" : "/") : page === "blogIndex" ? (lang === "en" ? "/en/blog/" : "/blog/") : pathname.replace(/\.html$/, ""),
      title: pageCopy.seo.title,
      description: pageCopy.seo.description,
    });
  }

  for (const lang of localeOrder) {
    const localizedPosts = posts.filter((post) => post.locale === lang && post.status === "published");
    for (const post of localizedPosts) {
      const pathname = lang === "en" ? `/en/blog/${post.slug}/` : `/blog/${post.slug}/`;
      const filePath = lang === "en" ? `en/blog/${post.slug}/index.html` : `blog/${post.slug}/index.html`;
      const breadcrumbs = [
        { href: hrefFor(lang, "home"), label: siteContent[lang].pageNames.home },
        { href: hrefFor(lang, "blogIndex"), label: siteContent[lang].pageNames.blogIndex },
        { href: pathname, label: post.title },
      ];
      const articlePage = {
        seo: {
          title: post.metaTitle || post.title,
          description: post.metaDescription || post.excerpt,
        },
      };

      pages.push({
        path: filePath,
        html: renderDocument({
          lang,
          page: "blogIndex",
          content: siteContent[lang],
          filePath,
          pathname,
          mainContent: renderBlogArticle(lang, post),
          siteUrl,
          breadcrumbs,
          schema: [
            buildOrganizationSchema(lang, siteUrl),
            buildArticleSchema(siteUrl, lang, post, breadcrumbs),
            buildFaqSchema(post.faq),
            buildBreadcrumbSchema(siteUrl, breadcrumbs),
          ],
          pageType: "article",
          switchTarget: hrefFor(alternateLocale(lang), "blogIndex"),
          seoOverride: articlePage.seo,
          extraHead: `<meta property="article:published_time" content="${post.date}" />
    <meta property="article:modified_time" content="${post.updated}" />
    <meta property="article:section" content="${post.category}" />`,
        }),
      });

      routeManifest.push({
        locale: lang,
        type: "article",
        filePath,
        pathname,
        title: articlePage.seo.title,
        description: articlePage.seo.description,
      });
    }
  }

  return { pages, routeManifest };
}

export function getPagePaths() {
  return pageSequence.map(({ lang, page }) => outputPathFor(lang, page));
}

export { hrefFor as routeFor, outputPathFor, pageOrder };
