# Mã nguồn ngân hàng số Nhóm 03

Website: https://digital-banking-nhom3.vercel.app

## Cấu trúc

- pipeline/: xử lý dữ liệu Python, đọc/đối chiếu PDF và tính điểm.
- pipeline/data/Data Feasibility.xlsx: dữ liệu thu thập đầu vào. Các JSON và văn bản lưu vết dữ liệu đối chiếu.
- pipeline/output/: 4 workbook kết quả.
- dashboard/dist/: website tĩnh, dữ liệu snapshot và tài nguyên hiển thị.
- dashboard/: script tạo dữ liệu và kiểm tra frontend.
- bank-dashboard-cloud/: API, cấu hình Vercel và build frontend cloud; không kèm tài khoản hoặc khóa.
- validation/: biên bản đối chiếu và SHA256 snapshot.

## Xem website local

Cần Node.js từ 22. Từ thư mục Code chạy:

```powershell
cd dashboard
node serve.mjs
```

Mở http://127.0.0.1:4173. Website tĩnh có sẵn dữ liệu để chạy không cần tài khoản Supabase. Link tải hồ sơ trỏ tới bản công khai. Dừng server bằng Ctrl+C.

## Chạy lại pipeline Excel

Cần Python từ 3.10 và môi trường ảo đã kích hoạt. Từ Code:

```powershell
python -m pip install -r pipeline/requirements.txt
python pipeline/run_pipeline.py
```

Output riêng trong pipeline/output. Không tự ghi đè workbook gốc ở nơi khác.

## Kiểm tra dữ liệu và frontend

Từ Code: `node pipeline/check-research.mjs`. Từ Code/dashboard: `node check-dashboard.mjs`. Kiểm tra PDF cần tải lại 23 PDF theo dashboard/source-metadata.json hoặc chạy download_reports.ps1 từ PowerShell. Các script OCR cần Windows và công cụ PDF; không cần OCR để chạy Excel hoặc xem frontend có sẵn.

## Bản cloud

Từ Code/bank-dashboard-cloud chạy `npm ci`, `npm run build`, `npm run check`. Build lấy frontend từ ../dashboard/dist. Tạo project Vercel/Supabase của nhóm và cấu hình SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY trong biến môi trường server nếu dùng API. Nếu chưa cấu hình API, dùng bản tĩnh ở dashboard để demo. Không lưu khóa quản trị vào mã frontend.

## Phương pháp

Quy đổi mức 0/1/2/3/4/5 = 0/0/25/50/75/100 phần trăm; điểm trụ cột là trung bình tiêu chí, Digital Score là trung bình 6 trụ cột. Điểm gộp 2023–2025 chọn mức cao nhất được bằng chứng chứng minh đầy đủ trong giai đoạn sau duyệt hồ sơ, không đại diện cuối năm 2025. Phương pháp đã chốt ngày 19/10/2026 tại pipeline/METHODOLOGY.md và pipeline/research-policy.json; 700 mức cũ vẫn là bản lịch sử chưa chấm lại. Các nguồn PDF liên quan giữ trạng thái Chưa đủ bằng chứng; các ô năm chưa chấm vẫn trống.

## Kho GitHub

Kho mã nguồn công khai: https://github.com/soitang733/digital-banking-nhom3. Không kèm .git, node_modules, tài khoản đăng nhập hoặc khóa dịch vụ.
