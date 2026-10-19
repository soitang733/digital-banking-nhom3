import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/cat-cursor.js','utf8');
function environment({fine=true,on=true}={}){
 let motion=on,raf=0,timer=0;const frames=new Map(),timers=new Map(),events=new Map(),nodes=[];
 function video(role){const handlers=new Map();return {dataset:{catState:role},readyState:0,hidden:true,paused:true,plays:0,addEventListener(k,fn){handlers.set(k,fn);},pause(){this.paused=true;},play(){this.paused=false;this.plays++;return Promise.resolve();},emit(k){handlers.get(k)?.();}};}
 const videos=['idle','hover','pop'].map(video),decoration=video('decor');
 const cursor={dataset:{},hidden:true,style:{},querySelectorAll:()=>videos},root={dataset:{}};
 const document={documentElement:root,hidden:false,getElementById:()=>cursor,querySelectorAll:()=>[decoration],addEventListener(k,fn){events.set(k,fn);},createElement(){const el={style:{},setAttribute(){},remove(){this.removed=true;}};nodes.push(el);return el;},body:{appendChild(){}}};
 const pointer={matches:fine,addEventListener(k,fn){this.onchange=fn;}};
 const window={innerWidth:1000,innerHeight:600,DBI_MOTION:{enabled:()=>motion},matchMedia:()=>pointer,addEventListener(k,fn){events.set(k,fn);}};
 const context=vm.createContext({window,document,WeakSet,requestAnimationFrame:fn=>{frames.set(++raf,fn);return raf;},cancelAnimationFrame:id=>frames.delete(id),setTimeout:fn=>{timers.set(++timer,fn);return timer;},clearTimeout:id=>timers.delete(id)});
 vm.runInContext(source,context);
 const target={closest:()=>null},button={closest:selector=>selector.includes('input')?null:button},input={closest:selector=>selector.includes('input')?input:null};
 function emit(k,{which=target,...extra}={}){events.get(k)?.({pointerType:'mouse',clientX:50,clientY:60,timeStamp:200,target:which,...extra});}
 function tick(){const queued=[...frames];frames.clear();queued.forEach(([,fn])=>fn());}
 return {root,cursor,videos,decoration,document,window,pointer,events,frames,timers,nodes,emit,tick,target,button,input,setMotion:v=>motion=v};
}
const e=environment();e.emit('pointermove');e.tick();assert.equal(e.root.dataset.catCursor,'off','native cursor must remain until sticker loads');
e.videos[0].readyState=2;e.videos[0].emit('loadeddata');assert.equal(e.root.dataset.catCursor,'on');assert.equal(e.cursor.dataset.state,'idle');assert.equal(e.cursor.style.transform,'translate3d(50px,60px,0)');
e.emit('pointermove',{which:e.button});e.tick();assert.equal(e.cursor.dataset.state,'idle','missing hover asset falls back to loaded idle');
e.videos[1].readyState=2;e.videos[1].emit('loadeddata');assert.equal(e.cursor.dataset.state,'hover');assert(e.videos[0].paused);
e.videos[2].readyState=2;e.videos[2].emit('loadeddata');e.emit('pointerdown',{which:e.button});assert.equal(e.cursor.dataset.state,'pop');
e.emit('pointerup',{which:e.button});assert(e.timers.size>0);
e.emit('pointermove',{which:e.input});e.tick();assert.equal(e.root.dataset.catCursor,'off');assert(e.videos.every(v=>v.paused));
for(let i=0;i<12;i++){e.emit('pointermove',{clientX:100+i*35,timeStamp:600+i*200});e.tick();}assert(e.nodes.filter(n=>!n.removed).length<=4,'paw trail must be bounded');
e.decoration.readyState=2;e.window.DBI_CAT_CURSOR.refresh();assert.equal(e.decoration.paused,false);e.setMotion(false);e.window.DBI_CAT_CURSOR.refresh();assert.equal(e.root.dataset.catCursor,'off');assert(e.videos.every(v=>v.paused));assert(e.decoration.paused);assert(e.nodes.every(n=>n.removed));assert.equal(e.frames.size,0);assert.equal(e.timers.size,0);
e.setMotion(true);e.window.DBI_CAT_CURSOR.refresh();assert.equal(e.root.dataset.catCursor,'on');
e.document.hidden=true;e.window.DBI_CAT_CURSOR.stop();assert(e.videos.every(v=>v.paused));assert(e.decoration.paused);assert.equal(e.root.dataset.catCursor,'off');
const touch=environment({fine:false});touch.videos[0].readyState=2;touch.videos[0].emit('loadeddata');touch.emit('pointermove',{pointerType:'touch'});assert.equal(touch.root.dataset.catCursor,'off');assert.equal(touch.frames.size,0);
const keyboard=environment();keyboard.videos[0].readyState=2;keyboard.videos[0].emit('loadeddata');keyboard.emit('pointermove');keyboard.tick();keyboard.emit('keydown');assert.equal(keyboard.root.dataset.catCursor,'off');assert(keyboard.videos.every(v=>v.paused));
console.log('PASS: native pointer until ready, hover fallback, reaction state, input/keyboard exception, bounded paw trail, disable/re-enable, media pause, hidden tab and touch.');
