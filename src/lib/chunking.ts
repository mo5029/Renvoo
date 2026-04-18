export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars).trimEnd()}\n\n[truncated]`;
}

export function chunkText(
  text: string,
  options: {
    maxChars?: number;
    overlapChars?: number;
  } = {},
): string[] {
  const maxChars = options.maxChars ?? 4000;
  const overlapChars = options.overlapChars ?? 400;
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return [];
  }

  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChars) {
      const sentenceParts = paragraph.split(/(?<=[.!?])\s+/);
      for (const part of sentenceParts) {
        if ((current + "\n\n" + part).trim().length > maxChars && current) {
          chunks.push(current.trim());
          const overlap = current.slice(Math.max(0, current.length - overlapChars)).trim();
          current = overlap ? `${overlap}\n\n${part}` : part;
        } else {
          current = current ? `${current}\n\n${part}` : part;
        }
      }
      continue;
    }

    if ((current + "\n\n" + paragraph).trim().length > maxChars && current) {
      chunks.push(current.trim());
      const overlap = current.slice(Math.max(0, current.length - overlapChars)).trim();
      current = overlap ? `${overlap}\n\n${paragraph}` : paragraph;
      continue;
    }

    current = current ? `${current}\n\n${paragraph}` : paragraph;
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}
