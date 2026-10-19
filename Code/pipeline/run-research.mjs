import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const args of [['node','pipeline/extract-report-text.mjs'],['powershell','-NoProfile','-ExecutionPolicy','Bypass','-File','pipeline/check-pdf-pages.ps1'],['node','pipeline/correct-pdf-pages.mjs'],['node','pipeline/prepare-ocr-jobs.mjs'],['powershell','-NoProfile','-ExecutionPolicy','Bypass','-File','pipeline/ocr-report-pages.ps1','-Jobs',path.join(root,'pipeline/data/ocr-jobs.json')],['node','pipeline/build-research.mjs'],['node','pipeline/check-research.mjs'],['node','pipeline/export-research.mjs']]){
 const [command,...options]=args;const result=spawnSync(command==='node'?process.execPath:command,options,{cwd:root,stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status??1);
}
console.log('Research regenerated and checked. Original Excel files unchanged; website publication is separate.');
