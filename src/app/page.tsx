"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import photos from "@/data/photos.json";

// 写真の一覧は src/data/photos.json で管理。
// 追加方法（手動）: public/images/ に画像を入れて node scripts/optimize-images.js を実行し、
// photos.json の works / personal に { "src": "/images/gallery/ファイル名.jpg", "title": "", "category": "portrait" } を足すだけ。
// スマホからは管理画面 /admin（Sveltia CMS）で追加・並べ替えできる。
// works の category は "portrait" / "shop" のどちらか。省略すると portrait 扱い。
// もしくは photo-publisher ツール（stage→review→publish）で自動追記できる。

type Photo = { src: string; title?: string; category?: string };

// Works = 仕事（人物・飲食店）。クライアントに見せる実績。
const works: Photo[] = photos.works;

// Personal = 趣味（夜の街・ネオン・路地・祭り・動物など）。
const personal: Photo[] = photos.personal;

const CATEGORIES: { id: string; en: string; ja: string }[] = [
  { id: "all", en: "All", ja: "すべて" },
  { id: "portrait", en: "Portrait", ja: "ポートレート" },
  { id: "shop", en: "Shop & Bar", ja: "店舗・飲食" },
];
const catOf = (p: Photo) => p.category ?? "portrait";
const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.en ?? "";

