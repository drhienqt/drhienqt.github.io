// scripts/main.js - Logic xử lý đa trang, có lọc sản phẩm rỗng

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Xác định trang hiện tại
    const path = window.location.pathname;
    const isIndexPage = path.endsWith('/index.html') || path === '/';
    const isSanPhamPage = path.endsWith('/sanpham.html');

    let productsData = [];

    // Tải dữ liệu sản phẩm
    try {
        const response = await fetch("products.json"); 
        if (!response.ok) throw new Error("Không thể tải dữ liệu sản phẩm. Mã lỗi: " + response.status);
        productsData = await response.json();
    } catch (error) {
        console.error("Lỗi tải products.json:", error);
        
        // Hiển thị thông báo lỗi nếu tải file thất bại
        const errorMessage = "<p style='color:red; text-align:center; padding: 50px 0;'>⚠️ Lỗi: Không thể tải danh sách sản phẩm. Vui lòng kiểm tra đường dẫn hoặc cú pháp file products.json.</p>";
        
        const indexContainer = document.querySelector("#featured-products");
        const sanphamContainer = document.querySelector("#all-products-sections"); 
        
        if (indexContainer) indexContainer.innerHTML = errorMessage;
        if (sanphamContainer) sanphamContainer.innerHTML = errorMessage;
        
        return; 
    }

    // --- Lọc sản phẩm: Chỉ giữ lại những sản phẩm có Tên và Ảnh ---
    const validProducts = productsData.filter(p => p.name && p.image && p.name.trim() !== "" && p.image.trim() !== "");


    // --- Hàm tạo HTML cho lưới sản phẩm ---
    const createProductGrid = (products) => {
        if (products.length === 0) {
            return "<p style='text-align:center; padding: 20px 0;'>Không tìm thấy sản phẩm nào trong danh mục này.</p>";
        }
        return `
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

    // --- Xử lý Trang INDEX.HTML (8 Sản phẩm tiêu biểu) ---
    if (isIndexPage) {
        const indexProductsContainer = document.querySelector("#featured-products");
        if (indexProductsContainer) {
            // Lấy 8 sản phẩm hợp lệ đầu tiên
            const featured = validProducts.slice(0, 8);
            indexProductsContainer.innerHTML = `
                <h2 style="text-align:center;">Sản phẩm tiêu biểu</h2>
                ${createProductGrid(featured)}
            `;
        }
    }

    // --- Xử lý Trang SANPHAM.HTML (Sản phẩm theo Danh mục) ---
    else if (isSanPhamPage) {
        const sanPhamContainer = document.querySelector("#all-products-sections");
        if (sanPhamContainer) {
            
            // 2. Nhóm sản phẩm hợp lệ theo category
            const groupedProducts = validProducts.reduce((acc, product) => {
                const category = product.category || "Chưa phân loại"; 
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(product);
                return acc;
            }, {});

            let fullHtml = '<h1 style="text-align: center; color: #023e8a; margin-bottom: 40px; font-size: 2.2rem;">DANH MỤC SẢN PHẨM</h1>';

            // 3. Tạo HTML cho từng nhóm danh mục
            for (const categoryName in groupedProducts) {
                if (groupedProducts.hasOwnProperty(categoryName)) {
                    fullHtml += `
                        <section class="category-product-section">
                            <h2 class="category-title">${categoryName}</h2>
                            ${createProductGrid(groupedProducts[categoryName])}
                        </section>
                        <div class="separator"></div>
                    `;
                }
            }
            sanPhamContainer.innerHTML = fullHtml;
        }
    }
});
