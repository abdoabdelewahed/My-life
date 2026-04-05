const fs = require('fs');
let content = fs.readFileSync('src/components/ImprovementPhase.tsx', 'utf8');

content = content.replace('icon: React.ElementType;', 'iconName: string;');
content = content.replace(/icon:\s*([A-Z][a-zA-Z0-9]*),/g, "iconName: '$1',");

// Also replace the usage of cat.icon
content = content.replace(/<cat\.icon/g, '{(() => { const IconComponent = (LucideIcons as any)[cat.iconName] || LucideIcons.Circle; return <IconComponent');
content = content.replace(/className="w-5 h-5 md:w-10 md:h-10" \/>/g, 'className="w-5 h-5 md:w-10 md:h-10" />; })()}');

content = content.replace(/<selectedCategory\.icon/g, '{(() => { const IconComponent = (LucideIcons as any)[selectedCategory.iconName] || LucideIcons.Circle; return <IconComponent');
content = content.replace(/size=\{20\} \/>/g, 'size={20} />; })()}');

fs.writeFileSync('src/components/ImprovementPhase.tsx', content);
console.log('Updated icons');
