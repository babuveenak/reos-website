/**
 * MOCK AI SERVICE
 *
 * A deterministic stand-in for the real assistant, so the whole UI can be built
 * and tested before a provider is selected (D‑5, open). It is not an LLM, makes
 * no network call, and holds no key.
 *
 * It reads only a KnowledgeSnapshot — no content-file imports — so it runs
 * unchanged on the server (for the worked-example transcript) and in the client,
 * and so replacing it with a real service is a swap of one implementation.
 *
 * Four rules it follows, because they are the product's rules and the UI has to
 * be built against them rather than have them retro-fitted:
 *
 *  1. NO FABRICATED SOURCES. Every citation is a real authority from the
 *     snapshot with its real published URL. `lastVerified` is `null` because
 *     Phase 1A has no verification pipeline — the UI renders "not yet verified"
 *     rather than inventing a date.
 *  2. CONCURRENCY IS STATED. Any answer touching a stage with `runsWith` says
 *     what runs alongside it. Order is not sequence, and a mock that flattened
 *     it would let a false sequence into the UI.
 *  3. EVERY ANSWER IS LABELLED `Illustrative`, and the existing StatusTag shows
 *     that on screen. These are worked examples, not validated guidance.
 *  4. REFUSALS ARE REAL PATHS, not an afterthought. Regulated advice and an
 *     unresolved jurisdiction both decline and offer a route out, because those
 *     are the two cases most likely to cause harm if answered.
 */

import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { homepageSuggestions, stageSuggestions } from "./suggestions";
import { authorityIn, routeIn, stageIn, type KnowledgeSnapshot } from "./snapshot";
import type {
  AIRequest,
  AIResponse,
  AIService,
  Intent,
  JourneyContext,
  RouteSlug,
  Source,
  StageId,
} from "./contracts";

const L = (locale: Locale, path: string) => (locale === DEFAULT_LOCALE ? path : `/ar${path}`);

/* ── citations — real authorities only ───────────────────────────────────── */

type Bilingual = { en: string; ar: string };
const pick = (text: Bilingual, locale: Locale) => text[locale] ?? text.en;

function sources(
  snapshot: KnowledgeSnapshot,
  specs: [string, Bilingual][],
  locale: Locale,
): Source[] {
  return specs.flatMap(([authorityId, title]) => {
    const authority = authorityIn(snapshot, authorityId);
    if (!authority) return []; // never invent an authority
    return [{
      id: `${authorityId}-${locale}`,
      authority: authority.name,
      authorityId,
      title: pick(title, locale),
      url: authority.sourceUrl,
      jurisdiction: authority.jurisdiction,
      epistemicType: "official-procedure" as const,
      lastVerified: null, // honest: no verification pipeline in Phase 1A
      status: "To Be Validated" as const,
    }];
  });
}

/* ── journey context, read from the snapshot ─────────────────────────────── */

function journeyContext(
  snapshot: KnowledgeSnapshot,
  stageId: StageId | null,
  routeSlug: RouteSlug | null,
): JourneyContext | null {
  const stage = stageIn(snapshot, stageId);
  if (!stage) return null;
  const route = routeIn(snapshot, routeSlug);
  return {
    routeSlug: routeSlug ?? null,
    routeTitle: route?.ctaLabel ?? null, // noun phrase; `title` is first-person
    stageId: stage.id,
    stageName: stage.name,
    stageNumber: stage.number,
    phase: stage.phase,
    concurrentWith: stage.runsWithNames, // from the data, not from prose
    nextStep: stage.nextStep,
  };
}

/* ── detection (keyword matching, not a model) ───────────────────────────── */

type Rule = { persona: RouteSlug | null; intent: Intent; stageId: StageId | null; re: RegExp };

