Báo cáo nghiên cứu chỉ số chuyển đổi số ngân hàng

Nhóm 03<br/>TPBank  HDBank  LPBank  OCB  Saigonbank<br/>Phạm vi dữ liệu 2023 đến 2025<br/>Bản nộp ngày 19 tháng 10 năm 2026

## Tóm tắt nghiên cứu

Nghiên cứu xây dựng bộ dữ liệu so sánh năm ngân hàng theo 140 tiêu chí thuộc 25 nhóm và sáu trụ cột. Bộ điểm gộp gồm 700 bản ghi, được quy đổi từ mức đạt sang tỷ lệ phần trăm rồi tổng hợp với trọng số bằng nhau cho sáu trụ cột. Dashboard cung cấp xếp hạng, hồ sơ năng lực, mức trưởng thành, tra cứu bằng chứng, phương pháp và tài liệu tải về.

Trong bộ điểm gộp hiện tại, OCB đứng đầu với 48,98%, tiếp theo là LPBank 34,39%. Các kết quả phản ánh bộ tiêu chí và nguồn công bố được sử dụng, không phải kết luận về toàn bộ năng lực thực tế hay hiệu quả kinh doanh của ngân hàng. Dữ liệu gộp 2023 đến 2025 không được diễn giải thành xu hướng theo năm.

Bộ đối chiếu theo năm được quản lý riêng. Những dòng chưa đủ bằng chứng giữ trạng thái chưa chấm; nguồn PDF có nội dung liên quan không tự động xác nhận mức đạt. Báo cáo trình bày kết quả hiện có và tách các nội dung cần bổ sung trong kỳ nộp tiếp theo.

Sản phẩm công khai: <link href="https://digital-banking-nhom3.vercel.app" color="#225599">https://digital-banking-nhom3.vercel.app</link>

Kho GitHub công khai: <link href="https://github.com/soitang733/digital-banking-nhom3" color="#225599">https://github.com/soitang733/digital-banking-nhom3</link>

## Cấu trúc báo cáo

1 Mục tiêu và phạm vi<br/>2 Dữ liệu và quy trình nghiên cứu<br/>3 Bộ tiêu chí và phương pháp chấm<br/>4 Kết quả và phân tích<br/>5 Thiết kế sản phẩm và kiểm chứng<br/>6 Giới hạn và nội dung bổ sung<br/>Phụ lục A Danh mục 140 tiêu chí<br/>Phụ lục B Ví dụ thang chấm và bằng chứng<br/>Phụ lục C Danh mục 23 báo cáo nguồn<br/>Phụ lục D Cấu trúc file bàn giao và tái lập kết quả

## 1 Mục tiêu và phạm vi

Mục tiêu là chuẩn hóa dữ liệu công bố thành một bộ chỉ số có thể truy vết, so sánh điểm tổng thể và nhận diện chênh lệch giữa các trụ cột. Các câu hỏi nghiên cứu gồm: ngân hàng nào có điểm cao hơn trong cùng bộ tiêu chí; trụ cột nào là điểm mạnh hoặc điểm yếu tương đối; và bằng chứng nào hỗ trợ mức chấm của từng tiêu chí.

Đơn vị phân tích chính là tổ hợp ngân hàng và tiêu chí trong toàn giai đoạn. Mỗi ngân hàng có 140 tiêu chí. Lớp nghiên cứu bổ sung dùng đơn vị ngân hàng, năm hoạt động và tiêu chí, với 2.100 tổ hợp. Hai lớp dữ liệu được tách để tránh sao chép mức gộp sang từng năm.

| Ngân hàng | Số tiêu chí | Phạm vi điểm chính |
| --- | --- | --- |
| TPBank | 140 | Gộp 2023 đến 2025 |
| HDBank | 140 | Gộp 2023 đến 2025 |
| LPBank | 140 | Gộp 2023 đến 2025 |
| OCB | 140 | Gộp 2023 đến 2025 |
| Saigonbank | 140 | Gộp 2023 đến 2025 |

Sáu trụ cột thể hiện các mặt khác nhau của chuyển đổi số. Nghiên cứu không dùng chỉ số này để đánh giá khả năng đầu tư, an toàn tài chính, giá cổ phiếu hoặc thay thế kiểm toán độc lập. Ngưỡng trưởng thành là quy ước phân loại của nhóm trong dự án.

## 2 Dữ liệu và quy trình nghiên cứu

### 2 1 Nguồn dữ liệu

Dữ liệu đầu vào được lưu trong Data Feasibility.xlsx. Bốn workbook kết quả lần lượt lưu dữ liệu đã chuẩn hóa, mô tả thang chấm và rà soát, điểm quy đổi và xếp hạng, cùng bảng phân tích. Bộ danh mục có 23 báo cáo thường niên hoặc phát triển bền vững của năm ngân hàng; nguồn gốc và liên kết từng báo cáo được liệt kê ở Phụ lục C.

| File Excel | Vai trò và nội dung chính |
| --- | --- |
| CleanData.xlsx | Dữ liệu chuẩn hóa và bảng lỗi cần rà soát. |
| ScoringReview.xlsx | Danh mục tiêu chí, mô tả mức 1 đến 5, dữ liệu chấm từng ngân hàng và bảng rà soát. |
| DBI_DigitalScore_theo_tieu_chi.xlsx | 700 mức chấm, điểm quy đổi, điểm nhóm và trụ cột, Digital Score và xếp hạng. |
| AnalysisDataset.xlsx | So sánh ngân hàng, ma trận trụ cột, Strength Weakness, Gap Analysis và phương pháp. |

Một đường dẫn báo cáo chỉ xác định tài liệu tham khảo. Để xác nhận mức chấm, cần đối chiếu đúng tiêu chí với đoạn trích, trang và phạm vi triển khai. Năm báo cáo và năm hoạt động trong nội dung có thể khác nhau; kế hoạch tương lai không được xem là bằng chứng triển khai đã hoàn tất.

### 2 2 Chuẩn hóa và truy vết

Quy trình chuẩn hóa thống nhất tên ngân hàng, mã tiêu chí, kiểu dữ liệu của mức đạt và văn bản bằng chứng; kiểm tra các mức nằm trong thang 0 đến 5; phát hiện thiếu dữ liệu, mức 0 và cấu trúc năm. Mã chuẩn hiển thị trên dashboard được ánh xạ với mã nguồn Excel, giữ cả hai mã để truy ngược. Không thay thế mã nguồn bằng suy luận từ tên tiêu chí.

Các PDF được lưu kèm URL nguồn và SHA256. Văn bản được trích xuất theo trang PDF vật lý; trang ảnh dùng OCR để hỗ trợ tìm kiếm. Chỉ số trang in được ghi riêng khi đã đối chiếu. OCR và từ khóa giúp định vị nội dung, không phải bộ chấm điểm tự động.

