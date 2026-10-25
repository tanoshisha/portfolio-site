// 表示を速くするため、public/images/gallery/ の写真（jpg / png / CMSで上げた webp）から
// 幅 640 / 960 / 1280 / 1920px の軽い WebP 版を public/images/w/ に作る。
// `npm run build` の前に自動で実行される（prebuild）。作成済みのものはスキップ
// （同じ名前で写真を差し替えた時は public/images/w/ の該当ファイルを消してから実行）。
// photo-publisher で写真を追加した場合も、次のビルドで自動的に作られる。

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const srcDir = path.join(__dirname, "..", "public", "images", "gallery");
const outDir = path.join(__dirname, "..", "public", "images", "w");
const WIDTHS = [640, 960, 1280, 1920];
const QUALITY = 72;

fs.mkdirSync(outDir, { recursive: true });

(async () => {
  let made = 0;
  let skipped = 0;
  const files = fs.readdirSync(srcDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && f !== "signature.png");
  for (const f of files) {
    const base = f.replace(/\.[^.]+$/, "");
    const inP = path.join(srcDir, f);
    for (const w of WIDTHS) {
      const outP = path.join(outDir, `${base}-${w}.webp`);
      if (fs.existsSync(outP)) {
        skipped++;
        continue;
      }
      await sharp(inP).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(outP);
      made++;
    }
  }
  console.log(`variants: ${made} made, ${skipped} up to date`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
