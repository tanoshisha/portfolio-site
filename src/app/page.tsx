"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import photos from "@/data/photos.json";

// 写真の一覧は src/data/photos.json で管理。
// 追加方法（手動）: public/images/ に画像を入れて node scripts/optimize-images.js を実行し、
// photos.json の works / personal に { "src": "ファイル名(拡張子なし)", "title": "", "category": "portrait" } を足すだけ。
// works の category は "portrait" / "dj" / "shop" のどれか。省略すると portrait 扱い。
// もしくは photo-publisher ツール（stage→review→publish）で自動追記できる。

type Photo = { src: string; title?: string; category?: string };

// Works = 仕事（人物・DJ・飲食店）。クライアントに見せる実績。
const works: Photo[] = photos.works;

// Personal = 趣味（夜の街・ネオン・路地・祭り・動物など）。
const personal: Photo[] = photos.personal;

const CATEGORIES: { id: string; en: string; ja: string }[] = [
  { id: "all", en: "All", ja: "すべて" },
  { id: "portrait", en: "Portrait", ja: "ポートレート" },
  { id: "dj", en: "DJ", ja: "DJ・アーティスト" },
  { id: "shop", en: "Shop & Bar", ja: "店舗・飲食" },
];
const catOf = (p: Photo) => p.category ?? "portrait";
const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.en ?? "";

const img = (src: string) => `/images/gallery/${src}.jpg`;

// ---------------------------------------------------------------------------
// サイトを開いた時の手書きサイン（毎回再生）。
function OpeningAnimation() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 4600);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="open-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[#0e0e0e]">
      <img
        src="/images/gallery/signature.png"
        alt="直江勇人"
        className="sign-draw h-[60svh] w-auto invert mix-blend-screen md:h-[74svh]"
      />
    </div>
  );
}

// 画面に入ったら .is-in を付けてふわっと出す（下から少し上がる）。
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  });
  return ref;
}

// 写真が横に流れ続ける帯。reverse で逆方向。
function Marquee({
  items,
  reverse = false,
  duration = 60,
  height = "h-[26vh] md:h-[34vh]",
  onSelect,
}: {
  items: Photo[];
  reverse?: boolean;
  duration?: number;
  height?: string;
  onSelect?: (src: string) => void;
}) {
  const loop = [...items, ...items];
  return (
    <div className="marquee group relative overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-3 md:gap-4 ${reverse ? "marquee-reverse" : ""}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((p, i) => (
          <button
            key={`${p.src}-${i}`}
            type="button"
            tabIndex={i < items.length ? 0 : -1}
            aria-hidden={i >= items.length}
            onClick={() => onSelect?.(p.src)}
            className={`relative shrink-0 overflow-hidden bg-neutral-900 ${height}`}
          >
            <img
              src={img(p.src)}
              alt={i < items.length ? p.title ?? "" : ""}
              loading={i < 8 ? "eager" : "lazy"}
              className="h-full w-auto object-cover transition-transform duration-700 hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// 共通の拡大表示（モーダル）。前後送り・キーボード・スワイプ対応。
function Lightbox({
  items,
  index,
  onClose,
  onIndex,
  showMeta = true,
}: {
  items: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
  showMeta?: boolean;
}) {
  const n = items.length;
  const prev = useCallback(() => onIndex((index - 1 + n) % n), [index, n, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % n), [index, n, onIndex]);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, next, prev]);

  const p = items[index];
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="lb-in fixed inset-0 z-[90] flex flex-col bg-black/95"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 text-[11px] uppercase tracking-[0.3em] text-white/60 md:px-10 md:py-6">
        <span className="font-[family-name:var(--font-geist-mono)] tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <button type="button" onClick={onClose} className="hover:text-white">
          Close ✕
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        <button
          type="button"
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-2 z-10 p-3 text-3xl text-white/50 hover:text-white md:left-6"
        >
          ‹
        </button>
        <img
          key={p.src}
          src={img(p.src)}
          alt={p.title ?? ""}
          onClick={(e) => e.stopPropagation()}
          className="lb-img max-h-full max-w-full object-contain"
        />
        <button
          type="button"
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-2 z-10 p-3 text-3xl text-white/50 hover:text-white md:right-6"
        >
          ›
        </button>
      </div>

      <div className="flex min-h-[64px] items-end justify-between gap-4 px-5 pb-5 pt-3 md:px-10 md:pb-8">
        {showMeta && p.title ? (
          <div onClick={(e) => e.stopPropagation()}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
              {catLabel(catOf(p))}
            </p>
            <p className="mt-1 text-[20px] font-light tracking-[0.02em] text-white md:text-[26px]">
              {p.title}
            </p>
          </div>
        ) : (
          <span />
        )}
        <a
          href="#contact"
          onClick={onClose}
          className="whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-white/60 underline-offset-4 hover:text-white hover:underline"
        >
          Request a shoot →
        </a>
      </div>
    </div>
  );
}