### 2 3 Quy trình xử lý

| Bước | Đầu vào và thao tác | Đầu ra |
| --- | --- | --- |
| 1 | Kiểm tra dữ liệu nguồn và chuẩn hóa trường thông tin | CleanData.xlsx |
| 2 | Tổng hợp mức đạt, mô tả thang chấm và cờ rà soát | ScoringReview.xlsx |
| 3 | Quy đổi mức đạt, tính điểm trụ cột và điểm tổng thể | DBI_DigitalScore_theo_tieu_chi.xlsx |
| 4 | Xếp hạng, so sánh trụ cột và tính khoảng cách | AnalysisDataset.xlsx |
| 5 | Đọc báo cáo, lưu đoạn trích và quyết định đối chiếu theo năm | Lớp dữ liệu năm và nguồn dẫn chứng |
| 6 | Đối chiếu số liệu, kiểm tra bộ lọc và xuất file | Dashboard và bộ bàn giao |

## 3 Bộ tiêu chí và phương pháp chấm

### 3 1 Cấu trúc bộ chỉ số

| Trụ cột | Số tiêu chí | Trọng số tổng thể |
| --- | --- | --- |
| Khách hàng | 25 | 1 trên 6 |
| Chiến lược | 24 | 1 trên 6 |
| Công nghệ | 29 | 1 trên 6 |
| Vận hành | 22 | 1 trên 6 |
| Văn hóa | 22 | 1 trên 6 |
| Dữ liệu | 18 | 1 trên 6 |

Danh mục đầy đủ 140 tiêu chí nằm ở Phụ lục A. Nội dung mô tả từng mức từ 1 đến 5 được lưu trong sheet Danh_muc của ScoringReview.xlsx. Đây là tài liệu đối chiếu bắt buộc khi chấm; không chọn mức chỉ vì xuất hiện tên một công nghệ trong báo cáo.

### 3 2 Nguyên tắc xác định mức

Mỗi mức cần phù hợp với phạm vi triển khai thể hiện trong bằng chứng. Khi một đoạn chỉ hỗ trợ triển khai tại một số bộ phận, không mở rộng thành triển khai toàn ngân hàng. Chọn mức cao nhất được nội dung hỗ trợ đầy đủ; thiếu một điều kiện quan trọng thì chưa nâng mức. Ví dụ thang cá nhân hóa trải nghiệm được trình bày tại Phụ lục B.

Bộ điểm gộp hiện có sử dụng mức 0 khi chưa đủ bằng chứng trong dataset. Mức 0 và mức 1 cùng quy đổi về 0% nhưng có ý nghĩa khác nhau: mức 1 tương ứng một mô tả trưởng thành; mức 0 phản ánh giới hạn bằng chứng. Mức 0 không chứng minh ngân hàng không triển khai hoạt động.

Đối với lớp chấm theo năm, ô chưa chấm giữ trống và không được tự chuyển thành mức 0. NA chỉ dùng khi có lý do cụ thể cho việc tiêu chí không áp dụng; không dùng NA thay cho thiếu công bố. Xác nhận mức 0 cần rà soát đủ tài liệu liên quan, không dựa riêng vào việc tìm từ khóa không có kết quả.

### 3 3 Quy đổi và tổng hợp điểm

| Mức đạt | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Điểm quy đổi | 0% | 0% | 25% | 50% | 75% | 100% |

Quy đổi dùng cận dưới theo quy ước của file chấm điểm. Điểm của một trụ cột bằng tổng điểm quy đổi của các tiêu chí trong trụ cột chia cho số tiêu chí. Digital Score bằng trung bình cộng điểm của sáu trụ cột. Vì vậy, mỗi trụ cột có trọng số 1 trên 6 dù số tiêu chí của các trụ cột khác nhau.

Điểm trụ cột p = Tổng điểm quy đổi của các tiêu chí thuộc p / Số tiêu chí thuộc p<br/>Digital Score = Tổng điểm sáu trụ cột / 6

Đối với điểm gộp hiện tại, mẫu số cố định bao gồm các tiêu chí có mức 0. Đối với lớp năm, tiêu chí NA có lý do được loại khỏi mẫu số; nếu còn tiêu chí áp dụng chưa chấm hoặc thiếu một trụ cột có dữ liệu hợp lệ thì không công bố điểm tổng thể. Không tính điểm toàn ngân hàng bằng cách lấy trung bình một tập nhỏ tiêu chí đã chấm.

Mức đạt trung bình trên thang 5 là trung bình mức đạt của 140 tiêu chí và được giữ làm thước đo riêng. Do Digital Score tính trung bình theo trụ cột và dùng quy đổi phi tuyến, thứ hạng giữa hai thước đo có thể khác nhau. Bảng phân tích phải ghi rõ thước đo đang sử dụng.

### 3 4 Phân loại trưởng thành và xếp hạng

| Khoảng Digital Score | Mức phân loại |
| --- | --- |
| 0 đến dưới 25% | Khởi động |
| 25 đến dưới 50% | Bắt đầu |
| 50 đến dưới 75% | Hình thành |
| 75 đến dưới 100% | Nâng cao |
| 100% | Dẫn dắt |

Phân loại trên giá trị chưa làm tròn, áp dụng cùng ngưỡng cho tổng thể và từng trụ cột. Thứ hạng được tính theo điểm giảm dần trong năm ngân hàng; các giá trị đồng điểm được cùng hạng. Mức phân loại thể hiện cách đọc bộ dữ liệu của nhóm, không phải chứng nhận trưởng thành của ngân hàng.

## 4 Kết quả và phân tích

### 4 1 Digital Score tổng thể

| Hạng | Ngân hàng | Digital Score | Mức đạt TB trên 5 | Phân loại |
| --- | --- | --- | --- | --- |
| 1 | OCB | 48,98% | 2,81 | Bắt đầu |
| 2 | LPBank | 34,39% | 2,13 | Bắt đầu |
| 3 | TPBank | 16,61% | 1,08 | Khởi động |
| 4 | HDBank | 14,13% | 0,97 | Khởi động |
| 5 | Saigonbank | 12,88% | 0,98 | Khởi động |

OCB có điểm 48,98%, cao hơn LPBank 14,59 điểm phần trăm. TPBank, HDBank và Saigonbank cùng thuộc khoảng Khởi động theo quy ước của nhóm. Mức đạt trung bình của Saigonbank cao hơn HDBank nhưng Digital Score thấp hơn; sự khác biệt xuất phát từ trọng số trụ cột và phép quy đổi, không phải lỗi đảo thứ hạng.

Nguồn tính: DBI_DigitalScore_theo_tieu_chi.xlsx, các sheet Digital_Score_Rank và Diem_tru_cot; đối chiếu với snapshot của dashboard. Số liệu trong bảng được làm tròn hai chữ số cho trình bày; các phép tính và xếp hạng dùng giá trị đầy đủ.

