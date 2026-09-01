import { brokerJourneyRoutes, type BrokerEvidenceStatus, type BrokerJourneyEmirate, type BrokerJourneyRouteId, type BrokerJourneyStep, type BrokerLocalizedText } from "./brokerAgencyJourney";

export type BrokerOperationalTask = BrokerJourneyStep & {
  code: string;
  channel: BrokerLocalizedText;
  boundary: BrokerLocalizedText;
  next: BrokerLocalizedText;
  fee: BrokerLocalizedText;
  time: BrokerLocalizedText;
  validity: BrokerLocalizedText;
};

export type BrokerOperationalStage = {
  id: string;
  number: number;
  title: BrokerLocalizedText;
  summary: BrokerLocalizedText;
  tasks: BrokerOperationalTask[];
};

type TaskOverride = Partial<Omit<BrokerOperationalTask, keyof BrokerJourneyStep | "code">> & Partial<BrokerJourneyStep>;

const t = (en: string, ar: string): BrokerLocalizedText => ({ en, ar });
const confirmFee = t("No fixed amount is published for this task on the cited service page — confirm in the live application.", "لا تنشر صفحة الخدمة المشار إليها مبلغاً ثابتاً لهذه المهمة — تحقق من الطلب الحي.");
const confirmTime = t("No stand-alone service duration is published — confirm after the authority accepts a complete application.", "لا توجد مدة مستقلة منشورة للخدمة — تحقق بعد قبول الجهة للطلب المكتمل.");
const routeValidity = t("This is a dependency, not a separate licence. Keep its evidence current for the next controlled step.", "هذه متطلب اعتمادي وليست رخصة مستقلة. حافظ على حداثة أدلتها للخطوة المنظمة التالية.");

function makeTask(base: BrokerJourneyStep, code: string, overrides: TaskOverride = {}): BrokerOperationalTask {
  return {
    ...base,
    ...overrides,
    id: `${base.id}-${code.toLowerCase()}`,
    code,
    number: Number(code.replace(/\D/g, "")) || base.number,
    title: overrides.title ?? base.title,
    summary: overrides.summary ?? base.summary,
    authority: overrides.authority ?? base.authority,
    requirements: overrides.requirements ?? base.requirements,
    output: overrides.output ?? base.output,
    sourceIds: overrides.sourceIds ?? base.sourceIds,
    evidence: (overrides.evidence ?? base.evidence) as BrokerEvidenceStatus,
    stageIds: overrides.stageIds ?? base.stageIds,
    fee: overrides.fee ?? base.fee ?? confirmFee,
    time: overrides.time ?? base.time ?? confirmTime,
    validity: overrides.validity ?? base.validity ?? routeValidity,
    channel: overrides.channel ?? t("The cited authority's current digital service or the licensed firm's authorised account.", "الخدمة الرقمية الحالية للجهة المشار إليها أو حساب الشركة المرخصة المخول."),
    boundary: overrides.boundary ?? t("Completing this task does not authorise the next regulated activity until its separate approval is issued.", "إكمال هذه المهمة لا يخول النشاط المنظم التالي حتى تصدر موافقته المنفصلة."),
    next: overrides.next ?? t("Continue to the next task shown in this stage.", "انتقل إلى المهمة التالية المعروضة في هذه المرحلة."),
  };
}

function stage(id: string, number: number, title: BrokerLocalizedText, summary: BrokerLocalizedText, tasks: BrokerOperationalTask[]): BrokerOperationalStage {
  return { id, number, title, summary, tasks };
}

