"""Run repaired copies without overwriting the user's original workbooks."""
import importlib.util
from pathlib import Path
import subprocess
import sys

BASE_DIR = Path(__file__).resolve().parent


def main():
    if sys.version_info < (3, 10):
        raise SystemExit("Python 3.10 or newer is required")
    missing = [name for name in ("pandas", "openpyxl") if importlib.util.find_spec(name) is None]
    if missing:
        raise SystemExit("Install requirements.txt in your virtual environment first: " + ", ".join(missing))
    (BASE_DIR / "output").mkdir(exist_ok=True)
    for script in ("step6_validate.py", "step7_scoring.py", "step8_digital_score.py", "step9_analysis.py"):
        print(f"Running {script}", flush=True)
        subprocess.run([sys.executable, "-X", "utf8", str(BASE_DIR / script)], cwd=BASE_DIR, check=True)
    print("Pipeline complete. All outputs are in pipeline/output. Research review remains required.")


if __name__ == "__main__":
    main()
