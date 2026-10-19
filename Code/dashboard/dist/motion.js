(()=>{
 'use strict';
 const root=document.documentElement;
 const reduced=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
 const finePointer=window.matchMedia?window.matchMedia('(hover: hover) and (pointer: fine)'):{matches:false};
 let preference=null;try{const saved=localStorage.getItem('bank-dashboard-motion');if(saved==='off')preference=false;if(saved==='on')preference=true;}catch{}
 let scope=null,observer=null,headingFrame=0,scrollFrame=0,tiltFrame=0;
 const counters=new Map();let activeTilt=null;
 function enabled(){return preference===null?!reduced.matches:preference;}
 function number(value,decimals){return value.toLocaleString('vi-VN',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});}
 function settleCounters(){for(const [element,item] of counters){cancelAnimationFrame(item.frame);element.textContent=number(item.target,item.decimals);}counters.clear();}
 function count(element){const target=Number(element.dataset.countTo),decimals=Number(element.dataset.countDecimals??0);if(!Number.isFinite(target)||!Number.isInteger(decimals)||decimals<0||decimals>3)return;
  if(!enabled()||document.hidden){element.textContent=number(target,decimals);return;}
  const item={target,decimals,frame:0,start:null};counters.set(element,item);
  const tick=time=>{if(!element.isConnected||!enabled()||document.hidden){element.textContent=number(target,decimals);counters.delete(element);return;}if(item.start===null)item.start=time;const progress=Math.min(1,(time-item.start)/800),eased=1-Math.pow(1-progress,3);element.textContent=number(target*eased,decimals);if(progress<1)item.frame=requestAnimationFrame(tick);else{element.textContent=number(target,decimals);counters.delete(element);}};
  item.frame=requestAnimationFrame(tick);
 }
 function sync(){
  root.dataset.motion=enabled()?'on':'off';root.dataset.motionSource=preference===null?'device':'user';
  const button=document.getElementById('motion-toggle');
  if(button){button.disabled=false;button.setAttribute('aria-pressed',String(enabled()));button.setAttribute('aria-label',enabled()?'Tắt hiệu ứng chuyển động':'Bật hiệu ứng chuyển động');button.title=(enabled()?'Đang bật · Nhấn để tắt hiệu ứng':'Đang tắt · Nhấn để bật hiệu ứng')+(reduced.matches&&preference===null?' (theo thiết lập giảm chuyển động của thiết bị)':'');}
  const label=document.getElementById('motion-label');if(label)label.textContent=enabled()?'Hiệu ứng bật':'Hiệu ứng tắt';
  if(!enabled()){settleCounters();clearTilt();}
 }
 function clearTilt(){if(tiltFrame)cancelAnimationFrame(tiltFrame);tiltFrame=0;if(activeTilt){activeTilt.style.setProperty('--tilt-x','0deg');activeTilt.style.setProperty('--tilt-y','0deg');}activeTilt=null;}
 function refresh(){
  settleCounters();clearTilt();if(scope)scope.abort();scope=new AbortController();if(observer)observer.disconnect();observer=null;if(headingFrame)cancelAnimationFrame(headingFrame);sync();
  const content=document.getElementById('content');if(!content)return;
  const entries=[...content.querySelectorAll('.score-hero,.insight-card,.kpi,.card,.bank-media-tabs,.detail-hero,.guide-banner')];
  if(enabled()){
   entries.forEach((element,index)=>element.style.setProperty('--entry-delay',Math.min(index,5)*45+'ms'));
   if(window.IntersectionObserver){observer=new IntersectionObserver(items=>{for(const item of items)if(item.isIntersecting){item.target.classList.add('fx-enter');observer.unobserve(item.target);}},{threshold:.07});entries.forEach(element=>observer.observe(element));}
   else entries.forEach(element=>element.classList.add('fx-enter'));
   const heading=document.getElementById('page-title');if(heading){heading.classList.remove('fx-heading');headingFrame=requestAnimationFrame(()=>{heading.classList.add('fx-heading');headingFrame=0;});}
  }
  content.querySelectorAll('[data-count-to]').forEach(count);
  scheduleProgress();if(window.DBI_EXPERIENCE)window.DBI_EXPERIENCE.refresh();window.DBI_CAT_CURSOR?.refresh();window.DBI_CAT_REACTIONS?.refresh();
 }
 function progress(){scrollFrame=0;const bar=document.getElementById('reading-progress');if(!bar)return;const total=Math.max(0,document.documentElement.scrollHeight-window.innerHeight),ratio=total?Math.min(1,Math.max(0,window.scrollY/total)):0;bar.style.transform='scaleX('+ratio+')';}
 function scheduleProgress(){if(!scrollFrame)scrollFrame=requestAnimationFrame(progress);}
 document.addEventListener('click',event=>{if(!enabled())return;const button=event.target.closest?.('button:not(:disabled),a.button');if(!button)return;const rect=button.getBoundingClientRect();const size=Math.max(rect.width,rect.height)*2,ripple=document.createElement('span');ripple.className='fx-ripple';ripple.setAttribute('aria-hidden','true');const x=event.detail===0?rect.width/2:event.clientX-rect.left,y=event.detail===0?rect.height/2:event.clientY-rect.top;ripple.style.cssText='width:'+size+'px;height:'+size+'px;left:'+(x-size/2)+'px;top:'+(y-size/2)+'px;';button.classList.add('fx-button');button.appendChild(ripple);ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});setTimeout(()=>ripple.remove(),700);});
 document.addEventListener('visibilitychange',()=>{root.dataset.tabHidden=String(document.hidden);if(document.hidden){settleCounters();clearTilt();window.DBI_EXPERIENCE?.stop();window.DBI_CAT_CURSOR?.stop();window.DBI_CAT_REACTIONS?.stop();}else{scheduleProgress();window.DBI_EXPERIENCE?.refresh();window.DBI_CAT_CURSOR?.refresh();}});
 window.addEventListener('scroll',scheduleProgress,{passive:true});window.addEventListener('resize',scheduleProgress,{passive:true});
 const button=document.getElementById('motion-toggle');if(button)button.onclick=()=>{preference=!enabled();try{localStorage.setItem('bank-dashboard-motion',preference?'on':'off');}catch{}refresh();const feedback=document.getElementById('motion-feedback');if(feedback)feedback.textContent=enabled()?'Đã bật hiệu ứng chuyển động.':'Đã tắt hiệu ứng chuyển động.';};
 if(reduced.addEventListener)reduced.addEventListener('change',refresh);
 window.DBI_MOTION={refresh,enabled};refresh();scheduleProgress();
})();
