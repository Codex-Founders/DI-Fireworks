/* ===== NAVBAR LOGIC FOR PRODUCTS PAGE ===== */

// ===== ACTIVE PAGE DETECTION =====
(function () {
  // Get current page filename
  const path = window.location.pathname;
  const currentPage = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  
  console.log('Current page:', currentPage); // Debug
  
  // Remove active class from all nav links first
  document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Check if we're on products page
  const isProductsPage = currentPage === 'products.html' || 
                         currentPage === '' || 
                         path.includes('products');
  
  if (isProductsPage) {
    console.log('Products page detected - setting active'); // Debug
    
    // Desktop nav - find Products link
    const desktopLinks = document.querySelectorAll('.nav-link');
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.includes('products.html') || href === 'products.html')) {
        link.classList.add('active');
        console.log('Desktop Products link activated');
      }
    });
    
    // Mobile nav - find Products link
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.includes('products.html') || href === 'products.html')) {
        link.classList.add('active');
        console.log('Mobile Products link activated');
      }
    });
  }
})();

// ===== THEME TOGGLE =====
(function () {
  const btn  = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;
  if (!btn) return;
  
  const saved = localStorage.getItem('di_theme') || 'dark';
  html.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  
  // sync mobile icon on load
  const iconM = document.getElementById('theme-icon-m');
  if (iconM) iconM.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  
  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('di_theme', next);
  });
})();

// ===== SOUND TOGGLE =====
(function () {
  const btn  = document.getElementById('sound-toggle');
  const icon = document.getElementById('sound-icon');
  if (!btn) return;

  let audio = null;
  let soundOn = false;

  btn.classList.add('off');
  icon.className = 'fas fa-volume-xmark';

  function startSound() {
    if (!audio) {
      audio = new Audio('https://orangefreesounds.com/wp-content/uploads/2022/12/Fireworks-loud-explosions-sound-effect.mp3');
      audio.loop = true;
      audio.volume = 0.5;
    }
    audio.play().catch(() => {});
  }

  function stopSound() {
    if (audio) { audio.pause(); audio.currentTime = 0; }
  }

  btn.addEventListener('click', () => {
    soundOn = !soundOn;
    if (soundOn) {
      btn.classList.remove('off'); btn.classList.add('on');
      icon.className = 'fas fa-volume-high';
      startSound();
    } else {
      btn.classList.remove('on'); btn.classList.add('off');
      icon.className = 'fas fa-volume-xmark';
      stopSound();
    }
    
    // sync mobile sound button
    const iconM = document.getElementById('sound-icon-m');
    const labelM = document.getElementById('sound-label-m');
    if (iconM) iconM.className = soundOn ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
    if (labelM) labelM.textContent = soundOn ? 'Sound On' : 'Sound';
  });
})();

// ===== NAVBAR — Hamburger + Mobile Menu =====
(function () {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close when any mobile link clicked
  mobileMenu.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', closeMobileMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Expose for map button
  window.closeMobileMenu = closeMobileMenu;
})();

// ===== MAP =====
function openMap()  { 
  const modal = document.getElementById('map-modal');
  if (modal) modal.style.display = 'flex'; 
}
function closeMap() { 
  const modal = document.getElementById('map-modal');
  if (modal) modal.style.display = 'none'; 
}

// Close modal on outside click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('map-modal');
  if (e.target === modal) closeMap();
});

// ===== YEAR =====
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year2');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});