/**
 * SOMALA AJAY — AI/ML ENGINEER PORTFOLIO CORE JAVASCRIPT
 * Includes: Neural Particle Canvas, Reactive Cursor, RAG Simulator,
 * Multi-Agent Visualizer, 3D Tilt, Web Audio FX, Anti-Scraping Decoders.
 */

// ==========================================
// 1. Audio Synthesizer (Web Audio API)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playBeep(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.03) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') {
      this.ctx && this.ctx.resume();
    }
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio context error ignore
    }
  }

  hover() { this.playBeep(520, 'sine', 0.05, 0.015); }
  click() { this.playBeep(880, 'triangle', 0.08, 0.04); }
  success() {
    this.playBeep(659.25, 'sine', 0.1, 0.03);
    setTimeout(() => this.playBeep(880, 'sine', 0.12, 0.03), 80);
  }
}

const sfx = new SoundFX();

// ==========================================
// 2. Custom Glowing Mouse Cursor & Follower
// ==========================================
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const aura = document.querySelector('.custom-cursor-aura');
  if (!dot || !aura) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let auraX = mouseX;
  let auraY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderCursor() {
    auraX += (mouseX - auraX) * 0.18;
    auraY += (mouseY - auraY) * 0.18;
    aura.style.transform = `translate(${auraX}px, ${auraY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover detection on interactive elements
  const hoverables = document.querySelectorAll('a, button, input, textarea, select, .preset-btn, .filter-btn, .agent-node, .glass-card');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      aura.classList.add('hovering');
      sfx.hover();
    });
    el.addEventListener('mouseleave', () => {
      aura.classList.remove('hovering');
    });
    el.addEventListener('mousedown', () => {
      aura.classList.add('clicking');
      sfx.click();
    });
    el.addEventListener('mouseup', () => {
      aura.classList.remove('clicking');
    });
  });
}

// ==========================================
// 3. Interactive Neural Network Particle Canvas
// ==========================================
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 100);
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 1;
      this.baseColor = Math.random() > 0.4 ? '0, 242, 254' : (Math.random() > 0.5 ? '139, 92, 246' : '16, 185, 129');
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.baseColor}, 0.8)`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.baseColor}, 0.6)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting synapses
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================
// 4. Typewriter Effect in Hero
// ==========================================
function initTypewriter() {
  const target = document.getElementById('heroTypewriter');
  if (!target) return;

  const phrases = [
    'AI/ML Engineer',
    'Generative AI & RAG Specialist',
    'LLM & Multi-Agent Architect',
    'Python & Backend Developer',
    'FastAPI · FAISS · LangChain'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      target.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at full phrase
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400; // Pause before next phrase
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// ==========================================
// 5. 3D Card Tilt Effect
// ==========================================
function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

// ==========================================
// 6. Interactive NASA RAG Pipeline Simulator
// ==========================================
const RAG_KNOWLEDGE_BASE = {
  kdp: {
    query: "What is the Key Decision Point (KDP) process in NASA projects?",
    acronyms: "KDP (Key Decision Point), SRR (System Requirements Review), PDR (Preliminary Design Review)",
    confidence: "98.4%",
    vectors: "885 indexed / 4 matched (Cosine Sim: 0.942)",
    citation: "NASA Systems Engineering Handbook (NASA/SP-2016-6105 Rev 2), Section 3.0, Page 42",
    response: "A Key Decision Point (KDP) is an event in the NASA project life cycle where the Decision Authority assesses the project readiness, maturity, and compliance to progress into the next project phase. KDP gates evaluate programmatic viability (cost, schedule, risk) alongside technical milestones (such as SRR, SDR, or PDR)."
  },
  trl: {
    query: "Explain Technology Readiness Levels (TRL) in NASA Systems Engineering.",
    acronyms: "TRL (Technology Readiness Level 1-9), TRA (Technology Readiness Assessment)",
    confidence: "99.1%",
    vectors: "885 indexed / 6 matched (Cosine Sim: 0.967)",
    citation: "NASA Systems Engineering Handbook, Appendix G & Section 4.2, Page 218",
    response: "Technology Readiness Levels (TRL) range from TRL 1 (basic principles observed and reported) to TRL 9 (actual system flight proven through successful mission operations). NASA requires flight systems to reach TRL 6 (system/subsystem model or prototype demonstration in a relevant environment) prior to Preliminary Design Review (PDR)."
  },
  pdr: {
    query: "What are the primary objectives of the Preliminary Design Review (PDR)?",
    acronyms: "PDR (Preliminary Design Review), CDR (Critical Design Review), KDP-C",
    confidence: "97.8%",
    vectors: "885 indexed / 5 matched (Cosine Sim: 0.938)",
    citation: "NASA Systems Engineering Handbook, Section 6.7.2.1, Page 164",
    response: "The Preliminary Design Review (PDR) demonstrates that the preliminary design meets all system requirements with acceptable risk and within cost and schedule constraints. It establishes the design baseline prior to beginning detailed design activities leading up to CDR and KDP-C authorization."
  },
  risk: {
    query: "How does NASA implement Continuous Risk Management (CRM)?",
    acronyms: "CRM (Continuous Risk Management), RIDM (Risk-Informed Decision Making), LxC (Likelihood & Consequence)",
    confidence: "96.5%",
    vectors: "885 indexed / 4 matched (Cosine Sim: 0.925)",
    citation: "NASA Systems Engineering Handbook, Section 6.4, Page 141",
    response: "NASA's Continuous Risk Management (CRM) loop incorporates identification, analysis, planning, tracking, controlling, and communicating risk iteratively across the project life cycle, evaluating potential programmatic and technical risks using 5x5 Likelihood vs Consequence matrices."
  }
};

function initRAGSimulator() {
  const input = document.getElementById('ragQueryInput');
  const runBtn = document.getElementById('runRagBtn');
  const textStream = document.getElementById('ragTextStream');
  const confScore = document.getElementById('ragConfidence');
  const vectorMeta = document.getElementById('ragVectorMeta');
  const citationBox = document.getElementById('ragCitationBox');
  const citationText = document.getElementById('ragCitationText');
  const presetBtns = document.querySelectorAll('.preset-btn');

  if (!input || !runBtn || !textStream) return;

  function executeQuery(key) {
    const data = RAG_KNOWLEDGE_BASE[key] || {
      query: input.value,
      acronyms: "NASA Acronym Expansion active",
      confidence: "94.2%",
      vectors: "885 indexed / 3 matched (Cosine Sim: 0.892)",
      citation: "NASA Systems Engineering Handbook, Section 4.0",
      response: `Retrieved semantic context for: "${input.value}". Extracted relevant technical procedures and cross-referenced with LLaMA-3.3-70B pipeline with multi-turn context retention.`
    };

    input.value = data.query;
    textStream.innerHTML = `<span style="color: var(--primary);">[Embedding query with sentence-transformers...]</span><br/><span style="color: var(--emerald);">[Executing FAISS cosine similarity across 885 handbook vectors...]</span>`;
    confScore.innerHTML = `Calculating...`;
    vectorMeta.textContent = `Searching vectors...`;
    citationBox.style.display = 'none';

    sfx.click();

    setTimeout(() => {
      vectorMeta.textContent = data.vectors;
      confScore.innerHTML = `Confidence: <span style="color: var(--emerald);">${data.confidence}</span>`;
      
      // Stream text effect
      textStream.innerHTML = '';
      let charI = 0;
      const fullText = data.response;
      
      const interval = setInterval(() => {
        textStream.textContent = fullText.slice(0, charI + 2);
        charI += 2;
        if (charI >= fullText.length) {
          clearInterval(interval);
          citationText.textContent = data.citation;
          citationBox.style.display = 'flex';
          sfx.success();
        }
      }, 15);
    }, 600);
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const qKey = btn.getAttribute('data-query-key');
      executeQuery(qKey);
    });
  });

  runBtn.addEventListener('click', () => {
    const val = input.value.toLowerCase();
    if (val.includes('kdp') || val.includes('decision')) executeQuery('kdp');
    else if (val.includes('trl') || val.includes('readiness')) executeQuery('trl');
    else if (val.includes('pdr') || val.includes('design')) executeQuery('pdr');
    else if (val.includes('risk') || val.includes('crm')) executeQuery('risk');
    else executeQuery('kdp');
  });
}

