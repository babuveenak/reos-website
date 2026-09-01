export type DeveloperGuidePhase = "pre-development" | "development" | "post-development";

export type LocalizedText = {
  en: string;
  ar: string;
};

export type DeveloperServiceReference = {
  phase: DeveloperGuidePhase;
  serviceId?: string;
  subphaseId?: string;
};

export type DeveloperJourneyStep = {
  id: string;
  number: number;
  phase: DeveloperGuidePhase;
  lifecycleStageIds: string[];
  title: LocalizedText;
  summary: LocalizedText;
  authority: LocalizedText;
  stakeholders: LocalizedText;
  actions: LocalizedText[];
  requirements: LocalizedText[];
  output: LocalizedText;
  next: LocalizedText;
  serviceReferences: DeveloperServiceReference[];
};

const text = (en: string, ar: string): LocalizedText => ({ en, ar });

/**
 * Editorial crosswalk between the protected REOS lifecycle and the official
 * DLD Developer Book. It explains sequence without turning service estimates
 * into a total project programme or implying that every branch applies.
 */
export const developerJourneySteps: DeveloperJourneyStep[] = [
  {
    id: "define-route",
    number: 1,
    phase: "pre-development",
    lifecycleStageIds: ["land-vision"],
    title: text("Define the development route", "حدد مسار التطوير"),
    summary: text("Set the intended project, land position and competent licensing and planning routes before treating any one portal as the complete answer.", "حدد المشروع المقصود ووضع الأرض ومساري الترخيص والتخطيط المختصين قبل اعتبار أي بوابة واحدة جواباً كاملاً."),
    authority: text("DLD, the licensing authority and the plot-specific planning authority", "دائرة الأراضي والأملاك، وجهة الترخيص، وجهة التخطيط المختصة بالموقع"),
    stakeholders: text("Landowner or investor · legal adviser · planning consultant", "مالك الأرض أو المستثمر · المستشار القانوني · مستشار التخطيط"),
    actions: [
      text("Record the intended real-estate development activity and project type.", "سجّل نشاط التطوير العقاري المقصود ونوع المشروع."),
      text("Identify who controls the land and which authority governs the plot.", "حدد من يسيطر على الأرض وأي جهة تحكم الموقع."),
      text("Separate entity licensing, land evidence, planning and project registration into distinct gates.", "افصل بين ترخيص الكيان وإثبات الأرض والتخطيط وتسجيل المشروع كبوابات مستقلة."),
    ],
    requirements: [
      text("Proposed business structure and authorised signatories", "هيكل الأعمال المقترح والمفوضون بالتوقيع"),
      text("Plot, title or land-control references where available", "مراجع الموقع أو سند الملكية أو السيطرة على الأرض عند توفرها"),
      text("Initial development brief and intended use", "موجز التطوير الأولي والاستخدام المقصود"),
    ],
    output: text("A recorded licensing, land and planning route with unresolved assumptions listed.", "مسار موثق للترخيص والأرض والتخطيط مع إدراج الافتراضات غير المحسومة."),
    next: text("Obtain the entity’s initial approval and reserve its trade name.", "احصل على الموافقة المبدئية للكيان واحجز اسمه التجاري."),
    serviceReferences: [{ phase: "pre-development", serviceId: "submission-of-the-initial-approval-certificate" }],
  },
  {
    id: "initial-approval-name",
    number: 2,
    phase: "pre-development",
    lifecycleStageIds: ["land-vision"],
    title: text("Obtain initial approval and reserve the trade name", "احصل على الموافقة المبدئية واحجز الاسم التجاري"),
    summary: text("Start the entity route through the official initial-approval and trade-name services shown in the DLD Developer Book.", "ابدأ مسار الكيان عبر خدمتي الموافقة المبدئية والاسم التجاري المبينتين في دليل المطور."),
    authority: text("Dubai licensing authority, with the DLD Developer Book as the service-route reference", "جهة الترخيص في دبي، مع دليل المطور مرجعاً لمسار الخدمة"),
    stakeholders: text("Founders · authorised signatory · licensing service channel", "المؤسسون · المفوض بالتوقيع · قناة خدمة الترخيص"),
    actions: [
      text("Submit the initial approval request through the listed channel.", "قدّم طلب الموافقة المبدئية عبر القناة المدرجة."),
      text("Reserve the intended trade name after checking the live requirements.", "احجز الاسم التجاري المقصود بعد التحقق من المتطلبات الحية."),
    ],
    requirements: [
      text("Identity, business and application records listed by the live service", "سجلات الهوية والأعمال والطلب المدرجة في الخدمة الحية"),
      text("A compliant proposed trade name", "اسم تجاري مقترح متوافق"),
    ],
    output: text("Initial approval and a reserved trade name, subject to the live authority decision.", "موافقة مبدئية واسم تجاري محجوز، وفقاً لقرار الجهة الحي."),
    next: text("Complete the trade licence, DLD NOC and developer registration route.", "أكمل مسار الرخصة التجارية وعدم الممانعة من الدائرة وتسجيل المطور."),
    serviceReferences: [
      { phase: "pre-development", serviceId: "submission-of-the-initial-approval-certificate" },
      { phase: "pre-development", serviceId: "trade-name-reservation" },
    ],
  },
  {
    id: "license-register",
    number: 3,
    phase: "pre-development",
    lifecycleStageIds: ["land-vision", "authorities-approvals"],
    title: text("License the entity and register the developer", "رخّص الكيان وسجّل المطور"),
    summary: text("A trade licence, DLD approval, entry in the developers’ log and Oqood access are separate service nodes—not one combined approval.", "الرخصة التجارية وموافقة الدائرة والقيد في سجل المطورين والوصول إلى نظام عقود هي عقد خدمات منفصلة وليست موافقة واحدة."),
    authority: text("Licensing authority · DLD / RERA", "جهة الترخيص · دائرة الأراضي والأملاك / مؤسسة التنظيم العقاري"),
    stakeholders: text("Developer entity · authorised signatory · compliance team", "كيان المطور · المفوض بالتوقيع · فريق الامتثال"),
    actions: [
      text("Request the trade licence for the applicable real-estate activity.", "اطلب الرخصة التجارية للنشاط العقاري المنطبق."),
      text("Complete the DLD trade-licence NOC and developer-log registration.", "أكمل عدم الممانعة للرخصة من الدائرة والقيد في سجل المطورين."),
      text("Complete the listed Oqood system course or access requirement where applicable.", "أكمل دورة نظام عقود أو متطلبات الوصول المدرجة عند انطباقها."),
    ],
    requirements: [
      text("The documents and eligibility listed for each separate live service", "المستندات والأهلية المدرجة لكل خدمة حية منفصلة"),
      text("Entity and authorised-signatory evidence", "إثباتات الكيان والمفوض بالتوقيع"),
    ],
    output: text("A licensed entity with the applicable DLD developer registration and system access.", "كيان مرخص مع تسجيل المطور والوصول إلى النظام لدى الدائرة حسب الانطباق."),
    next: text("Secure and qualify the land before design mobilisation.", "أمّن الأرض وتحقق من أهليتها قبل بدء أعمال التصميم."),
    serviceReferences: [
      { phase: "pre-development", serviceId: "issuing-trade-license-request" },
      { phase: "pre-development", serviceId: "dld-approval-for-the-trade-license-noc" },
      { phase: "pre-development", serviceId: "registering-the-developer-in-real-estate-developers-log" },
      { phase: "pre-development", serviceId: "registration-in-oqood-system-course" },
    ],
  },
  {
    id: "qualify-land",
    number: 4,
    phase: "pre-development",
    lifecycleStageIds: ["land-vision", "planning-design"],
    title: text("Secure and qualify the land", "أمّن الأرض وتحقق من أهليتها"),
    summary: text("Confirm land control, registry status, intended use and the competent planning branch before freezing feasibility or appointing a submission route.", "أكد السيطرة على الأرض وحالة السجل والاستخدام المقصود وفرع التخطيط المختص قبل تثبيت الجدوى أو تعيين مسار التقديم."),
    authority: text("DLD and the plot-specific planning or master-development authority", "دائرة الأراضي والأملاك وجهة التخطيط أو المطور الرئيسي المختصة بالموقع"),
    stakeholders: text("Landowner · developer · legal and planning advisers · master developer where applicable", "مالك الأرض · المطور · المستشارون القانونيون ومستشارو التخطيط · المطور الرئيسي عند الانطباق"),
    actions: [
      text("Verify the land or registered interest through the appropriate official channel.", "تحقق من الأرض أو المصلحة المسجلة عبر القناة الرسمية المناسبة."),
      text("Confirm site-plan, zoning and master-community dependencies separately.", "أكد مخطط الموقع والتقسيم ومتطلبات المجتمع الرئيسي بصورة منفصلة."),
      text("Record constraints that affect feasibility, design, programme and funding.", "سجّل القيود التي تؤثر في الجدوى والتصميم والبرنامج والتمويل."),
    ],
    requirements: [
      text("Title, plot or property reference", "مرجع سند الملكية أو الموقع أو العقار"),
      text("Official site-plan or planning reference where applicable", "مخطط الموقع الرسمي أو مرجع التخطيط عند الانطباق"),
      text("Development brief and feasibility assumptions", "موجز التطوير وافتراضات الجدوى"),
    ],
    output: text("A qualified site and confirmed planning branch; this is not yet a building permit.", "موقع مؤهل وفرع تخطيط مؤكد؛ وهذا لا يعد تصريح بناء بعد."),
    next: text("Coordinate the master plan, design and required NOCs.", "نسّق المخطط العام والتصميم وشهادات عدم الممانعة المطلوبة."),
    serviceReferences: [{ phase: "development", subphaseId: "master-plan-approval" }],
  },
  {
    id: "plan-design-nocs",
    number: 5,
    phase: "development",
    lifecycleStageIds: ["planning-design", "authorities-approvals"],
    title: text("Coordinate the master plan, design and NOCs", "نسّق المخطط العام والتصميم وشهادات عدم الممانعة"),
    summary: text("The applicable planning branch determines which master-plan, technical, utility, safety and external approvals are required.", "يحدد فرع التخطيط المنطبق موافقات المخطط العام والموافقات الفنية والخدمية والسلامة والموافقات الخارجية المطلوبة."),
    authority: text("Selected planning authority plus the project-specific referral and NOC authorities", "جهة التخطيط المختارة إضافة إلى جهات الإحالة وعدم الممانعة الخاصة بالمشروع"),
    stakeholders: text("Developer · lead consultant · specialist designers · utilities · safety and transport authorities", "المطور · الاستشاري الرئيسي · المصممون المتخصصون · جهات الخدمات · جهات السلامة والنقل"),
    actions: [
      text("Select the correct authority branch before using any published service list.", "اختر فرع الجهة الصحيح قبل استخدام أي قائمة خدمات منشورة."),
      text("Coordinate the master plan, design submissions and required NOCs.", "نسّق المخطط العام وطلبات التصميم وشهادات عدم الممانعة المطلوبة."),
      text("Close comments and preserve the current approved baseline.", "أغلق الملاحظات وحافظ على النسخة المعتمدة الحالية."),
    ],
    requirements: [
      text("Land and planning evidence", "إثباتات الأرض والتخطيط"),
      text("Appointed consultants and coordinated submission documents", "الاستشاريون المعينون ومستندات التقديم المنسقة"),
      text("Project-specific NOC inputs", "مدخلات عدم الممانعة الخاصة بالمشروع"),
    ],
    output: text("The applicable master-plan, design and NOC approvals or recorded conditions.", "موافقات المخطط العام والتصميم وعدم الممانعة المنطبقة أو الشروط المسجلة."),
    next: text("Register the project and open escrow if the off-plan route applies.", "سجّل المشروع وافتح حساب الضمان إذا انطبق مسار البيع على الخارطة."),
    serviceReferences: [{ phase: "development", subphaseId: "master-plan-approval", serviceId: "apply-for-the-approval-of-urban-projects-plans-and-plan-modifications" }],
  },
  {
    id: "register-project-escrow",
    number: 6,
    phase: "development",
    lifecycleStageIds: ["authorities-approvals", "sales-transfer"],
    title: text("Register the project and open escrow", "سجّل المشروع وافتح حساب الضمان"),
    summary: text("In the DLD Developer Book, project registration and escrow opening sit in the Development off-plan-sales branch—not in pre-development.", "في دليل المطور تقع عملية تسجيل المشروع وفتح حساب الضمان ضمن فرع البيع على الخارطة في مرحلة التطوير، وليس ضمن ما قبل التطوير."),
    authority: text("DLD / RERA · escrow bank · selected planning authority", "دائرة الأراضي والأملاك / مؤسسة التنظيم العقاري · بنك الضمان · جهة التخطيط المختارة"),
    stakeholders: text("Developer · bank · consultant · authorised project team", "المطور · البنك · الاستشاري · فريق المشروع المفوض"),
    actions: [
      text("Confirm that the project satisfies the live registration prerequisites.", "أكد استيفاء المشروع لمتطلبات التسجيل الحية."),
      text("Use the applicable DLD service to register the project and open its escrow account.", "استخدم خدمة الدائرة المنطبقة لتسجيل المشروع وفتح حساب الضمان الخاص به."),
      text("Keep project, bank and sales controls aligned before collecting buyer funds.", "حافظ على اتساق ضوابط المشروع والبنك والمبيعات قبل تحصيل أموال المشترين."),
    ],
    requirements: [
      text("The service’s current project, land, licence, approval and bank evidence", "إثباتات المشروع والأرض والرخصة والموافقة والبنك الحالية بحسب الخدمة"),
      text("The selected authority branch and project identifiers", "فرع الجهة المختار ومعرّفات المشروع"),
    ],
    output: text("The official project-registration and escrow-account outcome for the applicable route.", "نتيجة تسجيل المشروع وحساب الضمان الرسمية للمسار المنطبق."),
    next: text("Obtain the building permit and mobilise the appointed delivery team.", "احصل على تصريح البناء وابدأ تعبئة فريق التنفيذ المعيّن."),
    serviceReferences: [{ phase: "development", subphaseId: "sales-stage-during-project-completion-off-plan-property-sale", serviceId: "request-for-registration-of-a-real-estate-project-and-opening-of-an-escrow-account" }],
  },
  {
    id: "permit-mobilise",
    number: 7,
    phase: "development",
    lifecycleStageIds: ["authorities-approvals", "construction-delivery"],
    title: text("Obtain the permit and mobilise delivery", "احصل على التصريح وابدأ التنفيذ"),
    summary: text("A commercial appointment or approved design does not by itself authorise construction; the applicable permit and its prerequisites must be current.", "لا يجيز التعيين التجاري أو التصميم المعتمد وحده أعمال البناء؛ يجب أن يكون التصريح المنطبق ومتطلباته سارية."),
    authority: text("Selected building-control authority and project-specific NOC authorities", "جهة رقابة البناء المختارة وجهات عدم الممانعة الخاصة بالمشروع"),
    stakeholders: text("Developer · consultant · contractor · utilities · safety authorities", "المطور · الاستشاري · المقاول · جهات الخدمات · جهات السلامة"),
    actions: [
      text("Submit through the permit service for the selected authority branch.", "قدّم عبر خدمة التصريح الخاصة بفرع الجهة المختار."),
      text("Close appointment, NOC, access and permit conditions before site work.", "أغلق شروط التعيين وعدم الممانعة والوصول والتصريح قبل أعمال الموقع."),
      text("Issue the approved baseline to the controlled delivery team.", "أصدر النسخة المعتمدة لفريق التنفيذ الخاضع للرقابة."),
    ],
    requirements: [
      text("Approved design and current NOCs", "التصميم المعتمد وشهادات عدم الممانعة السارية"),
      text("Consultant and contractor appointment evidence", "إثباتات تعيين الاستشاري والمقاول"),
      text("Permit-specific technical and site documents", "المستندات الفنية ومستندات الموقع الخاصة بالتصريح"),
    ],
    output: text("The applicable building permit and recorded conditions.", "تصريح البناء المنطبق والشروط المسجلة."),
    next: text("Build, inspect and monitor while managing any permitted sales route in parallel.", "نفّذ وافحص وراقب مع إدارة أي مسار مبيعات مسموح به بالتوازي."),
    serviceReferences: [{ phase: "development", subphaseId: "construction-permit-and-completion-certificate-phase", serviceId: "new-building-permit" }],
  },
  {
    id: "build-monitor-sell",
    number: 8,
    phase: "development",
    lifecycleStageIds: ["construction-delivery", "sales-transfer"],
    title: text("Build, inspect, monitor and control sales", "نفّذ وافحص وراقب واضبط المبيعات"),
    summary: text("Construction, inspections, project monitoring and an eligible off-plan sales route can overlap, but their approvals and evidence remain distinct.", "يمكن أن تتداخل أعمال البناء والفحوصات ومراقبة المشروع ومسار البيع على الخارطة المؤهل، لكن موافقاتها وأدلتها تظل منفصلة."),
    authority: text("Building-control authority · DLD / RERA · escrow bank where applicable", "جهة رقابة البناء · دائرة الأراضي والأملاك / مؤسسة التنظيم العقاري · بنك الضمان عند الانطباق"),
    stakeholders: text("Developer · consultant · contractor · bank · broker or sales team · buyers", "المطور · الاستشاري · المقاول · البنك · الوسيط أو فريق المبيعات · المشترون"),
    actions: [
      text("Control inspections, changes, progress evidence and authority conditions.", "اضبط الفحوصات والتغييرات وإثباتات التقدم وشروط الجهات."),
      text("Keep regulated sales, buyer receipts, escrow and initial unit loading aligned.", "حافظ على اتساق المبيعات المنظمة وإيصالات المشترين والضمان والتحميل الأولي للوحدات."),
      text("Treat construction and off-plan activities as coordinated parallel lanes, not one approval chain.", "تعامل مع البناء والبيع على الخارطة كمسارين متوازيين منسقين، وليس كسلسلة موافقة واحدة."),
    ],
    requirements: [
      text("Current permit, approved design and inspection records", "التصريح الساري والتصميم المعتمد وسجلات الفحص"),
      text("Project, escrow, sales and unit records where off-plan activity applies", "سجلات المشروع والضمان والمبيعات والوحدات عند انطباق البيع على الخارطة"),
    ],
    output: text("Controlled progress evidence, completed inspections and current project/unit records.", "إثباتات تقدم مضبوطة وفحوصات مكتملة وسجلات مشروع ووحدات محدثة."),
    next: text("Complete the project, finalise unit records and prepare handover.", "أكمل المشروع وأنهِ سجلات الوحدات وجهّز التسليم."),
    serviceReferences: [
      { phase: "development", subphaseId: "construction-permit-and-completion-certificate-phase", serviceId: "apply-for-structural-inspection" },
      { phase: "development", subphaseId: "sales-stage-during-project-completion-off-plan-property-sale", serviceId: "loading-project-units-initial-loading" },
    ],
  },
  {
    id: "complete-handover",
    number: 9,
    phase: "post-development",
    lifecycleStageIds: ["construction-delivery", "living-operations"],
    title: text("Complete, register and hand over", "أكمل وسجّل وسلّم"),
    summary: text("Physical completion, authority completion, final unit loading and handover are related gates; one does not automatically prove that all others are closed.", "الإنجاز الفعلي وإنجاز الجهة والتحميل النهائي للوحدات والتسليم بوابات مترابطة؛ ولا يثبت أحدها تلقائياً إغلاق البقية."),
    authority: text("Selected completion authority · DLD / RERA · utilities and community channels", "جهة الإنجاز المختارة · دائرة الأراضي والأملاك / مؤسسة التنظيم العقاري · قنوات الخدمات والمجتمع"),
    stakeholders: text("Developer · consultant · contractor · DLD · owners · operators", "المطور · الاستشاري · المقاول · الدائرة · الملاك · المشغلون"),
    actions: [
      text("Close inspections, testing, NOCs, as-built and completion submissions.", "أغلق الفحوصات والاختبارات وعدم الممانعة والمخططات التنفيذية وطلبات الإنجاز."),
      text("Complete the final unit-loading route where applicable.", "أكمل مسار التحميل النهائي للوحدات عند الانطباق."),
      text("Issue controlled handover, defect, warranty and operating evidence.", "أصدر أدلة مضبوطة للتسليم والعيوب والضمان والتشغيل."),
    ],
    requirements: [
      text("Completion certificate and authority closure evidence", "شهادة الإنجاز وأدلة إغلاق الجهات"),
      text("Final unit, buyer, title or provisional-registration records where applicable", "سجلات الوحدات والمشترين والملكية أو التسجيل المبدئي النهائية عند الانطباق"),
      text("Handover, asset, warranty and defect records", "سجلات التسليم والأصول والضمان والعيوب"),
    ],
    output: text("Completion and unit records plus an accepted handover evidence package.", "سجلات الإنجاز والوحدات إضافة إلى حزمة أدلة تسليم مقبولة."),
    next: text("Settle the project escrow when eligible and close post-handover obligations.", "سوِّ حساب ضمان المشروع عند استيفاء الشروط وأغلق التزامات ما بعد التسليم."),
    serviceReferences: [
      { phase: "development", subphaseId: "construction-permit-and-completion-certificate-phase", serviceId: "completion-and-services-connection" },
      { phase: "post-development", serviceId: "project-units-loading-final-loading" },
    ],
  },
  {
    id: "close-operate-learn",
    number: 10,
    phase: "post-development",
    lifecycleStageIds: ["living-operations", "asset-growth-intelligence"],
    title: text("Close out and support the operating asset", "أغلق المشروع وادعم الأصل التشغيلي"),
    summary: text("Stage 7 remains part of the developer journey as a supporting role: the developer supplies warranty, defect and project evidence without taking over the owner’s long-term asset decision.", "تظل المرحلة السابعة جزءاً من رحلة المطور كدور داعم: يقدم المطور أدلة الضمان والعيوب والمشروع دون تولي قرار الأصل طويل الأجل الخاص بالمالك."),
    authority: text("DLD / RERA and the applicable owners, community and operating channels", "دائرة الأراضي والأملاك / مؤسسة التنظيم العقاري وقنوات الملاك والمجتمع والتشغيل المنطبقة"),
    stakeholders: text("Developer · escrow bank · owners · facility/community operator · consultants and contractors", "المطور · بنك الضمان · الملاك · مشغل المرافق/المجتمع · الاستشاريون والمقاولون"),
    actions: [
      text("Use the official escrow-settlement route only when its live prerequisites are satisfied.", "استخدم مسار تسوية حساب الضمان الرسمي فقط عند استيفاء متطلباته الحية."),
      text("Close defects, warranties, retained records and residual project obligations.", "أغلق العيوب والضمانات والسجلات المحتفظ بها والتزامات المشروع المتبقية."),
      text("Transfer usable project evidence to owners and operators and retain lessons for future projects.", "انقل أدلة المشروع القابلة للاستخدام إلى الملاك والمشغلين واحتفظ بالدروس للمشاريع المستقبلية."),
    ],
    requirements: [
      text("Completion, financial, escrow and final unit records", "سجلات الإنجاز والمالية والضمان والوحدات النهائية"),
      text("Defect, warranty, asset and operator-acceptance evidence", "أدلة العيوب والضمان والأصول وقبول المشغل"),
    ],
    output: text("Escrow settlement where approved, closed project obligations and an operating evidence handover.", "تسوية حساب الضمان عند اعتمادها، وإغلاق التزامات المشروع، وتسليم أدلة التشغيل."),
    next: text("The owner and operator lead ongoing operation and asset decisions; the developer remains accountable for surviving obligations.", "يقود المالك والمشغل التشغيل المستمر وقرارات الأصل؛ ويبقى المطور مسؤولاً عن الالتزامات المستمرة."),
    serviceReferences: [{ phase: "post-development", serviceId: "settlement-of-the-escrow-account" }],
  },
];

if (developerJourneySteps.length !== 10) throw new Error("The Developer journey must preserve the ten validated roadmap steps.");
if (developerJourneySteps.some((step, index) => step.number !== index + 1)) throw new Error("Developer journey step numbers must remain sequential.");
