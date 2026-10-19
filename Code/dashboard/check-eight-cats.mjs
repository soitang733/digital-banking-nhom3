import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/cat-cursor-v2.js','utf8'),ids=['cat-chill','cat-dance','cat-banana','cat-smile','cat-pop','cat-judge','cat-orange','cat-eyes'];
function environment({fine=true,on=true,stored=null,blocked=false}={}){
 let motion=on,raf=0,timer=0;const frames=new Map(),timers=new Map(),events=new Map(),nodes=[],writes=[];
 function video(id,preview=false){const handlers=new Map();return {dataset:{catId:id,catLabel:id},readyState:0,hidden:true,paused:true,handlers,hasAttribute:k=>preview&&k==='data-cat-preview',addEventListener(k,fn){handlers.set(k,fn);},pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();},emit(k){handlers.get(k)?.();}};}
 const videos=ids.map(id=>video(id)),previews=ids.map(id=>video(id,true)),decoration=video('decor');
 const buttons=ids.map((id,i)=>({dataset:{catChoice:id},attributes:{},listeners:new Map(),setAttribute(k,v){this.attributes[k]=v;},classList:{toggle(){}},querySelector:()=>previews[i],addEventListener(k,fn){this.listeners.set(k,fn);}}));
 const auto={attributes:{},setAttribute(k,v){this.attributes[k]=v;}},caption={textContent:''},cursor={dataset:{},hidden:true,style:{},querySelectorAll:()=>videos},root={dataset:{}};
 const query={'cat-cursor':cursor,'cat-auto':auto,'cat-picker-caption':caption};
 const document={documentElement:root,hidden:false,getElementById:id=>query[id],querySelectorAll:selector=>selector==='[data-cat-choice]'?buttons:[decoration,...previews],addEventListener(k,fn){events.set(k,fn);},createElement(){const el={style:{},setAttribute(){},remove(){this.removed=true;}};nodes.push(el);return el;},body:{appendChild(){}}};
 const pointer={matches:fine,addEventListener(k,fn){this.onchange=fn;}};
 const window={innerWidth:1000,innerHeight:600,DBI_MOTION:{enabled:()=>motion},matchMedia:()=>pointer,addEventListener(k,fn){events.set(k,fn);}};
 const storage={getItem(){if(blocked)throw Error('blocked');return stored;},setItem(k,v){if(blocked)throw Error('blocked');stored=v;writes.push(v);},removeItem(){if(blocked)throw Error('blocked');stored=null;writes.push(null);}};
 vm.runInContext(source,vm.createContext({window,document,WeakSet,localStorage:storage,requestAnimationFrame:fn=>{frames.set(++raf,fn);return raf;},cancelAnimationFrame:id=>frames.delete(id),setTimeout:fn=>{timers.set(++timer,fn);return timer;},clearTimeout:id=>timers.delete(id)}));
 const target={closest:()=>null},button={closest:selector=>selector.includes('input')?null:button},input={closest:selector=>selector.includes('input')?input:null};
 function emit(k,{which=target,...extra}={}){events.get(k)?.({pointerType:'mouse',clientX:50,clientY:60,timeStamp:200,target:which,...extra});}
 function tick(){const queued=[...frames];frames.clear();queued.forEach(([,fn])=>fn());}
 function load(){for(const v of [...videos,...previews,decoration]){v.readyState=2;v.emit('loadeddata');}}
 return {root,cursor,videos,previews,decoration,document,window,pointer,frames,timers,nodes,buttons,auto,caption,writes,emit,tick,load,button,input,setMotion:v=>motion=v};
}
const e=environment();e.emit('pointermove');e.tick();assert.equal(e.root.dataset.catCursor,'off');e.load();assert.equal(e.root.dataset.catCursor,'on');assert.equal(e.cursor.dataset.catId,'cat-smile');assert(e.previews.every(v=>v.paused));
const visited=new Set();for(let i=1;i<=8;i++){e.emit('pointermove',{timeStamp:i*3500});e.tick();visited.add(e.cursor.dataset.catId);assert.equal(e.videos.filter(v=>!v.paused).length,1);}assert.deepEqual([...visited].sort(),[...ids].sort(),'auto mode must reach every cat');
e.buttons[6].onclick();assert.equal(e.cursor.dataset.catId,'cat-orange');assert.equal(e.buttons[6].attributes['aria-pressed'],'true');assert.equal(e.auto.attributes['aria-pressed'],'false');assert.equal(e.writes.at(-1),'cat-orange');
e.emit('pointermove',{timeStamp:90000});e.tick();assert.equal(e.cursor.dataset.catId,'cat-orange');e.emit('pointerdown',{which:e.button});assert.equal(e.cursor.dataset.state,'pop');assert.equal(e.cursor.dataset.catId,'cat-orange');e.emit('pointerup');
e.buttons[2].listeners.get('pointerenter')();assert.equal(e.previews[2].paused,false);assert.equal(e.previews.filter(v=>!v.paused).length,1);e.buttons[2].listeners.get('pointerleave')();assert(e.previews.every(v=>v.paused));
e.emit('pointermove',{which:e.input});e.tick();assert.equal(e.root.dataset.catCursor,'off');
e.setMotion(false);e.window.DBI_CAT_CURSOR.refresh();assert(e.previews.every(v=>v.paused));assert(e.decoration.paused);assert.equal(e.frames.size,0);assert.equal(e.timers.size,0);assert(e.nodes.every(n=>n.removed));
e.setMotion(true);e.emit('pointermove');e.tick();e.window.DBI_CAT_CURSOR.refresh();assert.equal(e.cursor.dataset.catId,'cat-orange');e.auto.onclick();assert.equal(e.auto.attributes['aria-pressed'],'true');assert.equal(e.writes.at(-1),null);
e.buttons[0].listeners.get('focus')();e.window.DBI_CAT_CURSOR.stop();assert(e.previews.every(v=>v.paused));assert(e.previews.every(v=>v.dataset.previewActive==='false'));
const saved=environment({stored:'cat-eyes'});saved.load();saved.emit('pointermove');saved.tick();assert.equal(saved.cursor.dataset.catId,'cat-eyes');assert.equal(saved.buttons[7].attributes['aria-pressed'],'true');
const blocked=environment({blocked:true});blocked.load();blocked.emit('pointermove');blocked.tick();blocked.buttons[1].onclick();assert.equal(blocked.cursor.dataset.catId,'cat-dance');
const touch=environment({fine:false});touch.load();touch.emit('pointermove',{pointerType:'touch'});assert.equal(touch.root.dataset.catCursor,'off');assert.equal(touch.frames.size,0);
console.log('PASS: all eight in auto rotation, one cursor video playing, pinned/persisted selection, preview hover/focus pause, effect toggle, input, touch, blocked storage, timer/trail cleanup.');
