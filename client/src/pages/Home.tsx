import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Home.module.css";

const VIDEO_URL  = "/manus-storage/hero-bg_e417fdab.mp4";
const LOGO_WHITE = "/manus-storage/galadora_logo_white_5e60196f.png";

// ─── Companies carousel ────────────────────────────────────────────────────
const COMPANIES = [
  "Apple",
  "Amazon",
  "Zayo",
  "Digital Realty",
  "Vantage Data Centers",
  "Meta",
  "OpenAI",
  "U.S. Department of Energy",
  "NVIDIA",
  "Cisco",
];

function CompanyCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % COMPANIES.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.carouselWrap}>
      <div className={styles.carouselLabel}>Built by leaders from</div>
      <div className={styles.carouselTrack} aria-live="polite" aria-atomic="true">
        {COMPANIES.map((name, i) => (
          <span
            key={name}
            className={[styles.carouselItem, i === active ? styles.carouselItemActive : ""].join(" ").trim()}
            aria-hidden={i !== active}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Nav config ────────────────────────────────────────────────────────────
const NAV_PAGES = [
  { id: "home",      label: "Home" },
  { id: "platform",  label: "Our Platform" },
  { id: "about",     label: "About Us" },
  { id: "meridian",  label: "News & Insights" },
  { id: "contact",   label: "Contact" },
];

const BUSINESSES = [
  { id: "power",     label: "Power",                  icon: "⚡" },
  { id: "infra",     label: "Digital Infrastructure", icon: "🏗" },
  { id: "compute",   label: "Compute",                icon: "⬛" },
];

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

// ─── Main component ────────────────────────────────────────────────────────
export default function Home() {
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen]     = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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

      {/* ── Overlay nav — two-column ── */}
      <div
        id="site-overlay"
        className={overlayClass}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}
      >
        <div className={styles.overlayInner}>
          {/* Left: primary nav */}
          <nav aria-label="Primary navigation" className={styles.overlayLeft}>
            <div className={styles.overlayLeftLabel}>Navigation</div>
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

          {/* Right: businesses */}
          <div className={styles.overlayRight} aria-label="Our Businesses">
            <div className={styles.overlayRightLabel}>Our Businesses</div>
            {BUSINESSES.map((b) => (
              <button
                key={b.id}
                className={styles.bizRow}
                onClick={() => showPage(b.id)}
              >
                <span className={styles.bizRowLeft}>
                  <span className={styles.bizIcon} aria-hidden="true">{b.icon}</span>
                  <span className={styles.bizName}>{b.label}</span>
                </span>
                <span className={styles.bizArrow} aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.overlayFooter}>
          <div className={styles.overlayLogo} aria-hidden="true">
            <img src={LOGO_WHITE} alt="" loading="eager" decoding="async" />
          </div>
          <div className={styles.overlayFooterLinks}>
            {["Careers", "Terms", "Privacy Policy"].map((l) => (
              <button key={l} onClick={() => setMenuOpen(false)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pages ── */}
      {activePage === "home" && (
        <main>
          <div className={styles.hero}>
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
                <i className={styles.tickOn} />
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
                <p className={styles.introCopy}>
                  Galadora builds microscale, air-gapped AI infrastructure
                  for enterprises and governments — sovereign-capable,
                  power-ready, and built from first principles.
                </p>
              </div>

              <CompanyCarousel />
            </div>
          </div>
        </main>
      )}

      {activePage === "platform" && (
        <InnerPage title="Our Integrated Platform" kicker="Platform" />
      )}
      {activePage === "meridian" && (
        <InnerPage
          title="News & Insights"
          kicker="Distributed AI Infrastructure for Global Inference"
        />
      )}
      {activePage === "about" && (
        <InnerPage title="About Galadora" kicker="About" />
      )}
      {activePage === "contact" && (
        <InnerPage title="Get in Touch" kicker="Contact" />
      )}
      {activePage === "power" && (
        <InnerPage title="Power" kicker="Our Businesses" />
      )}
      {activePage === "infra" && (
        <InnerPage title="Digital Infrastructure" kicker="Our Businesses" />
      )}
      {activePage === "compute" && (
        <InnerPage title="Compute" kicker="Our Businesses" />
      )}
    </>
  );
}
