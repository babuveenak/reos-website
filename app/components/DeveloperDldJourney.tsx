"use client";

import { useState, type ReactNode } from "react";
import { dldDeveloperBook } from "../data/dldDeveloperBook";
import { developerJourneySteps, type DeveloperServiceReference, type LocalizedText } from "../data/developerJourneyGuide";
import type { Stage } from "../data/journey";
import { officialSourceById } from "../data/officialSources";
import { stakeholderGuidance } from "../data/stakeholderGuidance";
import { EMIRATES, type DubaiTrack, type EmirateId, type ParticipationState } from "../data/stakeholderBlueprints";
import type { Locale } from "../i18n/config";

type PhaseId = "pre-development" | "development" | "post-development";

type Props = {
  locale: Locale;
  track: DubaiTrack;
  stages: Stage[];
  participation: ParticipationState[];
};

const TRACK_AUTHORITY: Partial<Record<DubaiTrack, string>> = {
  "track-neutral": "dubai-municipality",
  "dm-mainland": "dubai-municipality",
  "dda-tecom": "dubai-development-authority",
  "trakhees-pcfc": "trakhees",
};

const COPY = {
  en: {
    eyebrow: "02 · Developer journey & process guide",
    title: "From deciding to develop through handover and close-out.",
    intro: "Follow one connected roadmap across the protected seven-stage REOS lifecycle and the DLD Developer Book. Each step explains the action, authority, evidence, output and next move before you open the official channel to verify or apply.",
    source: "Open the DLD Developer Book",
    status: "Official DLD listing · structured by REOS",
    checked: "Checked 31 August 2026",
    notReplacement: "This three-phase DLD service view does not replace the canonical seven-stage REOS property lifecycle.",
    escrowCorrection: "Escrow opening sits in Development → Off-plan sales in the DLD Developer Book—not in pre-development. Pre-development establishes the entity, licence, DLD approval, developer registration and Oqood access.",
    pre: "Pre-development",
    development: "Development",
    post: "Post-development",
    masterPlan: "Master plan gate",
    build: "Permit, build & complete",
    sell: "Off-plan sales & escrow",
    parallel: "Runs in parallel when off-plan sales apply",
    closure: "Completion-dependent closure",
    phaseLabel: "DLD phase",
    subphaseLabel: "Development sub-phase",
    authorityLabel: "Project is under",
    serviceSearch: "Find a service in this branch",
    serviceSearchPlaceholder: "Search service name or description",
    services: "service nodes",
    noResults: "No service matches this search in the selected branch.",
    selectNode: "Select a node to inspect the official listing",
    channel: "Service channel",
    time: "Listed service time",
    fees: "Listed fees",
    documents: "Listed documents",
    notListed: "Not listed in this DLD record",
    officialRecord: "Open this branch on DLD",
    channelLink: "Open service channel",
    estimate: "A service estimate is not the end-to-end project duration.",
    sourceWarning: dldDeveloperBook.source.warning,
    officialEnglish: "DLD’s English service titles and record text are preserved exactly enough for source comparison; confirm the live authority page before applying.",
    crosswalk: "How this sits inside the protected REOS lifecycle",
    crosswalkPre: "Land & Vision → Authorities & Approvals",
    crosswalkDev: "Planning & Design → Authorities & Approvals → Construction & Delivery, with Sales & Transfer overlapping when off-plan",
    crosswalkPost: "Construction & Delivery → Living & Operations",
    lifecycleEyebrow: "Lifecycle connection · all seven stages",
    lifecycleTitle: "Every stage is visible. The developer’s level of responsibility changes.",
    lifecycleNote: "Stages 1–6 are direct developer touchpoints. Stage 7 remains included as a supporting evidence and surviving-obligations role; owners and operators lead long-term asset decisions.",
    direct: "Direct responsibility",
    supporting: "Supporting role",
    stageInstruction: "Choose a stage to open its first relevant checklist step.",
    checklistEyebrow: "03 · Central developer checklist",
    checklistTitle: "Ten connected steps from first decision to operating handover.",
    checklistIntro: "The steps are a navigation framework, not a universal project programme. Applicability and order can change with the plot, project type, planning branch and live authority requirements.",
    whatToDo: "What you need to do",
    authority: "Authority / decision route",
    stakeholders: "Connected stakeholders",
    whatYouNeed: "What you need",
    approvalOutput: "Approval / output",
    nextStep: "Next step",
    linkedRecords: "Linked official service records",
    inspectRecord: "Inspect record and listed fee, time and documents",
    branchRecord: "Inspect the applicable authority branch",
    phaseOverview: "04 · DLD phase and service explorer",
    phaseOverviewTitle: "Move from the roadmap into the official service-book detail.",
    controlEyebrow: "05 · Practical control points",
    controlTitle: "Open each risk to see why it happens and how to control it.",
    why: "Why it happens",
    response: "Recommended control",
    controlTypes: ["Requirement", "Authority", "Compliance", "Document", "Financial control", "Recommended action"],
    registryEyebrow: "06 · Official registry and verification",
    registryTitle: "Choose the Emirate, confirm the authority branch, then verify in sequence.",
    registryIntro: "Do not begin by guessing a service name. Start with the Emirate and the authority shown on the plot, site-plan or master-development record. REOS then builds the applicable verification route; the linked authority remains the source of the official decision.",
    emirateFirst: "1 · Choose the Emirate first",
    emirateHelp: "Dubai is mapped from the official DLD Developer Book. An unmapped Emirate never inherits Dubai services.",
    authoritySecond: "2 · Confirm the project authority",
    authorityHelp: "Choose only after the plot, site plan or master-developer record confirms the competent branch.",
    routeReady: "Your verification route",
    routeReadyText: "The sequence below combines shared DLD gates with the official service records for the selected authority branch.",
    howToChoose: "How to choose the authority",
    howToChooseText: "Do not infer the authority from a project name or general location. Record the authority shown by the plot/site-plan evidence and confirm it through the official channel before relying on this branch.",
    authorityServices: "official records in this gate",
    whyVerify: "Why verify this",
    expectedEvidence: "Evidence / output to retain",
    inspectGate: "Inspect this gate in the service explorer",
    openOfficialBranch: "Open the official authority branch",
    conditional: "Conditional · only when off-plan sales apply",
    shared: "Shared Dubai gate",
    branch: "Selected authority gate",
    notMapped: "This Emirate is not yet mapped for this developer verification tool.",
    notMappedText: "REOS will not substitute Dubai authorities, fees, timings or procedures. Open the Emirate developer page for its current coverage statement; use the relevant local authority as the official decision source.",
    openEmiratePage: "Open this Emirate's developer page",
    optionalSearch: "Optional final tool · search within this selected route",
    optionalSearchHelp: "Use this only after the Emirate and authority are known. Results are limited to the shared Dubai gates and the selected authority branch.",
    optionalSearchPlaceholder: "Search the selected route, for example escrow or building permit",
    searchPrompt: "Enter a service name to search the selected route.",
    searchMatches: "matching official records",
    noRouteMatches: "No official record in this selected route matches that search.",
    inspectService: "Inspect record, listed documents, fee and time",
  },
  ar: {
    eyebrow: "02 · رحلة المطور ودليل الإجراءات",
    title: "من قرار التطوير إلى التسليم والإقفال.",
    intro: "اتبع خريطة طريق واحدة تربط مراحل REOS السبع المحمية بدليل المطور لدى دائرة الأراضي والأملاك. تشرح كل خطوة الإجراء والجهة والدليل والمخرج والخطوة التالية قبل فتح القناة الرسمية للتحقق أو التقديم.",
    source: "افتح دليل المطور لدى دائرة الأراضي والأملاك",
    status: "قائمة رسمية من الدائرة · تنظيم REOS",
    checked: "تم التحقق في 31 أغسطس 2026",
    notReplacement: "لا يحل منظور مراحل الدائرة الثلاث محل دورة حياة العقار القياسية ذات المراحل السبع في REOS.",
    escrowCorrection: "يقع فتح حساب الضمان ضمن التطوير ← البيع على الخارطة في دليل الدائرة، وليس ضمن ما قبل التطوير. أما ما قبل التطوير فيغطي تأسيس الكيان والترخيص وموافقة الدائرة وتسجيل المطور والوصول إلى نظام عقود.",
    pre: "ما قبل التطوير",
    development: "التطوير",
    post: "ما بعد التطوير",
    masterPlan: "بوابة المخطط العام",
    build: "التصريح والبناء والإنجاز",
    sell: "البيع على الخارطة والضمان",
    parallel: "يسير بالتوازي عند انطباق البيع على الخارطة",
    closure: "إقفال يعتمد على الإنجاز",
    phaseLabel: "مرحلة الدائرة",
    subphaseLabel: "المرحلة الفرعية للتطوير",
    authorityLabel: "المشروع خاضع لـ",
    serviceSearch: "ابحث عن خدمة في هذا المسار",
    serviceSearchPlaceholder: "ابحث باسم الخدمة أو وصفها",
    services: "عقد خدمات",
    noResults: "لا توجد خدمة مطابقة للبحث في المسار المحدد.",
    selectNode: "اختر عقدة لفحص السجل الرسمي",
    channel: "قناة الخدمة",
    time: "المدة المدرجة للخدمة",
    fees: "الرسوم المدرجة",
    documents: "المستندات المدرجة",
    notListed: "غير مدرج في سجل الدائرة هذا",
    officialRecord: "افتح هذا المسار لدى الدائرة",
    channelLink: "افتح قناة الخدمة",
    estimate: "تقدير مدة الخدمة ليس مدة المشروع من بدايته إلى نهايته.",
    sourceWarning: "تعكس الرسوم والمدد والمستندات والقنوات ما كان منشوراً في دليل المطور لدى الدائرة عند التحقق في 31 أغسطس 2026. وهي ليست عرض سعر أو ضماناً لمدة المشروع. تحقق من صفحة الجهة الحية قبل التقديم.",
    officialEnglish: "تُعرض عناوين الخدمات ونصوص السجلات الرسمية باللغة الإنجليزية كما نشرها المصدر للمقارنة. الترجمة العربية التحريرية قيد المراجعة.",
    crosswalk: "موضع هذا المسار داخل دورة حياة REOS المحمية",
    crosswalkPre: "الأرض والرؤية ← الجهات والموافقات",
    crosswalkDev: "التخطيط والتصميم ← الجهات والموافقات ← الإنشاء والتسليم، مع تداخل البيع والنقل عند البيع على الخارطة",
    crosswalkPost: "الإنشاء والتسليم ← السكن والتشغيل",
    lifecycleEyebrow: "صلة دورة الحياة · المراحل السبع كاملة",
    lifecycleTitle: "جميع المراحل ظاهرة، بينما يتغير مستوى مسؤولية المطور.",
    lifecycleNote: "المراحل من 1 إلى 6 نقاط اتصال مباشرة للمطور. وتظل المرحلة 7 مدرجة كدور داعم للأدلة والالتزامات المستمرة، بينما يقود الملاك والمشغلون قرارات الأصل طويلة الأجل.",
    direct: "مسؤولية مباشرة",
    supporting: "دور داعم",
    stageInstruction: "اختر مرحلة لفتح أول خطوة قائمة تحقق مرتبطة بها.",
    checklistEyebrow: "03 · قائمة تحقق المطور المركزية",
    checklistTitle: "عشر خطوات مترابطة من القرار الأول إلى تسليم التشغيل.",
    checklistIntro: "الخطوات إطار للتنقل وليست برنامجاً زمنياً موحداً لكل مشروع. قد يتغير الانطباق والترتيب بحسب الموقع ونوع المشروع وفرع التخطيط والمتطلبات الحية للجهة.",
    whatToDo: "ما الذي تحتاج إلى فعله",
    authority: "الجهة / مسار القرار",
    stakeholders: "أصحاب المصلحة المرتبطون",
    whatYouNeed: "ما الذي تحتاجه",
    approvalOutput: "الموافقة / المخرج",
    nextStep: "الخطوة التالية",
    linkedRecords: "سجلات الخدمات الرسمية المرتبطة",
    inspectRecord: "افحص السجل والرسوم والمدة والمستندات المدرجة",
    branchRecord: "افحص فرع الجهة المنطبق",
    phaseOverview: "04 · مستكشف مراحل وخدمات الدائرة",
    phaseOverviewTitle: "انتقل من خريطة الطريق إلى تفاصيل دليل الخدمات الرسمي.",
    controlEyebrow: "05 · نقاط التحكم العملية",
    controlTitle: "افتح كل مخاطرة لمعرفة سببها وكيفية ضبطها.",
    why: "لماذا يحدث",
    response: "إجراء الضبط الموصى به",
    controlTypes: ["متطلب", "جهة", "امتثال", "مستند", "ضبط مالي", "إجراء موصى به"],
    registryEyebrow: "06 · السجل الرسمي والتحقق",
    registryTitle: "اختر الإمارة، ثم أكد مسار الجهة، ثم تحقق بالتسلسل.",
    registryIntro: "لا تبدأ بتخمين اسم الخدمة. ابدأ بالإمارة والجهة الظاهرة في سجل الأرض أو مخطط الموقع أو سجل المطور الرئيسي. يبني REOS بعد ذلك مسار التحقق المنطبق، وتظل الجهة المرتبطة مصدر القرار الرسمي.",
    emirateFirst: "1 · اختر الإمارة أولاً",
    emirateHelp: "تم تنظيم مسار دبي من دليل المطور الرسمي لدى الدائرة. ولا ترث أي إمارة غير مخططة خدمات دبي.",
    authoritySecond: "2 · أكد جهة المشروع",
    authorityHelp: "اختر فقط بعد أن يؤكد سجل الأرض أو مخطط الموقع أو سجل المطور الرئيسي الجهة المختصة.",
    routeReady: "مسار التحقق الخاص بك",
    routeReadyText: "يجمع التسلسل أدناه بوابات الدائرة المشتركة مع سجلات الخدمات الرسمية لمسار الجهة المحدد.",
    howToChoose: "كيفية اختيار الجهة",
    howToChooseText: "لا تستنتج الجهة من اسم المشروع أو الموقع العام. سجل الجهة التي تثبتها مستندات الأرض أو مخطط الموقع، وأكدها عبر القناة الرسمية قبل الاعتماد على هذا المسار.",
    authorityServices: "سجلات رسمية في هذه البوابة",
    whyVerify: "لماذا يجب التحقق",
    expectedEvidence: "الدليل / المخرج الواجب الاحتفاظ به",
    inspectGate: "افحص هذه البوابة في مستكشف الخدمات",
    openOfficialBranch: "افتح مسار الجهة الرسمي",
    conditional: "مشروط · فقط عند انطباق البيع على الخارطة",
    shared: "بوابة مشتركة في دبي",
    branch: "بوابة الجهة المحددة",
    notMapped: "لم يتم بعد تنظيم هذه الإمارة في أداة تحقق المطور هذه.",
    notMappedText: "لن يستبدل REOS جهات دبي أو رسومها أو مددها أو إجراءاتها. افتح صفحة المطور للإمارة للاطلاع على بيان التغطية الحالي، واستخدم الجهة المحلية المختصة كمصدر القرار الرسمي.",
    openEmiratePage: "افتح صفحة المطور لهذه الإمارة",
    optionalSearch: "أداة أخيرة اختيارية · ابحث داخل المسار المحدد",
    optionalSearchHelp: "استخدم البحث فقط بعد معرفة الإمارة والجهة. تقتصر النتائج على بوابات دبي المشتركة ومسار الجهة المحدد.",
    optionalSearchPlaceholder: "ابحث في المسار المحدد، مثل escrow أو building permit",
    searchPrompt: "أدخل اسم خدمة للبحث داخل المسار المحدد.",
    searchMatches: "سجلات رسمية مطابقة",
    noRouteMatches: "لا يطابق البحث أي سجل رسمي في المسار المحدد.",
    inspectService: "افحص السجل والمستندات والرسوم والمدة المدرجة",
  },
} as const;

