/* ═══════════════════════════════════════════════════
   SECURITY.JS — Client-Side Security Layer
   Somala Ajay Portfolio

   Covers:
   1. Input sanitization (XSS prevention)
   2. Form rate limiting (spam prevention)
   3. Honeypot field injection
   4. External link hardening
   5. Console warning for devtools snooping
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. INPUT SANITIZER
     Escapes HTML special chars from any string.
     Use instead of innerHTML with user data.
  ───────────────────────────────────────────*/
  window.SA_Security = {

    /**
     * Sanitize a string — escape HTML special characters
     * @param {string} str
     * @returns {string}
     */
    sanitize: function (str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#x27;')
        .replace(/\//g, '&#x2F;');
    },

    /**
     * Validate email format
     * @param {string} email
     * @returns {boolean}
     */
    isValidEmail: function (email) {
      return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email.trim());
    },

    /**
     * Validate string length
     * @param {string} str
     * @param {number} min
     * @param {number} max
     * @returns {boolean}
     */
    isValidLength: function (str, min, max) {
      const len = (str || '').trim().length;
      return len >= min && len <= max;
    },
  };

  /* ─────────────────────────────────────────
     2. FORM RATE LIMITING
     Max 3 submissions per 10 minutes.
     Stored in sessionStorage (clears on tab close).
  ───────────────────────────────────────────*/
  const RATE_KEY      = 'sa_form_submissions';
  const MAX_ATTEMPTS  = 3;
  const WINDOW_MS     = 10 * 60 * 1000; // 10 minutes

  window.SA_Security.canSubmitForm = function () {
    try {
      const raw  = sessionStorage.getItem(RATE_KEY);
      const data = raw ? JSON.parse(raw) : { count: 0, firstAt: Date.now() };
      const now  = Date.now();

      // Reset window if expired
      if (now - data.firstAt > WINDOW_MS) {
        sessionStorage.setItem(RATE_KEY, JSON.stringify({ count: 0, firstAt: now }));
        return true;
      }

      if (data.count >= MAX_ATTEMPTS) {
        const remaining = Math.ceil((WINDOW_MS - (now - data.firstAt)) / 60000);
        return { blocked: true, minutesLeft: remaining };
      }

      return true;
    } catch (e) {
      return true; // Fail open — don't block legitimate users
    }
  };

  window.SA_Security.recordSubmission = function () {
    try {
      const raw  = sessionStorage.getItem(RATE_KEY);
      const data = raw ? JSON.parse(raw) : { count: 0, firstAt: Date.now() };
      data.count++;
      sessionStorage.setItem(RATE_KEY, JSON.stringify(data));
    } catch (e) { /* silent fail */ }
  };

  /* ─────────────────────────────────────────
     3. HONEYPOT FIELD INJECTION
     A hidden field bots will fill but humans won't.
     If filled → reject the submission silently.
  ───────────────────────────────────────────*/
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Inject honeypot (visually hidden, not display:none — screen readers ok)
    const honeypot = document.createElement('div');
    honeypot.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.innerHTML = '<label for="sa_url">Website</label><input type="text" id="sa_url" name="sa_url" tabindex="-1" autocomplete="off" value=""/>';
    form.appendChild(honeypot);
  });

  /**
   * Check if honeypot was filled (bot detected)
   * @returns {boolean} true if bot detected
   */
  window.SA_Security.isBotSubmission = function () {
    const hp = document.getElementById('sa_url');
    return hp && hp.value.trim() !== '';
  };

  /* ─────────────────────────────────────────
     4. EXTERNAL LINK HARDENING
     Ensures all external links have
     rel="noopener noreferrer" at runtime,
     even if forgotten in HTML.
  ───────────────────────────────────────────*/
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
      const rel = link.getAttribute('rel') || '';
      const parts = rel.split(' ').filter(Boolean);
      if (!parts.includes('noopener'))   parts.push('noopener');
      if (!parts.includes('noreferrer')) parts.push('noreferrer');
      link.setAttribute('rel', parts.join(' '));
    });
  });

  /* ─────────────────────────────────────────
     5. DEVTOOLS CONSOLE WARNING
     Friendly message for anyone who opens
     DevTools — shows you know your security.
  ───────────────────────────────────────────*/
  const STYLES = [
    'background:#9b59f5;color:#fff;padding:8px 16px;border-radius:6px;font-size:14px;font-weight:bold;',
    'color:#d4a843;font-size:12px;',
    'color:#9b59f5;font-size:11px;',
  ];

  console.log('%c 🔐 Somala Ajay — Portfolio ', STYLES[0]);
  console.log('%c Hey developer! 👋 Curious about the code?', STYLES[1]);
  console.log('%c Check out: github.com/Ajaysomala', STYLES[2]);
  console.log('%c This site uses CSP, input sanitization, rate limiting & honeypot protection.', STYLES[2]);

})();
