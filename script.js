/* ===========================
   DI.Fireworks — Main Script
   =========================== */

// ===== INTRO ANIMATION =====
(function () {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let rockets = [];
  let animId;
  let running = true;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#e60000','#ff3333','#ffd700','#ff6600','#ff99cc','#ffffff','#00ccff','#ff4400'];

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function createRocket() {
    return {
      x: rand(canvas.width * 0.1, canvas.width * 0.9),
      y: canvas.height,
      tx: rand(canvas.width * 0.1, canvas.width * 0.9),
      ty: rand(canvas.height * 0.1, canvas.height * 0.5),
      speed: rand(4, 8),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      exploded: false,
      trail: [],
    };
  }

  function explode(x, y, color) {
    const count = Math.floor(rand(80, 140));
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = rand(1, 6);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: rand(2, 4),
        decay: rand(0.012, 0.022),
        gravity: 0.05,
      });
    }
  }

  function launchRocket() {
    rockets.push(createRocket());
  }

  let rocketTimer = 0;
  function update() {
    if (!running) return;
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rocketTimer++;
    if (rocketTimer % 30 === 0) launchRocket();

    // Rockets
    rockets = rockets.filter(r => !r.done);
    rockets.forEach(r => {
      const dx = r.tx - r.x;
      const dy = r.ty - r.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 10) r.trail.shift();

      if (dist < r.speed + 2) {
        explode(r.x, r.y, r.color);
        r.done = true;
        return;
      }
      r.x += (dx / dist) * r.speed;
      r.y += (dy / dist) * r.speed;

      // Trail
      r.trail.forEach((t, i) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2 * (i / r.trail.length), 0, Math.PI * 2);
        ctx.fillStyle = r.color + Math.floor(100 * i / r.trail.length).toString(16).padStart(2,'0');
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });

    // Particles
    particles = particles.filter(p => p.alpha > 0.02);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.alpha -= p.decay;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    animId = requestAnimationFrame(update);
  }

  update();

  // Stop after 5.8s
  setTimeout(() => {
    running = false;
    cancelAnimationFrame(animId);
    const overlay = document.getElementById('intro-overlay');
    setTimeout(() => { overlay.style.display = 'none'; }, 800);
  }, 5800);
})();


// ===== HERO CANVAS (Ambient) =====
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnSpark() {
    const colors = ['#e60000','#ff3333','#ffd700','#ff6600','#ffffff99'];
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 120 + 60,
      age: 0,
    });
  }

  for (let i = 0; i < 60; i++) spawnSpark();

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particles.length < 80) spawnSpark();

    particles = particles.filter(p => p.age < p.life);
    particles.forEach(p => {
      p.age++;
      p.x += p.vx;
      p.y += p.vy;
      const fade = 1 - p.age / p.life;
      ctx.globalAlpha = p.alpha * fade;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(tick);
  }
  tick();
})();


// ===== NAVBAR =====
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navbar = document.getElementById('navbar');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  function setActive() {
    let scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navLinks.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
        const link = navLinks.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', setActive);

  // Shrink on scroll
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 50 ? 'rgba(230,0,0,0.5)' : 'rgba(230,0,0,0.3)';
  });
})();


// ===== REVIEWS =====
let reviewsData = JSON.parse(localStorage.getItem('di_reviews') || 'null') || [
  { name: 'Muhammad Ali', location: 'Gulshan-e-Iqbal', rating: 5, text: 'Best fireworks in Karachi! 100 shooters were amazing. Fast delivery and professional service. Highly recommended!', id: 'default1' },
  { name: 'Fatima Zahra', location: 'DHA Phase 6', rating: 5, text: 'Ordered birthday items for my kids party. Balloons, color smoke — everything was perfect. Will order again!', id: 'default2' },
  { name: 'Usman Khan', location: 'North Nazimabad', rating: 5, text: 'Used DI.Fireworks for our wedding night. The aerial display was breathtaking. Government registered gives extra trust.', id: 'default3' },
  { name: 'Sara Malik', location: 'Clifton', rating: 4, text: 'Good quality Chinese fireworks at reasonable prices. Delivery was quick. Packaging was safe and secure.', id: 'default4' },
  { name: 'Ahmed Raza', location: 'Nazimabad', rating: 5, text: '50 shooters se shukar kiya celebration! Bohot acha tha. Karachi mein best fireworks shop hai yeh.', id: 'default5' },
  { name: 'Zainab Hassan', location: 'Lyari', rating: 5, text: 'Birthday party ke liye party poppers aur color smoke mangwaye. Bohot fresh aur quality products the!', id: 'default6' },
];

let selectedStars = 5;

function saveReviews() {
  localStorage.setItem('di_reviews', JSON.stringify(reviewsData));
}

