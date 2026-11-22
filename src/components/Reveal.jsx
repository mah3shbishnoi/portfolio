import { useEffect, useRef, useState } from 'react';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`reveal-wrapper ${isVisible ? 'active' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default Reveal;