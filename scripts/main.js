// scripts/main.js - Logic xử lý đa trang, có lọc sản phẩm rỗng

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Xác định trang hiện tại
    const path = window.location.pathname;
    // Kiểm tra xem có phải trang index.html hoặc trang chủ (/) không
    const isIndexPage = path.endsWith('/index.html') || path === '/'; 
    // Kiểm tra xem có phải trang sanpham.html (trang tổng quan danh mục) không
    const isSanPhamPage = path.endsWith('/sanpham.html'); 
    // Kiểm tra xem có phải là trang con danh mục (bên trong thư mục /pages/) không
    const isCategoryPage = path.includes('/pages/') && path.endsWith('.html'); 

    let productsData = [];

    // Tải dữ liệu sản phẩm
    try {
        // Đường dẫn tương đối hoạt động tốt nhất trên GitHub Pages
        let fetchPath = "products.json";
        // Nếu đang ở trang con (trong thư mục /pages/), phải đi ngược ra 1 cấp
        if (isCategoryPage) {
            fetchPath = "../products.json"; 
        }
        
        const response = await fetch(fetchPath); 
        if (!response.ok) throw new Error("Không thể tải dữ liệu sản phẩm. Mã lỗi: " + response.status);
        productsData = await response.json();
    } catch (error) {
        console.error("Lỗi tải products.json:", error);
        
        const errorMessage = "<p style='color:red; text-align:center; padding: 50px 0;'>⚠️ Lỗi: Không thể tải danh sách sản phẩm. Vui lòng kiểm tra file products.json.</p>";
        
        // Hiển thị lỗi trên trang đang gặp vấn đề
        const containers = [document.querySelector("#featured-products"), document.querySelector("#all-products-sections"), document.querySelector("#category-products")];
        containers.forEach(container => {
            if (container) container.innerHTML = errorMessage;
        });
        
        return; 
    }

    // --- Lọc sản phẩm: Chỉ giữ lại những sản phẩm có Tên, Ảnh và Link hợp lệ ---
    const validProducts = productsData.filter(p => p.name && p.image && p.link && 
                                                  p.name.trim() !== "" && p.image.trim() !== "" && p.link.trim() !== "");


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
    
    // --- Hàm chuyển tên danh mục có dấu thành tên file không dấu ---
    const generatePageFileName = (categoryName) => {
        return categoryName
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
            .replace(/\s+/g, '') 
            .replace(/[^a-z0-9]/g, '') 
            + '.html';
    };


    // ----------------------------------------------------------------------
    // --- BẮT ĐẦU XỬ LÝ THEO TRANG ---
    // ----------------------------------------------------------------------

    if (isIndexPage) {
        // --- Xử lý Trang INDEX.HTML (8 Sản phẩm tiêu biểu) ---
        const indexProductsContainer = document.querySelector("#featured-products");
        if (indexProductsContainer) {
            const featured = validProducts.slice(0, 8);
            indexProductsContainer.innerHTML = `
                <h2 style="text-align:center;">Sản phẩm tiêu biểu</h2>
                ${createProductGrid(featured)}
            `;
        }
    } 
    
    else if (isSanPhamPage) {
        // --- Xử lý Trang SANPHAM.HTML (Giới hạn 12 sản phẩm/danh mục) ---
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
                    const pageFileName = generatePageFileName(categoryName);
                    
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
    
    else if (isCategoryPage) {
        // --- Xử lý Trang CON DANH MỤC CHI TIẾT (/pages/*.html) ---
        const categoryContainer = document.querySelector("#category-products");

        if (categoryContainer) {
            const categoryName = categoryContainer.dataset.categoryName;
            
            if (categoryName && validProducts.length > 0) {
                
                // Lọc TẤT CẢ sản phẩm chỉ thuộc danh mục hiện tại
                const filteredProducts = validProducts.filter(p => p.category === categoryName);

                categoryContainer.innerHTML = createProductGrid(filteredProducts);
                
                // Cập nhật tiêu đề trang và mô tả
                document.title = `${categoryName} - HÂN STORE`;
                const heroTitle = document.querySelector('.hero-sanpham h1');
                const heroSubtitle = document.querySelector('.hero-sanpham p');
                if(heroTitle) heroTitle.textContent = `TẤT CẢ ${categoryName.toUpperCase()}`;
                if(heroSubtitle) heroSubtitle.textContent = `Xem trọn bộ ${filteredProducts.length} sản phẩm thuộc danh mục ${categoryName}.`;

            } else if (categoryName) {
                 categoryContainer.innerHTML = `<p style="text-align: center; padding: 50px;">Không tìm thấy sản phẩm nào trong danh mục ${categoryName}.</p>`;
            }
        }
    }
});
