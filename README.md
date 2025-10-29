# MXD Starter — drhienqt.github.io

Đã set **canonical tuyệt đối** về: `https://drhienqt.github.io`.

## Bao gồm
- `index.html`, `store.html`, hub: `store/me-va-be.html`, `store/may-cat-mai.html`
- `g.html` (trang sản phẩm theo `?sku=`)
- `assets/site.css`, `assets/analytics.js` (GA4: G-SRMVN734DX), `assets/mxd-affiliate.js`
- `robots.txt`, `sitemap.xml`, `sw.js`, `offline.html`

## Cách dùng
1) Tạo repo **drhienqt.github.io** (public) → **Upload** toàn bộ file/folder vào nhánh `main`.
2) Vào **Settings → Pages**: Source = Deploy from a branch, Branch = `main`/`/` (nếu chưa tự bật).
3) Mở `https://drhienqt.github.io` kiểm tra.

## Lưu ý ảnh
- Danh mục: `/assets/img/categories/<slug>.webp` → thêm `me-va-be.webp`, `may-cat-mai.webp`
- Sản phẩm: `/assets/img/products/<sku>.webp`

## Gợi ý commit (chuẩn MXD)
- `feat(layout): init drhienqt.github.io with MXD starter`
- `feat(layout): add Mẹ & Bé tile linking to /store/me-va-be.html in store.html`
- `feat(seo): set absolute canonicals + OG`
- `chore(seo): add robots.txt & sitemap.xml (lastmod=2025-10-29)`
- `feat(pwa): add sw network-first for HTML; swr for assets`
