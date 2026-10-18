import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FooterDock from './components/FooterDock';
import Hero from './sections/Hero';
import About from './sections/About';
import OpenSource from './sections/OpenSource';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Contact from './sections/Contact';
import ResumeViewer from './sections/ResumeViewer';
import './App.css';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div>
      <Navbar />
      <main>
        {currentHash === '#resume' ? (
          <ResumeViewer />
        ) : (
          <>
            <Hero />
            <About />
            <OpenSource />
            <Experience />
            <Projects />
            <Skills />
            <Contact />
          </>
        )}
      </main>
      <FooterDock />
    </div>
  );
}
export default App;