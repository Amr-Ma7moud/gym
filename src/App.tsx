import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  FormEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import "./styles.css";

type PlanName = "Essential" | "Performance" | "Elite";

const NAV = [
  { id: "district", label: "The District", href: "#district" },
  { id: "training", label: "Training", href: "#training" },
  { id: "memberships", label: "Memberships", href: "#memberships" },
  { id: "coaches", label: "Coaches", href: "#coaches" },
  { id: "results", label: "Results", href: "#results" },
];

const ZONES = [
  {
    number: "01",
    title: "Strength & Conditioning",
    kicker: "BUILD THE ENGINE",
    copy: "Calibrated bars, competition plates and platforms. Programmed strength work with a coach who knows exactly what you lifted last week.",
    tags: ["POWERLIFTING", "OLYMPIC LIFTS", "PROGRAMMING"],
    image: "/gym/images/zone-strength.webp",
    alt: "A muscular man preparing for a heavy barbell squat inside a dark gym",
  },
  {
    number: "02",
    title: "Functional Training",
    kicker: "TRAIN THE PATTERN",
    copy: "Carries, sleds, ropes and rig work. Movement that transfers out of the gym and into the rest of your life. No gimmicks. Just useful force.",
    tags: ["SLEDS", "CARRIES", "RIG WORK"],
    image: "/gym/images/zone-functional.webp",
    alt: "A man performing a heavy dumbbell farmer carry in a dimly lit gym",
  },
  {
    number: "03",
    title: "Cardio Zone",
    kicker: "EXPAND THE LIMIT",
    copy: "Assault bikes, rowers and treadmills kept deliberately uncrowded. Structured conditioning blocks that build capacity without eating your strength.",
    tags: ["ENGINE WORK", "INTERVALS", "ZONE 2"],
    image: "/gym/images/zone-cardio.webp",
    alt: "A male athlete training on an air bike inside a moody industrial gym",
  },
  {
    number: "04",
    title: "Personal Training",
    kicker: "REMOVE THE GUESSWORK",
    copy: "One coach. One plan. Total attention. Weekly programming, technique work and honest feedback built around your body and your calendar.",
    tags: ["1:1 COACHING", "ASSESSMENTS", "ACCOUNTABILITY"],
    image: "/gym/images/zone-personal.webp",
    alt: "A male coach watching a male athlete rest between cable exercises in a dark gym",
  },
];

const PLANS = [
  {
    name: "Essential" as PlanName,
    number: "01",
    price: "89",
    description: "The foundation. Everything you need to train with intent.",
    featured: false,
    features: [
      "Unlimited gym floor access",
      "Two group sessions per week",
      "Full onboarding assessment",
      "Locker room + towel service",
      "Iron District training app",
    ],
    cta: "START ESSENTIAL",
  },
  {
    name: "Performance" as PlanName,
    number: "02",
    price: "149",
    description: "Our standard. Coached progression, built into your week.",
    featured: true,
    features: [
      "Everything in Essential",
      "Unlimited group training",
      "One 1:1 coaching session monthly",
      "Quarterly performance testing",
      "Recovery suite access",
      "Priority class booking",
    ],
    cta: "JOIN PERFORMANCE",
  },
  {
    name: "Elite" as PlanName,
    number: "03",
    price: "279",
    description: "Total support. For the man with a serious target.",
    featured: false,
    features: [
      "Everything in Performance",
      "Four 1:1 sessions monthly",
      "Bespoke training + nutrition plan",
      "Weekly coach check-in",
      "Unlimited recovery suite",
      "Two guest passes monthly",
    ],
    cta: "APPLY FOR ELITE",
  },
];

