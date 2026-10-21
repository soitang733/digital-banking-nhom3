import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const elements=new Map();
const listeners=new Map();
function el(sel){if(!elements.has(sel)){const classes=new Set();elements.set(sel,{innerHTML:'',textContent:'',value:'',dataset:{},attributes:{},setAttribute(k,v){this.attributes[k]=v;},classList:{add(c){classes.add(c);},remove(c){classes.delete(c);},contains(c){return classes.has(c);},toggle(c,force){if(force===true||force===undefined&&!classes.has(c))classes.add(c);else classes.delete(c);}},showModal(){this.open=true;},close(){this.open=false;}});}return elements.get(sel);}
let capturedCSV=null;
function csvRecords(input){
 const text=input.replace(/^\uFEFF/,'');const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field);field='';}else if((c==='\r'||c==='\n')&&!quoted){row.push(field);rows.push(row);row=[];field='';if(c==='\r'&&text[i+1]==='\n')i++;}else field+=c;}
 if(quoted)throw Error('Unclosed CSV quote');row.push(field);rows.push(row);return rows;
}

let hash='';const location={get hash(){return hash;},set hash(value){hash=value?('#'+String(value).replace(/^#/,'')):'';}};
const context=vm.createContext({console,window:{addEventListener(k,f){listeners.set(k,f);},scrollTo(){}},document:{querySelector:el,querySelectorAll:()=>[],addEventListener(k,f){listeners.set(k,f);},createElement:()=>({click(){},remove(){}}),body:{appendChild(){}}},location,navigator:{clipboard:{writeText:async()=>{}}},setTimeout:()=>0,clearTimeout(){},URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob:class{constructor(parts){capturedCSV=parts.join('');}}});
vm.runInContext(fs.readFileSync('dist/data.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/research.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/review-ui.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/pdf-sources.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/pdf-source-ui.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/bank-media.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/visuals.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/maturity.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/download-catalog.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/downloads.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/app.js','utf8'),context);
function run(code){return vm.runInContext(code,context);}
for(const page of ['overview','dna','journey','evidence','method']){run(`S.page='${page}';render();`);assert.ok(el('#content').innerHTML.length>500);assert.ok(!el('#content').innerHTML.includes('NaN'));}
run("S.page='overview';S.bank='all';S.pillar='all';S.metric='percent';render();");assert.equal(run('ranked().map(b=>b.name).join(",")'),'OCB,LP Bank,TPBank,HDBank,SaigonBank');
run("S.metric='raw';render();");assert.equal(run('ranked().map(b=>b.name).join(",")'),'OCB,LP Bank,TPBank,SaigonBank,HDBank');
for(const metric of ['percent','raw'])for(const p of ['all','0','1','2','3','4','5'])for(const b of ['all','OCB','LP Bank','TPBank','HDBank','SaigonBank']){run(`S.metric='${metric}';S.pillar='${p}';S.bank='${b}';render();`);assert.ok(!el('#content').innerHTML.includes('NaN'));}
run("S.page='evidence';S.bank='OCB';S.pillar='all';S.level='all';S.search='';render();");assert.equal(run('filteredEvidence().length'),140);
run("S.level='0';renderEvidenceResults();");assert.equal(run('filteredEvidence().length'),22);
run("S.bank='all';S.level='all';S.search='zzzz-not-a-real-criterion';renderEvidenceResults();");assert.equal(run('filteredEvidence().length'),0);assert.ok(el('#evidence-results').innerHTML.includes('Không tìm thấy'));
run("S.search='cá nhân hóa';renderEvidenceResults();");assert.ok(run('filteredEvidence().length')>0);
run('openEvidence(D.evidence.findIndex(e=>e.urls.length===0));');assert.ok(el('#dialog-content').innerHTML.includes('Chưa có đường dẫn nguồn gốc'));
run('openEvidence(D.evidence.findIndex(e=>e.urls.length>0));');assert.ok(el('#dialog-content').innerHTML.includes('rel="noopener noreferrer"'));
run("S.bank='OCB';S.search='';S.pillar='all';S.level='0';document.querySelector('#export').onclick();");assert.equal(csvRecords(capturedCSV).length,23);
for(const b of ['OCB','LP Bank','TPBank','HDBank','SaigonBank']){run(`S.page='dna';S.bank='all';S.focus='${b}';S.compare='none';render();`);assert.ok(!el('#content').innerHTML.includes('NaN'));}
assert.equal(run("esc('<script>')"),'&lt;script&gt;');
run("S.page='overview';S.metric='raw';S.pillar='3';S.bank='all';render();");
assert.equal(run("rankOf(bank('HDBank'))"),4);
assert.equal(run("rankOf(bank('SaigonBank'))"),4);
run("S.bank='OCB';S.pillar='0';render();");assert.equal(run('activeEvidence().length'),25);assert.ok(el('#content').innerHTML.includes('25<small>bản ghi'));
const coverage=run('activeEvidence().filter(e=>e.level>0).length/25*100');assert.ok(el('#content').innerHTML.includes(run(`fmt(${coverage})`)+'<small>%'));
el('#reset-filters').onclick();assert.equal(run('S.bank'),'all');assert.equal(run('S.pillar'),'all');assert.equal(run('S.metric'),'percent');
run("S.page='evidence';S.bank='all';S.pillar='all';S.level='all';S.search='ca nhan hoa';render();");assert.ok(run('filteredEvidence().length')>0);assert.equal(el('#metric').hidden,true);
run("S.search='   ca nhan hoa   ';renderEvidenceResults();");assert.ok(run('filteredEvidence().length')>0);
run("S.search='';S.evidencePage=1;renderEvidenceResults();");el('#next').onclick();assert.equal(run('S.evidencePage'),2);el('#prev').onclick();assert.equal(run('S.evidencePage'),1);
run("S.page='dna';S.bank='all';S.focus='OCB';S.compare='LP Bank';render();");el('#bank-filter').onchange({target:{value:'LP Bank'}});assert.equal(run('S.compare'),'none');assert.ok(el('#content').innerHTML.includes('value="none" selected'));
el('#mobile-menu').onclick();assert.equal(el('#mobile-menu').attributes['aria-expanded'],'true');assert.equal(el('#menu-backdrop').hidden,false);listeners.get('keydown')({key:'Escape'});assert.equal(el('#mobile-menu').attributes['aria-expanded'],'false');
run("S.page='journey';S.bank='all';render();document.querySelector('#export').onclick();");assert.ok(capturedCSV.includes('Mức trưởng thành'));assert.equal(csvRecords(capturedCSV).length,36);
run("S.page='method';render();document.querySelector('#export').onclick();");assert.ok(capturedCSV.includes('Trọng số (%)'));assert.equal(csvRecords(capturedCSV).length,7);
const parseCSVLine=line=>Array.isArray(line)?line:[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m=>m[1].replace(/""/g,'"'));
for(const metric of ['percent','raw'])for(const p of ['all','0','1','2','3','4','5']){
  run(`S.page='overview';S.bank='all';S.metric='${metric}';S.pillar='${p}';render();document.querySelector('#export').onclick();`);
  const lines=csvRecords(capturedCSV).slice(1);
  for(const line of lines){const row=parseCSVLine(line),name=row[0];const src=run(`D.evidence.filter(e=>bank(e.bank).label===${JSON.stringify(name)}&&('${p}'==='all'||e.pillar===Number('${p}')))`);assert.equal(Number(row[8]),src.length);assert.equal(Number(row[9]),src.filter(e=>e.level===0).length);assert.ok(Math.abs(Number(row[10])-src.filter(e=>e.level>0).length/src.length*100)<1e-8);}
}
run("S.bank='OCB';S.pillar='0';S.metric='percent';document.querySelector('#export').onclick();");const ocb=parseCSVLine(csvRecords(capturedCSV)[1]);assert.equal(Number(ocb[9]),3);assert.equal(Number(ocb[10]),88);
assert.equal(run("D.evidence.every(e=>e.codeVerified&&e.sourceCode&&e.code!==e.sourceCode)"),true);
assert.equal(run('new Set(D.evidence.map(e=>e.code)).size'),140);assert.equal(run('D.reports.length'),23);
run("S.page='evidence';S.bank='all';S.pillar='all';S.level='all';S.search='';S.evidenceView='matrix';S.evidencePage=1;render();");assert.equal(run('matrixRows().length'),140);assert.equal(run('matrixRows()[0].cells.length'),5);assert.ok(el('#evidence-results').innerHTML.includes('1.1.1'));
run("S.bank='OCB';S.level='0';render();");assert.equal(run('matrixRows().length'),22);assert.equal(run('matrixRows()[0].cells.length'),1);
run("S.bank='all';S.level='all';S.search='1.1.2001';render();");assert.equal(run('matrixRows().length'),1);
run("S.search='';S.pillar='0';document.querySelector('#export').onclick();");assert.equal(csvRecords(capturedCSV).length,26);assert.equal(parseCSVLine(csvRecords(capturedCSV)[0]).length,8);
run('downloadYears();');const templateLines=csvRecords(capturedCSV);assert.equal(templateLines.length,2101);let exportedScored=0;for(const line of templateLines.slice(1)){const cells=parseCSVLine(line);if(cells[5]!=='')exportedScored++;assert.ok([2023,2024,2025].includes(Number(cells[1])));}assert.equal(exportedScored,run('R.stats.scored'));
run('downloadReview();');assert.equal(csvRecords(capturedCSV).length,701);assert.ok(capturedCSV.includes('Đã được nhóm duyệt'));
run('downloadCodes();');assert.equal(csvRecords(capturedCSV).length,141);
run("S.page='method';render();");assert.ok(el('#content').innerHTML.includes('Quy tắc chấm điểm'));assert.ok(el('#content').innerHTML.includes('Thư viện báo cáo nguồn'));
run("S.page='dna';S.bank='OCB';S.metric='percent';render();");assert.ok(el('#content').innerHTML.includes('Điểm theo nhóm tiêu chí'));assert.equal(run("groupSummary(bank('OCB')).length"),25);assert.equal(run("groupSummary(bank('OCB')).reduce((n,g)=>n+g.count,0)"),140);
for(const p of [0,1,2,3,4,5]){const weighted=run(`groupSummary(bank('OCB')).filter(g=>g.pillar===${p}).reduce((n,g)=>n+g.percent*g.count,0)/D.counts[${p}]`);assert.ok(Math.abs(weighted-run(`bank('OCB').pillars[${p}]`))<1e-8);}
run("S.page='overview';S.bank='all';S.metric='percent';S.pillar='all';render();");
assert.ok(el('#content').innerHTML.includes('class="overview-hero"'));assert.ok(el('#content').innerHTML.includes('So với toàn bộ 5 ngân hàng'));
for(const name of ['OCB','LP Bank','TPBank','HDBank','SaigonBank'])assert.ok(el('#content').innerHTML.includes(run(`fmt(value(bank('${name}')),1)`)));
for(const [query,name] of [['tpb','TPBank'],['HDB','HDBank'],['LPB','LP Bank'],['saigonbank','SaigonBank'],['OCB','OCB']]){
  el('#global-search').value=query;el('#global-search-submit').onclick();listeners.get('hashchange')();assert.equal(run('S.page'),'dna');assert.equal(run('S.bank'),name);
}
el('#global-search').value='ca nhan hoa';let prevented=false;el('#global-search').onkeydown({key:'Enter',preventDefault(){prevented=true;}});listeners.get('hashchange')();assert.equal(prevented,true);assert.equal(run('S.page'),'evidence');assert.equal(run('S.bank'),'all');assert.ok(run('filteredEvidence().length')>0);
el('#global-search').value='zzzz-not-a-real-criterion';el('#global-search-submit').onclick();assert.equal(run('filteredEvidence().length'),0);
el('#global-search').value='  ';el('#global-search-submit').onclick();assert.ok(el('#toast').textContent.includes('Nhập ngân hàng'));assert.equal(run('S.search'),'zzzz-not-a-real-criterion');
console.log('PASS: all five pages, filter/rank/CSV/data tests, criterion matrix, report templates, hero scores and global bank/criterion search. Browser interaction remains unverified.');
run("S.page='evidence';S.evidenceView='annual';S.bank='all';S.pillar='all';S.level='all';S.year='all';S.reviewState='all';S.search='';S.evidencePage=1;render();");assert.equal(run('annualRows().length'),2100);assert.ok(el('#page-subtitle').textContent.includes('2.100'));
run("S.reviewState='scored';renderAnnualResults();");assert.equal(run('annualRows().length'),run('R.stats.scored'));assert.ok(el('#evidence-results').innerHTML.includes('Đã đối chiếu tài liệu'));
run("S.bank='TPBank';S.year='2023';renderAnnualResults();");assert.ok(run('annualRows().every(r=>r.bank===S.bank&&r.year===2023&&r.level!==null)'));assert.ok(run('annualRows().length')>0);
run("document.querySelector('#export').onclick();");assert.equal(csvRecords(capturedCSV).length,run('annualRows().length')+1);
run("openAnnual(R.records.findIndex(r=>r.bank==='TPBank'&&r.year===2023&&r.code==='3.2.6'));");assert.ok(el('#dialog-content').innerHTML.includes('#page=26'));assert.ok(el('#dialog-content').innerHTML.includes('Chưa đủ bằng chứng'));
run("S.bank='all';S.year='all';S.reviewState='all';S.level='missing';renderAnnualResults();");assert.equal(run('annualRows().length'),2100-run('R.stats.scored')-run('R.stats.na'));
run("S.level='na';renderAnnualResults();");assert.equal(run('annualRows().length'),run('R.stats.na'));
assert.equal(run('R.records.filter(r=>r.level===0).length'),0);assert.equal(run('R.summaries.every(r=>r.score===null)'),true);assert.equal(run('R.records.filter(r=>r.level!==null).every(r=>r.citations.length&&r.reason&&r.reviewDate)'),true);
console.log('PASS: annual filters/CSV, exact PDF page links, missing vs NA, source-backed decisions and incomplete annual scores stay null.');
run("S.page='evidence';S.evidenceView='list';S.bank='all';S.pillar='all';S.level='all';S.search='';S.pdfSource='related';render();");
assert.equal(run('filteredEvidence().length'),run('window.DBI_PDF_SOURCES.stats.withRelatedPDF'));
assert.ok(el('#evidence-results').innerHTML.includes('Tài liệu tham khảo'));
run("document.querySelector('#export').onclick();");
assert.equal(csvRecords(capturedCSV).length,1+run('filteredEvidence().length'));assert.ok(capturedCSV.includes('Mức gộp 2023–2025'));assert.ok(capturedCSV.includes('#page='));
run("S.pdfSource='missing';render();");assert.equal(run('filteredEvidence().length'),run('window.DBI_PDF_SOURCES.stats.withoutRelatedPDF'));
run("openEvidence(D.evidence.findIndex(e=>e.bank==='SaigonBank'&&e.code==='1.1.4'));");assert.ok(el('#dialog-content').innerHTML.includes('Tài liệu tham khảo'));assert.ok(el('#dialog-content').innerHTML.includes('trang PDF 6'));assert.ok(el('#dialog-content').innerHTML.includes('trang in 5'));
el('#reset-filters').onclick();assert.equal(run('S.pdfSource'),'all');
console.log('PASS: new PDF source filters, source/status CSV, inspected OCR page and unchanged legacy scores.');
const internalCopy=/Codex|Đã tìm lại trong|Việc cần hoàn thiện|team cần duyệt|Tiến độ đối chiếu|Đã lập chỉ mục|Phạm vi tài liệu đã tìm/;
for(const page of ['overview','dna','journey','evidence','method']){run(`S.page='${page}';render();`);assert.ok(!internalCopy.test(el('#content').innerHTML),page);}
for(let id=0;id<run('D.evidence.length');id++){run(`openEvidence(${id});`);assert.ok(!internalCopy.test(el('#dialog-content').innerHTML),`pooled ${id}`);}
for(let id=0;id<run('R.records.length');id++){run(`openAnnual(${id});`);assert.ok(!internalCopy.test(el('#dialog-content').innerHTML),`annual ${id}`);}
console.log('PASS: no internal progress copy on five pages or any of the 2,800 evidence dialogs.');
run("S.page='downloads';render();");
assert.ok(el('#content').innerHTML.includes('Bộ Excel bản cuối'));
assert.equal(run('window.DBI_DOWNLOADS.files.length'),4);
assert.equal(run("window.DBI_DOWNLOADS.files.every(f=>f.path.startsWith('03-ket-qua-pipeline/')&&f.path.endsWith('.xlsx'))"),true);
assert.equal(run('window.DBI_DOWNLOADS.pdfs.length'),23);
// Count the rendered workbook cards. A digest or source URL can legitimately
// contain "166" and must not be mistaken for the retired file count.
assert.equal((el('#content').innerHTML.match(/class="[^"\n]*\bworkbook-card\b[^"\n]*"/g)||[]).length,4);
el('#download-pdf-bank').value='OCB';run('renderDownloadResults();');assert.equal((el('#download-results').innerHTML.match(/class="download-file"/g)||[]).length,6);
assert.equal(run('Boolean(window.DBI_DOWNLOADS.report.url&&window.DBI_DOWNLOADS.code.url&&window.DBI_DOWNLOADS.readme.url&&window.DBI_DOWNLOADS.submission.url)'),true);
console.log('PASS: four final Excel workbooks, cited PDFs, report, code, submission package and PDF bank filter.');