const RULES: Rule[] = [
  // Product enquiry first: it is the only path allowed to surface a product action.
  { persona: null, intent: "product-enquiry", stageId: null,
    re: /\b(platform|software|tool|product|demo|pricing|subscribe)\b|منصة|برنامج|نظام|عرض توضيحي/i },
  // Regulated advice — declined, never answered.
  { persona: null, intent: "out-of-scope", stageId: null,
    re: /\b(should i (buy|invest)|best return|guaranteed|golden visa|residency|tax advice|which is better)\b|تأشيرة ذهبية|إقامة|أفضل عائد|هل أشتري|نصيحة ضريبية/i },
  { persona: "developing", intent: "diagnose-blocker", stageId: "authorities-approvals",
    re: /\b(blocked|can'?t start|cannot start|stuck|why can'?t|waiting on)\b|متوقف|لا أستطيع البدء|عالق/i },
  { persona: "developing", intent: "understand-process", stageId: "land-vision",
    re: /\b(become a (property )?developer|developing|development|land|plot|first project)\b|مطور|تطوير|أرض|مشروعي الأول/i },
  { persona: "financing", intent: "identify-responsibility", stageId: "sales-transfer",
    re: /\b(bank|banker|lender|escrow|financ|mortgage|loan|drawdown)\b|بنك|مصرفي|تمويل|حساب الضمان|قرض|رهن/i },
  { persona: "investing", intent: "understand-process", stageId: "asset-growth-intelligence",
    // `invest\w*`, not `invest\b`: the trailing boundary failed on "investing",
    // which is the word the investing route's own title uses.
    re: /\b(invest\w*|yield|exit|portfolio|capital)\b|استثمار|مستثمر|عائد|خروج|رأس مال/i },
  { persona: "buying", intent: "understand-process", stageId: "sales-transfer",
    re: /\b(buy|buying|buyer|purchase|apartment|flat|villa|off.?plan|deposit)\b|شراء|مشتري|شقة|فيلا|على المخطط|دفعة/i },
  { persona: null, intent: "understand-timeline", stageId: "living-operations",
    re: /\b(after construction|handover|snagging|completion|what happens after)\b|بعد البناء|التسليم|الإنجاز/i },
  { persona: null, intent: "identify-responsibility", stageId: null,
    re: /\b(who is involved|stakeholders?|who does what|participants)\b|أصحاب المصلحة|من يشارك|من يفعل/i },
];

function detect(question: string): { persona: RouteSlug | null; intent: Intent; stageId: StageId | null } {
  for (const rule of RULES) {
    if (rule.re.test(question)) return { persona: rule.persona, intent: rule.intent, stageId: rule.stageId };
  }
  return { persona: null, intent: "learn", stageId: null };
}

/**
 * Resolve a route the question names, by its own title or CTA label.
 *
 * Keyword lists cannot carry this weight across two languages: the Arabic route
 * title uses أشتري where the keyword list had شراء, and English "investing"
 * escaped a `\binvest\b` boundary. Since suggestions.ts builds its questions
 * FROM these titles, matching the title itself is both locale-agnostic and
 * exactly right for the case that matters most.
 */
function namedRoute(snapshot: KnowledgeSnapshot, question: string) {
  const q = question.toLowerCase();
  return [...snapshot.routes]
    .filter((route) => route.hasContent)
    .sort((a, b) => b.title.length - a.title.length)
    .find((route) => q.includes(route.title.toLowerCase()) || q.includes(route.ctaLabel.toLowerCase()))
    ?? null;
}

/** Resolve a stage the question names, so "what happens during X" and "what
 *  runs at the same time as X" — both generated by suggestions.ts — are
 *  answerable instead of falling through to the not-in-corpus reply. */
function namedStage(snapshot: KnowledgeSnapshot, question: string) {
  const q = question.toLowerCase();
  // Longest name first, so "Sales & Transfer" wins over a shorter substring.
  return [...snapshot.stages]
    .sort((a, b) => b.name.length - a.name.length)
    .find((stage) => q.includes(stage.name.toLowerCase()) || q.includes(stage.short.toLowerCase()))
    ?? null;
}

const CONCURRENCY_RE = /\b(at the same time|alongside|in parallel|concurrent|simultaneous)\b|بالتوازي|في الوقت نفسه|بالتزامن/i;
const WHAT_HAPPENS_RE = /\b(what happens|what occurs|what goes on|tell me about|explain)\b|ما الذي يحدث|ما يحدث|اشرح/i;

/** An emirate named but no zone — the case that must ask rather than answer. */
function emirateWithoutZone(question: string): boolean {
  const emirate = /\b(dubai|abu dhabi|sharjah|ajman|ras al khaimah|fujairah)\b|دبي|أبوظبي|الشارقة|عجمان/i.test(question);
  const zone = /\b(mainland|free ?zone|difc|dda|trakhees|dmcc|adgm)\b|البر الرئيسي|منطقة حرة/i.test(question);
  return emirate && !zone;
}

