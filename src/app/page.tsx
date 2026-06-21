"use client";

import { useState } from "react";

// 写真の一覧。増やすときは public/images/ に画像を入れて
// node scripts/optimize-images.js を実行し、ここに { src: "ファイル名(拡張子なし)" } を1行足すだけ。
// title は任意（書けばキャプションが出る／無ければ写真だけ）。

type Photo = { src: string; title?: string };

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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-stone-50 text-neutral-900">
      <header className="sticky top-0 z-50 bg-stone-50 px-5 py-4 md:px-10 md:py-5">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between text-[11px] uppercase tracking-[0.24em] text-neutral-500">
          <div className="text-neutral-700">Hayato Naoe</div>

          <nav className="hidden gap-5 md:flex">
            <a href="#works" className="text-neutral-400 hover:opacity-60">
              Works
            </a>
            <a href="#personal" className="text-neutral-400 hover:opacity-60">
              Personal
            </a>
            <a href="#pricing" className="text-neutral-400 hover:opacity-60">
              Pricing
            </a>
            <a href="#contact" className="text-neutral-400 hover:opacity-60">
              Contact
            </a>
            <a href="#about" className="text-neutral-400 hover:opacity-60">
              About
            </a>
            <a
              href="https://www.instagram.com/naoe_hayato/"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:opacity-60"
            >
              Instagram
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-neutral-400 md:hidden"
          >
            Menu
          </button>
        </div>

        {menuOpen && (
          <div className="mx-auto mt-4 max-w-[1400px] border-t border-black/10 pt-4 md:hidden">
            <nav className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              <a href="#works" className="text-neutral-400 hover:opacity-60" onClick={() => setMenuOpen(false)}>
                Works
              </a>
              <a href="#personal" className="text-neutral-400 hover:opacity-60" onClick={() => setMenuOpen(false)}>
                Personal
              </a>
              <a href="#pricing" className="text-neutral-400 hover:opacity-60" onClick={() => setMenuOpen(false)}>
                Pricing
              </a>
              <a href="#contact" className="text-neutral-400 hover:opacity-60" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
              <a href="#about" className="text-neutral-400 hover:opacity-60" onClick={() => setMenuOpen(false)}>
                About
              </a>
              <a
                href="https://www.instagram.com/naoe_hayato/"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-400 hover:opacity-60"
                onClick={() => setMenuOpen(false)}
              >
                Instagram
              </a>
            </nav>
          </div>
        )}
      </header>

      <section className="px-5 pb-14 pt-6 md:px-10 md:pb-32 md:pt-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              Portrait &amp; Food / Tokyo
            </p>

            <h1 className="mt-7 max-w-[11ch] text-[42px] leading-[0.98] tracking-[-0.04em] md:text-[76px]">
              その場の空気ごと、撮る。
            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-neutral-500 md:text-base">
              東京で<wbr />ポートレートと飲食店の<wbr />撮影をしています。<br />
              その人・そのお店が<wbr />いちばん良く見える瞬間を<wbr />撮ります。
            </p>

            <a
              href="#works"
              className="mt-8 inline-block text-[11px] uppercase tracking-[0.24em] text-neutral-400 hover:opacity-60"
            >
              View Selected Works
            </a>
          </div>

          <div className="overflow-hidden md:translate-y-6">
            <img
              src="/images/gallery/hero.jpg"
              alt="Hero photograph"
              className="aspect-[4/5] w-full object-cover md:min-h-[720px]"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px] border-t border-black/10 pt-10">
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

      <section id="works" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Selected Works
          </p>
          <h2 className="mt-3 max-w-[16ch] text-[30px] font-normal tracking-[-0.03em] md:text-[54px]">
            人物と、飲食店の仕事
          </h2>

          <Gallery photos={works} />
        </div>
      </section>

      <section id="personal" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px] border-t border-black/10 pt-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Personal
          </p>
          <h2 className="mt-3 max-w-[16ch] text-[30px] font-normal tracking-[-0.03em] md:text-[54px]">
            夜の街、ネオン、祭り
          </h2>
          <p className="mt-5 max-w-[42ch] text-sm leading-7 text-neutral-600 md:text-base">
            仕事を離れて、<wbr />好きで撮りためている個人作品です。<br />
            夜のネオン、路地、祭り、<wbr />たまに動物まで。
          </p>

          <Gallery photos={personal} />
        </div>
      </section>

      <section id="about" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px] border-t border-black/10 pt-10 text-left">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Statement
          </p>
          <p className="mt-6 max-w-[30ch] text-[20px] font-normal leading-[1.75] tracking-[-0.02em] text-neutral-700 md:text-[32px]">
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
      </section>

      <section id="pricing" className="px-6 py-16 md:px-10 md:py-24">
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

      <section id="contact" className="px-6 py-16 md:px-10 md:py-24">
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
