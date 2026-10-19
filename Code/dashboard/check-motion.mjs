import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/motion.js','utf8');
function environment({stored=null,reduced=false,storageThrows=false}={}){
 const frames=new Map(),events=new Map(),timers=[];let nextFrame=0,writes=[];const classes=new Set();
 const classList={add:c=>classes.add(c),remove:c=>classes.delete(c)};
 const counter={dataset:{countTo:'48.983423',countDecimals:'1'},textContent:'49,0',isConnected:true},toggle={setAttribute(k,v){this[k]=v;}},heading={classList},bar={style:{}},root={dataset:{},scrollHeight:2000};
 const content={querySelectorAll(selector){return selector==='[data-count-to]'?[counter]:[];}};
 const label={textContent:''},feedback={textContent:''};
 const query={content,'motion-toggle':toggle,'motion-label':label,'motion-feedback':feedback,'page-title':heading,'reading-progress':bar};
 const preference={matches:reduced,addEventListener(k,f){this.onchange=f;}};
 const document={documentElement:root,hidden:false,getElementById:id=>query[id],addEventListener(k,f){events.set(k,f);},createElement:()=>({style:{},setAttribute(){},addEventListener(){},remove(){this.removed=true;}})};
 const window={innerHeight:500,scrollY:750,matchMedia:q=>q.includes('reduced')?preference:{matches:false},addEventListener(k,f){events.set(k,f);}};
 const context=vm.createContext({document,window,localStorage:{getItem(){if(storageThrows)throw Error('Blocked');return stored;},setItem(k,v){if(storageThrows)throw Error('Blocked');writes.push([k,v]);}},AbortController,requestAnimationFrame:f=>{const id=++nextFrame;frames.set(id,f);return id;},cancelAnimationFrame:id=>frames.delete(id),setTimeout:f=>timers.push(f)});
 vm.runInContext(source,context);
 function tick(t){const queued=[...frames];frames.clear();queued.forEach(([,f])=>f(t));}
 return {document,window,counter,toggle,root,frames,events,preference,writes,tick,bar,timers,label,feedback};
}
const normal=environment();assert.equal(normal.root.dataset.motion,'on');normal.tick(0);assert.equal(normal.counter.textContent,'0,0');normal.tick(400);assert.ok(parseFloat(normal.counter.textContent.replace(',','.'))>40);normal.tick(900);assert.equal(normal.counter.textContent,'49,0');assert.equal(normal.bar.style.transform,'scaleX(0.5)');
normal.window.DBI_MOTION.refresh();normal.tick(1000);normal.toggle.onclick();assert.equal(normal.counter.textContent,'49,0');assert.equal(normal.root.dataset.motion,'off');assert.equal(normal.toggle['aria-pressed'],'false');assert.equal(normal.writes.at(-1)[1],'off');
normal.toggle.onclick();assert.equal(normal.root.dataset.motion,'on');normal.document.hidden=true;normal.events.get('visibilitychange')();assert.equal(normal.counter.textContent,'49,0');normal.tick(3000);assert.equal(normal.counter.textContent,'49,0');
const reduced=environment({reduced:true});assert.equal(reduced.root.dataset.motion,'off');assert.equal(reduced.counter.textContent,'49,0');assert.equal(reduced.toggle.disabled,false);assert.equal(reduced.label.textContent,'Hiệu ứng tắt');reduced.tick(1000);assert.equal(reduced.counter.textContent,'49,0');
// A device preference sets the default, but never disables the user's control.
reduced.toggle.onclick();assert.equal(reduced.root.dataset.motion,'on');assert.equal(reduced.root.dataset.motionSource,'user');assert.equal(reduced.label.textContent,'Hiệu ứng bật');assert.equal(reduced.feedback.textContent,'Đã bật hiệu ứng chuyển động.');assert.equal(reduced.writes.at(-1)[1],'on');reduced.tick(0);reduced.tick(900);assert.equal(reduced.counter.textContent,'49,0');
reduced.toggle.onclick();assert.equal(reduced.root.dataset.motion,'off');assert.equal(reduced.label.textContent,'Hiệu ứng tắt');assert.equal(reduced.toggle.disabled,false);
const explicit=environment({stored:'on',reduced:true});assert.equal(explicit.root.dataset.motion,'on');assert.equal(explicit.toggle.disabled,false);explicit.preference.matches=true;explicit.preference.onchange();assert.equal(explicit.root.dataset.motion,'on');
const device=environment();device.preference.matches=true;device.preference.onchange();assert.equal(device.root.dataset.motion,'off');assert.equal(device.toggle.disabled,false);
const saved=environment({stored:'off'});assert.equal(saved.root.dataset.motion,'off');assert.equal(saved.counter.textContent,'49,0');
const blocked=environment({storageThrows:true});blocked.tick(0);blocked.tick(900);assert.equal(blocked.counter.textContent,'49,0');blocked.toggle.onclick();assert.equal(blocked.root.dataset.motion,'off');
const detached=environment();detached.counter.isConnected=false;detached.tick(100);assert.equal(detached.counter.textContent,'49,0');assert(detached.frames.size<=1);
assert.equal(normal.root.dataset.tabHidden,'true');normal.document.hidden=false;normal.events.get('visibilitychange')();assert.equal(normal.root.dataset.tabHidden,'false');
console.log('PASS: button always usable, device default and explicit user override, visible label and status, persisted toggle, exact final score, blocked storage fallback, hidden/detached cleanup, scroll progress.');
