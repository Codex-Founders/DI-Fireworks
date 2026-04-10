/* Products Page JS */

const CATS = {
  pakistani: {
    label: 'Pakistani Products',
    subcats: ['All Items', 'Low Range Products', 'High Range Products', '100 Shooters', '50 Shooters', '25 Shooters', '16 Shooters', 'Sticks', 'Annar'],
    products: [
      { icon: '🎆', name: '100 Shooter Deluxe', subcat: '100 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 2500', price: 'Rs. 1999', discount: '20% OFF' },
      { icon: '🎆', name: '100 Shooter Premium', subcat: '100 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 3000', price: 'Rs. 2399', discount: '20% OFF' },
      { icon: '🎇', name: '50 Shooter Pack', subcat: '50 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 1500', price: 'Rs. 1199', discount: '20% OFF' },
      { icon: '🎇', name: '50 Shooter Gold', subcat: '50 Shooters', stock: 'Low Stock', wrongPrice: 'Rs. 1800', price: 'Rs. 1399', discount: '22% OFF' },
      { icon: '✨', name: '25 Shooter Aerial', subcat: '25 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 1000', price: 'Rs. 749', discount: '25% OFF' },
      { icon: '✨', name: '25 Shooter Mini', subcat: '25 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 800', price: 'Rs. 599', discount: '25% OFF' },
      { icon: '🌟', name: '16 Shooter Box', subcat: '16 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 700', price: 'Rs. 499', discount: '29% OFF' },
      { icon: '🌟', name: '16 Shooter Neon', subcat: '16 Shooters', stock: 'Low Stock', wrongPrice: 'Rs. 800', price: 'Rs. 599', discount: '25% OFF' },
      { icon: '🪄', name: 'Sparkle Sticks x10', subcat: 'Sticks', stock: 'In Stock', wrongPrice: 'Rs. 300', price: 'Rs. 199', discount: '34% OFF' },
      { icon: '🪄', name: 'Fire Sticks x20', subcat: 'Sticks', stock: 'In Stock', wrongPrice: 'Rs. 500', price: 'Rs. 349', discount: '30% OFF' },
      { icon: '💥', name: 'Anaar Classic', subcat: 'Annar', stock: 'In Stock', wrongPrice: 'Rs. 600', price: 'Rs. 449', discount: '25% OFF' },
      { icon: '💥', name: 'Anaar Deluxe', subcat: 'Annar', stock: 'In Stock', wrongPrice: 'Rs. 800', price: 'Rs. 599', discount: '25% OFF' },
      { icon: '🎆', name: 'Economy Pack', subcat: 'Low Range Products', stock: 'In Stock', wrongPrice: 'Rs. 500', price: 'Rs. 349', discount: '30% OFF' },
      { icon: '🎇', name: 'Budget Combo', subcat: 'Low Range Products', stock: 'In Stock', wrongPrice: 'Rs. 400', price: 'Rs. 279', discount: '30% OFF' },
      { icon: '🔥', name: 'Premium Mega Box', subcat: 'High Range Products', stock: 'In Stock', wrongPrice: 'Rs. 8000', price: 'Rs. 5999', discount: '25% OFF' },
      { icon: '🔥', name: 'VIP Grand Show', subcat: 'High Range Products', stock: 'Low Stock', wrongPrice: 'Rs. 12000', price: 'Rs. 8999', discount: '25% OFF' },
    ]
  },
  china: {
    label: 'China Products',
    subcats: ['All Items', 'Low Range Products', 'High Range Products', '100 Shooters', '50 Shooters', '25 Shooters', '16 Shooters', 'Sticks', 'Annar'],
    products: [
      { icon: '🎆', name: 'China 100 Shooter Pro', subcat: '100 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 3500', price: 'Rs. 2699', discount: '23% OFF' },
      { icon: '🎆', name: 'Dragon 100 Shooter', subcat: '100 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 4000', price: 'Rs. 2999', discount: '25% OFF' },
      { icon: '🎇', name: 'Phoenix 50 Shooter', subcat: '50 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 2000', price: 'Rs. 1499', discount: '25% OFF' },
      { icon: '🎇', name: 'China 50 Pack Gold', subcat: '50 Shooters', stock: 'Low Stock', wrongPrice: 'Rs. 2500', price: 'Rs. 1899', discount: '24% OFF' },
      { icon: '✨', name: 'Mini Dragon 25', subcat: '25 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 1200', price: 'Rs. 899', discount: '25% OFF' },
      { icon: '🌟', name: 'Galaxy 16 Shooter', subcat: '16 Shooters', stock: 'In Stock', wrongPrice: 'Rs. 900', price: 'Rs. 649', discount: '28% OFF' },
      { icon: '🪄', name: 'China Sparkle Stix', subcat: 'Sticks', stock: 'In Stock', wrongPrice: 'Rs. 400', price: 'Rs. 279', discount: '30% OFF' },
      { icon: '💥', name: 'Dragon Anaar', subcat: 'Annar', stock: 'In Stock', wrongPrice: 'Rs. 700', price: 'Rs. 499', discount: '29% OFF' },
      { icon: '🎆', name: 'Starter China Pack', subcat: 'Low Range Products', stock: 'In Stock', wrongPrice: 'Rs. 600', price: 'Rs. 399', discount: '34% OFF' },
      { icon: '🔥', name: 'China VIP Mega Box', subcat: 'High Range Products', stock: 'Low Stock', wrongPrice: 'Rs. 15000', price: 'Rs. 10999', discount: '27% OFF' },
    ]
  },
  birthday: {
    label: 'Birthday Items',
    subcats: ['All Items', 'Balloons', 'Foil Balloons', 'Party Popper', 'Color Smoke'],
    products: [
      { icon: '🎈', name: 'Birthday Balloon Set x20', subcat: 'Balloons', stock: 'In Stock', wrongPrice: 'Rs. 500', price: 'Rs. 349', discount: '30% OFF' },
      { icon: '🎈', name: 'Pastel Balloons x30', subcat: 'Balloons', stock: 'In Stock', wrongPrice: 'Rs. 700', price: 'Rs. 499', discount: '29% OFF' },
      { icon: '🎈', name: 'Metallic Balloons x20', subcat: 'Balloons', stock: 'In Stock', wrongPrice: 'Rs. 600', price: 'Rs. 399', discount: '34% OFF' },
      { icon: '🎀', name: 'Foil Star Balloon', subcat: 'Foil Balloons', stock: 'In Stock', wrongPrice: 'Rs. 300', price: 'Rs. 199', discount: '34% OFF' },
      { icon: '🎀', name: 'Number Foil Balloon', subcat: 'Foil Balloons', stock: 'In Stock', wrongPrice: 'Rs. 400', price: 'Rs. 279', discount: '30% OFF' },
      { icon: '🎀', name: 'Heart Foil Balloon', subcat: 'Foil Balloons', stock: 'In Stock', wrongPrice: 'Rs. 350', price: 'Rs. 249', discount: '29% OFF' },
      { icon: '🎉', name: 'Party Popper x5', subcat: 'Party Popper', stock: 'In Stock', wrongPrice: 'Rs. 300', price: 'Rs. 199', discount: '34% OFF' },
      { icon: '🎉', name: 'Party Popper x10', subcat: 'Party Popper', stock: 'In Stock', wrongPrice: 'Rs. 500', price: 'Rs. 349', discount: '30% OFF' },
      { icon: '🎉', name: 'Giant Party Popper', subcat: 'Party Popper', stock: 'Low Stock', wrongPrice: 'Rs. 800', price: 'Rs. 549', discount: '31% OFF' },
      { icon: '🌈', name: 'Color Smoke Red', subcat: 'Color Smoke', stock: 'In Stock', wrongPrice: 'Rs. 600', price: 'Rs. 399', discount: '34% OFF' },
      { icon: '🌈', name: 'Color Smoke Blue', subcat: 'Color Smoke', stock: 'In Stock', wrongPrice: 'Rs. 600', price: 'Rs. 399', discount: '34% OFF' },
      { icon: '🌈', name: 'Color Smoke Pack x5', subcat: 'Color Smoke', stock: 'In Stock', wrongPrice: 'Rs. 2500', price: 'Rs. 1799', discount: '28% OFF' },
    ]
  }
};

