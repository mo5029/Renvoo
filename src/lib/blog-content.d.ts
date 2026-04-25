export type BlogStatus = "draft" | "published";

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogSourceLink {
  title: string;
  url: string;
}

export interface SuggestedInternalLink {
  pageKey: string;
  label: string;
  href: string;
}

export interface BlogHeading {
  depth: number;
  text: string;
  id?: string;
}

export interface BlogValidationCheck {
  ok: boolean;
  label: string;
  detail: string;
}

export interface BlogComplianceViolation {
  code: string;
  label: string;
  detail: string;
}

export interface BlogComplianceResult {
  ok: boolean;
  violations: BlogComplianceViolation[];
}

export interface BlogValidationResult {
  ok: boolean;
  score: number;
  checks: BlogValidationCheck[];
  compliance: BlogComplianceResult;
  duplicates: BlogPost[];
  stats: {
    sentenceCount: number;
    wordCount: number;
    averageWordsPerSentence: number;
  };
}

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  updated: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  status: BlogStatus;
  locale: "nl" | "en";
  searchIntent: string;
  answer: string;
  sources: BlogSourceLink[];
  faq: BlogFaqItem[];
  schema: Record<string, unknown>;
  content: string;
  contentHtml: string;
  plainText: string;
  headings: BlogHeading[];
  filePath?: string;
}

export declare const BLOG_STATUS: Record<BlogStatus, BlogStatus>;
export declare const DEFAULT_BLOG_DIR: string;

export declare function getSuggestedInternalLinks(post: BlogPost): SuggestedInternalLink[];
export declare function normalizeBlogPost(input: {
  filePath: string;
  parsed: {
    data?: Record<string, unknown>;
    content?: string;
  };
}): BlogPost;
export declare function loadBlogPosts(rootDir?: string, blogDir?: string): Promise<BlogPost[]>;
export declare function findDuplicatePosts(
  existingPosts: BlogPost[],
  candidate: Pick<BlogPost, "slug" | "title" | "primaryKeyword"> & { filePath?: string },
): Array<{
  post: BlogPost;
  slugMatch: boolean;
  titleMatch: boolean;
  keywordMatch: boolean;
  similarity: number;
}>;
export declare function validateBlogPost(post: BlogPost, allPosts?: BlogPost[]): BlogValidationResult;
export declare function createBlogFrontmatter(post: BlogPost): string;
