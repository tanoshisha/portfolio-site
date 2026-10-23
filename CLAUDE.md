@AGENTS.md

# ポートフォリオ（https://hayatonaoe.com）の更新ルール

GitHub `tanoshisha/portfolio-site` の **main に push すると Vercel が自動で公開**（約2分）。

## 写真の追加・並べ替え
- 写真の一覧は **`src/data/photos.json` だけ**が元データ（`heroSlides` / `works` / `personal`、並び順 = 表示順）。
  - `src` は `/images/gallery/ファイル名.jpg` のパス形式（拡張子なしの名前も一応動く）。
  - `works` は `{ src, title, category: "portrait" | "shop" }`。**DJ カテゴリは使わない**（撮影ジャンルは人物とお店）。
  - `heroSlides` は `{ src, position? }`（縦写真で顔が切れる時だけ `"center 25%"`）。
- 画像本体は `public/images/gallery/`。表示用の軽い WebP（640/1280/1920px）は `npm run build` の前に
  `scripts/make-variants.js` が `public/images/w/` に自動で作る（同名で差し替えた時は w/ の3ファイルを消してから）。
- 追加の方法は3通り、どれも同じ photos.json を編集する:
  1. スマホの管理画面 https://hayatonaoe.com/admin （Sveltia CMS。設定 `public/admin/config.yml`。アップロードは長辺2200pxのWebPに自動変換）
  2. Claude Code（PC・スマホ）で photos.json を編集 → `npm run build` で確認 → commit → push
  3. PC の共有ツール photo-publisher（`C:\Users\tanos\sites\photo-publisher`）

## デザインの決まりごと
- 見出し・名前はヘッダー左上「HAYATO NAOE」と同じ **細めの大文字ゴシック（Geist）＋広い字間**。セリフ体・イタリックは使わない。
- トップは `heroSlides` の全画面スライドショー。オープニングは手書きサイン（`public/images/gallery/signature.png`）＋朱色のカメラ印。
- キャッチコピーは「人物とお店を、空気ごと。」。
- 動きは GSAP + Lenis（`useMotion`）。
