import type { LocalizedText } from "./developerJourneyGuide";

export type DeveloperServiceGuidance = {
  provider: LocalizedText;
  prerequisite: LocalizedText;
  output: LocalizedText;
  routeState: "guided" | "authority-check" | "parallel" | "closure";
  applicationUrl?: string;
  applicationLabel?: LocalizedText;
  evidenceUrl: string;
};

export const PRE_DEVELOPMENT_GUIDED_ORDER = [
  "trade-name-reservation",
  "submission-of-the-initial-approval-certificate",
  "issuing-trade-license-request",
  "dld-approval-for-the-trade-license-noc",
  "registering-the-developer-in-real-estate-developers-log",
  "registration-in-oqood-system-course",
] as const;

export const POST_DEVELOPMENT_GUIDED_ORDER = [
  "project-units-loading-final-loading",
  "settlement-of-the-escrow-account",
] as const;

const DLD_PRE_DEVELOPMENT = "https://dubailand.gov.ae/en/developer-book/main-phases/development-stage/#preDevelopment";
const DLD_POST_DEVELOPMENT = "https://dubailand.gov.ae/en/developer-book/main-phases/development-stage/#postRealEstateDevelopment";
const DET_SETUP = "https://app.invest.dubai.ae/business-setup-recommendation";
const DET_TRADE_NAME = "https://www.investindubai.gov.ae/en/business-setup/business-setup-services/request-to-book-a-trade-name";
const DET_TRADE_LICENCE = "https://www.investindubai.gov.ae/en/business-setup/business-setup-services/request-to-issue-a-trade-licence";
const DLD_TRAKHEESI = "https://trakheesi.dubailand.gov.ae";
const DLD_TRAINING = "https://dubailand.gov.ae/en/eservices/training";
const DLD_REGISTER_PROJECT = "https://backoffice.dubailand.gov.ae/en/eservices/register-project/";
const DLD_DEVELOPMENT = "https://dubailand.gov.ae/en/developer-book/main-phases/development-stage/#/";

