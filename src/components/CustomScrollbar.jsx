import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CustomScrollbar.css';

const CustomScrollbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartScrollY = useRef(0);
  const hideTimeout = useRef(null);

  // Update scrollbar position and height
  const updateScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setThumbHeight(0);
      setScrollProgress(0);
      return;
    }

    // Dynamic proportional thumb height with min 40px and max 220px
    const proportionalHeight = (clientHeight / scrollHeight) * clientHeight;
    const clampedHeight = Math.max(45, Math.min(proportionalHeight, clientHeight * 0.45));
    setThumbHeight(clampedHeight);

    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    setScrollProgress(progress);

    // Show on scroll, fade quickly after user stops scrolling (500ms)
    setIsVisible(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setIsVisible(false);
    }, 500);
  }, []);

  useEffect(() => {
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });

    // Observe document height changes (e.g. dynamic content loading)
    const resizeObserver = new ResizeObserver(updateScroll);
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      resizeObserver.disconnect();
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [updateScroll]);

  // Thumb drag functionality
  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScrollY.current = window.scrollY;
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const clientHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const maxScroll = scrollHeight - clientHeight;
      const availableTrack = clientHeight - thumbHeight;

      if (availableTrack <= 0 || maxScroll <= 0) return;

      const deltaY = e.clientY - dragStartY.current;
      const scrollDelta = (deltaY / availableTrack) * maxScroll;
      const targetScroll = Math.min(Math.max(dragStartScrollY.current + scrollDelta, 0), maxScroll);

      window.scrollTo({
        top: targetScroll,
        behavior: 'instant'
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, thumbHeight]);

  // Click on track to jump
  const handleTrackClick = (e) => {
    if (e.target === thumbRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const clientHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const maxScroll = scrollHeight - clientHeight;
    const availableTrack = clientHeight - thumbHeight;

    if (availableTrack <= 0 || maxScroll <= 0) return;

    const targetTop = clickY - thumbHeight / 2;
    const targetProgress = Math.min(Math.max(targetTop / availableTrack, 0), 1);
    
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: 'smooth'
    });
  };

  const availableTrackHeight = typeof window !== 'undefined' ? window.innerHeight - thumbHeight : 0;
  const thumbTranslateY = scrollProgress * availableTrackHeight;

  return (
    <div
      ref={trackRef}
      className={`custom-scrollbar-track ${isVisible || isDragging || isHovered ? 'active' : ''}`}
      onClick={handleTrackClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
    >
      <div
        ref={thumbRef}
        className={`custom-scrollbar-thumb ${isDragging ? 'dragging' : ''}`}
        style={{
          height: `${thumbHeight}px`,
          transform: `translate3d(0, ${thumbTranslateY}px, 0)`
        }}
        onMouseDown={handleThumbMouseDown}
      />
    </div>
  );
};

export default CustomScrollbar;
