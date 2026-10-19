
from pathlib import Path
import pandas as pd

# Thư mục dự án
BASE_DIR = Path(__file__).resolve().parent

# File đầu vào: kết quả bước 7
INPUT_FILE = BASE_DIR / "output" / "ScoringReview.xlsx"
# File đầu ra của bước 9
OUTPUT_FILE = BASE_DIR / "output" / "AnalysisDataset.xlsx"

BANKS = ["TPBank", "HDBank", "LP Bank", "OCB", "SaigonBank"]


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Không tìm thấy file đầu vào: {INPUT_FILE}\n"
            "Hãy sửa INPUT_FILE theo vị trí thực tế của file."
        )

    excel = pd.ExcelFile(INPUT_FILE)
    print("Các sheet hiện có:", excel.sheet_names)

    # Đọc từng ngân hàng
    frames = []

    for bank in BANKS:
        if bank not in excel.sheet_names:
            print(f"Bỏ qua sheet không tìm thấy: {bank}")
            continue

        df = pd.read_excel(INPUT_FILE, sheet_name=bank)

        required = ["Mã", "Mức đạt"]
        missing = [col for col in required if col not in df.columns]

        if missing:
            print(f"Sheet {bank} thiếu cột: {missing}")
            continue

        df["Ngân hàng"] = bank
        df["Mức đạt"] = pd.to_numeric(
            df["Mức đạt"], errors="coerce"
        )
        frames.append(df)

    if not frames:
        raise ValueError(
            "Không đọc được sheet ngân hàng. "
            "Kiểm tra tên sheet và cấu trúc file."
        )

    data = pd.concat(frames, ignore_index=True)

    # 1. So sánh điểm tổng thể
    bank_summary = (
        data.groupby("Ngân hàng")
        .agg(
            So_chi_so=("Mã", "count"),
            Tong_diem=("Mức đạt", "sum"),
            Diem_TB=("Mức đạt", "mean"),
            So_muc_0=("Mức đạt", lambda x: (x == 0).sum()),
        )
        .reset_index()
    )

    bank_summary["Diem_TB"] = bank_summary["Diem_TB"].round(3)
    bank_summary["Rank_so_bo"] = (
        bank_summary["Tong_diem"]
        .rank(method="min", ascending=False)
        .astype(int)
    )

    # Keep the raw-level rank as a separate measure; use the same Digital Score as the dashboard.
    bank_summary = bank_summary.rename(columns={"Rank_so_bo": "Rank_muc_dat_TB"})
    digital_path = BASE_DIR / "output" / "DBI_DigitalScore_theo_tieu_chi.xlsx"
    if not digital_path.exists():
        raise FileNotFoundError("Run step8_digital_score.py before step9_analysis.py")
    digital = pd.read_excel(digital_path, sheet_name="Digital_Score_Rank")
    digital = digital[["Ngân hàng", "Digital Score (%)", "Rank"]].rename(columns={"Rank": "Rank_so_bo"})
    bank_summary = bank_summary.merge(digital, on="Ngân hàng", validate="one_to_one")

    bank_summary = bank_summary.sort_values(
        ["Rank_so_bo", "Ngân hàng"]
    )

    # 2. Phân tích điểm theo trụ cột
    pillar_col = next(
        (
            col for col in ["Trụ cột", "Tru cot", "Pillar"]
            if col in data.columns
        ),
        None,
    )

    if pillar_col:
        pillar_summary = (
            data.groupby(["Ngân hàng", pillar_col])
            .agg(
                So_chi_so=("Mã", "count"),
                Tong_diem=("Mức đạt", "sum"),
                Diem_TB=("Mức đạt", "mean"),
            )
            .reset_index()
        )

        pillar_summary["Diem_TB"] = (
            pillar_summary["Diem_TB"].round(3)
        )

        pillar_matrix = pillar_summary.pivot(
            index="Ngân hàng",
            columns=pillar_col,
            values="Diem_TB",
        ).reset_index()

        # 3. Strength / Weakness
        sw_rows = []

        for _, row in pillar_matrix.iterrows():
            bank = row["Ngân hàng"]
            scores = row.drop(labels=["Ngân hàng"]).dropna()

            if scores.empty:
                continue

            sw_rows.append({
                "Ngân hàng": bank,
                "Trụ_cột_mạnh_nhất": ", ".join(
                    scores.index[scores == scores.max()].astype(str)
                ),
                "Điểm_mạnh": round(float(scores.max()), 3),
                "Trụ_cột_yếu_nhất": ", ".join(
                    scores.index[scores == scores.min()].astype(str)
                ),
                "Điểm_yếu": round(float(scores.min()), 3),
                "Chênh_lệch_mạnh_yếu": round(
                    float(scores.max() - scores.min()), 3
                ),
            })

        strength_weakness = pd.DataFrame(sw_rows)

        # 4. Gap Analysis theo trụ cột
        gap_rows = []

        for pillar in pillar_summary[pillar_col].dropna().unique():
            subset = pillar_summary[
                pillar_summary[pillar_col] == pillar
            ].dropna(subset=["Diem_TB"])

            if subset.empty:
                continue

            highest = subset.loc[subset["Diem_TB"].idxmax()]
            lowest = subset.loc[subset["Diem_TB"].idxmin()]

            gap_rows.append({
                "Trụ cột": pillar,
                "Ngân hàng điểm cao nhất": highest["Ngân hàng"],
                "Điểm cao nhất": highest["Diem_TB"],
                "Ngân hàng điểm thấp nhất": lowest["Ngân hàng"],
                "Điểm thấp nhất": lowest["Diem_TB"],
                "Khoảng cách điểm": round(
                    float(highest["Diem_TB"] - lowest["Diem_TB"]),
                    3,
                ),
            })

        gap_analysis = pd.DataFrame(gap_rows)

    else:
        pillar_summary = pd.DataFrame()
        pillar_matrix = pd.DataFrame()
        strength_weakness = pd.DataFrame()
        gap_analysis = pd.DataFrame()
        print("Không tìm thấy cột trụ cột; cần kiểm tra tên cột.")

    # 5. Ghi chú giới hạn dữ liệu
    notes = pd.DataFrame([
        {
            "Nội dung": "Phạm vi dữ liệu",
            "Ghi chú": (
                "Bằng chứng được gộp từ giai đoạn 2023–2025; "
                "không có điểm riêng từng năm."
            ),
        },
        {
            "Nội dung": "Giới hạn",
            "Ghi chú": (
                "Điểm và xếp hạng chỉ là sơ bộ cho đến khi "
                "xác minh mức chấm và bằng chứng."
            ),
        },
        {
            "Nội dung": "Mức 0",
            "Ghi chú": (
                "Theo quy ước nhóm, mức 0 là không tìm thấy "
                "thông tin công bố đủ bằng chứng sau khi rà soát; "
                "không khẳng định ngân hàng không thực hiện hoạt động."
            ),
        },
        {
            "Nội dung": "YoY / Score Evolution",
            "Ghi chú": (
                "Không tính vì chưa có điểm DBTI riêng cho từng năm."
            ),
        },
    ])

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with pd.ExcelWriter(OUTPUT_FILE, engine="openpyxl") as writer:
        bank_summary.to_excel(
            writer, sheet_name="So_sanh_ngan_hang", index=False
        )
        pillar_summary.to_excel(
            writer, sheet_name="Diem_6_tru_cot", index=False
        )
        pillar_matrix.to_excel(
            writer, sheet_name="Ma_tran_tru_cot", index=False
        )
        strength_weakness.to_excel(
            writer, sheet_name="Strength_Weakness", index=False
        )
        gap_analysis.to_excel(
            writer, sheet_name="Gap_Analysis", index=False
        )
        notes.to_excel(
            writer, sheet_name="Phuong_phap", index=False
        )

    print("\nĐÃ TẠO DATASET PHÂN TÍCH")
    print(f"File: {OUTPUT_FILE}")
    print("\nXếp hạng sơ bộ:")
    print(bank_summary.to_string(index=False))


if __name__ == "__main__":
    main()