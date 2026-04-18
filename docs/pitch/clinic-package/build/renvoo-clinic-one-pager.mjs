import fs from "node:fs/promises";
import { Presentation } from "@oai/artifact-tool";
import { BRAND, ONE_PAGER, THEME } from "../assets/canonical-copy.mjs";
import {
  FONTS,
  addCalendarMockup,
  addCard,
  addFlowStep,
  addShape,
  addText,
  exportPresentation,
} from "./renvoo-pitch-common.mjs";

const W = 1080;
const H = 1528;
const LOGO_PATH = new URL("../assets/renvoo-logo-user-cropped.png", import.meta.url);

async function readImageBlob(fileUrl) {
  const bytes = await fs.readFile(fileUrl);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function addSectionRule(slide, top) {
  addShape(slide, "rect", 72, top, W - 144, 1.5, {
    fill: THEME.tealLine,
  });
}

function addSectionTitle(slide, title, top) {
  addText(slide, title, 72, top, 460, 34, {
    fontSize: 26,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
}

async function buildOnePager() {
  const presentation = Presentation.create({
    slideSize: { width: W, height: H },
  });
  const slide = presentation.slides.add();
  slide.background.fill = THEME.white;
  addShape(slide, "ellipse", 820, -40, 260, 220, { fill: THEME.mistStrong });
  addShape(slide, "ellipse", -60, 1350, 240, 160, { fill: THEME.mist });
  const logo = slide.images.add({
    blob: await readImageBlob(LOGO_PATH),
    fit: "contain",
    alt: "Renvoo logo",
  });
  logo.position = { left: 60, top: 18, width: 96, height: 120 };

  addShape(slide, "roundRect", 72, 130, 178, 28, {
    fill: THEME.mist,
    lineFill: THEME.tealLine,
    lineWidth: 1,
  });
  addText(slide, BRAND.audience, 84, 138, 154, 12, {
    fontSize: 12,
    color: THEME.tealDark,
    bold: true,
    face: FONTS.mono,
    autoFit: null,
  });
  addText(slide, ONE_PAGER.headline, 72, 182, 560, 140, {
    fontSize: 48,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addText(slide, ONE_PAGER.oneSentence, 72, 352, 560, 72, {
    fontSize: 22,
    color: THEME.slate,
    face: FONTS.body,
  });
  addCalendarMockup(slide, { left: 656, top: 134, width: 352, height: 238 });

  addSectionRule(slide, 424);
  addSectionTitle(slide, "Why the problem matters", 450);
  addText(slide, ONE_PAGER.problemSummary, 72, 490, 936, 52, {
    fontSize: 17,
    color: THEME.slate,
    face: FONTS.body,
  });
  addCard(slide, {
    left: 72,
    top: 562,
    width: 292,
    height: 150,
    title: ONE_PAGER.problemTitles[0],
    body: "Booked chair time only creates value if the patient actually attends the appointment.",
  });
  addCard(slide, {
    left: 394,
    top: 562,
    width: 292,
    height: 150,
    title: ONE_PAGER.problemTitles[1],
    body: "Late notice can still leave too little time to recover the slot.",
    accent: THEME.red,
  });
  addCard(slide, {
    left: 716,
    top: 562,
    width: 292,
    height: 150,
    title: ONE_PAGER.problemTitles[2],
    body: "Standard reminders still leave clinics reacting too late around risk.",
  });
  addShape(slide, "roundRect", 72, 746, 936, 96, {
    fill: THEME.navy,
    lineFill: THEME.navy,
    lineWidth: 1,
  });
  addText(slide, "Illustrative clinic scenario", 102, 770, 220, 16, {
    fontSize: 12,
    color: "#D9E1FF",
    bold: true,
    face: FONTS.mono,
    autoFit: null,
  });
  addText(slide, "2 missed appointments/day can translate into roughly EUR 8k/month in lost revenue if the slots are not recovered.", 102, 800, 876, 26, {
    fontSize: 20,
    color: THEME.white,
    bold: true,
    face: FONTS.heading,
  });

  addSectionRule(slide, 872);
  addSectionTitle(slide, ONE_PAGER.solutionTitle, 898);
  const stepTop = 946;
  const stepH = 72;
  ONE_PAGER.solutionSteps.forEach((step, idx) => {
    addFlowStep(slide, {
      left: idx % 2 === 0 ? 72 : 548,
      top: stepTop + Math.floor(idx / 2) * 92,
      width: 460,
      height: stepH,
      number: idx + 1,
      text: step,
      isLast: true,
    });
  });
  addText(slide, ONE_PAGER.trustTitle, 72, 1142, 360, 28, {
    fontSize: 22,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addCard(slide, {
    left: 72,
    top: 1178,
    width: 292,
    height: 96,
    title: "Administrative data only",
    body: "No diagnoses or clinical notes.",
    bodyFontSize: 18,
  });
  addCard(slide, {
    left: 394,
    top: 1178,
    width: 292,
    height: 96,
    title: "Lightweight onboarding",
    body: "CSV-first and read-only paths first.",
    bodyFontSize: 18,
  });
  addCard(slide, {
    left: 716,
    top: 1178,
    width: 292,
    height: 96,
    title: "Clinic control",
    body: "Operational visibility without heavy disruption.",
    bodyFontSize: 18,
  });

  addSectionRule(slide, 1294);
  addShape(slide, "roundRect", 72, 1320, 936, 92, {
    fill: THEME.mist,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addText(slide, "Preliminary pilot pricing", 98, 1342, 260, 22, {
    fontSize: 20,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addText(slide, ONE_PAGER.pricingLine, 98, 1370, 884, 26, {
    fontSize: 16,
    color: THEME.slate,
    face: FONTS.body,
  });
  addShape(slide, "roundRect", 72, 1438, 936, 86, {
    fill: THEME.white,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addText(slide, ONE_PAGER.founderLine, 98, 1460, 884, 22, {
    fontSize: 15,
    color: THEME.ink,
    bold: true,
    face: FONTS.body,
  });
  addText(slide, ONE_PAGER.ctaLine, 98, 1486, 884, 24, {
    fontSize: 15,
    color: THEME.slate,
    face: FONTS.body,
  });

  slide.speakerNotes.setText("One-page leave-behind aligned to the clinic deck.");
  return presentation;
}

const presentation = await buildOnePager();
const result = await exportPresentation(presentation, {
  outDir: "docs/pitch/clinic-package/outputs/one-pager",
  fileName: "renvoo-clinic-one-pager.pptx",
  scratchId: "renvoo-clinic-one-pager",
});

console.log(result.pptxPath);