function dubaiIndividualStages(): BrokerOperationalStage[] {
  const route = brokerJourneyRoutes.dubai.individual;
  const [routeStep, qualify, card, operate, transact, renew] = route.steps;
  return [
    stage("agent-orientation", 1, t("Orientation & eligibility", "التوجيه والأهلية"), t("Choose the correct professional and company-linked route before paying for qualifications.", "اختر المسار المهني والمرتبط بالشركة قبل دفع تكاليف التأهيل."), [
      makeTask(routeStep, "A-01", {
        title: t("Confirm eligibility and residency route", "أكد الأهلية ومسار الإقامة"),
        requirements: [t("Emirates ID or planned residency status", "الهوية الإماراتية أو حالة الإقامة المخططة"), t("Intended broker activity and work arrangement", "نشاط الوسيط وترتيب العمل المقصود")],
        output: t("A documented eligibility route before spending on training", "مسار أهلية موثق قبل الإنفاق على التدريب"),
        boundary: t("Residency or eligibility review alone does not permit brokerage practice.", "مراجعة الإقامة أو الأهلية وحدها لا تسمح بممارسة الوساطة."),
        next: t("Identify the licensed brokerage that will hold the company-linked application.", "حدد شركة الوساطة المرخصة التي ستقدم الطلب المرتبط بالشركة."),
      }),
      makeTask(routeStep, "A-02", {
        title: t("Confirm a licensed brokerage association", "أكد الارتباط بشركة وساطة مرخصة"),
        authority: t("Licensed brokerage · DLD / RERA", "شركة وساطة مرخصة · دائرة الأراضي / ريرا"),
        requirements: [t("Brokerage trade-licence and office verification", "التحقق من رخصة ومكتب شركة الوساطة"), t("Proposed employment or association evidence", "إثبات العمل أو الارتباط المقترح")],
        output: t("A verified company route for the professional card", "مسار شركة موثق للبطاقة المهنية"),
        boundary: t("Association with a company does not replace qualification, examination or the practice card.", "الارتباط بشركة لا يحل محل التأهيل أو الاختبار أو بطاقة الممارسة."),
        next: t("Prepare the conduct, training and examination evidence.", "جهز أدلة حسن السيرة والتدريب والاختبار."),
        sourceIds: ["dld-card", "dld-directory", "dld-faq"],
      }),
    ]),
    stage("agent-qualification", 2, t("Training, exam & conduct", "التدريب والاختبار وحسن السيرة"), t("Complete each item required for the current broker-card application.", "أكمل كل عنصر مطلوب لطلب بطاقة الوسيط الحالي."), [
      makeTask(qualify, "A-03", {
        title: t("Obtain the required good-conduct certificate", "احصل على شهادة حسن السيرة المطلوبة"),
        authority: t("Dubai Police · DLD / RERA as receiving authority", "شرطة دبي · دائرة الأراضي / ريرا كجهة مستلمة"),
        requirements: [t("Current identity and the Dubai Police application inputs", "الهوية الحالية ومدخلات طلب شرطة دبي"), t("Certificate suitable for the professional-card submission", "شهادة مناسبة لتقديم البطاقة المهنية")],
        output: t("Current good-conduct evidence", "إثبات حسن سيرة حديث"),
        fee: confirmFee,
        time: confirmTime,
        channel: t("Dubai Police digital service; upload the accepted certificate through Trakheesi with the card request.", "خدمة شرطة دبي الرقمية؛ ارفع الشهادة المقبولة عبر تراخيص مع طلب البطاقة."),
        boundary: t("The certificate is supporting evidence; it is not a broker qualification or card.", "الشهادة دليل داعم وليست تأهيلاً أو بطاقة وسيط."),
        next: t("Complete the current recognised broker learning requirement.", "أكمل متطلب تعلم الوسيط المعترف به حالياً."),
      }),
      makeTask(qualify, "A-04", {
        title: t("Complete the recognised broker learning requirement", "أكمل متطلب تعلم الوسيط المعترف به"),
        authority: t("DLD / RERA recognised education route", "مسار التعليم المعترف به من دائرة الأراضي / ريرا"),
        requirements: [t("Identity and registration inputs requested by the current provider", "الهوية ومدخلات التسجيل التي يطلبها المزود الحالي"), t("Attendance and completion evidence", "إثبات الحضور والإكمال")],
        output: t("Training or learning evidence for the examination/card route", "إثبات تدريب أو تعلم لمسار الاختبار والبطاقة"),
        fee: confirmFee,
        time: confirmTime,
        channel: t("Use the provider or booking channel linked from the current authority route.", "استخدم قناة المزود أو الحجز المرتبطة بمسار الجهة الحالي."),
        boundary: t("Course completion does not itself authorise practice.", "إكمال الدورة لا يخول الممارسة بحد ذاته."),
        next: t("Book and pass the applicable annual broker examination.", "احجز واجتز اختبار الوسيط السنوي المنطبق."),
      }),
      makeTask(qualify, "A-05", {
        title: t("Pass the applicable broker examination", "اجتز اختبار الوسيط المنطبق"),
        requirements: [t("Accepted learning evidence where required", "إثبات التعلم المقبول عند الطلب"), t("Identity and exam booking", "الهوية وحجز الاختبار")],
        output: t("Broker examination result ready for the card request", "نتيجة اختبار وسيط جاهزة لطلب البطاقة"),
        boundary: t("A pass result is an input to the card; it is not permission to practise.", "نتيجة النجاح مدخل للبطاقة وليست إذناً بالممارسة."),
        next: t("Submit the complete professional-card application through the licensed company.", "قدم طلب البطاقة المهنية المكتمل عبر الشركة المرخصة."),
      }),
    ]),
    stage("agent-registration", 3, t("Registration & card", "التسجيل والبطاقة"), t("Convert accepted evidence into the electronic authority to practise.", "حوّل الأدلة المقبولة إلى صلاحية إلكترونية للممارسة."), [
      makeTask(card, "A-06", {
        title: t("Apply for the electronic practice card", "قدم طلب بطاقة الممارسة الإلكترونية"),
        channel: t("DLD website · Trakheesi account of the licensed company", "موقع دائرة الأراضي · حساب تراخيص للشركة المرخصة"),
        boundary: t("The card authorises the named person only and remains linked to the company trade licence.", "تخول البطاقة الشخص المسمى فقط وتظل مرتبطة بالرخصة التجارية للشركة."),
        next: t("Complete the brokerage's controlled operational onboarding.", "أكمل التهيئة التشغيلية المنضبطة لدى شركة الوساطة."),
      }),
      makeTask(card, "A-07", {
        title: t("Complete brokerage operational onboarding", "أكمل التهيئة التشغيلية لدى شركة الوساطة"),
        authority: t("Licensed brokerage · responsible manager", "شركة الوساطة المرخصة · المدير المسؤول"),
        requirements: [t("Issued e-card and verified identity", "البطاقة الإلكترونية الصادرة والهوية الموثقة"), t("Company policies, systems and authorised role", "سياسات الشركة وأنظمتها والدور المخول")],
        output: t("Controlled system access and recorded operating boundaries", "وصول منضبط للأنظمة وحدود تشغيل موثقة"),
        fee: t("No separate government fee is published for internal company onboarding.", "لا توجد رسوم حكومية منفصلة منشورة للتهيئة الداخلية للشركة."),
        time: t("Company-controlled; no government service duration applies.", "تتحكم بها الشركة؛ ولا تنطبق مدة خدمة حكومية."),
        validity: t("Valid while the professional and company authorities remain current.", "صالحة ما دامت صلاحيات المهني والشركة سارية."),
        channel: t("The licensed brokerage's approved internal process and systems.", "الإجراءات والأنظمة الداخلية المعتمدة لدى شركة الوساطة المرخصة."),
        boundary: t("Internal access cannot extend the scope of the issued professional card.", "لا يمكن للوصول الداخلي توسيع نطاق البطاقة المهنية الصادرة."),
        next: t("Accept inventory only through a traceable client or developer instruction.", "اقبل المخزون فقط عبر تكليف قابل للتتبع من عميل أو مطور."),
      }),
    ]),
    stage("agent-operate", 4, t("Inventory, advertising & transaction", "المخزون والإعلان والمعاملة"), t("Turn authority into a compliant listing and a controlled transaction.", "حوّل الصلاحية إلى قائمة متوافقة ومعاملة منضبطة."), [
      makeTask(operate, "A-08", {
        title: t("Acquire authorised inventory", "احصل على مخزون مخول"),
        requirements: [t("Written owner/client instruction or developer nomination", "تكليف مكتوب من المالك/العميل أو ترشيح المطور"), t("Current property and party evidence", "إثباتات حالية للعقار والطرف")],
        output: t("Traceable authority to market the property", "صلاحية قابلة للتتبع لتسويق العقار"),
        fee: t("No fixed government fee for the instruction itself; related permits may be chargeable.", "لا توجد رسوم حكومية ثابتة للتكليف نفسه؛ وقد تفرض رسوم على التصاريح المرتبطة."),
        time: t("Client/company controlled; verify documents before publication.", "يتحكم بها العميل/الشركة؛ تحقق من المستندات قبل النشر."),
        boundary: t("An instruction is not an advertising permit and does not validate the property by itself.", "التكليف ليس تصريح إعلان ولا يثبت صحة العقار بمفرده."),
        next: t("Obtain the permit matching the advertising channel.", "احصل على التصريح المطابق لقناة الإعلان."),
      }),
      makeTask(operate, "A-09", {
        title: t("Obtain the advertising permit and Madmoun QR", "احصل على تصريح الإعلان ورمز مضمون"),
        channel: t("DLD website · Trakheesi", "موقع دائرة الأراضي · تراخيص"),
        boundary: t("The permit covers its approved property, channel and content; it does not authorise unrelated inventory.", "يغطي التصريح العقار والقناة والمحتوى المعتمد؛ ولا يخول مخزوناً غير مرتبط."),
        next: t("Publish only the approved content, then manage enquiries through the brokerage record.", "انشر المحتوى المعتمد فقط ثم أدر الاستفسارات عبر سجل شركة الوساطة."),
      }),
      makeTask(transact, "A-10", {
        title: t("Conduct the controlled transaction", "نفذ المعاملة المنضبطة"),
        requirements: [t("Current client authority, disclosures and property evidence", "تفويض العميل والإفصاحات وإثباتات العقار الحالية"), t("Recorded offers, counterparties and official hand-off route", "العروض والأطراف ومسار التسليم الرسمي الموثق")],
        output: t("Auditable negotiation and transaction record", "سجل تفاوض ومعاملة قابل للتدقيق"),
        fee: t("No single brokerage transaction fee applies to every case; official transfer and service fees depend on the transaction.", "لا تنطبق رسوم وساطة واحدة على كل حالة؛ وتعتمد رسوم النقل والخدمة الرسمية على المعاملة."),
        time: t("Transaction-dependent; no universal official completion duration is published.", "تعتمد على المعاملة؛ ولا توجد مدة إتمام رسمية موحدة منشورة."),
        validity: t("Authority and evidence must remain current through completion.", "يجب أن تظل الصلاحية والأدلة سارية حتى الإتمام."),
        boundary: t("The broker facilitates within the written mandate; official registration decisions remain with the competent authority.", "يسهل الوسيط ضمن التفويض المكتوب؛ وتبقى قرارات التسجيل الرسمية لدى الجهة المختصة."),
        next: t("Settle and record commission through the licensed brokerage.", "سوِّ وسجل العمولة عبر شركة الوساطة المرخصة."),
      }),
      makeTask(transact, "A-11", {
        title: t("Record commission through the brokerage", "سجل العمولة عبر شركة الوساطة"),
        requirements: [t("Written commission basis and co-broker terms", "أساس عمولة مكتوب وشروط الوسطاء المشاركين"), t("Completed transaction and accounting evidence", "إثباتات إتمام المعاملة والمحاسبة")],
        output: t("Traceable commission and settlement record", "سجل عمولة وتسوية قابل للتتبع"),
        fee: t("Commission is contractual; no universal percentage is imposed by this roadmap.", "العمولة تعاقدية؛ ولا تفرض هذه الخارطة نسبة موحدة."),
        time: t("According to the written agreement and completed transaction controls.", "وفق الاتفاق المكتوب وضوابط المعاملة المكتملة."),
        boundary: t("The agent acts through the licensed brokerage and within the written commission agreement.", "يعمل الوسيط عبر شركة الوساطة المرخصة وضمن اتفاق العمولة المكتوب."),
        next: t("Maintain the card and company association for the next instruction.", "حافظ على البطاقة وارتباط الشركة للتكليف التالي."),
      }),
    ]),
    stage("agent-renew", 5, t("Renewal & mobility", "التجديد والتنقل"), t("Keep the professional authority aligned when renewing, changing office or exiting.", "حافظ على توافق الصلاحية المهنية عند التجديد أو تغيير المكتب أو الخروج."), [
      makeTask(renew, "A-12", {
        title: t("Renew, change brokerage or close the association", "جدّد أو غيّر شركة الوساطة أو أنهِ الارتباط"),
        channel: t("DLD / RERA through the current licensed company and live Trakheesi route.", "دائرة الأراضي / ريرا عبر الشركة المرخصة الحالية ومسار تراخيص الحي."),
        time: confirmTime,
        boundary: t("Do not continue practising where the card or linked company authority is expired, transferred or closed.", "لا تستمر بالممارسة إذا انتهت أو نُقلت أو أُغلقت البطاقة أو صلاحية الشركة المرتبطة."),
        next: t("Return to Stage 1 whenever the professional or company route materially changes.", "ارجع إلى المرحلة الأولى عند أي تغيير جوهري في المسار المهني أو مسار الشركة."),
      }),
    ]),
  ];
}