### 4 2 Kết quả theo sáu trụ cột

| Ngân hàng | Khách hàng | Chiến lược | Công nghệ | Vận hành | Văn hóa | Dữ liệu |
| --- | --- | --- | --- | --- | --- | --- |
| OCB | 49,00 | 57,29 | 45,69 | 46,59 | 52,27 | 43,06 |
| LPBank | 44,00 | 45,83 | 35,34 | 32,95 | 20,45 | 27,78 |
| TPBank | 16,00 | 21,88 | 18,10 | 22,73 | 5,68 | 15,28 |
| HDBank | 15,00 | 18,75 | 13,79 | 20,45 | 5,68 | 11,11 |
| Saigonbank | 13,00 | 13,54 | 11,21 | 17,05 | 11,36 | 11,11 |

Đơn vị trong ma trận là phần trăm. So sánh chỉ thực hiện giữa các điểm có cùng trụ cột và cùng phép quy đổi. Không so sánh trực tiếp tổng điểm tiêu chí của hai trụ cột có số lượng tiêu chí khác nhau.

| Trụ cột | Cao nhất | Thấp nhất | Khoảng cách |
| --- | --- | --- | --- |
| Văn hóa | OCB 52,27 | TPBank 5,68 | 46,59 |
| Chiến lược | OCB 57,29 | Saigonbank 13,54 | 43,75 |
| Khách hàng | OCB 49,00 | Saigonbank 13,00 | 36,00 |
| Công nghệ | OCB 45,69 | Saigonbank 11,21 | 34,48 |
| Dữ liệu | OCB 43,06 | HDBank 11,11 | 31,94 |
| Vận hành | OCB 46,59 | Saigonbank 17,05 | 29,55 |

Khoảng cách lớn nhất trong bộ dữ liệu nằm ở trụ cột Văn hóa, đạt 46,59 điểm phần trăm. Đây là khoảng cách giữa ngân hàng có điểm cao nhất và thấp nhất của cùng trụ cột, không phải chênh lệch theo thời gian. Các tiêu chí tạo khoảng cách cần được truy về mức chấm và bằng chứng trước khi rút ra kết luận về tổ chức.

### 4 3 Hồ sơ từng ngân hàng

OCB đạt 48,98% tổng thể. Trong hồ sơ riêng, trụ cột cao nhất là Chiến lược với 57,29%, thấp nhất là Dữ liệu với 43,06%. Nhận định này là so sánh nội bộ giữa các trụ cột của chính ngân hàng trong bộ dữ liệu, không đồng nghĩa toàn bộ hoạt động tại trụ cột thấp nhất đều yếu.

LPBank đạt 34,39% tổng thể. Trong hồ sơ riêng, trụ cột cao nhất là Chiến lược với 45,83%, thấp nhất là Văn hóa với 20,45%. Nhận định này là so sánh nội bộ giữa các trụ cột của chính ngân hàng trong bộ dữ liệu, không đồng nghĩa toàn bộ hoạt động tại trụ cột thấp nhất đều yếu.

TPBank đạt 16,61% tổng thể. Trong hồ sơ riêng, trụ cột cao nhất là Vận hành với 22,73%, thấp nhất là Văn hóa với 5,68%. Nhận định này là so sánh nội bộ giữa các trụ cột của chính ngân hàng trong bộ dữ liệu, không đồng nghĩa toàn bộ hoạt động tại trụ cột thấp nhất đều yếu.

HDBank đạt 14,13% tổng thể. Trong hồ sơ riêng, trụ cột cao nhất là Vận hành với 20,45%, thấp nhất là Văn hóa với 5,68%. Nhận định này là so sánh nội bộ giữa các trụ cột của chính ngân hàng trong bộ dữ liệu, không đồng nghĩa toàn bộ hoạt động tại trụ cột thấp nhất đều yếu.

Saigonbank đạt 12,88% tổng thể. Trong hồ sơ riêng, trụ cột cao nhất là Vận hành với 17,05%, thấp nhất là Dữ liệu với 11,11%. Nhận định này là so sánh nội bộ giữa các trụ cột của chính ngân hàng trong bộ dữ liệu, không đồng nghĩa toàn bộ hoạt động tại trụ cột thấp nhất đều yếu.

### 4 4 Bằng chứng và dữ liệu theo năm

Bộ điểm gộp có 302 mức 0 và 644 bản ghi chưa có URL gốc. Lớp tìm nguồn PDF xác định 391 trên 700 tổ hợp có đoạn liên quan, nhưng các đoạn này vẫn mang trạng thái Chưa đủ bằng chứng để xác nhận mức gộp. Việc thêm nguồn không làm thay đổi điểm Excel.

Lớp năm có 2100 bản ghi, trong đó 209 bản ghi có mức kèm dẫn chứng. Chưa có điểm tổng thể theo năm đủ điều kiện công bố cho toàn bộ bộ chỉ số. Vì vậy báo cáo không tính YoY, không vẽ xu hướng điểm và không diễn giải mức gộp thành tiến bộ của các năm 2023, 2024, 2025.

## 5 Thiết kế sản phẩm và kiểm chứng

### 5 1 Các chức năng phục vụ nghiên cứu

Tổng quan trình bày xếp hạng, KPI và khoảng cách trụ cột. DNA ngân hàng thể hiện hồ sơ sáu trụ cột và so sánh ngân hàng. Trưởng thành số phân loại trên dữ liệu gộp. Bằng chứng hỗ trợ tìm theo mã hoặc từ khóa, bộ lọc trụ cột và mức đạt, so sánh tiêu chí giữa ngân hàng, xem nguồn và đối chiếu theo năm. Phương pháp giải thích công thức, phạm vi và quy tắc dữ liệu thiếu. Tải dữ liệu cung cấp bộ file nộp bài và các PDF tham chiếu.

Các bộ lọc thay đổi cùng phạm vi của bảng, KPI và CSV xuất ra. Trên màn hình nhỏ, bảng có thể cuộn ngang và menu chuyển thành menu gọn. Hiệu ứng chuyển động có nút bật tắt và hỗ trợ thiết lập giảm chuyển động. Hình ảnh ngân hàng và sticker chỉ phục vụ giao diện, không được tính là bằng chứng chấm điểm.

### 5 2 Kiến trúc và lưu trữ

Frontend được xây dựng bằng HTML, CSS và JavaScript. Vercel phục vụ website và API chỉ đọc. Supabase lưu các snapshot dữ liệu nghiên cứu; frontend kiểm tra cùng phiên bản trước khi sử dụng. Khi API không khả dụng, dữ liệu đã lưu được dùng cùng thông báo trạng thái. Tài liệu tải về được cung cấp bằng các đường dẫn công khai, trong khi quyền ghi dữ liệu không cấp cho người xem.

