'use client';
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { DualTypingAnimation } from './DualTypingAnimation';

const ImageSlider3D = dynamic(() => import('./ImageSlider3D'), { ssr: false });
const LogoLoop = dynamic(() => import('./LogoLoop'), { ssr: false });
const ScrollVelocity = dynamic(() => import('./ScrollVelocity'), { ssr: false });
const Particles = dynamic(() => import('./ui/particles').then(m => ({ default: m.Particles })), { ssr: false });

export default function MobileLayout({ supabaseMedia = {} }) {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({ ...prev, [entry.target.dataset.section]: true }));
        }
      });
    }, { threshold: 0.08 });

    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const setRef = (key) => (el) => {
    sectionRefs.current[key] = el;
  };

  const fadeIn = (key, delay = 0) => ({
    opacity: visibleSections[key] ? 1 : 0,
    transform: visibleSections[key] ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const motionImages = supabaseMedia['motion ui']?.length > 0 ? supabaseMedia['motion ui'] : [
    '/stripcrime5112-qb1p-1500h.webp', '/guy_bike.png', '/eyeanimation515-mzn7-1100h.webp',
    '/pensubtleshadow115107-qc7-1900w.webp', '/awardspng590-5h66-1000w.webp',
  ];
  const graphicsImages = supabaseMedia['GRAPHICS WORK']?.length > 0 ? supabaseMedia['GRAPHICS WORK'] : [
    '/pensubtleshadow115107-qc7-1900w.webp', '/stripcrime5112-qb1p-1500h.webp',
    '/awardspng590-5h66-1000w.webp', '/eyeanimation515-mzn7-1100h.webp', '/guy_bike.png',
  ];
  const typographyImages = supabaseMedia['TYPOGRAPHY']?.length > 0 ? supabaseMedia['TYPOGRAPHY'] : [
    '/premiurepropage0001598-vlq-700h.webp', '/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp',
    '/awardspng590-5h66-1000w.webp', '/pensubtleshadow115107-qc7-1900w.webp', '/stripcrime5112-qb1p-1500h.webp',
  ];
  const hobbiesImages = supabaseMedia['hobbies']?.length > 0 ? supabaseMedia['hobbies'] : [
    '/eyeanimation515-mzn7-1100h.webp', '/guy_bike.png', '/stripcrime5112-qb1p-1500h.webp',
    '/pensubtleshadow115107-qc7-1900w.webp', '/awardspng590-5h66-1000w.webp',
  ];

  return (
    <div style={{ background: '#080808', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', minHeight: '100vh' }}>

      {/* ── GLOBAL MOBILE STYLES ── */}
      <style>{`
        @keyframes mob-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes mob-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes mob-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes mob-rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes mob-slide-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        .mob-hero-title {
          font-family: 'RozanovaHUM-Demo-SemiBold', serif;
          font-size: clamp(52px, 18vw, 100px);
          line-height: 1;
          letter-spacing: -2px;
          background: linear-gradient(135deg, #fff 0%, #c0c0c0 50%, #fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }
        .mob-section-title {
          font-family: 'RozanovaHUM-Demo-SemiBold', serif;
          font-size: clamp(32px, 9vw, 56px);
          letter-spacing: -1px;
          line-height: 1.1;
        }
        .mob-body-text {
          font-family: 'Inter', sans-serif;
          font-size: clamp(13px, 3.8vw, 17px);
          line-height: 1.75;
          color: rgba(255,255,255,0.72);
        }
        .mob-glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 24px 20px;
          backdrop-filter: blur(12px);
        }
        .mob-hireme-btn {
          display: inline-block;
          padding: 18px 52px;
          background: #fff;
          color: #000;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 3px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 32px rgba(255,255,255,0.2);
        }
        .mob-hireme-btn:hover { transform: scale(1.04); box-shadow: 0 12px 40px rgba(255,255,255,0.3); }
        .mob-social-btn {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; text-decoration: none;
          transition: all 0.3s ease;
        }
        .mob-social-btn:hover { transform: scale(1.15); }
        .mob-insta:hover { background: rgb(225,48,108); border-color: rgb(225,48,108); }
        .mob-github:hover { background: royalblue; border-color: royalblue; }
        .mob-gmail:hover { background: rgb(212,70,56); border-color: rgb(212,70,56); }
        .mob-timeline-dot {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #fff;
          flex-shrink: 0;
          margin-top: 5px;
          box-shadow: 0 0 12px rgba(255,255,255,0.5);
        }
        .mob-timeline-line {
          width: 2px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.1));
          flex-shrink: 0;
          margin: 6px 0;
          align-self: stretch;
        }
      `}</style>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <div style={{ position: 'relative', height: '100svh', minHeight: '600px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '80px' }}>
        {/* Background video */}
        <video
          src="/herogg.webm"
          autoPlay muted loop playsInline preload="auto"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(8,8,8,0.95) 100%)' }} />
        {/* Particles */}
        <Particles variant="default" particleStyle={{ count: 60, color: '#FFD700', size: 1.8, speed: 0.8, opacity: 0.7 }} interactive={false} />

        {/* "MY" top text */}
        <div style={{ position: 'absolute', top: '5vh', left: 0, right: 0, textAlign: 'center', zIndex: 2 }}>
          <span style={{ fontFamily: 'RozanovaHUM-Demo-Thin, serif', fontSize: 'clamp(14px, 4vw, 22px)', letterSpacing: '8px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
            MY
          </span>
        </div>

        {/* PORTFOLIO big text */}
        <div style={{ position: 'absolute', top: '8vh', left: 0, right: 0, textAlign: 'center', zIndex: 2 }}>
          <span className="mob-hero-title">PORTFOLIO</span>
        </div>

        {/* Name typing animation */}
        <div style={{ position: 'relative', zIndex: 3, width: '100%', textAlign: 'center', marginBottom: '16px' }}>
          <DualTypingAnimation
            wordPairs={[
              { top: "Gaurav....", bottom: "....Sharma" },
              { top: "Web...", bottom: "...Designer" },
              { top: "Graphic..", bottom: "...Designer" },
              { top: "Video..", bottom: "...Editor" }
            ]}
          />
        </div>

        {/* Subtitle */}
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(12px, 3.5vw, 16px)', color: 'rgba(255,255,255,0.65)', letterSpacing: '1px', margin: 0 }}>
            My Name is Gaurav Sharma &amp; I am a Freelance
          </p>
          <p style={{ fontFamily: 'RozanovaHUM-Demo-SemiBold, serif', fontSize: 'clamp(18px, 5vw, 28px)', color: '#fff', marginTop: '4px', letterSpacing: '-0.5px' }}>
            Graphic Designer.
          </p>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 3, animation: 'mob-float 2s ease-in-out infinite' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ABOUT ME SECTION
      ══════════════════════════════════════════ */}
      <div ref={setRef('about')} data-section="about" style={{ padding: '72px 24px 60px' }}>
        <div style={{ ...fadeIn('about', 0) }}>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>About</p>
          <h2 className="mob-section-title" style={{ marginBottom: '28px' }}>
            About <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>Me</span> :
          </h2>
        </div>
        <div className="mob-glass-card" style={{ ...fadeIn('about', 0.15) }}>
          <p className="mob-body-text" style={{ margin: 0 }}>
            Hello! I&apos;m a professional graphic and motion designer with strong expertise in visual storytelling and digital design. I work confidently with Adobe Photoshop, Illustrator, After Effects, and Premiere Pro to create compelling videos, polished photo edits, and engaging social media visuals.
            <br /><br />
            My core strength lies in turning ideas into eye-catching designs and motion content that connect with audiences. Beyond graphics and video editing, I also specialize in UI/UX design and can transform creative layouts into fully functional web pages that are not only beautiful but also practical.
            <br /><br />
            I constantly strive to push my creative boundaries and deliver outstanding results in every project I take on.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          WORK EXPERIENCE
      ══════════════════════════════════════════ */}
      <div ref={setRef('exp')} data-section="exp" style={{ padding: '0 24px 72px' }}>
        <div style={{ ...fadeIn('exp', 0) }}>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>Journey</p>
          <h2 className="mob-section-title" style={{ marginBottom: '40px' }}>
            Work <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>Experiences</span>
          </h2>
        </div>

        {/* Timeline Item 1 */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', ...fadeIn('exp', 0.1) }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="mob-timeline-dot" />
            <div className="mob-timeline-line" style={{ height: '100%' }} />
          </div>
          <div className="mob-glass-card" style={{ flex: 1, marginBottom: '20px' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', margin: '0 0 6px', textTransform: 'uppercase' }}>2020 – 2021</p>
            <h3 style={{ fontFamily: 'RozanovaHUM-Demo-SemiBold, serif', fontSize: '18px', margin: '0 0 10px', color: '#fff' }}>Foundation in Video Editing</h3>
            <p className="mob-body-text" style={{ margin: 0, fontSize: '13px' }}>
              Began my creative journey as a beginner video editor, producing short-form videos while learning through online courses and platforms like YouTube. Developed a strong understanding of storytelling, pacing, transitions, and visual rhythm.
            </p>
          </div>
        </div>

        {/* Timeline Item 2 */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', ...fadeIn('exp', 0.2) }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="mob-timeline-dot" />
            <div className="mob-timeline-line" style={{ height: '100%' }} />
          </div>
          <div className="mob-glass-card" style={{ flex: 1, marginBottom: '20px' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', margin: '0 0 6px', textTransform: 'uppercase' }}>2021 – 2025</p>
            <h3 style={{ fontFamily: 'RozanovaHUM-Demo-SemiBold, serif', fontSize: '18px', margin: '0 0 10px', color: '#fff' }}>College Projects &amp; Creative Recognition</h3>
            <p className="mob-body-text" style={{ margin: 0, fontSize: '13px' }}>
              Worked on numerous academic and extracurricular design projects, gaining recognition from faculty for creative contributions. Served as Editor and designer for department functions and college events. Earned certifications and hands-on proficiency in Adobe Photoshop, Illustrator, and Premiere Pro.
            </p>
          </div>
        </div>

        {/* Timeline Item 3 */}
        <div style={{ display: 'flex', gap: '16px', ...fadeIn('exp', 0.3) }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="mob-timeline-dot" />
          </div>
          <div className="mob-glass-card" style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', margin: '0 0 6px', textTransform: 'uppercase' }}>2025 – 2026</p>
            <h3 style={{ fontFamily: 'RozanovaHUM-Demo-SemiBold, serif', fontSize: '18px', margin: '0 0 10px', color: '#fff' }}>UI/UX Exploration &amp; Web Designing</h3>
            <p className="mob-body-text" style={{ margin: 0, fontSize: '13px' }}>
              Started learning the fundamentals of UI/UX design and web development. Focused on creating user-friendly interfaces and converting design concepts into functional web pages, continuing to grow toward building complete digital experiences.
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SKILLS & TOOLS
      ══════════════════════════════════════════ */}
      <div ref={setRef('skills')} data-section="skills" style={{ padding: '0 0 72px', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 32px', ...fadeIn('skills', 0) }}>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>Toolkit</p>
          <h2 className="mob-section-title">Skills &amp; <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>Tools</span></h2>
        </div>
        <div style={{ ...fadeIn('skills', 0.1) }}>
          <LogoLoop
            speed={80} direction="left" width="100%" logoHeight={52} gap={60}
            pauseOnHover scaleOnHover ariaLabel="Skills and Tools"
            logos={[
              { src: '/tools icon/after-effects.png', alt: 'After Effects' },
              { src: '/tools icon/premiere-pro.png', alt: 'Premiere Pro' },
              { src: '/tools icon/photoshop.png', alt: 'Photoshop' },
              { src: '/tools icon/illustrator.png', alt: 'Illustrator' },
              { src: '/tools icon/Capcut-icon.png', alt: 'CapCut' },
              { src: '/tools icon/canva.png', alt: 'Canva' },
              { src: '/tools icon/xd.png', alt: 'Adobe XD' },
              { src: '/tools icon/react.png', alt: 'React' },
              { src: '/tools icon/js.png', alt: 'JavaScript' },
              { src: '/tools icon/photoshop-lightroom.png', alt: 'Lightroom' },
              { src: '/tools icon/Alight-Motion-Logo-PNG-HD.png', alt: 'Alight Motion' },
              { src: '/tools icon/meta human.jpg', alt: 'MetaHuman' },
            ]}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          AWARDS & ACHIEVEMENTS
      ══════════════════════════════════════════ */}
      <div ref={setRef('awards')} data-section="awards" style={{ padding: '0 24px 72px' }}>
        <div style={{ ...fadeIn('awards', 0) }}>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>Recognition</p>
          <h2 className="mob-section-title" style={{ marginBottom: '32px' }}>
            Awards <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>&amp; Achievements</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', ...fadeIn('awards', 0.1) }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src="/awardspng590-5h66-1000w.webp" alt="Awards" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} loading="lazy" />
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src="/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp" alt="Certificate" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} loading="lazy" />
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', gridColumn: '1/-1' }}>
            <img src="/premiurepropage0001598-vlq-700h.webp" alt="Premiere Pro Certificate" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} loading="lazy" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          WORKING SECTION — MOTION UI CAROUSEL
      ══════════════════════════════════════════ */}
      <div ref={setRef('motion')} data-section="motion" style={{ padding: '0 0 60px', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 24px', ...fadeIn('motion', 0) }}>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>Portfolio</p>
          <h2 className="mob-section-title">Motion <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>UI</span></h2>
        </div>
        <div style={{ height: '380px', width: '100%', ...fadeIn('motion', 0.1) }}>
          <ImageSlider3D
            images={motionImages}
            duration={28}
            cardWidth="11em"
            cardAspectRatio="7/10"
            perspective="30em"
            rotationDirection="left"
            withMask={false}
            defaultX={-200}
            defaultSize={38}
            containerStyle={{ width: '100%', height: '100%', minHeight: 'unset' }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CRIME SCENE RIBBON
      ══════════════════════════════════════════ */}
      <div style={{ overflow: 'hidden', padding: '8px 0', margin: '12px 0' }}>
        <ScrollVelocity
          texts={[<><span style={{ color: '#f5d000', marginRight: '14px' }}>CRIME SCENE :</span><span style={{ letterSpacing: '8px' }}>WORK IN PROGRESS</span></>]}
          velocity={60}
          className="crime-text"
          parallaxClassName="crime-parallax"
          scrollerClassName="crime-scroller"
          numCopies={4}
          damping={50}
          stiffness={400}
        />
      </div>

      {/* ══════════════════════════════════════════
          GRAPHICS WORK CAROUSEL
      ══════════════════════════════════════════ */}
      <div ref={setRef('graphics')} data-section="graphics" style={{ padding: '48px 0 60px', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 24px', ...fadeIn('graphics', 0) }}>
          <h2 className="mob-section-title">
            Graphics <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>Work</span>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Some art, some edits...</p>
        </div>
        <div style={{ height: '380px', width: '100%', ...fadeIn('graphics', 0.1) }}>
          <ImageSlider3D
            images={graphicsImages}
            duration={32}
            cardWidth="11em"
            cardAspectRatio="7/10"
            perspective="30em"
            rotationDirection="right"
            withMask={false}
            defaultX={-200}
            defaultSize={38}
            containerStyle={{ width: '100%', height: '100%', minHeight: 'unset' }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TYPOGRAPHY CAROUSEL
      ══════════════════════════════════════════ */}
      <div ref={setRef('typo')} data-section="typo" style={{ padding: '0 0 60px', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 24px', ...fadeIn('typo', 0) }}>
          <h2 className="mob-section-title">
            Typography
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Usual typing practices...</p>
        </div>
        <div style={{ height: '380px', width: '100%', ...fadeIn('typo', 0.1) }}>
          <ImageSlider3D
            images={typographyImages}
            duration={26}
            cardWidth="11em"
            cardAspectRatio="7/10"
            perspective="30em"
            rotationDirection="left"
            withMask={false}
            defaultX={-200}
            defaultSize={38}
            containerStyle={{ width: '100%', height: '100%', minHeight: 'unset' }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          HOBBIES CAROUSEL
      ══════════════════════════════════════════ */}
      <div ref={setRef('hobbies')} data-section="hobbies" style={{ padding: '0 0 80px', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 24px', ...fadeIn('hobbies', 0) }}>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>Off the Table</p>
          <h2 className="mob-section-title">Hobbies</h2>
        </div>
        <div style={{ height: '380px', width: '100%', ...fadeIn('hobbies', 0.1) }}>
          <ImageSlider3D
            images={hobbiesImages}
            duration={34}
            cardWidth="11em"
            cardAspectRatio="7/10"
            perspective="30em"
            rotationDirection="right"
            withMask={false}
            defaultX={-200}
            defaultSize={38}
            containerStyle={{ width: '100%', height: '100%', minHeight: 'unset' }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FOOTER — HIRE ME + SOCIALS
      ══════════════════════════════════════════ */}
      <div ref={setRef('footer')} data-section="footer" style={{ padding: '60px 24px 80px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ ...fadeIn('footer', 0) }}>
          <h2 className="mob-section-title" style={{ marginBottom: '10px' }}>Let&apos;s Work</h2>
          <h2 className="mob-section-title" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', marginBottom: '36px' }}>Together.</h2>
        </div>

        <div style={{ ...fadeIn('footer', 0.1), marginBottom: '40px' }}>
          <a
            href="https://wa.me/918360289391?text=Hi%20Gaurav%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20hire%20you!"
            target="_blank" rel="noopener noreferrer"
            className="mob-hireme-btn"
          >
            HIRE ME
          </a>
        </div>

        {/* Social Icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', ...fadeIn('footer', 0.2), marginBottom: '48px' }}>
          <a href="https://www.instagram.com/_theunknownclassmate_?igsh=MTRnMXNqYjgxaXo5Ng%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="mob-social-btn mob-insta">
            <svg viewBox="0 0 448 512" width="22" height="22" fill="white">
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>
          </a>
          <a href="https://github.com/TheGsChan" target="_blank" rel="noopener noreferrer" className="mob-social-btn mob-github">
            <svg viewBox="0 0 496 512" width="22" height="22" fill="white">
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"/>
            </svg>
          </a>
          <a href="mailto:gaurav97422@gmail.com" className="mob-social-btn mob-gmail">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
        </div>

        {/* Watermark */}
        <p className="watermark-shine" style={{ fontSize: '11px', letterSpacing: '2px' }}>
          all rights reserved _.theUKC_
        </p>
      </div>
    </div>
  );
}