function dubaiAgencyStages(): BrokerOperationalStage[] {
  const route = brokerJourneyRoutes.dubai.agency;
  const [activity, form, register, controls, market, transact, renew] = route.steps;
  const agencyTask = (base: BrokerJourneyStep, code: string, title: BrokerLocalizedText, next: BrokerLocalizedText, extra: TaskOverride = {}) => makeTask(base, code, { title, next, ...extra });
  return [
    stage("agency-define", 1, t("Define & structure", "التعريف والهيكلة"), t("Choose the regulated activity, responsible people and legal route.", "اختر النشاط المنظم والأشخاص المسؤولين والمسار القانوني."), [
      agencyTask(activity, "B-00", t("Define the exact brokerage activities", "حدد أنشطة الوساطة بدقة"), t("Confirm owner, manager and signatory eligibility.", "أكد أهلية المالك والمدير والمفوض."), { boundary: t("Do not use a broad commercial label as a substitute for the activity listed by DLD / RERA.", "لا تستخدم وصفاً تجارياً عاماً بديلاً للنشاط المدرج لدى دائرة الأراضي / ريرا.") }),
      agencyTask(activity, "B-01", t("Confirm owners, manager and signatories", "أكد الملاك والمدير والمفوضين"), t("Choose the jurisdiction and legal form.", "اختر الاختصاص والشكل القانوني."), { requirements: [t("Ownership, manager and authorised-signatory evidence", "إثباتات الملكية والمدير والمفوضين"), t("Activity-specific eligibility conditions", "شروط الأهلية الخاصة بالنشاط")], boundary: t("Eligibility can vary by activity and licensing authority; confirm before formation.", "قد تختلف الأهلية حسب النشاط وجهة الترخيص؛ تحقق قبل التأسيس.") }),
      agencyTask(activity, "B-02", t("Choose jurisdiction and legal form", "اختر الاختصاص والشكل القانوني"), t("Reserve the trade name and obtain initial approval.", "احجز الاسم التجاري واحصل على الموافقة المبدئية."), { authority: t("DET or applicable free-zone licensing authority · DLD / RERA", "دائرة الاقتصاد والسياحة أو جهة المنطقة الحرة المنطبقة · دائرة الأراضي / ريرا"), requirements: [t("Mainland/free-zone decision and proposed legal form", "قرار البر الرئيسي/المنطقة الحرة والشكل القانوني المقترح"), t("Activity and ownership structure", "هيكل النشاط والملكية")], output: t("A confirmed formation route and licensing authority", "مسار تأسيس وجهة ترخيص مؤكدان"), boundary: t("A free-zone route may require a separate DLD NOC; it must not inherit mainland assumptions.", "قد يتطلب مسار المنطقة الحرة عدم ممانعة منفصلة من الدائرة؛ ولا يجوز أن يرث افتراضات البر الرئيسي.") }),
    ]),
    stage("agency-license", 2, t("Licences & premises", "الرخص والمقر"), t("Build the entity, premises and real-estate activity authority in dependency order.", "أنشئ الكيان والمقر وصلاحية النشاط العقاري بترتيب الاعتماد."), [
      agencyTask(form, "B-03", t("Reserve the trade name and obtain initial approval", "احجز الاسم التجاري واحصل على الموافقة المبدئية"), t("Prepare the constitutional documents.", "جهز المستندات التأسيسية."), { authority: t("DET or applicable licensing authority", "دائرة الاقتصاد والسياحة أو جهة الترخيص المنطبقة"), fee: confirmFee, time: confirmTime, channel: t("The live business-licensing portal for the selected jurisdiction.", "بوابة ترخيص الأعمال الحية للاختصاص المختار."), boundary: t("Initial approval is not the final commercial licence or RERA activity authority.", "الموافقة المبدئية ليست الرخصة التجارية النهائية أو صلاحية نشاط ريرا.") }),
      agencyTask(form, "B-04", t("Complete constitutional documents", "أكمل المستندات التأسيسية"), t("Secure compliant premises and tenancy evidence.", "أمّن مقراً متوافقاً وإثبات الإيجار."), { authority: t("Licensing authority · notary or approved digital formation channel", "جهة الترخيص · الكاتب العدل أو قناة التأسيس الرقمية المعتمدة"), fee: confirmFee, time: confirmTime, requirements: [t("Approved legal form, owners and signatories", "الشكل القانوني والملاك والمفوضون المعتمدون"), t("MOA or other formation documents required by the live route", "عقد التأسيس أو مستندات التأسيس التي يطلبها المسار الحي")], output: t("Executed formation documents", "مستندات تأسيس منفذة"), boundary: t("Document execution does not replace premises, licensing or DLD approval.", "تنفيذ المستندات لا يحل محل المقر أو الترخيص أو موافقة الدائرة.") }),
      agencyTask(form, "B-05", t("Secure the registered office and tenancy record", "أمّن المكتب المسجل وسجل الإيجار"), t("Complete the commercial licence and DLD / RERA activity route.", "أكمل الرخصة التجارية ومسار نشاط دائرة الأراضي / ريرا."), { authority: t("Landlord · Ejari / competent tenancy authority · licensing authority", "المالك · إيجاري / جهة الإيجار المختصة · جهة الترخيص"), fee: t("Premises and tenancy-registration costs vary; confirm the signed lease and live registration charge.", "تختلف تكاليف المقر وتسجيل الإيجار؛ تحقق من عقد الإيجار الموقع ورسوم التسجيل الحية."), time: confirmTime, requirements: [t("Suitable premises and signed tenancy evidence", "مقر مناسب وإثبات إيجار موقع"), t("Address and office details accepted by the licensing route", "العنوان وتفاصيل المكتب المقبولة في مسار الترخيص")], output: t("Registered premises evidence for licensing and office registration", "إثبات مقر مسجل للترخيص وتسجيل المكتب"), boundary: t("A tenancy record does not authorise the brokerage activity.", "سجل الإيجار لا يخول نشاط الوساطة.") }),
      agencyTask(form, "B-06", t("Issue the commercial licence and register the real-estate activity", "أصدر الرخصة التجارية وسجل النشاط العقاري"), t("Open the employer, immigration and labour records needed for staff.", "افتح سجلات جهة العمل والهجرة والعمل اللازمة للموظفين."), { channel: t("DET / selected licensing portal, then DLD website · Trakheesi where applicable.", "بوابة دائرة الاقتصاد والسياحة / الترخيص المختارة، ثم موقع دائرة الأراضي · تراخيص عند الانطباق."), boundary: t("The company licence does not authorise uncarded practitioners or unpermitted advertising.", "رخصة الشركة لا تخول ممارسين بلا بطاقات أو إعلانات بلا تصاريح.") }),
    ]),
    stage("agency-people", 3, t("People & authority", "الأشخاص والصلاحية"), t("Create the employer records and card every person who will perform controlled work.", "أنشئ سجلات جهة العمل وأصدر بطاقة لكل شخص سيؤدي عملاً منظماً."), [
      agencyTask(register, "B-07", t("Establish immigration, labour and employment files", "أنشئ ملفات الهجرة والعمل والتوظيف"), t("Qualify and card each practising person.", "أهّل وأصدر بطاقة لكل ممارس."), { authority: t("GDRFA / ICP · MOHRE or applicable free-zone employment authority", "الإدارة العامة للإقامة / الهيئة الاتحادية · وزارة الموارد البشرية أو جهة توظيف المنطقة الحرة"), fee: confirmFee, time: confirmTime, requirements: [t("Issued entity licence and establishment inputs", "رخصة الكيان الصادرة ومدخلات سجل المنشأة"), t("Workforce and authorised-signatory plan", "خطة القوى العاملة والمفوضين")], output: t("Employer records ready for compliant staffing", "سجلات جهة عمل جاهزة للتوظيف المتوافق"), boundary: t("Employer registration does not create a real-estate professional card.", "تسجيل جهة العمل لا ينشئ بطاقة مهنية عقارية.") }),
      agencyTask(register, "B-08", t("Qualify and card every practising person", "أهّل وأصدر بطاقة لكل ممارس"), t("Build the federal compliance and operating controls.", "أنشئ ضوابط الامتثال والتشغيل الاتحادية."), { boundary: t("Only the named cardholder may perform the card-controlled activity; the company licence alone is insufficient.", "فقط حامل البطاقة المسمى يمكنه أداء النشاط الخاضع للبطاقة؛ ورخصة الشركة وحدها غير كافية.") }),
    ]),
    stage("agency-controls", 4, t("Compliance & controls", "الامتثال والضوابط"), t("Make AML, tax, banking and operating evidence ready before scaling.", "جهز أدلة مكافحة غسل الأموال والضرائب والبنوك والتشغيل قبل التوسع."), [
      agencyTask(controls, "B-09", t("Set AML/CFT, sanctions and goAML controls", "أنشئ ضوابط مكافحة غسل الأموال والعقوبات وgoAML"), t("Complete banking and tax registrations.", "أكمل التسجيلات المصرفية والضريبية."), { authority: t("UAE Ministry of Economy and Tourism · FIU goAML", "وزارة الاقتصاد والسياحة · وحدة المعلومات المالية goAML"), channel: t("Ministry guidance and the official goAML registration route.", "إرشادات الوزارة ومسار التسجيل الرسمي في goAML."), boundary: t("Registration alone is not an AML programme; risk assessment, screening, reporting and records must operate continuously.", "التسجيل وحده ليس برنامجاً لمكافحة غسل الأموال؛ يجب تشغيل تقييم المخاطر والفحص والإبلاغ والسجلات باستمرار.") }),
      agencyTask(controls, "B-10", t("Open banking and complete tax registrations", "افتح الحسابات وأكمل التسجيلات الضريبية"), t("Approve the policies, contracts and operating systems.", "اعتمد السياسات والعقود وأنظمة التشغيل."), { authority: t("Bank · Federal Tax Authority", "البنك · الهيئة الاتحادية للضرائب"), requirements: [t("Entity, beneficial-owner and signatory evidence", "إثباتات الكيان والمستفيد الحقيقي والمفوضين"), t("Corporate Tax registration and VAT assessment", "التسجيل في ضريبة الشركات وتقييم ضريبة القيمة المضافة")], fee: t("FTA registration services are not shown here as a blanket business cost; banking and professional costs vary.", "لا تعرض خدمات التسجيل الضريبي هنا كتكلفة أعمال شاملة؛ وتختلف تكاليف البنوك والمهنيين."), time: confirmTime, validity: t("Maintain registrations, filings and bank mandates as the business changes.", "حافظ على التسجيلات والإقرارات وتفويضات البنك مع تغير الأعمال."), boundary: t("Tax registration and a bank account do not replace client-money, AML or transaction controls.", "التسجيل الضريبي والحساب البنكي لا يحلان محل ضوابط أموال العملاء أو مكافحة غسل الأموال أو المعاملات."), sourceIds: ["fta-vat", "fta-ct", "moet-goaml"] }),
      agencyTask(controls, "B-11", t("Approve policies, contracts and operating systems", "اعتمد السياسات والعقود وأنظمة التشغيل"), t("Accept listings only through controlled appointments and permits.", "اقبل القوائم فقط عبر تكليفات وتصاريح منضبطة."), { authority: t("Brokerage responsible manager · legal/compliance advisers where required", "المدير المسؤول لدى شركة الوساطة · المستشارون القانونيون/الامتثال عند الحاجة"), fee: t("No single government fee; implementation and professional-advice costs vary.", "لا توجد رسوم حكومية واحدة؛ وتختلف تكاليف التنفيذ والاستشارة المهنية."), time: t("Business-controlled; complete before live operations.", "تتحكم بها المنشأة؛ أكملها قبل التشغيل الفعلي."), validity: t("Review whenever law, activity, staffing, channels or risk changes.", "راجعها كلما تغير القانون أو النشاط أو الموظفون أو القنوات أو المخاطر."), requirements: [t("Client onboarding, conflicts, complaints and record-retention policies", "سياسات إدخال العملاء والتعارضات والشكاوى وحفظ السجلات"), t("Approved forms, system permissions and supervision controls", "نماذج معتمدة وصلاحيات أنظمة وضوابط إشراف")], output: t("A documented and supervised operating model", "نموذج تشغيل موثق وخاضع للإشراف"), boundary: t("Internal policy cannot override an authority requirement or expand a licence scope.", "لا يمكن للسياسة الداخلية تجاوز متطلب جهة أو توسيع نطاق الرخصة."), evidence: "conditional" }),
    ]),
    stage("agency-operate", 5, t("Operations & renewal", "التشغيل والتجديد"), t("Control listings, transactions and the calendar that keeps every authority current.", "اضبط القوائم والمعاملات والجدول الذي يحافظ على سريان كل صلاحية."), [
      agencyTask(market, "B-12", t("Run controlled listing and advertising operations", "شغّل عمليات القوائم والإعلان المنضبطة"), t("Run transactions and client-money controls.", "شغّل ضوابط المعاملات وأموال العملاء."), { channel: t("Company workflow plus DLD website · Trakheesi for advertising permits.", "سير عمل الشركة إضافة إلى موقع دائرة الأراضي · تراخيص لتصاريح الإعلان."), boundary: t("Every property and advertising channel must remain within its instruction and permit.", "يجب أن يبقى كل عقار وقناة إعلان ضمن التكليف والتصريح الخاصين به.") }),
      agencyTask(transact, "B-13", t("Run transaction, commission and client-money controls", "شغّل ضوابط المعاملة والعمولة وأموال العملاء"), t("Maintain the integrated renewal and growth calendar.", "حافظ على جدول التجديد والنمو المتكامل."), { fee: t("Transaction, registration and banking charges vary by case; show them in the client file, not as one universal fee.", "تختلف رسوم المعاملة والتسجيل والبنوك حسب الحالة؛ اعرضها في ملف العميل لا كرسوم موحدة."), time: t("Transaction-dependent; no universal end-to-end duration applies.", "تعتمد على المعاملة؛ ولا تنطبق مدة موحدة من البداية إلى النهاية."), validity: t("Keep authority, KYC and property evidence current until settlement and record closure.", "حافظ على صلاحية التفويض وإثباتات العميل والعقار حتى التسوية وإغلاق السجل."), boundary: t("Do not mix brokerage funds, client funds or unrecorded commission arrangements.", "لا تخلط أموال الوساطة أو أموال العملاء أو ترتيبات العمولات غير المسجلة.") }),
      agencyTask(renew, "B-14", t("Renew, grow, branch or close obligations", "جدّد أو توسع أو افتح فرعاً أو أغلق الالتزامات"), t("Return to Stage 1 before adding a new activity, jurisdiction or materially different route.", "ارجع إلى المرحلة الأولى قبل إضافة نشاط أو اختصاص أو مسار مختلف جوهرياً."), { fee: confirmFee, time: confirmTime, validity: t("Track the commercial licence, activity approval, office, professional cards, permits, tax and AML obligations separately.", "تتبع الرخصة التجارية وموافقة النشاط والمكتب والبطاقات المهنية والتصاريح والضرائب والتزامات مكافحة غسل الأموال كل على حدة."), boundary: t("Renewing one authority does not automatically renew the others; closure requires evidence preservation and open-case handling.", "تجديد صلاحية واحدة لا يجدد البقية تلقائياً؛ ويتطلب الإغلاق حفظ الأدلة ومعالجة الحالات المفتوحة.") }),
    ]),
  ];
}

