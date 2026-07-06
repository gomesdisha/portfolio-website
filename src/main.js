// Core Portfolio JavaScript (Maximalist / Neo-Brutalist Redesign)

// 1. Particle Canvas Background (Floating Retro Geometric Shapes)
const initStarfield = () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let shapes = [];
  const maxShapes = window.innerWidth < 768 ? 15 : 30;
  let mouse = { x: null, y: null };
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  resizeCanvas();
  
  class GeometricShape {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 20 + 8;
      this.type = Math.floor(Math.random() * 3); // 0: Cross, 1: Circle Outline, 2: Dot
      this.opacity = Math.random() * 0.4 + 0.1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.rotation = Math.random() * Math.PI;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      
      // Interactive drift towards mouse
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.x += (dx / dist) * 0.2;
          this.y += (dy / dist) * 0.2;
        }
      }
      
      // Boundary check
      if (this.x < -30 || this.x > canvas.width + 30 || this.y < -30 || this.y > canvas.height + 30) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.strokeStyle = `rgba(140, 90, 60, ${this.opacity})`; // Warm brown accents
      ctx.fillStyle = `rgba(217, 56, 58, ${this.opacity})`;   // Bold red accents
      ctx.lineWidth = 2;
      
      if (this.type === 0) {
        // Cross
        ctx.beginPath();
        ctx.moveTo(-this.size/2, 0);
        ctx.lineTo(this.size/2, 0);
        ctx.moveTo(0, -this.size/2);
        ctx.lineTo(0, this.size/2);
        ctx.stroke();
      } else if (this.type === 1) {
        // Circle Outline
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Dot
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
  
  for (let i = 0; i < maxShapes; i++) {
    shapes.push(new GeometricShape());
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connecting mesh lines
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].update();
      shapes[i].draw();
      
      for (let j = i + 1; j < shapes.length; j++) {
        const dx = shapes[i].x - shapes[j].x;
        const dy = shapes[i].y - shapes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(shapes[i].x, shapes[i].y);
          ctx.lineTo(shapes[j].x, shapes[j].y);
          ctx.strokeStyle = `rgba(26, 22, 18, ${0.04 * (1 - dist / 180)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  };
  
  animate();
};

// 2. Typewriter Effect
const initTypewriter = () => {
  const element = document.getElementById('typewriter-text');
  if (!element) return;
  
  const roles = [
    "ML SYSTEMS AT ISRO",
    "APPLIED GENAI AGENTS",
    "FULL-STACK MERN APPS",
    "ANDROID USER INTERFACES",
    "GUITAR STUFF & VOCALS"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;
  
  const tick = () => {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      delay = 40;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      delay = 2200; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400; // Pause before typing next word
    }
    
    setTimeout(tick, delay);
  };
  
  tick();
};

// 3. Scroll Reveals and Sticky Header
const initScrollEffects = () => {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const reveals = document.querySelectorAll('.reveal');
  
  const handleScroll = () => {
    // Header scrolled state
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active Navigation Highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    // Scroll Reveal elements
    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 80) {
        reveal.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial check
};

// 4. Skills Tab Switcher
const initSkillsTabs = () => {
  const tabs = document.querySelectorAll('.skill-tab-btn');
  const panels = document.querySelectorAll('.skills-content-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const panelId = tab.getAttribute('data-tab');
      document.getElementById(panelId).classList.add('active');
    });
  });
};

// 5. Projects Filter
const initProjectFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      cards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
};

// 6. Project Modals Data and Handlers
const projectData = {
  sahaya: {
    title: "Sahaya Emergency Response App",
    meta: "Java, Firebase, Gemini API, Google Maps (2026)",
    desc: "Engineered a robust, multi-role emergency response Android app linking Users, Volunteers, and Admins during geographical crises.",
    bullets: [
      "Engineered real-time volunteer-authority dispatch workflows verified with 11+ users and 13+ live incidents.",
      "Integrated Google Maps API and device GPS for pinning exact coordinates of disaster reporting locations.",
      "Deployed a hardware SOS alert system dispatching SMS messages containing precise coordinate links.",
      "Designed proximity push notifications to close volunteers using Firebase Cloud Messaging (FCM).",
      "Built a context-aware emergency responder chatbot integrated directly with the Gemini API."
    ]
  },
  nutritracker: {
    title: "NutriTracker Nutrition System",
    meta: "MERN Stack, Chart.js, JWT Authentication (2026)",
    desc: "A centralized MERN child growth tracking dashboard engineered to monitor nutritional levels in rural Anganwadi centers.",
    bullets: [
      "Integrated express RESTful API modules with secure JWT role-based access for Admins, Supervisors, and Workers.",
      "Coded mathematical growth logic based on WHO standard metrics to auto-classify malnutrition states (Normal/Moderate/Severe).",
      "Created alert notifications to automatically flag severe growth stunting to regional supervisors.",
      "Built interactive growth-trend visualizations utilizing Chart.js and Recharts dashboards."
    ]
  },
  aquaguard: {
    title: "AquaGuard Cryptographic Watermarking",
    meta: "Python, React.js, MongoDB, AES-256 (2025)",
    desc: "A digital media protection pipeline designed to stamp invisible copyright marks into secure images and PDFs.",
    bullets: [
      "Coded an LSB (Least Significant Bit) steganography script in Python to inject watermarks.",
      "Enforced symmetric AES-256 encryption on signature strings to prevent signature scraping.",
      "Integrated SHA-3 hashing calculations to verify media integrity and inspect file tampering.",
      "Built a dashboard interface in React backed by Express & MongoDB audits to trace watermarked history."
    ]
  }
};

const initProjectModals = () => {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');
  const closeBtn = document.getElementById('modal-close');
  const triggers = document.querySelectorAll('.modal-trigger');
  
  const openModal = (projId) => {
    const data = projectData[projId];
    if (!data) return;
    
    modalBody.innerHTML = `
      <div class="project-year" style="margin-top:0;">${data.meta}</div>
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-desc">${data.desc}</p>
      <h4 style="margin-bottom:1rem; font-family:var(--font-display); font-weight:800;">CONTRIBUTIONS:</h4>
      <ul class="modal-bullets">
        ${data.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
      <div style="display:flex; gap:1rem; margin-top:2rem;">
        <a href="https://github.com/gomesdisha" target="_blank" class="btn btn-primary" style="font-size:0.85rem; padding:0.6rem 1.2rem; box-shadow: 3px 3px 0px var(--black);">
          View Repository ↗
        </a>
      </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = trigger.getAttribute('data-project');
      openModal(projId);
    });
  });
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
};

