import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

interface Props {
  strings: string[];
  className?: string;
}

export default function TypedText({ strings, className = '' }: Props) {
  const el = useRef<HTMLSpanElement>(null);
  const typed = useRef<Typed | null>(null);

  useEffect(() => {
    if (el.current) {
      typed.current = new Typed(el.current, {
        strings,
        typeSpeed: 65,
        backSpeed: 65,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    }

    return () => {
      typed.current?.destroy();
    };
  }, [strings]);

  return <span ref={el} className={className} />;
}