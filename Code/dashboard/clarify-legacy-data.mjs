import fs from 'node:fs';
let s=fs.readFileSync('dist/app.js','utf8');
s=s.replace('Xếp hạng sơ bộ từ bằng chứng công bố.</b>','Điểm gộp từ Excel · chưa chấm lại theo quy tắc mới.</b>');
s=s.replace('Dữ liệu gộp 2023–2025.</div></div>','Dữ liệu gộp 2023–2025. Xem Bằng chứng → Đối chiếu theo năm để đọc nguồn bổ sung.</div></div>');
s=s.replace('${esc(e.rubric)}','${esc(e.level>0?(R.rubrics.find(r=>r.code===e.code)?.levels[e.level-1]??e.rubric):e.rubric)}');
fs.writeFileSync('dist/app.js',s);
