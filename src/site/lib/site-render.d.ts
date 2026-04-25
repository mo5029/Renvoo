import type { BlogPost } from "../../lib/blog-content.js";

export interface RenderedPage {
  path: string;
  html: string;
}

export interface RouteManifestEntry {
  locale: "nl" | "en";
  type: string;
  filePath: string;
  pathname: string;
  title: string;
  description: string;
}

export declare function renderAllPages(options?: {
  siteUrl?: string;
  contactEmail?: string;
  posts?: BlogPost[];
}): {
  pages: RenderedPage[];
  routeManifest: RouteManifestEntry[];
};
