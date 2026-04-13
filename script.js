/* ===========================
   DI.Fireworks — script.js
   =========================== */

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
    const btnM = document.getElementById('sound-toggle-m');
    if (iconM) iconM.className = soundOn ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
    if (labelM) labelM.textContent = soundOn ? 'Sound On' : 'Sound';
    if (btnM) { btnM.classList.toggle('sound-on', soundOn); }
  });
})();

// ===== INTRO CANVAS =====
(function () {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [], rockets = [], animId, running = true;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#e60000','#ff3333','#ffd700','#ff6600','#ff99cc','#ffffff','#00ccff','#ff4400'];
  function rand(a, b) { return Math.random() * (b - a) + a; }

  function createRocket() {
    return { x: rand(canvas.width*0.1, canvas.width*0.9), y: canvas.height, tx: rand(canvas.width*0.1, canvas.width*0.9), ty: rand(canvas.height*0.1, canvas.height*0.5), speed: rand(4,8), color: COLORS[Math.floor(Math.random()*COLORS.length)], trail: [], done: false };
  }

  function explode(x, y) {
    const count = Math.floor(rand(80, 130));
    for (let i = 0; i < count; i++) {
      const angle = (i/count)*Math.PI*2, speed = rand(1,6);
      particles.push({ x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, alpha: 1, color: COLORS[Math.floor(Math.random()*COLORS.length)], size: rand(2,4), decay: rand(0.012,0.022), gravity: 0.05 });
    }
  }

  let rt = 0;
  function update() {
    if (!running) return;
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (++rt % 55 === 0) rockets.push(createRocket());
    rockets = rockets.filter(r => !r.done);
    rockets.forEach(r => {
      const dx = r.tx-r.x, dy = r.ty-r.y, d = Math.sqrt(dx*dx+dy*dy);
      r.trail.push({x:r.x,y:r.y}); if (r.trail.length>10) r.trail.shift();
      if (d < r.speed+2) { explode(r.x,r.y); r.done=true; return; }
      r.x += (dx/d)*r.speed; r.y += (dy/d)*r.speed;
      r.trail.forEach((t,i) => { ctx.beginPath(); ctx.arc(t.x,t.y,2*(i/r.trail.length),0,Math.PI*2); ctx.fillStyle=r.color+Math.floor(100*i/r.trail.length).toString(16).padStart(2,'0'); ctx.fill(); });
      ctx.beginPath(); ctx.arc(r.x,r.y,3,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    });
    particles = particles.filter(p => p.alpha > 0.02);
    particles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=0.98; p.vy*=0.98; p.alpha-=p.decay;
      ctx.globalAlpha=p.alpha; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fillStyle=p.color; ctx.fill(); ctx.globalAlpha=1;
    });
    animId = requestAnimationFrame(update);
  }
  update();

  setTimeout(() => {
    running = false; cancelAnimationFrame(animId);
    const ov = document.getElementById('intro-overlay');
    if (ov) { ov.style.opacity='0'; setTimeout(()=>ov.style.display='none',800); }
  }, 5500);
})();

