import { getPersonas, getTerms, getInsightCategories, getStages } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import { IntelligenceHeroMap, type IntelligenceDomain } from "../components/IntelligenceHeroMap";
import { IntelligenceWorkspaces } from "../components/IntelligenceWorkspaces";
import { Page } from "../components/SiteShell";
import { authorities } from "../data/reos";
import { officialSourceById } from "../data/officialSources";

const pageCopy = {
  en: {
    eyebrow: "INTELLIGENCE",
    title: "intelligence.",
    intro: "What knowledge supports the UAE property ecosystem? Guides, regulations, processes, authority information, definitions and the knowledge graph — organised in one place instead of scattered across government portals, developer procedures and industry practice.",
    integrityLabel: "How to use this",
    integrityText: "These explainers describe how things generally work. They are not legal, financial or tax advice, and they do not replace the official position of any authority. Requirements differ by emirate and change over time — confirm your specific case before acting.",
    domains: {
      guides: { name: "Guides", short: "guides", status: "Published", description: "Role-based guidance that explains the sequence, documents and recurring mistakes across the UAE property journey." },
      regulations: { name: "Regulations", short: "regulations", status: "In development", description: "Regulation explainers in plain language, connected to their official sources." },
      processes: { name: "Processes", short: "processes", status: "7 stages mapped", description: "What happens at each stage, who participates, which documents matter and where jurisdiction changes the route." },
      authority: { name: "Authority Information", short: "authority information", status: "Official channels mapped", description: "Which authority governs a requirement, which channel handles it and what each submission needs." },
      glossary: { name: "Definitions & Glossary", short: "the glossary", status: (count: number) => `${count} terms defined`, description: "The recurring vocabulary of UAE property, defined once in plain language and linked wherever it appears." },
      graph: { name: "Knowledge Graph", short: "the knowledge graph", status: "Future REOS capability", description: "The connected model linking stages, stakeholders, documents, approvals and dependencies instead of treating them as separate lists." },
    },
    evidence: {
      authority: "Dubai Land Department",
      title: "Property Status Enquiry",
      claim: "The official DLD service publishes a property-status enquiry whose stated output includes property status and freehold classification.",
      scopeLimit: "It does not by itself verify title-deed validity, permitted development use, buyer eligibility or transaction readiness.",
      jurisdiction: "Dubai · Dubai Land Department registry route",
      route: "Registry evidence before the plot-specific planning-authority branch is confirmed.",
      status: "Official primary source",
      guidance: "Use the enquiry as one early evidence input. Confirm registered ownership, title validity and permitted use through the applicable official routes before commitment.",
    },
  },
  ar: {
    eyebrow: "المعرفة",
    title: "المعرفة.",
    intro: "ما المعرفة التي تدعم المنظومة العقارية في دولة الإمارات؟ أدلة إرشادية، وشروح تنظيمية، وإجراءات، ومعلومات عن الجهات المختصة، وتعريفات، ورسم معرفي — منظّمة في مكان واحد بدلًا من تشتتها بين المنصات الحكومية وإجراءات المطورين والممارسات المهنية.",
    integrityLabel: "كيفية استخدام هذه الصفحة",
    integrityText: "تشرح هذه المواد كيف تسير الأمور بصورة عامة. وهي ليست مشورة قانونية أو مالية أو ضريبية، ولا تحل محل الموقف الرسمي لأي جهة مختصة. تختلف المتطلبات بحسب الإمارة وتتغير بمرور الوقت — فتحقق من حالتك المحددة قبل اتخاذ أي إجراء.",
    domains: {
      guides: { name: "الأدلة الإرشادية", short: "الأدلة", status: "منشورة", description: "إرشادات بحسب الدور توضّح التسلسل والمستندات والأخطاء المتكررة عبر رحلة العقار في دولة الإمارات." },
      regulations: { name: "الشروح التنظيمية", short: "الأنظمة", status: "قيد التطوير", description: "شروح مبسطة للمتطلبات التنظيمية مرتبطة بمصادرها الرسمية." },
      processes: { name: "الإجراءات", short: "الإجراءات", status: "رُبطت المراحل السبع", description: "ما الذي يحدث في كل مرحلة، ومن يشارك، وأي مستندات تهم، وأين يغيّر الاختصاص مسار العمل." },
      authority: { name: "معلومات الجهات المختصة", short: "الجهات المختصة", status: "رُبطت القنوات الرسمية", description: "أي جهة تختص بالمتطلب، وأي قناة تتولى الإجراء، وما الذي يحتاجه كل تقديم." },
      glossary: { name: "التعريفات والمصطلحات", short: "المصطلحات", status: (count: number) => `تعريف ${count} مصطلحًا`, description: "المفردات المتكررة في عقارات الإمارات، معرّفة مرة واحدة بلغة واضحة ومرتبطة بكل موضع تظهر فيه." },
      graph: { name: "الرسم المعرفي", short: "الرسم المعرفي", status: "قدرة مستقبلية لـ REOS", description: "نموذج مترابط يصل المراحل وأصحاب المصلحة والمستندات والموافقات والاعتماديات بدل التعامل معها كقوائم منفصلة." },
    },
    evidence: {
      authority: "دائرة الأراضي والأملاك في دبي",
      title: "الاستعلام عن حالة عقار",
      claim: "تنشر الخدمة الرسمية لدائرة الأراضي والأملاك استعلامًا عن حالة العقار، وتشمل مخرجاته المعلنة حالة العقار وتصنيف التملك الحر.",
      scopeLimit: "لا تتحقق الخدمة بمفردها من صحة سند الملكية أو الاستخدام التطويري المسموح به أو أهلية المشتري أو جاهزية المعاملة.",
      jurisdiction: "دبي · مسار سجل دائرة الأراضي والأملاك",
      route: "دليل من السجل قبل تأكيد جهة التخطيط المختصة بالقطعة.",
      status: "مصدر رسمي أولي",
      guidance: "استخدم الاستعلام كأحد أدلة البداية. وتحقق من الملكية المسجلة وصحة السند والاستخدام المسموح به عبر المسارات الرسمية المختصة قبل الالتزام.",
    },
  },
} as const;

