import React from 'react';
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
              Resourceful and dedicated student with excellent analytical skills and a demonstrated commitment to achieving complex technical goals. Strong problem-solving abilities with proven success in systems development, machine learning, and full-stack projects.
            </p>
            <p>
              Well-rounded and professional team player dedicated to continuing academic pursuits and contributing to impactful projects. Currently looking for internship opportunities and skilled in programming languages such as C, Python, C++, and modern frameworks like React.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;