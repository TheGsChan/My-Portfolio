import React, { useState, useEffect } from "react";

export function TypingAnimation({ 
  words = [], 
  loop = true, 
  className = "", 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  delayBetweenWords = 1500 
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    let timer;
    const currentWord = words[currentWordIndex];

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        if (!loop && currentWordIndex === words.length - 1) return;
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (currentText === currentWord) {
        timer = setTimeout(() => setIsDeleting(true), delayBetweenWords);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, loop, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span className={className}>
      {currentText}
      <span style={{ animation: "blink 1s step-end infinite", fontWeight: "300" }}>|</span>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes blink { 50% { opacity: 0; } }` }} />
    </span>
  );
}
