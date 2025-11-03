// main.js - Tương thích với file products.json hiện tại (object dạng danh mục)
// và ẩn phần giá trong khung sản phẩm.

/*
  Hỗ trợ 2 kiểu products.json:
  1) Mảng [{category:'giadung', name:'...', price:'...', img:'...', link:'...'}, ...]
  2) Object { "Đồ gia dụng": [ {name:'', price:'', image:'', link:''}, ... ], ... }
*/

function normalizeCategoryId(name) {
  if (!name) return "khac";
  const map = {
    "đồ gia dụng":"giadung",
    "đồ gia dung":"giadung",
    "phụ kiện thông minh":"phukien",
    "thoi trang":"thoitrang",
    "mẹ và bé":"mevabe",
    "me va be":"mevabe",
    "làm đẹp":"lamdep",
    "lam dep":"lamdep",
    "sản phẩm ai":"ai",
    "san pham ai":"ai",
    "sách":"sach",
    "sach":"sach",
    "khác":"khac"
  };
  const key = name.toString().toLowerCase().trim();
  return map[key] || key.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,'').replace(/[^a-z0-9_-]/g,'');
}

function safeText(v) {
  return (v === null || v === undefined) ? "" : String(v);
}

function normalizeProductsData(raw) {
  let out = [];
  if (Array.isArray(raw)) {
    raw.forEach(p => {
      if (!p) return;
      const name = safeText(p.name);
      const img = safeText(p.img || p.image);
      const link = safeText(p.link);
      const category = safeText(p.category);
      if (!name && !img) return;
      out.push({
        category: category || normalizeCategoryId(category),
        categoryName: category || "",
        name, img, link
      });
    });
  } else if (typeof raw === 'object' && raw !== null) {
    Object.keys(raw).forEach(catName => {
      const items = raw[catName];
      if (!Array.isArray(items)) return;
      const catId = normalizeCategoryId(catName);
      items.forEach(p => {
        const name = safeText(p.name);
        const img = safeText(p.img || p.image);
        const link = safeText(p.link);
        if (!name && !img && !link) return;
        out.push({
          category: catId,
          categoryName: catName,
          name, img, link
        });
      });
    });
  }
  return out;
}

function renderCategoriesAndProducts(products) {
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = "";

  const catMap = new Map();
  products.forEach(p => {
    const cid = p.category || normalizeCategoryId(p.categoryName || "");
    const cname = p.categoryName || p.category || cid;
    if (!catMap.has(cid)) catMap.set(cid, { id: cid, name: cname, products: [] });
    catMap.get(cid).products.push(p);
  });

  for (const [cid, catObj] of catMap.entries()) {
    const section = document.createElement('section');
    section.className = 'category-section';
    section.id = cid;

    const title = document.createElement('h2');
    title.textContent = catObj.name;
    section.appendChild(title);

    const productsWrap = document.createElement('div');
    productsWrap.className = 'products';

    const toShow = catObj.products.slice(0, 8);
    toShow.forEach(p => {
      const prod = document.createElement('div');
      prod.className = 'product';

      const img = document.createElement('img');
      img.src = p.img || 'https://via.placeholder.com/120';
      img.alt = p.name;

      const h3 = document.createElement('h3');
      h3.textContent = p.name;

      const a = document.createElement('a');
      a.href = p.link || '#';
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Chi tiết';

      prod.appendChild(img);
      prod.appendChild(h3);
      prod.appendChild(a);

      productsWrap.appendChild(prod);
    });

    section.appendChild(productsWrap);

    const more = document.createElement('a');
    more.className = 'more-btn';
    more.href = cid + '.html';
    more.textContent = 'Xem thêm';
    section.appendChild(more);

    container.appendChild(section);
  }

  // Tìm kiếm realtime
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const term = this.value.trim().toLowerCase();
      const allProducts = document.querySelectorAll('.product');
      allProducts.forEach(prod => {
        const name = (prod.querySelector('h3')?.innerText || "").toLowerCase();
        prod.style.display = name.includes(term) ? 'flex' : 'none';
      });
    });
  }
}

// Load dữ liệu từ products.json
fetch('products.json')
  .then(res => res.json())
  .then(raw => {
    const products = normalizeProductsData(raw);
    if (!products.length) {
      document.getElementById('categoriesContainer').innerHTML = "<p style='text-align:center;color:#999'>Không có sản phẩm để hiển thị.</p>";
      return;
    }
    renderCategoriesAndProducts(products);
  })
  .catch(err => {
    console.error("Lỗi khi tải dữ liệu:", err);
    document.getElementById('categoriesContainer').innerHTML = "<p style='text-align:center;color:red'>Lỗi khi tải dữ liệu sản phẩm!</p>";
  });
