/* ═══════════════════════════════════════════
   SECURITY.JS — Console Warning
   Somala Ajay Portfolio
═══════════════════════════════════════════ */

(function () {
  try {
    const w = [
      '%c⚠ STOP!',
      'color:#f87171;font-size:2rem;font-weight:bold',
      '\nThis is a browser developer feature. Do not paste anything here you were told to paste. It could compromise your security.',
      '\n\nPortfolio by Somala Ajay — ajaysomala@gmail.com',
    ];
    console.log(...w);
  } catch (_) {}
})();
