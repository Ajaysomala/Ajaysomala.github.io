/* ═══════════════════════════════════════════════════
   CONSTELLATION.JS
   1. Skills Section — Full interactive constellation
      replacing the skill cards grid
   2. Experience Section — Mini side constellation
      that reacts to which card you hover
   Somala Ajay Portfolio
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     DATA — Skills grouped by category
  ══════════════════════════════════════ */
  const SKILL_GROUPS = [
    {
      id: 'lang', label: 'Programming', color: '#9b59f5', cx: 0.18, cy: 0.25,
      skills: ['Python', 'SQL', 'Bash']
    },
    {
      id: 'backend', label: 'Backend', color: '#d4a843', cx: 0.50, cy: 0.12,
      skills: ['Flask', 'Django', 'REST APIs', 'API Integration']
    },
    {
      id: 'data', label: 'Data Science', color: '#60a5fa', cx: 0.82, cy: 0.25,
      skills: ['Pandas', 'NumPy', 'ETL', 'Data Cleaning']
    },
    {
      id: 'ml', label: 'ML / AI', color: '#f472b6', cx: 0.82, cy: 0.65,
      skills: ['TensorFlow', 'Keras', 'Scikit-learn', 'OpenCV']
    },
    {
      id: 'genai', label: 'GenAI & NLP', color: '#34d399', cx: 0.50, cy: 0.82,
      skills: ['Generative AI', 'NLP', 'NLTK', 'Prompting']
    },
    {
      id: 'tools', label: 'Tools', color: '#fb923c', cx: 0.18, cy: 0.65,
      skills: ['Git', 'GitHub', 'Docker', 'MySQL']
    },
  ];

  /* Experience tech mapping */
  const EXP_TECH = {
    mahindra: {
      label: 'Tech Mahindra',
      color: '#d4a843',
      nodes: [
        { label: 'Data Entry',    x: 0.5,  y: 0.15 },
        { label: 'SQL',          x: 0.78, y: 0.32 },
        { label: 'Validation',   x: 0.85, y: 0.55 },
        { label: 'ETL',          x: 0.72, y: 0.72 },
        { label: 'SLA Ops',      x: 0.45, y: 0.82 },
        { label: '98% Accuracy', x: 0.2,  y: 0.68 },
        { label: 'Pipelines',    x: 0.15, y: 0.42 },
        { label: 'Audit',        x: 0.28, y: 0.22 },
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[1,3],[2,5]]
    },
    trylogic: {
      label: 'Trylogic',
      color: '#9b59f5',
      nodes: [
        { label: 'Python',       x: 0.5,  y: 0.1  },
        { label: 'TensorFlow',   x: 0.8,  y: 0.25 },
        { label: 'Flask',        x: 0.88, y: 0.52 },
        { label: 'OpenCV',       x: 0.78, y: 0.75 },
        { label: '31 Projects',  x: 0.5,  y: 0.88 },
        { label: 'NLP',          x: 0.22, y: 0.75 },
        { label: 'GenAI',        x: 0.12, y: 0.52 },
        { label: 'Pandas',       x: 0.2,  y: 0.25 },
        { label: 'BeautifulSoup',x: 0.5,  y: 0.48 },
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[8,0],[8,1],[8,4],[8,5]]
    }
  };

  /* ══════════════════════════════════════
     PART 1 — SKILLS CONSTELLATION
  ══════════════════════════════════════ */
  function initSkillsConstellation() {
    const wrap = document.getElementById('skillsConstellation');
    if (!wrap) return;

    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], hoveredGroup = null, animId;

    function isDark() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function resize() {
      W = canvas.width  = wrap.offsetWidth;
      H = canvas.height = wrap.offsetHeight;
      buildNodes();
    }

    function buildNodes() {
      nodes = [];
      SKILL_GROUPS.forEach(function (g) {
        // Hub node (category center)
        const hubX = g.cx * W;
        const hubY = g.cy * H;
        nodes.push({
          x: hubX, y: hubY, vx: 0, vy: 0,
          label: g.label, isHub: true,
          group: g.id, color: g.color,
          r: 8, baseR: 8,
          pulse: Math.random() * Math.PI * 2,
        });

        // Skill nodes around hub
        g.skills.forEach(function (skill, i) {
          const angle  = (i / g.skills.length) * Math.PI * 2 - Math.PI / 2;
          const radius = Math.min(W, H) * 0.1 + 20;
          nodes.push({
            x: hubX + Math.cos(angle) * radius,
            y: hubY + Math.sin(angle) * radius,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            label: skill, isHub: false,
            group: g.id, color: g.color,
            r: 4.5, baseR: 4.5,
            ox: hubX + Math.cos(angle) * radius,  // origin
            oy: hubY + Math.sin(angle) * radius,
            pulse: Math.random() * Math.PI * 2,
          });
        });
      });
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);
      const dark = isDark();

      // Draw inter-hub connections (faint)
      for (let i = 0; i < SKILL_GROUPS.length; i++) {
        for (let j = i + 1; j < SKILL_GROUPS.length; j++) {
          const a = nodes.find(n => n.isHub && n.group === SKILL_GROUPS[i].id);
          const b = nodes.find(n => n.isHub && n.group === SKILL_GROUPS[j].id);
          if (!a || !b) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = dark
            ? 'rgba(155,89,245,0.06)'
            : 'rgba(124,58,237,0.06)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw intra-group connections
      nodes.forEach(function (n) {
        if (n.isHub) return;
        const hub = nodes.find(h => h.isHub && h.group === n.group);
        if (!hub) return;
        const isActive = hoveredGroup === n.group;
        const alpha = isActive ? 0.7 : (dark ? 0.18 : 0.14);
        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = isActive
          ? n.color + 'b0'
          : (dark ? 'rgba(200,200,255,0.18)' : 'rgba(100,80,200,0.14)');
        ctx.lineWidth = isActive ? 1.2 : 0.6;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(function (n) {
        n.pulse += 0.025;
        const breathe   = 0.5 + Math.sin(n.pulse) * 0.3;
        const isActive  = hoveredGroup === n.group;
        const r         = n.isHub
          ? (isActive ? n.baseR * 1.6 : n.baseR)
          : (isActive ? n.baseR * 1.4 : n.baseR);

        // Glow
        if (isActive) {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
          grd.addColorStop(0, n.color + '60');
          grd.addColorStop(1, n.color + '00');
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Node dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isActive
          ? n.color
          : (dark
            ? `rgba(200,210,255,${breathe * (n.isHub ? 0.9 : 0.55)})`
            : `rgba(100,80,200,${breathe * (n.isHub ? 0.8 : 0.45)})`);
        ctx.fill();

        // Label
        const showLabel = isActive || n.isHub;
        if (showLabel) {
          ctx.font = n.isHub
            ? `700 ${dark ? 11 : 10}px 'JetBrains Mono', monospace`
            : `400 ${dark ? 9 : 8.5}px 'JetBrains Mono', monospace`;
          ctx.textAlign  = 'center';
          ctx.fillStyle  = isActive ? n.color : (dark ? 'rgba(220,210,255,0.85)' : 'rgba(80,60,180,0.85)');

          // Label background pill
          const tw = ctx.measureText(n.label).width;
          const px = n.x, py = n.y + r + 14;
          ctx.fillStyle = dark ? 'rgba(15,10,28,0.75)' : 'rgba(245,240,255,0.85)';
          ctx.beginPath();
          ctx.roundRect(px - tw/2 - 5, py - 9, tw + 10, 14, 4);
          ctx.fill();
          ctx.fillStyle = isActive ? n.color : (dark ? 'rgba(220,210,255,0.9)' : 'rgba(80,60,180,0.9)');
          ctx.fillText(n.label, px, py);
        }

        // Float non-hub nodes gently
        if (!n.isHub && n.ox !== undefined) {
          n.x += (n.ox - n.x) * 0.015 + n.vx;
          n.y += (n.oy - n.y) * 0.015 + n.vy;
          n.vx *= 0.98;
          n.vy *= 0.98;
        }
      });
    }

    function loop() {
      animId = requestAnimationFrame(loop);
      drawFrame();
    }

    // Mouse hover detection
    canvas.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let found = null;
      nodes.forEach(function (n) {
        const dx = n.x - mx, dy = n.y - my;
        if (Math.sqrt(dx*dx+dy*dy) < 40) found = n.group;
      });
      hoveredGroup = found;
      canvas.style.cursor = found ? 'pointer' : 'default';
    });

    canvas.addEventListener('mouseleave', function () {
      hoveredGroup = null;
    });

    // Touch support
    canvas.addEventListener('touchstart', function (e) {
      const rect = canvas.getBoundingClientRect();
      const tx = e.touches[0].clientX - rect.left;
      const ty = e.touches[0].clientY - rect.top;
      let found = null;
      nodes.forEach(function (n) {
        const dx = n.x - tx, dy = n.y - ty;
        if (Math.sqrt(dx*dx+dy*dy) < 50) found = n.group;
      });
      hoveredGroup = found;
    }, { passive: true });

    canvas.addEventListener('touchend', function () {
      setTimeout(function() { hoveredGroup = null; }, 1500);
    }, { passive: true });

    window.addEventListener('resize', resize, { passive: true });
    resize();
    loop();
  }

  /* ══════════════════════════════════════
     PART 2 — EXPERIENCE MINI CONSTELLATION
  ══════════════════════════════════════ */
  function initExpConstellation() {
    const wrap = document.getElementById('expConstellation');
    if (!wrap) return;

    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H, currentExp = 'mahindra', animId, transitionT = 0;

    function isDark() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function resize() {
      W = canvas.width  = wrap.offsetWidth;
      H = canvas.height = wrap.offsetHeight;
    }

    function drawConstellation(expKey, alpha) {
      const exp   = EXP_TECH[expKey];
      if (!exp) return;
      const dark  = isDark();

      exp.nodes.forEach(function (n, i) {
        const px = n.x * W;
        const py = n.y * H;

        // Pulse per node
        const phase  = Date.now() * 0.001 + i * 0.8;
        const breathe = 0.6 + Math.sin(phase) * 0.3;
        const r = i === 4 ? 9 : 5.5; // highlight key stat node bigger

        // Glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 3.5);
        grd.addColorStop(0, exp.color + Math.round(breathe * alpha * 120).toString(16).padStart(2,'0'));
        grd.addColorStop(1, exp.color + '00');
        ctx.beginPath();
        ctx.arc(px, py, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = exp.color + Math.round(alpha * 220).toString(16).padStart(2,'0');
        ctx.fill();

        // Label
        ctx.font = `600 9.5px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        const tw = ctx.measureText(n.label).width;
        ctx.fillStyle = dark ? 'rgba(15,10,28,0.8)' : 'rgba(245,240,255,0.85)';
        ctx.beginPath();
        ctx.roundRect(px - tw/2 - 4, py + r + 3, tw + 8, 13, 3);
        ctx.fill();
        ctx.fillStyle = exp.color + Math.round(alpha * 255).toString(16).padStart(2,'0');
        ctx.fillText(n.label, px, py + r + 13);
      });

      // Edges
      exp.edges.forEach(function (e) {
        const a = exp.nodes[e[0]], b = exp.nodes[e[1]];
        ctx.beginPath();
        ctx.moveTo(a.x * W, a.y * H);
        ctx.lineTo(b.x * W, b.y * H);
        ctx.strokeStyle = exp.color + Math.round(alpha * 80).toString(16).padStart(2,'0');
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Travelling pulse along a random edge
      const edgeIdx = Math.floor((Date.now() * 0.0005) % exp.edges.length);
      const edge    = exp.edges[edgeIdx];
      const pT      = (Date.now() * 0.001) % 1;
      const na = exp.nodes[edge[0]], nb = exp.nodes[edge[1]];
      const ppx = (na.x + (nb.x - na.x) * pT) * W;
      const ppy = (na.y + (nb.y - na.y) * pT) * H;
      const pulseAlpha = Math.sin(pT * Math.PI) * alpha;
      const pgrd = ctx.createRadialGradient(ppx, ppy, 0, ppx, ppy, 7);
      pgrd.addColorStop(0, `rgba(255,255,255,${pulseAlpha * 0.9})`);
      pgrd.addColorStop(0.4, exp.color + Math.round(pulseAlpha * 180).toString(16).padStart(2,'0'));
      pgrd.addColorStop(1, exp.color + '00');
      ctx.beginPath();
      ctx.arc(ppx, ppy, 7, 0, Math.PI * 2);
      ctx.fillStyle = pgrd;
      ctx.fill();
    }

    function loop() {
      animId = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, W, H);
      drawConstellation(currentExp, 1);
    }

    // Hook into timeline card hover
    function hookTimeline() {
      const item1 = document.querySelector('.timeline-item:nth-child(1) .timeline-card');
      const item2 = document.querySelector('.timeline-item:nth-child(2) .timeline-card');

      if (item1) {
        item1.addEventListener('mouseenter', function() { currentExp = 'mahindra'; });
        item1.addEventListener('touchstart', function() { currentExp = 'mahindra'; }, { passive: true });
      }
      if (item2) {
        item2.addEventListener('mouseenter', function() { currentExp = 'trylogic'; });
        item2.addEventListener('touchstart', function() { currentExp = 'trylogic'; }, { passive: true });
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    hookTimeline();
    loop();
  }

  /* ══════════════════════════════════════
     INJECT STYLES
  ══════════════════════════════════════ */
  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      /* ── Skills Constellation ── */
      #skillsConstellation {
        width: 100%;
        height: 480px;
        position: relative;
        cursor: crosshair;
      }
      #skillsConstellation canvas {
        width: 100% !important;
        height: 100% !important;
        display: block;
      }
      .skills-constellation-hint {
        text-align: center;
        font-family: var(--font-mono);
        font-size: 0.62rem;
        color: var(--muted);
        letter-spacing: 0.12em;
        margin-top: 0.5rem;
        opacity: 0.7;
      }

      /* ── Experience Layout ── */
      .exp-layout {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 2rem;
        align-items: start;
      }

      /* ── Experience Mini Constellation ── */
      .exp-constellation-wrap {
        position: sticky;
        top: 100px;
      }
      .exp-constellation-label {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--gold);
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .exp-constellation-label::before {
        content: '';
        width: 14px; height: 1px;
        background: var(--gold);
      }
      #expConstellation {
        width: 100%;
        height: 320px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        overflow: hidden;
        position: relative;
      }
      #expConstellation canvas {
        width: 100% !important;
        height: 100% !important;
        display: block;
      }
      .exp-hint {
        font-family: var(--font-mono);
        font-size: 0.58rem;
        color: var(--muted);
        text-align: center;
        margin-top: 0.5rem;
        letter-spacing: 0.1em;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .exp-layout { grid-template-columns: 1fr; }
        .exp-constellation-wrap { position: relative; top: 0; }
        #expConstellation { height: 260px; }
        #skillsConstellation { height: 380px; }
      }
      @media (max-width: 600px) {
        #skillsConstellation { height: 320px; }
        #expConstellation { height: 220px; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ══════════════════════════════════════
     UPDATE HTML — inject constellation
     containers into the page
  ══════════════════════════════════════ */
  function patchHTML() {
    // 1. Replace skills-layout with constellation
    const skillsLayout = document.querySelector('.skills-layout');
    if (skillsLayout) {
      skillsLayout.outerHTML = `
        <div id="skillsConstellation"></div>
        <p class="skills-constellation-hint">✦ Hover a cluster to explore the tech stack</p>
      `;
    }

    // 2. Wrap timeline in exp-layout and add constellation panel
    const timeline = document.querySelector('#experience .timeline');
    if (timeline) {
      const parent = timeline.parentNode;
      const div    = document.createElement('div');
      div.className = 'exp-layout';
      parent.insertBefore(div, timeline);
      div.appendChild(timeline);

      const sidePanel = document.createElement('div');
      sidePanel.className = 'exp-constellation-wrap reveal-right';
      sidePanel.innerHTML = `
        <div class="exp-constellation-label">Tech Constellation</div>
        <div id="expConstellation"></div>
        <p class="exp-hint">↑ Hover an experience card to see its tech</p>
      `;
      div.appendChild(sidePanel);
    }
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    patchHTML();
    setTimeout(function () {
      initSkillsConstellation();
      initExpConstellation();
    }, 200);
  });

})();