const authorityArabicById: Record<string, { name: string; jurisdiction: string; role: string; status: string }> = {
  dld: { name: "دائرة الأراضي والأملاك في دبي / مؤسسة التنظيم العقاري", jurisdiction: "دبي", role: "تسجيل العقارات وتنظيمها وخدمات محددة عبر دورة الحياة.", status: "تم التحقق" },
  dm: { name: "بلدية دبي", jurisdiction: "دبي — البر الرئيسي", role: "التخطيط وموافقات البناء وخدمات الإنجاز ضمن نطاق اختصاصها.", status: "تم التحقق" },
  dda: { name: "سلطة دبي للتطوير", jurisdiction: "مناطق تطوير محددة في دبي", role: "جهة التخطيط والتصاريح داخل المناطق الخاضعة لاختصاصها.", status: "تم التحقق" },
  trakhees: { name: "تراخيص / مؤسسة الموانئ والجمارك والمنطقة الحرة", jurisdiction: "نطاقات محددة تابعة للمؤسسة", role: "موافقات البيئة المبنية ضمن نطاقات الاختصاص المعمول بها.", status: "تم التحقق" },
  dewa: { name: "هيئة كهرباء ومياه دبي", jurisdiction: "دبي", role: "توصيلات الكهرباء والمياه وخدمات الانتقال وبعض شهادات عدم الممانعة التطويرية.", status: "تم التحقق" },
  dcd: { name: "الدفاع المدني بدبي", jurisdiction: "دبي", role: "موافقات السلامة من الحريق وحماية الأرواح ضمن إجراءات التطوير المعمول بها.", status: "تم التحقق" },
  rta: { name: "هيئة الطرق والمواصلات", jurisdiction: "دبي", role: "شهادات عدم الممانعة للنقل والبنية التحتية حيثما تنطبق.", status: "تم التحقق" },
  fta: { name: "الهيئة الاتحادية للضرائب", jurisdiction: "دولة الإمارات", role: "المتطلبات الضريبية الاتحادية؛ ويتوقف انطباقها على وقائع المعاملة والجهة.", status: "تم التحقق" },
  adrec: { name: "مركز أبوظبي العقاري / داري", jurisdiction: "أبوظبي", role: "تسجيل العقارات وخدماتها في إمارة أبوظبي.", status: "تم التحقق" },
  srerd: { name: "دائرة التسجيل العقاري في الشارقة", jurisdiction: "الشارقة", role: "خدمات التسجيل العقاري في إمارة الشارقة.", status: "تم التحقق" },
  rak: { name: "بلدية رأس الخيمة / مؤسسة التنظيم العقاري في رأس الخيمة", jurisdiction: "رأس الخيمة", role: "خدمات التسجيل والتنظيم العقاري للبيع على المخطط في رأس الخيمة.", status: "تم التحقق" },
};

