# Patch — Set GA4, AccessTrade IDs & Social for drhienqt.github.io

- GA4: **G-6BR46GX2XS** (assets/analytics.js)
- AccessTrade: pub **6822533979779947641**, Shopee **4751584435713464237**, Lazada **5127144557053758578**, TikTok **6648523843406889655** (assets/mxd-config.js)
- Floating links: Zalo → https://zalo.me/xxxx (placeholder), Facebook → https://facebook.com/drhienqt

**Files to upload/overwrite:**
- `/assets/analytics.js`
- `/assets/mxd-config.js`
- `index.html`, `store.html`, all `/store/*.html` (ensure <head> order: analytics → mxd-config → mxd-affiliate)

**Commit messages (suggested):**
- `feat(analytics): set GA4 id G-6BR46GX2XS via assets/analytics.js`
- `feat(affiliate): configure AccessTrade pub/cid (mxd-config.js)`
- `feat(layout): update floating contact links (fb=z/drhienqt; zalo=xxxx)`
