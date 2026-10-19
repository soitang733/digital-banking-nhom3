import fs from 'node:fs';
let html=fs.readFileSync('dist/index.html','utf8');
html=html.replace('<meta name="theme-color" content="#1B1233">','<meta name="theme-color" content="#080B18">');
html=html.replace('<link rel="stylesheet" href="motion.css">','<link rel="stylesheet" href="motion.css">\n<link rel="stylesheet" href="premium.css">');
html=html.replace('<div class="ambient-scene" aria-hidden="true"><span class="ambient-orb"></span><span class="ambient-orb"></span><span class="ambient-orb"></span></div>','<div class="ambient-scene" aria-hidden="true"><div class="aurora-field"><span class="ambient-orb"></span><span class="ambient-orb"></span><span class="ambient-orb"></span><span class="ambient-orb"></span></div><div class="ambient-grid"></div><div class="ambient-stars">'+Array.from({length:12},(_,i)=>'<i style="--x:'+(8+(i*37)%85)+'%;--y:'+(5+(i*23)%88)+'%;--delay:'+(-i*1.7)+'s;--duration:'+(12+i%5*3)+'s"></i>').join('')+'</div><div class="ambient-vignette"></div></div>');
html=html.replace('<span>Hiệu ứng</span>','<span id="motion-label">Hiệu ứng bật</span>');
html=html.replace('<div class="toast" id="toast" role="status"></div>','<div class="toast" id="toast" role="status"></div>\n<div id="motion-feedback" class="sr-only" role="status" aria-live="polite"></div>');
html=html.replace('<script src="motion.js"></script>','<script src="motion.js?v=10"></script>');
fs.writeFileSync('dist/index.html',html);
let app=fs.readFileSync('dist/app.js','utf8');
app=app.replace('return bankMediaTabs(lead)+guide+hero+kpis+', 'return bankMediaTabs(lead)+hero+guide+kpis+');
fs.writeFileSync('dist/app.js',app);
let motion=fs.readFileSync('dist/motion.js','utf8');
motion=motion.replace("function enabled(){return !reduced.matches&&preference!==false;}","function enabled(){return preference===null?!reduced.matches:preference;}");
const start=motion.indexOf(' function sync(){'),end=motion.indexOf(' function clearTilt()',start);
if(start<0||end<0)throw Error('Motion sync not found');
motion=motion.slice(0,start)+` function sync(){
  root.dataset.motion=enabled()?'on':'off';root.dataset.motionSource=preference===null?'device':'user';
  const button=document.getElementById('motion-toggle');
  if(button){button.disabled=false;button.setAttribute('aria-pressed',String(enabled()));button.setAttribute('aria-label',enabled()?'Tắt hiệu ứng chuyển động':'Bật hiệu ứng chuyển động');button.title=(enabled()?'Đang bật · Nhấn để tắt hiệu ứng':'Đang tắt · Nhấn để bật hiệu ứng')+(reduced.matches&&preference===null?' (theo thiết lập giảm chuyển động của thiết bị)':'');}
  const label=document.getElementById('motion-label');if(label)label.textContent=enabled()?'Hiệu ứng bật':'Hiệu ứng tắt';
  if(!enabled()){settleCounters();clearTilt();}
 }
`+motion.slice(end);
motion=motion.replace("catch{}refresh();};","catch{}refresh();const feedback=document.getElementById('motion-feedback');if(feedback)feedback.textContent=enabled()?'Đã bật hiệu ứng chuyển động.':'Đã tắt hiệu ứng chuyển động.';};");
// Stop background animation while the tab is hidden, without changing the saved preference.
motion=motion.replace("document.addEventListener('visibilitychange',()=>{if(document.hidden)","document.addEventListener('visibilitychange',()=>{root.dataset.tabHidden=String(document.hidden);if(document.hidden)");
fs.writeFileSync('dist/motion.js',motion);
let css=fs.readFileSync('dist/motion.css','utf8');
const reduceStart=css.indexOf('@media(prefers-reduced-motion:reduce)'),printStart=css.indexOf('@media(hover:none)',reduceStart);
if(reduceStart<0||printStart<0)throw Error('Reduced motion CSS not found');
css=css.slice(0,reduceStart)+css.slice(printStart);
fs.writeFileSync('dist/motion.css',css);
let pack=fs.readFileSync('package-local.mjs','utf8');
pack=pack.replace("'review.css','motion.css'","'review.css','motion.css','premium.css'");
pack=pack.replace('`<script src="${file}"></script>`','`<script src="${file}${file===\'motion.js\'?\'?v=10\':\'\'}"></script>`');
fs.writeFileSync('package-local.mjs',pack);
