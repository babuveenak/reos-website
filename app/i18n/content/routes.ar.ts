import type { Route } from "../../data/routes";

/** Arabic for the twelve routes. Order and slugs stay in the English source. */
export const routesAr: Record<string, Partial<Route>> = {
  buying: {
    title: "أنا أشتري عقارًا أو أملك عقارًا", ctaLabel: "رحلة المشتري والمالك",
    sub: "من أول بحث إلى استلام المفاتيح — ما الذي تتحقق منه، وما الذي توقّعه، وما الذي يحمي أموالك على الطريق.",
    journey: ["الاستكشاف", "التحقق", "الحجز", "التعاقد", "التمويل", "التسجيل", "التسليم", "التملك"],
  },
  developing: {
    title: "أنا أطوّر مشروعًا", ctaLabel: "رحلة المطوّر",
    sub: "كل موافقة وتعيين وارتباط وتسليم بين شراء القطعة وتسليم آخر وحدة.",
    journey: ["الأرض", "تسجيل المشروع", "موافقات التصميم", "حساب الضمان", "الإنشاء", "الإنجاز", "سند الملكية", "التسليم"],
  },
  investing: {
    title: "أنا أستثمر في العقارات", ctaLabel: "رحلة المستثمر",
    sub: "اعرف أين يدخل رأس المال، وما الضوابط التي تحميه، وأين تتركّز المخاطر، وكيف يعمل الخروج فعليًا.",
    journey: ["الفرز", "الهيكلة", "الالتزام", "المتابعة", "الخروج"],
  },
  selling: {
    title: "أنا أبيع أو أتوسّط في العقارات", ctaLabel: "رحلة الوسيط والمبيعات",
    sub: "من العرض إلى الإغلاق — ما الذي يلزمك ترخيص لفعله، وما الذي يجب الإفصاح عنه، وأين تتعثّر الصفقات فعلًا.",
    journey: ["العرض", "المطابقة", "العرض السعري", "التعاقد", "النقل", "العمولة"],
  },
  financing: {
    title: "أنا أموّل عقارات", ctaLabel: "رحلة البنك والممول",
    sub: "أين تدخل الأموال، وما الذي يضبطها، وكيف يُوثَّق التقدّم، وما الأدلة التي تدعم كل صرف.",
    journey: ["التقييم", "الاعتماد", "الضمان", "الصرف", "المتابعة", "إبراء الذمة"],
  },
  "design-engineering": {
    title: "أنا أصمّم أو أهندس مشروعًا", ctaLabel: "رحلة الاستشاري والمهندس",
    sub: "من التعيين إلى شهادة الإنجاز — ما الذي عليك إنتاجه، ومن يعتمده، وما الذي تغطيه مسؤوليتك.",
    journey: ["التعيين", "التصور", "التقديم للجهة", "الإشراف", "الاعتماد"],
  },
  building: {
    title: "أنا أبني أو أورّد", ctaLabel: "رحلة المقاول والمورّد",
    sub: "ما الذي يجب أن يكون قائمًا قبل التجهيز، وما الذي عليك إثباته أثناء الإنشاء، وما الذي يتطلبه الإنجاز فعلًا.",
    journey: ["المناقصة", "الترسية", "التجهيز", "البناء", "الاختبار", "التسليم"],
  },
  "legal-compliance": {
    title: "أنا أقدّم خدمات قانونية أو امتثال أو تأمين", ctaLabel: "رحلة الشؤون القانونية والامتثال",
    sub: "تعيينك وتقديماتك ومسؤوليتك، والأطراف التي يعتمد عملها على عملك.",
    journey: ["التعيين", "الاستشارة", "التوثيق", "الامتثال", "المنازعات"],
  },
  managing: {
    title: "أنا أدير عقارات أو مرافق", ctaLabel: "رحلة مدير العقار والمرافق",
    sub: "استلام المبنى وتشغيله جيدًا وتمويله بشكل صحيح وحفظ سجله لمن يأتي بعدك.",
    journey: ["التسليم", "الاستقبال", "التشغيل", "التمويل", "التقارير"],
  },
  utilities: {
    title: "أنا أوفّر مرافق أو بنية تحتية", ctaLabel: "رحلة المرافق والبنية التحتية",
    sub: "التوصيل والسعة والتشغيل التجريبي — ما الذي يحتاجه المشروع منك، ومتى يحتاجه.",
    journey: ["السعة", "مراجعة التصميم", "التوصيل", "التشغيل التجريبي", "التفعيل"],
  },
  regulators: {
    title: "أنا جهة مختصة أو منظِّم", ctaLabel: "عرض الجهة المختصة والمنظِّم",
    sub: "أين تحكم الموافقات مسار الرحلة، وما الأدلة التي تدعم كل قرار، وكيف تعود الحالة إلى الأطراف.",
    journey: ["التقديم", "المراجعة", "القرار", "التسجيل", "الرقابة"],
  },
  "specialist-services": {
    title: "أنا أقدّم خدمات متخصصة أو استشارية", ctaLabel: "رحلة الخدمات المتخصصة",
    sub: "التقييم والبيانات والتقنية والاستدامة وخدمات الإقامة — أين يدخل عملك في الرحلة ومن يعتمد عليه.",
    journey: ["التكليف", "التحليل", "التقرير", "الاعتماد عليه", "المراجعة"],
  },
};

