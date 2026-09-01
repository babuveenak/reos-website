"use client";

import { useState, type ReactNode } from "react";
import { dldDeveloperBook } from "../data/dldDeveloperBook";
import { DEVELOPER_SERVICE_GUIDANCE, POST_DEVELOPMENT_ROUTE_ORDER, PRE_DEVELOPMENT_ROUTE_ORDER, inferDevelopmentServiceProvider } from "../data/developerServiceGuidance";
import { developerJourneySteps, type DeveloperServiceReference, type LocalizedText } from "../data/developerJourneyGuide";
import type { Stage } from "../data/journey";
import { officialSourceById } from "../data/officialSources";
import { stakeholderGuidance } from "../data/stakeholderGuidance";
import { EMIRATES, type DubaiTrack, type EmirateId, type ParticipationState } from "../data/stakeholderBlueprints";
import type { Locale } from "../i18n/config";

type PhaseId = "pre-development" | "development" | "post-development";
type FlowRelation = "sequence" | "flexible" | "parallel" | "conditional" | "closure";

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
    eyebrow: "02 · Choose your development route",
    title: "Start with the place. Then follow the right path.",
    intro: "Choose the Emirate, the authority shown on the plot record, and whether off-plan sales apply.",
    source: "Open the DLD Developer Book",
    status: "Official DLD listing · structured by REOS",
    checked: "Checked 1 September 2026",
    snapshot: "170 official DLD records · source-controlled snapshot · not a live API feed",
    sequenceCautionPre: "Current Dubai guidance places initial approval before trade-name registration but expressly allows the name to be reserved first. REOS therefore shows them as a flexible pair, followed by licence issuance and the DLD onboarding gates. Confirm the live DET–DLD hand-off for the selected legal form and activity.",
    sequenceCautionDevelopment: "DLD-published records for the selected branch. The numbers are navigation references, not a claim that every approval runs linearly; NOCs and technical reviews may be parallel or conditional.",
    sequenceCautionPost: "Both records require completion evidence, but they are separate close-out branches: final unit loading supports title issuance and handover; escrow settlement applies only where an off-plan project escrow account exists.",
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
    processMap: "Interactive process map",
    processMapHelp: "Hover or focus to preview the provider and published timing. Select a node to open the full structured record.",
    flowGroups: { sequence: "Required backbone", flexible: "Flexible early pair", parallel: "Parallel authority clearances", conditional: "Conditional route", closure: "Completion close-out" },
    flowLegend: { sequence: "Follow the backbone", flexible: "Either may start first", parallel: "May proceed together", conditional: "Only when applicable", closure: "Requires completion evidence" },
    noResults: "No service matches this search in the selected branch.",
    channel: "Service channel",
    time: "Listed service time",
    fees: "Listed fees",
    documents: "Listed documents",
    notListed: "Not listed in this DLD record",
    estimate: "A service estimate is not the end-to-end project duration.",
    sourceWarning: dldDeveloperBook.source.warning,
    officialEnglish: "DLD’s English service titles and record text are preserved exactly enough for source comparison; confirm the live authority page before applying.",
    crosswalk: "How this sits inside the protected REOS lifecycle",
    crosswalkPre: "Land & Vision → Authorities & Approvals",
    crosswalkDev: "Planning & Design → Authorities & Approvals → Construction & Delivery, with Sales & Transfer overlapping when off-plan",
    crosswalkPost: "Construction & Delivery → Living & Operations",
    lifecycleEyebrow: "Lifecycle connection · all seven stages",
    lifecycleTitle: "Seven stages. One connected developer route.",
    lifecycleNote: "Stages 1–6 are direct. Stage 7 is a supporting role.",
    direct: "Direct responsibility",
    supporting: "Supporting role",
    stageInstruction: "Select a lifecycle stage or a developer step.",
    checklistEyebrow: "03 · Developer journey & process guide",
    checklistTitle: "Follow one guided path from setup to close-out.",
    checklistIntro: "Select a step to reveal its authority, evidence, output and official service records.",
    whatToDo: "What you need to do",
    authority: "Authority / decision route",
    stakeholders: "Connected stakeholders",
    whatYouNeed: "What you need",
    approvalOutput: "Approval / output",
    nextStep: "Next step",
    linkedRecords: "Linked official service records",
    inspectRecord: "Inspect record and listed fee, time and documents",
    branchRecord: "Inspect the applicable authority branch",
    phaseOverview: "Official service layer",
    phaseOverviewTitle: "Explore the services behind the selected journey.",
    controlEyebrow: "Controls inside the journey",
    controlTitle: "Check the risks before they become delays.",
    why: "Why it happens",
    response: "Recommended control",
    controlTypes: ["Requirement", "Authority", "Compliance", "Document", "Financial control", "Recommended action"],
    registryEyebrow: "04 · Verify and proceed officially",
    registryTitle: "Leave REOS with the right evidence and official route.",
    registryIntro: "Confirm each gate, keep its evidence, then use the exact authority link.",
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
    guidedStep: "REOS guided step",
    publishedRecord: "DLD published record",
    provider: "Service provider / authority",
    beforeStart: "Before you start",
    expectedOutput: "Expected output",
    applyDirect: "Open exact application route",
    evidenceRecord: "Open DLD evidence record",
    noDirectApply: "No separate public application link is published in this DLD record. Use the evidence record and confirm the live channel with the authority.",
    saleRoute: "3 · Select the sales route",
    offPlanRoute: "Off-plan sales apply",
    completedRoute: "No off-plan sales",
    selectedRoute: "Selected route",
    mappedRoute: "Mapped from the DLD Developer Book",
    routeNext: "Your choices control the journey and verification cards below.",
    lifecycleCompact: "REOS seven-stage crosswalk",
    journeyWorkspace: "Guided service workspace",
    verificationReady: "Five evidence gates before you proceed",
  },
  ar: {
    eyebrow: "02 · اختر مسار التطوير",
    title: "ابدأ بالمكان، ثم اتبع المسار الصحيح.",
    intro: "اختر الإمارة والجهة الظاهرة في سجل الأرض وما إذا كان البيع على الخارطة ينطبق.",
    source: "افتح دليل المطور لدى دائرة الأراضي والأملاك",
    status: "قائمة رسمية من الدائرة · تنظيم REOS",
    checked: "تم التحقق في 1 سبتمبر 2026",
    snapshot: "170 سجلاً رسمياً من الدائرة · لقطة مضبوطة المصدر · ليست تغذية API حية",
    sequenceCautionPre: "تضع إرشادات دبي الحالية الموافقة المبدئية قبل تسجيل الاسم التجاري، لكنها تجيز صراحة حجز الاسم أولاً. لذلك يعرضهما REOS كزوج مرن، ثم إصدار الرخصة وبوابات التسجيل لدى الدائرة. أكد مسار التسليم الحي بين DET والدائرة بحسب الشكل القانوني والنشاط.",
    sequenceCautionDevelopment: "سجلات منشورة من الدائرة للمسار المحدد. الأرقام مراجع تنقل وليست ادعاءً بأن كل الموافقات خطية؛ فقد تكون الموافقات الفنية وشهادات عدم الممانعة متوازية أو مشروطة.",
    sequenceCautionPost: "يتطلب السجلان دليل الإنجاز، لكنهما فرعا إقفال منفصلان: يدعم التحميل النهائي إصدار سندات الملكية والتسليم، بينما تنطبق تسوية الضمان فقط عند وجود حساب ضمان لمشروع بيع على الخارطة.",
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
    processMap: "خريطة إجراءات تفاعلية",
    processMapHelp: "مرر المؤشر أو انقل التركيز لمعاينة الجهة والمدة المنشورة. اختر عقدة لفتح السجل المنظم الكامل.",
    flowGroups: { sequence: "المسار الأساسي المطلوب", flexible: "زوج مبكر مرن", parallel: "موافقات جهات متوازية", conditional: "مسار مشروط", closure: "إقفال بعد الإنجاز" },
    flowLegend: { sequence: "اتبع المسار الأساسي", flexible: "يمكن بدء أي منهما أولاً", parallel: "قد تسير معاً", conditional: "فقط عند الانطباق", closure: "يتطلب دليل الإنجاز" },
    noResults: "لا توجد خدمة مطابقة للبحث في المسار المحدد.",
    channel: "قناة الخدمة",
    time: "المدة المدرجة للخدمة",
    fees: "الرسوم المدرجة",
    documents: "المستندات المدرجة",
    notListed: "غير مدرج في سجل الدائرة هذا",
    estimate: "تقدير مدة الخدمة ليس مدة المشروع من بدايته إلى نهايته.",
    sourceWarning: "تعكس الرسوم والمدد والمستندات والقنوات ما كان منشوراً في دليل المطور لدى الدائرة عند التحقق في 31 أغسطس 2026. وهي ليست عرض سعر أو ضماناً لمدة المشروع. تحقق من صفحة الجهة الحية قبل التقديم.",
    officialEnglish: "تُعرض عناوين الخدمات ونصوص السجلات الرسمية باللغة الإنجليزية كما نشرها المصدر للمقارنة. الترجمة العربية التحريرية قيد المراجعة.",
    crosswalk: "موضع هذا المسار داخل دورة حياة REOS المحمية",
    crosswalkPre: "الأرض والرؤية ← الجهات والموافقات",
    crosswalkDev: "التخطيط والتصميم ← الجهات والموافقات ← الإنشاء والتسليم، مع تداخل البيع والنقل عند البيع على الخارطة",
    crosswalkPost: "الإنشاء والتسليم ← السكن والتشغيل",
    lifecycleEyebrow: "صلة دورة الحياة · المراحل السبع كاملة",
    lifecycleTitle: "سبع مراحل ومسار مطور واحد مترابط.",
    lifecycleNote: "المراحل من 1 إلى 6 مباشرة، والمرحلة 7 دور داعم.",
    direct: "مسؤولية مباشرة",
    supporting: "دور داعم",
    stageInstruction: "اختر مرحلة من دورة الحياة أو خطوة للمطور.",
    checklistEyebrow: "03 · رحلة المطور ودليل الإجراءات",
    checklistTitle: "اتبع مساراً واحداً من التأسيس إلى الإقفال.",
    checklistIntro: "اختر خطوة لعرض الجهة والدليل والمخرج وسجلات الخدمة الرسمية.",
    whatToDo: "ما الذي تحتاج إلى فعله",
    authority: "الجهة / مسار القرار",
    stakeholders: "أصحاب المصلحة المرتبطون",
    whatYouNeed: "ما الذي تحتاجه",
    approvalOutput: "الموافقة / المخرج",
    nextStep: "الخطوة التالية",
    linkedRecords: "سجلات الخدمات الرسمية المرتبطة",
    inspectRecord: "افحص السجل والرسوم والمدة والمستندات المدرجة",
    branchRecord: "افحص فرع الجهة المنطبق",
    phaseOverview: "طبقة الخدمات الرسمية",
    phaseOverviewTitle: "استكشف الخدمات خلف الرحلة المحددة.",
    controlEyebrow: "نقاط التحكم داخل الرحلة",
    controlTitle: "تحقق من المخاطر قبل أن تتحول إلى تأخير.",
    why: "لماذا يحدث",
    response: "إجراء الضبط الموصى به",
    controlTypes: ["متطلب", "جهة", "امتثال", "مستند", "ضبط مالي", "إجراء موصى به"],
    registryEyebrow: "04 · تحقق وتابع رسمياً",
    registryTitle: "غادر REOS ومعك الدليل الصحيح والمسار الرسمي.",
    registryIntro: "أكد كل بوابة واحتفظ بدليلها، ثم استخدم رابط الجهة الدقيق.",
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
    guidedStep: "خطوة إرشادية من REOS",
    publishedRecord: "سجل منشور من الدائرة",
    provider: "مزود الخدمة / الجهة",
    beforeStart: "قبل البدء",
    expectedOutput: "المخرج المتوقع",
    applyDirect: "افتح مسار التقديم الدقيق",
    evidenceRecord: "افتح سجل الدليل لدى الدائرة",
    noDirectApply: "لا ينشر سجل الدائرة هذا رابط تقديم عاماً منفصلاً. استخدم سجل الدليل وأكد القناة الحية مع الجهة.",
    saleRoute: "3 · اختر مسار المبيعات",
    offPlanRoute: "ينطبق البيع على الخارطة",
    completedRoute: "لا يوجد بيع على الخارطة",
    selectedRoute: "المسار المحدد",
    mappedRoute: "منظم من دليل المطور لدى الدائرة",
    routeNext: "تتحكم اختياراتك في الرحلة وبطاقات التحقق أدناه.",
    lifecycleCompact: "الربط مع مراحل REOS السبع",
    journeyWorkspace: "مساحة الخدمات الإرشادية",
    verificationReady: "خمس بوابات أدلة قبل المتابعة",
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

function orderServiceRecords<T extends { id: string }>(records: T[], preferredOrder: readonly string[]) {
  const position = new Map(preferredOrder.map((id, index) => [id, index]));
  return [...records].sort((a, b) => (position.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (position.get(b.id) ?? Number.MAX_SAFE_INTEGER));
}

const FLOW_ORDER: FlowRelation[] = ["flexible", "sequence", "parallel", "conditional", "closure"];

function inferFlowRelation(phaseId: PhaseId, subphaseId: string, title: string, serviceId: string): FlowRelation {
  const guided = DEVELOPER_SERVICE_GUIDANCE[serviceId]?.flowRelation;
  if (guided) return guided;
  if (phaseId !== "development") return phaseId === "post-development" ? "closure" : "sequence";
  if (subphaseId.includes("off-plan")) return "conditional";
  const value = title.toLocaleLowerCase();
  if (value.includes("master developer") || value.includes("master plan submission") || value.startsWith("apply for the approval of urban")) return "sequence";
  if (subphaseId === "master-plan-approval") return "parallel";
  if (value.includes("building permit") || value.includes("final design") || value.includes("inspection") || value.includes("completion") || value.includes("services connection")) return "sequence";
  return "parallel";
}

function flowCode(phaseId: PhaseId, relation: FlowRelation, relationIndex: number) {
  const prefix: Record<FlowRelation, string> = { flexible: "01", sequence: phaseId === "pre-development" ? "0" : "G", parallel: "P", conditional: "C", closure: "X" };
  if (phaseId === "pre-development" && relation === "flexible") return `01${String.fromCharCode(65 + relationIndex)}`;
  if (phaseId === "pre-development" && relation === "sequence") return String(relationIndex + 2).padStart(2, "0");
  if (phaseId === "post-development") return `03${String.fromCharCode(65 + relationIndex)}`;
  return `${prefix[relation]}${String(relationIndex + 1).padStart(2, "0")}`;
}

export function DeveloperDldJourney({ locale, track, stages, participation }: Props) {
  const c = COPY[locale];
  const { preDevelopment, development, postDevelopment } = dldDeveloperBook.stages;
  const [phaseId, setPhaseId] = useState<PhaseId>("pre-development");
  const [subphaseId, setSubphaseId] = useState(development.subphases[0].id);
  const initialAuthority = TRACK_AUTHORITY[track] ?? development.subphases[0].branches[0].id;
  const [authorityId, setAuthorityId] = useState(initialAuthority);
  const [serviceId, setServiceId] = useState<string>(PRE_DEVELOPMENT_ROUTE_ORDER[0]);
  const [query, setQuery] = useState("");
  const [guideStepId, setGuideStepId] = useState(developerJourneySteps[0].id);
  const [verificationEmirateId, setVerificationEmirateId] = useState<EmirateId>("dubai");
  const [verificationAuthorityId, setVerificationAuthorityId] = useState(initialAuthority);
  const [offPlanSelected, setOffPlanSelected] = useState(true);

  const selectedSubphase = development.subphases.find((item) => item.id === subphaseId) ?? development.subphases[0];
  const selectedBranch = selectedSubphase.branches.find((item) => item.id === authorityId) ?? selectedSubphase.branches[0];
  const services = phaseId === "pre-development"
    ? orderServiceRecords(preDevelopment.services, PRE_DEVELOPMENT_ROUTE_ORDER)
    : phaseId === "post-development"
      ? orderServiceRecords(postDevelopment.services, POST_DEVELOPMENT_ROUTE_ORDER)
      : selectedBranch.services;
  const selectedService = services.find((service) => service.id === serviceId) ?? services[0];
  const selectedServiceGuidance = selectedService ? DEVELOPER_SERVICE_GUIDANCE[selectedService.id] : undefined;
  const selectedProvider = selectedService
    ? selectedServiceGuidance?.provider ?? inferDevelopmentServiceProvider(selectedService.title, selectedBranch.authority)
    : undefined;
  const relationFor = (service: (typeof services)[number]) => inferFlowRelation(phaseId, selectedSubphase.id, service.title, service.id);
  const selectedFlowRelation = selectedService ? relationFor(selectedService) : "sequence";
  const selectedRelationRecords = services.filter((service) => relationFor(service) === selectedFlowRelation);
  const selectedFlowCode = flowCode(phaseId, selectedFlowRelation, Math.max(0, selectedRelationRecords.findIndex((service) => service.id === selectedService?.id)));
  const sequenceCaution = phaseId === "pre-development" ? c.sequenceCautionPre : phaseId === "post-development" ? c.sequenceCautionPost : c.sequenceCautionDevelopment;
  const selectedPrerequisite = selectedServiceGuidance
    ? localize(selectedServiceGuidance.prerequisite, locale)
    : sequenceCaution;
  const selectedOutput = selectedServiceGuidance
    ? localize(selectedServiceGuidance.output, locale)
    : locale === "ar"
      ? "مخرج الموافقة أو السجل المحدد في سجل الدائرة؛ أكد حالته الحية مع الجهة المختصة."
      : "The approval or record named in the DLD listing; confirm its live status with the competent authority.";
  const directApplicationUrl = selectedServiceGuidance?.applicationUrl ?? selectedService?.channelUrl ?? undefined;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleServices = normalizedQuery
    ? services.filter((service) => `${service.title} ${service.description}`.toLocaleLowerCase().includes(normalizedQuery))
    : services;
  const phaseFlowOrder = phaseId === "post-development" ? (["closure", "conditional"] satisfies FlowRelation[]) : FLOW_ORDER;
  const visibleFlowGroups = phaseFlowOrder.map((relation) => ({
    relation,
    services: visibleServices.filter((service) => relationFor(service) === relation),
  })).filter((group) => group.services.length > 0);
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
  const verificationCards = [
    { copyIndex: 0, gateIndexes: [0], icon: "identity" as const },
    { copyIndex: 1, gateIndexes: [1], icon: "plan" as const },
    { copyIndex: 2, gateIndexes: [2], icon: "plan" as const },
    { copyIndex: 3, gateIndexes: offPlanSelected ? [3, 4] : [3], icon: "build" as const },
    { copyIndex: 5, gateIndexes: [5], icon: "close" as const },
  ].map((card) => ({
    ...card,
    copy: VERIFICATION_STEP_COPY[card.copyIndex],
    gates: card.gateIndexes.map((index) => verificationGates[index]),
  }));

  const setPhase = (next: PhaseId) => {
    setPhaseId(next);
    setQuery("");
    const nextServices = next === "pre-development"
      ? orderServiceRecords(preDevelopment.services, PRE_DEVELOPMENT_ROUTE_ORDER)
      : next === "post-development"
        ? orderServiceRecords(postDevelopment.services, POST_DEVELOPMENT_ROUTE_ORDER)
        : selectedBranch.services;
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

  const chooseRouteAuthority = (nextId: string) => {
    setVerificationAuthorityId(nextId);
    const nextBranch = selectedSubphase.branches.find((item) => item.id === nextId) ?? selectedSubphase.branches[0];
    setAuthorityId(nextBranch.id);
    if (phaseId === "development") setServiceId(nextBranch.services[0].id);
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
      setServiceId(reference.serviceId ?? PRE_DEVELOPMENT_ROUTE_ORDER[0]);
    } else if (reference.phase === "post-development") {
      setPhaseId("post-development");
      setServiceId(reference.serviceId ?? POST_DEVELOPMENT_ROUTE_ORDER[0]);
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
    <div className="dld-snapshot-note dld-snapshot-note-compact" role="note"><b>{c.snapshot}</b><a href={dldDeveloperBook.source.url} target="_blank" rel="noreferrer">{c.source} ↗</a></div>

    <div className="developer-route-selector" aria-label={locale === "ar" ? "اختيار مسار التطوير" : "Development route selection"}>
      <label className="developer-route-choice">
        <span>{c.emirateFirst}</span>
        <select value={verificationEmirateId} onChange={(event) => setVerificationEmirateId(event.target.value as EmirateId)}>
          {EMIRATES.map((emirate) => <option key={emirate.id} value={emirate.id}>{locale === "ar" ? emirate.ar : emirate.label}</option>)}
        </select>
        <small>{c.emirateHelp}</small>
      </label>

      <fieldset className="developer-route-choice" disabled={verificationEmirateId !== "dubai"}>
        <legend>{c.authoritySecond}</legend>
        <div className="developer-route-authorities">
          {verificationAuthorityOptions.map((branch, index) => <button key={branch.id} type="button" aria-pressed={branch.id === selectedVerificationAuthority.id} onClick={() => chooseRouteAuthority(branch.id)}>
            <span>{String(index + 1).padStart(2, "0")}</span><b>{branch.authority}</b>
          </button>)}
        </div>
        <small>{c.authorityHelp}</small>
      </fieldset>

      <fieldset className="developer-route-choice developer-sale-route" disabled={verificationEmirateId !== "dubai"}>
        <legend>{c.saleRoute}</legend>
        <div>
          <button type="button" aria-pressed={offPlanSelected} onClick={() => setOffPlanSelected(true)}><RouteIcon kind="sell" /><span>{c.offPlanRoute}</span></button>
          <button type="button" aria-pressed={!offPlanSelected} onClick={() => setOffPlanSelected(false)}><RouteIcon kind="close" /><span>{c.completedRoute}</span></button>
        </div>
      </fieldset>

      <aside className="developer-selected-route" aria-live="polite">
        <div className="developer-route-orbit" aria-hidden="true"><i /><i /><i /><RouteIcon kind="build" /></div>
        <span>{c.selectedRoute}</span>
        <strong>{verificationEmirateId === "dubai" ? `${locale === "ar" ? "دبي" : "Dubai"} · ${selectedVerificationAuthority.authority}` : EMIRATES.find((emirate) => emirate.id === verificationEmirateId)?.[locale === "ar" ? "ar" : "label"]}</strong>
        <small>{verificationEmirateId === "dubai" ? `${offPlanSelected ? c.offPlanRoute : c.completedRoute} · ${c.mappedRoute}` : c.notMapped}</small>
        <p>{verificationEmirateId === "dubai" ? c.routeNext : c.notMappedText}</p>
      </aside>
    </div>

    <section id="developer-checklist" className="developer-checklist" aria-labelledby="developer-checklist-title">
      <header>
        <div><span className="eyebrow">{c.checklistEyebrow}</span><h3 id="developer-checklist-title">{c.checklistTitle}</h3></div>
        <p>{c.checklistIntro}</p>
      </header>

      <div className="developer-lifecycle-ribbon" aria-label={c.lifecycleCompact}>
        <span>{c.lifecycleCompact}</span>
        <ol>{stages.map((stage) => {
          const relationship = participation.find((item) => item.stageId === stage.id)?.relationshipLevel ?? "informed";
          return <li key={stage.id}><button type="button" onClick={() => selectLifecycleStage(stage.id)} data-level={relationship}><span>{String(stage.number).padStart(2, "0")}</span><b>{stage.name}</b></button></li>;
        })}</ol>
        <small>{c.lifecycleNote}</small>
      </div>

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
      <div className="dld-sequence-notes"><strong>{stageNote}</strong><p>{sequenceCaution}</p></div>
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
        <div className="dld-service-count" aria-live="polite"><span><b>{visibleServices.length}</b> {c.services}</span><span>{c.processMap}</span></div>
        <p className="dld-process-map-help">{c.processMapHelp}</p>
        <ul className="dld-flow-legend" aria-label={locale === "ar" ? "مفتاح علاقات الإجراءات" : "Process relationship legend"}>
          {phaseFlowOrder.map((relation) => <li key={relation} data-relation={relation}><i aria-hidden="true" /><span><b>{c.flowGroups[relation]}</b><small>{c.flowLegend[relation]}</small></span></li>)}
        </ul>
        <div className="dld-service-nodes">
          {visibleFlowGroups.map((group) => <section key={group.relation} className="dld-flow-group" data-relation={group.relation} aria-labelledby={`dld-flow-${phaseId}-${selectedSubphase.id}-${group.relation}`}>
            <header><i aria-hidden="true" /><span><b id={`dld-flow-${phaseId}-${selectedSubphase.id}-${group.relation}`}>{c.flowGroups[group.relation]}</b><small>{c.flowLegend[group.relation]}</small></span></header>
            <div>{group.services.map((service, relationIndex) => {
              const provider = DEVELOPER_SERVICE_GUIDANCE[service.id]?.provider ?? inferDevelopmentServiceProvider(service.title, selectedBranch.authority);
              return <button className="dld-service-node" key={`${selectedBranch.id}-${service.id}`} type="button" aria-pressed={selectedService?.id === service.id} onClick={() => setServiceId(service.id)}>
                <span>{flowCode(phaseId, group.relation, relationIndex)}</span>
                <div>
                  <b lang="en">{service.title}</b>
                  <small>{localize(provider, locale)}</small>
                  <em>{phaseId === "development" ? c.publishedRecord : c.guidedStep}</em>
                  <p><strong>{c.channel}</strong>{service.channel || c.notListed}<strong>{c.time}</strong>{service.time || c.notListed}</p>
                </div><i aria-hidden="true">→</i>
              </button>;
            })}</div>
          </section>)}
          {visibleServices.length === 0 ? <p className="dld-service-empty">{c.noResults}</p> : null}
        </div>
      </div>

      {selectedService ? <article className="dld-service-detail" aria-live="polite">
        <header>
          <span>{selectedFlowCode} · {c.flowGroups[selectedFlowRelation]} · {c.flowLegend[selectedFlowRelation]}</span>
          <h4 lang="en">{selectedService.title}</h4><p lang="en">{selectedService.description}</p>
        </header>
        <dl className="dld-guidance-fields">
          <DetailField label={c.provider} value={selectedProvider ? localize(selectedProvider, locale) : ""} fallback={c.notListed} />
          <DetailField label={c.beforeStart} value={selectedPrerequisite} fallback={c.notListed} />
          <DetailField label={c.expectedOutput} value={selectedOutput} fallback={c.notListed} />
        </dl>
        <dl lang="en">
          <DetailField label={c.channel} value={selectedService.channel} fallback={c.notListed} />
          <DetailField label={c.time} value={selectedService.time} fallback={c.notListed} />
          <DetailField label={c.fees} value={selectedService.fees} fallback={c.notListed} />
          <DetailField label={c.documents} value={selectedService.documents} fallback={c.notListed} />
        </dl>
        <div className="dld-detail-actions">
          {directApplicationUrl ? <a className="dld-primary-action" href={directApplicationUrl} target="_blank" rel="noreferrer">{selectedServiceGuidance?.applicationLabel ? localize(selectedServiceGuidance.applicationLabel, locale) : c.applyDirect} <span aria-hidden="true">↗</span></a> : null}
          <a href={selectedServiceGuidance?.evidenceUrl ?? sourceUrl} target="_blank" rel="noreferrer">{c.evidenceRecord} <span aria-hidden="true">↗</span></a>
        </div>
        {!directApplicationUrl ? <p className="dld-no-direct-link">{c.noDirectApply}</p> : null}
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
    </section>

    <section className="developer-registry-guide" aria-labelledby="developer-registry-title">
      <header>
        <span className="eyebrow">{c.registryEyebrow}</span>
        <h3 id="developer-registry-title">{c.registryTitle}</h3>
        <p>{c.registryIntro}</p>
      </header>
      {verificationEmirateId === "dubai" ? <div className="developer-final-verification">
        <div className="developer-final-route">
          <span>{c.selectedRoute}</span>
          <b>{selectedVerificationAuthority.authority}</b>
          <small>{offPlanSelected ? c.offPlanRoute : c.completedRoute}</small>
        </div>
        <p className="developer-final-count">{c.verificationReady}</p>
        <ol>
          {verificationCards.map((card, index) => {
            const services = card.gates.flatMap((gate) => gate.services);
            const firstGateWithService = card.gates.find((gate) => gate.services.length > 0);
            const reference = firstGateWithService ? {
              phase: firstGateWithService.phase,
              subphaseId: firstGateWithService.subphaseId,
              serviceId: firstGateWithService.services[0].id,
            } satisfies DeveloperServiceReference : undefined;
            const sourceUrl = card.gates[card.gates.length - 1].sourceUrl;
            return <li key={`${selectedVerificationAuthority.id}-final-${index}`}>
              <article>
                <span className="developer-final-number">{String(index + 1).padStart(2, "0")}</span>
                <RouteIcon kind={card.icon} />
                <header><small>{card.gates.map((gate) => gate.type).filter((value, gateIndex, values) => values.indexOf(value) === gateIndex).join(" · ")}</small><h5>{localize(card.copy.title, locale)}</h5></header>
                <p>{localize(card.copy.evidence, locale)}</p>
                <div><b>{services.length}</b><span>{c.authorityServices}</span></div>
                <footer>
                  {reference ? <button type="button" onClick={() => inspectReference(reference, selectedVerificationAuthority.id)} aria-label={`${c.inspectGate}: ${localize(card.copy.title, locale)}`}>↓</button> : null}
                  <a href={sourceUrl} target="_blank" rel="noreferrer">{c.openOfficialBranch} ↗</a>
                </footer>
              </article>
            </li>;
          })}
        </ol>
      </div> : <div className="developer-verification-unmapped" role="status">
        <span>{String(EMIRATES.findIndex((emirate) => emirate.id === verificationEmirateId) + 1).padStart(2, "0")}</span>
        <div><h4>{c.notMapped}</h4><p>{c.notMappedText}</p><a href={`${locale === "ar" ? "/ar" : ""}/stakeholders/developers/${verificationEmirateId}`}>{c.openEmiratePage} <span aria-hidden="true">→</span></a></div>
      </div>}
    </section>

    <footer className="dld-source-warning"><p>{c.sourceWarning}</p><small>{c.officialEnglish}</small></footer>
  </section>;
}
