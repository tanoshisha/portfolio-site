// Web用に画像を軽量化するスクリプト。
// public/images/ 直下の元画像を、横幅2200px・JPEG品質80に縮小して
// public/images/gallery/ に書き出す。元ファイルはそのまま残る。
//
// 使い方:  node scripts/optimize-images.js
//
// 新しい写真を public/images/ に入れたら、このコマンドを実行するだけで
// gallery/ に軽量版ができる（既に変換済みのものはスキップ）。

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const srcDir = path.join(__dirname, "..", "public", "images");
const outDir = path.join(srcDir, "gallery");
const MAX = 2200; // 長辺の最大px
const QUALITY = 80;

fs.mkdirSync(outDir, { recursive: true });

const files = fs
  .readdirSync(srcDir)
  .filter(
    (f) =>
      /\.(jpe?g|png)$/i.test(f) &&
      fs.statSync(path.join(srcDir, f)).isFile()
  );

(async () => {
  let done = 0;
  for (const f of files) {
    const base = f.replace(/\.[^.]+$/, "");
    const outP = path.join(outDir, base + ".jpg");
    if (fs.existsSync(outP)) {
      console.log("skip  ", base, "(already optimized)");
      continue;
    }
    const inP = path.join(srcDir, f);
    try {
      await sharp(inP, { limitInputPixels: false })
        .rotate() // EXIFの向きを反映
        .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(outP);
      const kb = (fs.statSync(outP).size / 1024).toFixed(0);
      console.log("ok    ", base, kb + "KB");
      done++;
    } catch (e) {
      console.log("ERROR ", f, e.message);
    }
  }
  console.log(`\nDone. ${done} images optimized into public/images/gallery/`);
})();
