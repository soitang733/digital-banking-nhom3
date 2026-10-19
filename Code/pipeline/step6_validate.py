
from pathlib import Path
import pandas as pd
import re

# =========================
# 1. CẤU HÌNH
# =========================

BASE_DIR = Path(__file__).resolve().parent

# Đổi đường dẫn này nếu file Excel nằm ở thư mục khác
INPUT_FILE = BASE_DIR / "data" / "Data Feasibility.xlsx"

OUTPUT_FILE = BASE_DIR / "output" / "CleanData.xlsx"

MASTER_SHEET = "Chỉ số DBI"

BANK_SHEETS = [
    "TPBank",
    "HDBank",
    "LP Bank",
    "OCB",
    "SaigonBank",
]

REQUIRED_BANK_COLUMNS = [
    "Mã",
    "Tiêu chí",
    "Mức đạt",
    "Bằng chứng",
]

VALID_SCORES = {0, 1, 2, 3, 4, 5}


# =========================
# 2. HÀM CHUẨN HÓA
# =========================

def clean_text(value):
    """Chuẩn hóa khoảng trắng, giữ nguyên nội dung."""
    if pd.isna(value):
        return value

    value = str(value).strip()
    value = re.sub(r"\s+", " ", value)

    return value if value else pd.NA


def clean_code(value):
    """Chuẩn hóa mã chỉ số nhưng không tự sửa mã sai."""
    value = clean_text(value)

    if pd.isna(value):
        return pd.NA

    return value


issues = []
cleaned_sheets = {}
summary_rows = []


def add_issue(sheet, code, category, detail, severity="Cần rà soát"):
    issues.append({
        "Sheet": sheet,
        "Mã": code,
        "Loại lỗi": category,
        "Chi tiết": detail,
        "Trạng thái": severity,
    })


# =========================
# 3. ĐỌC DANH MỤC CHỈ SỐ
# =========================

if not INPUT_FILE.exists():
    raise FileNotFoundError(
        f"Không tìm thấy file: {INPUT_FILE}\n"
        "Hãy đặt file Excel cùng thư mục với code "
        "hoặc sửa INPUT_FILE cho đúng đường dẫn."
    )

master = pd.read_excel(
    INPUT_FILE,
    sheet_name=MASTER_SHEET
)

master.columns = master.columns.astype(str).str.strip()

required_master = ["Mã", "Tiêu chí"]

for col in required_master:
    if col not in master.columns:
        raise ValueError(
            f"Sheet '{MASTER_SHEET}' thiếu cột '{col}'."
        )

master["Mã"] = master["Mã"].apply(clean_code)
master["Tiêu chí"] = master["Tiêu chí"].apply(clean_text)

# Chỉ lấy các dòng có mã chỉ số
master = master[master["Mã"].notna()].copy()

# Danh mục gốc có thể chứa các ô gộp
for col in ["Trụ cột", "Nhóm tiêu chí"]:
    if col in master.columns:
        master[col] = master[col].apply(clean_text)
        master[col] = master[col].ffill()

# Kiểm tra mã trùng trong danh mục gốc
duplicated_master = master[
    master["Mã"].duplicated(keep=False)
]

for _, row in duplicated_master.iterrows():
    add_issue(
        MASTER_SHEET,
        row["Mã"],
        "Trùng mã trong danh mục",
        "Mã chỉ số xuất hiện nhiều lần trong sheet danh mục."
    )

master_codes = set(master["Mã"].dropna())

master_lookup = master.drop_duplicates("Mã").set_index("Mã")


# =========================
# 4. KIỂM TRA TỪNG NGÂN HÀNG
# =========================

xls = pd.ExcelFile(INPUT_FILE)

