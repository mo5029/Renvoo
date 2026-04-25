export const LOCALE_PREFERENCE_KEY = "renvoo-locale-preference";

const ROUTE_VARIANTS = {
  home: {
    nl: ["/", "/index.html"],
    en: ["/en", "/en/", "/en/index.html"],
  },
  product: {
    nl: ["/product", "/product.html"],
    en: ["/en/product", "/en/product.html"],
  },
  pilot: {
    nl: ["/pilot", "/pilot.html"],
    en: ["/en/pilot", "/en/pilot.html"],
  },
  trust: {
    nl: ["/trust", "/trust.html"],
    en: ["/en/trust", "/en/trust.html"],
  },
  privacy: {
    nl: ["/privacy", "/privacy.html"],
    en: ["/en/privacy", "/en/privacy.html"],
  },
  patientNotice: {
    nl: ["/patient-notice", "/patient-notice.html"],
    en: ["/en/patient-notice", "/en/patient-notice.html"],
  },
  blogIndex: {
    nl: ["/blog", "/blog/", "/blog/index.html"],
    en: ["/en/blog", "/en/blog/", "/en/blog/index.html"],
  },
  notFound: {
    nl: ["/404", "/404.html"],
    en: ["/en/404", "/en/404.html"],
  },
};

const ROUTE_TARGETS = {
  home: {
    nl: "/",
    en: "/en/",
  },
  product: {
    nl: "/product.html",
    en: "/en/product.html",
  },
  pilot: {
    nl: "/pilot.html",
    en: "/en/pilot.html",
  },
  trust: {
    nl: "/trust.html",
    en: "/en/trust.html",
  },
  privacy: {
    nl: "/privacy.html",
    en: "/en/privacy.html",
  },
  patientNotice: {
    nl: "/patient-notice.html",
    en: "/en/patient-notice.html",
  },
  blogIndex: {
    nl: "/blog/",
    en: "/en/blog/",
  },
  notFound: {
    nl: "/404.html",
    en: "/en/404.html",
  },
};

function normalizePathname(pathname) {
  if (!pathname) {
    return "/";
  }

  const trimmed = pathname.replace(/\/+$/, "");
  if (!trimmed) {
    return "/";
  }

  if (trimmed === "/en") {
    return "/en/";
  }

  if (trimmed === "/blog") {
    return "/blog/";
  }

  if (trimmed === "/en/blog") {
    return "/en/blog/";
  }

  return trimmed;
}

function isLocalizedArticlePath(pathname) {
  return /^\/(?:en\/)?blog\/[^/]+\/?$/.test(pathname) && !/^\/(?:en\/)?blog\/?$/.test(pathname);
}

function findRouteKey(pathname) {
  const normalized = normalizePathname(pathname);

  for (const [routeKey, locales] of Object.entries(ROUTE_VARIANTS)) {
    if (locales.nl.includes(normalized) || locales.en.includes(normalized)) {
      return routeKey;
    }
  }

  return null;
}

export function getStoredLocale(storage = globalThis.localStorage) {
  if (!storage) {
    return null;
  }

  try {
    const value = storage.getItem(LOCALE_PREFERENCE_KEY);
    return value === "en" || value === "nl" ? value : null;
  } catch {
    return null;
  }
}

export function setStoredLocale(locale, storage = globalThis.localStorage) {
  if (!storage || (locale !== "en" && locale !== "nl")) {
    return;
  }

  try {
    storage.setItem(LOCALE_PREFERENCE_KEY, locale);
  } catch {
    // Ignore storage failures so routing still works.
  }
}

export function translatePathname(pathname, locale) {
  if (locale !== "en" && locale !== "nl") {
    return null;
  }

  if (isLocalizedArticlePath(pathname)) {
    return null;
  }

  const routeKey = findRouteKey(pathname);
  if (!routeKey) {
    return null;
  }

  return ROUTE_TARGETS[routeKey]?.[locale] ?? null;
}

export function localizeInternalHref(href, locale, currentUrl) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }

  const baseUrl = currentUrl instanceof URL ? currentUrl : new URL(currentUrl);
  const resolved = new URL(href, baseUrl);

  if (resolved.origin !== baseUrl.origin) {
    return null;
  }

  const localizedPath = translatePathname(resolved.pathname, locale);
  if (!localizedPath) {
    return null;
  }

  return `${localizedPath}${resolved.search}${resolved.hash}`;
}
