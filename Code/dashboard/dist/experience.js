(()=>{
 'use strict';
 const root=document.documentElement;
 const pointer=window.matchMedia?window.matchMedia('(hover: hover) and (pointer: fine)'):{matches:false};
 const animationSet=new Set(),photoAnimations=new Map();
 let scope=null,active=null,frame=0,last=null,steps=0;
 const axis=value=>({value,target:value,velocity:0});
 const background={x:axis((window.innerWidth||1200)*.75),y:axis((window.innerHeight||750)*.25)};
 const enabled=()=>!!window.DBI_MOTION?.enabled()&&!document.hidden;
 function advance(item,dt){const force=(item.target-item.value)*180-item.velocity*26;item.velocity+=force*dt;item.value+=item.velocity*dt;if(Math.abs(item.target-item.value)<.05&&Math.abs(item.velocity)<.08){item.value=item.target;item.velocity=0;return false;}return true;}
 function resetElement(item){if(!item)return;item.el.style.setProperty('--tilt-x','0deg');item.el.style.setProperty('--tilt-y','0deg');item.el.style.setProperty('--card-glow-x','50%');item.el.style.setProperty('--card-glow-y','50%');item.el.classList.remove('is-reactive');}
 function apply(){
  const width=window.innerWidth||1200,height=window.innerHeight||750;
  root.style.setProperty('--light-x',background.x.value.toFixed(2)+'px');root.style.setProperty('--light-y',background.y.value.toFixed(2)+'px');
  root.style.setProperty('--field-x',((background.x.value/width-.5)*22).toFixed(2)+'px');root.style.setProperty('--field-y',((background.y.value/height-.5)*17).toFixed(2)+'px');
  if(active){active.el.style.setProperty('--tilt-x',active.x.value.toFixed(3)+'deg');active.el.style.setProperty('--tilt-y',active.y.value.toFixed(3)+'deg');}
 }
 function tick(time){frame=0;if(!enabled()||!pointer.matches){stop();return;}const dt=last===null?1/60:Math.max(1/120,Math.min(1/30,(time-last)/1000));last=time;steps++;
  let moving=advance(background.x,dt);moving=advance(background.y,dt)||moving;if(active){moving=advance(active.x,dt)||moving;moving=advance(active.y,dt)||moving;}apply();
  if(moving&&steps<180)frame=requestAnimationFrame(tick);else{background.x.value=background.x.target;background.y.value=background.y.target;if(active){active.x.value=active.x.target;active.y.value=active.y.target;}apply();last=null;}
 }
 function start(){if(!frame&&enabled()&&pointer.matches){steps=0;last=null;frame=requestAnimationFrame(tick);}}
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=null;resetElement(active);active=null;for(const animation of animationSet)animation.cancel();animationSet.clear();photoAnimations.clear();const width=window.innerWidth||1200,height=window.innerHeight||750;background.x=axis(width*.75);background.y=axis(height*.25);apply();}
 function onPointer(event){if(!enabled()||!pointer.matches||event.pointerType==='touch')return;const width=window.innerWidth||1200,height=window.innerHeight||750;background.x.target=Math.max(0,Math.min(width,event.clientX));background.y.target=Math.max(0,Math.min(height,event.clientY));start();}
 function refresh(){
  if(scope)scope.abort();scope=new AbortController();stop();
  const content=document.getElementById('content');if(!content)return;
  content.querySelectorAll('.radar polygon[fill-opacity]').forEach(polygon=>polygon.setAttribute('pathLength','1'));
  const elements=[...content.querySelectorAll('.bank-visual,.overview-kpis .kpi,.bank-media-tab')];
  elements.forEach(el=>{if(!el.classList.contains('bank-visual'))el.classList.add('experience-card');});
  if(!enabled()||!pointer.matches)return;
  elements.forEach(el=>{
   const select=()=>{if(active?.el===el)return;resetElement(active);active={el,x:axis(0),y:axis(0)};el.classList.add('is-reactive');};
   el.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&enabled())select();},{signal:scope.signal});
   el.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||!enabled())return;select();const rect=el.getBoundingClientRect();if(!rect.width||!rect.height)return;const x=Math.max(-1,Math.min(1,((event.clientX-rect.left)/rect.width-.5)*2)),y=Math.max(-1,Math.min(1,((event.clientY-rect.top)/rect.height-.5)*2)),limit=el.classList.contains('bank-visual')?4:1.6;active.x.target=-y*limit;active.y.target=x*limit;el.style.setProperty('--card-glow-x',((x+1)*50).toFixed(1)+'%');el.style.setProperty('--card-glow-y',((y+1)*50).toFixed(1)+'%');start();},{signal:scope.signal});
   el.addEventListener('pointerleave',()=>{if(active?.el===el){resetElement(active);active=null;}},{signal:scope.signal});
  });
 }
 function photoEntrance(element){
  const previous=photoAnimations.get(element);if(previous){previous.cancel();animationSet.delete(previous);photoAnimations.delete(element);}element.classList.remove('photo-change');
  if(!enabled())return;
  if(!element.animate){element.classList.add('photo-change');return;}
  const animation=element.animate([{opacity:.15,translate:'14px 0',scale:'1.035'},{opacity:1,translate:'0 0',scale:'1'}],{duration:350,easing:'cubic-bezier(.2,.8,.2,1)',fill:'none'});
  animationSet.add(animation);photoAnimations.set(element,animation);
  const cleanup=()=>{animationSet.delete(animation);if(photoAnimations.get(element)===animation)photoAnimations.delete(element);};animation.finished.then(cleanup,cleanup);
 }
 window.addEventListener('pointermove',onPointer,{passive:true});window.addEventListener('blur',stop);window.addEventListener('resize',stop,{passive:true});
 if(pointer.addEventListener)pointer.addEventListener('change',refresh);
 window.DBI_EXPERIENCE={refresh,stop,photoEntrance};refresh();
})();
