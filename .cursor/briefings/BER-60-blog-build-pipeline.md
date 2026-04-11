# Cursor-Briefing: Blog-Build-Pipeline
**Datum:** 11.04.2026 (aktualisiert)
**Linear-Issue:** [BER-60](https://linear.app/berent/issue/BER-60)
**Projekt:** berent.ai (Blog)
**Komplexität:** Mittel
**Repo:** `peerendees/blog`
**Lokaler Pfad:** `/Users/kunkel/Entwicklung/projekte/blog`

## Cursor-Prompt (kopieren und einfügen)

```
Lies das Briefing .cursor/briefings/BER-60-blog-build-pipeline.md und setze es vollständig um.

Kurzfassung: Der Blog braucht einen automatischen Build-Step.

1. posts.json und linkedin-posts.json zusammenführen zu einer einzigen posts.json (neues Format mit linkedinUrl und status-Feld). linkedin-posts.json danach löschen.
2. Post-HTML-Dateien von posts/ in den Repo-Root verschieben (blog.berent.ai/slug statt blog.berent.ai/posts/slug). posts/-Ordner danach löschen. ambient-ai-hedy.html liegt bereits im Root.
3. build.js erstellen — liest posts.json, generiert dist/index.html und dist/sitemap.xml, kopiert alle HTML-Dateien und Assets nach dist/. Nur Node.js Built-ins, kein npm install.
4. vercel.json erweitern: buildCommand "node build.js", outputDirectory "dist".
5. Lokal testen: node build.js ausführen, dist/index.html im Browser prüfen.
6. Alte index.html und sitemap.xml im Repo-Root NICHT löschen — erst nach erfolgreichem Vercel-Deploy.

Geräte-Label: gerät:m2
Werkzeug-Label: werkzeug:cursor

Wenn alles funktioniert:
git add -A
git commit -m "[BER-60] done: Blog-Build-Pipeline — Vercel Build-Step, JSON-Konsolidierung, Clean URLs"
git push
```

---

## Ziel

Den Blog von einer komplett statisch gepflegten Seite auf einen automatischen Build-Step umstellen. Nach dem Umbau reicht es, `[slug].html` + `posts.json` ins Repo zu pushen — Vercel generiert `index.html` und `sitemap.xml` automatisch beim Deploy.

## Kontext

Aktuell werden bei jedem neuen Blog-Post 4–5 Dateien manuell generiert und ins Repo committed: die Post-HTML, index.html, posts.json, sitemap.xml, linkedin-posts.json. Das ist fehleranfällig und erzeugt unnötigen Aufwand im Blog-Publisher-Skill (Claude-Projekt).

## URL-Struktur (Clean URLs)

**Ziel-URLs:** `blog.berent.ai/ambient-ai-hedy` (ohne .html, ohne /posts/)

Vercel `cleanUrls: true` macht aus `ambient-ai-hedy.html` automatisch `/ambient-ai-hedy`.

**Konsequenz:** Post-HTML-Dateien liegen im Repo-Root, NICHT in einem `posts/`-Unterordner.

**Migration:**
- `posts/ambient-ai-hedy.html` → bereits als `ambient-ai-hedy.html` im Root vorhanden (Duplikat in posts/ entfernen)
- Alle anderen Post-HTMLs aus `posts/` in den Root verschieben
- `posts/`-Ordner danach löschen
- Canonical URLs und OG-URLs in den Post-HTMLs prüfen: müssen `https://blog.berent.ai/[SLUG]` sein (ohne /posts/)
- Links in der generierten index.html: `href="/[SLUG]"` (ohne /posts/)

## Schritt 1: posts.json konsolidieren

Die bestehende `posts.json` hat nur 1 Eintrag. Die `linkedin-posts.json` hat 12 Einträge mit leicht anderen Feldern und teilweise anderen Slugs.

**Neues Format für `posts.json`** (Quellformat für den Build):

```json
[
  {
    "slug": "ambient-ai-hedy",
    "title": "KI, die im Hintergrund für dich arbeitet...",
    "date": "2026-04-11",
    "teaser": "Ambient AI – ein Konzept, das meine Sicht auf KI-Implementierung nachhaltig verändert hat.",
    "tags": ["Hedy", "Ambient AI"],
    "linkedinUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7448642198016806912",
    "status": "published"
  }
]
```

**Felder:**
- `slug` — URL-Pfad UND Dateiname (slug.html im Root)
- `title` — Originalschreibweise (nicht uppercase)
- `date` — ISO-Format YYYY-MM-DD
- `teaser` — max. 160 Zeichen, für meta description und Post-Card
- `tags` — Array von Strings
- `linkedinUrl` — LinkedIn-Post-URL oder leerer String (wird später nachgetragen)
- `status` — `published` (HTML existiert) oder `draft` (nur in JSON)

**Migration:** Für jeden Eintrag in `linkedin-posts.json`, der eine zugehörige HTML-Datei hat (`posts/[slug].html` oder `[slug].html` im Root), einen Eintrag mit `status: "published"` übernehmen. Posts ohne HTML bekommen `status: "draft"`. Slugs aus bestehenden HTML-Dateinamen haben Vorrang.

**Danach `linkedin-posts.json` löschen.**

## Schritt 2: Post-HTML-Dateien in den Root verschieben

```bash
# Alle HTML-Dateien aus posts/ in den Root verschieben
mv posts/*.html .
# posts/-Ordner löschen (sollte jetzt leer sein)
rmdir posts
```

Danach in JEDER Post-HTML-Datei die Canonical/OG-URLs prüfen:
- `<link rel="canonical" href="https://blog.berent.ai/[SLUG]">` (ohne /posts/)
- `<meta property="og:url" content="https://blog.berent.ai/[SLUG]">` (ohne /posts/)
- `"mainEntityOfPage": "https://blog.berent.ai/[SLUG]"` im LD+JSON (ohne /posts/)

## Schritt 3: build.js erstellen

Erstelle `build.js` im Repo-Root. Das Script:

1. Liest `posts.json`
2. Filtert auf `status: "published"` (Drafts werden ignoriert)
3. Sortiert absteigend nach `date`
4. Generiert `dist/index.html` aus dem Template (siehe unten)
5. Generiert `dist/sitemap.xml`
6. Kopiert alle anderen Dateien nach `dist/`:
   - Alle `*.html`-Dateien aus dem Root (Post-Seiten) — AUSSER `index.html` (wird generiert)
   - `css/`
   - `assets/`
   - `manifest.json`
   - `robots.txt`
   - `posts.json`
   - `vercel.json` NICHT kopieren (Vercel liest es aus dem Root)

**Kein `npm install` nötig** — nur Node.js Built-ins (`fs`, `path`).

### index.html Template

```html
<!DOCTYPE html>
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
        <!-- POST-CARDS HIER -->
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
</html>
```

**Pro Post-Card:**
```html
<li>
  <a href="/[SLUG]" class="post-card">
    <div class="post-card-header">
      <div class="plus-mark"></div>
      <div>
        <div class="post-card-title">[TITLE]</div>
        <div class="post-card-meta">
          [DD.MM.YYYY] · [TAGS als <span class="tag">TAG</span>]
        </div>
      </div>
    </div>
    <p class="post-card-teaser">[TEASER]</p>
  </a>
</li>
```

### sitemap.xml Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://blog.berent.ai/</loc>
    <lastmod>[DATUM DES NEUESTEN POSTS]</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Pro published Post: -->
  <url>
    <loc>https://blog.berent.ai/[SLUG]</loc>
    <lastmod>[POST-DATUM]</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## Schritt 4: vercel.json anpassen

```json
{
  "buildCommand": "node build.js",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/assets/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

## Schritt 5: blog-watch.sh anpassen

Die Datei liegt unter `~/blog-deploy/blog-watch.sh`. Muss an die neue Struktur angepasst werden — Posts liegen jetzt im Root statt in posts/:

```bash
#!/bin/bash
HOT_FOLDER="$HOME/blog-deploy"
REPO_FOLDER="/Users/kunkel/Entwicklung/projekte/blog"

echo "🔄 Blog-Watch gestartet"

sync_files() {
    local HAS_FILES=false

    # HTML-Dateien direkt in den Repo-Root kopieren
    for f in "$HOT_FOLDER"/*.html; do
        [ -f "$f" ] || continue
        BASENAME=$(basename "$f")
        # index.html NICHT kopieren (wird vom Build generiert)
        [ "$BASENAME" = "index.html" ] && continue
        cp "$f" "$REPO_FOLDER/$BASENAME"
        HAS_FILES=true
    done

    # posts.json
    if [ -f "$HOT_FOLDER/posts.json" ]; then
        cp "$HOT_FOLDER/posts.json" "$REPO_FOLDER/posts.json"
        HAS_FILES=true
    fi

    if [ "$HAS_FILES" = true ]; then
        cd "$REPO_FOLDER" || exit 1
        SLUG=$(ls -1t "$HOT_FOLDER"/*.html 2>/dev/null | head -1 | xargs basename 2>/dev/null | sed 's/.html$//')
        git add -A
        [ -n "$SLUG" ] && git commit -m "feat: neuer Blog-Post $SLUG" || git commit -m "feat: Blog aktualisiert"
        git push
        echo "✅ Push erfolgreich"
        rm -f "$HOT_FOLDER"/*.html "$HOT_FOLDER"/posts.json 2>/dev/null
        echo "🧹 Hot Folder aufgeräumt"
    fi
}

sync_files
fswatch -0 -r --event Created --event Updated "$HOT_FOLDER" | while read -d "" event; do
    sleep 2
    sync_files
done
```

## Schritt 6: Lokal testen

1. `node build.js` ausführen
2. `dist/index.html` im Browser öffnen — alle Post-Cards korrekt?
3. Post-Links klicken — öffnen die richtige HTML-Datei?
4. `dist/sitemap.xml` prüfen — alle published Posts enthalten?

## NICHT ändern

- CSS (`css/style.css`) — bleibt unverändert
- Assets (`assets/`) — bleiben unverändert
- Bestehende Post-HTML-Dateien — nur verschieben (posts/ → Root), Inhalt nicht ändern (ausser Canonical/OG-URLs korrigieren falls nötig)
- `manifest.json`, `robots.txt` — bleiben

## Abschluss

```bash
git add -A
git commit -m "[BER-60] done: Blog-Build-Pipeline — Vercel Build-Step, JSON-Konsolidierung, Clean URLs"
git push
```