for sheet in BANK_SHEETS:

    if sheet not in xls.sheet_names:
        add_issue(
            sheet, "",
            "Thiếu sheet",
            "Không tìm thấy sheet ngân hàng trong file.",
            "Lỗi"
        )
        continue

    df = pd.read_excel(INPUT_FILE, sheet_name=sheet)
    df.columns = df.columns.astype(str).str.strip()

    missing_columns = [
        col for col in REQUIRED_BANK_COLUMNS
        if col not in df.columns
    ]

    if missing_columns:
        add_issue(
            sheet, "",
            "Thiếu cột bắt buộc",
            f"Các cột bị thiếu: {missing_columns}",
            "Lỗi"
        )
        continue

    # Chỉ lấy các cột phục vụ kiểm tra.
    # Bỏ các cột Unnamed do định dạng Excel thừa.
    df = df[REQUIRED_BANK_COLUMNS].copy()

    # Chuẩn hóa dữ liệu dạng văn bản
    for col in ["Mã", "Tiêu chí", "Bằng chứng"]:
        df[col] = df[col].apply(
            clean_code if col == "Mã" else clean_text
        )

    # Chuẩn hóa mã và loại bỏ dòng trống / mã giả
    df["Mã"] = df["Mã"].astype("string").str.strip()

    invalid_code = (
    df["Mã"].isna()
    | df["Mã"].eq("")
    | df["Mã"].eq("...")
)

    df = df.loc[~invalid_code].copy()

    # Kiểm tra mã trùng
    duplicated = df[df["Mã"].duplicated(keep=False)]

    for _, row in duplicated.iterrows():
        add_issue(
            sheet,
            row["Mã"],
            "Trùng mã",
            "Mã chỉ số xuất hiện nhiều lần trong sheet ngân hàng."
        )

    # Kiểm tra mã không tồn tại trong danh mục gốc
    for _, row in df.iterrows():
        code = row["Mã"]

        if code not in master_codes:
            add_issue(
                sheet,
                code,
                "Mã không hợp lệ",
                "Mã không có trong sheet Chỉ số DBI. "
                "Kiểm tra lỗi gõ hoặc dòng dữ liệu thừa.",
                "Lỗi"
            )

    bank_codes = set(df["Mã"].dropna())

    # Kiểm tra thiếu mã so với danh mục
    missing_codes = master_codes - bank_codes

    for code in sorted(missing_codes):
        add_issue(
            sheet,
            code,
            "Thiếu chỉ số",
            "Danh mục có mã này nhưng sheet ngân hàng chưa có."
        )

    # Kiểm tra tên tiêu chí
    for _, row in df.iterrows():
        code = row["Mã"]

        if code not in master_codes:
            continue

        expected_name = master_lookup.loc[code, "Tiêu chí"]
        actual_name = row["Tiêu chí"]

        if pd.isna(actual_name) or not str(actual_name).strip():
            add_issue(
                sheet,
                code,
                "Thiếu tên tiêu chí",
                "Chưa có tên tiêu chí."
            )
        elif clean_text(actual_name) != clean_text(expected_name):
            add_issue(
                sheet,
                code,
                "Tên tiêu chí không khớp",
                f"Tên trong danh mục: {expected_name}; "
                f"tên trong sheet: {actual_name}"
            )

    # Chuẩn hóa điểm về dạng số để kiểm tra
    df["Mức đạt"] = pd.to_numeric(
        df["Mức đạt"],
        errors="coerce"
    )

    for _, row in df.iterrows():
        code = row["Mã"]
        score = row["Mức đạt"]
        evidence = row["Bằng chứng"]

        # Kiểm tra điểm trống hoặc không phải số
        if pd.isna(score):
            add_issue(
                sheet,
                code,
                "Thiếu điểm",
                "Mức đạt trống hoặc không phải giá trị số."
            )

        elif score not in VALID_SCORES:
            add_issue(
                sheet,
                code,
                "Điểm ngoài thang đo",
                f"Điểm hiện tại là {score}; "
                "cần kiểm tra thang điểm 0–5.",
                "Lỗi"
            )

        # Kiểm tra bằng chứng trống
        if pd.isna(evidence) or not str(evidence).strip():
            add_issue(
                sheet,
                code,
                "Thiếu bằng chứng",
                "Chưa có nội dung giải thích hoặc dẫn chứng."
            )

        # Kiểm tra trường hợp mức 0
        # Không tự đổi điểm; chỉ nhắc rà soát bằng chứng.
        if score == 0 and pd.notna(evidence):
            if "chưa tìm thấy" not in str(evidence).lower():
                add_issue(
                    sheet,
                    code,
                    "Rà soát mức 0",
                    "Xác nhận đã rà soát nguồn và thực sự "
                    "không có thông tin công bố."
                )

    # Bổ sung trụ cột và nhóm tiêu chí từ danh mục gốc
    # Không ghi đè nếu cần giữ lại dữ liệu ban đầu để so sánh.
    df["Trụ cột"] = df["Mã"].map(
        master_lookup["Trụ cột"]
    )
    df["Nhóm tiêu chí"] = df["Mã"].map(
        master_lookup["Nhóm tiêu chí"]
    )

    # Đưa cột về thứ tự dễ đọc
    output_columns = [
        "Trụ cột",
        "Nhóm tiêu chí",
        "Mã",
        "Tiêu chí",
        "Mức đạt",
        "Bằng chứng",
    ]

    df = df[output_columns].reset_index(drop=True)
    cleaned_sheets[sheet] = df

    summary_rows.append({
        "Ngân hàng": sheet,
        "Số mã ghi nhận": len(bank_codes),
        "Số mã hợp lệ": len(bank_codes & master_codes),
        "Số mã thiếu": len(missing_codes),
        "Số dòng trùng mã": int(
            df["Mã"].duplicated(keep=False).sum()
        ),
        "Số điểm trống": int(df["Mức đạt"].isna().sum()),
        "Số bằng chứng trống": int(df["Bằng chứng"].isna().sum()),
    })


