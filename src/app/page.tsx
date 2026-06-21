"use client";

import { useEffect, useState } from "react";

// 写真の一覧。増やすときは public/images/ に画像を入れて
// node scripts/optimize-images.js を実行し、ここに { src: "ファイル名(拡張子なし)" } を1行足すだけ。
// title は任意（書けばキャプションが出る／無ければ写真だけ）。

type Photo = { src: string; title?: string };

// トップで全画面スライドする写真（順番に切り替わる）。
const heroSlides = [
  "IMG_9589-Enhanced-SR-Edit",
  "work-2",
  "IMG_0791",
  "IMG_5108-Enhanced-SR",
  "IMG_1542",
];

// Works = 仕事（人物・飲食店）。クライアントに見せる実績。
const works: Photo[] = [
  { src: "work-2", title: "Lounge" },
  { src: "IMG_9589-Enhanced-SR-Edit", title: "Neon Portrait" },
  { src: "work-1", title: "City Light" },
  { src: "IMG_1542", title: "夜 / Yoru" },
  { src: "IMG_7261", title: "Lion Lager" },
  { src: "work-3", title: "Western" },
  { src: "IMG_1524", title: "Sticker Wall" },
  { src: "work-4", title: "Smoke" },
  { src: "IMG_5776", title: "Night Cap" },
  { src: "work-7", title: "Behind the Bar" },
  { src: "featured", title: "Late Night" },
];

// Personal = 趣味（夜の街・ネオン・路地・祭り・動物など）。
const personal: Photo[] = [
  { src: "IMG_0791" },
  { src: "IMG_5108-Enhanced-SR" },
  { src: "IMG_0538" },
  { src: "IMG_4513-Enhanced-SR" },
  { src: "IMG_3809-Enhanced-SR" },
  { src: "IMG_5375-Enhanced-SR" },
  { src: "_MG_1988-Enhanced-SR" },
  { src: "IMG_0547" },
  { src: "IMG_4096-Enhanced-SR" },
  { src: "IMG_7544-Enhanced-SR" },
  { src: "IMG_5120-Enhanced-SR" },
  { src: "IMG_4534-Enhanced-SR" },
  { src: "IMG_1084" },
  { src: "IMG_2730-Enhanced-SR" },
  { src: "IMG_4563-Enhanced-SR" },
  { src: "IMG_5656-Enhanced-SR" },
  { src: "_MG_9335-Enhanced-SR" },
  { src: "2A4A7830" },
  { src: "IMG_6542-Enhanced-SR" },
  { src: "IMG_6503-Enhanced-SR" },
  { src: "_MG_8860-Enhanced-SR" },
  { src: "IMG_5216-Enhanced-SR" },
  { src: "IMG_6697" },
  { src: "work-5" },
  { src: "work-6" },
];

// サイトを開いた時の名前アニメーション（1セッションに1回だけ再生）。
function OpeningAnimation() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // 開くたびに毎回再生する（1回制限はしない）
    const t = setTimeout(() => setShow(false), 4600);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="open-overlay fixed inset-0 z-[100] flex items-center justify-center bg-stone-50">
      <img
        src="/images/gallery/signature.png"
        alt="直江勇人"
        className="sign-draw h-[48svh] w-auto mix-blend-multiply md:h-[60svh]"
      />
    </div>
  );
}

