export const BRAND = {
  name: "renvoo",
  audience: "For Dutch dental clinics",
  headline: "Reduce no-shows. Recover lost appointments.",
  oneSentence:
    "Renvoo is a B2B clinic SaaS for Dutch dental clinics that helps reduce no-shows, handle late cancellations earlier, and recover lost appointment capacity without adding front-desk work.",
  founderLine:
    "Renvoo is being built by Mohamed Ibrahim, former Electrical Subteam Lead for Team Polar at TU/e and part of the NVIDIA 6G Developer Program.",
  pricingLine:
    "Preliminary pilot pricing starts at EUR 2.49 per appointment, plus a fixed fee depending on the clinic. Final pricing is still being shaped with pilot partners.",
  ctaLine:
    "We are looking for a short validation meeting with a dental clinic owner or practice manager to review your current no-show and rescheduling workflow.",
};

export const THEME = {
  white: "#FFFFFF",
  mist: "#F4FBFC",
  mistStrong: "#E8F7F8",
  teal: "#18C4CF",
  tealDark: "#0D6175",
  tealInk: "#103841",
  tealLine: "#D7ECEF",
  navy: "#19307A",
  navySoft: "#EEF2FF",
  slate: "#5D757C",
  ink: "#18343C",
  red: "#E4514D",
  redSoft: "#FFF1F0",
};

