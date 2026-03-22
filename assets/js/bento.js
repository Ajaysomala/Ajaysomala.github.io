/* ═══════════════════════════════════════════════════
   BENTO.JS — Bento Grid About Section &
              "Currently Building" Live Widget
   Somala Ajay Portfolio
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Inject Bento Grid Styles ── */
  function injectBentoStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ════════════════════════════
         BENTO GRID — About Section
      ════════════════════════════ */
      .bento-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto;
        gap: 1rem;
        margin-top: 1rem;
      }

      .bento-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 1.5rem;
        transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .bento-card:hover {
        transform: translateY(-4px);
        border-color: var(--border-hover);
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      }

      /* ── Card sizes ── */
      .bento-wide   { grid-column: span 2; }
      .bento-tall   { grid-row: span 2; }
      .bento-full   { grid-column: span 4; }
      .bento-3      { grid-column: span 3; }

      /* ── Card accent colors ── */
      .bento-purple { border-top: 2px solid var(--purple); }
      .bento-gold   { border-top: 2px solid var(--gold); }
      .bento-green  { border-top: 2px solid #00d264; }
      .bento-blue   { border-top: 2px solid #60a5fa; }

      /* ── Card: Name/intro ── */
      .bento-name-card .bento-title {
        font-family: var(--font-display);
        font-size: 2.2rem;
        font-weight: 800;
        line-height: 1;
        color: var(--white);
        margin-bottom: 0.5rem;
      }
      .bento-name-card .bento-subtitle {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        color: var(--gold);
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }

      /* ── Card: Stats ── */
      .bento-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 100%;
        min-height: 100px;
      }
      .bento-stat-num {
        font-family: var(--font-display);
        font-size: 3rem;
        font-weight: 800;
        color: var(--purple);
        line-height: 1;
      }
      .bento-stat-unit { color: var(--gold); font-size: 1.5rem; font-weight: 700; }
      .bento-stat-label {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--muted);
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-top: 0.3rem;
      }

      /* ── Card: Location ── */
      .bento-location .bento-label {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--muted);
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-bottom: 0.4rem;
      }
      .bento-location .bento-place {
        font-family: var(--font-display);
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--white);
      }
      .bento-location .bento-coords {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--purple);
        margin-top: 0.25rem;
      }

      /* ── Card: Status ── */
      .bento-status-dot {
        width: 10px; height: 10px; border-radius: 50%;
        background: #00d264;
        box-shadow: 0 0 10px #00d264;
        animation: pulseDot 2s infinite;
        display: inline-block;
        margin-right: 0.5rem;
        vertical-align: middle;
      }
      .bento-status-text {
        font-size: 0.88rem;
        color: var(--text-sub);
        margin-top: 0.4rem;
        line-height: 1.6;
      }

      /* ── Card: Skills mini ── */
      .bento-skills-mini {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.5rem;
      }
      .bento-tag {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        padding: 0.2rem 0.55rem;
        background: var(--purple-dim);
        border: 1px solid rgba(155,89,245,0.2);
        border-radius: 4px;
        color: var(--text-sub);
      }

      /* ── Card: Quote ── */
      .bento-quote {
        font-family: var(--font-display);
        font-size: 1.1rem;
        font-style: italic;
        color: var(--white);
        line-height: 1.5;
      }
      .bento-quote-attr {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--muted);
        margin-top: 0.5rem;
      }

      /* ── Card: Currently ── */
      .bento-currently .bento-card-label {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--gold);
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin-bottom: 0.6rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .bento-currently .bento-card-label::before {
        content: '';
        width: 14px; height: 1px;
        background: var(--gold);
      }
      .bento-currently-item {
        display: flex;
        align-items: flex-start;
        gap: 0.6rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
        font-size: 0.83rem;
        color: var(--text-sub);
      }
      .bento-currently-item:last-child { border-bottom: none; }
      .bento-currently-icon { font-size: 1rem; flex-shrink: 0; }

      /* ── Card decorative bg glow ── */
      .bento-card::before {
        content: '';
        position: absolute;
        width: 150px; height: 150px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--purple-glow) 0%, transparent 70%);
        top: -50px; right: -50px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.4s;
      }
      .bento-card:hover::before { opacity: 1; }

      /* ═══════════════════════════════
         CURRENTLY BUILDING WIDGET
         (bottom-right floating)
      ═══════════════════════════════ */
      #currently-widget {
        position: fixed;
        bottom: 9.5rem;
        right: 2rem;
        z-index: 790;
        width: 220px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 0.85rem 1rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        transform: translateX(260px);
        transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        opacity: 0;
      }
      #currently-widget.visible {
        transform: translateX(0);
        opacity: 1;
      }
      .cw-label {
        font-family: var(--font-mono);
        font-size: 0.58rem;
        color: var(--gold);
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        display: flex; align-items: center; gap: 0.35rem;
      }
      .cw-dot {
        width: 5px; height: 5px; border-radius: 50%;
        background: #00d264; box-shadow: 0 0 5px #00d264;
        animation: pulseDot 2s infinite;
        flex-shrink: 0;
      }
      .cw-item {
        font-size: 0.75rem;
        color: var(--text-sub);
        padding: 0.3rem 0;
        display: flex; align-items: center; gap: 0.4rem;
        border-bottom: 1px solid var(--border);
      }
      .cw-item:last-child { border-bottom: none; }
      .cw-dismiss {
        position: absolute; top: 0.4rem; right: 0.5rem;
        background: none; border: none; color: var(--muted2);
        font-size: 0.75rem; cursor: pointer; padding: 2px 4px;
      }
      .cw-dismiss:hover { color: var(--purple); }

      /* ── Theme toggle repositioned to not collide with chatbot ── */
      #theme-toggle {
        bottom: 9rem !important;
        right: 2rem !important;
      }
      @media (max-width: 480px) {
        #theme-toggle { bottom: 8.5rem !important; right: 1.25rem !important; }
      }

      /* ── Responsive Bento ── */
      @media (max-width: 1024px) {
        .bento-grid { grid-template-columns: repeat(2, 1fr); }
        .bento-wide { grid-column: span 2; }
        .bento-3    { grid-column: span 2; }
        .bento-full { grid-column: span 2; }
      }
      @media (max-width: 600px) {
        .bento-grid { grid-template-columns: 1fr; }
        .bento-wide, .bento-3, .bento-full, .bento-tall { grid-column: span 1; grid-row: span 1; }
        #currently-widget { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Replace About section with Bento Grid ── */
  function buildBentoAbout() {
    const aboutGrid = document.getElementById('about-grid')
      || document.querySelector('.about-grid');
    if (!aboutGrid) {
      // Retry after a short delay if DOM not ready
      setTimeout(buildBentoAbout, 300);
      return;
    }

    const bentoHTML = `
      <div class="bento-grid">

        <!-- Name + intro -->
        <div class="bento-card bento-wide bento-purple bento-name-card reveal-up">
          <div class="bento-title">Somala<br>Ajay</div>
          <div class="bento-subtitle">Python Developer · AI/ML Engineer · Data Scientist</div>
          <p style="font-size:0.82rem;color:var(--text-sub);margin-top:0.75rem;line-height:1.7">
            B.Tech ECE graduate passionate about building intelligent systems that solve real problems. 2+ years experience turning data into impact.
          </p>
        </div>

        <!-- Status -->
        <div class="bento-card bento-green reveal-up" style="--delay:0.05s">
          <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--muted);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.5rem">Status</div>
          <div style="font-size:1.1rem;font-weight:600;color:var(--white)">
            <span class="bento-status-dot"></span>Open to Work
          </div>
          <div class="bento-status-text">Actively seeking Data Science, AI/ML & Python Developer roles.</div>
        </div>

        <!-- 31 projects stat -->
        <div class="bento-card bento-purple reveal-up" style="--delay:0.1s">
          <div class="bento-stat">
            <div><span class="bento-stat-num">31</span><span class="bento-stat-unit">+</span></div>
            <div class="bento-stat-label">AI / ML Projects</div>
          </div>
        </div>

        <!-- Location -->
        <div class="bento-card bento-wide bento-gold reveal-up" style="--delay:0.12s">
          <div class="bento-location">
            <div class="bento-label">📍 Location</div>
            <div class="bento-place">Hyderabad, India</div>
            <div class="bento-coords">17.3850° N, 78.4867° E</div>
            <div style="font-size:0.75rem;color:var(--muted);margin-top:0.4rem">IST (UTC +5:30)</div>
          </div>
        </div>

        <!-- Accuracy stat -->
        <div class="bento-card bento-purple reveal-up" style="--delay:0.15s">
          <div class="bento-stat">
            <div><span class="bento-stat-num">98</span><span class="bento-stat-unit">%</span></div>
            <div class="bento-stat-label">Data Accuracy</div>
          </div>
        </div>

        <!-- Core skills tags -->
        <div class="bento-card bento-3 bento-purple reveal-up" style="--delay:0.18s">
          <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--gold);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:0.7rem">Core Stack</div>
          <div class="bento-skills-mini">
            <span class="bento-tag">Python</span>
            <span class="bento-tag">TensorFlow</span>
            <span class="bento-tag">Flask</span>
            <span class="bento-tag">NLP</span>
            <span class="bento-tag">OpenCV</span>
            <span class="bento-tag">Pandas</span>
            <span class="bento-tag">Docker</span>
            <span class="bento-tag">Generative AI</span>
            <span class="bento-tag">SQL</span>
            <span class="bento-tag">REST APIs</span>
          </div>
        </div>

        <!-- Education -->
        <div class="bento-card bento-wide bento-blue reveal-up" style="--delay:0.2s">
          <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--muted);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.5rem">🎓 Education</div>
          <div style="font-family:var(--font-display);font-size:1rem;font-weight:700;color:var(--white)">B.Tech ECE</div>
          <div style="font-size:0.82rem;color:#60a5fa;margin:0.15rem 0">Aditya University, Surampalem</div>
          <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--muted)">2018 – 2022</div>
        </div>

        <!-- Quote -->
        <div class="bento-card bento-wide bento-gold reveal-up" style="--delay:0.22s">
          <div class="bento-quote">"Building intelligent solutions that make a real difference."</div>
          <div class="bento-quote-attr">— Somala Ajay</div>
        </div>

        <!-- Currently building -->
        <div class="bento-card bento-wide bento-currently bento-purple reveal-up" style="--delay:0.25s">
          <div class="bento-card-label">Currently</div>
          <div class="bento-currently-item"><span class="bento-currently-icon">🔨</span> Building full-stack AI portfolio projects</div>
          <div class="bento-currently-item"><span class="bento-currently-icon">📚</span> Deep diving into LLMs & RAG systems</div>
          <div class="bento-currently-item"><span class="bento-currently-icon">🎯</span> Open to exciting AI/ML opportunities</div>
        </div>

      </div>
    `;

    aboutGrid.outerHTML = bentoHTML;
  }

  /* ── "Currently Building" floating widget ── */
  function buildCurrentlyWidget() {
    const widget = document.createElement('div');
    widget.id = 'currently-widget';
    widget.innerHTML = `
      <button class="cw-dismiss" id="cw-dismiss" aria-label="Dismiss">✕</button>
      <div class="cw-label"><span class="cw-dot"></span>Currently Building</div>
      <div class="cw-item">🔨 AI Portfolio Projects</div>
      <div class="cw-item">📚 LLMs & RAG Systems</div>
      <div class="cw-item">🚀 Open to Opportunities</div>
    `;
    document.body.appendChild(widget);

    // Show after 4 seconds
    const dismissed = sessionStorage.getItem('sa_cw_dismissed');
    if (!dismissed) {
      setTimeout(function () {
        widget.style.opacity = '1';
        widget.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s';
        widget.classList.add('visible');
      }, 4000);

      // Auto-hide after 10 seconds
      setTimeout(function () {
        widget.classList.remove('visible');
      }, 14000);
    }

    document.getElementById('cw-dismiss').addEventListener('click', function () {
      widget.classList.remove('visible');
      sessionStorage.setItem('sa_cw_dismissed', '1');
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    injectBentoStyles();
    buildBentoAbout();
    buildCurrentlyWidget();
  });

})();
