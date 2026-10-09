"use client";

import Image from "next/image";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity, ArrowRight, ArrowUpRight, Bell, CalendarDays,
  Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3,
  ClipboardList, FileText, HeartPulse, Home as HomeIcon, Menu, Search, Settings,
  ShieldCheck, Sparkles, Stethoscope, UserRound, WalletCards, X, Plus,
  SlidersHorizontal, LogOut, CheckCircle2, MoreHorizontal,
} from "lucide-react";

type View = "Overview" | "Appointments" | "Treatments" | "Tooth health" | "My records" | "Profile";
type Treatment = { id: string; name: string; category: string; price: string; duration: string; description: string; detail: string; tone: string; };
type Booking = { id: number; treatment: string; date: string; time: string; doctor: string; status: string; };

const NAV: { label: View; icon: LucideIcon }[] = [
  { label: "Overview", icon: HomeIcon },
  { label: "Appointments", icon: CalendarDays },
  { label: "Treatments", icon: Sparkles },
  { label: "Tooth health", icon: HeartPulse },
  { label: "My records", icon: ClipboardList },
  { label: "Profile", icon: UserRound },
];

const TREATMENTS: Treatment[] = [
  { id: "cleaning", name: "Teeth cleaning", category: "General", price: "$80", duration: "30–45 min", description: "A fresh start for your smile.", detail: "A professional cleaning helps remove plaque and tartar from places your daily routine may miss.", tone: "mint" },
  { id: "whitening", name: "Teeth whitening", category: "Cosmetic", price: "$150", duration: "45–60 min", description: "Bring back your natural brightness.", detail: "Talk through suitable whitening options with your dental professional before choosing a treatment.", tone: "peach" },
  { id: "implants", name: "Dental implants", category: "Restorative", price: "$1,200", duration: "Consultation first", description: "A considered solution for missing teeth.", detail: "Begin with a consultation to discuss your oral health, available options, timing and costs.", tone: "lavender" },
  { id: "orthodontics", name: "Orthodontics", category: "Cosmetic", price: "$2,500", duration: "Plan dependent", description: "A straighter smile, planned around you.", detail: "Explore alignment options and get a care plan suited to your individual needs.", tone: "aqua" },
  { id: "consultation", name: "New patient visit", category: "General", price: "From $0", duration: "20–30 min", description: "Start with a conversation.", detail: "Discuss your goals, questions, history and next steps with the care team.", tone: "butter" },
  { id: "checkup", name: "Dental check-up", category: "General", price: "$60", duration: "20–30 min", description: "Keep an eye on your oral health.", detail: "A regular check-up helps your clinician review your teeth and gums and discuss any concerns.", tone: "mint" },
];

const RECORDS = [
  { title: "Dental health summary", type: "Health report", date: "Oct 02, 2026", size: "PDF · 1.2 MB" },
  { title: "Cleaning visit notes", type: "Visit summary", date: "Aug 14, 2026", size: "PDF · 860 KB" },
  { title: "Treatment estimate", type: "Estimate", date: "Aug 14, 2026", size: "PDF · 420 KB" },
];

