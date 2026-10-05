/**
 * Starlings UK - Main Page Interactions & Controller
 * Glues GSAP animations, Three.js PlateScene, dish switches, and UI controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvasContainer = document.getElementById('canvas-container');
  let plateScene = null;

  // 2. Audio Toggle Setup
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundWaveIcon = document.getElementById('sound-wave-icon');
  const soundLabel = document.getElementById('sound-label');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (window.cafeSounds) {
        const isEnabled = window.cafeSounds.toggle();
        if (isEnabled) {
          soundWaveIcon.classList.add('active');
          soundLabel.textContent = 'Audio On';
          soundToggleBtn.style.color = '';
          window.cafeSounds.playPlop(1.2);
        } else {
          soundWaveIcon.classList.remove('active');
          soundLabel.textContent = 'Audio Muted';
          soundToggleBtn.style.color = 'var(--text-light)';
        }
      }
    });
  }

  // 3. Dish Switching Logic
  const dishPills = document.querySelectorAll('.dish-pill');
  const dishTitleEl = document.getElementById('dish-title');
  const dishTaglineEl = document.getElementById('dish-tagline');
  const dishPriceEl = document.getElementById('dish-price');
  const dishTimeEl = document.getElementById('dish-time');
  const dishBadgesEl = document.getElementById('dish-badges');
  const dishDescEl = document.getElementById('dish-description');
  const dishQuoteEl = document.getElementById('dish-quote');
  const dishPairingEl = document.getElementById('dish-pairing');

  function updateDishUI(dishId, triggerScene = true) {
    const dishData = FoodModels.DISHES.find(d => d.id === dishId);
    if (!dishData) return;

    // Update active state in pills
    dishPills.forEach(pill => {
      if (pill.dataset.dishId === dishId) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Animate details transition with GSAP
    if (window.gsap) {
      gsap.fromTo('#dish-details-panel', 
        { opacity: 0.6, y: 8 }, 
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }

    if (dishTitleEl) dishTitleEl.textContent = dishData.name;
    if (dishTaglineEl) dishTaglineEl.textContent = dishData.tagline;
    if (dishPriceEl) dishPriceEl.textContent = dishData.price;
    if (dishTimeEl) dishTimeEl.textContent = dishData.timeServed;
    if (dishDescEl) dishDescEl.textContent = dishData.description;
    if (dishQuoteEl) dishQuoteEl.textContent = dishData.quote;
    if (dishPairingEl) dishPairingEl.textContent = dishData.pairing;

    // Badges
    if (dishBadgesEl) {
      dishBadgesEl.innerHTML = dishData.badges
        .map(b => `<span class="dish-meta-badge">${b}</span>`)
        .join('');
    }

    // Trigger 3D Plate update
    if (triggerScene && plateScene) {
      plateScene.loadDish(dishId, true);
    }
  }

  // 1. Determine Initial Dish (from query param ?dish= or hash or default to Full English)
  const urlParams = new URLSearchParams(window.location.search);
  const dishParam = urlParams.get('dish');
  const hashParam = window.location.hash.replace('#', '');
  const candidateDish = dishParam || hashParam;
  const startDish = (candidateDish && FoodModels.DISHES.some(d => d.id === candidateDish)) ? candidateDish : 'full-english';

  // Initialize Three.js 3D Plate Experience with starting dish
  if (canvasContainer && window.PlateScene) {
    plateScene = new PlateScene(canvasContainer, startDish);
  }
  updateDishUI(startDish, false);

  // Bind Pill Clicks
  dishPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const dishId = pill.dataset.dishId;
      updateDishUI(dishId, true);
    });
  });

  // 4. Plate Toolbar Buttons (Reset, Scatter, View Modes)
  const resetBtn = document.getElementById('btn-reset-plate');
  if (resetBtn && plateScene) {
    resetBtn.addEventListener('click', () => {
      plateScene.resetPlating();
    });
  }

  const scatterBtn = document.getElementById('btn-scatter-plate');
  if (scatterBtn && plateScene) {
    scatterBtn.addEventListener('click', () => {
      plateScene.scatterItems();
    });
  }

  const spinBtn = document.getElementById('btn-spin-plate');
  if (spinBtn && plateScene) {
    spinBtn.addEventListener('click', () => {
      plateScene.spinPlate();
    });
  }

  const viewBtns = document.querySelectorAll('.view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.view;
      if (plateScene) {
        plateScene.setCameraView(mode, 0.85);
        if (window.cafeSounds) window.cafeSounds.playSwoosh();
      }
    });
  });

  // 5. Populate The 6 Cafe Dishes Catalog Grid
  const catalogGrid = document.getElementById('dishes-catalog-grid');
  if (catalogGrid && FoodModels && FoodModels.DISHES) {
    catalogGrid.innerHTML = '';
    FoodModels.DISHES.forEach((dish, idx) => {
      const card = document.createElement('article');
      card.className = 'menu-card';
      const numStr = (idx + 1).toString().padStart(2, '0');

      // Extract unique item names
      const itemNames = dish.items.map(it => {
        const tempGroup = it.create();
        return tempGroup.userData.itemName || 'Garnish';
      });
      // Deduplicate
      const uniqueItems = [...new Set(itemNames)];

      card.innerHTML = `
        <div class="card-top">
          <span class="card-number">NO. ${numStr}</span>
          <span class="card-price">${dish.price}</span>
        </div>
        <h3 class="card-title">${dish.name}</h3>
        <p class="card-desc">${dish.description}</p>
        
        <div class="card-items-list">
          <div class="items-list-title">Plate Components:</div>
          <div class="items-tags">
            ${uniqueItems.slice(0, 5).map(name => `<span class="item-chip">${name}</span>`).join('')}
            ${uniqueItems.length > 5 ? `<span class="item-chip">+${uniqueItems.length - 5} more</span>` : ''}
          </div>
        </div>

        <button class="card-cta" data-target-dish="${dish.id}">
          <span>Plate this in 3D</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      `;

      catalogGrid.appendChild(card);
    });

    // Add click listeners to "Plate this in 3D" buttons
    const cardCtas = catalogGrid.querySelectorAll('.card-cta');
    cardCtas.forEach(btn => {
      btn.addEventListener('click', () => {
        const dishId = btn.dataset.targetDish;
        updateDishUI(dishId);

        // Smooth scroll to 3D Plate stage
        const targetSection = document.getElementById('interactive-plate');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // 6. Reservation Modal Handlers
  const modal = document.getElementById('reserve-modal');
  const openReserveBtns = [
    document.getElementById('open-reserve-btn'),
    document.getElementById('btn-order-dish'),
    document.getElementById('brunch-reserve-btn')
  ].filter(Boolean);
  const closeModalBtn = document.getElementById('close-modal-btn');
  const bookingForm = document.getElementById('booking-form');

  openReserveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('open');
      if (window.cafeSounds) window.cafeSounds.playPick();
    });
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }

  // Date default to tomorrow
  const dateInput = document.getElementById('book-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('book-name').value;
      const date = document.getElementById('book-date').value;
      const time = document.getElementById('book-time').value;
      const guests = document.getElementById('book-guests').value;

      if (window.cafeSounds) {
        window.cafeSounds.playBell();
      }

      modal.classList.remove('open');

      // Native stylish toast feedback
      showNotification(`Thank you ${name}! Table for ${guests} reserved on ${date} at ${time}. We look forward to welcoming you to Starlings.`);
      bookingForm.reset();
    });
  }

  // Toast Notification
  function showNotification(message) {
    const existing = document.getElementById('cafe-notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'cafe-notification-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--text-dark);
      color: #fff;
      padding: 16px 24px;
      border-radius: var(--radius-md);
      box-shadow: 0 12px 35px rgba(0,0,0,0.25);
      z-index: 2000;
      max-width: 380px;
      font-size: 0.92rem;
      border-left: 4px solid var(--warm-gold);
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // 7. GSAP Entrance and ScrollTrigger Animations
  if (window.gsap) {
    // Hero Entrance
    const heroTl = gsap.timeline();
    heroTl.from('.announcement-bar', { y: -20, opacity: 0, duration: 0.5, ease: 'power2.out' })
          .from('.site-header', { y: -30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
          .from('.hero-intro > *', { y: 24, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }, '-=0.3')
          .from('.dish-pill', { scale: 0.85, opacity: 0, stagger: 0.05, duration: 0.45, ease: 'back.out(1.7)' }, '-=0.3')
          .from('.plate-stage-layout', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');

    // ScrollTrigger Card Staggers
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from('.menu-card', {
        scrollTrigger: {
          trigger: '.dishes-catalog-section',
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.75,
        ease: 'power2.out'
      });

      gsap.from('.story-content', {
        scrollTrigger: {
          trigger: '.story-provenance-section',
          start: 'top 75%',
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('.story-visual-box', {
        scrollTrigger: {
          trigger: '.story-provenance-section',
          start: 'top 75%',
        },
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('.brunch-box', {
        scrollTrigger: {
          trigger: '.brunch-banner-section',
          start: 'top 80%',
        },
        scale: 0.94,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      });
    }
  }
});
