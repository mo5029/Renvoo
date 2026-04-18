import fs from "node:fs/promises";
import path from "node:path";
import { PresentationFile } from "@oai/artifact-tool";
import { BRAND, THEME } from "../assets/canonical-copy.mjs";

export const FONTS = {
  heading: "Poppins",
  body: "Lato",
  mono: "Aptos Mono",
};

export const TRANSPARENT = "#00000000";

function lineConfig(fill = THEME.tealLine, width = 1) {
  return { style: "solid", fill, width };
}

export function addShape(
  slide,
  geometry,
  left,
  top,
  width,
  height,
  { fill = THEME.white, lineFill = TRANSPARENT, lineWidth = 0 } = {},
) {
  return slide.shapes.add({
    geometry,
    position: { left, top, width, height },
    fill,
    line: lineConfig(lineFill, lineWidth),
  });
}

export function addText(
  slide,
  text,
  left,
  top,
  width,
  height,
  {
    fontSize = 18,
    color = THEME.ink,
    bold = false,
    face = FONTS.body,
    align = "left",
    valign = "top",
    fill = TRANSPARENT,
    lineFill = TRANSPARENT,
    lineWidth = 0,
    autoFit = "shrinkText",
  } = {},
) {
  const box = addShape(slide, "rect", left, top, width, height, {
    fill,
    lineFill,
    lineWidth,
  });
  box.text = String(text ?? "");
  box.text.fontSize = fontSize;
  box.text.color = color;
  box.text.bold = bold;
  box.text.typeface = face;
  box.text.alignment = align;
  box.text.verticalAlignment = valign;
  box.text.insets = { left: 0, right: 0, top: 0, bottom: 0 };
  if (autoFit) {
    box.text.autoFit = autoFit;
  }
  return box;
}

export function addBrandTag(slide, left = 64, top = 28) {
  addShape(slide, "roundRect", left, top, 124, 34, {
    fill: THEME.mist,
    lineFill: THEME.tealLine,
    lineWidth: 1,
  });
  addShape(slide, "ellipse", left + 12, top + 8, 18, 18, {
    fill: THEME.teal,
  });
  addShape(slide, "ellipse", left + 20, top + 8, 18, 18, {
    fill: THEME.tealDark,
  });
  addText(slide, BRAND.name, left + 46, top + 8, 60, 16, {
    fontSize: 16,
    color: THEME.tealDark,
    bold: true,
    face: FONTS.heading,
    valign: "middle",
    autoFit: null,
  });
}

