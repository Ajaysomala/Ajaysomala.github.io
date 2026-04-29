/* HERO.JS */
(function () {
  const roles=['Python Developer','AI / ML Engineer','Data Scientist','GenAI Builder','RAG Engineer'];
  const target=document.getElementById('roleTyped');
  if(!target) return;
  let ri=0,ci=0,del=false;
  function type() {
    const w=roles[ri];
    if(!del) { target.textContent=w.slice(0,++ci); if(ci===w.length){del=true;setTimeout(type,1900);return;} }
    else      { target.textContent=w.slice(0,--ci); if(ci===0){del=false;ri=(ri+1)%roles.length;setTimeout(type,380);return;} }
    setTimeout(type,del?32:65);
  }
  setTimeout(type,950);

  /* Counters */
  const obs=new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const el=e.target, tgt=parseInt(el.dataset.target), dur=1400, start=performance.now();
      function upd(now) {
        const p=Math.min((now-start)/dur,1), ease=1-Math.pow(1-p,3);
        el.textContent=Math.round(ease*tgt);
        if(p<1) requestAnimationFrame(upd); else el.textContent=tgt;
      }
      requestAnimationFrame(upd);
      obs.unobserve(el);
    });
  },{threshold:0.5});
  document.querySelectorAll('.stat-val[data-target]').forEach(s=>obs.observe(s));
})();
