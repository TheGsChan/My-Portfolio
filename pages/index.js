import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import ScaleWrapper from '../components/ScaleWrapper'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'


const ElastiCarousel = dynamic(() => import('../components/ElastiCarousel'), { ssr: false })
const Particles = dynamic(() => import('../components/ui/particles').then(m => ({ default: m.Particles })), { ssr: false })
const LogoLoop = dynamic(() => import('../components/LogoLoop'), { ssr: false })
const ScrollVelocity = dynamic(() => import('../components/ScrollVelocity'), { ssr: false })
const RollingText = dynamic(() => import('../components/RollingText'), { ssr: false })
const ImageSlider3D = dynamic(() => import('../components/ImageSlider3D'), { ssr: false })
const SeamlessVideoLoop = dynamic(() => import('../components/SeamlessVideoLoop'), { ssr: false })
import { DualTypingAnimation } from '../components/DualTypingAnimation';
// ── Typewriter CSS reveal: no text/style changes, just animation on parent class ──

const Clippathgroup = (props) => {
  const eyeVideoRef = useRef(null);
  const [tearComplete, setTearComplete] = useState(false); // fires after tear animation done
  const [supabaseMedia, setSupabaseMedia] = useState({
    'motion ui': [],
    'GRAPHICS WORK': [],
    'TYPOGRAPHY': [],
    'hobbies': []
  });

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setSupabaseMedia(data))
      .catch(err => console.error('Error fetching Supabase media:', err));
  }, []);

  // IntersectionObserver for Work Experience sections
  const exp1Ref = useRef(null);
  const exp2Ref = useRef(null);
  const exp3Ref = useRef(null);
  useEffect(() => {
    const observe = (ref) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { ref.current.classList.add('tw-reveal'); obs.disconnect(); }
      }, { threshold: 0.15 });
      obs.observe(ref.current);
      return obs;
    };
    const o1 = observe(exp1Ref);
    const o2 = observe(exp2Ref);
    const o3 = observe(exp3Ref);
    return () => { o1?.disconnect(); o2?.disconnect(); o3?.disconnect(); };
  }, []);

  useEffect(() => {
    // Prevent browser from restoring previous scroll position on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    if (eyeVideoRef.current) {
      eyeVideoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }, []);

  // ── VIDEO TRIM — HARDCODED FINAL VALUES ──
  const TRIM_IN = 2;    // skip first 2s
  const TRIM_OUT = 1.5;  // stop 1.5s before end
  const LOOP_FROM = 9.5;  // loop back to 9.5s

  // Parallax constants — hardcoded final values
  const PARALLAX_SPEED = 0.2;
  const FOG_PARALLAX_SPEED = 0.1; // Slower parallax for depth
  const PARALLAX_LIMIT = 3000;

  useEffect(() => {

    // ─── REPLACED PARALLAX LOGIC ─────────────────────────────────────
    const onParallaxScroll = () => {
      const sy = window.scrollY || window.pageYOffset;
      if (sy > 3000) return;

      const gauravText = document.querySelector('.clippathgroup-thq-text-elm198');
      if (gauravText) {
        let yOffset = -sy * PARALLAX_SPEED;
        if (yOffset > PARALLAX_LIMIT) yOffset = PARALLAX_LIMIT;
        if (yOffset < -PARALLAX_LIMIT) yOffset = -PARALLAX_LIMIT;
        gsap.set(gauravText, { y: yOffset, scale: 0.9, transformOrigin: 'top left' });
      }

      const fogElements = document.querySelectorAll('.fog-container');
      if (fogElements.length > 0) {
        let fogYOffset = -sy * FOG_PARALLAX_SPEED;
        if (fogYOffset < -PARALLAX_LIMIT) fogYOffset = -PARALLAX_LIMIT;
        gsap.set(fogElements, { y: fogYOffset });
      }
    };

    window.addEventListener('scroll', onParallaxScroll, { passive: true });

    // Apply correct scale and position immediately on load
    const applyInitial = () => {
      const gauravText = document.querySelector('.clippathgroup-thq-text-elm198');
      const sy = window.scrollY || window.pageYOffset;

      if (gauravText) {
        let yOffset = -sy * PARALLAX_SPEED;
        if (yOffset > PARALLAX_LIMIT) yOffset = PARALLAX_LIMIT;
        if (yOffset < -PARALLAX_LIMIT) yOffset = -PARALLAX_LIMIT;
        gsap.set(gauravText, { y: yOffset, scale: 0.9, transformOrigin: 'top left' });
      }

      const fogElements = document.querySelectorAll('.fog-container');
      if (fogElements.length > 0) {
        let fogYOffset = -sy * FOG_PARALLAX_SPEED;
        if (fogYOffset < -PARALLAX_LIMIT) fogYOffset = -PARALLAX_LIMIT;
        gsap.set(fogElements, { y: fogYOffset });
      }
    };
    [0, 100, 300, 600, 1000].forEach(ms => setTimeout(applyInitial, ms));

    return () => {
      window.removeEventListener('scroll', onParallaxScroll);
      if (window.__tearClamp) window.__tearClamp.active = false;

      const gt = document.querySelector('.clippathgroup-thq-text-elm198');
      if (gt) gsap.set(gt, { clearProps: 'all' });

      const fogs = document.querySelectorAll('.fog-container');
      if (fogs.length > 0) gsap.set(fogs, { clearProps: 'all' });
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = eyeVideoRef.current;
    if (!video || !video.duration) return;

    // END_FRAME = the frame where video must stop/loop (duration minus trim-out)
    const END_FRAME = video.duration - TRIM_OUT;

    // If playback reaches or passes END_FRAME, loop back to LOOP_FROM
    // The loop will play from LOOP_FROM → END_FRAME, over and over
    if (video.currentTime >= END_FRAME) {
      video.currentTime = LOOP_FROM;
      // video is already playing — currentTime jump is enough to loop
    }
  };

  const handleEyeVideoLoaded = () => {
    const video = eyeVideoRef.current;
    if (!video) return;
    video.currentTime = TRIM_IN;
  };

  return (
    <ScaleWrapper designWidth={3537.33} designHeight={17870}>
      <div className="clippathgroup-container1">

        <style dangerouslySetInnerHTML={{
          __html: `
          .fog-container {
            position: absolute;
            left: 0;
            width: 100%;
            pointer-events: none;
            overflow: hidden;
          }
          
          /* STRICT Z-AXIS STACKING */
          .clippathgroup-thq-myportfolio-elm { z-index: 10 !important; }
          .fog-container-back { z-index: 15 !important; }
          .clippathgroup-thq-webmholder-elm { z-index: 20 !important; }
          .fog-container-front { z-index: 25 !important; }
          .clippathgroup-thq-gaurav-sharma-elm, 
          .clippathgroup-thq-text-elm104 { z-index: 30 !important; }
          .clippathgroup-thq-text-elm198 { z-index: 50 !important; } /* Geisha font Gaurav */

          /* Bring Graphic Designer text to front */
          .clippathgroup-thq-group-elm1,
          .clippathgroup-thq-text-elm107,
          .clippathgroup-thq-text-elm108 {
            position: relative;
            z-index: 50 !important;
          }

          /* ── TYPEWRITER REVEAL ANIMATION ────────────────────────────── */
          /* About Me section fully visible */
          .clippathgroup-thq-group2-elm {
            opacity: 1;
            pointer-events: auto;
          }
          @keyframes tw-slide-in {
            from { opacity: 0; clip-path: inset(0 100% 0 0); }
            to   { opacity: 1; clip-path: inset(0 0% 0 0); }
          }

          /* About Me: each direct span child animates in sequence after tear */
          .clippathgroup-thq-group2-elm.tw-reveal > span,
          .clippathgroup-thq-group2-elm.tw-reveal > span > span {
            animation: tw-slide-in 0.45s cubic-bezier(0.22,1,0.36,1) both;
          }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(1)  { animation-delay: 0.05s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(2)  { animation-delay: 0.25s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(3)  { animation-delay: 0.45s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(4)  { animation-delay: 0.65s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(5)  { animation-delay: 0.85s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(6)  { animation-delay: 1.05s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(7)  { animation-delay: 1.25s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(8)  { animation-delay: 1.45s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(9)  { animation-delay: 1.65s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(10) { animation-delay: 1.85s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(11) { animation-delay: 2.05s; }
          .clippathgroup-thq-group2-elm.tw-reveal > span:nth-child(12) { animation-delay: 2.25s; }

          /* Experience 1 spans: tw-reveal class added by IntersectionObserver on scroll */
          .clippathgroup-thq-text-elm136.tw-reveal ~ span[class^="clippathgroup-thq-text-elm13"],
          .clippathgroup-thq-text-elm136.tw-reveal ~ span[class^="clippathgroup-thq-text-elm14"] {
            animation: tw-slide-in 0.4s cubic-bezier(0.22,1,0.36,1) both;
          }
          .clippathgroup-thq-text-elm136.tw-reveal { animation: tw-slide-in 0.4s 0.0s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm136.tw-reveal ~ .clippathgroup-thq-text-elm137 { animation: tw-slide-in 0.4s 0.15s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm136.tw-reveal ~ .clippathgroup-thq-text-elm138 { animation: tw-slide-in 0.4s 0.30s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm136.tw-reveal ~ .clippathgroup-thq-text-elm139 { animation: tw-slide-in 0.4s 0.45s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm136.tw-reveal ~ .clippathgroup-thq-text-elm140 { animation: tw-slide-in 0.4s 0.60s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm136.tw-reveal ~ .clippathgroup-thq-text-elm141 { animation: tw-slide-in 0.4s 0.75s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm136.tw-reveal ~ .clippathgroup-thq-text-elm142 { animation: tw-slide-in 0.4s 0.90s cubic-bezier(0.22,1,0.36,1) both; }

          /* Experience 2 spans */
          .clippathgroup-thq-text-elm145.tw-reveal { animation: tw-slide-in 0.4s 0.0s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm148 { animation: tw-slide-in 0.4s 0.15s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm151 { animation: tw-slide-in 0.4s 0.30s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm152 { animation: tw-slide-in 0.4s 0.45s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm156 { animation: tw-slide-in 0.4s 0.60s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm157 { animation: tw-slide-in 0.4s 0.75s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm158 { animation: tw-slide-in 0.4s 0.90s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm159 { animation: tw-slide-in 0.4s 1.05s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm162 { animation: tw-slide-in 0.4s 1.20s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm165 { animation: tw-slide-in 0.4s 1.35s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm166 { animation: tw-slide-in 0.4s 1.50s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm145.tw-reveal ~ .clippathgroup-thq-text-elm169 { animation: tw-slide-in 0.4s 1.65s cubic-bezier(0.22,1,0.36,1) both; }

          /* Experience 3 spans */
          .clippathgroup-thq-text-elm172.tw-reveal { animation: tw-slide-in 0.4s 0.0s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm172.tw-reveal ~ .clippathgroup-thq-text-elm173 { animation: tw-slide-in 0.4s 0.15s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm172.tw-reveal ~ .clippathgroup-thq-text-elm176 { animation: tw-slide-in 0.4s 0.30s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm172.tw-reveal ~ .clippathgroup-thq-text-elm177 { animation: tw-slide-in 0.4s 0.45s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm172.tw-reveal ~ .clippathgroup-thq-text-elm178 { animation: tw-slide-in 0.4s 0.60s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm172.tw-reveal ~ .clippathgroup-thq-text-elm182 { animation: tw-slide-in 0.4s 0.75s cubic-bezier(0.22,1,0.36,1) both; }
          .clippathgroup-thq-text-elm172.tw-reveal ~ .clippathgroup-thq-text-elm183 { animation: tw-slide-in 0.4s 0.90s cubic-bezier(0.22,1,0.36,1) both; }

          /* Back Fog Layer (behind video, covering bottom 10% of PORTFOLIO text) */
          .fog-container-back {
            top: 674px; 
            height: 450px;
            opacity: 1; /* Overall container opacity */
            mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 95%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 95%, transparent 100%);
          }
          
          
          /* User-Controlled Solid Density Gradient (Starts dense at bottom, fades up) */
          .fog-container-back::before {
            content: '';
            position: absolute;
            top: 0; bottom: 0; left: 0; right: 0;
            background: linear-gradient(to top, rgba(255,255,255, 0.55) 18%, transparent 100%);
            z-index: 1;
          }
          
          /* Front Fog Layer (covering thighs to below knees) */
          .fog-container-front {
            top: 794px; 
            height: 650px;
            opacity: 1; 
            mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 95%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 95%, transparent 100%);
          }

          /* User-Controlled Solid Density Gradient (Starts dense at bottom, fades up) */
          .fog-container-front::before {
            content: '';
            position: absolute;
            top: 0; bottom: 0; left: 0; right: 0;
            background: linear-gradient(to top, rgba(255,255,255, 1) 55%, transparent 100%);
            z-index: 1;
          }

          .fog__layer {
            position: absolute;
            height: 100%;
            width: 300%;
            z-index: 2;
            mix-blend-mode: screen; /* Drops out the grey background in the image! */
            filter: brightness(3) contrast(1.4); /* Pushed even brighter/denser */
            will-change: transform;
            backface-visibility: hidden;
            transform: translateZ(0);
          }
          
          .fog__layer--1 {
            background: url('https://www.dropbox.com/s/dfdz7cqlpwsp1l9/fog-1.png?raw=1');
            background-repeat: repeat-x;
            background-size: 100% 100%; /* Stretches to remove hard crop edges */
            background-position: bottom;
            animation: marquee 60s linear infinite;
          }
          
          .fog__layer--2 {
            background: url('https://www.dropbox.com/s/4smivk3tas34moq/fog-2.png?raw=1');
            background-repeat: repeat-x;
            background-size: 100% 100%; /* Stretches to remove hard crop edges */
            background-position: bottom;
            animation: marquee 30s linear infinite;
          }

          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-66.6666%, 0, 0); }
          }
        `}} />
        <Head>
          <title>exported project</title>
          <meta property="og:title" content="exported project" />
          <link
            rel="canonical"
            href="https://untitled-v1j4ai.teleporthq.app/"
          />
          <meta
            property="og:url"
            content="https://untitled-v1j4ai.teleporthq.app/"
          />
        </Head>
        <div className="clippathgroup-thq-clippathgroup-elm">
          <div className="clippathgroup-thq-myportfolio-elm">
            <span className="clippathgroup-thq-text-elm100">portfolio</span>
            <span className="clippathgroup-thq-text-elm101">
              My
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </div>
          {/* Back Fog Layer */}
          <div className="fog-container fog-container-back">
            <div className="fog__layer fog__layer--1" style={{ animationDuration: '70s' }}></div>
            <div className="fog__layer fog__layer--2" style={{ animationDuration: '40s' }}></div>
          </div>

          {/* Portfolio hero video + particle overlay */}
          <div className="clippathgroup-thq-webmholder-elm portfolio-ptcl-wrap">
            <SeamlessVideoLoop
              src="/herogg.webm"
              crossfadeDuration={0.3}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
              }}
            />
            <Particles
              variant="default"
              particleStyle={{ count: 160, color: '#FFD700', size: 2.5, speed: 1.2, opacity: 0.9 }}
              interactive={false}
            />
          </div>

          {/* Front Fog Layer */}
          <div className="fog-container fog-container-front">
            <div className="fog__layer fog__layer--1" style={{ animationDuration: '45s' }}></div>
            <div className="fog__layer fog__layer--2" style={{ animationDuration: '25s' }}></div>
          </div>
          <div className="clippathgroup-thq-gaurav-sharma-elm">
            <DualTypingAnimation
              wordPairs={[
                { top: "Gaurav....", bottom: "....Sharma" },
                { top: "Web...", bottom: "...Designer" },
                { top: "Graphic..", bottom: "...Designer" },
                { top: "Video..", bottom: "...Editor" }
              ]}
            />
          </div>
          <span className="clippathgroup-thq-text-elm104">
            <span className="clippathgroup-thq-text-elm105">
              My Name is
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              Gaurav Sharma &amp; i am a Freelance
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <div className="clippathgroup-thq-eyeanimation-elm tear-trigger" style={{ overflow: 'hidden', zIndex: 5 }}>
            <video
              ref={eyeVideoRef}
              src="/eye_animation_2.mp4"
              autoPlay={true}
              muted={true}
              loop={true}
              playsInline={true}
              preload="auto"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.02)',
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
              }}
            ></video>
          </div>
          <div className="clippathgroup-thq-group1-elm">
            <span className="clippathgroup-thq-text-elm107">
              Graphic
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <div className="clippathgroup-thq-group-elm1">
              <span className="clippathgroup-thq-text-elm108">
                designer.
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </div>
          </div>
          <div className="clippathgroup-thq-group2-elm">
            <span className="clippathgroup-thq-text-elm109">
              <span className="clippathgroup-thq-text-elm110">
                About
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
              <span>
                Me :
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </span>
            <span className="clippathgroup-thq-text-elm112">
              <span className="clippathgroup-thq-text-elm113">
                Hello! I&apos;m a
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
              <span>
                professional graphic and motion designer with
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </span>
            <span className="clippathgroup-thq-text-elm115">
              strong expertise in visual storytelling and digital design.
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm116">
              <span className="clippathgroup-thq-text-elm117">
                I work confidently with
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
              <span>
                Adobe Photoshop, Illustrator, After
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </span>
            <span className="clippathgroup-thq-text-elm119">
              Effects, and Premiere Pro to create compelling videos,
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm120">
              polished photo edits, and engaging social media visuals.
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm121">
              My core strength lies in turning ideas into eye-catching
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm122">
              designs and motion content that connect with audiences.
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm123">
              <span className="clippathgroup-thq-text-elm124">
                Beyond graphics and video editing, I also specialize in
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
              <span>
                UI/
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </span>
            <span className="clippathgroup-thq-text-elm126">
              UX design and can transform creative layouts into fully
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm127">
              functional web pages that are not only beautiful but also
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm128">
              practical.
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm129">
              I constantly strive to push my creative boundaries and
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm130">
              deliver outstanding results in every project I take on.
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </div>

          <span className="clippathgroup-thq-text-elm131">
            <span className="clippathgroup-thq-text-elm132">
              Work
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              Experiences
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>

          {/* Timeline lines — restored as CSS divs, no SVG needed */}
          <div className="clippathgroup-thq-line1-elm" />
          <div className="clippathgroup-thq-line2-elm" />
          <div className="clippathgroup-thq-line3-elm" />
          <div className="clippathgroup-thq-line4-elm" />
          <div className="clippathgroup-thq-line5-elm" />
          <div className="clippathgroup-thq-line6-elm" />
          <div className="clippathgroup-thq-line7-elm" />
          <div className="clippathgroup-thq-line8-elm" />
          {/* Timeline dot markers */}
          <div className="clippathgroup-thq-ellipse1-elm" style={{ background: '#000', borderRadius: '50%' }} />
          <div className="clippathgroup-thq-ellipse2-elm" style={{ background: '#000', borderRadius: '50%' }} />
          <div className="clippathgroup-thq-ellipse3-elm" style={{ background: '#000', borderRadius: '50%' }} />

          <span className="clippathgroup-thq-text-elm134">
            2020–2021 | Foundation in Video
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm135">
            Editing.
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm136" ref={exp1Ref}>
            Began my creative journey as a
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm137">
            beginner video editor, producing short-
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm138">
            form videos while learning through
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm139">
            Online Courses and platforms like
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm140">
            YouTube. Developed a strong
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm141">
            understanding of storytelling, pacing,
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm142">
            transitions, and visual rhythm.
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm143">
            2021 – 2025 | College Projects
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm144">
            &amp; Creative Recognition
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm145" ref={exp2Ref}>
            <span className="clippathgroup-thq-text-elm146">
              Worked on numerous
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              academic and
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <span className="clippathgroup-thq-text-elm148">
            <span className="clippathgroup-thq-text-elm149">
              extracurricular design projects
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              , gaining
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <span className="clippathgroup-thq-text-elm151">
            recognition from faculty for creative
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm152">
            <span className="clippathgroup-thq-text-elm153">
              contributions. Served as an
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm154">
              Editor
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              and
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <span className="clippathgroup-thq-text-elm156">
            designer for department functions and
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm157">
            college events.
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm158">
            During this period, earned
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm159">
            <span className="clippathgroup-thq-text-elm160">
              certifications
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              and hands-on
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <span className="clippathgroup-thq-text-elm162">
            <span className="clippathgroup-thq-text-elm163">
              proficiency in tools such as
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              Adobe
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <span className="clippathgroup-thq-text-elm165">
            Photoshop, Illustrator, and Premiere
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm166">
            <span className="clippathgroup-thq-text-elm167">
              Pro
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              , strengthening both design and
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <span className="clippathgroup-thq-text-elm169">
            editing skills
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm170">
            2025 – 2026 | UI/UX
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm171">
            Exploration &amp; Web Designing
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm172" ref={exp3Ref}>
            Started learning the fundamentals of
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm173">
            <span className="clippathgroup-thq-text-elm174">
              UI/UX design and web development
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              .
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <span className="clippathgroup-thq-text-elm176">
            Focused on creating user-friendly
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm177">
            interfaces and converting design
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm178">
            <span className="clippathgroup-thq-text-elm179">
              concepts into functional
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span className="clippathgroup-thq-text-elm180">
              web pages
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              ,
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <span className="clippathgroup-thq-text-elm182">
            continuing to grow toward building
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm183">
            complete digital experiences.
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span className="clippathgroup-thq-text-elm184">
            <span className="clippathgroup-thq-text-elm185">
              Skills &amp; Tools
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              Desk
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <div
            className="clippathgroup-thq-tool-icon-elm"
            style={{ position: 'absolute', left: 0, width: '100%', overflow: 'hidden' }}
          >
            <LogoLoop
              speed={110}
              direction="left"
              width="100%"
              logoHeight={72}
              gap={100}
              pauseOnHover
              scaleOnHover
              ariaLabel="Skills and Tools"
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
                { src: '/tools icon/antigravity-color.png', alt: 'Antigravity' },
                { src: '/tools icon/meta human.jpg', alt: 'MetaHuman' },
              ]}
            />
          </div>

          {/* Ellipse4 dot marker - awards section */}
          <div className="clippathgroup-thq-ellipse4-elm" style={{ background: '#000', borderRadius: '50%' }} />

          <span className="clippathgroup-thq-text-elm187">AWARDS</span>
          {/* ── Awards image + badtz-ui Particles overlay ── */}
          <div className="clippathgroup-thq-awardspng-elm awards-ptcl-wrap">
            <img
              alt="awardspng590"
              loading="lazy"
              sizes="(min-width: 992px) 1200px, (min-width: 768px) 800px, 480px"
              src="/awardspng590-5h66-1000w.webp"
              srcSet="/awardspng590-5h66-1000w.webp 1200w, /awardspng590-5h66-tablet.webp 800w, /awardspng590-5h66-mobile.webp 480w"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <Particles
              variant="default"
              particleStyle={{ count: 160, color: '#FFD700', size: 2.5, speed: 1.2, opacity: 0.9 }}
              interactive={false}
            />
          </div>
          <div className="clippathgroup-thq-cloud3-elm">
            <img
              alt="pensubtleshadow115107"
              loading="lazy"
              sizes="(min-width: 992px) 1200px, (min-width: 768px) 800px, 480px"
              src="/pensubtleshadow115107-qc7-1900w.webp"
              srcSet="/pensubtleshadow115107-qc7-1900w.webp 1200w, /pensubtleshadow115107-qc7-tablet.webp 800w, /pensubtleshadow115107-qc7-mobile.webp 480w"
              className="clippathgroup-thq-pensubtleshadow11-elm1"
            />
          </div>
          <div className="clippathgroup-thq-group-elm2">
            <span className="clippathgroup-thq-text-elm188">
              &amp; ACHIEVEMENTS
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </div>

          {/* Restored certificate placeholder using existing webp */}
          <img
            alt="ILLUSCERTIFIEDpagestojpg0001596"
            loading="lazy"
            src="/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp"
            className="clippathgroup-thq-illuscertifie-dpagestojpg0001-elm"
            style={{ objectFit: 'contain' }}
          />
          <img
            alt="certificateTDGAURMG1357pagestojpg0001597"
            loading="lazy"
            sizes="(min-width: 768px) 800px, 480px"
            src="/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp"
            srcSet="/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp 800w, /certificatetdgaurmg1357pagestojpg0001597-ahr9-mobile.webp 480w"
            className="clippathgroup-thq-certificate-tdgaurmg1357pagestojpg0001-elm"
          />
          <img
            alt="PREMIUREPROpage0001598"
            loading="lazy"
            sizes="(min-width: 768px) 800px, 480px"
            src="/premiurepropage0001598-vlq-700h.webp"
            srcSet="/premiurepropage0001598-vlq-700h.webp 800w, /premiurepropage0001598-vlq-mobile.webp 480w"
            className="clippathgroup-thq-premiurepr-opage0001-elm"
          />
          <div className="clippathgroup-thq-group-elm3">
            <span className="clippathgroup-thq-text-elm189">WORKING</span>
            <img
              alt="pensubtleshadow115107"
              loading="lazy"
              sizes="(min-width: 992px) 1200px, (min-width: 768px) 800px, 480px"
              src="/pensubtleshadow115107-qc7-1900w.webp"
              srcSet="/pensubtleshadow115107-qc7-1900w.webp 1200w, /pensubtleshadow115107-qc7-tablet.webp 800w, /pensubtleshadow115107-qc7-mobile.webp 480w"
              className="clippathgroup-thq-pensubtleshadow11-elm2"
            />
            <div className="clippathgroup-container2">
              {/* 3D Carousel placeholder kept for layout */}
            </div>
            <span className="clippathgroup-thq-text-elm190">
              Section.
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </div>

          <div className="clippathgroup-thq-katman1-elm">
          </div>
          {/* ── MOTION EDITS CAROUSEL ── */}
          <div className="clippathgroup-thq-videoui-elm portfolio-carousel-wrap" style={{ left: 0, width: '3537px' }}>
            <ImageSlider3D
              images={supabaseMedia['motion ui']?.length > 0 ? supabaseMedia['motion ui'] : [
                '/stripcrime5112-qb1p-1500h.webp',
                '/guy_bike.png',
                '/eyeanimation515-mzn7-1100h.webp',
                '/pensubtleshadow115107-qc7-1900w.webp',
                '/awardspng590-5h66-1000w.webp',
                '/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp',
                '/premiurepropage0001598-vlq-700h.webp',
                '/stripcrime5112-qb1p-1500h.webp',
              ]}
              duration={30}
              cardWidth="17.5em"
              cardAspectRatio="7/10"
              perspective="35em"
              rotationDirection="left"
              withMask={false}
              containerStyle={{ width: '100%', height: '100%', minHeight: 'unset' }}
            />
          </div>
          {/* ── CRIME SCENE RIBBON ── */}
          <div style={{
            position: 'absolute',
            top: '10820px',
            left: 0,
            width: '100%',
            zIndex: 1,
            overflow: 'hidden',
          }}>
            <ScrollVelocity
              texts={[
                <><span style={{ color: '#f5d000', marginRight: '18px' }}>CRIME SCENE :</span><span style={{ letterSpacing: '12px' }}>WORK IN PROGRESS</span></>
              ]}
              velocity={80}
              className="crime-text"
              parallaxClassName="crime-parallax"
              scrollerClassName="crime-scroller"
              numCopies={5}
              damping={50}
              stiffness={400}
            />
          </div>

          {/* ── GRAPHICS WORK CAROUSEL ── */}
          <div className="clippathgroup-thq-graphicsui-elm portfolio-carousel-wrap" style={{ left: 0, width: '3537px' }}>
            <ImageSlider3D
              images={supabaseMedia['GRAPHICS WORK']?.length > 0 ? supabaseMedia['GRAPHICS WORK'] : [
                '/pensubtleshadow115107-qc7-1900w.webp',
                '/stripcrime5112-qb1p-1500h.webp',
                '/awardspng590-5h66-1000w.webp',
                '/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp',
                '/premiurepropage0001598-vlq-700h.webp',
                '/eyeanimation515-mzn7-1100h.webp',
                '/guy_bike.png',
                '/pensubtleshadow115107-qc7-1900w.webp',
              ]}
              duration={34}
              cardWidth="17.5em"
              cardAspectRatio="7/10"
              perspective="35em"
              rotationDirection="right"
              withMask={false}
              containerStyle={{ width: '100%', height: '100%', minHeight: 'unset' }}
            />
          </div>
          <div className="clippathgroup-thq-frame-graphicswork-someartsomeedits-elm">
            <span className="clippathgroup-thq-text-elm191" style={{ display: 'block', overflow: 'hidden' }}>
              <RollingText
                text="| GRAPHICS WORK |"
                delay={0}
                stagger={38}
                duration={540}
                className="rolling-title"
              />
            </span>
            <span className="clippathgroup-thq-text-elm192" style={{ display: 'block', overflow: 'hidden' }}>
              <RollingText
                text="Some art, some edits..."
                delay={320}
                stagger={28}
                duration={420}
                className="rolling-subtitle"
              />
            </span>
          </div>
          {/* ── TYPOGRAPHY CAROUSEL ── */}
          <div className="clippathgroup-thq-typography-elm portfolio-carousel-wrap" style={{ left: 0, width: '3537px' }}>
            <ImageSlider3D
              images={supabaseMedia['TYPOGRAPHY']?.length > 0 ? supabaseMedia['TYPOGRAPHY'] : [
                '/premiurepropage0001598-vlq-700h.webp',
                '/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp',
                '/awardspng590-5h66-1000w.webp',
                '/pensubtleshadow115107-qc7-1900w.webp',
                '/stripcrime5112-qb1p-1500h.webp',
                '/guy_bike.png',
                '/eyeanimation515-mzn7-1100h.webp',
                '/premiurepropage0001598-vlq-700h.webp',
              ]}
              duration={28}
              cardWidth="17.5em"
              cardAspectRatio="7/10"
              perspective="35em"
              rotationDirection="left"
              withMask={false}
              containerStyle={{ width: '100%', height: '100%', minHeight: 'unset' }}
            />
          </div>
          <div className="clippathgroup-thq-frame-typography-usualtyping-practices-elm">
            <span className="clippathgroup-thq-text-elm193" style={{ display: 'block', overflow: 'hidden' }}>
              <RollingText
                text="| TYPOGRAPHY |"
                delay={0}
                stagger={38}
                duration={540}
                className="rolling-title"
              />
            </span>
            <span className="clippathgroup-thq-text-elm194" style={{ display: 'block', overflow: 'hidden' }}>
              <RollingText
                text="Usual typing practices..."
                delay={320}
                stagger={28}
                duration={420}
                className="rolling-subtitle"
              />
            </span>
          </div>
          <div className="clippathgroup-thq-group-elm5">
            <span className="clippathgroup-thq-text-elm195">HOBBIES</span>
            <span className="clippathgroup-thq-text-elm196">
              off the table..
              <span dangerouslySetInnerHTML={{ __html: ' ' }} />
            </span>
          </div>
          {/* ── HOBBIES CAROUSEL ── */}
          <div className="clippathgroup-thq-hobiies-elm portfolio-carousel-wrap" style={{ left: 0, width: '3537px' }}>
            <ImageSlider3D
              defaultX={-545}
              defaultSize={52}
              images={supabaseMedia['hobbies']?.length > 0 ? supabaseMedia['hobbies'] : [
                '/eyeanimation515-mzn7-1100h.webp',
                '/guy_bike.png',
                '/stripcrime5112-qb1p-1500h.webp',
                '/pensubtleshadow115107-qc7-1900w.webp',
                '/awardspng590-5h66-1000w.webp',
                '/certificatetdgaurmg1357pagestojpg0001597-ahr9-700h.webp',
                '/premiurepropage0001598-vlq-700h.webp',
                '/eyeanimation515-mzn7-1100h.webp',
              ]}
              duration={36}
              cardWidth="17.5em"
              cardAspectRatio="7/10"
              perspective="35em"
              rotationDirection="right"
              withMask={false}
              containerStyle={{ width: '100%', height: '100%', minHeight: 'unset' }}
            />
          </div>
          {/* ── HIRE ME BUTTON & SOCIALS ── */}
          <div style={{
            position: 'absolute',
            bottom: '580px',
            left: '1168px',
            transform: 'translateX(-50%)',
            zIndex: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '120px',
          }}>
            <a href="https://wa.me/918360289391?text=Hi%20Gaurav%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20hire%20you!" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button className="hireme-btn">HIRE ME</button>
            </a>

            <div style={{ display: 'flex', gap: '60px' }}>
              <a href="https://www.instagram.com/_theunknownclassmate_?igsh=MTRnMXNqYjgxaXo5Ng%3D%3D&utm_source=qr" className="social-hover-btn btn-instagram" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 448 512" className="social-svg-icon"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg>
              </a>
              <a href="https://github.com/TheGsChan" className="social-hover-btn btn-github" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 496 512" className="social-svg-icon"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" /></svg>
              </a>
              <a href="mailto:gaurav97422@gmail.com" className="social-hover-btn btn-gmail" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 512 512" className="social-svg-icon"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" /></svg>
              </a>
            </div>
          </div>
          <div className="clippathgroup-thq-rectangle4-elm">
            {/* Bottom bar - restored as CSS border div */}
            <div style={{ width: '100%', height: '3px', background: 'rgba(0,0,0,0.15)', marginTop: '30px' }} />
          </div>
          <span className="clippathgroup-thq-text-elm197 watermark-shine">
            all rights reserved _.theUKC_
          </span>

          {/* Old icons removed */}
          <video
            src="/herogg.webm"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            onTimeUpdate={handleTimeUpdate}
            className="clippathgroup-video"
          ></video>
          <span className="clippathgroup-thq-text-elm198">
            Gaurav
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
        </div>
        <div className="clippathgroup-thq-frame-motionedits-mystrengthliesthemost-elm">
          <span className="clippathgroup-thq-text-elm199" style={{ display: 'block', overflow: 'hidden' }}>
            <RollingText
              text="| MOTION EDITS |"
              delay={0}
              stagger={38}
              duration={540}
              className="rolling-title"
            />
          </span>
          <span className="clippathgroup-thq-text-elm200" style={{ display: 'block', overflow: 'hidden' }}>
            <RollingText
              text="My strength lies the most..."
              delay={320}
              stagger={28}
              duration={420}
              className="rolling-subtitle"
            />
          </span>
        </div>
        <a
          href="https://play.teleporthq.io/signup"
          className="clippathgroup-link"
        >
          <div
            aria-label="Sign up to TeleportHQ"
            className="clippathgroup-container3"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 19 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="clippathgroup-icon1"
            >
              <path
                d="M9.1017 4.64355H2.17867C0.711684 4.64355 -0.477539 5.79975 -0.477539 7.22599V13.9567C-0.477539 15.3829 0.711684 16.5391 2.17867 16.5391H9.1017C10.5687 16.5391 11.7579 15.3829 11.7579 13.9567V7.22599C11.7579 5.79975 10.5687 4.64355 9.1017 4.64355Z"
                fill="#B23ADE"
              ></path>
              <path
                d="M10.9733 12.7878C14.4208 12.7878 17.2156 10.0706 17.2156 6.71886C17.2156 3.3671 14.4208 0.649963 10.9733 0.649963C7.52573 0.649963 4.73096 3.3671 4.73096 6.71886C4.73096 10.0706 7.52573 12.7878 10.9733 12.7878Z"
                fill="#FF5C5C"
              ></path>
              <path
                d="M17.7373 13.3654C19.1497 14.1588 19.1497 15.4634 17.7373 16.2493L10.0865 20.5387C8.67402 21.332 7.51855 20.6836 7.51855 19.0968V10.5141C7.51855 8.92916 8.67402 8.2807 10.0865 9.07221L17.7373 13.3654Z"
                fill="#2874DE"
              ></path>
            </svg>
            <span className="clippathgroup-text">Built in TeleportHQ</span>
          </div>
        </a>
      </div>
      <style jsx>
        {`
          .clippathgroup-container1 {
            width: 100%;
            display: block;
            overflow-x: hidden;
            overflow-y: visible;
            min-height: 100vh;
          }
          .clippathgroup-thq-clippathgroup-elm {
            width: 3537.332763671875px;
            height: 17839.6015625px;
            display: block;
            position: relative;
            align-self: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-myportfolio-elm {
            top: 193px;
            left: 335px;
            right: var(--dl-layout-space-threeunits);
            width: 1717px;
            height: 887.8323364257812px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm100 {
            left: 71px;
            color: transparent;
            -webkit-text-stroke: 3px #000000;
            bottom: -60px;
            height: auto;
            position: absolute;
            font-size: 800px;
            font-style: Regular;
            text-align: center;
            font-family: 'Djingo-Regular';
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            border-radius: var(--dl-layout-radius-radius4);
            text-transform: uppercase;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm101 {
            top: 51.47732925415039px;
            left: 46.6966552734375px;
            color: rgb(69, 69, 69);
            height: auto;
            position: absolute;
            font-size: 186.111px;
            transform: rotate(-15deg);
            font-style: Regular;
            text-align: left;
            transition: 0.3s;
            font-family: 'Geisha';
            font-weight: 400;
            line-height: normal;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
            border-width: 0px;
            font-stretch: normal;
            text-decoration: none;
          }

          .clippathgroup-thq-webmholder-elm {
            top: 88px;
            left: 720px;
            right: var(--dl-layout-space-threeunits);
            width: 938px;
            height: 1174px;
            position: absolute;
            animation-name: fadeIn;
            animation-delay: 0s;
            animation-duration: 800ms;
            animation-direction: normal;
            animation-iteration-count: 1;
            animation-timing-function: ease;
          }
          /* Portfolio particle wrapper */
          .portfolio-ptcl-wrap {
            overflow: hidden;
          }
          .portfolio-ptcl-wrap > div {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            pointer-events: none !important;
          }
          .portfolio-ptcl-wrap canvas {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          .clippathgroup-thq-herroplaceholder-elm {
            top: 16px;
            left: 722px;
            width: 938px;
            height: 1174px;
            position: absolute;
          }
          .clippathgroup-thq-cloud1-elm {
            top: 909px;
            left: 219px;
            width: 1892px;
            height: 584px;
            position: absolute;
            animation-name: fadeInUpBig;
            animation-delay: 0s;
            animation-duration: 2s;
            animation-direction: normal;
            animation-iteration-count: 1;
            animation-timing-function: ease;
          }
          .clippathgroup-thq-gaurav-sharma-elm {
            top: 578.60107421875px;
            left: 799.9736328125px;
            right: var(--dl-layout-space-threeunits);
            width: 198.0263671875px;
            height: 86.39892578125px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm102 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 35px;
            font-style: Regular;
            text-align: left;
            font-family: Ebrima;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm103 {
            top: 38.39892578125px;
            left: 51.0263671875px;
            color: rgba(14, 31, 241, 1);
            height: auto;
            position: absolute;
            font-size: 35px;
            font-style: Regular;
            text-align: left;
            font-family: Ebrima;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm104 {
            top: 1360px;
            left: 464px;
            color: rgba(0, 0, 0, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 62px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO - Demo;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm105 {
            color: rgba(0, 0, 0, 1);
          }
          .clippathgroup-thq-eyeanimation-elm {
            top: 2150.60107421875px;
            left: 204.3326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 1921px;
            height: 1052px;
            position: absolute;
          }
          .clippathgroup-thq-group1-elm {
            top: 1499.60107421875px;
            left: 315.20361328125px;
            right: var(--dl-layout-space-threeunits);
            width: 1686.79638671875px;
            height: 758.39892578125px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm107 {
            color: rgba(43, 43, 43, 1);
            height: auto;
            position: absolute;
            font-size: 396px;
            font-style: No. 45 Black Condensed;
            text-align: left;
            font-family: Pressio TEST;
            font-weight: 900;
            line-height: normal;
            font-stretch: condensed;
            text-decoration: none;
          }
          .clippathgroup-thq-group-elm1 {
            top: 280.39892578125px;
            left: 666.79638671875px;
            width: 1020px;
            height: 478px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm108 {
            color: rgba(33, 44, 232, 1);
            height: auto;
            position: absolute;
            font-size: 429px;
            font-style: Regular;
            text-align: left;
            font-family: Geisha;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-group2-elm {
            top: 3196.60107421875px;
            left: 315.3326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 1680.179931640625px;
            height: 1356px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm109 {
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 90px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO - Demo;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm110 {
            color: rgba(0, 0, 0, 1);
          }
          .clippathgroup-thq-text-elm112 {
            top: 215px;
            left: 21.17999267578125px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm113 {
            color: rgba(0, 0, 0, 1);
          }
          .clippathgroup-thq-text-elm115 {
            top: 285px;
            left: 61.77000427246094px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm116 {
            top: 425px;
            left: 29.07000732421875px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm117 {
            color: rgba(0, 0, 0, 1);
          }
          .clippathgroup-thq-text-elm119 {
            top: 495px;
            left: 80.19000244140625px;
            color: rgba(21, 38, 255, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm120 {
            top: 565px;
            left: 41.910003662109375px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm121 {
            top: 635px;
            left: 69.83999633789062px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm122 {
            top: 705px;
            left: 29.42999267578125px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm123 {
            top: 845px;
            left: 31.44000244140625px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm124 {
            color: rgba(0, 0, 0, 1);
          }
          .clippathgroup-thq-text-elm126 {
            top: 915px;
            left: 70.13999938964844px;
            color: rgba(28, 44, 255, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm127 {
            top: 985px;
            left: 38.52000427246094px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm128 {
            top: 1055px;
            left: 716.3699951171875px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm129 {
            top: 1195px;
            left: 77.63999938964844px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm130 {
            top: 1265px;
            left: 111.08999633789062px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 60px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm131 {
            top: 4696.60107421875px;
            left: 786.3326416015625px;
            color: rgba(0, 0, 0, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 90px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm132 {
            color: rgba(0, 0, 0, 1);
          }
          .clippathgroup-thq-line1-elm {
            top: 4862.10107421875px;
            left: 1165.832763671875px;
            right: var(--dl-layout-space-threeunits);
            width: 0px;
            height: 1896px;
            position: absolute;
            border-color: var(--dl-color-theme-neutral-dark);
            border-width: 3px;
          }
          .clippathgroup-thq-line2-elm {
            top: 5027.10107421875px;
            left: 567.8326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 598px;
            height: 1px;
            position: absolute;
            border-color: var(--dl-color-theme-neutral-dark);
            border-width: 3px;
          }
          .clippathgroup-thq-line3-elm {
            top: 5027.10107421875px;
            left: 567.8326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 0px;
            height: 147px;
            position: absolute;
            border-color: var(--dl-color-theme-neutral-dark);
            border-width: 3px;
          }
          .clippathgroup-thq-line4-elm {
            top: 5256.10107421875px;
            left: 1165.832763671875px;
            right: var(--dl-layout-space-threeunits);
            width: 596px;
            height: 1px;
            position: absolute;
            border-color: var(--dl-color-theme-neutral-dark);
            border-width: 3px;
          }
          .clippathgroup-thq-line5-elm {
            top: 5256.10107421875px;
            left: 1761.832763671875px;
            right: var(--dl-layout-space-threeunits);
            width: 0px;
            height: 68px;
            position: absolute;
            border-color: var(--dl-color-theme-neutral-dark);
            border-width: 3px;
          }
          .clippathgroup-thq-line6-elm {
            top: 5323.60107421875px;
            left: 1617;
            right: var(--dl-layout-space-threeunits);
            width: 150px;
            height: 1px;
            position: absolute;
            border-color: var(--dl-color-theme-neutral-dark);
            border-width: 3px;
          }
          .clippathgroup-thq-line7-elm {
            top: 5323.60107421875px;
            left: 1611.832763671875px;
            right: var(--dl-layout-space-threeunits);
            width: 0px;
            height: 100px;
            position: absolute;
            border-color: var(--dl-color-theme-neutral-dark);
            border-width: 3px;
          }
          .clippathgroup-thq-line8-elm {
            top: 6074.10107421875px;
            left: 625.8326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 540px;
            height: 1px;
            position: absolute;
            border-color: var(--dl-color-theme-neutral-dark);
            border-width: 3px;
          }
          .clippathgroup-thq-ellipse1-elm {
            top: 5165px;
            left: 559px;
            width: 20px;
            height: 20px;
            position: absolute;
          }
          .clippathgroup-thq-ellipse2-elm {
            top: 5423.60107421875px;
            left: 1605;
            right: var(--dl-layout-space-threeunits);
            width: 20px;
            height: 20px;
            position: absolute;
          }
          .clippathgroup-thq-ellipse3-elm {
            top: 6066px;
            left: 614px;
            width: 20px;
            height: 20px;
            position: absolute;
          }
          .clippathgroup-thq-text-elm134 {
            top: 5256.60107421875px;
            left: 315.3326416015625px;
            color: rgba(0, 17, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm135 {
            top: 5316.60107421875px;
            left: 315.3326416015625px;
            color: rgba(0, 17, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm136 {
            top: 5404.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm137 {
            top: 5454.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm138 {
            top: 5504.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm139 {
            top: 5554.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm140 {
            top: 5604.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm141 {
            top: 5654.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm142 {
            top: 5704.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm143 {
            top: 5526.60107421875px;
            left: 1218.332763671875px;
            color: rgba(0, 17, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm144 {
            top: 5586.60107421875px;
            left: 1218.332763671875px;
            color: rgba(0, 17, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm145 {
            top: 5683.60107421875px;
            left: 1218.332763671875px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm146 {
            color: rgba(112, 112, 112, 1);
          }
          .clippathgroup-thq-text-elm148 {
            top: 5733.60107421875px;
            left: 1218.332763671875px;
            color: rgba(17, 0, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm149 {
            color: rgba(17, 0, 255, 1);
          }
          .clippathgroup-thq-text-elm151 {
            top: 5783.60107421875px;
            left: 1218.332763671875px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm152 {
            top: 5833.60107421875px;
            left: 1218.332763671875px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm153 {
            color: rgba(112, 112, 112, 1);
          }
          .clippathgroup-thq-text-elm154 {
            color: rgba(17, 0, 255, 1);
          }
          .clippathgroup-thq-text-elm156 {
            top: 5883.60107421875px;
            left: 1218.332763671875px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm157 {
            top: 5933.60107421875px;
            left: 1218.332763671875px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm158 {
            top: 6033.60107421875px;
            left: 1218.332763671875px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm159 {
            top: 6083.60107421875px;
            left: 1218.332763671875px;
            color: rgba(17, 0, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm160 {
            color: rgba(17, 0, 255, 1);
          }
          .clippathgroup-thq-text-elm162 {
            top: 6133.60107421875px;
            left: 1218.332763671875px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm163 {
            color: rgba(112, 112, 112, 1);
          }
          .clippathgroup-thq-text-elm165 {
            top: 6183.60107421875px;
            left: 1218.332763671875px;
            color: rgba(17, 0, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm166 {
            top: 6233.60107421875px;
            left: 1218.332763671875px;
            color: rgba(17, 0, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm167 {
            color: rgba(17, 0, 255, 1);
          }
          .clippathgroup-thq-text-elm169 {
            top: 6283.60107421875px;
            left: 1218.332763671875px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm170 {
            top: 6125.60107421875px;
            left: 315.3326416015625px;
            color: rgba(0, 17, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm171 {
            top: 6185.60107421875px;
            left: 315.3326416015625px;
            color: rgba(0, 17, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm172 {
            top: 6315.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm173 {
            top: 6365.60107421875px;
            left: 315.3326416015625px;
            color: rgba(17, 0, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm174 {
            color: rgba(17, 0, 255, 1);
          }
          .clippathgroup-thq-text-elm176 {
            top: 6415.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm177 {
            top: 6465.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm178 {
            top: 6515.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm179 {
            color: rgba(112, 112, 112, 1);
          }
          .clippathgroup-thq-text-elm180 {
            color: rgba(17, 0, 255, 1);
          }
          .clippathgroup-thq-text-elm182 {
            top: 6565.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm183 {
            top: 6615.60107421875px;
            left: 315.3326416015625px;
            color: rgba(112, 112, 112, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 40px;
            font-style: Regular;
            text-align: left;
            font-family: Rozanova GEO;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm184 {
            top: 6835px;
            left: 861px;
            color: rgba(51, 64, 255, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 70px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova HUM - Demo;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm185 {
            color: rgba(51, 64, 255, 1);
          }
          .clippathgroup-thq-tool-icon-elm {
            top: 6980px;
            left: 0;
            width: 100%;
            height: 160px;
            position: absolute;
            overflow: visible;
          }
          .clippathgroup-thq-ellipse4-elm {
            top: 6749px;
            left: 1158px;
            width: 20px;
            height: 20px;
            position: absolute;
          }
          .clippathgroup-thq-text-elm187 {
            top: 7225px;
            left: 376px;
            color: transparent;
            -webkit-text-stroke: 3px #000000;
            height: auto;
            position: absolute;
            font-size: 900px;
            font-style: Regular;
            text-align: center;
            font-family: Djingo;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            letter-spacing: 8px;
            text-decoration: none;
          }
          .clippathgroup-thq-awardspng-elm {
            top: 7070.60107421875px;
            left: 603.3326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 988px;
            height: 1156px;
            position: absolute;
          }
          /* Particle overlay wrapper */
          .awards-ptcl-wrap {
            overflow: hidden;
          }
          /* tsparticles outer div + injected canvas — must fill wrapper */
          .awards-ptcl-wrap > div {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            pointer-events: none !important;
          }
          .awards-ptcl-wrap canvas {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }

          .clippathgroup-thq-cloud3-elm {
            top: 8095px;
            left: 205.3326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 1920px;
            height: 496.60107421875px;
            display: flex;
            position: absolute;
            align-items: center;
            flex-shrink: 1;
            justify-content: center;
          }
          .clippathgroup-thq-vector-elm10 {
            right: -88px;
            width: 1920px;
            bottom: -1px;
            height: 497px;
            display: flex;
            position: absolute;
          }
          .clippathgroup-thq-vector-elm11 {
            width: 1919px;
            height: 496px;
            border-radius: blur(800px);
            border-top-left-radius: var(--dl-layout-radius-round);
            border-top-right-radius: var(--dl-layout-radius-imageradius);
          }
          .clippathgroup-thq-pensubtleshadow11-elm1 {
            top: -2750px;
            right: -1098px;
            width: 1850px;
            height: 2053px;
            position: absolute;
            margin-bottom: 4px;
          }
          .clippathgroup-thq-group-elm2 {
            top: 7856.60107421875px;
            left: 862.8716430664062px;
            right: var(--dl-layout-space-threeunits);
            width: 913px;
            height: 289px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm188 {
            color: rgba(17, 0, 255, 1);
            height: auto;
            position: absolute;
            font-size: 263px;
            font-style: Regular;
            text-align: left;
            font-family: Djingo;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-illuscertifie-dpagestojpg0001-elm {
            top: 9152.87109375px;
            left: 755.3326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 821px;
            height: 634px;
            position: absolute;
          }
          .clippathgroup-thq-certificate-tdgaurmg1357pagestojpg0001-elm {
            top: 8364.6015625px;
            left: 281.4436340332031px;
            right: var(--dl-layout-space-threeunits);
            width: 821px;
            height: 634px;
            position: absolute;
          }
          .clippathgroup-thq-premiurepr-opage0001-elm {
            top: 8364.6015625px;
            left: 1218.332763671875px;
            right: var(--dl-layout-space-threeunits);
            width: 812px;
            height: 627px;
            position: absolute;
          }
          .clippathgroup-thq-group-elm3 {
            top: 10366px;
            left: 1070px;
            right: var(--dl-layout-space-threeunits);
            width: 725px;
            height: 378px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm189 {
            top: -420;
            left: -670;
            color: transparent;
            -webkit-text-stroke: 3px #000000;
            height: auto;
            position: absolute;
            font-size: 770px;
            font-style: Regular;
            text-align: right;
            font-family: Djingo;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            letter-spacing: 25;
            text-decoration: none;
          }
          .clippathgroup-thq-pensubtleshadow11-elm2 {
            top: -1124px;
            left: -960px;
            width: 1850px;
            height: 2053px;
            position: absolute;
            margin-bottom: 4px;
          }
          .clippathgroup-container2 {
            flex: 0 0 auto;
            width: 100%;
            height: 100px;
            display: flex;
            align-items: flex-start;
          }
          .clippathgroup-thq-text-elm190 {
            color: rgba(33, 44, 232, 1);
            height: auto;
            position: absolute;
            font-size: 339px;
            font-style: Regular;
            text-align: left;
            font-family: Geisha;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-katman1-elm {
            top: 10547.12890625px;
            left: 1768.588623046875px;
            right: var(--dl-layout-space-threeunits);
            width: 148.16526794433594px;
            height: 237.809326171875px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-path1-elm {
            top: -0.00020897141985187773px;
            left: -0.0000049810298605734715px;
            width: 148px;
            height: 238px;
            position: absolute;
          }


          /* ═══════════════════════════════════════════════════════
             PORTFOLIO CAROUSEL SYSTEM
             ═══════════════════════════════════════════════════════ */

          /* Container overrides — full canvas width, seamless edge-to-edge */
          .clippathgroup-thq-videoui-elm.portfolio-carousel-wrap,
          .clippathgroup-thq-graphicsui-elm.portfolio-carousel-wrap,
          .clippathgroup-thq-typography-elm.portfolio-carousel-wrap,
          .clippathgroup-thq-hobiies-elm.portfolio-carousel-wrap {
            left: 0 !important;
            width: 3537px !important;
            overflow: hidden !important;
            display: block !important;
            background: none !important;
            border: none !important;
            border-radius: 0 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            box-shadow: none !important;
          }

          /* individual element positions kept from original */
          .clippathgroup-thq-videoui-elm {
            top: 11501.6015625px;
            left: 205.3326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 1920px;
            height: 981px;
            position: absolute;
            flex-shrink: 1;
          }

          /* Scrolling track */
          @keyframes pf-scroll-ltr {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @keyframes pf-scroll-rtl {
            from { transform: translateX(-50%); }
            to   { transform: translateX(0); }
          }

          .portfolio-carousel {
            display: flex;
            gap: 32px;
            width: max-content;
            padding: 36px 40px;
            animation: pf-scroll-ltr 28s linear infinite;
            will-change: transform;
          }
          .portfolio-carousel:hover {
            animation-play-state: paused;
          }
          .pf-carousel--rtl {
            animation: pf-scroll-rtl 28s linear infinite;
          }
          .pf-carousel--rtl:hover {
            animation-play-state: paused;
          }

          /* Card */
          .pf-card {
            flex: 0 0 auto;
            width: 500px;
            height: 840px;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
            background: #111;
            box-shadow: 0 4px 32px rgba(0,0,0,0.25);
          }
          .pf-card:hover {
            transform: scale(1.04) translateY(-8px);
            box-shadow: 0 24px 64px rgba(0,0,0,0.40);
          }

          /* Image */
          .pf-card__img-wrap {
            width: 100%;
            height: 680px;
            overflow: hidden;
            position: relative;
          }
          .pf-card__img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
            display: block;
          }
          .pf-card:hover .pf-card__img {
            transform: scale(1.07);
          }

          /* Tag badge */
          .pf-card__tag {
            position: absolute;
            top: 18px;
            right: 18px;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 2px;
            padding: 6px 18px;
            border-radius: 50px;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            background: rgba(255,255,255,0.18);
            border: 1.5px solid rgba(255,255,255,0.35);
            color: #fff;
            font-family: 'Inter', sans-serif;
            pointer-events: none;
          }

          /* Card label */
          .pf-card__label {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 160px;
            display: flex;
            align-items: flex-end;
            padding: 24px 28px;
            font-size: 30px;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.5px;
            color: #fff;
            background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
          }

          /* Color themes — accent glow border on hover */
          .pf-card--blue { border: 2px solid rgba(0,17,255,0.15); }
          .pf-card--blue:hover { border-color: rgba(0,17,255,0.6); box-shadow: 0 0 40px rgba(0,17,255,0.25), 0 24px 64px rgba(0,0,0,0.40); }
          .pf-card--blue .pf-card__tag { background: rgba(0,17,255,0.35); border-color: rgba(0,80,255,0.5); }

          .pf-card--purple { border: 2px solid rgba(130,0,255,0.15); }
          .pf-card--purple:hover { border-color: rgba(130,0,255,0.6); box-shadow: 0 0 40px rgba(130,0,255,0.25), 0 24px 64px rgba(0,0,0,0.40); }
          .pf-card--purple .pf-card__tag { background: rgba(130,0,255,0.35); border-color: rgba(160,60,255,0.5); }

          .pf-card--gold { border: 2px solid rgba(200,150,0,0.15); }
          .pf-card--gold:hover { border-color: rgba(220,170,0,0.6); box-shadow: 0 0 40px rgba(220,170,0,0.25), 0 24px 64px rgba(0,0,0,0.40); }
          .pf-card--gold .pf-card__tag { background: rgba(180,130,0,0.45); border-color: rgba(220,180,0,0.5); }

          .pf-card--green { border: 2px solid rgba(0,180,80,0.15); }
          .pf-card--green:hover { border-color: rgba(0,200,80,0.6); box-shadow: 0 0 40px rgba(0,200,80,0.20), 0 24px 64px rgba(0,0,0,0.40); }
          .pf-card--green .pf-card__tag { background: rgba(0,140,60,0.40); border-color: rgba(0,200,80,0.5); }

          .clippathgroup-thq-vector-elm12 {
            top: 0px;
            left: 0px;
            width: 1920px;
            height: 981px;
            position: absolute;
          }
          .clippathgroup-thq-vector-elm13 {
            top: 0.5px;
            left: 0.5px;
            width: 1919px;
            height: 980px;
            position: absolute;
          }
          .clippathgroup-thq-group-elm4 {
            top: 10669px;
            left: 205px;
            right: var(--dl-layout-space-threeunits);
            width: 803.2303466796875px;
            height: 565.5232543945312px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-stripcrime-elm {
            top: 40px;
            left: 8px;
            width: 794px;
            height: 617px;
            position: absolute;
            min-width: 100%;
            min-height: 100%;
          }
          .clippathgroup-thq-graphicsui-elm {
            top: 12759.6015625px;
            left: 205.3326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 1920px;
            height: 981px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-vector-elm14 {
            top: 0px;
            left: 0px;
            width: 1920px;
            height: 981px;
            position: absolute;
          }
          .clippathgroup-thq-vector-elm15 {
            top: 0.5px;
            left: 0.5px;
            width: 1919px;
            height: 980px;
            position: absolute;
          }
          .clippathgroup-thq-frame-graphicswork-someartsomeedits-elm {
            top: 12558.6015625px;
            left: 902.0326538085938px;
            right: var(--dl-layout-space-threeunits);
            width: 604px;
            height: 136px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm191 {
            left: 31.77496337890625px;
            color: rgba(0, 17, 255, 1);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO - Demo;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm192 {
            top: 60px;
            color: rgba(0, 0, 0, 1);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova GEO - Demo;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-typography-elm {
            top: 14112px;
            left: 206px;
            width: 1920px;
            height: 981px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-vector-elm16 {
            top: 0px;
            left: 0px;
            width: 1920px;
            height: 981px;
            position: absolute;
          }
          .clippathgroup-thq-vector-elm17 {
            top: 0.5px;
            left: 0.5px;
            width: 1919px;
            height: 980px;
            position: absolute;
          }
          .clippathgroup-thq-frame-typography-usualtyping-practices-elm {
            top: 13816.6015625px;
            left: 877.0076293945312px;
            right: var(--dl-layout-space-threeunits);
            width: 648px;
            height: 175px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm193 {
            left: 94.75px;
            color: rgba(0, 17, 255, 1);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova HUM;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm194 {
            top: 60px;
            color: rgb(0, 0, 0);
            height: auto;
            position: absolute;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: left;
            font-family: Rozanova HUM;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-group-elm5 {
            left: 1166px;
            width: 686px;
            bottom: 1990px;
            height: 213px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-text-elm195 {
            top: -324px;
            left: -542px;
            color: transparent;
            -webkit-text-stroke: 3px #000000;
            height: auto;
            margin: auto;
            position: absolute;
            font-size: 600px;
            font-style: Regular;
            text-align: right;
            font-family: Djingo;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            letter-spacing: 25px;
            text-decoration: none;
          }
          .clippathgroup-thq-text-elm196 {
            color: rgba(33, 44, 232, 1);
            height: auto;
            position: absolute;
            font-size: 191px;
            font-style: Regular;
            text-align: left;
            font-family: Geisha;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-thq-hobiies-elm {
            left: 208px;
            width: 1920px;
            bottom: 1050px;
            height: 981px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-vector-elm18 {
            top: 0px;
            left: 0px;
            width: 1920px;
            height: 981px;
            position: absolute;
          }
          .clippathgroup-thq-vector-elm19 {
            top: 0.5px;
            left: 0.5px;
            width: 1919px;
            height: 980px;
            position: absolute;
          }
          .clippathgroup-thq-hireme-elm {
            left: 50%;
            transform: translateX(-50%);
            top: 17200px;
            width: 400px;
            height: 120px;
            display: flex;
            position: absolute;
            align-items: center;
            justify-content: center;
            z-index: 100;
          }
          .hireme-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            outline: none;
            cursor: pointer;
            width: 290px;
            height: 90px;
            background-image: linear-gradient(to top, #D8D9DB 0%, #fff 80%, #FDFDFD 100%);
            border-radius: 45px;
            border: 1px solid #8F9092;
            transition: all 0.2s ease;
            font-family: 'Source Sans Pro', 'Segoe UI', sans-serif;
            font-size: 26px;
            font-weight: 700;
            color: #606060;
            text-shadow: 0 1px #fff;
            letter-spacing: 3px;
          }
          .hireme-btn:hover {
            box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 3px 3px #CECFD1;
          }
          .hireme-btn:active {
            box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
          }
          .clippathgroup-thq-rectangle4-elm {
            top: 17776.6015625px;
            left: 205.3326416015625px;
            right: var(--dl-layout-space-threeunits);
            width: 1920px;
            height: 63px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-vector-elm21 {
            top: -41px;
            right: -25;
            width: 1920px;
            height: 63px;
            margin: var(--dl-layout-space-twounits);
            position: absolute;
          }
          .clippathgroup-thq-text-elm197 {
            color: rgba(255, 255, 255, 0.6);
            left: 1168px;
            transform: translateX(-50%);
            bottom: 40px;
            height: auto;
            position: absolute;
            font-size: 22px;
            white-space: nowrap;
            font-style: Regular;
            text-align: center;
            font-family: Inter;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
            z-index: 50;
          }
          .clippathgroup-thq-contact-elm {
            left: 937px;
            width: 457px;
            bottom: 274px;
            height: 63px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .clippathgroup-thq-instagram-elm {
            top: 0px;
            left: 0px;
            width: 69px;
            height: 63px;
            position: absolute;
          }
          .clippathgroup-thq-blackinstagramicon-elm {
            top: 11.099609375px;
            left: 14.1004638671875px;
            width: 41px;
            height: 41px;
            position: absolute;
          }
          .clippathgroup-thq-whatsapp-elm {
            top: 0px;
            left: 194px;
            width: 69px;
            height: 63px;
            position: absolute;
          }
          .clippathgroup-thq-whatsappicon-elm {
            top: 11.005859375px;
            left: 208.1500244140625px;
            width: 41px;
            height: 41px;
            position: absolute;
          }
          .clippathgroup-thq-gmail-elm {
            top: 0px;
            left: 388px;
            width: 69px;
            height: 63px;
            position: absolute;
          }
          .clippathgroup-thq-mailicon-elm {
            top: 17.9765625px;
            left: 403.0789794921875px;
            width: 39px;
            height: 27px;
            position: absolute;
          }
          .clippathgroup-video {
            width: 320px;
            height: 180px;
          }
          .clippathgroup-thq-text-elm198 {
            top: 671px;
            left: 1182px;
            transform-origin: top left;
            /* scale is now controlled by GSAP to avoid transform conflicts */
            color: rgba(219, 219, 219, 1);
            right: var(--dl-layout-space-threeunits);
            height: auto;
            position: absolute;
            font-size: 437px;
            font-style: Regular;
            text-align: left;
            font-family: Geisha;
            font-weight: 400;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
            will-change: transform;
            backface-visibility: hidden;
          }
          .clippathgroup-thq-frame-motionedits-mystrengthliesthemost-elm {
            top: 11320px;
            left: 841px;
            width: 723px;
            height: 136px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            flex-shrink: 1;
            text-align: center;
          }
          .clippathgroup-thq-text-elm199 {
            color: rgba(0, 17, 255, 1);
            height: auto;
            position: relative;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: center;
            font-family: Rozanova GEO - Demo;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
                    .clippathgroup-thq-text-elm200 {
            height: auto;
            position: relative;
            font-size: 50px;
            font-style: Semi Bold;
            text-align: center;
            font-family: Rozanova GEO - Demo;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .clippathgroup-link {
            display: contents;
          }
          .clippathgroup-container3 {
            right: 50px;
            border: 1px solid #ffffff5c;
            bottom: 30px;
            display: flex;
            z-index: 22;
            position: fixed;
            box-shadow: 5px 5px 10px 0px rgba(31, 31, 31, 0.4);
            min-height: auto;
            align-items: center;
            padding-top: 8px;
            padding-left: 12px;
            border-radius: 8px;
            padding-right: 12px;
            padding-bottom: 8px;
            backdrop-filter: blur(6px);
            background-color: rgba(41, 41, 41, 0.41);
          }
          .clippathgroup-icon1 {
            width: 24px;
            margin-right: 4px;
          }
          .clippathgroup-text {
            color: white;
            font-size: 13px;
            font-style: normal;
            font-weight: 500;
            line-height: 24px;
          }
        `}
      </style>
    </ScaleWrapper>
  );
}

export default Clippathgroup


