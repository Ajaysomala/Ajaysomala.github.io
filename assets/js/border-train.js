/* ═══════════════════════════════════════════════════
   BORDER-TRAIN.JS
   Experience Cards — Legend-style tech tags
   sit ON the card border (like HTML legend tag)
   A glowing train travels the border dropping
   each tag at its position, then stops.
   Somala Ajay Portfolio
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const EXP_DATA = [
    {
      selector: '.timeline-item:nth-child(1) .timeline-card',
      color:    '#d4a843',
      skills:   ['SQL', 'Data Ops', '98% Accuracy', 'ETL', 'SLA', 'Validation', 'Pipelines'],
    },
    {
      selector: '.timeline-item:nth-child(2) .timeline-card',
      color:    '#9b59f5',
      skills:   ['Python', 'TensorFlow', 'Flask', 'NLP', 'OpenCV', 'Pandas', '31 Projects', 'GenAI'],
    },
  ];

  /* ── Inject base styles once ── */
  function injectStyles() {
    if (document.getElementById('btrain-styles')) return;
    const s = document.createElement('style');
    s.id = 'btrain-styles';
    s.textContent = `
      /* Card must be relative so tags can position on border */
      .timeline-card { position: relative !important; overflow: visible !important; }

      /* Legend-style tag: sits exactly on the border line */
      .btag {
        position: absolute;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.62rem;
        font-weight: 600;
        padding: 0.18rem 0.55rem;
        border-radius: 4px;
        border: 1px solid;
        white-space: nowrap;
        opacity: 0;
        transform: scale(0.7);
        transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1);
        z-index: 10;
        pointer-events: none;
        letter-spacing: 0.06em;
      }
      .btag.visible {
        opacity: 1;
        transform: scale(1);
      }
      /* Train glow dot */
      .btrain-dot {
        position: absolute;
        width: 10px; height: 10px;
        border-radius: 50%;
        margin: -5px;
        pointer-events: none;
        z-index: 11;
        transition: none;
      }
      .btrain-dot::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: inherit;
        opacity: 0.3;
        filter: blur(4px);
      }
    `;
    document.head.appendChild(s);
  }

  /* ── Distribute tag positions around border ── */
  function getTagPositions(card, count) {
    const W = card.offsetWidth;
    const H = card.offsetHeight;
    const perim = 2 * (W + H);
    const positions = [];

    for (let i = 0; i < count; i++) {
      // Space evenly, start from top-left going clockwise
      // Skip corners slightly for cleaner look
      const t = (i + 0.5) / count;
      const d = t * perim;
      let x, y, side;

      if (d < W) {
        // Top edge
        x = d; y = 0; side = 'top';
      } else if (d < W + H) {
        // Right edge
        x = W; y = d - W; side = 'right';
      } else if (d < 2*W + H) {
        // Bottom edge
        x = W - (d - W - H); y = H; side = 'bottom';
      } else {
        // Left edge
        x = 0; y = H - (d - 2*W - H); side = 'left';
      }
      positions.push({ x, y, side, t });
    }
    return positions;
  }

  /* ── Place a legend tag on the border ── */
  function placeTag(card, pos, label, color, bgColor) {
    const tag = document.createElement('span');
    tag.className = 'btag';
    tag.textContent = label;
    tag.style.color       = color;
    tag.style.borderColor = color + '90';
    tag.style.background  = bgColor;

    // Position based on which side of border
    const HALF_H = 10; // half tag height approx
    const HALF_W = (label.length * 5 + 12) / 2; // approx half tag width

    switch (pos.side) {
      case 'top':
        tag.style.left = (pos.x - HALF_W) + 'px';
        tag.style.top  = (-HALF_H) + 'px';  // sits ON top border
        break;
      case 'right':
        tag.style.right = (-HALF_W * 0.5) + 'px';
        tag.style.top   = (pos.y - HALF_H) + 'px';
        break;
      case 'bottom':
        tag.style.left   = (pos.x - HALF_W) + 'px';
        tag.style.bottom = (-HALF_H) + 'px';  // sits ON bottom border
        break;
      case 'left':
        tag.style.left = (-HALF_W * 1.2) + 'px';
        tag.style.top  = (pos.y - HALF_H) + 'px';
        break;
    }

    card.appendChild(tag);

    // Animate in after tiny delay
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        tag.classList.add('visible');
      });
    });

    return tag;
  }

  /* ── Animate train along border, drop tags ── */
  function runBorderTrain(card, color, skills) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const bgColor = isDark ? 'rgba(15,10,28,0.92)' : 'rgba(248,244,255,0.92)';

    const W = card.offsetWidth;
    const H = card.offsetHeight;
    const perim = 2*(W+H);

    const positions = getTagPositions(card, skills.length);

    // Create train dot
    const dot = document.createElement('div');
    dot.className   = 'btrain-dot';
    dot.style.background = color;
    dot.style.boxShadow  = `0 0 8px ${color}, 0 0 16px ${color}60`;
    card.appendChild(dot);

    let currentTarget = 0;
    let dotT  = 0; // 0→1 along perimeter
    const targetT = positions[0].t;
    let stopped    = false;
    let stopFrames = 0;
    const STOP_DUR = 22;
    const SPEED    = 0.007;
    let animId;

    function getPerimPoint(t) {
      const d = t * perim;
      if (d < W)       return { x: d,          y: 0 };
      if (d < W+H)     return { x: W,            y: d-W };
      if (d < 2*W+H)   return { x: W-(d-W-H),   y: H };
                       return { x: 0,             y: H-(d-2*W-H) };
    }

    function step() {
      if (stopped) {
        stopFrames++;
        if (stopFrames >= STOP_DUR) {
          stopped     = false;
          stopFrames  = 0;
          currentTarget++;
          if (currentTarget >= skills.length) {
            // All done — remove train dot
            dot.style.transition = 'opacity 0.5s';
            dot.style.opacity    = '0';
            setTimeout(function() { dot.remove(); }, 600);
            return;
          }
        }
      } else {
        // Move toward next target
        const target = positions[currentTarget].t;
        const diff   = target - dotT;
        // Handle wrap-around
        const wrappedDiff = diff < -0.5 ? diff + 1 : diff > 0.5 ? diff - 1 : diff;

        if (Math.abs(wrappedDiff) < SPEED * 1.5) {
          dotT    = target;
          stopped = true;
          // Drop tag at this position
          placeTag(card, positions[currentTarget], skills[currentTarget], color, bgColor);
        } else {
          dotT = (dotT + Math.sign(wrappedDiff) * SPEED + 1) % 1;
        }
      }

      // Move dot element
      const pt = getPerimPoint(dotT);
      dot.style.left = pt.x + 'px';
      dot.style.top  = pt.y + 'px';

      animId = requestAnimationFrame(step);
    }

    step();
  }

  /* ── Watch for cards entering viewport ── */
  function watchCards() {
    EXP_DATA.forEach(function(exp) {
      const card = document.querySelector(exp.selector);
      if (!card) return;

      let started = false;
      const obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !started) {
            started = true;
            setTimeout(function() {
              runBorderTrain(card, exp.color, exp.skills);
            }, 350);
            obs.unobserve(card);
          }
        });
      }, { threshold: 0.45 });

      obs.observe(card);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    injectStyles();
    setTimeout(watchCards, 500);
  });

})();
