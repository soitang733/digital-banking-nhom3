import fs from 'node:fs';
let html=fs.readFileSync('dist/index.html','utf8');
for(const file of ['styles.css','fonts.css','theme.css','review.css','maturity.css','pdf-source-ui.css','motion.css','colorful.css','expressive.css','cat-party.css','cat-reactions.css']){
  let css=fs.readFileSync('dist/'+file,'utf8').replace(/^\uFEFF/,'').replace(/^@import[^;]+;\s*/,'');
  if(file==='fonts.css')css=css.replace(/url\(\.\/(assets\/fonts\/[^)]+)\)/g,(_,asset)=>'url(data:font/ttf;base64,'+fs.readFileSync('dist/'+asset).toString('base64')+')');
  html=html.replace(`<link rel="stylesheet" href="${file}${file==='cat-party.css'?'?v=16':''}">`,`<style>${css}</style>`);
}
for(const file of ['data.js','research.js','review-ui.js','pdf-sources.js','pdf-source-ui.js','bank-media.js','visuals.js','maturity.js','app.js','motion.js','experience.js','cat-cursor-v3.js','cat-reactions.js']){
  let script=fs.readFileSync('dist/'+file,'utf8');
  if(file==='bank-media.js'){
    const media=JSON.parse(fs.readFileSync('bank-media.json','utf8').replace(/^\uFEFF/,''));
    const inline=asset=>{const ext=asset.split('.').at(-1).toLowerCase(),mime=ext==='svg'?'image/svg+xml':ext==='jpg'||ext==='jpeg'?'image/jpeg':'image/'+ext;return 'data:'+mime+';base64,'+fs.readFileSync('dist/'+asset).toString('base64');};
    for(const bank of Object.values(media)){bank.logo=inline(bank.logo);bank.images.forEach(image=>image.src=inline(image.src));}
    script='window.DBI_MEDIA = '+JSON.stringify(media)+';';
  }
  html=html.replace(`<script src="${file}${file==='motion.js'?'?v=16':''}"></script>`,'<script>'+script.replace(/<\/script/gi,'<\\/script')+'</script>');
}
html=html.replace(/(?:src="|src=\")?(assets\/stickers\/cat-[a-z]+\.webm)/g,(match,asset)=>match.replace(asset,'data:video/webm;base64,'+fs.readFileSync('dist/'+asset).toString('base64')));
fs.writeFileSync('dashboard.html',html);
const manifest=JSON.parse(fs.readFileSync('.openai/hosting.json','utf8'));
manifest.static={directory:'dist'};
fs.writeFileSync('.openai/hosting.json.tmp',JSON.stringify(manifest,null,2)+'\n');
fs.renameSync('.openai/hosting.json.tmp','.openai/hosting.json');
console.log('Created standalone dashboard.html and finalized static manifest.');