// 7. Interactive Mock AI Chatbot (Updated with ISRO and ML context)
const chatbotAnswers = {
  greetings: [
    "Hello! I am Disha's portfolio console. I can answer queries about her ISRO internship, ML models (SVM, Isolation Forest, LSTM), projects, or skills.",
    "Console active. Ask me about her satellite anomaly detection research or MERN projects!",
  ],
  isro: [
    "Disha completed a <b>Machine Learning Research Internship</b> at <b>ISRO</b> (June-July 2026):\n" +
    "• She developed a time-series anomaly detection system for satellite telemetry & telecommand (TC/TM) sensor logs.\n" +
    "• Benchmark metrics: <b>One-Class SVM</b> (AUC 0.9662, F1 0.9513, Recall 97.77%, Train time 0.01s) and <b>Isolation Forest</b> (AUC 0.9234, F1 0.7838, Train time 0.29s).\n" +
    "• She also successfully implemented sequence-aware deep learning models: <b>LSTM, TCN, and GRU</b>."
  ],
  ml: [
    "Disha's ML skillset includes:\n" +
    "• <b>Algorithms:</b> Isolation Forest, One-Class SVM, LSTM, TCN, GRU, Supervised & Unsupervised Learning.\n" +
    "• <b>Libraries:</b> scikit-learn, NumPy, pandas, Matplotlib, Seaborn, TensorFlow.\n" +
    "• <b>Pipelines:</b> Feature Engineering, Data Preprocessing, Hyperparameter Tuning, and Cross-Validation."
  ],
  safre: [
    "At <b>SABRE Impact Week</b> in Bangalore (April 2026), Disha presented **Safre**, a verified, safety-first ride-sharing platform designed for university students to secure safe travel."
  ],
  sahaya: [
    "<b>Sahaya</b> is a disaster management Android application (2026) coded in Java. It includes Google Maps GPS mapping, hardware SOS coordinate dispatches, and a first-aid chatbot utilizing the Gemini API."
  ],
  nutritracker: [
    "<b>NutriTracker</b> (2026) is a child growth tracking dashboard built on the MERN stack. It leverages WHO growth standard metrics to classify malnutrition and outputs interactive analytics with Chart.js."
  ],
  aquaguard: [
    "<b>AquaGuard</b> (2025) is a digital watermarking tool. It uses LSB steganography in Python, AES-256 symmetric encryption, SHA-3 integrity verification, and MongoDB audit logger."
  ],
  internship: [
    "Disha is currently seeking Machine Learning or Software Engineering internship positions. Contact her at <b>dishagomes2005@gmail.com</b>."
  ],
  music: [
    "Disha plays the guitar and sings! She is the Social Media & Design Head for <i>Chords & Co.</i> (MIT music club) and designed for Revels '26 and Tech Tatva '25."
  ]
};

