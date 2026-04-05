const fs = require('fs');
let content = fs.readFileSync('src/components/ImprovementPhase.tsx', 'utf8');

content = content.replace('icon: React.ElementType;', 'iconName: string;');
content = content.replace(/icon:\s*([A-Z][a-zA-Z0-9]*),/g, "iconName: '$1',");

// Also replace the usage of cat.icon
content = content.replace(/<cat\.icon/g, '<IconComponent');
content = content.replace(/<selectedCategory\.icon/g, '<IconComponent');

fs.writeFileSync('src/components/ImprovementPhase.tsx', content);
console.log('Updated icons');