Mã nguồn tách phần pipeline xử lý dữ liệu, dashboard và cấu hình triển khai Vercel. Gói code không bao gồm phiên đăng nhập, khóa quản trị hoặc file môi trường cá nhân. Việc triển khai sản phẩm và việc chốt bằng chứng nghiên cứu là hai bước riêng; website chạy được không xác nhận mọi mức chấm đã được duyệt.

### 5 3 Đối chiếu kết quả

| Nội dung | Kết quả kiểm tra |
| --- | --- |
| Mức chấm và quy đổi | 700 bản ghi output pipeline khớp workbook nguồn trong lượt đối chiếu đã lưu. |
| Điểm trụ cột và tổng thể | Tính lại 30 điểm trụ cột, 5 điểm tổng thể; kiểm tra trọng số bằng nhau và thứ hạng. |
| Dữ liệu thiếu | Phân biệt 0, NA và chưa chấm; giữ điểm năm chưa đầy đủ là trống. |
| Bộ lọc và xuất file | Kiểm tra theo ngân hàng, trụ cột, mức đạt, tìm kiếm và số dòng CSV. |
| Trình duyệt | Đã kiểm tra Chrome headless và mô phỏng mobile; chưa thay thế kiểm thử trên điện thoại thật hoặc mọi engine. |

Các biên bản kiểm tra máy đọc được gồm python-pipeline-results.json, source-and-maturity-results.json và báo cáo QA trình duyệt. File kiểm tra được giữ trong thư mục validation của gói code. Không dùng biên bản kỹ thuật để thay thế việc duyệt nội dung dẫn chứng.

## 6 Giới hạn và nội dung bổ sung

Nguồn công bố có thể thiếu chi tiết về phạm vi triển khai, đơn vị áp dụng hoặc thời điểm hoạt động. Cách công bố của từng ngân hàng cũng khác nhau. Điểm thấp có thể chịu ảnh hưởng của thiếu bằng chứng truy xuất được, nên không suy luận ngân hàng không có hoạt động chỉ từ mức 0. Báo cáo chưa xác minh độc lập toàn bộ công bố.

Các mức gộp tiếp tục là kết quả nghiên cứu sơ bộ trong bộ dữ liệu hiện hành. Đối chiếu theo năm chưa đầy đủ và có thể dẫn tới sửa mức khi bổ sung bằng chứng. Những thay đổi sau này phải lưu lý do, nguồn, trang, đoạn trích, ngày và người duyệt, đồng thời tạo lại các bảng tổng hợp theo cùng phiên dữ liệu.

| Nội dung cần bổ sung | Điều kiện hoàn tất |
| --- | --- |
| Nguồn cho mức gộp | Bổ sung URL truy xuất được, trang, đoạn trích và quyết định duyệt cho các dòng còn thiếu. |
| Quy tắc tổng hợp giai đoạn | Nhóm xác nhận cách dùng bằng chứng nhiều năm và phạm vi của điểm gộp. |
| Mức theo năm | Hoàn thiện các tổ hợp còn thiếu; chỉ công bố điểm năm khi đáp ứng đủ điều kiện. |
| Rà soát dữ liệu | Xử lý 90 cờ kiểm tra của pipeline, gồm 89 trường hợp mức 0 cần duyệt và một cảnh báo cấu trúc năm. |
| Thông tin hồ sơ | Xác nhận thành viên và thông tin lớp trước khi nộp chính thức. |

Đợt nộp hiện tại cung cấp báo cáo, dữ liệu, kết quả, code và link sản phẩm. Các nội dung trên là danh sách bổ sung cho đợt tiếp theo theo yêu cầu môn học. Mã nguồn, dữ liệu và báo cáo được bàn giao tại kho GitHub công khai https://github.com/soitang733/digital-banking-nhom3; bản ZIP được cung cấp kèm trên website.

## Phụ lục A Danh mục 140 tiêu chí

Mỗi tiêu chí có một mã chuẩn trên dashboard và một mã nguồn Excel. Bảng dưới đây liệt kê toàn bộ danh mục; mô tả đủ năm mức chấm tra tại ScoringReview.xlsx, sheet Danh_muc. Mã nguồn được giữ để tìm đúng dòng trong workbook, không trộn mã của hai hệ thống.

### Khách hàng

| Mã chuẩn | Mã Excel | Tiêu chí |
| --- | --- | --- |
| 1.1.1 | 1.1.2001 | Cá nhân hóa trải nghiệm |
| 1.1.2 | 1.1.2002 | Tiếp thị mục tiêu |
| 1.1.3 | 1.1.2003 | Tự tùy chỉnh |
| 1.1.4 | 1.1.2004 | Dễ sử dụng |
| 1.1.5 | 1.1.2005 | - Mức độ hứng thú của khách hàng |
| 1.1.6 | 1.1.2006 | Tương tác số |
| 1.1.7 | 1.1.2007 | Chủ động chăm sóc |
| 1.1.8 | 1.1.2008 | Gắn kết xã hội |
| 1.1.9 | 1.1.2009 | Thúc đẩy - Mức độ trung thành |
| 1.2.1 | 1.2.2001 | Tầm nhìn về trải nghiệm khách hàng |
| 1.2.2 | 1.2.2002 | Thiết kế theo định hướng của trải nghiệm khách hàng |
| 1.2.3 | 1.2.2003 | Có ngân sách đầu tư để đạt các mục tiêu trải nghiệm khách hàng |
| 1.2.4 | 1.2.2004 | Phạm vi danh mục sản phẩm và dịch vụ |
| 1.2.5 | 1.2.2005 | Quá trình đăng ký sử dụng sản phẩm và dịch vụ |
| 1.2.6 | 1.2.2006 | Đa kênh hợp nhất |
| 1.2.7 | 1.2.2007 | Đo lường trải nghiệm khách hàng |
| 1.2.8 | 1.2.2008 | Quản lý hành trình khách hàng |
| 1.3.1 | 1.3.2001 | Góc nhìn 360 độ về khách hàng |
| 1.3.2 | 1.3.2002 | Nguồn khai thác dữ liệu tin cậy duy nhất |
| 1.3.3 | 1.3.2003 | Nhu cầu của khách hàng |
| 1.4.1 | 1.4.2001 | Cam kết thương hiệu |
| 1.4.2 | 1.4.2002 | Xử lý phản ánh khách hàng |
| 1.4.3 | 1.4.2003 | Quyền riêng tư |
| 1.4.4 | 1.4.2004 | Kiểm soát thông tin cá nhân, dữ liệu cá nhân |
| 1.4.5 | 1.4.2005 | Thúc đẩy niềm tin khách hàng |

### Chiến lược

