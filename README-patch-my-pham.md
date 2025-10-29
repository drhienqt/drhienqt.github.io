# Patch — Thêm danh mục Mỹ phẩm

**Files trong gói:**
- `store.html` — thêm tile **Mỹ phẩm** (giữ Thời trang).
- `store/my-pham.html` — hub mới (canonical + OG).
- `sitemap.xml` — bổ sung `/store/my-pham.html` (lastmod=2025-10-29).

**Ảnh cần thêm:**
- `/assets/img/categories/my-pham.webp` (≥1200×630 .webp)
- (Nếu có SP) `/assets/img/products/<sku>.webp`

**Commit gợi ý:**
- `feat(layout): add Mỹ phẩm tile linking to /store/my-pham.html in store.html`
- `feat(layout): add /store/my-pham.html hub (canonical + OG)`
- `chore(seo): update sitemap.xml (add /store/my-pham.html; lastmod=2025-10-29)`