// ==========================================
// 7. Interactive Multi-Agent Workflow Visualizer
// ==========================================
function initAgentVisualizer() {
  const steps = document.querySelectorAll('.step-card');
  const triggerBtn = document.getElementById('runAgentSimulationBtn');
  const agentLog = document.getElementById('agentExecutionLog');

  if (!steps.length || !triggerBtn || !agentLog) return;

  const logs = [
    "[Trigger]: Webhook dispatched incoming client request: 'Analyze & cluster 50K customer transaction logs for fraud patterns'",
    "[Reflex Layer]: Rule engine evaluated payload. Fixed schema validation passed. Routing to LLM Planner.",
    "[Planner Agent]: Decomposed goal into 3 sub-tasks: (1) Ingest & preprocess, (2) IsolationForest outlier scoring, (3) JSON synthesis.",
    "[Executor Agent]: Containerized FastAPI worker spawned async inference task. Executed Scikit-learn pipeline.",
    "[Reviewer Agent]: Checked output format, ROC-AUC metric verification, and zero hallucination audit. Verified task complete ✅"
  ];

  let isRunning = false;

  triggerBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    sfx.click();

    steps.forEach(s => s.classList.remove('active-step'));
    agentLog.textContent = "Initializing Multi-Agent runtime container...";

    let currentStep = 0;

    function stepNext() {
      if (currentStep > 0) {
        steps[currentStep - 1].classList.remove('active-step');
      }

      if (currentStep < steps.length) {
        steps[currentStep].classList.add('active-step');
        agentLog.textContent = logs[currentStep];
        sfx.hover();
        currentStep++;
        setTimeout(stepNext, 900);
      } else {
        steps.forEach(s => s.classList.add('active-step'));
        agentLog.textContent = "[SYSTEM READY]: Autonomous pipeline completed in 3.6s with memory persistence and self-correction audit.";
        sfx.success();
        isRunning = false;
      }
    }

    stepNext();
  });
}

