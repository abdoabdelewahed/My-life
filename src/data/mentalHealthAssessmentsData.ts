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

export const MENTAL_HEALTH_ASSESSMENTS: Assessment[] = [
  {
    id: 'anxiety',
    title: 'مؤشر القلق والتوتر',
    iconName: 'Activity',
    color: 'rose',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر بعدم القدرة على الاسترخاء أو الهدوء؟', subCategoryId: 'anxiety_levels', options: defaultOptions },
      { id: 'q2', text: 'هل تعاني من القلق المفرط تجاه أمور مختلفة في حياتك؟', subCategoryId: 'anxiety_levels', options: defaultOptions },
      { id: 'q3', text: 'هل تشعر بسرعة الانفعال أو العصبية لأسباب بسيطة؟', subCategoryId: 'anxiety_levels', options: defaultOptions },
      { id: 'q4', text: 'هل تعاني من أعراض جسدية للتوتر مثل تسارع نبضات القلب أو التعرق بدون مجهود؟', subCategoryId: 'anxiety_levels', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'anxiety_levels',
        name: 'مستويات القلق',
        type: 'positive',
        impactHigh: 'مستويات القلق لديك طبيعية وتستطيع التعامل مع الضغوط بهدوء.',
        impactLow: 'مستويات القلق مرتفعة وتؤثر على راحتك النفسية والجسدية.',
        stepsHigh: ['استمر في ممارسة تقنيات الاسترخاء', 'حافظ على نمط حياة متوازن'],
        stepsLow: ['مارس تمارين التنفس العميق والتأمل يومياً', 'قلل من استهلاك الكافيين والمنبهات', 'تحدث مع معالج نفسي إذا استمر القلق لفترات طويلة']
      }
    ]
  },
  {
    id: 'depression',
    title: 'المزاج والاكتئاب',
    iconName: 'CloudRain',
    color: 'indigo',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر بالحزن، الفراغ، أو اليأس معظم الوقت؟', subCategoryId: 'mood_state', options: defaultOptions },
      { id: 'q2', text: 'هل فقدت الاهتمام أو المتعة في الأنشطة التي كنت تحبها؟', subCategoryId: 'mood_state', options: defaultOptions },
      { id: 'q3', text: 'هل تعاني من تغيرات ملحوظة في الشهية أو الوزن (زيادة أو نقصاناً)؟', subCategoryId: 'mood_state', options: defaultOptions },
      { id: 'q4', text: 'هل تشعر بانخفاض شديد في الطاقة أو التعب المستمر؟', subCategoryId: 'mood_state', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'mood_state',
        name: 'الحالة المزاجية',
        type: 'positive',
        impactHigh: 'حالتك المزاجية مستقرة وتتمتع بطاقة إيجابية جيدة.',
        impactLow: 'هناك مؤشرات على انخفاض في المزاج قد تصل إلى أعراض اكتئابية.',
        stepsHigh: ['حافظ على تواصلك الاجتماعي الإيجابي', 'استمر في ممارسة هواياتك'],
        stepsLow: ['لا تتردد في طلب المساعدة من طبيب أو معالج نفسي', 'تحدث مع شخص تثق به عن مشاعرك', 'حاول الخروج للمشي والتعرض لأشعة الشمس يومياً']
      }
    ]
  },
  {
    id: 'stress',
    title: 'الضغوط النفسية',
    iconName: 'Zap',
    color: 'amber',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر أنك مثقل بالمسؤوليات ولا تستطيع إنجازها؟', subCategoryId: 'stress_management', options: defaultOptions },
      { id: 'q2', text: 'هل تجد صعوبة في التركيز بسبب كثرة التفكير في المشاكل؟', subCategoryId: 'stress_management', options: defaultOptions },
      { id: 'q3', text: 'هل تعاني من اضطرابات في النوم بسبب التفكير في ضغوط الحياة؟', subCategoryId: 'stress_management', options: defaultOptions },
      { id: 'q4', text: 'هل تشعر أنك على وشك الانهيار أو البكاء بسبب الضغط؟', subCategoryId: 'stress_management', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'stress_management',
        name: 'إدارة الضغوط',
        type: 'positive',
        impactHigh: 'أنت تدير ضغوط الحياة بكفاءة ومرونة.',
        impactLow: 'الضغوط النفسية تتراكم عليك وتؤثر على جودة حياتك ونومك.',
        stepsHigh: ['استمر في تنظيم وقتك وتحديد أولوياتك', 'حافظ على أوقات الراحة الخاصة بك'],
        stepsLow: ['تعلم تفويض بعض المهام للآخرين', 'خصص وقتاً يومياً للابتعاد عن الشاشات والعمل', 'مارس الرياضة بانتظام لتفريغ الطاقة السلبية']
      }
    ]
  },
  {
    id: 'burnout',
    title: 'الاحتراق النفسي',
    iconName: 'Flame',
    color: 'orange',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر بالاستنزاف العاطفي والجسدي التام في نهاية اليوم؟', subCategoryId: 'burnout_level', options: defaultOptions },
      { id: 'q2', text: 'هل أصبحت تتعامل بسلبية أو برود مع الأشخاص من حولك أو في عملك؟', subCategoryId: 'burnout_level', options: defaultOptions },
      { id: 'q3', text: 'هل تشعر بتراجع في كفاءتك أو إنجازك رغم الجهد الذي تبذله؟', subCategoryId: 'burnout_level', options: defaultOptions },
      { id: 'q4', text: 'هل تشعر بفقدان الشغف والدافع للاستمرار في مهامك اليومية؟', subCategoryId: 'burnout_level', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'burnout_level',
        name: 'مستوى الاحتراق',
        type: 'positive',
        impactHigh: 'أنت تحافظ على توازن صحي بين الجهد والراحة، وشغفك مستمر.',
        impactLow: 'أنت تعاني من علامات الاحتراق النفسي والمهني وتحتاج إلى استراحة عاجلة.',
        stepsHigh: ['حافظ على التوازن بين العمل والحياة الشخصية', 'استمر في مكافأة نفسك على إنجازاتك'],
        stepsLow: ['خذ إجازة للراحة والابتعاد عن روتين العمل', 'أعد تقييم أهدافك وتوقعاتك من نفسك', 'ضع حدوداً واضحة لوقت العمل والمهام المطلوبة منك']
      }
    ]
  }
];
