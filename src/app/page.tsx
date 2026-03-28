"use client";

import { useState } from "react";
const works = [
  { title: "Alone in the Neon", location: "Shibuya", year: "2025", aspect: "aspect-[4/5]", span: "md:col-span-7", offset: "" },
  { title: "Smoke and Silence", location: "Shinjuku", year: "2025", aspect: "aspect-[3/4]", span: "md:col-span-5", offset: "md:mt-12" },
  { title: "Out of Place", location: "Shinjuku", year: "2026", aspect: "aspect-[3/4]", span: "md:col-span-5", offset: "md:-mt-6" },
  { title: "Moments in the Air", location: "Koenji", year: "2025", aspect: "aspect-[4/5]", span: "md:col-span-7", offset: "md:mt-10" },
  { title: "The Puppeteer", location: "Ueno", year: "2026", aspect: "aspect-[3/4]", span: "md:col-span-4", offset: "" },
  { title: "Masked Rhythm", location: "Shibuya", year: "2025", aspect: "aspect-[4/3]", span: "md:col-span-8", offset: "md:mt-14" },
  { title: "Shisha Maker", location: "Koenji", year: "2025", aspect: "aspect-[4/5]", span: "md:col-span-6", offset: "md:mt-8" },
];

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
        <a
          href="#works"
          className="text-neutral-400 hover:opacity-60"
          onClick={() => setMenuOpen(false)}
        >
          Works
        </a>
        <a
          href="#pricing"
          className="text-neutral-400 hover:opacity-60"
          onClick={() => setMenuOpen(false)}
        >
          Pricing
        </a>
        <a
          href="#contact"
          className="text-neutral-400 hover:opacity-60"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </a>
        <a
          href="#about"
          className="text-neutral-400 hover:opacity-60"
          onClick={() => setMenuOpen(false)}
        >
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
              Photography / Tokyo
            </p>

            <h1 className="mt-7 max-w-[11ch] text-[42px] leading-[0.98] tracking-[-0.04em] md:text-[76px]">
              People, Objects, Atmosphere
            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-neutral-500 md:text-base">
              仕事ではポートレートや商品を、<br />
              普段は街の風景も撮っています。
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
    src="/images/hero.jpg"
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
            人物や商品を中心に、<br />
            日常の中で気になった風景も<br />
            撮っています。
          </p>
        </div>
      </section>

      <section id="works" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Selected Works
          </p>
          <h2 className="mt-3 max-w-[12ch] text-[30px] font-normal tracking-[-0.03em] md:text-[54px]">
            Selected photographs, 2025—2026
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 md:mt-14 md:grid-cols-12 md:gap-x-8 md:gap-y-14">
            {works.map((work, index) => (
              <a key={work.title} href="#" className={`group block overflow-hidden text-neutral-900 ${work.span} ${work.offset}`}>
                <img
                  src={`/images/work-${index + 1}.jpg`}
                  alt={work.title}
                 className={`${work.aspect} w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]`}
                />

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] tracking-[-0.02em]">{work.title}</p>
                    <p className="mt-0.5 text-[13px] text-neutral-500">
                      {work.location}
                    </p>
                  </div>
                  <p className="pt-1 text-[10px] uppercase tracking-[0.24em] text-neutral-400">
                    {work.year}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-10 border-t border-black/10 pt-10 md:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-between">
  <div>
    <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
      Featured Project
    </p>
    <h2 className="mt-4 max-w-[10ch] text-[30px] font-normal tracking-[-0.03em] md:text-[54px]">
      Tokyo Streets
    </h2>
    <p className="mt-5 max-w-[24ch] text-sm leading-7 text-neutral-600 md:text-base">
      A study of fleeting moments and quiet tension in public space.
    </p>
  </div>

  <a
    href="#"
    className="mt-10 inline-block text-[11px] uppercase tracking-[0.24em] text-neutral-400 hover:opacity-60 md:mt-0"
  >
    View Project
  </a>
</div>

          <div className="overflow-hidden md:translate-y-4">
  <img
    src="/images/featured.jpg"
    alt="Featured photograph"
    className="aspect-[16/10] w-full object-cover"
  />
</div>
        </div>
      </section>

      <section id="about" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px] border-t border-black/10 pt-10 text-left">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
            Statement
          </p>
          <p className="mt-6 max-w-[30ch] text-[20px] font-normal leading-[1.75] tracking-[-0.02em] text-neutral-700 md:text-[32px]">
  仕事では人物や商品を撮ることが多く、<br />
  普段は街の風景も撮っています。<br />
  その場の空気が残る写真が好きです。
</p>

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
                SNS、プロフィール、作品撮り<br />
                などに対応しています。
              </p>
            </div>

            <div>
              <p className="text-[15px] tracking-[-0.02em]">商品撮影</p>
              <p className="mt-2 text-[20px] tracking-[-0.02em] text-neutral-900">
                ¥20,000〜
              </p>
              <p className="mt-3 max-w-[24ch] text-[13px] leading-7 text-neutral-500">
                ブランド、ショップ、メニュー撮影<br />
                などに対応しています。
              </p>
            </div>

            <div>
              <p className="text-[15px] tracking-[-0.02em]">その他 / 要相談</p>
              <p className="mt-2 text-[20px] tracking-[-0.02em] text-neutral-900">
                ¥10,000〜
              </p>
              <p className="mt-3 max-w-[24ch] text-[13px] leading-7 text-neutral-500">
                内容に応じてご相談ください。<br />
                撮影内容に合わせて対応します。
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
                撮影のご相談やご依頼は、
                <br />
                下記フォームからご連絡ください。
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
                  placeholder="お名前" name="name"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-3 w-full border-b border-black/10 bg-transparent pb-3 text-[15px] text-neutral-900 outline-none placeholder:text-neutral-300"
                  placeholder="メールアドレス" name="email"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="mt-3 w-full border-b border-black/10 bg-transparent pb-3 text-[15px] leading-7 text-neutral-900 outline-none placeholder:text-neutral-300"
                  placeholder="ご相談内容" name="message"
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