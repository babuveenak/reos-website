import type { Locale } from "../i18n/config";

export type PublicDocumentKey = "privacy" | "cookies" | "terms";

type PublicDocumentSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  source?: { label: string; href: string };
};

export type PublicDocument = {
  eyebrow: string;
  title: string;
  description: string;
  updatedLabel: string;
  updated: string;
  contentsLabel: string;
  backLabel: string;
  sections: PublicDocumentSection[];
};

const english: Record<PublicDocumentKey, PublicDocument> = {
  privacy: {
    eyebrow: "PUBLIC WEBSITE NOTICE",
    title: "Privacy Policy",
    description: "How RESO handles personal information when you visit the REOS website, make an enquiry or use an available website feature.",
    updatedLabel: "Last updated",
    updated: "25 August 2026",
    contentsLabel: "On this page",
    backLabel: "Back to home",
    sections: [
      {
        id: "scope",
        title: "1. Scope and operator",
        paragraphs: [
          "RESO (\"we\", \"us\" or \"our\") operates the public REOS website at reos-website.vercel.app. This policy covers information handled through this website. A separately contracted or authenticated product may have additional notices that apply to that service.",
          "REOS is an independent knowledge and navigation layer. It is not a government authority and does not issue approvals or replace official systems or professional advice.",
        ],
      },
      {
        id: "information",
        title: "2. Information we may collect",
        paragraphs: ["The information involved depends on how you use the website."],
        bullets: [
          "Information you submit, such as your name, work email, organisation, title, location, role, product interest, timeline, intended outcome and message.",
          "Correspondence you send to the published support or enquiry address.",
          "Identity details supplied by an authentication service when you use an authenticated feature, where that feature is available.",
          "Technical and security information generated when the site is delivered, such as an IP address, browser or device type, requested page, timestamp and diagnostic or security events.",
          "Preference data stored in your browser, as described in the Cookie Policy.",
        ],
      },
      {
        id: "use",
        title: "3. How we use information",
        bullets: [
          "To deliver the website and the features you request.",
          "To respond to enquiries, support requests and evaluation requests.",
          "To protect the website, investigate errors and prevent misuse.",
          "To understand service demand and improve content or usability using available operational information.",
          "To meet legal, regulatory, record-keeping or dispute-resolution obligations where applicable.",
        ],
        paragraphs: ["We process personal information only for a relevant purpose and on a lawful basis available under applicable law."],
      },
      {
        id: "sharing",
        title: "4. When information may be shared",
        paragraphs: [
          "We may share information with service providers that support hosting, security, enquiry delivery, email or other website operations. They should receive only the information needed for their role and handle it under appropriate obligations.",
          "We may also disclose information where required by law, to protect rights or safety, or in connection with a corporate transaction. We do not state or imply that personal information is sold for advertising.",
        ],
      },
      {
        id: "retention-security",
        title: "5. Retention and security",
        paragraphs: [
          "We aim to keep personal information only for as long as it is reasonably needed for the purpose for which it was collected, including follow-up, security, legal and record-keeping needs. Retention periods can differ by record and service.",
          "We use proportionate organisational and technical safeguards, but no internet transmission or storage system can be guaranteed to be completely secure.",
        ],
      },
      {
        id: "transfers",
        title: "6. International processing",
        paragraphs: ["Website and communication providers may process information in countries other than the country where you are located. Where applicable law requires it, we will use an appropriate basis or safeguard for that processing."],
      },
      {
        id: "rights",
        title: "7. Your choices and rights",
        paragraphs: [
          "Depending on the law that applies, you may be able to ask about personal information we hold, request access or correction, request deletion or restriction, object to certain processing, withdraw consent where consent is the basis, or raise a concern with the relevant regulator. These rights can be subject to legal conditions and exceptions.",
          "To make a request, use the contact details below. We may need to verify your identity and clarify the scope of your request before responding.",
        ],
        source: {
          label: "Read Federal Decree-Law No. 45 of 2021 on the official UAE legislation portal",
          href: "https://uaelegislation.gov.ae/en/legislations/1972",
        },
      },
      {
        id: "children",
        title: "8. Children",
        paragraphs: ["The public website is intended for adults and professional audiences. We do not knowingly ask children to provide personal information through the website."],
      },
      {
        id: "changes-contact",
        title: "9. Changes and contact",
        paragraphs: [
          "We may update this policy as the website, service providers or legal requirements change. The date at the top identifies the latest published version.",
          "Questions or privacy requests can be sent to the contact email published by REOS. Please do not send sensitive or confidential property records through ordinary email unless a secure channel has been agreed.",
        ],
      },
    ],
  },
  cookies: {
    eyebrow: "PUBLIC WEBSITE NOTICE",
    title: "Cookie Policy",
    description: "The cookies and similar browser-storage technologies used by the public REOS website, and the choices available to you.",
    updatedLabel: "Last updated",
    updated: "25 August 2026",
    contentsLabel: "On this page",
    backLabel: "Back to home",
    sections: [
      {
        id: "meaning",
        title: "1. What cookies and similar technologies are",
        paragraphs: ["Cookies are small text records that a website can place in a browser. Similar technologies include local storage and session storage, which can remember a setting or interface state on the device you are using."],
      },
      {
        id: "current-use",
        title: "2. Current use on the public website",
        paragraphs: [
          "The current REOS public-site code does not intentionally set advertising or behavioural-analytics cookies.",
          "The site uses browser storage to remember accessibility and interface choices. These records stay in your browser and are not used by the site code to build an advertising profile.",
        ],
      },
      {
        id: "storage",
        title: "3. Browser-storage records",
        bullets: [
          "reos-theme — remembers whether you selected the light or dark theme.",
          "reos-scale — remembers your selected text-size setting.",
          "reos-language — remembers the language selected before moving between the English and Arabic routes.",
          "reos-explorer-mode — temporarily remembers the active ecosystem explorer view for the browser session.",
        ],
      },
      {
        id: "essential-services",
        title: "4. Hosting, security and third-party services",
        paragraphs: [
          "The hosting or security platform may use strictly necessary cookies or comparable request data to deliver the site, balance traffic, prevent abuse or protect a restricted preview. These controls are operated at the delivery layer and may change when hosting or security settings change.",
          "Pages may load resources supplied by third parties, such as web fonts. A third-party service handles information under its own terms and privacy notice. If RESO later introduces non-essential analytics, advertising or embedded services that use cookies, this policy and any consent controls will be updated before those tools are treated as active.",
        ],
      },
      {
        id: "choices",
        title: "5. Your controls",
        paragraphs: [
          "You can clear local storage, session storage and cookies through your browser settings. Blocking or clearing browser storage may reset the theme, language, text-size or explorer-view preferences, but the main public content should remain available.",
          "Browser controls differ by provider. Use your browser's privacy or site-data settings to review or remove stored records for this domain.",
        ],
      },
      {
        id: "changes-contact",
        title: "6. Changes and contact",
        paragraphs: ["We may update this policy when website functionality or delivery services change. Questions about the site's use of cookies or browser storage can be sent to the contact email published by REOS."],
      },
    ],
  },
  terms: {
    eyebrow: "PUBLIC WEBSITE TERMS",
    title: "Terms of Use",
    description: "The terms that apply when you access or use the public REOS website and its informational content.",
    updatedLabel: "Last updated",
    updated: "25 August 2026",
    contentsLabel: "On this page",
    backLabel: "Back to home",
    sections: [
      {
        id: "acceptance",
        title: "1. Acceptance and operator",
        paragraphs: ["RESO operates the public REOS website at reos-website.vercel.app. By accessing or using the website, you agree to these Terms of Use. If you do not agree, please stop using the website."],
      },
      {
        id: "information",
        title: "2. Information, not official advice",
        paragraphs: [
          "The website is an educational knowledge and navigation resource for understanding the UAE property journey. Its content is general information, not legal, financial, investment, tax, engineering, planning or other regulated advice.",
          "REOS does not issue approvals, make official decisions, execute government transactions or replace any authority, regulated provider, licensed professional or official system. Requirements differ by emirate, free zone, property, transaction and date. Verify any action with the relevant authority or qualified adviser.",
        ],
      },
      {
        id: "status-accuracy",
        title: "3. Content status and accuracy",
        paragraphs: [
          "Pages may distinguish between Live, Pilot, Early Access, Coming Soon and illustrative or concept experiences. Those labels describe the stated maturity of website content or a REOS capability; they are not government approvals, certifications or guarantees of availability.",
          "We aim to make content clear and useful, but laws, fees, procedures, authority guidance and service availability can change. We do not promise that every page is complete, current or suitable for a particular decision.",
        ],
      },
      {
        id: "permitted-use",
        title: "4. Permitted use",
        paragraphs: ["You may access and use the website for lawful personal or internal business purposes. You must not misuse the website, interfere with its operation, attempt unauthorised access, submit unlawful or harmful material, misrepresent website content as an official decision, or use automated means in a way that materially burdens the service."],
      },
      {
        id: "intellectual-property",
        title: "5. Intellectual property",
        paragraphs: ["Unless a page states otherwise, the website design, original text, diagrams, taxonomies and other REOS materials are owned by or licensed to RESO. These Terms do not transfer ownership. Limited quotations and links are permitted where lawful and properly attributed; broader copying, publication, resale or commercial reuse requires prior permission."],
      },
      {
        id: "third-parties",
        title: "6. Third-party and official links",
        paragraphs: ["The website may link to government authorities, regulated providers or other third parties for context. Those services are independent, may change without notice and apply their own terms and privacy practices. A link is not an endorsement or a representation that RESO controls the linked content."],
      },
      {
        id: "availability",
        title: "7. Availability and liability",
        paragraphs: [
          "The public website is provided on an as-available basis. Access may be changed, suspended or withdrawn for maintenance, security or product reasons.",
          "To the extent permitted by applicable law, RESO is not responsible for loss arising solely from reliance on general website information instead of verification with the relevant authority or qualified professional. Nothing in these Terms excludes a responsibility that cannot lawfully be excluded.",
        ],
      },
      {
        id: "privacy",
        title: "8. Privacy",
        paragraphs: ["The Privacy Policy and Cookie Policy explain how the public website handles personal information and browser storage. They form part of the website notices available through the footer."],
      },
      {
        id: "law-changes-contact",
        title: "9. Changes, applicable law and contact",
        paragraphs: [
          "We may update these Terms as the website or applicable requirements change. The date at the top identifies the latest published version. Continued use after publication means the updated Terms apply from that point.",
          "These Terms are governed by the applicable laws of the United Arab Emirates. Any mandatory jurisdiction or consumer protection rule continues to apply. Questions can be sent to the contact email published by REOS.",
        ],
      },
    ],
  },
};

