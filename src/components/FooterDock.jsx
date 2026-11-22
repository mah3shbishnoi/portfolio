import { useState, useEffect, useRef } from 'react';
import { Home, Folder, FileText } from 'lucide-react';
import { InkTransition } from '../ink/inkTransition';
import './FooterDock.css';

const FooterDock = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'light';
  });

  const canvasRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const inkRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!canvasRef.current || !toggleBtnRef.current) return;
    const ink = new InkTransition(canvasRef.current, toggleBtnRef.current, (nextTheme) => {
      setTheme(nextTheme);
    });
    inkRef.current = ink;
    return () => {
      ink.destroy();
      inkRef.current = null;
    };
  }, []);

  const toggleTheme = (e) => {
    const point =
      e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : undefined;
    if (inkRef.current) {
      inkRef.current.toggle(point);
    } else {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="ink-overlay" aria-hidden="true" />
      <div className="footer-dock" data-ink-live>
        <div className="dock-container">
          <a href="#home" className="dock-item">
            <span className="dock-tooltip">Home</span>
            <Home size={20} strokeWidth={1.5} />
          </a>
          <a href="#projects" className="dock-item">
            <span className="dock-tooltip">Projects</span>
            <Folder size={20} strokeWidth={1.5} />
          </a>
          <a href="#resume" className="dock-item">
            <span className="dock-tooltip">Resume</span>
            <FileText size={20} strokeWidth={1.5} />
          </a>
          <div className="dock-divider"></div>
          <a href="https://github.com/mah3shbishnoi" target="_blank" rel="noopener noreferrer" className="dock-item">
            <span className="dock-tooltip">GitHub</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
          </a>
          <a href="https://www.linkedin.com/in/mahesh-saran" target="_blank" rel="noopener noreferrer" className="dock-item">
            <span className="dock-tooltip">LinkedIn</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="https://x.com/mah3shbishnoi" target="_blank" rel="noopener noreferrer" className="dock-item">
            <span className="dock-tooltip">X</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16z"></path><path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772"></path></svg>
          </a>
          <div className="dock-divider"></div>
          <button
            ref={toggleBtnRef}
            className="dock-item theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
          >
            <span className="dock-tooltip">Toggle Theme</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path className="theme-toggle__body" d="M12 7a5 5 0 1 1 0 10a5 5 0 1 1 0-10z" />
              <g className="theme-toggle__rays">
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
                <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22" y2="12" />
                <line x1="6.34" y1="17.66" x2="4.93" y2="19.07" />
                <line x1="19.07" y1="4.93" x2="17.66" y2="6.34" />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
export default FooterDock;