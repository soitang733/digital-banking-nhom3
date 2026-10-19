import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const manifest=JSON.parse(fs.readFileSync('pipeline/data/reports/manifest.json','utf8').replace(/^\uFEFF/,''));
const baseFile='pipeline/data/review-decisions.json',base=JSON.parse(fs.readFileSync(baseFile,'utf8'));
const key=r=>[r.bank,r.year,r.code].join('|');const known=new Set(base.map(key));let added=0;
for(const stem of ['ocb-hdb','tpb-lpb','sgb'])for(const type of ['decisions','pending']){
 const file='pipeline/data/agent-'+stem+'-'+type+'.json';if(!fs.existsSync(file))continue;
 const content=JSON.parse(fs.readFileSync(file,'utf8'));const rows=Array.isArray(content)?content:content.decisions??content.records;
 if(!Array.isArray(rows))throw Error('Unexpected agent schema '+file);
 for(const row of rows){if(known.has(key(row)))continue;
  for(const c of row.citations??[]){if(c.method==='PDF raw text'){
   const docFile='pipeline/data/report-text/'+c.reportId+'.json',doc=JSON.parse(fs.readFileSync(docFile,'utf8')),report=manifest.find(r=>r.id===c.reportId);
   if(!doc.pages[c.page-1].rawText){doc.pages[c.page-1].rawText=execFileSync('C:/Program Files/Git/mingw64/bin/pdftotext.exe',['-f',String(c.page),'-l',String(c.page),'-raw','-enc','UTF-8',report.file,'-'],{encoding:'utf8',maxBuffer:2000000});fs.writeFileSync(docFile,JSON.stringify(doc));}
  }}
  base.push(row);known.add(key(row));added++;
 }
}
fs.writeFileSync(baseFile,JSON.stringify(base,null,2));console.log('Merged '+added+' new decisions/insufficient-evidence assessments. Total '+base.length+'.');
