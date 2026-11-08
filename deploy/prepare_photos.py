"""Resize photos for the website.

  python deploy/prepare_photos.py team <in-folder>   # square 800x800 crops -> public/images/team/
  python deploy/prepare_photos.py wide <in-folder>   # 1600px wide, 3:2 -> public/images/photos/

Output names come from the input names, lower-cased and hyphenated
("Nathan Smith.JPG" -> nathan-smith.jpg). Phone photos are rotated upright
from their EXIF data first. Crops are centred, nudged upward for portraits
so heads aren't cut off.
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

SITE = Path(__file__).resolve().parent.parent
EXTS = {".jpg", ".jpeg", ".png", ".heic", ".webp"}


def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def crop(im: Image.Image, ratio: float, top_bias: float) -> Image.Image:
    w, h = im.size
    if w / h > ratio:
        nw = int(h * ratio)
        left = (w - nw) // 2
        return im.crop((left, 0, left + nw, h))
    nh = int(w / ratio)
    top = int((h - nh) * top_bias)
    return im.crop((0, top, w, top + nh))


def main() -> None:
    if len(sys.argv) != 3 or sys.argv[1] not in ("team", "wide"):
        sys.exit(__doc__)
    mode, src = sys.argv[1], Path(sys.argv[2])
    out_dir = SITE / "public" / "images" / ("team" if mode == "team" else "photos")
    out_dir.mkdir(parents=True, exist_ok=True)
    for f in sorted(src.iterdir()):
        if f.suffix.lower() not in EXTS:
            continue
        im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
        if mode == "team":
            im = crop(im, 1.0, 0.25).resize((800, 800), Image.LANCZOS)
        else:
            im = crop(im, 1.5, 0.4).resize((1600, 1067), Image.LANCZOS)
        out = out_dir / f"{slug(f.stem)}.jpg"
        im.save(out, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"{f.name} -> {out.relative_to(SITE)} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
