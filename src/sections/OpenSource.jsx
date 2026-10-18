import React, { useState } from 'react';
import './OpenSource.css';
import Reveal from '../components/Reveal';

const OpenSource = () => {
  const [copied, setCopied] = useState(false);
  const commitHash = "87b67aa8eb32cf89dab4c6df88d65e07fec46592";

  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(commitHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="opensource" className="opensource-section">
      <div className="opensource-wrapper">
        {/* Section Header */}
        <Reveal>
          <div className="opensource-header">
            <h2 className="section-title">Linux Kernel Contribution</h2>
            <p className="section-subtitle">
              Upstream patch accepted into <code>wireless-next</code> for the upcoming Linux Kernel merge window.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="kernel-spotlight-card">
            <div className="kernel-card-inner">
              <div className="kernel-grid-layout">
                {/* Left Column: Tux Badge */}
                <div className="kernel-left-col">
                  <div className="tux-badge-card">
                    <div className="tux-img-container">
                      <img 
                        src="images/tux.png" 
                        alt="Linux Tux Mascot" 
                        className="official-tux-img" 
                      />
                    </div>
                    <div className="tux-badge-label">
                      <span className="tux-badge-sub">Linux Kernel</span>
                      <span className="tux-badge-main">Contributor</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Title, 3-Line Summary, Meta, Tags, Terminal, Actions */}
                <div className="kernel-main-col">
                  <h3 className="kernel-patch-title">
                    wifi: mt76: mt7921: clear WM2 from MT7902 RX all_complete_mask
                  </h3>

                  {/* Summary Lines */}
                  <div className="kernel-brief-lines">
                    <p>MT7902 lacks an MCU_WA ring, yet the driver enabled its interrupt (bit 22), listening for a non-existent queue. Corrected <code>all_complete_mask</code> from <code>0x00400005</code> to <code>0x00000005</code> for proper hardware interrupt handling.</p>
                  </div>

                  <div className="kernel-meta-row">
                    <button 
                      onClick={handleCopy} 
                      className="kernel-commit-pill"
                      title="Click to copy commit hash"
                    >
                      <span>commit <strong>87b67aa</strong></span>
                      <span className="copy-indicator">{copied ? "✓ Copied" : "Copy"}</span>
                    </button>

                    <div className="kernel-status-pill">
                      <span className="status-dot-pulse" />
                      <span>Accepted in wireless-next • Linux Kernel Merge Window</span>
                    </div>
                  </div>

                  {/* Code Diff Window */}
                  <div className="kernel-diff-box">
                    <div className="diff-header-bar">
                      <div className="mac-traffic-dots">
                        <span className="traffic-dot close" />
                        <span className="traffic-dot minimize" />
                        <span className="traffic-dot expand" />
                      </div>
                      <span className="diff-filename">
                        drivers/net/wireless/mediatek/mt76/mt7921/pci.c
                      </span>
                    </div>

                    <div className="diff-code-area">
                      <div className="diff-code-line chunk-header">
                        <span className="diff-ln"></span>
                        <span className="diff-code">--- +87b67aa @@ 375,6 @@</span>
                      </div>
                      <div className="diff-code-line">
                        <span className="diff-ln">375</span>
                        <span className="diff-code">static int mt7921_pci_probe(struct pdev, const struct id) &#123;</span>
                      </div>
                      <div className="diff-code-line">
                        <span className="diff-ln">376</span>
                        <span className="diff-code">&nbsp;&nbsp;&nbsp;&nbsp;map-&gt;rx.wm2_complete_mask = 0;</span>
                      </div>
                      <div className="diff-code-line line-added">
                        <span className="diff-ln">377</span>
                        <span className="diff-code"><strong>+</strong>&nbsp;&nbsp;&nbsp;map-&gt;rx.all_complete_mask &amp;= ~MT_INT_RX_DONE_WM2;</span>
                      </div>
                      <div className="diff-code-line">
                        <span className="diff-ln">378</span>
                        <span className="diff-code">&nbsp;&nbsp;&nbsp;&nbsp;dev-&gt;irq_map = map;</span>
                      </div>
                      <div className="diff-code-line">
                        <span className="diff-ln">379</span>
                        <span className="diff-code">&#125;</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="kernel-actions-row">
                    <a 
                      href="https://patchwork.kernel.org/project/linux-wireless/patch/20261006163553.11193-1-maheshsaran477@gmail.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kernel-btn"
                    >
                      View on Patchwork
                    </a>

                    <a 
                      href="https://github.com/nbd168/wireless/commit/87b67aa8eb32cf89dab4c6df88d65e07fec46592"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kernel-btn"
                    >
                      View Commit
                    </a>

                    <a 
                      href="https://git.kernel.org/pub/scm/linux/kernel/git/wireless/wireless-next.git/stats/drivers/net/wireless/mediatek/mt76/mt7921/pci.c"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kernel-btn"
                    >
                      Kernel Tree (kernel.org)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default OpenSource;
