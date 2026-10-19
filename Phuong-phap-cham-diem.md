# Phương pháp chấm điểm ngân hàng số

Phiên bản DBI-METHOD-2026-10-19. Chốt ngày 19/10/2026 theo ủy quyền của chủ dự án.

## Phạm vi và điểm gộp

So sánh 5 ngân hàng, 140 tiêu chí thuộc 6 trụ cột, giai đoạn 2023–2025. Đơn vị chấm gộp là ngân hàng × tiêu chí, tổng cộng 700 dòng.

Chọn mức cao nhất được bằng chứng chứng minh đầy đủ trong giai đoạn. Đây là mức đã thể hiện trong giai đoạn, không phải hiện trạng cuối năm 2025, không phải trung bình ba năm. Rà soát bộ tài liệu liên quan của cả giai đoạn trước khi đóng hồ sơ. Không ghép các triển khai ở các thời điểm khác nhau thành một mức chưa từng được chứng minh.

Ví dụ: 2023 có mức 2, 2024 có mức 4, 2025 chưa đủ dữ liệu: mức gộp có thể là 4 sau duyệt nguồn; mức năm 2025 vẫn trống. Không cần đủ ba tổng điểm năm để lập hồ sơ gộp.

## Mức chấm và bằng chứng

Mức 1–5 theo mô tả từng tiêu chí trong ScoringReview.xlsx, sheet Danh_muc. Chọn mức cao nhất thỏa đầy đủ điều kiện; không nâng mức chỉ vì xuất hiện AI, cloud hoặc tên sản phẩm. Phải xác định hoạt động thực tế, thời gian và phạm vi triển khai. Kế hoạch tương lai không chứng minh triển khai. Đoạn tìm bằng từ khóa chỉ là gợi ý; đoạn OCR dùng để chấm phải được đọc lại trên ảnh trang.

Mỗi quyết định lưu ngân hàng, mã tiêu chí, năm/phạm vi, URL, trang vật lý PDF, trích đoạn, mức hoặc trạng thái, lý do đối chiếu rubric, người và ngày duyệt. Nếu nguồn mâu thuẫn hoặc chưa rõ phạm vi, giữ hồ sơ chờ rà soát, không chọn mức cao chỉ để hoàn thiện bảng.

Với mức 0, hồ sơ dùng nhật ký rà soát thay cho đoạn trích chứng minh một mức dương: ghi tài liệu đã đọc, trang/phần đã rà, cách tìm và kiểm tra ảnh/OCR, kết quả, người và ngày rà. Không tạo đoạn trích giả để điền đủ cột. Phạm vi rà soát căn cứ danh mục báo cáo của dự án; nguồn bổ sung phải được ghi nhận cùng phiên dữ liệu.

## 0, NA và chưa chấm

| Trạng thái | Điều kiện | Tính điểm |
| --- | --- | --- |
| 0 | Đã rà đủ tài liệu liên quan trong phạm vi, có nhật ký rà soát và chưa tìm đủ bằng chứng đáp ứng mức 1 | 0%, vẫn trong mẫu số; không kết luận ngân hàng không triển khai |
| NA | Có lý do không áp dụng, người/ngày duyệt; NA gộp phải đúng cho toàn giai đoạn | Loại khỏi mẫu số |
| Chưa chấm | Chưa rà soát xong hoặc chưa đủ căn cứ quyết định | Giữ null/trống, không đổi thành 0 hoặc NA; chưa đủ để công bố tổng điểm hoàn chỉnh |

Mức 1 là mức trưởng thành thấp nhất có bằng chứng, khác bản chất với mức 0 dù cùng quy đổi 0%.

## Công thức, phân loại và so sánh

- Mức 0/1/2/3/4/5 quy đổi 0/0/25/50/75/100%.
- Điểm trụ cột = tổng điểm quy đổi / số tiêu chí áp dụng của trụ cột, sau khi chấm đủ. Tiêu chí trong cùng trụ cột có trọng số bằng nhau.
- Digital Score = tổng điểm 6 trụ cột / 6, mỗi trụ cột trọng số 1/6. Không lấy trung bình trực tiếp 140 tiêu chí.
- Chỉ công bố bộ kết quả đã duyệt khi đủ mọi tiêu chí áp dụng và cả 6 trụ cột. Trụ cột không có tiêu chí áp dụng làm tổng điểm không xác định; không coi là 0 hoặc tự chia lại trọng số.
- 0–<25% Khởi động; 25–<50% Bắt đầu; 50–<75% Hình thành; 75–<100% Nâng cao; 100% Dẫn dắt. Dùng điểm chưa làm tròn; đồng điểm cùng hạng.
- Khoảng cách giữa ngân hàng dùng cùng thước đo, trụ cột và phạm vi; với điểm phần trăm, khoảng cách có đơn vị điểm phần trăm. Không coi tỷ lệ dòng có mức > 0 là bằng chứng đã xác nhận.
- Tổng điểm năm chỉ tính khi năm đó đủ dữ liệu. YoY chỉ so hai năm đủ dữ liệu, cùng danh mục, phương pháp và mẫu tiêu chí áp dụng; nếu mẫu khác cần chuẩn hóa trước. YoY tính bằng chênh lệch điểm phần trăm, không suy ra từ điểm gộp.

## Áp dụng cho dữ liệu hiện có

700 mức gộp Excel đã được nhóm nghiên cứu thực hiện và duyệt, theo xác nhận của chủ dự án ngày 19/10/2026. Giữ nguyên mức, điểm tổng hợp và xếp hạng. Thiếu thông tin URL/trang/trích đoạn trong bản chuyển giao không có nghĩa nhóm chưa duyệt mức. Lớp năm/PDF bổ sung là dữ liệu riêng; không tự chọn max từ lớp năm để ghi đè bộ điểm của nhóm.

Khi nhóm yêu cầu điều chỉnh mức, lưu mức cũ/mới, lý do, nguồn và người/ngày duyệt; chạy lại pipeline Excel, build/import snapshot và cập nhật báo cáo cùng phiên bản. Mọi sửa mức phải truy vết được.
