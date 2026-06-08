const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps/tenant/modules/admission-fee');
const destDir = path.join(__dirname, 'apps/tenant/modules/counter');

function copyAndReplace(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(item => {
      const srcItem = path.join(src, item);
      let destItemName = item.replace(/admission-fee/g, 'counter')
                             .replace(/admission-fees/g, 'counters')
                             .replace(/AdmissionFee/g, 'Counter')
                             .replace(/AdmissionFees/g, 'Counters')
                             .replace(/fee-card/g, 'counter-card')
                             .replace(/fee-grid/g, 'counter-grid')
                             .replace(/fee-table/g, 'counter-table');
      const destItem = path.join(dest, destItemName);
      copyAndReplace(srcItem, destItem);
    });
  } else {
    let content = fs.readFileSync(src, 'utf8');
    
    content = content.replace(/admission-fee/g, 'counter');
    content = content.replace(/admission-fees/g, 'counters');
    content = content.replace(/admissionFee/g, 'counter');
    content = content.replace(/admissionFees/g, 'counters');
    content = content.replace(/AdmissionFee/g, 'Counter');
    content = content.replace(/AdmissionFees/g, 'Counters');
    content = content.replace(/Admission Fee/g, 'Counter');
    content = content.replace(/Admission Fees/g, 'Counters');
    content = content.replace(/fee-card/g, 'counter-card');
    content = content.replace(/fee-grid/g, 'counter-grid');
    content = content.replace(/fee-table/g, 'counter-table');
    content = content.replace(/FeeCard/g, 'CounterCard');
    content = content.replace(/FeeGrid/g, 'CounterGrid');
    content = content.replace(/FeeTable/g, 'CounterTable');
    content = content.replace(/feeCard/g, 'counterCard');
    content = content.replace(/amount/g, 'value');
    content = content.replace(/ভর্তি ফি/g, 'কাউন্টার');
    content = content.replace(/className/g, 'type'); // Because admissionFee.className -> counter.type
    content = content.replace(/academicClassId/g, 'type'); // Wait, we will manually replace academicClassId/type in forms
    
    fs.writeFileSync(dest, content, 'utf8');
  }
}

copyAndReplace(srcDir, destDir);
console.log('Copied and replaced!');