// セクション見出し：番号＋大きな英字＋小さな和文。
function SectionHead({ no, en, ja, children }: { no: string; en: string; ja: string; children?: React.ReactNode }) {
  return (
    <div data-reveal className="reveal flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-8 md:pt-10">
      <div>
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.3em] text-neutral-500">
          {no} — {ja}
        </p>
        <h2 className="display mt-3 text-[48px] leading-[0.9] md:text-[96px]">{en}</h2>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// トップ：大きな名前＋作品が流れ続ける2本の帯。
function Hero({ onSelect }: { onSelect: (src: string) => void }) {
  const half = Math.ceil(works.length / 2);
  const rowA = works.slice(0, half);
  const rowB = [...works.slice(half), ...personal.slice(0, 4)];
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24 md:pt-28">
      <div className="px-6 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="hero-rise flex flex-wrap gap-x-6 gap-y-1 text-[10px] uppercase tracking-[0.32em] text-neutral-500 md:text-[11px] md:tracking-[0.4em]" style={{ animationDelay: "4.2s" }}>
            <span>Photographer / Tokyo</span>
            <span>Portrait — DJ — Shop &amp; Bar</span>
          </p>
          <h1 className="display hero-rise mt-4 text-[17vw] leading-[0.82] md:text-[13.5vw] xl:text-[200px]" style={{ animationDelay: "4.35s" }}>
            Hayato
            <br />
            <span className="pl-[8vw] italic text-neutral-400">Naoe</span>
          </h1>
          <p
            className="hero-rise mt-6 max-w-[30ch] text-[13px] leading-[2] text-neutral-400 md:absolute md:right-10 md:top-[38%] md:mt-0 md:max-w-[26ch] md:text-right md:text-[14px] xl:right-[calc((100vw-1400px)/2+40px)]"
            style={{ animationDelay: "4.5s" }}
          >
            人物・DJ・お店を、<wbr />夜の空気ごと。<br />
            東京で撮影しています。
          </p>
        </div>
      </div>

      <div className="hero-rise mt-10 space-y-3 md:mt-12 md:space-y-4" style={{ animationDelay: "4.6s" }}>
        <Marquee items={rowA} duration={70} onSelect={onSelect} />
        <Marquee items={rowB} duration={80} reverse onSelect={onSelect} height="h-[20vh] md:h-[26vh]" />
      </div>

      <div className="flex items-center justify-between px-6 py-6 text-[10px] uppercase tracking-[0.3em] text-neutral-500 md:px-10">
        <span>直江勇人 — Hayato Naoe</span>
        <a href="#works" className="hover:text-white">
          Scroll ↓
        </a>
      </div>
    </section>
  );
}

