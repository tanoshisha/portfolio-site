const works = [
  { title: "Crossing", location: "Tokyo", year: "2026" },
  { title: "After Rain", location: "Shinjuku", year: "2026" },
  { title: "Distance", location: "Koenji", year: "2026" },
  { title: "Last Train", location: "Tokyo", year: "2025" },
  { title: "Neon Silence", location: "Kabukicho", year: "2026" },
  { title: "Passing Light", location: "Shibuya", year: "2026" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-neutral-900">
      <header className="px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-500">
          <div>Naoe Hayato</div>
          <nav className="flex gap-5">
            <a href="#works" className="hover:opacity-60">
              Works
            </a>
            <a href="#about" className="hover:opacity-60">
              About
            </a>
            <a href="#" className="hover:opacity-60">
              Instagram
            </a>
          </nav>
        </div>
      </header>

      <section className="px-6 pb-16 pt-8 md:px-10 md:pb-24 md:pt-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Street Photography / Tokyo
            </p>

            <h1 className="mt-6 max-w-3xl text-4xl leading-tight tracking-tight md:text-7xl">
              Fragments of everyday life, quietly observed.
            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-neutral-600 md:text-base">
              A selection of street photographs focused on gesture, light,
              distance, and silence.
            </p>

            <a
              href="#works"
              className="mt-10 inline-block border-b border-neutral-900 pb-1 text-xs uppercase tracking-[0.2em] hover:opacity-60"
            >
              View Selected Works
            </a>
          </div>

          <div>
            <img
              src="/images/hero.jpg"
              alt="Hero photograph"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl border-t border-black/10 pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Intro
          </p>
          <p className="mt-5 max-w-3xl text-xl leading-9 text-neutral-700 md:text-3xl">
            Quiet observations from Tokyo and beyond — photographs built on
            atmosphere, small tension, and passing light.
          </p>
        </div>
      </section>

      <section id="works" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Selected Works
          </p>
          <h2 className="mt-3 text-3xl tracking-tight md:text-5xl">
            A quiet editorial layout for your photographs
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {works.map((work, index) => (
              <a key={work.title} href="#" className="block">
                <img
                  src={`/images/work-${index + 1}.jpg`}
                  alt={work.title}
                  className="aspect-[4/5] w-full object-cover"
                />

                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base">{work.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {work.location}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                    {work.year}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 border-t border-black/10 pt-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Featured Project
            </p>
            <h2 className="mt-4 text-3xl tracking-tight md:text-5xl">
              Tokyo Streets
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-600 md:text-base">
              A study of fleeting moments and quiet tension in public space.
            </p>

            <a
              href="#"
              className="mt-10 inline-block border-b border-neutral-900 pb-1 text-xs uppercase tracking-[0.2em] hover:opacity-60"
            >
              View Project
            </a>
          </div>

          <div>
            <img
              src="/images/featured.jpg"
              alt="Featured photograph"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="about" className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl border-t border-black/10 pt-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Statement
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-neutral-700 md:text-3xl">
            I photograph brief moments that often disappear before they are
            noticed. Through street photography, I try to preserve the mood,
            rhythm, and small tensions of the city.
          </p>

          <a
            href="#"
            className="mt-10 inline-block border-b border-neutral-900 pb-1 text-xs uppercase tracking-[0.2em] hover:opacity-60"
          >
            Visit Instagram
          </a>
        </div>
      </section>

      <footer className="px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-black/10 pt-5 text-xs uppercase tracking-[0.2em] text-neutral-500">
          <div>Naoe Hayato</div>
          <div>2026</div>
        </div>
      </footer>
    </main>
  );
}