import React, { useRef, useState, useEffect } from 'react';

export default function SeamlessVideoLoop({ src, crossfadeDuration = 1.5, ...props }) {
  const [activeVid, setActiveVid] = useState(1);
  const [vid2Opacity, setVid2Opacity] = useState(0);

  const vid1Ref = useRef(null);
  const vid2Ref = useRef(null);
  
  const hasTriggeredRef = useRef(false);

  const handleTimeUpdate = (e, vidNum) => {
    const vid = e.target;
    
    // Forward the onTimeUpdate event if provided via props
    if (props.onTimeUpdate) {
      props.onTimeUpdate(e);
    }
    
    if (!vid.duration) return;
    
    const timeRemaining = vid.duration - vid.currentTime;
    
    // Pre-seek the inactive video so its first frame is already loaded in memory
    if (activeVid === vidNum && vid.currentTime > 1 && vid.currentTime < 3) {
      const inactiveVid = vidNum === 1 ? vid2Ref.current : vid1Ref.current;
      if (inactiveVid && inactiveVid.currentTime !== 0) {
        inactiveVid.pause();
        inactiveVid.currentTime = 0;
      }
    }

    if (activeVid === vidNum && timeRemaining <= crossfadeDuration && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      
      const nextVid = vidNum === 1 ? vid2Ref.current : vid1Ref.current;
      if (nextVid) {
        nextVid.currentTime = 0;
        nextVid.play().catch(e => console.log(e));
        
        setActiveVid(vidNum === 1 ? 2 : 1);
        setVid2Opacity(vidNum === 1 ? 1 : 0);
        
        // Reset the trigger lock after the crossfade completes
        setTimeout(() => {
          hasTriggeredRef.current = false;
        }, crossfadeDuration * 1000 + 100);
      }
    }
  };

  const commonStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: props.style?.objectFit || 'cover',
  };

  return (
    <div className={props.className} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...(props.containerStyle || {}) }}>
      <video
        ref={vid1Ref}
        src={src}
        autoPlay
        muted
        playsInline
        loop // fallback just in case JS lags
        onTimeUpdate={(e) => handleTimeUpdate(e, 1)}
        style={{ ...commonStyle, zIndex: 1, opacity: 1, ...props.style }}
      />
      <video
        ref={vid2Ref}
        src={src}
        muted
        playsInline
        loop
        onTimeUpdate={(e) => handleTimeUpdate(e, 2)}
        style={{ 
          ...commonStyle, 
          zIndex: 2, 
          opacity: vid2Opacity,
          transition: `opacity ${crossfadeDuration}s linear`,
          ...props.style 
        }}
      />
    </div>
  );
}