/* ── answer bodies ───────────────────────────────────────────────────────── */

const ANSWERS: Record<string, Bilingual> = {
  buying: {
    en: "You are at the point where a unit has been chosen but nothing is protected yet. Before money moves, three things get verified: that the seller can actually sell, that the project is registered, and that your payments go into a project escrow account rather than to the developer directly. In an off-plan purchase, registration and escrow are what stand between your deposit and the developer's cash flow.",
    ar: "أنت في المرحلة التي تم فيها اختيار الوحدة دون أن تتوفر بعد أي حماية. وقبل تحويل أي مبالغ، يتم التحقق من ثلاثة أمور: أن البائع يملك حق البيع فعلاً، وأن المشروع مسجَّل، وأن دفعاتك تُودع في حساب ضمان المشروع لا إلى المطور مباشرة. وفي الشراء على المخطط، فإن التسجيل وحساب الضمان هما ما يفصل بين دفعتك وبين التدفق النقدي للمطور.",
  },
  developing: {
    en: "Before design work carries any regulatory weight, the land and the project entity have to be settled: who owns the plot, what the plot is permitted to carry, and which entity will hold the project. Only then does the approval sequence begin — and the sequence itself depends on which authority governs the plot, because a mainland plot and a development-zone plot follow different routes.",
    ar: "قبل أن يكون لأعمال التصميم أي وزن تنظيمي، يجب حسم أمر الأرض وكيان المشروع: من يملك الأرض، وما الذي يُسمح للأرض باحتماله، وأي كيان سيتولى المشروع. وبعد ذلك فقط يبدأ تسلسل الموافقات — وهذا التسلسل نفسه يعتمد على الجهة التي تحكم الأرض، لأن الأرض في البر الرئيسي والأرض في منطقة تطوير تسلكان مسارين مختلفين.",
  },
  investing: {
    en: "Capital enters at more than one point, which is why an investor view is not a buyer view. The controls that protect the money differ by entry point: an off-plan commitment is protected by project registration and escrow, while a stabilised asset is protected by title, lease documentation and service-charge governance. The exit route you intend is what determines which of those you should be diligencing now.",
    ar: "يدخل رأس المال عند أكثر من نقطة، ولهذا فإن منظور المستثمر لا يماثل منظور المشتري. فالضوابط التي تحمي الأموال تختلف بحسب نقطة الدخول: الالتزام على المخطط يحميه تسجيل المشروع وحساب الضمان، أما الأصل المستقر فيحميه سند الملكية ووثائق الإيجار وحُسن إدارة رسوم الخدمات. ومسار الخروج الذي تقصده هو ما يحدد أي من هذه الضوابط ينبغي أن تدقق فيه الآن.",
  },
  financing: {
    en: "A lender appears at several distinct points and plays a different role at each: land finance, the construction facility, buyer mortgages, and refinancing at stabilisation. Escrow is a separate function again — the party operating the project account is performing a regulated trustee role, not a lending one, which is why the same bank can sit on both sides of a project under different obligations.",
    ar: "تظهر جهة التمويل عند نقاط متعددة ومتمايزة، وتؤدي في كل منها دوراً مختلفاً: تمويل الأرض، وتسهيلات البناء، ورهون المشترين، وإعادة التمويل عند الاستقرار. أما حساب الضمان فهو وظيفة منفصلة تماماً — فالجهة التي تدير حساب المشروع تؤدي دور أمين مُنظَّم لا دور مُقرض، ولهذا يمكن للبنك نفسه أن يكون على جانبي المشروع بالتزامات مختلفة.",
  },
  blocked: {
    en: "Being unable to start usually means an upstream approval has not been issued, not that the work itself is late. An honest answer needs the specific gate: design approvals, authority no-objection certificates and — inside a master community — the community NOC are the three that most commonly stop projects here. Each is issued by a different body, so “waiting for approval” is rarely one queue.",
    ar: "غالباً ما يعني تعذّر البدء أن موافقة سابقة لم تُصدر بعد، لا أن العمل نفسه متأخر. والإجابة الصادقة تتطلب معرفة البوابة المحددة: موافقات التصميم، وشهادات عدم الممانعة من الجهات المختصة، وداخل المجتمعات الكبرى شهادة عدم ممانعة المجتمع — وهذه هي الثلاث الأكثر شيوعاً في إيقاف المشاريع هنا. وكل منها تصدرها جهة مختلفة، لذا فإن “انتظار الموافقة” نادراً ما يكون طابوراً واحداً.",
  },
  afterConstruction: {
    en: "What follows construction depends on who is asking, and these stages do not run in single file. Completion certification, handover and registration overlap; and marketing and sales have been running throughout construction rather than after it — which is precisely why escrow exists.",
    ar: "ما يلي مرحلة البناء يعتمد على هوية السائل، وهذه المراحل لا تسير في صف واحد. فإصدار شهادات الإنجاز والتسليم والتسجيل أمور متداخلة؛ كما أن التسويق والبيع كانا يجريان طوال فترة البناء لا بعده — وهذا بالضبط سبب وجود حساب الضمان.",
  },
  stakeholders: {
    en: "Twelve stakeholder groups carry the journey: landowners and investors, developers, consultants and designers, contractors, suppliers and vendors, brokers and agencies, banks and financial institutions, property owners, residents and tenants, and facility and community operators. Authorities and regulators are shown on their own rail rather than as a thirteenth peer, because they issue the approvals that gate everyone else — every other group is appointed and commercial, and they are not.",
    ar: "تحمل الرحلة اثنتا عشرة مجموعة من أصحاب المصلحة: الملاك والمستثمرون، والمطوّرون، والاستشاريون والمصممون، والمقاولون، والمورّدون، والوسطاء والوكالات، والبنوك والمؤسسات المالية، وملاك العقارات، والسكان والمستأجرون، ومشغّلو المرافق والمجتمعات. أما الجهات المختصة فتُعرض على مسار خاص بها لا كمجموعة ثالثة عشرة نظيرة، لأنها تصدر الموافقات التي تحكم الجميع — فكل مجموعة أخرى تُعيَّن بعقد تجاري، وهي ليست كذلك.",
  },
  fallback: {
    en: "I don't have enough verified information to answer that accurately yet. This assistant is running on illustrative content while its knowledge base is built, so it can show you where a question belongs in the journey but cannot give you a sourced answer to it.",
    ar: "لا تتوفر لديّ معلومات مُتحقَّق منها بما يكفي للإجابة عن ذلك بدقة بعد. يعمل هذا المساعد على محتوى توضيحي أثناء بناء قاعدة معرفته، لذا يمكنه أن يبيّن لك موضع السؤال في الرحلة لكنه لا يستطيع تقديم إجابة مسندة إلى مصدر.",
  },
};

