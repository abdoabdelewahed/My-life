const fs = require('fs');
let content = fs.readFileSync('src/constants.ts', 'utf8');

content = content.replace(/export const USER_CHARACTERS = \[[\s\S]*?\];/, `export const USER_CHARACTERS = [
  { level: 1, name: 'الصحوة', icon: 'Zap', description: 'بداية رحلة الوعي الحقيقي، حيث تدرك قوتك الكامنة وتتخذ القرار الشجاع للتحرر من القيود والبدء في تغيير حياتك للأفضل.', requirements: { lessons: 0, xp: 0, paths: 0 } },
  { level: 2, name: 'المواجهة', icon: 'Shield', description: 'مرحلة الشجاعة. تواجه مخاوفك، وتعترف بأنماطك السلبية وجروحك دون هروب أو إنكار.', requirements: { lessons: 5, xp: 200, paths: 0 } },
  { level: 3, name: 'التفكيك', icon: 'Brain', description: 'مرحلة إعادة البرمجة. تعمل على تفكيك المعتقدات المقيدة والتخلص من الأعباء العاطفية القديمة.', requirements: { lessons: 15, xp: 600, paths: 1 } },
  { level: 4, name: 'إعادة البناء', icon: 'Target', description: 'مرحلة التأسيس الجديد. تبني هويتك بوعي، تضع حدوداً صحية، وتزرع عادات تدعم نموك.', requirements: { lessons: 30, xp: 1200, paths: 2 } },
  { level: 5, name: 'التكامل', icon: 'Heart', description: 'مرحلة التصالح التام. تتقبل كل أجزاء نفسك (النور والظل) وتعيش بانسجام داخلي حقيقي.', requirements: { lessons: 50, xp: 2500, paths: 3 } },
  { level: 6, name: 'التسامي', icon: 'Crown', description: 'قمة الهرم النفسي (تحقيق الذات). تعيش بأصالة كاملة وتفيض بسلامك الداخلي لمن حولك.', requirements: { lessons: 100, xp: 5000, paths: 4 } }
];`);

fs.writeFileSync('src/constants.ts', content, 'utf8');
console.log('Updated characters successfully.');
