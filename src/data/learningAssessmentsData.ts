import { Assessment } from './workAssessmentsData';

const defaultOptions = [
  { text: 'نعم', value: 100 },
  { text: 'لا', value: 0 }
];

export const LEARNING_ASSESSMENTS: Assessment[] = [
  {
    id: 'learning-style',
    title: 'نمط التعلم',
    iconName: 'Brain',
    color: 'emerald',
    type: 'positive',
    questions: [
      { id: 'ls1', text: 'أفضل تعلم مهارات جديدة من خلال المشاهدة (فيديو/صور) بدلاً من القراءة فقط.', subCategoryId: 'visual', options: defaultOptions },
      { id: 'ls2', text: 'أجد سهولة في تذكر المعلومات عندما أكتبها بيدي.', subCategoryId: 'kinesthetic', options: defaultOptions },
      { id: 'ls3', text: 'أفضل الاستماع إلى الشروحات الصوتية أو البودكاست التعليمي.', subCategoryId: 'auditory', options: defaultOptions },
      { id: 'ls4', text: 'أتعلم بشكل أفضل عندما أقوم بتطبيق المهارة عملياً فوراً.', subCategoryId: 'kinesthetic', options: defaultOptions },
      { id: 'ls5', text: 'الرسوم البيانية والخرائط الذهنية تساعدني كثيراً في الفهم.', subCategoryId: 'visual', options: defaultOptions }
    ],
    subCategoriesDef: [
      {
        id: 'visual',
        name: 'التعلم البصري',
        type: 'positive',
        impactHigh: 'لديك قدرة ممتازة على معالجة المعلومات المرئية والخرائط الذهنية.',
        impactLow: 'قد تجد صعوبة في الاعتماد على الصور والرسوم التوضيحية وحدها.',
        stepsHigh: ['استخدم الخرائط الذهنية دائماً', 'شاهد فيديوهات تعليمية عالية الجودة'],
        stepsLow: ['حاول تحويل النصوص إلى رسوم بيانية بسيطة', 'استخدم الألوان لتمييز المعلومات']
      },
      {
        id: 'kinesthetic',
        name: 'التعلم الحركي/العملي',
        type: 'positive',
        impactHigh: 'تتعلم بأفضل شكل من خلال التجربة والخطأ والتطبيق الفعلي.',
        impactLow: 'قد تفضل النظريات على التطبيق العملي المباشر.',
        stepsHigh: ['ركز على المشاريع العملية', 'علم الآخرين ما تعلمته لتثبيت المعلومة'],
        stepsLow: ['حاول البدء بتطبيقات صغيرة أثناء الدراسة', 'استخدم أدوات تفاعلية']
      },
      {
        id: 'auditory',
        name: 'التعلم السمعي',
        type: 'positive',
        impactHigh: 'لديك قدرة عالية على استيعاب المعلومات من خلال الاستماع والمناقشة.',
        impactLow: 'قد تفضل القراءة أو المشاهدة على الاستماع المجرد.',
        stepsHigh: ['استمع للبودكاست التعليمي', 'سجل ملاحظاتك صوتياً وراجعها'],
        stepsLow: ['حاول القراءة بصوت عالٍ', 'ناقش ما تعلمته مع الآخرين']
      }
    ]
  },
  {
    id: 'learning-habits',
    title: 'عادات الدراسة',
    iconName: 'BookOpen',
    color: 'blue',
    type: 'positive',
    questions: [
      { id: 'lh1', text: 'أخصص وقتاً ثابتاً يومياً لتعلم شيء جديد.', subCategoryId: 'consistency', options: defaultOptions },
      { id: 'lh2', text: 'أقوم بمراجعة ما تعلمته بشكل دوري (يومياً أو أسبوعياً).', subCategoryId: 'review', options: defaultOptions },
      { id: 'lh3', text: 'أحدد أهدافاً واضحة وقابلة للقياس قبل البدء في أي كورس.', subCategoryId: 'planning', options: defaultOptions },
      { id: 'lh4', text: 'أستطيع التركيز لفترات طويلة دون تشتت من الهاتف أو البيئة المحيطة.', subCategoryId: 'focus', options: defaultOptions },
      { id: 'lh5', text: 'أقوم بتدوين ملاحظات منظمة أثناء عملية التعلم.', subCategoryId: 'organization', options: defaultOptions }
    ],
    subCategoriesDef: [
      {
        id: 'consistency',
        name: 'الاستمرارية',
        type: 'positive',
        impactHigh: 'التزامك اليومي هو سر نجاحك في اكتساب المهارات.',
        impactLow: 'تحتاج إلى بناء روتين تعليمي أكثر ثباتاً.',
        stepsHigh: ['حافظ على هذا الزخم', 'ابدأ في تحديات تعلم طويلة الأمد'],
        stepsLow: ['ابدأ بـ 15 دقيقة فقط يومياً', 'استخدم تطبيقات تتبع العادات']
      },
      {
        id: 'focus',
        name: 'التركيز والبيئة',
        type: 'positive',
        impactHigh: 'قدرتك على التركيز العميق تسمح لك بتعلم مفاهيم معقدة بسرعة.',
        impactLow: 'التشتت يقلل من كفاءة وقت التعلم الخاص بك.',
        stepsHigh: ['جرب تقنيات مثل Pomodoro لزيادة الإنتاجية', 'خصص مكاناً هادئاً دائماً'],
        stepsLow: ['أغلق الإشعارات تماماً أثناء التعلم', 'استخدم سدادات أذن أو موسيقى هادئة']
      },
      {
        id: 'review',
        name: 'المراجعة الدورية',
        type: 'positive',
        impactHigh: 'مراجعتك المستمرة تضمن بقاء المعلومات في ذاكرتك طويلة المدى.',
        impactLow: 'قد تنسى المعلومات بسرعة إذا لم تراجعها بانتظام.',
        stepsHigh: ['استخدم التكرار المتباعد (Spaced Repetition)', 'لخص ما تعلمته بأسلوبك الخاص'],
        stepsLow: ['راجع ملاحظاتك في نهاية كل يوم', 'استخدم بطاقات الاستذكار (Flashcards)']
      },
      {
        id: 'planning',
        name: 'التخطيط والأهداف',
        type: 'positive',
        impactHigh: 'وضوح أهدافك يجعلك تتعلم بذكاء وفعالية أكبر.',
        impactLow: 'قد تشعر بالتشتت إذا لم تحدد أهدافاً واضحة لتعلمك.',
        stepsHigh: ['ضع أهدافاً ذكية (SMART Goals)', 'قسم الكورسات الكبيرة إلى أجزاء صغيرة'],
        stepsLow: ['حدد ما تريد تعلمه بالضبط قبل البدء', 'ضع جدولاً زمنياً واقعياً']
      },
      {
        id: 'organization',
        name: 'التنظيم والتدوين',
        type: 'positive',
        impactHigh: 'تنظيمك للمعلومات يسهل عليك الرجوع إليها واستخدامها لاحقاً.',
        impactLow: 'قد تضيع المعلومات المهمة إذا لم تدونها بشكل منظم.',
        stepsHigh: ['استخدم تطبيقات تدوين الملاحظات الرقمية', 'نظم ملفاتك التعليمية بشكل هرمي'],
        stepsLow: ['ابدأ بتدوين النقاط الرئيسية فقط', 'استخدم الرموز والألوان في ملاحظاتك']
      }
    ]
  }
];