const REFUSAL_TEXT: Record<string, Bilingual> = {
  regulatedAdvice: {
    en: "That asks what you should do with your money or your residency status, and REOS is an educational layer — it explains how the process works, not which choice is right for you. Investment suitability, tax position and residency eligibility are regulated advice: a licensed adviser, and for residency the relevant authority, are the right sources. I can show you how the process itself works.",
    ar: "هذا سؤال عمّا ينبغي أن تفعله بأموالك أو بوضع إقامتك، وREOS طبقة تعليمية — تشرح كيف تعمل العملية لا أي خيار هو الصحيح لك. فملاءمة الاستثمار والوضع الضريبي وأهلية الإقامة كلها استشارات مُنظَّمة: والمصدر الصحيح لها مستشار مرخَّص، وفي شأن الإقامة الجهة المختصة. ويمكنني أن أبيّن لك كيف تعمل العملية نفسها.",
  },
  jurisdiction: {
    en: "Before answering I need the zone, not just the emirate — the approval route is genuinely different. Is this on the mainland under the municipality, or inside a development zone such as DDA or Trakhees? Treating them as the same is how people end up following the wrong approval sequence.",
    ar: "قبل الإجابة أحتاج إلى معرفة المنطقة لا الإمارة فقط — فمسار الموافقات مختلف فعلاً. هل الموقع في البر الرئيسي تحت إشراف البلدية، أم داخل منطقة تطوير مثل سلطة دبي للتطوير أو تراخيص؟ إن التعامل معهما وكأنهما سواء هو ما يجعل الناس يتّبعون تسلسل الموافقات الخطأ.",
  },
};

