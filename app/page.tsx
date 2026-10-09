"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ToothScene = dynamic(() => import("@/components/ToothScene"), {
  ssr: false,
  loading: () => <div className="scene-loading"><span /></div>,
});

const treatments = [
  { number: "01", title: "Smile design", description: "A smile that feels unmistakably like you.", tag: "COSMETIC" },
  { number: "02", title: "Whitening", description: "A little more luminosity, beautifully done.", tag: "AESTHETICS" },
  { number: "03", title: "Restorative care", description: "Thoughtful care that puts you back at ease.", tag: "ESSENTIALS" },
];

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuOpen = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", {
        y: 28, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.2,
      });
      gsap.from(".hero-meta", { opacity: 0, y: 12, duration: 0.9, delay: 0.9 });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: 32, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });
      gsap.to(".hero-orbit", {
        rotate: 360, duration: 70, repeat: -1, ease: "none", transformOrigin: "50% 50%",
      });
      gsap.to(".floating-note", {
        y: -8, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    menuOpen.current = !menuOpen.current;
    if (menuRef.current) menuRef.current.dataset.open = String(menuOpen.current);
    document.body.style.overflow = menuOpen.current ? "hidden" : "";
  };

  const closeMenu = () => {
    menuOpen.current = false;
    if (menuRef.current) menuRef.current.dataset.open = "false";
    document.body.style.overflow = "";
  };

  return (
    <main ref={root}>
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Lumière Dental Studio home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span className="brand-name">lumière<span> DENTAL STUDIO</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#philosophy">Our approach</a>
          <a href="#treatments">Treatments</a>
          <a href="#studio">The studio</a>
        </nav>
        <a className="header-cta" href="#appointment">Book a visit <ArrowUpRight size={15} /></a>
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Open navigation"><Menu size={22} /></button>
      </header>

      <div className="mobile-menu" ref={menuRef} data-open="false">
        <button className="menu-close" onClick={closeMenu} aria-label="Close navigation"><X /></button>
        <a href="#philosophy" onClick={closeMenu}>Our approach</a>
        <a href="#treatments" onClick={closeMenu}>Treatments</a>
        <a href="#studio" onClick={closeMenu}>The studio</a>
        <a href="#appointment" onClick={closeMenu}>Book a visit ↗</a>
      </div>

      <section className="hero" id="top">
        <div className="hero-glow" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> DENTISTRY, REIMAGINED <span className="eyebrow-line" /></div>
          <h1>A little more<br /> <em>you.</em> A lot more<br /><span>confident.</span></h1>
          <p className="hero-description">Considered dentistry for the way you want to feel — naturally, confidently, completely yourself.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#appointment">Find your smile <ArrowRight size={16} /></a>
            <a className="text-link" href="#philosophy">Explore our approach <ArrowDown size={14} /></a>
          </div>
          <div className="hero-meta">
            <div className="avatar-stack" aria-label="Our care team"><span>J</span><span>A</span><span>M</span></div>
            <div><strong>Care that feels personal.</strong><span>Made around you, always.</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Interactive 3D tooth sculpture">
          <div className="visual-kicker"><span>FIG. 001</span><span>FORM / FUNCTION</span></div>
          <div className="visual-grid" />
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-orbit orbit-three" />
          <ToothScene />
          <div className="floating-note"><span className="note-icon"><Sparkles size={15} /></span><span><strong>Art meets science</strong><small>Precision in every detail</small></span></div>
          <div className="visual-caption"><span className="caption-rule" /> A more considered kind of care</div>
          <div className="visual-index">01 <span>/</span> 04</div>
        </div>
        <div className="hero-bottom-line"><span>GOOD THINGS START WITH A SMILE</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>

      <section className="trust-strip">
        <div><span className="trust-number">01</span><span>Gentle by nature</span></div>
        <div><span className="trust-number">02</span><span>Personal by design</span></div>
        <div><span className="trust-number">03</span><span>Precise in practice</span></div>
        <div className="trust-note">A better dental experience<br /><em>starts right here.</em></div>
      </section>

      <section className="philosophy section-pad" id="philosophy">
        <div className="section-side" data-reveal><span className="section-index">01 / OUR PHILOSOPHY</span><span className="vertical-line" /></div>
        <div className="philosophy-content" data-reveal>
          <p className="eyebrow">NOT JUST A DENTAL VISIT</p>
          <h2>It’s the way you<br /><em>feel when you leave.</em></h2>
          <div className="philosophy-bottom">
            <p>We believe great dentistry should feel different. Less clinical, more human. Less about fixing, more about helping you feel good in your own skin.</p>
            <a className="circle-link" href="#studio" aria-label="Discover our studio"><ArrowUpRight size={22} /></a>
          </div>
        </div>
        <div className="philosophy-art" data-reveal>
          <div className="art-halo" />
          <div className="art-ring ring-a" /><div className="art-ring ring-b" />
          <div className="art-orb"><div className="orb-highlight" /></div>
          <div className="art-label">A softer side<br />of dentistry <span>✳</span></div>
        </div>
      </section>

      <section className="manifesto">
        <p data-reveal>GOOD CARE ISN’T A LUXURY.</p>
        <h2 data-reveal>It should feel like<br /><em>being understood.</em></h2>
        <div className="manifesto-bottom" data-reveal><span>THOUGHTFUL PEOPLE. THOUGHTFUL CARE.</span><span>BUILT AROUND YOU ↗</span></div>
      </section>

      <section className="treatments section-pad" id="treatments">
        <div className="treatment-heading" data-reveal>
          <div><span className="section-index">02 / HOW WE HELP</span><h2>Small details.<br /><em>Big difference.</em></h2></div>
          <p>Every smile has its own story. We’re here to help you take care of yours.</p>
        </div>
        <div className="treatment-list">
          {treatments.map((item) => (
            <a href="#appointment" className="treatment-card" key={item.number} data-reveal>
              <span className="treatment-number">{item.number}</span>
              <div className="treatment-info"><span>{item.tag}</span><h3>{item.title}</h3><p>{item.description}</p></div>
              <span className="treatment-arrow"><ArrowUpRight size={21} /></span>
            </a>
          ))}
        </div>
        <div className="treatment-foot"><span>THE RIGHT CARE, AT YOUR PACE.</span><a href="#appointment">Talk to our team <ArrowRight size={14} /></a></div>
      </section>

      <section className="studio section-pad" id="studio">
        <div className="studio-visual" data-reveal>
          <div className="studio-image" role="img" aria-label="Sunlit, calm modern interior" />
          <div className="studio-stamp"><span>THE ART OF</span><strong>FEELING<br /><em>AT EASE</em></strong><span>✳ EST. WITH CARE</span></div>
          <span className="studio-image-caption">A space to exhale.</span>
        </div>
        <div className="studio-copy" data-reveal>
          <span className="section-index">03 / YOUR SPACE</span>
          <h2>Designed to<br />put you <em>at ease.</em></h2>
          <p>From the first hello to the final little detail, our studio is made to feel calm, thoughtful and completely unhurried.</p>
          <a className="button button-dark" href="#appointment">Meet your new dentist <ArrowRight size={16} /></a>
          <div className="studio-signoff"><span className="signature">With care, always.</span><span>THE LUMIÈRE TEAM</span></div>
        </div>
      </section>

      <section className="appointment section-pad" id="appointment">
        <div className="appointment-orb" />
        <div className="appointment-copy" data-reveal>
          <span className="section-index">04 / YOUR NEXT CHAPTER</span>
          <h2>Ready for a<br /><em>different feeling?</em></h2>
          <p>Start with a conversation. We’ll take it from there — together.</p>
          <a className="button button-primary" href="mailto:hello@lumieredental.example?subject=I'd%20like%20to%20book%20a%20visit">Let’s talk <ArrowUpRight size={16} /></a>
          <span className="appointment-small">NO PRESSURE. JUST A GOOD PLACE TO START.</span>
        </div>
        <div className="appointment-details" data-reveal>
          <div><span>VISIT US</span><p>Your neighbourhood.<br />Your new dental home.</p></div>
          <div><span>SAY HELLO</span><a href="mailto:hello@lumieredental.example">hello@lumieredental.example</a></div>
          <div><span>OPENING HOURS</span><p>Monday — Saturday<br />By appointment</p></div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><span className="brand-mark"><span /><span /><span /></span><span className="brand-name">lumière<span> DENTAL STUDIO</span></span></a>
        <p>Care that brings you back to yourself.</p>
        <a className="back-top" href="#top">BACK TO TOP ↑</a>
        <div className="footer-bottom"><span>© 2026 LUMIÈRE DENTAL STUDIO</span><span>MADE WITH CARE, DOWN TO THE DETAIL.</span><span>DESIGNED FOR YOUR SMILE ✳</span></div>
      </footer>
    </main>
  );
}