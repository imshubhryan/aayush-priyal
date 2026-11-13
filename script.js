/**
 * Wedded · Sophie & Matteo Wedding Website
 * Interactive Features: Countdown, 3D Polaroids, Venue Carousel, FAQ, RSVP & Audio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. LUXURY SMOOTH SCROLL (LENIS)
  // Native CSS Scroll Snap is active: Lenis virtual scroll is disabled to ensure buttery-smooth 120fps presentation snapping
  const LenisClass = null;
  let lenis = null;
  if (LenisClass) {
    try {
      lenis = new LenisClass({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      });

      function raf(time) {
        if (lenis) lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (err) {
      console.warn('Lenis smooth scroll optional init:', err);
    }
  }

  // Smooth scroll for internal anchor links (#location, #hotels, etc.)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetEl, {
              offset: -40,
              duration: 1.3,
            });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // 1. HERO PARALLAX UPWARD GLIDE & STICKY NAVBAR ON SCROLL
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');
  const heroContent = document.querySelector('.hero-content-container');
  const heroBg = document.querySelector('.hero-bg-wrapper');
  const contentOverHero = document.getElementById('contentOverHero');
  const musicWidget = document.getElementById('musicWidget');

  function handleScrollEffects() {
    const scrollY = window.scrollY || window.pageYOffset;
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

    // A. Hero section upward glide & depth parallax effect
    if (heroSection && scrollY <= heroHeight * 1.5) {
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));

      // Hero section glides upward smoothly at 0.35x speed while content slides over it
      // Hero moves naturally 1:1 with scroll in presentation mode

      if (heroContent) {
        heroContent.style.opacity = `${Math.max(0, 1 - progress * 1.25)}`;
        heroContent.style.transform = `translateY(-${scrollY * 0.22}px)`;
      }

      if (heroBg) {
        heroBg.style.transform = `scale(${1 + progress * 0.08})`;
        heroBg.style.filter = `brightness(${1 - progress * 0.35})`;
      }
    }

    // B. Navbar font color changes when overlapping content reaches navbar
    if (navbar) {
      const navbarHeight = navbar.offsetHeight || 60;
      const contentTop = contentOverHero
        ? contentOverHero.getBoundingClientRect().top
        : (heroSection ? heroSection.getBoundingClientRect().bottom : 0);

      if (contentTop <= navbarHeight) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // C. Floating music widget visibility
    if (musicWidget) {
      if (scrollY > 300) {
        musicWidget.classList.add('visible');
      } else {
        musicWidget.classList.remove('visible');
      }
    }
  }

  if (lenis) {
    lenis.on('scroll', handleScrollEffects);
  }
  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();

  // 2. MOBILE MENU DRAWER
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. LIVE WEDDING COUNTDOWN TIMER (Dec 09, 2026 18:00:00 IST)
  const weddingDate = new Date('2026-12-09T18:00:00+05:30').getTime();
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    } else {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. INTERACTIVE SCRATCH CARD REVEAL (WEDDING DATE)
  const scratchCanvas = document.getElementById('scratchCanvas');
  const scratchWrapper = document.getElementById('scratchCardWrapper');
  const scratchHint = document.getElementById('scratchHint');
  const scratchActionBtn = document.getElementById('scratchActionBtn');

  if (scratchCanvas && scratchWrapper) {
    const ctx = scratchCanvas.getContext('2d');
    let isDrawing = false;
    let isRevealed = false;
    let lastPoint = null;
    let strokeCount = 0;

    function drawGoldFiligree(c, x, y, size, rotation) {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.strokeStyle = 'rgba(145, 98, 43, 0.28)';
      c.fillStyle = 'rgba(178, 132, 75, 0.18)';
      c.lineWidth = 1;
      // Leaf spray
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(size * 0.5, -size * 0.35, size, 0);
      c.quadraticCurveTo(size * 0.5, size * 0.35, 0, 0);
      c.fill();
      c.stroke();
      // Stem line
      c.beginPath();
      c.moveTo(-size * 0.3, 0);
      c.lineTo(size * 0.9, 0);
      c.stroke();
      c.restore();
    }

    function drawSparkle(c, x, y, r, alpha = 0.55) {
      c.save();
      c.translate(x, y);
      c.fillStyle = `rgba(168, 120, 58, ${alpha})`;
      for (let rot = 0; rot < 2; rot++) {
        c.beginPath();
        c.moveTo(0, -r);
        c.lineTo(r * 0.22, 0);
        c.lineTo(0, r);
        c.lineTo(-r * 0.22, 0);
        c.closePath();
        c.fill();
        c.rotate(Math.PI / 4);
        r *= 0.58;
      }
      c.restore();
    }

    function initFoil() {
      isRevealed = false;
      lastPoint = null;
      strokeCount = 0;
      scratchCanvas.style.opacity = '1';
      scratchCanvas.style.pointerEvents = 'auto';

      if (scratchActionBtn) {
        scratchActionBtn.classList.remove('revealed-state');
        scratchActionBtn.innerHTML = '<span class="action-btn-text">Tap to reveal instantly</span><span class="action-btn-icon">✦</span>';
      }
      if (scratchHint) scratchHint.innerHTML = 'Rub your finger or mouse across the card to scratch';

      const rect = scratchWrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width) || scratchWrapper.offsetWidth || 480;
      const h = Math.round(rect.height) || scratchWrapper.offsetHeight || 260;

      scratchCanvas.width = Math.round(w * dpr);
      scratchCanvas.height = Math.round(h * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.globalCompositeOperation = 'source-over';

      // Luxurious Champagne & Tuscan Gold Brushed Metallic Gradient (Replacing Pink)
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#fbf3e4');
      grad.addColorStop(0.18, '#f1d5a7');
      grad.addColorStop(0.42, '#dfbc86');
      grad.addColorStop(0.68, '#caa066');
      grad.addColorStop(0.88, '#e0c18d');
      grad.addColorStop(1, '#b68346');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Light satin shimmer reflection
      const shimmer = ctx.createLinearGradient(0, 0, w, 0);
      shimmer.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shimmer.addColorStop(0.28, 'rgba(255, 255, 255, 0.26)');
      shimmer.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
      shimmer.addColorStop(0.72, 'rgba(255, 255, 255, 0.22)');
      shimmer.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, w, h);

      // Refined golden double border
      const p1 = 12;
      const p2 = 16;
      ctx.strokeStyle = 'rgba(163, 117, 60, 0.32)';
      ctx.lineWidth = 1;
      ctx.strokeRect(p1, p1, w - p1 * 2, h - p1 * 2);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(p2, p2, w - p2 * 2, h - p2 * 2);

      // Subtle botanical leaf filigree motifs around the corners
      const leafOffset = 30;
      drawGoldFiligree(ctx, leafOffset, leafOffset, 16, Math.PI * 0.25);
      drawGoldFiligree(ctx, w - leafOffset, leafOffset, 16, Math.PI * 0.75);
      drawGoldFiligree(ctx, leafOffset, h - leafOffset, 16, -Math.PI * 0.25);
      drawGoldFiligree(ctx, w - leafOffset, h - leafOffset, 16, -Math.PI * 0.75);

      // Golden shimmer sparkles
      drawSparkle(ctx, w * 0.14, h * 0.5, 9, 0.7);
      drawSparkle(ctx, w * 0.86, h * 0.5, 9, 0.7);
      drawSparkle(ctx, w * 0.24, h * 0.22, 6, 0.55);
      drawSparkle(ctx, w * 0.76, h * 0.22, 6, 0.55);
      drawSparkle(ctx, w * 0.28, h * 0.8, 6, 0.55);
      drawSparkle(ctx, w * 0.72, h * 0.8, 6, 0.55);

      // Tiny star glints
      ctx.fillStyle = 'rgba(168, 120, 58, 0.45)';
      const dots = [
        [w * 0.38, h * 0.18], [w * 0.62, h * 0.18],
        [w * 0.18, h * 0.74], [w * 0.82, h * 0.74],
        [w * 0.44, h * 0.84], [w * 0.56, h * 0.84]
      ];
      dots.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // TYPOGRAPHY MATCHING WEBSITE DESIGN
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const midY = h / 2;

      // 1. Subhead: Montserrat font matching website section tags
      const subFontSize = Math.max(9, Math.min(11, w * 0.024));
      ctx.font = `600 ${subFontSize}px Montserrat, sans-serif`;
      ctx.fillStyle = '#7a4d25';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.65)';
      ctx.shadowBlur = 3;
      try { ctx.letterSpacing = '3px'; } catch (e) {}
      ctx.fillText('✦  A SPECIAL DATE AWAITS  ✦', w / 2, midY - 26);

      // 2. Main Title: Instrument Serif font matching website titles
      const mainFontSize = Math.max(22, Math.min(32, w * 0.065));
      ctx.font = `italic 400 ${mainFontSize}px "Instrument Serif", Georgia, serif`;
      ctx.fillStyle = '#3c1b24';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 5;
      ctx.fillText('Scratch to Reveal', w / 2, midY + 4);

      // 3. Action Prompt: Libre Caslon Text font matching website body
      const hintFontSize = Math.max(10, Math.min(12, w * 0.025));
      ctx.font = `italic 400 ${hintFontSize}px "Libre Caslon Text", serif`;
      ctx.fillStyle = '#6a4325';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowBlur = 2;
      ctx.fillText('Rub with finger or mouse to unveil', w / 2, midY + 32);

      ctx.restore();
    }

    initFoil();
    window.addEventListener('resize', () => {
      if (!isRevealed) initFoil();
    });

    if (window.ResizeObserver) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (!isRevealed && entry.contentRect.width > 50) {
            initFoil();
          }
        }
      });
      ro.observe(scratchWrapper);
    }

    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (!isRevealed) initFoil();
      });
    }

    function getPos(e) {
      const rect = scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    function scratch(pos) {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2, false);
      ctx.fill();

      if (lastPoint) {
        ctx.lineWidth = 56;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      lastPoint = pos;

      strokeCount++;
      if (strokeCount % 12 === 0) {
        checkClearedPercentage();
      }
    }

    function checkClearedPercentage() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = scratchCanvas.width;
      const h = scratchCanvas.height;
      const step = 48; // fast sampling
      let transparent = 0;
      let total = 0;

      try {
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        for (let i = 3; i < data.length; i += 4 * step) {
          total++;
          if (data[i] < 30) {
            transparent++;
          }
        }
        if (total > 0 && transparent / total > 0.42) {
          revealCard();
        }
      } catch (err) {}
    }

    function revealCard() {
      if (isRevealed) return;
      isRevealed = true;
      scratchCanvas.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      scratchCanvas.style.opacity = '0';
      scratchCanvas.style.pointerEvents = 'none';

      if (scratchHint) {
        scratchHint.innerHTML = '🎉 <strong>Save the Date Revealed!</strong> August 15, 2026';
      }
      if (scratchActionBtn) {
        scratchActionBtn.classList.add('revealed-state');
        scratchActionBtn.innerHTML = '<span class="action-btn-text">Continue to our wedding</span><span class="action-btn-icon">&rarr;</span>';
      }
    }

    // Touch & Mouse Scratch Events
    scratchCanvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      lastPoint = getPos(e);
      scratch(lastPoint);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      scratch(getPos(e));
    });

    window.addEventListener('mouseup', () => {
      isDrawing = false;
      lastPoint = null;
    });

    scratchCanvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      lastPoint = getPos(e);
      scratch(lastPoint);
    }, { passive: true });

    scratchCanvas.addEventListener('touchmove', (e) => {
      if (!isDrawing) return;
      scratch(getPos(e));
    }, { passive: true });

    scratchCanvas.addEventListener('touchend', () => {
      isDrawing = false;
      lastPoint = null;
    });

    if (scratchActionBtn) {
      scratchActionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isRevealed) {
          revealCard();
        } else {
          // Smooth scroll to next section
          const nextSec = document.getElementById('introStatement') || document.querySelector('.intro-statement') || document.getElementById('story');
          if (nextSec) {
            if (lenis) {
              lenis.scrollTo(nextSec, { offset: -20 });
            } else {
              nextSec.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    }
  }

  // 5. POLAROID 3D FLIP CARDS
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  polaroidCards.forEach(card => {
    // Click on flip button or card triggers 3D flip
    card.addEventListener('click', (e) => {
      card.classList.toggle('flipped');
    });
  });

  // 5. VENUE SLIDESHOW / CAROUSEL
  const slides = document.querySelectorAll('.slideshow-slider .slide');
  const dots = document.querySelectorAll('.slide-dots .dot');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    if (slides.length === 0) return;
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      resetSlideInterval();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      resetSlideInterval();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      showSlide(idx);
      resetSlideInterval();
    });
  });

  function startSlideInterval() {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 4500);
  }

  function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
  }

  startSlideInterval();

  // 6. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 7. COPY IBAN TO CLIPBOARD
  const copyBtn = document.getElementById('copyBtn');
  const ibanCode = document.getElementById('ibanCode');
  if (copyBtn && ibanCode) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(ibanCode.textContent.trim());
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = 'var(--color-wine)';
        copyBtn.style.color = '#fff';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.style.backgroundColor = '';
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
      }
    });
  }

  // 8. RSVP FORM SUBMISSION
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(rsvpForm);
      const rsvpData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        attendance: formData.get('attendance'),
        additionalGuests: formData.get('additionalGuests'),
        phone: formData.get('phone'),
        dietary: formData.get('dietary'),
        submittedAt: new Date().toISOString()
      };

      // Save to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        stored.push(rsvpData);
        localStorage.setItem('wedding_rsvps', JSON.stringify(stored));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      // Hide form & show confirmation
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) {
        rsvpSuccess.classList.remove('hidden');
        rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // 9. AMBIENT ROMANTIC WEDDING AUDIO (Aaj Sajeya - Official Wedding Track)
  const musicToggle = document.getElementById('musicToggle');
  const musicStatusText = document.getElementById('musicStatusText');
  const heroPlayBtn = document.getElementById('heroPlayBtn');
  let bgAudio = document.getElementById('weddingBgMusic');

  if (!bgAudio) {
    bgAudio = new Audio('assets/aud/aaj%20sajeya.mp3');
    bgAudio.id = 'weddingBgMusic';
    bgAudio.loop = true;
    bgAudio.preload = 'auto';
  }

  let isPlaying = false;

  function updateMusicUI(playing) {
    isPlaying = playing;
    if (musicToggle) {
      if (playing) {
        musicToggle.classList.add('playing');
      } else {
        musicToggle.classList.remove('playing');
      }
    }
    if (heroPlayBtn) {
      if (playing) {
        heroPlayBtn.classList.add('playing');
      } else {
        heroPlayBtn.classList.remove('playing');
      }
    }
    if (musicStatusText) {
      musicStatusText.textContent = playing ? 'Music On' : 'Music Off';
    }
  }

  function startMusic() {
    if (!bgAudio) return;
    bgAudio.play().then(() => {
      updateMusicUI(true);
    }).catch(err => {
      console.warn('Audio play request prevented or pending user gesture:', err);
    });
  }

  function stopMusic() {
    if (!bgAudio) return;
    bgAudio.pause();
    updateMusicUI(false);
  }

  // Audio state event listeners to keep UI synchronized
  bgAudio.addEventListener('play', () => updateMusicUI(true));
  bgAudio.addEventListener('pause', () => updateMusicUI(false));
  bgAudio.addEventListener('ended', () => updateMusicUI(false));

  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }

  // 10. WELCOME PAGE / OPEN INVITATION CONTROLLER
  const welcomeScreen = document.getElementById('welcomeScreen');
  const openInvitationBtn = document.getElementById('openInvitationBtn');

  // 10.A FLOATING HEARTS ANIMATION ON WELCOME PAGE
  const heartsContainer = document.getElementById('floatingHeartsContainer');
  let heartSpawnInterval = null;

  const heartColors = [
    '#db465d',  // rose accent
    '#e8758a',  // soft rose
    '#c44058',  // deep rose
    '#f0a0b0',  // blush pink
    '#d4606e',  // muted rose
    '#c59d43',  // gold accent
    '#e6c68a',  // soft gold
    '#a36f77',  // muted wine rose
  ];

  function createFloatingHeart() {
    if (!heartsContainer || !welcomeScreen || welcomeScreen.classList.contains('opened')) {
      stopHeartSpawning();
      return;
    }

    const heart = document.createElement('div');
    heart.className = 'floating-heart' + (Math.random() > 0.65 ? ' glow' : '');

    // Randomize properties
    const size = 12 + Math.random() * 22; // 12-34px
    const leftPos = 3 + Math.random() * 94; // 3%-97% horizontal spread
    const duration = 5 + Math.random() * 5; // 5-10s float time
    const delay = Math.random() * 0.5; // 0-0.5s stagger
    const scale = 0.4 + Math.random() * 0.8; // 0.4-1.2 scale
    const opacity = 0.25 + Math.random() * 0.5; // 0.25-0.75 opacity
    const drift = -40 + Math.random() * 80; // -40 to 40px horizontal drift
    const rotate = -45 + Math.random() * 90; // -45 to 45deg rotation
    const swayDuration = 2 + Math.random() * 3; // 2-5s sway period
    const swayX = -20 + Math.random() * 40; // sway distance
    const swayRot = -12 + Math.random() * 24; // sway rotation
    const color = heartColors[Math.floor(Math.random() * heartColors.length)];

    heart.style.cssText = `
      left: ${leftPos}%;
      --heart-duration: ${duration}s;
      --heart-delay: ${delay}s;
      --heart-scale: ${scale};
      --heart-opacity: ${opacity};
      --heart-drift: ${drift}px;
      --heart-rotate: ${rotate}deg;
      --heart-sway: ${swayDuration}s;
      --heart-sway-x: ${swayX}px;
      --heart-sway-rot: ${swayRot}deg;
    `;

    // Use different heart shapes for variety
    const heartShapes = [
      // Classic filled heart
      `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`,
      // Outlined heart
      `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`,
      // Double outline heart (elegant)
      `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.2" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`,
    ];

    heart.innerHTML = heartShapes[Math.floor(Math.random() * heartShapes.length)];
    heartsContainer.appendChild(heart);

    // Auto-cleanup after animation finishes
    const totalLife = (duration + delay) * 1000 + 500;
    setTimeout(() => {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, totalLife);
  }

  function startHeartSpawning() {
    if (heartSpawnInterval) return;
    // Spawn initial batch for immediate visual impact
    for (let i = 0; i < 6; i++) {
      setTimeout(() => createFloatingHeart(), i * 300);
    }
    // Then spawn continuously every 700-1200ms
    heartSpawnInterval = setInterval(() => {
      createFloatingHeart();
      // Occasionally spawn a pair for richness
      if (Math.random() > 0.6) {
        setTimeout(() => createFloatingHeart(), 200);
      }
    }, 800);
  }

  function stopHeartSpawning() {
    if (heartSpawnInterval) {
      clearInterval(heartSpawnInterval);
      heartSpawnInterval = null;
    }
  }

  // Start hearts immediately if welcome screen is visible
  if (welcomeScreen && !welcomeScreen.classList.contains('opened')) {
    startHeartSpawning();
  }

  // 10.B WELCOME PAGE / OPEN INVITATION CONTROLLER
  function triggerOpenInvitation(e) {
    stopHeartSpawning();
    if (typeof window.openWeddingInvitation === 'function') {
      window.openWeddingInvitation(e);
      return;
    }

    if (!welcomeScreen || welcomeScreen.classList.contains('opened')) return;

    welcomeScreen.classList.add('opened');
    document.documentElement.classList.remove('welcome-active');
    document.body.classList.remove('welcome-active');

    // Automatically begin gentle wedding melody upon opening
    if (typeof isPlaying !== 'undefined' && !isPlaying) {
      try {
        startMusic();
      } catch (err) {
        console.warn('Audio auto-play on gesture warning:', err);
      }
    }

    // Smooth scroll to the Hero section
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Clean up display after curtain animation finishes
    setTimeout(() => {
      welcomeScreen.style.display = 'none';
    }, 950);
  }

  if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', triggerOpenInvitation);
    openInvitationBtn.addEventListener('touchend', triggerOpenInvitation, { passive: false });
  }

  // 11. ROMANTIC AMBIENCE ENGINE FOR ALL NON-HERO SECTIONS
  (function initRomanticAmbience() {
    const canvas = document.getElementById('romanticHeartsCanvas');
    const contentOverHero = document.getElementById('contentOverHero');
    const heroSection = document.getElementById('hero');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });

    // Palette: soft rose, romantic gold, blush pink, ruby wine
    const colors = ['#db465d', '#e8758a', '#c59d43', '#f2b5c4', '#6b3844', '#993b5d', '#e8a2af'];
    const isMobile = window.innerWidth < 640;
    const particleCount = isMobile ? 14 : 22;
    const particles = [];

    function createParticle(initialY) {
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + 30 + Math.random() * 40,
        size: isMobile ? 12 + Math.random() * 12 : 16 + Math.random() * 18,
        speedY: 0.35 + Math.random() * 0.45, // slow, peaceful upward float
        swayAmp: 6 + Math.random() * 10,     // very subtle natural drift (6-16px max across entire screen)
        phase: Math.random() * Math.PI * 2,
        baseRotation: -0.15 + Math.random() * 0.3, // elegant slight tilt (-8 to +8 deg)
        baseAlpha: 0.22 + Math.random() * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        isFilled: Math.random() > 0.4,
        isSparkle: Math.random() > 0.75
      };
    }

    // Populate initial particle set spread across screen
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    // Helper: Draw curved heart on canvas
    function drawHeart(x, y, size, color, isFilled, rotation, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      const topCurve = size * 0.28;
      ctx.moveTo(0, topCurve);
      ctx.bezierCurveTo(-size / 2, -topCurve, -size, size / 3, 0, size);
      ctx.bezierCurveTo(size, size / 3, size / 2, -topCurve, 0, topCurve);
      ctx.closePath();
      if (isFilled) {
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Helper: Draw romantic twinkle sparkle
    function drawSparkle(x, y, size, color, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    let isCanvasActive = false;
    let animFrame = null;

    function renderLoop() {
      if (!isCanvasActive) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;

        // Graceful S-curve horizontal drift tied to vertical height (no fast left-right wiggling)
        const currentX = p.x + Math.sin(p.y * 0.0035 + p.phase) * p.swayAmp;
        const currentRotation = p.baseRotation + Math.sin(p.y * 0.002 + p.phase) * 0.05;

        // Smooth fade-in from bottom and fade-out near top
        const fadeIn = Math.min(1, Math.max(0, (height - p.y) / 80));
        const fadeOut = Math.min(1, Math.max(0, p.y / 100));
        const alpha = p.baseAlpha * fadeIn * fadeOut;

        if (p.isSparkle) {
          drawSparkle(currentX, p.y, p.size * 0.4, p.color, alpha);
        } else {
          drawHeart(currentX, p.y, p.size, p.color, p.isFilled, currentRotation, alpha);
        }

        // Recycle particle when it floats off top
        if (p.y < -40) {
          particles[i] = createParticle();
        }
      }

      animFrame = requestAnimationFrame(renderLoop);
    }

    // Visibility toggle: active strictly when user leaves hero section
    function checkVisibility() {
      if (!heroSection) return;
      const heroRect = heroSection.getBoundingClientRect();
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const scrolledPastHero = scrollPos > 60 || heroRect.bottom <= window.innerHeight * 0.75;

      if (scrolledPastHero && !isCanvasActive) {
        isCanvasActive = true;
        canvas.style.opacity = '1';
        if (!animFrame) {
          animFrame = requestAnimationFrame(renderLoop);
        }
      } else if (!scrolledPastHero && isCanvasActive) {
        isCanvasActive = false;
        canvas.style.opacity = '0';
        if (animFrame) {
          cancelAnimationFrame(animFrame);
          animFrame = null;
        }
        ctx.clearRect(0, 0, width, height);
      }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('wheel', () => setTimeout(checkVisibility, 50), { passive: true });
    window.addEventListener('touchmove', () => setTimeout(checkVisibility, 50), { passive: true });
    // Initial check and periodic liveness
    setTimeout(checkVisibility, 200);
    setInterval(checkVisibility, 1000);

    // Interactive Touch / Click Hearts in all content sections
    if (contentOverHero) {
      contentOverHero.addEventListener('pointerdown', (e) => {
        // Skip right clicks or text selection drags
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        
        const burstCount = 3 + Math.floor(Math.random() * 3);
        const burstColors = ['#db465d', '#e8758a', '#c59d43', '#993b5d', '#f2b5c4'];

        for (let i = 0; i < burstCount; i++) {
          const heart = document.createElement('div');
          heart.className = 'romantic-click-heart';
          const dx = -35 + Math.random() * 70;
          const rot = -30 + Math.random() * 60;
          const size = 14 + Math.random() * 14;
          const color = burstColors[Math.floor(Math.random() * burstColors.length)];

          heart.style.left = `${e.clientX}px`;
          heart.style.top = `${e.clientY}px`;
          heart.style.setProperty('--dx', `${dx}px`);
          heart.style.setProperty('--rot', `${rot}deg`);
          heart.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" style="filter: drop-shadow(0 2px 4px rgba(219,70,93,0.35));">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          `;
          document.body.appendChild(heart);

          setTimeout(() => {
            if (heart.parentNode) heart.parentNode.removeChild(heart);
          }, 1250);
        }
      }, { passive: true });
    }
  })();
});

// Helper: Add Wedding Events to Google Calendar
window.addWeddingEventToCalendar = function(title, startTimeIso, location, description) {
  try {
    const startDate = new Date(startTimeIso);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
    const formatIso = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dates = `${formatIso(startDate)}/${formatIso(endDate)}`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title + ' · Aayush & Priyal Wedding')}&dates=${dates}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  } catch (err) {
    alert(`Added ${title} to calendar!`);
  }
};
