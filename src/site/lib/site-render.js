import {
  alternateLocale,
  commercialPageKeys,
  localeOrder,
  pageFilePathFor,
  pageLabelFor,
  pagePathFor,
  pageSlugs,
  siteContent,
} from "./site-content.js";
import { getSuggestedInternalLinks } from "../../lib/blog-content.js";

const rootPageKeys = [
  "home",
  "about",
  "contact",
  "useCases",
  "dentalClinics",
  "privateClinics",
  "noShowReduction",
  "appointmentReminders",
  "cancellationManagement",
  "blogIndex",
  "privacy",
  "patientNotice",
];

function assetPrefix(filePath) {
  const depth = filePath.split("/").length;
  return Array.from({ length: depth }, () => "..").join("/");
}

function canonicalUrl(siteUrl, pathname) {
  if (!siteUrl) {
    return pathname;
  }

  return `${siteUrl.replace(/\/+$/, "")}${pathname}`;
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
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`,
    )
    .join("\n");
}

function buildOrganizationSchema(locale, siteUrl) {
  const content = siteContent[locale];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Renvoo",
    url: canonicalUrl(siteUrl, pagePathFor(locale, "home")),
    logo: canonicalUrl(siteUrl, "/social-preview.png"),
    description: content.footer.summary,
    areaServed: "NL",
    sameAs: [],
  };
}

function buildWebsiteSchema(locale, siteUrl) {
  const content = siteContent[locale];
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Renvoo",
    url: canonicalUrl(siteUrl, pagePathFor(locale, "home")),
    inLanguage: content.locale,
    description: content.footer.summary,
  };
}

function buildSoftwareSchema(locale, siteUrl, page) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Renvoo",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: siteContent[locale].locale,
    description: page.answer || page.hero.lead,
    url: canonicalUrl(siteUrl, pagePathFor(locale, page.key)),
    featureList: [
      "No-show reduction workflow",
      "Appointment confirmation support",
      "Late cancellation handling",
      "Recovered capacity and backfill support",
    ],
  };
}

function buildFaqSchema(faq) {
  if (!faq?.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
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
  if (!breadcrumbs?.length) {
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

function buildArticleSchema(siteUrl, locale, post, breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.updated,
    inLanguage: locale === "en" ? "en-US" : "nl-NL",
    mainEntityOfPage: canonicalUrl(
      siteUrl,
      locale === "en" ? `/en/blog/${post.slug}/` : `/blog/${post.slug}/`,
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
    keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(", "),
    articleSection: post.category,
    breadcrumb: buildBreadcrumbSchema(siteUrl, breadcrumbs),
  };
}

function renderHeader(locale, currentPageKey) {
  const content = siteContent[locale];
  const navLinks = [
    { key: "home", href: pagePathFor(locale, "home"), label: content.nav.home },
    { key: "useCases", href: pagePathFor(locale, "useCases"), label: content.nav.useCases },
    { key: "about", href: pagePathFor(locale, "about"), label: content.nav.about },
    { key: "blogIndex", href: pagePathFor(locale, "blogIndex"), label: content.nav.blogIndex },
    { key: "contact", href: pagePathFor(locale, "contact"), label: content.nav.contact },
  ];
  const switchLocale = alternateLocale(locale);

  return `<header class="site-header" data-header>
  <div class="site-header-inner">
    <a class="brand" href="${pagePathFor(locale, "home")}" aria-label="Renvoo ${content.nav.home}">
      <img src="./assets/renvoo-logo-horizontal.png" alt="Renvoo" />
      <span>${content.brand.taglines[locale]}</span>
    </a>
    <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">
      <span></span>
      <span></span>
      <span></span>
      <span class="sr-only">Toggle navigation</span>
    </button>
    <div class="nav-shell" data-nav-shell>
      <nav class="site-nav" id="site-nav" aria-label="Primary">
        ${navLinks
          .map(
            (link) =>
              `<a href="${link.href}" class="${currentPageKey === link.key ? "is-active" : ""}">${link.label}</a>`,
          )
          .join("")}
      </nav>
      <div class="header-actions">
        <a class="language-switch" href="${pagePathFor(switchLocale, currentPageKey === "notFound" ? "home" : currentPageKey)}" data-track="language_switched">${content.switchLabel}</a>
        <a class="button button-primary button-small" href="${pagePathFor(locale, "contact")}#request" data-track="nav_book_meeting">${content.nav.cta}</a>
      </div>
    </div>
  </div>
</header>`;
}

function renderFooter(locale) {
  const content = siteContent[locale];
  return `<footer class="site-footer">
  <div class="site-footer-grid">
    <div>
      <p class="footer-title">Renvoo</p>
      <p>${content.footer.summary}</p>
    </div>
    <div>
      <p class="footer-title">${content.nav.useCases}</p>
      <ul class="footer-links">
        <li><a href="${pagePathFor(locale, "dentalClinics")}">${content.pageNames.dentalClinics}</a></li>
        <li><a href="${pagePathFor(locale, "noShowReduction")}">${content.pageNames.noShowReduction}</a></li>
        <li><a href="${pagePathFor(locale, "cancellationManagement")}">${content.pageNames.cancellationManagement}</a></li>
      </ul>
    </div>
    <div>
      <p class="footer-title">${content.pageNames.about}</p>
      <ul class="footer-links">
        <li><a href="${pagePathFor(locale, "about")}">${content.pageNames.about}</a></li>
        <li><a href="${pagePathFor(locale, "privacy")}">${content.pageNames.privacy}</a></li>
        <li><a href="${pagePathFor(locale, "patientNotice")}">${content.pageNames.patientNotice}</a></li>
      </ul>
    </div>
    <div>
      <p class="footer-title">${content.pageNames.contact}</p>
      <ul class="footer-links">
        <li><a href="${pagePathFor(locale, "contact")}">${content.pageNames.contact}</a></li>
        <li><a href="${pagePathFor(locale, "blogIndex")}">${content.pageNames.blogIndex}</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-meta">
    <p>${content.footer.proofNote}</p>
    <p><span data-year></span> Renvoo</p>
  </div>
</footer>`;
}

function renderHero(page, locale) {
  return `<section class="page-hero chapter">
  <div class="hero-grid">
    <div class="hero-copy" data-reveal>
      <p class="eyebrow">${page.hero.eyebrow}</p>
      <h1>${page.hero.title}</h1>
      <p class="hero-lead">${page.hero.lead}</p>
      <div class="hero-actions">
        ${renderCtaLink(locale, page.hero.primary, "button button-primary", "hero_cta")}
        ${renderCtaLink(locale, page.hero.secondary, "button button-secondary")}
      </div>
      ${
        page.hero.badges?.length
          ? `<ul class="hero-badges">${page.hero.badges.map((badge) => `<li>${badge}</li>`).join("")}</ul>`
          : ""
      }
    </div>
    <aside class="hero-sidecard" data-reveal>
      <p class="eyebrow subdued">${siteContent[locale].brand.name}</p>
      <p>${page.answer || page.hero.lead}</p>
    </aside>
  </div>
</section>`;
}

function renderCtaLink(locale, action, classes, track = "") {
  if (!action) {
    return "";
  }

  if (action.href) {
    return `<a class="${classes}" href="${action.href}"${track ? ` data-track="${track}"` : ""}>${action.label}</a>`;
  }

  return `<a class="${classes}" href="${pagePathFor(locale, action.pageKey)}"${track ? ` data-track="${track}"` : ""}>${action.label}</a>`;
}

function renderBreadcrumbs(locale, pageKey, currentLabel) {
  if (pageKey === "home" || pageKey === "notFound") {
    return [];
  }

  const content = siteContent[locale];
  const items = [{ href: pagePathFor(locale, "home"), label: content.pageNames.home }];

  if (pageKey === "blogIndex") {
    items.push({ href: pagePathFor(locale, "blogIndex"), label: content.pageNames.blogIndex });
    return items;
  }

  items.push({ href: pagePathFor(locale, pageKey), label: currentLabel });
  return items;
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

function renderAnswerBlock(page) {
  return `<section class="chapter answer-block" data-reveal>
  <div class="answer-card">
    <p class="eyebrow subdued">Direct answer</p>
    <p class="answer-copy">${page.answer}</p>
  </div>
  <div class="definition-card">
    <h2>${page.definitionTitle}</h2>
    <p>${page.definition}</p>
    ${
      page.audience?.length
        ? `<div class="definition-list">
      <h3>${page.audienceTitle}</h3>
      <ul>${page.audience.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>`
        : ""
    }
  </div>
</section>`;
}

function renderCardsSection(section, locale) {
  return `<section class="chapter">
  ${renderSectionHeading(section)}
  <div class="card-grid">
    ${section.items
      .map(
        (item, index) => `<article class="glass-card" data-reveal style="--reveal-delay:${index * 90}ms">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
        ${
          item.pageKey
            ? `<a class="inline-link" href="${pagePathFor(locale, item.pageKey)}">${item.label}</a>`
            : ""
        }
      </article>`,
      )
      .join("")}
  </div>
</section>`;
}

function renderStepsSection(section) {
  return `<section class="chapter">
  ${renderSectionHeading(section)}
  <div class="steps-grid">
    ${section.items
      .map(
        (item, index) => `<article class="step-card" data-reveal style="--reveal-delay:${index * 90}ms">
        <span class="step-count">0${index + 1}</span>
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </article>`,
      )
      .join("")}
  </div>
</section>`;
}

function renderComparisonSection(section) {
  return `<section class="chapter">
  ${renderSectionHeading(section)}
  <div class="comparison-grid">
    <article class="comparison-card" data-reveal>
      <p class="eyebrow subdued">${section.leftTitle}</p>
      <ul>${section.leftItems.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <article class="comparison-card comparison-card-accent" data-reveal style="--reveal-delay:110ms">
      <p class="eyebrow subdued">${section.rightTitle}</p>
      <ul>${section.rightItems.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
  </div>
</section>`;
}

function renderSectionHeading(section) {
  return `<div class="section-heading" data-reveal>
  ${section.eyebrow ? `<p class="eyebrow">${section.eyebrow}</p>` : ""}
  <h2>${section.title}</h2>
  ${section.intro ? `<p class="section-intro">${section.intro}</p>` : ""}
</div>`;
}

function renderFaq(locale, faq) {
  if (!faq?.length) {
    return "";
  }

  return `<section class="chapter faq-section">
  <div class="section-heading" data-reveal>
    <p class="eyebrow">${locale === "en" ? "FAQ" : "FAQ"}</p>
    <h2>${locale === "en" ? "Short answers to the first practical questions" : "Korte antwoorden op de eerste praktische vragen"}</h2>
  </div>
  <div class="faq-list" data-reveal>
    ${faq
      .map(
        (item) => `<details class="faq-item">
        <summary>${item.question}</summary>
        <p>${item.answer}</p>
      </details>`,
      )
      .join("")}
  </div>
</section>`;
}

function renderRelatedPages(locale, relatedPages) {
  if (!relatedPages?.length) {
    return "";
  }

  return `<section class="chapter">
  <div class="section-heading" data-reveal>
    <p class="eyebrow">${locale === "en" ? "Related pages" : "Gerelateerde pagina's"}</p>
    <h2>${locale === "en" ? "Keep following the right path" : "Volg de juiste volgende stap"}</h2>
  </div>
  <div class="card-grid">
    ${relatedPages
      .map(
        (item, index) => `<article class="glass-card" data-reveal style="--reveal-delay:${index * 90}ms">
        <h3>${item.label}</h3>
        <p>${item.blurb}</p>
        <a class="inline-link" href="${pagePathFor(locale, item.pageKey)}">${item.label}</a>
      </article>`,
      )
      .join("")}
  </div>
</section>`;
}

function renderCtaBand(locale, cta) {
  if (!cta) {
    return "";
  }

  return `<section class="chapter">
  <div class="cta-band" data-reveal>
    <div>
      <p class="eyebrow">${cta.eyebrow}</p>
      <h2>${cta.title}</h2>
      <p>${cta.body}</p>
    </div>
    <div class="hero-actions">
      ${renderCtaLink(locale, cta.primary, "button button-primary")}
      ${renderCtaLink(locale, cta.secondary, "button button-secondary")}
    </div>
  </div>
</section>`;
}

function renderStandardPage(locale, page) {
  return [
    renderHero(page, locale),
    renderAnswerBlock(page),
    ...(page.sections ?? []).map((section) => {
      if (section.type === "cards") {
        return renderCardsSection(section, locale);
      }
      if (section.type === "steps") {
        return renderStepsSection(section);
      }
      if (section.type === "comparison") {
        return renderComparisonSection(section);
      }
      return "";
    }),
    renderRelatedPages(locale, page.relatedPages),
    renderFaq(locale, page.faq),
    renderCtaBand(locale, page.cta),
  ].join("\n");
}

function renderLegalPage(locale, page) {
  return [
    renderHero(page, locale),
    `<section class="chapter">
      <div class="card-grid">
        ${page.cards
          .map(
            (card, index) => `<article class="glass-card" data-reveal style="--reveal-delay:${index * 90}ms">
            <h2>${card.title}</h2>
            <p>${card.body}</p>
          </article>`,
          )
          .join("")}
      </div>
    </section>`,
    renderCtaBand(locale, page.cta),
  ].join("\n");
}

function renderContactPage(locale, page, contactEmail) {
  const form = siteContent[locale].contactForm;

  return [
    renderHero(page, locale),
    renderAnswerBlock(page),
    `<section class="chapter contact-split" id="request">
      <div class="contact-form-shell" data-reveal>
        <div class="section-heading">
          <p class="eyebrow">${siteContent[locale].pageNames.contact}</p>
          <h2>${form.title}</h2>
          <p class="section-intro">${form.intro}</p>
        </div>
        <form class="contact-form" data-contact-form data-contact-email="${contactEmail || ""}" novalidate>
          <div class="field-grid">
            ${renderField("text", "name", form.fields.name)}
            ${renderField("text", "clinic", form.fields.clinic)}
            ${renderSelect("role", form.fields.role, form.roles)}
            ${renderField("email", "email", form.fields.email)}
            ${renderField("tel", "phone", form.fields.phone, false)}
            ${renderField("text", "preferredTime", form.fields.preferredTime)}
          </div>
          ${renderTextarea("challenge", form.fields.challenge)}
          ${renderTextarea("notes", form.fields.notes, false)}
          <p class="form-status" data-contact-status aria-live="polite"></p>
          <div class="hero-actions">
            <button class="button button-primary" type="submit">${form.buttons.submit}</button>
            <button class="button button-secondary" type="button" data-contact-copy hidden>${form.buttons.copy}</button>
            <button class="button button-secondary" type="button" data-contact-mail hidden>${form.buttons.mail}</button>
          </div>
          <pre class="contact-summary" data-contact-summary hidden></pre>
        </form>
      </div>
      <aside class="hero-sidecard" data-reveal style="--reveal-delay:110ms">
        <p class="eyebrow subdued">${locale === "en" ? "What the form captures" : "Wat het formulier vastlegt"}</p>
        <ul class="bullet-list compact">
          <li>${page.audience[0]}</li>
          <li>${page.audience[1]}</li>
          <li>${page.audience[2]}</li>
        </ul>
      </aside>
    </section>`,
    ...(page.sections ?? []).map((section) => renderCardsSection(section, locale)),
    renderRelatedPages(locale, page.relatedPages),
    renderFaq(locale, page.faq),
    renderCtaBand(locale, page.cta),
  ].join("\n");
}

function renderField(type, name, label, required = true) {
  return `<label class="field">
    <span>${label}</span>
    <input type="${type}" name="${name}" ${required ? "required" : ""} />
    <small class="field-error" data-field-error="${name}"></small>
  </label>`;
}

function renderSelect(name, label, options) {
  return `<label class="field">
    <span>${label}</span>
    <select name="${name}" required>
      <option value=""></option>
      ${options.map((option) => `<option value="${option}">${option}</option>`).join("")}
    </select>
    <small class="field-error" data-field-error="${name}"></small>
  </label>`;
}

function renderTextarea(name, label, required = true) {
  return `<label class="field field-full">
    <span>${label}</span>
    <textarea name="${name}" rows="4" ${required ? "required" : ""}></textarea>
    <small class="field-error" data-field-error="${name}"></small>
  </label>`;
}

function renderBlogIndex(locale, page, posts) {
  const content = siteContent[locale].blog;
  const publishedPosts = posts.filter((post) => post.locale === locale && post.status === "published");

  return [
    renderHero(page, locale),
    `<section class="chapter">
      <div class="section-heading" data-reveal>
        <p class="eyebrow">${content.eyebrow}</p>
        <h2>${content.title}</h2>
        <p class="section-intro">${content.intro}</p>
      </div>
      ${
        publishedPosts.length
          ? `<div class="blog-grid">
          ${publishedPosts
            .map(
              (post, index) => `<article class="blog-card" data-reveal style="--reveal-delay:${index * 90}ms">
              <p class="blog-meta">${new Date(post.date).toLocaleDateString(locale === "en" ? "en-US" : "nl-NL", { year: "numeric", month: "short", day: "numeric" })} · ${post.primaryKeyword}</p>
              <h3>${post.title}</h3>
              <p>${post.excerpt}</p>
              <div class="blog-card-footer">
                <span class="category-chip">${post.category}</span>
                <a class="inline-link" href="${locale === "en" ? `/en/blog/${post.slug}/` : `/blog/${post.slug}/`}">${content.readMore}</a>
              </div>
            </article>`,
            )
            .join("")}
        </div>`
          : `<div class="empty-state" data-reveal><p>${content.emptyLabel}</p></div>`
      }
    </section>`,
    renderCtaBand(locale, {
      eyebrow: content.eyebrow,
      title: content.ctaTitle,
      body: content.ctaBody,
      primary: { pageKey: "contact", label: content.ctaPrimary },
      secondary: { pageKey: "useCases", label: locale === "en" ? "View use cases" : "Bekijk use cases" },
    }),
  ].join("\n");
}

function renderBlogArticle(locale, post) {
  const content = siteContent[locale].blog;
  const relatedLinks = getSuggestedInternalLinks(post);
  return `<article class="chapter article-shell">
    <div class="article-head" data-reveal>
      <p class="eyebrow">${content.eyebrow}</p>
      <h1>${post.title}</h1>
      <p class="hero-lead">${post.excerpt}</p>
      <div class="article-meta">
        <span>${new Date(post.date).toLocaleDateString(locale === "en" ? "en-US" : "nl-NL", { year: "numeric", month: "long", day: "numeric" })}</span>
        <span>${post.primaryKeyword}</span>
      </div>
    </div>
    <section class="answer-card article-answer" data-reveal>
      <p class="eyebrow subdued">${locale === "en" ? "Short answer" : "Kort antwoord"}</p>
      <p class="answer-copy">${post.answer || post.excerpt}</p>
    </section>
    <div class="article-body prose" data-reveal>${post.contentHtml}</div>
  </article>
  ${renderSources(locale, post.sources)}
  ${renderFaq(locale, post.faq)}
  ${renderArticleRelated(locale, relatedLinks)}
  ${renderCtaBand(locale, {
    eyebrow: content.eyebrow,
    title: content.ctaTitle,
    body: content.ctaBody,
    primary: { pageKey: "contact", label: content.ctaPrimary },
    secondary: { pageKey: "blogIndex", label: content.backToBlog },
  })}`;
}

function renderSources(locale, sources) {
  if (!sources?.length) {
    return "";
  }

  return `<section class="chapter">
    <div class="section-heading" data-reveal>
      <p class="eyebrow">${locale === "en" ? "Sources" : "Bronnen"}</p>
      <h2>${siteContent[locale].blog.sourcesTitle}</h2>
    </div>
    <div class="glass-card" data-reveal>
      <ul class="source-list">
        ${sources
          .map(
            (source) =>
              `<li><a href="${source.url}" rel="noreferrer">${source.title}</a></li>`,
          )
          .join("")}
      </ul>
    </div>
  </section>`;
}

function renderArticleRelated(locale, links) {
  if (!links?.length) {
    return "";
  }

  return `<section class="chapter">
    <div class="section-heading" data-reveal>
      <p class="eyebrow">${locale === "en" ? "Internal links" : "Interne links"}</p>
      <h2>${siteContent[locale].blog.relatedTitle}</h2>
    </div>
    <div class="card-grid">
      ${links
        .map(
          (link, index) => `<article class="glass-card" data-reveal style="--reveal-delay:${index * 90}ms">
          <h3>${link.label}</h3>
          <p>${link.href}</p>
          <a class="inline-link" href="${link.href}">${link.label}</a>
        </article>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderNotFound(locale) {
  const page = siteContent[locale].pages.notFound;
  return `<section class="chapter not-found-wrap">
    <div class="not-found-card" data-reveal>
      <p class="eyebrow">${page.hero.eyebrow}</p>
      <h1>${page.hero.title}</h1>
      <p class="hero-lead">${page.hero.lead}</p>
      <div class="hero-actions">
        <a class="button button-primary" href="${pagePathFor(locale, "home")}">${siteContent[locale].pageNames.home}</a>
        <a class="button button-secondary" href="${pagePathFor(locale, "useCases")}">${siteContent[locale].pageNames.useCases}</a>
      </div>
    </div>
  </section>`;
}

function renderDocument({
  locale,
  pageKey,
  page,
  filePath,
  content,
  mainContent,
  siteUrl,
  breadcrumbs,
  schema,
  extraHead = "",
  pathnameOverride = "",
}) {
  const prefix = assetPrefix(filePath);
  const canonicalPath = pathnameOverride || pagePathFor(locale, pageKey);
  const canonical = canonicalUrl(siteUrl, canonicalPath);
  const alternate = alternateLocale(locale);
  const alternatePath =
    pageKey === "notFound" || page.type === "article" ? null : pagePathFor(alternate, pageKey);
  const logoPath = `${prefix}/assets/renvoo-logo-horizontal.png`;
  const alternateHead = siteUrl
    ? `<link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="${content.locale}" href="${canonical}" />
    ${
      alternatePath
        ? `<link rel="alternate" hreflang="${siteContent[alternate].locale}" href="${canonicalUrl(siteUrl, alternatePath)}" />
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl(siteUrl, pagePathFor("nl", pageKey))}" />`
        : ""
    }`
    : "";

  return `<!doctype html>
<html lang="${content.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.seo.title}</title>
    <meta name="description" content="${page.seo.description}" />
    <meta name="theme-color" content="#f4efe7" />
    <meta name="robots" content="index,follow" />
    <meta property="og:type" content="${page.type === "article" ? "article" : "website"}" />
    <meta property="og:title" content="${page.seo.title}" />
    <meta property="og:description" content="${page.seo.description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${canonicalUrl(siteUrl, "/social-preview.png")}" />
    <meta property="og:image:alt" content="Renvoo website preview" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.seo.title}" />
    <meta name="twitter:description" content="${page.seo.description}" />
    <meta name="twitter:image" content="${canonicalUrl(siteUrl, "/social-preview.png")}" />
    ${alternateHead}
    <link rel="icon" type="image/png" href="/icons/favicon.png" />
    <link rel="apple-touch-icon" href="/icons/favicon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="stylesheet" href="${prefix}/styles.css" />
    ${extraHead}
    ${renderJsonLd(schema)}
  </head>
  <body data-page="${pageKey}" data-locale="${locale}" data-contact-email="">
    <a class="skip-link" href="#content">${locale === "en" ? "Skip to content" : "Ga naar inhoud"}</a>
    <div class="page-aura page-aura-left"></div>
    <div class="page-aura page-aura-right"></div>
    ${renderHeader(locale, pageKey).replace("./assets/renvoo-logo-horizontal.png", logoPath)}
    ${renderBreadcrumbNav(breadcrumbs)}
    <main id="content" class="site-main">
      ${mainContent}
    </main>
    ${renderFooter(locale)}
    <script type="module" src="${prefix}/main.js"></script>
  </body>
</html>`;
}

function buildStandardSchema(locale, pageKey, page, siteUrl, breadcrumbs) {
  return [
    buildOrganizationSchema(locale, siteUrl),
    pageKey === "home" || pageKey === "blogIndex" ? buildWebsiteSchema(locale, siteUrl) : null,
    pageKey !== "blogIndex" && pageKey !== "privacy" && pageKey !== "patientNotice"
      ? buildSoftwareSchema(locale, siteUrl, { ...page, key: pageKey })
      : null,
    buildFaqSchema(page.faq),
    buildBreadcrumbSchema(siteUrl, breadcrumbs),
  ];
}

export function renderAllPages({ siteUrl = "", contactEmail = "", posts = [] } = {}) {
  const pages = [];
  const routeManifest = [];

  for (const locale of localeOrder) {
    const content = siteContent[locale];

    for (const pageKey of rootPageKeys) {
      const page = content.pages[pageKey];
      const filePath = pageFilePathFor(locale, pageKey);
      const breadcrumbs = renderBreadcrumbs(locale, pageKey, pageLabelFor(content, pageKey));
      const schema = buildStandardSchema(locale, pageKey, page, siteUrl, breadcrumbs);
      const mainContent =
        page.type === "home" || page.type === "standard"
          ? renderStandardPage(locale, page)
          : page.type === "contact"
            ? renderContactPage(locale, page, contactEmail)
            : page.type === "blogIndex"
              ? renderBlogIndex(locale, page, posts)
              : renderLegalPage(locale, page);

      pages.push({
        path: filePath,
        html: renderDocument({
          locale,
          pageKey,
          page,
          filePath,
          content,
          mainContent,
          siteUrl,
          breadcrumbs,
          schema,
        }),
      });

      routeManifest.push({
        locale,
        type: page.type,
        filePath,
        pathname: pagePathFor(locale, pageKey),
        title: page.seo.title,
        description: page.seo.description,
      });
    }
  }

  const notFoundPage = siteContent.nl.pages.notFound;
  const notFoundBreadcrumbs = [];
  pages.push({
    path: "404.html",
    html: renderDocument({
      locale: "nl",
      pageKey: "notFound",
      page: notFoundPage,
      filePath: "404.html",
      content: siteContent.nl,
      mainContent: renderNotFound("nl"),
      siteUrl,
      breadcrumbs: notFoundBreadcrumbs,
      schema: [buildOrganizationSchema("nl", siteUrl)],
    }),
  });

  routeManifest.push({
    locale: "nl",
    type: "notFound",
    filePath: "404.html",
    pathname: "/404.html",
    title: notFoundPage.seo.title,
    description: notFoundPage.seo.description,
  });

  for (const locale of localeOrder) {
    const localizedPosts = posts.filter((post) => post.locale === locale && post.status === "published");
    for (const post of localizedPosts) {
      const pathname = locale === "en" ? `/en/blog/${post.slug}/` : `/blog/${post.slug}/`;
      const filePath = locale === "en" ? `en/blog/${post.slug}/index.html` : `blog/${post.slug}/index.html`;
      const breadcrumbs = [
        { href: pagePathFor(locale, "home"), label: siteContent[locale].pageNames.home },
        { href: pagePathFor(locale, "blogIndex"), label: siteContent[locale].pageNames.blogIndex },
        { href: pathname, label: post.title },
      ];
      const schema = [
        buildOrganizationSchema(locale, siteUrl),
        buildArticleSchema(siteUrl, locale, post, breadcrumbs),
        buildFaqSchema(post.faq),
        buildBreadcrumbSchema(siteUrl, breadcrumbs),
      ];

      const articlePage = {
        type: "article",
        seo: {
          title: post.metaTitle || post.title,
          description: post.metaDescription || post.excerpt,
        },
      };

      pages.push({
        path: filePath,
        html: renderDocument({
          locale,
          pageKey: "blogIndex",
          page: articlePage,
          filePath,
          content: siteContent[locale],
          mainContent: `${renderBreadcrumbNav(breadcrumbs)}${renderBlogArticle(locale, post)}`,
          siteUrl,
          breadcrumbs: [],
          schema,
          pathnameOverride: pathname,
          extraHead: `<meta property="article:published_time" content="${post.date}" />
    <meta property="article:modified_time" content="${post.updated}" />
    <meta property="article:section" content="${post.category}" />`,
        }).replace(renderBreadcrumbNav([]), ""),
      });

      routeManifest.push({
        locale,
        type: "article",
        filePath,
        pathname,
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
      });
    }
  }

  return { pages, routeManifest };
}
