const works = [
  { title: "Alone in the Neon", location: "Shibuya", year: "2025", aspect: "aspect-[4/5]", span: "md:col-span-7", offset: "" },
  { title: "Smoke and Silence", location: "Shinjuku", year: "2025", aspect: "aspect-[3/4]", span: "md:col-span-5", offset: "md:mt-12" },
  { title: "Out of Place", location: "Shinjuku", year: "2026", aspect: "aspect-[4/3]", span: "md:col-span-5", offset: "md:-mt-6" },
  { title: "Moments in the Air", location: "Koenji", year: "2025", aspect: "aspect-[4/5]", span: "md:col-span-7", offset: "md:mt-10" },
  { title: "The Puppeteer", location: "Ueno", year: "2026", aspect: "aspect-[3/4]", span: "md:col-span-4", offset: "" },
  { title: "Masked Rhythm", location: "Shibuya", year: "2025", aspect: "aspect-[4/3]", span: "md:col-span-8", offset: "md:mt-14" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-neutral-900">
      <header className="px-6 py-4 md:px-10 md:py-5">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between text-[11px] uppercase tracking-[0.24em] text-neutral-500">
          <div className="text-neutral-700">Hayato Naoe</div>
          <nav className="flex gap-5">
            <a href="#works" className="text-neutral-400 hover:opacity-60">
  Works
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
        </div>
      </header>

      <section className="px-5 pb-14 pt-6 md:px-10 md:pb-32 md:pt-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              Photography / Tokyo
            </p>

            <h1 className="mt-7 max-w-[11ch] text-[42px] leading-[0.98] tracking-[-0.04em] md:text-[76px]">
              Fragments of everyday life, quietly observed.
            </h1>

            <p className="mt-8 max-w-sm text-sm leading-7 text-neutral-500 md:text-base">
              Street photographs shaped by light, distance, and silence.
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
          <p className="mt-5 max-w-[22ch] text-[20px] font-normal leading-[1.75] tracking-[-0.02em] text-neutral-700 md:text-[32px]">
            Quiet observations from Tokyo and beyond — photographs built on
            atmosphere, small tension, and passing light.
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
          <p className="mt-6 max-w-[22ch] text-[20px] font-normal leading-[1.75] tracking-[-0.02em] text-neutral-700 md:text-[32px]">
            I photograph brief moments that often disappear before they are
            noticed. Through street photography, I try to preserve the mood,
            rhythm, and small tensions of the city.
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