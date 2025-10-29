/* MXD Service Worker — network-first for HTML; SWR for assets */
const VERSION = '2025-10-29b';
const ASSET_CACHE = 'mxd-assets-'+VERSION;

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>!k.endsWith(VERSION)).map(k=>caches.delete(k)))));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async()=>{
      try { return await fetch(req); }
      catch(e) { return caches.match('/offline.html') || new Response('Offline',{status:503}); }
    })());
    return;
  }

  if (['style','script','image','font'].includes(req.destination)) {
    event.respondWith((async()=>{
      const cache = await caches.open(ASSET_CACHE);
      const cached = await cache.match(req);
      const net = fetch(req).then(res => { cache.put(req,res.clone()); return res; }).catch(()=>null);
      return cached || await net || new Response('',{status:504});
    })());
  }
});
