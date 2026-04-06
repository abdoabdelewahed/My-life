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

export const RELATIONSHIP_ASSESSMENTS: Assessment[] = [
  {
    id: 'communication',
    title: 'التواصل العاطفي',
    iconName: 'MessageCircleHeart',
    color: 'rose',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تجد صعوبة في التعبير عن مشاعرك الحقيقية لشريكك أو المقربين منك؟', subCategoryId: 'emotional_comm', options: defaultOptions },
      { id: 'q2', text: 'هل تشعر أن الطرف الآخر لا يستمع إليك أو لا يفهمك عندما تتحدث؟', subCategoryId: 'emotional_comm', options: defaultOptions },
      { id: 'q3', text: 'هل تتجنب مناقشة المواضيع الحساسة خوفاً من رد فعل الطرف الآخر؟', subCategoryId: 'emotional_comm', options: defaultOptions },
      { id: 'q4', text: 'هل تلجأ للصمت أو الانسحاب عند حدوث سوء تفاهم بدلاً من الحوار؟', subCategoryId: 'emotional_comm', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'emotional_comm',
        name: 'جودة التواصل',
        type: 'positive',
        impactHigh: 'تتمتع بقدرة ممتازة على التواصل العاطفي والتعبير عن مشاعرك بوضوح.',
        impactLow: 'هناك فجوة في التواصل العاطفي قد تؤدي إلى تراكم المشاعر السلبية وسوء الفهم.',
        stepsHigh: ['استمر في الحوار المفتوح والصادق', 'حافظ على الاستماع النشط للطرف الآخر'],
        stepsLow: ['تدرب على التعبير عن مشاعرك بكلمات واضحة (أنا أشعر بـ...)', 'خصص وقتاً للحوار الهادئ بعيداً عن المشتتات', 'تجنب افتراض ما يفكر فيه الآخر واسأله مباشرة']
      }
    ]
  },
  {
    id: 'trust',
    title: 'الثقة والغيرة',
    iconName: 'ShieldCheck',
    color: 'emerald',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر بالشك المستمر تجاه تصرفات شريكك أو أصدقائك المقربين؟', subCategoryId: 'trust_level', options: defaultOptions },
      { id: 'q2', text: 'هل تشعر بالحاجة لمراقبة هواتفهم أو حساباتهم الشخصية؟', subCategoryId: 'trust_level', options: defaultOptions },
      { id: 'q3', text: 'هل تشعر بالغيرة الشديدة عندما يقضون وقتاً مع أشخاص آخرين؟', subCategoryId: 'trust_level', options: defaultOptions },
      { id: 'q4', text: 'هل تخشى دائماً أن يتخلى عنك المقربون منك؟', subCategoryId: 'trust_level', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'trust_level',
        name: 'مستوى الثقة',
        type: 'positive',
        impactHigh: 'علاقاتك مبنية على ثقة قوية وأمان عاطفي.',
        impactLow: 'الشك والغيرة يؤثران سلباً على استقرار علاقاتك وراحتك النفسية.',
        stepsHigh: ['حافظ على مساحة الثقة المتبادلة', 'استمر في احترام خصوصية الآخرين'],
        stepsLow: ['صارح الطرف الآخر بمخاوفك بهدوء بدلاً من المراقبة', 'اعمل على تعزيز ثقتك بنفسك أولاً', 'تجنب بناء استنتاجات على افتراضات غير مؤكدة']
      }
    ]
  },
  {
    id: 'boundaries',
    title: 'الحدود الشخصية',
    iconName: 'Hand',
    color: 'amber',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تجد صعوبة في قول "لا" عندما يطلب منك الآخرون شيئاً لا تريده؟', subCategoryId: 'personal_boundaries', options: defaultOptions },
      { id: 'q2', text: 'هل تشعر أن الآخرين يتدخلون في قراراتك الشخصية بشكل مزعج؟', subCategoryId: 'personal_boundaries', options: defaultOptions },
      { id: 'q3', text: 'هل تضحي براحتك ووقتك بشكل مستمر لإرضاء الآخرين؟', subCategoryId: 'personal_boundaries', options: defaultOptions },
      { id: 'q4', text: 'هل تشعر بالذنب عندما تضع حدوداً لحماية مساحتك الشخصية؟', subCategoryId: 'personal_boundaries', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'personal_boundaries',
        name: 'احترام الحدود',
        type: 'positive',
        impactHigh: 'أنت تضع حدوداً صحية وتحافظ على مساحتك الشخصية بشكل ممتاز.',
        impactLow: 'ضعف الحدود الشخصية يجعلك عرضة للاستنزاف العاطفي والتدخلات المزعجة.',
        stepsHigh: ['استمر في حماية مساحتك الشخصية', 'حافظ على توازنك بين العطاء والاهتمام بنفسك'],
        stepsLow: ['تدرب على قول "لا" بلطف وحزم', 'حدد ما تقبله وما ترفضه بوضوح للآخرين', 'تذكر أن وضع الحدود هو حق أصيل لك وليس أنانية']
      }
    ]
  },
  {
    id: 'conflict',
    title: 'التعامل مع الخلافات',
    iconName: 'Swords',
    color: 'indigo',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تتحول النقاشات البسيطة إلى شجارات كبيرة بسرعة؟', subCategoryId: 'conflict_resolution', options: defaultOptions },
      { id: 'q2', text: 'هل تلجأ للصراخ أو توجيه اللوم الجارح عند الغضب؟', subCategoryId: 'conflict_resolution', options: defaultOptions },
      { id: 'q3', text: 'هل تستعيد أخطاء الماضي باستمرار أثناء الخلافات الحالية؟', subCategoryId: 'conflict_resolution', options: defaultOptions },
      { id: 'q4', text: 'هل ترفض الاعتذار أو الاعتراف بالخطأ حتى عندما تدرك أنك مخطئ؟', subCategoryId: 'conflict_resolution', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'conflict_resolution',
        name: 'إدارة الخلافات',
        type: 'positive',
        impactHigh: 'تدير الخلافات بنضج وتصل لحلول مرضية دون تجريح.',
        impactLow: 'طريقة إدارة الخلافات تزيد من تعقيد المشاكل وتترك أثراً سلبياً عميقاً.',
        stepsHigh: ['استمر في التركيز على الحل بدلاً من المشكلة', 'حافظ على هدوئك أثناء النقاش'],
        stepsLow: ['خذ وقتاً للهدوء قبل مناقشة المشكلة', 'ركز على المشكلة الحالية ولا تفتح ملفات الماضي', 'تعلم ثقافة الاعتذار عند الخطأ']
      }
    ]
  },
  {
    id: 'family',
    title: 'الارتباط العائلي',
    iconName: 'Home',
    color: 'blue',
    type: 'positive',
    questions: [
      { id: 'q1', text: 'هل تشعر بالتباعد العاطفي بينك وبين أفراد عائلتك؟', subCategoryId: 'family_bonds', options: defaultOptions },
      { id: 'q2', text: 'هل تتجنب التجمعات العائلية بسبب كثرة الانتقادات أو المشاكل؟', subCategoryId: 'family_bonds', options: defaultOptions },
      { id: 'q3', text: 'هل تشعر أن عائلتك لا تدعم قراراتك أو طموحاتك؟', subCategoryId: 'family_bonds', options: defaultOptions },
      { id: 'q4', text: 'هل تجد صعوبة في قضاء وقت ممتع وبدون توتر مع عائلتك؟', subCategoryId: 'family_bonds', options: defaultOptions },
    ],
    subCategoriesDef: [
      {
        id: 'family_bonds',
        name: 'الروابط الأسرية',
        type: 'positive',
        impactHigh: 'تتمتع بعلاقة أسرية دافئة وداعمة.',
        impactLow: 'هناك توتر وتباعد في العلاقات العائلية يؤثر على شعورك بالانتماء والدعم.',
        stepsHigh: ['حافظ على التواصل المستمر مع عائلتك', 'استمر في المشاركة في المناسبات العائلية الإيجابية'],
        stepsLow: ['حاول إيجاد أرضية مشتركة للحوار بعيداً عن مواضيع الخلاف', 'ضع حدوداً صحية للانتقادات دون قطع العلاقة', 'ركز على الجوانب الإيجابية في أفراد عائلتك']
      }
    ]
  }
];
