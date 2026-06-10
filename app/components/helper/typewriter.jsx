'use client';

import { useEffect, useState } from 'react';

const Typewriter = ({ words }) => {
  const [mounted, setMounted] = useState(false);

  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Ensure it runs only on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const currentWord = words[wordIndex];

    const type = () => {
      if (!isDeleting) {
        setText((prev) => currentWord.substring(0, prev.length + 1));

        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        setText((prev) => currentWord.substring(0, prev.length - 1));

        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const timeout = setTimeout(type, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, mounted]);

  // ✅ Prevent server mismatch
  if (!mounted) {
    return <span className="text-[#16f2b3]">{words[0]}</span>;
  }

  return (
    <span className="text-[#16f2b3]">
      {text}
      <span className="animate-pulse ml-1">|</span>
    </span>
  );
};

export default Typewriter;