function genericStages(emirate: BrokerJourneyEmirate, routeId: BrokerJourneyRouteId): BrokerOperationalStage[] {
  const route = brokerJourneyRoutes[emirate][routeId];
  const names = routeId === "individual"
    ? [t("Route & eligibility", "المسار والأهلية"), t("Qualification", "التأهيل"), t("Registration", "التسجيل"), t("Operate", "التشغيل"), t("Renewal", "التجديد")]
    : [t("Define & structure", "التعريف والهيكلة"), t("Licence & premises", "الرخصة والمقر"), t("People", "الأشخاص"), t("Controls", "الضوابط"), t("Operations & renewal", "التشغيل والتجديد")];
  const groups = routeId === "individual" ? [[0], [1], [2], [3], [4]] : [[0], [1, 2], [3], [4], [5, 6]];
  return groups.map((indexes, index) => stage(
    `${emirate}-${routeId}-${index + 1}`,
    index + 1,
    names[index],
    t("Select a task to inspect its authority, evidence, fee status, duration and boundary.", "اختر مهمة لفحص الجهة والأدلة وحالة الرسوم والمدة والحدود."),
    indexes.map((stepIndex) => makeTask(route.steps[stepIndex], `${routeId === "individual" ? "A" : "B"}-${String(stepIndex + 1).padStart(2, "0")}`, {
      next: stepIndex + 1 < route.steps.length ? route.steps[stepIndex + 1].title : t("Complete the final readiness check.", "أكمل فحص الجاهزية النهائي."),
    })),
  ));
}

export function getBrokerOperationalStages(emirate: BrokerJourneyEmirate, routeId: BrokerJourneyRouteId): BrokerOperationalStage[] {
  if (emirate === "dubai") return routeId === "individual" ? dubaiIndividualStages() : dubaiAgencyStages();
  return genericStages(emirate, routeId);
}
