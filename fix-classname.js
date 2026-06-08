const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'apps/tenant/modules/counter');

function fixClassNames(dir) {
  if (fs.statSync(dir).isDirectory()) {
    fs.readdirSync(dir).forEach(item => fixClassNames(path.join(dir, item)));
  } else if (dir.endsWith('.tsx') || dir.endsWith('.ts')) {
    let content = fs.readFileSync(dir, 'utf8');
    
    // Replace incorrectly changed `type` back to `className`
    // We only want to replace ` type="...` with ` className="...` where the value is likely a tailwind class.
    // Instead, a simpler way: the previous script literally replaced 'className' with 'type'.
    // So if we see ` type="` we can replace it with ` className="`, EXCEPT for specific ones.
    
    // First, let's just do a broad replace: ` type="` -> ` className="`
    content = content.replace(/ type="/g, ' className="');
    
    // Then restore the ones that were actually `type="` originally!
    content = content.replace(/className="button"/g, 'type="button"');
    content = content.replace(/className="submit"/g, 'type="submit"');
    content = content.replace(/className="number"/g, 'type="number"');
    content = content.replace(/className="text"/g, 'type="text"');
    content = content.replace(/className="single"/g, 'type="single"'); // For Accordion type="single"
    content = content.replace(/className="space-y-6"/g, 'className="space-y-6"'); // Just an example, this is correct as className
    
    fs.writeFileSync(dir, content, 'utf8');
  }
}

fixClassNames(targetDir);
console.log('ClassNames fixed!');
