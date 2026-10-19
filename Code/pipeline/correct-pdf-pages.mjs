import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const manifest=JSON.parse(fs.readFileSync('pipeline/data/reports/manifest.json','utf8').replace(/^\uFEFF/,''));
const counts=JSON.parse(fs.readFileSync('pipeline/data/pdf-page-counts.json','utf8'));
for(const item of counts){const file='pipeline/data/report-text/'+item.id+'.json',doc=JSON.parse(fs.readFileSync(file,'utf8'));if(item.pages===null){console.log('Native page count unavailable '+item.id);continue;}
 if(doc.pages.length!==item.pages){const report=manifest.find(r=>r.id===item.id),pages=[];for(let page=1;page<=item.pages;page++){const text=execFileSync('C:/Program Files/Git/mingw64/bin/pdftotext.exe',['-f',String(page),'-l',String(page),'-layout','-nopgbrk','-enc','UTF-8',report.file,'-'],{encoding:'utf8',maxBuffer:2000000});pages.push({page,text});}console.log('Corrected '+item.id+': '+doc.pages.length+' → '+pages.length+' physical PDF pages');doc.pages=pages;}
 doc.physicalPageCount=item.pages;doc.pageCountVerified=true;fs.writeFileSync(file,JSON.stringify(doc));
}
