import React, { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [active, setActive] = useState('Home');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRefs = useRef({});
  const isClickScrolling = useRef(false);
  const clickScrollTimeout = useRef(null);

  const links = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Contributions', id: 'opensource' },
    { name: 'Work', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills', id: 'skills' },
    { name: 'Resume', id: 'resume' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (linkName, linkId) => {
    setActive(linkName);
    setIsMobileOpen(false);
    isClickScrolling.current = true;
    
    if (linkId === 'resume') {
      window.location.hash = 'resume';
    } else {
      if (window.location.hash === '#resume') {
        window.location.hash = '';
        setTimeout(() => {
          const section = document.getElementById(linkId);
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const section = document.getElementById(linkId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    
    if (clickScrollTimeout.current) {
      clearTimeout(clickScrollTimeout.current);
    }
    const unlockScroll = () => {
      isClickScrolling.current = false;
      window.removeEventListener('scrollend', unlockScroll);
    };
    
    window.addEventListener('scrollend', unlockScroll);
    clickScrollTimeout.current = setTimeout(unlockScroll, 1500);
  };

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;
      
      const triggerThreshold = window.innerHeight * 0.35;
      let currentActive = links[0].name;
      
      for (const link of links) {
        if (link.id === 'resume') continue;
        
        const section = document.getElementById(link.id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= triggerThreshold) {
            currentActive = link.name;
          }
        }
      }
      
      setActive(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Move Slider for Desktop Pill
  useEffect(() => {
    const activeElement = navRefs.current[active];
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [active]);

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-nav-backdrop" 
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav className={`navbar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="nav-brand">
          <a href="#home" onClick={() => setIsMobileOpen(false)}>MAH3SH</a>
        </div>
        
        {/* Desktop Links Container */}
        <div className="nav-links-container desktop-nav">
          <div className="nav-indicator" style={indicatorStyle} />
          <ul className="nav-links">
            {links.map((link) => (
              <li 
                key={link.name}
                ref={el => navRefs.current[link.name] = el}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.name, link.id);
                }}
              >
                <a 
                  href={`#${link.id}`}
                  className={active === link.name ? 'active' : ''}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="hamburger-btn"
          onClick={() => setIsMobileOpen(prev => !prev)}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
        >
          <span className={`hamburger-line line-1 ${isMobileOpen ? 'open' : ''}`} />
          <span className={`hamburger-line line-2 ${isMobileOpen ? 'open' : ''}`} />
          <span className={`hamburger-line line-3 ${isMobileOpen ? 'open' : ''}`} />
        </button>

        {/* Mobile Dropdown Drawer */}
        <div className={`mobile-nav-drawer ${isMobileOpen ? 'active' : ''}`}>
          <ul className="mobile-nav-links">
            {links.map((link) => (
              <li key={link.name}>
                <a 
                  href={`#${link.id}`}
                  className={active === link.name ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.name, link.id);
                  }}
                >
                  <span>{link.name}</span>
                  {active === link.name && <span className="mobile-active-dot" />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;