const VERIFICATION_STEP_COPY = [
  {
    title: { en: "Establish and register the developer entity", ar: "تأسيس كيان المطور وتسجيله" },
    why: { en: "Confirm the entity, licensed real-estate activity, DLD approval, developer-log registration and Oqood access before treating the organisation as project-ready.", ar: "أكد الكيان والنشاط العقاري المرخص وموافقة الدائرة والتسجيل في سجل المطورين والوصول إلى نظام عقود قبل اعتبار المؤسسة جاهزة للمشروع." },
    evidence: { en: "Entity and licensing records, DLD NOC, developer-log evidence and Oqood registration evidence, as applicable.", ar: "سجلات الكيان والترخيص وعدم ممانعة الدائرة ودليل سجل المطورين ودليل التسجيل في عقود، بحسب الانطباق." },
  },
  {
    title: { en: "Confirm the plot and competent authority branch", ar: "تأكيد الأرض ومسار الجهة المختصة" },
    why: { en: "The planning, permit and completion route changes with the authority responsible for the plot. A generic Dubai search cannot make this decision.", ar: "يتغير مسار التخطيط والتصريح والإنجاز بحسب الجهة المسؤولة عن الأرض. ولا يستطيع بحث عام عن دبي اتخاذ هذا القرار." },
    evidence: { en: "A recorded plot/site-plan reference and a confirmed competent authority branch for the project file.", ar: "مرجع مسجل للأرض أو مخطط الموقع ومسار مؤكد للجهة المختصة في ملف المشروع." },
  },
  {
    title: { en: "Verify master-plan, design and NOC gates", ar: "التحقق من بوابات المخطط العام والتصميم وعدم الممانعة" },
    why: { en: "The selected authority branch has its own published master-plan and related approval records. Required items can be sequential or parallel.", ar: "لمسار الجهة المحدد سجلاته المنشورة للمخطط العام والموافقات المرتبطة. وقد تكون المتطلبات متسلسلة أو متوازية." },
    evidence: { en: "Applicable master-plan, design and NOC submissions, conditions and approval outputs retained in the project file.", ar: "طلبات المخطط العام والتصميم وعدم الممانعة المنطبقة وشروطها ومخرجات موافقاتها محفوظة في ملف المشروع." },
  },
  {
    title: { en: "Verify permit, construction and completion gates", ar: "التحقق من بوابات التصريح والإنشاء والإنجاز" },
    why: { en: "Construction and completion evidence must follow the selected authority branch, not a different Dubai jurisdiction's checklist.", ar: "يجب أن تتبع أدلة الإنشاء والإنجاز مسار الجهة المحدد، لا قائمة تحقق تخص نطاقاً آخر في دبي." },
    evidence: { en: "Applicable permit, inspection, construction-control and completion records from the selected authority route.", ar: "سجلات التصاريح والتفتيش وضبط الإنشاء والإنجاز المنطبقة من مسار الجهة المحدد." },
  },
  {
    title: { en: "Verify off-plan project, escrow and initial-unit gates", ar: "التحقق من بوابات المشروع على الخارطة والضمان والتحميل الأولي للوحدات" },
    why: { en: "This parallel route applies when off-plan sales are intended; it must not be treated as a universal construction step.", ar: "ينطبق هذا المسار المتوازي عند وجود بيع على الخارطة، ولا يجب اعتباره خطوة إنشاء عامة." },
    evidence: { en: "Applicable project-registration, escrow-account and initial-unit-loading records before relying on off-plan sales readiness.", ar: "سجلات تسجيل المشروع وحساب الضمان والتحميل الأولي للوحدات المنطبقة قبل الاعتماد على جاهزية البيع على الخارطة." },
  },
  {
    title: { en: "Verify final loading, escrow settlement and handover close-out", ar: "التحقق من التحميل النهائي وتسوية الضمان وإقفال التسليم" },
    why: { en: "Completion does not by itself prove that final unit and escrow close-out records are complete or that surviving obligations have been handed over.", ar: "لا يثبت الإنجاز وحده اكتمال سجلات الوحدات النهائية وإقفال الضمان أو تسليم الالتزامات المستمرة." },
    evidence: { en: "Final unit-loading and escrow-settlement records, plus the applicable handover and surviving-obligation evidence.", ar: "سجلات التحميل النهائي للوحدات وتسوية الضمان، إضافة إلى أدلة التسليم والالتزامات المستمرة المنطبقة." },
  },
] as const;