// 全画面の写真スライドショー＋名前を重ねたトップ。
function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((p) => (p + 1) % heroSlides.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      {heroSlides.map((src, idx) => (
        <img
          key={src}
          src={`/images/gallery/${src}.jpg`}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            idx === active ? "opacity-100 hero-zoom" : "opacity-0"
          }`}
        />
      ))}

      {/* 文字を読みやすくする暗がり */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />

      {/* 重ねた名前 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/75 md:text-[12px]">
          Photographer / Tokyo
        </p>
        <h1 className="mt-5 text-[40px] font-light leading-none tracking-[0.12em] md:text-[92px]">
          Hayato Naoe
        </h1>
      </div>

      <a
        href="#works"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/70 hover:opacity-70"
      >
        Scroll
      </a>
    </section>
  );
}

// 左端の縦書き名前バー（常時表示・PCのみ）。
function VerticalName() {
  return (
    <div className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference lg:block">
      <span className="block whitespace-nowrap text-[11px] uppercase tracking-[0.35em] text-white [writing-mode:vertical-rl] [transform:rotate(180deg)]">
        Hayato Naoe &nbsp;—&nbsp; Photographer
      </span>
    </div>
  );
}

// 写真を自動で流し込むギャラリー。枚数が増えても勝手にきれいに並ぶ（CSSの段組み）。
function Gallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="mt-12 columns-1 gap-6 sm:columns-2 md:mt-14 md:gap-8 lg:columns-3">
      {photos.map((photo) => (
        <figure key={photo.src} className="group mb-6 break-inside-avoid md:mb-8">
          <div className="overflow-hidden">
            <img
              src={`/images/gallery/${photo.src}.jpg`}
              alt={photo.title ?? ""}
              loading="lazy"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          {photo.title && (
            <figcaption className="mt-3 text-[13px] tracking-[-0.02em] text-neutral-500">
              {photo.title}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

// 趣味の写真を小さいタイルで並べる。タップ／クリックで拡大（ライトボックス）。
function TileGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight")
        setOpen((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === "ArrowLeft")
        setOpen((i) =>
          i === null ? null : (i - 1 + photos.length) % photos.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  return (
    <>
      <div className="mt-8 grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:mt-10 md:gap-2 lg:grid-cols-6">
        {photos.map((photo, idx) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpen(idx)}
            className="group relative aspect-square overflow-hidden bg-neutral-100"
          >
            <img
              src={`/images/gallery/${photo.src}.jpg`}
              alt={photo.title ?? ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 md:p-8"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute right-5 top-5 text-[11px] uppercase tracking-[0.3em] text-white/70 hover:opacity-70"
          >
            Close
          </button>

          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((i) =>
                i === null ? null : (i - 1 + photos.length) % photos.length
              );
            }}
            className="absolute left-3 text-3xl text-white/60 hover:text-white md:left-6"
          >
            ‹
          </button>

          <img
            src={`/images/gallery/${photos[open].src}.jpg`}
            alt={photos[open].title ?? ""}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88svh] max-w-[92vw] object-contain"
          />

          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((i) => (i === null ? null : (i + 1) % photos.length));
            }}
            className="absolute right-3 text-3xl text-white/60 hover:text-white md:right-6"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ヘッダーを濃い背景にするか（スクロール後 or メニューを開いた時）。
  const solid = scrolled || menuOpen;

  return (
    <main className="min-h-screen bg-stone-50 text-neutral-900">
      <OpeningAnimation />
      <VerticalName />

      <header
        className={`fixed inset-x-0 top-0 z-50 px-5 py-4 transition-colors duration-500 md:px-10 md:py-5 ${
          solid ? "bg-stone-50/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between text-[11px] uppercase tracking-[0.24em] transition-colors duration-500 ${
            solid ? "text-neutral-500" : "text-white"
          }`}
        >
          <div className={solid ? "text-neutral-700" : "text-white"}>
            Hayato Naoe
          </div>

          <nav className="hidden gap-5 md:flex">
            <a href="#works" className="hover:opacity-60">
              Works
            </a>
            <a href="#gallery" className="hover:opacity-60">
              Gallery
            </a>
            <a href="#pricing" className="hover:opacity-60">
              Pricing
            </a>
            <a href="#contact" className="hover:opacity-60">
              Contact
            </a>
            <a href="#about" className="hover:opacity-60">
              About
            </a>
            <a
              href="https://www.instagram.com/naoe_hayato/"
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-60"
            >
              Instagram
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:opacity-60 md:hidden"
          >
            Menu
          </button>
        </div>

        {menuOpen && (
          <div className="mx-auto mt-4 max-w-[1400px] border-t border-black/10 pt-4 md:hidden">
            <nav className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              <a href="#works" className="hover:opacity-60" onClick={() => setMenuOpen(false)}>
                Works
              </a>
              <a href="#gallery" className="hover:opacity-60" onClick={() => setMenuOpen(false)}>
                Gallery
              </a>
              <a href="#pricing" className="hover:opacity-60" onClick={() => setMenuOpen(false)}>
                Pricing
              </a>
              <a href="#contact" className="hover:opacity-60" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
              <a href="#about" className="hover:opacity-60" onClick={() => setMenuOpen(false)}>
                About
              </a>
              <a
                href="https://www.instagram.com/naoe_hayato/"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-60"
                onClick={() => setMenuOpen(false)}
              >
                Instagram
              </a>
            </nav>
          </div>
        )}
      </header>

      <HeroSlideshow />

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px] pt-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Intro
          </p>
          <p className="mt-5 max-w-[26ch] text-[20px] font-normal leading-[1.75] tracking-[-0.02em] text-neutral-700 md:text-[32px]">
            きれいに撮るだけなら、<br />
            今はスマホでもできます。<br />
            大事にしているのは、<wbr />あとで見返したときに<br />
            「あの時の空気」まで<wbr />思い出せる一枚か<wbr />どうか。
          </p>
        </div>
      </section>

      <section id="works" className="scroll-mt-24 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Works
          </p>

          <Gallery photos={works} />
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px] border-t border-black/10 pt-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Gallery
          </p>
          <p className="mt-4 max-w-[42ch] text-[13px] leading-7 text-neutral-500">
            仕事を離れて撮りためている個人的な写真です。<wbr />タップで拡大できます。
          </p>

          <TileGallery photos={personal} />
        </div>
      </section>

      <section id="about" className="scroll-mt-24 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px] border-t border-black/10 pt-10 text-left">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Statement
          </p>
          <div className="mt-8 grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:items-start md:gap-16">
            <div className="mx-auto w-full max-w-[240px] md:max-w-[320px] md:sticky md:top-28">
              <img
                src="/images/gallery/hero.jpg"
                alt="Hayato Naoe"
                className="aspect-[4/5] w-full rounded-[50%] object-cover object-top"
              />
            </div>

            <div>
              <p className="max-w-[30ch] text-[20px] font-normal leading-[1.75] tracking-[-0.02em] text-neutral-700 md:text-[32px]">
            打ち合わせから一緒に考えて、<br />
            その人・そのお店に<wbr />合った一枚を撮ります。
          </p>

          <div className="mt-8 max-w-[62ch] space-y-5 text-sm leading-8 text-neutral-600 md:text-[15px]">
            <p>
              15歳のとき、<wbr />カメラ好きの父から<wbr />お下がりの一眼レフを<wbr />もらいました。<wbr />そこから15年、<wbr />ずっと写真を撮り続けています。<wbr />大学では<wbr />ファッションサークルに入り、<wbr />ストリートスナップを<wbr />撮っていました。
            </p>
            <p>
              卒業後は<wbr />シーシャ屋で10年間働き、<wbr />3年前に<wbr />カメラマンとして独立。<wbr />お店の空気やお客さんを<wbr />間近で見てきた経験は、<wbr />いまの飲食店の撮影に<wbr />そのまま生きています。
            </p>
            <p>
              もともと<wbr />イラストも描いていたので、<wbr />構図や色で<wbr />その場のストーリーまで<wbr />伝わる一枚を<wbr />大事にしています。<wbr />スタジオでもロケでも、<wbr />まずはじっくり<wbr />打ち合わせを。<wbr />夜景をバックにした<wbr />ムードのある写真も<wbr />得意です。
            </p>
          </div>

          <a
            href="https://www.instagram.com/naoe_hayato/"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block text-[11px] uppercase tracking-[0.24em] text-neutral-400 hover:opacity-60"
          >
            Visit Instagram
          </a>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px] border-t border-black/10 pt-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Pricing
          </p>

          <h2 className="mt-3 max-w-[12ch] text-[30px] font-normal tracking-[-0.03em] md:text-[54px]">
            撮影料金
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <p className="text-[15px] tracking-[-0.02em]">ポートレート撮影</p>
              <p className="mt-2 text-[20px] tracking-[-0.02em] text-neutral-900">
                ¥15,000〜
              </p>
              <p className="mt-3 max-w-[24ch] text-[13px] leading-7 text-neutral-500">
                SNSのアイコンから作品撮りまで。<br />
                夜景ロケのムード撮影も得意です。
              </p>
            </div>

            <div>
              <p className="text-[15px] tracking-[-0.02em]">飲食店撮影</p>
              <p className="mt-2 text-[20px] tracking-[-0.02em] text-neutral-900">
                ¥20,000〜
              </p>
              <p className="mt-3 max-w-[24ch] text-[13px] leading-7 text-neutral-500">
                内装やメニュー・ドリンクを、<br />
                食べログやInstagramで<wbr />映える一枚に。
              </p>
            </div>

            <div>
              <p className="text-[15px] tracking-[-0.02em]">その他 / 要相談</p>
              <p className="mt-2 text-[20px] tracking-[-0.02em] text-neutral-900">
                ¥10,000〜
              </p>
              <p className="mt-3 max-w-[24ch] text-[13px] leading-7 text-neutral-500">
                イベントや出張撮影など。<br />
                「こんなの撮れますか？」からどうぞ。
              </p>
            </div>
          </div>

          <p className="mt-10 max-w-[32ch] text-[13px] leading-7 text-neutral-500">
            内容や撮影時間、<br />
            納品枚数に応じて変動します。<br />
            まずはお気軽にご相談ください。
          </p>
          <a
            href="https://www.instagram.com/naoe_hayato/"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block text-[11px] uppercase tracking-[0.24em] text-neutral-400 hover:opacity-60"
          >
            お問い合わせは Instagram から
          </a>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px] border-t border-black/10 pt-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Contact
          </p>

          <h2 className="mt-3 max-w-[12ch] text-[30px] font-normal tracking-[-0.03em] md:text-[54px]">
            お問い合わせ
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="max-w-[26ch] text-[20px] font-normal leading-[1.75] tracking-[-0.02em] text-neutral-700 md:text-[32px]">
                「こういうの撮れますか？」<wbr />だけでも大歓迎です。
                <br />
                下のフォームからお気軽にどうぞ。
              </p>
            </div>

            <form
              action="https://formspree.io/f/xojpeqan"
              method="POST"
              className="grid grid-cols-1 gap-6"
            >
              <div>
                <label className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-3 w-full border-b border-black/10 bg-transparent pb-3 text-[15px] text-neutral-900 outline-none placeholder:text-neutral-300"
                  placeholder="お名前"
                  name="name"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-3 w-full border-b border-black/10 bg-transparent pb-3 text-[15px] text-neutral-900 outline-none placeholder:text-neutral-300"
                  placeholder="メールアドレス"
                  name="email"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="mt-3 w-full border-b border-black/10 bg-transparent pb-3 text-[15px] leading-7 text-neutral-900 outline-none placeholder:text-neutral-300"
                  placeholder="ご相談内容"
                  name="message"
                />
              </div>

              <button
                type="submit"
                className="mt-4 inline-block w-fit text-[11px] uppercase tracking-[0.24em] text-neutral-400 hover:opacity-60"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="px-6 py-7 md:px-10 md:py-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between border-t border-black/10 pt-6 text-[11px] uppercase tracking-[0.24em] text-neutral-400">
          <div className="text-neutral-600">Hayato Naoe</div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/naoe_hayato/"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-300 hover:opacity-60"
            >
              Instagram
            </a>
            <div className="text-neutral-300">2026</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