const COACHES = [
  {
    name: "Marcus Kane",
    role: "Head of Strength",
    years: "12 YEARS",
    credential: "CSCS · USAW",
    specialties: ["POWERLIFTING", "HYPERTROPHY", "RETURN TO LIFT"],
    quote: "Strength is a skill. We train it like one.",
    image: "/gym/images/trainer-1.webp",
    alt: "Portrait of a muscular male strength coach with folded arms in a dark gym",
  },
  {
    name: "Elias Voss",
    role: "Performance Coach",
    years: "09 YEARS",
    credential: "MSc · S&C",
    specialties: ["ATHLETIC PERFORMANCE", "SPEED", "CONDITIONING"],
    quote: "You don't rise to the occasion. You fall to your preparation.",
    image: "/gym/images/trainer-2.webp",
    alt: "Black and white portrait of a powerful male performance coach in a gym",
  },
  {
    name: "Noah Reyes",
    role: "Conditioning Coach",
    years: "07 YEARS",
    credential: "PN2 · MOVE",
    specialties: ["FAT LOSS", "ENDURANCE", "MOBILITY"],
    quote: "Discipline is choosing what you want most over what you want now.",
    image: "/gym/images/trainer-3.webp",
    alt: "Portrait of a male conditioning coach in a black coach shirt in a modern gym",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I came in strong. Iron District made me precise. Twelve months later I'm moving numbers I'd stopped believing were possible.",
    name: "Adam R.",
    since: "Member since 2023",
    plan: "Performance member",
  },
  {
    quote:
      "No mirrors-and-music circus. Just a room full of men who show up, do the work and hold each other to a higher standard.",
    name: "Samir K.",
    since: "Member since 2022",
    plan: "Elite member",
  },
  {
    quote:
      "The coaching is the difference. Every block has a purpose and every session has a target. It's the first gym that has actually felt like a team.",
    name: "James W.",
    since: "Member since 2021",
    plan: "Performance member",
  },
];

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M1 6.4 4.2 9.5 11 2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  const onMouseMove = (event: ReactMouseEvent<T>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    node.style.setProperty("--magnet-x", `${x}px`);
    node.style.setProperty("--magnet-y", `${y}px`);
  };

  const onMouseLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--magnet-x", "0px");
    node.style.setProperty("--magnet-y", "0px");
  };

  return { ref, onMouseMove, onMouseLeave };
}

