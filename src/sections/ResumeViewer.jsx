import { Download, ArrowLeft } from 'lucide-react';
import './ResumeViewer.css';

const ResumeViewer = () => {
  return (
    <div className="resume-viewer-container">
      <div className="resume-header">
        <a href="#home" className="back-btn">
          <ArrowLeft size={20} />
          <span>Back to Portfolio</span>
        </a>
        <a href="resume.pdf" download="Mahesh_Saran_Resume.pdf" className="download-btn">
          <Download size={18} />
          <span>Download</span>
        </a>
      </div>
      
      <div className="pdf-container">
        <object data="resume.pdf" type="application/pdf" className="pdf-viewer">
          <p>It appears you don't have a PDF plugin for this browser. 
             No biggie... you can <a href="resume.pdf">click here to download the PDF file.</a>
          </p>
        </object>
      </div>
    </div>
  );
};
export default ResumeViewer;