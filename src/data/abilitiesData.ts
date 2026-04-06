import React from 'react';
import { Shield, Users, Zap, Brain, Target, AlertTriangle, ShieldAlert, Compass, ClipboardCheck, Activity, Heart, MessageCircle, Lightbulb, Clock, Eye, Smile, Accessibility, Wallet, PiggyBank, TrendingUp, Smartphone, CreditCard, BookOpen, Briefcase } from 'lucide-react';

export interface Question {
  id: string;
  text: string;
  subCategoryId: string;
  options: { text: string; value: number }[];
}

export interface SubCategoryDef {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  description: string;
  iconName: string;
  impactLow: string;
  impactHigh: string;
  stepsLow: string[];
  stepsHigh: string[];
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  type?: 'positive' | 'negative';
  questions: Question[];
  subCategoriesDef: SubCategoryDef[];
}

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'traits',
    title: 'الصفات الشخصية',
    description: 'تحليل دقيق لسمات شخصيتك الأساسية بناءً على النماذج العلمية المعتمدة.',
    iconName: 'Brain',
    color: 'purple',
    type: 'positive',
    subCategoriesDef: [
      {
        id: 'openness',
        name: 'الانفتاح على التجربة',
        type: 'positive',
        description: 'مدى استعدادك لتقبل الأفكار الجديدة، والتجارب غير المألوفة، والإبداع.',
        iconName: 'Compass',
        impactLow: 'قد يؤدي انخفاض الانفتاح إلى التصلب في الرأي، وصعوبة التكيف مع التغييرات، وتفويت فرص للنمو الشخصي والمهني.',
        impactHigh: 'انفتاحك العالي يجعلك مبدعاً وقابلاً للتكيف، لكن قد يؤدي أحياناً إلى التشتت وعدم التركيز على هدف واحد.',
        stepsLow: [
          'جرب شيئاً جديداً كل أسبوع (طعام جديد، طريق مختلف للعمل).',
          'اقرأ كتاباً أو مقالاً في مجال لا تعرف عنه شيئاً.',
          'تحدث مع شخص يمتلك وجهة نظر مختلفة عنك وحاول فهمه دون إطلاق أحكام.'
        ],
        stepsHigh: [
          'استمر في استكشاف أفكار جديدة، لكن ضع أهدافاً محددة لتجنب التشتت.',
          'حاول إنهاء المشاريع التي تبدأها قبل الانتقال لفكرة جديدة.',
          'استخدم إبداعك في حل المشكلات العملية في بيئة عملك.'
        ]
      },
      {
        id: 'conscientiousness',
        name: 'الانضباط والوعي',
        type: 'positive',
        description: 'قدرتك على التنظيم، والالتزام بالمسؤوليات، والسعي نحو تحقيق الأهداف.',
        iconName: 'ClipboardCheck',
        impactLow: 'قد تعاني من الفوضى، وتأجيل المهام، وصعوبة في تحقيق أهدافك طويلة المدى مما يؤثر على نجاحك.',
        impactHigh: 'انضباطك العالي يضمن لك النجاح، لكن قد يؤدي إلى الإرهاق والمثالية المفرطة إذا لم توازن بين العمل والراحة.',
        stepsLow: [
          'استخدم قائمة مهام يومية (To-Do List) ورتبها حسب الأولوية.',
          'قسّم الأهداف الكبيرة إلى خطوات صغيرة يمكن إنجازها بسهولة.',
          'كافئ نفسك عند إنجاز المهام للتشجيع على الاستمرار.'
        ],
        stepsHigh: [
          'اسمح لنفسك ببعض المرونة ولا تكن قاسياً على نفسك عند الفشل.',
          'خصص وقتاً للراحة والاسترخاء بعيداً عن العمل والمسؤوليات.',
          'تعلم تفويض بعض المهام للآخرين ولا تحاول القيام بكل شيء بنفسك.'
        ]
      },
      {
        id: 'neuroticism',
        name: 'الاستقرار الانفعالي',
        type: 'negative',
        description: 'مدى تعرضك للمشاعر السلبية مثل القلق، الغضب، والاكتئاب في مواجهة الضغوط.',
        iconName: 'Activity',
        impactLow: 'استقرارك الانفعالي يساعدك على التعامل مع الضغوط بهدوء وعقلانية، مما يعزز صحتك النفسية وعلاقاتك.',
        impactHigh: 'الدرجة العالية تعني تفاعلاً قوياً مع الضغوط، مما قد يؤدي إلى القلق المستمر، والتوتر، والتأثير السلبي على الصحة والعلاقات.',
        stepsLow: [
          'استمر في ممارسة العادات الصحية التي تدعم استقرارك النفسي.',
          'كن داعماً للآخرين الذين يواجهون صعوبات في التحكم بمشاعرهم.',
          'تحدى نفسك في مواقف جديدة لزيادة مرونتك النفسية.'
        ],
        stepsHigh: [
          'مارس تقنيات الاسترخاء مثل التأمل والتنفس العميق يومياً.',
          'تجنب التفكير المفرط (Overthinking) وحاول التركيز على الحلول بدلاً من المشاكل.',
          'لا تتردد في طلب المساعدة من مختص نفسي إذا شعرت أن القلق يعيق حياتك.'
        ]
      }
    ],
    questions: [
      { id: 't1', text: 'أستمتع بتجربة أشياء جديدة وغير مألوفة.', subCategoryId: 'openness', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 't2', text: 'أفضل الالتزام بالروتين المعتاد على التغيير.', subCategoryId: 'openness', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 't3', text: 'لدي خيال واسع وأحب التفكير في أفكار مجردة.', subCategoryId: 'openness', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 't4', text: 'أحرص على إنجاز مهامي في الوقت المحدد بدقة.', subCategoryId: 'conscientiousness', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 't5', text: 'أجد صعوبة في الحفاظ على ترتيب أشيائي ومكاني.', subCategoryId: 'conscientiousness', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 't6', text: 'أضع خططاً طويلة المدى وألتزم بتنفيذها.', subCategoryId: 'conscientiousness', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 't7', text: 'أشعر بالتوتر والقلق بسهولة عند مواجهة المشاكل.', subCategoryId: 'neuroticism', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 't8', text: 'أستطيع الحفاظ على هدوئي حتى في المواقف الصعبة.', subCategoryId: 'neuroticism', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 't9', text: 'يتقلب مزاجي بشكل متكرر دون سبب واضح.', subCategoryId: 'neuroticism', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] }
    ]
  },
  {
    id: 'confidence',
    title: 'الثقة بالنفس',
    description: 'تقييم متعمق لمستوى إيمانك بذاتك وقدرتك على التفاعل بثقة في مختلف المواقف.',
    iconName: 'Shield',
    color: 'blue',
    type: 'positive',
    subCategoriesDef: [
      {
        id: 'self_esteem',
        name: 'تقدير الذات',
        type: 'positive',
        description: 'مدى احترامك وقبولك لنفسك، وإيمانك بقيمتك كشخص.',
        iconName: 'Heart',
        impactLow: 'انخفاض تقدير الذات يجعلك عرضة للشك المستمر في قدراتك، والرضا بالقليل، والشعور بعدم الاستحقاق للنجاح أو السعادة.',
        impactHigh: 'تقدير الذات العالي يمنحك سلاماً داخلياً وقدرة على وضع حدود صحية، مما ينعكس إيجاباً على كل جوانب حياتك.',
        stepsLow: [
          'توقف عن مقارنة نفسك بالآخرين؛ رحلتك فريدة.',
          'اكتب 3 أشياء إيجابية عن نفسك يومياً.',
          'سامح نفسك على أخطاء الماضي وتعلم منها بدلاً من جلد الذات.'
        ],
        stepsHigh: [
          'استمر في تعزيز صورتك الإيجابية عن نفسك.',
          'ساعد الآخرين على رؤية قيمتهم الحقيقية وبناء تقديرهم لذواتهم.',
          'تحدى نفسك في مجالات جديدة لزيادة ثقتك بقدراتك.'
        ]
      },
      {
        id: 'social_confidence',
        name: 'الثقة الاجتماعية',
        type: 'positive',
        description: 'قدرتك على التفاعل مع الآخرين براحة، والتعبير عن رأيك دون خوف من أحكامهم.',
        iconName: 'Users',
        impactLow: 'قد تتجنب المواقف الاجتماعية، وتجد صعوبة في بناء علاقات جديدة، وتكتم آراءك خوفاً من الرفض أو النقد.',
        impactHigh: 'تتمتع بقدرة عالية على بناء شبكات علاقات قوية، والتأثير في الآخرين، والتعبير عن نفسك بوضوح وجرأة.',
        stepsLow: [
          'ابدأ بمحادثات صغيرة مع أشخاص مألوفين وتدرج نحو الغرباء.',
          'تدرب على التعبير عن رأيك في مواقف بسيطة وغير خلافية.',
          'تذكر أن معظم الناس يركزون على أنفسهم وليس على أخطائك.'
        ],
        stepsHigh: [
          'استخدم ثقتك الاجتماعية لدعم الأشخاص الخجولين أو الجدد في مجموعتك.',
          'تولى أدواراً قيادية أو تحدث أمام الجمهور لتطوير مهاراتك.',
          'كن مستمعاً جيداً بقدر ما أنت متحدث لبق.'
        ]
      },
      {
        id: 'resilience',
        name: 'المرونة النفسية',
        type: 'positive',
        description: 'قدرتك على التعافي من الانتكاسات، والتكيف مع التغييرات والصدمات.',
        iconName: 'Zap',
        impactLow: 'قد تستغرق وقتاً طويلاً للتعافي من الفشل، وتستسلم بسهولة عند مواجهة العقبات، مما يعيق تقدمك.',
        impactHigh: 'تستطيع تحويل المحن إلى منح، وتتعلم من الفشل بسرعة، وتعود أقوى بعد كل تحدٍ.',
        stepsLow: [
          'انظر للفشل كفرصة للتعلم وليس كحكم نهائي على قدراتك.',
          'ركز على ما يمكنك التحكم فيه بدلاً من القلق بشأن ما هو خارج سيطرتك.',
          'ابحث عن الدعم من الأصدقاء أو العائلة عند المرور بأوقات صعبة.'
        ],
        stepsHigh: [
          'شارك قصص نجاحك وتجاوزك للصعاب لإلهام الآخرين.',
          'استمر في تحدي نفسك للخروج من منطقة الراحة لبناء مرونة أكبر.',
          'حافظ على نظرة متفائلة وواقعية للمستقبل.'
        ]
      }
    ],
    questions: [
      { id: 'c1', text: 'أشعر أنني شخص ذو قيمة وأستحق الاحترام.', subCategoryId: 'self_esteem', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 'c2', text: 'أقسو على نفسي كثيراً عندما أخطئ.', subCategoryId: 'self_esteem', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 'c3', text: 'أتقبل عيوبي وأعمل على تحسينها دون كراهية للذات.', subCategoryId: 'self_esteem', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 'c4', text: 'أشعر بالتوتر الشديد عند التحدث أمام مجموعة من الناس.', subCategoryId: 'social_confidence', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 'c5', text: 'أستطيع بدء محادثة مع شخص غريب بسهولة.', subCategoryId: 'social_confidence', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 'c6', text: 'أعبر عن رأيي حتى لو كان مختلفاً عن رأي الأغلبية.', subCategoryId: 'social_confidence', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 'c7', text: 'أستطيع تجاوز خيبات الأمل والعودة لحياتي الطبيعية بسرعة.', subCategoryId: 'resilience', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 'c8', text: 'أستسلم بسهولة عندما تواجهني عقبات غير متوقعة.', subCategoryId: 'resilience', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 'c9', text: 'أرى في التحديات الصعبة فرصة للنمو والتطور.', subCategoryId: 'resilience', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] }
    ]
  },
  {
    id: 'skills',
    title: 'المهارات الحياتية',
    description: 'تقييم لمهاراتك الحياتية والعملية الأساسية التي تضمن لك النجاح والتفوق.',
    iconName: 'Target',
    color: 'emerald',
    type: 'positive',
    subCategoriesDef: [
      {
        id: 'communication',
        name: 'التواصل الفعال',
        type: 'positive',
        description: 'قدرتك على إيصال أفكارك بوضوح، والاستماع للآخرين، وفهم لغة الجسد.',
        iconName: 'MessageCircle',
        impactLow: 'ضعف التواصل يؤدي إلى سوء الفهم، النزاعات المتكررة، وضياع الفرص المهنية والشخصية.',
        impactHigh: 'تواصلك الفعال يجعلك قائداً مؤثراً، ومفاوضاً ناجحاً، ويبني لك علاقات قوية ومستدامة.',
        stepsLow: [
          'تدرب على الاستماع النشط: استمع لتفهم وليس لترد.',
          'فكر قبل أن تتحدث ورتب أفكارك بوضوح.',
          'انتبه للغة جسدك ونبرة صوتك أثناء الحديث.'
        ],
        stepsHigh: [
          'طور مهاراتك في الإقناع والتفاوض.',
          'تعلم كيفية تقديم ملاحظات بناءة (Feedback) للآخرين.',
          'شارك في نقاشات معقدة لتحدي قدراتك التواصلية.'
        ]
      },
      {
        id: 'problem_solving',
        name: 'حل المشكلات',
        type: 'positive',
        description: 'قدرتك على تحليل المواقف المعقدة، إيجاد حلول مبتكرة، واتخاذ قرارات صائبة.',
        iconName: 'Lightbulb',
        impactLow: 'قد تشعر بالعجز أمام التحديات، وتعتمد على الآخرين لحل مشاكلك، مما يحد من استقلاليتك وتطورك.',
        impactHigh: 'أنت قادر على تحويل العقبات إلى فرص، وتتخذ قرارات مبنية على تحليل منطقي، مما يجعلك شخصاً يعتمد عليه.',
        stepsLow: [
          'عند مواجهة مشكلة، حدد جذورها أولاً قبل البحث عن حلول.',
          'اكتب كل الحلول الممكنة (العصف الذهني) قبل اختيار الأفضل.',
          'لا تخف من طلب المشورة من أصحاب الخبرة.'
        ],
        stepsHigh: [
          'استخدم التفكير التصميمي (Design Thinking) لحل المشكلات المعقدة.',
          'توقع المشاكل قبل حدوثها وضع خططاً بديلة (Plan B).',
          'درب الآخرين على منهجيات حل المشكلات.'
        ]
      },
      {
        id: 'time_management',
        name: 'إدارة الوقت',
        type: 'positive',
        description: 'قدرتك على تنظيم وقتك، تحديد الأولويات، والالتزام بالمواعيد النهائية.',
        iconName: 'Clock',
        impactLow: 'سوء إدارة الوقت يؤدي إلى التوتر المستمر، تفويت المواعيد، وضعف الإنتاجية، والشعور الدائم بالتقصير.',
        impactHigh: 'إدارتك الجيدة للوقت تمنحك توازناً بين العمل والحياة، وتزيد من إنتاجيتك دون إرهاق.',
        stepsLow: [
          'استخدم مصفوفة أيزنهاور لتحديد الأولويات (هام وعاجل).',
          'حدد وقتاً زمنياً لكل مهمة والتزم به (Time Blocking).',
          'تخلص من المشتتات (مثل الهاتف) أثناء فترات العمل العميق.'
        ],
        stepsHigh: [
          'راجع خططك أسبوعياً لتحسين كفاءتك.',
          'تعلم قول "لا" للمهام التي لا تخدم أهدافك الرئيسية.',
          'استخدم أدوات التكنولوجيا لأتمتة المهام الروتينية.'
        ]
      }
    ],
    questions: [
      { id: 's1', text: 'أستمع للآخرين باهتمام دون مقاطعتهم.', subCategoryId: 'communication', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 's2', text: 'أجد صعوبة في التعبير عن أفكاري بوضوح.', subCategoryId: 'communication', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 's3', text: 'أستطيع قراءة لغة جسد الآخرين وفهم مشاعرهم غير المعلنة.', subCategoryId: 'communication', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 's4', text: 'عندما أواجه مشكلة، أقوم بتحليل أسبابها قبل القفز للحلول.', subCategoryId: 'problem_solving', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 's5', text: 'أشعر بالارتباك والعجز عند مواجهة مشكلة معقدة.', subCategoryId: 'problem_solving', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 's6', text: 'أستطيع إيجاد حلول إبداعية وغير تقليدية للمشاكل.', subCategoryId: 'problem_solving', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 's7', text: 'أخطط ليومي مسبقاً وأحدد أهم المهام لإنجازها.', subCategoryId: 'time_management', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 's8', text: 'أؤجل المهام الصعبة حتى اللحظة الأخيرة.', subCategoryId: 'time_management', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 's9', text: 'أستطيع تقدير الوقت اللازم لإنجاز المهام بدقة.', subCategoryId: 'time_management', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] }
    ]
  },
  {
    id: 'financial_capability',
    title: 'القدرة المالية الحديثة',
    description: 'تقييم شامل لوعيك المالي، عادات الإنفاق، التوفير، الاستثمار، والتعامل مع التكنولوجيا المالية والديون.',
    iconName: 'Wallet',
    color: 'emerald',
    type: 'positive',
    subCategoriesDef: [
      {
        id: 'budgeting',
        name: 'إدارة الميزانية',
        type: 'positive',
        description: 'قدرتك على تتبع مصاريفك، والالتزام بميزانية محددة.',
        iconName: 'ClipboardCheck',
        impactLow: 'ضعف إدارة الميزانية يؤدي إلى تراكم الديون، وعدم القدرة على تلبية الاحتياجات الأساسية.',
        impactHigh: 'إدارة ميزانيتك بذكاء تمنحك تحكماً كاملاً في أموالك وتزيد من فرصك في التوفير.',
        stepsLow: ['ابدأ بتسجيل كل قرش تنفقه لمدة شهر.', 'استخدم تطبيقات الميزانية لتصنيف مصاريفك.', 'قلل من المصاريف غير الضرورية.'],
        stepsHigh: ['استمر في مراجعة ميزانيتك شهرياً.', 'ضع أهدافاً مالية واضحة.', 'استثمر الفائض من ميزانيتك.']
      },
      {
        id: 'saving',
        name: 'عادات التوفير',
        type: 'positive',
        description: 'مدى التزامك بتخصيص جزء من دخلك للمستقبل.',
        iconName: 'PiggyBank',
        impactLow: 'عدم التوفير يجعلك عرضة للأزمات المالية عند حدوث طوارئ.',
        impactHigh: 'التوفير المستمر يبني لك شبكة أمان مالية ويحقق لك الحرية المالية.',
        stepsLow: ['ادخر 10% من دخلك فور استلامه.', 'افتح حساب توفير منفصل.', 'ابدأ بصندوق طوارئ صغير.'],
        stepsHigh: ['زد نسبة التوفير تدريجياً.', 'استثمر مدخراتك بدلاً من تركها في الحساب.', 'علم أفراد عائلتك أهمية التوفير.']
      },
      {
        id: 'investing',
        name: 'الوعي الاستثماري',
        type: 'positive',
        description: 'قدرتك على فهم واستثمار أموالك لتنميتها.',
        iconName: 'TrendingUp',
        impactLow: 'إهمال الاستثمار يقلل من قيمة أموالك بسبب التضخم.',
        impactHigh: 'الاستثمار الذكي يضاعف ثروتك على المدى الطويل.',
        stepsLow: ['اقرأ كتباً عن أساسيات الاستثمار.', 'ابدأ باستثمارات منخفضة المخاطر.', 'لا تستثمر في شيء لا تفهمه.'],
        stepsHigh: ['نوع محفظتك الاستثمارية.', 'تابع الأسواق المالية بانتظام.', 'استشر خبراء ماليين لتعظيم عوائدك.']
      },
      {
        id: 'digital_finance',
        name: 'التمويل الرقمي',
        type: 'positive',
        description: 'مدى مهارتك في استخدام الأدوات المالية الرقمية والتطبيقات.',
        iconName: 'Smartphone',
        impactLow: 'صعوبة استخدام الأدوات الرقمية تجعل إدارة أموالك بطيئة وغير آمنة.',
        impactHigh: 'إتقان التمويل الرقمي يسهل عليك إدارة أموالك، ويزيد من أمان معاملاتك.',
        stepsLow: ['تعلم استخدام تطبيق البنك الخاص بك.', 'فعل خاصية التحقق بخطوتين في تطبيقاتك المالية.', 'تجنب مشاركة بياناتك البنكية مع أي شخص.'],
        stepsHigh: ['استخدم المحافظ الرقمية لتسهيل الدفع.', 'تابع أحدث اتجاهات التكنولوجيا المالية.', 'احمِ أجهزتك ببرامج حماية قوية.']
      },
      {
        id: 'debt_management',
        name: 'إدارة الديون',
        type: 'positive',
        description: 'قدرتك على فهم الديون وإدارتها بذكاء.',
        iconName: 'CreditCard',
        impactLow: 'الديون غير المدروسة تستهلك دخلك وتعيق نموك المالي.',
        impactHigh: 'إدارة الديون بذكاء تخلصك من الأعباء المالية وتزيد من قدرتك على الاستثمار.',
        stepsLow: ['افهم أسعار الفائدة على ديونك.', 'ابدأ بسداد الديون ذات الفائدة الأعلى أولاً.', 'تجنب الاقتراض لشراء أشياء غير ضرورية.'],
        stepsHigh: ['أعد جدولة ديونك لتقليل الفوائد.', 'حافظ على سجل ائتماني جيد.', 'لا تزيد من ديونك إلا للضرورة القصوى.']
      },
      {
        id: 'financial_literacy',
        name: 'الثقافة المالية',
        type: 'positive',
        description: 'مدى فهمك للمفاهيم المالية مثل التضخم، الضرائب، والأسواق.',
        iconName: 'BookOpen',
        impactLow: 'نقص الثقافة المالية يجعلك عرضة للقرارات المالية الخاطئة.',
        impactHigh: 'الثقافة المالية العالية تمكنك من اتخاذ قرارات مالية صائبة ومستنيرة.',
        stepsLow: ['اقرأ مقالات مالية أسبوعياً.', 'تابع أخبار الاقتصاد البسيطة.', 'تعلم الفرق بين الأصول والخصوم.'],
        stepsHigh: ['احضر دورات متقدمة في الاقتصاد.', 'فهم تأثير الضرائب على استثماراتك.', 'شارك معرفتك المالية مع الآخرين.']
      }
    ],
    questions: [
      { id: 'f1', text: 'أقوم بتسجيل مصاريفي اليومية بانتظام.', subCategoryId: 'budgeting', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 'f2', text: 'أجد صعوبة في الالتزام بميزانية شهرية.', subCategoryId: 'budgeting', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 'f3', text: 'أعرف بالضبط أين تذهب أموالي كل شهر.', subCategoryId: 'budgeting', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 'f4', text: 'أقوم بتخصيص جزء من دخلي للتوفير قبل الإنفاق.', subCategoryId: 'saving', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 'f5', text: 'لا أملك أي مدخرات للطوارئ.', subCategoryId: 'saving', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 'f6', text: 'أشعر بالأمان المالي لوجود مدخرات كافية.', subCategoryId: 'saving', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 'f7', text: 'أفهم أساسيات الاستثمار والمخاطر المرتبطة به.', subCategoryId: 'investing', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 'f8', text: 'أخاف من الاستثمار وأفضل ترك أموالي في الحساب البنكي.', subCategoryId: 'investing', options: [{ text: 'نعم', value: 0 }, { text: 'لا', value: 100 }] },
      { id: 'f9', text: 'أقوم باستثمار جزء من أموالي لتنميتها.', subCategoryId: 'investing', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 'f10', text: 'أستخدم تطبيقات البنك بانتظام لإدارة حساباتي.', subCategoryId: 'digital_finance', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 'f11', text: 'أهتم بتأمين حساباتي المالية الرقمية بكلمات مرور قوية.', subCategoryId: 'digital_finance', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 'f12', text: 'أفهم جيداً كيف تعمل الفوائد على الديون.', subCategoryId: 'debt_management', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 'f13', text: 'أحاول سداد ديوني في أسرع وقت ممكن.', subCategoryId: 'debt_management', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      
      { id: 'f14', text: 'أفهم كيف يؤثر التضخم على قيمة أموالي.', subCategoryId: 'financial_literacy', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] },
      { id: 'f15', text: 'أتابع أخبار الاقتصاد والأسواق المالية بشكل عام.', subCategoryId: 'financial_literacy', options: [{ text: 'نعم', value: 100 }, { text: 'لا', value: 0 }] }
    ]
  }
];
