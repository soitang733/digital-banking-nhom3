import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
for(const file of ['data.js','research.js'])vm.runInNewContext(fs.readFileSync('dist/'+file,'utf8'),context);
const D=context.window.DBI_DATA,R=context.window.DBI_RESEARCH;
const pending=R.records.filter(r=>r.level===null&&!r.na),missing=D.evidence.filter(e=>!e.urls.length);
const csv=rows=>'\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n');
const pooledRows=D.evidence.map(e=>{const review=R.pooled.find(r=>r.bank===e.bank&&r.code===e.code);return [e.bank,e.code,e.sourceCode,D.pillars[e.pillar],e.name,e.level,e.percent,e.text,e.urls.join(' | '),e.urls.length?'Có URL gốc · vẫn cần xác nhận trang/mức':'Thiếu URL gốc',review?.citations.map(c=>c.reportId+' · '+c.url+'#page='+c.page).join(' | '),review?.reviewedLevels.map(r=>r.year+': mức '+r.level).join(' | '),'Chưa xác nhận mức gộp','','','','','',''];});
fs.writeFileSync('D:/nganhangso/audit/team-pooled-review.csv',csv([['Ngân hàng','Mã chuẩn','Mã Excel','Trụ cột','Tiêu chí','Mức gộp hiện tại','Điểm quy đổi hiện tại','Bằng chứng cũ','URL gốc','Tình trạng URL','Nguồn bổ sung theo năm','Mức đối chiếu theo năm','Trạng thái cần duyệt','URL team xác nhận','Trang PDF team xác nhận','Trích đoạn team xác nhận','Mức gộp team chốt','Lý do chốt/gộp','Người duyệt'],...pooledRows]));
fs.writeFileSync('D:/nganhangso/audit/team-annual-pending.csv',csv([['Ngân hàng','Năm','Mã chuẩn','Mã Excel','Trụ cột','Tiêu chí','Trạng thái hiện tại','Lý do hiện tại','Nguồn đã đọc','Trích đoạn đã đọc','Vị trí gợi ý chưa xác nhận','Mức team chốt','NA có lý do','URL team xác nhận','Trang PDF team xác nhận','Trích đoạn team xác nhận','Người duyệt'],...pending.map(r=>[r.bank,r.year,r.code,r.sourceCode,D.pillars[r.pillar],r.name,r.status,r.reason,r.citations.map(c=>c.reportId+' · '+c.url+'#page='+c.page).join(' | '),r.citations.map(c=>c.transcription??c.excerpt).join(' | '),r.candidates.map(c=>c.reportId+' · trang PDF '+c.page).join(' | '),'','','','','',''])]));
const byBank=D.banks.map(b=>{const es=D.evidence.filter(e=>e.bank===b.name),annual=pending.filter(r=>r.bank===b.name);return '| '+b.label+' | '+es.filter(e=>!e.urls.length).length+' / 140 | '+annual.length+' / 420 |';}).join('\n');
const note=`# Bàn giao dashboard — 13/10/2026

Các sửa giao diện và phương pháp đã kiểm chứng được đưa lên Sites theo yêu cầu mới. Báo cáo và CSV bàn giao lưu riêng trong audit/, không nhúng vào web; không commit/push GitHub.

Web: https://digital-banking-nhom3.nicelemon4.chatgpt.site

Bản local: D:/nganhangso/dashboard/dashboard.html

## Đã sửa

- Page 3 đổi thành Digital Maturity Profile: bảng 5 ngân hàng × 6 trụ cột, điểm tổng thể, hồ sơ từng ngân hàng, ngưỡng phân loại và CSV theo bộ lọc. Không thể hiện xu hướng điểm theo thời gian.
- Dùng dữ liệu gộp 2023–2025; giữ nguyên số liệu Excel. Phân loại trước khi làm tròn, cùng ngưỡng cho từng trụ cột và tổng thể.
- Chuyển tiến độ đối chiếu theo năm vào mục mở rộng ở Phương pháp; vẫn tra cứu đầy đủ ở Bằng chứng.
- Bổ sung giải thích mẫu số của dữ liệu gộp và dữ liệu đối chiếu mới: mức 0, NA, chưa chấm; không tự điền ô trống thành 0.
- Tạo riêng checklist và CSV bàn giao trong audit/, có cột để team điền nguồn, trang, trích đoạn, mức và người duyệt. Không nhúng báo cáo vào web.

## Các việc team cần hoàn tất

| Ưu tiên | Việc | Người phụ trách phù hợp | Điều kiện hoàn tất |
| --- | --- | --- | --- |
| P1 | Rà soát ${D.evidence.length} mức gộp; ${missing.length} dòng thiếu URL gốc | Nhóm thu thập/chấm dữ liệu | Mỗi dòng có nguồn truy xuất được, trang/trích đoạn, lý do mức chấm và người duyệt. Dùng team-pooled-review.csv. |
| P1 | Chốt cách tổng hợp bằng chứng giai đoạn 2023–2025 | Nhóm phương pháp + cả nhóm | Ghi rõ một mức gộp đại diện giai đoạn là mức cao nhất được chứng minh, mức cuối kỳ hay quy tắc khác; không tự lấy max điểm năm hoặc trung bình vài năm thiếu. |
| P1 | Duyệt quy tắc và phân loại | Nhóm phương pháp + cả nhóm | Xác nhận quy đổi 0/1/2/3/4/5 → 0/0/25/50/75/100%; trọng số 1/6; ngưỡng áp dụng cho từng trụ cột; điều kiện 0/NA/chưa chấm và mẫu số. |
| P1 | Kiểm thử trình duyệt và chốt bản demo | Nhóm dashboard + QA | Đã kiểm thử Chrome headless và mobile giả lập 390px. Team cần demo trên điện thoại thật và các trình duyệt dùng khi nộp; kiểm tra thủ công nguồn báo cáo. |
| P1 | Duyệt cảnh báo dữ liệu sau khi chạy pipeline | Nhóm thu thập/chấm dữ liệu | 90 cảnh báo gồm 89 dòng mức 0 cần xác nhận và 1 cảnh báo thiếu cột năm trong dataset gộp. Dùng team-python-cleaning-issues.csv. Cả 302 mức 0 của dữ liệu gộp vẫn cần rà soát theo quy tắc mới. |
| P2, chỉ khi giữ mục tiêu phân tích năm | Chấm ${pending.length}/${R.stats.annualRows} dòng còn thiếu theo năm | Nhóm thu thập/chấm dữ liệu | Dùng team-annual-pending.csv; có mức hoặc NA có lý do cùng nguồn/trang/trích đoạn. Chỉ công bố điểm năm khi đủ mọi tiêu chí áp dụng và 6 trụ cột. |

Đã đối chiếu ${R.stats.scored} mức theo năm; ${R.stats.pooledWithCitations}/700 tiêu chí-ngân hàng có dẫn chứng bổ sung. Các dẫn chứng này chưa tự xác nhận mức gộp. Mức do trợ lý đọc tài liệu cần team duyệt; gợi ý từ khóa/OCR không được coi là bằng chứng đã xác nhận. Không cần hoàn tất điểm từng năm để trình bày Digital Maturity Profile gộp.

| Ngân hàng | Thiếu URL gốc | Chưa chấm theo năm (P2) |
| --- | --- | --- |
${byBank}

## Quy tắc trưởng thành đang dùng

0–<25%: Khởi động; 25–<50%: Bắt đầu; 50–<75%: Hình thành; 75–<100%: Nâng cao; 100%: Dẫn dắt. Dùng điểm gốc trước khi làm tròn. Đây là phân loại của nhóm, không phải chứng nhận ngân hàng. Mức 0 hoặc 1 cùng quy đổi 0% nhưng khác ý nghĩa. Dữ liệu gộp cũ có mẫu số cố định; lớp đối chiếu mới loại NA có lý do khỏi mẫu số, giữ chưa chấm là trống và không công bố điểm khi còn thiếu tiêu chí áp dụng.

## Checklist kiểm thử demo

- Mở đủ 5 trang bằng menu, liên kết trực tiếp và nút Back/Forward.
- Đổi ngân hàng, trụ cột, thước đo; thử đồng hạng; dùng nút đặt lại. Đối chiếu KPI/bảng/CSV cùng phạm vi.
- Page 3: chọn cả 5 ngân hàng rồi từng ngân hàng; kiểm tra hồ sơ, phân loại, 6 trụ cột, CSV 35 hoặc 7 dòng dữ liệu. Không nhầm điểm 49.0% là điểm năm.
- Bằng chứng: tìm có/không dấu; bộ lọc năm/trạng thái/NA/chưa chấm; phân trang; mở chi tiết bằng chuột và bàn phím. Kiểm tra link đúng ngân hàng/năm/trang PDF, đoạn trích đúng nội dung.
- Phương pháp: mở tiến độ năm; nút tra cứu; tải CSV quy tắc và dữ liệu đối chiếu. Checklist và CSV bàn giao nằm riêng trong audit/, không đưa lên web. Tiến độ phản ánh việc rà soát, không phải mức năng lực.
- Desktop, điện thoại và zoom 200%: menu, bảng cuộn ngang, chữ không bị cắt, popup nguồn, Tab/Enter/Escape.
- Bật/tắt ✦, thử giảm chuyển động của hệ điều hành, hover/click/bộ lọc, sticker mèo; kiểm tra lớp hiệu ứng không chặn thao tác và tắt sạch.
- Chụp ảnh 5 trang để đưa vào báo cáo, lưu biên bản PASS/FAIL và người kiểm tra.

## Phạm vi kiểm chứng của trợ lý

- Đã khôi phục Python 3.12.10 đúng phiên bản môi trường cũ bằng bộ cài chính thức có chữ ký Python Software Foundation; pandas/openpyxl và Playwright đã có trong .venv. Nguồn bộ cài: https://www.python.org/downloads/release/python-31210/ .
- Sửa lỗi UnicodeEncodeError ở pipeline Windows bằng chế độ UTF-8 cho subprocess. Pipeline đủ 4 bước đã chạy thành công; output nằm riêng trong pipeline/output.
- 700 mức chấm/điểm quy đổi khớp Excel gốc và output Python; nội dung bằng chứng khớp sau khi chuẩn hóa khoảng trắng. Tính độc lập 30 điểm trụ cột và 5 điểm tổng thể; thứ hạng AnalysisDataset khớp Digital Score. File kiểm chứng: source-and-maturity-results.json, python-pipeline-results.json.
- Kiểm tra ngưỡng 0/25/50/75/100 trước làm tròn, thiếu mức, NA, trọng số bằng nhau, filter và CSV. File kiểm chứng: check-source-and-maturity.mjs, pipeline/check-research.mjs.
- Đã thao tác trong Chrome headless: 5 trang, bộ lọc năm/ngân hàng, popup và liên kết trang PDF, CSV trưởng thành 35/7 dòng, bật/tắt hiệu ứng, sticker tương tác, menu mobile và giảm chuyển động. Không có lỗi JavaScript hoặc asset lỗi trong các lượt kiểm tra. Playwright dùng Chrome đã có trên máy theo https://playwright.dev/python/docs/browsers .
- Đã chụp và xem ảnh Page 3 desktop/mobile, quy tắc mobile và sticker khi bấm. Ảnh 5 trang desktop nằm trong audit/local-*-desktop.png.
- Giới hạn: chưa kiểm thử trên điện thoại thật hoặc mọi trình duyệt; mở link đúng trang không đồng nghĩa đã đọc xác minh toàn bộ nội dung nguồn. Các mức gộp vẫn là kết quả sơ bộ của nhóm.
`;
fs.writeFileSync('D:/nganhangso/audit/team-handoff.md',note);
fs.copyFileSync('D:/nganhangso/audit/team-handoff.md','D:/nganhangso/audit/Ban-giao-team-2026-10-13.md');
console.log(JSON.stringify({pooled:D.evidence.length,missingOriginalURLs:missing.length,pendingAnnual:pending.length,scoredAnnual:R.stats.scored}));
