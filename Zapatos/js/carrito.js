/* =============================================
   SOLÉ — carrito.js
   Lógica de la página de carrito
   ============================================= */

(function initCartPage() {

  function getCart() {
    try { return JSON.parse(localStorage.getItem('sole_cart') || '[]'); } 
    catch { return []; }
  }

  function saveCart(items) {
    localStorage.setItem('sole_cart', JSON.stringify(items));
  }

  function updateCartCount() {
    const items = getCart();
    const count = items.reduce((s, i) => s + i.qty, 0);
    const el = document.getElementById('cartCount');
    if (el) {
      el.textContent = count;
      el.classList.toggle('show', count > 0);
    }
  }

  function renderCartPage() {
    const items = getCart();
    const container = document.getElementById('cartPageItems');
    const emptyEl = document.getElementById('cartPageEmpty');
    const summaryEl = document.getElementById('cartSummary');

    if (!container) return;

    updateCartCount();

    if (!items.length) {
      container.innerHTML = '';
      emptyEl.style.display = 'flex';
      summaryEl.style.opacity = '0.4';
      summaryEl.style.pointerEvents = 'none';
      updateSummary(0);
      return;
    }

    emptyEl.style.display = 'none';
    summaryEl.style.opacity = '';
    summaryEl.style.pointerEvents = '';

    container.innerHTML = items.map(item => `
      <div class="cart-page-item" data-id="${item.id}">
        <div class="cpi-emoji">${item.emoji}</div>
        <div class="cpi-info">
          <div class="cpi-name">${item.name}</div>
          <div class="cpi-cat">${item.cat || ''}</div>
        </div>
        <div class="cpi-controls">
          <button class="cpi-qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="cpi-qty">${item.qty}</span>
          <button class="cpi-qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <div class="cpi-price">$${(item.price * item.qty).toFixed(0)}</div>
        <button class="cpi-remove" data-id="${item.id}">✕</button>
      </div>
    `).join('');

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    updateSummary(subtotal);

    // Events
    container.querySelectorAll('.cpi-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cart = getCart();
        const item = cart.find(i => i.id === btn.dataset.id);
        if (!item) return;
        if (btn.dataset.action === 'inc') {
          item.qty++;
        } else {
          item.qty--;
          if (item.qty <= 0) {
            const idx = cart.indexOf(item);
            cart.splice(idx, 1);
          }
        }
        saveCart(cart);
        renderCartPage();
      });
    });

    container.querySelectorAll('.cpi-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const cart = getCart().filter(i => i.id !== btn.dataset.id);
        saveCart(cart);
        renderCartPage();
        showToast('Producto eliminado');
      });
    });
  }

  function updateSummary(subtotal) {
    const shipping = subtotal >= 150 ? 'Gratis' : '$12';
    const total = subtotal >= 150 ? subtotal : subtotal + 12;
    const sub = document.getElementById('summarySubtotal');
    const shi = document.getElementById('summaryShipping');
    const tot = document.getElementById('summaryTotal');
    if (sub) sub.textContent = '$' + subtotal.toFixed(0);
    if (shi) shi.textContent = shipping;
    if (tot) tot.textContent = '$' + total.toFixed(0);
  }

  // Coupon
  const couponBtn = document.getElementById('couponBtn');
  if (couponBtn) {
    couponBtn.addEventListener('click', () => {
      const code = document.getElementById('couponInput').value.trim().toUpperCase();
      const msg = document.getElementById('couponMsg');
      if (code === 'SOLE10') {
        msg.style.color = 'var(--gold, #fff)';
        msg.textContent = '✓ Cupón aplicado: 10% de descuento';
      } else {
        msg.style.color = '#e74c3c';
        msg.textContent = '✗ Cupón no válido';
      }
      setTimeout(() => msg.textContent = '', 3000);
    });
  }

  // Checkout
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const items = getCart();
      if (!items.length) return;
      showToast('¡Redirigiendo al pago...');
      setTimeout(() => {
        alert('Aquí se integraría tu pasarela de pago (MercadoPago, Stripe, etc.)');
      }, 1000);
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMsg');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Init
  renderCartPage();

})();
