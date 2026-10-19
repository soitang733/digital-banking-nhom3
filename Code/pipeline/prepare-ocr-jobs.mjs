import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync('pipeline/data/reports/manifest.json','utf8').replace(/^\uFEFF/,''));
const jobs=manifest.map(r=>{const doc=JSON.parse(fs.readFileSync('pipeline/data/report-text/'+r.id+'.json','utf8'));return {id:r.id,file:r.file,pages:doc.pages.filter(p=>p.text.trim().length<500||['report-4','report-12','report-16','report-19'].includes(r.id)).map(p=>p.page)};}).filter(j=>j.pages.length);
fs.writeFileSync('pipeline/data/ocr-jobs.json',JSON.stringify(jobs));console.log(jobs.map(j=>j.id+': '+j.pages.length).join('\n'));
