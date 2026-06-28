import React, { useState, useEffect } from "react";

export function DualTypingAnimation({ 
  wordPairs = [], 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  delayBetweenWords = 2000 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTop, setCurrentTop] = useState("");
  const [currentBottom, setCurrentBottom] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!wordPairs || wordPairs.length === 0) return;

    let timer;
    const { top: targetTop, bottom: targetBottom } = wordPairs[currentIndex];

    if (isDeleting) {
      if (currentTop === "" && currentBottom === "") {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % wordPairs.length);
      } else {
        timer = setTimeout(() => {
          setCurrentTop(targetTop.substring(0, currentTop.length - 1));
          setCurrentBottom(targetBottom.substring(0, currentBottom.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (currentTop === targetTop && currentBottom === targetBottom) {
        timer = setTimeout(() => setIsDeleting(true), delayBetweenWords);
      } else {
        timer = setTimeout(() => {
          if (currentTop.length < targetTop.length) {
             setCurrentTop(targetTop.substring(0, currentTop.length + 1));
          }
          if (currentBottom.length < targetBottom.length) {
             setCurrentBottom(targetBottom.substring(0, currentBottom.length + 1));
          }
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [currentTop, currentBottom, isDeleting, currentIndex, wordPairs, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
      <span className="clippathgroup-thq-text-elm102" style={{ position: 'relative', top: 'auto', left: 'auto', fontSize: '42px' }}>
        {currentTop}
        <span style={{ animation: "blink 1s step-end infinite", fontWeight: "300" }}>|</span>
      </span>
      <span className="clippathgroup-thq-text-elm103" style={{ position: 'relative', top: 'auto', left: 'auto', marginLeft: '35px', marginTop: '3px', fontSize: '42px', color: 'rgba(14, 31, 241, 1)' }}>
        {currentBottom}
        <span style={{ animation: "blink 1s step-end infinite", fontWeight: "300" }}>|</span>
      </span>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes blink { 50% { opacity: 0; } }` }} />
    </div>
  );
}