const CONCURRENCY_YES: Bilingual = {
  en: "{stage} does not wait its turn — it runs at the same time as {others}. That overlap is the point: in UAE off-plan development, selling and building happen together, which is precisely why escrow exists. Reading these stages as a queue is the most common way people mis-plan a project.",
  ar: "لا تنتظر مرحلة {stage} دورها — فهي تجري بالتوازي مع {others}. وهذا التداخل هو جوهر الأمر: ففي التطوير على المخطط في الإمارات يجري البيع والبناء معًا، وهذا بالضبط سبب وجود حساب الضمان. وقراءة هذه المراحل كطابور متسلسل هي أشيع أسباب الخطأ في تخطيط المشاريع.",
};

const CONCURRENCY_NO: Bilingual = {
  en: "{stage} has no stage running alongside it in the canonical model — it sits on its own in the sequence. That is worth knowing rather than assuming: most stages in this lifecycle do overlap with something, and the ones that do not are usually gated by an approval that has to land first.",
  ar: "لا توجد مرحلة تجري بالتوازي مع {stage} في النموذج المعتمد — فهي قائمة بذاتها في التسلسل. وهذا أمر يستحق المعرفة بدل الافتراض: فمعظم مراحل هذه الدورة تتداخل مع غيرها، وما لا يتداخل منها تحكمه عادةً موافقة يجب أن تصدر أولًا.",
};

const PRODUCT_TEXT: Bilingual = {
  en: "Yes — there is a platform built around this workflow, separate from the educational material you are reading. It is a different thing from the journey content, so it lives on its own page rather than inside an explanation.",
  ar: "نعم — توجد منصة مبنية حول سياق العمل هذا، منفصلة عن المادة التعليمية التي تقرأها. وهي شيء مختلف عن محتوى الرحلة، لذا فهي على صفحتها الخاصة لا داخل الشرح.",
};

const UI: Record<Locale, Record<string, string>> = {
  en: { showRoute: "Show this journey", openStage: "Open this stage", ecosystem: "See the twelve groups",
        authorities: "See who issues what", learnMore: "Learn more", zone: "Which zone applies?",
        emirate: "Emirate", zoneLabel: "Zone", dubai: "Dubai", journey: "Open the journey" },
  ar: { showRoute: "اعرض هذه الرحلة", openStage: "افتح هذه المرحلة", ecosystem: "شاهد المجموعات الاثنتي عشرة",
        authorities: "اعرف من يصدر ماذا", learnMore: "اعرف المزيد", zone: "أي منطقة تنطبق؟",
        emirate: "الإمارة", zoneLabel: "المنطقة", dubai: "دبي", journey: "افتح الرحلة" },
};

const SOURCE_SETS: Record<string, [string, Bilingual][]> = {
  buying: [["dld", { en: "Dubai Land Department eServices — registration and escrow", ar: "الخدمات الإلكترونية لدائرة الأراضي والأملاك — التسجيل وحساب الضمان" }]],
  developing: [
    ["dm", { en: "Dubai Municipality — building permit steps", ar: "بلدية دبي — خطوات رخصة البناء" }],
    ["dda", { en: "Dubai Development Authority — planning and development", ar: "سلطة دبي للتطوير — التخطيط والتطوير" }],
  ],
  investing: [["dld", { en: "Dubai Land Department eServices — title and registration", ar: "الخدمات الإلكترونية لدائرة الأراضي والأملاك — الملكية والتسجيل" }]],
  financing: [["dld", { en: "Dubai Land Department eServices — project escrow", ar: "الخدمات الإلكترونية لدائرة الأراضي والأملاك — حساب ضمان المشروع" }]],
  blocked: [
    ["dm", { en: "Dubai Municipality — building permit steps", ar: "بلدية دبي — خطوات رخصة البناء" }],
    ["dcd", { en: "Dubai Civil Defence — approvals", ar: "الدفاع المدني بدبي — الموافقات" }],
  ],
  afterConstruction: [
    ["dm", { en: "Dubai Municipality — completion and building control", ar: "بلدية دبي — الإنجاز ومراقبة المباني" }],
    ["dewa", { en: "DEWA service guide — connections", ar: "دليل خدمات هيئة كهرباء ومياه دبي — التوصيلات" }],
  ],
};

