'use client';

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";

export default function ImageSlider3D({
  images = [],
  duration = 32,
  cardAspectRatio = "7/10",
  containerClassName = "",
  imageClassName = "",
  rotationDirection = "left",
  withMask = true,
  defaultX = -733,
  defaultY = 0,
  defaultSize = 40,
  defaultPersp = 0,
  defaultTilt = 0,
}) {
  const n = images.length > 0 ? images.length : 12; 
  const prefersReducedMotion = useReducedMotion();
  const animationDuration = prefersReducedMotion ? duration * 4 : duration;

  const rotationValues = rotationDirection === "left" ? [0, 360] : [360, 0];

  // --- LOCKED FINAL VALUES PROVIDED BY USER ---
  const manualX = defaultX;
  const manualY = defaultY;
  const manualSize = defaultSize;
  const manualPersp = defaultPersp;
  const manualTilt = defaultTilt;

  // Math for intuitive perspective mappings
  const actualPerspective = manualPersp >= 0 ? 80 - (manualPersp * 0.7) : 80 - (manualPersp * 0.7); 
  const actualTiltX = 50 + (manualTilt / 2);

  const maskStyles = withMask
    ? {
      WebkitMask: "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
      mask: "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
    }
    : {};

  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Preload all images using decode() so they are ready before the carousel renders
  useEffect(() => {
    if (!images || images.length === 0) { setImagesLoaded(true); return; }
    const imageUrls = images.filter(src => !src.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i));
    if (imageUrls.length === 0) { setImagesLoaded(true); return; }

    let loaded = 0;
    const total = imageUrls.length;
    imageUrls.forEach(src => {
      const img = new Image();
      img.src = src;
      // decode() resolves when the image is fully decoded and GPU-ready
      img.decode()
        .then(() => { loaded++; if (loaded >= total) setImagesLoaded(true); })
        .catch(() => { loaded++; if (loaded >= total) setImagesLoaded(true); });
    });
    // Safety fallback — show carousel after 3s even if some images stall
    const t = setTimeout(() => setImagesLoaded(true), 3000);
    return () => clearTimeout(t);
  }, [images]);

  // Handle Visibility Pausing for both Video and 3D Rotation
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const videos = containerRef.current.querySelectorAll('video');
        
        if (entry.isIntersecting) {
          setIsVisible(true);
          videos.forEach(vid => {
            if (vid.paused) {
              vid.play().catch(e => console.log('Video autoplay blocked by browser:', e));
            }
          });
        } else {
          setIsVisible(false);
          videos.forEach(vid => vid.pause());
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: "grid",
        width: "100%",
        height: "100%",
        minHeight: "700px",
        overflow: "hidden",
        placeItems: "center",
        perspective: `${actualPerspective}em`, // BENDING STRENGTH
        perspectiveOrigin: `${actualTiltX}% 50%`, // BENDING POINT TILT
        ...maskStyles,
      }}
      className={containerClassName}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes carousel-rotate-left {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        @keyframes carousel-rotate-right {
          from { transform: rotateY(360deg); }
          to { transform: rotateY(0deg); }
        }
        .carousel-track-anim-left {
          animation: carousel-rotate-left ${animationDuration}s linear infinite;
        }
        .carousel-track-anim-right {
          animation: carousel-rotate-right ${animationDuration}s linear infinite;
        }
        .carousel-track-paused {
          animation-play-state: paused !important;
        }
      `}} />
      <div style={{
        display: "grid",
        placeSelf: "center",
        transform: `translate(${manualX}px, ${manualY}px)`,
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        pointerEvents: "none"
      }}>
        <div
          className={`carousel-track-anim-${rotationDirection} ${!isVisible ? 'carousel-track-paused' : ''}`}
          style={{
            display: "grid",
            placeSelf: "center",
            pointerEvents: "auto",
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
        {images.map((src, i) => {
          const isVideo = src.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i);
          const commonStyle = {
            display: "block",
            position: "relative",
            gridColumnStart: 1,
            gridRowStart: 1,
            borderRadius: "1.5em",
            width: `${manualSize}em`,
            aspectRatio: cardAspectRatio,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            cursor: "pointer", // Show pointer on hover
            transform: `rotateY(calc(${i} * (1turn / ${n}))) translateZ(calc(-1 * (0.5 * ${manualSize}em + 0.5em) / tan(0.5 * (1turn / ${n}))))`,
          };

          const handleMediaClick = () => {
            setActiveMedia(src);
          };

          if (isVideo) {
            return (
              <div key={i} style={commonStyle}>
                {/* INVISIBLE CLICK INTERCEPTOR OVERLAY */}
                <div 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, cursor: 'pointer' }}
                  onPointerDown={handleMediaClick}
                  onClick={handleMediaClick}
                  onTouchStart={handleMediaClick}
                />
                <video
                  src={src}
                  className={imageClassName}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit", pointerEvents: "none" }}
                  preload="metadata"
                  loop
                  muted
                  playsInline
                  onTimeUpdate={(e) => {
                    // Loop back to 0 if it crosses 4.5 seconds
                    if (e.target.currentTime >= 4.5) {
                      e.target.currentTime = 0;
                    }
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(200, 200, 200, 0.4)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  pointerEvents: 'none',
                  zIndex: 5
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '4px' }}>
                    <path d="M5 3L19 12L5 21V3Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            );
          }

          return (
            <div key={i} style={commonStyle}>
              {/* INVISIBLE CLICK INTERCEPTOR OVERLAY */}
              <div 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, cursor: 'pointer' }}
                onPointerDown={handleMediaClick}
                onClick={handleMediaClick}
                onTouchStart={handleMediaClick}
              />
              <img
                src={src}
                alt={`Slide ${i}`}
                className={imageClassName}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit", pointerEvents: "none" }}
                loading="lazy"
              />
            </div>
          );
        })}
        </div>
      </div>

      {/* --- DOT NAVIGATION --- */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 100
      }}>
        {images.map((src, i) => (
          <button 
            key={`dot-${i}`}
            onClick={() => setActiveMedia(src)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s ease, transform 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'scale(1.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.4)';
              e.target.style.transform = 'scale(1)';
            }}
            aria-label={`View item ${i + 1}`}
          />
        ))}
      </div>

      {/* --- FULLSCREEN LIGHTBOX PORTAL --- */}
      {mounted && activeMedia && createPortal(
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 999999, 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            pointerEvents: 'auto', backdropFilter: 'blur(10px)'
          }}
          onClick={() => setActiveMedia(null)}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {activeMedia.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i) ? (
              <video 
                src={activeMedia} controls autoPlay 
                style={{ maxWidth: '90%', maxHeight: '90%', outline: 'none', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} 
                onClick={(e) => e.stopPropagation()} 
              />
            ) : (
              <img 
                src={activeMedia} 
                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} 
                onClick={(e) => e.stopPropagation()} 
              />
            )}
            
            <button 
              onClick={() => setActiveMedia(null)}
              style={{ 
                position: 'absolute', top: '40px', right: '40px', color: 'white', 
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', 
                cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
