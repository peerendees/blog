# Cursor-Briefing: BER-59 — Light/Dark-Toggle + fehlende Assets + Rewrite-Fix

**Datum:** 11. April 2026
**Linear-Issue:** [BER-59](https://linear.app/berent/issue/BER-59)
**Projekt:** Webseite + Beratungswerkzeuge
**Repo:** `peerendees/blog`
**Komplexität:** Mittel

## Ziel

Drei Nachbesserungen am Blog-System:
1. Light/Dark-Theme-Toggle auf allen Seiten
2. Fehlende Assets und Font-Faces nachrüsten
3. Vercel-Rewrite reparieren (Clean URLs funktionieren nicht)

## 1. Light/Dark-Toggle

### CSS ergänzen (in /css/style.css)

Am Ende der Datei den Light-Mode-Override einfügen:

```css
[data-theme="light"] {
  --bg:      #F5F0E8;
  --card:    #EDE6DA;
  --border:  #D4C9B8;
  --copper:  #B5742A;
  --gold:    #E8C98A;
  --text:    #2A1A08;
  --muted:   #7A6A58;
  --muted2:  #9A8870;
}
```

Kein reines Weiß — warme, helle Töne passend zum BERENT CI.

### Toggle-Button (CSS)

```css
.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.375rem;
  cursor: pointer;
  color: var(--muted2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, color 0.2s;
}
.theme-toggle:hover {
  border-color: var(--copper);
  color: var(--copper);
}
.theme-toggle svg {
  width: 16px;
  height: 16px;
}
```

### HTML — Header ergänzen (auf allen Seiten)

Im Header, nach dem letzten `<a>` in `.header-nav`, den Button einfügen:

```html
<button id="theme-toggle" class="theme-toggle" aria-label="Farbschema wechseln">
  <svg id="icon-moon" class="hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646Z"/></svg>
  <svg id="icon-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>
</button>
```

Die `.header-nav` muss von einem einzelnen `<a>` zu einem flex-Container werden, damit Link und Button nebeneinander stehen:

```css
.header-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
```

### JavaScript — vor </body> auf allen Seiten

```html
<script>
(function() {
  var saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

  function toggle() {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    update();
  }

  function update() {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    var moon = document.getElementById('icon-moon');
    var sun = document.getElementById('icon-sun');
    if (moon && sun) {
      moon.classList.toggle('hidden', !isLight);
      sun.classList.toggle('hidden', isLight);
    }
  }

  document.getElementById('theme-toggle').addEventListener('click', toggle);
  update();
})();
</script>
```

CSS-Klasse `.hidden` ergänzen (falls nicht vorhanden):

```css
.hidden { display: none; }
```

### Betroffene Dateien

- `/index.html`
- `/posts/ambient-ai-hedy.html`
- Alle zukünftigen HTML-Dateien unter `/posts/`

## 2. Fehlende Font-Face: Lora 300

In `/css/style.css` ergänzen (vor der Lora 400 Deklaration):

```css
@font-face {
  font-family: 'Lora';
  src: url('/assets/fonts/lora-300.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
```

Prüfe ob `/assets/fonts/lora-300.woff2` existiert. Falls nicht: von https://gwfh.mranftl.com/fonts/lora?subsets=latin herunterladen (Gewicht 300, latin) und ablegen.

Im body-Selektor in style.css `font-weight` von `400` auf `300` ändern (CI-Standard).

## 3. PWA-Icons prüfen

Unter `/assets/images/` müssen existieren:
- `icon-192.png` (192×192)
- `icon-512.png` (512×512)
- `apple-touch-icon.png` (180×180)

Falls fehlend oder 0 Bytes: aus `BE_Farbe_V3.png` erzeugen:

```bash
sips -z 192 192 assets/images/BE_Farbe_V3.png --out assets/images/icon-192.png
sips -z 512 512 assets/images/BE_Farbe_V3.png --out assets/images/icon-512.png
sips -z 180 180 assets/images/BE_Farbe_V3.png --out assets/images/apple-touch-icon.png
```

## 4. Vercel-Rewrite reparieren

Aktuell gibt `/ambient-ai-hedy` einen 404, nur `/posts/ambient-ai-hedy.html` funktioniert. Die vercel.json enthält einen Rewrite, der nicht greift.

Prüfe `/vercel.json` — korrektes Format:

```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/:slug", "destination": "/posts/:slug.html" }
  ],
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

Falls der Rewrite trotzdem nicht greift: als Alternative die HTML-Dateien direkt im Root ablegen statt unter `/posts/`, und den Rewrite entfernen. Dann wird `/ambient-ai-hedy.html` durch `cleanUrls: true` automatisch unter `/ambient-ai-hedy` erreichbar.

## Akzeptanzkriterien

1. Theme-Toggle auf index.html und auf der Einzelseite sichtbar und funktional
2. Light-Mode zeigt warme helle Farben, kein reines Weiß
3. Theme-Wahl überlebt Seiten-Reload (localStorage)
4. Lora 300 als Font-Face geladen, body nutzt font-weight 300
5. PWA-Icons existieren und sind korrekt dimensioniert
6. `blog.berent.ai/ambient-ai-hedy` liefert die Einzelseite (kein 404)
7. `blog.berent.ai/` zeigt die Übersicht mit dem Post

## Abschluss

```bash
git add -A
git commit -m "[BER-59] done: Light/Dark-Toggle, Light-Mode CSS, Lora 300, PWA-Icons, Rewrite-Fix"
git push
```
