# Hồ sơ nộp bài ngân hàng số Nhóm 03

Ngày đóng gói: 19/10/2026. Sản phẩm: https://digital-banking-nhom3.vercel.app. GitHub: https://github.com/soitang733/digital-banking-nhom3

## Các nội dung nộp

1. Báo cáo toàn bộ nội dung, quy trình, phương pháp, kết quả và phụ lục: Bao-cao-nghien-cuu-ngan-hang-so.pdf. Có bản .md để chỉnh sửa nội dung. Phụ lục A có 140 tiêu chí; mô tả đủ 5 mức tại Excel/ScoringReview.xlsx, sheet Danh_muc.
2. Data chấm điểm: Excel/CleanData.xlsx và Excel/ScoringReview.xlsx. File thu thập đầu vào gốc tại Code/pipeline/data/Data Feasibility.xlsx.
3. Kết quả chấm điểm: Excel/DBI_DigitalScore_theo_tieu_chi.xlsx, sheet Digital_Score_Rank, Chi_tiet_tieu_chi, Diem_tru_cot; phân tích trong Excel/AnalysisDataset.xlsx.
4. Code: thư mục Code gồm pipeline/, dashboard/, bank-dashboard-cloud/. Xem Code/README.md.
5. Link sản phẩm: https://digital-banking-nhom3.vercel.app
6. Nguồn PDF: Nguon-PDF.csv liệt kê 23 báo cáo có dẫn chứng hoặc đoạn liên quan, tải từ trang Tải dữ liệu. PDF không gộp vào ZIP để tránh gói quá lớn.

## Bốn Excel bản cuối

- Excel/CleanData.xlsx: Dữ liệu chấm điểm. Dữ liệu chuẩn hóa, bảng tổng hợp và các trường cần rà soát.
- Excel/ScoringReview.xlsx: Tiêu chí và thang chấm. Danh mục 140 tiêu chí, mô tả mức 1–5 và bảng chấm từng ngân hàng.
- Excel/DBI_DigitalScore_theo_tieu_chi.xlsx: Điểm số và xếp hạng. Điểm chi tiết 700 bản ghi, điểm nhóm, trụ cột và Digital Score.
- Excel/AnalysisDataset.xlsx: Phân tích kết quả. So sánh ngân hàng, điểm mạnh yếu và khoảng cách trụ cột.

## Nội dung bổ sung ở đợt sau

- Duyệt nguồn, trang, trích đoạn và mức chấm còn thiếu cho dữ liệu gộp. Các đoạn PDF liên quan không tự xác nhận mức.
- Chốt cách tổng hợp bằng chứng giai đoạn 2023–2025 và xử lý cờ rà soát.
- Hoàn thiện lớp theo năm trước khi tính điểm năm hoặc YoY; không suy ra điểm năm từ điểm gộp.
- Nhóm bổ sung thông tin lớp và thành viên. Kho GitHub công khai: https://github.com/soitang733/digital-banking-nhom3.

## Tham chiếu thư mục trong GitHub

Giữ nguyên cấu trúc: Bao-cao..., Excel/, Code/, Nguon-PDF.csv và README.md. README này ghi rõ vị trí từng nhóm tài liệu để người chấm truy cập. Không đưa node_modules, .git, .env, phiên đăng nhập hoặc khóa dịch vụ.

Bộ Excel là bản output của pipeline đã đối chiếu; không trộn với các workbook gốc ở phiên khác. Kết quả hiện tại vẫn có giới hạn bằng chứng được trình bày trong Chương 6 của báo cáo.