const getAIResponse = (query) => {
  const q = query.toLowerCase();
  
  if (q.includes('isro') || q.includes('telemetry') || q.includes('satellite') || q.includes('anomaly')) {
    return chatbotAnswers.isro[0];
  } else if (q.includes('model') || q.includes('svm') || q.includes('forest') || q.includes('lstm') || q.includes('gru') || q.includes('tcn') || q.includes('machine') || q.includes('ml') || q.includes('data')) {
    return chatbotAnswers.ml[0];
  } else if (q.includes('safre') || q.includes('sabre') || q.includes('ride') || q.includes('sharing')) {
    return chatbotAnswers.safre[0];
  } else if (q.includes('sahaya') || q.includes('disaster') || q.includes('android')) {
    return chatbotAnswers.sahaya[0];
  } else if (q.includes('nutri') || q.includes('nutrition') || q.includes('mern') || q.includes('anganwadi')) {
    return chatbotAnswers.nutritracker[0];
  } else if (q.includes('aqua') || q.includes('watermark') || q.includes('steg') || q.includes('crypto')) {
    return chatbotAnswers.aquaguard[0];
  } else if (q.includes('intern') || q.includes('job') || q.includes('seek') || q.includes('career')) {
    return chatbotAnswers.internship[0];
  } else if (q.includes('music') || q.includes('guitar') || q.includes('sing') || q.includes('chords') || q.includes('club')) {
    return chatbotAnswers.music[0];
  } else if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greetings')) {
    return chatbotAnswers.greetings[Math.floor(Math.random() * chatbotAnswers.greetings.length)];
  } else {
    return "Query unparsed. Try asking about her 'ISRO internship', 'ML models', 'Safre ride sharing', or MERN/Android 'projects'!";
  }
};

const initChatbot = () => {
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatHistory = document.getElementById('chat-history');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  
  const floatingTrigger = document.getElementById('floating-chat-trigger');
  const floatingPanel = document.getElementById('floating-chat-panel');
  const floatingClose = document.getElementById('floating-chat-close');
  const floatingForm = document.getElementById('floating-chat-form');
  const floatingInput = document.getElementById('floating-chat-input');
  const floatingHistory = document.getElementById('floating-chat-history');
  
  const addMessage = (historyEl, sender, text) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    msgDiv.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <div class="msg-time">${timeStr}</div>
    `;
    
    historyEl.appendChild(msgDiv);
    historyEl.scrollTop = historyEl.scrollHeight;
  };
  
  const handleQuery = (historyEl, inputEl, text) => {
    if (!text.trim()) return;
    
    addMessage(historyEl, 'user', text);
    inputEl.value = '';
    
    setTimeout(() => {
      const reply = getAIResponse(text);
      addMessage(historyEl, 'bot', reply);
    }, 450);
  };
  
  // Page chat listeners
  if (chatForm && chatInput && chatHistory) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleQuery(chatHistory, chatInput, chatInput.value);
    });
    
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        handleQuery(chatHistory, chatInput, query);
      });
    });
  }
  
  // Floating chat listeners
  if (floatingTrigger && floatingPanel && floatingClose && floatingForm && floatingInput && floatingHistory) {
    floatingTrigger.addEventListener('click', () => {
      floatingPanel.classList.toggle('active');
    });
    
    floatingClose.addEventListener('click', () => {
      floatingPanel.classList.remove('active');
    });
    
    floatingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleQuery(floatingHistory, floatingInput, floatingInput.value);
    });
  }
};

// 8. Mobile Menu Toggle
const initMobileMenu = () => {
  const btn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');
  
  if (btn && navLinksContainer) {
    btn.addEventListener('click', () => {
      const isVisible = navLinksContainer.classList.contains('active-menu');
      if (isVisible) {
        navLinksContainer.classList.remove('active-menu');
        navLinksContainer.removeAttribute('style');
      } else {
        navLinksContainer.classList.add('active-menu');
        navLinksContainer.style.display = 'flex';
        navLinksContainer.style.flexDirection = 'column';
        navLinksContainer.style.position = 'absolute';
        navLinksContainer.style.top = '80px';
        navLinksContainer.style.left = '0';
        navLinksContainer.style.width = '100%';
        navLinksContainer.style.background = 'var(--bg-beige)';
        navLinksContainer.style.padding = '2rem';
        navLinksContainer.style.borderBottom = 'var(--border-thick)';
      }
    });
  }
};

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initTypewriter();
  initScrollEffects();
  initSkillsTabs();
  initProjectFilter();
  initProjectModals();
  initChatbot();
  initMobileMenu();
});
