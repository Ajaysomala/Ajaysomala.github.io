/* MAIN.JS — Nav, availability, year, smooth anchors */
(function () {
  const year = document.getElementById("footerYear");
  if (year) year.textContent = new Date().getFullYear();

  /* Mobile nav */
  const toggle = document.getElementById("navToggle");
  const drawer = document.getElementById("navDrawer");
  function setOpen(open) {
    if (!drawer || !toggle) return;
    drawer.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && drawer) {
    toggle.addEventListener("click", () => setOpen(drawer.hidden));
    drawer.querySelectorAll("[data-close]").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });
  }

  /* Smooth anchors */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    });
  });

  /* Availability badge */
  const avail = document.getElementById("availText");
  if (avail) {
    const JOIN_DATE = new Date(2026, 5, 15);
    function update() {
      const diff = JOIN_DATE - new Date();
      if (diff <= 0) {
        avail.textContent = "Available now";
        return;
      }
      const days = Math.ceil(diff / 86400000);
      avail.textContent =
        days === 1 ? "Available in 1 day" : `Available in ${days} days`;
    }
    update();
    setInterval(update, 60000);
  }
})();