| Mã chuẩn | Mã Excel | Tiêu chí |
| --- | --- | --- |
| 2.1.1 | 2.1.2001 | Chiến lược thương hiệu |
| 2.1.2 | 2.1.2002 | Quản trị thương hiệu |
| 2.1.3 | 2.1.2003 | Chỉ số đo lường thương hiệu |
| 2.1.4 | 2.1.2004 | Chiến lược tiếp thị |
| 2.2.1 | 2.2.2001 | Hệ sinh thái kinh doanh |
| 2.2.2 | 2.2.2002 | Thiết kế hệ sinh thái |
| 2.2.3 | 2.2.2003 | Lựa chọn đối tác |
| 2.3.1 | 2.3.2001 | Ngân sách cho chuyển đổi số |
| 2.3.2 | 2.3.2002 | Đo lường hiệu quả đầu tư |
| 2.3.3 | 2.3.2003 | Đầu tư cải tiến liên tục |
| 2.4.1 | 2.4.2001 | Đánh giá xu hướng ngành |
| 2.4.2 | 2.4.2002 | Đánh giá nhu cầu của khách hàng |
| 2.4.3 | 2.4.2003 | Đánh giá mạng lưới giá trị |
| 2.5.1 | 2.5.2001 | Cân đối danh mục sản phẩm và dịch vụ |
| 2.5.2 | 2.5.2002 | Lộ trình danh mục sản phẩm và dịch vụ |
| 2.5.3 | 2.5.2003 | Đổi mới danh mục sản phẩm và dịch vụ |
| 2.6.1 | 2.6.2001 | Chiến lược phù hợp với tầm nhìn |
| 2.6.2 | 2.6.2002 | Đồng bộ giữa các nhóm kinh doanh/nghiệp vụ và kỹ thuật |
| 2.6.3 | 2.6.2003 | Đo lường các chỉ số |
| 2.6.4 | 2.6.2004 | Quản lý rủi ro |
| 2.6.5 | 2.6.2005 | Lộ trình chuyển đổi |
| 2.6.6 | 2.6.2006 | Áp dụng chiến lược chuyển đổi số |
| 2.6.7 | 2.6.2007 | Quản trị chuyển đổi |
| 2.6.8 | 2.6.2008 | Nhận diện và áp dụng các bài học thành công |

### Công nghệ

| Mã chuẩn | Mã Excel | Tiêu chí |
| --- | --- | --- |
| 3.1.1 | 3.1.2001 | Khung quản trị công nghệ |
| 3.1.2 | 3.1.2002 | Tiêu chuẩn ngành |
| 3.1.3 | 3.1.2003 | Quản lý môi trường |
| 3.1.4 | 3.1.2004 | Quản lý năng lượng |
| 3.1.5 | 3.1.2005 | Công nghệ mới |
| 3.2.1 | 3.2.2001 | Chiến lược/lộ trình công nghệ |
| 3.2.2 | 3.2.2002 | Kiến trúc Microservices &amp; kiến trúc theo hướng dịch vụ (SOA - Service-Oriented Architecture) |
| 3.2.3 | 3.2.2003 | Mã nguồn mở |
| 3.2.4 | 3.2.2004 | Khả năng cấu hình ứng dụng |
| 3.2.5 | 3.2.2005 | Nâng cao năng lực sử dụng điện toán đám mây (Cloud) |
| 3.2.6 | 3.2.2006 | Áp dụng API |
| 3.2.7 | 3.2.2007 | Kiến trúc công nghệ |
| 3.3.1 | 3.3.2001 | Bảo đảm an toàn hệ thống thông tin theo cấp độ |
| 3.3.2 | 3.3.2002 | Phát hiện và giảm thiểu xâm nhập |
| 3.3.3 | 3.3.2003 | Bảo đảm an toàn, an ninh mạng |
| 3.3.4 | 3.3.2004 | Bảo mật vật lý |
| 3.4.1 | 3.4.2001 | Trí tuệ nhân tạo |
| 3.4.2 | 3.4.2002 | Nền tảng dữ liệu lớn |
| 3.4.3 | 3.4.2003 | Công cụ phát triển ứng dụng |
| 3.4.4 | 3.4.2004 | Danh mục công cụ |
| 3.5.1 | 3.5.2001 | Ảo hóa (ví dụ: SDN/NFV) |
| 3.5.2 | 3.5.2002 | Kết nối không dây |
| 3.5.3 | 3.5.2003 | Giao thức Internet |
| 3.5.4 | 3.5.2004 | Internet vạn vật |
| 3.5.5 | 3.5.2005 | Quản lý hạ tầng |
| 3.5.6 | 3.5.2006 | Điều phối nguồn lực |
| 3.5.7 | 3.5.2007 | Điện toán đám mây |
| 3.5.8 | 3.5.2008 | Điện toán biên |
| 3.5.9 | 3.5.2009 | Tự động hóa |

### Vận hành

| Mã chuẩn | Mã Excel | Tiêu chí |
| --- | --- | --- |
| 4.1.1 | 4.1.2001 | Mô hình doanh nghiệp |
| 4.1.2 | 4.1.2002 | Quản lý rủi ro hoạt động |
| 4.1.3 | 4.1.2003 | Sự tuân thủ |
| 4.1.4 | 4.1.2004 | Hoạt động bảo đảm vận hành an toàn trong quản lý tài sản doanh nghiệp |
| 4.2.1 | 4.2.2001 | Đáp ứng yêu cầu kinh doanh/nghiệp vụ |
| 4.2.2 | 4.2.2002 | Tư duy Thiết kế (Design Thinking) |
| 4.2.3 | 4.2.2003 | Phát triển linh hoạt |
| 4.2.4 | 4.2.2004 | Tối ưu hóa quy trình |
| 4.2.5 | 4.2.2005 | Đổi mới liên tục sản phẩm và dịch vụ |
| 4.2.6 | 4.2.2006 | Hợp tác với đối tác |
| 4.3.1 | 4.3.2001 | Quản lý thay đổi hoạt động |
| 4.3.2 | 4.3.2002 | Quản lý phát hành |
| 4.3.3 | 4.3.2003 | DevSecOps |
| 4.3.4 | 4.3.2004 | CI/CD |
| 4.4.1 | 4.4.2001 | Đảm bảo dịch vụ |
| 4.4.2 | 4.4.2002 | SRE |
| 4.4.3 | 4.4.2003 | Hoạt động chuỗi cung ứng |
| 4.4.4 | 4.4.2004 | Đáp ứng yêu cầu sản phẩm và dịch vụ của khách hàng |
| 4.4.5 | 4.4.2005 | Giám sát hoạt động |
| 4.4.6 | 4.4.2006 | Hoạt động quản lý doanh thu |
| 4.4.7 | 4.4.2007 | Hoạt động quản lý gian lận |
| 4.4.8 | 4.4.2008 | Vận hành hệ thống |

### Văn hóa

