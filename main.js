// main.js - Hiển thị sản phẩm theo danh mục từ file products.json (dạng mảng)
// Ẩn phần giá, chỉ hiển thị ảnh + tên + nút chi tiết

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("categoriesContainer");
  const searchInput = document.getElementById("searchInput");

  // Hàm nhóm sản phẩm theo danh mục
  function groupByCategory(data) {
    const categories = {};
    data.forEach(item => {
      const cat = item.category?.trim().toLowerCase() || "khac";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    });
    return categories;
  }

  // Hàm hiển thị sản phẩm
  function renderProducts(categories) {
    container.innerHTML = "";

    Object.keys(categories).forEach(cat => {
      const section = document.createElement("section");
      section.className = "category-section";
      section.id = cat;

      const title = document.createElement("h2");
      title.textContent = cat.toUpperCase();
      section.appendChild(title);

      const wrap = document.createElement("div");
      wrap.className = "products";

      categories[cat].slice(0, 8).forEach(p => {
        const div = document.createElement("div");
        div.className = "product";

        const img = document.createElement("img");
        img.src = p.img || p.image || "https://via.placeholder.com/120";
        img.alt = p.name;

        const name = document.createElement("h3");
        name.textContent = p.name;

        const btn = document.createElement("a");
        btn.textContent = "Chi tiết";
        btn.href = p.link || "#";
        btn.target = "_blank";
        btn.rel = "noopener";

        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(btn);

        wrap.appendChild(div);
      });

      section.appendChild(wrap);

      const more = document.createElement("a");
      more.className = "more-btn";
      more.href = `${cat}.html`;
      more.textContent = "Xem thêm";
      section.appendChild(more);

      container.appendChild(section);
    });
  }

  // Tải dữ liệu từ products.json
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) throw new Error("Dữ liệu không hợp lệ!");
      const grouped = groupByCategory(data);
      renderProducts(grouped);

      // Tìm kiếm realtime
      if (searchInput) {
        searchInput.addEventListener("input", function() {
          const term = this.value.toLowerCase();
          document.querySelectorAll(".product").forEach(prod => {
            const name = prod.querySelector("h3")?.innerText.toLowerCase() || "";
            prod.style.display = name.includes(term) ? "flex" : "none";
          });
        });
      }
    })
    .catch(err => {
      console.error("Lỗi khi tải dữ liệu:", err);
      container.innerHTML = "<p style='text-align:center;color:red'>Không thể tải dữ liệu sản phẩm.</p>";
    });
});
