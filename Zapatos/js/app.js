/* =============================================
   SOLÉ — app.js
   All interactivity & animations
   ============================================= */

// =============================================
// LOADER
// =============================================
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const text = document.getElementById('loaderText');
  const messages = ['Cargando experiencia...', 'Preparando colección...', 'Casi listo...'];
  let progress = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 25 + 8;
    if (progress > 100) progress = 100;
    fill.style.width = progress + '%';

    if (progress > 40 && msgIdx === 0) { msgIdx++; text.textContent = messages[1]; }
    if (progress > 75 && msgIdx === 1) { msgIdx++; text.textContent = messages[2]; }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hide');
        // Trigger hero reveal after load
        setTimeout(triggerHeroReveals, 300);
      }, 400);
    }
  }, 150);
})();

function triggerHeroReveals() {
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
}

// =============================================
// CUSTOM CURSOR
// =============================================
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .product-card, .cat-card, .filter-btn');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

// =============================================
// NAV SCROLL EFFECT
// =============================================
(function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

// =============================================
// HERO SHOE — PARALLAX / TILT
// =============================================
(function initHeroTilt() {
  const wrap = document.getElementById('heroShoeWrap');
  const shoe = document.getElementById('heroShoe');
  if (!wrap || !shoe) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    shoe.style.transform = `rotateX(${-dy * 10}deg) rotateY(${dx * 12}deg) rotate(-5deg) translateY(${-dy * 5}px)`;
  });

  document.addEventListener('mouseleave', () => {
    shoe.style.transform = 'rotate(-5deg)';
  });
})();

// =============================================
// MAGNETIC BUTTONS
// =============================================
(function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

// =============================================
// SCROLL REVEAL (Intersection Observer)
// =============================================
(function initReveal() {
  const targets = document.querySelectorAll('.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => observer.observe(el));
})();

// =============================================
// COUNTER ANIMATION
// =============================================
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => observer.observe(n));

  function animateCount(el, target) {
    let current = 0;
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      current = Math.round(ease * target);
      el.textContent = current.toLocaleString('es');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();

// =============================================
// PRODUCT FILTER
// =============================================
(function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');
  const grid = document.getElementById('productsGrid');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;

      cards.forEach((card, i) => {
        const match = cat === 'all' || card.dataset.cat === cat;
        if (match) {
          card.style.display = '';
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = `fadeInUp 0.4s ${i * 0.07}s both ease`;
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

// =============================================
// CART STATE — usa localStorage para persistir
// entre páginas
// =============================================
const cart = {
  get items() {
    try { return JSON.parse(localStorage.getItem('sole_cart') || '[]'); }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem('sole_cart', JSON.stringify(items));
  },

  add(id, name, price, emoji, cat) {
    const items = this.items;
    const existing = items.find(i => i.id === id);
    if (existing) { existing.qty++; }
    else { items.push({ id, name, price: parseFloat(price), emoji, cat: cat || '', qty: 1 }); }
    this.save(items);
    this.updateCount();
    showToast(`${name} añadido al carrito`);
  },

  remove(id) {
    this.save(this.items.filter(i => i.id !== id));
    this.updateCount();
  },

  // render() no necesaria — el carrito tiene su propia página
  render() {},

  updateCount() {
    const count = this.items.reduce((s, i) => s + i.qty, 0);
    const el = document.getElementById('cartCount');
    if (!el) return;
    el.textContent = count;
    el.classList.toggle('show', count > 0);
  }
};

// =============================================
// CART COUNT — inicializa contador en todas las páginas
// =============================================
(function initCartCount() {
  cart.updateCount();
})();

// =============================================
// QUICK ADD BUTTONS
// =============================================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.quick-add');
  if (!btn) return;
  const card = btn.closest('.product-card');
  if (!card) return;
  cart.add(card.dataset.id, card.dataset.name, card.dataset.price, card.dataset.emoji, card.dataset.cat);
});

// =============================================
// PRODUCT MODAL
// =============================================
(function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const addBtn = document.getElementById('modalAddCart');
  let current = null;

  function openModal(card) {
    current = card;
    document.getElementById('modalEmoji').textContent = card.dataset.emoji;
    document.getElementById('modalCat').textContent = card.dataset.cat;
    document.getElementById('modalName').textContent = card.dataset.name;
    document.getElementById('modalPrice').textContent = '$' + card.dataset.price;

    // Reset size selection
    document.querySelectorAll('.size-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === 0);
    });

    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    current = null;
  }

  // Open via "view" button
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.card-view');
    if (!viewBtn) return;
    const card = viewBtn.closest('.product-card');
    if (card) openModal(card);
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Size selection
  document.getElementById('sizeOptions').addEventListener('click', (e) => {
    if (!e.target.classList.contains('size-btn')) return;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
  });

  // Add from modal
  addBtn.addEventListener('click', () => {
    if (!current) return;
    cart.add(current.dataset.id, current.dataset.name, current.dataset.price, current.dataset.emoji);
    closeModal();
  });
})();

// =============================================
// CATEGORY CARDS → FILTER
// =============================================
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    const filter = card.dataset.filter;
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const btn = document.querySelector(`.filter-btn[data-cat="${filter}"]`);
      if (btn) btn.click();
    }, 600);
  });
});

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  msgEl.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// =============================================
// NEWSLETTER
// =============================================
document.getElementById('newsletterBtn').addEventListener('click', () => {
  const input = document.getElementById('newsletterInput');
  const msg = document.getElementById('newsletterMsg');
  const email = input.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.style.color = '#e74c3c';
    msg.textContent = '✗ Por favor ingresa un email válido.';
    return;
  }
  msg.style.color = 'var(--gold)';
  msg.textContent = '✓ ¡Bienvenido al Club SOLÉ! Revisa tu email.';
  input.value = '';
  setTimeout(() => msg.textContent = '', 4000);
});
document.getElementById('newsletterInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('newsletterBtn').click();
});

// =============================================
// WISH BUTTON TOGGLE
// =============================================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.card-wish');
  if (!btn) return;
  const isWished = btn.textContent === '♥';
  btn.textContent = isWished ? '♡' : '♥';
  btn.style.color = isWished ? '' : '#e74c3c';
  if (!isWished) showToast('Añadido a favoritos');
});

// =============================================
// SMOOTH ANCHOR SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// =============================================
// MARQUEE PAUSE ON HOVER
// =============================================
(function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();

// =============================================
// PARALLAX SUBTLE ON SCROLL
// =============================================
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.orb').forEach((orb, i) => {
      const speed = [0.08, 0.05, 0.1][i] || 0.07;
      orb.style.transform += `translateY(${y * speed}px)`;
    });
  }, { passive: true });
})();

console.log('%cSOLÉ — Luxury Shoes 2026', 'font-size:2rem; font-weight:bold; color:#c9a84c; font-family:serif;');