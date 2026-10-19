import fs from 'node:fs';
import assert from 'node:assert/strict';
let app=fs.readFileSync('dist/app.js','utf8');
const start=app.indexOf('function dna(){'),end=app.indexOf('function journey(){',start);assert.ok(start>0&&end>start);
let body=app.slice(start,end);assert.ok(body.includes('${note()}'));body=body.replace('${note()}','${groupAnalysis()}<div style="height:22px"></div>${note()}');
app=app.slice(0,start)+body+app.slice(end);
const feature=`function groupSummary(b){const groups=new Map();for(const e of D.evidence.filter(e=>e.bank===b.name)){const key=e.pillar+'|'+e.group;if(!groups.has(key))groups.set(key,{pillar:e.pillar,name:e.group,rows:[]});groups.get(key).rows.push(e);}return [...groups.values()].sort((a,b)=>a.pillar-b.pillar).map(g=>({...g,count:g.rows.length,percent:g.rows.reduce((t,e)=>t+e.percent,0)/g.rows.length,raw:g.rows.reduce((t,e)=>t+e.level,0)/g.rows.length}));}
function groupAnalysis(){const b=bank(S.bank==='all'?S.focus:S.bank),groups=groupSummary(b);return card('Điểm theo nhóm tiêu chí',groups.length+' nhóm · trung bình điểm các tiêu chí trong từng nhóm','<div class="evidence-table-wrap"><table class="evidence-table"><thead><tr><th>TRỤ CỘT</th><th>NHÓM TIÊU CHÍ</th><th>SỐ TIÊU CHÍ</th><th>ĐIỂM '+unit()+'</th></tr></thead><tbody>'+groups.map(g=>'<tr><td>'+D.pillars[g.pillar]+'</td><td>'+esc(g.name)+'</td><td>'+g.count+'</td><td class="number">'+fmt(S.metric==='percent'?g.percent:g.raw)+'</td></tr>').join('')+'</tbody></table></div>');}
`;
app=app.slice(0,start)+feature+app.slice(start);
fs.writeFileSync('dist/app.js',app);
console.log('Added group-level analysis from existing criterion data.');