// Works：カテゴリ絞り込み＋グリッド＋モーダル。
function Works({ onOpen }: { onOpen: (list: Photo[], i: number) => void }) {
  const [cat, setCat] = useState("all");
  const list = cat === "all" ? works : works.filter((w) => catOf(w) === cat);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="works" className="scroll-mt-20 px-6 py-20 md:px-10 md:py-28">
      <div ref={ref} className="mx-auto max-w-[1400px]">
        <SectionHead no="01" en="Works" ja="撮影実績">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="カテゴリ">
            {CATEGORIES.map((c) => {
              const count = c.id === "all" ? works.length : works.filter((w) => catOf(w) === c.id).length;
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCat(c.id)}
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-neutral-400 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {c.en}
                  <sup className="ml-1 font-[family-name:var(--font-geist-mono)] text-[9px] opacity-60">{count}</sup>
                </button>
              );
            })}
          </div>
        </SectionHead>

        <div key={cat} className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-16 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
          {list.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => onOpen(list, i)}
              data-reveal
              className="reveal group text-left"
              style={{ transitionDelay: `${(i % 3) * 90}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                <img
                  src={img(p.src)}
                  alt={p.title ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 to-transparent p-4 text-[10px] uppercase tracking-[0.3em] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  View ↗
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <p className="text-[14px] tracking-[0.01em] text-neutral-200 md:text-[16px]">{p.title}</p>
                <p className="shrink-0 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  {catLabel(catOf(p))}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Gallery：個人作品。流れる帯＋小さなタイル。
function Gallery({ onOpen }: { onOpen: (list: Photo[], i: number) => void }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="gallery" className="scroll-mt-20 py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHead no="02" en="Gallery" ja="個人作品">
          <p className="max-w-[34ch] text-[13px] leading-7 text-neutral-500">
            仕事を離れて<wbr />撮りためている<wbr />個人的な写真です。<wbr />タップで拡大できます。
          </p>
        </SectionHead>
      </div>

      <div className="mt-12 md:mt-16">
        <Marquee
          items={personal.slice(0, 16)}
          duration={90}
          height="h-[22vh] md:h-[30vh]"
          onSelect={(src) => onOpen(personal, Math.max(0, personal.findIndex((p) => p.src === src)))}
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mt-6 grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:mt-8 md:gap-2 lg:grid-cols-6">
          {personal.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => onOpen(personal, i)}
              className="group relative aspect-square overflow-hidden bg-neutral-900"
            >
              <img
                src={img(p.src)}
                alt={p.title ?? ""}
                loading="lazy"
                className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Instagramのロゴ（線画）。
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[18px] w-[18px]">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" className="h-[20px] w-[20px]">
      {open ? (
        <>
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </>
      )}
    </svg>
  );
}

const NAV = [
  { href: "#works", label: "Works" },
  { href: "#gallery", label: "Gallery" },
  { href: "#about", label: "About" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lb, setLb] = useState<{ list: Photo[]; index: number; meta: boolean } | null>(null);
  const restRef = useReveal<HTMLDivElement>();

  const openWorks = (list: Photo[], i: number) => setLb({ list, index: i, meta: true });
  const openPersonal = (list: Photo[], i: number) => setLb({ list, index: i, meta: false });
  const openFromHero = (src: string) => {
    const wi = works.findIndex((w) => w.src === src);
    if (wi >= 0) return openWorks(works, wi);
    const pi = personal.findIndex((p) => p.src === src);
    if (pi >= 0) openPersonal(personal, pi);
  };

  // スクロールに合わせた背景色の変化（About以降：青→青緑→緑）。
  useEffect(() => {
    type RGB = [number, number, number];
    const base: RGB = [14, 14, 14];
    const targets: { id: string; color: RGB }[] = [
      { id: "about", color: [22, 38, 60] },
      { id: "pricing", color: [20, 44, 54] },
      { id: "contact", color: [20, 48, 44] },
    ];
    const lerp = (a: RGB, b: RGB, t: number): RGB => [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
    const onScroll = () => {
      const viewCenter = window.scrollY + window.innerHeight / 2;
      const anchors: { pos: number; color: RGB }[] = [];
      const aboutEl = document.getElementById("about");
      if (aboutEl) anchors.push({ pos: aboutEl.getBoundingClientRect().top + window.scrollY, color: base });
      for (const tg of targets) {
        const el = document.getElementById(tg.id);
        if (el) {
          const r = el.getBoundingClientRect();
          anchors.push({ pos: r.top + window.scrollY + r.height / 2, color: tg.color });
        }
      }
      let color: RGB = base;
      if (anchors.length > 0) {
        if (viewCenter <= anchors[0].pos) color = anchors[0].color;
        else if (viewCenter >= anchors[anchors.length - 1].pos) color = anchors[anchors.length - 1].color;
        else
          for (let i = 0; i < anchors.length - 1; i++) {
            const a = anchors[i];
            const b = anchors[i + 1];
            if (viewCenter >= a.pos && viewCenter <= b.pos) {
              color = lerp(a.color, b.color, (viewCenter - a.pos) / (b.pos - a.pos));
              break;
            }
          }
      }
      document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <main className="min-h-screen overflow-x-clip text-neutral-100">
      <OpeningAnimation />

      <header
        className={`fixed inset-x-0 top-0 z-50 px-5 py-4 transition-colors duration-500 md:px-10 md:py-5 ${
          solid ? "bg-[#0e0e0e]/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between text-[11px] uppercase tracking-[0.24em] text-neutral-300">
          <a href="#" className="text-white">
            Hayato Naoe
          </a>
          <div className="flex items-center gap-6">
            <nav className="hidden gap-6 md:flex">
              {NAV.map((n, i) => (
                <a key={n.href} href={n.href} className="link-line">
                  <span className="mr-1 font-[family-name:var(--font-geist-mono)] text-[9px] text-neutral-600">0{i + 1}</span>
                  {n.label}
                </a>
              ))}
            </nav>
            <a href="https://www.instagram.com/hayato_naoe/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:opacity-60">
              <InstagramIcon />
            </a>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="メニュー" aria-expanded={menuOpen} className="hover:opacity-60 md:hidden">
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mx-auto mt-6 max-w-[1400px] border-t border-white/10 pb-4 pt-6 md:hidden">
            <nav className="flex flex-col gap-5">
              {NAV.map((n, i) => (
                <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="display flex items-baseline gap-3 text-[34px] leading-none">
                  <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-neutral-500">0{i + 1}</span>
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <Hero onSelect={openFromHero} />

      {/* Intro */}
      <section className="px-6 py-24 md:px-10 md:py-40">
        <div ref={restRef} className="mx-auto max-w-[1400px]">
          <div data-reveal className="reveal grid gap-8 md:grid-cols-[0.35fr_1fr]">
            <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.3em] text-neutral-500">— Intro</p>
            <p
              style={{ fontFamily: '"Zen Maru Gothic", sans-serif' }}
              className="text-[19px] font-light leading-[2.1] tracking-[0.02em] text-neutral-200 md:text-[30px]"
            >
              きれいに撮るだけなら、<wbr />今はスマホでもできます。<br />
              大事にしているのは、<wbr />あとで見返したときに<br />
              「あの時の空気」まで<wbr />思い出せる一枚かどうか。
            </p>
          </div>
        </div>
      </section>

      <Works onOpen={openWorks} />
      <Gallery onOpen={openPersonal} />

      <AboutPricingContact />

      <footer className="px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.24em] text-neutral-400">
          <div>© 2026 Hayato Naoe</div>
          <div className="flex items-center gap-5">
            <a href="#" className="link-line">
              Back to top ↑
            </a>
            <a href="https://www.instagram.com/hayato_naoe/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-neutral-300 hover:opacity-60">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </footer>

      {lb && (
        <Lightbox
          items={lb.list}
          index={lb.index}
          showMeta={lb.meta}
          onClose={() => setLb(null)}
          onIndex={(i) => setLb((s) => (s ? { ...s, index: i } : s))}
        />
      )}
    </main>
  );
}

// About / Pricing / Contact（内容は従来どおり、見せ方を新デザインに）。
function AboutPricingContact() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <section id="about" className="scroll-mt-20 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead no="03" en="About" ja="プロフィール" />
          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[0.75fr_1.25fr] md:items-start md:gap-20">
            <div data-reveal className="reveal mx-auto w-full max-w-[280px] md:sticky md:top-28 md:max-w-none">
              <img src="/images/gallery/hero.jpg" alt="Hayato Naoe" className="aspect-[4/5] w-full object-cover object-top" />
              <p className="mt-3 flex justify-between font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                <span>Hayato Naoe</span>
                <span>Tokyo, JP</span>
              </p>
            </div>
            <div data-reveal className="reveal">
              <p className="max-w-[22ch] text-[24px] font-normal leading-[1.7] tracking-[-0.01em] text-neutral-100 md:text-[38px]">
                打ち合わせから<wbr />一緒に考えて、<wbr />その人・そのお店に<wbr />合った一枚を撮ります。
              </p>
              <div className="mt-10 max-w-[62ch] space-y-5 text-sm leading-8 text-neutral-400 md:text-[15px]">
                <p>
                  写真家の<span className="text-neutral-200">直江勇人</span>（なおえ はやと／Hayato Naoe）です。
                </p>
                <p>
                  15歳のとき、<wbr />カメラ好きの父から<wbr />お下がりの一眼レフを<wbr />もらいました。<br />
                  そこから18年、<wbr />ずっと写真を撮り続けています。<br />
                  大学では<wbr />ファッションサークルに入り、<wbr />ストリートスナップを<wbr />撮っていました。
                </p>
                <p>
                  卒業後は<wbr />シーシャ屋で10年間働き、<wbr />3年前に<wbr />カメラマンとして独立。<br />
                  お店の空気やお客さんを<wbr />間近で見てきた経験は、<wbr />いまの飲食店の撮影に<wbr />そのまま生きています。
                </p>
                <p>
                  もともと<wbr />イラストも描いていたので、<wbr />構図や色で<wbr />その場のストーリーまで<wbr />伝わる一枚を<wbr />大事にしています。<br />
                  スタジオでもロケでも、<wbr />まずはじっくり打ち合わせを。<br />
                  夜景をバックにした<wbr />ムードのある写真も<wbr />得意です。
                </p>
              </div>
              <a href="https://www.instagram.com/hayato_naoe/" target="_blank" rel="noreferrer" className="link-line mt-10 inline-block text-[11px] uppercase tracking-[0.24em] text-neutral-300">
                Visit Instagram ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead no="04" en="Pricing" ja="撮影料金" />
          <div className="mt-12 grid grid-cols-1 border-t border-white/10 md:mt-16 md:grid-cols-3 md:border-t-0">
            {[
              { no: "A", t: "ポートレート撮影", p: "¥30,000〜", d: <>SNSや<wbr />マッチングアプリの<wbr />プロフィールから、<wbr />作品撮りまで。<br />夜景ロケの<wbr />ムード撮影も得意です。</> },
              { no: "B", t: "飲食店撮影", p: "¥30,000〜", d: <>内装やメニュー・ドリンクを、<wbr />食べログやInstagramで<wbr />映える一枚に。</> },
              { no: "C", t: "その他", p: "応相談", d: <>イベントや出張撮影など。<br />「こんなの撮れますか？」からどうぞ。</> },
            ].map((x, i) => (
              <div
                key={x.no}
                data-reveal
                className={`reveal border-b border-white/10 py-8 md:border-b-0 md:border-l md:px-8 md:py-4 ${i === 0 ? "md:border-l-0 md:pl-0" : ""}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.3em] text-neutral-500">{x.no}</p>
                <p className="mt-4 text-[16px] tracking-[-0.01em] text-neutral-200">{x.t}</p>
                <p className="display mt-3 text-[40px] leading-none md:text-[52px]">{x.p}</p>
                <p className="mt-5 max-w-[26ch] text-[13px] leading-7 text-neutral-500">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[32ch] text-[13px] leading-7 text-neutral-500">
            内容や撮影時間、<wbr />納品枚数に応じて変動します。<br />
            まずはお気軽にご相談ください。
          </p>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead no="05" en="Contact" ja="お問い合わせ" />
          <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-[1fr_1fr] md:gap-20">
            <div data-reveal className="reveal">
              <p className="display text-[44px] leading-[0.95] md:text-[84px]">
                Let&rsquo;s make
                <br />
                <span className="italic text-neutral-400">something.</span>
              </p>
              <p className="mt-8 max-w-[30ch] text-[16px] leading-[1.9] text-neutral-300 md:text-[19px]">
                「こういうの撮れますか？」<wbr />だけでも大歓迎です。<br />
                フォームからお気軽にどうぞ。
              </p>
            </div>

            <form data-reveal action="https://formspree.io/f/xojpeqan" method="POST" className="reveal grid grid-cols-1 gap-8">
              {[
                { label: "Name", name: "name", type: "text", ph: "お名前" },
                { label: "Email", name: "email", type: "email", ph: "メールアドレス" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    placeholder={f.ph}
                    className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-[16px] text-neutral-100 outline-none transition-colors placeholder:text-neutral-600 focus:border-white"
                  />
                </div>
              ))}
              <div>
                <label className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Message</label>
                <textarea
                  rows={5}
                  name="message"
                  placeholder="ご相談内容"
                  className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-[16px] leading-7 text-neutral-100 outline-none transition-colors placeholder:text-neutral-600 focus:border-white"
                />
              </div>
              <button
                type="submit"
                className="group mt-2 inline-flex w-fit items-center gap-3 rounded-full border border-white/30 px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-white transition-colors hover:bg-white hover:text-black"
              >
                Send Message <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
