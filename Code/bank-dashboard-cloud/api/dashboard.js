const IDS=new Set(['data','research','pdf_sources','media']);

export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
 const request=new URL(req.url,'https://dashboard.local'),kind=request.searchParams.get('kind')??'data';
 if(!IDS.has(kind))return res.status(400).json({error:'Invalid dataset'});
 const base=process.env.SUPABASE_URL,key=process.env.SUPABASE_PUBLISHABLE_KEY;
 if(!base||!key)return res.status(503).json({error:'Dashboard database is not configured'});
 try{
  const url=new URL('/rest/v1/dbi_snapshots',base);
  url.searchParams.set('id','eq.'+kind);url.searchParams.set('select','payload,data_version,updated_at');url.searchParams.set('limit','1');
  const upstream=await fetch(url,{headers:{apikey:key,Accept:'application/json'},signal:AbortSignal.timeout(12000)});
  if(!upstream.ok)return res.status(502).json({error:'Dashboard data is temporarily unavailable'});
  const rows=await upstream.json();if(!rows[0]?.payload)return res.status(503).json({error:'Dataset has not been imported'});
  res.setHeader('Cache-Control','public, max-age=0, s-maxage=60, stale-while-revalidate=300');
  return res.status(200).json({kind,payload:rows[0].payload,version:rows[0].data_version,updatedAt:rows[0].updated_at});
 }catch{return res.status(502).json({error:'Dashboard data is temporarily unavailable'});}
}