# =========================
# 5. GHI CHÚ VỀ NĂM DỮ LIỆU
# =========================

# File hiện tại chưa có cột Năm riêng.
# Không tự suy đoán năm từ nội dung bằng chứng.
add_issue(
    "Toàn bộ dữ liệu",
    "",
    "Chưa kiểm tra được năm tự động",
    "Các sheet ngân hàng chưa có cột Năm riêng. "
    "Cần xác nhận bằng chứng thuộc năm 2023, 2024 hay 2025 "
    "trước khi phân tích theo năm.",
    "Cần bổ sung cấu trúc"
)


# =========================
# 6. XUẤT FILE KIỂM TRA
# =========================

issues_df = pd.DataFrame(issues)
summary_df = pd.DataFrame(summary_rows)

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
with pd.ExcelWriter(OUTPUT_FILE, engine="openpyxl") as writer:

    # Giữ lại danh mục chỉ số
    master.to_excel(
        writer,
        sheet_name="Danh_muc",
        index=False
    )

    # Ghi các sheet ngân hàng đã chuẩn hóa
    for sheet, df in cleaned_sheets.items():
        df.to_excel(
            writer,
            sheet_name=sheet,
            index=False
        )

    summary_df.to_excel(
        writer,
        sheet_name="Tong_hop",
        index=False
    )

    issues_df.to_excel(
        writer,
        sheet_name="Loi_can_ra_soat",
        index=False
    )

    # Định dạng dễ đọc
    for ws in writer.book.worksheets:
        ws.freeze_panes = "A2"
        ws.auto_filter.ref = ws.dimensions

        for column_cells in ws.columns:
            max_length = max(
                len(str(cell.value or ""))
                for cell in column_cells
            )
            ws.column_dimensions[
                column_cells[0].column_letter
            ].width = min(max(max_length + 2, 12), 55)


print("=" * 55)
print("HOÀN TẤT KIỂM TRA DỮ LIỆU")
print(f"File đầu vào: {INPUT_FILE}")
print(f"File đầu ra:  {OUTPUT_FILE}")
print(f"Số vấn đề cần rà soát: {len(issues_df)}")
print("Mở sheet 'Loi_can_ra_soat' để xem chi tiết.")
print("=" * 55)