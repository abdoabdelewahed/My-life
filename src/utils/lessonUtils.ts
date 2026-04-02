import { RoadmapNode } from '../data/roadmapData';

export const generateLessonContent = (node: RoadmapNode) => {
  const tasksContent = node.tasks.map((task, index) => {
    return `الخطوة ${index + 1}: ${task.title}\nهذه الخطوة تعتبر أساسية في رحلتك نحو ${node.title}. من خلال التركيز على ${task.title}، ستبدأ في ملاحظة تغييرات إيجابية في طريقة تفكيرك وتعاملك مع المواقف اليومية.\nتذكر دائماً أن التغيير يحتاج إلى وقت وممارسة مستمرة. لا تستعجل النتائج وكن لطيفاً مع نفسك خلال هذه العملية.`;
  }).join('\n\n');

  const fullContent = `مرحباً بك في درس ${node.title}!\n${node.description}\nفي هذا الدرس، سنتعمق أكثر في فهم هذه المهارة وكيفية تطبيقها بشكل عملي في حياتك اليومية لتحقيق أقصى استفادة ممكنة.\n\n${tasksContent}\n\nالخلاصة\nلقد تعرفنا في هذا الدرس على أهمية ${node.title} وكيف يمكن أن تؤثر إيجابياً على حياتنا. استمر في ممارسة التمارين المذكورة وستلاحظ الفرق بنفسك!`;

  return {
    id: node.id,
    title: node.title,
    description: node.description,
    icon: node.iconName,
    content: fullContent,
    quiz: {
      question: `ما هو الهدف الأساسي من ${node.title}؟`,
      options: [
        `تطوير الذات والنمو المستمر`,
        `تجاهل المشاعر وتجنب المواجهة`,
        `الاستسلام للواقع دون محاولة التغيير`
      ],
      correctIndex: 0,
      explanation: `${node.title} يهدف بشكل أساسي إلى التطوير والنمو الشخصي المستمر من خلال الوعي والممارسة.`
    },
    xp: 50,
    pathId: 'mindset-development'
  };
};
