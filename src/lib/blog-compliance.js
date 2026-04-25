export const BLOG_COMPLIANCE_FILES = [
  "docs/compliance/blog-content-compliance.md",
  "docs/compliance/blog-media-compliance.md",
];

export const BLOG_COMPLIANCE_SUMMARY = [
  "Do not fabricate statistics, citations, testimonials, case studies, or proof.",
  "Do not promise guaranteed results or present uncertain information as fact.",
  "Do not use fear, manipulative urgency, clickbait, or dark patterns.",
  "Do not promote gambling, riba, exploitative practices, or unethical data use.",
  "Do not include women-focused imagery or references to women in blog content or media.",
  "Do not include sexualized, adult, dating, alcohol, nightlife, or inappropriate content.",
  "Keep all content professional, respectful, clinic-operator-focused, and truthful.",
].join(" ");

const TEXT_RULES = [
  {
    code: "false-claims",
    label: "Exaggerated or unverified claims",
    patterns: [
      /\bguarantee(?:d|s)?\b/i,
      /\bclinically proven\b/i,
      /\bscientifically proven\b/i,
      /\bproven results\b/i,
      /\b100%\b/i,
      /\bzero risk\b/i,
      /\binstant(?:ly)?\b/i,
      /\balways\b/i,
      /\bnever fail(?:s|ed)?\b/i,
      /\bgegarandeerd\b/i,
      /\bwetenschappelijk bewezen\b/i,
      /\bklinisch bewezen\b/i,
      /\baltijd\b/i,
    ],
  },
  {
    code: "manipulation",
    label: "Manipulative urgency or pressure",
    patterns: [
      /\bact now\b/i,
      /\blast chance\b/i,
      /\bbefore it'?s too late\b/i,
      /\bdon't miss out\b/i,
      /\bnow or never\b/i,
      /\bhurry\b/i,
      /\burgent\b/i,
      /\bmis het niet\b/i,
      /\bwees er snel bij\b/i,
      /\blaatste kans\b/i,
      /\bnu of nooit\b/i,
      /\bvoor het te laat is\b/i,
    ],
  },
  {
    code: "clickbait",
    label: "Misleading or clickbait phrasing",
    patterns: [
      /\byou won't believe\b/i,
      /\bshocking\b/i,
      /\bsecret(?:s)?\b/i,
      /\bwhat happened next\b/i,
      /\binsane\b/i,
      /\bkiller hack\b/i,
      /\bunbelievable\b/i,
      /\bongelooflijk\b/i,
      /\bschokkend\b/i,
      /\bgeheim(?:en)?\b/i,
      /\bwat er daarna gebeurde\b/i,
    ],
  },
  {
    code: "questionable-practices",
    label: "Haram or questionable business references",
    patterns: [
      /\briba\b/i,
      /\busury\b/i,
      /\binterest-bearing\b/i,
      /\bcasino\b/i,
      /\bgambling\b/i,
      /\bbetting\b/i,
      /\blottery\b/i,
      /\bgokken\b/i,
      /\bwedden\b/i,
      /\bcasino\b/i,
    ],
  },
  {
    code: "inappropriate-content",
    label: "Inappropriate, adult, or sexual content",
    patterns: [
      /\bsex(?:ual|y)?\b/i,
      /\bdating\b/i,
      /\brelationship(?:s)?\b/i,
      /\badult(?:\s|-)industry\b/i,
      /\bexplicit\b/i,
      /\bporn\b/i,
      /\b18\+\b/i,
      /\bseks(?:ueel)?\b/i,
      /\bvolwassenen\b/i,
      /\bexpliciet\b/i,
      /\bdating\b/i,
      /\brelatie(?:s)?\b/i,
    ],
  },
  {
    code: "alcohol",
    label: "Alcohol or nightlife references",
    patterns: [
      /\balcohol\b/i,
      /\bbeer\b/i,
      /\bwine\b/i,
      /\bcocktail(?:s)?\b/i,
      /\bbar\b/i,
      /\bnightlife\b/i,
      /\bdrinking culture\b/i,
      /\bbier\b/i,
      /\bwijn\b/i,
      /\bborrel\b/i,
      /\bnachtleven\b/i,
      /\balcohol\b/i,
    ],
  },
  {
    code: "women-reference",
    label: "Reference to women in content",
    patterns: [
      /\bwoman\b/i,
      /\bwomen\b/i,
      /\bfemale\b/i,
      /\bgirl(?:s)?\b/i,
      /\blady\b/i,
      /\bladies\b/i,
      /\bvrouw\b/i,
      /\bvrouwen\b/i,
      /\bvrouwelijke\b/i,
      /\bmeisje(?:s)?\b/i,
      /\bdame(?:s)?\b/i,
    ],
  },
  {
    code: "privacy-misuse",
    label: "Unethical data use or privacy misuse",
    patterns: [
      /\bsell(?:ing)? data\b/i,
      /\bwithout consent\b/i,
      /\bsecretly track\b/i,
      /\bhidden tracking\b/i,
      /\bscrape patient data\b/i,
      /\btrack every patient\b/i,
      /\bgegevens verkopen\b/i,
      /\bzonder toestemming\b/i,
      /\bstiekem volgen\b/i,
      /\bpati[eë]ntgegevens scrapen\b/i,
    ],
  },
];

function buildViolation(code, label, detail) {
  return { code, label, detail };
}

function collectText(post) {
  return [
    post.title,
    post.metaTitle,
    post.metaDescription,
    post.excerpt,
    post.answer,
    post.plainText,
    ...(post.faq ?? []).flatMap((item) => [item.question, item.answer]),
  ]
    .filter(Boolean)
    .join("\n");
}

function summarizeMatch(text, pattern) {
  const match = text.match(pattern);
  return match?.[0] ?? pattern.toString();
}

export function evaluateBlogCompliance(post) {
  const violations = [];
  const fullText = collectText(post);
  const content = String(post.content ?? "");
  const title = String(post.title ?? "");

  if (/!\[[^\]]*\]\([^)]+\)/.test(content) || /<img\b/i.test(content)) {
    violations.push(
      buildViolation(
        "disallowed-image",
        "Disallowed embedded image or media markup",
        "Blog content may not include embedded images or HTML image tags.",
      ),
    );
  }

  for (const rule of TEXT_RULES) {
    const titleMatch = summarizeMatch(title, rule.patterns[0]);
    const titleViolation = rule.patterns.find((pattern) => pattern.test(title));
    if (titleViolation) {
      violations.push(
        buildViolation(
          rule.code,
          rule.label,
          `Found prohibited title phrase: "${summarizeMatch(title, titleViolation)}"`,
        ),
      );
      continue;
    }

    const bodyViolation = rule.patterns.find((pattern) => pattern.test(fullText));
    if (bodyViolation) {
      violations.push(
        buildViolation(
          rule.code,
          rule.label,
          `Found prohibited content phrase: "${summarizeMatch(fullText, bodyViolation)}"`,
        ),
      );
    }
  }

  return {
    ok: violations.length === 0,
    violations,
  };
}