let currentCat = 'pakistani';
let currentSubcat = 'All Items';

function getCombinedProducts(cat) {
  const base = CATS[cat].products;
  const admin = JSON.parse(localStorage.getItem('di_admin_products') || '[]');
  const catMap = { pakistani: 'Pakistani', china: 'Chinese', birthday: 'Birthday' };
  const adminForCat = admin.filter(p => {
    const c = (p.category || '').toLowerCase();
    return c.includes(cat) || c.includes(catMap[cat].toLowerCase());
  }).map(p => ({
    icon: p.icon || '🎆',
    name: p.name,
    subcat: p.subcat || 'All Items',
    stock: p.stock > 0 ? 'In Stock' : 'Out of Stock',
    wrongPrice: p.wrongPrice,
    price: p.price,
    discount: p.discount || ''
  }));
  return [...base, ...adminForCat];
}

function switchCat(cat) {
  currentCat = cat;
  currentSubcat = 'All Items';
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
  renderSubcats();
  renderProducts();
}

function renderSubcats() {
  const pills = document.getElementById('subcat-pills');
  const subcats = CATS[currentCat].subcats;
  pills.innerHTML = subcats.map(s => `
    <button class="subcat-pill ${s === currentSubcat ? 'active' : ''}" onclick="switchSubcat('${s}')">${s}</button>
  `).join('');
}

