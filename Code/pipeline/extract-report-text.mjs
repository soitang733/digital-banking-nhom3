import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/reports/manifest.json'),'utf8').replace(/^\uFEFF/,''));
const out=path.join(root,'data/report-text');fs.mkdirSync(out,{recursive:true});
const index=[];
for(const report of manifest){
  const hash=crypto.createHash('sha256').update(fs.readFileSync(report.file)).digest('hex');
  if(hash.toUpperCase()!==report.sha256.toUpperCase())throw Error('Source hash mismatch: '+report.id);
  const txt=path.join(out,report.id+'.txt');
  if(!fs.existsSync(txt))execFileSync('C:/Program Files/Git/mingw64/bin/pdftotext.exe',['-layout','-enc','UTF-8',report.file,txt],{timeout:180000,stdio:['ignore','ignore','pipe']});
  const raw=fs.readFileSync(txt,'utf8'),split=raw.split('\f');if(!split.at(-1)?.trim())split.pop();
  const jsonFile=path.join(out,report.id+'.json'),cached=fs.existsSync(jsonFile)?JSON.parse(fs.readFileSync(jsonFile,'utf8')):null;
  const pages=cached?.sha256===hash?cached.pages:split.map((text,i)=>({page:i+1,text}));
  fs.writeFileSync(jsonFile,JSON.stringify({...cached,id:report.id,bank:report.bank,catalogYear:report.year,type:report.type,url:report.url,sha256:hash,pages}));
  const record={id:report.id,bank:report.bank,catalogYear:report.year,pages:pages.length,chars:raw.length,emptyPages:pages.filter(p=>p.text.trim().length<40).length,sha256:hash};index.push(record);console.log(JSON.stringify(record));
}
fs.writeFileSync(path.join(out,'index.json'),JSON.stringify(index,null,2));
