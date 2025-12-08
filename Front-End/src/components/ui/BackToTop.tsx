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

  const handleWhatsApp = () => {
    // Replace with your WhatsApp number (format: country code + number without +)
    const phoneNumber = '84123456789'; // Example: Vietnam number
    const message = encodeURIComponent('Xin chào! Tôi cần hỗ trợ về shop game.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleZalo = () => {
    // Replace with your Zalo OA ID or phone number
    const zaloNumber = '84123456789'; // Example: Vietnam number
    window.open(`https://zalo.me/${zaloNumber}`, '_blank');
  };

  return (
    <div className="floating-buttons-container" data-show={show || undefined}>
      {/* WhatsApp Button */}
      <button
        type="button"
        className="floating-btn whatsapp-btn"
        aria-label="Contact via WhatsApp"
        onClick={handleWhatsApp}
        title="Liên hệ qua WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

      {/* Zalo Button */}
      <button
        type="button"
        className="floating-btn zalo-btn"
        aria-label="Contact via Zalo"
        onClick={handleZalo}
        title="Liên hệ qua Zalo"
      >
        <svg viewBox="0 0 48 48" fill="currentColor" width="24" height="24">
          <path d="M24 4C13 4 4 12.97 4 24c0 4.85 1.67 9.33 4.46 12.85L4 44l7.43-4.35A19.86 19.86 0 0024 44c11 0 20-8.97 20-20S35 4 24 4zm9.52 27.27c-.48.73-1.77 1.35-2.91 1.54-.77.13-1.77.24-5.15-1.11-4.33-1.74-7.15-6.15-7.37-6.44-.22-.28-1.82-2.42-1.82-4.61 0-2.2 1.15-3.28 1.56-3.73.41-.44.89-.56 1.18-.56.3 0 .59.01.85.02.27.01.64-.1 1 .76.37.88 1.26 3.07 1.37 3.29.11.23.18.49.04.79-.15.29-.22.47-.44.73-.22.25-.46.56-.66.75-.22.21-.45.44-.19.86.25.42 1.13 1.87 2.43 3.03 1.67 1.49 3.07 1.96 3.51 2.18.44.22.7.18.96-.11.25-.29 1.09-1.27 1.38-1.71.29-.44.59-.37.99-.22.4.15 2.54 1.2 2.98 1.42.44.22.73.33.84.51.1.18.1.96-.38 1.69z"/>
        </svg>
      </button>

      {/* Back to Top Button */}
      <button
        type="button"
        className="floating-btn to-top-btn"
        aria-label="Back to top"
        onClick={scrollTop}
        title="Về đầu trang"
      >
        <span className="arrow" aria-hidden>
          ▲
        </span>
      </button>
    </div>
  );
}
