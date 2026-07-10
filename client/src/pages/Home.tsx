import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Home.module.css";

const VIDEO_URL  = "/manus-storage/hero-bg_e417fdab.mp4";
const LOGO_WHITE = "/manus-storage/galadora_logo_white_5e60196f.png";

// ─── Inner placeholder pages ───────────────────────────────────────────────
function InnerPage({ title, kicker }: { title: string; kicker: string }) {
  return (
    <main className={styles.innerPage}>
      <div className={styles.kicker}>{kicker}</div>
      <h1>{title}</h1>
      <p>
        This section is a placeholder. Replace with your own content, media,
        and calls to action styled to match Galadora's brand.
      </p>
    </main>
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
  const [activePage, setActivePage]   = useState("home");
  const [menuOpen, setMenuOpen]       = useState(false);
  const [videoReady, setVideoReady]   = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keyboard: Escape closes menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Fade video in once it can play
  const handleCanPlay = useCallback(() => setVideoReady(true), []);

  const showPage = (id: string) => {
    setActivePage(id);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const overlayClass = [styles.overlay, menuOpen ? styles.overlayOpen : ""].join(" ").trim();
  const burgerClass  = [styles.burger,  menuOpen ? styles.burgerOpen  : ""].join(" ").trim();
  const videoClass   = [styles.heroVideo, videoReady ? styles.heroVideoReady : ""].join(" ").trim();

  return (
    <>
      {/* ── Persistent Chrome ── */}
      <div className={styles.chrome}>
        <div
          className={styles.logoWrap}
          onClick={() => showPage("home")}
          role="button"
          aria-label="Galadora — return to home"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && showPage("home")}
        >
          <img
            src={LOGO_WHITE}
            alt="Galadora"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </div>

        <button
          className={styles.pill}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="site-overlay"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span>Galadora</span>
          <span className={burgerClass} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* ── Overlay nav ── */}
      <div
        id="site-overlay"
        className={overlayClass}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}
      >
        <nav aria-label="Primary navigation">
          {NAV_PAGES.map((p) => (
            <button
              key={p.id}
              className={[
                styles.navBtn,
                activePage === p.id ? styles.navBtnActive : "",
              ].join(" ").trim()}
              onClick={() => showPage(p.id)}
              aria-current={activePage === p.id ? "page" : undefined}
            >
              {p.label}
            </button>
          ))}
        </nav>
        <div className={styles.overlayLogo} aria-hidden="true">
          <img src={LOGO_WHITE} alt="" loading="eager" decoding="async" />
        </div>
      </div>

      {/* ── Pages ── */}
      {activePage === "home" && (
        <main>
          <div className={styles.hero}>
            {/* Fallback gradient — always visible, fades behind video once ready */}
            <div className={styles.videoFallback} aria-hidden="true" />

            <video
              ref={videoRef}
              className={videoClass}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={handleCanPlay}
              aria-hidden="true"
            >
              <source src={VIDEO_URL} type="video/mp4" />
            </video>

            <div className={styles.scrim} aria-hidden="true" />

            <div className={styles.heroContent}>
              <div className={styles.midline} aria-hidden="true" />
              <div className={styles.ticks} aria-hidden="true">
                <i className="on" />
                <i />
                <i />
              </div>

              <div className={styles.brandLabel} aria-hidden="true">Galadora</div>

              <h1 className={styles.headline}>
                Infrastructure for<br />the Inference Era
              </h1>

              <a
                className={styles.learnWrap}
                href="#platform"
                onClick={(e) => { e.preventDefault(); showPage("platform"); }}
                aria-label="Learn more — view our platform"
              >
                <span className={styles.learnText}>Learn More</span>
                <span className={styles.learnArrow} aria-hidden="true">↓</span>
              </a>

              <div className={styles.intro}>
                <p className={styles.eyebrow}>Microscale AI Infrastructure</p>
                <p>
                  Galadora builds and operates microscale distributed
                  infrastructure that brings air-gapped, sovereign-capable
                  AI compute to where enterprises and governments actually
                  need it: power-ready, fast to deploy, and built from
                  first principles at 10 MW and below.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {activePage === "platform" && (
        <InnerPage title="Our Integrated Platform" kicker="Platform" />
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
