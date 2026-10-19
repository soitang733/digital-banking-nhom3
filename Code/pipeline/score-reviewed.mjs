export const conversion={0:0,1:0,2:25,3:50,4:75,5:100};
export function scoreReviewed(rows){
 const applicable=rows.filter(r=>!r.na),scored=applicable.filter(r=>r.level!==null),pillars=Array.from({length:6},(_,i)=>{
  const part=applicable.filter(r=>r.pillar===i),done=part.filter(r=>r.level!==null);
  return {count:part.length,scored:done.length,score:part.length&&done.length===part.length?done.reduce((n,r)=>n+conversion[r.level],0)/part.length:null};
 });
 return {total:rows.length,scored:scored.length,na:rows.filter(r=>r.na).length,pending:applicable.length-scored.length,coverage:applicable.length?scored.length/applicable.length*100:null,pillars,score:pillars.every(p=>p.score!==null)?pillars.reduce((n,p)=>n+p.score,0)/6:null};
}