const SUBPHASE_LABELS: Record<Locale, Record<string, string>> = {
  en: {},
  ar: {
    "master-plan-approval": "اعتماد المخطط العام",
    "construction-permit-and-completion-certificate-phase": "مرحلة تصريح البناء وشهادة الإنجاز",
    "sales-stage-during-project-completion-off-plan-property-sale": "مرحلة البيع أثناء إنجاز المشروع (البيع على الخارطة)",
  },
};

function RouteIcon({ kind }: { kind: "identity" | "plan" | "build" | "sell" | "close" }) {
  const paths: Record<typeof kind, ReactNode> = {
    identity: <><circle cx="12" cy="7" r="3" /><path d="M5.5 20c.7-5.2 3-7.8 6.5-7.8s5.8 2.6 6.5 7.8M17 4h4v6h-4" /></>,
    plan: <><path d="M4 5h16v14H4zM8 5v14M4 10h4m0 4h12m-6-9v9" /></>,
    build: <><path d="M3 21h18M6 21V9l6-5 6 5v12M9 21v-7h6v7" /><path d="M8 10h8" /></>,
    sell: <><path d="M4 7h12l4 5-8 8-8-8V7Z" /><circle cx="9" cy="11" r="1.5" /><path d="M15 4v5" /></>,
    close: <><path d="M5 3h11l3 3v15H5zM16 3v4h4M8 13l2.5 2.5L16 10" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[kind]}</svg>;
}

