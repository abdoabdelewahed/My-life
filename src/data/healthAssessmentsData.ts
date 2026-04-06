export interface Question {
  id: string;
  text: string;
  subCategoryId: string;
  options?: { text: string; value: number }[];
}

export interface SubCategoryDef {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  impactHigh: string;
  impactLow: string;
  stepsHigh: string[];
  stepsLow: string[];
}

export interface Assessment {
  id: string;
  title: string;
  iconName: string;
  color: string;
  type: 'positive' | 'negative';
  questions: Question[];
  subCategoriesDef: SubCategoryDef[];
}

const defaultOptions = [
  { text: 'لا، أبداً', value: 100 },
  { text: 'أحياناً', value: 50 },
  { text: 'نعم، باستمرار', value: 0 }
];

export const HEALTH_ASSESSMENTS: Assessment[] = [
  {
    id: 'heart',
    title: 'صحة القلب',
    iconName: 'Heart',
    color: 'rose',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر بضيق في التنفس عند بذل مجهود بسيط؟', subCategoryId: 'cardiovascular', options: defaultOptions },
      { id: 'q2', text: 'هل تعاني من خفقان سريع أو غير منتظم في القلب؟', subCategoryId: 'cardiovascular', options: defaultOptions },
      { id: 'q3', text: 'هل تشعر بألم أو ضغط في منطقة الصدر؟', subCategoryId: 'cardiovascular', options: defaultOptions },
      { id: 'q4', text: 'هل تعاني من تورم في القدمين أو الكاحلين؟', subCategoryId: 'cardiovascular', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'cardiovascular',
        name: 'كفاءة القلب والأوعية',
        type: 'positive',
        impactHigh: 'قلبك يعمل بكفاءة جيدة ولا توجد مؤشرات مقلقة.',
        impactLow: 'هناك بعض المؤشرات التي قد تتطلب استشارة طبيب لتقييم صحة القلب.',
        stepsHigh: ['استمر في ممارسة الرياضة بانتظام', 'حافظ على نظام غذائي متوازن قليل الصوديوم'],
        stepsLow: ['راجع طبيب قلب في أقرب فرصة', 'قلل من التوتر والإجهاد', 'راقب ضغط الدم بانتظام']
      }
    ]
  },
  {
    id: 'respiratory',
    title: 'الجهاز التنفسي',
    iconName: 'Wind',
    color: 'sky',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تعاني من سعال مزمن أو مستمر؟', subCategoryId: 'respiratory_function', options: defaultOptions },
      { id: 'q2', text: 'هل تشعر بصفير عند التنفس؟', subCategoryId: 'respiratory_function', options: defaultOptions },
      { id: 'q3', text: 'هل تستيقظ من النوم بسبب ضيق في التنفس؟', subCategoryId: 'respiratory_function', options: defaultOptions },
      { id: 'q4', text: 'هل تشعر بالتعب السريع عند صعود السلالم؟', subCategoryId: 'respiratory_function', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'respiratory_function',
        name: 'كفاءة الجهاز التنفسي',
        type: 'positive',
        impactHigh: 'جهازك التنفسي يعمل بشكل جيد ولا توجد أعراض مقلقة.',
        impactLow: 'هناك أعراض تشير إلى احتمالية وجود مشكلة في الجهاز التنفسي.',
        stepsHigh: ['تجنب التدخين والأماكن الملوثة', 'مارس تمارين التنفس العميق'],
        stepsLow: ['راجع طبيب أمراض صدرية', 'تجنب التعرض لمسببات الحساسية والغبار', 'توقف عن التدخين فوراً إذا كنت مدخناً']
      }
    ]
  },
  {
    id: 'digestive',
    title: 'الجهاز الهضمي',
    iconName: 'Coffee',
    color: 'amber',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تعاني من حموضة أو حرقان متكرر في المعدة؟', subCategoryId: 'digestion', options: defaultOptions },
      { id: 'q2', text: 'هل تشعر بانتفاخ أو غازات مزعجة بعد تناول الطعام؟', subCategoryId: 'digestion', options: defaultOptions },
      { id: 'q3', text: 'هل تعاني من إمساك أو إسهال متكرر؟', subCategoryId: 'digestion', options: defaultOptions },
      { id: 'q4', text: 'هل تشعر بألم في البطن بشكل متكرر؟', subCategoryId: 'digestion', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'digestion',
        name: 'صحة الهضم والأمعاء',
        type: 'positive',
        impactHigh: 'جهازك الهضمي يعمل بكفاءة وهضمك منتظم.',
        impactLow: 'تعاني من اضطرابات هضمية قد تؤثر على جودة حياتك.',
        stepsHigh: ['حافظ على شرب كميات كافية من الماء', 'تناول الألياف بانتظام'],
        stepsLow: ['استشر طبيب باطنة أو جهاز هضمي', 'تجنب الأطعمة الحارة والمقلية', 'امضغ الطعام جيداً وتجنب الأكل قبل النوم مباشرة']
      }
    ]
  },
  {
    id: 'nervous',
    title: 'الجهاز العصبي والتركيز',
    iconName: 'Brain',
    color: 'indigo',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تعاني من صداع متكرر أو نصفي؟', subCategoryId: 'nervous_system', options: defaultOptions },
      { id: 'q2', text: 'هل تشعر بتنميل أو وخز في الأطراف؟', subCategoryId: 'nervous_system', options: defaultOptions },
      { id: 'q3', text: 'هل تواجه صعوبة في التركيز أو تشتت الانتباه؟', subCategoryId: 'nervous_system', options: defaultOptions },
      { id: 'q4', text: 'هل تعاني من دوار أو فقدان للتوازن؟', subCategoryId: 'nervous_system', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'nervous_system',
        name: 'صحة الأعصاب والتركيز',
        type: 'positive',
        impactHigh: 'جهازك العصبي مستقر وتركيزك في حالة جيدة.',
        impactLow: 'توجد مؤشرات على إرهاق عصبي أو مشاكل تتطلب الانتباه.',
        stepsHigh: ['حافظ على ساعات نوم كافية', 'مارس التأمل أو الاسترخاء'],
        stepsLow: ['استشر طبيب مخ وأعصاب', 'تأكد من مستويات فيتامين B12', 'قلل من استخدام الشاشات قبل النوم']
      }
    ]
  },
  {
    id: 'musculoskeletal',
    title: 'العظام والمفاصل',
    iconName: 'Activity',
    color: 'orange',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تعاني من آلام مستمرة في الظهر أو الرقبة؟', subCategoryId: 'bones_joints', options: defaultOptions },
      { id: 'q2', text: 'هل تشعر بتيبس في المفاصل عند الاستيقاظ؟', subCategoryId: 'bones_joints', options: defaultOptions },
      { id: 'q3', text: 'هل تسمع طقطقة مصحوبة بألم عند تحريك مفاصلك؟', subCategoryId: 'bones_joints', options: defaultOptions },
      { id: 'q4', text: 'هل تشعر بضعف في العضلات عند حمل أشياء خفيفة؟', subCategoryId: 'bones_joints', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'bones_joints',
        name: 'صحة العظام والعضلات',
        type: 'positive',
        impactHigh: 'عظامك ومفاصلك في حالة صحية جيدة.',
        impactLow: 'تعاني من آلام قد تشير إلى التهابات أو إجهاد في المفاصل.',
        stepsHigh: ['حافظ على نشاطك البدني', 'تأكد من الحصول على الكالسيوم وفيتامين د'],
        stepsLow: ['راجع طبيب عظام أو علاج طبيعي', 'تجنب الجلوس لفترات طويلة بوضعية خاطئة', 'مارس تمارين الإطالة بانتظام']
      }
    ]
  },
  {
    id: 'vision',
    title: 'الرؤية والعين',
    iconName: 'Eye',
    color: 'teal',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تعاني من زغللة أو ضبابية في الرؤية؟', subCategoryId: 'eye_health', options: defaultOptions },
      { id: 'q2', text: 'هل تشعر بجفاف أو حرقان في عينيك؟', subCategoryId: 'eye_health', options: defaultOptions },
      { id: 'q3', text: 'هل تعاني من حساسية شديدة للضوء؟', subCategoryId: 'eye_health', options: defaultOptions },
      { id: 'q4', text: 'هل تضطر لتقريب الأشياء أو إبعادها لتتمكن من قراءتها؟', subCategoryId: 'eye_health', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'eye_health',
        name: 'صحة النظر',
        type: 'positive',
        impactHigh: 'رؤيتك واضحة وعيناك في حالة جيدة.',
        impactLow: 'هناك مؤشرات على إجهاد العين أو ضعف في النظر.',
        stepsHigh: ['استمر في إراحة عينيك من الشاشات', 'ارتدِ نظارات شمسية عند التعرض للشمس'],
        stepsLow: ['حدد موعداً لفحص النظر لدى طبيب عيون', 'استخدم قطرات مرطبة للعين بعد استشارة الطبيب', 'طبق قاعدة 20-20-20 عند استخدام الشاشات']
      }
    ]
  },
  {
    id: 'hearing',
    title: 'السمع والأذن',
    iconName: 'Ear',
    color: 'purple',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تطلب من الآخرين تكرار كلامهم بشكل متكرر؟', subCategoryId: 'ear_health', options: defaultOptions },
      { id: 'q2', text: 'هل تسمع طنيناً أو رنيناً مستمراً في أذنك؟', subCategoryId: 'ear_health', options: defaultOptions },
      { id: 'q3', text: 'هل ترفع صوت التلفاز أو الهاتف أعلى من المعتاد؟', subCategoryId: 'ear_health', options: defaultOptions },
      { id: 'q4', text: 'هل تشعر بألم أو انسداد في أذنك؟', subCategoryId: 'ear_health', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'ear_health',
        name: 'صحة السمع',
        type: 'positive',
        impactHigh: 'حاسة السمع لديك تعمل بكفاءة.',
        impactLow: 'قد يكون هناك تراجع في حاسة السمع أو مشكلة في الأذن.',
        stepsHigh: ['تجنب التعرض للأصوات الصاخبة', 'حافظ على نظافة أذنك الخارجية فقط'],
        stepsLow: ['راجع طبيب أنف وأذن وحنجرة', 'تجنب استخدام أعواد القطن لتنظيف الأذن', 'قم بإجراء تخطيط للسمع']
      }
    ]
  },
  {
    id: 'skin',
    title: 'الجلد والبشرة',
    iconName: 'Sun',
    color: 'yellow',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تعاني من جفاف شديد أو تقشر في الجلد؟', subCategoryId: 'skin_health', options: defaultOptions },
      { id: 'q2', text: 'هل تلاحظ ظهور بقع أو تصبغات جديدة على بشرتك؟', subCategoryId: 'skin_health', options: defaultOptions },
      { id: 'q3', text: 'هل تعاني من حكة مستمرة في مناطق معينة؟', subCategoryId: 'skin_health', options: defaultOptions },
      { id: 'q4', text: 'هل تلاحظ تغيرات في شكل أو لون الشامات الموجودة؟', subCategoryId: 'skin_health', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'skin_health',
        name: 'صحة الجلد',
        type: 'positive',
        impactHigh: 'بشرتك تبدو صحية ولا توجد مشاكل ظاهرة.',
        impactLow: 'هناك علامات تتطلب العناية ببشرتك أو فحصها طبياً.',
        stepsHigh: ['استخدم واقي الشمس بانتظام', 'حافظ على ترطيب بشرتك'],
        stepsLow: ['استشر طبيب جلدية', 'تجنب التعرض المباشر للشمس في أوقات الذروة', 'راقب أي تغيرات في الشامات أو البقع']
      }
    ]
  },
  {
    id: 'hair_scalp',
    title: 'فروة الرأس والشعر',
    iconName: 'Scissors',
    color: 'pink',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تعاني من تساقط الشعر بشكل غير طبيعي؟', subCategoryId: 'hair_health', options: defaultOptions },
      { id: 'q2', text: 'هل تعاني من قشرة الرأس أو حكة مستمرة في الفروة؟', subCategoryId: 'hair_health', options: defaultOptions },
      { id: 'q3', text: 'هل تلاحظ تقصفاً شديداً أو جفافاً في أطراف شعرك؟', subCategoryId: 'hair_health', options: defaultOptions },
      { id: 'q4', text: 'هل تشعر بألم أو التهاب في فروة الرأس؟', subCategoryId: 'hair_health', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'hair_health',
        name: 'صحة الشعر والفروة',
        type: 'positive',
        impactHigh: 'شعرك وفروة رأسك في حالة صحية ممتازة.',
        impactLow: 'توجد مشاكل في فروة الرأس أو تساقط يحتاج إلى عناية.',
        stepsHigh: ['استمر في العناية بشعرك باستخدام منتجات مناسبة', 'حافظ على تغذية سليمة غنية بالفيتامينات'],
        stepsLow: ['استشر طبيب جلدية لمعرفة سبب التساقط أو القشرة', 'تجنب استخدام المواد الكيميائية القاسية على شعرك', 'تأكد من عدم وجود نقص في الفيتامينات (مثل الحديد أو فيتامين د)']
      }
    ]
  },
  {
    id: 'dental',
    title: 'صحة الأسنان والفم',
    iconName: 'Smile',
    color: 'cyan',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تعاني من نزيف في اللثة عند غسل أسنانك؟', subCategoryId: 'dental_health', options: defaultOptions },
      { id: 'q2', text: 'هل تشعر بألم في أسنانك عند تناول المشروبات الباردة أو الساخنة؟', subCategoryId: 'dental_health', options: defaultOptions },
      { id: 'q3', text: 'هل تعاني من رائحة فم كريهة مستمرة؟', subCategoryId: 'dental_health', options: defaultOptions },
      { id: 'q4', text: 'هل تلاحظ وجود جير أو تسوس في أسنانك؟', subCategoryId: 'dental_health', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'dental_health',
        name: 'صحة الفم والأسنان',
        type: 'positive',
        impactHigh: 'أسنانك ولثتك في حالة صحية جيدة.',
        impactLow: 'هناك مؤشرات على وجود تسوس أو التهابات في اللثة.',
        stepsHigh: ['استمر في غسل أسنانك مرتين يومياً', 'استخدم خيط الأسنان بانتظام'],
        stepsLow: ['حدد موعداً لزيارة طبيب الأسنان في أقرب وقت', 'استخدم غسول فم مناسب لالتهابات اللثة', 'قلل من تناول السكريات والمشروبات الغازية']
      }
    ]
  }
];
