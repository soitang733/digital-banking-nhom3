import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=JSON.parse(fs.readFileSync(process.argv[2]??'../source-data.json','utf8').replace(/^\uFEFF/,''));
const metadata=JSON.parse(fs.readFileSync('source-metadata.json','utf8'));
const criterionMap=new Map(metadata.criteria.map(c=>[c.sourceCode,c]));
function records(rows){const head=rows[0];const columns=Object.entries(head).filter(([k])=>!k.endsWith('_formula')).map(([k,v])=>[k.replace(/\d+$/,''),v]);return rows.slice(1).map(row=>Object.fromEntries(columns.map(([col,label])=>[label,Object.entries(row).find(([k])=>k.replace(/\d+$/,'')===col)?.[1]??''])));}
const final=source['DBI_DigitalScore_theo_tieu_chi.xlsx'];
const names=['TPBank','HDBank','LP Bank','OCB','SaigonBank'];
const colors={'TPBank':'#8b5bd6','HDBank':'#dc6e54','LP Bank':'#478cd5','OCB':'#15816d','SaigonBank':'#b69759'};
const pillars=['Khách hàng','Chiến lược','Công nghệ','Vận hành','Văn hóa','Dữ liệu'];
const reviews=Object.fromEntries(names.map(n=>[n,new Map(records(source['ScoringReview.xlsx'][n]).map(r=>[r['Mã'],r]))]));
const evidence=records(final.Chi_tiet_tieu_chi).map(r=>{const review=reviews[r['Ngân hàng']].get(r['Mã']);return {bank:r['Ngân hàng'],pillar:Number(r['Trụ cột'][0])-1,group:r['Nhóm tiêu chí'],code:r['Mã'],name:r['Tiêu chí'],level:Number(r['Mức đạt']),percent:Number(r['Tỷ lệ hoàn thành (%)']),text:r['Bằng chứng'],rubric:review?.['Mô tả mức đã chấm']??'',status:review?.['Kết quả kiểm tra']??'Cần rà soát',urls:[...new Set(r['Bằng chứng'].match(/https?:\/\/[^\s<>"']+/g)??[])]};});
const banks=records(final.Digital_Score_Rank).map(r=>{const rows=evidence.filter(e=>e.bank===r['Ngân hàng']);const p=pillars.map((_,i)=>rows.filter(e=>e.pillar===i));const sums=p.map(rs=>rs.reduce((t,e)=>t+e.level,0));const percent=p.map(rs=>rs.reduce((t,e)=>t+e.percent,0)/rs.length);const score=percent.reduce((t,v)=>t+v,0)/6;assert.ok(Math.abs(score-Number(r['Digital Score (%)']))<1e-8);assert.equal(rows.length,140);return {name:r['Ngân hàng'],label:r['Ngân hàng']==='LP Bank'?'LPBank':r['Ngân hàng']==='SaigonBank'?'Saigonbank':r['Ngân hàng'],color:colors[r['Ngân hàng']],rank:Number(r.Rank),score,stage:r['Tên mức'],raw:rows.reduce((t,e)=>t+e.level,0)/140,zero:rows.filter(e=>e.level===0).length,count:140,pillars:percent,rawPillars:sums.map((v,i)=>v/p[i].length),coverage:rows.filter(e=>e.level>0).length/140*100};});
const analysis=records(source['AnalysisDataset.xlsx'].So_sanh_ngan_hang).filter(r=>names.includes(r['Ngân hàng']));
for(const b of banks){const a=analysis.find(r=>r['Ngân hàng']===b.name);assert.equal(evidence.filter(e=>e.bank===b.name).reduce((t,e)=>t+e.level,0),Number(a.Tong_diem));assert.equal(b.zero,Number(a.So_muc_0));}
assert.equal(evidence.length,700);assert.equal(new Set(evidence.map(e=>e.code)).size,140);
for(const e of evidence){const c=criterionMap.get(e.code);assert.ok(c?.verified,'Unverified criterion mapping: '+e.code);e.sourceCode=e.code;e.code=c.code;e.codeVerified=true;}
const data={period:'2023–2025',pillars,counts:[25,24,29,22,22,18],banks,evidence,criteria:metadata.criteria,reports:metadata.reports,source:'DBI_DigitalScore_theo_tieu_chi.xlsx',reviewSource:'ScoringReview.xlsx',analysisSource:'AnalysisDataset.xlsx'};
fs.writeFileSync('dist/data.js','window.DBI_DATA = '+JSON.stringify(data)+';\n');
console.log(JSON.stringify({verified:true,rows:evidence.length,banks:banks.sort((a,b)=>a.rank-b.rank).map(b=>({bank:b.label,score:b.score,raw:b.raw,rank:b.rank})),links:evidence.filter(e=>e.urls.length).length}));