function renderReviews() {
  const track = document.getElementById('reviews-track');
  if (!track) return;

  // Double the array for infinite scroll effect
  const doubled = [...reviewsData, ...reviewsData];
  track.innerHTML = doubled.map(r => `
    <div class="review-card">
      <div class="rev-quote">"</div>
      <div class="rev-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <p class="rev-text">${escapeHtml(r.text)}</p>
      <div class="rev-author">
        <div class="rev-avatar">${r.name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="rev-name">${escapeHtml(r.name)}</div>
          <div class="rev-location"><i class="fas fa-map-pin" style="color:var(--red);font-size:0.7rem;margin-right:3px;"></i>${escapeHtml(r.location || 'Karachi')}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Adjust animation duration based on count
  const width = reviewsData.length * 310;
  track.style.animationDuration = Math.max(20, reviewsData.length * 5) + 's';
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function openReviewModal() {
  document.getElementById('review-modal').style.display = 'flex';
  document.getElementById('rev-name').value = '';
  document.getElementById('rev-text').value = '';
  selectedStars = 5;
  updateStars();
}
function closeReviewModal() {
  document.getElementById('review-modal').style.display = 'none';
}

function updateStars() {
  const stars = document.querySelectorAll('#star-picker i');
  stars.forEach((s, i) => {
    s.classList.toggle('active', i < selectedStars);
    s.style.color = i < selectedStars ? 'var(--gold)' : 'var(--gray)';
  });
}

document.querySelectorAll('#star-picker i').forEach((star, idx) => {
  star.addEventListener('click', () => {
    selectedStars = idx + 1;
    updateStars();
  });
  star.addEventListener('mouseover', () => {
    document.querySelectorAll('#star-picker i').forEach((s, i) => {
      s.style.color = i <= idx ? 'var(--gold)' : 'var(--gray)';
    });
  });
  star.addEventListener('mouseout', updateStars);
});

function postReview() {
  const name = document.getElementById('rev-name').value.trim();
  const text = document.getElementById('rev-text').value.trim();
  if (!name || !text) {
    alert('Please fill in your name and review.');
    return;
  }
  const review = {
    id: Date.now().toString(),
    name,
    location: 'Karachi',
    rating: selectedStars,
    text,
  };
  reviewsData.push(review);
  saveReviews();
  renderReviews();
  closeReviewModal();
}

// ===== MAP =====
function openMap() {
  document.getElementById('map-modal').style.display = 'flex';
}
function closeMap() {
  document.getElementById('map-modal').style.display = 'none';
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
  });
});


// ===== PRODUCTS PREVIEW =====
const previewProducts = [
  { icon: '🎆', name: '100 Shooter Box', category: 'Pakistani', wrongPrice: 'Rs. 2500', price: 'Rs. 1999', badge: '20% OFF' },
  { icon: '🎇', name: '50 Shooter Pack', category: 'Chinese', wrongPrice: 'Rs. 1500', price: 'Rs. 1199', badge: '20% OFF' },
  { icon: '🎂', name: 'Birthday Balloon Set', category: 'Birthday', wrongPrice: 'Rs. 800', price: 'Rs. 599', badge: '25% OFF' },
  { icon: '💥', name: 'Anaar Super', category: 'Pakistani', wrongPrice: 'Rs. 600', price: 'Rs. 449', badge: '25% OFF' },
  { icon: '🌈', name: 'Color Smoke Pack', category: 'Birthday', wrongPrice: 'Rs. 1200', price: 'Rs. 899', badge: '25% OFF' },
  { icon: '✨', name: 'Sparkle Sticks x20', category: 'Chinese', wrongPrice: 'Rs. 500', price: 'Rs. 349', badge: '30% OFF' },
  { icon: '🎉', name: 'Party Popper x10', category: 'Birthday', wrongPrice: 'Rs. 400', price: 'Rs. 299', badge: '25% OFF' },
  { icon: '🔥', name: '25 Shooter Aerial', category: 'Pakistani', wrongPrice: 'Rs. 1000', price: 'Rs. 749', badge: '25% OFF' },
];

function renderProductsPreview() {
  const grid = document.getElementById('products-preview');
  if (!grid) return;

  // Load admin products too
  const adminProducts = JSON.parse(localStorage.getItem('di_admin_products') || '[]');
  const combined = [...previewProducts, ...adminProducts.slice(0, 4)].slice(0, 8);

  grid.innerHTML = combined.map(p => `
    <div class="prod-card" onclick="window.location.href='products.html'">
      <span class="prod-icon">${p.icon || '🎆'}</span>
      <h4>${escapeHtml(p.name)}</h4>
      <div class="prod-category">${escapeHtml(p.category || '')}</div>
      <div class="prod-prices">
        <span class="prod-wrong-price">${escapeHtml(p.wrongPrice || '')}</span>
        <span class="prod-price">${escapeHtml(p.price)}</span>
      </div>
      ${p.badge ? `<div class="prod-badge">${escapeHtml(p.badge)}</div>` : ''}
    </div>
  `).join('');
}


// ===== CONTACT FORM =====
function submitOrder() {
  const name = document.getElementById('c-name').value.trim();
  const mobile = document.getElementById('c-mobile').value.trim();
  const product = document.getElementById('c-product').value.trim();
  const qty = document.getElementById('c-qty').value.trim();
  const city = document.getElementById('c-city').value.trim();
  const address = document.getElementById('c-address').value.trim();
  const msg = document.getElementById('form-msg');

  if (!name || !mobile || !product || !qty || !city || !address) {
    msg.className = 'form-msg error';
    msg.textContent = '⚠ Please fill all required fields marked with *.';
    return;
  }
  msg.className = 'form-msg success';
  msg.textContent = '✔ Your order has been received! We will contact you shortly on WhatsApp.';
}


// ===== YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();


// ===== INIT =====
renderReviews();
renderProductsPreview();
updateStars();
