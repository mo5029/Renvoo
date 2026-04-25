import { describe, expect, it } from "vitest";

import {
  LOCALE_PREFERENCE_KEY,
  localizeInternalHref,
  translatePathname,
} from "../src/site/lib/locale.js";

describe("site locale helpers", () => {
  it("translates known Dutch paths to English", () => {
    expect(translatePathname("/pilot", "en")).toBe("/en/pilot.html");
    expect(translatePathname("/pilot.html", "en")).toBe("/en/pilot.html");
    expect(translatePathname("/blog/", "en")).toBe("/en/blog/");
  });

  it("translates known English paths back to Dutch", () => {
    expect(translatePathname("/en/trust", "nl")).toBe("/trust.html");
    expect(translatePathname("/en/product.html", "nl")).toBe("/product.html");
  });

  it("does not rewrite localized blog article routes", () => {
    expect(translatePathname("/blog/no-show-software-voor-tandartspraktijken/", "en")).toBeNull();
    expect(translatePathname("/en/blog/dental-clinic-no-show-software/", "nl")).toBeNull();
  });

  it("rewrites accidental Dutch internal links to the preferred English route", () => {
    const result = localizeInternalHref(
      "/pilot.html#booking",
      "en",
      "https://renvoo.nl/en/trust",
    );

    expect(result).toBe("/en/pilot.html#booking");
  });

  it("leaves downloads and external links untouched", () => {
    expect(
      localizeInternalHref(
        "../downloads/renvoo-clinic-one-pager.pptx",
        "en",
        "https://renvoo.nl/en/trust",
      ),
    ).toBeNull();

    expect(
      localizeInternalHref(
        "https://example.com/something",
        "en",
        "https://renvoo.nl/en/trust",
      ),
    ).toBeNull();
  });

  it("exposes the stable locale preference storage key", () => {
    expect(LOCALE_PREFERENCE_KEY).toBe("renvoo-locale-preference");
  });
});