function MagneticButton({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const magnetic = useMagnetic<HTMLButtonElement>();
  return (
    <button
      ref={magnetic.ref}
      type="button"
      className={`magnetic ${className}`}
      onClick={onClick}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
    >
      {children}
    </button>
  );
}

function MagneticLink({
  children,
  href,
  className = "",
  onClick,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  const magnetic = useMagnetic<HTMLAnchorElement>();
  return (
    <a
      ref={magnetic.ref}
      href={href}
      className={`magnetic ${className}`}
      onClick={onClick}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
    >
      {children}
    </a>
  );
}

function Intro({
  done,
  count,
}: {
  done: boolean;
  count: number;
}) {
  return (
    <div className={`intro ${done ? "intro--done" : ""}`} aria-hidden="true">
      <div className="intro__grid" />
      <div className="intro__top">
        <span>IRON DISTRICT</span>
        <span>SHOREDITCH · LONDON</span>
      </div>
      <div className="intro__center">
        <span className="intro__outline">IRON</span>
        <span className="intro__word">DISTRICT</span>
      </div>
      <div className="intro__bottom">
        <span>BUILT THROUGH DISCIPLINE.</span>
        <span className="intro__count">{String(count).padStart(3, "0")}</span>
      </div>
      <div className="intro__bar">
        <span style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </div>
  );
}

function ScrollProgress() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      if (ref.current) {
        ref.current.style.transform = `scaleX(${value})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={ref} />
    </div>
  );
}

function Header({
  ready,
  onJoin,
}: {
  ready: boolean;
  onJoin: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  const navigateFromMenu = (href: string) => {
    setOpen(false);
    window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(href);
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }, 220);
  };

  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 32);
      const marker = window.scrollY + window.innerHeight * 0.42;
      let current = "";
      for (const item of NAV) {
        const node = document.getElementById(item.id);
        if (node && node.offsetTop <= marker) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ready]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <>
      <header
        className={`site-header ${scrolled ? "is-scrolled" : ""} ${
          open ? "is-menu-open" : ""
        }`}
      >
        <a
          className="brand"
          href="#top"
          aria-label="Iron District — back to top"
          onClick={(event) => {
            if (open) {
              event.preventDefault();
              navigateFromMenu("#top");
            }
          }}
        >
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="brand__name">
            <span>IRON</span>
            <strong>DISTRICT</strong>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={active === item.id ? "is-active" : ""}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header__end">
          <MagneticButton className="header__join" onClick={onJoin}>
            <span>JOIN THE DISTRICT</span>
            <ArrowIcon size={15} />
          </MagneticButton>
          <button
            type="button"
            className={`menu-toggle ${open ? "is-active" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="mobile-menu__nav">
          {NAV.map((item, index) => (
            <a
              key={item.id}
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={(event) => {
                event.preventDefault();
                navigateFromMenu(item.href);
              }}
            >
              <span className="mobile-menu__index">0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </div>
        <div className="mobile-menu__foot">
          <div>
            <span>SHOREDITCH, LONDON</span>
            <a href="mailto:train@irondistrict.co">train@irondistrict.co</a>
          </div>
          <MagneticButton
            className="btn btn--primary"
            onClick={() => {
              setOpen(false);
              onJoin();
            }}
          >
            <span>JOIN THE DISTRICT</span>
            <ArrowIcon />
          </MagneticButton>
        </div>
      </div>
    </>
  );
}

function Hero({ onJoin }: { onJoin: () => void }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const shift = Math.min(window.scrollY, window.innerHeight * 1.15) * 0.22;
      node.style.setProperty("--hero-shift", `${shift}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="hero" id="top" ref={ref} aria-label="Iron District">
      <div className="hero__media">
        <img
          src="/gym/images/hero.webp"
          alt="A focused male athlete pressing a barbell in a dark, industrial gym"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="hero__scrim" />
      <div className="hero__grain" aria-hidden="true" />

      <div className="hero__frame">
        <div className="hero__kicker">
          <span className="hero__kicker-left">
            <i aria-hidden="true" />
            PRIVATE STRENGTH CLUB — SHOREDITCH, LONDON
          </span>
          <span className="hero__kicker-right">EST. 2016</span>
        </div>

        <div className="hero__main">
          <h1 className="hero__title">
            <span className="hero__line">
              <span className="hero__line-inner">
                YOUR <span className="outline">LIMITS</span>
              </span>
            </span>
            <span className="hero__line">
              <span className="hero__line-inner">ARE NOT</span>
            </span>
            <span className="hero__line">
              <span className="hero__line-inner">
                YOUR LIMITS<span className="hero__dot">.</span>
              </span>
            </span>
          </h1>

          <div className="hero__bottom">
            <div className="hero__actions">
              <MagneticButton className="btn btn--primary btn--hero" onClick={onJoin}>
                <span>JOIN THE DISTRICT</span>
                <ArrowIcon />
              </MagneticButton>
              <MagneticLink
                href="#memberships"
                className="btn btn--ghost btn--hero"
              >
                <span>EXPLORE MEMBERSHIPS</span>
                <ArrowIcon />
              </MagneticLink>
            </div>
            <div className="hero__support">
              <span className="hero__support-label">THE WORK / 01</span>
              <p>
                Strength is built in the hours no one sees. Train in a room
                built for the work — and coached by men who have done it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__plate" aria-hidden="true">
        <span className="hero__plate-halo" />
        <div className="plate">
          <span className="plate__edge" />
          <div className="plate__face">
            <span className="plate__groove plate__groove--one" />
            <span className="plate__groove plate__groove--two" />
            <span className="plate__hole" />
            <span className="plate__stamp">25</span>
            <svg className="plate__text" viewBox="0 0 200 200">
              <defs>
                <path
                  id="plate-circle"
                  d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
                />
              </defs>
              <text>
                <textPath href="#plate-circle" startOffset="0">
                  IRON DISTRICT · 25 KG · FORGED ·
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>

      <a className="scroll-cue" href="#district" aria-label="Scroll to The District">
        <span>SCROLL</span>
        <span className="scroll-cue__line" />
      </a>
    </section>
  );
}

function Marquee() {
  const items = ["STRENGTH", "CONDITIONING", "DISCIPLINE", "BROTHERHOOD", "PROGRESS"];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((group) => (
          <div className="marquee__group" key={group}>
            {items.map((item) => (
              <span className="marquee__item" key={`${group}-${item}`}>
                {item}
                <i />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function District() {
  return (
    <section id="district" className="district">
      <div className="section-bar" data-reveal>
        <span className="section-bar__index">01</span>
        <span>THE DISTRICT</span>
        <span className="section-bar__end">FOUNDRY YARD · E2</span>
      </div>

      <div className="district__head">
        <h2 className="display reveal-title">
          <span className="line">
            <span>NOT A GYM.</span>
          </span>
          <span className="line">
            <span className="outline">A STANDARD.</span>
          </span>
        </h2>
        <div className="district__intro" data-reveal>
          <p>
            A private training floor for men who are done treating fitness as a
            hobby. Built from concrete, steel and a simple agreement: show up,
            do the work, get better.
          </p>
          <div className="district__intro-meta">
            <span>12,000 SQ FT</span>
            <span>30 ATHLETE CAP</span>
            <span>OPEN DAILY</span>
          </div>
        </div>
      </div>

      <div className="district__grid">
        <div className="district__visual">
          <figure className="district__image reveal-image">
            <img
              src="/gym/images/district.webp"
              alt="A male athlete crouching behind a loaded barbell in a warm-lit industrial gym"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>FOUNDRY YARD</span>
              <span>SHOREDITCH, LONDON</span>
            </figcaption>
          </figure>
          <figure className="district__detail reveal-image" aria-hidden="true">
            <img
              src="/gym/images/district-detail.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </figure>
          <span className="district__stamp" aria-hidden="true">
            01 / EST. 2016
          </span>
        </div>

        <div className="district__copy">
          <p className="district__copy-lead" data-reveal>
            We built the room we could not find. Then we built the standard to
            match it.
          </p>
          <p data-reveal>
            No posing mirrors. No crowded circuits. No background noise. Just
            calibrated equipment, deliberate programming and coaches who know
            your name, your numbers and exactly what you need next.
          </p>
          <p data-reveal>
            Iron District is not for everyone. It is for the man who wants to be
            held to something higher than his last excuse.
          </p>

          <ol className="principles">
            <li data-reveal>
              <span>01</span>
              <div>
                <h3>Every session has a purpose.</h3>
                <p>No wandering. No defaulting to the same three machines.</p>
              </div>
            </li>
            <li data-reveal>
              <span>02</span>
              <div>
                <h3>Small floor. Full attention.</h3>
                <p>Thirty athletes maximum. Your space is protected.</p>
              </div>
            </li>
            <li data-reveal>
              <span>03</span>
              <div>
                <h3>Progress is tracked, not assumed.</h3>
                <p>Testing, feedback and honest numbers. Every quarter.</p>
              </div>
            </li>
          </ol>

          <MagneticLink href="#memberships" className="text-link">
            <span>FIND YOUR PLACE</span>
            <ArrowIcon />
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}

function Zones({ onJoin }: { onJoin: () => void }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("zones--static");
      section.style.height = "auto";
      return;
    }

    let frame = 0;
    let distance = 0;

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance}px`;
      update();
    };

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress =
        distance > 0 && scrollable > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollable))
          : 0;
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
      if (counterRef.current) {
        const index = Math.min(4, Math.floor(progress * 4) + 1);
        counterRef.current.textContent = String(index).padStart(2, "0");
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="training"
      className="zones"
      ref={sectionRef}
      aria-labelledby="zones-title"
    >
      <div className="zones__pin">
        <div className="zones__head">
          <div className="section-bar" data-reveal>
            <span className="section-bar__index">02</span>
            <span>TRAINING ZONES</span>
            <span className="section-bar__end">FOUR ROOMS · ONE STANDARD</span>
          </div>
          <div className="zones__head-row">
            <h2 id="zones-title" className="display reveal-title">
              <span className="line">
                <span>FIND YOUR</span>
              </span>
              <span className="line">
                <span className="outline">EDGE.</span>
              </span>
            </h2>
            <p className="zones__desc" data-reveal>
              Four purpose-built environments. One connected program. Wherever
              you start, the work is designed to carry into the rest.
            </p>
          </div>
        </div>

        <div className="zones__viewport">
          <div className="zones__track" ref={trackRef}>
            {ZONES.map((zone) => (
              <a
                className="zone-card"
                key={zone.title}
                href="#memberships"
                aria-label={`${zone.title} — view memberships`}
              >
                <img
                  src={zone.image}
                  alt={zone.alt}
                  loading="lazy"
                  decoding="async"
                />
                <span className="zone-card__shade" aria-hidden="true" />
                <span className="zone-card__top">
                  <span className="zone-card__number">{zone.number}</span>
                  <span className="zone-card__kicker">{zone.kicker}</span>
                </span>
                <span className="zone-card__content">
                  <span className="zone-card__title">{zone.title}</span>
                  <span className="zone-card__copy">{zone.copy}</span>
                  <span className="zone-card__foot">
                    <span className="zone-card__tags">
                      {zone.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>
                    <span className="zone-card__arrow">
                      <ArrowIcon />
                    </span>
                  </span>
                </span>
              </a>
            ))}

            <div className="zone-end">
              <span className="eyebrow">THE FIRST STEP</span>
              <h3 className="display">
                NOT SURE
                <br />
                WHERE TO
                <br />
                <span className="outline">START?</span>
              </h3>
              <p>
                Book a walkthrough. We'll show you the floor, ask the right
                questions and point you at the room that will move you fastest.
              </p>
              <MagneticButton className="btn btn--primary" onClick={onJoin}>
                <span>BOOK A TOUR</span>
                <ArrowIcon />
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="zones__foot">
          <div className="zones__progress" aria-hidden="true">
            <span ref={progressRef} />
          </div>
          <div className="zones__count" aria-hidden="true">
            <span ref={counterRef}>01</span>
            <span>/ 04</span>
          </div>
          <span className="zones__scroll-note">
            SCROLL TO EXPLORE <ArrowIcon size={14} />
          </span>
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  onJoin,
}: {
  plan: (typeof PLANS)[number];
  onJoin: (plan: PlanName) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const node = cardRef.current;
    if (!node || window.matchMedia("(hover: none)").matches) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    node.style.setProperty("--tilt-x", `${(0.5 - y) * 6}deg`);
    node.style.setProperty("--tilt-y", `${(x - 0.5) * 8}deg`);
    node.style.setProperty("--glow-x", `${x * 100}%`);
    node.style.setProperty("--glow-y", `${y * 100}%`);
  };

  const onMouseLeave = () => {
    const node = cardRef.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      ref={cardRef}
      className={`plan ${plan.featured ? "plan--featured" : ""}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <span className="plan__glare" aria-hidden="true" />
      <div className="plan__top">
        <span className="plan__number">{plan.number}</span>
        {plan.featured && <span className="plan__badge">MOST CHOSEN</span>}
      </div>
      <h3 className="plan__name">{plan.name}</h3>
      <p className="plan__description">{plan.description}</p>
      <div className="plan__price">
        <span className="plan__currency">£</span>
        <span className="plan__amount">{plan.price}</span>
        <span className="plan__per">/ month</span>
      </div>
      <ul className="plan__features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <span className="plan__check">
              <CheckIcon />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <MagneticButton
        className={`btn ${plan.featured ? "btn--dark" : "btn--outline"} plan__cta`}
        onClick={() => onJoin(plan.name)}
      >
        <span>{plan.cta}</span>
        <ArrowIcon />
      </MagneticButton>
    </div>
  );
}

function Memberships({ onJoin }: { onJoin: (plan: PlanName) => void }) {
  return (
    <section id="memberships" className="memberships">
      <div className="section-bar" data-reveal>
        <span className="section-bar__index">03</span>
        <span>MEMBERSHIP</span>
        <span className="section-bar__end">NO JOINING FEE · CANCEL ANYTIME</span>
      </div>

      <div className="memberships__head">
        <h2 className="display reveal-title">
          <span className="line">
            <span>INVEST IN</span>
          </span>
          <span className="line">
            <span className="outline">THE WORK.</span>
          </span>
        </h2>
        <div className="memberships__intro" data-reveal>
          <p>
            Three levels. One non-negotiable standard. Every membership includes
            a floor that is never oversold and a coach who knows your name.
          </p>
          <span className="memberships__note">ALL PRICES BILLED MONTHLY IN GBP</span>
        </div>
      </div>

      <div className="plans">
        {PLANS.map((plan) => (
          <PlanCard key={plan.name} plan={plan} onJoin={onJoin} />
        ))}
      </div>

      <div className="memberships__foot" data-reveal>
        <span>
          <i aria-hidden="true" />
          EVERY MEMBERSHIP STARTS WITH A 60-MINUTE ASSESSMENT.
        </span>
        <span>NO CONTRACT · 30-DAY NOTICE</span>
      </div>
    </section>
  );
}

function Coaches({ onJoin }: { onJoin: (plan: PlanName) => void }) {
  return (
    <section id="coaches" className="coaches">
      <div className="section-bar" data-reveal>
        <span className="section-bar__index">04</span>
        <span>THE COACHES</span>
        <span className="section-bar__end">SELECTED · NOT STAFFED</span>
      </div>

      <div className="coaches__head">
        <h2 className="display reveal-title">
          <span className="line">
            <span>COACHED BY</span>
          </span>
          <span className="line">
            <span className="outline">THE RELENTLESS.</span>
          </span>
        </h2>
        <div className="coaches__intro" data-reveal>
          <p>
            Every coach on this floor has competed, coached and earned the
            right to tell you what to do next. No scripts. No shortcuts.
          </p>
          <span>14 COACHES · 1 STANDARD</span>
        </div>
      </div>

      <div className="coaches__grid">
        {COACHES.map((coach, index) => (
          <a
            className="coach"
            key={coach.name}
            href="#join"
            onClick={(event) => {
              event.preventDefault();
              onJoin("Performance");
            }}
            aria-label={`Book a session with ${coach.name}, ${coach.role}`}
          >
            <span className="coach__image">
              <img
                src={coach.image}
                alt={coach.alt}
                loading="lazy"
                decoding="async"
              />
              <span className="coach__shade" aria-hidden="true" />
              <span className="coach__index">0{index + 1}</span>
              <span className="coach__hover">
                <span className="coach__specialty">
                  {coach.specialties.join(" · ")}
                </span>
                <span className="coach__quote">“{coach.quote}”</span>
                <span className="coach__book">
                  BOOK A SESSION <ArrowIcon size={15} />
                </span>
              </span>
            </span>
            <span className="coach__info">
              <span className="coach__identity">
                <strong>{coach.name}</strong>
                <span>{coach.role}</span>
              </span>
              <span className="coach__meta">
                <span>{coach.years}</span>
                <span>{coach.credential}</span>
              </span>
            </span>
          </a>
        ))}
      </div>

      <div className="coaches__foot" data-reveal>
        <span>
          ALL COACHES HOLD CURRENT DBS CHECKS AND NATIONAL GOVERNING BODY
          ACCREDITATION.
        </span>
        <MagneticLink href="#join" className="text-link">
          <span>MEET THE FULL TEAM</span>
          <ArrowIcon />
        </MagneticLink>
      </div>
    </section>
  );
}

function Counter({
  value,
  duration = 1900,
}: {
  value: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let start = 0;
    const animate = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          frame = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [duration, value]);

  return <span ref={ref}>{display.toLocaleString("en-GB")}</span>;
}

function Proof() {
  const [active, setActive] = useState(0);
  const testimonial = TESTIMONIALS[active];

  const move = (direction: number) => {
    setActive((current) => {
      const next = current + direction;
      return (next + TESTIMONIALS.length) % TESTIMONIALS.length;
    });
  };

  return (
    <section id="results" className="proof">
      <div className="section-bar" data-reveal>
        <span className="section-bar__index">05</span>
        <span>PROOF</span>
        <span className="section-bar__end">WORDS FROM THE FLOOR</span>
      </div>

      <div className="proof__head">
        <h2 className="display reveal-title">
          <span className="line">
            <span>THE WORK</span>
          </span>
          <span className="line">
            <span className="outline">SPEAKS.</span>
          </span>
        </h2>
        <p className="proof__intro" data-reveal>
          No paid ambassadors. No polished scripts. Just members who kept
          showing up and have the results to prove it.
        </p>
      </div>

      <div className="proof__grid">
        <div className="testimonial" data-reveal>
          <div className="testimonial__stage" key={active} aria-live="polite">
            <span className="testimonial__mark" aria-hidden="true">
              “
            </span>
            <blockquote>{testimonial.quote}</blockquote>
            <div className="testimonial__author">
              <span className="testimonial__avatar" aria-hidden="true">
                {testimonial.name.charAt(0)}
              </span>
              <div>
                <strong>{testimonial.name}</strong>
                <span>
                  {testimonial.since} · {testimonial.plan}
                </span>
              </div>
            </div>
          </div>
          <div className="testimonial__controls">
            <button
              type="button"
              className="round-button"
              aria-label="Previous testimonial"
              onClick={() => move(-1)}
            >
              <span className="round-button__arrow round-button__arrow--back">
                <ArrowIcon />
              </span>
            </button>
            <span className="testimonial__count">
              0{active + 1} <i /> 0{TESTIMONIALS.length}
            </span>
            <button
              type="button"
              className="round-button"
              aria-label="Next testimonial"
              onClick={() => move(1)}
            >
              <ArrowIcon />
            </button>
          </div>
        </div>

        <aside className="proof__aside" data-reveal>
          <span className="proof__aside-label">MEMBER STORIES</span>
          <div className="proof__aside-number">
            0{active + 1}
            <span>/ 03</span>
          </div>
          <div className="proof__dots" aria-hidden="true">
            {TESTIMONIALS.map((item, index) => (
              <span
                key={item.name}
                className={index === active ? "is-active" : ""}
              />
            ))}
          </div>
          <p>REAL MEMBERS. REAL TRAINING BLOCKS. REAL NUMBERS.</p>
        </aside>
      </div>

      <div className="stats">
        <div className="stat" data-reveal>
          <div className="stat__number">
            <Counter value={1400} />
            <span>+</span>
          </div>
          <div className="stat__label">
            <span>01</span>
            <span>MEMBERS ON THE FLOOR</span>
          </div>
        </div>
        <div className="stat" data-reveal>
          <div className="stat__number">
            <Counter value={14} />
            <span>+</span>
          </div>
          <div className="stat__label">
            <span>02</span>
            <span>ELITE COACHES</span>
          </div>
        </div>
        <div className="stat" data-reveal>
          <div className="stat__number">
            <Counter value={52000} />
            <span>+</span>
          </div>
          <div className="stat__label">
            <span>03</span>
            <span>HOURS UNDER THE BAR</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onJoin }: { onJoin: () => void }) {
  return (
    <section id="join" className="final-cta">
      <div className="final-cta__media" aria-hidden="true">
        <img src="/gym/images/cta.webp" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="final-cta__veil" aria-hidden="true" />
      <div className="final-cta__inner">
        <div className="section-bar" data-reveal>
          <span className="section-bar__index">06</span>
          <span>JOIN THE DISTRICT</span>
          <span className="section-bar__end">MEMBERSHIP OPENS HERE</span>
        </div>
        <div className="final-cta__row">
          <div className="final-cta__main" data-reveal>
            <span className="final-cta__kicker">
              <i aria-hidden="true" />
              NO TRIAL. NO TOURIST PASS. COMMIT.
            </span>
            <h2 className="display final-cta__title">
              YOUR NEXT
              <br />
              CHAPTER
              <br />
              <span>STARTS HERE.</span>
            </h2>
            <MagneticButton
              className="btn btn--primary btn--large"
              onClick={onJoin}
            >
              <span>JOIN NOW</span>
              <ArrowIcon size={22} />
            </MagneticButton>
          </div>

          <div className="contact" data-reveal>
            <div className="contact__block">
              <span className="contact__label">LOCATION</span>
              <p>
                14 Foundry Yard
                <br />
                Shoreditch, London E2 7JP
              </p>
              <a
                href="https://maps.google.com/?q=Shoreditch+London"
                target="_blank"
                rel="noreferrer"
              >
                GET DIRECTIONS <ArrowIcon size={13} />
              </a>
            </div>
            <div className="contact__block">
              <span className="contact__label">ENQUIRIES</span>
              <p>
                <a href="mailto:train@irondistrict.co">
                  train@irondistrict.co
                </a>
                <br />
                <a href="tel:+442079460318">+44 20 7946 0318</a>
              </p>
            </div>
            <div className="contact__block">
              <span className="contact__label">HOURS</span>
              <p>
                MON–FRI 05:00–23:00
                <br />
                SAT–SUN 07:00–21:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__word" aria-hidden="true">
        IRON DISTRICT
      </div>
      <div className="footer__grid">
        <div className="footer__statement">
          <span>BUILT THROUGH</span>
          <strong>DISCIPLINE.</strong>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <span className="footer__label">EXPLORE</span>
          <a href="#district">The District</a>
          <a href="#training">Training Zones</a>
          <a href="#memberships">Memberships</a>
          <a href="#coaches">Coaches</a>
          <a href="#results">Results</a>
        </nav>

        <div className="footer__contact">
          <span className="footer__label">THE FLOOR</span>
          <p>
            14 Foundry Yard
            <br />
            Shoreditch, London E2 7JP
          </p>
          <a href="mailto:train@irondistrict.co">train@irondistrict.co</a>
          <a href="tel:+442079460318">+44 20 7946 0318</a>
        </div>

        <div className="footer__social">
          <span className="footer__label">FOLLOW THE WORK</span>
          <a href="#top">Instagram ↗</a>
          <a href="#top">Strava ↗</a>
          <a href="#top">YouTube ↗</a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© 2026 IRON DISTRICT. ALL RIGHTS RESERVED.</span>
        <span>SHOREDITCH · LONDON · E2</span>
        <span>
          PHOTOGRAPHY VIA{" "}
          <a href="https://www.pexels.com" target="_blank" rel="noreferrer">
            PEXELS
          </a>
        </span>
        <a href="#top" className="footer__top">
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
}

function JoinDialog({
  open,
  initialPlan,
  onClose,
}: {
  open: boolean;
  initialPlan: PlanName;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [plan, setPlan] = useState<PlanName>(initialPlan);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setPlan(initialPlan);
      setSubmitted(false);
      dialog.showModal();
      document.body.classList.add("dialog-open");
    } else if (!open && dialog.open) {
      dialog.close();
      document.body.classList.remove("dialog-open");
    }
  }, [initialPlan, open]);

  useEffect(() => {
    return () => document.body.classList.remove("dialog-open");
  }, []);

  const close = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    document.body.classList.remove("dialog-open");
    onClose();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    formRef.current?.reset();
  };

  return (
    <dialog
      ref={dialogRef}
      className="join-dialog"
      aria-labelledby="join-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={() => {
        document.body.classList.remove("dialog-open");
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="join-dialog__panel">
        <button
          type="button"
          className="join-dialog__close"
          aria-label="Close membership application"
          onClick={close}
        >
          <span />
          <span />
        </button>

        <div className="join-dialog__aside">
          <span className="eyebrow">MEMBERSHIP APPLICATION</span>
          <h2 id="join-dialog-title" className="display">
            EARN
            <br />
            YOUR
            <br />
            <span className="outline">PLACE.</span>
          </h2>
          <p>
            Every application is reviewed by a coach. If we think we can move
            you forward, we'll call you within one working day.
          </p>
          <div className="join-dialog__aside-meta">
            <span>NO JOINING FEE</span>
            <span>30-DAY NOTICE</span>
          </div>
        </div>

        <div className="join-dialog__body">
          {submitted ? (
            <div className="join-dialog__success" role="status">
              <span className="join-dialog__success-mark">✓</span>
              <span className="eyebrow">APPLICATION RECEIVED</span>
              <h3 className="display">SEE YOU ON THE FLOOR.</h3>
              <p>
                Your application is in. A coach will be in touch within one
                working day to arrange your assessment.
              </p>
              <button type="button" className="btn btn--outline" onClick={close}>
                <span>CLOSE</span>
                <ArrowIcon />
              </button>
            </div>
          ) : (
            <form className="join-form" ref={formRef} onSubmit={onSubmit}>
              <div className="join-form__row">
                <label>
                  <span>FULL NAME</span>
                  <input type="text" name="name" autoComplete="name" required />
                </label>
                <label>
                  <span>EMAIL</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <div className="join-form__row">
                <label>
                  <span>PHONE (OPTIONAL)</span>
                  <input type="tel" name="phone" autoComplete="tel" />
                </label>
                <label>
                  <span>PRIMARY GOAL</span>
                  <select name="goal" defaultValue="Build strength">
                    <option>Build strength</option>
                    <option>Build muscle</option>
                    <option>Improve conditioning</option>
                    <option>Lose body fat</option>
                    <option>Return from injury</option>
                    <option>Compete</option>
                  </select>
                </label>
              </div>

              <fieldset className="join-form__plans">
                <legend>SELECT MEMBERSHIP</legend>
                <div className="join-form__plan-grid">
                  {PLANS.map((item) => (
                    <label
                      key={item.name}
                      className={`join-form__plan ${
                        plan === item.name ? "is-selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={item.name}
                        checked={plan === item.name}
                        onChange={() => setPlan(item.name)}
                      />
                      <span>{item.name}</span>
                      <strong>£{item.price}<small>/mo</small></strong>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="join-form__consent">
                <input type="checkbox" required />
                <span>
                  I understand Iron District is an 18+ training facility and
                  agree to be contacted about my application.
                </span>
              </label>

              <button type="submit" className="btn btn--primary join-form__submit">
                <span>SUBMIT APPLICATION</span>
                <ArrowIcon />
              </button>
              <p className="join-form__note">
                NO PAYMENT TODAY. APPLICATIONS ARE REVIEWED BY A COACH.
              </p>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default function App() {
  const [introCount, setIntroCount] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinPlan, setJoinPlan] = useState<PlanName>("Performance");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 120 : 1450;
    const start = performance.now();
    let frame = 0;
    const timers: number[] = [];
    document.body.classList.add("is-locked");

    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / duration);
      setIntroCount(Math.round(progress * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        timers.push(
          window.setTimeout(() => {
            setIntroDone(true);
            document.body.classList.remove("is-locked");
          }, 140),
        );
        timers.push(window.setTimeout(() => setIntroGone(true), 1300));
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.classList.remove("is-locked");
    };
  }, []);

  useEffect(() => {
    if (!introDone) return;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal], .reveal-image, .reveal-title",
      ),
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [introDone]);

  const openJoin = useCallback((plan: PlanName = "Performance") => {
    setJoinPlan(plan);
    setJoinOpen(true);
  }, []);

  const closeJoin = useCallback(() => setJoinOpen(false), []);

  return (
    <div className={`site ${introDone ? "is-ready" : ""}`}>
      <a className="skip-link" href="#main">
        SKIP TO CONTENT
      </a>
      {!introGone && <Intro done={introDone} count={introCount} />}
      <ScrollProgress />
      <Header ready={introDone} onJoin={() => openJoin("Performance")} />

      <main id="main">
        <Hero onJoin={() => openJoin("Performance")} />
        <Marquee />
        <District />
        <Zones onJoin={() => openJoin("Performance")} />
        <Memberships onJoin={openJoin} />
        <Coaches onJoin={openJoin} />
        <Proof />
        <FinalCTA onJoin={() => openJoin("Performance")} />
      </main>

      <Footer />

      <JoinDialog
        open={joinOpen}
        initialPlan={joinPlan}
        onClose={closeJoin}
      />
    </div>
  );
}
