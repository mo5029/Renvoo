import crypto from "node:crypto";
import path from "node:path";
import slugify from "slugify";

export function toSlug(value: string): string {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function stableId(seed: string): string {
  return crypto.createHash("sha1").update(seed).digest("hex").slice(0, 16);
}

export function fileStem(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

export function bucketForLabel(value: string): string {
  const normalized = toSlug(value);
  const first = normalized.charAt(0);

  if (!first) return "misc";
  if (/\d/.test(first)) return "0-9";
  if (first <= "f") return "a-f";
  if (first <= "l") return "g-l";
  if (first <= "r") return "m-r";
  return "s-z";
}
