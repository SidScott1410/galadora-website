import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { trpc } from "@/lib/trpc";
import styles from "./Home.module.css";

const VIDEO_URL  = "/manus-storage/hero-bg_e417fdab.mp4";
const LOGO_WHITE = "/manus-storage/galadora_logo_white_5e60196f.png";

// ─── Company logos (real hosted images) ──────────────────────────────────────
const COMPANY_LOGOS = [
  { name: "Apple",                src: "/manus-storage/logo-apple_4f9addc7.png" },
  { name: "Amazon",               src: "/manus-storage/logo-amazon_75a9eb0e.png" },
  { name: "Meta",                 src: "/manus-storage/logo-meta_cb5bdfc7.png" },
  { name: "OpenAI",               src: "/manus-storage/logo-openai_37e989e1.webp" },
  { name: "NVIDIA",               src: "/manus-storage/logo-nvidia_df0c903a.png" },
  { name: "Cisco",                src: "/manus-storage/logo-cisco_da5af3b3.webp" },
  { name: "Digital Realty",       src: "/manus-storage/logo-dlr_5d97bbc3.png" },
  { name: "Vantage Data Centers", src: "/manus-storage/logo-vantage_f2326b10.webp" },
  { name: "Zayo",                 src: "/manus-storage/logo-zayo_8c0fcd91.webp" },
  { name: "U.S. Dept. of Energy", src: "/manus-storage/logo-doe_6020011e.png" },
];

// Duplicate the set so the marquee loops seamlessly
const MARQUEE_LOGOS = [...COMPANY_LOGOS, ...COMPANY_LOGOS];

