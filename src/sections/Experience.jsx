import React from 'react';
import './Experience.css';
import Reveal from '../components/Reveal';

const Experience = () => {
  const experiences = [
    {
      id: 1,
      role: ".NET Framework Intern",
      company: "Anand Rathi IT Pvt. Ltd.",
      date: "May 2026 – Jun 2026",
      location: "On-site - 2 mos",
      bullets: [
        "Developed a software license management system using C# and .NET Framework to generate and validate license keys for controlled application access.",
        "Implemented device-specific license validation by binding activated license keys to the system's NIC MAC address, restricting subsequent usage to the registered device.",
        "Integrated MySQL database operations for storing and validating license information, and implemented application components using the .NET MVC architecture."
      ],
      tags: ["C#", ".NET Framework", "MVC", "MySQL"]
    },
    {
      id: 2,
      role: "Python Developer Intern",
      company: "Jodhpur Institute of Engineering and Technology",
      date: "Jun 2025 – Jul 2025",
      location: "In-House Summer Training - 2 mos",
      bullets: [
        "Developed a maze game using Python and Pygame, implementing event-driven programming, graphics rendering, and interactive game mechanics.",
        "Implemented ball movement and collision detection, designing core game logic and mechanics for multiple game levels.",
        "Applied asynchronous programming concepts using Python's asyncio module and collaborated with team members to debug code and implement game functionality."
      ],
      tags: ["Python", "Pygame", "asyncio"]
    }
  ];

  return (
    <section id="experience" className="experience-section bg-alt pattern-bg">
      <div className="experience-container">
        <Reveal>
          <div className="experience-header">
            <h2 className="experience-title">Work</h2>
          </div>
        </Reveal>
        
        <div className="timeline">
          {experiences.map((exp, index) => (
            <Reveal key={exp.id} delay={index * 0.2} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3><span className="role">{exp.role}</span> <span className="separator">·</span> <span className="company">{exp.company}</span></h3>
                  <span className="date">{exp.date}</span>
                </div>
                <div className="timeline-location">{exp.location}</div>
                <ul className="timeline-bullets">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
                <div className="timeline-tags">
                  {exp.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Experience;