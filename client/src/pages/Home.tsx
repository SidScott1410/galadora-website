import { useState, useEffect } from "react";

const VIDEO_URL = "/manus-storage/hero-bg_e417fdab.mp4";

// ─── Inner placeholder pages ───────────────────────────────────────────────
function InnerPage({ title, kicker }: { title: string; kicker: string }) {
  return (
    <div className="inner-page">
      <div className="kicker">{kicker}</div>
      <h1>{title}</h1>
      <p>
        Placeholder page. Replace this content with your own sections, media,
        and calls to action styled to match your brand.
      </p>
    </div>
  );
}

// ─── Starburst / sunburst logo placeholder ─────────────────────────────────
function StarburstLogo() {
  const rays = Array.from({ length: 24 }, (_, i) => i * 15);
  const lengths = [22, 18, 22, 16, 22, 20, 22, 16, 22, 20, 22, 16, 22, 18, 22, 16, 22, 20, 22, 16, 22, 20, 22, 16];
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(60,60)">
        {rays.map((angle, i) => (
          <rect
            key={angle}
            x="-2.5"
            y={-56}
            width="5"
            height={lengths[i]}
            rx="2"
            fill="white"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
    </svg>
  );
}

// ─── Pages config ──────────────────────────────────────────────────────────
const NAV_PAGES = [
  { id: "home",     label: "Home" },
  { id: "platform", label: "[Page Two]" },
  { id: "about",    label: "[About]" },
  { id: "news",     label: "[News]" },
  { id: "contact",  label: "[Contact]" },
];

export default function Home() {
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on Escape
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
      {/* ── Global styles injected once ── */}
      <style>{`
        /* Reset & base */
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; height: 100%; }
        body {
          font-family: "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
          background: #0c0d10;
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
          --hairline: rgba(255,255,255,.38);
          --edge: clamp(22px, 4vw, 52px);
          --top: clamp(20px, 3.2vw, 38px);
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

        .logo-wrap {
          display: inline-block;
          width: clamp(80px, 10.5vw, 148px);
          aspect-ratio: 1;
          color: #fff;
          flex-shrink: 0;
          cursor: pointer;
        }
        .logo-wrap svg { width: 100%; height: 100%; display: block; }

        /* Menu pill */
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          background: #fff;
          color: #111;
          border: none;
          border-radius: 10px;
          padding: 13px 18px 13px 22px;
          font-size: 1.05rem;
          font-weight: 500;
          font-family: inherit;
          letter-spacing: .01em;
          box-shadow: 0 4px 20px rgba(0,0,0,.22);
          cursor: pointer;
          transition: box-shadow .2s;
        }
        .pill:hover { box-shadow: 0 6px 28px rgba(0,0,0,.30); }

        /* Burger */
        .burger {
          position: relative;
          width: 28px;
          height: 16px;
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
        .burger span:nth-child(1) { top: 0; width: 100%; }
        .burger span:nth-child(2) { top: 7px; width: 65%; }
        .burger span:nth-child(3) { top: 14px; width: 100%; }
        .burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .burger.open span:nth-child(2) { opacity: 0; width: 0; }
        .burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Overlay ── */
        .overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          background: rgba(8,9,11,.97);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 var(--edge);
          opacity: 0;
          visibility: hidden;
          transition: opacity .4s ease, visibility .4s;
        }
        .overlay.open { opacity: 1; visibility: visible; }
        .overlay nav {
          display: flex;
          flex-direction: column;
          gap: clamp(4px, 1.2vh, 12px);
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
        }
        .overlay a {
          font-size: clamp(2.2rem, 6.5vw, 4.8rem);
          font-weight: 600;
          line-height: 1.1;
          color: rgba(255,255,255,.5);
          letter-spacing: -.025em;
          width: fit-content;
          opacity: 0;
          transform: translateY(20px);
          transition: color .2s ease, opacity .42s ease, transform .42s ease;
          cursor: pointer;
        }
        .overlay a:hover { color: #fff; }
        .overlay.open a { opacity: 1; transform: none; }
        .overlay.open a:nth-child(1) { transition-delay: .07s; }
        .overlay.open a:nth-child(2) { transition-delay: .13s; }
        .overlay.open a:nth-child(3) { transition-delay: .19s; }
        .overlay.open a:nth-child(4) { transition-delay: .25s; }
        .overlay.open a:nth-child(5) { transition-delay: .31s; }

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
        }
        .hero .video-fallback {
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(110% 70% at 28% 0%, rgba(200,155,80,.5), transparent 52%),
            linear-gradient(155deg, #3b3228, #161820 58%, #0a0b0e);
        }
        .hero .scrim {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,.28) 0%,
            transparent 22%,
            transparent 52%,
            rgba(0,0,0,.50) 100%
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
          top: calc(58% - 16px);
          display: flex;
          gap: 9px;
          align-items: center;
        }
        .ticks i {
          display: block;
          width: 36px;
          height: 2px;
          background: var(--hairline);
          border-radius: 2px;
        }
        .ticks i.on { background: #fff; }

        /* Brand label */
        .brand-label {
          position: absolute;
          left: var(--edge);
          top: calc(58% + 20px);
          font-size: clamp(1.2rem, 2.2vw, 1.75rem);
          font-weight: 500;
          letter-spacing: .01em;
          line-height: 1;
        }

        /* Headline */
        .headline {
          position: absolute;
          left: 50%;
          top: calc(58% + 10px);
          transform: translateX(-46%);
          text-align: left;
          font-size: clamp(2.4rem, 5.8vw, 5rem);
          font-weight: 700;
          line-height: 1.06;
          letter-spacing: -.025em;
          margin: 0;
          white-space: nowrap;
        }

        /* Learn More */
        .learn-wrap {
          position: absolute;
          right: var(--edge);
          top: calc(58% + 18px);
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
          font-size: clamp(.9rem, 1.5vw, 1.25rem);
          font-weight: 500;
          letter-spacing: .01em;
        }
        .learn-arrow {
          font-size: 1.25rem;
          line-height: 1;
          display: block;
          transition: transform .28s ease;
        }
        .learn-wrap:hover .learn-arrow { transform: translateY(7px); }

        /* Bottom-left intro */
        .intro {
          position: absolute;
          left: var(--edge);
          bottom: clamp(30px, 6.5vh, 64px);
          max-width: min(44ch, 40vw);
        }
        .intro .eyebrow {
          font-size: .95rem;
          font-weight: 700;
          letter-spacing: .01em;
          margin: 0 0 12px;
          color: #fff;
        }
        .intro p {
          margin: 0;
          color: var(--ink-dim);
          font-size: .97rem;
          line-height: 1.55;
        }

        /* ── Inner pages ── */
        .inner-page {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px var(--edge) 80px;
          background: #0c0d10;
        }
        .kicker {
          color: var(--ink-muted);
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          font-size: .78rem;
          margin-bottom: 20px;
        }
        .inner-page h1 {
          font-size: clamp(2.6rem, 7vw, 5.5rem);
          font-weight: 700;
          letter-spacing: -.025em;
          margin: 0 0 24px;
          line-height: 1.04;
        }
        .inner-page p {
          max-width: 54ch;
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
            bottom: calc(clamp(30px,6.5vh,64px) + 200px);
            font-size: 1.15rem;
          }
          .headline {
            position: absolute;
            left: var(--edge);
            right: var(--edge);
            top: 36%;
            transform: none;
            text-align: left;
            white-space: normal;
            font-size: clamp(2.2rem, 9.5vw, 3.6rem);
          }
          .learn-wrap {
            position: absolute;
            right: auto;
            left: var(--edge);
            top: auto;
            bottom: calc(clamp(30px,6.5vh,64px) + 160px);
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
          aria-label="[Brand Name] home"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && showPage("home")}
        >
          <StarburstLogo />
        </div>

        <button
          className="pill"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="overlay"
          aria-label="Open menu"
        >
          <span>[Brand Name]</span>
          <span className="burger" aria-hidden="true">
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
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

            <div className="brand-label">[Brand Name]</div>

            <h1 className="headline">
              [Your Primary]<br />[Headline Here]
            </h1>

            <a
              className="learn-wrap"
              href="#"
              onClick={(e) => { e.preventDefault(); showPage("platform"); }}
              aria-label="Learn more"
            >
              <span className="learn-text">Learn More</span>
              <span className="learn-arrow" aria-hidden="true">↓</span>
            </a>

            <div className="intro">
              <p className="eyebrow">[Category / Tagline]</p>
              <p>
                [Your company develops and operates a brief one-to-two sentence
                description of what you do, who you serve, and why it matters
                to your audience.]
              </p>
            </div>
          </div>
        </div>
      )}

      {activePage === "platform" && (
        <InnerPage title="[Platform / Services]" kicker="[Page Two]" />
      )}
      {activePage === "about" && (
        <InnerPage title="[About Us]" kicker="[About]" />
      )}
      {activePage === "news" && (
        <InnerPage title="[News & Updates]" kicker="[News]" />
      )}
      {activePage === "contact" && (
        <InnerPage title="[Contact Us]" kicker="[Contact]" />
      )}
    </>
  );
}
