import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const source=path.resolve('../dashboard/dist'),output=path.resolve('public');
fs.mkdirSync(output,{recursive:true});
fs.cpSync(source,output,{recursive:true});
let html=fs.readFileSync(path.join(source,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]);
const datasets={
 data:['data.js','DBI_DATA'],research:['research.js','DBI_RESEARCH'],
 pdf_sources:['pdf-sources.js','DBI_PDF_SOURCES'],media:['bank-media.js','DBI_MEDIA']
};
const context={window:{}};
for(const [file] of Object.values(datasets))vm.runInNewContext(fs.readFileSync(path.join(source,file),'utf8'),context);
const fingerprint=crypto.createHash('sha256').update(Object.values(datasets).map(([file])=>fs.readFileSync(path.join(source,file))).reduce((a,b)=>Buffer.concat([a,b]),Buffer.alloc(0))).digest('hex');
const version='dbi-v18-'+fingerprint.slice(0,16);
const snapshots=Object.entries(datasets).map(([id,[,global]])=>({id,payload:context.window[global],data_version:version}));
fs.mkdirSync('supabase/data',{recursive:true});
fs.writeFileSync('supabase/data/snapshots.json',JSON.stringify(snapshots));
const seed="begin;\n"+snapshots.map(row=>"insert into public.dbi_snapshots (id,payload,data_version) values ('"+row.id+"','"+JSON.stringify(row.payload).replaceAll("'","''")+"'::jsonb,'"+version+"') on conflict (id) do update set payload=excluded.payload,data_version=excluded.data_version,updated_at=now();").join('\n')+'\ncommit;\n';
fs.writeFileSync('supabase/seed.sql',seed);
html=html.replace(/<script src="[^"]+"><\/script>/g,'').replace('</body>','<script src="bootstrap.js"></script></body>');
const retained=scripts.filter(file=>!Object.values(datasets).some(([name])=>file.split('?')[0]===name));
const bootstrap=`(()=>{
 const datasets=${JSON.stringify(datasets)},scripts=${JSON.stringify(retained)};
 const script=src=>new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.onload=resolve;el.onerror=()=>reject(Error('Script could not load'));document.body.appendChild(el);});
 async function start(){
  let remote=false;
  try{
   const values=await Promise.all(Object.keys(datasets).map(async kind=>{const response=await fetch('/api/dashboard?kind='+kind,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('Data unavailable');return response.json();}));
   if(new Set(values.map(v=>v.version)).size!==1||values.some(v=>!v.payload))throw Error('Dataset versions differ');
   for(const value of values)window[datasets[value.kind][1]]=value.payload;
   remote=true;
  }catch{for(const [file] of Object.values(datasets))await script(file);}
  for(const file of scripts)await script(file);
  if(!remote){const notice=document.createElement('div');notice.className='notice cloud-data-notice';notice.innerHTML='<span>ⓘ</span><div>Đang dùng bản dữ liệu đã lưu. Dữ liệu mới tạm thời chưa tải được.</div>';document.querySelector('main')?.prepend(notice);}
 }
 start().catch(()=>{const target=document.getElementById('content');if(target)target.innerHTML='<div class="notice">Chưa tải được dashboard. Vui lòng tải lại trang.</div>';});
})();\n`;
fs.writeFileSync(path.join(output,'index.html'),html);
fs.writeFileSync(path.join(output,'bootstrap.js'),bootstrap);
fs.writeFileSync('supabase/data/build-info.json',JSON.stringify({version,banks:context.window.DBI_DATA.banks.length,pooled:context.window.DBI_DATA.evidence.length,annual:context.window.DBI_RESEARCH.records.length,pdfRows:context.window.DBI_PDF_SOURCES.rows.length},null,2));
console.log(JSON.stringify({version,publicDirectory:'public',datasets:4,originalScoresPreserved:true}));
