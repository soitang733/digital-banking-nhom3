import fs from 'node:fs';
const file='dist/app.js';let s=fs.readFileSync(file,'utf8');s=s.replace("$('#page-subtitle').textContent=p[4];","$('#page-subtitle').textContent=S.page==='evidence'&&S.evidenceView==='annual'?'Tra cứu 2.100 bản ghi theo năm, nguồn/trang và kết quả đối chiếu.':p[4];");fs.writeFileSync(file,s);
