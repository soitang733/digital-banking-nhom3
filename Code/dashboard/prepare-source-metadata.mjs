import fs from 'node:fs';
import assert from 'node:assert/strict';
const doc=JSON.parse(fs.readFileSync('../audit/document-metadata.json','utf8').replace(/^\uFEFF/,''));
const source=JSON.parse(fs.readFileSync('../source-data.json','utf8').replace(/^\uFEFF/,''));
const rows=source['ScoringReview.xlsx'].Danh_muc.slice(1);
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9]/g,'');
const index=new Map(doc.criteria.map(c=>[c.code,c]));
assert.equal(index.size,140);
const criteria=rows.map(row=>{const get=col=>Object.entries(row).find(([k])=>k.replace(/\d+$/,'')===col)?.[1];const sourceCode=get('C'),name=get('D');const parts=sourceCode.split('.');const candidate=parts.slice(0,2).join('.')+'.'+(Number(parts[2])-2000);const canonical=index.get(candidate);const verified=!!canonical&&norm(canonical.name)===norm(name);return {sourceCode,code:verified?candidate:sourceCode,name,verified,documentCode:candidate};});
const sourceNames={'TP BANK':'TPBank','HD BANK':'HDBank','OCB':'OCB','LP BANK':'LP Bank','Sài gòn Bank':'SaigonBank'};
const reports=[];let currentBank=null,offset=0;
for(const row of doc.reportRows.slice(1)){const [bankCell,annual,sustainability]=row.cells;if(bankCell.text.trim()){currentBank=sourceNames[bankCell.text.trim()];offset=0;}assert.ok(currentBank);const year=2023+offset++;for(const [type,cell] of [['Báo cáo thường niên',annual],['Báo cáo phát triển bền vững',sustainability]]){const urls=[...new Set([...(cell.urls??[]),...(cell.text.match(/https?:\/\/[^\s<>"']+/g)??[])])];for(const url of urls)reports.push({id:'report-'+reports.length,bank:currentBank,year,type,url,provenance:'Danh sách báo cáo trong tài liệu Word; chưa gắn với tiêu chí cụ thể',verified:false});}}
const metadata={criteria,reports,sourceDocument:'Bản sao của NHÓM 3 - NGÂN HÀNG SỐ (2).docx'};
fs.writeFileSync('source-metadata.json',JSON.stringify(metadata,null,2)+'\n');
console.log(JSON.stringify({mapped:criteria.filter(c=>c.verified).length,unresolved:criteria.filter(c=>!c.verified),reports:reports.length}));
