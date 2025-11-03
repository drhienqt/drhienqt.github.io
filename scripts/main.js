// scripts/main.js - Xử lý logic cho cả index.html (featured) và sanpham.html (all products)

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Xác định trang hiện tại
    const path = window.location.pathname;
    const isIndexPage = path.endsWith('/index.html') || path === '/';
    const isSanPhamPage = path.endsWith('/sanpham.html');

    let productsData = [];

    // Tải dữ liệu sản phẩm một lần
    try {
        const response = await fetch("products.json"); // Đảm bảo products.json nằm cùng cấp với index.html
        if (!response.ok) throw new Error("Không thể tải dữ liệu sản phẩm.");
        productsData = await response.json();
    } catch (error) {
        console.error("Lỗi tải products.json:", error);
        // Hiển thị thông báo lỗi trên trang nếu có container sản phẩm
        const indexContainer = document.querySelector("#featured-products");
        const sanphamContainer = document.querySelector("#all-products-list");
        
        const errorMessage = "<p style='color:red; text-align:center; padding: 50px 0;'>Lỗi: Không thể tải danh sách sản phẩm. Kiểm tra file products.json.</p>";
        
        if (indexContainer) indexContainer.innerHTML = errorMessage;
        if (sanphamContainer) sanphamContainer.innerHTML = errorMessage;
        
        return; 
    }

    // --- Hàm tạo HTML cho danh sách sản phẩm ---
    const createProductGrid = (products, title) => {
        return `
            <h2>${title}</h2>
            <div class="product-grid">
                ${products.map(p => `
                    <div class="product">
                        <div class="product-image-wrapper">
                            <img src="${p.image}" alt="${p.name}">
                        </div>
                        <h3>${p.name}</h3>
                        <a href="${p.link}" target="_blank" class="btn">Chi tiết</a>
                    </div>
                `).join("")}
            </div>
        `;
    };

    // --- Xử lý Trang INDEX.HTML (Sản phẩm tiêu biểu) ---
    if (isIndexPage) {
        const indexProductsContainer = document.querySelector("#featured-products");
        if (indexProductsContainer) {
            // Lấy 8 sản phẩm tiêu biểu
            const featured = productsData.slice(0, 8);
            indexProductsContainer.innerHTML = createProductGrid(featured, "Sản phẩm tiêu biểu");
        }
    }

    // --- Xử lý Trang SANPHAM.HTML (Tất cả sản phẩm) ---
    else if (isSanPhamPage) {
        const sanPhamContainer = document.querySelector("#all-products-list");
        if (sanPhamContainer) {
            // Hiển thị tất cả sản phẩm
            sanPhamContainer.innerHTML = createProductGrid(productsData, "Tất cả Sản phẩm");
        }
    }
});
