"""Compute the existing group's percentage score; does not validate research evidence."""
from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
INPUT_FILE = BASE_DIR / "output" / "ScoringReview.xlsx"
OUTPUT_FILE = BASE_DIR / "output" / "DBI_DigitalScore_theo_tieu_chi.xlsx"
BANKS = ["TPBank", "HDBank", "LP Bank", "OCB", "SaigonBank"]
PILLARS = ["1. Trụ cột Khách hàng", "2. Trụ cột Chiến lược", "3. Trụ cột Công nghệ", "4. Trụ cột Vận hành", "5. Trụ cột Văn hóa", "6. Trụ cột Dữ liệu"]
COUNTS = [25, 24, 29, 22, 22, 18]
CONVERSION = {0: 0.0, 1: 0.0, 2: 25.0, 3: 50.0, 4: 75.0, 5: 100.0}


def stage(score):
    if score < 25:
        return 1, "Khởi động"
    if score < 50:
        return 2, "Bắt đầu"
    if score < 75:
        return 3, "Hình thành"
    if score < 100:
        return 4, "Nâng cao"
    return 5, "Dẫn dắt"


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError("Run step7_scoring.py first")
    catalog = pd.read_excel(INPUT_FILE, sheet_name="Danh_muc")
    catalog_codes = set(catalog["Mã"].astype(str))
    if len(catalog_codes) != 140 or len(catalog) != 140:
        raise ValueError("The catalog must contain exactly 140 unique criteria")
    frames, bank_frames = [], {}
    for bank in BANKS:
        frame = pd.read_excel(INPUT_FILE, sheet_name=bank)
        frame["Mã"] = frame["Mã"].astype(str)
        if len(frame) != 140 or frame["Mã"].duplicated().any() or set(frame["Mã"]) != catalog_codes:
            raise ValueError(f"Invalid criterion coverage: {bank}")
        levels = pd.to_numeric(frame["Mức đạt"], errors="raise")
        if levels.isna().any() or not levels.isin(CONVERSION).all():
            raise ValueError(f"Missing or invalid scores: {bank}; no automatic NA substitution")
        frame["Mức đạt"] = levels.astype(int)
        if frame.groupby("Trụ cột").size().reindex(PILLARS).tolist() != COUNTS:
            raise ValueError(f"Invalid pillar coverage: {bank}")
        bank_frames[bank] = frame.copy()
        frame["Ngân hàng"] = bank
        frame["Tỷ lệ hoàn thành (%)"] = levels.map(CONVERSION)
        frames.append(frame)
    details = pd.concat(frames, ignore_index=True)
    pillars = details.groupby(["Ngân hàng", "Trụ cột"]).agg(
        So_tieu_chi=("Mã", "count"),
        Tong_muc_dat=("Mức đạt", "sum"),
        Diem_tru_cot=("Tỷ lệ hoàn thành (%)", "mean"),
    ).reset_index()
    matrix = pillars.pivot(index="Ngân hàng", columns="Trụ cột", values="Diem_tru_cot").reindex(columns=PILLARS)
    scores = matrix.copy()
    scores["Digital Score (%)"] = matrix.mean(axis=1)
    scores["Rank"] = scores["Digital Score (%)"].rank(method="min", ascending=False).astype(int)
    classes = scores["Digital Score (%)"].map(stage)
    scores["Mức DBI"] = classes.map(lambda item: item[0])
    scores["Tên mức"] = classes.map(lambda item: item[1])
    scores = scores.reset_index()[["Rank", "Ngân hàng", *PILLARS, "Digital Score (%)", "Mức DBI", "Tên mức"]]
    scores = scores.sort_values(["Rank", "Ngân hàng"])
    groups = details.groupby(["Ngân hàng", "Trụ cột", "Nhóm tiêu chí"]).agg(
        So_tieu_chi=("Mã", "count"), Diem_nhom=("Tỷ lệ hoàn thành (%)", "mean")
    ).reset_index()
    notes = pd.DataFrame([
        {"Bước": "Quy đổi", "Cách tính": "Mức 0/1/2/3/4/5 = 0/0/25/50/75/100%; quy ước hiện có của nhóm"},
        {"Bước": "Digital Score", "Cách tính": "Trung bình điểm phần trăm của 6 trụ cột, trọng số bằng nhau"},
        {"Bước": "Mức 0", "Cách tính": "Chưa đủ bằng chứng trong dataset; không kết luận ngân hàng không thực hiện"},
        {"Bước": "Giới hạn", "Cách tính": "Gộp 2023–2025; không tự phân bổ điểm về từng năm; chưa có NA"},
    ])
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with pd.ExcelWriter(OUTPUT_FILE, engine="openpyxl") as writer:
        scores.to_excel(writer, sheet_name="Digital_Score_Rank", index=False)
        details.to_excel(writer, sheet_name="Chi_tiet_tieu_chi", index=False)
        pillars.to_excel(writer, sheet_name="Diem_tru_cot", index=False)
        groups.to_excel(writer, sheet_name="Diem_nhom", index=False)
        catalog.to_excel(writer, sheet_name="Danh_muc", index=False)
        notes.to_excel(writer, sheet_name="Huong_dan", index=False)
        for bank, frame in bank_frames.items():
            frame.to_excel(writer, sheet_name=bank, index=False)
    print(scores.to_string(index=False))
    print(f"Saved: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
