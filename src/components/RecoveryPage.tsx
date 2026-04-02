import { ImprovementPhase } from './ImprovementPhase';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
const { 
  Heart, Zap, Wallet, Users, Brain, ArrowRight, 
  CheckCircle2, AlertCircle, ChevronRight, ShieldAlert, 
  Sparkles, Activity, Target, RefreshCw, ArrowLeft, Flame, Play, Crown, X, RotateCcw, Rocket, Moon, Star, Shield, Smartphone, EyeOff, Coffee
} = Lucide;
import { playPop, playLevelUp } from '../utils/sounds';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';

type View = 'test_selection' | 'test' | 'area_result' | 'results' | 'review' | 'routine';
type TestType = 'simple' | 'comprehensive';

interface Option {
  text: string;
  isBad: boolean;
  habitName?: string;
  recoveryStep?: string;
  punishment?: string;
  harm?: string;
  repentance?: string;
  benefit?: string;
  consistency?: string;
  areaId?: string;
}

interface Question {
  text: string;
  options: Option[];
}

interface LifeArea {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  topics: string[];
  questions: Question[];
}

const RECOVERY_AREAS: LifeArea[] = [
  {
    id: 'digital_recovery',
    title: 'التعافي الرقمي',
    description: 'تقييم مدى تحررك من الإدمان الرقمي والمحتوى الضار',
    icon: Smartphone,
    color: 'text-blue-500',
    bg: 'bg-blue-500',
    topics: ['الإدمان الرقمي', 'المحتوى الإباحي', 'التشتت الرقمي', 'وقت الشاشة'],
    questions: [
      {
        text: 'كيف هو تعاملك مع المحتوى الإباحي؟',
        options: [
          { text: 'متحرر تماماً ولله الحمد', isBad: false, habitName: 'العفة والتحرر الرقمي', consistency: 'استمر في تقوية وازعك الديني وتجنب الخلوة مع الأجهزة.', benefit: 'يمنحك صفاءً ذهنياً، وقوة في الذاكرة، واستقراراً نفسياً كبيراً.', areaId: 'digital_recovery' },
          { text: 'أشاهد أحياناً وأحاول التوقف', isBad: true, habitName: 'مشاهدة المحتوى الضار', recoveryStep: 'استخدم برامج الحجب، واشغل وقتك بهوايات حركية، ولا تستسلم للانتكاسات.', harm: 'يدمر خلايا الدماغ، ويضعف الإرادة، ويشوه النظرة الفطرية للعلاقات.', repentance: 'التوبة تبدأ بالندم، وقطع سبل الوصول للمحتوى، واللجوء إلى الله بالدعاء.', areaId: 'digital_recovery' },
          { text: 'أشاهد بشكل مستمر وأجد صعوبة في التوقف', isBad: true, habitName: 'إدمان المحتوى الإباحي', recoveryStep: 'تحتاج لخطة تعافي صارمة، انضم لمجموعات دعم، وتخلص من المحفزات فوراً.', harm: 'يسبب الاكتئاب، والعزلة الاجتماعية، وضعفاً شديداً في التركيز والإنجاز.', repentance: 'التوبة النصوح تتطلب عزماً أكيداً، وتغييراً جذرياً في نمط الحياة اليومي.', areaId: 'digital_recovery' }
        ]
      },
      {
        text: 'كم تقضي من الوقت على وسائل التواصل الاجتماعي؟',
        options: [
          { text: 'أقل من ساعتين وبشكل هادف', isBad: false, habitName: 'الاستخدام الواعي للتقنية', consistency: 'حدد أوقاتاً معينة للتصفح ولا تجعلها أول ما تفعله عند الاستيقاظ.', benefit: 'يحفظ وقتك للإنجاز، ويقلل من التشتت والمقارنات الاجتماعية غير العادلة.', areaId: 'digital_recovery' },
          { text: 'أقضي وقتاً طويلاً يشتتني عن مهامي', isBad: true, habitName: 'التشتت الرقمي', recoveryStep: 'فعل خاصية "وقت الشاشة"، واحذف التطبيقات غير الضرورية.', harm: 'يستنزف طاقتك الذهنية، ويقلل من جودة علاقاتك الواقعية.', repentance: 'التزم بورد يومي للقراءة أو الذكر بعيداً عن الهاتف لاستعادة توازنك.', areaId: 'digital_recovery' },
          { text: 'أقضي معظم يومي في التصفح بلا هدف', isBad: true, habitName: 'إدمان التواصل الاجتماعي', recoveryStep: 'قم بعمل "ديتوكس رقمي" لمدة يومين أسبوعياً، واستبدل الهاتف بكتب ورقية.', harm: 'يؤدي لضعف النظر، وآلام الرقبة، والشعور الدائم بالدونية والقلق.', repentance: 'استغفر عن تضييع العمر فيما لا ينفع، وابدأ بتنظيم وقتك بجدية.', areaId: 'digital_recovery' }
        ]
      }
    ]
  },
  {
    id: 'physical_recovery',
    title: 'التعافي الجسدي',
    description: 'تقييم جودة نومك، تغذيتك، ونشاطك البدني',
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    topics: ['جودة النوم', 'النشاط البدني', 'التغذية الصحية', 'الطاقة الحيوية'],
    questions: [
      {
        text: 'كيف هو نظام نومك اليومي؟',
        options: [
          { text: 'أنام مبكراً وأحصل على 7-8 ساعات', isBad: false, habitName: 'النوم الصحي المنتظم', consistency: 'حافظ على روتين ما قبل النوم بعيداً عن الشاشات بـ 30 دقيقة.', benefit: 'يحسن المزاج، يقوي المناعة، ويزيد من قدرتك على التركيز والإبداع.', areaId: 'physical_recovery' },
          { text: 'نومي غير منتظم وأسهر كثيراً', isBad: true, habitName: 'السهر واضطراب النوم', recoveryStep: 'حاول تقديم موعد نومك 15 دقيقة كل يوم حتى تصل للوقت المثالي.', harm: 'يسبب الإجهاد المزمن، ويضعف الذاكرة، ويزيد من احتمالية السمنة.', repentance: 'النوم آية من آيات الله، فاحترم حاجة جسدك للراحة لتتمكن من عبادته بنشاط.', areaId: 'physical_recovery' },
          { text: 'أعاني من أرق شديد ونومي متقطع جداً', isBad: true, habitName: 'الأرق المزمن', recoveryStep: 'تجنب الكافيين بعد الظهر، ومارس تمارين الاسترخاء قبل النوم.', harm: 'يؤثر سلباً على الصحة النفسية والجسدية على المدى الطويل.', repentance: 'استعن بالأذكار قبل النوم، واجعل قلبك مطمئناً بذكر الله لتنعم بنوم هادئ.', areaId: 'physical_recovery' }
        ]
      },
      {
        text: 'ما هو حال نشاطك البدني وحركتك؟',
        options: [
          { text: 'أمارس الرياضة بانتظام (3 مرات أسبوعياً)', isBad: false, habitName: 'النشاط البدني المستمر', consistency: 'نوع في تمارينك بين الكارديو والمقاومة لضمان صحة شاملة.', benefit: 'يفرز هرمونات السعادة، ويحمي من الأمراض المزمنة، ويزيد الثقة بالنفس.', areaId: 'physical_recovery' },
          { text: 'حركتي قليلة وأقضي وقتاً طويلاً جالساً', isBad: true, habitName: 'الخمول البدني', recoveryStep: 'ابدأ بالمشي 15 دقيقة يومياً، واستخدم الدرج بدلاً من المصعد.', harm: 'يسبب تيبس المفاصل، وضعف العضلات، وبطء عملية الحرق.', repentance: 'المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، فحافظ على قوتك.', areaId: 'physical_recovery' },
          { text: 'لا أمارس أي نشاط بدني على الإطلاق', isBad: true, habitName: 'نمط الحياة الخامل', recoveryStep: 'اشترك في نادي رياضي أو ابحث عن شريك للمشي لتحفيز نفسك.', harm: 'يزيد من مخاطر أمراض القلب والسكري والاكتئاب.', repentance: 'جسدك أمانة عندك، فحافظ عليه ليكون عوناً لك في طاعة الله.', areaId: 'physical_recovery' }
        ]
      }
    ]
  },
  {
    id: 'mental_health',
    title: 'الصحة النفسية',
    description: 'تقييم شامل لاستقرارك النفسي، جلد الذات، وإدارة الضغوط',
    icon: Brain,
    color: 'text-purple-500',
    bg: 'bg-purple-500',
    topics: ['جلد الذات', 'الأفكار السلبية', 'إدارة الضغوط', 'المرونة النفسية', 'تقدير الذات', 'القلق والتوتر'],
    questions: [
      {
        text: 'كيف تتعامل مع الأفكار السلبية والتشاؤم؟',
        options: [
          { text: 'أحاول دائماً التفاؤل وإحسان الظن بالله', isBad: false, habitName: 'التفاؤل وإحسان الظن', consistency: 'مارس الامتنان يومياً بكتابة 3 نعم أنعم الله بها عليك.', benefit: 'يجلب الرزق، ويفتح أبواب الأمل، ويجعلك شخصاً محبوباً وإيجابياً.', areaId: 'mental_health' },
          { text: 'تسيطر علي الأفكار السلبية أحياناً', isBad: true, habitName: 'التفكير السلبي العارض', recoveryStep: 'استبدل كل فكرة سلبية بفكرة إيجابية فوراً، واستعذ بالله من الشيطان.', harm: 'يسبب القلق والتوتر غير المبرر، ويقلل من جودة حياتك.', repentance: 'الزم الاستغفار، فإنه يزيل الهموم ويشرح الصدور.', areaId: 'mental_health' },
          { text: 'أعيش في حالة دائمة من الإحباط واليأس', isBad: true, habitName: 'اليأس والإحباط المزمن', recoveryStep: 'تحدث مع مختص نفسي، واقترب من الصالحين والمتفائلين.', harm: 'قد يؤدي للاكتئاب الحاد وفقدان الشغف بالحياة تماماً.', repentance: 'قال تعالى: (ولا تيأسوا من روح الله)، فباب الأمل دائماً مفتوح.', areaId: 'mental_health' }
        ]
      },
      {
        text: 'كيف تدير ضغوط الحياة والعمل؟',
        options: [
          { text: 'أنظم وقتي وأواجه الضغوط بهدوء', isBad: false, habitName: 'إدارة الضغوط بفعالية', consistency: 'تعلم مهارات التفويض وقول "لا" للمهام التي تفوق طاقتك.', benefit: 'يحميك من الاحتراق النفسي، ويزيد من إنتاجيتك وجودة عملك.', areaId: 'mental_health' },
          { text: 'أشعر بالضغط والتوتر أغلب الوقت', isBad: true, habitName: 'التوتر المزمن', recoveryStep: 'مارس تمارين التنفس، وخذ فترات راحة قصيرة خلال العمل.', harm: 'يؤثر على ضغط الدم، ويسبب الصداع المستمر وضعف التركيز.', repentance: 'توكل على الله حق التوكل، واعلم أن ما أصابك لم يكن ليخطئك.', areaId: 'mental_health' },
          { text: 'أنفجر غضباً أو أنهار تحت أدنى ضغط', isBad: true, habitName: 'ضعف المرونة النفسية', recoveryStep: 'تعلم مهارات الذكاء العاطفي، ومارس رياضة تفرغ فيها طاقتك.', harm: 'يدمر علاقاتك الاجتماعية والمهنية، ويؤذيك جسدياً ونفسياً.', repentance: 'الزم الحلم والأناة، واقتدِ بالنبي ﷺ في هدوئه وصبره.', areaId: 'mental_health' }
        ]
      },
      {
        text: 'كيف تتعامل مع أخطائك الماضية؟ (جلد الذات)',
        options: [
          { text: 'أتعلم منها وأسامح نفسي', isBad: false, habitName: 'الرفق بالذات والتعلم', consistency: 'تذكر أن الخطأ جزء من الطبيعة البشرية، والمهم هو الاستغفار والمضي قدماً.', benefit: 'يمنحك سلاماً داخلياً وطاقة للبدء من جديد دون أثقال.', areaId: 'mental_health' },
          { text: 'ألوم نفسي كثيراً وأشعر بالذنب المستمر', isBad: true, habitName: 'جلد الذات واللوم', recoveryStep: 'مارس تمارين التقبل، واعلم أن التوبة تجب ما قبلها.', harm: 'يستنزف طاقتك النفسية ويمنعك من التطور والإنجاز.', repentance: 'استغفر الله واعلم أن رحمته وسعت كل شيء، فلا تضيق على نفسك.', areaId: 'mental_health' },
          { text: 'أشعر أنني لا أستحق النجاح بسبب ماضيّ', isBad: true, habitName: 'عقدة الذنب المعطلة', recoveryStep: 'تحدث مع مستشار نفسي، واكتب إنجازاتك الحالية لتعزيز ثقتك.', harm: 'يدمر تقديرك لذاتك ويجعلك عرضة للاكتئاب والعزلة.', repentance: 'الله يحب التوابين، فكن منهم وثق في كرمه وفضله.', areaId: 'mental_health' }
        ]
      },
      {
        text: 'ما مدى شعورك بقيمة نفسك وتقديرك لذاتك؟',
        options: [
          { text: 'أقدر نفسي وأعرف نقاط قوتي', isBad: false, habitName: 'تقدير الذات الإيجابي', consistency: 'استمر في تطوير مهاراتك والاحتفاء بإنجازاتك الصغيرة.', benefit: 'يعزز الثقة بالنفس ويجعلك أكثر قدرة على مواجهة التحديات.', areaId: 'mental_health' },
          { text: 'أقارن نفسي بالآخرين وأشعر بالنقص', isBad: true, habitName: 'المقارنة الاجتماعية الهدامة', recoveryStep: 'توقف عن متابعة الحسابات التي تسبب لك هذا الشعور، وركز على رحلتك الخاصة.', harm: 'يقتل الإبداع ويولد الحقد والغيرة وعدم الرضا.', repentance: 'ارصَ بما قسم الله لك تكن أغنى الناس، واشكر الله على نعمه.', areaId: 'mental_health' },
          { text: 'أشعر بالفشل الدائم وانعدام القيمة', isBad: true, habitName: 'انعدام تقدير الذات', recoveryStep: 'ابدأ بمهام صغيرة جداً وأنجزها، واطلب الدعم من المقربين.', harm: 'يؤدي للعزلة واليأس وفقدان الرغبة في المحاولة.', repentance: 'أنت مكرم عند الله، فاستمد قيمتك من عبوديتك له لا من آراء الناس.', areaId: 'mental_health' }
        ]
      },
      {
        text: 'كيف هو حال هدوئك النفسي وسكينتك؟',
        options: [
          { text: 'أشعر بالسكينة والرضا أغلب الوقت', isBad: false, habitName: 'السكينة النفسية والرضا', consistency: 'حافظ على وردك اليومي من الذكر والتأمل في ملكوت الله.', benefit: 'يمنحك قوة في مواجهة الصعاب ويجعل حياتك أكثر بركة.', areaId: 'mental_health' },
          { text: 'أعاني من القلق والتوتر بشأن المستقبل', isBad: true, habitName: 'القلق المستقبلي', recoveryStep: 'ركز على يومك الحالي، وتوكل على الله، ومارس تمارين الاسترخاء.', harm: 'يسرق منك متعة الحاضر ويضعف مناعتك الجسدية والنفسية.', repentance: 'اعلم أن الأرزاق بيد الله، فاسترح من الهم والتدبير.', areaId: 'mental_health' },
          { text: 'أشعر بالخوف الدائم والارتباك من أبسط الأمور', isBad: true, habitName: 'الاضطراب النفسي والقلق الحاد', recoveryStep: 'تحتاج لاستشارة مختص، وحاول ممارسة الرياضة لتقليل هرمونات التوتر.', harm: 'يعطل حياتك اليومية ويمنعك من التواصل الفعال مع الآخرين.', repentance: 'أكثر من قول "حسبي الله ونعم الوكيل" لزرع الطمأنينة في قلبك.', areaId: 'mental_health' }
        ]
      }
    ]
  },
  {
    id: 'spiritual_recovery',
    title: 'التعافي الروحي',
    description: 'تقييم مدى اتصالك بالله وسلامة قلبك',
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-500',
    topics: ['حضور القلب', 'دوام الذكر', 'سلامة الصدر', 'الخشوع'],
    questions: [
      {
        text: 'ما هو حال قلبك مع ذكر الله؟',
        options: [
          { text: 'لساني رطب بذكر الله وقلبي حاضر', isBad: false, habitName: 'دوام الذكر وحضور القلب', consistency: 'حافظ على أذكار الصباح والمساء، واجعل لك ورداً من القرآن.', benefit: 'يطرد الشيطان، ويرضي الرحمن، ويزيل الهم والغم عن القلب.', areaId: 'spiritual_recovery' },
          { text: 'أذكر الله أحياناً وأغفل أحياناً كثيرة', isBad: true, habitName: 'الغفلة عن الذكر', recoveryStep: 'ضع منبهاً للأذكار، واصحب رفقة صالحة تذكرك بالله.', harm: 'يقسي القلب، ويجعل الإنسان عرضة لوساوس الشيطان.', repentance: 'جدد إيمانك بكثرة قول "لا إله إلا الله"، واستغفر الله من غفلتك.', areaId: 'spiritual_recovery' },
          { text: 'أشعر بقسوة في قلبي وبعد عن الله', isBad: true, habitName: 'قسوة القلب والبعد عن الله', recoveryStep: 'أكثر من الاستغفار، وزر القبور، وأطعم المساكين ليلين قلبك.', harm: 'أبعد القلوب عن الله القلب القاسي، وهو سبب لكل شقاء.', repentance: 'تب إلى الله توبة صادقة، واعلم أن الله يفرح بتوبة عبده.', areaId: 'spiritual_recovery' }
        ]
      }
    ]
  },
  {
    id: 'social_recovery',
    title: 'التعافي الاجتماعي',
    description: 'تقييم جودة علاقاتك ومدى قدرتك على وضع حدود صحية',
    icon: Users,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500',
    topics: ['الحدود الصحية', 'العلاقات السامة', 'الاندماج الاجتماعي', 'مهارات التواصل'],
    questions: [
      {
        text: 'كيف تصف علاقاتك مع المحيطين بك؟',
        options: [
          { text: 'علاقات صحية وداعمة ولدي حدود واضحة', isBad: false, habitName: 'العلاقات الصحية والحدود', consistency: 'استمر في اختيار الرفقة الصالحة التي تعينك على الخير.', benefit: 'يوفر لك بيئة آمنة للنمو ويقلل من الدراما والتوتر الاجتماعي.', areaId: 'social_recovery' },
          { text: 'أعاني من بعض العلاقات السامة التي ترهقني', isBad: true, habitName: 'العلاقات المرهقة', recoveryStep: 'تعلم مهارة قول "لا"، وقلل الاحتكاك بالأشخاص السلبيين.', harm: 'يؤثر على صحتك النفسية ويشتت تركيزك عن أهدافك الشخصية.', repentance: 'اعتذر لنفسك عن تضييع وقتك مع من لا يقدرك، وابحث عن بيئة أفضل.', areaId: 'social_recovery' },
          { text: 'أميل للعزلة وتجنب الناس تماماً خوفاً من الأذى', isBad: true, habitName: 'العزلة الاجتماعية الدفاعية', recoveryStep: 'ابدأ بالاندماج التدريجي في أنشطة جماعية هادفة.', harm: 'يؤدي لفقدان المهارات الاجتماعية والشعور بالوحدة القاتلة.', repentance: 'المؤمن الذي يخالط الناس ويصبر على أذاهم خير من الذي لا يخالطهم.', areaId: 'social_recovery' }
        ]
      }
    ]
  }
];

