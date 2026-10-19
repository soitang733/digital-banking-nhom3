import fs from 'node:fs';
import vm from 'node:vm';
const r=JSON.parse(fs.readFileSync('pipeline/data/research.json','utf8')),ctx={window:{}};
vm.runInNewContext(fs.readFileSync('dashboard/dist/data.js','utf8'),ctx);const D=ctx.window.DBI_DATA;
const out='audit/research-2026-10-13';fs.mkdirSync(out,{recursive:true});
function csv(name,rows){fs.writeFileSync(out+'/'+name,'\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n'));}
csv('Doi-chieu-theo-nam-2100.csv',[['Ngân hàng','Năm hoạt động','Mã chuẩn','Mã Excel','Tiêu chí','Mức theo năm','Quy đổi (%)','Trạng thái','Lý do','Tài liệu','URL','Trang PDF','Trang in','Trích đoạn đã đối chiếu','Người đối chiếu','Ngày đối chiếu','Vị trí gợi ý chưa xác nhận'],...r.records.map(x=>[x.bank,x.year,x.code,x.sourceCode,x.name,x.level,x.level===null?'':r.policy.conversion[x.level],x.status,x.reason,x.citations.map(c=>c.reportId).join(' | '),x.citations.map(c=>c.url).join(' | '),x.citations.map(c=>c.page).join(' | '),x.citations.map(c=>c.printedPage).join(' | '),x.citations.map(c=>c.transcription??c.excerpt).join(' | '),x.reviewer,x.reviewDate,x.candidates.map(c=>c.reportId+' trang PDF '+c.page).join(' | ')])]);
csv('Ra-soat-diem-gop-700.csv',[['Ngân hàng','Mã chuẩn','Tiêu chí','Mức gộp cũ','Bằng chứng cũ','URL cũ','Trạng thái','Năm đã đối chiếu','Mức theo năm','Nguồn bổ sung','Trang PDF','Trích đoạn','Lưu ý'],...r.pooled.map(x=>{const old=D.evidence.find(e=>e.bank===x.bank&&e.code===x.code);return [x.bank,x.code,old.name,old.level,old.text,old.urls.join(' | '),x.status,x.verifiedYears.join(' | '),x.reviewedLevels.map(a=>a.year+': '+a.level).join(' | '),x.citations.map(c=>c.url).join(' | '),x.citations.map(c=>c.reportId+' '+c.page).join(' | '),x.citations.map(c=>c.transcription??c.excerpt).join(' | '),x.reason];})]);
csv('Tien-do-theo-ngan-hang-nam.csv',[['Ngân hàng','Năm','Đã chấm','Chưa chấm','NA','Điểm năm'],...r.summaries.map(x=>[x.bank,x.year,x.scored,x.pending,x.na,x.score])]);
fs.writeFileSync(out+'/Quy-tac-cham-diem.json',JSON.stringify(r.policy,null,2));
const report=`# Kết quả xử lý tự chủ ngày 13/10/2026

Người dùng đã giao quyền tự quyết định phương pháp và xử lý. Không có commit GitHub. Dữ liệu mới không ghi đè các workbook gốc.

## Đã làm

- Chọn thang trưởng thành 1–5 từ Danh_muc; quy đổi 0/1/2/3/4/5 thành 0/0/25/50/75/100%, trọng số bằng nhau cho 6 trụ cột.
- Phân biệt 0 (đã rà soát nhưng chưa đủ bằng chứng), chưa chấm (null), NA (không áp dụng có lý do). Không coi thiếu thông tin là NA hoặc tự điền 0.
- Lập chỉ mục ${r.stats.pdfPages} trang vật lý của 23 PDF; OCR bổ sung ${r.stats.ocrPages} trang bằng Windows OCR en-US có sẵn.
- Sửa lỗi font LPBank 2023 làm tách 168 phần text: báo cáo thực tế có 86 trang PDF. TPBank PTBV 2024 không mở bằng WinRT nhưng vẫn trích được text; không tự coi phần không OCR được là không có bằng chứng.
- Lập đủ ${r.stats.annualRows} tổ hợp ngân hàng × năm × tiêu chí. Tìm được vị trí liên quan cho ${r.stats.withCandidates} tổ hợp; đây là gợi ý, chưa tự xác nhận điểm.
- Đọc đối chiếu và ghi ${r.stats.scored} mức theo năm có nguồn, trang, trích đoạn, lý do, người/ngày đối chiếu. Các đoạn OCR được dùng chấm đã xem ảnh và có bản chép tiếng Việt để đọc.
- Có ${r.stats.pooledWithCitations}/700 tiêu chí-ngân hàng được bổ sung dẫn chứng theo năm. Mức gộp cũ vẫn giữ riêng; không gán mức năm thay cho mức gộp.
- Web có chế độ Đối chiếu theo năm, lọc năm/trạng thái/mức/trụ cột, xem mô tả cả 5 mức, link mở đúng trang PDF và xuất CSV theo bộ lọc. Trang Hành trình hiển thị tiến độ thay cho điểm suy diễn.

## Tiến độ

| Ngân hàng | Năm | Đã đối chiếu mức | Còn chờ | Điểm năm |
|---|---:|---:|---:|---|
${r.summaries.map(s=>'| '+s.bank+' | '+s.year+' | '+s.scored+' | '+s.pending+' | Chưa đủ dữ liệu |').join('\n')}

## Chưa hoàn tất

- Còn ${r.stats.annualRows-r.stats.scored-r.stats.na} dòng chưa chấm mức. Nhiều dòng có vị trí gợi ý nhưng chưa đọc đối chiếu đủ yêu cầu phạm vi/hiệu quả trong mô tả mức. Không gọi những dòng này là đã xác nhận không có bằng chứng.
- Chưa có điểm năm đầy đủ, YoY hay xếp hạng năm. Chỉ tính khi đủ mức cho mọi tiêu chí áp dụng của đủ 6 trụ cột; không dùng trung bình trên vài tiêu chí để đại diện toàn bộ ngân hàng.
- Chưa xác nhận lại toàn bộ 700 mức gộp cũ. Dataset gốc có 644 dòng thiếu URL trực tiếp; lớp nguồn bổ sung có thể khác mức gộp.
- Chưa có xác nhận từ ngân hàng hoặc kiểm toán độc lập; trạng thái mới là Codex đối chiếu báo cáo công bố.
- Các trích đoạn OCR gợi ý có thể sai dấu/ký tự; cần đọc ảnh trước khi nâng thành mức đã đối chiếu.
- Python cũ vẫn hỏng. Pipeline trích xuất/đối chiếu mới chạy bằng Node và PowerShell, không cần Python.
- Đã kiểm tra logic, xuất CSV, trang nguồn, quy tắc NA/null/0, trọng số và điều kiện công bố điểm năm. Chưa kiểm thử tương tác thật toàn bộ website trên điện thoại.

## Sử dụng

Mở Bằng chứng → Đối chiếu theo năm. Chọn Đã đối chiếu mức để xem các dòng có căn cứ. Mở Hành trình để xem tiến độ; mở Phương pháp để đọc quy tắc và tải bảng. Các CSV trong thư mục này có ô trống thật cho mức chưa chấm. Khi nhập vào Excel, đặt mã tiêu chí thành Text để tránh đổi mã thành ngày.
`;
fs.writeFileSync(out+'/Bao-cao-xu-ly.md',report);console.log('Exported annual/pooled/progress CSVs, policy and report.');
