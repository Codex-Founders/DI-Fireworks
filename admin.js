/* Admin Panel JS */

const ADMIN_USER = 'difireworks';
const ADMIN_PASS = 'admin@DI2024!';

function adminLogin() {
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value;
  const err = document.getElementById('login-error');

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem('di_admin_auth', '1');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    renderAdminProducts();
    renderAdminReviews();
  } else {
    err.textContent = '✖ Invalid username or password.';
    setTimeout(() => err.textContent = '', 3000);
  }
}

function adminLogout() {
  sessionStorage.removeItem('di_admin_auth');
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('admin-user').value = '';
  document.getElementById('admin-pass').value = '';
}

// Check if already logged in
if (sessionStorage.getItem('di_admin_auth') === '1') {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'block';
}

// Allow login on Enter key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.getElementById('login-screen').style.display !== 'none') {
    adminLogin();
  }
});

// ===== TABS =====
function showTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).style.display = 'block';
  const idx = ['products','reviews','add'].indexOf(tab);
  document.querySelectorAll('.admin-nav-btn')[idx].classList.add('active');

  if (tab === 'products') renderAdminProducts();
  if (tab === 'reviews') renderAdminReviews();
}

// ===== CALC FINAL PRICE =====
function calcFinalPrice() {
  const wrongStr = document.getElementById('ap-wrong-price').value;
  const discPct = parseFloat(document.getElementById('ap-discount-pct').value) || 0;
  const match = wrongStr.match(/[\d,]+/);
  if (match) {
    const num = parseFloat(match[0].replace(/,/g, ''));
    const final = Math.round(num * (1 - discPct / 100));
    document.getElementById('ap-final-price').value = 'Rs. ' + final.toLocaleString();
  } else {
    document.getElementById('ap-final-price').value = '';
  }
}

// Also recalc when wrong price changes
document.getElementById('ap-wrong-price').addEventListener('input', calcFinalPrice);

// ===== ADD PRODUCT =====
function addProduct() {
  const name = document.getElementById('ap-name').value.trim();
  const icon = document.getElementById('ap-icon').value.trim() || '🎆';
  const category = document.getElementById('ap-category').value;
  const subcat = document.getElementById('ap-subcat').value.trim() || 'All Items';
  const stock = parseInt(document.getElementById('ap-stock').value) || 0;
  const wrongPrice = document.getElementById('ap-wrong-price').value.trim();
  const discPct = parseFloat(document.getElementById('ap-discount-pct').value) || 0;
  const finalPrice = document.getElementById('ap-final-price').value.trim();
  const msg = document.getElementById('ap-msg');

  if (!name || !wrongPrice || !finalPrice) {
    msg.className = 'ap-msg error';
    msg.textContent = '⚠ Please fill all required fields.';
    setTimeout(() => msg.style.display = 'none', 3000);
    return;
  }

  const product = {
    id: Date.now().toString(),
    name, icon, category, subcat, stock,
    wrongPrice,
    price: finalPrice,
    discount: discPct > 0 ? discPct + '% OFF' : '',
    createdAt: new Date().toLocaleDateString(),
  };

  const products = JSON.parse(localStorage.getItem('di_admin_products') || '[]');
  products.push(product);
  localStorage.setItem('di_admin_products', JSON.stringify(products));

  msg.className = 'ap-msg success';
  msg.textContent = '✔ Product "' + name + '" added successfully!';
  setTimeout(() => msg.style.display = 'none', 4000);

  // Reset form
  ['ap-name','ap-icon','ap-subcat','ap-stock','ap-wrong-price','ap-discount-pct','ap-final-price'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('ap-category').value = 'Pakistani';

  renderAdminProducts();
}

// ===== RENDER ADMIN PRODUCTS =====
function renderAdminProducts() {
  const grid = document.getElementById('admin-products-grid');
  const products = JSON.parse(localStorage.getItem('di_admin_products') || '[]');
  document.getElementById('products-count').textContent = products.length + ' Products';

  if (products.length === 0) {
    grid.innerHTML = `<div class="no-items-msg"><i class="fas fa-box-open"></i>No products added yet. Go to "Add Product" to get started.</div>`;
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="admin-prod-card">
      <button class="delete-btn" onclick="deleteProduct('${p.id}')" title="Delete"><i class="fas fa-trash"></i></button>
      <div style="font-size:2rem;margin-bottom:8px;">${p.icon}</div>
      <h4>${escHtml(p.name)}</h4>
      <span class="cat-tag">${escHtml(p.category)}</span>
      <div class="admin-prod-info">
        <span><strong>Sub-cat:</strong> ${escHtml(p.subcat)}</span>
        <span><strong>Stock:</strong> ${p.stock} units ${p.stock === 0 ? '🔴' : p.stock < 10 ? '🟡' : '🟢'}</span>
        <span><strong>Original:</strong> <del>${escHtml(p.wrongPrice)}</del></span>
        <span class="price-final"><strong>Final Price:</strong> ${escHtml(p.price)}</span>
        ${p.discount ? `<span><strong>Discount:</strong> ${escHtml(p.discount)}</span>` : ''}
        <span><strong>Added:</strong> ${p.createdAt || 'N/A'}</span>
      </div>
    </div>
  `).join('');
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  let products = JSON.parse(localStorage.getItem('di_admin_products') || '[]');
  products = products.filter(p => p.id !== id);
  localStorage.setItem('di_admin_products', JSON.stringify(products));
  renderAdminProducts();
}

// ===== RENDER ADMIN REVIEWS =====
function renderAdminReviews() {
  const list = document.getElementById('admin-reviews-list');
  const reviews = JSON.parse(localStorage.getItem('di_reviews') || '[]');
  document.getElementById('reviews-count').textContent = reviews.length + ' Reviews';

  if (reviews.length === 0) {
    list.innerHTML = `<div class="no-items-msg"><i class="fas fa-star"></i>No reviews yet.</div>`;
    return;
  }

  list.innerHTML = reviews.map(r => `
    <div class="admin-review-item">
      <div class="rev-info">
        <h4>${escHtml(r.name)} <span style="color:var(--gray);font-size:0.8rem;">${r.location || 'Karachi'}</span></h4>
        <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
        <p>${escHtml(r.text)}</p>
      </div>
      <button class="delete-rev-btn" onclick="deleteReview('${r.id}')"><i class="fas fa-trash"></i> Delete</button>
    </div>
  `).join('');
}

function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  let reviews = JSON.parse(localStorage.getItem('di_reviews') || '[]');
  reviews = reviews.filter(r => r.id !== id);
  localStorage.setItem('di_reviews', JSON.stringify(reviews));
  renderAdminReviews();
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Init — show products tab by default when logged in
if (sessionStorage.getItem('di_admin_auth') === '1') {
  renderAdminProducts();
  renderAdminReviews();
}
