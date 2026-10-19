import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('dashboard/dist/data.js','utf8'),ctx);
const D=ctx.window.DBI_DATA,R=JSON.parse(fs.readFileSync('pipeline/data/research.json','utf8'));
const norm=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/\s+/g,' ').trim();
const searchScript=fs.readFileSync('pipeline/build-research.mjs','utf8');
const aliasCode=searchScript.match(/const aliases=(\{[\s\S]*?\n\});/)[1];
const aliases=vm.runInNewContext('('+aliasCode+')',{});
const manifest=JSON.parse(fs.readFileSync('pipeline/data/reports/manifest.json','utf8').replace(/^\uFEFF/,''));
const checkedFile='pipeline/data/pdf-source-page-checks.json';
const checked=fs.existsSync(checkedFile)?JSON.parse(fs.readFileSync(checkedFile,'utf8')):[];
const pageLookup=new Map();
const reports=manifest.map(r=>{
 const fresh=JSON.parse(fs.readFileSync('pipeline/data/pdf-fresh/'+r.id+'.json','utf8'));
 assert.equal(fresh.sha256.toLowerCase(),r.sha256.toLowerCase());
 const old=JSON.parse(fs.readFileSync('pipeline/data/report-text/'+r.id+'.json','utf8'));
 assert.equal(fresh.pages.length,old.pages.length);
 const ocrFile='pipeline/data/report-ocr/'+r.id+'.json';
 const ocr=fs.existsSync(ocrFile)?JSON.parse(fs.readFileSync(ocrFile,'utf8')).pages:[];
 const pages=fresh.pages.map(p=>{
  const versions=[{text:p.text,method:'PDF text · đọc lại trực tiếp',priority:2}];
  const cached=old.pages.find(q=>q.page===p.page)?.text??'';
  if(cached&&norm(cached)!==norm(p.text))versions.push({text:cached,method:'PDF text · bản trích đối chiếu',priority:1});
  const scan=ocr.find(q=>q.page===p.page)?.text??'';
  if(scan)versions.push({text:scan,method:'OCR · chưa xác nhận chữ',priority:0});
  const result={page:p.page,versions:versions.filter(v=>v.text.trim().length>40).map(v=>({...v,simple:v.text.replace(/\s+/g,' ').trim(),normalized:norm(v.text)}))};
  pageLookup.set(r.id+'|'+p.page,result);return result;
 });
 return {...r,url:r.url.replaceAll('\\u0026','&'),pages};
});
const escapeRE=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function matchesFor(bank,criterion){
 const terms=[...new Set([norm(criterion.name).replace(/^[-\s]+/,''),...(aliases[criterion.code]??[])])].filter(t=>t.length>2);
 const sources=reports.filter(r=>r.bank===bank),matches=[];
 for(const r of sources)for(const p of r.pages)for(const v of p.versions){
  const hits=terms.filter(t=>new RegExp('(^|[^a-z0-9])'+escapeRE(t)+'([^a-z0-9]|$)').test(v.normalized));
  if(!hits.length)continue;
  const positions=hits.flatMap(t=>[...v.normalized.matchAll(new RegExp('(^|[^a-z0-9])'+escapeRE(t)+'(?=[^a-z0-9]|$)','g'))].map(m=>({term:t,position:m.index+m[1].length})));
  const options=positions.map(hit=>{
   const start=Math.max(0,hit.position-160),excerpt=v.simple.slice(start,hit.position+540),simple=norm(excerpt);
   if(!simple.includes(hit.term))return null;
   if(criterion.code==='1.1.1'&&/dao tao|nhan vien|can bo/.test(simple)&&!/khach hang|customer/.test(simple))return null;
   if(criterion.code==='1.1.8'&&/tuyen dung|ung vien/.test(simple)&&!/khach hang|customer/.test(simple))return null;
   if(['1.1.1','1.1.4','1.1.7','1.1.8','1.2.1','1.2.2','1.2.7','1.2.8'].includes(criterion.code)&&!/khach hang|customer|nguoi dung|ung dung|app|ngan hang so|omni|livebank|mobile/.test(simple))return null;
   if(criterion.code==='1.1.8'&&/an ninh mang|gia mao|lua dao/.test(simple)&&!/tuong tac|gan ket|truyen thong|phan hoi|facebook|zalo|youtube/.test(simple))return null;
   if(criterion.code==='3.3.2'&&hit.term==='soc'&&!/bao mat|an ninh|an toan|security/.test(simple))return null;
   const contextHits=hits.filter(t=>simple.includes(t));
   return {excerpt,terms:contextHits,score:contextHits.reduce((n,t)=>n+(t.length>14?3:1),0)+v.priority};
  }).filter(Boolean).sort((a,b)=>b.score-a.score);
  if(!options.length)continue;
  const top=options[0];assert(v.simple.includes(top.excerpt));
  matches.push({reportId:r.id,bank:r.bank,reportYear:r.year,type:r.type,page:p.page,url:r.url,sha256:r.sha256,excerpt:top.excerpt,terms:top.terms,method:v.method,score:top.score,status:'Chưa đủ bằng chứng',pageImageChecked:checked.some(c=>c.reportId===r.id&&c.page===p.page),note:'Tìm được đoạn liên quan; chưa xác nhận đáp ứng đầy đủ tiêu chí hoặc mức chấm. Năm là năm báo cáo, chưa suy ra năm triển khai.'});
 }
 for(const annual of R.records.filter(r=>r.bank===bank&&r.code===criterion.code))for(const c of annual.citations){
  const report=reports.find(r=>r.id===c.reportId);
  assert(report&&report.bank===bank&&report.year===annual.year);
  const original=JSON.parse(fs.readFileSync('pipeline/data/report-text/'+report.id+'.json','utf8')).pages[c.page-1];
  const page=pageLookup.get(report.id+'|'+c.page);
  assert(page);
  const excerpt=c.transcription??c.excerpt;
  assert(c.imageChecked||page.versions.some(v=>v.normalized.includes(norm(c.excerpt)))||norm(original.rawText??'').includes(norm(c.excerpt)));
  matches.push({reportId:report.id,bank,reportYear:report.year,type:report.type,page:c.page,url:report.url,sha256:report.sha256,excerpt,terms:[],method:c.transcription?'Bản chép từ ảnh trang đã kiểm tra':c.method+' · nguồn đối chiếu theo năm',score:50,status:'Chưa đủ bằng chứng',pageImageChecked:!!c.imageChecked||checked.some(q=>q.reportId===report.id&&q.page===c.page),fromAnnualReview:true,note:'Nguồn đã đọc trong lớp đối chiếu theo năm; chưa xác nhận mức gộp 2023–2025. Giữ nguyên điểm Excel.'});
 }
 matches.sort((a,b)=>b.score-a.score||b.reportYear-a.reportYear||a.page-b.page);
 const unique=matches.filter((m,i)=>matches.findIndex(n=>n.reportId===m.reportId&&n.page===m.page)===i);
 const selected=[];
 for(const year of [2025,2024,2023]){const best=unique.find(m=>m.reportYear===year);if(best)selected.push(best);}
 return selected.sort((a,b)=>b.score-a.score||b.reportYear-a.reportYear).slice(0,3).map(s=>{
  const viewed=checked.find(c=>c.reportId===s.reportId&&c.page===s.page),manual=viewed?.excerpts?.find(c=>c.bank===bank&&c.code===criterion.code);
  if(viewed){assert(fs.existsSync(viewed.imagePath));s.printedPage=viewed.printedPage;}
  if(manual){s.excerpt=manual.text;s.method='Đoạn trích ngắn · đã đọc ảnh trang';s.manualExcerptChecked=true;}
  return s;
 });
}
const rows=D.evidence.map(e=>{
 const criterion=D.criteria.find(c=>c.code===e.code),sources=matchesFor(e.bank,criterion);
 return {bank:e.bank,code:e.code,sourceCode:e.sourceCode,name:e.name,originalURLCount:e.urls.length,legacyLevel:e.level,status:sources.length?'Chưa đủ bằng chứng':'Chưa tìm được đoạn phù hợp',reason:sources.length?'Có nguồn PDF liên quan, chưa đủ căn cứ xác nhận mức gộp. Giữ nguyên điểm Excel.':'Chưa định vị được đoạn phù hợp trong 23 PDF đã tìm. Không kết luận ngân hàng không triển khai và không tự chấm 0.',sources};
});
const sourceCounts=rows.filter(r=>r.sources.length),missingWithSources=sourceCounts.filter(r=>!r.originalURLCount);
const stats={reports:reports.length,pages:reports.reduce((n,r)=>n+r.pages.length,0),pooledRows:rows.length,withRelatedPDF:sourceCounts.length,missingOriginalWithRelatedPDF:missingWithSources.length,withoutRelatedPDF:rows.length-sourceCounts.length,missingOriginalWithoutRelatedPDF:rows.filter(r=>!r.originalURLCount&&!r.sources.length).length,sources:rows.reduce((n,r)=>n+r.sources.length,0),scoreChanges:0};
const data={date:'2026-10-13',scope:'Nguồn liên quan cho điểm gộp 2023–2025; không xác nhận mức chấm',rows,stats};
fs.writeFileSync('pipeline/data/pdf-source-links.json',JSON.stringify(data,null,2));
fs.writeFileSync('dashboard/dist/pdf-sources.js','window.DBI_PDF_SOURCES = '+JSON.stringify(data)+';\n');
fs.writeFileSync('audit/pdf-source-links.csv','\uFEFF'+[['Ngân hàng','Mã chuẩn','Tiêu chí','Mức gộp giữ nguyên','Trạng thái','Năm báo cáo','Loại tài liệu','URL','Trang PDF','Đoạn liên quan chưa xác nhận','Phương pháp đọc','Đã xem ảnh trang','Lưu ý'],...rows.flatMap(r=>r.sources.map(s=>[r.bank,r.code,r.name,r.legacyLevel,r.status,s.reportYear,s.type,s.url+'#page='+s.page,s.page,s.excerpt,s.method,s.pageImageChecked?'Có':'Chưa',s.note]))].map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n'));
console.log(JSON.stringify({stats,byBank:D.banks.map(b=>({bank:b.name,withRelatedPDF:rows.filter(r=>r.bank===b.name&&r.sources.length).length})),checkedExamples:rows.flatMap(r=>r.sources.filter(s=>s.manualExcerptChecked).map(s=>({bank:r.bank,code:r.code,report:s.reportId,page:s.page})))},null,2));