const slots = ["09:00 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

function ToothArt({ variant = "main" }: { variant?: "main" | "small" | "implant" | "clean" | "arch"; shield?: boolean }) {
  const src = variant === "arch"
    ? "/images/dental-arch.webp"
    : variant === "implant"
      ? "/images/dental-implant.webp"
      : variant === "clean"
        ? "/images/teeth-cleaning.webp"
        : "/images/hero-tooth.webp";
  const alt = variant === "arch"
    ? "Illustration of a full dental arch with polished teeth and healthy gums"
    : "Glossy porcelain tooth artwork with soft studio lighting";
  return (
    <Image
      src={src}
      alt={alt}
      width={variant === "arch" ? 640 : 640}
      height={variant === "arch" ? 460 : 640}
      className={variant === "arch" ? "tooth-arch" : `tooth-art tooth-art-${variant}`}
      priority={variant === "main"}
    />
  );
}

function BrandMark() {
  return <div className="brand-mark"><span className="brand-tooth"><svg viewBox="0 0 28 30" aria-hidden="true"><path d="M6 5C2 1 0 6 2 13l4 12c2 5 5 2 6-4l2-5 2 5c2 7 5 8 7 0l3-11c2-7-3-11-7-6-3 3-7 3-13 1Z" fill="currentColor"/></svg></span></div>;
}

function StatCard({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof Activity; tone: string }) {
  return <div className={`stat-card stat-${tone}`}><div className="stat-icon"><Icon size={17} /></div><span className="stat-label">{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

function HealthRing({ score = 85 }: { score?: number }) {
  return <div className="health-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><div><strong>{score}%</strong><span>HEALTH SCORE</span></div></div>;
}

function TreatmentArt({ tone }: { tone: string }) {
  const art: Record<string, string> = {
    mint: "/images/teeth-cleaning.webp",
    peach: "/images/teeth-whitening.webp",
    lavender: "/images/dental-implant.webp",
    aqua: "/images/clear-aligners.webp",
    butter: "/images/hero-tooth.webp",
  };
  return (
    <div className={`treatment-art treatment-art-${tone}`}>
      <Image src={art[tone] ?? "/images/hero-tooth.webp"} alt="" fill sizes="(max-width: 700px) 50vw, 28vw" className="treatment-art-image" />
      <span className="art-sparkle sparkle-one">✦</span><span className="art-sparkle sparkle-two">✧</span>
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("Overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedTime, setSelectedTime] = useState("10:30 AM");
  const [monthOffset, setMonthOffset] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState("Dental check-up");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeHealthTab, setActiveHealthTab] = useState("Overview");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [remindersOn, setRemindersOn] = useState(true);
  const [toast, setToast] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);
  const [patientName, setPatientName] = useState("Alex Johnson");
  const [patientEmail, setPatientEmail] = useState("alex.johnson@email.com");

  const allTreatments = TREATMENTS;
  const filteredTreatments = useMemo(() => allTreatments.filter((t) => {
    const matchesQuery = `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || t.category === category;
    return matchesQuery && matchesCategory;
  }), [allTreatments, query, category]);

  const monthDate = new Date(2026, 9 + monthOffset, 1);
  const monthTitle = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const monthDays = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const firstWeekday = monthDate.getDay();
  const dateCells = [...Array(firstWeekday).fill(0), ...Array.from({ length: monthDays }, (_, i) => i + 1)];

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const navigate = (view: View) => {
    setActiveView(view);
    setMobileNavOpen(false);
    setNotificationsOpen(false);
  };

  const startBooking = (treatment = "Dental check-up") => {
    setSelectedTreatment(treatment);
    setBookingOpen(true);
    setMobileNavOpen(false);
  };

  const confirmBooking = () => {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), selectedDate);
    const dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setBookings((current) => [...current, { id: Date.now(), treatment: selectedTreatment, date: dateLabel, time: selectedTime, doctor: "Dr. Sarah Johnson", status: "Confirmed" }]);
    setBookingOpen(false);
    setActiveView("Appointments");
    notify("Your appointment request has been saved.");
  };

  const pageTitle: Record<View, string> = {
    "Overview": "Overview",
    "Appointments": "Appointments",
    "Treatments": "Explore treatments",
    "Tooth health": "Your tooth health",
    "My records": "My records",
    "Profile": "My profile",
  };
  const pageSubtitle: Record<View, string> = {
    "Overview": "Here’s what’s happening with your smile today.",
    "Appointments": "Manage visits and find a time that works for you.",
    "Treatments": "Thoughtful care, tailored to what you need.",
    "Tooth health": "A little progress goes a long way.",
    "My records": "Your dental information, all in one place.",
    "Profile": "Your details and preferences.",
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <a className="brand-lockup" href="#" onClick={(e) => { e.preventDefault(); navigate("Overview"); }}>
            <BrandMark />
            <span className="brand-name">denta<span>CARE, MADE PERSONAL</span></span>
          </a>
          <button className="sidebar-close" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X size={19} /></button>
        </div>
        <div className="sidebar-clinic"><span className="clinic-avatar"><Stethoscope size={18} /></span><span><strong>Lumière Dental</strong><small>Patient portal</small></span><ChevronDown size={15} /></div>
        <div className="sidebar-section-label">YOUR SPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV.map((item) => {
            const Icon = item.icon;
            return <button key={item.label} className={`sidebar-link ${activeView === item.label ? "active" : ""}`} onClick={() => navigate(item.label)}>
              <Icon size={18} strokeWidth={activeView === item.label ? 2.3 : 1.8} /><span>{item.label}</span>{item.label === "Appointments" && bookings.length > 0 && <i className="nav-count">{bookings.length}</i>}
            </button>;
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Need a little help?</strong><p>Our care team is only a message away.</p><button onClick={() => notify("The care team contact form will be connected before launch.")}>Contact support <ArrowUpRight size={13} /></button></div>
        <button className="sidebar-settings" onClick={() => navigate("Profile")}><Settings size={17} /> Settings <ArrowUpRight size={14} /></button>
        <div className="sidebar-user"><div className="user-avatar">AJ</div><span><strong>{patientName}</strong><small>Member since 2024</small></span><MoreHorizontal size={18} /></div>
      </aside>

      {mobileNavOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setMobileNavOpen(false)} />}

      <div className="app-main">
        <header className="topbar">
          <div className="mobile-brand"><button className="topbar-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"><Menu size={21} /></button><BrandMark /><span>denta<span>CARE</span></span></div>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{pageTitle[activeView]}</strong></div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && navigate("Treatments")} placeholder="Search treatments, records..." /><kbd>⌘ K</kbd></label>
            <div className="notification-wrap">
              <button className={`icon-button notification-button ${notificationsOpen ? "is-active" : ""}`} onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button>
              {notificationsOpen && <div className="notification-popover"><div className="popover-head"><strong>Notifications</strong><span>2 new</span></div><div className="notification-item"><span className="notification-symbol"><CalendarDays size={15} /></span><div><strong>Appointment reminder</strong><p>Your upcoming visit is on Oct 12 at 10:30 AM.</p><small>Just now</small></div></div><div className="notification-item"><span className="notification-symbol peach"><HeartPulse size={15} /></span><div><strong>Keep your streak going</strong><p>It’s been a little while since your last check-up.</p><small>Yesterday</small></div></div><button className="popover-action" onClick={() => { setNotificationsOpen(false); navigate("Appointments"); }}>View appointments <ArrowRight size={14} /></button></div>}
            </div>
            <button className="topbar-profile" onClick={() => navigate("Profile")} aria-label="Open profile"><span className="profile-photo">AJ</span><span><strong>{patientName.split(" ")[0]}</strong><small>Patient</small></span><ChevronDown size={14} /></button>
          </div>
        </header>

        <main className="page-content">
          <div className="page-heading">
            <div><div className="page-eyebrow"><span className="eyebrow-dot" /> YOUR SMILE, YOUR WAY</div><h1>{activeView === "Overview" ? <>Good morning, <em>{patientName.split(" ")[0]}.</em> <span className="wave">✦</span></> : pageTitle[activeView]}</h1><p>{pageSubtitle[activeView]}</p></div>
            <div className="heading-actions"><span className="last-visit"><span className="status-dot" /> Patient portal <span className="heading-separator">/</span> <span>Oct 2026</span></span>{activeView === "Appointments" && <button className="primary-button compact" onClick={() => startBooking()}><Plus size={16} /> Book visit</button>}</div>
          </div>

          {activeView === "Overview" && <div className="dashboard-grid">
            <div className="dashboard-main-column">
              <section className="welcome-banner">
                <div className="welcome-copy"><span className="banner-kicker"><Sparkles size={13} /> YOUR NEXT CHAPTER</span><h2>A healthier smile<br />looks good on you.</h2><p>Your next visit is one small step toward feeling your best.</p><button className="banner-button" onClick={() => navigate("Appointments")}>View appointment <ArrowUpRight size={15} /></button><div className="banner-pagination"><span className="active" /><span /><span /></div></div>
                <div className="banner-visual"><div className="banner-orbit orbit-one" /><div className="banner-orbit orbit-two" /><div className="banner-glow" /><ToothArt variant="main" shield /><span className="banner-float float-top"><ShieldCheck size={15} /> Care first</span><span className="banner-float float-bottom"><Sparkles size={13} /> All smiles</span></div>
                <span className="banner-index">D / 01</span>
              </section>

              <section className="quick-actions-section">
                <div className="section-heading"><div><span className="small-eyebrow">ONE-TAP ACCESS</span><h2>Quick actions</h2></div><button className="plain-link" onClick={() => navigate("Appointments")}>See all <ArrowRight size={14} /></button></div>
                <div className="quick-actions">
                  <button onClick={() => startBooking("Dental check-up")} className="quick-action"><span className="quick-action-icon teal"><CalendarDays size={19} /></span><strong>Book a visit</strong><small>Choose your time</small><ArrowUpRight className="quick-arrow" size={15} /></button>
                  <button onClick={() => navigate("Treatments")} className="quick-action"><span className="quick-action-icon lilac"><Sparkles size={19} /></span><strong>Find treatment</strong><small>Explore your options</small><ArrowUpRight className="quick-arrow" size={15} /></button>
                  <button onClick={() => navigate("Tooth health")} className="quick-action"><span className="quick-action-icon coral"><HeartPulse size={19} /></span><strong>Tooth health</strong><small>See your progress</small><ArrowUpRight className="quick-arrow" size={15} /></button>
                  <button onClick={() => navigate("My records")} className="quick-action"><span className="quick-action-icon blue"><FileText size={19} /></span><strong>My records</strong><small>Reports and notes</small><ArrowUpRight className="quick-arrow" size={15} /></button>
                </div>
              </section>

              <section className="health-overview-card">
                <div className="section-heading"><div><span className="small-eyebrow">YOUR ORAL WELLNESS</span><h2>Dental health score</h2></div><button className="more-button" onClick={() => navigate("Tooth health")} aria-label="View dental health"><ArrowUpRight size={17} /></button></div>
                <div className="health-card-body"><div className="health-score-visual"><HealthRing /><span className="score-sparkle">✦</span></div><div className="health-score-copy"><div className="score-title-row"><h3>Looking good, {patientName.split(" ")[0]} <span>✦</span></h3><span className="score-pill">Very good</span></div><p>This is a sample wellness score from your demo profile. Your dental professional can add verified findings after an assessment.</p><div className="score-progress"><span style={{ width: "85%" }} /></div><div className="score-progress-meta"><span>Wellness overview</span><strong>85 / 100</strong></div><button className="inline-link" onClick={() => navigate("Tooth health")}>View health report <ArrowRight size={14} /></button></div></div>
                <div className="health-card-stats"><div><span className="health-stat-icon mint"><ShieldCheck size={15} /></span><span><small>Gum health</small><strong>Good</strong></span></div><div><span className="health-stat-icon lavender"><Sparkles size={15} /></span><span><small>Last check-up</small><strong>Aug 14, 2026</strong></span></div><div><span className="health-stat-icon peach"><Activity size={15} /></span><span><small>Next step</small><strong>Routine visit</strong></span></div></div>
              </section>

              <section className="care-essentials">
                <div className="section-heading"><div><span className="small-eyebrow">LITTLE HABITS, BIG DIFFERENCE</span><h2>Everyday essentials</h2></div><button className="plain-link" onClick={() => navigate("Tooth health")}>Care tips <ArrowRight size={14} /></button></div>
                <div className="care-essentials-grid">
                  <button className="care-essential-card care-brush" onClick={() => navigate("Tooth health")}>
                    <div><span className="care-label">DAILY ROUTINE</span><strong>Brush gently.<br />Smile confidently.</strong><small>Explore oral care basics <ArrowRight size={12} /></small></div>
                    <Image src="/images/toothbrush.webp" alt="" width={460} height={360} />
                  </button>
                  <button className="care-essential-card care-floss" onClick={() => navigate("Tooth health")}>
                    <div><span className="care-label">DON’T SKIP THE DETAILS</span><strong>A little floss<br />goes a long way.</strong><small>Explore oral care basics <ArrowRight size={12} /></small></div>
                    <Image src="/images/dental-floss.webp" alt="" width={460} height={360} />
                  </button>
                </div>
              </section>
            </div>

            <aside className="dashboard-side-column">
              <section className="next-appointment-card">
                <div className="side-card-title"><span>YOUR NEXT APPOINTMENT</span><button onClick={() => navigate("Appointments")} aria-label="View all appointments"><ArrowUpRight size={16} /></button></div>
                <div className="appointment-date-row"><span className="date-tile"><small>OCT</small><strong>12</strong></span><span><strong>Monday, October 12</strong><small>10:30 AM · 30 minutes</small></span></div>
                <div className="appointment-doctor"><div className="doctor-avatar">SJ</div><span><strong>Dr. Sarah Johnson</strong><small>General dentistry</small></span><span className="confirmed-badge"><Check size={12} /> Confirmed</span></div>
                <div className="next-appointment-actions"><button onClick={() => navigate("Appointments")}>Manage visit</button><button onClick={() => notify("A calendar reminder has been added to this demo.")} aria-label="Add reminder"><CalendarDays size={16} /></button></div>
              </section>

              <section className="care-team-card">
                <div className="section-heading compact-heading"><div><span className="small-eyebrow">HERE FOR YOU</span><h2>Your care team</h2></div><button className="more-button" onClick={() => notify("Clinic contact details can be configured in Profile.")} aria-label="Care team details"><ArrowUpRight size={16} /></button></div>
                <div className="care-doctor-row"><div className="doctor-portrait">SJ</div><div><strong>Dr. Sarah Johnson</strong><small>General dentist</small><span className="doctor-rating">✦ <b>4.9</b> <i>(sample rating)</i></span></div></div>
                <p className="care-team-note">Your dental care, with a little more care.</p><button className="text-button" onClick={() => notify("Clinic messaging will be connected to the practice contact system.")}>Message the clinic <ArrowRight size={14} /></button>
              </section>

              <section className="recommended-card">
                <div className="recommend-top"><span className="small-eyebrow">A GENTLE NUDGE</span><Sparkles size={17} /></div><div className="recommend-art"><Image src="/images/toothbrush.webp" alt="" width={460} height={360} className="recommend-care-image" /></div><h3>Keep your smile<br /><em>feeling fresh.</em></h3><p>A routine check-up is a good way to keep in touch with your oral health.</p><button className="outline-button" onClick={() => startBooking("Dental check-up")}>Find a time <ArrowRight size={14} /></button>
              </section>
            </aside>
          </div>}

          {activeView === "Treatments" && <section className="view-panel treatments-view">
            <div className="treatments-toolbar"><label className="filter-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search treatments..." /></label><button className={`filter-button ${filterOpen ? "selected" : ""}`} onClick={() => setFilterOpen(!filterOpen)}><SlidersHorizontal size={15} /> Filters <ChevronDown size={14} /></button></div>
            <div className="category-chips">{["All", "General", "Cosmetic", "Restorative"].map((c) => <button className={category === c ? "selected" : ""} key={c} onClick={() => setCategory(c)}>{c}</button>)}</div>
            {filterOpen && <div className="filter-panel"><span>Browse by category</span><div>{["All", "General", "Cosmetic", "Restorative"].map((c) => <button className={category === c ? "selected" : ""} key={c} onClick={() => setCategory(c)}>{c}</button>)}</div><small>Prices shown are illustrative and must be confirmed with the clinic.</small></div>}
            <div className="treatment-results-heading"><span>{filteredTreatments.length} treatments</span><span>DISCOVER YOUR OPTIONS</span></div>
            <div className="treatments-catalog">{filteredTreatments.map((t) => <article className="catalog-card" key={t.id}><TreatmentArt tone={t.tone} /><div className="catalog-card-body"><div className="catalog-tag-row"><span>{t.category}</span><span><Clock3 size={12} /> {t.duration}</span></div><h3>{t.name}</h3><p>{t.description}</p><div className="catalog-price-row"><strong>{t.price}</strong><button onClick={() => startBooking(t.name)}>Learn & book <ArrowRight size={14} /></button></div></div></article>)}</div>
            {filteredTreatments.length === 0 && <div className="empty-state"><Search size={24} /><strong>No treatments found</strong><p>Try a different search or category.</p><button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
            <p className="disclaimer-note"><ShieldCheck size={15} /> All treatment options and prices are samples. Your dentist will advise what is appropriate for your individual needs.</p>
          </section>}

          {activeView === "Appointments" && <section className="appointments-view">
            <div className="appointment-layout">
              <div className="booking-panel">
                <div className="panel-title-row"><div><span className="small-eyebrow">FIND YOUR TIME</span><h2>Book an appointment</h2><p>Pick a date and time that works for you.</p></div><span className="panel-icon"><CalendarDays size={20} /></span></div>
                <div className="calendar-header"><button onClick={() => { setMonthOffset(monthOffset - 1); setSelectedDate(1); }} aria-label="Previous month"><ChevronLeft size={18} /></button><strong>{monthTitle}</strong><button onClick={() => { setMonthOffset(monthOffset + 1); setSelectedDate(1); }} aria-label="Next month"><ChevronRight size={18} /></button></div>
                <div className="calendar-grid calendar-weekdays">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <span key={d}>{d}</span>)}</div>
                <div className="calendar-grid">{dateCells.map((d, i) => d === 0 ? <span className="calendar-empty" key={`blank-${i}`} /> : <button key={d} className={`calendar-day ${selectedDate === d ? "selected" : ""} ${d === 12 && monthOffset === 0 ? "has-visit" : ""}`} onClick={() => setSelectedDate(d)}>{d}</button>)}</div>
                <div className="available-slots"><div className="slot-heading"><h3>Available times</h3><span>{monthDate.toLocaleDateString("en-US", { month: "short" })} {selectedDate}</span></div><div className="slot-grid">{slots.map((slot) => <button key={slot} className={selectedTime === slot ? "selected" : ""} onClick={() => setSelectedTime(slot)}>{slot}</button>)}</div></div>
                <div className="selected-appointment"><span className="selected-check"><Check size={16} /></span><div><strong>{selectedTreatment}</strong><small>{monthDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {selectedTime}</small></div><button onClick={() => startBooking(selectedTreatment)}>Change</button></div>
                <button className="primary-button confirm-booking" onClick={confirmBooking}>Confirm appointment <ArrowRight size={16} /></button>
                <p className="booking-disclaimer">Demo booking only. No real appointment is created or sent to a clinic.</p>
              </div>
              <div className="appointment-sidebar">
                <section className="appointment-summary-card"><span className="small-eyebrow">YOUR CARE TEAM</span><div className="summary-doctor"><div className="doctor-portrait large">SJ</div><div><h3>Dr. Sarah Johnson</h3><p>General dentistry</p><span className="doctor-rating">✦ <b>4.9</b> <i>sample rating</i></span></div></div><div className="summary-info"><span><Clock3 size={15} /> 30–45 min typical visit</span><span><ShieldCheck size={15} /> Friendly, personal care</span></div><button className="outline-button full-width" onClick={() => notify("Clinic details can be added by the practice administrator.")}>Meet the care team <ArrowRight size={14} /></button></section>
                <section className="upcoming-card"><div className="section-heading compact-heading"><div><span className="small-eyebrow">ON YOUR CALENDAR</span><h2>Upcoming visits</h2></div><span className="upcoming-count">{1 + bookings.length}</span></div><div className="upcoming-item"><span className="mini-date"><small>OCT</small><strong>12</strong></span><span><strong>Routine check-up</strong><small>Dr. Sarah Johnson · 10:30 AM</small></span><span className="upcoming-dot" /></div>{bookings.map((b) => <div className="upcoming-item" key={b.id}><span className="mini-date peach-date"><small>{b.date.split(" ")[0].toUpperCase()}</small><strong>{b.date.match(/\d+/)?.[0] ?? "—"}</strong></span><span><strong>{b.treatment}</strong><small>{b.date} · {b.time}</small></span><span className="upcoming-dot new" /></div>)}</section>
              </div>
            </div>
          </section>}

          {activeView === "Tooth health" && <section className="health-view">
            <div className="health-view-top"><div className="health-view-hero"><span className="small-eyebrow">YOUR WELLNESS, AT A GLANCE</span><h2>Your smile is<br /><em>worth caring for.</em></h2><p>This screen is an example dashboard. Your actual dental status should be entered by your dental professional.</p><div className="health-hero-score"><HealthRing /><span><strong>Good progress</strong><small>Illustrative wellness score</small><b><Sparkles size={13} /> 85 points</b></span></div></div><div className="health-arch-stage"><div className="arch-aura" /><ToothArt variant="arch" /><span className="arch-badge"><CheckCircle2 size={14} /> Wellness overview</span></div></div>
            <div className="health-tabs">{["Overview", "History", "Analysis"].map((t) => <button key={t} className={activeHealthTab === t ? "selected" : ""} onClick={() => setActiveHealthTab(t)}>{t}</button>)}</div>
            {activeHealthTab === "Overview" && <div className="health-detail-grid"><StatCard label="Gum health" value="Good" note="Sample status · review with dentist" icon={ShieldCheck} tone="green" /><StatCard label="Plaque level" value="Low" note="Illustrative demonstration" icon={Sparkles} tone="purple" /><StatCard label="Cavities" value="02" note="Sample data — not a diagnosis" icon={Activity} tone="coral" /><StatCard label="Last visit" value="Aug 14" note="Routine check-up" icon={CalendarDays} tone="blue" /></div>}
            {activeHealthTab === "History" && <div className="health-history"><div className="timeline-item"><span /><div><small>AUG 14, 2026</small><strong>Routine visit</strong><p>Sample visit entry. Actual examination notes should be supplied by your dental team.</p></div></div><div className="timeline-item"><span /><div><small>APR 03, 2026</small><strong>Cleaning appointment</strong><p>Sample record entry for the prototype interface.</p></div></div><div className="timeline-item"><span /><div><small>JAN 12, 2026</small><strong>Patient profile created</strong><p>Example milestone in the demo profile.</p></div></div></div>}
            {activeHealthTab === "Analysis" && <div className="analysis-panel"><div className="analysis-copy"><span className="small-eyebrow">DEMO ANALYSIS</span><h3>Simple habits add up.</h3><p>Use this space for dentist-approved guidance, tracked habits, and progress over time. The values here are illustrative only.</p><button className="outline-button" onClick={() => notify("Personalised recommendations must be supplied by your dental professional.")}>View recommendations <ArrowRight size={14} /></button></div><div className="habit-bars"><div><span>Brushing routine</span><strong>90%</strong><i><b style={{ width: "90%" }} /></i></div><div><span>Flossing routine</span><strong>65%</strong><i><b style={{ width: "65%" }} /></i></div><div><span>Routine visits</span><strong>80%</strong><i><b style={{ width: "80%" }} /></i></div></div></div>}
            <p className="disclaimer-note"><ShieldCheck size={15} /> This page is not a diagnosis or medical record. Only the clinic can verify findings and treatment recommendations.</p>
          </section>}

          {activeView === "My records" && <section className="view-panel records-view">
            <div className="records-banner"><div className="records-banner-icon"><FileText size={25} /></div><div><h2>Your dental story, in one place.</h2><p>Access visit summaries, reports, and estimates from your care journey.</p></div><span className="records-count">03 <small>DEMO FILES</small></span></div>
            <div className="records-toolbar"><div><h2>Recent documents</h2><p>Sample records for preview only.</p></div><button className="outline-button" onClick={() => notify("Secure uploads will be connected to the practice record system.")}><Plus size={15} /> Add document</button></div>
            <div className="records-table"><div className="records-table-head"><span>DOCUMENT</span><span>TYPE</span><span>DATE ADDED</span><span>FILE</span><span /></div>{RECORDS.map((r) => <div className="record-row" key={r.title}><span className="record-name"><span className="record-icon"><FileText size={18} /></span><span><strong>{r.title}</strong><small>{r.size}</small></span></span><span className="record-type">{r.type}</span><span className="record-date">{r.date}</span><span className="record-format">PDF</span><button className="record-action" onClick={() => notify(`“${r.title}” is sample content. Connect secure records before real use.`)} aria-label={`View ${r.title}`}><ArrowUpRight size={16} /></button></div>)}</div>
            <div className="privacy-note"><ShieldCheck size={17} /><span><strong>Your privacy matters.</strong><small>In production, documents should be stored securely and only accessible to the authenticated patient and authorised clinic staff.</small></span></div>
          </section>}

          {activeView === "Profile" && <section className="profile-view">
            <div className="profile-cover"><div className="profile-cover-glow" /><span className="small-eyebrow">YOUR PERSONAL SPACE</span><h2>Every smile has<br /><em>a story.</em></h2><p>Keep your details current so your care feels personal.</p><div className="profile-cover-tooth"><ToothArt variant="small" /></div></div>
            <div className="profile-content-grid">
              <section className="profile-card profile-person-card"><div className="profile-card-header"><div><span className="small-eyebrow">YOUR DETAILS</span><h2>Personal information</h2></div><button className="edit-button" onClick={() => setProfileEdit(!profileEdit)}>{profileEdit ? <X size={14} /> : <Settings size={14} />}{profileEdit ? "Cancel" : "Edit details"}</button></div><div className="profile-person"><div className="profile-photo large-photo">AJ</div><div><h3>{patientName}</h3><p>Patient ID · DC-2024-0128</p><span className="member-badge"><ShieldCheck size={13} /> Verified demo profile</span></div></div>{profileEdit ? <form className="profile-edit-form" onSubmit={(e) => { e.preventDefault(); setProfileEdit(false); notify("Your demo profile changes have been saved."); }}><label>Full name<input value={patientName} onChange={(e) => setPatientName(e.target.value)} required /></label><label>Email address<input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} required /></label><button className="primary-button" type="submit"><Check size={15} /> Save changes</button></form> : <div className="profile-fields"><div><span><UserRound size={15} /> Full name</span><strong>{patientName}</strong></div><div><span><FileText size={15} /> Email address</span><strong>{patientEmail}</strong></div><div><span><CalendarDays size={15} /> Date of birth</span><strong>Not added</strong></div><div><span><WalletCards size={15} /> Insurance</span><strong>Not added</strong></div></div>}</section>
              <section className="profile-card preferences-card"><span className="small-eyebrow">YOUR PREFERENCES</span><h2>Make it yours.</h2><div className="preference-row"><span className="preference-icon mint"><Bell size={17} /></span><span><strong>Appointment reminders</strong><small>Get a gentle nudge before your visit.</small></span><button className={`toggle-switch ${remindersOn ? "on" : ""}`} onClick={() => { setRemindersOn(!remindersOn); notify(remindersOn ? "Reminders turned off in this demo." : "Reminders turned on in this demo."); }} aria-label="Toggle appointment reminders"><i /></button></div><div className="preference-row"><span className="preference-icon lavender"><FileText size={17} /></span><span><strong>Digital records</strong><small>Keep your documents in one place.</small></span><span className="pref-status">ENABLED</span></div><button className="profile-link-row" onClick={() => navigate("My records")}><span><ClipboardList size={17} /> Medical records</span><ChevronRight size={16} /></button><button className="profile-link-row" onClick={() => notify("Insurance details can be added when the clinic connects its patient system.")}><span><WalletCards size={17} /> Insurance details</span><ChevronRight size={16} /></button><button className="profile-link-row" onClick={() => notify("Payment methods are not connected in this demo.")}><span><WalletCards size={17} /> Payment methods</span><ChevronRight size={16} /></button><button className="profile-link-row" onClick={() => notify("Support will be linked to the clinic contact channel.")}><span><CircleHelp size={17} /> Help & support</span><ChevronRight size={16} /></button></section>
            </div>
            <button className="signout-button" onClick={() => notify("Authentication is not connected in this demo.")}><LogOut size={16} /> Sign out <span>Sign-in will be enabled when authentication is configured.</span></button>
          </section>}
        </main>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        {([{ label: "Overview" as View, icon: HomeIcon }, { label: "Appointments" as View, icon: CalendarDays }, { label: "Treatments" as View, icon: Sparkles }, { label: "Tooth health" as View, icon: HeartPulse }, { label: "Profile" as View, icon: UserRound }]).map((item) => { const Icon = item.icon; return <button key={item.label} className={activeView === item.label ? "active" : ""} onClick={() => navigate(item.label)}><Icon size={19} /><span>{item.label === "Tooth health" ? "Health" : item.label === "Appointments" ? "Visits" : item.label}</span></button>; })}
      </nav>

      {bookingOpen && <div className="modal-scrim" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setBookingOpen(false); }}><section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title"><div className="modal-top"><span className="modal-icon"><CalendarDays size={20} /></span><button className="modal-close" onClick={() => setBookingOpen(false)} aria-label="Close booking dialog"><X size={19} /></button></div><span className="small-eyebrow">LET’S FIND A TIME</span><h2 id="booking-modal-title">Book your visit.</h2><p>Choose a treatment and confirm your preferred time. This is a local demo; no real booking is submitted.</p><label className="modal-label">Treatment<select value={selectedTreatment} onChange={(e) => setSelectedTreatment(e.target.value)}>{TREATMENTS.map((t) => <option key={t.id} value={t.name}>{t.name} · {t.price}</option>)}</select></label><div className="modal-summary"><span><CalendarDays size={16} /><span><small>DATE</small><strong>{monthDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong></span></span><span><Clock3 size={16} /><span><small>TIME</small><strong>{selectedTime}</strong></span></span></div><div className="modal-quick-times">{["09:00 AM", "10:30 AM", "02:00 PM"].map((time) => <button key={time} className={selectedTime === time ? "selected" : ""} onClick={() => setSelectedTime(time)}>{time}</button>)}</div><button className="primary-button modal-confirm" onClick={confirmBooking}>Confirm appointment <ArrowRight size={16} /></button><button className="modal-back" onClick={() => { setBookingOpen(false); navigate("Appointments"); }}>Choose another date <ArrowUpRight size={14} /></button></section></div>}

      {toast && <div role="status" className="toast-message"><CheckCircle2 size={17} /><span>{toast}</span><button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={15} /></button></div>}
    </div>
  );
}
