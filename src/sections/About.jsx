import './About.css';
import Reveal from '../components/Reveal';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <Reveal>
          <h2 className="section-title">About Me</h2>
        </Reveal>
        
        <div className="about-grid">
          <Reveal delay={0.2} className="about-image-container">
            <div className="glass-portrait">
              <img src="images/about-profile.jpg" alt="Mahesh Saran Portrait" />
            </div>
          </Reveal>
          
          <Reveal delay={0.4} className="about-text">
            <h3>Hi! I'm Mahesh and I'm a Software Engineer and <a href="#opensource" className="about-highlight-link">Linux Contributor</a></h3>
            <p>
              I'm Mahesh Saran, a 3rd-year B.Tech CSE &amp; AIML student at JIET Jodhpur (graduating 2028), focused on AI engineering and systems software.
            </p>
            <p>
              My work spans low-level debugging and applied AI: I landed an upstream Linux kernel fix for MediaTek Wi-Fi hardware, built a distributed job scheduler (Relay), evaluated LLMs on bug detection (CodeSense Eval), and interned as a .NET developer at Anand Rathi IT. I'm seeking SWE and AI engineering internships.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;