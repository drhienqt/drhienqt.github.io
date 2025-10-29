
(function(){
  const qs = new URLSearchParams(location.search);
  const SUB1 = qs.get('sub1') || '';
  const SUB2 = qs.get('sub2') || '';
  const metas = document.querySelectorAll('a.product-meta');
  metas.forEach(meta => {
    const wrap = document.createElement('div');
    wrap.className = 'product-card';
    const sku = meta.dataset.sku || 'unknown';
    const img = meta.dataset.img || '/assets/img/products/'+sku+'.webp';
    const price = meta.dataset.price || '';
    const title = meta.textContent.trim();
    const buy = meta.nextElementSibling && meta.nextElementSibling.classList.contains('buy') ? meta.nextElementSibling : null;
    const origin = meta.getAttribute('href');

    const imgEl = document.createElement('img'); imgEl.src = img; imgEl.alt = title;
    const info = document.createElement('div');
    const t = document.createElement('div'); t.className='title'; t.textContent = title;
    const p = document.createElement('div'); p.className='price'; p.textContent = price ? (Number(price).toLocaleString('vi-VN')+'₫') : '';
    const actions = document.createElement('div');
    const a = document.createElement('a');
    a.className='btn'; a.textContent='Mua ngay'; a.rel='nofollow noopener'; a.target='_blank';

    let url = buy ? buy.getAttribute('href') : origin;
    if (url) {
      const u = new URL(url, location.origin);
      if (SUB1) u.searchParams.set('sub1', SUB1);
      if (SUB2) u.searchParams.set('sub2', SUB2);
      a.href = u.toString();
    } else {
      a.href = origin || '#';
    }

    info.appendChild(t); info.appendChild(p); actions.appendChild(a);
    info.appendChild(actions);
    wrap.appendChild(imgEl); wrap.appendChild(info);
    meta.replaceWith(wrap);
    if (buy) buy.remove();
  });
})();
