/* ============================================================
   FalaReal — Service Worker  (v11.31.0)
   ============================================================

   ÚNICA COISA QUE VOCÊ PRECISA MEXER A CADA DEPLOY:
   a constante CACHE_VERSION logo abaixo. Incremente junto com
   a versão do rodapé do site.

   Estratégias
   -----------
   • Navegação (HTML): network-first com timeout de 4s.
     Sempre tenta a versão nova; se a rede falhar ou demorar,
     usa a última versão em cache; se não houver nada em cache,
     mostra /offline.html.
   • Assets do mesmo domínio (ícones, imagens, css, js, pdf):
     stale-while-revalidate — aparece instantâneo e atualiza
     em segundo plano.
   • NÃO intercepta: qualquer método != GET, qualquer domínio
     externo (Supabase, Stripe, Formspree, Google Fonts) e
     qualquer URL que contenha /api/.

   Atualização
   -----------
   Este SW NÃO chama skipWaiting sozinho. Quando uma versão nova
   é instalada, ela fica em "waiting" e o pwa.js mostra o aviso
   "Nova versão disponível". Só quando o usuário toca em
   "Atualizar" é que o SW novo assume. Isso evita trocar o código
   embaixo do usuário no meio de um exercício.
   ============================================================ */

const CACHE_VERSION = 'falareal-v11.31.0';
const OFFLINE_URL   = '/offline.html';
const NAV_TIMEOUT   = 4000;

const PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

/* ---------- install ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // um a um: se um arquivo faltar, o resto ainda é cacheado
      Promise.all(
        PRECACHE.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => null)
        )
      )
    )
  );
  // sem skipWaiting aqui — quem decide é o usuário (ver pwa.js)
});

/* ---------- activate ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })()
  );
});

/* ---------- mensagem vinda da página ---------- */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'GET_VERSION') {
    event.source && event.source.postMessage({ type: 'VERSION', value: CACHE_VERSION });
  }
});

/* ---------- helpers ---------- */
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), ms)
  );
}

async function handleNavigate(event) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const preload = event.preloadResponse ? await event.preloadResponse : null;
    const res = preload || (await Promise.race([fetch(event.request), timeout(NAV_TIMEOUT)]));
    if (res && res.ok) cache.put('/index.html', res.clone());
    return res;
  } catch (e) {
    return (
      (await cache.match(event.request)) ||
      (await cache.match('/index.html')) ||
      (await cache.match(OFFLINE_URL)) ||
      new Response('Offline', { status: 503, statusText: 'Offline' })
    );
  }
}

async function handleAsset(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res && res.status === 200 && res.type === 'basic') {
        cache.put(request, res.clone());
      }
      return res;
    })
    .catch(() => null);
  return cached || (await network) || new Response('', { status: 504 });
}

/* ---------- fetch ---------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Stripe, Supabase, fonts...
  if (url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    event.respondWith(handleNavigate(event));
    return;
  }
  event.respondWith(handleAsset(req));
});
