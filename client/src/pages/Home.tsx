import { useState, useEffect, useRef, useCallback, type ReactElement } from "react";
import styles from "./Home.module.css";

const VIDEO_URL  = "/manus-storage/hero-bg_e417fdab.mp4";
const LOGO_WHITE = "/manus-storage/galadora_logo_white_5e60196f.png";

// ─── Company SVG logos ────────────────────────────────────────────────────
const COMPANY_LOGOS: { name: string; svg: ReactElement }[] = [
  {
    name: "Apple",
    svg: (
      <svg viewBox="0 0 814 1000" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Apple">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 31 0 108.2 2.6 168.6 79.3zm-119.7-305.8c36.4-43.5 62.3-103.9 62.3-164.3 0-8.4-.6-16.9-2-24.7-59.1 2.3-128.4 39.5-170.8 88.7-33.1 37.7-64.8 98.1-64.8 159.4 0 9 1.4 18 2 20.7 3.5.6 9 1.3 14.5 1.3 53.5 0 120.5-35.7 158.8-81.1z"/>
      </svg>
    ),
  },
  {
    name: "Amazon",
    svg: (
      <svg viewBox="0 0 603 182" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Amazon">
        <path d="M372.5 142.5c-34.9 25.7-85.5 39.4-129.1 39.4-61.1 0-116.1-22.6-157.8-60.2-3.3-3 .3-7 3.6-4.7 44.9 26.1 100.5 41.8 157.9 41.8 38.7 0 81.3-8 120.5-24.6 5.9-2.5 10.8 3.9 4.9 8.3zm14-16c-4.5-5.7-29.6-2.7-40.9-1.4-3.4.4-4-2.6-.9-4.7 20-14.1 52.8-10 56.6-5.3 3.8 4.8-1 37.9-19.8 53.7-2.9 2.4-5.6 1.1-4.3-2.1 4.2-10.5 13.7-34.5 9.3-40.2z"/>
        <path d="M52.5 88.5c0-29.2 31.1-43.8 61.2-43.8 13.5 0 25.5 2.5 35.8 7.6V42.8c0-15.3-10.3-23.1-27.4-23.1-13.6 0-24.9 3.4-37.4 10.2-2.7 1.5-5.1-.3-5.1-3.3V14.4c0-2.3 1.3-4.4 3.4-5.4C95.7 3.2 110.2 0 126.2 0c33.2 0 58.1 17.5 58.1 57.3v87.3c0 2.9-2.3 5.2-5.2 5.2h-17.5c-2.7 0-4.9-2-5.2-4.7l-.5-9.7c-10.7 11.3-25.6 17.4-43.2 17.4-31.2 0-60.2-17.1-60.2-44.3zm97 .5v-18c-8.7-4.2-18.7-6.5-29.3-6.5-18.9 0-31.8 8.7-31.8 23.8 0 14.1 11.2 22.3 28.1 22.3 18.2 0 33-9.8 33-21.6zM230 147.8c-2.9 0-5.2-2.3-5.2-5.2V8.2c0-2.9 2.3-5.2 5.2-5.2h18.2c2.9 0 5.2 2.3 5.2 5.2v134.4c0 2.9-2.3 5.2-5.2 5.2H230zm48.5 0c-2.9 0-5.2-2.3-5.2-5.2V8.2c0-2.9 2.3-5.2 5.2-5.2h18.2c2.9 0 5.2 2.3 5.2 5.2v134.4c0 2.9-2.3 5.2-5.2 5.2h-18.2zm90.8 5c-37.6 0-64.5-27.8-64.5-77.4 0-49.5 26.9-77.4 64.5-77.4 37.6 0 64.5 27.9 64.5 77.4 0 49.6-26.9 77.4-64.5 77.4zm0-26.4c22.3 0 36.6-18.7 36.6-51 0-32.3-14.3-51-36.6-51-22.3 0-36.6 18.7-36.6 51 0 32.3 14.3 51 36.6 51zm115.9 21.4c-2.7 0-4.9-2-5.2-4.7l-37.3-135c-.8-3 1.4-6 4.5-6h19.2c2.7 0 5 1.9 5.3 4.6l25.1 103.6 27.1-103.7c.6-2.6 3-4.5 5.7-4.5h15.8c2.7 0 5.1 1.9 5.7 4.5l27.1 103.7 25.1-103.6c.3-2.7 2.6-4.6 5.3-4.6h19.2c3.1 0 5.3 3 4.5 6l-37.3 135c-.7 2.7-3.1 4.7-5.9 4.7h-17.3c-2.7 0-5.1-1.9-5.7-4.5l-26.6-99.5-26.6 99.5c-.6 2.6-3 4.5-5.7 4.5h-17.8z"/>
      </svg>
    ),
  },
  {
    name: "Meta",
    svg: (
      <svg viewBox="0 0 400 80" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Meta">
        <path d="M6.8 66.5C2.5 59.7 0 51.1 0 41.2 0 17.9 12.4 0 28.5 0c8.2 0 15.5 4.3 22.4 13.2 5.3 6.8 10.2 16.7 14.8 28.1 7.8-19.6 17.4-34.1 28.3-41.2C100.4 0 105.7 0 110.8 0c16.1 0 28.5 17.9 28.5 41.2 0 9.9-2.5 18.5-6.8 25.3H117c4.8-6.1 7.8-14.8 7.8-25.3 0-17.2-8.3-29.8-18.5-29.8-5.6 0-10.8 3.1-15.8 9.5-6.4 8.3-12.5 21.4-18.6 38.5l-1.6 4.6H56.5l-1.5-4.3C48.2 41.8 42.2 28.8 35.8 20.5c-5-6.4-10.2-9.5-15.8-9.5-10.2 0-18.5 12.6-18.5 29.8 0 10.5 3 19.2 7.8 25.3H6.8v.4z"/>
        <path d="M6.8 66.5h9.5c5.3 6.6 13.3 10.5 22.2 10.5s16.9-3.9 22.2-10.5h17.8c5.3 6.6 13.3 10.5 22.2 10.5s16.9-3.9 22.2-10.5h9.5c-5.8 8.3-15.5 13.5-26.5 13.5-10.1 0-19.1-4.3-25.4-11.2-6.3 6.9-15.3 11.2-25.4 11.2-11 0-20.7-5.2-26.5-13.5h.2z"/>
        <path d="M170 80V0h15.5l24.5 44.5L234.5 0H250v80h-14V23.5L214.5 63h-9.5L183.5 23.5V80H170zm105.5 0V0H330v12.5h-40v20h36v12.5h-36v22.5h41V80h-55.5zm78.5 0V12.5h-24V0h62.5v12.5h-24V80h-14.5z"/>
      </svg>
    ),
  },
  {
    name: "OpenAI",
    svg: (
      <svg viewBox="0 0 320 80" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="OpenAI">
        <path d="M37.5 0C16.8 0 0 16.8 0 37.5S16.8 75 37.5 75 75 58.2 75 37.5 58.2 0 37.5 0zm0 8c16.3 0 29.5 13.2 29.5 29.5S53.8 67 37.5 67 8 53.8 8 37.5 21.2 8 37.5 8z"/>
        <path d="M37.5 16c-11.9 0-21.5 9.6-21.5 21.5S25.6 59 37.5 59 59 49.4 59 37.5 49.4 16 37.5 16zm0 8c7.5 0 13.5 6 13.5 13.5S45 51 37.5 51 24 45 24 37.5 30 24 37.5 24z"/>
        <text x="90" y="56" fontFamily="Helvetica Neue, Arial, sans-serif" fontWeight="600" fontSize="44">OpenAI</text>
      </svg>
    ),
  },
  {
    name: "NVIDIA",
    svg: (
      <svg viewBox="0 0 400 70" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="NVIDIA">
        <path d="M38.5 0v8.7C25.2 9.5 13.3 17.7 7 29.7V0h31.5zM7 40.3C13.3 52.3 25.2 60.5 38.5 61.3V70H7V40.3zM0 0v70h7V0H0zm45.5 0v70h7V0h-7zm7 0h14.8L85 70H71.2L57.5 0h-5zm21.8 0h14.8L107 70H92.2L74.3 0h-5zm21.8 0H111L129 70h-14.8L96.1 0h-5zm21.8 0h14.8L151 70h-14.8L118.1 0h-5zm21.8 0H165L183 70h-14.8L140.1 0h-5zM172 0h14.8L205 70h-14.8L172 0zm21.8 0h14.8L227 70h-14.8L193.8 0zm21.8 0H230L248 70h-14.8L215.6 0zm21.8 0h14.8L270 70h-14.8L237.4 0zm21.8 0h14.8L292 70h-14.8L259.2 0zm21.8 0H296L314 70h-14.8L281 0zm21.8 0h14.8L336 70h-14.8L302.8 0zm21.8 0H339L357 70h-14.8L324.6 0zm21.8 0h14.8L379 70h-14.8L346.4 0zm21.8 0H383L400 70h-14.8L368.2 0z"/>
      </svg>
    ),
  },
  {
    name: "Cisco",
    svg: (
      <svg viewBox="0 0 400 80" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Cisco">
        <rect x="0"  y="30" width="28" height="20" rx="4"/>
        <rect x="36" y="18" width="28" height="44" rx="4"/>
        <rect x="72" y="8"  width="28" height="64" rx="4"/>
        <rect x="108" y="18" width="28" height="44" rx="4"/>
        <rect x="144" y="30" width="28" height="20" rx="4"/>
        <text x="190" y="58" fontFamily="Helvetica Neue, Arial, sans-serif" fontWeight="600" fontSize="46">cisco</text>
      </svg>
    ),
  },
  {
    name: "Digital Realty",
    svg: (
      <svg viewBox="0 0 380 70" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Digital Realty">
        <rect x="0" y="0" width="12" height="70" rx="2"/>
        <rect x="0" y="0" width="40" height="12" rx="2"/>
        <rect x="0" y="29" width="32" height="12" rx="2"/>
        <rect x="0" y="58" width="40" height="12" rx="2"/>
        <text x="56" y="52" fontFamily="Helvetica Neue, Arial, sans-serif" fontWeight="500" fontSize="36">Digital Realty</text>
      </svg>
    ),
  },
  {
    name: "Vantage Data Centers",
    svg: (
      <svg viewBox="0 0 420 70" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Vantage Data Centers">
        <polygon points="0,0 20,0 36,50 52,0 72,0 44,70 28,70"/>
        <text x="84" y="52" fontFamily="Helvetica Neue, Arial, sans-serif" fontWeight="500" fontSize="34">Vantage Data Centers</text>
      </svg>
    ),
  },
  {
    name: "Zayo",
    svg: (
      <svg viewBox="0 0 200 70" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Zayo">
        <text x="0" y="54" fontFamily="Helvetica Neue, Arial, sans-serif" fontWeight="700" fontSize="56" letterSpacing="-1">zayo</text>
      </svg>
    ),
  },
  {
    name: "U.S. Department of Energy",
    svg: (
      <svg viewBox="0 0 420 70" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="U.S. Department of Energy">
        <circle cx="35" cy="35" r="32" fill="none" stroke="white" strokeWidth="4"/>
        <circle cx="35" cy="35" r="20" fill="none" stroke="white" strokeWidth="3"/>
        <line x1="35" y1="3" x2="35" y2="67" stroke="white" strokeWidth="2"/>
        <line x1="3" y1="35" x2="67" y2="35" stroke="white" strokeWidth="2"/>
        <text x="80" y="52" fontFamily="Helvetica Neue, Arial, sans-serif" fontWeight="500" fontSize="28">Dept. of Energy</text>
      </svg>
    ),
  },
];

function CompanyCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % COMPANY_LOGOS.length), 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={styles.carouselWrap}>
      <div className={styles.carouselLabel}>Built by leaders from</div>
      <div className={styles.carouselTrack} aria-live="polite" aria-atomic="true">
        {COMPANY_LOGOS.map(({ name, svg }, i) => (
          <span
            key={name}
            className={[styles.carouselItem, i === active ? styles.carouselItemActive : ""].join(" ").trim()}
            aria-hidden={i !== active}
          >
            {svg}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Nav config ────────────────────────────────────────────────────────────
const NAV_PAGES = [
  { id: "home",     label: "Home" },
  { id: "platform", label: "Our Platform" },
  { id: "about",    label: "About Us" },
  { id: "meridian", label: "News & Insights" },
  { id: "contact",  label: "Contact" },
];
const BUSINESSES = [
  { id: "power",   label: "Power",                  icon: "⚡" },
  { id: "infra",   label: "Digital Infrastructure", icon: "🏗" },
  { id: "compute", label: "Compute",                icon: "⬛" },
];

// ─── Inner placeholder pages ───────────────────────────────────────────────
function InnerPage({ title, kicker }: { title: string; kicker: string }) {
  return (
    <main className={styles.innerPage}>
      <div className={styles.kicker}>{kicker}</div>
      <h1>{title}</h1>
      <p>This section is a placeholder. Replace with your own content, media, and calls to action styled to match Galadora's brand.</p>
    </main>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function Home() {
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen]     = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keyboard: Escape closes menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // iOS autoplay: attempt programmatic play on mount and on any user interaction
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const tryPlay = () => {
      vid.play().catch(() => {
        // iOS requires muted + playsInline — already set. If it still fails,
        // listen for first touch/click and retry once.
        const retry = () => {
          vid.play().catch(() => {});
          document.removeEventListener("touchstart", retry);
          document.removeEventListener("click", retry);
        };
        document.addEventListener("touchstart", retry, { once: true });
        document.addEventListener("click", retry, { once: true });
      });
    };

    if (vid.readyState >= 3) {
      tryPlay();
    } else {
      vid.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => vid.removeEventListener("canplay", tryPlay);
  }, []);

  const handleCanPlay = useCallback(() => {
    setVideoReady(true);
    videoRef.current?.play().catch(() => {});
  }, []);

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
          <img src={LOGO_WHITE} alt="Galadora" fetchPriority="high" loading="eager" decoding="async" />
        </div>
        <button
          className={styles.pill}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="site-overlay"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span>Galadora</span>
          <span className={burgerClass} aria-hidden="true"><span /><span /><span /></span>
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
        <div className={styles.overlayInner}>
          <nav aria-label="Primary navigation" className={styles.overlayLeft}>
            <div className={styles.overlayLeftLabel}>Navigation</div>
            {NAV_PAGES.map((p) => (
              <button
                key={p.id}
                className={[styles.navBtn, activePage === p.id ? styles.navBtnActive : ""].join(" ").trim()}
                onClick={() => showPage(p.id)}
                aria-current={activePage === p.id ? "page" : undefined}
              >{p.label}</button>
            ))}
          </nav>
          <div className={styles.overlayRight} aria-label="Our Businesses">
            <div className={styles.overlayRightLabel}>Our Businesses</div>
            {BUSINESSES.map((b) => (
              <button key={b.id} className={styles.bizRow} onClick={() => showPage(b.id)}>
                <span className={styles.bizRowLeft}>
                  <span className={styles.bizIcon} aria-hidden="true">{b.icon}</span>
                  <span className={styles.bizName}>{b.label}</span>
                </span>
                <span className={styles.bizArrow} aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
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
            {/* Fallback gradient — visible until video plays */}
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
              /* x-webkit-airplay="deny" prevents AirPlay button interfering */
              x-webkit-airplay="deny"
            >
              <source src={VIDEO_URL} type="video/mp4" />
            </video>

            <div className={styles.scrim} aria-hidden="true" />

            {/* ── Desktop layout (absolute positioned) ── */}
            <div className={styles.heroContentDesktop}>
              <div className={styles.midline} aria-hidden="true" />
              <div className={styles.ticks} aria-hidden="true">
                <i className={styles.tickOn} /><i /><i />
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

            {/* ── Mobile layout (flex column, no overlapping) ── */}
            <div className={styles.heroContentMobile}>
              <div className={styles.mobileTop} />
              <h1 className={styles.mobileHeadline}>
                Infrastructure for<br />the Inference Era
              </h1>
              <div className={styles.mobileMiddle}>
                <span className={styles.mobileBrandLabel}>Galadora</span>
                <a
                  className={styles.mobileLearnWrap}
                  href="#platform"
                  onClick={(e) => { e.preventDefault(); showPage("platform"); }}
                >
                  <span className={styles.learnText}>Learn More</span>
                  <span className={styles.learnArrow} aria-hidden="true">↓</span>
                </a>
              </div>
              <div className={styles.mobileBottom}>
                <div className={styles.intro}>
                  <p className={styles.eyebrow}>Microscale AI Infrastructure</p>
                  <p className={styles.introCopy}>
                    Galadora builds microscale, air-gapped AI infrastructure
                    for enterprises and governments — sovereign-capable,
                    power-ready, and built from first principles.
                  </p>
                </div>
                <div className={styles.mobileCarousel}>
                  <CompanyCarousel />
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {activePage === "platform" && <InnerPage title="Our Integrated Platform" kicker="Platform" />}
      {activePage === "meridian" && <InnerPage title="News & Insights" kicker="Distributed AI Infrastructure for Global Inference" />}
      {activePage === "about"    && <InnerPage title="About Galadora" kicker="About" />}
      {activePage === "contact"  && <InnerPage title="Get in Touch" kicker="Contact" />}
      {activePage === "power"    && <InnerPage title="Power" kicker="Our Businesses" />}
      {activePage === "infra"    && <InnerPage title="Digital Infrastructure" kicker="Our Businesses" />}
      {activePage === "compute"  && <InnerPage title="Compute" kicker="Our Businesses" />}
    </>
  );
}
