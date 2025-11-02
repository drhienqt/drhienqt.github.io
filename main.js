// Load products from JSON
fetch('mainproducts.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('categoriesContainer');
    const categories = [
      {id:"giadung", name:"Đồ gia dụng"},
      {id:"phukien", name:"Phụ kiện thông minh"},
      {id:"thoitrang", name:"Thời trang"},
      {id:"mevabe", name:"Mẹ và bé"},
      {id:"lamdep", name:"Làm đẹp"},
      {id:"ai", name:"Sản phẩm AI"},
      {id:"sach", name:"Sách"},
      {id:"khac", name:"Khác"}
    ];

    categories.forEach(cat=>{
      const section = document.createElement('section');
      section.className='category-section';
      section.id=cat.id;
      let html = `<h2>${cat.name}</h2><div class="products">`;
      data.filter(p=>p.category===cat.id).forEach(p=>{
        html += `<div class="product">
                  <img src="${p.img}" alt="">
                  <h3>${p.name}</h3>
                  <p>${p.price}</p>
                  <a href="${p.link}" target="_blank">Chi tiết</a>
                 </div>`;
      });
      html += `</div><a href="${cat.id}.html" class="more-btn">Xem thêm</a>`;
      section.innerHTML=html;
      container.appendChild(section);
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(){
      const term = this.value.toLowerCase();
      const allProducts = document.querySelectorAll('.product');
      allProducts.forEach(prod=>{
        const name = prod.querySelector('h3').innerText.toLowerCase();
        prod.style.display = name.includes(term) ? 'flex' : 'none';
      });
    });
  });