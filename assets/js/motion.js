/* MOTION.JS — GSAP reveals, hero parallax, progress */
(function () {
  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll progress */
  const bar = document.getElementById("scroll-progress");
  const header = document.getElementById("header");
  const scrollTop = document.getElementById("scrollTop");

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (bar) bar.style.width = p * 100 + "%";
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
    if (scrollTop) scrollTop.classList.toggle("visible", window.scrollY > 480);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (scrollTop) {
    scrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Hero image parallax */
  const heroImg = document.querySelector(".hero-img");
  if (heroImg && !reduced) {
    window.addEventListener(
      "scroll",
      () => {
        const y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.transform = `scale(1.08) translate3d(0, ${y * 0.18}px, 0)`;
      },
      { passive: true }
    );
  }

  if (typeof gsap === "undefined") {
    document
      .querySelectorAll(".reveal-up,.reveal-left,.reveal-right,.reveal-fade,.reveal-line")
      .forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = "none";
      });
    return;
  }

  if (reduced) {
    gsap.set(
      [".reveal-up", ".reveal-left", ".reveal-right", ".reveal-fade", ".reveal-line"],
      { opacity: 1, clearProps: "transform" }
    );
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance */
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .fromTo(
      ".hero-brand",
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1 },
      0.15
    )
    .fromTo(
      ".hero-title",
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      0.35
    )
    .fromTo(
      ".hero-lede",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      0.55
    )
    .fromTo(
      ".hero-actions",
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.7
    )
    .fromTo(
      ".hero-scroll",
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      1
    );

  /* Section reveals */
  gsap.utils.toArray(".reveal-up").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
    });
  });

  gsap.utils.toArray(".reveal-left").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  gsap.utils.toArray(".reveal-right").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  /* Case study line emphasis */
  gsap.utils.toArray(".case").forEach((el) => {
    gsap.fromTo(
      el.querySelector(".case-index"),
      { opacity: 0.15, x: -12 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: { trigger: el, start: "top 80%" },
      }
    );
  });
})();