// ===== STAR FIELD =====
(function () {
  const field = document.getElementById('star-field');
  if (!field) return;
  for (let i = 0; i < 75; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = Math.random()*2.4+0.5;
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;--dur:${(Math.random()*4+2).toFixed(1)}s;--delay:-${(Math.random()*6).toFixed(1)}s;--minop:${(Math.random()*0.2+0.05).toFixed(2)};`;
    field.appendChild(s);
  }
})();

// ===== HERO CANVAS =====
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let rockets=[], bursts=[], glitters=[], crackers=[];
  const PAL = ['#ff2200','#ff5500','#ff8800','#ffdd00','#ffd700','#ff3399','#ff66cc','#00ffcc','#33aaff','#ffffff','#ff4444','#ff9944'];
  function rand(a,b){return Math.random()*(b-a)+a;}
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function resize(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;}
  resize(); window.addEventListener('resize',resize);

  function spawnRocket(){
    const col=pick(PAL), sx=rand(canvas.width*.05,canvas.width*.95);
    rockets.push({x:sx,y:canvas.height*rand(.72,1),tx:sx+rand(-110,110),ty:rand(canvas.height*.06,canvas.height*.5),speed:rand(5,11),col,trail:[],done:false});
  }
  function spawnBurst(x,y){
    const c1=pick(PAL),c2=pick(PAL),cnt=Math.floor(rand(40,68));
    for(let i=0;i<cnt;i++){const a=rand(0,Math.PI*2),sp=rand(1.5,7); bursts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,col:Math.random()>.4?c1:c2,alpha:1,size:rand(1.5,3.5),decay:rand(.009,.02),gravity:rand(.03,.09),px:x,py:y});}
    for(let i=0;i<10;i++){const a=rand(0,Math.PI*2),sp=rand(.5,3.5); glitters.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,col:pick(PAL),alpha:1,size:rand(.8,2),decay:rand(.005,.013),gravity:rand(.04,.1),tw:rand(.05,.25)});}
  }
  function spawnCracker(){
    const x=rand(20,canvas.width-20),y=rand(canvas.height*.2,canvas.height-20),col=pick(PAL);
    for(let i=0;i<5;i++){const a=rand(0,Math.PI*2),sp=rand(.6,3.2); crackers.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,col,alpha:1,size:rand(1,2.4),decay:rand(.028,.065),gravity:rand(.02,.07)});}
  }
  function schedRocket(){spawnRocket();setTimeout(schedRocket,rand(900,1600));}
  function schedCracker(){spawnCracker();setTimeout(schedCracker,rand(5000,8500));}
  schedRocket(); schedCracker();

  function dc(x,y,r,col,alpha){ctx.globalAlpha=Math.max(0,alpha);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();ctx.globalAlpha=1;}
  function tick(){
    ctx.fillStyle='rgba(0,0,0,0.13)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    rockets=rockets.filter(r=>!r.done);
    rockets.forEach(r=>{
      const dx=r.tx-r.x,dy=r.ty-r.y,d=Math.sqrt(dx*dx+dy*dy);
      r.trail.push({x:r.x,y:r.y}); if(r.trail.length>14)r.trail.shift();
      if(d<r.speed+2){spawnBurst(r.x,r.y);r.done=true;return;}
      r.x+=(dx/d)*r.speed; r.y+=(dy/d)*r.speed;
      r.trail.forEach((t,i)=>{ctx.globalAlpha=(i/r.trail.length)*.65;ctx.beginPath();ctx.arc(t.x,t.y,2.4*(i/r.trail.length),0,Math.PI*2);ctx.fillStyle=r.col;ctx.fill();ctx.globalAlpha=1;});
      dc(r.x,r.y,3.2,'#fff',1);
    });
    bursts=bursts.filter(p=>p.alpha>.01);
    bursts.forEach(p=>{
      ctx.globalAlpha=p.alpha*.55;ctx.strokeStyle=p.col;ctx.lineWidth=p.size*.65;ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.globalAlpha=1;
      p.px=p.x;p.py=p.y;p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.975;p.vy*=.975;p.alpha-=p.decay;
      dc(p.x,p.y,p.size,p.col,p.alpha);
    });
    glitters=glitters.filter(p=>p.alpha>.01);
    glitters.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.98;p.vy*=.98;p.alpha-=p.decay;dc(p.x,p.y,p.size,p.col,p.alpha*(0.5+Math.abs(Math.sin(Date.now()*p.tw))*.5));});
    crackers=crackers.filter(p=>p.alpha>.01);
    crackers.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.97;p.alpha-=p.decay;dc(p.x,p.y,p.size,p.col,p.alpha);});
    requestAnimationFrame(tick);
  }
  tick();
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

  // Active link on scroll — update both desktop and mobile links
  const sections = document.querySelectorAll('section[id]');
  function setActive() {
    const sy = window.scrollY + 110;
    sections.forEach(sec => {
      if (sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight) {
        document.querySelectorAll('.nav-link, .mobile-link').forEach(a => a.classList.remove('active'));
        document.querySelectorAll(`.nav-link[href="#${sec.id}"], .mobile-link[href="#${sec.id}"]`).forEach(a => a.classList.add('active'));
      }
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
})();

// ===== Mobile sound/theme button sync helpers =====
function updateMobileSoundBtn() {
  // The click is delegated to desktop button, sync happens inside sound toggle listener
}
function updateMobileThemeBtn() {
  const html = document.documentElement;
  const iconM = document.getElementById('theme-icon-m');
  if (!iconM) return;
  const current = html.getAttribute('data-theme');
  iconM.className = current === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== REVIEWS =====
let selectedStars = 5;
let reviewsData = JSON.parse(localStorage.getItem('di_reviews') || 'null') || [
  { name:'Muhammad Ali',  location:'Gulshan-e-Iqbal', rating:5, text:'Best fireworks in Karachi! 100 shooters were amazing. Fast delivery and professional service. Highly recommended!' },
  { name:'Fatima Zahra',  location:'DHA Phase 6',     rating:5, text:'Ordered birthday items for my kids party. Balloons, color smoke — everything was perfect. Will order again!' },
  { name:'Usman Khan',    location:'North Nazimabad', rating:5, text:'Used DI.Fireworks for our wedding night. The aerial display was breathtaking. Government registered gives extra trust.' },
  { name:'Sara Malik',    location:'Clifton',         rating:4, text:'Good quality Chinese fireworks at reasonable prices. Delivery was quick. Packaging was safe and secure.' },
  { name:'Ahmed Raza',    location:'Nazimabad',       rating:5, text:'50 shooters se shukar kiya celebration! Bohot acha tha. Karachi mein best fireworks shop hai yeh.' },
  { name:'Zainab Hassan', location:'Lyari',           rating:5, text:'Birthday party ke liye party poppers aur color smoke mangwaye. Bohot fresh aur quality products the!' },
];

function esc(str){return String(str).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

function renderReviews() {
  const track = document.getElementById('reviews-track');
  if (!track) return;
  const doubled = [...reviewsData, ...reviewsData];
  track.innerHTML = doubled.map(r => `
    <div class="review-card">
      <div class="rev-quote">"</div>
      <div class="rev-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <p class="rev-text">${esc(r.text)}</p>
      <div class="rev-author">
        <div class="rev-avatar">${r.name.charAt(0).toUpperCase()}</div>
        <div><div class="rev-name">${esc(r.name)}</div><div class="rev-location">${esc(r.location||'Karachi')}</div></div>
      </div>
    </div>`).join('');
  track.style.animationDuration = Math.max(22, reviewsData.length * 5.5) + 's';
}

function openReviewModal() {
  document.getElementById('review-modal').style.display = 'flex';
  document.getElementById('rev-name').value = '';
  document.getElementById('rev-text').value = '';
  selectedStars = 5; updateStars();
}
function closeReviewModal() { document.getElementById('review-modal').style.display = 'none'; }

function updateStars() {
  document.querySelectorAll('#star-picker i').forEach((s,i) => {
    s.classList.toggle('active', i < selectedStars);
    s.style.color = i < selectedStars ? 'var(--gold)' : 'var(--gray)';
  });
}
document.querySelectorAll('#star-picker i').forEach((star, idx) => {
  star.addEventListener('click', () => { selectedStars = idx+1; updateStars(); });
  star.addEventListener('mouseover', () => { document.querySelectorAll('#star-picker i').forEach((s,i) => s.style.color = i<=idx?'var(--gold)':'var(--gray)'); });
  star.addEventListener('mouseout', updateStars);
});

function postReview() {
  const name = document.getElementById('rev-name').value.trim();
  const text = document.getElementById('rev-text').value.trim();
  if (!name || !text) { alert('Please fill in your name and review.'); return; }
  reviewsData.push({ name, location:'Karachi', rating:selectedStars, text });
  localStorage.setItem('di_reviews', JSON.stringify(reviewsData));
  renderReviews(); closeReviewModal();
}

// ===== MAP =====
function openMap()  { document.getElementById('map-modal').style.display = 'flex'; }
function closeMap() { document.getElementById('map-modal').style.display = 'none'; }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', function(e) { if (e.target === this) this.style.display = 'none'; });
});

// ===== PRODUCTS PREVIEW =====
const previewProducts = [
  { icon:'🎆', name:'100 Shooter Box',     category:'Pakistani', wrongPrice:'Rs. 2500', price:'Rs. 1999', badge:'20% OFF' },
  { icon:'🎇', name:'50 Shooter Pack',     category:'Chinese',   wrongPrice:'Rs. 1500', price:'Rs. 1199', badge:'20% OFF' },
  { icon:'🎂', name:'Birthday Balloon Set',category:'Birthday',  wrongPrice:'Rs. 800',  price:'Rs. 599',  badge:'25% OFF' },
  { icon:'💥', name:'Anaar Super',         category:'Pakistani', wrongPrice:'Rs. 600',  price:'Rs. 449',  badge:'25% OFF' },
  { icon:'🌈', name:'Color Smoke Pack',    category:'Birthday',  wrongPrice:'Rs. 1200', price:'Rs. 899',  badge:'25% OFF' },
  { icon:'✨', name:'Sparkle Sticks x20',  category:'Chinese',   wrongPrice:'Rs. 500',  price:'Rs. 349',  badge:'30% OFF' },
  { icon:'🎉', name:'Party Popper x10',    category:'Birthday',  wrongPrice:'Rs. 400',  price:'Rs. 299',  badge:'25% OFF' },
  { icon:'🔥', name:'25 Shooter Aerial',   category:'Pakistani', wrongPrice:'Rs. 1000', price:'Rs. 749',  badge:'25% OFF' },
];

function renderProductsPreview() {
  const grid = document.getElementById('products-preview');
  if (!grid) return;
  const admin = JSON.parse(localStorage.getItem('di_admin_products') || '[]');
  const list  = [...previewProducts, ...admin.slice(0,4)].slice(0,8);
  grid.innerHTML = list.map(p => `
    <div class="prod-card" onclick="window.location.href='products.html'">
      <span class="prod-icon">${p.icon||'🎆'}</span>
      <h4>${esc(p.name)}</h4>
      <div class="prod-category">${esc(p.category||'')}</div>
      <div class="prod-prices">
        <span class="prod-wrong-price">${esc(p.wrongPrice||'')}</span>
        <span class="prod-price">${esc(p.price)}</span>
      </div>
      ${p.badge?`<div class="prod-badge">${esc(p.badge)}</div>`:''}
    </div>`).join('');
}

// ===== CONTACT =====
function submitOrder() {
  const vals = ['c-name','c-mobile','c-product','c-qty','c-city','c-address'].map(id => document.getElementById(id).value.trim());
  const msg = document.getElementById('form-msg');
  if (vals.some(v => !v)) {
    msg.className = 'form-msg error';
    msg.textContent = '⚠ Please fill all required fields marked with *.';
    return;
  }
  msg.className = 'form-msg success';
  msg.textContent = '✔ Your order has been received! We will contact you shortly on WhatsApp.';
}

// ===== YEAR & INIT =====
document.getElementById('year').textContent = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', () => {
  renderReviews();
  renderProductsPreview();
  updateStars();
});