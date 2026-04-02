
import { ASSESSMENTS } from './abilitiesData';

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  iconName: string;
  status: 'locked' | 'unlocked' | 'completed';
  progress: string;
  type: 'diamond' | 'hexagon';
  tasks: { id: string; title: string; completed: boolean }[];
}

export interface AbilityRoadmap {
  abilityId: string;
  title: string;
  nodes: RoadmapNode[][];
}

export const ROADMAP_DATA: Record<string, AbilityRoadmap> = {
  'self_esteem': {
    abilityId: 'self_esteem',
    title: 'تقدير الذات',
    nodes: [
      [
        {
          id: 'se_1',
          title: 'الوعي بالذات',
          description: 'فهم نقاط القوة والضعف الشخصية',
          iconName: 'Search',
          status: 'completed',
          progress: '3/3',
          type: 'diamond',
          tasks: [
            { id: 'se_1_t1', title: 'تمرين المرآة اليومي', completed: true },
            { id: 'se_1_t2', title: 'كتابة 5 إنجازات', completed: true },
            { id: 'se_1_t3', title: 'تحديد القيم الجوهرية', completed: true }
          ]
        },
        {
          id: 'se_2',
          title: 'قبول الذات',
          description: 'تقبل العيوب والعمل على تحسينها',
          iconName: 'Heart',
          status: 'completed',
          progress: '3/3',
          type: 'diamond',
          tasks: [
            { id: 'se_2_t1', title: 'رسالة حب للذات', completed: true },
            { id: 'se_2_t2', title: 'تمرين التسامح مع الماضي', completed: true },
            { id: 'se_2_t3', title: 'تأكيدات إيجابية صباحية', completed: true }
          ]
        }
      ],
      [
        {
          id: 'se_3',
          title: 'الحديث الإيجابي',
          description: 'تغيير الحوار الداخلي السلبي',
          iconName: 'MessageCircle',
          status: 'unlocked',
          progress: '0/3',
          type: 'hexagon',
          tasks: [
            { id: 'se_3_t1', title: 'مراقبة الأفكار السلبية', completed: false },
            { id: 'se_3_t2', title: 'تحدي الأفكار غير المنطقية', completed: false },
            { id: 'se_3_t3', title: 'صياغة تأكيدات داعمة', completed: false }
          ]
        },
        {
          id: 'se_4',
          title: 'وضع الحدود',
          description: 'تعلم قول "لا" عند الضرورة',
          iconName: 'Shield',
          status: 'locked',
          progress: '0/3',
          type: 'hexagon',
          tasks: [
            { id: 'se_4_t1', title: 'تمرين الرفض المهذب', completed: false },
            { id: 'se_4_t2', title: 'تحديد المساحة الشخصية', completed: false },
            { id: 'se_4_t3', title: 'التواصل بحزم', completed: false }
          ]
        },
        {
          id: 'se_5',
          title: 'العناية بالذات',
          description: 'الاهتمام بالصحة النفسية والجسدية',
          iconName: 'Sparkles',
          status: 'locked',
          progress: '0/3',
          type: 'hexagon',
          tasks: [
            { id: 'se_5_t1', title: 'روتين العناية المسائي', completed: false },
            { id: 'se_5_t2', title: 'تخصيص وقت للهوايات', completed: false },
            { id: 'se_5_t3', title: 'ممارسة الاسترخاء', completed: false }
          ]
        }
      ],
      [
        {
          id: 'se_6',
          title: 'الثقة بالقدرات',
          description: 'الإيمان بالقدرة على الإنجاز',
          iconName: 'Zap',
          status: 'locked',
          progress: '0/3',
          type: 'diamond',
          tasks: [
            { id: 'se_6_t1', title: 'تحدي منطقة الراحة', completed: false },
            { id: 'se_6_t2', title: 'تعلم مهارة جديدة', completed: false },
            { id: 'se_6_t3', title: 'مواجهة خوف بسيط', completed: false }
          ]
        },
        {
          id: 'se_7',
          title: 'الاستحقاق',
          description: 'الشعور بالأحقية في النجاح والسعادة',
          iconName: 'Crown',
          status: 'locked',
          progress: '0/3',
          type: 'diamond',
          tasks: [
            { id: 'se_7_t1', title: 'تمرين الامتنان المتقدم', completed: false },
            { id: 'se_7_t2', title: 'مكافأة الذات على الإنجاز', completed: false },
            { id: 'se_7_t3', title: 'تخيل المستقبل المشرق', completed: false }
          ]
        }
      ],
      [
        {
          id: 'se_8',
          title: 'القيادة الذاتية',
          description: 'توجيه الحياة نحو الأهداف الكبرى',
          iconName: 'Compass',
          status: 'locked',
          progress: '0/3',
          type: 'hexagon',
          tasks: [
            { id: 'se_8_t1', title: 'وضع خطة خمسية', completed: false },
            { id: 'se_8_t2', title: 'تحديد الأولويات', completed: false },
            { id: 'se_8_t3', title: 'مراجعة الأهداف الأسبوعية', completed: false }
          ]
        },
        {
          id: 'se_9',
          title: 'التأثير الاجتماعي',
          description: 'مشاركة القيمة مع الآخرين بثقة',
          iconName: 'Users',
          status: 'locked',
          progress: '0/3',
          type: 'hexagon',
          tasks: [
            { id: 'se_9_t1', title: 'تقديم مساعدة تطوعية', completed: false },
            { id: 'se_9_t2', title: 'مشاركة قصة نجاح', completed: false },
            { id: 'se_9_t3', title: 'بناء شبكة علاقات إيجابية', completed: false }
          ]
        },
        {
          id: 'se_10',
          title: 'التوازن النفسي',
          description: 'الحفاظ على الاستقرار الداخلي',
          iconName: 'Scale',
          status: 'locked',
          progress: '0/3',
          type: 'hexagon',
          tasks: [
            { id: 'se_10_t1', title: 'تمرين التأمل العميق', completed: false },
            { id: 'se_10_t2', title: 'إدارة الضغوط اليومية', completed: false },
            { id: 'se_10_t3', title: 'التنفس الواعي', completed: false }
          ]
        }
      ],
      [
        {
          id: 'se_final',
          title: 'اختبار بعد الرحلة',
          description: 'قياس مدى التحسن بعد إكمال مسار تقدير الذات',
          iconName: 'ClipboardCheck',
          status: 'locked',
          progress: '0/1',
          type: 'diamond',
          tasks: [{ id: 'se_final_t1', title: 'بدء الاختبار النهائي', completed: false }]
        }
      ]
    ]
  }
};

