import fs from 'node:fs';
let s=fs.readFileSync('dist/review-ui.js','utf8');
s=s.replace("S.reviewState==='scored'?r.level!==null:S.reviewState==='candidate'?r.level===null&&r.candidates.length:r.level===null&&!r.na", "S.reviewState==='scored'?r.level!==null:S.reviewState==='candidate'?r.level===null&&r.candidates.length:S.reviewState==='reviewed'?r.status==='Chưa đủ căn cứ':S.reviewState==='unreviewed'?r.status==='Chưa đối chiếu mức':r.level===null&&!r.na");
s=s.replace("['pending','Chưa đủ căn cứ']","['pending','Tất cả dòng chưa chấm'],['reviewed','Đã đọc · Chưa đủ căn cứ'],['unreviewed','Chưa đối chiếu mức']");
s=s.replace("['missing','Chưa đủ căn cứ']","['missing','Chưa chấm mức']");
s=s.replace('Đối chiếu độc lập theo từng năm.','Đối chiếu riêng theo từng năm.');
s=s.replace("'<b>Đã đối chiếu tài liệu</b><div class=\"excerpt\">'","'<b>'+(r.level===null?'Đã đọc · Chưa chốt mức':'Đã đối chiếu tài liệu')+'</b><div class=\"excerpt\">'");
s=s.replace('Đã trích nội dung từ','Đã lập chỉ mục');
fs.writeFileSync('dist/review-ui.js',s);
