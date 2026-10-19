import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/experience.js','utf8');
function environment({fine=true,on=true}={}){
 const events=new Map(),frames=new Map();let frameId=0,clock=0,motion=on;
 const style=()=>({values:{},setProperty(k,v){this.values[k]=v;}});
 const root={style:style()};
 function element(classes=[]){const tokens=new Set(classes),listeners=[];return {style:style(),listeners,classList:{add:c=>tokens.add(c),remove:c=>tokens.delete(c),contains:c=>tokens.has(c)},getBoundingClientRect:()=>({left:0,top:0,width:200,height:100}),addEventListener(type,fn,options){listeners.push({type,fn,signal:options.signal});},send(type,event={}){for(const entry of listeners)if(entry.type===type&&!entry.signal.aborted)entry.fn({pointerType:'mouse',clientX:200,clientY:0,...event});}};}
 const card=element(),visual=element(['bank-visual']),polygon={setAttribute(k,v){this[k]=v;}};
 const content={querySelectorAll(selector){return selector.includes('polygon')?[polygon]:[card,visual];}};
 const document={documentElement:root,hidden:false,getElementById:()=>content};
 const pointer={matches:fine,addEventListener(k,fn){this.onchange=fn;}};
 const window={innerWidth:1000,innerHeight:500,DBI_MOTION:{enabled:()=>motion},matchMedia:()=>pointer,addEventListener(k,fn){events.set(k,fn);}};
 const context=vm.createContext({window,document,AbortController,requestAnimationFrame:fn=>{const id=++frameId;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)});
 vm.runInContext(source,context);
 function tick(){clock+=16.667;const queued=[...frames];frames.clear();queued.forEach(([,fn])=>fn(clock));}
 function settle(){let count=0;while(frames.size&&count++<200)tick();assert.equal(frames.size,0,'spring RAF must settle and stop');}
 return {root,window,document,pointer,events,frames,card,visual,polygon,tick,settle,setMotion:v=>motion=v};
}
const e=environment();assert.equal(e.polygon.pathLength,'1');assert(e.card.classList.contains('experience-card'));
e.events.get('pointermove')({pointerType:'mouse',clientX:5000,clientY:-100});e.settle();assert.equal(e.root.style.values['--light-x'],'1000.00px');assert.equal(e.root.style.values['--light-y'],'0.00px');
e.card.send('pointermove');e.settle();assert.equal(e.card.style.values['--tilt-x'],'1.600deg');assert.equal(e.card.style.values['--tilt-y'],'1.600deg');assert(e.card.classList.contains('is-reactive'));
e.visual.send('pointermove');e.settle();assert.equal(e.visual.style.values['--tilt-x'],'4.000deg');assert(!e.card.classList.contains('is-reactive'));assert.equal(e.card.style.values['--tilt-y'],'0deg');
e.visual.send('pointerleave');assert(!e.visual.classList.contains('is-reactive'));assert.equal(e.visual.style.values['--tilt-x'],'0deg');
const firstSignals=e.card.listeners.map(l=>l.signal);for(let i=0;i<5;i++)e.window.DBI_EXPERIENCE.refresh();assert(firstSignals.every(s=>s.aborted));assert.equal(e.card.listeners.filter(l=>!l.signal.aborted&&l.type==='pointermove').length,1);
const animations=[];const photo={classList:{remove(){},add(){}},animate(){let reject;const a={finished:new Promise((resolve,rej)=>{reject=rej;}),cancel(){this.cancelled=true;reject(Error('cancelled'));}};animations.push(a);return a;}};
e.window.DBI_EXPERIENCE.photoEntrance(photo);e.window.DBI_EXPERIENCE.photoEntrance(photo);assert.equal(animations[0].cancelled,true);assert.equal(animations[1].cancelled,undefined);
e.events.get('pointermove')({pointerType:'mouse',clientX:20,clientY:400});assert(e.frames.size>0);e.setMotion(false);e.window.DBI_EXPERIENCE.refresh();assert.equal(e.frames.size,0);assert.equal(animations[1].cancelled,true);e.card.send('pointermove');assert.equal(e.frames.size,0);
e.setMotion(true);e.window.DBI_EXPERIENCE.refresh();e.events.get('pointermove')({pointerType:'mouse',clientX:0,clientY:400});e.document.hidden=true;e.tick();assert.equal(e.frames.size,0);
const touch=environment({fine:false});touch.events.get('pointermove')({pointerType:'touch',clientX:0,clientY:0});assert.equal(touch.frames.size,0);assert.equal(touch.card.listeners.length,0);
const changing=environment();changing.events.get('pointermove')({pointerType:'mouse',clientX:0,clientY:0});changing.pointer.matches=false;changing.pointer.onchange();assert.equal(changing.frames.size,0);
await Promise.resolve();
console.log('PASS: bounded pointer coordinates and tilt, finite spring RAF, hover cleanup, repeated render listener disposal, photo animation replacement/cancellation, toggle off, hidden tab, touch and pointer changes.');
