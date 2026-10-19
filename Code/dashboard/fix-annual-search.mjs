import fs from 'node:fs';
const file='dist/review-ui.js';let s=fs.readFileSync(file,'utf8');s=s.replace('...r.citations.map(c=>c.excerpt)','...r.citations.flatMap(c=>[c.excerpt,c.transcription??\'\'])');fs.writeFileSync(file,s);
