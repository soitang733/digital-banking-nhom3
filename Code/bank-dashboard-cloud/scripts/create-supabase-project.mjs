import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const receipt='.deployment/supabase-project.json';
if(fs.existsSync(receipt)){console.log(JSON.stringify({existing:JSON.parse(fs.readFileSync(receipt,'utf8'))}));process.exit(0);}
const password=crypto.randomBytes(36).toString('base64url');
const cli='node_modules/supabase/dist/supabase.js';
const result=spawnSync(process.execPath,[cli,'projects','create','digital-banking-nhom3','--org-id','yewjybflxpbsomrfynan','--region','ap-southeast-1','--db-password',password,'--yes','--output','json'],{encoding:'utf8',timeout:180000,maxBuffer:1024*1024});
const clean=text=>String(text??'').replaceAll(password,'[redacted]');
if(result.status!==0){console.error(clean(result.stderr||result.stdout||result.error?.message));process.exit(1);}
let project;
try{project=JSON.parse(result.stdout);}catch{console.error('Project response could not be parsed; check existing projects before retrying.');process.exit(1);}
const info={ref:project.id??project.ref,name:project.name,url:'https://'+(project.id??project.ref)+'.supabase.co',organization:'yewjybflxpbsomrfynan',region:'ap-southeast-1'};
if(!info.ref||!info.name)throw Error('Project creation did not return its identity');
fs.mkdirSync('.deployment',{recursive:true});fs.writeFileSync(receipt,JSON.stringify(info,null,2));
console.log(JSON.stringify({created:info}));
