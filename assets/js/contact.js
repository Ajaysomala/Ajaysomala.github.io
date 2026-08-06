/* CONTACT.JS — EmailJS */
(function () {
  if (typeof emailjs === "undefined") return;
  emailjs.init("GTm0XRjcyVSKUfqHN");
  const form = document.getElementById("contactForm");
  const btn = document.getElementById("submitBtn");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    btn.disabled = true;
    btn.textContent = "Sending…";
    status.textContent = "";
    status.className = "form-status";
    try {
      await emailjs.sendForm("service_8tyearo", "template_ov6tk5e", form);
      status.textContent = "Message sent — I'll reply soon.";
      status.className = "form-status success";
      form.reset();
    } catch {
      status.textContent =
        "Something went wrong. Email directly: jaydeveloper010@gmail.com";
      status.className = "form-status error";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Message";
    }
  });
})();