function DetailField({ label, value, fallback }: { label: string; value: string; fallback: string }) {
  return <div><dt>{label}</dt><dd>{value || fallback}</dd></div>;
}

const CONTROL_KINDS = ["requirement", "authority", "compliance", "document", "finance", "action"] as const;

function ControlIcon({ kind }: { kind: (typeof CONTROL_KINDS)[number] }) {
  const paths: Record<typeof kind, ReactNode> = {
    requirement: <><path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    authority: <><path d="M3 9h18L12 3 3 9Zm2 3h14M6 12v7m4-7v7m4-7v7m4-7v7M3 21h18" /></>,
    compliance: <><path d="M12 3 3.5 20h17L12 3Z" /><path d="M12 9v5m0 3v.1" /></>,
    document: <><path d="M6 3h9l3 3v15H6zM15 3v4h4M9 12h6m-6 4h6" /></>,
    finance: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5c-.8-.7-2-1-3.3-1-1.8 0-3.2.8-3.2 2s1.1 1.8 3.2 2.3 3.2 1.1 3.2 2.4-1.4 2.2-3.4 2.2c-1.5 0-2.8-.4-3.7-1.2M12 5v14" /></>,
    action: <><path d="M4 19 20 5M10 5h10v10" /><circle cx="6" cy="17" r="3" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[kind]}</svg>;
}

const localize = (value: LocalizedText, locale: Locale) => value[locale];

