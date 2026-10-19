import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/cat-reactions.js','utf8');
function environment({fine=true}={}){
 const events=new Map(),timers=new Map(),created=[];let next=0,motion=true,open=null,stamp=0;
 function node(kind='div'){const classes=new Set(),n={kind,dataset:{},style:{setProperty(k,v){this[k]=v;}},children:[],handlers:new Map(),isConnected:false,classList:{add(c){classes.add(c);},remove(c){classes.delete(c);},contains(c){return classes.has(c);}},setAttribute(){},removeAttribute(){},appendChild(child){this.children.push(child);child.parent=this;child.isConnected=true;},remove(){this.isConnected=false;if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);},get childElementCount(){return this.children.length;},getBoundingClientRect(){return this.bounds||{left:0,top:0,width:1000,height:600};},contains(other){return other===this;},addEventListener(k,fn){this.handlers.set(k,fn);},pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();},readyState:2};Object.defineProperty(n,'className',{set(v){v.split(' ').forEach(c=>classes.add(c));},get(){return [...classes].join(' ');}});created.push(n);return n;}
 const sources=Array.from({length:8},(_,i)=>{const n=node('video');n.dataset.catId='cat-'+i;n.cloneNode=()=>{const clone=node('video');clone.dataset.catId=n.dataset.catId;return clone;};return n;});
 const body=node(),dialog=node();dialog.bounds={left:200,top:80,width:550,height:430};
 const document={body,hidden:false,getElementById:()=>({querySelectorAll:()=>sources}),querySelector:()=>open,createElement:node,addEventListener(k,fn){events.set(k,fn);}};
 const window={innerWidth:1000,innerHeight:600,DBI_MOTION:{enabled:()=>motion},matchMedia:()=>({matches:fine}),addEventListener(k,fn){events.set(k,fn);}};
 vm.runInContext(source,vm.createContext({document,window,WeakMap,setTimeout:fn=>{timers.set(++next,fn);return next;},clearTimeout:id=>timers.delete(id)}));
 const target=node();target.bounds={left:930,top:570,width:60,height:28};target.closest=()=>target;
 function fire(type,extra={}){stamp+=200;events.get(type)?.({target,clientX:990,clientY:595,detail:1,timeStamp:stamp,pointerType:'mouse',relatedTarget:null,...extra});}
 const reactions=()=>created.filter(n=>n.classList.contains('cat-reaction')&&n.isConnected);
 return {fire,reactions,target,created,timers,document,window,dialog,sources,body,setMotion:value=>motion=value,setDialog:value=>open=value};
}
const e=environment(),cats=new Set();
for(let i=0;i<8;i++){e.fire('click');const current=e.reactions().at(-1);cats.add(current.dataset.catId);assert(parseFloat(current.style.left)<=898);assert(parseFloat(current.style.top)<=486);assert(e.reactions().length<=2);assert.equal(current.children[0].paused,false);}
assert.equal(cats.size,8,'action reactions must use every sticker');assert.equal(e.timers.size,2);e.window.DBI_CAT_REACTIONS.stop();assert.equal(e.reactions().length,0);assert.equal(e.timers.size,0);assert(!e.target.classList.contains('reaction-target'));
e.fire('change',{detail:0,clientX:0,clientY:0});assert.equal(e.reactions().length,1);
e.window.DBI_CAT_REACTIONS.stop();e.setDialog(e.dialog);e.fire('click',{clientX:550,clientY:250});assert.equal(e.reactions()[0].parent.parent,e.dialog,'modal reaction belongs to modal layer');assert(e.reactions()[0].parent.classList.contains('inside-dialog'));
e.setMotion(false);e.window.DBI_CAT_REACTIONS.refresh();assert.equal(e.reactions().length,0);e.fire('click');assert.equal(e.reactions().length,0);
e.setMotion(true);e.setDialog(null);e.fire('pointerover');assert.equal(e.reactions().length,1);assert(e.reactions()[0].classList.contains('peek'));e.fire('pointerout');assert.equal(e.reactions().length,0);
e.fire('click');e.document.hidden=true;e.fire('visibilitychange');assert.equal(e.reactions().length,0);
const touch=environment({fine:false});touch.fire('pointerover',{pointerType:'touch'});assert.equal(touch.reactions().length,0);touch.fire('click',{pointerType:'touch'});assert.equal(touch.reactions().length,1,'touch click still gets action feedback');
const html=fs.readFileSync('dist/index.html','utf8');assert(!html.includes('GÓC MÈO MEME'));assert(!html.includes('data-cat-choice'));assert(!html.includes('id="cat-auto"'));assert(html.includes('cat-cursor-v3.js'));assert(html.includes('cat-reactions.js'));
console.log('PASS: all eight action stickers, click/filter/hover feedback, touch and keyboard coordinates, viewport clamp, modal layer, bounded media/timers, disable/hidden cleanup, picker removed.');