export const metadata: Metadata = {
  title: "REOS Intelligence | Guides, Regulations, Processes & Glossary",
  description: "The knowledge layer behind the UAE property ecosystem: guides, regulation explainers, process references, authority information, definitions and the knowledge graph.",
};

/**
 * INTELLIGENCE — the six categories the site freezes to: Guides, Regulations,
 * Processes, Authority Information, Definitions & Glossary, Knowledge Graph.
 *
 * This indexes what already exists on the site rather than promising
 * long-form articles that have not been written. Where a category has no
 * published content yet, it says so — "Coming soon" — rather than inventing
 * copy to fill the box.
 */
export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  const t = pageCopy[locale];
  const personas = getPersonas(locale);
  const terms = getTerms(locale);
  const localizedStages = getStages(locale);
  const categories = getInsightCategories(locale);
  const regulation = categories.find((c) => c.id === "regulation");
  const authorityProcesses = categories.find((c) => c.id === "authority-processes");
  const intelligenceDomains: IntelligenceDomain[] = [
    {
      id: "guides", number: 1, ...t.domains.guides,
      href: L("/intelligence/guides"),
    },
    {
      id: "regulations", number: 2, ...t.domains.regulations,
      description: regulation?.copy ?? t.domains.regulations.description,
      href: L("/intelligence#evidence-pathway"),
    },
    {
      id: "processes", number: 3, ...t.domains.processes,
      href: L("/property-journey"),
    },
    {
      id: "authority-information", number: 4, ...t.domains.authority,
      description: authorityProcesses?.copy ?? t.domains.authority.description,
      href: L("/intelligence#authority-explorer"),
    },
    {
      id: "definitions-and-glossary", number: 5, name: t.domains.glossary.name, short: t.domains.glossary.short, status: t.domains.glossary.status(terms.length),
      description: t.domains.glossary.description,
      href: L("/intelligence/definitions-and-glossary"),
    },
    {
      id: "knowledge-graph", number: 6, ...t.domains.graph,
    },
  ];
  const guideOptions = personas.map((persona) => ({
    slug: persona.slug,
    name: persona.name,
    card: persona.card,
    stageCount: new Set(persona.steps.map((step) => step.stageId)).size,
    stepCount: persona.steps.length,
    href: L(`/intelligence/guides/${persona.slug}`),
  }));
  const authorityOptions = authorities.map(({ id, name, jurisdiction, role, status, sourceUrl }) => {
    const localized = locale === "ar" ? authorityArabicById[id] : undefined;
    return { id, name: localized?.name ?? name, jurisdiction: localized?.jurisdiction ?? jurisdiction, role: localized?.role ?? role, status: localized?.status ?? status, sourceUrl };
  });
  const termOptions = terms.map(({ id, term, short, jurisdictional }) => ({ id, term, short, jurisdictional: Boolean(jurisdictional) }));
  const evidenceSource = officialSourceById["dld.property-status"];
  const evidenceRecord = {
    authority: t.evidence.authority,
    title: t.evidence.title,
    sourceUrl: evidenceSource.url,
    claim: t.evidence.claim,
    scopeLimit: t.evidence.scopeLimit,
    jurisdiction: t.evidence.jurisdiction,
    route: t.evidence.route,
    stageId: "land-vision",
    stageName: localizedStages[0].name,
    stageHref: L("/property-journey/land-vision"),
    evidenceStatus: t.evidence.status,
    checkedOn: evidenceSource.checkedOn,
    reviewBy: evidenceSource.reviewBy,
    guidance: t.evidence.guidance,
  };
  const lifecycleStages = localizedStages.map((stage) => ({ id: stage.id, number: stage.number, name: stage.name, href: L(`/property-journey/${stage.id}`) }));

  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero inner-hero-no-photo intelligence-hero">
      <div className="intelligence-hero-copy">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>REOS<br /><em>{t.title}</em></h1>
        <p>{t.intro}</p>
      </div>
      <IntelligenceHeroMap domains={intelligenceDomains} locale={locale} />
    </section>

    <IntelligenceWorkspaces
      locale={locale}
      guides={guideOptions}
      authorities={authorityOptions}
      terms={termOptions}
      glossaryHref={L("/intelligence/definitions-and-glossary")}
      evidenceRecord={evidenceRecord}
      lifecycleStages={lifecycleStages}
    />

    <section className="integrity-strip">
      <b>{t.integrityLabel}</b>
      <p>{t.integrityText}</p>
    </section>

  </Page>;
}

export default function IntelligencePage() {
  return <View locale={DEFAULT_LOCALE} />;
}
