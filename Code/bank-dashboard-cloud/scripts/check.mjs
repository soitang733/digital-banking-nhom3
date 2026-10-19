import fs from 'node:fs';
import assert from 'node:assert/strict';
import handler from '../api/dashboard.js';
const snapshots=JSON.parse(fs.readFileSync('supabase/data/snapshots.json','utf8'));
assert.equal(new Set(snapshots.map(r=>r.data_version)).size,1);
assert.equal(snapshots.find(r=>r.id==='data').payload.evidence.length,700);
assert.equal(snapshots.find(r=>r.id==='research').payload.records.length,2100);
assert.equal(snapshots.find(r=>r.id==='pdf_sources').payload.stats.withRelatedPDF,391);
for(const row of snapshots)assert(Buffer.byteLength(JSON.stringify({kind:row.id,payload:row.payload,version:row.data_version}))<4_500_000,'Dataset exceeds API response limit');
const fakeRes=()=>({code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(value){this.value=value;return this;}});
const oldURL=process.env.SUPABASE_URL,oldKey=process.env.SUPABASE_PUBLISHABLE_KEY,oldFetch=globalThis.fetch;
try{
 let res=fakeRes();await handler({method:'POST',url:'/api/dashboard'},res);assert.equal(res.code,405);
 res=fakeRes();await handler({method:'GET',url:'/api/dashboard?kind=not-a-dataset'},res);assert.equal(res.code,400);
 delete process.env.SUPABASE_URL;delete process.env.SUPABASE_PUBLISHABLE_KEY;
 res=fakeRes();await handler({method:'GET',url:'/api/dashboard?kind=data'},res);assert.equal(res.code,503);
 process.env.SUPABASE_URL='https://example-project.supabase.co';process.env.SUPABASE_PUBLISHABLE_KEY='test-read-only-key';
 globalThis.fetch=async(url,options)=>{assert.equal(url.pathname,'/rest/v1/dbi_snapshots');assert.equal(url.searchParams.get('id'),'eq.data');assert.equal(options.headers.apikey,'test-read-only-key');return {ok:true,json:async()=>[{payload:snapshots[0].payload,data_version:snapshots[0].data_version,updated_at:'2026-10-13'}]};};
 res=fakeRes();await handler({method:'GET',url:'/api/dashboard?kind=data'},res);assert.equal(res.code,200);assert.equal(res.value.payload.evidence.length,700);
 globalThis.fetch=async()=>({ok:false,status:403});res=fakeRes();await handler({method:'GET',url:'/api/dashboard?kind=data'},res);assert.equal(res.code,502);assert(!JSON.stringify(res.value).includes(process.env.SUPABASE_PUBLISHABLE_KEY));
}finally{globalThis.fetch=oldFetch;if(oldURL===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldURL;if(oldKey===undefined)delete process.env.SUPABASE_PUBLISHABLE_KEY;else process.env.SUPABASE_PUBLISHABLE_KEY=oldKey;}
console.log('PASS: preserved snapshots, consistent versions, API response sizes, read-only API and safe upstream failures.');
