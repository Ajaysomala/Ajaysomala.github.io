/* ASSISTANT.JS — On-site AI portfolio Q&A */
(function () {
  const messages = document.getElementById("askMessages");
  const form = document.getElementById("askForm");
  const input = document.getElementById("askInput");
  const suggestions = document.getElementById("askSuggestions");
  if (!messages || !form || !input) return;

  const KB = [
    {
      keys: ["role", "current", "job", "tcs", "work now", "company"],
      answer:
        "I'm currently an Associate Software Engineer at Tata Consultancy Services (TCS) in Hyderabad, designing end-to-end ML pipelines with Scikit-learn, Flask REST APIs, and SQL. I'm serving my notice period and open to AI/ML Engineer, Python Developer, and Data Scientist roles.",
    },
    {
      keys: ["available", "availability", "open", "notice", "join", "hire"],
      answer:
        "Yes — I'm open to opportunities. I'm serving notice at TCS and targeting AI/ML Engineer, Python Developer, and Data Scientist roles in Hyderabad or remote. Expected availability aligns with mid-June 2026.",
    },
    {
      keys: ["experience", "career", "background", "history"],
      answer:
        "About 3+ years across AI/ML and data roles: AI/ML Data Scientist at BO IT Solutions (2022–2024) delivering 20+ projects, Associate at Tech Mahindra (2024–2025) on enterprise data/WFMS, and now Associate Software Engineer at TCS building production ML pipelines.",
    },
    {
      keys: ["stack", "tech", "skills", "tools", "technology"],
      answer:
        "Core stack: Python, SQL, Bash · AI/ML: Scikit-learn, TensorFlow, Keras, CNN, LSTM, NLP · GenAI/RAG: LLMs, FAISS, LangChain, prompt engineering, AI agents · Backend: FastAPI, Flask, REST, Streamlit · Data: Pandas, NumPy, Matplotlib, ETL · Infra: Git, Docker, MySQL, SQLite.",
    },
    {
      keys: ["rag", "nasa", "hireathon", "faiss", "llm", "manual"],
      answer:
        "My NASA Manual QA System is a production RAG pipeline over the 270-page NASA Systems Engineering Handbook — 885 semantic vectors, FAISS indexing, Llama 3.3 via Groq, confidence scoring (0–100%), multi-turn history, section-level citations, and NASA acronym expansion. Built for i2e Hireathon 2026.",
    },
    {
      keys: ["pinguru", "instagram", "saas", "dm"],
      answer:
        "PinGuru is a full-stack Instagram DM automation SaaS (pinguru.me) with FastAPI/MongoDB, Instagram Graph API triggers, multi-tier Stripe billing, JWT/OTP security, and automated comment-to-DM workflows — deployed on DigitalOcean.",
    },
    {
      keys: ["project", "built", "portfolio", "tumor", "caption", "amazon"],
      answer:
        "Selected work includes PinGuru (Instagram DM SaaS), NASA Manual QA (RAG), Brain Tumor Detection (CNN, 90%+), Image Caption Generator (CNN+LSTM), Amazon Recommendation System, plus 20+ additional NLP/CV/GenAI projects on GitHub.",
    },
    {
      keys: ["accuracy", "metric", "result", "impact"],
      answer:
        "Recent results: 82–87% classification accuracy on TCS validation sets; 80–90% across earlier project deliveries; CNN/LSTM gains of ~15% over traditional ML baselines; ~25–30% reduction in manual preprocessing effort.",
    },
    {
      keys: ["education", "degree", "college", "university", "b.tech", "btech"],
      answer:
        "B.Tech in Electronics & Communication Engineering from Aditya University, Surampalem (2018–2022). Capstone: Quality Analysis of Rice Granules using MATLAB Image Processing.",
    },
    {
      keys: ["cert", "certificate", "credential", "nasscom", "microsoft"],
      answer:
        "Certifications include AI Data Scientist (NASSCOM), Career Essentials in Generative AI (Microsoft & LinkedIn), Generative AI Introduction (Microsoft Learning), Azure AI Foundry SDK, Python Basic (HackerRank), Agile (Forage), and Microsoft 365 Copilot.",
    },
    {
      keys: ["contact", "email", "phone", "reach", "linkedin", "github"],
      answer:
        "Email jaydeveloper010@gmail.com · Phone +91 76750 10831 · LinkedIn somala-ajay-8a806b213 · GitHub Ajaysomala · Based in Hyderabad, Telangana.",
    },
    {
      keys: ["who", "about", "yourself", "introduce"],
      answer:
        "I'm Somala Ajay — AI/ML Engineer & Python Developer based in Hyderabad. I ship end-to-end ML systems from messy data to production APIs, with deep work in NLP, Computer Vision, Deep Learning, GenAI, and RAG.",
    },
  ];

  const FALLBACK =
    "I can answer about my experience, stack, projects (PinGuru, NASA RAG, CV/ML work), certifications, education, or availability. Try asking “What is your tech stack?” or “Tell me about your RAG project.”";

  function addMessage(text, type) {
    const el = document.createElement("div");
    el.className = "msg msg-" + type;
    if (type === "bot") {
      el.innerHTML = '<span class="msg-label">Portfolio AI</span>' + escapeHtml(text);
    } else {
      el.textContent = text;
    }
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function answer(query) {
    const q = query.toLowerCase();
    let best = null;
    let bestScore = 0;
    KB.forEach((item) => {
      let score = 0;
      item.keys.forEach((k) => {
        if (q.includes(k)) score += k.length;
      });
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    });
    return bestScore > 0 ? best.answer : FALLBACK;
  }

  function typeAnswer(text) {
    const el = addMessage("", "bot");
    el.classList.add("msg-typing");
    const label = el.querySelector(".msg-label");
    let i = 0;
    const speed = 12;
    function tick() {
      if (i <= text.length) {
        el.innerHTML =
          '<span class="msg-label">Portfolio AI</span>' +
          escapeHtml(text.slice(0, i));
        i++;
        messages.scrollTop = messages.scrollHeight;
        setTimeout(tick, speed);
      } else {
        el.classList.remove("msg-typing");
      }
    }
    tick();
    void label;
  }

  function ask(q) {
    const query = (q || "").trim();
    if (!query) return;
    addMessage(query, "user");
    input.value = "";
    setTimeout(() => typeAnswer(answer(query)), 280);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
  });

  if (suggestions) {
    suggestions.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-q]");
      if (!btn) return;
      ask(btn.getAttribute("data-q"));
    });
  }

  /* Greeting */
  addMessage(
    "Hi — I'm Somala Ajay's portfolio assistant. Ask about experience, projects, stack, or availability.",
    "bot"
  );
})();
