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
// --- Xử lý Trang SANPHAM.HTML (Giới hạn 12 sản phẩm/danh mục) ---
else if (isSanPhamPage) {
    const sanPhamContainer = document.querySelector("#all-products-sections");
    if (sanPhamContainer) {
        
        // 1. Nhóm sản phẩm hợp lệ theo category
        const groupedProducts = validProducts.reduce((acc, product) => {
            const category = product.category || "Chưa phân loại"; 
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        let fullHtml = '<h1 style="text-align: center; color: #023e8a; margin-bottom: 40px; font-size: 2.2rem;">DANH MỤC SẢN PHẨM</h1>';

        // 2. Tạo HTML cho từng nhóm danh mục
        for (const categoryName in groupedProducts) {
            if (groupedProducts.hasOwnProperty(categoryName)) {
                // Tên file trang con, ví dụ: "Đồ gia dụng" -> "dogiagung.html"
                const pageFileName = categoryName
                    .toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
                    .replace(/\s+/g, '') // Loại bỏ khoảng trắng
                    .replace(/[^a-z0-9]/g, '') // Loại bỏ ký tự đặc biệt
                    + '.html';
                
                // Giới hạn sản phẩm hiển thị trên trang tổng là 12
                const limitedProducts = groupedProducts[categoryName].slice(0, 12);

                fullHtml += `
                    <section class="category-product-section">
                        <h2 class="category-title">
                            <a href="./pages/${pageFileName}" style="text-decoration: none; color: #023e8a;">
                                ${categoryName} (${groupedProducts[categoryName].length} sản phẩm)
                            </a>
                        </h2>
                        ${createProductGrid(limitedProducts)}
                        
                        ${groupedProducts[categoryName].length > 12 ? 
                            `<div style="text-align: center; margin-top: 20px;">
                                <a href="./pages/${pageFileName}" class="btn">Xem tất cả (${groupedProducts[categoryName].length})</a>
                            </div>` : ''
                        }
                    </section>
                    <div class="separator"></div>
                `;
            }
        }
        sanPhamContainer.innerHTML = fullHtml;
    }
}
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
