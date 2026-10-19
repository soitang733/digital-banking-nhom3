(()=>{
 'use strict';
 const root=document.documentElement,cursor=document.getElementById('cat-cursor');if(!cursor)return;
 const fine=window.matchMedia?window.matchMedia('(hover: hover) and (pointer: fine)'):{matches:false};
 const videos=[...cursor.querySelectorAll('video')],buttons=[...document.querySelectorAll('[data-cat-choice]')],autoButton=document.getElementById('cat-auto'),caption=document.getElementById('cat-picker-caption');
 const ready=new Set(),boundDecor=new WeakSet(),trail=new Set();
 let decorations=[],frame=0,reactionTimer=0,seen=false,excluded=false,pressed=false,role='idle',x=0,y=0,lastTrail=0,lastX=0,lastY=0,activeIndex=Math.max(0,videos.findIndex(v=>v.dataset.catId==='cat-smile')),selectedIndex=null,lastRotate=0;
 try{const saved=localStorage.getItem('bank-dashboard-cat');const index=videos.findIndex(v=>v.dataset.catId===saved);if(index>=0){selectedIndex=index;activeIndex=index;}}catch{}
 const enabled=()=>!!window.DBI_MOTION?.enabled()&&!document.hidden;
 const nativeTarget=target=>!!target?.closest?.('input,textarea,select,dialog,[contenteditable="true"]');
 const interactive=target=>!!target?.closest?.('button,a,[role="button"],[data-id],[data-annual-id]');
 function pause(video){video.pause();}
 function play(video,onFailure){video.muted=true;const result=video.play();if(result?.catch)result.catch(error=>{if(error?.name==='AbortError')return;if(onFailure)onFailure();});}
 function eraseTrail(){for(const item of trail){clearTimeout(item.timer);item.el.remove();}trail.clear();}
 function hide(){root.dataset.catCursor='off';cursor.hidden=true;videos.forEach(pause);}
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;clearTimeout(reactionTimer);reactionTimer=0;pressed=false;seen=false;hide();eraseTrail();decorations.forEach(video=>{pause(video);video.dataset.previewActive='false';});}
 function updatePicker(){
  buttons.forEach(button=>{const selected=selectedIndex!==null&&button.dataset.catChoice===videos[selectedIndex]?.dataset.catId;button.setAttribute('aria-pressed',String(selected));button.classList.toggle('selected',selected);});
  if(autoButton)autoButton.setAttribute('aria-pressed',String(selectedIndex===null));
  if(caption)caption.textContent=selectedIndex===null?'Tự đổi 8 mèo · Bấm để ghim một mèo':'Con trỏ: '+(videos[selectedIndex].dataset.catLabel||'mèo đã chọn');
 }
 function show(){
  const wanted=videos[selectedIndex??activeIndex],fallback=videos.find(v=>ready.has(v)),selected=ready.has(wanted)?wanted:fallback;
  if(!enabled()||!fine.matches||!seen||excluded||!ready.has(selected)){hide();return;}
  cursor.style.transform='translate3d('+x+'px,'+y+'px,0)';cursor.dataset.state=role;cursor.dataset.catId=selected.dataset.catId;cursor.hidden=false;root.dataset.catCursor='on';
  videos.forEach(video=>{video.hidden=video!==selected;if(video!==selected)pause(video);});play(selected,hide);
 }
 function queue(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;show();});}
 function paw(time){if(time-lastTrail<150||Math.hypot(x-lastX,y-lastY)<28)return;lastTrail=time;lastX=x;lastY=y;if(trail.size>=4){const first=trail.values().next().value;clearTimeout(first.timer);first.el.remove();trail.delete(first);}const el=document.createElement('span');el.className='cat-paw-trail';el.textContent='🐾';el.setAttribute('aria-hidden','true');el.style.left=(x-8)+'px';el.style.top=(y-8)+'px';document.body.appendChild(el);const item={el,timer:0};trail.add(item);item.timer=setTimeout(()=>{el.remove();trail.delete(item);},650);}
 function position(event){x=Math.max(0,Math.min(window.innerWidth,event.clientX));y=Math.max(0,Math.min(window.innerHeight,event.clientY));excluded=nativeTarget(event.target);seen=true;}
 function advance(){activeIndex=(activeIndex+1)%videos.length;}
 function onMove(event){
  if(event.pointerType==='touch'||!fine.matches){seen=false;hide();return;}position(event);
  if(!pressed){role=interactive(event.target)?'hover':'idle';const time=event.timeStamp||0;if(enabled()&&!excluded&&selectedIndex===null&&time-lastRotate>=3200){advance();lastRotate=time;}}
  if(enabled()&&!excluded&&root.dataset.catCursor==='on')paw(event.timeStamp||0);queue();
 }
 function onDown(event){if(event.pointerType==='touch'||!fine.matches)return;position(event);if(!enabled()||excluded)return;clearTimeout(reactionTimer);pressed=true;role='pop';if(selectedIndex===null)advance();show();}
 function onUp(event){if(event.pointerType==='touch'||!fine.matches)return;position(event);pressed=false;const next=interactive(event.target)?'hover':'idle';clearTimeout(reactionTimer);reactionTimer=setTimeout(()=>{reactionTimer=0;role=next;show();},320);}
 function decorate(video){
  const preview=video.hasAttribute('data-cat-preview');video.dataset.stickerShown=String(video.readyState>=2&&(preview||enabled()));
  if(enabled()&&video.readyState>=2&&(!preview||video.dataset.previewActive==='true'))play(video,()=>{video.dataset.stickerShown='false';});else pause(video);
 }
 function refresh(){
  decorations.forEach(pause);decorations=[...document.querySelectorAll('video[data-cat-decoration],video[data-cat-preview]')];
  for(const video of decorations){if(!boundDecor.has(video)){boundDecor.add(video);video.addEventListener('loadeddata',()=>decorate(video));video.addEventListener('error',()=>{video.dataset.stickerShown='false';});}decorate(video);}
  if(!enabled()||!fine.matches){hide();eraseTrail();if(frame)cancelAnimationFrame(frame);frame=0;clearTimeout(reactionTimer);reactionTimer=0;pressed=false;}else show();updatePicker();
 }
 buttons.forEach(button=>{
  const video=button.querySelector('video');
  const preview=value=>{if(video){video.dataset.previewActive=String(value);decorate(video);}};
  button.addEventListener('pointerenter',()=>preview(true));button.addEventListener('pointerleave',()=>preview(false));button.addEventListener('focus',()=>preview(true));button.addEventListener('blur',()=>preview(false));
  button.onclick=()=>{const index=videos.findIndex(v=>v.dataset.catId===button.dataset.catChoice);if(index<0)return;selectedIndex=index;activeIndex=index;clearTimeout(reactionTimer);reactionTimer=0;pressed=false;role='hover';try{localStorage.setItem('bank-dashboard-cat',videos[index].dataset.catId);}catch{}updatePicker();show();};
 });
 if(autoButton)autoButton.onclick=()=>{selectedIndex=null;lastRotate=0;try{localStorage.removeItem('bank-dashboard-cat');}catch{}updatePicker();show();};
 for(const video of videos){video.muted=true;if(video.readyState>=2)ready.add(video);video.addEventListener('loadeddata',()=>{ready.add(video);show();});video.addEventListener('error',()=>{ready.delete(video);show();});}
 window.addEventListener('pointermove',onMove,{passive:true});window.addEventListener('pointerdown',onDown,{passive:true});window.addEventListener('pointerup',onUp,{passive:true});window.addEventListener('pointercancel',stop);window.addEventListener('blur',stop);
 document.addEventListener('pointerleave',stop);document.addEventListener('keydown',()=>{seen=false;hide();eraseTrail();});
 if(fine.addEventListener)fine.addEventListener('change',refresh);
 window.DBI_CAT_CURSOR={refresh,stop};refresh();
})();
