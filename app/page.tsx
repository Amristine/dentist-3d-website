"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, MoveUpRight, Plus, Sparkles, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ToothScene = dynamic(() => import("@/components/ToothScene"), {
  ssr: false,
  loading: () => <div className="scene-fallback"><span className="fallback-ring" /><span>FORM / 001</span></div>,
});
const AnatomyScene = dynamic(() => import("@/components/AnatomyScene"), {
  ssr: false,
  loading: () => <div className="anatomy-fallback">A CLOSER LOOK AT YOUR SMILE</div>,
});

const treatments = [
  {
    number: "01",
    title: "Smile design",
    label: "THE ART OF YOU",
    description: "Subtle, thoughtful details. A result that feels like you—only more confident.",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1500&q=88",
    className: "treatment-design",
  },
  {
    number: "02",
    title: "Precision whitening",
    label: "LIGHT, REFINED",
    description: "A naturally brighter smile, guided by your features and your comfort.",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1500&q=88",
    className: "treatment-white",
  },
  {
    number: "03",
    title: "Restorative care",
    label: "MADE TO LAST",
    description: "Carefully considered treatment that puts strength, health, and ease first.",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1500&q=88",
    className: "treatment-care",
  },
];

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-kicker, .hero-title-line, .hero-intro, .hero-actions, .hero-footnote",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.18 }
      );
      gsap.fromTo(".hero-artwork", { opacity: 0, scale: 0.92, rotate: -3 }, {
        opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: "power3.out", delay: 0.25,
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: 34, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 84%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>(".treatment-panel").forEach((element) => {
        gsap.fromTo(element, { y: 46 }, {
          y: 0, ease: "none",
          scrollTrigger: { trigger: element, start: "top 94%", end: "top 45%", scrub: 0.8 },
        });
      });
      gsap.to(".hero-artwork", {
        yPercent: 10, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
      });
      gsap.to(".gold-orbit", {
        rotate: 360, duration: 70, repeat: -1, ease: "none", transformOrigin: "50% 50%",
      });
      gsap.fromTo(".manifesto-word", { yPercent: 115 }, {
        yPercent: 0, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".manifesto", start: "top 68%", once: true },
      });
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main ref={root}>
      <div className="noise-overlay" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Lumière home">
          <span className="wordmark-symbol"><i /><i /><i /></span>
          <span className="wordmark-text">lumière<span>THE ART OF YOUR SMILE</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#philosophy">Philosophy</a>
          <a href="#science">The science</a>
          <a href="#treatments">Treatments</a>
          <a href="#studio">The studio</a>
        </nav>
        <a className="nav-book" href="#appointment">Book a consultation <ArrowUpRight size={15} /></a>
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={22} /></button>
      </header>

      <div className={`mobile-navigation ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-navigation-top">
          <a className="wordmark" href="#top" onClick={closeMenu}><span className="wordmark-symbol"><i /><i /><i /></span><span className="wordmark-text">lumière<span>THE ART OF YOUR SMILE</span></span></a>
          <button onClick={closeMenu} aria-label="Close navigation"><X size={23} /></button>
        </div>
        <nav aria-label="Mobile navigation">
          <a href="#philosophy" onClick={closeMenu}><span>01</span> Philosophy <ArrowUpRight /></a>
          <a href="#science" onClick={closeMenu}><span>02</span> The science <ArrowUpRight /></a>
          <a href="#treatments" onClick={closeMenu}><span>03</span> Treatments <ArrowUpRight /></a>
          <a href="#studio" onClick={closeMenu}><span>04</span> The studio <ArrowUpRight /></a>
          <a href="#appointment" onClick={closeMenu}><span>05</span> Book a visit <ArrowUpRight /></a>
        </nav>
        <p>Thoughtful people. Thoughtful care.</p>
      </div>

      <section className="hero dark-section" id="top">
        <div className="hero-topline"><span>INDEPENDENT DENTAL STUDIO</span><span>EST. IN CARE <i>✳</i></span></div>
        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="tiny-spark">✳</span> A NEW PERSPECTIVE ON DENTISTRY</div>
            <h1>
              <span className="hero-title-line">Your smile.</span>
              <span className="hero-title-line title-signature"><em>Your</em> signature<span className="title-period">.</span></span>
            </h1>
            <p className="hero-intro">A more considered kind of dental care. Where science meets artistry, and every detail begins with you.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#treatments">Discover your smile <ArrowUpRight size={17} /></a>
              <a className="quiet-link" href="#philosophy">Explore the experience <ArrowDown size={14} /></a>
            </div>
            <div className="hero-footnote"><span className="footnote-line" /><span>PERSONAL CARE, BEAUTIFULLY CONSIDERED.</span></div>
          </div>

          <div className="hero-artwork" aria-label="Interactive 3D porcelain tooth sculpture">
            <div className="art-backlight" />
            <div className="art-rings"><span className="gold-orbit orbit-a" /><span className="gold-orbit orbit-b" /><span className="gold-orbit orbit-c" /></div>
            <div className="art-grid" />
            <ToothScene />
            <div className="art-label art-label-top"><span>OBJECT Nº 001</span><span>ENAMEL / CERAMIC</span></div>
            <div className="art-label art-label-bottom"><span className="label-point" /><span><b>Form follows feeling.</b><small>AN EXERCISE IN PRECISION</small></span></div>
            <span className="art-coordinate">40° 43’ 55.3” N<br />73° 59’ 11.2” W</span>
          </div>
        </div>
        <div className="hero-bottomline"><span><span className="live-dot" /> AVAILABLE FOR NEW PATIENTS</span><a href="#philosophy">SCROLL TO EXPLORE <span>↓</span></a><span>01 — 06</span></div>
      </section>

      <section className="intro-strip">
        <div className="intro-statement" data-reveal><span>THE LUMIÈRE DIFFERENCE</span><p>Not just a better smile.<br /><em>A better feeling.</em></p></div>
        <div className="intro-note" data-reveal><span className="note-star">✳</span><p>We believe the best care is deeply personal. Thoughtful, unhurried, and shaped around the person behind every smile.</p></div>
        <div className="intro-index">01 <span>/</span> 06</div>
      </section>

      <section className="philosophy dark-section" id="philosophy">
        <div className="section-meta" data-reveal><span>01 / OUR PHILOSOPHY</span><span>THE HUMAN SIDE OF DENTISTRY</span></div>
        <div className="philosophy-composition">
          <div className="philosophy-heading" data-reveal>
            <p className="section-kicker"><span /> A DIFFERENT POINT OF VIEW</p>
            <h2>Dentistry is<br />a <em>science.</em><br /><span>Your smile is</span><br /><em>an art.</em></h2>
          </div>
          <div className="philosophy-visual" data-reveal>
            <div className="philosophy-photo" role="img" aria-label="Sculptural modern dental studio details" />
            <div className="photo-frame-line" />
            <div className="photo-caption"><span>FIG. 01</span><span>CARE, RECONSIDERED</span></div>
            <div className="floating-seal"><Sparkles size={18} /><span>FORM<br />MEETS<br />FEELING</span></div>
          </div>
          <div className="philosophy-footer" data-reveal><p>Precision matters. So does how you feel. We bring the two together with care that respects your individuality, your time, and your comfort.</p><a href="#science" className="round-arrow" aria-label="Explore dental science"><ArrowDown size={19} /></a></div>
        </div>
        <div className="side-note">LESS CLINICAL. MORE HUMAN.</div>
      </section>

      <section className="science section-ivory" id="science">
        <div className="science-head" data-reveal>
          <span className="section-index">02 / THE SCIENCE OF A SMILE</span>
          <div className="science-heading-row"><h2>Beautiful on the outside.<br /><em>Remarkable within.</em></h2><p>Behind every smile is an intricate little masterpiece. Take a closer look at the layers that make it work.</p></div>
        </div>
        <div className="science-body">
          <div className="anatomy-stage" data-reveal>
            <div className="anatomy-backdrop" />
            <AnatomyScene />
            <div className="anatomy-label label-enamel"><span>01</span><i /> ENAMEL</div>
            <div className="anatomy-label label-dentin"><span>02</span><i /> DENTIN</div>
            <div className="anatomy-label label-pulp"><span>03</span><i /> PULP
            </div>
            <div className="anatomy-caption">ILLUSTRATIVE ANATOMY <span>NOT TO SCALE</span></div>
          </div>
          <div className="science-notes" data-reveal>
            <div className="science-note"><span>01</span><div><h3>Enamel</h3><p>The protective outer layer of the tooth. Strong, mineral-rich, and essential to everyday function.</p></div><Plus size={16} /></div>
            <div className="science-note"><span>02</span><div><h3>Dentin</h3><p>The supportive layer beneath enamel, forming much of the tooth’s structure.</p></div><Plus size={16} /></div>
            <div className="science-note"><span>03</span><div><h3>Pulp</h3><p>The inner tissue containing nerves and blood vessels that help keep the tooth alive.</p></div><Plus size={16} /></div>
            <p className="science-disclaimer">An educational illustration, not a diagnostic representation.</p>
          </div>
        </div>
      </section>

      <section className="treatments dark-section" id="treatments">
        <div className="treatment-heading" data-reveal>
          <div><span className="section-index">03 / SIGNATURE TREATMENTS</span><h2>Small details.<br /><em>A world of difference.</em></h2></div>
          <p>Considered care for what matters to you. No one-size-fits-all plans, just a thoughtful place to begin.</p>
        </div>
        <div className="treatment-grid">
          {treatments.map((item) => (
            <a href="#appointment" className={`treatment-panel ${item.className}`} key={item.number}>
              <div className="treatment-image" style={{ backgroundImage: `url('${item.image}')` }} />
              <div className="treatment-shade" />
              <div className="treatment-top"><span>{item.number} / 03</span><span>{item.label}</span></div>
              <div className="treatment-content"><span className="treatment-eyebrow">{item.label}</span><h3>{item.title}</h3><p>{item.description}</p><span className="treatment-more">EXPLORE TREATMENT <ArrowUpRight size={15} /></span></div>
              <div className="treatment-circle"><ArrowUpRight size={20} /></div>
            </a>
          ))}
        </div>
        <div className="treatment-bottom"><span>CARE THAT STARTS WITH A CONVERSATION.</span><a href="#appointment">Talk to our team <ArrowRight size={14} /></a></div>
      </section>

      <section className="studio section-ivory" id="studio">
        <div className="studio-meta" data-reveal><span className="section-index">04 / YOUR SPACE</span><span>DESIGNED TO FEEL DIFFERENT</span></div>
        <div className="studio-layout">
          <div className="studio-image-wrap" data-reveal>
            <div className="studio-image" role="img" aria-label="Calm, sunlit modern interior with natural materials" />
            <div className="studio-image-border" />
            <span className="studio-image-tag">A SPACE TO EXHALE.</span>
            <div className="studio-roundel"><span>YOUR COMFORT</span><Sparkles size={19} /><span>COMES FIRST</span></div>
          </div>
          <div className="studio-copy" data-reveal>
            <span className="studio-overline">A MORE CONSIDERED EXPERIENCE</span>
            <h2>Designed for<br />a softer kind of<br /><em>dentistry.</em></h2>
            <p>From the first hello to the smallest detail, we want your visit to feel calm, thoughtful, and completely unhurried.</p>
            <a href="#appointment" className="text-cta">Step inside <MoveUpRight size={17} /></a>
            <div className="studio-signature"><span className="signature-script">With care, always.</span><span>THE LUMIÈRE TEAM</span></div>
          </div>
        </div>
      </section>

      <section className="dentist-section">
        <div className="dentist-image" role="img" aria-label="Portrait of a dental professional in a bright modern clinic" data-reveal />
        <div className="dentist-copy" data-reveal>
          <span className="section-index">05 / PEOPLE FIRST</span>
          <h2>Meet the person<br />behind <em>your care.</em></h2>
          <p>Good dentistry starts with listening. We take time to understand what matters to you, talk through your options, and make a plan together—at a pace that feels right.</p>
          <div className="dentist-credentials"><span>YOUR DENTIST</span><span>NAME & CREDENTIALS TO BE ADDED</span></div>
          <a className="text-cta" href="#appointment">Let’s have a conversation <ArrowRight size={17} /></a>
        </div>
        <span className="dentist-side-caption">TRUST IS BUILT ONE CONVERSATION AT A TIME.</span>
      </section>

      <section className="appointment dark-section" id="appointment">
        <div className="appointment-light" />
        <div className="appointment-art" aria-hidden="true"><div className="appointment-art-ring" /><div className="appointment-art-orb" /><div className="appointment-art-glint" /></div>
        <div className="appointment-content" data-reveal>
          <span className="section-index">06 / YOUR NEXT CHAPTER</span>
          <p className="appointment-kicker">THERE’S A FIRST STEP FOR EVERYTHING.</p>
          <h2>Your next chapter<br /><em>starts with a smile.</em></h2>
          <p className="appointment-copy-text">No pressure. No judgement. Just a conversation about what feels right for you.</p>
          <a href="mailto:hello@lumieredental.example?subject=I'd%20like%20to%20book%20a%20consultation" className="button button-gold">Book a consultation <ArrowUpRight size={17} /></a>
          <span className="appointment-note">A GOOD PLACE TO BEGIN.</span>
        </div>
        <div className="appointment-details" data-reveal>
          <div><span>01 / SAY HELLO</span><a href="mailto:hello@lumieredental.example">hello@lumieredental.example <ArrowUpRight size={13} /></a></div>
          <div><span>02 / VISIT US</span><p>Your neighbourhood.<br />Your new dental home.</p></div>
          <div><span>03 / WHEN</span><p>Monday — Saturday<br />By appointment</p></div>
          <p className="contact-placeholder">Replace the contact details with the clinic’s verified information before launch.</p>
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top"><span className="wordmark-symbol"><i /><i /><i /></span><span className="wordmark-text">lumière<span>THE ART OF YOUR SMILE</span></span></a>
        <p className="footer-note">A little more you. A lot more confident.</p>
        <a className="footer-top" href="#top">BACK TO TOP ↑</a>
        <div className="footer-bottom"><span>© 2026 LUMIÈRE DENTAL STUDIO</span><span>THOUGHTFUL CARE. DOWN TO THE DETAIL.</span><span>DESIGNED WITH INTENTION ✳</span></div>
      </footer>
    </main>
  );
}
