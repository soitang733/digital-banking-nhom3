import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
let state={bank:'all',focus:'OCB'},renders=0;
const media=JSON.parse(fs.readFileSync('bank-media.json','utf8'));
const profiles=Object.keys(media).map(name=>({name,label:name}));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const elements=[];
const document={querySelectorAll:selector=>selector==='[data-media-bank]'?elements:[]};
const ctx=vm.createContext({window:{DBI_MEDIA:media},D:{banks:profiles},S:state,esc,document,render(){renders++;}});
vm.runInContext(fs.readFileSync('dist/visuals.js','utf8'),ctx);
for(const b of profiles){
 const markup=vm.runInContext(`bankVisual(D.banks[${profiles.indexOf(b)}])`,ctx);
 assert(markup.includes(esc(media[b.name].images[0].src)));
 assert(markup.includes(esc(media[b.name].logo)));
 assert(markup.includes('Hình ảnh minh họa'));
 elements.push({dataset:{mediaBank:b.name}});
}
vm.runInContext('bindBankVisuals()',ctx);
for(const button of elements){button.onclick();assert.equal(state.bank,button.dataset.mediaBank);assert.equal(state.focus,state.bank);}
assert.equal(renders,5);
const photo={classList:{remove(){}},src:'',alt:''},credit={href:''};
const buttons=media['LP Bank'].images.map(p=>({dataset:{photoSrc:p.src,photoAlt:p.alt,photoSource:p.source},classList:{toggle(k,v){this.active=v;}},setAttribute(k,v){this[k]=v;}}));
const visual={querySelector:()=>photo,querySelectorAll:()=>buttons,parentElement:{querySelector:()=>credit}};
buttons.forEach(b=>b.closest=()=>visual);
document.querySelectorAll=selector=>selector==='[data-photo-src]'?buttons:[];
vm.runInContext('bindBankVisuals()',ctx);
buttons[1].onclick();assert.equal(photo.src,media['LP Bank'].images[1].src);assert.equal(photo.alt,media['LP Bank'].images[1].alt);assert.equal(credit.href,media['LP Bank'].images[1].source);assert.equal(buttons[0]['aria-pressed'],'false');assert.equal(buttons[1]['aria-pressed'],'true');
console.log('PASS: all five bank media match their profile; bank selection scopes state; photo changes update alt, source credit and accessible selection.');
