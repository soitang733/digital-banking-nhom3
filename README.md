# Hồ sơ nộp bài ngân hàng số Nhóm 03

Ngày cập nhật: 20/10/2026. Sản phẩm: https://digital-banking-nhom3.vercel.app. GitHub: https://github.com/soitang733/digital-banking-nhom3

## Các nội dung nộp

1. Báo cáo toàn bộ nội dung, quy trình, phương pháp, kết quả và phụ lục: Bao-cao-nghien-cuu-ngan-hang-so.pdf. Có bản .md để chỉnh sửa nội dung. Phụ lục A có 140 tiêu chí; mô tả đủ 5 mức tại Excel/ScoringReview.xlsx, sheet Danh_muc.
2. Data chấm điểm: Excel/CleanData.xlsx và Excel/ScoringReview.xlsx. Bản đầu vào đã duyệt có cập nhật URL tại Code/pipeline/data/TeamApprovedCleanData.xlsx. Bản thu thập ban đầu tại Code/pipeline/data/Data Feasibility.xlsx.
3. Kết quả chấm điểm: Excel/DBI_DigitalScore_theo_tieu_chi.xlsx, sheet Digital_Score_Rank, Chi_tiet_tieu_chi, Diem_tru_cot; phân tích trong Excel/AnalysisDataset.xlsx.
4. Code: thư mục Code gồm pipeline/, dashboard/, bank-dashboard-cloud/. Xem Code/README.md.
5. Link sản phẩm: https://digital-banking-nhom3.vercel.app
6. Nguồn PDF: Nguon-PDF.csv liệt kê 23 báo cáo có dẫn chứng hoặc đoạn liên quan, tải từ trang Tải dữ liệu. PDF không gộp vào ZIP để tránh gói quá lớn.

## Phương pháp đã chốt

Xem Phuong-phap-cham-diem.md. Mức gộp là mức cao nhất được chứng minh đầy đủ trong giai đoạn 2023–2025; không phải điểm cuối năm 2025. Quy đổi, trọng số, 0/NA/chưa chấm đã thống nhất. Bộ 700 mức Excel do nhóm làm và duyệt; thông tin trích dẫn trong file chuyển giao được bổ sung riêng, không phải yêu cầu chấm lại.

## Bốn Excel bản cuối

- Excel/CleanData.xlsx: Dữ liệu chấm điểm. Dữ liệu chuẩn hóa, bảng tổng hợp và nguồn bằng chứng.
- Excel/ScoringReview.xlsx: Tiêu chí và thang chấm. Danh mục 140 tiêu chí, mô tả mức 1–5 và bảng chấm từng ngân hàng.
- Excel/DBI_DigitalScore_theo_tieu_chi.xlsx: Điểm số và xếp hạng. Điểm chi tiết 700 bản ghi, điểm nhóm, trụ cột và Digital Score.
- Excel/AnalysisDataset.xlsx: Phân tích kết quả. So sánh ngân hàng, điểm mạnh yếu và khoảng cách trụ cột.

## Nội dung bổ sung ở đợt sau

- Đã gắn URL cho 398/398 dòng mức lớn hơn 0. Sáu mô tả TPBank đã được chuẩn hóa theo nguồn trong kỳ; lịch sử nội dung trước/sau và nguồn lưu tại Code/pipeline/data/source-url-research.json.
- Giữ nguyên bộ điểm đã được nhóm duyệt. Cờ tự động của pipeline phục vụ kiểm tra cấu trúc/thông tin, không phải quyết định phủ nhận mức chấm.
- Sản phẩm chính dùng điểm gộp và hồ sơ trưởng thành số. Phân tích xu hướng theo năm là phần mở rộng, chỉ tính khi có dữ liệu đầy đủ; không suy ra điểm năm từ điểm gộp.
- Nhóm bổ sung thông tin lớp và thành viên. Kho GitHub công khai: https://github.com/soitang733/digital-banking-nhom3.

## Tham chiếu thư mục trong GitHub

Giữ nguyên cấu trúc: Bao-cao..., Excel/, Code/, Nguon-PDF.csv và README.md. README này ghi rõ vị trí từng nhóm tài liệu để người chấm truy cập. Không đưa node_modules, .git, .env, phiên đăng nhập hoặc khóa dịch vụ.

Bộ Excel đã đồng bộ bằng chứng với bản dữ liệu nhóm cập nhật và nguồn tìm bổ sung ngày 20/10/2026; giữ nguyên 700 mức chấm và toàn bộ kết quả tính điểm. không trộn với các workbook gốc ở phiên khác. Phạm vi dữ liệu và thông tin trích dẫn được trình bày trong Chương 6; bộ điểm gộp đã được nhóm nghiên cứu duyệt.
