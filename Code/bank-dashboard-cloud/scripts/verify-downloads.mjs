import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('../dashboard/dist/download-catalog.js','utf8'),ctx);
const C=ctx.window.DBI_DOWNLOADS,files=[C.core,C.report,C.code,C.readme,C.submission,...C.files,...C.pdfs];
assert.equal(C.files.length,4);assert.equal(C.pdfs.length,23);
let index=0,verified=0;
async function worker(){while(index<files.length){const file=files[index++];const result=await fetch(file.url,{method:'HEAD',headers:{'Accept-Encoding':'identity'},signal:AbortSignal.timeout(45000)});assert.equal(result.status,200,file.path);assert.equal(Number(result.headers.get('content-length')),file.bytes,file.path);verified++;}}
await Promise.all(Array.from({length:10},worker));
const result={status:'PASS',publicFiles:verified,finalExcel:4,pdfs:23,zip:true,allLinksAccessible:true};
fs.writeFileSync('.deployment/downloads-verification.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
