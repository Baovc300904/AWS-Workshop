import { useEffect, useState } from 'react';
import './BackToTop.css';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setShow(y > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTop() {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  }

  return (
    <button
      type="button"
      className="to-top-btn"
      aria-label="Back to top"
      data-show={show || undefined}
      onClick={scrollTop}
    >
      <span className="arrow" aria-hidden>
        ▲
      </span>
    </button>
  );
}