// Dynamically generate roadmaps for all other abilities
ASSESSMENTS.forEach(assessment => {
  assessment.subCategoriesDef.forEach(sub => {
    if (!ROADMAP_DATA[sub.id]) {
      ROADMAP_DATA[sub.id] = {
        abilityId: sub.id,
        title: sub.name,
        nodes: [
          [
            {
              id: `${sub.id}_1`,
              title: 'المرحلة الأولى',
              description: 'فهم الأساسيات والوعي بالمشكلة',
              iconName: 'Search',
              status: 'unlocked',
              progress: '0/3',
              type: 'diamond',
              tasks: [
                { id: `${sub.id}_1_t1`, title: 'مراقبة السلوك اليومي', completed: false },
                { id: `${sub.id}_1_t2`, title: 'تحديد المحفزات', completed: false },
                { id: `${sub.id}_1_t3`, title: 'كتابة الأهداف', completed: false }
              ]
            },
            {
              id: `${sub.id}_2`,
              title: 'الخطوات الأولى',
              description: 'البدء في التغيير الإيجابي',
              iconName: 'Target',
              status: 'locked',
              progress: '0/3',
              type: 'diamond',
              tasks: [
                { id: `${sub.id}_2_t1`, title: 'تطبيق تقنية جديدة', completed: false },
                { id: `${sub.id}_2_t2`, title: 'تجنب محفز سلبي', completed: false },
                { id: `${sub.id}_2_t3`, title: 'مكافأة الذات على التقدم', completed: false }
              ]
            }
          ],
          [
            {
              id: `${sub.id}_3`,
              title: 'بناء العادات',
              description: 'ترسيخ السلوكيات الجديدة',
              iconName: 'Repeat',
              status: 'locked',
              progress: '0/3',
              type: 'hexagon',
              tasks: [
                { id: `${sub.id}_3_t1`, title: 'الاستمرار لمدة أسبوع', completed: false },
                { id: `${sub.id}_3_t2`, title: 'مشاركة التقدم مع صديق', completed: false },
                { id: `${sub.id}_3_t3`, title: 'تقييم النتائج', completed: false }
              ]
            },
            {
              id: `${sub.id}_4`,
              title: 'مواجهة التحديات',
              description: 'التعامل مع الانتكاسات',
              iconName: 'Shield',
              status: 'locked',
              progress: '0/3',
              type: 'hexagon',
              tasks: [
                { id: `${sub.id}_4_t1`, title: 'تحليل أسباب الانتكاس', completed: false },
                { id: `${sub.id}_4_t2`, title: 'تعديل الخطة', completed: false },
                { id: `${sub.id}_4_t3`, title: 'العودة للمسار الصحيح', completed: false }
              ]
            }
          ],
          [
            {
              id: `${sub.id}_final`,
              title: 'اختبار بعد الرحلة',
              description: `قياس مدى التحسن بعد إكمال مسار ${sub.name}`,
              iconName: 'ClipboardCheck',
              status: 'locked',
              progress: '0/1',
              type: 'diamond',
              tasks: [{ id: `${sub.id}_final_t1`, title: 'بدء الاختبار النهائي', completed: false }]
            }
          ]
        ]
      };
    }
  });
});
