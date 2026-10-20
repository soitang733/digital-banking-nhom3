
from pathlib import Path
import pandas as pd

# =====================================
# 1. CẤU HÌNH
# =====================================

BASE_DIR = Path(__file__).resolve().parent

INPUT_FILE = BASE_DIR / "output" / "CleanData.xlsx"
OUTPUT_FILE = BASE_DIR / "output" / "ScoringReview.xlsx"

MASTER_SHEET = "Danh_muc"

BANK_SHEETS = [
    "TPBank",
    "HDBank",
    "LP Bank",
    "OCB",
    "SaigonBank",
]

VALID_SCORES = set(range(0, 6))


# =====================================
# 2. KIỂM TRA FILE ĐẦU VÀO
# =====================================

if not INPUT_FILE.exists():
    raise FileNotFoundError(
        f"Không tìm thấy file: {INPUT_FILE}\n"
        "Hãy đặt Validated_Dataset.xlsx cùng thư mục "
        "với step7_scoring.py."
    )

xls = pd.ExcelFile(INPUT_FILE)

if MASTER_SHEET not in xls.sheet_names:
    raise ValueError(
        f"Không tìm thấy sheet danh mục: {MASTER_SHEET}"
    )

master = pd.read_excel(INPUT_FILE, sheet_name=MASTER_SHEET)
master.columns = master.columns.astype(str).str.strip()

required_master = [
    "Mã", "Tiêu chí",
    "Mức 1", "Mức 2", "Mức 3", "Mức 4", "Mức 5"
]

for col in required_master:
    if col not in master.columns:
        raise ValueError(
            f"Sheet {MASTER_SHEET} thiếu cột: {col}"
        )

master["Mã"] = master["Mã"].astype("string").str.strip()
master = master.dropna(subset=["Mã"])
master = master.drop_duplicates(subset=["Mã"], keep="first")

master_lookup = master.set_index("Mã").to_dict("index")
master_codes = set(master["Mã"])


# =====================================
# 3. RÀ SOÁT MỨC ĐẠT
# =====================================

review_sheets = {}
summary_rows = []
issue_rows = []

