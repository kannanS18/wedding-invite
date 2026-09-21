import React, { useRef, useState, useCallback } from 'react';
import { CLOCK_CONFIG } from '../config';

interface PhotoItem {
  id: string;
  src: string;
  webpSrc?: string;
  fullSrc?: string;
  title: string;
  caption: string;
  objectPosition?: string;
}

export const PhotoGallerySection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  // Divide the 8 photos into two rows of 4
  const row1 = CLOCK_CONFIG.gallery.slice(0, 4);
  const row2 = CLOCK_CONFIG.gallery.slice(4, 8);

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Smooth button scroll left / right
  const scrollRow = useCallback((ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const distance = Math.min(ref.current.clientWidth * 0.75, 420);
    ref.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  }, []);

  return (
    <section
      id="gallerySection"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        backgroundColor: '#1E1715',
        background: 'radial-gradient(circle at 50% 35%, #2A1F1B 0%, #150F0E 100%)',
        padding: '90px 0 100px',
        overflowX: 'hidden',
        color: '#FAF7F2',
      }}
    >
      {/* Background Subtle Gold Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '750px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section Header */}
      <div style={{ textAlign: 'center', padding: '0 20px 32px', position: 'relative', zIndex: 10 }}>
        <span
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.28em',
            color: '#D4AF37',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          ✦ SACRED CHAPTERS ✦
        </span>
        <h2
          style={{
            fontFamily: '"Great Vibes", cursive',
            fontSize: 'clamp(42px, 7.5vw, 68px)',
            fontWeight: 400,
            color: '#FAF7F2',
            margin: '0 auto 8px',
            textShadow: '0 2px 16px rgba(212, 175, 55, 0.25)',
          }}
        >
          Our Love Story in Frames
        </h2>
        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(13px, 2vw, 16px)',
            fontStyle: 'italic',
            color: '#C4B5A5',
            maxWidth: '540px',
            margin: '0 auto 16px',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
          }}
        >
          Scroll or swipe left and right to explore all 8 sacred moments.
        </p>

        {/* Interactive Gesture Helper Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '20px',
            padding: '6px 18px',
            color: '#F7E7B4',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            animation: 'gentleShine 2.5s infinite ease-in-out',
          }}
        >
          <span style={{ animation: 'nudgeLeft 1.5s infinite ease-in-out' }}>‹</span>
          <span>SWIPE LEFT &amp; RIGHT TO SEE ALL IMAGES</span>
          <span style={{ animation: 'nudgeRight 1.5s infinite ease-in-out' }}>›</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MANUAL HORIZONTAL SCROLL RIBBONS WITH ARROW CONTROLS
          ══════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', width: '100%' }}>
        {/* ROW 1: Traditional & Ceremony Moments */}
        <ScrollableRow
          rowRef={row1Ref}
          title="CHAPTER I • SACRED TRADITIONS"
          items={row1}
          onSelect={setSelectedPhoto}
          onScrollLeft={() => scrollRow(row1Ref, 'left')}
          onScrollRight={() => scrollRow(row1Ref, 'right')}
        />

        {/* ROW 2: Celebrations & Lifelong Companionship */}
        <ScrollableRow
          rowRef={row2Ref}
          title="CHAPTER II • CELEBRATION &amp; COMPANIONSHIP"
          items={row2}
          onSelect={setSelectedPhoto}
          onScrollLeft={() => scrollRow(row2Ref, 'left')}
          onScrollRight={() => scrollRow(row2Ref, 'right')}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          INTERACTIVE LIGHTBOX MODAL
          ══════════════════════════════════════════════════════════════ */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 6, 5, 0.9)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            cursor: 'zoom-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#241B18',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.6)',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden',
              animation: 'modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#FFF',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
            {/* Master Detail Quality Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(20, 14, 12, 0.75)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: '12px',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#E8C872',
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                zIndex: 20,
              }}
            >
              <span>✦</span>
              <span>ULTRA HD MASTER</span>
            </div>

            <img
              src={selectedPhoto.fullSrc || selectedPhoto.src}
              alt={selectedPhoto.title}
              loading="eager"
              decoding="async"
              style={{
                width: '100%',
                maxHeight: '72vh',
                objectFit: 'contain',
                backgroundColor: '#120E0D',
                display: 'block',
              }}
            />
            <div style={{ padding: '20px 24px', textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '22px',
                  color: '#D4AF37',
                  marginBottom: '6px',
                }}
              >
                {selectedPhoto.title}
              </h3>
              <p
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: '13px',
                  color: '#C4B5A5',
                  lineHeight: 1.6,
                }}
              >
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-gallery-row::-webkit-scrollbar {
          display: none;
        }
        .custom-gallery-row {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        @keyframes modalPop {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes gentleShine {
          0%, 100% { border-color: rgba(212, 175, 55, 0.35); }
          50% { border-color: rgba(212, 175, 55, 0.75); }
        }
        @keyframes nudgeLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-4px); }
        }
        @keyframes nudgeRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
      `}</style>
    </section>
  );
};

const ScrollableRow: React.FC<{
  rowRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  items: PhotoItem[];
  onSelect: (item: PhotoItem) => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}> = ({ rowRef, title, items, onSelect, onScrollLeft, onScrollRight }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Mouse Drag-to-Scroll handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeftState(rowRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !rowRef.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 6) {
      setHasDragged(true);
    }
    rowRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Row Subtitle Header & Navigation Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 max(env(safe-area-inset-left, 24px), 24px) 12px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <span
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#D4AF37',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </span>

        {/* Manual Arrow Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onScrollLeft}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: '#F7E7B4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.25)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Scroll Left"
            aria-label="Scroll left to previous photos"
          >
            ‹
          </button>

          <button
            onClick={onScrollRight}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: '#F7E7B4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.25)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Scroll Right"
            aria-label="Scroll right to next photos"
          >
            ›
          </button>
        </div>
      </div>

      {/* Manual Scrollable Container (Native Touch-Swipe + Mouse Drag) */}
      <div
        ref={rowRef}
        className="custom-gallery-row"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x proximity',
          padding: '10px max(env(safe-area-inset-left, 24px), 24px)',
          cursor: isMouseDown ? 'grabbing' : 'grab',
          userSelect: 'none',
          scrollBehavior: 'smooth',
          width: '100%',
        }}
      >
        {items.map((item) => (
          <PhotoCard
            key={item.id}
            item={item}
            onSelect={(selected) => {
              if (!hasDragged) {
                onSelect(selected);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

const PhotoCard: React.FC<{
  item: PhotoItem;
  onSelect: (item: PhotoItem) => void;
}> = ({ item, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onSelect(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: 'clamp(230px, 68vw, 320px)',
        height: 'clamp(320px, 42vw, 440px)',
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: isHovered ? '2px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: isHovered
          ? '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 24px rgba(212, 175, 55, 0.45)'
          : '0 10px 30px rgba(0, 0, 0, 0.45)',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease',
        flexShrink: 0,
        scrollSnapAlign: 'start',
      }}
    >
      <picture style={{ width: '100%', height: '100%', display: 'block' }}>
        {item.webpSrc && <source srcSet={item.webpSrc} type="image/webp" />}
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: item.objectPosition || 'center 20%',
            display: 'block',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
          }}
        />
      </picture>
      {/* Bottom Gradient with Caption */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(15, 10, 8, 0.94) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '18px',
        }}
      >
        <span
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#D4AF37',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          {item.title}
        </span>
        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '13px',
            fontStyle: 'italic',
            color: '#FAF7F2',
            margin: 0,
            lineHeight: 1.4,
            opacity: 0.92,
          }}
        >
          {item.caption}
        </p>
      </div>
    </div>
  );
};
