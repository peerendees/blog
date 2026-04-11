const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

function clean() {
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  fs.mkdirSync(DIST, { recursive: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function copyFile(name) {
  const src = path.join(ROOT, name);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST, name));
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function renderPostCard(post) {
  const tags = post.tags.map(t => `<span class="tag">${t}</span>`).join(' ');
  return `
        <li>
          <a href="/${post.slug}" class="post-card">
            <div class="post-card-header">
              <div class="plus-mark"></div>
              <div>
                <div class="post-card-title">${post.title}</div>
                <div class="post-card-meta">
                  ${formatDate(post.date)} · ${tags}
                </div>
              </div>
            </div>
            <p class="post-card-teaser">${post.teaser}</p>
          </a>
        </li>`;
}

function generateIndex(posts) {
  const cards = posts.map(renderPostCard).join('\n');
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — BERENT | Beratung + Entwicklung</title>
  <meta name="description" content="Gedanken zu KI-Transformation, Automatisierung und Telefonassistenten im Mittelstand.">
  <meta property="og:title" content="Blog — BERENT">
  <meta property="og:description" content="Gedanken zu KI-Transformation, Automatisierung und Telefonassistenten im Mittelstand.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://blog.berent.ai">
  <link rel="canonical" href="https://blog.berent.ai">
  <link rel="icon" type="image/png" href="/assets/images/BE_Farbe_V3.png">
  <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#B5742A">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="header-logo">
        <img src="/assets/images/logo_farbe_v3.webp" alt="BERENT" width="120" height="32">
      </a>
      <nav class="header-nav">
        <a href="https://berent.ai" target="_blank" rel="noopener">Zur Website →</a>
        <button id="theme-toggle" class="theme-toggle" aria-label="Farbschema wechseln">
          <svg id="icon-moon" class="hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646Z"/></svg>
          <svg id="icon-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>
        </button>
      </nav>
    </div>
  </header>

  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Blog</h1>
        <p class="subtitle">Beratung + Entwicklung · Gedanken</p>
      </div>
    </section>

    <section class="container">
      <ul class="post-list">
${cards}
      </ul>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="plus-mark"></div>
        BERENT
      </div>
      <span class="footer-tagline">Blog · berent.ai</span>
      <div class="footer-links">
        <a href="https://berent.ai/impressum.html" target="_blank" rel="noopener">Impressum</a>
        <a href="https://berent.ai/datenschutz.html" target="_blank" rel="noopener">Datenschutz</a>
        <a href="https://berent.ai" target="_blank" rel="noopener">← Zurück zur Hauptseite</a>
      </div>
    </div>
  </footer>

  <script>
  (function() {
    var saved = localStorage.getItem('theme');
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
    function toggle() {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); }
      else { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }
      update();
    }
    function update() {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      var moon = document.getElementById('icon-moon');
      var sun = document.getElementById('icon-sun');
      if (moon && sun) { moon.classList.toggle('hidden', !isLight); sun.classList.toggle('hidden', isLight); }
    }
    document.getElementById('theme-toggle').addEventListener('click', toggle);
    update();
  })();
  </script>
</body>
</html>`;
}

function generateSitemap(posts) {
  const latestDate = posts[0].date;
  const postEntries = posts.map(p => `  <url>
    <loc>https://blog.berent.ai/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://blog.berent.ai/</loc>
    <lastmod>${latestDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${postEntries}
</urlset>`;
}

function build() {
  console.log('🔨 Build gestartet...');

  const allPosts = JSON.parse(fs.readFileSync(path.join(ROOT, 'posts.json'), 'utf8'));
  const published = allPosts
    .filter(p => p.status === 'published')
    .sort((a, b) => b.date.localeCompare(a.date));

  console.log(`   ${allPosts.length} Posts gesamt, ${published.length} published`);

  clean();

  fs.writeFileSync(path.join(DIST, 'index.html'), generateIndex(published));
  console.log('   ✅ dist/index.html');

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), generateSitemap(published));
  console.log('   ✅ dist/sitemap.xml');

  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html');
  for (const f of htmlFiles) {
    fs.copyFileSync(path.join(ROOT, f), path.join(DIST, f));
  }
  console.log(`   ✅ ${htmlFiles.length} Post-HTML(s) kopiert`);

  copyDir(path.join(ROOT, 'css'), path.join(DIST, 'css'));
  copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
  console.log('   ✅ css/ + assets/');

  for (const f of ['manifest.json', 'robots.txt', 'posts.json']) copyFile(f);
  console.log('   ✅ manifest.json, robots.txt, posts.json');

  console.log('🎉 Build abgeschlossen → dist/');
}

build();
