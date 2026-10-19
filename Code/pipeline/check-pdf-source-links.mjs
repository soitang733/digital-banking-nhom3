import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const data=JSON.parse(fs.readFileSync('pipeline/data/pdf-source-links.json','utf8'));
const reports=JSON.parse(fs.readFileSync('pipeline/data/reports/manifest.json','utf8').replace(/^\uFEFF/,''));
const research=JSON.parse(fs.readFileSync('pipeline/data/research.json','utf8'));
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('dashboard/dist/data.js','utf8'),ctx);
const D=ctx.window.DBI_DATA;
const norm=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/\s+/g,' ').trim();
const pages=new Map(reports.map(r=>{
 const fresh=JSON.parse(fs.readFileSync('pipeline/data/pdf-fresh/'+r.id+'.json','utf8'));
 const old=JSON.parse(fs.readFileSync('pipeline/data/report-text/'+r.id+'.json','utf8'));
 const path='pipeline/data/report-ocr/'+r.id+'.json',ocr=fs.existsSync(path)?JSON.parse(fs.readFileSync(path,'utf8')).pages:[];
 return [r.id,{fresh,old,ocr}];
}));
assert.equal(data.rows.length,700);assert.equal(new Set(data.rows.map(r=>r.bank+'|'+r.code)).size,700);
let sources=0,manual=0;
for(const row of data.rows){
 const original=D.evidence.find(e=>e.bank===row.bank&&e.code===row.code);assert(original);
 assert.equal(row.legacyLevel,original.level);assert.equal(row.originalURLCount,original.urls.length);
 assert(row.sources.length<=3);assert.equal(new Set(row.sources.map(s=>s.reportYear)).size,row.sources.length);
 assert.equal(row.status,row.sources.length?'Chưa đủ bằng chứng':'Chưa tìm được đoạn phù hợp');
 for(const source of row.sources){
  sources++;const report=reports.find(r=>r.id===source.reportId),p=pages.get(source.reportId);
  assert(report&&report.bank===row.bank&&report.year===source.reportYear);
  assert.equal(source.url,report.url.replaceAll('\\u0026','&'));assert.equal(source.sha256.toLowerCase(),report.sha256.toLowerCase());
  assert(Number.isInteger(source.page)&&source.page>0&&source.page<=p.fresh.pages.length);
  assert.equal(new URL(source.url).protocol,'https:');assert.equal(source.status,'Chưa đủ bằng chứng');
  if(source.manualExcerptChecked){manual++;assert(source.pageImageChecked);const viewed=JSON.parse(fs.readFileSync('pipeline/data/pdf-source-page-checks.json','utf8')).find(c=>c.reportId===source.reportId&&c.page===source.page);assert(fs.existsSync(viewed.imagePath));assert(viewed.excerpts.some(e=>e.bank===row.bank&&e.code===row.code&&e.text===source.excerpt));}
  else{const texts=[p.fresh.pages[source.page-1].text,p.old.pages[source.page-1].text,p.old.pages[source.page-1].rawText??'',p.ocr.find(c=>c.page===source.page)?.text??''];const prior=research.records.filter(r=>r.bank===row.bank&&r.code===row.code).flatMap(r=>r.citations).find(c=>c.reportId===source.reportId&&c.page===source.page&&c.imageChecked&&c.transcription===source.excerpt);assert(prior||texts.some(t=>norm(t).includes(norm(source.excerpt))),'Untraceable excerpt '+row.bank+' '+row.code+' '+source.reportId+' '+source.page);}
 }
}
assert.equal(data.stats.withRelatedPDF,data.rows.filter(r=>r.sources.length).length);
assert.equal(data.stats.withoutRelatedPDF,data.rows.filter(r=>!r.sources.length).length);
assert.equal(data.stats.missingOriginalWithRelatedPDF,data.rows.filter(r=>!r.originalURLCount&&r.sources.length).length);
assert.equal(data.stats.sources,sources);assert.equal(data.stats.scoreChanges,0);assert.equal(manual,5);
const expected=JSON.parse(fs.readFileSync('validation/snapshot-sha256.json','utf8'));for(const [file,sha] of Object.entries(expected))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('dashboard/dist/'+file)).digest('hex'),sha,'Numerical snapshot changed '+file);
const result={status:'PASS',...data.stats,manualImageExcerpts:manual,originalAndAnnualDataUnchanged:true};
fs.writeFileSync('audit/pdf-source-validation.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