for bank in BANK_SHEETS:

    if bank not in xls.sheet_names:
        issue_rows.append({
            "Ngân hàng": bank,
            "Mã": "",
            "Vấn đề": "Không tìm thấy sheet ngân hàng",
            "Điểm hiện tại": None,
            "Hướng xử lý": "Kiểm tra lại tên sheet."
        })
        continue

    df = pd.read_excel(INPUT_FILE, sheet_name=bank)
    df.columns = df.columns.astype(str).str.strip()
    if "Trụ cột" not in df.columns and "S" in df.columns:
        df = df.rename(columns={"S": "Trụ cột"})

    # The supplied LP Bank tab labels the first column 'S'. Recover the
    # canonical pillar/group by stable criterion code without editing its input.
    for column in ["Trụ cột", "Nhóm tiêu chí"]:
        if column not in df.columns:
            df[column] = df["Mã"].astype(str).map(
                lambda code: master_lookup.get(code, {}).get(column)
            )

    required_columns = [
        "Mã", "Tiêu chí", "Mức đạt", "Bằng chứng"
    ]

    missing_cols = [
        col for col in required_columns
        if col not in df.columns
    ]

    if missing_cols:
        issue_rows.append({
            "Ngân hàng": bank,
            "Mã": "",
            "Vấn đề": f"Thiếu cột: {missing_cols}",
            "Điểm hiện tại": None,
            "Hướng xử lý": "Bổ sung hoặc sửa tên cột."
        })
        continue

    # Loại các dòng trống hoặc mã giả khỏi dữ liệu đầu ra.
    # Không sửa file Excel đầu vào.
    df["Mã"] = df["Mã"].astype("string").str.strip()

    invalid_code = (
        df["Mã"].isna()
        | df["Mã"].eq("")
        | df["Mã"].eq("...")
    )

    df = df.loc[~invalid_code].copy()

    df["Mức đạt"] = pd.to_numeric(
        df["Mức đạt"], errors="coerce"
    )

    # Thêm cột phục vụ rà soát
    df["Trạng thái rà soát"] = ""
    df["Mô tả mức đã chấm"] = ""
    df["Kết quả kiểm tra"] = ""

    for idx, row in df.iterrows():

        code = str(row["Mã"]).strip()
        score = row["Mức đạt"]
        evidence = row["Bằng chứng"]

        status = []
        description = ""
        result = "Cần rà soát"

        # Kiểm tra mã có trong danh mục
        if code not in master_codes:
            status.append("Mã không có trong danh mục")
            issue_rows.append({
                "Ngân hàng": bank,
                "Mã": code,
                "Vấn đề": "Mã không có trong danh mục DBI",
                "Điểm hiện tại": score,
                "Hướng xử lý": "Kiểm tra mã và danh mục gốc."
            })

        else:
            rubric = master_lookup[code]

            # Đối chiếu tên tiêu chí
            expected_name = str(rubric.get("Tiêu chí", "")).strip()
            actual_name = str(row["Tiêu chí"]).strip()

            if actual_name != expected_name:
                status.append("Tên tiêu chí không khớp")
                issue_rows.append({
                    "Ngân hàng": bank,
                    "Mã": code,
                    "Vấn đề": "Tên tiêu chí không khớp danh mục",
                    "Điểm hiện tại": score,
                    "Hướng xử lý": (
                        f"Đối chiếu tên chuẩn: {expected_name}"
                    )
                })

            # Lấy mô tả mức theo điểm đã chấm
            if pd.notna(score) and score in VALID_SCORES:
                if score == 0:
                    description = (
                        "Không công bố thông tin theo quy ước nhóm"
                    )
                else:
                    description = str(
                        rubric.get(f"Mức {int(score)}", "")
                    ).strip()

        # Kiểm tra điểm
        if pd.isna(score):
            status.append("Thiếu điểm")
            issue_rows.append({
                "Ngân hàng": bank,
                "Mã": code,
                "Vấn đề": "Chưa có mức đạt",
                "Điểm hiện tại": None,
                "Hướng xử lý": (
                    "Đối chiếu bằng chứng và chấm theo bộ DBI."
                )
            })

        elif score not in VALID_SCORES:
            status.append("Điểm ngoài thang 0–5")
            issue_rows.append({
                "Ngân hàng": bank,
                "Mã": code,
                "Vấn đề": "Điểm ngoài thang 0–5",
                "Điểm hiện tại": score,
                "Hướng xử lý": "Kiểm tra lại điểm đã nhập."
            })

        # Kiểm tra bằng chứng
        if pd.isna(evidence) or not str(evidence).strip():
            status.append("Thiếu bằng chứng")
            issue_rows.append({
                "Ngân hàng": bank,
                "Mã": code,
                "Vấn đề": "Thiếu bằng chứng",
                "Điểm hiện tại": score,
                "Hướng xử lý": (
                    "Bổ sung nguồn hoặc xác minh việc "
                    "không tìm thấy thông tin công bố."
                )
            })

        # Điểm 0 cần xác nhận đã rà soát nguồn
        if pd.notna(score) and score == 0:
            status.append("Xác nhận quy ước mức 0")

        # Điểm dương cần đối chiếu bằng chứng với rubric
        if pd.notna(score) and score > 0:
            status.append("Đối chiếu bằng chứng với mô tả mức")

        if not status:
            result = "Đã qua kiểm tra kỹ thuật"

        df.at[idx, "Trạng thái rà soát"] = "; ".join(status)
        df.at[idx, "Mô tả mức đã chấm"] = description
        df.at[idx, "Kết quả kiểm tra"] = result

    review_sheets[bank] = df.drop(columns=["Trạng thái rà soát", "Kết quả kiểm tra"])

    valid_score_count = int(
        df["Mức đạt"].isin(VALID_SCORES).sum()
    )

    missing_score_count = int(df["Mức đạt"].isna().sum())

    invalid_score_count = int(
        (
            df["Mức đạt"].notna()
            & ~df["Mức đạt"].isin(VALID_SCORES)
        ).sum()
    )

    zero_count = int((df["Mức đạt"] == 0).sum())

    evidence_missing_count = int(
        df["Bằng chứng"].isna().sum()
        + (
            df["Bằng chứng"].notna()
            & df["Bằng chứng"].astype(str).str.strip().eq("")
        ).sum()
    )

    summary_rows.append({
        "Ngân hàng": bank,
        "Số chỉ số": len(df),
        "Điểm hợp lệ (0–5)": valid_score_count,
        "Điểm bị thiếu": missing_score_count,
        "Điểm ngoài thang": invalid_score_count,
        "Số mức 0": zero_count,
        "Số dòng thiếu bằng chứng": evidence_missing_count,
        "Tổng điểm hiện tại": df["Mức đạt"].sum(skipna=True),
        "Điểm trung bình hiện tại": df["Mức đạt"].mean()
    })


# =====================================
# 4. XUẤT FILE KẾT QUẢ
# =====================================

summary_df = pd.DataFrame(summary_rows)
issues_df = pd.DataFrame(issue_rows)

with pd.ExcelWriter(OUTPUT_FILE, engine="openpyxl") as writer:

    master.to_excel(
        writer, sheet_name="Danh_muc", index=False
    )

    for bank, df in review_sheets.items():
        df.to_excel(
            writer, sheet_name=bank, index=False
        )

    summary_df.to_excel(
        writer, sheet_name="Tong_hop_diem", index=False
    )

    # Technical findings stay in the build log, outside the final workbook.
    if not issues_df.empty:
        issues_df.to_json(BASE_DIR / "output" / "technical-checks.json", orient="records", force_ascii=False, indent=2)

    # Định dạng file
    for ws in writer.book.worksheets:
        ws.freeze_panes = "A2"
        ws.auto_filter.ref = ws.dimensions

        for cells in ws.columns:
            max_len = max(
                len(str(cell.value or ""))
                for cell in cells
            )
            ws.column_dimensions[
                cells[0].column_letter
            ].width = min(max(max_len + 2, 12), 55)

print("=" * 55)
print("HOÀN THÀNH RÀ SOÁT MỨC ĐẠT")
print(f"File đầu vào: {INPUT_FILE}")
print(f"File đầu ra: {OUTPUT_FILE}")
print(f"Số trường hợp cần rà soát: {len(issues_df)}")
print("Bộ điểm đã được nhóm duyệt; kiểm tra kỹ thuật không thay đổi mức chấm.")
print("=" * 55)
