import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const root=path.dirname(fileURLToPath(import.meta.url));
for(const [command,args] of [['powershell.exe',['-NoProfile','-File',path.join(root,'read-workbooks.ps1')]],[process.execPath,[path.join(root,'prepare-data.mjs'),path.join(root,'.sites-local/workbooks.json')]]]){
  const result=spawnSync(command,args,{cwd:root,stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status??1);
}
const researchBuilder=path.join(root,'../pipeline/build-research.mjs');
if(fs.existsSync(researchBuilder)){
  const result=spawnSync(process.execPath,[researchBuilder,path.join(root,'.sites-local/workbooks.json')],{cwd:path.join(root,'..'),stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status??1);
}
console.log('Dashboard data refreshed from live Excel files. Run checks before publishing.');
