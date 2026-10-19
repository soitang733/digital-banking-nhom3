import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import handler from '../api/dashboard.js';
const root=path.resolve('public');
const mimetypes={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webm':'video/webm','.ttf':'font/ttf'};
const server=http.createServer(async(req,res)=>{
 const route=new URL(req.url,'http://localhost');
 if(route.pathname==='/api/dashboard'){
  res.status=status=>{res.statusCode=status;return res;};res.json=body=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body));return res;};
  return handler(req,res);
 }
 const name=route.pathname==='/'?'/index.html':decodeURIComponent(route.pathname),target=path.resolve(root,'.'+name);
 if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 try{const data=fs.readFileSync(target);res.writeHead(200,{'Content-Type':mimetypes[path.extname(target)]??'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}
});
server.listen(4174,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4174'));
