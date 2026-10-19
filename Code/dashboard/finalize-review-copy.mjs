import fs from 'node:fs';
const file='dist/review-ui.js';let s=fs.readFileSync(file,'utf8');s=s.replace("esc(c.method)+(c.transcription?' · Bản chép từ ảnh đã kiểm tra':'')", "esc(c.method)+(c.transcription?' · Bản chép từ ảnh đã kiểm tra':c.method==='OCR'&&!c.imageChecked?' · Chưa kiểm tra ảnh OCR':'')");
s=s.replace("'<h3>Dẫn chứng đã đối chiếu</h3>'+r.citations", "'<h3>'+(r.level===null?'Nguồn đã đọc · chưa đủ chốt mức':'Dẫn chứng đã đối chiếu')+'</h3>'+r.citations");
s=s.replace("Đã tìm vị trí liên quan cho '+R.stats.withCandidates", "Đã đọc đối chiếu '+R.stats.reviewed+' bản ghi năm. Đã tìm vị trí liên quan cho '+R.stats.withCandidates");
fs.writeFileSync(file,s);
