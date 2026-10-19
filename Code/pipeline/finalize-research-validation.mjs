import fs from 'node:fs';
const file='pipeline/build-research.mjs';let s=fs.readFileSync(file,'utf8');s=s.replace("if(c.method==='OCR')assert(d.imageChecked,'OCR decision requires image verification');", "if(c.method==='OCR'&&d.level!==null){assert(d.imageChecked,'OCR scoring requires image verification');assert(d.imagePath&&fs.existsSync(d.imagePath),'Checked OCR image missing');}c.imageChecked=!!d.imageChecked;");
s=s.replace('stats:{annualRows:records.length,scored:',"stats:{reviewed:records.filter(r=>r.reviewer).length,annualRows:records.length,scored:");
fs.writeFileSync(file,s);
