import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
const { 
  Heart, Zap, Wallet, Users, Brain, ArrowRight, 
  CheckCircle2, AlertCircle, ChevronRight, ShieldAlert, 
  Sparkles, Activity, Target, RefreshCw, ArrowLeft, Flame, Play, Crown, X, RotateCcw, Rocket, Moon, Star
} = Lucide;
import { playPop, playLevelUp } from '../utils/sounds';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';

type View = 'test_selection' | 'test' | 'area_result' | 'results' | 'review';
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
  questions: Question[];
}

const LIFE_AREAS: LifeArea[] = [
  {
    id: 'major_sins',
    title: 'الكبائر والمحرمات',
    description: 'تقييم مدى اجتناب الكبائر والذنوب العظيمة',
    icon: ShieldAlert,
    color: 'text-red-500',
    bg: 'bg-red-500',
    questions: [
      {
        text: 'كيف هو توكلك على الله ويقينك به؟',
        options: [
          { text: 'أتوكل على الله وحده ولا أصدق الخرافات', isBad: false, habitName: 'التوكل على الله', consistency: 'اجعل دعاء التوكل "بسم الله توكلت على الله" ملازماً لك عند كل خروج من المنزل.', benefit: 'يمنحك طمأنينة القلب، ويزيل عنك قلق المستقبل، ويجلب لك التوفيق في كل خطواتك.' },
          { text: 'أقرأ الأبراج وأصدقها أحياناً', isBad: true, habitName: 'تصديق الأبراج والعرافين', recoveryStep: 'توقف فوراً عن قراءة الأبراج، وتوكل على الله وحده، فمن أتى عرافاً فصدقه فقد كفر بما أنزل على محمد.', punishment: 'لا تُقبل له صلاة أربعين يوماً، ومن صدقهم فقد كفر بما أُنزل على محمد ﷺ.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والتوحيد الخالص لله، والإكثار من الاستغفار.' },
          { text: 'أذهب للسحرة أو العرافين لحل مشاكلي', isBad: true, habitName: 'إتيان السحرة والعرافين', recoveryStep: 'تب إلى الله توبة نصوحاً، السحر من الموبقات السبع، ولا يفلح الساحر حيث أتى.', punishment: 'الشرك بالله، وهو أعظم الكبائر الموبقة التي تحبط الأعمال وتوجب الخلود في النار إن لم يتب.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والتوحيد الخالص لله، والإكثار من الاستغفار.' }
        ]
      },
      {
        text: 'كيف هو حالك مع الصلاة المكتوبة؟',
        options: [
          { text: 'أحافظ عليها في وقتها', isBad: false, habitName: 'المحافظة على الصلاة', consistency: 'اربط أوقات الصلاة بجدولك اليومي، واجعلها الأولوية الأولى قبل أي موعد آخر.', benefit: 'تنظم وقتك، وتغسل ذنوبك خمس مرات يومياً، وتكون لك نوراً في الدنيا والآخرة.' },
          { text: 'أؤخرها عن وقتها أو أجمعها تكاسلاً', isBad: true, habitName: 'تأخير الصلاة عن وقتها', recoveryStep: 'اضبط منبهاً لكل صلاة وتوضأ بمجرد سماع الأذان.', punishment: 'قال تعالى: (فَوَيْلٌ لِّلْمُصَلِّينَ * الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ) والويل وادٍ في جهنم.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والمحافظة على الصلاة في وقتها، والإكثار من النوافل.' },
          { text: 'أترك بعض الصلوات أو أتركها بالكلية', isBad: true, habitName: 'ترك الصلاة المكتوبة', recoveryStep: 'الصلاة عماد الدين، ابدأ فوراً بالمحافظة عليها ولا تتركها مهما كانت الظروف.', punishment: 'قال ﷺ: (العهد الذي بيننا وبينهم الصلاة فمن تركها فقد كفر)، ويُحشر تاركها مع فرعون وهامان.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والمحافظة على الصلاة في وقتها، والإكثار من النوافل.' }
        ]
      },
      {
        text: 'كيف هي علاقتك بوالديك وأرحامك؟',
        options: [
          { text: 'أبر والدي وأصل رحمي', isBad: false, habitName: 'بر الوالدين وصلة الرحم', consistency: 'خصص وقتاً ثابتاً أسبوعياً للتواصل مع أرحامك، واجعل الدعاء لوالديك ورداً يومياً.', benefit: 'تزيد في رزقك، وتطيل في عمرك، وتجلب لك التوفيق ودعوات تفتح لك أبواب السماء.' },
          { text: 'أقصر في حقهم وأتجاهل التواصل معهم', isBad: true, habitName: 'قطيعة الرحم', recoveryStep: 'بادر بالاتصال بوالديك وأرحامك اليوم، واجعل لهم وقتاً ثابتاً في أسبوعك.', punishment: 'قال ﷺ: (لا يدخل الجنة قاطع رحم)، وتُعجل له العقوبة في الدنيا.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وصلة الرحم، والإكثار من الدعاء لهم.' },
          { text: 'أرفع صوتي عليهم أو أسيء إليهم', isBad: true, habitName: 'عقوق الوالدين', recoveryStep: 'اعتذر لهم فوراً، واطلب رضاهم، وتذكر أن رضا الله في رضا الوالدين.', punishment: 'لعن الله من عق والديه، ولا ينظر الله إليه يوم القيامة، ويُعجل له العذاب في الدنيا.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وبر الوالدين، والإكثار من الدعاء لهم.' }
        ]
      },
      {
        text: 'كيف تتعامل مع أموالك ومصادر دخلك؟',
        options: [
          { text: 'أتحرى الحلال وأبتعد عن الشبهات', isBad: false, habitName: 'تحري الكسب الحلال', consistency: 'راجع مصادر دخلك باستمرار، واستعذ بالله يومياً من المال الحرام.', benefit: 'يبارك الله في مالك وصحتك وعيالك، ويجعل دعاءك مستجاباً.' },
          { text: 'أتعامل بالربا أو القروض الربوية', isBad: true, habitName: 'أكل الربا', recoveryStep: 'توقف فوراً عن أي تعامل ربوي، وتب إلى الله، وابحث عن البدائل الشرعية.', punishment: 'إيذان بحرب من الله ورسوله، ويُبعث آكل الربا يوم القيامة كالمجنون يتخبطه الشيطان.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والتخلص من المال الحرام، والبحث عن البدائل الحلال.' },
          { text: 'آخذ الرشوة أو آكل أموال الناس بالباطل', isBad: true, habitName: 'الرشوة وأكل أموال الناس بالباطل', recoveryStep: 'رد الحقوق لأصحابها، وتخلص من المال الحرام، وتذكر أن كل جسد نبت من سحت فالنار أولى به.', punishment: 'لعن رسول الله الراشي والمرتشي، وأكل أموال الناس بالباطل ظلمات يوم القيامة.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، ورد الحقوق لأصحابها، والتخلص من المال الحرام.' }
        ]
      },
      {
        text: 'كيف تحفظ بصرك وتتعامل مع العلاقات؟',
        options: [
          { text: 'أغض بصري وأحفظ فرجي', isBad: false, habitName: 'غض البصر وحفظ الفرج', consistency: 'تجنب الأماكن والمقاطع التي تثير الفتن، واشغل وقتك بما ينفعك.', benefit: 'يورثك فراسة صادقة، ونوراً في الوجه، وحلاوة في الإيمان تجدها في قلبك.' },
          { text: 'أتساهل في النظر للمحرمات', isBad: true, habitName: 'إطلاق البصر في المحرمات', recoveryStep: 'جاهد نفسك على غض البصر، وابتعد عن المثيرات في مواقع التواصل.', punishment: 'زنا العين النظر، وهو سهم مسموم من سهام إبليس يورث حسرة في القلب.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وغض البصر، والإكثار من ذكر الله.' },
          { text: 'أقيم علاقات محرمة أو أقع في الفواحش', isBad: true, habitName: 'الوقوع في الفواحش (الزنا)', recoveryStep: 'اقطع كل طريق يؤدي للحرام فوراً، وتب توبة نصوحاً، واستتر بستر الله.', punishment: 'يُضاعف له العذاب يوم القيامة ويخلد فيه مهاناً، وفي البرزخ يُعذبون في تنور من نار.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والستر على النفس، والإكثار من العمل الصالح.' }
        ]
      },
      {
        text: 'كيف تحفظ لسانك في مجالس الناس؟',
        options: [
          { text: 'أحفظ لساني وأقول خيراً أو أصمت', isBad: false, habitName: 'حفظ اللسان', consistency: 'عود نفسك على الصمت عند الغضب، واجعل ذكر الله بديلاً عن فضول الكلام.', benefit: 'يحميك من زلات الكلم، ويكسبك احترام الناس، ويحفظ حسناتك من الضياع.' },
          { text: 'أشارك في الغيبة والنميمة', isBad: true, habitName: 'الغيبة والنميمة', recoveryStep: 'عود لسانك على ذكر الله، ودافع عن من يُغتاب في مجلسك أو غادر المجلس.', punishment: 'عذاب القبر للنمام، والمغتاب كمن يأكل لحم أخيه ميتاً، ويُعذبون في النار.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وطلب العفو ممن اغتبته، والإكثار من ذكر الله.' },
          { text: 'أكذب، أو أشهد بالزور، أو أحلف كذباً', isBad: true, habitName: 'شهادة الزور واليمين الغموس', recoveryStep: 'الزم الصدق في كل أحوالك، وتراجع عن أي شهادة زور، وكفر عن أيمانك الكاذبة.', punishment: 'قُرنت شهادة الزور بالشرك بالله، واليمين الغموس تغمس صاحبها في الإثم ثم في النار.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وقول الحق، والكفارة عن اليمين.' }
        ]
      },
      {
        text: 'كيف تتعامل مع المسكرات والمخدرات؟',
        options: [
          { text: 'أجتنبها تماماً ولا أقرب مجالسها', isBad: false, habitName: 'اجتناب المسكرات ومجالسها', consistency: 'حافظ على الصحبة الصالحة التي تذكرك بالله، وابتعد عن بيئات السوء.', benefit: 'يحفظ عقلك وصحتك، ويصون كرامتك، ويجعلك في حفظ الله ورعايته.' },
          { text: 'أجالس من يتعاطاها أو أتساهل في بعضها', isBad: true, habitName: 'مجالسة المتعاطين والتساهل', recoveryStep: 'ابتعد فوراً عن رفقاء السوء ومجالسهم، فالمرء على دين خليله.', punishment: 'من كثر سواد قوم فهو منهم، ومجالسة أهل الباطل تجر للوقوع فيه.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والابتعاد عن رفقاء السوء.' },
          { text: 'أتعاطى المسكرات أو المخدرات', isBad: true, habitName: 'شرب الخمر والمخدرات', recoveryStep: 'اطلب المساعدة الطبية والنفسية فوراً، واقطع علاقتك بكل من يذكرك بها.', punishment: 'لعن الله الخمر وشاربها، ولا يدخل الجنة مدمن خمر، ويُسقى من طينة الخبال (عصارة أهل النار).', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وطلب المساعدة الطبية، والابتعاد عن رفقاء السوء.' }
        ]
      },
      {
        text: 'كيف هو حال قلبك في تعاملك مع الناس؟',
        options: [
          { text: 'أتواضع للناس وأعفو عنهم', isBad: false, habitName: 'التواضع والعفو', consistency: 'تذكر دائماً فضل الله عليك، وادعُ لمن أساء إليك لتطهر قلبك من الغل.', benefit: 'يرفع الله قدرك بين الناس، ويطهر قلبك من الأمراض، ويجعلك أقرب للجنة.' },
          { text: 'أحسد الناس على النعم وأتمنى زوالها', isBad: true, habitName: 'الحسد', recoveryStep: 'ادعُ بالبركة لمن رأيت عليه نعمة، وتذكر أن الحسد يأكل الحسنات كما تأكل النار الحطب.', punishment: 'الحسد يأكل الحسنات، ويورث القلب هماً وغماً وعذاباً في الدنيا قبل الآخرة.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والدعاء بالبركة للآخرين، والرضا بما قسم الله.' },
          { text: 'أتكبر على الناس أو أظلمهم', isBad: true, habitName: 'الكبر والظلم', recoveryStep: 'تواضع لله، ورد المظالم لأهلها، واطلب العفو ممن ظلمتهم قبل يوم الحساب.', punishment: 'لا يدخل الجنة من كان في قلبه مثقال ذرة من كبر، والظلم ظلمات يوم القيامة.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والتواضع، ورد المظالم لأهلها.' }
        ]
      }
    ]
  },
  {
    id: 'worship',
    title: 'الصلاة والعبادات',
    description: 'تقييم مدى التزامك بالصلوات الخمس والطاعات',
    icon: Moon,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500',
    questions: [
      {
        text: 'كيف هو حالك مع صلاة الفجر؟',
        options: [
          { text: 'أستيقظ لصلاة الفجر يومياً', isBad: false, habitName: 'صلاة الفجر في وقتها', consistency: 'نم مبكراً واضبط المنبه، وادع الله أن يوقظك في أحب الأوقات إليه.', benefit: 'من صلى الفجر فهو في ذمة الله، وتجعلك تبدأ يومك بنشاط وبركة.' },
          { text: 'أصليها بعد طلوع الشمس غالباً', isBad: true, habitName: 'تضييع صلاة الفجر', recoveryStep: 'نم مبكراً، وابتعد عن السهر، واستعن بأحد أفراد أسرتك لإيقاظك.', harm: 'تفوتك بركة البكور، وتصبح خبيث النفس كسلان كما أخبر النبي ﷺ.', repentance: 'اعزم بصدق على الاستيقاظ، وخذ بالأسباب كالنوم المبكر.' }
        ]
      },
      {
        text: 'هل تحافظ على صلاة الجماعة في المسجد؟ (للرجال)',
        options: [
          { text: 'أحافظ عليها في المسجد دائماً', isBad: false, habitName: 'صلاة الجماعة في المسجد', consistency: 'اربط خروجك من المنزل بأوقات الأذان، واجعل المسجد وجهتك الأولى.', benefit: 'تضاعف أجر صلاتك 27 درجة، وتربط قلبك ببيوت الله.' },
          { text: 'أصلي في البيت تكاسلاً', isBad: true, habitName: 'ترك صلاة الجماعة', recoveryStep: 'ابدأ بالذهاب للمسجد في صلاة واحدة يومياً ثم تدرج.', harm: 'حرمان من أجر عظيم، وقد يؤدي إلى التهاون في الصلاة تدريجياً.', repentance: 'تب إلى الله واعزم على تلبية نداء حي على الصلاة.' }
        ]
      },
      {
        text: 'هل تحافظ على السنن الرواتب والوتر؟',
        options: [
          { text: 'أحافظ عليها قدر المستطاع', isBad: false, habitName: 'صلاة السنن والوتر', consistency: 'اجعل الوتر آخر صلاتك بالليل، وحافظ على ركعتي الفجر فهما خير من الدنيا.', benefit: 'تجبر النقص في الفريضة، وتبني لك بيتاً في الجنة.' },
          { text: 'أكتفي بالفرائض فقط', isBad: true, habitName: 'ترك السنن الرواتب', recoveryStep: 'ابدأ بركعتي الفجر والوتر، ثم تدرج في إضافة باقي السنن.', harm: 'تفويت أجر عظيم، وتكون الفرائض عرضة للنقص دون ما يجبرها.', repentance: 'ابدأ من اليوم بإحياء السنن في حياتك.' }
        ]
      },
      {
        text: 'كيف هو وردك اليومي من القرآن الكريم؟',
        options: [
          { text: 'أقرأ ورداً يومياً ثابتاً', isBad: false, habitName: 'تلاوة القرآن يومياً', consistency: 'اربط قراءة القرآن بوقت ثابت، مثل بعد صلاة الفجر أو قبل النوم.', benefit: 'يشرح الصدر، وينير الدرب، ويأتي شفيعاً لأصحابه يوم القيامة.' },
          { text: 'أقرأ من حين لآخر أو أهجره', isBad: true, habitName: 'هجر القرآن', recoveryStep: 'ابدأ بقراءة صفحة واحدة فقط يومياً بعد صلاة مفضلة لديك.', harm: 'قسوة القلب، وضيق الصدر، وحرمان من بركة كلام الله.', repentance: 'افتح المصحف الآن واقرأ ولو آيات يسيرة، واعزم على عدم هجره.' }
        ]
      },
      {
        text: 'هل تحافظ على أذكار الصباح والمساء؟',
        options: [
          { text: 'أقرأها يومياً بانتظام', isBad: false, habitName: 'المحافظة على الأذكار', consistency: 'اجعلها جزءاً من روتينك الصباحي والمسائي، واقرأها بتدبر.', benefit: 'تحفظك من كل سوء، وتجلب الطمأنينة لقلبك، وتكون في معية الله.' },
          { text: 'أحياناً أنساها أو لا أقرأها', isBad: true, habitName: 'الغفلة عن الأذكار', recoveryStep: 'استخدم تطبيقاً للتذكير، أو اربطها بوقت محدد كبعد الفجر والعصر.', harm: 'تكون عرضة لوساوس الشيطان، وتفقد حصناً حصيناً من الشرور.', repentance: 'اعزم على قراءتها يومياً، وابدأ ولو بالقليل منها.' }
        ]
      }
    ]
  },
  {
    id: 'health',
    title: 'الصحة والجسد',
    description: 'اكتشف عاداتك الصحية والبدنية',
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-500',
    questions: [
      {
        text: 'كيف تصف روتين نومك في أغلب الأيام؟',
        options: [
          { text: 'أنام وأستيقظ في مواعيد ثابتة', isBad: false, habitName: 'النوم الصحي والمنتظم', consistency: 'التزم بموعد نومك حتى في أيام العطلات للحفاظ على ساعتك البيولوجية.', benefit: 'يجدد نشاط خلاياك، ويقوي مناعتك، ويمنحك طاقة إيجابية وتركيزاً عالياً طوال اليوم.' },
          { text: 'أسهر طويلاً وأنام في أوقات عشوائية', isBad: true, habitName: 'السهر العشوائي واضطراب النوم', recoveryStep: 'حدد موعداً ثابتاً للنوم، وأبعد الشاشات عنك قبل النوم بساعة كاملة.', harm: 'يؤدي إلى ضعف المناعة، تشتت التركيز، وزيادة خطر الإصابة بالأمراض المزمنة.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وتحديد موعد ثابت للنوم، والابتعاد عن الشاشات.' },
          { text: 'أتصفح الهاتف حتى أغفو', isBad: true, habitName: 'تصفح الشاشات قبل النوم', recoveryStep: 'استبدل الهاتف بكتاب ورقي أو استماع لمقطع صوتي هادئ قبل النوم.', harm: 'الضوء الأزرق يمنع إفراز الميلاتونين، مما يجعل نومك غير عميق ومجهداً للعقل.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، واستبدال الهاتف بكتاب، والابتعاد عن الشاشات.' }
        ]
      },
      {
        text: 'ما هو نمط حركتك اليومي؟',
        options: [
          { text: 'أمارس الرياضة أو أمشي بانتظام', isBad: false, habitName: 'النشاط البدني المنتظم', consistency: 'اجعل الرياضة جزءاً من روتينك الصباحي أو المسائي، ولا تتنازل عنها.', benefit: 'يحسن مزاجك، ويقوي عضلة قلبك، ويؤخر علامات الشيخوخة ويمنحك جسداً قوياً.' },
          { text: 'أجلس لفترات طويلة جداً دون حركة', isBad: true, habitName: 'الجلوس المستمر وقلة الحركة', recoveryStep: 'اضبط منبهاً للوقوف والتمدد لمدة دقيقتين كل ساعة عمل.', harm: 'يزيد من آلام الظهر والرقبة، ويقلل من كفاءة الدورة الدموية وعملية التمثيل الغذائي.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وممارسة الرياضة، والتحرك بانتظام.' },
        ]
      },
      {
        text: 'كيف تصف نظامك الغذائي؟',
        options: [
          { text: 'متوازن وأشرب ماء كافٍ', isBad: false, habitName: 'الغذاء المتوازن', consistency: 'خطط لوجباتك مسبقاً، واجعل زجاجة الماء رفيقتك في كل مكان.', benefit: 'يمد جسمك بالفيتامينات اللازمة، ويحافظ على وزنك المثالي، ويقيك من الأمراض المزمنة.' },
          { text: 'أعتمد بكثرة على الوجبات السريعة والسكريات', isBad: true, habitName: 'الإفراط في السكريات والوجبات السريعة', recoveryStep: 'ابدأ باستبدال وجبة خفيفة غير صحية بفاكهة، واشرب كوب ماء قبل كل وجبة.', harm: 'تسبب تقلبات حادة في الطاقة، زيادة الوزن، وتراكم السموم في الجسم.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، واتباع نظام غذائي صحي، وشرب الماء.' },
        ]
      },
      {
        text: 'كيف تتعامل مع الضغوط النفسية والتوتر؟',
        options: [
          { text: 'أمارس التأمل، التنفس العميق، أو أتحدث مع شخص أثق به', isBad: false, habitName: 'التعامل الصحي مع الضغوط', consistency: 'خصص 10 دقائق يومياً للتنفس العميق أو التفريغ الكتابي قبل النوم.', benefit: 'يقلل من هرمونات التوتر، ويحميك من الأمراض النفسجسمية، ويمنحك صفاءً ذهنياً.' },
          { text: 'أكتم مشاعري أو ألجأ للأكل العاطفي والتدخين', isBad: true, habitName: 'الكبت والهروب السلبي', recoveryStep: 'جرب كتابة مشاعرك (التفريغ الكتابي) أو استشر أخصائياً نفسياً.', harm: 'يؤدي إلى أمراض جسدية (نفسجسمية)، انفجارات غضب مفاجئة، واكتئاب.' }
        ]
      }
    ]
  },
  {
    id: 'productivity',
    title: 'الإنتاجية والعمل',
    description: 'قيم مستوى تركيزك وإدارتك للوقت',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500',
    questions: [
      {
        text: 'كيف تتعامل مع المهام الصعبة أو المملة؟',
        options: [
          { text: 'أقسمها وأبدأ بها فوراً', isBad: false, habitName: 'المبادرة وإنجاز المهام', consistency: 'استخدم تقنية البومودورو للبدء، وكافئ نفسك بعد إنجاز كل مهمة صعبة.', benefit: 'يضاعف إنتاجيتك، ويخلصك من ضغط المهام المتراكمة، ويعزز ثقتك بنفسك.' },
          { text: 'أؤجلها لآخر لحظة ممكنة', isBad: true, habitName: 'التسويف وتأجيل المهام', recoveryStep: 'استخدم قاعدة الـ 5 دقائق: أقنع نفسك بالعمل على المهمة لـ 5 دقائق فقط.', harm: 'يخلق ضغطاً نفسياً مستمراً، ويقلل من جودة العمل، ويضيع فرصاً كبيرة للنمو.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وتقسيم المهام، والبدء فوراً.' },
          { text: 'أهرب منها بتصفح وسائل التواصل', isBad: true, habitName: 'الهروب بالتشتت الرقمي', recoveryStep: 'ضع هاتفك في وضع "عدم الإزعاج" في غرفة أخرى أثناء العمل العميق.', harm: 'يدمر القدرة على التركيز العميق (Deep Work) ويجعل العقل معتمداً على الدوبامين السريع.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والتركيز على المهام، والابتعاد عن المشتتات.' }
        ]
      },
      {
        text: 'كيف تخطط ليومك؟',
        options: [
          { text: 'أكتب مهامي في الليلة السابقة', isBad: false, habitName: 'التخطيط اليومي المسبق', consistency: 'اجعل التخطيط لليوم التالي آخر مهمة تقوم بها قبل مغادرة مكتبك أو قبل النوم.', benefit: 'يوفر وقتك وجهدك، ويجعلك تتحكم في يومك بدلاً من أن تتحكم بك الظروف.' },
          { text: 'أعمل بعشوائية وحسب ما يطرأ', isBad: true, habitName: 'العمل بعشوائية دون تخطيط', recoveryStep: 'خصص 5 دقائق قبل النوم لكتابة أهم 3 مهام لليوم التالي.', harm: 'يؤدي لضياع الوقت، وتراكم المهام، والشعور المستمر بالارتباك وعدم الإنجاز.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والتخطيط اليومي، والالتزام بالمهام.' },
        ]
      },
      {
        text: 'كيف تتعامل مع أوقات الفراغ؟',
        options: [
          { text: 'أستثمرها في تعلم شيء جديد أو هواية مفيدة', isBad: false, habitName: 'استثمار أوقات الفراغ', consistency: 'حدد وقتاً ثابتاً لهوايتك، واجعل أدواتها في متناول يدك دائماً.', benefit: 'يطور مهاراتك، ويفتح لك آفاقاً جديدة، ويجعلك شخصاً أكثر تميزاً وإبداعاً.' },
          { text: 'أقضيها في تصفح لا نهائي لوسائل التواصل', isBad: true, habitName: 'إهدار الوقت على الشاشات', recoveryStep: 'حدد وقتاً يومياً لاستخدام الهاتف، وابحث عن هواية حركية أو ذهنية.', harm: 'يقتل الإبداع، يسبب تشتت الانتباه، ويضيع أثمن مورد تملكه وهو الوقت.' }
        ]
      },
      {
        text: 'كيف هو حالك مع القراءة والتعلم المستمر؟',
        options: [
          { text: 'أقرأ بانتظام وأسعى لتطوير نفسي', isBad: false, habitName: 'التعلم المستمر والقراءة', consistency: 'احمل كتاباً معك دائماً، واقرأ ولو صفحات قليلة يومياً.', benefit: 'يوسع مداركك، ويحمي عقلك من التراجع، ويجعلك قادراً على مواكبة تطورات الحياة.' },
          { text: 'لا أقرأ وأكتفي بما تعلمته سابقاً', isBad: true, habitName: 'التوقف عن التعلم', recoveryStep: 'ابدأ بقراءة 10 صفحات يومياً من كتاب في مجال يهمك.', harm: 'يؤدي إلى ركود العقل، وضعف القدرة على مواكبة التغيرات، وانحسار الآفاق.' }
        ]
      }
    ]
  },
  {
    id: 'mindset',
    title: 'العقلية والتفكير',
    description: 'اكتشف نمط تفكيرك ونظرتك للحياة',
    icon: Brain,
    color: 'text-violet-500',
    bg: 'bg-violet-500',
    questions: [
      {
        text: 'كيف تتعامل مع الفشل أو الأخطاء؟',
        options: [
          { text: 'أعتبرها فرصة للتعلم والنمو', isBad: false, habitName: 'عقلية النمو', consistency: 'عند كل إخفاق، اسأل نفسك: ماذا تعلمت؟ وكيف أتحسن في المرة القادمة؟', benefit: 'تجعلك أكثر مرونة، وتسرع من تطورك، وتحول العقبات إلى درجات للنجاح.' },
          { text: 'أشعر بالإحباط وألوم نفسي بشدة', isBad: true, habitName: 'جلد الذات وعقلية الثبات', recoveryStep: 'توقف عن لوم نفسك، وتذكر أن الفشل حدث وليس هوية.', harm: 'يدمر الثقة بالنفس، ويمنعك من المحاولة مرة أخرى، ويؤدي للاكتئاب.', repentance: 'سامح نفسك على أخطاء الماضي، وركز على ما يمكنك فعله اليوم.' }
        ]
      },
      {
        text: 'كيف تتحدث مع نفسك (الحديث الداخلي)؟',
        options: [
          { text: 'أشجع نفسي وأتحدث بإيجابية', isBad: false, habitName: 'الحديث الذاتي الإيجابي', consistency: 'راقب كلماتك لنفسك، واستبدل "لا أستطيع" بـ "سأحاول وأتعلم".', benefit: 'يبرمج عقلك الباطن على النجاح، ويزيد من تقديرك لذاتك.' },
          { text: 'أنتقد نفسي باستمرار وأركز على عيوبي', isBad: true, habitName: 'الحديث الذاتي السلبي', recoveryStep: 'عامل نفسك كما تعامل صديقاً عزيزاً يمر بأزمة.', harm: 'يستنزف طاقتك، ويخلق حواجز وهمية تمنعك من التقدم.', repentance: 'استبدل كل فكرة سلبية بثلاث أفكار إيجابية عن نفسك.' }
        ]
      },
      {
        text: 'كيف تتعامل مع التغيير في حياتك؟',
        options: [
          { text: 'أتقبله وأتكيف معه بمرونة', isBad: false, habitName: 'المرونة وتقبل التغيير', consistency: 'ابحث دائماً عن الفرص المخبأة داخل كل تغيير يطرأ على حياتك.', benefit: 'يقلل من التوتر، ويجعلك مستعداً لاقتناص الفرص الجديدة.' },
          { text: 'أقاومه وأشعر بالقلق الشديد', isBad: true, habitName: 'مقاومة التغيير والخوف من المجهول', recoveryStep: 'ركز على ما يمكنك التحكم به، وتقبل أن التغيير هو الثابت الوحيد في الحياة.', harm: 'يبقيك في منطقة الراحة، ويمنعك من التطور، ويزيد من معاناتك النفسية.', repentance: 'ابدأ بتغييرات بسيطة في روتينك اليومي لتعتاد على المرونة.' }
        ]
      }
    ]
  },
  {
    id: 'finance',
    title: 'الوعي المالي',
    description: 'تعرف على نمط إنفاقك ووعيك المالي',
    icon: Wallet,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    questions: [
      {
        text: 'كيف تدير نفقاتك الشهرية؟',
        options: [
          { text: 'أتبع ميزانية وأتتبع مصاريفي', isBad: false, habitName: 'الإدارة المالية الواعية', consistency: 'راجع ميزانيتك نهاية كل أسبوع، واجعل الادخار أول ما تقتطعه من دخلك.', benefit: 'يمنحك أماناً مالياً، ويحميك من الديون، ويتيح لك فرصاً استثمارية مستقبلية.' },
          { text: 'أصرف دون تتبع وأتفاجأ بنفاد الراتب', isBad: true, habitName: 'الإنفاق العشوائي دون تتبع', recoveryStep: 'استخدم تطبيقاً بسيطاً لتسجيل كل مصروف فور دفعه لمدة أسبوع واحد كبداية.', harm: 'يؤدي إلى القلق المالي المستمر، عدم القدرة على الادخار للطوارئ، والوقوع في الديون.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، وتتبع المصاريف، والادخار.' },
        ]
      },
      {
        text: 'عندما تشعر بالضيق أو الملل، هل تتسوق؟',
        options: [
          { text: 'نادراً، أتحكم في رغباتي', isBad: false, habitName: 'التحكم في الرغبات الاستهلاكية', consistency: 'طبق قاعدة الانتظار 24 ساعة قبل أي عملية شراء غير ضرورية.', benefit: 'يعلمك الانضباط الذاتي، ويحافظ على أموالك للأشياء ذات القيمة الحقيقية.' },
          { text: 'نعم، أشتري أشياء لا أحتاجها للترفيه', isBad: true, habitName: 'الشراء العاطفي والاندفاعي', recoveryStep: 'طبق قاعدة الـ 24 ساعة: انتظر يوماً كاملاً قبل شراء أي شيء غير ضروري.', harm: 'استنزاف للموارد المالية في أشياء لا تضيف قيمة حقيقية، وهو هروب مؤقت من المشاعر.', repentance: 'التوبة تبدأ بالندم الصادق، والعزم على عدم العودة، والتحكم في الرغبات، والادخار.' },
        ]
      }
    ]
  },
  {
    id: 'social',
    title: 'العلاقات والاجتماعيات',
    description: 'راجع جودة تواصلك وعلاقاتك بالآخرين',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500',
    questions: [
      {
        text: 'أثناء جلوسك مع العائلة أو الأصدقاء، أين يكون هاتفك؟',
        options: [
          { text: 'في جيبي أو بعيداً عني', isBad: false, habitName: 'الحضور الذهني مع الآخرين', consistency: 'اجعل من العادة ترك الهاتف صامتاً وبعيداً عن متناول يدك أثناء الجلسات.', benefit: 'يعمق علاقاتك، ويشعر من حولك بأهميتهم، ويجعلك تعيش اللحظة بصدق.' },
          { text: 'في يدي وأتصفحه باستمرار', isBad: true, habitName: 'التواجد الجسدي والغياب الذهني (Phubbing)', recoveryStep: 'اجعل من العادة ترك الهاتف في غرفة أخرى أو في الحقيبة أثناء الجلسات العائلية.', harm: 'يضعف الروابط الاجتماعية، ويشعر الآخرين بعدم الأهمية، ويحرمك من التواصل الحقيقي.' },
        ]
      },
      {
        text: 'عندما يتحدث إليك شخص بمشكلة، كيف تستمع؟',
        options: [
          { text: 'أستمع بتركيز لأفهم', isBad: false, habitName: 'الاستماع الفعال', consistency: 'درب نفسك على عدم التفكير في الرد أثناء حديث الآخرين، وركز على فهمهم.', benefit: 'يجعلك مستشاراً موثوقاً لمن حولك، ويجنبك سوء الفهم والمشاكل الاجتماعية.' },
          { text: 'أقاطعه لأعطي حلولاً أو أتحدث عن نفسي', isBad: true, habitName: 'المقاطعة وضعف الاستماع', recoveryStep: 'تدرب على الصمت لثانيتين بعد أن ينهي الشخص كلامه قبل أن ترد.', harm: 'يجعل الآخرين ينفرون من الحديث معك، ويفقدك فرصة فهم وجهات النظر المختلفة.' },
        ]
      },
      {
        text: 'كيف تتفاعل مع آراء الآخرين التي تخالف رأيك؟',
        options: [
          { text: 'أستمع باحترام وأتقبل الاختلاف', isBad: false, habitName: 'تقبل الرأي الآخر', consistency: 'ذكر نفسك دائماً أن الاختلاف يثري العقل، وابحث عن نقاط الاتفاق.', benefit: 'يكسبك محبة الناس، ويوسع أفقك، ويجعلك شخصية مرنة وحكيمة.' },
          { text: 'أغضب وأسفه آراءهم وأحاول فرض رأيي', isBad: true, habitName: 'التعصب للرأي ورفض الآخر', recoveryStep: 'تدرب على قول "أتفهم وجهة نظرك" قبل طرح رأيك، وتذكر أن الاختلاف طبيعة بشرية.', harm: 'ينفر الناس منك، ويحرمك من رؤية زوايا جديدة للمواضيع، ويخلق عداوات.' }
        ]
      }
    ]
  },
  {
    id: 'vices',
    title: 'آفات النفس والخطايا',
    description: 'واجه التحديات النفسية والروحية العميقة',
    icon: Flame,
    color: 'text-fuchsia-500',
    bg: 'bg-fuchsia-500',
    questions: [
      {
        text: 'كيف تتعامل مع المحتوى على الإنترنت والنظرات العابرة؟',
        options: [
          { text: 'أغض بصري وأتجنب المحتوى المثير', isBad: false, habitName: 'غض البصر الإلكتروني', consistency: 'قم بإلغاء متابعة أي حساب يعرض محتوى غير لائق، واستخدم أدوات الحجب.', benefit: 'يحمي قلبك من التشتت، ويحافظ على نقاء سريرتك، ويزيد من تركيزك في واقعك.' },
          { text: 'أستسلم للفضول وأتتبع المحتوى غير اللائق', isBad: true, habitName: 'اتباع الشهوات وإطلاق البصر', recoveryStep: 'استخدم تطبيقات حجب المحتوى، وتذكر دائماً مراقبة الله لك في الخلوات.', harm: 'يضعف الإرادة، ويشتت القلب، ويجر إلى ما هو أعظم من الذنوب، ويفقد الإنسان لذة الطاعة.' }
        ]
      },
      {
        text: 'عندما تستفزك المواقف أو يخطئ شخص بحقك، كيف تكون ردة فعلك؟',
        options: [
          { text: 'أكظم غيظي وأحاول الهدوء', isBad: false, habitName: 'كظم الغيظ والتحكم في الغضب', consistency: 'تعود على الاستعاذة والوضوء عند الغضب، وتأجيل أي رد فعل حتى تهدأ.', benefit: 'يحميك من قرارات الندم، ويحفظ علاقاتك، ويجعلك من المحسنين الذين يحبهم الله.' },
          { text: 'أنفجر غضباً وأتفوه بكلمات أندم عليها', isBad: true, habitName: 'سرعة الغضب والانفعال', recoveryStep: 'تعود على الاستعاذة من الشيطان وتغيير وضعيتك (الجلوس أو الوضوء) عند الغضب.', harm: 'يدمر العلاقات الاجتماعية، ويسبب الندم المتكرر، ويؤثر سلباً على الصحة النفسية والجسدية.' }
        ]
      },
      {
        text: 'عندما ترى نجاحات الآخرين أو نعمهم على وسائل التواصل؟',
        options: [
          { text: 'أدعو لهم بالبركة وأركز على حياتي', isBad: false, habitName: 'الرضا وتمني الخير للآخرين', consistency: 'مارس الامتنان يومياً بكتابة 3 نعم تملكها، وادعُ بالبركة لمن رأيت عليه نعمة.', benefit: 'يملأ قلبك بالسلام الداخلي، ويجلب لك السعادة، ويجعلك محبوباً في السماء والأرض.' },
          { text: 'أشعر بالضيق والمقارنة المستمرة', isBad: true, habitName: 'المقارنة المستمرة والحسد الخفي', recoveryStep: 'قلل من تصفح وسائل التواصل، ومارس الامتنان اليومي بكتابة 3 نعم تملكها.', harm: 'يسرق السعادة والرضا، ويجعل الشخص في سباق وهمي لا ينتهي، ويؤدي للاكتئاب.' }
        ]
      },
      {
        text: 'في الجلسات مع الأصدقاء، ما هو محور الحديث غالباً؟',
        options: [
          { text: 'أفكار، مشاريع، أو أحاديث عامة إيجابية', isBad: false, habitName: 'الارتقاء بالحديث والمجالس', consistency: 'كن أنت المبادر بطرح مواضيع إيجابية ومفيدة في أي مجلس تحضره.', benefit: 'يجعل مجلسك مباركاً، ويحفظ أوقاتك وأوقات غيرك من الضياع في سفاسف الأمور.' },
          { text: 'التحدث عن الآخرين في غيابهم وانتقادهم', isBad: true, habitName: 'الغيبة والحديث في أعراض الناس', recoveryStep: 'قاطع أي حديث يغتاب شخصاً، أو انسحب من الجلسة بلباقة.', harm: 'تفسد القلوب، وتزرع الضغينة، وتكسبك سيئات الآخرين، وتفقدك هيبتك واحترامك.' }
        ]
      },
      {
        text: 'كيف تتعامل مع وعودك والتزاماتك؟',
        options: [
          { text: 'أفي بوعودي وألتزم بكلمتي', isBad: false, habitName: 'الوفاء بالوعود', consistency: 'اكتب وعودك والتزاماتك في تقويمك، ولا تعد بما لا تملك القدرة على تنفيذه.', benefit: 'يبني لك سمعة طيبة، ويجعل الناس يثقون بك، ويرفع من قيمتك في مجتمعك.' },
          { text: 'أخلف الوعود وأتهرب من المسؤولية', isBad: true, habitName: 'إخلاف الوعد والتهرب', recoveryStep: 'لا تعد بما لا تستطيع الوفاء به، واعتذر بصدق إن اضطررت للإخلاف.', harm: 'يفقدك ثقة الناس، ويزرع فيك صفات النفاق، ويدمر سمعتك.' }
        ]
      }
    ]
  }
];

interface HabitsPageProps {
  onViewChange?: (view: View) => void;
  onBack?: () => void;
  onComplete?: () => void;
  initialView?: View;
  onActivityComplete?: (xp: number) => void;
}

export const HabitsPage = ({ onViewChange, onBack, onComplete, initialView, onActivityComplete }: HabitsPageProps) => {
  const [view, setView] = useState<View>(() => initialView || (localStorage.getItem('habits_view') as View) || 'test_selection');

  useEffect(() => {
    console.log('HabitsPage mounted');
    onViewChange?.(view);
    return () => {
      console.log('HabitsPage unmounted');
    };
  }, []);

  const handleSetView = (newView: View) => {
    setView(newView);
    localStorage.setItem('habits_view', newView);
    onViewChange?.(newView);
  };
  const [activeAreaId, setActiveAreaId] = useState<string | null>(() => localStorage.getItem('habits_active_area'));
  const [currentStep, setCurrentStep] = useState(() => parseInt(localStorage.getItem('habits_current_step') || '0'));
  const [testFinished, setTestFinished] = useState(() => localStorage.getItem('habits_test_finished') === 'true');
  
  useEffect(() => {
    localStorage.setItem('habits_test_finished', testFinished.toString());
  }, [testFinished]);
  const [reviewMode, setReviewMode] = useState<'bad' | 'good' | null>(() => localStorage.getItem('habits_review_mode') as 'bad' | 'good' | null);
  
  useEffect(() => {
    if (reviewMode) localStorage.setItem('habits_review_mode', reviewMode);
    else localStorage.removeItem('habits_review_mode');
    
    if (reviewMode !== null) {
      onViewChange?.('review');
    } else {
      onViewChange?.(view);
    }
  }, [reviewMode, view, onViewChange]);
  const [habitStep, setHabitStep] = useState(() => parseInt(localStorage.getItem('habits_habit_step') || '0'));
  
  useEffect(() => {
    localStorage.setItem('habits_habit_step', habitStep.toString());
  }, [habitStep]);
  const [testType, setTestType] = useState<TestType>(() => (localStorage.getItem('habits_test_type') as TestType) || 'comprehensive');
  
  useEffect(() => {
    localStorage.setItem('habits_test_type', testType);
  }, [testType]);
  
  const [hideResults, setHideResults] = useState(() => localStorage.getItem('habits_hide_results') === 'true');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('habits_hide_results', hideResults.toString());
  }, [hideResults]);

  // answers[areaId][questionIndex] = optionIndex
  const [answers, setAnswers] = useState<Record<string, Record<number, number>>>(() => {
    const saved = localStorage.getItem('habits_answers');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('habits_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    if (activeAreaId) localStorage.setItem('habits_active_area', activeAreaId);
    else localStorage.removeItem('habits_active_area');
  }, [activeAreaId]);

  useEffect(() => {
    localStorage.setItem('habits_current_step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('habits_test_type', testType);
  }, [testType]);

  const filteredAreas = useMemo(() => {
    if (testType === 'comprehensive') return LIFE_AREAS;
    return LIFE_AREAS.map(area => ({
      ...area,
      questions: Array.isArray(area.questions) ? area.questions.slice(0, 2) : []
    }));
  }, [testType]);

  // Flat list of all questions across all areas
  const allQuestions = useMemo(() => {
    return filteredAreas.flatMap(area => 
      Array.isArray(area.questions) 
        ? area.questions.map((q, idx) => ({ ...q, areaId: area.id, areaTitle: area.title, areaBg: area.bg, areaColor: area.color, areaIcon: area.icon, localStep: idx }))
        : []
    );
  }, [filteredAreas]);

  const activeArea = filteredAreas.find(a => a.id === activeAreaId);

  // --- Derived State & Calculations ---
  const completedAreasCount = Object.keys(answers).filter(areaId => {
    const area = filteredAreas.find(a => a.id === areaId);
    return area && Array.isArray(area.questions) && Object.keys(answers[areaId] || {}).length === area.questions.length;
  }).length;

  const totalAreas = filteredAreas.length;
  const isAllCompleted = completedAreasCount === totalAreas;

  const detectedBadHabits = useMemo(() => {
    const badHabits: { area: string; habit: string; solution: string; punishment?: string; harm?: string; areaColor: string; areaBg: string; areaIcon: any }[] = [];
    Object.entries(answers).forEach(([areaId, areaAnswers]) => {
      const area = filteredAreas.find(a => a.id === areaId);
      if (!area) return;
      Object.entries(areaAnswers).forEach(([localStepStr, optIndex]) => {
        const localStep = parseInt(localStepStr);
        const question = area.questions[localStep];
        if (!question) return;
        const option = question.options[optIndex];
        if (option && option.isBad) {
          badHabits.push({
            area: area.title,
            habit: option.habitName || option.text,
            solution: option.recoveryStep || 'لا يوجد خطوات تحسين محددة حالياً.',
            punishment: option.punishment,
            harm: option.harm,
            areaColor: area.color,
            areaBg: area.bg,
            areaIcon: area.icon
          });
        }
      });
    });
    return badHabits;
  }, [answers, filteredAreas]);

  const detectedGoodHabits = useMemo(() => {
    const goodHabits: { area: string; habit: string; benefit: string; consistency: string; areaColor: string; areaBg: string; areaIcon: any }[] = [];
    Object.entries(answers).forEach(([areaId, areaAnswers]) => {
      const area = filteredAreas.find(a => a.id === areaId);
      if (!area) return;
      Object.entries(areaAnswers).forEach(([localStepStr, optIndex]) => {
        const localStep = parseInt(localStepStr);
        const question = area.questions[localStep];
        if (!question) return;
        const option = question.options[optIndex];
        if (option && !option.isBad) {
          goodHabits.push({
            area: area.title,
            habit: option.habitName || option.text,
            benefit: option.benefit || 'تزيد من صفاء ذهنك، وتقوي إرادتك، وتجعلك أقرب إلى تحقيق أهدافك ورضا الله.',
            consistency: option.consistency || 'حافظ على هذه العادة بربطها بوقت ثابت يومياً، وكافئ نفسك على الاستمرار.',
            areaColor: area.color,
            areaBg: area.bg,
            areaIcon: area.icon
          });
        }
      });
    });
    return goodHabits;
  }, [answers, filteredAreas]);

  // Calculate a "Purity Score" (100 - penalty for bad habits)
  const purityScore = useMemo(() => {
    if (completedAreasCount === 0) return 0;
    const totalQuestionsAnswered = Object.values(answers).reduce((acc: number, curr) => acc + Object.keys(curr).length, 0);
    if (totalQuestionsAnswered === 0) return 0;
    
    const badAnswersCount = detectedBadHabits.length;
    const score = Math.max(0, Math.round(((Number(totalQuestionsAnswered) - Number(badAnswersCount)) / Number(totalQuestionsAnswered)) * 100));
    return score;
  }, [answers, detectedBadHabits, completedAreasCount]);

    const getPersonalityType = () => {
    if (detectedBadHabits.length === 0) {
      return { 
        type: 'المتوازن', 
        description: 'أنت الآن في مرحلة من التوازن والوعي، حيث تدرك خيوط عاداتك وتتحكم في مسار يومك بوضوح. أنت لست ضائعاً، بل تسير في طريق مرسوم بوعي.', 
        fateDunya: 'ستستمر في الارتقاء والوصول لأعلى مراتب النجاح، حيث يتحول كل يوم إلى لبنة جديدة في بناء صرح حياتك العظيم.',
        fateAkhirah: 'ستعيش في سلام نفسي عميق ورضا رباني يغمر روحك، وتجني ثمار ما زرعته من خير في دنياك.',
        icon: Crown, 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/10', 
        border: 'border-emerald-500/20' 
      };
    }

    // New condition: if bad habits are few, return a positive type
    if (detectedBadHabits.length <= 2) {
      return { 
        type: 'المجتهد الواعي', 
        description: 'أنت تسير في الطريق الصحيح، ولديك عادات إيجابية قوية. بعض الهفوات البسيطة لا تقلل من شأن إنجازاتك، استمر في التحسن.', 
        fateDunya: 'ستحقق توازناً رائعاً بين الإنتاجية والراحة، وتصل لأهدافك بثبات.',
        fateAkhirah: 'ستكون من الذين يحرصون على أوقاتهم وأعمالهم، وتجني ثمار اجتهادك.',
        icon: Target, 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/10', 
        border: 'border-emerald-500/20' 
      };
    }

    const areaCounts: Record<string, number> = {};
    detectedBadHabits.forEach(h => {
      areaCounts[h.area] = (areaCounts[h.area] || 0) + 1;
    });

    let maxArea = '';
    let maxCount = 0;
    Object.entries(areaCounts).forEach(([area, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxArea = area;
      }
    });

    switch (maxArea) {
      case 'الإنتاجية والعمل':
        return { 
          type: 'المتخبط في المتاهة', 
          description: 'أنت كمن يسير في طريق طويل دون بوصلة، تستهلك طاقتك في مهام لا تغني ولا تسمن من جوع. أنت تائه في متاهة من التشتت، تظن أنك تتقدم بينما أنت تدور في حلقة مفرغة.', 
          fateDunya: 'أن تقضي عمرك في مطاردة السراب، وتكتشف في نهاية الطريق أنك ركضت كثيراً ولكن في المكان الخطأ.',
          fateAkhirah: 'أن يورثك هذا التشتت حسرة عميقة على ما كان يمكن أن تكون عليه من إنجازات لم تتحقق.',
          icon: Zap, 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/20' 
        };
      case 'الصحة والجسد':
        return { 
          type: 'المستنزف لجسده', 
          description: 'أنت كمن يعامل جسده كأنه عدو، تستنزف طاقته وتنهشه بعادات تتركك في حالة من الإرهاق الدائم. أنت تائه في متاهة من الإهمال الذي يمنعك من رؤية جمال الحياة.', 
          fateDunya: 'أن تذبل زهرة حياتك قبل أوانها، وتفقد القدرة على تذوق طعم الإنجازات.',
          fateAkhirah: 'لتجد نفسك في النهاية أسير جسدٍ خذلته عاداتك، وقلبٍ أنهكه التعب.',
          icon: Heart, 
          color: 'text-rose-400', 
          bg: 'bg-rose-500/10', 
          border: 'border-rose-500/20' 
        };
      case 'الوعي المالي':
        return { 
          type: 'الغارق في الملذات', 
          description: 'أنت تائه في متاهة من الرغبات اللحظية التي تملي عليك قراراتك المالية. عواطفك هي التي تقود سفينتك نحو الهاوية، مما يجعلك تبتعد عن شاطئ الأمان المالي.', 
          fateDunya: 'أن تعيش في دوامة من القلق الدائم، حيث تلاحقك الديون كظلك، وتفقد حريتك في اتخاذ قراراتك.',
          fateAkhirah: 'لتجد نفسك في نهاية المطاف مقيداً بحاجات لم تكن يوماً ضرورة، وقد ضيعت أمانة المال.',
          icon: Wallet, 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-500/20' 
        };
      case 'العلاقات والاجتماعيات':
        return { 
          type: 'المنعزل في غفلته', 
          description: 'أنت موجود بجسدك، لكن روحك تائهة في متاهة من الأفكار والمشتتات التي تعزلك عن أقرب الناس إليك. أنت كمن يقرأ كتاباً بجانب من يحب، لكنه لا يسمع صوته.', 
          fateDunya: 'أن تجد نفسك وحيداً في وسط الزحام، وقد تلاشت الروابط التي كانت تجمعك بمن تحب.',
          fateAkhirah: 'لتدرك متأخراً أن أغلى ما تملك قد ضاع لأنك لم تكن حاضراً بقلبك، ولم تؤدِّ حق من حولك.',
          icon: Users, 
          color: 'text-blue-400', 
          bg: 'bg-blue-500/10', 
          border: 'border-blue-500/20' 
        };
      case 'آفات النفس والخطايا':
        return { 
          type: 'أسير الرغبات افضل من الفجور', 
          description: 'أنت تائه في متاهة من الشهوات والاندفاعات التي تسيطر على إرادتك. أنت تحاول الخروج، لكن عاداتك تشدك إلى الوراء في كل مرة.', 
          fateDunya: 'أن تغرق في بحر من الندم الذي لا ينتهي، وتفقد بريق روحك الذي كان يوماً يضيء دروبك.',
          fateAkhirah: 'لتجد نفسك في النهاية بعيداً عن كل ما هو طاهر وجميل، وتواجه عواقب ما اقترفت يداك.',
          icon: Flame, 
          color: 'text-fuchsia-400', 
          bg: 'bg-fuchsia-500/10', 
          border: 'border-fuchsia-500/20' 
        };
      default:
        return { 
          type: 'التائه في متاهته', 
          description: 'أنت في مرحلة صعبة، تشعر أنك تائه تماماً في متاهة من العادات المتضاربة. أنت تملك الرغبة في التغيير، لكنك تحتاج إلى بوصلة حقيقية.', 
          fateDunya: 'أن تظل عالقاً في منتصف الطريق، لا أنت وصلت إلى قمة طموحك، ولا أنت تراجعت إلى الوراء.',
          fateAkhirah: 'لتكتشف أن الحياة قد مرت بينما كنت تنتظر اللحظة المناسبة للبدء، ولم تستثمر وقتك كما يجب.',
          icon: Brain, 
          color: 'text-purple-400', 
          bg: 'bg-purple-500/10', 
          border: 'border-purple-500/20' 
        };
    }
  };

  // --- Handlers ---
  const handleStartArea = (areaId: string) => {
    setActiveAreaId(areaId);
    const areaIndex = filteredAreas.findIndex(a => a.id === areaId);
    let globalIndex = 0;
    for (let i = 0; i < areaIndex; i++) {
      globalIndex += Array.isArray(filteredAreas[i].questions) ? filteredAreas[i].questions.length : 0;
    }
    setCurrentStep(globalIndex);
    handleSetView('test');
  };

  const handleAnswer = (optIndex: number) => {
    if (isTransitioning) return;
    const currentQuestion = allQuestions[currentStep];
    if (!currentQuestion) return;
    
    setIsTransitioning(true);
    playPop();
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.areaId]: {
        ...(prev[currentQuestion.areaId] || {}),
        [currentQuestion.localStep]: optIndex // Using localStep as key
      }
    }));

    if (currentStep < allQuestions.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setTimeout(() => {
        setTestFinished(true);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setTestFinished(false);
    }
  };

  const showFinalResults = () => {
    // Only celebrate if score is good (>= 70)
    if (purityScore >= 70) {
      playLevelUp();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      });
    }
    
    onActivityComplete?.(50); // Award 50 XP for completing the habits test
    
    handleSetView('results');
  };

  const handleContinue = () => {
    console.log('handleContinue called, onComplete exists:', !!onComplete);
    localStorage.removeItem('habits_view');
    if (onComplete) {
      console.log('Calling onComplete...');
      onComplete();
    }
  };

  const startActualTest = (type: TestType) => {
    setTestType(type);
    setAnswers({});
    setCurrentStep(0);
    setTestFinished(false);
    handleSetView('test');
  };

  const resetAll = () => {
    setAnswers({});
    setActiveAreaId(null);
    setCurrentStep(0);
    setTestFinished(false);
    setReviewMode(null);
    setHabitStep(0);
    handleSetView('test_selection');
    localStorage.removeItem('habits_answers');
    localStorage.removeItem('habits_active_area');
    localStorage.removeItem('habits_current_step');
    localStorage.removeItem('habits_view');
    localStorage.removeItem('habits_recovery_tasks');
  };

  const renderTestSelection = () => {
    const simpleCount = LIFE_AREAS.reduce((acc, area) => acc + Math.min(Array.isArray(area.questions) ? area.questions.length : 0, 2), 0);
    const compCount = LIFE_AREAS.reduce((acc, area) => acc + (Array.isArray(area.questions) ? area.questions.length : 0), 0);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative min-h-screen flex flex-col items-center justify-start md:justify-center py-12 px-4 overflow-y-auto"
      >
        <div className="absolute inset-0 -z-10 fixed">
          <div className="absolute inset-0 bg-atmospheric opacity-60" />
        </div>

        {onBack && (
          <div className="absolute top-4 right-4 z-20">
            <Button
              onClick={onBack}
              variant="ghost"
              className="w-10 h-10 p-0 flex items-center justify-center bg-white/10 hover:bg-white/20 text-gray-900 dark:text-white rounded-full backdrop-blur-md"
            >
              <ArrowRight size={20} />
            </Button>
          </div>
        )}

        <div className="max-w-4xl w-full text-center space-y-8 md:space-y-12 relative z-10 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">اختر نوع اختبار العادات</h2>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-xl">حدد مدى عمق التحليل الذي ترغب به لعاداتك اليومية</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Simple Test Card */}
            <Button
              onClick={() => startActualTest('simple')}
              variant="ghost"
              className="group relative text-right bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/5 hover:border-emerald-500/30 p-6 md:p-8 rounded-[2rem] transition-all hover:scale-105 overflow-hidden h-auto flex flex-col items-start shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 md:mb-6">
                <Activity size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">اختبار بسيط</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-4 md:mb-6 leading-relaxed font-normal">أسئلة سريعة ومختصرة لأهم العادات الأساسية في حياتك.</p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 w-fit px-4 py-2 rounded-full text-sm">
                <Target size={16} />
                <span>{simpleCount} سؤال</span>
              </div>
            </Button>

            {/* Comprehensive Test Card */}
            <Button
              onClick={() => startActualTest('comprehensive')}
              variant="ghost"
              className="group relative text-right bg-white dark:bg-[#181818] border border-indigo-500/30 hover:border-indigo-500/60 p-6 md:p-6 rounded-[2rem] transition-all hover:scale-105 overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.1)] h-auto flex flex-col items-start"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 md:mb-4">
                <Brain size={24} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-xl md:text-xl font-black text-gray-900 dark:text-white mb-2">اختبار احترافي</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-sm mb-4 md:mb-4 leading-relaxed font-normal">تحليل شامل وعميق لكل عاداتك اليومية بالتفصيل والدقة.</p>
              <div className="flex items-center gap-2 text-indigo-400 font-bold bg-indigo-500/10 w-fit px-4 py-2 rounded-full text-sm">
                <Sparkles size={16} />
                <span>{compCount} سؤال</span>
              </div>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // --- Renderers ---
  const renderTest = () => {
    const question = allQuestions[currentStep];
    if (!question || !question.options) return <div className="text-gray-900 dark:text-white">خطأ: لم يتم العثور على السؤال أو خياراته</div>;
    const progress = ((currentStep) / allQuestions.length) * 100;

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-white dark:bg-[#0a0a0a] flex flex-col overflow-hidden transition-colors duration-300"
      >
        {/* Background Atmosphere */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-atmospheric opacity-40" />
          <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-${question.areaBg.split('-')[1]}-500/10 to-transparent opacity-30`} />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-6 p-6 md:p-10">
          {/* Previous Question Icon (where X was) */}
          {currentStep > 0 ? (
            <Button 
              onClick={handlePrevious} 
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all hover:scale-110 active:scale-90 group h-auto"
            >
              <ArrowRight size={28} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
            </Button>
          ) : onBack ? (
            <Button 
              onClick={onBack} 
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all hover:scale-110 active:scale-90 group h-auto"
            >
              <ArrowRight size={28} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
            </Button>
          ) : (
            <div className="w-[52px]" /> // Spacer to maintain layout
          )}
          
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex justify-center items-center">
              <span className={`text-sm font-black uppercase tracking-[0.2em] ${question.areaColor}`}>
                {question.areaTitle}
              </span>
            </div>
            <div className="relative h-5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden backdrop-blur-sm flex items-center justify-center">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className={`absolute top-0 right-0 h-full ${question.areaBg} rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
              />
              <span className="relative z-10 text-[11px] font-bold text-gray-900 dark:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {currentStep + 1} / {allQuestions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={showFinalResults}
              variant="ghost"
              size="sm"
              className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold px-4 hidden md:block"
            >
              تخطي الاختبار
            </Button>
            <Button 
              onClick={() => handleSetView('test_selection')} 
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all hover:scale-110 active:scale-90 group h-auto"
            >
              <X size={28} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 flex-1 flex flex-col w-full overflow-hidden">
          <AnimatePresence mode="wait">
            {testFinished ? (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex-1 flex flex-col w-full h-full"
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-12 max-w-4xl mx-auto w-full">
                  <div className="relative mb-6 md:mb-8">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"
                    />
                    <div className="relative w-24 h-24 md:w-28 md:h-28 bg-emerald-500/20 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center border border-emerald-500/30">
                      <Lucide.CheckCircle2 size={48} className="text-emerald-400 md:w-12 md:h-12" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 md:space-y-4">
                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">اكتملت الرحلة!</h2>
                    <p className="text-base md:text-xl text-gray-400 max-w-md mx-auto font-medium leading-relaxed px-2">
                      لقد قمت بالإجابة على جميع الأسئلة بصدق. نحن جاهزون الآن لعرض تحليلك الشامل.
                    </p>
                  </div>
                </div>

                <div className="w-full p-6 md:p-12 max-w-2xl mx-auto mt-auto">
                  <Button
                    onClick={showFinalResults}
                    variant="primary"
                    size="xl"
                    fullWidth
                  >
                    <span>عرض التحليل العميق</span>
                    <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col w-full h-full"
              >
                <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 max-w-4xl mx-auto w-full overflow-y-auto">
                  <h2 className="text-2xl md:text-3xl font-black text-white text-center leading-relaxed">
                    {question.text}
                  </h2>
                </div>

                <div className="w-full p-6 md:p-8 max-w-2xl mx-auto mt-auto">
                  <div className="space-y-3 md:space-y-3 w-full">
                    {Array.isArray(question.options) && question.options.map((opt, idx) => {
                      const isSelected = answers[question.areaId]?.[question.localStep] === idx;
                      return (
                        <Button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          variant="ghost"
                          className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 text-right font-bold transition-all text-base md:text-lg flex justify-between items-center h-auto ${
                            isSelected
                              ? `${question.areaBg.replace('bg-', 'bg-').replace('-500', '-500/20')} ${question.areaBg.replace('bg-', 'border-').replace('-500', '-500/50')} ${question.areaColor}`
                              : 'bg-[#181818] border-white/5 text-white hover:border-white/20 hover:bg-[#282828]'
                          }`}
                        >
                          {isSelected && <CheckCircle2 size={24} className={question.areaColor} />}
                          <span>{opt.text}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const getNextArea = () => {
    const firstUncompletedIndex = filteredAreas.findIndex(area => !(answers[area.id] && Array.isArray(area.questions) && Object.keys(answers[area.id]).length === area.questions.length));
    if (firstUncompletedIndex !== -1) {
      return filteredAreas[firstUncompletedIndex];
    }
    return null;
  };

  const renderAreaResult = () => {
    if (!activeArea) return null;
    const areaAnswers = answers[activeArea.id] || {};
    const badHabitsCount = Object.entries(areaAnswers).filter(([qIdx, optIdx]) => {
      const question = activeArea.questions[parseInt(qIdx)];
      if (!question || !Array.isArray(question.options)) return false;
      const option = question.options[optIdx as number];
      return option ? option.isBad : false;
    }).length;
    const totalQuestions = Array.isArray(activeArea.questions) ? activeArea.questions.length : 0;
    const goodHabitsCount = totalQuestions - badHabitsCount;
    const score = Math.round((goodHabitsCount / totalQuestions) * 100);
    const nextArea = getNextArea();

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-white dark:bg-[#121212] transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-4 md:p-6">
          <Button 
            onClick={() => handleSetView('test_selection')} 
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#282828] rounded-full transition-colors h-auto"
          >
            <X size={24} className="text-gray-400 dark:text-[#b3b3b3] hover:text-gray-900 dark:hover:text-white" />
          </Button>
          <div className="flex-1 h-3 bg-gray-100 dark:bg-[#282828] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className={`h-full ${activeArea.bg} rounded-full`}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">نتيجة {activeArea.title}</h2>
          </div>

          <div className={`bg-gradient-to-br from-${activeArea.bg.replace('bg-', '')}/40 to-gray-50 dark:to-[#181818] p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-${activeArea.bg.replace('bg-', '')}/20 flex flex-col items-center text-center relative overflow-hidden shadow-xl transition-colors duration-300`}>
            <div className={`absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 ${activeArea.bg.replace('bg-', 'bg-').replace('-500', '-500/10')} rounded-full blur-3xl -z-10`} />
            
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${activeArea.bg.replace('bg-', 'bg-').replace('-500', '-500/20')} ${activeArea.color} flex items-center justify-center mb-3 md:mb-4`}>
              {activeArea.icon ? <activeArea.icon className="w-8 h-8 md:w-10 md:h-10" /> : null}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-600 dark:text-gray-300 mb-1 md:mb-2">{activeArea.title}</h3>
            <div className={`text-5xl md:text-6xl font-black ${activeArea.color} mb-3 md:mb-4`}>
              {score}%
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-md mb-8">
              {score === 100 ? 'أداء ممتاز! عاداتك في هذا الجانب صحية جداً.' :
               score >= 50 ? 'أداء جيد، لكن هناك مجال للتحسين والتطوير.' :
               'تحتاج إلى وقفة جادة لتحسين عاداتك في هذا الجانب.'}
            </p>

            <Button 
              onClick={() => handleSetView('test_selection')}
              variant="secondary"
              size="lg"
              className="rounded-full px-8"
            >
              العودة لجوانب الحياة
            </Button>
          </div>
        </div>

        {/* Fixed Buttons */}
        <div className="p-6 md:p-12 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] transition-colors duration-300">
          <div className="max-w-2xl mx-auto w-full">
            {nextArea ? (
              <Button 
                onClick={() => handleStartArea(nextArea.id)}
                variant="primary"
                size="xl"
                fullWidth
              >
                الاختبار التالي: {nextArea.title}
                <ArrowLeft size={20} />
              </Button>
            ) : (
              <Button 
                onClick={() => handleSetView('results')}
                variant="primary"
                size="xl"
                fullWidth
              >
                إظهار النتيجة العامة
                <ArrowLeft size={20} />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const handleReset = () => {
    setAnswers({});
    setTestFinished(false);
    setReviewMode(null);
    setHabitStep(0);
    handleSetView('test_selection');
    localStorage.removeItem('habits_answers');
    localStorage.removeItem('habits_active_area');
    localStorage.removeItem('habits_current_step');
    localStorage.removeItem('habits_view');
    localStorage.removeItem('habits_recovery_tasks');
  };


  const renderResults = () => {
    const personality = getPersonalityType();
    const totalQuestions = allQuestions.length;
    const negativeHabitsCount = detectedBadHabits.length;
    const positiveHabitsCount = detectedGoodHabits.length;

    if (reviewMode === null) {
      return (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative flex flex-col w-full"
        >
          {/* Background Atmosphere */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-atmospheric opacity-40" />
            <div className="absolute top-0 left-0 w-1/2 h-full bg-emerald-500/5 blur-[120px]" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-rose-500/5 blur-[120px]" />
          </div>

          {onBack && (
            <div className="absolute top-4 right-4 z-20">
              <Button
                onClick={onBack}
                variant="ghost"
                className="w-10 h-10 p-0 flex items-center justify-center bg-white/10 hover:bg-white/20 text-gray-900 dark:text-white rounded-full backdrop-blur-md"
              >
                <ArrowRight size={20} />
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto pt-0 pb-24 md:pb-32">
            <div className="p-0 flex flex-col w-full">
              
              <AnimatePresence>
                {!hideResults && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col gap-4 items-center w-full relative z-10"
                  >
                    
                    {/* Good vs Evil Comparison UI */}
                    <div className="w-full relative py-4">
                      <div className="flex items-center justify-between gap-4 relative z-10">
                        {/* Good Side */}
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex-1 flex flex-col items-center gap-4 px-4 m-0"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10">
                              <span className="text-3xl md:text-5xl font-black text-emerald-500">{positiveHabitsCount}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-emerald-500 font-black text-sm md:text-base">الجانب المشرق</div>
                            <div className="text-emerald-500/40 text-[10px] font-bold uppercase tracking-widest">عادات إيجابية</div>
                          </div>
                          
                          {/* Small Side Button */}
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Button
                              onClick={() => {
                                setReviewMode('good');
                                setHabitStep(0);
                              }}
                              variant="success"
                              className="px-4 py-2 h-auto text-xs font-black rounded-full shadow-lg shadow-emerald-500/20"
                            >
                              استكشاف الإيجابيات
                            </Button>
                          </motion.div>
                        </motion.div>

                        {/* VS Divider */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                          <div className="text-white/20 font-black italic text-xl">VS</div>
                          <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                        </div>

                        {/* Evil Side */}
                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex-1 flex flex-col items-center gap-4 pl-[17px] pr-4 m-0"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
                            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-rose-500/30 flex items-center justify-center bg-rose-500/10">
                              <span className="text-3xl md:text-5xl font-black text-rose-500">{negativeHabitsCount}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-rose-500 font-black text-sm md:text-base">الجانب المظلم</div>
                            <div className="text-rose-500/40 text-[10px] font-bold uppercase tracking-widest">عادات سلبية</div>
                          </div>

                          {/* Small Side Button */}
                          <motion.div
                            animate={{ y: [0, 4, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Button
                              onClick={() => {
                                setReviewMode('bad');
                                setHabitStep(0);
                              }}
                              variant="primary"
                              className="px-4 py-2 h-auto text-xs font-black rounded-full shadow-lg shadow-rose-500/20"
                            >
                              استكشاف السلبيات
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>

                    </div>

                    {/* Advice Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="w-full"
                    >
                      <div className={`p-6 rounded-[2.5rem] ${purityScore <= 30 ? 'bg-rose-500/10 border-rose-500/20' : purityScore <= 60 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-center backdrop-blur-xl border relative group mx-4`}>
                        <h4 className={`${purityScore <= 30 ? 'text-rose-400' : purityScore <= 60 ? 'text-amber-400' : 'text-emerald-400'} font-black text-lg mb-4`}>نصيحة لمستقبلك</h4>
                        <p className={`${purityScore <= 30 ? 'text-rose-100/80' : purityScore <= 60 ? 'text-amber-100/80' : 'text-emerald-100/80'} leading-relaxed font-medium text-lg mb-0`}>
                          {purityScore <= 30 
                            ? "حالتك تستدعي وقفة جادة وعاجلة. العادات التي تم رصدها تؤثر بشكل مباشر على جودة حياتك وتوازنك الشخصي. ابدأ الآن بخطوات صغيرة ولكن ثابتة."
                            : purityScore <= 60
                            ? "أنت في مرحلة تتطلب انتباهاً أكبر. العادات السلبية التي تم رصدها قد تبدو بسيطة، لكن تراكمها يؤثر على نموك الشخصي. استثمر في التغيير الآن."
                            : purityScore <= 85
                            ? "أداء جيد جداً! أنت على الطريق الصحيح، استمر في تعزيز عاداتك الإيجابية وتجاوز الهفوات البسيطة."
                            : "أداء مذهل! أنت تعيش بوعي عالٍ وتوازن رائع. حافظ على هذا المستوى واستمر في الارتقاء."}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons Group */}
              <div className="flex items-center justify-center gap-3 mt-8 mb-12">
                <Button
                  onClick={() => setHideResults(!hideResults)}
                  variant="ghost"
                  size="sm"
                  className="border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/5 rounded-full px-6 py-2 h-auto text-xs font-bold transition-all flex items-center gap-2"
                >
                  {hideResults ? (
                    <>
                      عرض النتيجة
                      <Activity size={14} />
                    </>
                  ) : (
                    <>
                      إخفاء النتيجة
                      <X size={14} />
                    </>
                  )}
                </Button>

                {!hideResults && (
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                    className="border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/5 rounded-full px-6 py-2 h-auto text-xs font-bold transition-all flex items-center gap-2"
                  >
                    إعادة الاختبار
                    <RotateCcw size={14} />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Fixed Continue Button */}
          {onComplete && (
            <div className="w-full mt-auto border-t border-gray-200 dark:border-white/5 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl relative z-[70] transition-colors duration-300">
              <div className="p-6 md:p-12 max-w-2xl mx-auto w-full pb-10 md:pb-12">
                <Button
                  onClick={handleContinue}
                  variant="secondary"
                  size="xl"
                  fullWidth
                  className="shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  الاستمرار للخطوة التالية
                  <ArrowLeft size={24} />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      );
    }

    const isBadMode = reviewMode === 'bad';
    const currentHabitsList = isBadMode ? detectedBadHabits : detectedGoodHabits;
    const habit = currentHabitsList[habitStep];

    if (!habit) {
      setTimeout(() => {
        setReviewMode(null);
        setHabitStep(0);
        handleSetView('test_selection');
      }, 0);
      return null;
    }

    const HabitIcon = habit.areaIcon || AlertCircle;

    return (
      <motion.div
        key={`habit-${reviewMode}-${habitStep}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-300"
      >
        {/* Atmospheric Background */}
        <div className={`absolute inset-0 ${isBadMode ? 'bg-rose-600 opacity-20' : 'bg-emerald-500 opacity-10'} blur-[100px] pointer-events-none`} />
        <div className="absolute inset-0 bg-atmospheric opacity-40 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4 p-4 md:p-6">
          <Button 
            onClick={() => {
              setReviewMode(null);
              setHabitStep(0);
            }} 
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors h-auto"
          >
            <ArrowRight size={24} className="text-gray-400 dark:text-[#b3b3b3] hover:text-gray-900 dark:hover:text-white" />
          </Button>
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((habitStep + 1) / currentHabitsList.length) * 100}%` }}
              className={`h-full ${isBadMode ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
            />
          </div>
          <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {habitStep + 1} / {currentHabitsList.length}
          </div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 flex flex-col max-w-3xl mx-auto w-full justify-center">
          <div className="flex justify-center mb-6">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-6 py-2 rounded-xl bg-gradient-to-r ${isBadMode ? 'from-red-500/20 via-red-600/20 to-red-500/20 text-red-900 dark:text-red-100 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'from-emerald-500/20 via-emerald-600/20 to-emerald-500/20 text-emerald-900 dark:text-emerald-100 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]'} font-black text-lg border animate-pulse`}
            >
              {habit.habit}
            </motion.span>
          </div>
          <div className="space-y-8">
            {isBadMode ? (
              <>
                {habit.harm && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }} 
                    className="bg-orange-500/[0.05] border border-orange-500/10 p-6 md:p-8 rounded-3xl backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <AlertCircle size={24} />
                      </div>
                      <h3 className="text-xl font-black text-orange-600 dark:text-orange-400 tracking-tight">الضرر الناتج</h3>
                    </div>
                    <p className="text-orange-900/70 dark:text-orange-100/70 text-base md:text-xl leading-relaxed font-medium">{habit.harm}</p>
                  </motion.div>
                )}

                {habit.punishment && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }} 
                    className="bg-rose-500/[0.05] border border-rose-500/10 p-6 md:p-8 rounded-3xl backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                        <ShieldAlert size={24} />
                      </div>
                      <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 tracking-tight">العاقبة والوعيد</h3>
                    </div>
                    <p className="text-rose-900/70 dark:text-rose-100/70 text-base md:text-xl leading-relaxed font-medium">{habit.punishment}</p>
                  </motion.div>
                )}

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }} 
                  className="bg-emerald-500/[0.03] border border-emerald-500/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">خطوات التحسين والتعافي</h3>
                  </div>
                  <p className="text-emerald-900/80 dark:text-emerald-100/80 text-base md:text-xl leading-relaxed font-medium">{'solution' in habit ? habit.solution : ''}</p>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }} 
                  className="bg-emerald-500/[0.03] border border-emerald-500/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">النفع</h3>
                  </div>
                  <p className="text-emerald-900/80 dark:text-emerald-100/80 text-base md:text-xl leading-relaxed font-medium">{'benefit' in habit ? habit.benefit : ''}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }} 
                  className="bg-blue-500/[0.03] border border-blue-500/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <ShieldAlert size={24} />
                    </div>
                    <h3 className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">الاستمرارية والثبات</h3>
                  </div>
                  <p className="text-blue-900/80 dark:text-blue-100/80 text-base md:text-xl leading-relaxed font-medium">{'consistency' in habit ? habit.consistency : ''}</p>
                </motion.div>
              </>
            )}
          </div>
        </div>
        {/* Fixed Buttons */}
        <div className="p-4 md:p-4 border-t border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl relative z-10 pb-4 md:pb-4 mt-auto transition-colors duration-300">
          <div className="flex gap-4 max-w-3xl mx-auto w-full">
            <Button
              onClick={() => setHabitStep(prev => prev - 1)}
              variant="secondary"
              size="xl"
              fullWidth
              disabled={habitStep === 0}
              className={`flex-1 ${habitStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowRight size={24} />
              <span>السابق</span>
            </Button>
            <Button
              onClick={() => {
                if (habitStep === currentHabitsList.length - 1) {
                  setReviewMode(null);
                  setHabitStep(0);
                } else {
                  setHabitStep(prev => prev + 1);
                }
              }}
              variant={isBadMode ? "primary" : "success"}
              size="xl"
              className="flex-1"
              fullWidth
            >
              <span>{habitStep === currentHabitsList.length - 1 ? 'إنهاء المراجعة' : 'العادة التالية'}</span>
              <ArrowLeft size={24} />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="pb-24 pt-0 px-0">
      <AnimatePresence mode="wait">
        {view === 'test_selection' && <div key="test_selection">{renderTestSelection()}</div>}
        {view === 'test' && <div key="test">{renderTest()}</div>}
        {view === 'area_result' && <div key="area_result">{renderAreaResult()}</div>}
        {view === 'results' && <div key="results">{renderResults()}</div>}
      </AnimatePresence>
    </div>
  );
};