function CompanyMarquee() {
  return (
    <div className={styles.marqueeWrap}>
      <div className={styles.marqueeLabel}>Built by leaders from</div>
      <div className={styles.marqueeStrip} aria-label="Companies our team has worked at">
        <div className={styles.marqueeTrack} aria-hidden="true">
          {MARQUEE_LOGOS.map(({ name, src }, i) => (
            <span key={`${name}-${i}`} className={styles.marqueeItem}>
              <img src={src} alt={name} loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Get In Touch modal ────────────────────────────────────────────────────
type ModalState = "idle" | "submitting" | "success";

function GetInTouchModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<ModalState>("idle");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const backdropRef   = useRef<HTMLDivElement>(null);

  // Focus first field on open
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  // Trap Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => setState("success"),
    onError: (err) => {
      setState("idle");
      alert(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("submitting");
    const fd = new FormData(e.currentTarget);
    submitMutation.mutate({
      name:         fd.get("name")         as string,
      email:        fd.get("email")        as string,
      organization: fd.get("organization") as string,
      role:         (fd.get("role")        as string) || undefined,
      interest:     (fd.get("interest")    as string) || undefined,
      message:      (fd.get("message")     as string) || undefined,
    });
  };

  return (
    <div
      ref={backdropRef}
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Get in touch with Galadora"
      onClick={(e) => e.target === backdropRef.current && onClose()}
    >
      <div className={styles.modalCard}>
        {/* Close button */}
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          <span aria-hidden="true">✕</span>
        </button>

        {state === "success" ? (
          <div className={styles.modalSuccess}>
            <div className={styles.modalSuccessIcon} aria-hidden="true">✓</div>
            <h2 className={styles.modalTitle}>Message received.</h2>
            <p className={styles.modalSubtitle}>
              We will be in touch within one business day.
            </p>
            <button className={styles.modalSubmitBtn} onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <p className={styles.modalEyebrow}>Galadora Technologies</p>
              <h2 className={styles.modalTitle}>Get in Touch</h2>
              <p className={styles.modalSubtitle}>
                Tell us about your infrastructure requirements and we will
                reach out to discuss how Galadora can help.
              </p>
            </div>

            <form
              className={styles.modalForm}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel} htmlFor="git-name">
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="git-name"
                    name="name"
                    type="text"
                    className={styles.modalInput}
                    placeholder="Jane Smith"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel} htmlFor="git-email">
                    Work Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="git-email"
                    name="email"
                    type="email"
                    className={styles.modalInput}
                    placeholder="jane@company.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel} htmlFor="git-org">
                    Organization <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="git-org"
                    name="organization"
                    type="text"
                    className={styles.modalInput}
                    placeholder="Acme AI Labs"
                    required
                    autoComplete="organization"
                  />
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel} htmlFor="git-role">
                    Role
                  </label>
                  <input
                    id="git-role"
                    name="role"
                    type="text"
                    className={styles.modalInput}
                    placeholder="Head of Infrastructure"
                    autoComplete="organization-title"
                  />
                </div>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel} htmlFor="git-interest">
                  Area of Interest
                </label>
                <select
                  id="git-interest"
                  name="interest"
                  className={styles.modalSelect}
                >
                  <option value="">Select one...</option>
                  <option value="compute">Compute Infrastructure</option>
                  <option value="power">Power &amp; Energy</option>
                  <option value="airgapped">Air-Gapped Deployments</option>
                  <option value="sovereign">Sovereign AI Capability</option>
                  <option value="partnership">Partnership / Investment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel} htmlFor="git-message">
                  Message
                </label>
                <textarea
                  id="git-message"
                  name="message"
                  className={styles.modalTextarea}
                  placeholder="Briefly describe your compute needs or questions..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className={styles.modalSubmitBtn}
                disabled={state === "submitting"}
              >
                {state === "submitting" ? "Sending…" : "Send Message →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Capacity panel (hover slide-up) ─────────────────────────────────────────
const STATS = [
  { value: "145 MW",  label: "Delivered",          sub: "Operational" },
  { value: "10 MW",   label: "Under Development",  sub: "FID 2026" },
  { value: "40 MW",   label: "Under Exclusivity",  sub: "Exclusive option agreements" },
  { value: "100 MW",  label: "Under Diligence",    sub: "Active site pipeline" },
  { value: "1 GW",    label: "Program Target",     sub: "10-year horizon" },
];

function CapacityPill() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click (touch support)
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={styles.capacityRoot}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger pill */}
      <button
        className={styles.capacityPill}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="View capacity pipeline"
      >
        <span className={styles.capacityDot} aria-hidden="true" />
        <span>100 MW pipeline</span>
        <span className={[styles.capacityChevron, open ? styles.capacityChevronOpen : ""].join(" ").trim()} aria-hidden="true">▴</span>
      </button>

      {/* Slide-up panel */}
      <div
        className={[styles.capacityPanel, open ? styles.capacityPanelOpen : ""].join(" ").trim()}
        role="region"
        aria-label="Capacity pipeline breakdown"
      >
        <div className={styles.capacityGrid}>
          {STATS.map(({ value, label, sub }) => (
            <div key={label} className={styles.capacityStat}>
              <div className={styles.capacityValue}>{value}</div>
              <div className={styles.capacityLabel}>{label}</div>
              <div className={styles.capacitySub}>{sub}</div>
            </div>
          ))}
        </div>
        <p className={styles.capacityNote}>
          As of June 2026.{" "}
          <span className={styles.capacityNoteDim}>
            Delivered capacity attributable to The Meridian Project (TMP), an affiliated ecosystem.
          </span>
        </p>
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
  const [activePage,  setActivePage]  = useState("home");
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [videoReady,  setVideoReady]  = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keyboard: Escape closes menu (modal handles its own Escape)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !modalOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  // iOS autoplay
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const tryPlay = () => {
      vid.play().catch(() => {
        const retry = () => {
          vid.play().catch(() => {});
          document.removeEventListener("touchstart", retry);
          document.removeEventListener("click", retry);
        };
        document.addEventListener("touchstart", retry, { once: true });
        document.addEventListener("click", retry, { once: true });
      });
    };
    if (vid.readyState >= 3) { tryPlay(); }
    else { vid.addEventListener("canplay", tryPlay, { once: true }); }
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

  const openModal  = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const overlayClass = [styles.overlay, menuOpen ? styles.overlayOpen : ""].join(" ").trim();
  const burgerClass  = [styles.burger,  menuOpen ? styles.burgerOpen  : ""].join(" ").trim();
  const videoClass   = [styles.heroVideo, videoReady ? styles.heroVideoReady : ""].join(" ").trim();

  return (
    <>
      {/* ── Get In Touch modal ── */}
      {modalOpen && <GetInTouchModal onClose={() => setModalOpen(false)} />}

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
              x-webkit-airplay="deny"
            >
              <source src={VIDEO_URL} type="video/mp4" />
            </video>

            <div className={styles.scrim} aria-hidden="true" />

            {/* ── Desktop layout ── */}
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
                href="#contact"
                onClick={openModal}
                aria-label="Get in touch with Galadora"
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
                <div className={styles.capacityPillInline}>
                  <CapacityPill />
                </div>
              </div>
              <CompanyMarquee />
            </div>

            {/* ── Mobile layout ── */}
            <div className={styles.heroContentMobile}>
              <div className={styles.mobileTop} />
              <h1 className={styles.mobileHeadline}>
                Infrastructure for<br />the Inference Era
              </h1>
              <div className={styles.mobileMiddle}>
                <span className={styles.mobileBrandLabel}>Galadora</span>
                <a
                  className={styles.mobileLearnWrap}
                  href="#contact"
                  onClick={openModal}
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
                  <div className={styles.capacityPillInline}>
                    <CapacityPill />
                  </div>
                </div>
                <div className={styles.mobileMarquee}>
                  <CompanyMarquee />
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
