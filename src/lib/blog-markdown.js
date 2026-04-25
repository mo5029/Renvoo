function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function applyInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function flushParagraph(buffer, html) {
  if (!buffer.length) {
    return;
  }

  html.push(`<p>${applyInlineMarkdown(buffer.join(" "))}</p>`);
  buffer.length = 0;
}

function flushList(listState, html) {
  if (!listState.items.length) {
    return;
  }

  const tag = listState.type === "ordered" ? "ol" : "ul";
  html.push(`<${tag}>${listState.items.join("")}</${tag}>`);
  listState.type = null;
  listState.items = [];
}

export function stripMarkdown(markdown) {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractMarkdownHeadings(markdown) {
  return String(markdown)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (!match) {
        return null;
      }

      return {
        depth: match[1].length,
        text: match[2].trim(),
      };
    })
    .filter(Boolean);
}

export function renderMarkdown(markdown) {
  const lines = String(markdown).replace(/\r/g, "").split("\n");
  const html = [];
  const paragraph = [];
  const listState = { type: null, items: [] };
  let inCodeBlock = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushParagraph(paragraph, html);
      flushList(listState, html);
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) {
        html.push("<pre><code>");
      } else {
        html.push("</code></pre>");
      }
      continue;
    }

    if (inCodeBlock) {
      html.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (!trimmed) {
      flushParagraph(paragraph, html);
      flushList(listState, html);
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph(paragraph, html);
      flushList(listState, html);
      const depth = Math.min(6, headingMatch[1].length);
      html.push(`<h${depth}>${applyInlineMarkdown(headingMatch[2].trim())}</h${depth}>`);
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s+(.+)$/);
    if (quoteMatch) {
      flushParagraph(paragraph, html);
      flushList(listState, html);
      html.push(`<blockquote><p>${applyInlineMarkdown(quoteMatch[1])}</p></blockquote>`);
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph(paragraph, html);
      if (listState.type && listState.type !== "ordered") {
        flushList(listState, html);
      }
      listState.type = "ordered";
      listState.items.push(`<li>${applyInlineMarkdown(orderedMatch[2])}</li>`);
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph(paragraph, html);
      if (listState.type && listState.type !== "unordered") {
        flushList(listState, html);
      }
      listState.type = "unordered";
      listState.items.push(`<li>${applyInlineMarkdown(bulletMatch[1])}</li>`);
      continue;
    }

    flushList(listState, html);
    paragraph.push(trimmed);
  }

  flushParagraph(paragraph, html);
  flushList(listState, html);

  return html.join("\n");
}
