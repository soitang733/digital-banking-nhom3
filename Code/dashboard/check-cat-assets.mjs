import fs from 'node:fs';
import assert from 'node:assert/strict';
const manifest=JSON.parse(fs.readFileSync('cat-stickers.json','utf8'));
assert.equal(manifest.name,'Cat things');assert.equal(manifest.assets.length,8);assert.deepEqual(manifest.assets.map(a=>a.index),[0,1,3,6,9,14,16,18]);
for(const asset of manifest.assets){assert(asset.src.startsWith('assets/stickers/'));const bytes=fs.readFileSync('dist/'+asset.src);assert.equal(bytes.subarray(0,4).toString('hex'),'1a45dfa3');assert(bytes.includes(Buffer.from('V_VP9')));assert(bytes.includes(Buffer.from([0x53,0xC0,0x81,0x01])),'WebM must declare alpha mode: '+asset.name);assert.equal(bytes.length,asset.sizeBytes);assert(asset.assetSource.startsWith('https://stickers.fullyst.com/'));}
console.log('PASS: all eight selected Cat things VP9 WebM assets, alpha-mode tracks, exact indices, byte sizes and source manifest.');
