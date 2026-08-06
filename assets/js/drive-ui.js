/* DRIVE-UI.JS — typed role, stats, availability (original behaviors) */
(function () {
  /* Typed roles */
  const roles = [
    "Python Developer",
    "AI/ML Engineer",
    "Data Scientist",
    "GenAI & RAG Builder",
  ];
  const el = document.getElementById("roleTyped");
  if (el) {
    let ri = 0, ci = 0, del = false;
    function tick() {
      const word = roles[ri];
      el.textContent = word.slice(0, ci);
      if (!del && ci < word.length) { ci++; setTimeout(tick, 55); }
      else if (!del && ci === word.length) { del = true; setTimeout(tick, 1200); }
      else if (del && ci > 0) { ci--; setTimeout(tick, 28); }
      else { del = false; ri = (ri + 1) % roles.length; setTimeout(tick, 300); }
    }
    tick();
  }

  /* Stat counters when hero active */
  function animateStats() {
    document.querySelectorAll(".stat-val").forEach((node) => {
      const target = +node.dataset.target || 0;
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - t, 3);
        node.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  setTimeout(animateStats, 900);

  /* Availability */
  const badge = document.getElementById("availBadge");
  if (badge) {
    const JOIN = new Date(2026, 5, 15);
    function update() {
      const diff = JOIN - new Date();
      if (diff <= 0) { badge.textContent = "Available to Join Immediately"; return; }
      const days = Math.ceil(diff / 86400000);
      badge.textContent = days === 1
        ? "Available to Join in 1 Day"
        : `Serving Notice · Available in ${days} days`;
    }
    update();
    setInterval(update, 60000);
  }

  /* Allow panel scroll without stealing canvas when over panel */
  const panels = document.getElementById("panels");
  if (panels) {
    panels.addEventListener("wheel", (e) => {
      const active = document.querySelector(".panel.is-active");
      if (!active) return;
      if (active.scrollHeight > active.clientHeight) e.stopPropagation();
    }, { passive: true });
  }
})();