export const DEVELOPER_SERVICE_GUIDANCE: Record<string, DeveloperServiceGuidance> = {
  "trade-name-reservation": {
    provider: { en: "Dubai Department of Economy and Tourism (DET; DED in the DLD record)", ar: "دائرة الاقتصاد والسياحة بدبي (DET؛ تظهر DED في سجل الدائرة)" },
    prerequisite: { en: "Choose the intended real-estate-development activity and legal form, then check that the proposed name is available and compatible with the activity.", ar: "حدد نشاط التطوير العقاري والشكل القانوني المقصود، ثم تحقق من توفر الاسم المقترح وملاءمته للنشاط." },
    output: { en: "Reserved trade name for the licensing file.", ar: "اسم تجاري محجوز لملف الترخيص." },
    routeState: "guided",
    applicationUrl: DET_TRADE_NAME,
    applicationLabel: { en: "Open DET trade-name service", ar: "افتح خدمة الاسم التجاري لدى DET" },
    evidenceUrl: DLD_PRE_DEVELOPMENT,
  },
  "submission-of-the-initial-approval-certificate": {
    provider: { en: "Dubai Department of Economy and Tourism (DET; DED in the DLD record)", ar: "دائرة الاقتصاد والسياحة بدبي (DET؛ تظهر DED في سجل الدائرة)" },
    prerequisite: { en: "Create the business-licensing file with the selected activity, legal form, owners and reserved name. Requirements vary by legal form and ownership route.", ar: "أنشئ ملف ترخيص الأعمال بالنشاط والشكل القانوني والملاك والاسم المحجوز. تختلف المتطلبات بحسب الشكل القانوني ومسار الملكية." },
    output: { en: "Initial approval allowing the applicant to complete other-government requirements and the final licensing file.", ar: "موافقة مبدئية تتيح استكمال متطلبات الجهات الحكومية الأخرى وملف الترخيص النهائي." },
    routeState: "guided",
    applicationUrl: DET_SETUP,
    applicationLabel: { en: "Start the DET business-setup route", ar: "ابدأ مسار تأسيس الأعمال لدى DET" },
    evidenceUrl: DLD_PRE_DEVELOPMENT,
  },
  "issuing-trade-license-request": {
    provider: { en: "Dubai Department of Economy and Tourism (DET; DED in the DLD record)", ar: "دائرة الاقتصاد والسياحة بدبي (DET؛ تظهر DED في سجل الدائرة)" },
    prerequisite: { en: "Complete the licensing file, premises/lease and constitutional documents, and any external approvals requested for the selected activity.", ar: "أكمل ملف الترخيص ومستندات المقر أو الإيجار والتأسيس وأي موافقات خارجية يطلبها النشاط المحدد." },
    output: { en: "Trade licence carrying the applicable real-estate-development activity.", ar: "رخصة تجارية تتضمن نشاط التطوير العقاري المنطبق." },
    routeState: "authority-check",
    applicationUrl: DET_TRADE_LICENCE,
    applicationLabel: { en: "Open DET trade-licence service", ar: "افتح خدمة الرخصة التجارية لدى DET" },
    evidenceUrl: DLD_PRE_DEVELOPMENT,
  },
  "dld-approval-for-the-trade-license-noc": {
    provider: { en: "Dubai Land Department / RERA", ar: "دائرة الأراضي والأملاك / مؤسسة التنظيم العقاري" },
    prerequisite: { en: "The DLD Developer Book describes this approval as required after licence issuance to practise real-estate-development activity. Confirm the current DET–DLD hand-off in the live licensing file.", ar: "يصف دليل المطور لدى الدائرة هذه الموافقة بأنها مطلوبة بعد إصدار الرخصة لمزاولة نشاط التطوير العقاري. أكد مسار التسليم الحالي بين DET والدائرة في ملف الترخيص الحي." },
    output: { en: "DLD/RERA approval to practise the real-estate-development activity.", ar: "موافقة الدائرة/مؤسسة التنظيم العقاري لمزاولة نشاط التطوير العقاري." },
    routeState: "authority-check",
    applicationUrl: DLD_TRAKHEESI,
    applicationLabel: { en: "Open Trakheesi", ar: "افتح نظام تراخيصي" },
    evidenceUrl: DLD_PRE_DEVELOPMENT,
  },
  "registering-the-developer-in-real-estate-developers-log": {
    provider: { en: "Dubai Land Department / RERA", ar: "دائرة الأراضي والأملاك / مؤسسة التنظيم العقاري" },
    prerequisite: { en: "Hold the applicable trade licence and assemble the developer-registration application, contact-person form and Dubai Chambers membership evidence listed by DLD.", ar: "احمل الرخصة التجارية المنطبقة وجهز طلب تسجيل المطور ونموذج مسؤول الاتصال ودليل عضوية غرف دبي المدرجة لدى الدائرة." },
    output: { en: "Developer recorded in the Real Estate Developers Register and eligible to proceed toward project registration, subject to project requirements.", ar: "قيد المطور في سجل المطورين العقاريين وإمكانية الانتقال إلى تسجيل المشروع، مع مراعاة متطلبات المشروع." },
    routeState: "guided",
    evidenceUrl: DLD_PRE_DEVELOPMENT,
  },
  "registration-in-oqood-system-course": {
    provider: { en: "Dubai Land Department training / Oqood", ar: "تدريب دائرة الأراضي والأملاك / عقود" },
    prerequisite: { en: "Nominate authorised users and prepare the company licence, authorisation and user identity/visa documents required by the current DLD training page.", ar: "رشح المستخدمين المفوضين وجهز رخصة الشركة والتفويض ومستندات هوية وإقامة المستخدم المطلوبة في صفحة تدريب الدائرة الحالية." },
    output: { en: "Course completion evidence supporting Oqood user access and credentials.", ar: "دليل إكمال الدورة الداعم لوصول المستخدم إلى عقود وبيانات الدخول." },
    routeState: "guided",
    applicationUrl: DLD_TRAINING,
    applicationLabel: { en: "Open DLD training", ar: "افتح تدريب الدائرة" },
    evidenceUrl: DLD_TRAINING,
  },
  "request-for-registration-of-a-real-estate-project-and-opening-of-an-escrow-account": {
    provider: { en: "Dubai Land Department / RERA", ar: "دائرة الأراضي والأملاك / مؤسسة التنظيم العقاري" },
    prerequisite: { en: "Confirm the land and project file, the applicable development licence and developer registration, the consultant and project documents, and the escrow-bank arrangements required by the live DLD service.", ar: "أكد ملف الأرض والمشروع ورخصة التطوير المنطبقة وتسجيل المطور والاستشاري ومستندات المشروع وترتيبات بنك الضمان المطلوبة في خدمة الدائرة الحية." },
    output: { en: "Registered real-estate project, project escrow-account record and electronic project approval certificate, subject to DLD approval.", ar: "مشروع عقاري مسجل وسجل حساب ضمان للمشروع وشهادة موافقة إلكترونية للمشروع، رهناً بموافقة الدائرة." },
    routeState: "parallel",
    applicationUrl: DLD_REGISTER_PROJECT,
    applicationLabel: { en: "Open DLD Register Project service", ar: "افتح خدمة تسجيل المشروع لدى الدائرة" },
    evidenceUrl: DLD_REGISTER_PROJECT,
  },
  "loading-project-units-initial-loading": {
    provider: { en: "Dubai Land Department / Property Survey System", ar: "دائرة الأراضي والأملاك / نظام المسح العقاري" },
    prerequisite: { en: "Use the authorised survey route after the project and off-plan sale gates are confirmed; prepare the approved project and unit-area records required by the live system.", ar: "استخدم مسار المساح المعتمد بعد تأكيد بوابات المشروع والبيع على الخارطة، وجهز سجلات المشروع ومساحات الوحدات المعتمدة المطلوبة في النظام الحي." },
    output: { en: "Initial unit areas and details loaded for the off-plan contracting route.", ar: "تحميل المساحات والتفاصيل الأولية للوحدات لمسار التعاقد على الخارطة." },
    routeState: "parallel",
    evidenceUrl: DLD_DEVELOPMENT,
  },
  "project-units-loading-final-loading": {
    provider: { en: "Dubai Land Department / Property Survey System", ar: "دائرة الأراضي والأملاك / نظام المسح العقاري" },
    prerequisite: { en: "Obtain project completion evidence and the applicable final survey/unit-area records through the authorised surveying route.", ar: "احصل على دليل إنجاز المشروع وسجلات المسح النهائي ومساحات الوحدات المنطبقة عبر مسار المساح المعتمد." },
    output: { en: "Final unit areas and details loaded so title deeds can be issued for the completed units.", ar: "تحميل المساحات والتفاصيل النهائية للوحدات بما يتيح إصدار سندات الملكية للوحدات المنجزة." },
    routeState: "closure",
    evidenceUrl: DLD_POST_DEVELOPMENT,
  },
  "settlement-of-the-escrow-account": {
    provider: { en: "Dubai Land Department / RERA", ar: "دائرة الأراضي والأملاك / مؤسسة التنظيم العقاري" },
    prerequisite: { en: "Complete the project close-out conditions and obtain the owner-association clearance listed in the DLD record; confirm any case-specific escrow-agent requirements.", ar: "أكمل شروط إقفال المشروع واحصل على مخالصة جمعية الملاك المدرجة في سجل الدائرة، وأكد متطلبات أمين حساب الضمان الخاصة بالحالة." },
    output: { en: "Escrow account settled and remaining deposits released in accordance with the approved close-out.", ar: "تسوية حساب الضمان والإفراج عن الودائع المتبقية وفق الإقفال المعتمد." },
    routeState: "closure",
    evidenceUrl: DLD_POST_DEVELOPMENT,
  },
};

