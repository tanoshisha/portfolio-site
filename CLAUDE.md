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
- 日本語は **Zen Kaku Gothic New**（layout.tsx の next/font、変数 --font-jp、クラス .jp）。英字は Geist。丸ゴシック（Zen Maru）は使わない。
- 動きは GSAP + Lenis（`useMotion`）。2026-10 v3 で追加：上端のスクロール進捗線、見出し罫線が伸びる、Intro が1行ずつ白く浮かぶ（CSS animation-timeline）、写真をタップ位置から拡大（View Transitions・morph/closeLb）、スマホは全画面メニュー・Works互い違い・Gallery は最初12枚（PC18枚）＋View all。
- スマホ（390px幅）で確認してから公開。dev サーバーの確認は 127.0.0.1 ではなく **localhost** で開く（127.0.0.1 だと JS が配られず動かない）。

## スマホ（クラウド）の Claude Code から頼まれたとき
- サイトは **main に入って初めて公開**される。作業ブランチに push しただけでは本番は変わらない。
- 作業が終わったら、可能なら main へ直接 push する。できない場合は PR を作り、ユーザーに「GitHub で Merge を押すと公開されます」と伝える（PR のリンクも添える）。
- 作業前に `git pull` で最新の main から始める（CMS からの更新が先に入っていることがある）。