const arabic: Record<PublicDocumentKey, PublicDocument> = {
  privacy: {
    eyebrow: "إشعار الموقع العام",
    title: "سياسة الخصوصية",
    description: "كيف تتعامل RESO مع المعلومات الشخصية عند زيارة موقع REOS أو إرسال استفسار أو استخدام إحدى خصائص الموقع المتاحة.",
    updatedLabel: "آخر تحديث",
    updated: "25 أغسطس 2026",
    contentsLabel: "في هذه الصفحة",
    backLabel: "العودة إلى الرئيسية",
    sections: [
      { id: "scope", title: "1. النطاق والجهة المشغّلة", paragraphs: ["تدير RESO (ويُشار إليها بـ«نحن») موقع REOS العام على reos-website.vercel.app. تغطي هذه السياسة المعلومات التي تتم معالجتها عبر هذا الموقع. وقد تخضع المنتجات المتعاقد عليها أو الخصائص الموثّقة لإشعارات إضافية خاصة بها.", "REOS طبقة مستقلة للمعرفة والتوجيه، وليست جهة حكومية، ولا تصدر موافقات أو تحل محل الأنظمة الرسمية أو المشورة المهنية."] },
      { id: "information", title: "2. المعلومات التي قد نجمعها", paragraphs: ["تختلف المعلومات بحسب طريقة استخدامك للموقع."], bullets: ["المعلومات التي ترسلها، مثل الاسم والبريد الإلكتروني للعمل والمؤسسة والمسمى الوظيفي والموقع والدور والمنتج محل الاهتمام والجدول الزمني والنتيجة المطلوبة والرسالة.", "المراسلات التي ترسلها إلى عنوان الدعم أو الاستفسارات المنشور.", "بيانات الهوية التي توفرها خدمة المصادقة عند استخدام خاصية موثّقة، إن كانت متاحة.", "المعلومات الفنية والأمنية الناتجة عن تقديم الموقع، مثل عنوان بروتوكول الإنترنت ونوع المتصفح أو الجهاز والصفحة المطلوبة والتوقيت وأحداث التشخيص أو الحماية.", "بيانات التفضيلات المحفوظة في المتصفح كما هو موضح في سياسة ملفات الارتباط."] },
      { id: "use", title: "3. كيف نستخدم المعلومات", bullets: ["تقديم الموقع والخصائص التي تطلبها.", "الرد على الاستفسارات وطلبات الدعم أو التقييم.", "حماية الموقع والتحقق من الأخطاء ومنع إساءة الاستخدام.", "فهم الطلب على الخدمة وتحسين المحتوى أو سهولة الاستخدام بالاستناد إلى المعلومات التشغيلية المتاحة.", "الوفاء بالالتزامات القانونية أو التنظيمية أو متطلبات حفظ السجلات وتسوية النزاعات عند انطباقها."], paragraphs: ["لا نعالج المعلومات الشخصية إلا لغرض ذي صلة وعلى أساس قانوني متاح بموجب التشريعات المنطبقة."] },
      { id: "sharing", title: "4. متى يمكن مشاركة المعلومات", paragraphs: ["قد نشارك المعلومات مع مزودي الخدمات الداعمين للاستضافة والحماية وتسليم الاستفسارات والبريد الإلكتروني وعمليات الموقع الأخرى. وينبغي ألا يتلقوا سوى المعلومات اللازمة لأداء دورهم وأن يعالجوها وفق التزامات مناسبة.", "قد نفصح عن المعلومات أيضاً إذا ألزمنا القانون بذلك، أو لحماية الحقوق أو السلامة، أو في سياق معاملة مؤسسية. ولا نبيع المعلومات الشخصية لأغراض الإعلان."] },
      { id: "retention-security", title: "5. الاحتفاظ والأمن", paragraphs: ["نسعى إلى الاحتفاظ بالمعلومات الشخصية للمدة المعقولة اللازمة للغرض الذي جُمعت من أجله، بما في ذلك المتابعة والأمن والمتطلبات القانونية وحفظ السجلات. وقد تختلف المدة حسب نوع السجل والخدمة.", "نستخدم تدابير تنظيمية وفنية متناسبة، إلا أنه لا يمكن ضمان الأمان الكامل لأي وسيلة نقل أو تخزين عبر الإنترنت."] },
      { id: "transfers", title: "6. المعالجة الدولية", paragraphs: ["قد يعالج مزودو خدمات الموقع والاتصالات المعلومات في دول غير الدولة التي توجد فيها. وحيثما يشترط القانون ذلك، سنستخدم أساساً أو ضمانة مناسبة لهذه المعالجة."] },
      { id: "rights", title: "7. خياراتك وحقوقك", paragraphs: ["بحسب القانون المنطبق، قد يحق لك الاستفسار عن معلوماتك أو طلب الوصول إليها أو تصحيحها أو حذفها أو تقييد معالجتها، أو الاعتراض على معالجة معينة، أو سحب الموافقة عندما تكون هي الأساس، أو تقديم شكوى إلى الجهة التنظيمية المختصة. وقد تخضع هذه الحقوق لشروط واستثناءات قانونية.", "لإرسال طلب، استخدم بيانات الاتصال أدناه. وقد نحتاج إلى التحقق من هويتك وتحديد نطاق الطلب قبل الرد."], source: { label: "اطّلع على المرسوم بقانون اتحادي رقم 45 لسنة 2021 عبر بوابة تشريعات الإمارات الرسمية", href: "https://uaelegislation.gov.ae/ar/legislations/1972" } },
      { id: "children", title: "8. الأطفال", paragraphs: ["الموقع العام موجّه للبالغين والجمهور المهني. ولا نطلب عن علم من الأطفال تقديم معلومات شخصية عبر الموقع."] },
      { id: "changes-contact", title: "9. التغييرات والتواصل", paragraphs: ["قد نحدّث هذه السياسة عند تغيّر الموقع أو مزودي الخدمة أو المتطلبات القانونية. ويبيّن التاريخ أعلى الصفحة أحدث نسخة منشورة.", "يمكن إرسال أسئلة الخصوصية أو الطلبات إلى بريد التواصل المنشور لدى REOS. ويُرجى عدم إرسال سجلات عقارية حساسة أو سرية عبر البريد الإلكتروني العادي ما لم يتم الاتفاق على قناة آمنة."] },
    ],
  },
  cookies: {
    eyebrow: "إشعار الموقع العام",
    title: "سياسة ملفات الارتباط",
    description: "ملفات الارتباط وتقنيات التخزين المشابهة التي يستخدمها موقع REOS العام والخيارات المتاحة لك.",
    updatedLabel: "آخر تحديث",
    updated: "25 أغسطس 2026",
    contentsLabel: "في هذه الصفحة",
    backLabel: "العودة إلى الرئيسية",
    sections: [
      { id: "meaning", title: "1. ما هي ملفات الارتباط والتقنيات المشابهة", paragraphs: ["ملفات الارتباط سجلات نصية صغيرة يمكن للموقع وضعها في المتصفح. وتشمل التقنيات المشابهة التخزين المحلي وتخزين الجلسة لتذكر إعداد أو حالة واجهة على الجهاز المستخدم."] },
      { id: "current-use", title: "2. الاستخدام الحالي في الموقع العام", paragraphs: ["لا تضبط الشفرة الحالية لموقع REOS العام عمداً ملفات ارتباط للإعلانات أو التحليلات السلوكية.", "يستخدم الموقع تخزين المتصفح لتذكر خيارات الوصول والواجهة. وتبقى هذه السجلات في متصفحك ولا تستخدمها شفرة الموقع لإنشاء ملف إعلاني."] },
      { id: "storage", title: "3. سجلات تخزين المتصفح", bullets: ["reos-theme — يتذكر اختيار الوضع الفاتح أو الداكن.", "reos-scale — يتذكر حجم النص المختار.", "reos-language — يتذكر اللغة المختارة قبل الانتقال بين المسارات الإنجليزية والعربية.", "reos-explorer-mode — يتذكر مؤقتاً عرض مستكشف المنظومة النشط خلال جلسة المتصفح."] },
      { id: "essential-services", title: "4. الاستضافة والحماية وخدمات الأطراف الأخرى", paragraphs: ["قد تستخدم منصة الاستضافة أو الحماية ملفات ارتباط ضرورية أو بيانات طلب مماثلة لتقديم الموقع أو توزيع الحركة أو منع إساءة الاستخدام أو حماية معاينة مقيّدة. وتعمل هذه الضوابط على طبقة التقديم وقد تتغير عند تغيير إعدادات الاستضافة أو الحماية.", "قد تحمّل الصفحات موارد من أطراف أخرى مثل خطوط الويب. ويعالج الطرف الآخر المعلومات وفق شروطه وإشعار الخصوصية الخاص به. وإذا أضافت RESO مستقبلاً أدوات تحليل أو إعلان أو خدمات مضمّنة غير ضرورية تستخدم ملفات الارتباط، فسيتم تحديث هذه السياسة وأي ضوابط للموافقة قبل اعتبار تلك الأدوات فعّالة."] },
      { id: "choices", title: "5. أدوات التحكم المتاحة لك", paragraphs: ["يمكنك مسح التخزين المحلي وتخزين الجلسة وملفات الارتباط من إعدادات المتصفح. وقد يؤدي حظر التخزين أو مسحه إلى إعادة ضبط تفضيلات المظهر واللغة وحجم النص وعرض المستكشف، بينما ينبغي أن يبقى المحتوى العام الرئيسي متاحاً.", "تختلف أدوات التحكم بحسب المتصفح. استخدم إعدادات الخصوصية أو بيانات المواقع لمراجعة السجلات المخزنة لهذا النطاق أو حذفها."] },
      { id: "changes-contact", title: "6. التغييرات والتواصل", paragraphs: ["قد نحدّث هذه السياسة عند تغيّر وظائف الموقع أو خدمات التقديم. ويمكن إرسال الأسئلة حول ملفات الارتباط أو تخزين المتصفح إلى بريد التواصل المنشور لدى REOS."] },
    ],
  },
  terms: {
    eyebrow: "شروط الموقع العام",
    title: "شروط الاستخدام",
    description: "الشروط المطبقة عند الدخول إلى موقع REOS العام أو استخدام محتواه المعلوماتي.",
    updatedLabel: "آخر تحديث",
    updated: "25 أغسطس 2026",
    contentsLabel: "في هذه الصفحة",
    backLabel: "العودة إلى الرئيسية",
    sections: [
      { id: "acceptance", title: "1. القبول والجهة المشغّلة", paragraphs: ["تدير RESO موقع REOS العام على reos-website.vercel.app. ويعني دخولك إلى الموقع أو استخدامه موافقتك على هذه الشروط. إذا لم توافق عليها، يُرجى التوقف عن استخدام الموقع."] },
      { id: "information", title: "2. معلومات وليست مشورة رسمية", paragraphs: ["الموقع مورد تعليمي للمعرفة والتوجيه لفهم رحلة العقار في دولة الإمارات. ومحتواه معلومات عامة وليس مشورة قانونية أو مالية أو استثمارية أو ضريبية أو هندسية أو تخطيطية أو غيرها من المشورة المنظّمة.", "لا تصدر REOS موافقات أو قرارات رسمية، ولا تنفذ معاملات حكومية، ولا تحل محل أي جهة مختصة أو مزود خدمة منظّم أو مهني مرخص أو نظام رسمي. تختلف المتطلبات بحسب الإمارة والمنطقة الحرة والعقار والمعاملة والتاريخ. تحقّق من أي إجراء لدى الجهة المعنية أو المستشار المؤهل."] },
      { id: "status-accuracy", title: "3. حالة المحتوى ودقته", paragraphs: ["قد تميّز الصفحات بين الحالات: متاح، تجريبي، وصول مبكر، قريباً، وتجربة توضيحية أو تصورية. تصف هذه التسميات درجة نضج محتوى الموقع أو قدرة REOS، وليست موافقات حكومية أو شهادات أو ضماناً للتوافر.", "نسعى إلى تقديم محتوى واضح ومفيد، لكن القوانين والرسوم والإجراءات وإرشادات الجهات وتوافر الخدمات قد تتغير. ولا نضمن اكتمال كل صفحة أو حداثتها أو ملاءمتها لقرار بعينه."] },
      { id: "permitted-use", title: "4. الاستخدام المسموح", paragraphs: ["يمكنك استخدام الموقع لأغراض شخصية أو أعمال داخلية مشروعة. ولا يجوز إساءة استخدام الموقع أو تعطيل عمله أو محاولة الدخول غير المصرح به أو إرسال مواد غير قانونية أو ضارة أو تقديم محتواه باعتباره قراراً رسمياً أو استخدام وسائل آلية تفرض عبئاً كبيراً على الخدمة."] },
      { id: "intellectual-property", title: "5. الملكية الفكرية", paragraphs: ["ما لم تنص الصفحة على خلاف ذلك، فإن تصميم الموقع والنصوص الأصلية والرسوم والتصنيفات ومواد REOS الأخرى مملوكة أو مرخصة لـRESO. ولا تنقل هذه الشروط الملكية. ويجوز الاقتباس المحدود والربط حيث يسمح القانون مع الإسناد المناسب، أما النسخ أو النشر أو إعادة البيع أو الاستخدام التجاري الأوسع فيتطلب إذناً مسبقاً."] },
      { id: "third-parties", title: "6. روابط الجهات الرسمية والأطراف الأخرى", paragraphs: ["قد يربط الموقع بجهات حكومية أو مزودي خدمات منظّمة أو أطراف أخرى للسياق. هذه الخدمات مستقلة وقد تتغير دون إشعار وتطبق شروطها وممارسات الخصوصية الخاصة بها. ولا يعني الرابط تأييداً أو أن RESO تتحكم في المحتوى المرتبط."] },
      { id: "availability", title: "7. التوافر والمسؤولية", paragraphs: ["يُقدّم الموقع العام بحسب توافره، وقد يتغير الوصول إليه أو يُعلّق أو يُسحب لأسباب الصيانة أو الأمن أو المنتج.", "في الحدود التي يسمح بها القانون، لا تتحمل RESO المسؤولية عن خسارة تنشأ فقط من الاعتماد على معلومات الموقع العامة بدلاً من التحقق لدى الجهة المختصة أو المهني المؤهل. ولا تستبعد هذه الشروط أي مسؤولية لا يجوز استبعادها قانوناً."] },
      { id: "privacy", title: "8. الخصوصية", paragraphs: ["توضح سياسة الخصوصية وسياسة ملفات الارتباط كيفية تعامل الموقع العام مع المعلومات الشخصية وتخزين المتصفح، وهما من إشعارات الموقع المتاحة عبر التذييل."] },
      { id: "law-changes-contact", title: "9. التغييرات والقانون والتواصل", paragraphs: ["قد نحدّث هذه الشروط عند تغيّر الموقع أو المتطلبات المنطبقة. ويبيّن التاريخ أعلى الصفحة أحدث نسخة منشورة. ويعني استمرار الاستخدام بعد النشر تطبيق الشروط المحدّثة من ذلك الوقت.", "تخضع هذه الشروط للقوانين المنطبقة في دولة الإمارات العربية المتحدة، مع استمرار سريان أي قواعد إلزامية للاختصاص أو حماية المستهلك. ويمكن إرسال الأسئلة إلى بريد التواصل المنشور لدى REOS."] },
    ],
  },
};

export function getPublicDocument(locale: Locale, key: PublicDocumentKey): PublicDocument {
  return locale === "ar" ? arabic[key] : english[key];
}
