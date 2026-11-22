import './Contact.css';
import Reveal from '../components/Reveal';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <Reveal>
          <div className="contact-header">
            <h2 className="contact-title">Let's build something great together.</h2>
            <p className="contact-subtitle">
              Currently seeking internship opportunities and open to exciting AI/ML projects. 
              My inbox is always open. Whether you have a question or just want to say hi, 
              I'll try my best to get back to you!
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="contact-card">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">EMAIL</span>
                <a href="mailto:maheshsaran477@gmail.com" className="contact-value">maheshsaran477@gmail.com</a>
              </div>
            </div>

            <div className="contact-actions">
              <a href="mailto:maheshsaran477@gmail.com" className="contact-btn primary">
                Say Hello 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9 22 2z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/mahesh-saran" target="_blank" rel="noopener noreferrer" className="contact-btn secondary">
                LinkedIn
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </Reveal>
        
        <Reveal delay={0.4}>
          <div className="contact-footer">
            <p>Designed & Built by Mahesh Saran</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
export default Contact;