import { useState, useEffect } from "react";

const VIDEO_URL  = "/manus-storage/hero-bg_e417fdab.mp4";
const LOGO_WHITE = "/manus-storage/galadora_logo_white_5e60196f.png";

// ─── Inner placeholder pages ───────────────────────────────────────────────
function InnerPage({ title, kicker }: { title: string; kicker: string }) {
  return (
    <div className="inner-page">
      <div className="kicker">{kicker}</div>
      <h1>{title}</h1>
      <p>
        This section is a placeholder. Replace with your own content, media,
        and calls to action styled to match Galadora's brand.
      </p>
    </div>
  );
}

// ─── Pages config ──────────────────────────────────────────────────────────
const NAV_PAGES = [
  { id: "home",      label: "Home" },
  { id: "platform",  label: "Platform" },
  { id: "meridian",  label: "The Meridian Project" },
  { id: "about",     label: "About" },
  { id: "contact",   label: "Contact" },
];

export default function Home() {
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const showPage = (id: string) => {
    setActivePage(id);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <style>{`
        /* ── Reset & base ── */
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; height: 100%; }
        body {
          font-family: "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
          background: #08090b;
          color: #fff;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        a { color: inherit; text-decoration: none; }

        /* ── CSS custom props ── */
        :root {
          --ink: #ffffff;
          --ink-dim: rgba(255,255,255,.72);
          --ink-muted: rgba(255,255,255,.50);
          --hairline: rgba(255,255,255,.35);
          --edge: clamp(24px, 4vw, 56px);
          --top: clamp(20px, 3vw, 36px);
          --accent: #4A90D9;
        }

        /* ── Persistent chrome ── */
        .chrome {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--top) var(--edge);
          pointer-events: none;
        }
        .chrome > * { pointer-events: auto; }

        /* Logo */
        .logo-wrap {
          display: inline-block;
          cursor: pointer;
          flex-shrink: 0;
          height: clamp(28px, 3.2vw, 44px);
          transition: opacity .18s ease;
        }
        .logo-wrap:hover { opacity: .82; }
        .logo-wrap img {
          height: 100%;
          width: auto;
          display: block;
          object-fit: contain;
        }

        /* Menu pill */
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: #fff;
          color: #111;
          border: none;
          border-radius: 10px;
          padding: 12px 16px 12px 20px;
          font-size: 1rem;
          font-weight: 500;
          font-family: inherit;
          letter-spacing: .01em;
          box-shadow: 0 4px 20px rgba(0,0,0,.22);
          cursor: pointer;
          transition: box-shadow .2s, transform .16s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .pill:hover { box-shadow: 0 6px 28px rgba(0,0,0,.30); }
        .pill:active { transform: scale(0.97); }

        /* Burger */
        .burger {
          position: relative;
          width: 26px;
          height: 15px;
          flex-shrink: 0;
        }
        .burger span {
          position: absolute;
          left: 0;
          height: 2px;
          background: currentColor;
          border-radius: 2px;
          transition: transform .32s ease, opacity .22s ease, width .22s ease;
        }
        .burger span:nth-child(1) { top: 0;    width: 100%; }
        .burger span:nth-child(2) { top: 6.5px; width: 62%; }
        .burger span:nth-child(3) { top: 13px;  width: 100%; }
        .burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .burger.open span:nth-child(2) { opacity: 0; width: 0; }
        .burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Full-screen overlay nav ── */
        .overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          background: rgba(6,7,9,.97);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 var(--edge);
          opacity: 0;
          visibility: hidden;
          transition: opacity .38s ease, visibility .38s;
        }
        .overlay.open { opacity: 1; visibility: visible; }
        .overlay nav {
          display: flex;
          flex-direction: column;
          gap: clamp(2px, 1vh, 10px);
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
        }
        .overlay a {
          font-size: clamp(2rem, 6vw, 4.5rem);
          font-weight: 600;
          line-height: 1.1;
          color: rgba(255,255,255,.42);
          letter-spacing: -.025em;
          width: fit-content;
          opacity: 0;
          transform: translateY(18px);
          transition: color .2s ease, opacity .4s ease, transform .4s ease;
          cursor: pointer;
          will-change: opacity, transform;
        }
        .overlay a:hover { color: #fff; }
        .overlay.open a { opacity: 1; transform: none; }
        .overlay.open a:nth-child(1) { transition-delay: .06s; }
        .overlay.open a:nth-child(2) { transition-delay: .12s; }
        .overlay.open a:nth-child(3) { transition-delay: .18s; }
        .overlay.open a:nth-child(4) { transition-delay: .24s; }
        .overlay.open a:nth-child(5) { transition-delay: .30s; }

        /* Overlay logo (white, bottom-left) */
        .overlay-logo {
          position: absolute;
          bottom: var(--top);
          left: var(--edge);
          height: 28px;
          opacity: .5;
        }
        .overlay-logo img { height: 100%; width: auto; display: block; }

        /* ── Hero ── */
        .hero {
          position: relative;
          height: 100dvh;
          min-height: 620px;
          overflow: hidden;
          color: #fff;
        }
        .hero video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          z-index: 1;
          will-change: transform;
        }
        .hero .video-fallback {
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(110% 70% at 28% 0%, rgba(74,144,217,.25), transparent 52%),
            linear-gradient(155deg, #1a2030, #0c0e14 58%, #060709);
        }
        .hero .scrim {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,.32) 0%,
            transparent 20%,
            transparent 50%,
            rgba(0,0,0,.55) 100%
          );
        }
        .hero-content {
          position: absolute;
          inset: 0;
          z-index: 3;
        }

        /* Hairline */
        .midline {
          position: absolute;
          left: var(--edge);
          right: var(--edge);
          top: 58%;
          height: 1px;
          background: var(--hairline);
        }

        /* Ticks */
        .ticks {
          position: absolute;
          right: var(--edge);
          top: calc(58% - 14px);
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .ticks i {
          display: block;
          width: 32px;
          height: 2px;
          background: var(--hairline);
          border-radius: 2px;
        }
        .ticks i.on { background: #fff; }

        /* Brand label */
        .brand-label {
          position: absolute;
          left: var(--edge);
          top: calc(58% + 14px);
          font-size: clamp(1rem, 1.8vw, 1.5rem);
          font-weight: 500;
          letter-spacing: .01em;
          line-height: 1;
          color: rgba(255,255,255,.88);
        }

        /* Headline */
        .headline {
          position: absolute;
          left: 50%;
          top: calc(58% - 2px);
          transform: translate(-46%, -50%);
          text-align: left;
          font-size: clamp(2.2rem, 5.4vw, 4.8rem);
          font-weight: 700;
          line-height: 1.06;
          letter-spacing: -.028em;
          margin: 0;
          white-space: nowrap;
        }

        /* Learn More */
        .learn-wrap {
          position: absolute;
          right: var(--edge);
          top: calc(58% + 14px);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          line-height: 1;
          cursor: pointer;
          text-decoration: none;
          color: #fff;
        }
        .learn-text {
          font-size: clamp(.85rem, 1.4vw, 1.15rem);
          font-weight: 500;
          letter-spacing: .01em;
        }
        .learn-arrow {
          font-size: 1.2rem;
          line-height: 1;
          display: block;
          transition: transform .28s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .learn-wrap:hover .learn-arrow { transform: translateY(7px); }

        /* Bottom-left intro */
        .intro {
          position: absolute;
          left: var(--edge);
          bottom: clamp(28px, 6vh, 60px);
          max-width: min(42ch, 38vw);
        }
        .intro .eyebrow {
          font-size: .88rem;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          margin: 0 0 10px;
          color: rgba(255,255,255,.95);
        }
        .intro p {
          margin: 0;
          color: var(--ink-dim);
          font-size: .94rem;
          line-height: 1.58;
        }

        /* ── Inner pages ── */
        .inner-page {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px var(--edge) 80px;
          background: #08090b;
        }
        .kicker {
          color: var(--ink-muted);
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          font-size: .75rem;
          margin-bottom: 18px;
        }
        .inner-page h1 {
          font-size: clamp(2.4rem, 6.5vw, 5rem);
          font-weight: 700;
          letter-spacing: -.025em;
          margin: 0 0 22px;
          line-height: 1.04;
        }
        .inner-page p {
          max-width: 52ch;
          color: var(--ink-dim);
          font-size: 1.05rem;
          line-height: 1.65;
          margin: 0 0 36px;
        }

        /* ── Responsive ── */
        @media (max-width: 840px) {
          .midline, .ticks { display: none; }
          .brand-label {
            position: absolute;
            left: var(--edge);
            top: auto;
            bottom: calc(clamp(28px,6vh,60px) + 190px);
            font-size: 1.1rem;
          }
          .headline {
            position: absolute;
            left: var(--edge);
            right: var(--edge);
            top: 34%;
            transform: none;
            text-align: left;
            white-space: normal;
            font-size: clamp(2rem, 9vw, 3.4rem);
          }
          .learn-wrap {
            position: absolute;
            right: auto;
            left: var(--edge);
            top: auto;
            bottom: calc(clamp(28px,6vh,60px) + 148px);
            flex-direction: row;
            align-items: center;
            gap: 12px;
          }
          .intro { max-width: none; right: var(--edge); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ── Persistent Chrome ── */}
      <div className="chrome">
        <div
          className="logo-wrap"
          onClick={() => showPage("home")}
          role="button"
          aria-label="Galadora home"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && showPage("home")}
        >
          <img src={LOGO_WHITE} alt="Galadora" fetchPriority="high" loading="eager" decoding="async" />
        </div>

        <button
          className="pill"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="overlay"
          aria-label="Open navigation menu"
        >
          <span>Galadora</span>
          <span className={`burger${menuOpen ? " open" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* ── Overlay nav ── */}
      <div
        id="overlay"
        className={`overlay${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}
      >
        <nav>
          {NAV_PAGES.map((p) => (
            <a
              key={p.id}
              href="#"
              onClick={(e) => { e.preventDefault(); showPage(p.id); }}
            >
              {p.label}
            </a>
          ))}
        </nav>
        <div className="overlay-logo">
          <img src={LOGO_WHITE} alt="Galadora" loading="eager" decoding="async" />
        </div>
      </div>

      {/* ── Pages ── */}
      {activePage === "home" && (
        <div className="hero">
          <video autoPlay muted loop playsInline preload="auto">
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
          <div className="video-fallback" aria-hidden="true" />
          <div className="scrim" aria-hidden="true" />

          <div className="hero-content">
            <div className="midline" aria-hidden="true" />
            <div className="ticks" aria-hidden="true">
              <i className="on" />
              <i />
              <i />
            </div>

            <div className="brand-label">Galadora</div>

            <h1 className="headline">
              Where Compute<br />Meets the World
            </h1>

            <a
              className="learn-wrap"
              href="#"
              onClick={(e) => { e.preventDefault(); showPage("platform"); }}
              aria-label="Learn more about Galadora"
            >
              <span className="learn-text">Learn More</span>
              <span className="learn-arrow" aria-hidden="true">↓</span>
            </a>

            <div className="intro">
              <p className="eyebrow">Distributed AI Infrastructure</p>
              <p>
                Galadora builds and operates the distributed infrastructure
                that brings AI compute to where the world's enterprises and
                governments actually need it: power-ready, air-gapped,
                sovereign-capable, and fast to deploy.
              </p>
            </div>
          </div>
        </div>
      )}

      {activePage === "platform" && (
        <InnerPage
          title="Our Integrated Platform"
          kicker="Platform"
        />
      )}
      {activePage === "meridian" && (
        <InnerPage
          title="The Meridian Project"
          kicker="Distributed AI Infrastructure for Global Inference"
        />
      )}
      {activePage === "about" && (
        <InnerPage title="About Galadora" kicker="About" />
      )}
      {activePage === "contact" && (
        <InnerPage title="Get in Touch" kicker="Contact" />
      )}
    </>
  );
}
