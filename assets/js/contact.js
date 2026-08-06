/* CONTACT.JS */
(function () {
  if(typeof emailjs==='undefined') return;
  emailjs.init('GTm0XRjcyVSKUfqHN');
  const form=document.getElementById('contactForm'), btn=document.getElementById('submitBtn'), status=document.getElementById('formStatus');
  if(!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    btn.disabled=true; btn.textContent='Sending...'; status.textContent=''; status.className='form-status';
    try {
      await emailjs.sendForm('service_8tyearo','template_ov6tk5e',form);
      status.textContent="✓ Message sent — I'll reply soon!"; status.className='form-status success'; form.reset();
    } catch {
      status.textContent='✗ Something went wrong. Email directly: jaydeveloper010@gmail.com'; status.className='form-status error';
    } finally {
      btn.disabled=false;
      btn.innerHTML=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg> Send Message`;
    }
  });
})();