interface RecoveryPageProps {
  onComplete?: () => void;
  onViewChange?: (view: string) => void;
  initialView?: View;
  onActivityComplete?: (xp: number) => void;
}

export const RecoveryPage: React.FC<RecoveryPageProps> = ({ 
  onComplete, 
  onViewChange,
  initialView = 'test_selection',
  onActivityComplete
}) => {
  const [view, setView] = useState<View>(initialView);
  const [testType, setTestType] = useState<TestType>('simple');
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>(RECOVERY_AREAS.map(a => a.id));
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [badHabits, setBadHabits] = useState<Option[]>([]);
  const [goodHabits, setGoodHabits] = useState<Option[]>([]);
  const [showImprovement, setShowImprovement] = useState(false);
  const [completedRoutineTasks, setCompletedRoutineTasks] = useState<string[]>([]);

  useEffect(() => {
    onViewChange?.(view);
  }, [view, onViewChange]);

  const selectedAreas = useMemo(() => RECOVERY_AREAS.filter(area => selectedAreaIds.includes(area.id)), [selectedAreaIds]);
  const currentArea = selectedAreas[currentAreaIndex];
  const questions = useMemo(() => {
    if (!currentArea) return [];
    return testType === 'simple' 
      ? [currentArea.questions[0]] 
      : currentArea.questions;
  }, [currentArea, testType]);

  const handleAnswer = (option: Option) => {
    playPop();
    const newAnswers = { ...answers };
    if (!newAnswers[currentArea.id]) newAnswers[currentArea.id] = [];
    newAnswers[currentArea.id][currentQuestionIndex] = option.isBad ? 0 : 1;
    setAnswers(newAnswers);

    if (option.isBad) {
      setBadHabits(prev => [...prev, option]);
    } else {
      setGoodHabits(prev => [...prev, option]);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setView('area_result');
    }
  };

  const nextArea = () => {
    playPop();
    if (currentAreaIndex < selectedAreas.length - 1) {
      setCurrentAreaIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setView('test');
    } else {
      setView('results');
      onActivityComplete?.(500);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b']
    });
  };

  const calculatePurityScore = () => {
    const totalQuestions = Object.values(answers).flat().length;
    const correctAnswers = Object.values(answers).flat().filter(a => a === 1).length;
    return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  };

  const getPersonalityType = (score: number) => {
    if (score >= 90) return { title: 'المتعافي الملهم', desc: 'أنت قدوة في الانضباط والتحرر من القيود الرقمية والنفسية.', color: 'text-emerald-400' };
    if (score >= 70) return { title: 'المجاهد الواعي', desc: 'أنت في طريقك الصحيح، تدرك عيوبك وتجاهد لتحسينها باستمرار.', color: 'text-blue-400' };
    if (score >= 50) return { title: 'الباحث عن التوازن', desc: 'تحتاج لتركيز أكبر على أولوياتك وتنظيم وقتك لتستعيد توازنك.', color: 'text-yellow-400' };
    return { title: 'المستعد للتغيير', desc: 'هذه هي نقطة البداية الحقيقية، الاعتراف بالمشكلة هو أول خطوة في التعافي.', color: 'text-rose-400' };
  };

  const toggleAreaSelection = (id: string) => {
    playPop();
    setSelectedAreaIds(prev => 
      prev.includes(id) 
        ? prev.filter(areaId => areaId !== id) 
        : [...prev, id]
    );
  };

  const startTest = () => {
    if (selectedAreaIds.length === 0) return;
    playPop();
    setCurrentAreaIndex(0);
    setCurrentQuestionIndex(0);
    setView('test');
  };

  const toggleRoutineTask = (habitName: string) => {
    if (completedRoutineTasks.includes(habitName)) {
      setCompletedRoutineTasks(prev => prev.filter(t => t !== habitName));
    } else {
      setCompletedRoutineTasks(prev => [...prev, habitName]);
      playPop();
      onActivityComplete?.(50);
    }
  };

  const renderRoutine = () => (
    <motion.div
      key="routine"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <Button onClick={() => setView('results')} variant="ghost" size="sm">
          <ArrowRight className="ml-2" /> العودة للنتائج
        </Button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-white">روتين التعافي اليومي</h2>
          <p className="text-gray-400">مهام مخصصة بناءً على نقاط الضعف المكتشفة</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {badHabits.length > 0 ? (
          badHabits.map((habit, idx) => {
            const area = RECOVERY_AREAS.find(a => a.id === habit.areaId);
            const isCompleted = completedRoutineTasks.includes(habit.habitName || '');
            
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={`relative p-6 rounded-[2rem] border transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400' : `${area?.bg || 'bg-blue-500'}/20 ${area?.color || 'text-blue-400'}`
                  }`}>
                    {area ? <area.icon size={24} /> : <Target size={24} />}
                  </div>
                  <button
                    onClick={() => toggleRoutineTask(habit.habitName || '')}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    <CheckCircle2 size={24} />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-xl font-bold ${isCompleted ? 'text-emerald-400 line-through opacity-60' : 'text-white'}`}>
                    {habit.habitName}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isCompleted ? 'text-emerald-400/60' : 'text-gray-400'}`}>
                    {habit.recoveryStep}
                  </p>
                </div>

                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg"
                  >
                    تم الإنجاز +50 XP
                  </motion.div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">أنت في القمة!</h3>
            <p className="text-gray-400">لا توجد نقاط ضعف تحتاج لروتين حالياً. استمر في الحفاظ على نقائك.</p>
          </div>
        )}
      </div>

      {badHabits.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
            <RefreshCw size={24} className="animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-white font-bold">نصيحة الاستمرارية</h4>
            <p className="text-gray-400 text-sm">التكرار هو سر النجاح. التزم بهذا الروتين يومياً حتى يتحول إلى عادة تلقائية.</p>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#121212] pt-6 pb-20 px-4">
      <AnimatePresence mode="wait">
        {view === 'test_selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-6">
                <Shield size={40} />
              </div>
              <h1 className="text-4xl font-black text-white">رحلة التعافي</h1>
              <p className="text-gray-400 text-lg">حدد المناطق التي ترغب في تقييمها اليوم</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RECOVERY_AREAS.map((area) => {
                const isSelected = selectedAreaIds.includes(area.id);
                return (
                  <button
                    key={area.id}
                    onClick={() => toggleAreaSelection(area.id)}
                    className={`group relative p-6 rounded-3xl border transition-all text-right ${
                      isSelected 
                        ? 'bg-blue-500/10 border-blue-500/50 ring-2 ring-blue-500/20' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isSelected ? 'bg-blue-500 text-white' : `${area.bg}/20 ${area.color}`
                      }`}>
                        <area.icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{area.title}</h3>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{area.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ما سيتم تقييمه:</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {area.topics.map((topic, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-gray-600'}`} />
                              <span className="text-[10px] text-gray-400 truncate">
                                {topic}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="absolute top-4 left-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/20'
                        }`}>
                          {isSelected && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setTestType('simple')}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                    testType === 'simple' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  اختبار سريع
                </button>
                <button
                  onClick={() => setTestType('comprehensive')}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                    testType === 'comprehensive' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  اختبار شامل
                </button>
              </div>
              
              <Button 
                onClick={startTest} 
                variant="primary" 
                size="xl" 
                disabled={selectedAreaIds.length === 0}
                className="min-w-[200px]"
              >
                ابدأ التقييم ({selectedAreaIds.length})
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${currentArea.bg}/20 rounded-2xl flex items-center justify-center ${currentArea.color}`}>
                  <currentArea.icon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{currentArea.title}</h2>
                  <p className="text-gray-400 text-sm">{currentArea.description}</p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-gray-500 text-sm font-bold">منطقة {currentAreaIndex + 1} / {selectedAreas.length}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
              <h3 className="text-2xl font-bold text-white text-center leading-tight">
                {questions[currentQuestionIndex].text}
              </h3>

              <div className="grid gap-3">
                {questions[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-right transition-all hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <span className="text-lg text-gray-200 group-hover:text-white">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'area_result' && (
          <motion.div
            key="area_result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center space-y-8"
          >
            <div className={`w-24 h-24 ${currentArea.bg}/20 rounded-full flex items-center justify-center ${currentArea.color} mx-auto`}>
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">اكتملت المنطقة!</h2>
              <p className="text-gray-400">لقد انتهيت من تقييم {currentArea.title}</p>
            </div>
            <Button onClick={nextArea} variant="primary" size="xl" fullWidth>
              {currentAreaIndex === selectedAreas.length - 1 ? 'عرض النتائج النهائية' : 'المنطقة التالية'}
            </Button>
          </motion.div>
        )}

        {view === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <AnimatePresence>
              {showImprovement && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8 relative z-20 w-full overflow-visible"
                >
                  <ImprovementPhase onActivityComplete={onActivityComplete} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500" />
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-white">نتائج رحلة التعافي</h2>
                <p className="text-gray-400">بناءً على إجاباتك، إليك تحليل لحالتك الحالية</p>
              </div>

              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={553}
                    initial={{ strokeDashoffset: 553 }}
                    animate={{ strokeDashoffset: 553 - (553 * calculatePurityScore()) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-blue-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white">{calculatePurityScore()}%</span>
                  <span className="text-gray-500 text-sm font-bold">مؤشر التعافي</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                <h3 className={`text-2xl font-black mb-2 ${getPersonalityType(calculatePurityScore()).color}`}>
                  {getPersonalityType(calculatePurityScore()).title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {getPersonalityType(calculatePurityScore()).desc}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {selectedAreas.map((area) => {
                  const areaAnswers = answers[area.id] || [];
                  const score = areaAnswers.length > 0 
                    ? Math.round((areaAnswers.filter(a => a === 1).length / areaAnswers.length) * 100)
                    : 0;
                  return (
                    <div key={area.id} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <area.icon size={20} className={`${area.color} mx-auto mb-2`} />
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">{area.title}</div>
                      <div className="text-xl font-black text-white">{score}%</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button onClick={() => setView('routine')} variant="primary" size="xl" fullWidth>
                  عرض روتين المهام
                </Button>
                <Button onClick={() => setView('review')} variant="outline" size="xl" fullWidth>
                  مراجعة العادات الضارة
                </Button>
              </div>
              <Button onClick={() => setShowImprovement(!showImprovement)} variant="ghost" size="sm" fullWidth>
                {showImprovement ? 'إخفاء خطة التعافي العامة' : 'عرض خطة التعافي العامة'}
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'routine' && renderRoutine()}

        {view === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Button onClick={() => setView('results')} variant="ghost" size="sm">
                <ArrowRight className="ml-2" /> العودة للنتائج
              </Button>
              <h2 className="text-2xl font-black text-white">تحليل العادات المستهدفة</h2>
            </div>

            <div className="grid gap-4">
              {badHabits.length > 0 ? (
                badHabits.map((habit, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400">
                        <AlertCircle size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{habit.habitName}</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10">
                          <h4 className="text-rose-400 text-sm font-bold mb-1 flex items-center gap-2">
                            <ShieldAlert size={14} /> الأثر السلبي
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed">{habit.harm}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                          <h4 className="text-emerald-400 text-sm font-bold mb-1 flex items-center gap-2">
                            <RefreshCw size={14} /> خطوة التعافي
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed">{habit.recoveryStep}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                  <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-bold text-white">لا توجد عادات ضارة مكتشفة!</h3>
                  <p className="text-gray-400">أنت في حالة ممتازة، استمر في الحفاظ على هذا المستوى.</p>
                </div>
              )}
            </div>
            
            <div className="pt-8">
              <Button onClick={() => { setView('results'); setShowImprovement(true); }} variant="primary" size="xl" fullWidth>
                انتقل لخطة العمل
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
