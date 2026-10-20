/* Me-App – Service Worker (macht die ganze App offline-fähig)
   - Beim Installieren werden alle App-Dateien (Startseite + Module) auf dem Gerät gespeichert.
   - Danach kommt die App sofort aus dem Speicher; im Hintergrund wird geprüft,
     ob es auf GitHub eine neue Version gibt (wirkt beim nächsten Öffnen).
   - Anfragen an die Nextcloud (Sync) werden NICHT angefasst.
   CACHE wird von build.py bei jeder Änderung neu berechnet. */
const CACHE = 'meapp-809844df9c';
const FILES = [
 "icons/apple-touch-icon.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-512.png",
 "index.html",
 "manifest.webmanifest",
 "satzbuch/img/Arm_Circles_0.jpg",
 "satzbuch/img/Arm_Circles_1.jpg",
 "satzbuch/img/Barbell_Bench_Press_-_Medium_Grip_0.jpg",
 "satzbuch/img/Barbell_Bench_Press_-_Medium_Grip_1.jpg",
 "satzbuch/img/Barbell_Squat_0.jpg",
 "satzbuch/img/Barbell_Squat_1.jpg",
 "satzbuch/img/Bent_Over_Barbell_Row_0.jpg",
 "satzbuch/img/Bent_Over_Barbell_Row_1.jpg",
 "satzbuch/img/Butterfly_0.jpg",
 "satzbuch/img/Butterfly_1.jpg",
 "satzbuch/img/Cat_Stretch_0.jpg",
 "satzbuch/img/Cat_Stretch_1.jpg",
 "satzbuch/img/Incline_Dumbbell_Curl_0.jpg",
 "satzbuch/img/Incline_Dumbbell_Curl_1.jpg",
 "satzbuch/img/Incline_Dumbbell_Press_0.jpg",
 "satzbuch/img/Incline_Dumbbell_Press_1.jpg",
 "satzbuch/img/Leg_Extensions_0.jpg",
 "satzbuch/img/Leg_Extensions_1.jpg",
 "satzbuch/img/Leg_Press_0.jpg",
 "satzbuch/img/Leg_Press_1.jpg",
 "satzbuch/img/Lying_Leg_Curls_0.jpg",
 "satzbuch/img/Lying_Leg_Curls_1.jpg",
 "satzbuch/img/Rope_Jumping_0.jpg",
 "satzbuch/img/Rope_Jumping_1.jpg",
 "satzbuch/img/Seated_Bent-Over_Rear_Delt_Raise_0.jpg",
 "satzbuch/img/Seated_Bent-Over_Rear_Delt_Raise_1.jpg",
 "satzbuch/img/Seated_Cable_Rows_0.jpg",
 "satzbuch/img/Seated_Cable_Rows_1.jpg",
 "satzbuch/img/Seated_Dumbbell_Press_0.jpg",
 "satzbuch/img/Seated_Dumbbell_Press_1.jpg",
 "satzbuch/img/Shoulder_Circles_0.jpg",
 "satzbuch/img/Shoulder_Circles_1.jpg",
 "satzbuch/img/Side_Lateral_Raise_0.jpg",
 "satzbuch/img/Side_Lateral_Raise_1.jpg",
 "satzbuch/img/Split_Squat_with_Dumbbells_0.jpg",
 "satzbuch/img/Split_Squat_with_Dumbbells_1.jpg",
 "satzbuch/img/Standing_Dumbbell_Calf_Raise_0.jpg",
 "satzbuch/img/Standing_Dumbbell_Calf_Raise_1.jpg",
 "satzbuch/img/Standing_Hip_Circles_0.jpg",
 "satzbuch/img/Standing_Hip_Circles_1.jpg",
 "satzbuch/img/Thigh_Abductor_0.jpg",
 "satzbuch/img/Thigh_Abductor_1.jpg",
 "satzbuch/img/Thigh_Adductor_0.jpg",
 "satzbuch/img/Thigh_Adductor_1.jpg",
 "satzbuch/img/Triceps_Pushdown_0.jpg",
 "satzbuch/img/Triceps_Pushdown_1.jpg",
 "satzbuch/img/Wide-Grip_Lat_Pulldown_0.jpg",
 "satzbuch/img/Wide-Grip_Lat_Pulldown_1.jpg",
 "satzbuch/img/Worlds_Greatest_Stretch_0.jpg",
 "satzbuch/img/Worlds_Greatest_Stretch_1.jpg",
 "satzbuch/index.html"
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('meapp-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Seitenaufrufe auf die gespeicherte Datei abbilden: ".../satzbuch/" → ".../satzbuch/index.html"
function cacheKey(req) {
  if (req.mode !== 'navigate') return req;
  const u = new URL(req.url); u.search = ''; u.hash = '';
  if (u.pathname.endsWith('/')) u.pathname += 'index.html';
  else if (!/\.[a-z0-9]+$/i.test(u.pathname)) u.pathname += '/index.html'; // ".../satzbuch" ohne Schrägstrich
  return u.href;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const own = url.origin === self.location.origin;
  if (!own && !FONT_HOSTS.includes(url.hostname)) return; // z. B. Nextcloud: direkt ans Netz
  // "Stale-while-revalidate": sofort aus dem Speicher, parallel aktualisieren
  e.respondWith(caches.open(CACHE).then(async cache => {
    const key = cacheKey(req);
    const hit = await cache.match(key, { ignoreSearch: own });
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque') && !res.redirected) cache.put(key, res.clone());
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