/* ── the answer builder ──────────────────────────────────────────────────── */

function shell(snapshot: KnowledgeSnapshot, answer: string): AIResponse {
  return {
    answer,
    language: snapshot.locale,
    persona: null,
    intent: null,
    journey: null,
    confidence: "low",
    refusal: null,
    sources: [],
    conditions: [],
    activities: [],
    approvals: [],
    suggestedQuestions: homepageSuggestions(snapshot),
    navigationActions: [],
    productAction: null,
    status: "Illustrative",
    statePatch: {},
  };
}

/**
 * Build one illustrative answer. Synchronous and pure, so a server component
 * can render a worked example without a browser — which is what makes the mock
 * testable in the existing HTML test harness.
 */
export function mockAnswer(request: AIRequest, snapshot: KnowledgeSnapshot): AIResponse {
  const locale = request.language;
  const ui = UI[locale] ?? UI.en;
  const detected = detect(request.question);
  const { intent } = detected;
  /* A question that quotes a route title is a stronger, language-independent
     signal than any keyword list. */
  const byTitle = intent === "learn" ? namedRoute(snapshot, request.question) : null;

  /* Carry context forward. `detected.*` chooses the answer; the inherited
     values only decide where the visitor is placed and what is offered next,
     so an unrecognised follow-up still knows which journey it is part of. */
  const persona = detected.persona ?? byTitle?.slug ?? request.state.persona;
  const stageId = detected.stageId ?? request.state.lifecycleStage;

  /* Stage questions, answered from the stage's own validated copy. These two
     shapes are exactly what suggestions.ts offers the visitor, so they must
     resolve — an assistant that cannot answer its own suggested questions is
     visibly broken. */
  const stage = namedStage(snapshot, request.question) ?? stageIn(snapshot, stageId);
  if (stage && (CONCURRENCY_RE.test(request.question) || WHAT_HAPPENS_RE.test(request.question))) {
    const concurrent = stage.runsWithNames;
    const isConcurrencyQuestion = CONCURRENCY_RE.test(request.question);
    const answer = isConcurrencyQuestion
      ? (concurrent.length > 0
          ? pick(CONCURRENCY_YES, locale)
              .replace("{stage}", stage.name)
              .replace("{others}", concurrent.join(locale === "ar" ? " و" : " and "))
          : pick(CONCURRENCY_NO, locale).replace("{stage}", stage.name))
      // Just the summary: the journey trail below already renders `nextStep`,
      // and repeating it here printed the same sentence twice. Prefixed with the
      // stage name because journey.ts summaries are written to follow it.
      : `${stage.name}: ${stage.summary}`;
    return {
      ...shell(snapshot, answer),
      persona,
      intent: isConcurrencyQuestion ? "plan-sequence" : "understand-process",
      journey: journeyContext(snapshot, stage.id, persona),
      confidence: "medium",
      sources: sources(snapshot, SOURCE_SETS[stage.id] ?? [], locale),
      suggestedQuestions: stageSuggestions(snapshot, stage.id),
      navigationActions: [
        { kind: "open-stage", path: L(locale, `/property-journey/${stage.id}`), label: ui.openStage },
      ],
      statePatch: { lifecycleStage: stage.id, ...(persona ? { persona } : {}) },
    };
  }

  if (intent === "out-of-scope") {
    return {
      ...shell(snapshot, pick(REFUSAL_TEXT.regulatedAdvice, locale)),
      intent,
      refusal: "regulated-advice",
      navigationActions: [{ kind: "navigate", path: L(locale, "/property-journey"), label: ui.journey }],
      statePatch: { intent },
    };
  }

  if (intent === "product-enquiry") {
    return {
      ...shell(snapshot, pick(PRODUCT_TEXT, locale)),
      intent,
      confidence: "medium",
      // The one path allowed to surface a product action. Learn-more only —
      // see the note on ProductActions in components/Knowledge.tsx.
      productAction: { kind: "learn-more", path: L(locale, "/platform"), label: ui.learnMore },
      statePatch: { intent },
    };
  }

  if (persona === "developing" && emirateWithoutZone(request.question)) {
    return {
      ...shell(snapshot, pick(REFUSAL_TEXT.jurisdiction, locale)),
      persona,
      intent: "understand-regulation",
      refusal: "jurisdiction-unresolved",
      journey: journeyContext(snapshot, "authorities-approvals", persona),
      conditions: [
        { label: ui.emirate, value: ui.dubai },
        { label: ui.zoneLabel, value: ui.zone, unresolved: true },
      ],
      navigationActions: [{ kind: "navigate", path: L(locale, "/authorities"), label: ui.authorities }],
      statePatch: { persona, intent: "understand-regulation", unresolved: ["jurisdiction.zone"] },
    };
  }

  const key =
    intent === "diagnose-blocker" ? "blocked"
    : intent === "understand-timeline" ? "afterConstruction"
    : intent === "identify-responsibility" && !detected.persona ? "stakeholders"
    // `detected.persona`, not the inherited one: an inherited persona must not
    // put words in the assistant's mouth about a question it did not recognise.
    : detected.persona && ANSWERS[detected.persona] ? detected.persona
    : byTitle && ANSWERS[byTitle.slug] ? byTitle.slug
    : "fallback";

  const PERSONA_STAGE: Record<string, StageId> = {
    buying: "sales-transfer", developing: "land-vision",
    investing: "asset-growth-intelligence", financing: "sales-transfer",
  };
  const resolvedStage = stageId ?? (persona ? PERSONA_STAGE[persona] ?? null : null);
  const route = routeIn(snapshot, persona);
  const nav: AIResponse["navigationActions"] = [];
  if (route?.hasContent) nav.push({ kind: "open-route", path: L(locale, `/intelligence/guides/${route.slug}`), label: ui.showRoute });
  if (resolvedStage) nav.push({ kind: "open-stage", path: L(locale, `/property-journey/${resolvedStage}`), label: ui.openStage });
  if (key === "stakeholders") nav.push({ kind: "navigate", path: L(locale, "/ecosystem"), label: ui.ecosystem });

  return {
    ...shell(snapshot, pick(ANSWERS[key] ?? ANSWERS.fallback, locale)),
    persona,
    intent,
    journey: journeyContext(snapshot, resolvedStage, persona),
    confidence: key === "fallback" ? "low" : "medium",
    refusal: key === "fallback" ? "not-in-corpus" : null,
    sources: sources(snapshot, SOURCE_SETS[key] ?? [], locale),
    suggestedQuestions: resolvedStage ? stageSuggestions(snapshot, resolvedStage) : homepageSuggestions(snapshot),
    navigationActions: nav,
    statePatch: {
      ...(persona ? { persona, journey: persona } : {}),
      intent,
      ...(resolvedStage ? { lifecycleStage: resolvedStage } : {}),
    },
  };
}