// ==========================================
// 8. Projects Filter Tabs
// ==========================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-wrap');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sfx.click();

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================
// 9. Anti-Scraping Dynamic Contact Decoders & Toast
// ==========================================
function showToast(message) {
  let toast = document.getElementById('portfolioToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolioToast';
    toast.className = 'toast-box';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add('show');
  sfx.success();

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function initContactSecurity() {
  // Obfuscated encoded arrays to prevent AI bots and email scrapers from scraping raw mailto/tel in HTML
  const encodedEmail = [106, 97, 121, 100, 101, 118, 101, 108, 111, 112, 101, 114, 48, 49, 48, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109];
  const encodedPhone = [43, 57, 49, 32, 55, 54, 55, 53, 48, 49, 48, 56, 51, 49];

  function decode(arr) {
    return String.fromCharCode.apply(null, arr);
  }

  const emailEl = document.getElementById('secureEmailDisplay');
  const phoneEl = document.getElementById('securePhoneDisplay');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');

  if (emailEl) {
    const realEmail = decode(encodedEmail);
    emailEl.textContent = realEmail;
    emailEl.href = `mailto:${realEmail}`;
  }

  if (phoneEl) {
    const realPhone = decode(encodedPhone);
    phoneEl.textContent = realPhone;
    phoneEl.href = `tel:${realPhone.replace(/\s+/g, '')}`;
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const realEmail = decode(encodedEmail);
      navigator.clipboard.writeText(realEmail).then(() => {
        showToast('Email copied to clipboard!');
      });
    });
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const realPhone = decode(encodedPhone);
      navigator.clipboard.writeText(realPhone).then(() => {
        showToast('Phone number copied to clipboard!');
      });
    });
  }
}

