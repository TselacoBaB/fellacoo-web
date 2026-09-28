import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Globe2, Sparkles } from "lucide-react";

const pillars = [
  { number: "01", title: "Own Your Audience", text: "Social platforms can change the rules overnight. Your website is the place your business owns the experience, the data and the relationship." },
  { number: "02", title: "Build Instant Credibility", text: "Your website gives customers a permanent place to understand who you are, what you offer and why they should trust you." },
  { number: "03", title: "Automate Your Growth", text: "A modern website can capture leads, qualify visitors, answer questions, track behaviour and create opportunities while you sleep." },
  { number: "04", title: "Control the Narrative", text: "Your brand, story, proof, offers and customer journey should live in an experience you control." }
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08070b] text-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_35%,rgba(151,72,255,.42),transparent_25%),radial-gradient(circle_at_50%_70%,rgba(91,36,167,.22),transparent_35%),linear-gradient(135deg,#050507_0%,#0d0914_52%,#030305_100%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:25%_100%,100%_100%]" />

        <div className="absolute left-1/2 top-[13%] h-[52vw] w-[52vw] max-h-[760px] max-w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_38%_32%,#ffffff_0%,#d8c9f5_7%,#8052b6_22%,#271538_46%,transparent_70%)] opacity-80 blur-[1px]" />
        <div className="absolute left-[58%] top-[17%] h-[34vw] w-[34vw] max-h-[500px] max-w-[500px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />

        <header className="relative z-20 flex items-center justify-between px-5 py-5 md:px-8 lg:px-12">
          <Link href="/" className="text-lg font-semibold tracking-[-0.04em]">FELLACOO</Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-xl md:flex">
            {["Why websites", "Growth engine", "Builder", "AI"].map((item) => (
              <a key={item} href={item === "Why websites" ? "#why" : item === "Growth engine" ? "#engine" : "#builder"} className="rounded-full px-4 py-2 text-xs text-white/80 transition hover:bg-white/15 hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <Link href="/dashboard" className="rounded-full border border-white/30 bg-white/90 px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white">
            Build a website <ArrowUpRight className="ml-1 inline-block" size={13} />
          </Link>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-84px)] max-w-[1500px] flex-col justify-between px-5 pb-8 pt-10 md:px-10 lg:px-12">
          <div className="grid flex-1 items-center lg:grid-cols-[.75fr_1.25fr]">
            <div className="relative z-10 max-w-xl pt-10 lg:pt-0">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[11px] uppercase tracking-[.22em] text-white/65 backdrop-blur">
                <Sparkles size={12} />
                Websites that work while you sleep
              </div>

              <h1 className="text-[15vw] font-medium leading-[.78] tracking-[-.09em] text-white sm:text-[13vw] lg:text-[8.5vw]">
                YOUR
                <br />
                <span className="text-white/85">24/7</span>
                <br />
                WEBSITE.
              </h1>

              <p className="mt-9 max-w-md text-base leading-7 text-white/65 md:text-lg">
                A website is more than a digital brochure. It is your storefront,
                salesperson and credibility anchor — working for your business around the clock.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/dashboard" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">
                  Build your website <ArrowUpRight className="ml-1 inline-block" size={15} />
                </Link>
                <a href="#why" className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-white/80 backdrop-blur">
                  Why it matters <ArrowDownRight className="ml-1 inline-block" size={15} />
                </a>
              </div>
            </div>

            <div className="relative hidden h-[68vh] min-h-[520px] lg:block">
              <div className="absolute left-[8%] top-[9%] h-[78%] w-[70%] rounded-[48%] bg-[radial-gradient(ellipse_at_45%_35%,rgba(255,255,255,.9),rgba(214,185,255,.55)_10%,rgba(113,61,165,.55)_27%,rgba(20,12,30,.9)_61%,transparent_72%)] blur-[2px]" />
              <div className="absolute left-[22%] top-[18%] h-[54%] w-[45%] rounded-[50%] border border-white/20 bg-white/[.035] shadow-[0_0_120px_rgba(171,87,255,.25)] backdrop-blur-[2px]" />
              <div className="absolute left-[30%] top-[29%] h-[31%] w-[31%] rounded-full bg-black/70 shadow-[inset_-18px_-15px_50px_rgba(255,255,255,.12),0_0_90px_rgba(159,79,255,.28)]" />
              <div className="absolute left-[35%] top-[35%] h-28 w-28 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl" />
              <div className="absolute left-[40%] top-[40%] text-center text-[10px] uppercase tracking-[.35em] text-white/80">Fellacoo<br />Web</div>
              <div className="absolute right-[8%] top-[28%] w-36 text-right text-xs leading-5 text-white/50">Design<br />Experience<br />Conversion</div>
              <div className="absolute bottom-[9%] left-[20%] text-xs uppercase tracking-[.25em] text-white/45">Build something people remember.</div>
            </div>
          </div>

          <div className="flex items-end justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[.2em] text-white/40">
            <span>Digital storefront / sales engine / credibility anchor</span>
            <span className="hidden md:block">Scroll to explore ↓</span>
          </div>
        </div>
      </section>

      <section id="why" className="bg-[#f2f0ed] text-[#0b0b0d]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-36 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.25em] text-black/45">Why your website matters</p>
              <h2 className="mt-6 max-w-2xl text-5xl font-medium leading-[.92] tracking-[-.06em] md:text-7xl">
                YOUR BUSINESS
                <br />
                DESERVES A
                <br />
                HOME.
              </h2>
            </div>
            <div className="max-w-2xl lg:pt-12">
              <p className="text-2xl leading-9 tracking-[-.02em] md:text-4xl md:leading-[1.12]">
                A website is your <span className="font-semibold">24/7 digital storefront, salesperson, and credibility anchor.</span>
              </p>
              <p className="mt-8 text-base leading-7 text-black/55 md:text-lg">
                Social media can introduce your business. Your website gives people somewhere to land,
                understand your offer, trust your brand and take the next step.
              </p>
            </div>
          </div>

          <div className="mt-20 grid border-t border-black/10 md:grid-cols-2">
            {pillars.map((pillar) => (
              <article key={pillar.number} className="border-b border-black/10 py-9 md:border-r md:px-8 md:first:pl-0 md:nth-[2n]:border-r-0 md:nth-[n+3]:pb-3">
                <div className="flex gap-8">
                  <span className="text-xs font-semibold text-black/35">{pillar.number}</span>
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight">{pillar.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-6 text-black/55">{pillar.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="engine" className="relative overflow-hidden bg-[#09080b] py-24 text-white md:py-36">
        <div className="absolute right-[-10%] top-[10%] h-[600px] w-[600px] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="relative mx-auto max-w-[1500px] px-5 md:px-10 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.25em] text-white/40">Not just a website</p>
              <h2 className="mt-6 text-5xl font-medium leading-[.9] tracking-[-.07em] md:text-7xl">
                BUILD.
                <br />
                ENGAGE.
                <br />
                CONVERT.
              </h2>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-2">
              {[
                ["01", "Attract", "Turn your website into a destination for people discovering your business."],
                ["02", "Qualify", "Use forms, quizzes, calculators and AI conversations to understand intent."],
                ["03", "Convert", "Give every visitor a clear next step — enquiry, booking, purchase or call."],
                ["04", "Learn", "Track behaviour and leads so the website gets smarter over time."]
              ].map(([number, title, text]) => (
                <div key={number} className="rounded-3xl border border-white/10 bg-white/[.04] p-7 backdrop-blur-xl">
                  <div className="text-xs text-white/35">{number}</div>
                  <h3 className="mt-12 text-2xl font-medium">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="builder" className="bg-[#e9e6e1] text-[#0b0b0d]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-36 lg:px-12">
          <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.25em] text-black/40">Fellacoo Web</p>
              <h2 className="mt-6 max-w-4xl text-6xl font-medium leading-[.85] tracking-[-.08em] md:text-8xl">
                DESIGN IT.
                <br />
                <span className="text-black/35">GROW WITH IT.</span>
              </h2>
            </div>
            <div className="max-w-md lg:pb-2">
              <p className="text-lg leading-7 text-black/60">
                Create beautiful websites visually, then turn them into active growth
                systems with AI, analytics, lead capture and automation.
              </p>
              <Link href="/dashboard" className="mt-7 inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
                Enter Fellacoo Web <ArrowUpRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>

          <div className="relative mt-20 overflow-hidden rounded-[2rem] border border-black/10 bg-[#121116] p-3 shadow-2xl md:p-5">
            <div className="overflow-hidden rounded-[1.5rem] bg-[#f7f5f1]">
              <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                <div className="flex items-center gap-2 text-xs font-semibold"><Globe2 size={14} /> Live website canvas</div>
                <div className="rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[.18em]">Desktop · Tablet · Mobile</div>
              </div>
              <div className="grid min-h-[420px] place-items-center bg-[radial-gradient(circle_at_65%_35%,rgba(136,76,206,.18),transparent_25%),linear-gradient(135deg,#f8f6f2,#e9e4dc)] p-8">
                <div className="max-w-3xl text-center">
                  <div className="text-xs font-semibold uppercase tracking-[.25em] text-black/40">The builder</div>
                  <div className="mt-5 text-5xl font-medium tracking-[-.07em] md:text-7xl">Your website becomes the canvas.</div>
                  <div className="mx-auto mt-5 max-w-xl text-sm leading-6 text-black/50">Select. Edit. Resize. Rearrange. Ask Fellacoo AI to change it. Publish when it is ready.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#08070b] px-5 py-8 text-white md:px-10 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold tracking-tight">FELLACOO WEB</div>
          <div className="text-xs text-white/35">Your website. Your audience. Your growth engine.</div>
          <Link href="/dashboard" className="text-xs font-semibold text-white/70 hover:text-white">Start building ↗</Link>
        </div>
      </footer>
    </main>
  );
}