/** Latency so the UI's `processing` state is exercised in development. */
const MOCK_LATENCY_MS = 420;

export class MockAIService implements AIService {
  readonly name = "mock";
  #snapshot: KnowledgeSnapshot;

  constructor(snapshot: KnowledgeSnapshot) {
    this.#snapshot = snapshot;
  }

  async ask(request: AIRequest): Promise<AIResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
    return mockAnswer(request, this.#snapshot);
  }
}

/**
 * Worked examples, one per persona, rendered on /assistant and asserted in the
 * tests. Written the way visitors actually ask, not the way the matcher would
 * prefer. None of them is a product enquiry, deliberately: a server-rendered
 * demo link would break the guarded demo-CTA invariant.
 */
export const WORKED_EXAMPLES: Record<Locale, string[]> = {
  en: [
    "I want to buy an apartment in Dubai. Where do I start?",
    "How do I become a property developer?",
    "I'm an investor — where does my capital actually enter?",
    "I'm a banker. Where do I participate in the development lifecycle?",
  ],
  ar: [
    "أريد شراء شقة في دبي، من أين أبدأ؟",
    "كيف أصبح مطوراً عقارياً؟",
    "أنا مستثمر — أين يدخل رأس مالي فعلاً؟",
    "أنا مصرفي. أين أشارك في دورة حياة التطوير؟",
  ],
};
