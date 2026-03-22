/* ═══════════════════════════════════════════════════
   TYPED.JS — Typewriter effect for hero role
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Roles to cycle through
  const roles = [
    'Python Developer',
    'AI / ML Engineer',
    'Data Scientist',
    'Deep Learning Engineer',
    'GenAI Enthusiast',
  ];

  const el = document.getElementById('roleTyped');
  if (!el) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused   = false;

  const TYPING_SPEED   = 80;  // ms per character typed
  const DELETING_SPEED = 45;  // ms per character deleted
  const PAUSE_AFTER    = 1800; // ms to hold full text
  const PAUSE_BEFORE   = 300; // ms before typing next

  function type() {
    const current = roles[roleIndex];

    if (!isDeleting && !isPaused) {
      // Typing forward
      charIndex++;
      el.textContent = current.substring(0, charIndex);

      if (charIndex === current.length) {
        // Finished typing — pause before deleting
        isPaused = true;
        setTimeout(function () {
          isPaused    = false;
          isDeleting  = true;
          type();
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(type, TYPING_SPEED);

    } else if (isDeleting) {
      // Deleting backward
      charIndex--;
      el.textContent = current.substring(0, charIndex);

      if (charIndex === 0) {
        // Move to next role
        isDeleting  = false;
        roleIndex   = (roleIndex + 1) % roles.length;
        setTimeout(type, PAUSE_BEFORE);
        return;
      }
      setTimeout(type, DELETING_SPEED);
    }
  }

  // Start after hero load animation
  setTimeout(type, 1400);
})();
