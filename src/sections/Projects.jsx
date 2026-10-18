import React, { useState } from 'react';
import './Projects.css';
import Reveal from '../components/Reveal';
import GithubContributions from '../components/GithubContributions';

const CATEGORIES = ["All", "Web App", "AI", "Tools"];

const projects = [
  {
    id: "barge-in",
    categories: ["AI"],
    title: "Real-Time Barge-In Voice AI",
    fullTitle: "Real-Time Barge-In Detection for Voice AI",
    kind: "Voice AI & Low-Latency Audio Pipeline",
    description: "Engineered a low-latency voice AI pipeline that eliminates conversational latency during user interruptions. Integrated Silero VAD to continuously monitor microphone input, instantly halting TTS playback the exact millisecond user speech is detected to produce a natural conversational flow.",
    highlight: "Zero-latency interruption via Silero VAD & Groq Whisper",
    tags: ["Python", "Silero VAD", "Groq Whisper", "LLM APIs", "Edge TTS"],
    github: "https://github.com/mah3shbishnoi/real-time-barge-in-detection",
    demo: ""
  },
  {
    id: "opslens",
    categories: ["Web App"],
    title: "OpsLens",
    fullTitle: "OpsLens — Engineering Operations Console",
    kind: "Repository Observability & Telemetry Platform",
    description: "Editorial engineering operations and repository observability console connecting directly to GitHub REST API telemetry. Visualizes real-time PR merge velocity, issue resolution flow, 30-day commit trends, and release cadence through Pinia state management and Apache ECharts.",
    highlight: "Production telemetry with Apache ECharts & GitHub REST API",
    tags: ["Vue 3", "TypeScript", "Pinia", "Apache ECharts", "GitHub API"],
    github: "https://github.com/mah3shbishnoi/opslens",
    demo: "https://opslens-mah3sh.vercel.app",
    demoLabel: "Open App",
    image: "images/opslens.png"
  },
  {
    id: "devnote",
    categories: ["Web App"],
    title: "DevNote",
    fullTitle: "DevNote — Professional Developer Workspace",
    kind: "Local-First Technical Documentation IDE",
    description: "A browser-native, local-first technical documentation IDE engineered for software developers. Features native IndexedDB persistence, live GFM rendering, Prism.js syntax highlighting, fast in-memory full-text search (⌘P), and ZIP workspace archive exports.",
    highlight: "Zero-tracking, local-first IndexedDB persistence with ⌘P search",
    tags: ["JavaScript", "IndexedDB", "Marked.js", "Prism.js", "Vite"],
    github: "https://github.com/mah3shbishnoi/devnote",
    demo: "https://devnote-mah3sh.vercel.app",
    demoLabel: "Open App",
    image: "images/devnote.png"
  },
  {
    id: "wlayout",
    categories: ["Tools"],
    title: "wlayout",
    fullTitle: "wlayout — State-Aware Hyprland Workspace Manager",
    kind: "Linux Systems & Wayland Window Management",
    description: "Smart, state-aware workspace layout manager for Hyprland. Preserves pixel-accurate floating/tiled window geometry, traverses the process tree to restore active shell working directories (cd), and recovers running foreground commands like btop and nvim.",
    highlight: "Process tree traversal with shell cwd recovery & Lua dispatch",
    tags: ["Hyprland", "Lua", "Bash", "Linux", "Wayland"],
    github: "https://github.com/mah3shbishnoi/wlayout",
    demo: ""
  },
  {
    id: "license-key",
    categories: ["Web App"],
    title: "License Key Management System",
    fullTitle: "Hardware-Locked License Key Management",
    kind: "Enterprise Security & Hardware-Locked Licensing",
    description: "Built a software licensing system to generate and securely verify activation keys, controlling application access based on credentials. Implemented device-specific hardware validation by associating activated licenses with the system's NIC MAC address.",
    highlight: "Cryptographic verification with NIC MAC-bound hardware restrictions",
    tags: ["C#", ".NET Framework", "MVC", "MySQL", "Cryptography"],
    github: "https://github.com/mah3shbishnoi",
    demo: ""
  },
  {
    id: "activity-tracker",
    categories: ["Web App"],
    title: "Activity Tracker",
    fullTitle: "Real-Time User Activity & Telemetry Tracker",
    kind: "Browser Diagnostics & Client Telemetry",
    description: "Real-time browser and device telemetry tracker inspecting hardware specs, network capabilities, screen geometry, input methods, and active browser APIs with instant visual telemetry metrics.",
    highlight: "Live client diagnostics & hardware capability discovery",
    tags: ["JavaScript", "Browser APIs", "HTML5", "CSS3", "Telemetry"],
    github: "https://github.com/mah3shbishnoi/Activity-Tracker-Website",
    demo: "https://mah3shbishnoi.github.io/Activity-Tracker-Website/",
    demoLabel: "Visit Site",
    image: "images/activity-tracker.png"
  },
  {
    id: "browser-device-info",
    categories: ["Web App"],
    title: "Device Information",
    fullTitle: "Device & Browser Information",
    kind: "Device & Browser Info Viewer",
    description: "A web tool that detects and displays detailed information about the user's device and browser, including operating system, screen resolution, browser version, and hardware capabilities in real time.",
    tags: ["JavaScript", "Browser APIs", "HTML5", "CSS3"],
    github: "https://github.com/mah3shbishnoi/Browser-Device-Information-Website",
    demo: "https://mah3shbishnoi.github.io/Browser-Device-Information-Website/",
    demoLabel: "Visit Site",
    image: "images/device-information.png"
  }
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(projects[0].id);

  // Filter projects by active category
  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "All") return true;
    return project.categories.includes(activeCategory);
  });

  // Ensure selectedProject is always valid within filtered list
  const selectedProject =
    filteredProjects.find((p) => p.id === selectedId) || filteredProjects[0] || projects[0];

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const inFiltered = projects.filter((p) => cat === "All" || p.categories.includes(cat));
    if (inFiltered.length > 0 && !inFiltered.some((p) => p.id === selectedId)) {
      setSelectedId(inFiltered[0].id);
    }
  };

  const handleProjectSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  // Reusable Project Card markup used for both Desktop sticky preview and Mobile inline accordion
  const renderProjectCardContent = (project) => (
    <div className="project-detail-card">
      {/* Project Image Preview if available */}
      {project.image && (
        <div className="project-card-image-wrap">
          <img
            src={project.image}
            alt={`${project.title} Preview`}
            className="project-card-image"
            loading="lazy"
          />
        </div>
      )}

      {/* Detail Information */}
      <div className="project-detail-body">
        <h3 className="project-detail-title">{project.fullTitle}</h3>
        <p className="project-detail-desc">{project.description}</p>
        
        <div className="project-detail-tech">
          <span className="tech-heading">Built with</span>
          <div className="project-detail-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="tech-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="project-detail-actions">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
              <span>Source Code</span>
              <span className="action-arrow">↗</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-btn secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{project.demoLabel || "Visit App"}</span>
              <span className="action-arrow">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        {/* Header with Title and Category Filters */}
        <Reveal>
          <div className="projects-header">
            <h2 className="section-title">Projects</h2>
            
            {/* Category Filter Pills */}
            <div className="projects-category-filter">
              {CATEGORIES.map((category) => {
                const count = projects.filter(
                  (p) => category === "All" || p.categories.includes(category)
                ).length;
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    className={`category-pill ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                    aria-pressed={isActive}
                  >
                    <span>{category}</span>
                    <span className="category-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Master-Detail Layout */}
        <Reveal delay={0.15}>
          <div className="projects-master-detail">
            {/* Project Rows Index */}
            <div className="projects-index-column">
              {filteredProjects.map((project) => {
                const isSelected = project.id === selectedProject.id;
                return (
                  <div key={project.id} className={`project-item-wrapper ${isSelected ? 'active' : ''}`}>
                    <button
                      className={`project-index-row ${isSelected ? 'active' : ''}`}
                      onClick={() => handleProjectSelect(project.id)}
                      onMouseEnter={() => setSelectedId(project.id)}
                      onFocus={() => setSelectedId(project.id)}
                      aria-expanded={isSelected}
                    >
                      <div className="project-row-left">
                        <span className="project-row-title">{project.title}</span>
                        <span className="project-row-kind">{project.kind}</span>
                      </div>
                      <div className="project-row-right">
                        {/* Desktop row indicator arrow */}
                        <span className="project-row-arrow" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>

                        {/* Mobile accordion chevron */}
                        <span className="accordion-chevron" aria-hidden="true">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </div>
                    </button>

                    {/* Mobile-Only Inline Accordion Panel: Expands right beneath clicked row */}
                    <div className={`project-mobile-accordion ${isSelected ? 'expanded' : ''}`}>
                      <div className="project-mobile-accordion-inner">
                        {renderProjectCardContent(project)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop-Only Sticky Detail & Preview Card */}
            <aside className="project-detail-panel">
              {renderProjectCardContent(selectedProject)}
            </aside>
          </div>
        </Reveal>

        {/* Live GitHub Contributions Heatmap */}
        <Reveal delay={0.25}>
          <GithubContributions />
        </Reveal>
      </div>
    </section>
  );
};

export default Projects;