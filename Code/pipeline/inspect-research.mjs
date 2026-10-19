import fs from 'node:fs';
import vm from 'node:vm';
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('dashboard/dist/data.js','utf8'),ctx);const D=ctx.window.DBI_DATA;
const src=JSON.parse(fs.readFileSync('source-data.json','utf8').replace(/^\uFEFF/,''));
const rows=src['ScoringReview.xlsx'].Danh_muc;
const headers=Object.entries(rows[0]).map(([k,v])=>[k.replace(/\d+$/,''),v]);
const rubric=rows.slice(1).map(row=>Object.fromEntries(headers.map(([col,label])=>[label,Object.entries(row).find(([k])=>k.replace(/\d+$/,'')===col)?.[1]??''])));
if(process.argv[2]==='rubrics')for(const code of process.argv.slice(3)){const c=D.criteria.find(c=>c.code===code);console.log(code,c?.name,JSON.stringify(rubric.find(r=>r['Mã']===c?.sourceCode)));}
else if(process.argv[2]==='page'){const r=JSON.parse(fs.readFileSync('pipeline/data/report-text/'+process.argv[3]+'.json','utf8'));for(const n of process.argv.slice(4).map(Number))console.log('REPORT',r.id,r.bank,r.catalogYear,'PDF PAGE',n,'\n'+r.pages[n-1].text.split('\n').map(l=>l.replace(/\s+/g,' ').trim()).join('\n'));}
else if(process.argv[2]==='search'){const re=new RegExp(process.argv[3],'i');for(const file of fs.readdirSync('pipeline/data/report-text').filter(f=>/^report-\d+\.json$/.test(f))){const r=JSON.parse(fs.readFileSync('pipeline/data/report-text/'+file,'utf8'));const hits=r.pages.filter(p=>re.test(p.text));console.log(r.id,r.bank,r.catalogYear,hits.map(p=>p.page).join(','));for(const p of hits.slice(0,3)){const m=p.text.match(re),i=m.index;console.log('p'+p.page,p.text.slice(Math.max(0,i-120),i+400).replace(/\s+/g,' '));}}}
else if(process.argv[2]==='ocr'){const r=JSON.parse(fs.readFileSync('pipeline/data/report-ocr/'+process.argv[3]+'.json','utf8'));for(const n of process.argv.slice(4).map(Number))console.log('OCR',r.id,'PDF PAGE',n,'\n'+r.pages.find(p=>p.page===n)?.text);}
else if(process.argv[2]==='ocr-search'){const re=new RegExp(process.argv[3],'i');for(const id of process.argv.slice(4)){const r=JSON.parse(fs.readFileSync('pipeline/data/report-ocr/'+id+'.json','utf8'));for(const p of r.pages){const m=p.text.match(re);if(m)console.log(id,p.page,p.text.slice(Math.max(0,m.index-120),m.index+450));}}}
