import fs from 'node:fs';
const html=fs.readFileSync('dist/index.html','utf8').replace('href="cat-party.css"','href="cat-party.css?v=15"');fs.writeFileSync('dist/index.html',html);
const pack=fs.readFileSync('package-local.mjs','utf8').replace('href="${file}"','href="${file}${file===\'cat-party.css\'?\'?v=15\':\'\'}"');fs.writeFileSync('package-local.mjs',pack);
