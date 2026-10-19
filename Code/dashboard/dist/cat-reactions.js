(()=>{
 'use strict';
 const cursor=document.getElementById('cat-cursor');if(!cursor)return;
 const sources=[...cursor.querySelectorAll('video')],active=new Set(),hosts=new WeakMap(),rects=new WeakMap();
 const fine=window.matchMedia?window.matchMedia('(hover: hover) and (pointer: fine)'):{matches:false};
 const actions='button:not(:disabled),a,[data-id],[data-annual-id],[role="button"]';
 let index=0,lastHover=0,lastAction=-1000;
 const enabled=()=>!!window.DBI_MOTION?.enabled()&&!document.hidden;
 function dispose(item){clearTimeout(item.timer);item.video.pause();item.el.remove();active.delete(item);if(![...active].some(other=>other.target===item.target))item.target?.classList?.remove('reaction-target');if(item.host.childElementCount===0){item.host.remove();hosts.delete(item.parent);}}
 function stop(){for(const item of [...active])dispose(item);}
 function rect(target){const current=target.getBoundingClientRect();return current.width&&current.height?current:rects.get(target)||{left:window.innerWidth*.6,top:window.innerHeight*.3,width:0,height:0};}
 function remember(event){const target=event.target?.closest?.(actions+',select');if(target){const r=target.getBoundingClientRect();if(r.width&&r.height)rects.set(target,r);}}
 function react(target,event,kind='click'){
  if(!enabled()||!target||!sources.length)return;
  const now=event.timeStamp||0;if(kind!=='hover'&&now-lastAction<100)return;if(kind!=='hover')lastAction=now;
  if(active.size>=2)dispose(active.values().next().value);
  const dialog=document.querySelector('dialog[open]'),parent=dialog||document.body;
  let host=hosts.get(parent);if(!host||!host.isConnected){host=document.createElement('div');host.className='cat-reaction-layer';host.setAttribute('aria-hidden','true');if(dialog)host.classList.add('inside-dialog');parent.appendChild(host);hosts.set(parent,host);}
  const box=host.getBoundingClientRect(),r=rect(target),px=kind==='click'&&event.detail!==0&&event.clientX?event.clientX:r.left+r.width/2,py=kind==='click'&&event.detail!==0&&event.clientY?event.clientY:r.top+r.height/2;
  const width=box.width||window.innerWidth,height=box.height||window.innerHeight;
  const left=Math.max(6,Math.min(width-102,px-box.left+14)),top=Math.max(6,Math.min(height-114,py-box.top-104));
  const el=document.createElement('div');el.className='cat-reaction '+(kind==='hover'?'peek':'pop');el.style.left=left+'px';el.style.top=top+'px';el.dataset.catId=sources[index].dataset.catId;index=(index+1)%sources.length;
  const video=sources[(index+sources.length-1)%sources.length].cloneNode(true);video.hidden=false;video.muted=true;video.loop=true;video.removeAttribute('hidden');el.appendChild(video);
  if(kind!=='hover'){const word=document.createElement('span');word.className='cat-reaction-word';word.textContent='meo!';el.appendChild(word);for(let i=0;i<6;i++){const bit=document.createElement('i'),angle=i*Math.PI/3;bit.style.setProperty('--dx',(Math.cos(angle)*44)+'px');bit.style.setProperty('--dy',(Math.sin(angle)*40)+'px');bit.style.setProperty('--bit-color',['#6C3BFF','#FF4F9A','#22D3EE','#B8F13C','#FFD43B','#C5A8FF'][i]);el.appendChild(bit);}}
  host.appendChild(el);target.classList?.add('reaction-target');
  const item={el,video,target,host,parent,timer:0};active.add(item);
  const play=()=>{if(!active.has(item)||!enabled())return;el.classList.add('is-ready');const promise=video.play();if(promise?.catch)promise.catch(error=>{if(error?.name!=='AbortError'&&active.has(item))dispose(item);});};
  video.addEventListener('loadeddata',play,{once:true});video.addEventListener('error',()=>{if(active.has(item))dispose(item);},{once:true});if(video.readyState>=2)play();
  item.timer=setTimeout(()=>{if(active.has(item))dispose(item);},kind==='hover'?850:1250);
 }
 document.addEventListener('pointerdown',remember,{capture:true,passive:true});document.addEventListener('focusin',remember);
 document.addEventListener('click',event=>{const target=event.target?.closest?.(actions);if(target)react(target,event);});
 document.addEventListener('change',event=>{const target=event.target?.closest?.('select');if(target)react(target,event,'change');});
 document.addEventListener('pointerover',event=>{if(!enabled()||!fine.matches||event.pointerType==='touch')return;const target=event.target?.closest?.('.bank-media-tab,.kpi,.rank-link,.insight-actions button');if(!target||target.contains(event.relatedTarget))return;const now=event.timeStamp||0;if(now-lastHover<500)return;lastHover=now;react(target,event,'hover');});
 document.addEventListener('pointerout',event=>{const target=event.target?.closest?.('.bank-media-tab,.kpi,.rank-link,.insight-actions button');if(target&&!target.contains(event.relatedTarget))for(const item of [...active])if(item.target===target&&item.el.classList.contains('peek'))dispose(item);});
 window.addEventListener('blur',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.DBI_CAT_REACTIONS={stop,refresh(){if(!enabled())stop();}};
})();
