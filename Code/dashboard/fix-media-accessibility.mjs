import fs from 'node:fs';
const path='dist/visuals.js';
let source=fs.readFileSync(path,'utf8');
source=source.replace('data-media-bank="\'+esc(b.name)+\'"','data-media-bank="\'+esc(b.name)+\'" aria-label="Xem hồ sơ \'+esc(b.label)+\'"');
fs.writeFileSync(path,source);