function switchSubcat(subcat) {
  currentSubcat = subcat;
  document.querySelectorAll('.subcat-pill').forEach(p => p.classList.toggle('active', p.textContent === subcat));
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('products-main-grid');
  let products = getCombinedProducts(currentCat);

  if (currentSubcat !== 'All Items') {
    products = products.filter(p => p.subcat === currentSubcat);
  }

  if (products.length === 0) {
    grid.innerHTML = `<div class="no-products"><i class="fas fa-box-open"></i>No products in this category yet.</div>`;
    return;
  }

  grid.innerHTML = products.map((p, i) => {
    const stockClass = p.stock === 'In Stock' ? 'in' : p.stock === 'Low Stock' ? 'low' : 'out';
    return `
    <div class="prod-item">
      ${p.discount ? `<div class="prod-item-discount">${p.discount}</div>` : ''}
      <span class="prod-item-icon">${p.icon || '🎆'}</span>
      <h4>${p.name}</h4>
      <span class="prod-item-sub">${p.subcat}</span>
      <div class="prod-item-stock ${stockClass}"><i class="fas fa-circle" style="font-size:0.5rem;margin-right:4px;"></i>${p.stock}</div>
      <div class="prod-item-prices">
        ${p.wrongPrice ? `<span class="prod-item-wrong">${p.wrongPrice}</span>` : ''}
        <span class="prod-item-price">${p.price}</span>
      </div>
      <button class="prod-item-btn" onclick="orderProduct('${p.name}')"><i class="fas fa-shopping-cart"></i> Order Now</button>
    </div>
  `}).join('');
}

function orderProduct(name) {
  window.location.href = `index.html#contact`;
  setTimeout(() => {
    const el = document.getElementById('c-product');
    if (el) el.value = name;
  }, 800);
}

// Hamburger
document.getElementById('hamburger').addEventListener('click', function() {
  this.classList.toggle('active');
  document.getElementById('nav-links').classList.toggle('open');
});

document.getElementById('year2').textContent = new Date().getFullYear();

// Init
renderSubcats();
renderProducts();