export function DeveloperDldJourney({ locale, track, stages, participation }: Props) {
  const c = COPY[locale];
  const { preDevelopment, development, postDevelopment } = dldDeveloperBook.stages;
  const [phaseId, setPhaseId] = useState<PhaseId>("pre-development");
  const [subphaseId, setSubphaseId] = useState(development.subphases[0].id);
  const initialAuthority = TRACK_AUTHORITY[track] ?? development.subphases[0].branches[0].id;
  const [authorityId, setAuthorityId] = useState(initialAuthority);
  const [serviceId, setServiceId] = useState(preDevelopment.services[0].id);
  const [query, setQuery] = useState("");
  const [guideStepId, setGuideStepId] = useState(developerJourneySteps[0].id);
  const [verificationEmirateId, setVerificationEmirateId] = useState<EmirateId>("dubai");
  const [verificationAuthorityId, setVerificationAuthorityId] = useState(initialAuthority);
  const [verificationQuery, setVerificationQuery] = useState("");

  const selectedSubphase = development.subphases.find((item) => item.id === subphaseId) ?? development.subphases[0];
  const selectedBranch = selectedSubphase.branches.find((item) => item.id === authorityId) ?? selectedSubphase.branches[0];
  const services = phaseId === "pre-development" ? preDevelopment.services : phaseId === "post-development" ? postDevelopment.services : selectedBranch.services;
  const selectedService = services.find((service) => service.id === serviceId) ?? services[0];
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleServices = normalizedQuery
    ? services.filter((service) => `${service.title} ${service.description}`.toLocaleLowerCase().includes(normalizedQuery))
    : services;
  const sourceUrl = phaseId === "pre-development" ? preDevelopment.sourceUrl : phaseId === "post-development" ? postDevelopment.sourceUrl : selectedBranch.sourceUrl;
  const stageDescription = phaseId === "pre-development" ? preDevelopment.description : phaseId === "post-development" ? postDevelopment.description : development.description;
  const stageNote = phaseId === "pre-development" ? preDevelopment.sequenceNote : phaseId === "post-development" ? postDevelopment.sequenceNote : development.sequenceNote;
  const selectedGuideStep = developerJourneySteps.find((step) => step.id === guideStepId) ?? developerJourneySteps[0];
  const guidance = stakeholderGuidance.developers;
  const verificationAuthorityOptions = development.subphases[0].branches;
  const selectedVerificationAuthority = verificationAuthorityOptions.find((branch) => branch.id === verificationAuthorityId) ?? verificationAuthorityOptions[0];
  const verificationBranchFor = (subphaseIndex: number) => {
    const subphase = development.subphases[subphaseIndex];
    return subphase.branches.find((branch) => branch.id === selectedVerificationAuthority.id) ?? subphase.branches[0];
  };
  const verificationMasterPlan = verificationBranchFor(0);
  const verificationConstruction = verificationBranchFor(1);
  const verificationOffPlan = verificationBranchFor(2);
  const verificationGates = [
    { services: preDevelopment.services, sourceUrl: preDevelopment.sourceUrl, type: c.shared, phase: "pre-development" as PhaseId },
    { services: [], sourceUrl: selectedVerificationAuthority.sourceUrl, type: c.branch, phase: "development" as PhaseId },
    { services: verificationMasterPlan.services, sourceUrl: verificationMasterPlan.sourceUrl, type: c.branch, phase: "development" as PhaseId, subphaseId: development.subphases[0].id },
    { services: verificationConstruction.services, sourceUrl: verificationConstruction.sourceUrl, type: c.branch, phase: "development" as PhaseId, subphaseId: development.subphases[1].id },
    { services: verificationOffPlan.services, sourceUrl: verificationOffPlan.sourceUrl, type: c.conditional, phase: "development" as PhaseId, subphaseId: development.subphases[2].id },
    { services: postDevelopment.services, sourceUrl: postDevelopment.sourceUrl, type: c.shared, phase: "post-development" as PhaseId },
  ];
  const verificationRecords = verificationGates.flatMap((gate, gateIndex) => gate.services.map((service) => ({
    gateIndex,
    service,
    reference: { phase: gate.phase, subphaseId: gate.subphaseId, serviceId: service.id } satisfies DeveloperServiceReference,
  })));
  const normalizedVerificationQuery = verificationQuery.trim().toLocaleLowerCase();
  const visibleVerificationRecords = normalizedVerificationQuery
    ? verificationRecords.filter(({ service }) => `${service.title} ${service.description}`.toLocaleLowerCase().includes(normalizedVerificationQuery))
    : [];

  const setPhase = (next: PhaseId) => {
    setPhaseId(next);
    setQuery("");
    const nextServices = next === "pre-development" ? preDevelopment.services : next === "post-development" ? postDevelopment.services : selectedBranch.services;
    setServiceId(nextServices[0].id);
  };

  const setSubphase = (nextId: string) => {
    const nextSubphase = development.subphases.find((item) => item.id === nextId) ?? development.subphases[0];
    const nextBranch = nextSubphase.branches.find((item) => item.id === authorityId) ?? nextSubphase.branches[0];
    setPhaseId("development");
    setSubphaseId(nextSubphase.id);
    setAuthorityId(nextBranch.id);
    setServiceId(nextBranch.services[0].id);
    setQuery("");
  };

  const setAuthority = (nextId: string) => {
    const nextBranch = selectedSubphase.branches.find((item) => item.id === nextId) ?? selectedSubphase.branches[0];
    setAuthorityId(nextBranch.id);
    setServiceId(nextBranch.services[0].id);
    setQuery("");
  };

  const serviceForReference = (reference: DeveloperServiceReference) => {
    if (!reference.serviceId) return undefined;
    if (reference.phase === "pre-development") return preDevelopment.services.find((service) => service.id === reference.serviceId);
    if (reference.phase === "post-development") return postDevelopment.services.find((service) => service.id === reference.serviceId);
    const subphase = development.subphases.find((item) => item.id === reference.subphaseId) ?? development.subphases[0];
    const branch = subphase.branches.find((item) => item.id === authorityId) ?? subphase.branches[0];
    return branch.services.find((service) => service.id === reference.serviceId);
  };

  const inspectReference = (reference: DeveloperServiceReference, authorityOverride = authorityId) => {
    setQuery("");
    if (reference.phase === "pre-development") {
      setPhaseId("pre-development");
      setServiceId(reference.serviceId ?? preDevelopment.services[0].id);
    } else if (reference.phase === "post-development") {
      setPhaseId("post-development");
      setServiceId(reference.serviceId ?? postDevelopment.services[0].id);
    } else {
      const nextSubphase = development.subphases.find((item) => item.id === reference.subphaseId) ?? development.subphases[0];
      const nextBranch = nextSubphase.branches.find((item) => item.id === authorityOverride) ?? nextSubphase.branches[0];
      setPhaseId("development");
      setSubphaseId(nextSubphase.id);
      setAuthorityId(nextBranch.id);
      setServiceId(reference.serviceId && nextBranch.services.some((service) => service.id === reference.serviceId) ? reference.serviceId : nextBranch.services[0].id);
    }
    document.getElementById("dld-service-book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectLifecycleStage = (stageId: string) => {
    const firstStep = developerJourneySteps.find((step) => step.lifecycleStageIds.includes(stageId));
    if (firstStep) setGuideStepId(firstStep.id);
    document.getElementById("developer-checklist")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const phaseLabels: Record<PhaseId, string> = {
    "pre-development": c.pre,
    development: c.development,
    "post-development": c.post,
  };

  return <section className="developer-dld-journey" aria-labelledby="developer-dld-title">
    <header className="dld-journey-heading">
      <div>
        <span className="eyebrow">{c.eyebrow}</span>
        <h2 id="developer-dld-title">{c.title}</h2>
      </div>
      <div>
        <p>{c.intro}</p>
        <a href={dldDeveloperBook.source.url} target="_blank" rel="noreferrer">{c.source} <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <div className="dld-source-strip">
      <span>{c.status}</span><time dateTime={dldDeveloperBook.source.checkedOn}>{c.checked}</time><b>{dldDeveloperBook.source.authority}</b>
    </div>

    <section className="developer-seven-stage" aria-labelledby="developer-seven-stage-title">
      <header>
        <div><span>{c.lifecycleEyebrow}</span><h3 id="developer-seven-stage-title">{c.lifecycleTitle}</h3></div>
        <p>{c.lifecycleNote}</p>
      </header>
      <p className="developer-stage-instruction">{c.stageInstruction}</p>
      <ol>
        {stages.map((stage) => {
          const relationship = participation.find((item) => item.stageId === stage.id)?.relationshipLevel ?? "informed";
          const supporting = relationship === "supporting" || relationship === "informed";
          return <li key={stage.id}>
            <button type="button" onClick={() => selectLifecycleStage(stage.id)} data-level={relationship}>
              <span>{String(stage.number).padStart(2, "0")}</span>
              <b>{stage.name}</b>
              <small>{supporting ? c.supporting : c.direct}</small>
            </button>
          </li>;
        })}
      </ol>
    </section>

    <section id="developer-checklist" className="developer-checklist" aria-labelledby="developer-checklist-title">
      <header>
        <div><span className="eyebrow">{c.checklistEyebrow}</span><h3 id="developer-checklist-title">{c.checklistTitle}</h3></div>
        <p>{c.checklistIntro}</p>
      </header>

      <div className="developer-checklist-workspace">
        <nav aria-label={locale === "ar" ? "خطوات رحلة المطور" : "Developer journey steps"}>
          <ol>{developerJourneySteps.map((step) => <li key={step.id}>
            <button type="button" aria-current={selectedGuideStep.id === step.id ? "step" : undefined} onClick={() => setGuideStepId(step.id)}>
              <span>{String(step.number).padStart(2, "0")}</span>
              <span><small>{phaseLabels[step.phase]}</small><b>{localize(step.title, locale)}</b></span>
              <i aria-hidden="true">→</i>
            </button>
          </li>)}</ol>
        </nav>

        <article className="developer-checklist-detail" aria-live="polite">
          <header>
            <span>{phaseLabels[selectedGuideStep.phase]} · {String(selectedGuideStep.number).padStart(2, "0")}</span>
            <h4>{localize(selectedGuideStep.title, locale)}</h4>
            <p>{localize(selectedGuideStep.summary, locale)}</p>
          </header>
          <div className="developer-step-grid">
            <section><h5>{c.whatToDo}</h5><ol>{selectedGuideStep.actions.map((item, index) => <li key={`${selectedGuideStep.id}-action-${index}`}><span>{index + 1}</span>{localize(item, locale)}</li>)}</ol></section>
            <section><h5>{c.whatYouNeed}</h5><ul>{selectedGuideStep.requirements.map((item, index) => <li key={`${selectedGuideStep.id}-requirement-${index}`}>{localize(item, locale)}</li>)}</ul></section>
            <dl>
              <div><dt>{c.authority}</dt><dd>{localize(selectedGuideStep.authority, locale)}</dd></div>
              <div><dt>{c.stakeholders}</dt><dd>{localize(selectedGuideStep.stakeholders, locale)}</dd></div>
              <div><dt>{c.approvalOutput}</dt><dd>{localize(selectedGuideStep.output, locale)}</dd></div>
              <div><dt>{c.nextStep}</dt><dd>{localize(selectedGuideStep.next, locale)}</dd></div>
            </dl>
          </div>
          <footer>
            <b>{c.linkedRecords}</b>
            <div>{selectedGuideStep.serviceReferences.map((reference, index) => {
              const service = serviceForReference(reference);
              return <button key={`${selectedGuideStep.id}-source-${index}`} type="button" onClick={() => inspectReference(reference)}>
                <span>{service?.title ?? (SUBPHASE_LABELS[locale][reference.subphaseId ?? ""] || c.branchRecord)}</span>
                <small>{service ? c.inspectRecord : c.branchRecord}</small>
                {service ? <em lang="en">{c.fees}: {service.fees || c.notListed} · {c.time}: {service.time || c.notListed}</em> : null}
                <i aria-hidden="true">↓</i>
              </button>;
            })}</div>
          </footer>
        </article>
      </div>
    </section>

    <header className="dld-phase-explorer-heading">
      <span className="eyebrow">{c.phaseOverview}</span>
      <h3>{c.phaseOverviewTitle}</h3>
    </header>

    <div className="dld-overview-map" aria-label={locale === "ar" ? "نظرة عامة على مسار المطور لدى دائرة الأراضي والأملاك" : "DLD developer route overview"}>
      <button type="button" className="dld-map-node node-pre" aria-pressed={phaseId === "pre-development"} onClick={() => setPhase("pre-development")}>
        <span>01</span><RouteIcon kind="identity" /><small>{c.pre}</small><b>{preDevelopment.services.length} {c.services}</b>
      </button>
      <button type="button" className="dld-map-node node-plan" aria-pressed={phaseId === "development" && subphaseId === development.subphases[0].id} onClick={() => setSubphase(development.subphases[0].id)}>
        <span>02A</span><RouteIcon kind="plan" /><small>{c.development}</small><b>{c.masterPlan}</b>
      </button>
      <div className="dld-parallel-lanes">
        <button type="button" className="dld-map-node node-build" aria-pressed={phaseId === "development" && subphaseId === development.subphases[1].id} onClick={() => setSubphase(development.subphases[1].id)}>
          <span>02B</span><RouteIcon kind="build" /><small>{c.development}</small><b>{c.build}</b>
        </button>
        <button type="button" className="dld-map-node node-sell" aria-pressed={phaseId === "development" && subphaseId === development.subphases[2].id} onClick={() => setSubphase(development.subphases[2].id)}>
          <span>02C</span><RouteIcon kind="sell" /><small>{c.parallel}</small><b>{c.sell}</b>
        </button>
      </div>
      <button type="button" className="dld-map-node node-post" aria-pressed={phaseId === "post-development"} onClick={() => setPhase("post-development")}>
        <span>03</span><RouteIcon kind="close" /><small>{c.closure}</small><b>{c.post}</b>
      </button>
      <div className="dld-map-flow" aria-hidden="true"><i /><i /><i /><i /></div>
    </div>

    <div className="dld-escrow-correction"><RouteIcon kind="sell" /><p>{c.escrowCorrection}</p></div>

    <nav className="dld-phase-nav" aria-label={c.phaseLabel}>
      {(["pre-development", "development", "post-development"] as PhaseId[]).map((id, index) => <button key={id} type="button" aria-current={phaseId === id ? "step" : undefined} onClick={() => setPhase(id)}><span>{String(index + 1).padStart(2, "0")}</span>{phaseLabels[id]}</button>)}
    </nav>

    <div className="dld-stage-context">
      <div><span>{c.phaseLabel}</span><h3>{phaseLabels[phaseId]}</h3><p lang="en">{stageDescription}</p></div>
      <strong>{stageNote}</strong>
    </div>

    {phaseId === "development" ? <div className="dld-development-controls">
      <fieldset>
        <legend>{c.subphaseLabel}</legend>
        <div>{development.subphases.map((subphase, index) => <button key={subphase.id} type="button" aria-pressed={subphase.id === selectedSubphase.id} onClick={() => setSubphase(subphase.id)}><span>{`02${String.fromCharCode(65 + index)}`}</span>{SUBPHASE_LABELS[locale][subphase.id] ?? subphase.label}</button>)}</div>
      </fieldset>
      <label><span>{c.authorityLabel}</span><select value={selectedBranch.id} onChange={(event) => setAuthority(event.target.value)}>{selectedSubphase.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.authority}</option>)}</select></label>
    </div> : null}

    <div id="dld-service-book" className="dld-service-workspace">
      <div className="dld-service-list">
        <label className="dld-service-search"><span>{c.serviceSearch}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.serviceSearchPlaceholder} /></label>
        <div className="dld-service-count" aria-live="polite"><b>{visibleServices.length}</b> {c.services}</div>
        <div className="dld-service-nodes">
          {visibleServices.map((service, index) => <button key={`${selectedBranch.id}-${service.id}`} type="button" aria-pressed={selectedService?.id === service.id} onClick={() => setServiceId(service.id)}>
            <span>{String(index + 1).padStart(2, "0")}</span><div><small>{phaseId === "development" ? selectedBranch.authority : dldDeveloperBook.source.authority}</small><b lang="en">{service.title}</b></div><i aria-hidden="true">→</i>
          </button>)}
          {visibleServices.length === 0 ? <p className="dld-service-empty">{c.noResults}</p> : null}
        </div>
      </div>

      {selectedService ? <article className="dld-service-detail" aria-live="polite">
        <header><span>{c.selectNode}</span><h4 lang="en">{selectedService.title}</h4><p lang="en">{selectedService.description}</p></header>
        <dl lang="en">
          <DetailField label={c.channel} value={selectedService.channel} fallback={c.notListed} />
          <DetailField label={c.time} value={selectedService.time} fallback={c.notListed} />
          <DetailField label={c.fees} value={selectedService.fees} fallback={c.notListed} />
          <DetailField label={c.documents} value={selectedService.documents} fallback={c.notListed} />
        </dl>
        <div className="dld-detail-actions">
          <a href={sourceUrl} target="_blank" rel="noreferrer">{c.officialRecord} <span aria-hidden="true">↗</span></a>
          {selectedService.channelUrl ? <a href={selectedService.channelUrl} target="_blank" rel="noreferrer">{c.channelLink} <span aria-hidden="true">↗</span></a> : null}
        </div>
        <p className="dld-estimate-note">{c.estimate}</p>
      </article> : null}
    </div>

    <div className="dld-crosswalk">
      <header><b>{c.crosswalk}</b><p>{c.notReplacement}</p></header>
      <ol><li><span>01</span><b>{c.pre}</b><small>{c.crosswalkPre}</small></li><li><span>02</span><b>{c.development}</b><small>{c.crosswalkDev}</small></li><li><span>03</span><b>{c.post}</b><small>{c.crosswalkPost}</small></li></ol>
    </div>

    <section className="developer-control-points" aria-labelledby="developer-control-title">
      <header><span className="eyebrow">{c.controlEyebrow}</span><h3 id="developer-control-title">{c.controlTitle}</h3></header>
      <div>{guidance.challenges.map((item, index) => {
        const source = item.sourceId ? officialSourceById[item.sourceId] : undefined;
        const kind = CONTROL_KINDS[index % CONTROL_KINDS.length];
        return <details key={item.title}>
          <summary>
            <ControlIcon kind={kind} />
            <span><small>{c.controlTypes[index % c.controlTypes.length]}</small><b>{item.title}</b></span>
            <i aria-hidden="true">+</i>
          </summary>
          <div>
            <p><b>{c.why}</b>{item.why}</p>
            <p><b>{c.response}</b>{item.response}</p>
            {source ? <a href={source.url} target="_blank" rel="noreferrer">{source.authority} · {locale === "ar" ? "افتح المصدر الرسمي ↗" : "Open official source ↗"}</a> : null}
          </div>
        </details>;
      })}</div>
    </section>

    <section className="developer-registry-guide" aria-labelledby="developer-registry-title">
      <header>
        <span className="eyebrow">{c.registryEyebrow}</span>
        <h3 id="developer-registry-title">{c.registryTitle}</h3>
        <p>{c.registryIntro}</p>
      </header>

      <div className="developer-verification-controls">
        <label>
          <span>{c.emirateFirst}</span>
          <select value={verificationEmirateId} onChange={(event) => {
            setVerificationEmirateId(event.target.value as EmirateId);
            setVerificationQuery("");
          }}>
            {EMIRATES.map((emirate) => <option key={emirate.id} value={emirate.id}>{locale === "ar" ? emirate.ar : emirate.label}</option>)}
          </select>
          <small>{c.emirateHelp}</small>
        </label>

        {verificationEmirateId === "dubai" ? <fieldset>
          <legend>{c.authoritySecond}</legend>
          <p>{c.authorityHelp}</p>
          <div className="developer-authority-choices">
            {verificationAuthorityOptions.map((branch, index) => <button key={branch.id} type="button" aria-pressed={branch.id === selectedVerificationAuthority.id} onClick={() => {
              setVerificationAuthorityId(branch.id);
              setVerificationQuery("");
            }}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{branch.authority}</b>
            </button>)}
          </div>
        </fieldset> : null}
      </div>

      {verificationEmirateId === "dubai" ? <div className="developer-verification-route">
        <aside className="developer-authority-condition">
          <div><span>{c.howToChoose}</span><b>{selectedVerificationAuthority.authority}</b></div>
          <p>{c.howToChooseText}</p>
        </aside>

        <header>
          <div><span>{c.routeReady}</span><h4>{selectedVerificationAuthority.authority}</h4></div>
          <p>{c.routeReadyText}</p>
        </header>

        <ol className="developer-verification-flow">
          {VERIFICATION_STEP_COPY.map((step, index) => {
            const gate = verificationGates[index];
            const reference = gate.services[0] ? { phase: gate.phase, subphaseId: gate.subphaseId, serviceId: gate.services[0].id } satisfies DeveloperServiceReference : undefined;
            return <li key={`${selectedVerificationAuthority.id}-verification-${index}`}>
              <span className="developer-verification-number">{String(index + 1).padStart(2, "0")}</span>
              <article>
                <header><small>{gate.type}</small><h5>{localize(step.title, locale)}</h5></header>
                <div>
                  <p><b>{c.whyVerify}</b>{localize(step.why, locale)}</p>
                  <p><b>{c.expectedEvidence}</b>{localize(step.evidence, locale)}</p>
                </div>
                {gate.services.length ? <div className="developer-verification-services">
                  <span><b>{gate.services.length}</b> {c.authorityServices}</span>
                  <ul>{gate.services.slice(0, 4).map((service) => <li key={service.id} lang="en">{service.title}</li>)}</ul>
                  {gate.services.length > 4 ? <small>+ {gate.services.length - 4} {locale === "ar" ? "سجلات إضافية" : "more records"}</small> : null}
                </div> : null}
                <footer>
                  {reference ? <button type="button" onClick={() => inspectReference(reference, selectedVerificationAuthority.id)}>{c.inspectGate} <span aria-hidden="true">↓</span></button> : null}
                  <a href={gate.sourceUrl} target="_blank" rel="noreferrer">{c.openOfficialBranch} <span aria-hidden="true">↗</span></a>
                </footer>
              </article>
            </li>;
          })}
        </ol>

        <section className="developer-verification-search" aria-labelledby="developer-verification-search-title">
          <header><h5 id="developer-verification-search-title">{c.optionalSearch}</h5><p>{c.optionalSearchHelp}</p></header>
          <label><span>{c.serviceSearch}</span><input type="search" value={verificationQuery} onChange={(event) => setVerificationQuery(event.target.value)} placeholder={c.optionalSearchPlaceholder} /></label>
          <div className="developer-verification-search-count" aria-live="polite">
            {normalizedVerificationQuery ? <><b>{visibleVerificationRecords.length}</b> {c.searchMatches}</> : c.searchPrompt}
          </div>
          {normalizedVerificationQuery ? <div className="developer-verification-search-results">
            {visibleVerificationRecords.map(({ gateIndex, service, reference }) => <button key={`${gateIndex}-${service.id}`} type="button" onClick={() => inspectReference(reference, selectedVerificationAuthority.id)}>
              <span>{String(gateIndex + 1).padStart(2, "0")} · {verificationGates[gateIndex].type}</span>
              <b lang="en">{service.title}</b>
              <small>{c.inspectService}</small>
              <i aria-hidden="true">↓</i>
            </button>)}
            {visibleVerificationRecords.length === 0 ? <p>{c.noRouteMatches}</p> : null}
          </div> : null}
        </section>
      </div> : <div className="developer-verification-unmapped" role="status">
        <span>{String(EMIRATES.findIndex((emirate) => emirate.id === verificationEmirateId) + 1).padStart(2, "0")}</span>
        <div><h4>{c.notMapped}</h4><p>{c.notMappedText}</p><a href={`${locale === "ar" ? "/ar" : ""}/stakeholders/developers/${verificationEmirateId}`}>{c.openEmiratePage} <span aria-hidden="true">→</span></a></div>
      </div>}
    </section>

    <footer className="dld-source-warning"><p>{c.sourceWarning}</p><small>{c.officialEnglish}</small></footer>
  </section>;
}
