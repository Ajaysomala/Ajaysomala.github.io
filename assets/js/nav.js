/* NAV.JS */
(function () {
  const navbar=document.getElementById('navbar'), hamburger=document.getElementById('hamburger'), mobileMenu=document.getElementById('mobileMenu'), mobClose=document.getElementById('mobClose'), progress=document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (progress) { const t=document.documentElement.scrollHeight-window.innerHeight; progress.style.width=(window.scrollY/t*100)+'%'; }
    const sections=document.querySelectorAll('section[id]'), links=document.querySelectorAll('.nav-links a');
    let cur='';
    sections.forEach(s => { if(window.scrollY >= s.offsetTop-130) cur=s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+cur));
  }, { passive:true });

  if(hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); mobileMenu.classList.toggle('open'); document.body.style.overflow=mobileMenu.classList.contains('open')?'hidden':''; });
  }
  if(mobClose) mobClose.addEventListener('click', closeMobileMenu);
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeMobileMenu(); });
  if(mobileMenu) mobileMenu.addEventListener('click', e => { if(e.target===mobileMenu) closeMobileMenu(); });
})();

function closeMobileMenu() {
  const h=document.getElementById('hamburger'), m=document.getElementById('mobileMenu');
  if(h) h.classList.remove('open');
  if(m) m.classList.remove('open');
  document.body.style.overflow='';
}