export const DECK = {
  sources: {
    product: "memory/wiki/topics/renvoo-product-thesis.md",
    metrics: "memory/wiki/topics/renvoo-metrics-and-roi.md",
    market: "memory/wiki/topics/renvoo-market-and-icp.md",
    compliance: "memory/wiki/topics/renvoo-compliance-and-data-boundaries.md",
    roadmap: "memory/wiki/topics/renvoo-roadmap-and-proof-plan.md",
    overview: "memory/wiki/topics/renvoo-company-overview.md",
  },
  slides: [
    {
      id: "cover",
      section: "clinic pitch",
      title: BRAND.headline,
      subtitle: BRAND.oneSentence,
      kicker: BRAND.audience,
      notes:
        "Open on clinic pain, not AI. The point is that empty chair time is a revenue problem and a workflow problem.",
      sourceKeys: ["overview", "market", "product"],
    },
    {
      id: "no-show-cost",
      section: "problem",
      title: "No-shows turn booked time into lost revenue",
      subtitle: "When chair time goes unused, the lost value is immediate and hard to recover.",
      metrics: [
        {
          value: "2 missed appointments/day",
          label: "Illustrative clinic scenario used in existing pitch material",
        },
        {
          value: "≈ EUR 8k/month",
          label: "Potential lost revenue when those appointments are not recovered",
        },
        {
          value: "Same-day recovery is hard",
          label: "A booked slot only creates value if the patient actually shows up",
        },
      ],
      notes:
        "Frame this as scenario math, not proven pilot data. Keep the buyer focused on the cost of unused chair time.",
      sourceKeys: ["metrics", "market", "overview"],
    },
    {
      id: "late-cancellation-cost",
      section: "problem",
      title: "Late cancellations still leave chair time empty",
      subtitle: "Even when patients tell you, late notice often arrives too late to save the slot.",
      cards: [
        {
          title: "Too little notice",
          body: "A patient can cancel politely and the clinic can still lose the value of the appointment.",
        },
        {
          title: "Gaps break the day",
          body: "A 30 to 60 minute opening can be too small or too late to refill manually.",
        },
        {
          title: "Recovery becomes a scramble",
          body: "Staff end up calling waiting lists or shifting plans at the last minute.",
        },
      ],
      notes:
        "Stress that late notice is still operational damage when there is no simple way to backfill the slot.",
      sourceKeys: ["product", "metrics"],
    },
    {
      id: "reminders-vs-prevention",
      section: "problem",
      title: "Reminders exist. Prevention does not.",
      subtitle: "Sending the same reminder to everyone still leaves clinics reacting too late.",
      cards: [
        {
          title: "Same reminder, every time",
          body: "Generic reminder flows treat low-risk and high-risk appointments the same.",
        },
        {
          title: "No response is still risk",
          body: "A sent message is not the same as a confirmed patient.",
        },
        {
          title: "Action happens too late",
          body: "By the time staff intervene manually, the slot is often already at risk.",
        },
      ],
      notes:
        "Differentiate Renvoo from a reminder tool. The wedge is risk-aware operations, not simple outbound messaging.",
      sourceKeys: ["product", "overview"],
    },
    {
      id: "admin-burden",
      section: "problem",
      title: "Admin work grows around uncertainty",
      subtitle: "Confirmations, rescheduling, and recovery work all increase when attendance is unclear.",
      cards: [
        {
          title: "Confirmations",
          body: "Someone still has to see who replied, who did not, and what to do next.",
        },
        {
          title: "Rescheduling",
          body: "Every late change creates new messages, new slots, and new front-desk work.",
        },
        {
          title: "Recovery work",
          body: "Waiting lists and short-notice backfill help, but they are exhausting when managed manually.",
        },
      ],
      notes:
        "The second half of the pain is labor. Clinics do not only lose revenue, they also absorb more admin overhead.",
      sourceKeys: ["metrics", "overview"],
    },
    {
      id: "why-dental",
      section: "problem",
      title: "Dental clinics feel this pain more sharply",
      subtitle: "High-value chair time and dense daily schedules make empty slots expensive fast.",
      cards: [
        {
          title: "High-value chair time",
          body: "Dental appointments often have direct revenue impact when they go unused.",
        },
        {
          title: "Dense schedules",
          body: "Clinics run tightly packed days where one gap disrupts utilization quickly.",
        },
        {
          title: "Repeat appointments",
          body: "Ongoing treatment creates recurring opportunities for both risk and recovery.",
        },
      ],
      notes:
        "This is the wedge logic. Dental is the clearest current market because the pain is concrete and measurable.",
      sourceKeys: ["market", "metrics", "roadmap"],
    },
    {
      id: "solution-flow",
      section: "solution",
      title: "What Renvoo changes operationally",
      subtitle: "Renvoo is designed as a clinic operations layer, not just a reminder tool.",
      steps: [
        "Identify higher-risk appointments",
        "Trigger stronger confirmation or rescheduling earlier",
        "Track patient response centrally",
        "Recover otherwise lost capacity when possible",
      ],
      notes:
        "Keep the explanation operational. Avoid product hype and avoid technical depth beyond the workflow change.",
      sourceKeys: ["product", "overview"],
    },
    {
      id: "low-friction",
      section: "solution",
      title: "Low-friction for clinics by design",
      subtitle:
        "The workflow is designed around operational data, clinic control, and lightweight onboarding without patient accounts in v1.",
      cards: [
        {
          title: "Administrative data only",
          body: "Renvoo is designed around scheduling and communication data, not diagnoses or clinical notes.",
        },
        {
          title: "Lightweight onboarding first",
          body: "CSV-first and read-only onboarding paths reduce integration friction while pilots are being validated.",
        },
        {
          title: "No patient accounts in v1",
          body: "Patient confirmations and rescheduling can happen through secure links without adding a new patient portal.",
        },
      ],
      notes:
        "This is where trust is built. Emphasize narrow data boundaries, low-friction operational fit, and the simple clinic-SaaS posture.",
      sourceKeys: ["compliance", "roadmap"],
    },
    {
      id: "pricing",
      section: "cost",
      title: "Preliminary pilot pricing",
      subtitle: "Enough to frame budget fit, not a final commercial commitment.",
      pricingLine: BRAND.pricingLine,
      notes:
        "Say preliminary clearly. The point is to show seriousness and affordability without pretending the pricing is final.",
      sourceKeys: ["roadmap"],
    },
    {
      id: "founder-and-ask",
      section: "next step",
      title: "Built to validate with clinics, not just describe the problem",
      founderLine: BRAND.founderLine,
      ctaLine: BRAND.ctaLine,
      notes:
        "Close on credibility and a light ask. The next step is a short validation meeting, not a heavy sales commitment.",
      sourceKeys: ["overview", "roadmap"],
    },
  ],
};

export const ONE_PAGER = {
  headline: BRAND.headline,
  oneSentence: BRAND.oneSentence,
  problemTitles: [
    "No-shows turn booked time into lost revenue",
    "Late cancellations still leave chair time empty",
    "Reminders exist. Prevention does not.",
  ],
  problemSummary:
    "Dental clinics lose money when booked chair time goes unused, and staff absorb the uncertainty through manual confirmations, rescheduling, and short-notice recovery work.",
  solutionTitle: "What Renvoo changes operationally",
  solutionSteps: [
    "Identify higher-risk appointments",
    "Trigger stronger confirmation or rescheduling earlier",
    "Track patient response centrally",
    "Recover otherwise lost capacity when possible",
  ],
  trustTitle: "Low-friction for clinics by design",
  trustPoints: [
    "Administrative scheduling and communication data only",
    "Lightweight onboarding paths first",
    "Secure links instead of patient accounts in v1",
  ],
  pricingLine: BRAND.pricingLine,
  founderLine: BRAND.founderLine,
  ctaLine: BRAND.ctaLine,
};
