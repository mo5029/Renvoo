import { Presentation } from "@oai/artifact-tool";
import { BRAND, DECK, THEME } from "../assets/canonical-copy.mjs";
import {
  FONTS,
  addAvatarCard,
  addBrandTag,
  addCalloutBox,
  addCalendarMockup,
  addCard,
  addFlowStep,
  addFooterNote,
  addKicker,
  addMetricBox,
  addShape,
  addSlideChrome,
  addText,
  addTitleBlock,
  exportPresentation,
} from "./renvoo-pitch-common.mjs";

const W = 1280;
const H = 720;
const TOTAL = DECK.slides.length;

function addChip(slide, left, top, text, fill = THEME.mist, color = THEME.tealDark) {
  const width = Math.max(110, 18 + text.length * 7.2);
  addShape(slide, "roundRect", left, top, width, 28, {
    fill,
    lineFill: THEME.tealLine,
    lineWidth: 1,
  });
  addText(slide, text, left + 14, top + 8, width - 28, 12, {
    fontSize: 12,
    color,
    bold: true,
    face: FONTS.mono,
    autoFit: null,
  });
}

function addDiagramBox(slide, left, top, width, height, title, body, fill = THEME.white) {
  addShape(slide, "roundRect", left, top, width, height, {
    fill,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addText(slide, title, left + 18, top + 16, width - 36, 26, {
    fontSize: 17,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addText(slide, body, left + 18, top + 48, width - 36, height - 62, {
    fontSize: 14,
    color: THEME.slate,
    face: FONTS.body,
  });
}

function addArrow(slide, left, top, width = 30) {
  addShape(slide, "rect", left, top + 8, width - 10, 2, {
    fill: THEME.tealLine,
  });
  addShape(slide, "rightArrow", left + width - 12, top, 12, 18, {
    fill: THEME.tealLine,
  });
}

function coverSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = THEME.white;
  addShape(slide, "ellipse", 944, -80, 360, 240, { fill: THEME.mistStrong });
  addShape(slide, "ellipse", 1000, 440, 240, 240, { fill: THEME.mist });
  addShape(slide, "ellipse", -80, 580, 220, 150, { fill: THEME.mist });
  addBrandTag(slide, 64, 34);
  addKicker(slide, BRAND.audience, 64, 108, 178);
  addText(slide, BRAND.headline, 64, 156, 520, 126, {
    fontSize: 52,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addText(slide, BRAND.oneSentence, 64, 302, 520, 92, {
    fontSize: 22,
    color: THEME.slate,
    face: FONTS.body,
  });
  addChip(slide, 64, 430, "No-shows");
  addChip(slide, 194, 430, "Late cancellations");
  addChip(slide, 392, 430, "Capacity recovery");
  addCalloutBox(slide, {
    left: 64,
    top: 486,
    width: 520,
    height: 146,
    title: "A clinic operations problem",
    body:
      "Renvoo is being framed around wasted appointment capacity, not generic AI. The point is earlier action, clearer visibility, and less manual recovery work for dental clinics.",
  });
  addCalendarMockup(slide, { left: 670, top: 116, width: 546, height: 342 });
  addCard(slide, {
    left: 670,
    top: 490,
    width: 168,
    height: 120,
    title: "Booked does not mean realized",
    body: "A scheduled slot only creates value if the patient actually shows up.",
  });
  addCard(slide, {
    left: 859,
    top: 490,
    width: 168,
    height: 120,
    title: "Late notice still hurts",
    body: "Even a cancellation can be too late to save the chair time.",
    accent: THEME.red,
  });
  addCard(slide, {
    left: 1048,
    top: 490,
    width: 168,
    height: 120,
    title: "Staff absorb the gap",
    body: "Uncertainty creates more confirmation, rescheduling, and recovery work.",
  });
  slide.speakerNotes.setText(DECK.slides[0].notes);
}

function problemCostSlide(presentation) {
  const slide = presentation.slides.add();
  const data = DECK.slides[1];
  addSlideChrome(slide, 2, TOTAL, data.section);
  addTitleBlock(slide, data.title, data.subtitle);
  addCalloutBox(slide, {
    left: 64,
    top: 248,
    width: 482,
    height: 118,
    title: "Booked time expires quickly",
    body: "If the chair is empty, the value of that appointment often disappears with it.",
  });
  addCalloutBox(slide, {
    left: 64,
    top: 382,
    width: 482,
    height: 118,
    title: "Lost value compounds across the week",
    body: "Repeated misses create a visible drag on utilization, daily flow, and monthly revenue.",
    accent: THEME.red,
  });
  addCalloutBox(slide, {
    left: 64,
    top: 516,
    width: 482,
    height: 118,
    title: "Recovery is not automatic",
    body: "A missed appointment only stops hurting if the slot can be recovered in time.",
  });
  addMetricBox(slide, {
    left: 586,
    top: 250,
    width: 630,
    height: 216,
    value: data.metrics[1].value,
    label: `${data.metrics[0].value}. ${data.metrics[1].label}`,
  });
  addMetricBox(slide, {
    left: 586,
    top: 492,
    width: 302,
    height: 142,
    value: data.metrics[0].value,
    label: data.metrics[0].label,
    fill: THEME.mistStrong,
    valueColor: THEME.tealDark,
    labelColor: THEME.slate,
  });
  addMetricBox(slide, {
    left: 914,
    top: 492,
    width: 302,
    height: 142,
    value: data.metrics[2].value,
    label: data.metrics[2].label,
    fill: THEME.navySoft,
    valueColor: THEME.navy,
    labelColor: THEME.slate,
  });
  addFooterNote(slide, "Illustrative scenario math from existing Renvoo pitch material, not live pilot proof.", 64, 670, 520);
  slide.speakerNotes.setText(data.notes);
}

function lateCancellationSlide(presentation) {
  const slide = presentation.slides.add();
  const data = DECK.slides[2];
  addSlideChrome(slide, 3, TOTAL, data.section);
  addTitleBlock(slide, data.title, data.subtitle);
  addCard(slide, { left: 64, top: 254, width: 362, height: 236, ...data.cards[0] });
  addCard(slide, { left: 458, top: 254, width: 362, height: 236, ...data.cards[1], accent: THEME.red });
  addCard(slide, { left: 852, top: 254, width: 364, height: 236, ...data.cards[2] });
  addCalloutBox(slide, {
    left: 64,
    top: 526,
    width: 1152,
    height: 112,
    title: "A late cancellation can still be operationally expensive",
    body: "The patient may have communicated, but the clinic still carries the cost if the slot cannot be recovered in time.",
    fill: THEME.mist,
    accent: THEME.red,
  });
  slide.speakerNotes.setText(data.notes);
}

function reminderGapSlide(presentation) {
  const slide = presentation.slides.add();
  const data = DECK.slides[3];
  addSlideChrome(slide, 4, TOTAL, data.section);
  addTitleBlock(slide, data.title, data.subtitle);
  addShape(slide, "roundRect", 64, 248, 522, 360, {
    fill: THEME.mist,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addText(slide, "What clinics already have", 88, 270, 220, 24, {
    fontSize: 18,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addChip(slide, 88, 320, "Booking confirmation");
  addChip(slide, 88, 360, "Reminder 1");
  addChip(slide, 88, 400, "Reminder 2");
  addShape(slide, "roundRect", 88, 458, 474, 124, {
    fill: THEME.white,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addText(slide, "What is still missing", 112, 478, 220, 24, {
    fontSize: 18,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addText(slide, "A way to tell which appointments need stronger action before the slot is already in danger.", 112, 514, 420, 48, {
    fontSize: 16,
    color: THEME.slate,
    face: FONTS.body,
  });
  addCard(slide, { left: 628, top: 248, width: 588, height: 104, ...data.cards[0] });
  addCard(slide, { left: 628, top: 376, width: 588, height: 104, ...data.cards[1], accent: THEME.red });
  addCard(slide, { left: 628, top: 504, width: 588, height: 104, ...data.cards[2] });
  slide.speakerNotes.setText(data.notes);
}

function adminBurdenSlide(presentation) {
  const slide = presentation.slides.add();
  const data = DECK.slides[4];
  addSlideChrome(slide, 5, TOTAL, data.section);
  addTitleBlock(slide, data.title, data.subtitle);
  addMetricBox(slide, {
    left: 64,
    top: 254,
    width: 322,
    height: 210,
    value: "More manual work",
    label: "As soon as attendance becomes uncertain, someone has to manage the exception path.",
    fill: THEME.navy,
  });
  addMetricBox(slide, {
    left: 64,
    top: 486,
    width: 322,
    height: 148,
    value: "Less usable time",
    label: "The team spends more of the day coordinating around uncertainty instead of running the clinic smoothly.",
    fill: THEME.mistStrong,
    valueColor: THEME.tealDark,
    labelColor: THEME.slate,
  });
  addCard(slide, { left: 426, top: 254, width: 248, height: 380, ...data.cards[0] });
  addCard(slide, { left: 706, top: 254, width: 248, height: 380, ...data.cards[1], accent: THEME.red });
  addCard(slide, { left: 986, top: 254, width: 230, height: 380, ...data.cards[2] });
  slide.speakerNotes.setText(data.notes);
}

function dentalWedgeSlide(presentation) {
  const slide = presentation.slides.add();
  const data = DECK.slides[5];
  addSlideChrome(slide, 6, TOTAL, data.section);
  addTitleBlock(slide, data.title, data.subtitle, 64, 104, 620);
  addCalloutBox(slide, {
    left: 64,
    top: 262,
    width: 420,
    height: 296,
    title: "Why dental first",
    body:
      "Dental is the clearest current wedge because the pain is practical, the buyers are operational, and the revenue cost of unused chair time is easy to explain.",
  });
  addCard(slide, { left: 528, top: 248, width: 320, height: 132, ...data.cards[0] });
  addCard(slide, { left: 528, top: 398, width: 320, height: 132, ...data.cards[1] });
  addCard(slide, { left: 528, top: 548, width: 320, height: 104, ...data.cards[2] });
  addMetricBox(slide, {
    left: 882,
    top: 248,
    width: 334,
    height: 188,
    value: "Dental-first wedge",
    label: "The current market entry is Dutch private dental clinics, not broad hospital software.",
    fill: THEME.navySoft,
    valueColor: THEME.navy,
    labelColor: THEME.slate,
  });
  addMetricBox(slide, {
    left: 882,
    top: 458,
    width: 334,
    height: 188,
    value: "Operational buyer",
    label: "The strongest buyer is the owner or practice manager who feels empty-slot cost and admin burden directly.",
    fill: THEME.white,
    valueColor: THEME.tealDark,
    labelColor: THEME.slate,
  });
  slide.speakerNotes.setText(data.notes);
}

function solutionFlowSlide(presentation) {
  const slide = presentation.slides.add();
  const data = DECK.slides[6];
  addSlideChrome(slide, 7, TOTAL, data.section);
  addTitleBlock(slide, data.title, data.subtitle);
  const startLeft = 76;
  const top = 262;
  const stepW = 268;
  const gap = 26;
  data.steps.forEach((step, idx) => {
    addFlowStep(slide, {
      left: startLeft + idx * (stepW + gap),
      top,
      width: stepW,
      height: 104,
      number: idx + 1,
      text: step,
      isLast: idx === data.steps.length - 1,
    });
  });
  addCard(slide, {
    left: 64,
    top: 438,
    width: 362,
    height: 168,
    title: "Earlier action",
    body: "The goal is to intervene while the clinic still has time to reshape the appointment outcome.",
  });
  addCard(slide, {
    left: 458,
    top: 438,
    width: 362,
    height: 168,
    title: "Clearer visibility",
    body: "Staff should be able to see who is confirmed, who is uncertain, and what has already happened.",
    accent: THEME.tealDark,
  });
  addCard(slide, {
    left: 852,
    top: 438,
    width: 364,
    height: 168,
    title: "Less wasted capacity",
    body: "Prevented no-shows and recovered slots both improve the economics of the clinic day.",
    accent: THEME.red,
  });
  slide.speakerNotes.setText(data.notes);
}

function trustSlide(presentation) {
  const slide = presentation.slides.add();
  const data = DECK.slides[7];
  addSlideChrome(slide, 8, TOTAL, data.section);
  addTitleBlock(slide, data.title, data.subtitle);
  addCard(slide, { left: 64, top: 248, width: 362, height: 156, ...data.cards[0] });
  addCard(slide, { left: 64, top: 422, width: 362, height: 156, ...data.cards[1] });
  addCard(slide, { left: 64, top: 596, width: 362, height: 82, ...data.cards[2] });
  addShape(slide, "roundRect", 470, 248, 746, 360, {
    fill: THEME.mist,
    lineFill: THEME.tealLine,
    lineWidth: 1.2,
  });
  addText(slide, "How the operating layer fits", 500, 272, 240, 24, {
    fontSize: 18,
    color: THEME.ink,
    bold: true,
    face: FONTS.heading,
  });
  addDiagramBox(slide, 500, 332, 180, 120, "Scheduling system", "Appointments, timing, status, and attendance history");
  addDiagramBox(slide, 750, 302, 190, 180, "Renvoo", "Risk awareness, confirmation logic, response tracking, and capacity recovery", THEME.white);
  addDiagramBox(slide, 1010, 332, 176, 120, "Patient communication", "Confirmation, cancellation, and rescheduling flows");
  addArrow(slide, 686, 384, 48);
  addArrow(slide, 946, 384, 48);
  addShape(slide, "roundRect", 500, 494, 686, 72, {
    fill: THEME.redSoft,
    lineFill: "#FECACA",
    lineWidth: 1,
  });
  addText(slide, "No diagnoses, no clinical notes, no treatment decisions.", 532, 518, 622, 18, {
    fontSize: 16,
    color: THEME.red,
    bold: true,
    face: FONTS.body,
    align: "center",
    autoFit: null,
  });
  slide.speakerNotes.setText(data.notes);
}

function pricingSlide(presentation) {
  const slide = presentation.slides.add();
  const data = DECK.slides[8];
  addSlideChrome(slide, 9, TOTAL, data.section);
  addTitleBlock(slide, data.title, data.subtitle);
  addShape(slide, "roundRect", 64, 248, 1152, 224, {
    fill: THEME.navy,
    lineFill: THEME.navy,
    lineWidth: 1,
  });
  addText(slide, "Preliminary", 98, 278, 180, 24, {
    fontSize: 13,
    color: "#D9E1FF",
    bold: true,
    face: FONTS.mono,
    autoFit: null,
  });
  addText(slide, data.pricingLine, 98, 320, 1088, 110, {
    fontSize: 28,
    color: THEME.white,
    bold: true,
    face: FONTS.heading,
  });
  addCard(slide, {
    left: 64,
    top: 510,
    width: 362,
    height: 124,
    title: "Per appointment",
    body: "The usage-based part frames value around the appointment volume the clinic actually runs.",
  });
  addCard(slide, {
    left: 458,
    top: 510,
    width: 362,
    height: 124,
    title: "Fixed clinic fee",
    body: "The clinic fee depends on the clinic because rollout complexity and support needs can differ.",
    accent: THEME.tealDark,
  });
  addCard(slide, {
    left: 852,
    top: 510,
    width: 364,
    height: 124,
    title: "Still being shaped",
    body: "Pricing is shown now to signal seriousness, but it is not being presented as final.",
    accent: THEME.red,
  });
  slide.speakerNotes.setText(data.notes);
}

function founderSlide(presentation) {
  const slide = presentation.slides.add();
  const data = DECK.slides[9];
  addSlideChrome(slide, 10, TOTAL, data.section);
  addTitleBlock(slide, data.title, null);
  addAvatarCard(slide, {
    left: 64,
    top: 226,
    width: 474,
    height: 244,
    title: "Founder credibility",
    body: data.founderLine,
  });
  addCalloutBox(slide, {
    left: 568,
    top: 226,
    width: 648,
    height: 244,
    title: "Pilot ask",
    body: data.ctaLine,
    fill: THEME.mist,
  });
  addCard(slide, {
    left: 64,
    top: 506,
    width: 362,
    height: 118,
    title: "Current reminder flow",
    body: "How do confirmations work today, and where does uncertainty still remain?",
  });
  addCard(slide, {
    left: 458,
    top: 506,
    width: 362,
    height: 118,
    title: "Late-cancellation handling",
    body: "What happens when a patient cannot attend and the clinic needs to protect utilization?",
    accent: THEME.red,
  });
  addCard(slide, {
    left: 852,
    top: 506,
    width: 364,
    height: 118,
    title: "Recovery opportunity",
    body: "Where could earlier action or better visibility recover capacity that is lost today?",
  });
  slide.speakerNotes.setText(data.notes);
}

function buildDeck() {
  const presentation = Presentation.create({
    slideSize: { width: W, height: H },
  });
  coverSlide(presentation);
  problemCostSlide(presentation);
  lateCancellationSlide(presentation);
  reminderGapSlide(presentation);
  adminBurdenSlide(presentation);
  dentalWedgeSlide(presentation);
  solutionFlowSlide(presentation);
  trustSlide(presentation);
  pricingSlide(presentation);
  founderSlide(presentation);
  return presentation;
}

const presentation = buildDeck();
const result = await exportPresentation(presentation, {
  outDir: "docs/pitch/clinic-package/outputs/clinic-deck",
  fileName: "renvoo-clinic-deck.pptx",
  scratchId: "renvoo-clinic-deck",
});

console.log(result.pptxPath);
