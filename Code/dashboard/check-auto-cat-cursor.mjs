import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const frames=new Map(),events=new Map();let next=0,on=true,storageAccessed=false;
const ids=JSON.parse(fs.readFileSync('cat-stickers.json','utf8')).assets.map(a=>a.name);
const videos=ids.map(id=>({dataset:{catId:id},readyState:2,paused:true,pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();},addEventListener(){}}));
const cursor={dataset:{},style:{},querySelectorAll:()=>videos},root={dataset:{}},document={documentElement:root,hidden:false,getElementById:()=>cursor,querySelectorAll:()=>[],addEventListener(k,fn){events.set(k,fn);},body:{appendChild(){}},createElement:()=>({style:{},setAttribute(){},remove(){}})};
const window={innerWidth:1000,innerHeight:600,DBI_MOTION:{enabled:()=>on},matchMedia:()=>({matches:true,addEventListener(){}}),addEventListener(k,fn){events.set(k,fn);}};
const storage=new Proxy({},{get(){storageAccessed=true;throw Error('Old selection must not be accessed');}});
vm.runInContext(fs.readFileSync('dist/cat-cursor-v3.js','utf8'),vm.createContext({document,window,localStorage:storage,WeakSet,requestAnimationFrame:fn=>{frames.set(++next,fn);return next;},cancelAnimationFrame:id=>frames.delete(id),setTimeout:()=>0,clearTimeout(){}}));
const visited=new Set();for(let i=1;i<=8;i++){events.get('pointermove')({pointerType:'mouse',target:{closest:()=>null},clientX:30,clientY:40,timeStamp:i*3500});for(const [id,fn] of [...frames]){frames.delete(id);fn();}visited.add(cursor.dataset.catId);assert.equal(videos.filter(v=>!v.paused).length,1);}
assert.equal(visited.size,8);assert.equal(storageAccessed,false);on=false;window.DBI_CAT_CURSOR.refresh();assert.equal(root.dataset.catCursor,'off');assert(videos.every(v=>v.paused));
console.log('PASS: all eight cursor cats rotate without picker or old pinned preference, one video active, off state restores native pointer.');
