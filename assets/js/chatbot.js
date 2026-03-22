/* ═══════════════════════════════════════════════════
   CHATBOT.JS — AI Chatbot "Ask about Ajay"
   Powered by Claude API (Anthropic)
   Somala Ajay Portfolio
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Ajay's full context for the AI ── */
  const AJAY_CONTEXT = `You are a helpful AI assistant on Somala Ajay's personal portfolio website. 
Your job is to answer questions about Ajay in a friendly, professional, and concise way.

Here is everything you know about Ajay:

NAME: Somala Ajay
ROLE: Python Developer, AI/ML Engineer, Data Scientist
LOCATION: Hyderabad, Telangana, India (500081)
EMAIL: ajaysomala@gmail.com
PHONE: +91 76750 10831
LINKEDIN: linkedin.com/in/ajaysomala-8a806b213
GITHUB: github.com/Ajaysomala
PORTFOLIO: ajaysomala.github.io

EDUCATION:
- B.Tech in Electronics & Communication Engineering
- Aditya University, Surampalem (2018–2022)
- Capstone Project: Quality Analysis of Rice Granules using MATLAB Image Processing

EXPERIENCE:
1. Data Operations Analyst — Tech Mahindra Ltd, Hyderabad (Sep 2024 – Dec 2025)
   - Achieved 98%+ data accuracy in backend validation
   - Managed sensitive shipment and customs data with zero critical errors
   - Supported end-to-end data pipelines and SLA-driven operations

2. Python AI/ML & Data Science Intern — Trylogic Soft Solutions, Vijayawada (Oct 2023 – Jun 2024)
   - Completed 31 real-world AI/ML projects
   - Built web scraping tools using BeautifulSoup and Requests
   - Deployed Flask/Django web applications

SKILLS:
- Languages: Python, SQL, Bash
- Backend: Flask, Django, REST APIs, API Integration
- Data Science: Pandas, NumPy, ETL, Data Cleaning, Matplotlib
- ML/AI: TensorFlow, Keras, Scikit-learn, OpenCV, MediaPipe
- NLP & GenAI: NLTK, NLP, Generative AI, Prompting, LLMs
- Tools: Git, GitHub, Docker, MySQL, Cursor AI
- Concepts: OOP, Web Scraping, Debugging

PROJECTS (31 total, key ones):
1. Brain Tumor Detection — CNN, TensorFlow, OpenCV (90%+ accuracy)
2. Image Caption Generator — CNN + LSTM, COCO Dataset
3. Stock Price Prediction — LSTM time series forecasting
4. ATS Resume Screener — Python, NLP
5. AI Chatbot — NLTK, Flask
6. Amazon Recommendation System — Pandas, Scikit-learn
7. Face Mask Detection — OpenCV, Keras
8. Food Nutrition Adviser — LLM, GenAI, Flask
9. Virtual Mouse — MediaPipe, OpenCV
10. Consumer Sentiment Analysis — NLP, Scikit-learn
...and 21 more projects covering NLP, CV, Deep Learning, GenAI

CERTIFICATIONS:
- AI Data Scientist — NASSCOM
- Generative AI Introduction — Microsoft Learning
- Programming for Everybody (Python) — HackerRank
- Agile Methodology Virtual Experience — Forage
- Python (Basic) — Udemy

OPEN TO: Data Science roles, AI/ML Engineer roles, Python Developer roles, Software Developer roles

PERSONALITY: Fast learner, self-driven, detail-oriented, passionate about AI/ML, data-first mindset.

IMPORTANT RULES:
- Keep answers concise (2-4 sentences max unless the user asks for detail)
- Be warm and professional
- If asked about hiring/opportunities, encourage them to use the contact form or email directly
- Don't make up information not listed above
- If unsure, say "I don't have that info, but you can reach Ajay directly at ajaysomala@gmail.com"
- Do NOT answer questions unrelated to Ajay or his work`;

  /* ── Quick question suggestions ── */
  const QUICK_QUESTIONS = [
    'What are your top skills?',
    'Tell me about your projects',
    'Are you open to work?',
    'What experience do you have?',
    'What tech stack do you use?',
  ];

  /* ── Create chatbot UI ── */
  function createChatbotUI() {
    const wrapper = document.createElement('div');
    wrapper.id = 'sa-chatbot';
    wrapper.innerHTML = `
      <button id="chatbot-trigger" aria-label="Chat with AI about Ajay" title="Ask AI about Ajay">
        <span class="chatbot-icon-open">🤖</span>
        <span class="chatbot-icon-close">✕</span>
        <span class="chatbot-badge">AI</span>
      </button>

      <div id="chatbot-panel" role="dialog" aria-modal="true" aria-label="Chat with AI about Ajay">
        <div class="chatbot-header">
          <div class="chatbot-avatar">🤖</div>
          <div class="chatbot-header-info">
            <div class="chatbot-name">Ask about Ajay</div>
            <div class="chatbot-status"><span class="chatbot-online-dot"></span> AI Assistant</div>
          </div>
          <button class="chatbot-close-btn" id="chatbot-close" aria-label="Close chat">✕</button>
        </div>

        <div class="chatbot-messages" id="chatbot-messages">
          <div class="chatbot-msg bot">
            <div class="chatbot-bubble">
              👋 Hi! I'm an AI assistant that knows everything about Ajay. Ask me anything — skills, projects, experience, or whether he's open to opportunities!
            </div>
          </div>
          <div class="chatbot-quick-questions" id="chatbot-quick">
            ${QUICK_QUESTIONS.map(q => `<button class="quick-q" data-q="${q}">${q}</button>`).join('')}
          </div>
        </div>

        <div class="chatbot-input-area">
          <input type="text" id="chatbot-input" placeholder="Ask anything about Ajay..." maxlength="200" autocomplete="off"/>
          <button id="chatbot-send" aria-label="Send message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
          </button>
        </div>
        <div class="chatbot-footer">Powered by Claude AI · Only knows about Ajay</div>
      </div>
    `;
    document.body.appendChild(wrapper);
  }

  /* ── Inject chatbot styles ── */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ── Chatbot Trigger Button ── */
      #sa-chatbot { position: fixed; bottom: 5rem; right: 2rem; z-index: 800; font-family: var(--font-body, sans-serif); }

      #chatbot-trigger {
        width: 56px; height: 56px; border-radius: 50%;
        background: linear-gradient(135deg, var(--purple, #9b59f5), #7c3aed);
        border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
        font-size: 1.4rem; box-shadow: 0 8px 25px rgba(155,89,245,0.4);
        transition: transform 0.3s, box-shadow 0.3s; position: relative;
      }
      #chatbot-trigger:hover { transform: scale(1.1); box-shadow: 0 12px 35px rgba(155,89,245,0.55); }
      #chatbot-trigger:active { transform: scale(0.96); }

      .chatbot-icon-close { display: none; color: #fff; font-size: 1.1rem; font-weight: bold; }
      .chatbot-icon-open  { color: #fff; }
      #sa-chatbot.open .chatbot-icon-open  { display: none; }
      #sa-chatbot.open .chatbot-icon-close { display: block; }

      .chatbot-badge {
        position: absolute; top: -4px; right: -4px;
        background: var(--gold, #d4a843); color: #fff;
        font-size: 0.5rem; font-weight: 700; padding: 2px 5px;
        border-radius: 100px; letter-spacing: 0.05em;
      }

      /* ── Panel ── */
      #chatbot-panel {
        position: absolute; bottom: 70px; right: 0;
        width: 340px; background: var(--card, #130e1c);
        border: 1px solid var(--border, rgba(180,140,255,0.1));
        border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        display: flex; flex-direction: column; overflow: hidden;
        opacity: 0; pointer-events: none;
        transform: translateY(12px) scale(0.97);
        transition: opacity 0.3s ease, transform 0.3s ease;
        max-height: 480px;
      }
      #sa-chatbot.open #chatbot-panel { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }

      /* ── Header ── */
      .chatbot-header {
        display: flex; align-items: center; gap: 0.75rem;
        padding: 1rem 1.25rem;
        background: linear-gradient(135deg, rgba(155,89,245,0.15), rgba(212,168,67,0.08));
        border-bottom: 1px solid var(--border, rgba(180,140,255,0.1));
      }
      .chatbot-avatar { font-size: 1.6rem; }
      .chatbot-name { font-weight: 600; font-size: 0.9rem; color: var(--white, #f0ecff); }
      .chatbot-status { font-size: 0.68rem; color: var(--muted, #6b5f82); display: flex; align-items: center; gap: 0.35rem; }
      .chatbot-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #00d264; box-shadow: 0 0 6px #00d264; animation: pulseDot 2s infinite; }
      .chatbot-close-btn { margin-left: auto; background: none; border: none; color: var(--muted, #6b5f82); font-size: 1rem; cursor: pointer; padding: 4px; transition: color 0.2s; }
      .chatbot-close-btn:hover { color: var(--purple, #9b59f5); }

      /* ── Messages ── */
      .chatbot-messages {
        flex: 1; overflow-y: auto; padding: 1rem;
        display: flex; flex-direction: column; gap: 0.75rem;
        scroll-behavior: smooth; min-height: 200px;
      }
      .chatbot-messages::-webkit-scrollbar { width: 3px; }
      .chatbot-messages::-webkit-scrollbar-thumb { background: var(--purple, #9b59f5); border-radius: 2px; }

      .chatbot-msg { display: flex; }
      .chatbot-msg.bot  { justify-content: flex-start; }
      .chatbot-msg.user { justify-content: flex-end; }

      .chatbot-bubble {
        max-width: 82%; padding: 0.65rem 0.9rem;
        font-size: 0.83rem; line-height: 1.6; border-radius: 12px;
      }
      .chatbot-msg.bot  .chatbot-bubble {
        background: var(--bg2, #100d18); color: var(--text, #e8e0ff);
        border-bottom-left-radius: 4px;
        border: 1px solid var(--border, rgba(180,140,255,0.1));
      }
      .chatbot-msg.user .chatbot-bubble {
        background: var(--purple, #9b59f5); color: #fff;
        border-bottom-right-radius: 4px;
      }

      /* Typing indicator */
      .chatbot-typing { display: flex; align-items: center; gap: 4px; padding: 0.65rem 0.9rem; }
      .chatbot-typing span {
        width: 6px; height: 6px; border-radius: 50%;
        background: var(--muted, #6b5f82); display: inline-block;
        animation: typingBounce 1.2s infinite;
      }
      .chatbot-typing span:nth-child(2) { animation-delay: 0.2s; }
      .chatbot-typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

      /* Quick questions */
      .chatbot-quick-questions { display: flex; flex-wrap: wrap; gap: 0.4rem; }
      .quick-q {
        font-size: 0.72rem; padding: 0.3rem 0.65rem;
        background: var(--purple-dim, rgba(155,89,245,0.12));
        border: 1px solid rgba(155,89,245,0.25); border-radius: 100px;
        color: var(--purple, #9b59f5); cursor: pointer; transition: all 0.2s;
        white-space: nowrap;
      }
      .quick-q:hover { background: var(--purple, #9b59f5); color: #fff; }

      /* ── Input ── */
      .chatbot-input-area {
        display: flex; gap: 0.5rem; padding: 0.75rem 1rem;
        border-top: 1px solid var(--border, rgba(180,140,255,0.1));
        background: var(--bg2, #100d18);
      }
      #chatbot-input {
        flex: 1; background: var(--bg, #0a080f);
        border: 1px solid var(--border, rgba(180,140,255,0.1));
        border-radius: 8px; padding: 0.55rem 0.85rem;
        color: var(--text, #e8e0ff); font-size: 0.83rem; outline: none;
        transition: border-color 0.2s;
      }
      #chatbot-input:focus { border-color: var(--purple, #9b59f5); }
      #chatbot-input::placeholder { color: var(--muted2, #4a4060); }

      #chatbot-send {
        width: 36px; height: 36px; border-radius: 8px;
        background: var(--purple, #9b59f5); border: none;
        color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: background 0.2s, transform 0.15s; flex-shrink: 0;
      }
      #chatbot-send:hover { background: #7c3aed; transform: scale(1.05); }
      #chatbot-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

      /* Footer */
      .chatbot-footer {
        text-align: center; padding: 0.4rem;
        font-size: 0.58rem; color: var(--muted2, #4a4060);
        background: var(--bg, #0a080f); letter-spacing: 0.05em;
      }

      /* Light theme overrides */
      [data-theme="light"] #chatbot-panel { box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
      [data-theme="light"] .chatbot-msg.bot .chatbot-bubble { background: var(--bg3, #ede8fa); }

      /* Mobile */
      @media (max-width: 480px) {
        #chatbot-panel { width: 300px; right: -0.5rem; }
        #sa-chatbot { bottom: 4.5rem; right: 1.25rem; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Call Claude API ── */
  async function askClaude(userMessage) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: AJAY_CONTEXT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.content[0].text;
  }

  /* ── Add a message bubble ── */
  function addMessage(role, text) {
    const msgs = document.getElementById('chatbot-messages');
    // Remove quick questions after first user msg
    if (role === 'user') {
      const qq = document.getElementById('chatbot-quick');
      if (qq) qq.remove();
    }
    const msg = document.createElement('div');
    msg.className = `chatbot-msg ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    msgs.appendChild(msg);
    msgs.scrollTop = msgs.scrollHeight;
    return msg;
  }

  /* ── Show typing indicator ── */
  function showTyping() {
    const msgs = document.getElementById('chatbot-messages');
    const typing = document.createElement('div');
    typing.className = 'chatbot-msg bot';
    typing.id = 'chatbot-typing-indicator';
    typing.innerHTML = '<div class="chatbot-bubble chatbot-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('chatbot-typing-indicator');
    if (t) t.remove();
  }

  /* ── Send message flow ── */
  async function sendMessage(text) {
    const input  = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const message = (text || input.value).trim();
    if (!message) return;

    // Sanitize input
    const clean = window.SA_Security ? window.SA_Security.sanitize(message) : message;

    addMessage('user', message);
    input.value = '';
    sendBtn.disabled = true;
    showTyping();

    try {
      const reply = await askClaude(clean);
      hideTyping();
      addMessage('bot', reply);
    } catch (err) {
      hideTyping();
      addMessage('bot', "Sorry, I'm having trouble connecting right now. You can reach Ajay directly at ajaysomala@gmail.com 📧");
    }

    sendBtn.disabled = false;
    input.focus();
  }

  /* ── Initialize ── */
  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    createChatbotUI();

    const trigger  = document.getElementById('chatbot-trigger');
    const closeBtn = document.getElementById('chatbot-close');
    const wrapper  = document.getElementById('sa-chatbot');
    const input    = document.getElementById('chatbot-input');
    const sendBtn  = document.getElementById('chatbot-send');

    // Toggle open/close
    function toggleChat() { wrapper.classList.toggle('open'); if (wrapper.classList.contains('open')) input.focus(); }
    trigger.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Send on button click
    sendBtn.addEventListener('click', function () { sendMessage(); });

    // Send on Enter key
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Quick question chips
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('quick-q')) {
        sendMessage(e.target.getAttribute('data-q'));
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') wrapper.classList.remove('open');
    });
  });

})();
