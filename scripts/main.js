// Khi trang đã load hoàn toàn
document.addEventListener("DOMContentLoaded", async () => {
  const productsContainer = document.querySelector(".products");

  // Nếu không có khu vực sản phẩm thì bỏ qua
  if (!productsContainer) return;

  try {
    // Đọc dữ liệu từ file products.json
    const response = await fetch("products.json");
    if (!response.ok) throw new Error("Không thể tải dữ liệu sản phẩm");

    const products = await response.json();

    // Giới hạn 10 sản phẩm tiêu biểu (hoặc ít hơn nếu không đủ)
    const featured = products.slice(0, 8);

    // Tạo giao diện hiển thị sản phẩm (chỉ tạo nội dung, không lồng container .products)
    const html = `
      <h2>Sản phẩm tiêu biểu</h2>
      ${featured
        .map(
          (p) => `
          <div class="product">
            <div class="product-image-wrapper"> 
              <img src="${p.image}" alt="${p.name}">
            </div>
            <h3>${p.name}</h3>
            <a href="${p.link}" target="_blank" class="btn">Chi tiết</a>
          </div>
          `
        )
        .join("")}
    `;

    // Đưa nội dung lên trang
    productsContainer.innerHTML = html;
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
    productsContainer.innerHTML =
      "<p style='color:red; text-align:center;'>Không thể tải danh sách sản phẩm tiêu biểu. Vui lòng kiểm tra lại file products.json.</p>";
  }
});