| Mã chuẩn | Mã Excel | Tiêu chí |
| --- | --- | --- |
| 5.1.1 | 5.1.2001 | Hành vi lãnh đạo |
| 5.1.2 | 5.1.2002 | Tác động của nhân viên |
| 5.1.3 | 5.1.2003 | Giá trị được chia sẻ |
| 5.1.4 | 5.1.2004 | Thất bại có kiểm soát |
| 5.1.5 | 5.1.2005 | Cộng tác ảo |
| 5.1.6 | 5.1.2006 | Sự hoà nhập |
| 5.2.1 | 5.2.2001 | Chính sách đãi ngộ |
| 5.2.2 | 5.2.2002 | Năng lực cơ bản |
| 5.2.3 | 5.2.2003 | Lập kế hoạch phát triển lực lượng lao động |
| 5.2.4 | 5.2.2004 | Thu hút nhân tài |
| 5.2.5 | 5.2.2005 | Nhóm tài năng bên ngoài |
| 5.2.6 | 5.2.2006 | Phát triển tài năng |
| 5.2.7 | 5.2.2007 | Học tập trên môi trường số |
| 5.2.8 | 5.2.2008 | Sự gắn kết của người lao động |
| 5.3.1 | 5.3.2001 | Môi trường thúc đẩy năng suất |
| 5.3.2 | 5.3.2002 | Môi trường thúc đẩy đổi mới sáng tạo |
| 5.3.3 | 5.3.2003 | Công cụ thúc đẩy tăng năng suất |
| 5.3.4 | 5.3.2004 | Công cụ thúc đẩy đổi mới sáng tạo |
| 5.3.5 | 5.3.2005 | Chính sách thúc đẩy tăng năng suất |
| 5.3.6 | 5.3.2006 | Chính sách thúc đẩy đổi mới sáng tạo |
| 5.3.7 | 5.3.2007 | Nắm bắt tri thức |
| 5.3.8 | 5.3.2008 | Chia sẻ tri thức |

### Dữ liệu

| Mã chuẩn | Mã Excel | Tiêu chí |
| --- | --- | --- |
| 6.1.1 | 6.1.2001 | Quản lý siêu dữ liệu |
| 6.1.2 | 6.1.2002 | Quản lý dữ liệu |
| 6.1.3 | 6.1.2003 | Quản lý dữ liệu chủ |
| 6.1.4 | 6.1.2004 | Quản lý bảo mật dữ liệu |
| 6.1.5 | 6.1.2005 | Quản lý chính sách dữ liệu |
| 6.1.6 | 6.1.2006 | Chiến lược dữ liệu |
| 6.1.7 | 6.1.2007 | Tổ chức và vai trò |
| 6.1.8 | 6.1.2008 | Quản lý quyền riêng tư dữ liệu |
| 6.2.1 | 6.2.2001 | Mô hình hoá dữ liệu |
| 6.2.2 | 6.2.2002 | Lưu trữ dữ liệu |
| 6.2.3 | 6.2.2003 | Khả năng truy cập dữ liệu |
| 6.2.4 | 6.2.2004 | Quản lý vòng đời dữ liệu |
| 6.2.5 | 6.2.2005 | Thu thập dữ liệu |
| 6.2.6 | 6.2.2006 | Đảm bảo tính toàn vẹn dữ liệu |
| 6.2.7 | 6.2.2007 | Trực quan hóa dữ liệu |
| 6.3.1 | 6.3.2001 | Ra quyết định dựa trên dữ liệu |
| 6.3.2 | 6.3.2002 | Năng lực khoa học dữ liệu |
| 6.3.3 | 6.3.2003 | Khai thác giá trị kinh tế từ dữ liệu |

## Phụ lục B Ví dụ thang chấm và bằng chứng

### Ví dụ tiêu chí cá nhân hóa trải nghiệm

Tiêu chí 1.1.1 minh họa cách thang trưởng thành tăng theo phạm vi triển khai. Nội dung dưới đây lấy từ danh mục mô tả mức của nhóm; đây không phải một thang mới tạo riêng cho từng ngân hàng.

| Mức | Mô tả |
| --- | --- |
| 1 | Có ít hoặc chưa có cá nhân hóa trong trải nghiệm khách hàng. |
| 2 | Một số khía cạnh trong trải nghiệm khách hàng được cá nhân hóa dựa trên thông tin về khách hàng thu thập được ở một số bộ phận, đơn vị chức năng. |
| 3 | Một số khía cạnh trong trải nghiệm khách hàng được cá nhân hóa dựa trên thông tin về khách hàng thu thập được và triển khai ở một số cụm các bộ phận, đơn vị chức năng. |
| 4 | Tất cả các khía cạnh trong trải nghiệm khách hàng được cá nhân hóa dựa trên thông tin về khách hàng thu thập được và triển khai trong toàn doanh nghiệp. |
| 5 | Tất cả các khía cạnh trong trải nghiệm khách hàng được cá nhân hóa dựa trên thông tin về khách hàng thu thập được, triển khai trong toàn doanh nghiệp và các đối tác trong hệ sinh thái của doanh nghiệp. |

Khi đọc một bằng chứng về cá nhân hóa tại một bộ phận, người chấm đối chiếu điều kiện của từng mức và phạm vi được mô tả. Chỉ nhắc tới AI hoặc dữ liệu khách hàng chưa đủ để kết luận toàn doanh nghiệp hoặc toàn hệ sinh thái đã triển khai cá nhân hóa.

### Ví dụ hồ sơ nguồn theo năm

### TPBank năm 2023 tiêu chí 1.1.4

Mức theo năm 2. Tiêu chuẩn Ngân hàng 5 phút, dịch vụ 5 sao đã giảm thời gian chờ đợi và tăng thuận tiện giao dịch; chứng minh một số tương tác dễ sử dụng, không phải mọi tương tác.

Nguồn Báo cáo phát triển bền vững 2023, trang PDF 99. <link href="https://tpb.vn/wps/wcm/connect/466b5dbf-10cb-4f89-9584-6e0963beaee4/B%C3%A1o+c%C3%A1o+Ph%C3%A1t+tri%E1%BB%83n+b%E1%BB%81n+v%E1%BB%AFng+2023.pdf?MOD=AJPERES&amp;CONVERT_TO=url&amp;CACHEID=ROOTWORKSPACE-466b5dbf-10cb-4f89-9584-6e0963beaee4-pgr-gMx#page=99" color="#225599">Mở đúng trang tài liệu</link>.

Trích đoạn ngắn: TPBank thường xuyên tổ chức khảo sát mức mang lại trải nghiệm tối ưu và phong cách tế, và mở...

### HDBank năm 2023 tiêu chí 1.1.6

Mức theo năm 2. Kênh eBanking có trên 2 triệu người dùng và giao dịch thực tế. Đủ một số tương tác số; tỷ trọng giao dịch không chứng minh hầu hết loại tương tác/hành trình theo rubric.

