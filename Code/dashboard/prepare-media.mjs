import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const media=JSON.parse(fs.readFileSync('bank-media.json','utf8').replace(/^\uFEFF/,''));
const expected=['OCB','LP Bank','TPBank','HDBank','SaigonBank'];assert.deepEqual(Object.keys(media).sort(),expected.sort());
const dist=path.resolve('dist');let count=0;
for(const [name,bank] of Object.entries(media)){
 assert(/^#[a-f0-9]{6}$/i.test(bank.accent));assert(/^#[a-f0-9]{6}$/i.test(bank.soft));assert(bank.logo&&bank.images?.length);
 for(const asset of [bank.logo,...bank.images.map(i=>i.src)]){const target=path.resolve(dist,asset);assert(target.startsWith(dist+path.sep)&&asset.startsWith('assets/banks/'));assert(fs.existsSync(target));assert(/\.(svg|png|jpe?g|webp)$/i.test(asset));count++;}
 for(const image of bank.images){assert(image.alt&&image.source?.startsWith('https://'));assert(image.illustrationOnly===true);}
}
fs.writeFileSync('dist/bank-media.js','window.DBI_MEDIA = '+JSON.stringify(media)+';\n');
console.log('Prepared five bank profiles with '+count+' verified local media files.');
