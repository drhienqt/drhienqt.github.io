const PRODUCTS_JSON = 'products.json';
const featuredKey = 'hanstore_featured';

let allProducts = [];
let featuredIds = JSON.parse(localStorage.getItem(featuredKey) || '[]');

async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_JSON, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error('Network response was not ok');
    allProducts = await res.json();
  } catch (e) {
    console.error('Không thể load products.json, sử dụng dữ liệu mẫu', e);
    allProducts = [];
  }
}

function renderFeatured() {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  const featured = allProducts.filter(p => featuredIds.includes(p.id));
  if (featured.length === 0) {
    container.innerHTML = '<p style="width:100%; text-align:center; color:#023e8a; font-weight:600;">Chưa có sản phẩm nổi bật. Nhấn "+ Thêm sản phẩm nổi bật" để chọn.</p>';
    return;
  }
  featured.forEach(p => {
    const el = document.createElement('div');
    el.className = 'product';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price}</p>
      <a href="${p.link}" target="_blank" rel="noopener noreferrer">Tìm hiểu thêm</a>
      <div style="margin-top:8px;"><button class="remove-btn" data-id="${p.id}">Xoá</button></div>
    `;
    container.appendChild(el);
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      featuredIds = featuredIds.filter(x => x !== id);
      localStorage.setItem(featuredKey, JSON.stringify(featuredIds));
      renderFeatured();
    });
  });
}

function openPicker() {
  document.getElementById('picker-modal').style.display = 'flex';
  renderPicker(allProducts);
  document.getElementById('search-input').focus();
}

function closePicker() {
  document.getElementById('picker-modal').style.display = 'none';
}

function renderPicker(list) {
  const picker = document.getElementById('picker-list');
  picker.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'picker-card';
    const already = featuredIds.includes(p.id);
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="info">
        <h4>${p.name}</h4>
        <p>${p.price}</p>
      </div>
      <div class="action">
        <button class="select-btn" data-id="${p.id}" ${already ? 'disabled' : ''}>${already ? 'Đã thêm' : 'Chọn sản phẩm này'}</button>
      </div>
    `;
    picker.appendChild(card);
  });

  picker.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      if (!featuredIds.includes(id)) featuredIds.push(id);
      localStorage.setItem(featuredKey, JSON.stringify(featuredIds));
      renderFeatured();
      renderPicker(allProducts);
    });
  });
}

document.getElementById('open-picker').addEventListener('click', openPicker);
document.getElementById('close-picker').addEventListener('click', closePicker);
document.getElementById('search-input').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q));
  renderPicker(filtered);
});

(async function(){
  await loadProducts();
  renderFeatured();
})();