Nguồn Báo cáo thường niên 2023, trang PDF 48. <link href="https://static2.vietstock.vn/data/HOSE/2023/BCTN/VN/HDB_Baocaothuongnien_2023.pdf#page=48" color="#225599">Mở đúng trang tài liệu</link>.

Trích đoạn ngắn: ĐIỂM NHẤN HOẠT ĐỘNG CHUYỂN ĐỔI SỐ ▶ Số hóa thành công việc lưu trữ văn bản tài liệu lên...

### LP Bank năm 2023 tiêu chí 3.1.2

Mức theo năm 2. Đã được cấp PCI DSS3.2.1 cho thanh toán thẻ và CSP cho SWIFT trong 2023; sử dụng tiêu chuẩn để bảo mật và bảo vệ khách hàng. Chưa đủ tận dụng tối đa mọi tiêu chuẩn ngành.

Nguồn Báo cáo phát triển bền vững 2023, trang PDF 18. <link href="https://lpbank.com.vn/api/content-file/uploads/2024/06/LPBank-ESG-Report-2023-FINAL.pdf#page=18" color="#225599">Mở đúng trang tài liệu</link>.

Trích đoạn ngắn: ĐÀO TẠO BẢO MẬT DỮ LIỆU NÂNG CẤP HỆ THỐNG BẢO MẬT QUY ĐỊNH VỀ BẢO VỆ DỮ LIỆU QUẢN...

### OCB năm 2023 tiêu chí 1.1.1

Mức theo năm 2. AppsFlyer phân tích hành vi và cung cấp dịch vụ phù hợp nhu cầu; hỗ trợ cá nhân hóa ở một số hành trình, chưa đủ phạm vi cụm/toàn doanh nghiệp.

Nguồn Báo cáo phát triển bền vững 2023, trang PDF 39. <link href="https://webocb-api.ocb.com.vn/Resources/Files/20250319141014_bao-cao-ptbv-2023.pdf#page=39" color="#225599">Mở đúng trang tài liệu</link>.

Trích đoạn ngắn: ạn. Điển hình như với nền tảng ứng dụng tiếp thị AppsFlyer, Ngân hàng có thể phân tích hành vi...

### SaigonBank năm 2023 tiêu chí 1.1.6

Mức theo năm 2. Có tương tác số đã triển khai trong năm: eKYC và rút tiền QR tại ATM. Phù hợp mức 2 (một số tương tác); báo cáo không chứng minh hầu hết/toàn bộ tương tác trên kênh số.

Nguồn Báo cáo thường niên 2023, trang PDF 5. <link href="https://static2.vietstock.vn/data/HNX/2023/BCTN/VN/SGB_Baocaothuongnien_2023.pdf#page=5" color="#225599">Mở đúng trang tài liệu</link>.

Trích đoạn ngắn: Hoàn thành chức năng định danh khách hàng điện tử (eKYC); chính thức triển khai chức năng rút tiền mặt...

Các ví dụ trên chỉ minh họa những bản ghi đã có mức theo năm. Không sử dụng chúng để xác nhận toàn bộ 700 mức gộp hoặc tính điểm năm của cả ngân hàng.

## Phụ lục C Danh mục 23 báo cáo nguồn

Các báo cáo dưới đây xuất hiện trong dẫn chứng theo năm hoặc các đoạn PDF liên quan của bộ dữ liệu. Báo cáo là tài liệu tham khảo; trạng thái của từng đoạn trích vẫn phải xem tại hồ sơ tiêu chí. Trang PDF là trang vật lý, bắt đầu từ 1.

BC01 TPBank 2023<br/>Báo cáo thường niên. 69 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2023/BCTN/VN/TPB_Baocaothuongnien_2023/maket+n%E1%BB%9Bi+x%C3%A9n+2024+-+view+15.4.2024+RESIZE.pdf" color="#225599">Nguồn công bố</link>.

BC02 TPBank 2023<br/>Báo cáo phát triển bền vững. 159 trang PDF. <link href="https://tpb.vn/wps/wcm/connect/466b5dbf-10cb-4f89-9584-6e0963beaee4/B%C3%A1o+c%C3%A1o+Ph%C3%A1t+tri%E1%BB%83n+b%E1%BB%81n+v%E1%BB%AFng+2023.pdf?MOD=AJPERES&amp;CONVERT_TO=url&amp;CACHEID=ROOTWORKSPACE-466b5dbf-10cb-4f89-9584-6e0963beaee4-pgr-gMx" color="#225599">Nguồn công bố</link>.

BC03 TPBank 2024<br/>Báo cáo thường niên. 71 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2024/BCTN/VN/TPB_Baocaothuongnien_2024/BCTN+2024+VIEW+17-4-2025+WEB.pdf" color="#225599">Nguồn công bố</link>.

BC04 TPBank 2024<br/>Báo cáo phát triển bền vững. 100 trang PDF. <link href="https://tpb.vn/wps/wcm/connect/36035be7-468c-459e-a586-fc20f694f0c0/2025.11.03+TPBank+_+B%C3%A1o+c%C3%A1o+ph%C3%A1t+tri%E1%BB%83n+b%E1%BB%81n+v%E1%BB%AFng+n%C4%83m+2024+BOD+ph%C3%AA+duy%E1%BB%87t.pdf?MOD=AJPERES&amp;CONVERT_TO=url&amp;CACHEID=ROOTWORKSPACE-36035be7-468c-459e-a586-fc20f694f0c0-pFhGccW" color="#225599">Nguồn công bố</link>.

BC05 TPBank 2025<br/>Báo cáo thường niên. 79 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2025/BCTN/VN/TPB_Baocaothuongnien_2025/BCTN+2026+TV+20.4+VIEW-2.pdf" color="#225599">Nguồn công bố</link>.

BC06 HDBank 2023<br/>Báo cáo thường niên. 154 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2023/BCTN/VN/HDB_Baocaothuongnien_2023.pdf" color="#225599">Nguồn công bố</link>.

BC07 HDBank 2024<br/>Báo cáo thường niên. 155 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2024/BCTN/VN/HDB_Baocaothuongnien_2024/BCTN-HDBANK-2024.pdf" color="#225599">Nguồn công bố</link>.

BC08 HDBank 2024<br/>Báo cáo phát triển bền vững. 88 trang PDF. <link href="https://cdn.hdbank.com.vn/hdbank-file/investor/editor/hBq9tyQKyon6Vy639Fay20250522150705/HDBankESGReport202420250522_1747901249549.pdf?_gl=1*1ig2u22*_gcl_au*MTY1ODk5MzEyOS4xNzkxMjEyMTgz*_ga*MjEzNjk5Njk2OC4xNzkxMjEyMTgy*_ga_L6TMDVXKWJ*czE3OTEyMTIxODMkbzEkZzEkdDE3OTEyMTIyNDYkajYwJGwwJGgw" color="#225599">Nguồn công bố</link>.

