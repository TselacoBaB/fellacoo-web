"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDot,
  MousePointer2,
  Sparkles,
  WandSparkles,
  Zap
} from "lucide-react";

const pillars = [
  ["01", "OWN YOUR AUDIENCE", "Social platforms can change the rules overnight. Your website is where your business owns the experience, the data and the relationship."],
  ["02", "BUILD CREDIBILITY", "Give customers a permanent place to understand who you are, what you offer and why they should trust you."],
  ["03", "AUTOMATE GROWTH", "Capture leads, qualify visitors, answer questions, track behaviour and create opportunities while you sleep."],
  ["04", "CONTROL THE NARRATIVE", "Your brand, story, proof, offers and customer journey live inside an experience you control."]
];

const heroWords = ["24/7", "DIGITAL", "GROWTH", "SALES", "BRAND"];
const heroMessages = [
  "Always open. Always working.",
  "Your digital storefront, everywhere.",
  "Turn attention into momentum.",
  "Turn visitors into opportunities.",
  "Make your brand impossible to ignore."
];

const engine = [
  { n: "01", icon: Sparkles, title: "ATTRACT", text: "Create experiences that make people stop scrolling and start exploring." },
  { n: "02", icon: BrainCircuit, title: "QUALIFY", text: "Forms, quizzes, calculators and AI conversations turn attention into intent." },
  { n: "03", icon: Zap, title: "CONVERT", text: "Every visitor gets a clear next step — enquiry, booking, purchase or call." },
  { n: "04", icon: ChartNoAxesCombined, title: "LEARN", text: "Behaviour and lead data show you what is working and what should change." }
];

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [heroWord, setHeroWord] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setScrolled(window.scrollY > 40);
    };
    const onPointer = (event: PointerEvent) => {
      setPointer({
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5
      });
    };
    const wordTimer = window.setInterval(() => {
      setHeroWord((current) => (current + 1) % heroWords.length);
    }, 2600);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.clearInterval(wordTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const px = pointer.x * 28;
  const py = pointer.y * 20;

  return (
    <main className="fellacoo-site overflow-hidden bg-[#050507] text-white">
      <div className="noise-overlay" aria-hidden="true" />

      <section ref={heroRef} className="hero relative min-h-screen overflow-hidden">
        <div className="hero-grid absolute inset-0" />
        <div
          className="hero-orb hero-orb-one"
          style={{ transform: `translate3d(${px}px,${py + scrollY * 0.05}px,0)` }}
        />
        <div
          className="hero-orb hero-orb-two"
          style={{ transform: `translate3d(${-px * 1.6}px,${-py * 1.4 + scrollY * -0.08}px,0)` }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_38%,rgba(175,70,255,.16),transparent_27%),radial-gradient(circle_at_15%_80%,rgba(0,119,255,.10),transparent_25%)]" />

        <header className={`site-nav fixed left-0 right-0 top-0 z-50 px-5 py-5 md:px-8 lg:px-12 ${scrolled ? "site-nav-scrolled" : ""}`}>
          <div className="mx-auto flex max-w-[1600px] items-center justify-between">
            <Link href="/" className="relative z-10 w-36 md:w-44">
              <img src="/fellacoo-logo-transparent.png" alt="Fellacoo" className="w-full object-contain" />
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-white/15 bg-black/20 p-1 backdrop-blur-xl md:flex">
              <a href="#why" className="nav-pill">Why websites</a>
              <a href="#engine" className="nav-pill">Growth engine</a>
              <a href="#builder" className="nav-pill">Builder</a>
              <a href="#ai" className="nav-pill">AI</a>
            </nav>

            <Link href="/dashboard" className="magnetic-button group rounded-full border border-white/25 bg-white px-5 py-3 text-xs font-bold text-black">
              Build your website
              <ArrowUpRight className="ml-1 inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={14} />
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col justify-end px-5 pb-8 pt-32 md:px-10 md:pb-10 lg:px-12">
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
            <div className="hero-copy max-w-3xl">
              <div className="reveal-up mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.04] px-4 py-2 text-[10px] uppercase tracking-[.25em] text-white/55 backdrop-blur-xl">
                <CircleDot size={11} className="animate-pulse" />
                Your business. Always online.
              </div>

              <h1 className="hero-title reveal-up delay-1">
                YOUR
                <br />
                <span key={heroWords[heroWord]} className="hero-word" aria-live="polite">
                  {heroWords[heroWord]}
                </span>
                <br />
                WEBSITE.
              </h1>

              <div className="reveal-up delay-2 mt-8 max-w-xl">
                <p className="hero-message text-base leading-7 text-white/55 md:text-xl md:leading-8" key={heroMessages[heroWord]}>
                  {heroMessages[heroWord]}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[.22em] text-white/25">
                  The website keeps working when you don't.
                </p>
              </div>

              <div className="reveal-up delay-3 mt-8 flex flex-wrap items-center gap-3">
                <Link href="/dashboard" className="magnetic-button rounded-full bg-white px-7 py-4 text-sm font-semibold text-black shadow-[0_0_50px_rgba(255,255,255,.12)]">
                  Build with Fellacoo <ArrowUpRight className="ml-2 inline-block" size={16} />
                </Link>
                <a href="#why" className="rounded-full border border-white/15 bg-white/[.04] px-7 py-4 text-sm text-white/70 backdrop-blur-xl transition hover:bg-white/10 hover:text-white">
                  Explore the idea <ArrowDown className="ml-2 inline-block" size={15} />
                </a>
              </div>
            </div>

            <div
              className="hero-visual relative mx-auto hidden h-[680px] w-full max-w-[720px] lg:block"
              style={{ transform: `translate3d(${px * 0.45}px,${py * 0.35 + scrollY * -0.06}px,0)` }}
            >
              <div className="depth-ring depth-ring-a" />
              <div className="depth-ring depth-ring-b" />
              <div className="depth-ring depth-ring-c" />

              <div className="hero-glass-card card-back">
                <div className="text-[9px] uppercase tracking-[.3em] text-white/30">01 / discovery</div>
                <div className="mt-20 text-2xl text-white/40">Someone found you.</div>
              </div>

              <div className="hero-glass-card card-mid">
                <div className="text-[9px] uppercase tracking-[.3em] text-white/30">02 / experience</div>
                <div className="mt-20 text-3xl text-white/60">They stayed.</div>
              </div>

              <div className="hero-glass-card card-front">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[.3em] text-white/45">
                  <span>03 / conversion</span>
                  <MousePointer2 size={14} />
                </div>
                <div className="mt-16 text-5xl font-medium tracking-[-.07em] text-white">They took<br />the next step.</div>
                <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] text-white/35">
                  <span>FELLACOO WEB</span><span>LIVE / 24:00:00</span>
                </div>
              </div>

              <div className="floating-chip chip-one"><Sparkles size={13} /> AI</div>
              <div className="floating-chip chip-two"><Zap size={13} /> CONVERT</div>
              <div className="floating-chip chip-three"><ChartNoAxesCombined size={13} /> INSIGHT</div>
            </div>
          </div>

          <div className="hero-marquee" aria-hidden="true">
            <div className="hero-marquee-track">
              <span>BUILD</span><b>✦</b><span>ENGAGE</span><b>✦</b><span>CONVERT</span><b>✦</b><span>LEARN</span><b>✦</b>
              <span>BUILD</span><b>✦</b><span>ENGAGE</span><b>✦</b><span>CONVERT</span><b>✦</b><span>LEARN</span><b>✦</b>
            </div>
          </div>

          <div className="flex items-end justify-between border-t border-white/10 pt-5 text-[9px] uppercase tracking-[.24em] text-white/30">
            <span>Digital storefront / sales engine / credibility anchor</span>
            <span className="hidden md:block">Scroll to explore ↓</span>
          </div>
        </div>
      </section>

      <section id="why" className="relative bg-[#efede9] text-[#0a0a0c]">
        <div className="section-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[.85fr_1.15fr]">
            <div className="reveal-on-scroll">
              <p className="eyebrow text-black/40">WHY YOUR WEBSITE MATTERS</p>
              <h2 className="display-heading mt-7">
                YOUR BUSINESS
                <br />DESERVES A
                <br /><span className="text-black/25">HOME.</span>
              </h2>
            </div>
            <div className="max-w-3xl lg:pt-20 reveal-on-scroll delay-1">
              <p className="text-3xl leading-tight tracking-[-.04em] md:text-5xl md:leading-[1.05]">
                A website is your <strong>24/7 digital storefront, salesperson and credibility anchor.</strong>
              </p>
              <p className="mt-8 max-w-2xl text-base leading-7 text-black/55 md:text-lg">
                Social media can introduce your business. Your website gives people somewhere to land,
                understand your offer, trust your brand and take the next step.
              </p>
            </div>
          </div>

          <div className="mt-24 grid border-t border-black/10 md:grid-cols-2">
            {pillars.map(([number, title, text], index) => (
              <article key={number} className={`reveal-on-scroll group border-b border-black/10 py-10 md:p-10 ${index % 2 === 0 ? "md:border-r" : ""}`}>
                <div className="flex gap-8">
                  <span className="text-xs text-black/30">{number}</span>
                  <div>
                    <h3 className="text-2xl font-medium tracking-[-.03em] transition-transform duration-500 group-hover:translate-x-2">{title}</h3>
                    <p className="mt-4 max-w-lg text-sm leading-6 text-black/50">{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="engine" className="relative overflow-hidden bg-[#07070a] py-28 md:py-40">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/10 blur-[140px]" />
        <div className="relative mx-auto max-w-[1600px] px-5 md:px-10 lg:px-12">
          <div className="grid gap-20 lg:grid-cols-[.75fr_1.25fr]">
            <div className="reveal-on-scroll">
              <p className="eyebrow text-white/35">THE CONVERSION ENGINE</p>
              <h2 className="display-heading mt-7">
                BUILD.
                <br />ENGAGE.
                <br /><span className="gradient-text">CONVERT.</span>
              </h2>
              <p className="mt-8 max-w-md text-base leading-7 text-white/45">
                We are not building another static brochure maker. Fellacoo turns the website into an active growth system.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {engine.map(({ n, icon: Icon, title, text }, index) => (
                <article key={n} className={`engine-card reveal-on-scroll delay-${index + 1}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/25">{n}</span>
                    <Icon size={20} className="text-white/50" />
                  </div>
                  <div className="mt-20">
                    <h3 className="text-2xl font-medium">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/40">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ai" className="relative overflow-hidden bg-[#111014] py-28 md:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(128,54,255,.22),transparent_28%),radial-gradient(circle_at_20%_30%,rgba(0,150,255,.08),transparent_22%)]" />
        <div className="relative mx-auto max-w-[1600px] px-5 md:px-10 lg:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
            <div className="reveal-on-scroll">
              <p className="eyebrow text-white/35">THE AI LAYER</p>
              <h2 className="mt-7 text-6xl font-medium leading-[.85] tracking-[-.08em] md:text-8xl">
                DON'T
                <br />DESIGN
                <br /><span className="gradient-text">ALONE.</span>
              </h2>
              <p className="mt-8 max-w-lg text-base leading-7 text-white/45 md:text-lg">
                Tell Fellacoo what your business does, who you want to reach and what you want visitors to do.
                The AI helps shape the structure, message and conversion path.
              </p>
            </div>

            <div className="ai-orbit reveal-on-scroll">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit-core">
                <WandSparkles size={28} />
                <span>FELLACOO<br />AI</span>
              </div>
              <div className="orbit-node node-a">AUDIENCE</div>
              <div className="orbit-node node-b">OFFER</div>
              <div className="orbit-node node-c">COPY</div>
              <div className="orbit-node node-d">DESIGN</div>
            </div>
          </div>
        </div>
      </section>

      <section id="builder" className="relative bg-[#e9e6e1] text-[#0a0a0c]">
        <div className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40 lg:px-12">
          <div className="grid items-end gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div className="reveal-on-scroll">
              <p className="eyebrow text-black/35">THE FELLACOO BUILDER</p>
              <h2 className="display-heading mt-7">
                DESIGN IT.
                <br /><span className="text-black/25">GROW WITH IT.</span>
              </h2>
            </div>
            <div className="reveal-on-scroll max-w-md lg:pb-2">
              <p className="text-lg leading-7 text-black/55">
                The website becomes the canvas. Select it, edit it, resize it, rearrange it,
                ask AI to change it and publish when it is ready.
              </p>
              <Link href="/dashboard" className="magnetic-button mt-7 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
                Enter Fellacoo Web <ArrowUpRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>

          <div className="builder-window reveal-on-scroll mt-20">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div className="flex items-center gap-2 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-black" /> Live website canvas</div>
              <div className="text-[9px] uppercase tracking-[.2em] text-black/35">Desktop · Tablet · Mobile</div>
            </div>
            <div className="relative min-h-[480px] overflow-hidden bg-[radial-gradient(circle_at_70%_35%,rgba(128,63,210,.25),transparent_24%),linear-gradient(135deg,#f8f6f2,#ddd8d0)] p-8 md:p-16">
              <div className="builder-browser">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-3 text-[10px]">
                  <span>YOUR BUSINESS</span><span>ABOUT · SERVICES · CONTACT</span>
                </div>
                <div className="grid min-h-[350px] place-items-center px-5 text-center">
                  <div>
                    <div className="text-[9px] uppercase tracking-[.25em] text-black/35">live preview</div>
                    <div className="mt-4 text-4xl font-medium tracking-[-.07em] md:text-6xl">Your website.<br />Your canvas.</div>
                  </div>
                </div>
              </div>
              <div className="builder-cursor"><MousePointer2 size={18} /><span>Hero</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-32 md:py-48">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(160,60,255,.22),transparent_28%)]" />
        <div className="relative mx-auto max-w-[1100px] px-5 text-center">
          <p className="eyebrow text-white/30">THE NEXT STEP</p>
          <h2 className="mt-8 text-[16vw] font-medium leading-[.78] tracking-[-.1em] md:text-[11vw]">
            MAKE IT
            <br /><span className="gradient-text">WORK.</span>
          </h2>
          <p className="mx-auto mt-10 max-w-xl text-base leading-7 text-white/45 md:text-lg">
            Build a website that does more than exist. Give your business a digital home that works every hour of every day.
          </p>
          <Link href="/dashboard" className="magnetic-button mt-9 inline-flex rounded-full bg-white px-8 py-4 text-sm font-semibold text-black">
            Start building with Fellacoo <ChevronRight className="ml-2" size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-5 py-8 text-white md:px-10 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-32"><img src="/fellacoo-logo-transparent.png" alt="Fellacoo" /></div>
          <span className="text-[10px] uppercase tracking-[.2em] text-white/25">Your website. Your audience. Your growth engine.</span>
          <Link href="/dashboard" className="text-xs font-semibold text-white/60 hover:text-white">Start building ↗</Link>
        </div>
      </footer>
    </main>
  );
}