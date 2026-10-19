import fs from 'node:fs';
const file='pipeline/data/review-decisions.json',rows=JSON.parse(fs.readFileSync(file,'utf8'));
const r=rows.find(r=>r.bank==='SaigonBank'&&r.year===2023&&r.code==='4.1.2');
if(r){r.level=null;r.reason='Đã đọc nguồn về giám sát rủi ro chi nhánh và Basel II, nhưng đoạn này chưa xác định trực tiếp việc triển khai quản lý rủi ro hoạt động theo mô tả tiêu chí 4.1.2. Không dùng rủi ro tín dụng/thị trường thay cho rủi ro hoạt động; giữ chưa đủ căn cứ chấm.';r.finalReview='Codex – rà soát chặt phạm vi tiêu chí';}
fs.writeFileSync(file,JSON.stringify(rows,null,2));
