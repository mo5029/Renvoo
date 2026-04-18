export type SourceKind = "file" | "url" | "text";
export type NoteType = "topic" | "entity" | "decision" | "source";
export type Confidence = "low" | "medium" | "high";
export type StorageStrategy = "wiki-only" | "wiki-and-archive" | "archive-first";

export interface AppConfig {
  rootDir: string;
  vendorDir: string;
  vaultDir: string;
  rawDir: string;
  assetsDir: string;
  archiveDir: string;
  archiveCacheDir: string;
  systemDir: string;
  wikiDir: string;
  maintenanceDir: string;
  queryDir: string;
  indexDir: string;
  logDir: string;
  stateDir: string;
  openAi: {
    apiKey?: string;
    model: string;
    reasoningEffort: "none" | "minimal" | "low" | "medium" | "high";
  };
  pinecone: {
    apiKey?: string;
    indexName?: string;
    namespace: string;
    cloud: string;
    region: string;
    embedModel: string;
  };
  budgets: {
    noteTokens: number;
    contextTokens: number;
  };
}

export interface RawSourceInput {
  kind: SourceKind;
  title?: string;
  filePath?: string;
  url?: string;
  text?: string;
  domain?: string;
  tags: string[];
}

export interface LoadedSource {
  id: string;
  kind: SourceKind;
  title: string;
  domain: string;
  text: string;
  url?: string;
  originalFilePath?: string;
  rawNotePath: string;
  originalCopyPath?: string;
  assetPaths: string[];
  tags: string[];
  createdAt: string;
}

export interface Claim {
  statement: string;
  confidence: Confidence;
  evidence?: string;
}

export interface NoteDraft {
  title: string;
  slug: string;
  summary: string;
  evidence: string[];
  claims: Claim[];
}

export interface ContradictionAlert {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  relatedTitles: string[];
}

export interface SourceSynthesis {
  summary: string;
  storageStrategy: StorageStrategy;
  topics: NoteDraft[];
  entities: NoteDraft[];
  decisions: NoteDraft[];
  claims: Claim[];
  contradictions: ContradictionAlert[];
  searchHints: string[];
}

export interface QueryAnswer {
  answer: string;
  citations: string[];
  followUps: string[];
}

export interface SearchHit {
  path: string;
  title: string;
  type: string;
  summary: string;
  score: number;
  excerpt: string;
}

export interface ArchiveRecord {
  _id: string;
  chunk_text: string;
  document_id: string;
  document_title: string;
  source_kind: SourceKind;
  source_path: string;
  domain: string;
  source_url?: string;
  tags?: string;
}

export interface ArchiveHit {
  id: string;
  score: number;
  text: string;
  title: string;
  sourcePath?: string;
  sourceUrl?: string;
}

export interface LintFinding {
  type: "broken-link" | "orphan" | "stale" | "oversized" | "archive-gap";
  severity: "error" | "warn" | "info";
  path: string;
  message: string;
}