export const orientationAr = {
  title: "لست متأكدًا أي مسار ينطبق عليك؟",
  sub: "ابدأ بمسار التعريف — يشرح كيف يتكوّن السوق الإماراتي، وما الذي تعنيه المصطلحات الشائعة، وأي مسار يناسبك، قبل أن يطلب منك اختيار دور.",
  ctaLabel: "ابدأ بالتعريف",
};

export const routeUiAr = {
  eyebrow: "اختر مسارك",
  h1: "اثنا عشر مدخلًا.",
  h1em: "رحلة واحدة مترابطة.",
  lede: "كل مشارك في القطاع العقاري الإماراتي يرى شريحة مختلفة من الرحلة نفسها. اختر المسار الذي يصفك.",
  coreLabel: "المسارات الأساسية",
  specialistLabel: "المسارات المتخصصة والمؤسسية",
  more: "5 إضافية",
  pending: "هذه الرحلة قيد النشر",
  pendingCopy: "المسار جزء من النموذج، لكن محتواه لم يُوثَّق ويُراجع بعد. ننشره حين يكون مسندًا بمصادره، لا قبل ذلك.",
  availableNow: "المتاح الآن",
  availableCopy: "يمكنك الآن استخدام ملف صاحب المصلحة المرتبط والمراحل المنشورة لفهم موضع هذا المسار، بينما يستمر توثيق الدليل الكامل ومراجعته.",
  stakeholderProfile: "ملف صاحب المصلحة",
  relevantStages: "المراحل ذات الصلة",
  openProfile: "فتح الملف",
  seeJourney: "عرض رحلة العقار كاملة",
  tryAnotherGuide: "جرّب دليلًا آخر",
};

export const routeUiEn = {
  eyebrow: "CHOOSE YOUR ROUTE",
  h1: "Twelve ways in.",
  h1em: "One connected journey.",
  lede: "Every participant in UAE real estate sees a different slice of the same journey. Pick the one that describes you.",
  coreLabel: "CORE ROUTES",
  specialistLabel: "SPECIALIST & INSTITUTIONAL ROUTES",
  more: "5 MORE",
  pending: "This journey is being published",
  pendingCopy: "The route is part of the model, but its content is still being written and verified. We publish it when it is sourced, not before.",
  availableNow: "AVAILABLE NOW",
  availableCopy: "Use the connected stakeholder profile and published journey stages to understand where this route sits while the full guide is sourced and reviewed.",
  stakeholderProfile: "Stakeholder profile",
  relevantStages: "Relevant journey stages",
  openProfile: "Open profile",
  seeJourney: "See the full property journey",
  tryAnotherGuide: "Try another guide",
};
