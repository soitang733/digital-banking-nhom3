(()=>{
 'use strict';
 const root=document.documentElement,cursor=document.getElementById('cat-cursor');if(!cursor)return;
 const fine=window.matchMedia?window.matchMedia('(hover: hover) and (pointer: fine)'):{matches:false};
 const videos=[...cursor.querySelectorAll('video')],ready=new Set(),boundDecor=new WeakSet(),trail=new Set();
 let decorations=[],frame=0,reactionTimer=0,seen=false,excluded=false,pressed=false,role='idle',x=0,y=0,lastTrail=0,lastX=0,lastY=0;
 const enabled=()=>!!window.DBI_MOTION?.enabled()&&!document.hidden;
 const nativeTarget=target=>!!target?.closest?.('input,textarea,select,dialog,[contenteditable="true"]');
 const interactive=target=>!!target?.closest?.('button,a,[role="button"],[data-id],[data-annual-id]');
 function pause(video){video.pause();}
 function play(video,onFailure){video.muted=true;const result=video.play();if(result?.catch)result.catch(error=>{if(error?.name==='AbortError')return;if(onFailure)onFailure();});}
 function eraseTrail(){for(const item of trail){clearTimeout(item.timer);item.el.remove();}trail.clear();}
 function hide(){root.dataset.catCursor='off';cursor.hidden=true;videos.forEach(pause);}
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;clearTimeout(reactionTimer);reactionTimer=0;pressed=false;seen=false;hide();eraseTrail();decorations.forEach(video=>{pause(video);video.dataset.stickerShown='false';});}
 function show(){
  const wanted=videos.find(v=>v.dataset.catState===role),fallback=videos.find(v=>v.dataset.catState==='idle'),selected=ready.has(wanted)?wanted:fallback;
  if(!enabled()||!fine.matches||!seen||excluded||!ready.has(selected)){hide();return;}
  cursor.style.transform='translate3d('+x+'px,'+y+'px,0)';cursor.dataset.state=selected.dataset.catState;cursor.hidden=false;root.dataset.catCursor='on';
  videos.forEach(video=>{video.hidden=video!==selected;if(video!==selected)pause(video);});
  play(selected,hide);
 }
 function queue(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;show();});}
 function paw(time){if(time-lastTrail<150||Math.hypot(x-lastX,y-lastY)<28)return;lastTrail=time;lastX=x;lastY=y;if(trail.size>=4){const first=trail.values().next().value;clearTimeout(first.timer);first.el.remove();trail.delete(first);}const el=document.createElement('span');el.className='cat-paw-trail';el.textContent='🐾';el.setAttribute('aria-hidden','true');el.style.left=(x-8)+'px';el.style.top=(y-8)+'px';document.body.appendChild(el);const item={el,timer:0};trail.add(item);item.timer=setTimeout(()=>{el.remove();trail.delete(item);},650);}
 function position(event){x=Math.max(0,Math.min(window.innerWidth,event.clientX));y=Math.max(0,Math.min(window.innerHeight,event.clientY));excluded=nativeTarget(event.target);seen=true;}
 function onMove(event){if(event.pointerType==='touch'||!fine.matches){seen=false;hide();return;}position(event);if(!pressed)role=interactive(event.target)?'hover':'idle';if(enabled()&&!excluded&&root.dataset.catCursor==='on')paw(event.timeStamp||0);queue();}
 function onDown(event){if(event.pointerType==='touch'||!fine.matches)return;position(event);if(!enabled()||excluded)return;clearTimeout(reactionTimer);pressed=true;role='pop';show();}
 function onUp(event){if(event.pointerType==='touch'||!fine.matches)return;position(event);pressed=false;const next=interactive(event.target)?'hover':'idle';clearTimeout(reactionTimer);reactionTimer=setTimeout(()=>{reactionTimer=0;role=next;show();},320);}
 function decorate(video){
  if(enabled()&&video.readyState>=2){video.dataset.stickerShown='true';play(video,()=>{video.dataset.stickerShown='false';});}
  else{video.dataset.stickerShown='false';pause(video);}
 }
 function refresh(){
  decorations.forEach(pause);decorations=[...document.querySelectorAll('video[data-cat-decoration]')];
  for(const video of decorations){if(!boundDecor.has(video)){boundDecor.add(video);video.addEventListener('loadeddata',()=>decorate(video));video.addEventListener('error',()=>{video.dataset.stickerShown='false';});}decorate(video);}
  if(!enabled()||!fine.matches){hide();eraseTrail();if(frame)cancelAnimationFrame(frame);frame=0;clearTimeout(reactionTimer);reactionTimer=0;pressed=false;}else show();
 }
 for(const video of videos){video.muted=true;if(video.readyState>=2)ready.add(video);video.addEventListener('loadeddata',()=>{ready.add(video);show();});video.addEventListener('error',()=>{ready.delete(video);show();});}
 window.addEventListener('pointermove',onMove,{passive:true});window.addEventListener('pointerdown',onDown,{passive:true});window.addEventListener('pointerup',onUp,{passive:true});window.addEventListener('pointercancel',stop);window.addEventListener('blur',stop);
 document.addEventListener('pointerleave',stop);document.addEventListener('keydown',()=>{seen=false;hide();eraseTrail();});
 if(fine.addEventListener)fine.addEventListener('change',refresh);
 window.DBI_CAT_CURSOR={refresh,stop};refresh();
})();