const provider = (en: string, ar = en): LocalizedText => ({ en, ar });

export function inferDevelopmentServiceProvider(title: string, branchAuthority: string): LocalizedText {
  const value = title.toLocaleLowerCase();
  if (value.includes("master developer")) return provider("Master developer", "المطور الرئيسي");
  if (value.includes("tourism") || value.includes("dtcm")) return provider("Dubai Department of Economy and Tourism (DET)", "دائرة الاقتصاد والسياحة بدبي (DET)");
  if (value.includes("etisalat")) return provider("e& (Etisalat)", "e& (اتصالات)");
  if (/\bdu\b/.test(value) || value.includes("integrated telecommunications")) return provider("du", "دو");
  if (value.includes("civil defense") || value.includes("hassantuk")) return provider("Dubai Civil Defence", "الدفاع المدني بدبي");
  if (value.includes("ambulance")) return provider("Dubai Corporation for Ambulance Services", "مؤسسة دبي لخدمات الإسعاف");
  if (value.includes("roads and transport") || value.includes("rta")) return provider("Roads and Transport Authority (RTA)", "هيئة الطرق والمواصلات (RTA)");
  if (value.includes("aviation")) return provider("Dubai Civil Aviation Authority", "هيئة دبي للطيران المدني");
  if (value.includes("police")) return provider("Dubai Police", "شرطة دبي");
  if (value.includes("dewa") || value.includes("ma'lem")) return provider("Dubai Electricity and Water Authority (DEWA)", "هيئة كهرباء ومياه دبي (DEWA)");
  return provider(branchAuthority);
}
