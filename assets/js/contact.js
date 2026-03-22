/* ═══════════════════════════════════════════════════
   CONTACT.JS — Contact Form Submission via EmailJS
   Replace EJ_SVC and EJ_TPL with your EmailJS IDs
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── EmailJS config ──
  // TODO: Replace with your actual EmailJS service/template IDs
  const EJ_SVC = 'YOUR_SERVICE_ID';
  const EJ_TPL = 'YOUR_TEMPLATE_ID';
  const EJ_KEY = 'YOUR_PUBLIC_KEY';

  // Load EmailJS SDK
  const script    = document.createElement('script');
  script.src      = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload   = function () {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EJ_KEY });
    }
  };
  document.head.appendChild(script);

  // ── Form submission ──
  const form   = document.getElementById('contactForm');
  const btn    = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Simple client-side validation
    const name    = form.querySelector('#cf-name').value.trim();
    const email   = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();

    if (!name || !email || !message) {
      showStatus('error', '✗ Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('error', '✗ Please enter a valid email address.');
      return;
    }

    // Disable button while sending
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.style.display = 'none';
    status.className = 'form-status';

    try {
      if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
      await emailjs.sendForm(EJ_SVC, EJ_TPL, form);
      showStatus('success', '✓ Message sent! I\'ll get back to you soon.');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      showStatus('error', '✗ Failed to send. Please email ajaysomala@gmail.com directly.');
    }

    // Re-enable button
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg> Send Message';
  });

  function showStatus(type, message) {
    status.textContent  = message;
    status.className    = 'form-status ' + type;
    status.style.display = 'block';
  }
})();