// ==========================================
// 10. PDF Resume & Recruiter Modals Controller
// ==========================================
function initResumeModal() {
  const modal = document.getElementById('resumeModal');
  const openBtns = document.querySelectorAll('.open-resume-modal-btn');
  const closeBtn = document.getElementById('closeResumeModalBtn');

  if (!modal) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      sfx.click();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      sfx.click();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

function initRecruiterModal() {
  const modal = document.getElementById('recruiterModal');
  const openBtns = document.querySelectorAll('.open-recruiter-modal-btn');
  const closeBtn = document.getElementById('closeRecruiterModalBtn');

  if (!modal) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      sfx.click();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      sfx.click();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ==========================================
// 11. Command Palette (Cmd+K) Controller
// ==========================================
function initCommandPalette() {
  const modal = document.getElementById('cmdkModal');
  const triggerBtn = document.getElementById('cmdkTriggerBtn');
  const input = document.getElementById('cmdkInput');
  const resultsContainer = document.getElementById('cmdkResults');
  const items = document.querySelectorAll('.cmdk-item');

  if (!modal || !input) return;

  function openCmdk() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    input.value = '';
    filterItems('');
    setTimeout(() => input.focus(), 50);
    sfx.click();
  }

  function closeCmdk() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    sfx.hover();
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCmdk();
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('open')) {
        closeCmdk();
      } else {
        openCmdk();
      }
    } else if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeCmdk();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeCmdk();
    }
  });

  function filterItems(query) {
    const q = query.toLowerCase().trim();
    items.forEach((item) => {
      const title = item.querySelector('.cmdk-item-title')?.textContent.toLowerCase() || '';
      const desc = item.querySelector('.cmdk-item-desc')?.textContent.toLowerCase() || '';
      if (!q || title.includes(q) || desc.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  input.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      const target = item.getAttribute('data-target');
      closeCmdk();

      if (action === 'goto' && target) {
        const section = document.querySelector(target);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (action === 'open-recruiter') {
        const recruiterModal = document.getElementById('recruiterModal');
        recruiterModal?.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else if (action === 'open-resume') {
        const resumeModal = document.getElementById('resumeModal');
        resumeModal?.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else if (action === 'copy-email') {
        navigator.clipboard.writeText('jaydeveloper010@gmail.com').then(() => {
          showToast('Email copied to clipboard: jaydeveloper010@gmail.com');
        });
      } else if (action === 'toggle-sound') {
        const audioBtn = document.getElementById('audioToggleBtn');
        audioBtn?.click();
      }
    });
  });
}

// ==========================================
// 12. Architecture Switcher & Topology Matrix
// ==========================================
function initArchitectureSwitcher() {
  const tabBtns = document.querySelectorAll('.arch-tab-btn');
  const titleEl = document.getElementById('archTitle');
  const subtitleEl = document.getElementById('archSubtitle');
  const canvasEl = document.getElementById('archFlowCanvas');
  const p95El = document.getElementById('telemetryP95');
  const tpsEl = document.getElementById('telemetryTps');
  const vectorsEl = document.getElementById('telemetryVectors');
  const cosEl = document.getElementById('telemetryCos');

  if (!tabBtns.length || !canvasEl) return;

  const archData = {
    nasa: {
      title: "🚀 NASA RAG Systems Engineering Pipeline",
      subtitle: "270-Page NASA SE Handbook · 885 FAISS Vectors · LLaMA-3.3-70B via Groq",
      nodes: [
        { num: "01", title: "Document Ingestion", desc: "PyPDF & PdfPlumber chunking 270 pages into 500-token semantic chunks" },
        { num: "02", title: "Embedding Generation", desc: "sentence-transformers (all-MiniLM-L6-v2) generates 768-dim dense vectors" },
        { num: "03", title: "Vector Index & Search", desc: "FAISS IndexFlatIP cosine similarity retrieval with sub-40ms p95 lookup" },
        { num: "04", title: "LLM Synthesizer & Citations", desc: "Groq LPU LLaMA-3.3-70B synthesizes answer with exact section/page citations" }
      ],
      p95: "38",
      p95Unit: "ms",
      tps: "285",
      tpsUnit: "tok/s",
      vectors: "885",
      vectorsUnit: "vectors",
      cos: "0.94+"
    },
    pinguru: {
      title: "📱 PinGuru Instagram Automation SaaS Architecture",
      subtitle: "FastAPI Backend · MongoDB Async · Instagram Graph API Webhooks · Stripe Multi-Tier",
      nodes: [
        { num: "01", title: "Webhook Ingestion", desc: "Instagram Graph API triggers real-time comment & message event payload" },
        { num: "02", title: "Auth & Security", desc: "JWT verification, OTP validation & rate-limiting middleware on FastAPI" },
        { num: "03", title: "Workflow Automation", desc: "Deterministic DM trigger engine matches keywords and schedules DM dispatches" },
        { num: "04", title: "Async DB & Payments", desc: "MongoDB Motor async persistence with Stripe webhooks for multi-tier billing" }
      ],
      p95: "42",
      p95Unit: "ms",
      tps: "1,200",
      tpsUnit: "req/min",
      vectors: "10K+",
      vectorsUnit: "events/day",
      cos: "99.9%"
    },
    enterprise: {
      title: "⚙️ Enterprise ML Classification & Inference Pipeline",
      subtitle: "Scikit-learn · SQL Optimization · Sub-45ms Flask REST API · 10K–100K Datasets",
      nodes: [
        { num: "01", title: "SQL Data Extraction", desc: "High-throughput SQL queries with indexing, speeding preprocessing by 20%" },
        { num: "02", title: "Automated Feature Eng", desc: "Pandas & NumPy automated transformation & outlier imputation on 50K records" },
        { num: "03", title: "Scikit-Learn Classifier", desc: "Ensemble & Random Forest architectures achieving 82–87% cross-validated accuracy" },
        { num: "04", title: "Flask Microservice", desc: "Sub-45ms REST prediction endpoints packaged in Docker containers" }
      ],
      p95: "44",
      p95Unit: "ms",
      tps: "870",
      tpsUnit: "evals/sec",
      vectors: "50K",
      vectorsUnit: "records",
      cos: "87.4%"
    }
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sfx.click();

      const archKey = btn.getAttribute('data-arch') || 'nasa';
      const data = archData[archKey];
      if (!data) return;

      if (titleEl) titleEl.textContent = data.title;
      if (subtitleEl) subtitleEl.textContent = data.subtitle;

      // Render nodes
      canvasEl.innerHTML = data.nodes.map((node, i) => `
        <div class="arch-step-node">
          <div class="arch-node-badge">${node.num}</div>
          <div class="arch-node-body">
            <h5>${node.title}</h5>
            <p>${node.desc}</p>
          </div>
        </div>
        ${i < data.nodes.length - 1 ? '<div class="arch-connector">➔</div>' : ''}
      `).join('');

      if (p95El) p95El.innerHTML = `${data.p95} <span>${data.p95Unit}</span>`;
      if (tpsEl) tpsEl.innerHTML = `${data.tps} <span>${data.tpsUnit}</span>`;
      if (vectorsEl) vectorsEl.innerHTML = `${data.vectors} <span>${data.vectorsUnit}</span>`;
      if (cosEl) cosEl.textContent = data.cos;
    });
  });
}

// ==========================================
// 13. Navbar Scroll Effect & Audio Toggle
// ==========================================
function initNavbarAndAudio() {
  const navbar = document.querySelector('.navbar');
  const audioBtn = document.getElementById('audioToggleBtn');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      sfx.click();
    });
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      if (sfx.enabled) {
        audioBtn.innerHTML = '🔊';
        audioBtn.title = 'Sound FX: Enabled';
        showToast('Tactile Sound FX Enabled');
        sfx.click();
      } else {
        audioBtn.innerHTML = '🔇';
        audioBtn.title = 'Sound FX: Muted';
        showToast('Sound FX Muted');
      }
    });
  }
}

// ==========================================
// 14. DOM Ready Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNeuralCanvas();
  initTypewriter();
  init3DTilt();
  initRAGSimulator();
  initAgentVisualizer();
  initProjectFilters();
  initContactSecurity();
  initResumeModal();
  initRecruiterModal();
  initCommandPalette();
  initArchitectureSwitcher();
  initNavbarAndAudio();

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been prepared.');
      contactForm.reset();
    });
  }
});