// src は「/images/gallery/xxx.jpg」のようなパス（CMS・photo-publisher が書く形）か、拡張子なしのファイル名
const baseOf = (src: string) => src.replace(/^.*\//, "").replace(/\.[a-z0-9]+$/i, "");
const img = (src: string) => (src.includes("/") ? src : `/images/gallery/${src}.jpg`);
// 軽いWebP版（scripts/make-variants.js がビルド時に作る）。画面幅に合う1枚だけ読まれる。
const srcSet = (src: string) => [640, 1280, 1920].map((w) => `/images/w/${baseOf(src)}-${w}.webp ${w}w`).join(", ");

// ---------------------------------------------------------------------------
// サイトを開いた時のオープニング（毎回再生）。
// 生成りの画面にサインが墨のにじみのように書き順で浮かび、朱の落款が押されたあと、
// 白い幕ごとふわっと消えてトップ写真が現れる。
function OpeningAnimation() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 4500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="open-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[#f6f5f1]" aria-hidden="true">
      <div className="relative">
        <img src="/images/gallery/signature.png" alt="" className="sign-ink h-[52svh] w-auto md:h-[62svh]" />
        <span className="open-seal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8.5h3l1.6-2.2h6.8L17 8.5h3v10H4z" />
            <circle cx="12" cy="13.3" r="3.3" />
          </svg>
        </span>
      </div>
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
  onSelect?: (src: string, el: HTMLElement) => void;
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
            data-src={p.src}
            onClick={(e) => onSelect?.(p.src, e.currentTarget)}
            className={`relative shrink-0 overflow-hidden bg-neutral-900 ${height}`}
          >
            <img
              src={img(p.src)}
              srcSet={srcSet(p.src)}
              sizes="(min-width: 768px) 28vw, 45vw"
              alt={i < items.length ? p.title ?? "" : ""}
              loading="lazy"
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
      data-lightbox
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
          srcSet={srcSet(p.src)}
          sizes="100vw"
          alt={p.title ?? ""}
          onClick={(e) => e.stopPropagation()}
          style={{ viewTransitionName: "pf-photo" }}
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
    <div data-reveal className="reveal relative flex flex-wrap items-end justify-between gap-6 pt-8 md:pt-10">
      <span className="sec-rule" aria-hidden="true" />
      <div>
        <p className="flex items-center gap-3 text-[11px] tracking-[0.3em] text-neutral-500">
          <span className="font-[family-name:var(--font-geist-mono)] text-neutral-400">{no}</span>
          <span className="h-px w-6 bg-white/20" aria-hidden="true" />
          <span className="jp tracking-[0.2em]">{ja}</span>
        </p>
        <h2 className="display mt-5 text-[42px] leading-[1] md:text-[68px]">
          <SplitChars text={en} />
        </h2>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// トップ：全画面の写真スライドショー（従来どおり）＋名前。スクロールで写真が沈みながら拡大。
type HeroSlide = { src: string; position?: string };
const heroSlides: HeroSlide[] = photos.heroSlides;

function SplitChars({ text, className = "" }: { text: string; className?: string }) {
  let n = 0;
  return (
    <span className={`split ${className}`} aria-label={text}>
      {text.split(" ").map((w, wi) => (
        <span key={wi} className="split-word" aria-hidden="true">
          {w.split("").map((c, ci) => (
            <span key={ci} className="ch" style={{ "--i": n++ } as React.CSSProperties}>
              {c}
            </span>
          ))}
          {wi < text.split(" ").length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </span>
  );
}

function Hero() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);
  // 表示中と次の1枚だけ読み込む（最初に全部を同時に落とさない）
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  useEffect(() => {
    const next = (active + 1) % heroSlides.length;
    const t = setTimeout(() => setLoaded((s) => (s.has(active) && s.has(next) ? s : new Set([...s, active, next]))), active === 0 ? 2500 : 0);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section data-hero className="relative h-[100svh] w-full overflow-hidden bg-black">
      <div data-hero-media className="absolute inset-0">
        {heroSlides.map((slide, idx) => (
          <img
            key={slide.src}
            src={loaded.has(idx) ? img(slide.src) : undefined}
            srcSet={loaded.has(idx) ? srcSet(slide.src) : undefined}
            sizes="100vw"
            fetchPriority={idx === 0 ? "high" : "low"}
            alt=""
            style={{ objectPosition: slide.position ?? "center" }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
              idx === active ? "opacity-100 hero-zoom" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div data-hero-veil className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="grain" />
      </div>

      <div data-hero-text className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="hero-rise text-[10px] uppercase tracking-[0.4em] text-white/75 md:text-[12px]" style={{ animationDelay: "4.3s" }}>
          Photographer / Tokyo
        </p>
        <h1 className="hero-chars hero-name display mt-6 text-[13vw] leading-[1] md:text-[9vw] xl:text-[132px]">
          <SplitChars text="Hayato Naoe" />
        </h1>
        <p className="hero-rise jp mt-7 text-[14px] font-light tracking-[0.28em] text-white/85 md:text-[16px]" style={{ animationDelay: "5s" }}>
          人物とお店を、空気ごと。
        </p>
      </div>

      <a
        href="#works"
        className="hero-rise absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/70 hover:opacity-70"
        style={{ animationDelay: "5.2s" }}
      >
        Scroll ↓
      </a>
    </section>
  );
}

// 写真が流れる帯。スクロールの勢いで速く・斜めになる（動きは useMotion 側）。
function PhotoBand({ onSelect }: { onSelect: (src: string, el: HTMLElement) => void }) {
  const half = Math.ceil(works.length / 2);
  const rowA = works.slice(0, half);
  const rowB = [...works.slice(half), ...personal.slice(0, 4)];
  return (
    <div data-band className="space-y-3 py-10 md:space-y-4 md:py-14">
      <Marquee items={rowA} duration={70} onSelect={onSelect} height="h-[24vh] md:h-[32vh]" />
      <Marquee items={rowB} duration={80} reverse onSelect={onSelect} height="h-[20vh] md:h-[26vh]" />
    </div>
  );
}

// スクロールで小さな写真が全画面まで広がるシーン。
function ZoomScene() {
  return (
    <section data-zoom className="zoom-scene" aria-label="Portrait, Shop & Bar">
      <div className="zoom-pin">
        <div className="zoom-frame">
          <img src={img("work-1")} srcSet={srcSet("work-1")} sizes="100vw" alt="" loading="lazy" />
        </div>
        <p className="zoom-text display" aria-hidden="true">
          <span>Portrait.</span>
          <span>Shop&nbsp;&amp;&nbsp;Bar.</span>
        </p>
      </div>
    </section>
  );
}

// Works：カテゴリ絞り込み＋グリッド＋モーダル。
function Works({ onOpen }: { onOpen: (list: Photo[], i: number, el?: HTMLElement) => void }) {
  const [cat, setCat] = useState("all");
  const list = cat === "all" ? works : works.filter((w) => catOf(w) === cat);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="works" className="scroll-mt-20 px-6 py-20 md:px-10 md:py-28">
      <div ref={ref} className="mx-auto max-w-[1400px]">
        <SectionHead no="01" en="Works" ja="撮影実績">
          <div className="flex flex-wrap gap-1.5 md:gap-2" role="tablist" aria-label="カテゴリ">
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
                  className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors md:px-4 md:text-[11px] md:tracking-[0.18em] ${
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

        <div key={cat} className="works-grid mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
          {list.map((p, i) => (
            <button
              key={p.src}
              type="button"
              data-src={p.src}
              onClick={(e) => onOpen(list, i, e.currentTarget)}
              data-reveal
              className="reveal-clip group text-left"
              style={{ transitionDelay: `${(i % 3) * 90}ms` }}
            >
              <div className="clip relative aspect-[4/5] overflow-hidden bg-neutral-900">
                <img
                  src={img(p.src)}
                  srcSet={srcSet(p.src)}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  alt={p.title ?? ""}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 to-transparent p-4 text-[10px] uppercase tracking-[0.3em] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  View ↗
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-3">
                <p className="text-[14px] font-light tracking-[0.02em] text-neutral-100 md:text-[16px]">{p.title}</p>
                <p className="shrink-0 font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.24em] text-neutral-500 md:text-[10px]">
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
function Gallery({ onOpen }: { onOpen: (list: Photo[], i: number, el?: HTMLElement) => void }) {
  const ref = useReveal<HTMLDivElement>();
  const [all, setAll] = useState(false);
  return (
    <section id="gallery" className="scroll-mt-20 py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHead no="02" en="Gallery" ja="個人作品">
          <p className="max-w-[34ch] text-[13px] leading-[2] tracking-[0.04em] text-neutral-400">
            仕事を離れて<wbr />撮りためている<wbr />個人的な写真です。<wbr />タップで拡大できます。
          </p>
        </SectionHead>
      </div>

      <div className="mt-12 md:mt-16">
        <Marquee
          items={personal.slice(0, 16)}
          duration={90}
          height="h-[22vh] md:h-[30vh]"
          onSelect={(src, el) => onOpen(personal, Math.max(0, personal.findIndex((p) => p.src === src)), el)}
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className={`tiles mt-6 grid grid-cols-3 gap-1.5 md:mt-8 md:grid-cols-6 md:gap-2 ${all ? "" : "is-collapsed"}`}>
          {personal.map((p, i) => (
            <button
              key={p.src}
              type="button"
              data-src={p.src}
              onClick={(e) => onOpen(personal, i, e.currentTarget)}
              className="group relative aspect-square overflow-hidden bg-neutral-900"
            >
              <img
                src={img(p.src)}
                srcSet={srcSet(p.src)}
                sizes="(min-width: 1024px) 17vw, 33vw"
                alt={p.title ?? ""}
                loading="lazy"
                className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
            </button>
          ))}
        </div>
        {!all && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setAll(true)}
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-neutral-200 transition-colors hover:bg-white hover:text-black"
            >
              View all
              <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-neutral-500 group-hover:text-black/60">{personal.length}</span>
            </button>
          </div>
        )}
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

// 慣性スクロール（Lenis）＋スクロール連動アニメーション（GSAP ScrollTrigger）。
// 失敗しても・「視差効果を減らす」設定でも、ページはそのまま普通に動く。
function useMotion(locked: boolean) {
  const lenisRef = useRef<{ stop: () => void; start: () => void } | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      document.documentElement.classList.add("js-motion");

      const lenis = new Lenis({ duration: 1.25, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // ページ内リンクはぬるっと移動
      const onClick = (e: MouseEvent) => {
        const t = e.target as HTMLElement;
        const a = t.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
        if (a) {
          const id = a.getAttribute("href")!;
          const target = id === "#" ? 0 : (document.querySelector(id) as HTMLElement | null);
          if (target === null) return;
          e.preventDefault();
          lenis.scrollTo(target, { offset: id === "#" ? 0 : -60, duration: 1.6 });
        }
        // カテゴリ切替などで高さが変わったら位置を再計算
        if (t.closest?.('[role="tab"]')) setTimeout(() => ScrollTrigger.refresh(), 80);
      };
      document.addEventListener("click", onClick);

      const ctx = gsap.context(() => {
        // トップ：写真が沈みながら拡大、文字は上へ抜ける
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true } })
          .to("[data-hero-media]", { yPercent: 30, scale: 1.2, ease: "none" }, 0)
          .to("[data-hero-text]", { yPercent: -40, opacity: 0, ease: "none" }, 0)
          .to("[data-hero-veil]", { opacity: 0.5, ease: "none" }, 0);

        // 流れる帯：スクロールの勢いで加速＆斜めに
        const loops: gsap.core.Tween[] = [];
        document.querySelectorAll<HTMLElement>(".marquee-track").forEach((track) => {
          const dur = parseFloat(track.style.animationDuration) || 60;
          track.style.animation = "none";
          const tw = track.classList.contains("marquee-reverse")
            ? gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: dur, ease: "none", repeat: -1 })
            : gsap.to(track, { xPercent: -50, duration: dur, ease: "none", repeat: -1 });
          loops.push(tw);
          track.addEventListener("mouseenter", () => gsap.to(tw, { timeScale: 0.15, duration: 0.6 }));
          track.addEventListener("mouseleave", () => gsap.to(tw, { timeScale: 1, duration: 0.6 }));
        });
        const skewTo = gsap.quickTo(".marquee-track img", "skewX", { duration: 0.5, ease: "power3" });
        lenis.on("scroll", ({ velocity }: { velocity: number }) => {
          const v = Math.max(-40, Math.min(40, velocity));
          loops.forEach((tw) => gsap.to(tw, { timeScale: 1 + Math.abs(v) / 4, duration: 0.3, overwrite: true }));
          skewTo(-v * 0.25);
        });
        gsap.from("[data-band] .marquee", {
          xPercent: (i: number) => (i ? 18 : -18),
          opacity: 0,
          duration: 1.6,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-band]", start: "top 92%" },
        });

        // 小さな写真 → 全画面、言葉が順に出る
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-zoom]", start: "top top", end: "bottom bottom", scrub: 0.6 } })
          .to(".zoom-frame", { width: "100vw", height: "100vh", borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0)
          .to(".zoom-frame img", { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".zoom-text span", { opacity: 0, y: 60 }, { opacity: 1, y: 0, stagger: 0.18, duration: 0.3 }, 0.55);

        // 写真のパララックス
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(el, { yPercent: -8 }, {
            yPercent: 8, ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });

      // カーソル：写真の上で「VIEW」
      let cur: HTMLDivElement | null = null;
      let onMove: ((e: MouseEvent) => void) | null = null;
      let onOver: ((e: MouseEvent) => void) | null = null;
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        cur = document.createElement("div");
        cur.className = "cursor";
        cur.innerHTML = "<span>View</span>";
        document.body.appendChild(cur);
        const cx = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" });
        const cy = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
        onMove = (e) => { cx(e.clientX); cy(e.clientY); cur!.style.opacity = "1"; };
        onOver = (e) => {
          const t = e.target as HTMLElement;
          cur!.classList.toggle("is-view", !!t.closest?.("button img, [data-view]") && !document.querySelector("[data-lightbox]"));
        };
        window.addEventListener("mousemove", onMove);
        document.addEventListener("mouseover", onOver);
      }

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      cleanup = () => {
        ctx.revert();
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisRef.current = null;
        document.removeEventListener("click", onClick);
        window.removeEventListener("load", onLoad);
        if (onMove) window.removeEventListener("mousemove", onMove);
        if (onOver) document.removeEventListener("mouseover", onOver);
        cur?.remove();
        document.documentElement.classList.remove("js-motion");
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // モーダル・メニューを開いている間は慣性スクロールを止める
  useEffect(() => {
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [locked]);
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lb, setLb] = useState<{ list: Photo[]; index: number; meta: boolean } | null>(null);
  const restRef = useReveal<HTMLDivElement>();
  useMotion(!!lb || menuOpen);

  // 写真を開く/閉じるとき、タップした写真がその位置から拡大・元の位置へ戻る（View Transitions 対応ブラウザのみ）
  const morph = (el: HTMLElement | null | undefined, update: () => void) => {
    const d = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    const pic = el?.querySelector("img") ?? null;
    if (!d.startViewTransition || !pic || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update();
      return;
    }
    pic.style.viewTransitionName = "pf-photo";
    const t = d.startViewTransition(() => {
      pic.style.viewTransitionName = "";
      flushSync(update);
    });
    t.finished.finally(() => { pic.style.viewTransitionName = ""; });
  };
  const openWorks = (list: Photo[], i: number, el?: HTMLElement) => morph(el, () => setLb({ list, index: i, meta: true }));
  const openPersonal = (list: Photo[], i: number, el?: HTMLElement) => morph(el, () => setLb({ list, index: i, meta: false }));
  const openFromHero = (src: string, el?: HTMLElement) => {
    const wi = works.findIndex((w) => w.src === src);
    if (wi >= 0) return openWorks(works, wi, el);
    const pi = personal.findIndex((p) => p.src === src);
    if (pi >= 0) openPersonal(personal, pi, el);
  };
  // 閉じるとき：いま表示中の写真が画面内にあれば、そこへ縮んで戻る
  const closeLb = () => {
    const src = lb?.list[lb.index]?.src;
    const cands = src ? Array.from(document.querySelectorAll<HTMLElement>(`[data-src="${CSS.escape(src)}"]`)) : [];
    const back = cands.find((c) => {
      const r = c.getBoundingClientRect();
      return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
    });
    const d = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    const pic = back?.querySelector("img");
    if (!d.startViewTransition || !pic || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLb(null);
      return;
    }
    const t = d.startViewTransition(() => {
      flushSync(() => setLb(null));
      pic.style.viewTransitionName = "pf-photo";
    });
    t.finished.finally(() => { pic.style.viewTransitionName = ""; });
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
      <div className="scroll-progress" aria-hidden="true" />

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
      </header>

      {/* スマホの全画面メニュー：項目が順にせり上がる */}
      {menuOpen && (
        <div className="menu-panel fixed inset-0 z-40 flex flex-col justify-between bg-[#0e0e0e]/95 px-6 pb-10 pt-28 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV.map((n, i) => (
              <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="menu-item display text-[46px] leading-[1.1]">
                <span style={{ "--i": i } as React.CSSProperties}>
                  <small className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.2em] text-neutral-500">0{i + 1}</small>
                  {n.label}
                </span>
              </a>
            ))}
          </nav>
          <div className="menu-item flex items-end justify-between border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.24em] text-neutral-400">
            <span style={{ "--i": NAV.length } as React.CSSProperties} className="flex w-full items-end justify-between">
              <span className="jp normal-case tracking-[0.12em]">東京のフォトグラファー</span>
              <a href="https://www.instagram.com/hayato_naoe/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-200">
                <InstagramIcon /> Instagram
              </a>
            </span>
          </div>
        </div>
      )}

      <Hero />
      <PhotoBand onSelect={openFromHero} />

      {/* Intro */}
      <section className="px-6 py-24 md:px-10 md:py-40">
        <div ref={restRef} className="mx-auto max-w-[1400px]">
          <div data-reveal className="reveal grid gap-8 md:grid-cols-[0.35fr_1fr]">
            <p className="flex items-center gap-3 font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.3em] text-neutral-500">
              <span className="h-px w-6 bg-white/25" aria-hidden="true" />
              Intro
            </p>
            {/* スクロールに合わせて1行ずつ白く浮かび上がる（.intro-line） */}
            <p className="jp text-[21px] font-light leading-[2.05] tracking-[0.06em] md:text-[32px] md:leading-[2]">
              <span className="intro-line">きれいに撮るだけなら、<wbr />今はスマホでもできます。</span>
              <br />
              <span className="intro-line">大事にしているのは、<wbr />あとで見返したときに</span>
              <br />
              <span className="intro-line">「あの時の空気」まで<wbr />思い出せる一枚かどうか。</span>
            </p>
          </div>
        </div>
      </section>

      <ZoomScene />

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
          onClose={closeLb}
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
              <img src="/images/gallery/hero.jpg" srcSet={srcSet("hero")} sizes="(min-width: 768px) 40vw, 280px" loading="lazy" alt="Hayato Naoe" className="aspect-[4/5] w-full object-cover object-top" />
              <p className="mt-3 flex justify-between font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                <span>Hayato Naoe</span>
                <span>Tokyo, JP</span>
              </p>
            </div>
            <div data-reveal className="reveal">
              {/* 意味の切れ目で3行に（スマホでも行の長さがそろうように） */}
              <p className="text-[21px] font-light leading-[1.8] tracking-[0.04em] text-neutral-100 md:text-[36px]">
                <span className="block">打ち合わせから<wbr />一緒に考えて、</span>
                <span className="block">その人・そのお店に</span>
                <span className="block">合った一枚を撮ります。</span>
              </p>
              <div className="mt-10 max-w-[62ch] space-y-6 text-[14px] leading-[2.05] tracking-[0.04em] text-neutral-400 md:text-[15px]">
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
          <SectionHead no="04" en="Pricing" ja="料金" />
          <div className="mt-12 grid grid-cols-1 border-t border-white/10 md:mt-16 md:grid-cols-2 md:border-t-0 lg:grid-cols-4">
            {[
              { no: "A", t: "ポートレート撮影", p: "¥30,000", d: <>SNSや<wbr />マッチングアプリの<wbr />プロフィールから、<wbr />作品撮りまで。<br />夜景ロケの<wbr />ムード撮影も得意です。</> },
              { no: "B", t: "飲食店撮影", p: "¥50,000", d: <>内装やメニュー・ドリンクを、<wbr />食べログやInstagramで<wbr />映える一枚に。</> },
              { no: "C", t: "Webサイト制作", p: "¥50,000", sub: "撮影セット ¥120,000〜", d: <>プロフィールサイトや<wbr />お店の紹介ページを<wbr />1ページで。<br />撮影とセットなら、<wbr />写真もサイトも<wbr />まとめてお任せいただけます。</> },
              { no: "D", t: "その他", p: "", d: <>イベントや出張撮影など。<br />「こんなの撮れますか？」<wbr />からどうぞ。</> },
            ].map((x, i) => (
              <div
                key={x.no}
                data-reveal
                className={`reveal border-b border-white/10 py-8 md:border-b-0 md:py-6 lg:py-4 ${
                  i % 2 === 0 ? "md:border-l-0 md:pl-0 md:pr-8" : "md:border-l md:px-8"
                } ${i >= 2 ? "md:border-t md:pt-8" : ""} ${
                  i === 0 ? "lg:border-l-0 lg:pl-0 lg:pr-8" : "lg:border-l lg:px-8"
                } ${i >= 2 ? "lg:border-t-0" : ""}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <p className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.3em] text-neutral-500">{x.no}</p>
                <p className="mt-4 text-[15px] tracking-[0.06em] text-neutral-200">{x.t}</p>
                {x.p ? (
                  <p className="mt-3 flex items-baseline gap-1.5 leading-none">
                    <span className="display text-[44px] tabular-nums tracking-[0.04em] md:text-[48px]">{x.p}</span>
                    <span className="text-[13px] tracking-[0.1em] text-neutral-400">〜</span>
                  </p>
                ) : (
                  <p className="mt-4 text-[26px] font-light leading-none tracking-[0.16em] text-neutral-100 md:mt-5">応相談</p>
                )}
                {x.sub && (
                  <p className="mt-3 text-[12px] tracking-[0.06em] text-neutral-400">{x.sub}</p>
                )}
                <p className="mt-5 max-w-[26ch] text-[13px] leading-[2] tracking-[0.04em] text-neutral-500">{x.d}</p>
              </div>
            ))}
          </div>

          {/* Webサイト制作のオプション（スマホではみ出さないよう文節ごとに折り返す） */}
          <div data-reveal className="reveal mt-10 border-l border-white/10 pl-4 text-[12px] leading-[1.9] tracking-[0.04em] text-neutral-500">
            <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.24em] text-neutral-400">Web options</p>
            <ul className="space-y-1.5">
              <li>ブログ・お知らせ更新機能<wbr />（ご自身で更新できる<wbr />管理画面）<wbr /><span className="text-neutral-300">＋¥30,000〜</span></li>
              <li>更新代行プラン <wbr /><span className="text-neutral-300">月¥5,000〜</span></li>
              <li>ドメイン・サーバー費用は<wbr />実費となります</li>
            </ul>
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
              <p className="display text-[38px] leading-[1.1] md:text-[56px]">
                Let&rsquo;s make
                <br />
                <span className="text-neutral-400">something.</span>
              </p>
              <p className="mt-8 max-w-[30ch] text-[15px] font-light leading-[2] tracking-[0.04em] text-neutral-300 md:text-[18px]">
                「こういうの撮れますか？」<wbr />だけでも大歓迎です。<br />
                フォームからお気軽にどうぞ。
              </p>
            </div>

            <form data-reveal action="https://formspree.io/f/xojpeqan" method="POST" className="reveal grid grid-cols-1 gap-8">
              <div>
                <label className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">Type / ご依頼内容</label>
                <select
                  name="type"
                  defaultValue=""
                  className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-[16px] text-neutral-100 outline-none transition-colors focus:border-white [&>option]:bg-neutral-900"
                >
                  <option value="" disabled>選択してください</option>
                  <option value="ポートレート撮影">ポートレート撮影</option>
                  <option value="飲食店・店舗撮影">飲食店・店舗撮影</option>
                  <option value="Webサイト制作">Webサイト制作</option>
                  <option value="撮影＋サイト制作セット">撮影＋サイト制作セット</option>
                  <option value="その他・相談">その他・相談</option>
                </select>
              </div>
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
