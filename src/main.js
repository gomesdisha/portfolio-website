// Core Portfolio JavaScript (Rock Zine / Messy Maximalism)

// 1. Zine Canvas Backdrop (Floating Punk Stars, Lightning Bolts, Notes)
const initStarfield = () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  const maxParticles = window.innerWidth < 768 ? 20 : 40;
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
  
  // Custom graphics drawing helpers
  const drawStar = (c, x, y, r, p) => {
    c.beginPath();
    let rot = Math.PI/2*3;
    let step = Math.PI/p;
    let cx = x;
    let cy = y;
    
    for (let i = 0; i < p; i++) {
      cx = x + Math.cos(rot) * r;
      cy = y + Math.sin(rot) * r;
      c.lineTo(cx, cy);
      rot += step;
      cx = x + Math.cos(rot) * (r/2);
      cy = y + Math.sin(rot) * (r/2);
      c.lineTo(cx, cy);
      rot += step;
    }
    c.lineTo(x, y - r);
    c.closePath();
  };
  
  const drawLightning = (c, x, y, size) => {
    c.beginPath();
    c.moveTo(x + size*0.3, y - size/2);
    c.lineTo(x - size*0.2, y + size*0.1);
    c.lineTo(x + size*0.1, y + size*0.1);
    c.lineTo(x - size*0.3, y + size/2);
    c.lineTo(x + size*0.2, y - size*0.1);
    c.lineTo(x - size*0.1, y - size*0.1);
    c.closePath();
  };
  
  class ScribbleParticle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 15 + 10;
      this.type = Math.floor(Math.random() * 3); // 0: Punk Star, 1: Lightning, 2: Music Note
      this.opacity = Math.random() * 0.35 + 0.1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.rotation = Math.random() * Math.PI;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      
      // Cursor repulsion drift
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= (dx / dist) * 0.4;
          this.y -= (dy / dist) * 0.4;
        }
      }
      
      // Boundary wraps
      if (this.x < -30 || this.x > canvas.width + 30 || this.y < -30 || this.y > canvas.height + 30) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.strokeStyle = `rgba(18, 18, 18, ${this.opacity})`; // Dark borders
      ctx.fillStyle = `rgba(184, 28, 32, ${this.opacity})`;   // Cherry red scrawls
      ctx.lineWidth = 1.5;
      
      if (this.type === 0) {
        // Drawing a punk star (5-pointed)
        drawStar(ctx, 0, 0, this.size/2, 5);
        ctx.fill();
        ctx.stroke();
      } else if (this.type === 1) {
        // Lightning bolt
        drawLightning(ctx, 0, 0, this.size);
        ctx.fill();
        ctx.stroke();
      } else {
        // Eighth Note
        ctx.beginPath();
        ctx.arc(-4, 4, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.moveTo(-1, 4);
        ctx.lineTo(-1, -8);
        ctx.lineTo(6, -5);
        ctx.lineTo(6, 1);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new ScribbleParticle());
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw hand-drawn connectors mesh
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(84, 53, 26, ${0.06 * (1 - dist / 150)})`; // Brown connections
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
    "ML PIPELINES @ ISRO",
    "APPLIED GENAI AGENTS",
    "FULL-STACK MERN APPS",
    "ANDROID EMERGENCY SYSTEMS",
    "GUITAR RIFFS & SONGS"
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
      delay = 30;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 80;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      delay = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    
    setTimeout(tick, delay);
  };
  
  tick();
};

// 3. Scroll Reveals and Header Sticky Check
const initScrollEffects = () => {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const reveals = document.querySelectorAll('.reveal');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
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
    
    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 80) {
        reveal.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll();
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

// 6. Dynamic Card Rotations on Page Load (Messy Maximalism Collage feel)
const initCardRotations = () => {
  const targets = document.querySelectorAll('.project-card, .timeline-item, .stat-item, .skills-box, .about-bio, .contact-form, .chat-card');
  targets.forEach(target => {
    const randomAngle = (Math.random() * 4 - 2).toFixed(2); // Rotation between -2deg and 2deg
    target.style.transform = `rotate(${randomAngle}deg)`;
  });
};

// 7. Cassette Player Interactive Logic
const initCassettePlayer = () => {
  const playBtn = document.getElementById('cassette-play');
  const pauseBtn = document.getElementById('cassette-pause');
  const prevBtn = document.getElementById('cassette-prev');
  const nextBtn = document.getElementById('cassette-next');
  
  const spindleLeft = document.getElementById('spindle-left');
  const spindleRight = document.getElementById('spindle-right');
  const cassetteTitle = document.getElementById('cassette-title');
  const bars = document.querySelectorAll('.visualizer-bar');
  
  const tracks = [
    "ISRO Telemetry Mix",
    "Safre Ride Acoustic",
    "Sahaya SOS (Gemini Edit)",
    "NutriTracker MERN mix",
    "AquaGuard Crypt Demo"
  ];
  
  let currentTrackIndex = 0;
  let isPlaying = false;
  let visualizerInterval = null;
  
  const startVisualizer = () => {
    if (visualizerInterval) clearInterval(visualizerInterval);
    visualizerInterval = setInterval(() => {
      bars.forEach(bar => {
        const randomHeight = Math.floor(Math.random() * 23) + 2; // Bouncing height between 2px and 25px
        bar.style.height = `${randomHeight}px`;
      });
    }, 100);
  };
  
  const stopVisualizer = () => {
    if (visualizerInterval) clearInterval(visualizerInterval);
    bars.forEach(bar => {
      bar.style.height = `2px`;
    });
  };
  
  const playCassette = () => {
    isPlaying = true;
    playBtn.classList.add('playing');
    pauseBtn.classList.remove('playing');
    spindleLeft.classList.add('spinning');
    spindleRight.classList.add('spinning');
    startVisualizer();
  };
  
  const pauseCassette = () => {
    isPlaying = false;
    playBtn.classList.remove('playing');
    pauseBtn.classList.add('playing');
    spindleLeft.classList.remove('spinning');
    spindleRight.classList.remove('spinning');
    stopVisualizer();
  };
  
  const changeTrack = (direction) => {
    currentTrackIndex = (currentTrackIndex + direction + tracks.length) % tracks.length;
    cassetteTitle.textContent = tracks[currentTrackIndex];
    if (isPlaying) {
      startVisualizer();
    }
  };
  
  if (playBtn && pauseBtn) {
    playBtn.addEventListener('click', playCassette);
    pauseBtn.addEventListener('click', pauseCassette);
    prevBtn.addEventListener('click', () => changeTrack(-1));
    nextBtn.addEventListener('click', () => changeTrack(1));
  }
};

// 8. Project Modals Configuration
const projectData = {
  sahaya: {
    title: "Sahaya Emergency Response App",
    meta: "Java, Firebase, Gemini API, Google Maps (2026)",
    desc: "A multi-role disaster coordination Android application. Designed roles for Admins, Volunteers, and Users to dispatch requests during geographical crises.",
    bullets: [
      "Engineered real-time volunteer-authority dispatch workflows verified with 11+ users and 13+ live incidents.",
      "Integrated Google Maps API and device GPS for pinning disaster reporting locations.",
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
      <div class="project-year" style="margin-top:0; font-family: var(--font-marker);">${data.meta}</div>
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-desc">${data.desc}</p>
      <h4 style="margin-bottom:1rem; font-family:var(--font-marker); font-weight:800; color: var(--red);">CONTRIBUTIONS:</h4>
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

// 9. Interactive Mock AI Chatbot (Rock Zine Console Tone)
const chatbotAnswers = {
  greetings: [
    "Yo! Welcome to Disha's gig console. Ask me about her ISRO internship metrics, ML anomaly detection models, or full-stack code.",
    "Console connected. Type a query to read her stats!",
  ],
  isro: [
    "Disha completed her **ML Research Internship** at **ISRO**:\n" +
    "• She developed a time-series anomaly detection system for satellite telemetry sensor logs.\n" +
    "• Benchmarked: **One-Class SVM** (AUC 0.9662, F1 0.9513, Recall 97.77%, Train time 0.01s) vs **Isolation Forest** (AUC 0.9234, F1 0.7838, Train time 0.29s).\n" +
    "• Coded deep sequence models: **LSTM, TCN, and GRU**."
  ],
  ml: [
    "Disha's ML arsenal includes:\n" +
    "• scikit-learn, NumPy, pandas, TensorFlow (learning).\n" +
    "• Anomaly Detection, LSTM, TCN, GRU, Feature Engineering, Cross-Validation, and Model Evaluation."
  ],
  safre: [
    "At **SABRE Impact Week** in Bangalore (April 2026), Disha presented **Safre**, a verified, safety-first ride-sharing platform designed for university students to travel securely."
  ],
  sahaya: [
    "**Sahaya** is an Android emergency response app (2026) in Java. Features SOS text alerts with precise GPS links, FCM volunteer push alerts, and a Gemini-powered responder chatbot."
  ],
  nutritracker: [
    "**NutriTracker** (2026) child nutrition tracker built with the MERN stack. Classifies growth states under WHO standards and outputs analytics on a Chart.js/Recharts dashboard."
  ],
  aquaguard: [
    "**AquaGuard** (2025) is an invisible media watermarker. Deployed with Python LSB steganography, AES-256 encryption, SHA-3 hashing, and MongoDB logging audits."
  ],
  internship: [
    "Disha is seeking ML and software engineering internship gigs. Drop a booking or offer to **dishagomes2005@gmail.com**!"
  ],
  music: [
    "She plays the guitar and sings! Disha is the Social Media & Design Head for *Chords & Co.* (music club) and serves on Revels and Tech Tatva committee teams."
  ]
};

const getAIResponse = (query) => {
  const q = query.toLowerCase();
  
  if (q.includes('isro') || q.includes('anomaly') || q.includes('satellite') || q.includes('telemetry')) {
    return chatbotAnswers.isro[0];
  } else if (q.includes('ml') || q.includes('model') || q.includes('svm') || q.includes('forest') || q.includes('lstm') || q.includes('machine') || q.includes('deep')) {
    return chatbotAnswers.ml[0];
  } else if (q.includes('safre') || q.includes('sabre') || q.includes('ride') || q.includes('sharing')) {
    return chatbotAnswers.safre[0];
  } else if (q.includes('sahaya') || q.includes('disaster') || q.includes('android')) {
    return chatbotAnswers.sahaya[0];
  } else if (q.includes('nutri') || q.includes('nutrition') || q.includes('mern')) {
    return chatbotAnswers.nutritracker[0];
  } else if (q.includes('aqua') || q.includes('watermark') || q.includes('steg')) {
    return chatbotAnswers.aquaguard[0];
  } else if (q.includes('intern') || q.includes('job') || q.includes('booking') || q.includes('hire')) {
    return chatbotAnswers.internship[0];
  } else if (q.includes('music') || q.includes('guitar') || q.includes('sing') || q.includes('chords')) {
    return chatbotAnswers.music[0];
  } else if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('yo')) {
    return chatbotAnswers.greetings[Math.floor(Math.random() * chatbotAnswers.greetings.length)];
  } else {
    return "Query unparsed. Ask about her 'ISRO internship', 'ML models', 'Safre ride sharing', or MERN/Android 'projects'!";
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

// 10. Mobile Menu Toggle
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
        navLinksContainer.style.top = '85px';
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
  initCardRotations();
  initCassettePlayer();
  initChatbot();
  initMobileMenu();
});
