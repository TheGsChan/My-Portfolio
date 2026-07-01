import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function MobilePage() {
  const [projects, setProjects] = useState({ 'motion ui': [], 'GRAPHICS WORK': [], 'TYPOGRAPHY': [], 'hobbies': [] });
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  // Fetch Supabase projects
  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => setProjects(d))
      .catch(() => {});
  }, []);

  // Section fade-in observer
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisible(prev => ({ ...prev, [e.target.dataset.id]: true }));
      });
    }, { threshold: 0.06 });
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const r = (id) => (el) => { refs.current[id] = el; };
  const fade = (id, delay = 0) => ({
    opacity: visible[id] ? 1 : 0,
    transform: visible[id] ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  });

  // Fallback images for each section
  const fallback = [
    '/awardspng590-5h66-1000w.webp',
    '/pensubtleshadow115107-qc7-1900w.webp',
    '/stripcrime5112-qb1p-1500h.webp',
    '/eyeanimation515-mzn7-1100h.webp',
    '/premiurepropage0001598-vlq-700h.webp',
  ];
  const motionImgs  = projects['motion ui']?.length    ? projects['motion ui']    : fallback;
  const graphicImgs = projects['GRAPHICS WORK']?.length ? projects['GRAPHICS WORK'] : fallback;
  const typoImgs    = projects['TYPOGRAPHY']?.length    ? projects['TYPOGRAPHY']    : fallback;
  const hobbyImgs   = projects['hobbies']?.length       ? projects['hobbies']       : fallback;

  return (
    <>
      <Head>
        <title>Gaurav Sharma – Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Gaurav Sharma – Graphic Designer, Motion Designer & Web Developer" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ background: '#080808', color: '#fff', fontFamily: "'Inter', sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          @font-face { font-family:'RozHUM'; src:url('/fonts/rozanovahumdemosemibold-nrarm.otf'); font-weight:600; }
          @font-face { font-family:'RozHUM'; src:url('/fonts/rozanovahumdemothin-1gj2l.otf'); font-weight:300; }
          @font-face { font-family:'Geisha'; src:url('/fonts/geisha.ttf'); }

          @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes scrollX { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes shine { 0%{background-position:-200px} 60%{background-position:400px} 100%{background-position:400px} }
          @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px rgba(255,255,255,0.15)} 50%{box-shadow:0 0 40px rgba(255,255,255,0.35)} }

          .m-hero-title {
            font-family:'RozHUM',serif;
            font-weight:600;
            font-size: clamp(58px, 20vw, 110px);
            line-height:0.9;
            letter-spacing:-3px;
            background:linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.7) 100%);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            background-clip:text;
          }
          .m-section-title {
            font-family:'RozHUM',serif;
            font-weight:600;
            font-size:clamp(30px,9vw,52px);
            letter-spacing:-1px;
            line-height:1.05;
          }
          .m-body { font-size:clamp(13px,3.6vw,16px); line-height:1.78; color:rgba(255,255,255,0.68); }
          .m-label { font-size:10px; letter-spacing:4px; color:rgba(255,255,255,0.36); text-transform:uppercase; margin-bottom:10px; }
          .m-card {
            background:rgba(255,255,255,0.04);
            border:1px solid rgba(255,255,255,0.09);
            border-radius:18px;
            padding:22px 18px;
            backdrop-filter:blur(10px);
          }
          .m-hireme {
            display:inline-block;
            padding:17px 48px;
            background:#fff;
            color:#000;
            font-weight:800;
            font-size:15px;
            letter-spacing:3px;
            border:none;
            border-radius:50px;
            cursor:pointer;
            text-decoration:none;
            animation: pulseGlow 2.5s ease-in-out infinite;
            transition:transform 0.2s;
          }
          .m-hireme:active { transform:scale(0.97); }
          .m-social {
            width:54px;height:54px;
            border-radius:50%;
            background:rgba(255,255,255,0.07);
            border:1px solid rgba(255,255,255,0.13);
            display:flex;align-items:center;justify-content:center;
            text-decoration:none;
            transition:all 0.3s ease;
          }
          .m-social:active { transform:scale(0.9); }
          .m-insta:active { background:rgb(225,48,108); }
          .m-github:active { background:royalblue; }
          .m-gmail:active { background:rgb(212,70,56); }
          .m-tl-dot {
            width:13px;height:13px;
            border-radius:50%;
            background:#fff;
            flex-shrink:0;
            margin-top:4px;
            box-shadow:0 0 10px rgba(255,255,255,0.45);
          }
          .m-tl-line {
            width:1.5px;
            background:linear-gradient(to bottom,rgba(255,255,255,0.5),rgba(255,255,255,0.06));
            flex-shrink:0;
            flex-grow:1;
          }
          .m-gallery-wrap {
            display:flex;
            gap:12px;
            overflow-x:auto;
            padding:0 24px 12px;
            scrollbar-width:none;
            -webkit-overflow-scrolling:touch;
          }
          .m-gallery-wrap::-webkit-scrollbar { display:none; }
          .m-gallery-img {
            flex:0 0 auto;
            width:60vw;
            max-width:240px;
            aspect-ratio:7/10;
            object-fit:cover;
            border-radius:16px;
            border:1px solid rgba(255,255,255,0.1);
          }
          .m-logo-track {
            display:flex;
            gap:28px;
            animation:scrollX 20s linear infinite;
            width:max-content;
          }
          .m-watermark {
            background:linear-gradient(to right,#444 0,#fff 10%,#444 20%);
            background-size:200% auto;
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            animation:shine 8s linear infinite;
            font-size:11px;
            letter-spacing:2px;
            font-weight:600;
          }
          .m-crime-track {
            display:flex;
            gap:60px;
            animation:scrollX 12s linear infinite;
            width:max-content;
            font-size:clamp(28px,8vw,52px);
            font-weight:700;
            letter-spacing:6px;
            color:rgba(160,160,160,0.5);
            text-transform:uppercase;
            white-space:nowrap;
          }
        `}</style>

        {/* ═══ HERO ═══ */}
        <div style={{ position:'relative', height:'100svh', minHeight:'580px', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', paddingBottom:'72px' }}>
          <video src="/herogg.webm" autoPlay muted loop playsInline preload="auto"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 40%, rgba(8,8,8,0.97) 100%)' }} />

          {/* MY */}
          <span style={{ position:'absolute', top:'6vh', zIndex:2, fontFamily:'RozHUM,serif', fontWeight:300, fontSize:'clamp(13px,3.8vw,20px)', letterSpacing:'9px', color:'rgba(255,255,255,0.55)', textTransform:'uppercase' }}>MY</span>

          {/* PORTFOLIO */}
          <span className="m-hero-title" style={{ position:'absolute', top:'8.5vh', zIndex:2, textAlign:'center', padding:'0 12px', width:'100%' }}>PORTFOLIO</span>

          {/* Name + role */}
          <div style={{ position:'relative', zIndex:3, textAlign:'center', padding:'0 24px' }}>
            <p style={{ fontFamily:'RozHUM,serif', fontWeight:600, fontSize:'clamp(22px,6vw,36px)', letterSpacing:'-0.5px', marginBottom:'6px', color:'#fff' }}>Gaurav Sharma</p>
            <p style={{ fontFamily:'Inter,sans-serif', fontSize:'clamp(12px,3.4vw,15px)', color:'rgba(255,255,255,0.6)', letterSpacing:'0.5px' }}>My Name is Gaurav Sharma &amp; I am a Freelance</p>
            <p style={{ fontFamily:'RozHUM,serif', fontWeight:600, fontSize:'clamp(16px,4.8vw,26px)', color:'rgba(255,255,255,0.85)', marginTop:'2px' }}>Graphic Designer</p>
          </div>

          {/* Scroll arrow */}
          <div style={{ position:'absolute', bottom:'18px', left:'50%', transform:'translateX(-50%)', zIndex:3, animation:'floatY 2s ease-in-out infinite' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </div>
        </div>

        {/* ═══ ABOUT ME ═══ */}
        <div ref={r('about')} data-id="about" style={{ padding:'64px 22px 52px' }}>
          <div style={fade('about',0)}>
            <p className="m-label">About</p>
            <h2 className="m-section-title" style={{ marginBottom:'24px' }}>About <span style={{ fontStyle:'italic', color:'rgba(255,255,255,0.45)' }}>Me</span> :</h2>
          </div>
          <div className="m-card" style={fade('about',0.12)}>
            <p className="m-body">
              Hello! I&apos;m a professional graphic and motion designer with strong expertise in visual storytelling and digital design. I work with Adobe Photoshop, Illustrator, After Effects, and Premiere Pro to create compelling videos, polished photo edits, and engaging social media visuals.
              <br /><br />
              My core strength lies in turning ideas into eye-catching designs and motion content that connect with audiences. I also specialize in UI/UX design and converting creative layouts into fully functional web pages.
            </p>
          </div>
        </div>

        {/* ═══ WORK EXPERIENCE ═══ */}
        <div ref={r('exp')} data-id="exp" style={{ padding:'0 22px 64px' }}>
          <div style={fade('exp',0)}>
            <p className="m-label">Journey</p>
            <h2 className="m-section-title" style={{ marginBottom:'36px' }}>Work <span style={{ fontStyle:'italic', color:'rgba(255,255,255,0.45)' }}>Experiences</span></h2>
          </div>
          {[
            { years:'2020 – 2021', title:'Foundation in Video Editing', body:'Began my creative journey as a beginner video editor, producing short-form videos while learning through online courses. Developed strong skills in storytelling, pacing, transitions, and visual rhythm.' },
            { years:'2021 – 2025', title:'College Projects & Creative Recognition', body:'Worked on numerous academic and extracurricular design projects. Served as Editor and Designer for department functions and college events. Earned certifications in Photoshop, Illustrator, and Premiere Pro.' },
            { years:'2025 – 2026', title:'UI/UX & Web Design', body:'Started learning UI/UX fundamentals and web development. Focused on creating user-friendly interfaces and converting design concepts into functional web pages.' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', gap:'14px', marginBottom: i < 2 ? '0' : '0', ...fade('exp', 0.1 * (i+1)) }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div className="m-tl-dot" />
                {i < 2 && <div className="m-tl-line" style={{ height:'100%' }} />}
              </div>
              <div className="m-card" style={{ flex:1, marginBottom:'16px' }}>
                <p style={{ fontSize:'10px', letterSpacing:'3px', color:'rgba(255,255,255,0.38)', textTransform:'uppercase', marginBottom:'6px' }}>{item.years}</p>
                <h3 style={{ fontFamily:'RozHUM,serif', fontSize:'17px', fontWeight:600, marginBottom:'10px', color:'#fff' }}>{item.title}</h3>
                <p className="m-body" style={{ fontSize:'13px' }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ SKILLS LOOP ═══ */}
        <div ref={r('skills')} data-id="skills" style={{ padding:'0 0 64px', overflow:'hidden' }}>
          <div style={{ padding:'0 22px 28px', ...fade('skills',0) }}>
            <p className="m-label">Toolkit</p>
            <h2 className="m-section-title">Skills &amp; <span style={{ fontStyle:'italic', color:'rgba(255,255,255,0.45)' }}>Tools</span></h2>
          </div>
          <div style={{ overflow:'hidden', ...fade('skills',0.1) }}>
            <div className="m-logo-track">
              {[
                { src:'/tools icon/after-effects.png', alt:'After Effects' },
                { src:'/tools icon/premiere-pro.png', alt:'Premiere Pro' },
                { src:'/tools icon/photoshop.png', alt:'Photoshop' },
                { src:'/tools icon/illustrator.png', alt:'Illustrator' },
                { src:'/tools icon/Capcut-icon.png', alt:'CapCut' },
                { src:'/tools icon/canva.png', alt:'Canva' },
                { src:'/tools icon/xd.png', alt:'Adobe XD' },
                { src:'/tools icon/react.png', alt:'React' },
                { src:'/tools icon/js.png', alt:'JavaScript' },
                { src:'/tools icon/photoshop-lightroom.png', alt:'Lightroom' },
                { src:'/tools icon/Alight-Motion-Logo-PNG-HD.png', alt:'Alight Motion' },
                // duplicate for seamless loop
                { src:'/tools icon/after-effects.png', alt:'After Effects' },
                { src:'/tools icon/premiere-pro.png', alt:'Premiere Pro' },
                { src:'/tools icon/photoshop.png', alt:'Photoshop' },
                { src:'/tools icon/illustrator.png', alt:'Illustrator' },
                { src:'/tools icon/Capcut-icon.png', alt:'CapCut' },
                { src:'/tools icon/canva.png', alt:'Canva' },
                { src:'/tools icon/xd.png', alt:'Adobe XD' },
                { src:'/tools icon/react.png', alt:'React' },
                { src:'/tools icon/js.png', alt:'JavaScript' },
                { src:'/tools icon/photoshop-lightroom.png', alt:'Lightroom' },
                { src:'/tools icon/Alight-Motion-Logo-PNG-HD.png', alt:'Alight Motion' },
              ].map((logo, i) => (
                <img key={i} src={logo.src} alt={logo.alt} style={{ height:'52px', width:'auto', objectFit:'contain', flexShrink:0, filter:'brightness(0.9)' }} loading="lazy" />
              ))}
            </div>
          </div>
        </div>

        {/* ═══ AWARDS ═══ */}
        <div ref={r('awards')} data-id="awards" style={{ padding:'0 22px 64px' }}>
          <div style={fade('awards',0)}>
            <p className="m-label">Recognition</p>
            <h2 className="m-section-title" style={{ marginBottom:'28px' }}>Awards <span style={{ fontStyle:'italic', color:'rgba(255,255,255,0.45)' }}>&amp; Achievements</span></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', ...fade('awards',0.1) }}>
            {[
              { src:'/awardspng590-5h66-1000w.webp', alt:'Awards', h:'170px' },
              { src:'/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp', alt:'Certificate', h:'170px' },
              { src:'/premiurepropage0001598-vlq-700h.webp', alt:'Premiere Pro Certificate', h:'140px', full:true },
            ].map((img, i) => (
              <div key={i} style={{ borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.09)', gridColumn: img.full ? '1/-1' : 'auto' }}>
                <img src={img.src} alt={img.alt} loading="lazy" style={{ width:'100%', height:img.h, objectFit:'cover', display:'block' }} />
              </div>
            ))}
          </div>
        </div>

        {/* ═══ MOTION UI GALLERY ═══ */}
        <GallerySection refFn={r('motion')} id="motion" label="Portfolio" title="Motion" titleItalic="UI" images={motionImgs} fade={fade} />

        {/* ═══ CRIME SCENE RIBBON ═══ */}
        <div style={{ overflow:'hidden', padding:'16px 0', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)', marginBottom:'16px' }}>
          <div className="m-crime-track">
            {['CRIME SCENE : WORK IN PROGRESS', 'CRIME SCENE : WORK IN PROGRESS', 'CRIME SCENE : WORK IN PROGRESS', 'CRIME SCENE : WORK IN PROGRESS'].map((t, i) => (
              <span key={i}>{t} &nbsp;&nbsp;◆&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>

        {/* ═══ GRAPHICS WORK GALLERY ═══ */}
        <GallerySection refFn={r('graphics')} id="graphics" title="Graphics" titleItalic="Work" subtext="Some art, some edits..." images={graphicImgs} fade={fade} />

        {/* ═══ TYPOGRAPHY GALLERY ═══ */}
        <GallerySection refFn={r('typo')} id="typo" title="Typography" subtext="Usual typing practices..." images={typoImgs} fade={fade} />

        {/* ═══ HOBBIES GALLERY ═══ */}
        <GallerySection refFn={r('hobbies')} id="hobbies" label="Off the Table" title="Hobbies" images={hobbyImgs} fade={fade} />

        {/* ═══ FOOTER ═══ */}
        <div ref={r('footer')} data-id="footer" style={{ padding:'60px 22px 72px', textAlign:'center', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={fade('footer',0)}>
            <h2 className="m-section-title">Let&apos;s Work</h2>
            <h2 className="m-section-title" style={{ fontStyle:'italic', color:'rgba(255,255,255,0.4)', marginBottom:'36px' }}>Together.</h2>
          </div>

          <div style={{ marginBottom:'36px', ...fade('footer',0.1) }}>
            <a href="https://wa.me/918360289391?text=Hi%20Gaurav%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20hire%20you!" target="_blank" rel="noopener noreferrer" className="m-hireme">
              HIRE ME
            </a>
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:'18px', marginBottom:'44px', ...fade('footer',0.2) }}>
            <a href="https://www.instagram.com/_theunknownclassmate_?igsh=MTRnMXNqYjgxaXo5Ng%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="m-social m-insta">
              <svg viewBox="0 0 448 512" width="20" height="20" fill="white"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
            </a>
            <a href="https://github.com/TheGsChan" target="_blank" rel="noopener noreferrer" className="m-social m-github">
              <svg viewBox="0 0 496 512" width="20" height="20" fill="white"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"/></svg>
            </a>
            <a href="mailto:gaurav97422@gmail.com" className="m-social m-gmail">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
          </div>

          <p className="m-watermark">all rights reserved _.theUKC_</p>
        </div>

      </div>
    </>
  );
}

// ── Simple horizontal scroll gallery ──
function GallerySection({ refFn, id, label, title, titleItalic, subtext, images, fade }) {
  return (
    <div ref={refFn} data-id={id} style={{ padding:'48px 0 56px', overflow:'hidden' }}>
      <div style={{ padding:'0 22px 20px', ...fade(id,0) }}>
        {label && <p style={{ fontSize:'10px', letterSpacing:'4px', color:'rgba(255,255,255,0.36)', textTransform:'uppercase', marginBottom:'8px' }}>{label}</p>}
        <h2 style={{ fontFamily:'RozHUM,serif', fontWeight:600, fontSize:'clamp(28px,8vw,48px)', letterSpacing:'-1px', lineHeight:1.1 }}>
          {title}{titleItalic && <> <span style={{ fontStyle:'italic', color:'rgba(255,255,255,0.42)' }}>{titleItalic}</span></>}
        </h2>
        {subtext && <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.38)', marginTop:'5px' }}>{subtext}</p>}
      </div>
      <div className="m-gallery-wrap" style={fade(id,0.1)}>
        {images.slice(0,8).map((src, i) => {
          const isVid = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
          return isVid ? (
            <video key={i} src={src} muted loop playsInline className="m-gallery-img" style={{ width:'60vw', maxWidth:'240px', aspectRatio:'7/10', objectFit:'cover', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.1)', background:'#111' }} />
          ) : (
            <img key={i} src={src} alt={`${title} ${i+1}`} className="m-gallery-img" loading="lazy" />
          );
        })}
      </div>
    </div>
  );
}