BC09 HDBank 2025<br/>Báo cáo thường niên. 139 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2025/BCTN/VN/HDB_Baocaothuongnien_2025/20260420_HDBANK%20AR%202025_VN_V404_doi.pdf" color="#225599">Nguồn công bố</link>.

BC10 HDBank 2025<br/>Báo cáo phát triển bền vững. 83 trang PDF. <link href="https://cdn.hdbank.com.vn/hdbank/bctn/2025/bcptbv/v1/HDB_ESG%20Report%202025_Full_under%2030MB.pdf" color="#225599">Nguồn công bố</link>.

BC11 OCB 2023<br/>Báo cáo thường niên. 202 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2023/BCTN/VN/OCB_Baocaothuongnien_2023.pdf" color="#225599">Nguồn công bố</link>.

BC12 OCB 2023<br/>Báo cáo phát triển bền vững. 58 trang PDF. <link href="https://webocb-api.ocb.com.vn/Resources/Files/20250319141014_bao-cao-ptbv-2023.pdf" color="#225599">Nguồn công bố</link>.

BC13 OCB 2024<br/>Báo cáo thường niên. 200 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2024/BCTN/VN/OCB_Baocaothuongnien_2024.pdf" color="#225599">Nguồn công bố</link>.

BC14 OCB 2024<br/>Báo cáo phát triển bền vững. 71 trang PDF. <link href="https://webocb-api.ocb.com.vn/Resources/Files/20250923154047_bao-cao-phat-trien-ben-vung-2024.pdf" color="#225599">Nguồn công bố</link>.

BC15 OCB 2025<br/>Báo cáo thường niên. 230 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2025/BCTN/VN/OCB_Baocaothuongnien_2025_1.pdf" color="#225599">Nguồn công bố</link>.

BC16 OCB 2025<br/>Báo cáo phát triển bền vững. 145 trang PDF. <link href="https://webocb-api.ocb.com.vn/Resources/Files/20260826145747_2608-bc-ptbv-2025-vn.pdf" color="#225599">Nguồn công bố</link>.

BC17 LP Bank 2023<br/>Báo cáo thường niên. 86 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2023/BCTN/VN/LPB_Baocaothuongnien_2023/LPBank%20-%20Bao%20cao%20thuong%20nien%202023.pdf" color="#225599">Nguồn công bố</link>.

BC18 LP Bank 2023<br/>Báo cáo phát triển bền vững. 46 trang PDF. <link href="https://lpbank.com.vn/api/content-file/uploads/2024/06/LPBank-ESG-Report-2023-FINAL.pdf" color="#225599">Nguồn công bố</link>.

BC19 LP Bank 2024<br/>Báo cáo thường niên. 100 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2024/BCTN/VN/LPB_Baocaothuongnien_2024.pdf" color="#225599">Nguồn công bố</link>.

BC20 LP Bank 2025<br/>Báo cáo thường niên. 119 trang PDF. <link href="https://static2.vietstock.vn/data/HOSE/2025/BCTN/VN/LPB_Baocaothuongnien_2025.pdf" color="#225599">Nguồn công bố</link>.

BC21 SaigonBank 2023<br/>Báo cáo thường niên. 21 trang PDF. <link href="https://static2.vietstock.vn/data/HNX/2023/BCTN/VN/SGB_Baocaothuongnien_2023.pdf" color="#225599">Nguồn công bố</link>.

BC22 SaigonBank 2024<br/>Báo cáo thường niên. 81 trang PDF. <link href="https://static2.vietstock.vn/data/HNX/2024/BCTN/VN/SGB_Baocaothuongnien_2024/1_sgb_2025_4_17_56f822a_vi_baocaothuongnien_2024.pdf" color="#225599">Nguồn công bố</link>.

BC23 SaigonBank 2025<br/>Báo cáo thường niên. 77 trang PDF. <link href="https://static2.vietstock.vn/data/HNX/2025/BCTN/VN/SGB_Baocaothuongnien_2025/1_sgb_2026_4_20_43bf2b9_vi_baocaothuongnien_2025_compressedda_ky.pdf" color="#225599">Nguồn công bố</link>.

## Phụ lục D File bàn giao và tái lập kết quả

| Nhóm yêu cầu | File hoặc vị trí |
| --- | --- |
| Báo cáo | Bao-cao-nghien-cuu-ngan-hang-so.pdf; bản văn bản đi kèm trong gói nộp. |
| Dữ liệu chấm điểm | Excel/CleanData.xlsx; data đầu vào gốc trong Code/pipeline/data/Data Feasibility.xlsx. |
| Tiêu chí và mô tả mức | Excel/ScoringReview.xlsx, sheet Danh_muc. |
| Kết quả chấm điểm | Excel/DBI_DigitalScore_theo_tieu_chi.xlsx, sheet Digital_Score_Rank và Chi_tiet_tieu_chi. |
| Kết quả phân tích | Excel/AnalysisDataset.xlsx. |
| Code | Code/ gồm pipeline, dashboard và bank-dashboard-cloud. |
| Sản phẩm | https://digital-banking-nhom3.vercel.app |
| Nội dung bổ sung | Chương 6 và README trong gói nộp. |

### Chạy dữ liệu và website

Yêu cầu Python từ 3.10, Node.js từ 22 và trình duyệt hiện đại. Trong môi trường Python đã kích hoạt, cài các thư viện của pipeline bằng python -m pip install -r pipeline/requirements.txt rồi chạy python pipeline/run_pipeline.py. Bốn output được tạo trong pipeline/output. Để xem frontend đã đóng gói, chuyển vào thư mục dashboard và chạy node serve.mjs theo README của gói code; trang local dùng cổng 4173.

Kiểm tra logic frontend bằng node check-dashboard.mjs từ dashboard. Bản cloud có npm run build và npm run check trong bank-dashboard-cloud; cần cấu hình Supabase của nhóm trước khi triển khai lên tài khoản mới. Gói code có sẵn snapshot để dùng frontend local mà không cần tài khoản cloud.

Để tái tạo lớp PDF, cần tải các tài liệu trong danh mục vào pipeline/data/reports, trích văn bản và OCR theo README. Các công cụ OCR dùng Windows và không phải yêu cầu để xem dashboard hoặc tái tính bộ Excel. Tải PDF không đồng nghĩa đã duyệt mức chấm.

### Tài liệu phương pháp và dữ liệu nội bộ

ScoringReview.xlsx cung cấp thang mô tả 1 đến 5; DBI_DigitalScore_theo_tieu_chi.xlsx cung cấp mức chấm, quy đổi và điểm; AnalysisDataset.xlsx cung cấp bảng phân tích. Các file source-metadata.json và research-policy.json lưu ánh xạ mã và quy tắc. Đường dẫn báo cáo gốc ở Phụ lục C là nguồn bên ngoài; workbook của nhóm là nguồn dữ liệu nghiên cứu và không được coi là công bố xác nhận của ngân hàng.