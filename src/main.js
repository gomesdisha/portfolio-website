// Core Portfolio JavaScript

// 1. Particle Starfield Canvas Background
const initStarfield = () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let stars = [];
  const maxStars = window.innerWidth < 768 ? 40 : 80;
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  class Star {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < maxStars; i++) {
    stars.push(new Star());
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections (constellation effect)
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
      
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
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
    "Applied GenAI Developer",
    "Full-Stack Engineer (MERN)",
    "Android Developer (Java)",
    "UI/UX Design Enthusiast",
    "Guitarist & Singer"
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
      delay = 50;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 120;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      delay = 2000; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500; // Pause before typing next word
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
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active Navigation Highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
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
      if (elementTop < windowHeight - 100) {
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
    title: "Sahaya Android App",
    meta: "Disaster Management & Emergency Response (2026)",
    desc: "Engineered a multi-role Android application designed to facilitate real-time disaster reporting and smooth volunteer-authority coordination in times of crisis.",
    bullets: [
      "Designed roles for Users, Volunteers, and Admins to handle emergency alerts and coordinates workflows.",
      "Validated with 11+ users and 13+ live incident reports through unit, integration, and real-device testing.",
      "Integrated Google Maps API & GPS tracking for pinning exact live incident coordinates.",
      "Implemented a one-click SOS system that dispatches precise emergency SMS alerts containing Google Maps links.",
      "Used Firebase Cloud Messaging (FCM) to trigger instant push notifications to registered nearby volunteers.",
      "Integrated a chatbot powered by Gemini API for immediate, context-aware first aid advice and disaster guidance."
    ]
  },
  nutritracker: {
    title: "NutriTracker child nutrition monitor",
    meta: "Child Nutrition & Malnutrition Detection System (2026)",
    desc: "Developed a full-stack MERN (MongoDB, Express, React, Node) web application for tracking child growth metrics across Anganwadi centers in rural districts.",
    bullets: [
      "Built clean RESTful APIs utilizing JWT-based role-based access control (Admin, Supervisor, Worker).",
      "Coded strict WHO-standard nutrition analysis logic that auto-classifies status (Normal, Moderate, or Severe growth stunt).",
      "Created automatic supervisor alert flags for critical malnutrition cases.",
      "Engineered clean dashboards utilizing Chart.js and Recharts to visualize regional child growth patterns over time.",
      "Database schema set up in Mongoose with robust validations for historical tracking."
    ]
  },
  aquaguard: {
    title: "AquaGuard digital watermarking",
    meta: "Digital Watermarking & Intellectual Property Protection (2025)",
    desc: "A secure cryptographic and steganographic system designed to embed invisible copyright signatures directly into images and PDF publications.",
    bullets: [
      "Engineered LSB (Least Significant Bit) steganography core in Python to hide watermarks.",
      "Enforced symmetric AES-256 encryption on embedded signatures to prevent tampering.",
      "Integrated SHA-3 cryptographic hashes for verifying digital integrity.",
      "Coded a React.js client interface with express server and MongoDB audits to keep strict user logs of watermarked file history."
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
      <h4 style="margin-bottom:1rem; font-family:var(--font-display);">Key Contributions:</h4>
      <ul class="modal-bullets">
        ${data.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
      <div style="display:flex; gap:1rem; margin-top:2rem;">
        <a href="https://github.com/gomesdisha" target="_blank" class="btn btn-primary" style="font-size:0.9rem; padding:0.6rem 1.5rem;">
          View Repository
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
  
  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
};

// 7. Interactive Mock AI Chatbot (Dual Instance: Page + Floating Widget)
const chatbotAnswers = {
  greetings: [
    "Hi there! I'm Disha's virtual assistant. Ask me about her projects (Sahaya, NutriTracker, AquaGuard), technical skills, or education!",
    "Hello! How can I help you learn more about Disha Gomes today?",
  ],
  skills: [
    "Disha is skilled in several areas:\n" +
    "• <b>Languages:</b> Python, C, C++, Java, JavaScript (ES6+), SQL, HTML5/CSS3, Bash, PowerShell\n" +
    "• <b>Frameworks:</b> React.js, Node.js, Express.js, Angular, Bootstrap, Chart.js, Pandas, Mongoose\n" +
    "• <b>Databases:</b> MongoDB, MySQL, Oracle SQL, Firebase Realtime Database\n" +
    "• <b>GenAI & Tools:</b> Gemini API, Google AI Studio, Git/GitHub, Android Studio, Figma",
  ],
  sahaya: [
    "<b>Sahaya</b> is a disaster response app Disha built in 2026 using Java and Firebase. Key features:\n" +
    "• Real-time SOS triggers with GPS link dispatch\n" +
    "• Firebase Cloud Messaging for push alerts to volunteers\n" +
    "• A first-aid chatbot integrated using the Gemini API",
  ],
  nutritracker: [
    "<b>NutriTracker</b> is child nutrition tracking software for Anganwadis built in 2026. Tech stack is MERN (MongoDB, Express, React, Node).\n" +
    "It uses WHO-standard analysis to auto-classify malnutrition cases (Normal, Moderate, Severe) and displays analytical trends with Chart.js.",
  ],
  aquaguard: [
    "<b>AquaGuard</b> is a copyright protection project built in 2025.\n" +
    "It implements LSB steganography in Python, combined with AES-256 encryption, SHA-3 verification, and a React + MongoDB administration logger.",
  ],
  internship: [
    "Disha is currently seeking a software engineering internship for building data-driven, scalable apps or AI-integrated software. You can contact her at <b>dishagomes2005@gmail.com</b>.",
  ],
  sabre: [
    "In April 2026, Disha represented MIT Manipal at the <b>SABRE Impact Week</b> in Bangalore, where she collaborated in a 3-member team to design and pitch an ideation interface prototype in an industry competitive setting.",
  ],
  music: [
    "Outside of code, Disha is creative! She plays the guitar and sings. She is also the <b>Social Media & Design Head</b> for <i>Chords & Co.</i> (the music club at MIT Manipal) and was in the Core Committees for Revels '26 and Tech Tatva '25.",
  ]
};

const getAIResponse = (query) => {
  const q = query.toLowerCase();
  
  if (q.includes('skill') || q.includes('language') || q.includes('code') || q.includes('tech') || q.includes('program')) {
    return chatbotAnswers.skills[0];
  } else if (q.includes('sahaya') || q.includes('disaster') || q.includes('gps') || q.includes('map') || q.includes('sms')) {
    return chatbotAnswers.sahaya[0];
  } else if (q.includes('nutri') || q.includes('nutrition') || q.includes('child') || q.includes('chart')) {
    return chatbotAnswers.nutritracker[0];
  } else if (q.includes('aqua') || q.includes('watermark') || q.includes('steg') || q.includes('crypto') || q.includes('aes')) {
    return chatbotAnswers.aquaguard[0];
  } else if (q.includes('intern') || q.includes('job') || q.includes('seek') || q.includes('hire') || q.includes('recruit')) {
    return chatbotAnswers.internship[0];
  } else if (q.includes('sabre') || q.includes('impact') || q.includes('bangalore') || q.includes('presentation')) {
    return chatbotAnswers.sabre[0];
  } else if (q.includes('music') || q.includes('guitar') || q.includes('sing') || q.includes('chord') || q.includes('extracurricular') || q.includes('design') || q.includes('club')) {
    return chatbotAnswers.music[0];
  } else if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greetings')) {
    return chatbotAnswers.greetings[Math.floor(Math.random() * chatbotAnswers.greetings.length)];
  } else {
    return "I'm not fully sure about that specific query. Try asking about her 'projects', 'skills', 'internship status', or 'extracurriculars'!";
  }
};

const initChatbot = () => {
  // Page Chatbot elements
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatHistory = document.getElementById('chat-history');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  
  // Floating Chatbot elements
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
    
    // Simulate thinking delay
    setTimeout(() => {
      const reply = getAIResponse(text);
      addMessage(historyEl, 'bot', reply);
    }, 400);
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
      const isVisible = navLinksContainer.style.display === 'flex';
      if (isVisible) {
        navLinksContainer.style.display = 'none';
      } else {
        navLinksContainer.style.display = 'flex';
        navLinksContainer.style.flexDirection = 'column';
        navLinksContainer.style.position = 'absolute';
        navLinksContainer.style.top = '70px';
        navLinksContainer.style.left = '0';
        navLinksContainer.style.width = '100%';
        navLinksContainer.style.background = 'rgba(3, 0, 20, 0.95)';
        navLinksContainer.style.padding = '2rem';
        navLinksContainer.style.borderBottom = '1px solid var(--glass-border)';
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
