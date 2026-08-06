/* CURSOR.JS */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let rx=0,ry=0,mx=0,my=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  function animRing() { rx+=(mx-rx)*0.13; ry+=(my-ry)*0.13; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing); }
  animRing();
  const SEL = 'a,button,input,textarea,[role="button"],.proj-card,.cert-card,.skill-card,.bento-card,.clink,.timeline-card';
  document.addEventListener('mouseover', e => { if(e.target.closest(SEL)){dot.classList.add('on-link');ring.classList.add('on-link');} });
  document.addEventListener('mouseout',  e => { if(e.target.closest(SEL)){dot.classList.remove('on-link');ring.classList.remove('on-link');} });
  document.addEventListener('mousedown', () => { dot.classList.add('clicking'); ring.classList.add('clicking'); });
  document.addEventListener('mouseup',   () => { dot.classList.remove('clicking'); ring.classList.remove('clicking'); });
})();
