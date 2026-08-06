/* MAIN.JS */
(function(){
  const yr=document.getElementById('footerYear');
  if(yr) yr.textContent=new Date().getFullYear();
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id=a.getAttribute('href').slice(1), el=document.getElementById(id);
      if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});}
    });
  });
})();
