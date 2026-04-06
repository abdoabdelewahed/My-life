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

const positiveOptions = [
  { text: 'نعم، باستمرار', value: 100 },
  { text: 'أحياناً', value: 50 },
  { text: 'لا، أبداً', value: 0 }
];

const negativeOptions = [
  { text: 'لا، أبداً', value: 100 },
  { text: 'أحياناً', value: 50 },
  { text: 'نعم، باستمرار', value: 0 }
];

export const WORK_ASSESSMENTS: Assessment[] = [
  {
    id: 'satisfaction',
    title: 'الرضا الوظيفي',
    iconName: 'Smile',
    color: 'emerald',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر بالسعادة والحماس عند الذهاب إلى العمل في الصباح؟', subCategoryId: 'job_satisfaction', options: positiveOptions },
      { id: 'q2', text: 'هل تشعر أن مهامك اليومية ذات قيمة وتساهم في تحقيق أهدافك؟', subCategoryId: 'job_satisfaction', options: positiveOptions },
      { id: 'q3', text: 'هل تشعر بالتقدير من قبل مدرائك وزملائك في العمل؟', subCategoryId: 'job_satisfaction', options: positiveOptions },
      { id: 'q4', text: 'هل ترى نفسك مستمراً في هذا العمل لفترة طويلة قادمة؟', subCategoryId: 'job_satisfaction', options: positiveOptions },
    ],
    subCategoriesDef: [
      {
        id: 'job_satisfaction',
        name: 'مستوى الرضا',
        type: 'positive',
        impactHigh: 'أنت تتمتع بمستوى عالٍ من الرضا الوظيفي والشعور بالإنجاز.',
        impactLow: 'هناك تراجع ملحوظ في رضاك الوظيفي قد يؤثر على إنتاجيتك واستمرارك.',
        stepsHigh: ['استمر في تطوير مهاراتك في مجالك الحالي', 'شارك خبراتك الإيجابية مع زملائك'],
        stepsLow: ['حدد الأسباب الدقيقة لعدم رضاك (الراتب، المهام، البيئة)', 'تحدث مع مديرك حول تطلعاتك وتغيير مهامك', 'ابحث عن فرص تطوير أو مسارات مهنية بديلة إذا لزم الأمر']
      }
    ]
  },
  {
    id: 'balance',
    title: 'التوازن المهني',
    iconName: 'Scale',
    color: 'blue',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تجد صعوبة في فصل حياتك الشخصية عن ضغوط العمل؟', subCategoryId: 'work_life_balance', options: negativeOptions },
      { id: 'q2', text: 'هل تضطر للعمل في أوقات راحتك أو خلال عطلة نهاية الأسبوع؟', subCategoryId: 'work_life_balance', options: negativeOptions },
      { id: 'q3', text: 'هل تشعر أن العمل يستهلك طاقتك لدرجة تمنعك من الاستمتاع مع عائلتك؟', subCategoryId: 'work_life_balance', options: negativeOptions },
      { id: 'q4', text: 'هل تعاني من التفكير المستمر في مهام العمل حتى وأنت في المنزل؟', subCategoryId: 'work_life_balance', options: negativeOptions },
    ],
    subCategoriesDef: [
      {
        id: 'work_life_balance',
        name: 'التوازن العام',
        type: 'positive',
        impactHigh: 'أنت توازن بشكل ممتاز بين متطلبات العمل وحياتك الخاصة.',
        impactLow: 'العمل يطغى على حياتك الشخصية مما قد يؤدي للإرهاق والاستنزاف.',
        stepsHigh: ['حافظ على حدودك الواضحة بين العمل والمنزل', 'استمر في تخصيص وقت كافٍ للراحة'],
        stepsLow: ['ضع حدوداً صارمة لساعات العمل ولا تتجاوزها', 'أغلق إشعارات العمل بعد انتهاء الدوام', 'مارس هوايات تساعدك على الفصل الذهني عن العمل']
      }
    ]
  },
  {
    id: 'environment',
    title: 'بيئة العمل',
    iconName: 'Users',
    color: 'amber',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر بالراحة والأمان النفسي داخل مكان عملك؟', subCategoryId: 'work_env', options: positiveOptions },
      { id: 'q2', text: 'هل علاقتك بزملائك مبنية على التعاون والاحترام المتبادل؟', subCategoryId: 'work_env', options: positiveOptions },
      { id: 'q3', text: 'هل تتوفر لديك الأدوات والموارد اللازمة لأداء عملك بكفاءة؟', subCategoryId: 'work_env', options: positiveOptions },
      { id: 'q4', text: 'هل تشعر أن ثقافة الشركة تشجع على الإبداع والنمو؟', subCategoryId: 'work_env', options: positiveOptions },
    ],
    subCategoriesDef: [
      {
        id: 'work_env',
        name: 'جودة البيئة',
        type: 'positive',
        impactHigh: 'بيئة عملك محفزة وتساعدك على الإبداع والنمو.',
        impactLow: 'بيئة العمل الحالية قد تكون سامة أو غير داعمة لإمكانياتك.',
        stepsHigh: ['ساهم في الحفاظ على الروح الإيجابية في فريقك', 'استغل الموارد المتاحة لتطوير أدائك'],
        stepsLow: ['حاول بناء علاقات إيجابية مع الزملاء الداعمين', 'تجنب الدخول في الصراعات الجانبية غير المجدية', 'إذا كانت البيئة تؤثر على صحتك النفسية، فكر في الانتقال لمكان أفضل']
      }
    ]
  },
  {
    id: 'growth',
    title: 'النمو المهني',
    iconName: 'TrendingUp',
    color: 'violet',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر أنك تتعلم مهارات جديدة وتتطور في عملك الحالي؟', subCategoryId: 'career_growth', options: positiveOptions },
      { id: 'q2', text: 'هل تتوفر أمامك فرص واضحة للترقي أو زيادة المسؤوليات؟', subCategoryId: 'career_growth', options: positiveOptions },
      { id: 'q3', text: 'هل تشعر أن عملك يتحدى قدراتك ويدفعك للأفضل؟', subCategoryId: 'career_growth', options: positiveOptions },
      { id: 'q4', text: 'هل لديك خطة واضحة لمستقبلك المهني في السنوات القادمة؟', subCategoryId: 'career_growth', options: positiveOptions },
    ],
    subCategoriesDef: [
      {
        id: 'career_growth',
        name: 'مسار التطور',
        type: 'positive',
        impactHigh: 'أنت في مسار مهني تصاعدي وتتطور باستمرار.',
        impactLow: 'تشعر بالركود المهني وعدم وجود فرص حقيقية للتطور.',
        stepsHigh: ['ابحث عن تحديات جديدة لزيادة خبراتك', 'فكر في الحصول على شهادات احترافية أعلى'],
        stepsLow: ['اطلب دورات تدريبية أو مهام جديدة من مديرك', 'حدث سيرتك الذاتية وراقب متطلبات السوق', 'خصص وقتاً للتعلم الذاتي وتطوير مهاراتك التقنية والشخصية']
      }
    ]
  }
];