export function addSlideChrome(slide, slideNo, total, section) {
  slide.background.fill = THEME.white;
  addShape(slide, "ellipse", 986, -110, 360, 260, {
    fill: THEME.mistStrong,
  });
  addShape(slide, "ellipse", -120, 560, 260, 180, {
    fill: THEME.mist,
  });
  addBrandTag(slide);
  addText(slide, String(section || "").toUpperCase(), 212, 35, 160, 16, {
    fontSize: 12,
    color: THEME.tealDark,
    bold: true,
    face: FONTS.mono,
    autoFit: null,
  });
  addText(slide, `${String(slideNo).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, 1138, 35, 80, 16, {
    fontSize: 12,
    color: THEME.tealDark,
    bold: true,
    face: FONTS.mono,
    align: "right",
    autoFit: null,
  });
  addShape(slide, "rect", 64, 76, 1152, 1.5, {
    fill: THEME.tealLine,
  });
}

export function addTitleBlock(slide, title, subtitle, left = 64, top = 104, width = 720) {
  addText(slide, title, left, top, width, 112, {
    fontSize: 36,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  if (subtitle) {
    addText(slide, subtitle, left, top + 114, width, 54, {
      fontSize: 18,
      color: THEME.slate,
      face: FONTS.body,
    });
  }
}

export function addKicker(slide, text, left = 64, top = 104, width = 220) {
  addShape(slide, "roundRect", left, top, width, 28, {
    fill: THEME.mist,
    lineFill: THEME.tealLine,
    lineWidth: 1,
  });
  addText(slide, text, left + 12, top + 7, width - 24, 14, {
    fontSize: 12,
    color: THEME.tealDark,
    bold: true,
    face: FONTS.mono,
    autoFit: null,
  });
}

export function addCard(slide, { left, top, width, height, title, body, accent = THEME.teal, bodyFontSize = 15 }) {
  addShape(slide, "roundRect", left, top, width, height, {
    fill: THEME.white,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addShape(slide, "rect", left, top, 8, height, {
    fill: accent,
  });
  addText(slide, title, left + 22, top + 18, width - 44, 26, {
    fontSize: 18,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addText(slide, body, left + 22, top + 54, width - 44, height - 72, {
    fontSize: bodyFontSize,
    color: THEME.slate,
    face: FONTS.body,
  });
}

export function addMetricBox(
  slide,
  { left, top, width, height, value, label, fill = THEME.navy, valueColor = THEME.white, labelColor = "#D9E1FF" },
) {
  addShape(slide, "roundRect", left, top, width, height, {
    fill,
    lineFill: fill,
    lineWidth: 1,
  });
  addText(slide, value, left + 24, top + 22, width - 48, 64, {
    fontSize: 34,
    color: valueColor,
    bold: true,
    face: FONTS.heading,
  });
  addText(slide, label, left + 24, top + 92, width - 48, height - 116, {
    fontSize: 15,
    color: labelColor,
    face: FONTS.body,
  });
}

export function addCalloutBox(slide, { left, top, width, height, title, body, fill = THEME.mist, accent = THEME.teal }) {
  addShape(slide, "roundRect", left, top, width, height, {
    fill,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addShape(slide, "rect", left + 18, top + 18, 10, height - 36, {
    fill: accent,
  });
  addText(slide, title, left + 46, top + 20, width - 64, 30, {
    fontSize: 18,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addText(slide, body, left + 46, top + 58, width - 64, height - 78, {
    fontSize: 15,
    color: THEME.slate,
    face: FONTS.body,
  });
}

export function addFlowStep(slide, { left, top, width, height, number, text, isLast = false }) {
  addShape(slide, "roundRect", left, top, width, height, {
    fill: THEME.white,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addShape(slide, "ellipse", left + 18, top + 18, 34, 34, {
    fill: THEME.mistStrong,
    lineFill: THEME.teal,
    lineWidth: 1,
  });
  addText(slide, String(number), left + 18, top + 26, 34, 12, {
    fontSize: 13,
    color: THEME.tealDark,
    bold: true,
    face: FONTS.mono,
    align: "center",
    autoFit: null,
  });
  addText(slide, text, left + 66, top + 18, width - 84, height - 36, {
    fontSize: 16,
    color: THEME.ink,
    face: FONTS.body,
  });
  if (!isLast) {
    addShape(slide, "rect", left + width + 10, top + height / 2 - 1, 26, 2, {
      fill: THEME.tealLine,
    });
  }
}

export function addAvatarCard(slide, { left, top, width, height, title, body }) {
  addShape(slide, "roundRect", left, top, width, height, {
    fill: THEME.white,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addShape(slide, "ellipse", left + 28, top + 26, 82, 82, {
    fill: THEME.mistStrong,
    lineFill: THEME.teal,
    lineWidth: 1.4,
  });
  addText(slide, "MI", left + 28, top + 52, 82, 20, {
    fontSize: 28,
    color: THEME.tealDark,
    bold: true,
    face: FONTS.heading,
    align: "center",
    autoFit: null,
  });
  addText(slide, title, left + 132, top + 28, width - 156, 42, {
    fontSize: 20,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addText(slide, body, left + 132, top + 74, width - 156, height - 96, {
    fontSize: 15,
    color: THEME.slate,
    face: FONTS.body,
  });
}

export function addCalendarMockup(slide, { left, top, width, height }) {
  addShape(slide, "roundRect", left, top, width, height, {
    fill: "#0F172A",
    lineFill: "#0F172A",
    lineWidth: 1,
  });
  addShape(slide, "roundRect", left + 16, top + 16, width - 32, height - 44, {
    fill: THEME.white,
    lineFill: "#CBD5E1",
    lineWidth: 1,
  });
  addShape(slide, "rect", left + 16, top + 16, width - 32, 46, {
    fill: THEME.mist,
  });
  addText(slide, "Calendar view", left + 36, top + 30, 180, 16, {
    fontSize: 15,
    color: THEME.ink,
    bold: true,
    face: FONTS.body,
    autoFit: null,
  });
  const gridLeft = left + 34;
  const gridTop = top + 86;
  const cols = 5;
  const rows = 5;
  const cellW = (width - 76) / cols;
  const cellH = (height - 132) / rows;
  for (let c = 0; c <= cols; c += 1) {
    addShape(slide, "rect", gridLeft + c * cellW, gridTop, 1, rows * cellH, {
      fill: "#E5E7EB",
    });
  }
  for (let r = 0; r <= rows; r += 1) {
    addShape(slide, "rect", gridLeft, gridTop + r * cellH, cols * cellW, 1, {
      fill: "#E5E7EB",
    });
  }
  const appointments = [
    [0, 0, THEME.teal],
    [2, 0, THEME.red],
    [1, 1, THEME.tealDark],
    [2, 1, THEME.red],
    [4, 1, THEME.teal],
    [0, 2, THEME.teal],
    [3, 2, THEME.red],
    [1, 3, THEME.red],
    [4, 3, THEME.tealDark],
    [2, 4, THEME.red],
  ];
  for (const [c, r, fill] of appointments) {
    addShape(slide, "roundRect", gridLeft + c * cellW + 8, gridTop + r * cellH + 8, cellW - 16, 22, {
      fill,
      lineFill: fill,
      lineWidth: 1,
    });
  }
  addShape(slide, "roundRect", left + width - 170, top + 30, 120, 20, {
    fill: THEME.redSoft,
    lineFill: "#FECACA",
    lineWidth: 1,
  });
  addText(slide, "high-risk slots", left + width - 160, top + 35, 100, 10, {
    fontSize: 10,
    color: THEME.red,
    bold: true,
    face: FONTS.mono,
    align: "center",
    autoFit: null,
  });
}

export function addFooterNote(slide, text, left, top, width) {
  addText(slide, text, left, top, width, 18, {
    fontSize: 10,
    color: THEME.slate,
    face: FONTS.body,
    autoFit: null,
  });
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function saveBlobToFile(blob, filePath) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  await fs.writeFile(filePath, bytes);
}

export async function exportPresentation(presentation, { outDir, fileName, scratchId }) {
  const outputDir = path.resolve(outDir);
  const scratchDir = path.resolve("tmp", "slides", scratchId);
  const previewDir = path.join(scratchDir, "preview");
  await ensureDir(outputDir);
  await ensureDir(previewDir);
  for (let idx = 0; idx < presentation.slides.items.length; idx += 1) {
    const slide = presentation.slides.items[idx];
    const preview = await presentation.export({ slide, format: "png", scale: 1 });
    await saveBlobToFile(preview, path.join(previewDir, `slide-${String(idx + 1).padStart(2, "0")}.png`));
  }
  const pptxBlob = await PresentationFile.exportPptx(presentation);
  const pptxPath = path.join(outputDir, fileName);
  await pptxBlob.save(pptxPath);
  return { pptxPath, previewDir };
}
