# Cursor-Briefing: Blog-System blog.berent.ai — Erstpush

**Datum:** 11. April 2026
**Projekt:** Webseite + Beratungswerkzeuge
**Repo:** `peerendees/blog`
**Komplexität:** Mittel

## Ziel

Ein minimales, SEO-optimiertes Blog-System unter `blog.berent.ai` aufbauen. Erster Push = sofort deployfähig über Vercel. Kein Build-Schritt, kein Framework — reines HTML + CSS mit BERENT Corporate Identity.

## Kontext

- Das Repo `peerendees/blog` ist leer und wartet auf den ersten Push
- Vercel-Projekt existiert, Subdomain `blog.berent.ai` ist in Cloudflare angelegt
- Nach dem Push verbindet Marcus Repo ↔ Vercel manuell, danach deployed jeder weitere Push automatisch
- Die Blog-Posts sind 1:1-Übernahmen von LinkedIn-Beiträgen
- Das Blog wird im **neuen BERENT CI** gebaut (dunkler Hintergrund, Kupfer/Gold-Akzente) — NICHT im alten CI der Hauptseite
- Schriften müssen DSGVO-konform lokal gehostet werden (kein Google Fonts CDN)

## Corporate Identity — Pflicht

### Farben
```css
:root {
  --bg:      #090806;   /* Warmes Dunkelbraun-Schwarz */
  --card:    #110e0a;   /* Card-Hintergrund */
  --border:  #2a2118;   /* Subtile Trennlinien */
  --copper:  #B5742A;   /* Hauptakzent: Headlines, Buttons, Borders */
  --gold:    #E8C98A;   /* EXKLUSIV für das + Symbol */
  --text:    #C4BCB1;   /* Fließtext */
  --muted:   #7A6A58;   /* Metainfo, Datum, Labels */
  --muted2:  #9a8870;   /* Dezente Labels */
}
```

**Regeln:**
- Niemals `#000000` oder `#FFFFFF` verwenden
- Gold `#E8C98A` ist ausschließlich dem `+` Symbol vorbehalten
- Hintergrund immer `#090806`

### Typografie

| Einsatz | Font | Gewicht | Hinweis |
|---|---|---|---|
| Headlines | **Bebas Neue** | Regular | Immer UPPERCASE, `letter-spacing: 0.04em` bis `0.1em` |
| Body / Fließtext | **Lora** | 300 / 400 / 600 | Kein `font-style: italic` |
| Code / Labels | **JetBrains Mono** | 300 / 400 / 700 | Technische Inhalte, Tags |

Niemals Inter, Roboto, Arial, System-UI verwenden.

### Fonts lokal hosten (DSGVO-Pflicht)

Fonts als `.woff2` herunterladen und unter `/assets/fonts/` ablegen:
- `bebas-neue-regular.woff2`
- `lora-300.woff2`
- `lora-400.woff2`
- `lora-600.woff2`
- `jetbrains-mono-400.woff2` (für Tags)

Download-Quelle: https://gwfh.mranftl.com/fonts (google-webfonts-helper, DSGVO-konform)

```css
@font-face {
  font-family: 'Bebas Neue';
  src: url('/assets/fonts/bebas-neue-regular.woff2') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: 'Lora';
  src: url('/assets/fonts/lora-300.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
@font-face {
  font-family: 'Lora';
  src: url('/assets/fonts/lora-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Lora';
  src: url('/assets/fonts/lora-600.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/assets/fonts/jetbrains-mono-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### Logo-Dateien

| Datei | Verwendung | Quelle |
|---|---|---|
| `logo_farbe_v3.webp` | Header (32px) + Footer (24px) | Aus Hauptrepo `peerendees/berent.ai` kopieren |
| `BE_Farbe_V3.png` | Favicon | Aus Hauptrepo kopieren |

Beide Dateien haben dunklen Hintergrund `#090806` — passen nahtlos.

Ablegen unter `/assets/images/`.

### Plus-Symbol (Markenelement)

Das `+` ist zentrales Markenelement — als Bullet-Ersatz in der Post-Liste verwenden.

```css
.plus-mark {
  width: 18px; height: 18px;
  position: relative; flex-shrink: 0;
}
.plus-mark::before,
.plus-mark::after {
  content: '';
  position: absolute;
  background: var(--gold);
  border-radius: 1px;
}
.plus-mark::before { width: 2px; height: 100%; left: 50%; top: 0; transform: translateX(-50%); }
.plus-mark::after  { width: 100%; height: 2px; top: 50%; left: 0; transform: translateY(-50%); }
```

### Footer-Pflichtstruktur

Jede Seite braucht diesen Footer:
```html
<footer>
  <div class="footer-brand">
    <div class="plus-mark"></div>
    BERENT
  </div>
  <span>Blog · berent.ai</span>
  <div>
    <a href="https://berent.ai/impressum.html" target="_blank" rel="noopener">Impressum</a>
    <a href="https://berent.ai/datenschutz.html" target="_blank" rel="noopener">Datenschutz</a>
    <a href="https://berent.ai" target="_blank" rel="noopener">← Zurück zur Hauptseite</a>
  </div>
</footer>
```

Alle Links die den Blog verlassen: `target="_blank" rel="noopener"`.

## Ziel-Dateistruktur

```
blog/
  index.html                    ← Blog-Übersicht (statisch)
  posts.json                    ← Zentrale Post-Datenbank
  sitemap.xml                   ← Eigene Sitemap für blog.berent.ai
  robots.txt                    ← Crawling erlauben + Sitemap-Verweis
  vercel.json                   ← Clean URLs + Rewrites
  manifest.json                 ← PWA-Manifest
  /assets/
    /fonts/
      bebas-neue-regular.woff2
      lora-300.woff2
      lora-400.woff2
      lora-600.woff2
      jetbrains-mono-400.woff2
    /images/
      logo_farbe_v3.webp
      BE_Farbe_V3.png
      icon-192.png              ← PWA (aus BE_Farbe_V3.png erzeugen, 192x192)
      icon-512.png              ← PWA (aus BE_Farbe_V3.png erzeugen, 512x512)
      apple-touch-icon.png      ← iOS (180x180)
  /css/
    style.css                   ← Haupt-Stylesheet (reines CSS, kein Tailwind)
  /posts/
    beispiel-post.html          ← Ein Beispiel-Post zum Testen
```

## vercel.json

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

Damit wird `blog.berent.ai/mein-beitrag` auf `/posts/mein-beitrag.html` gemappt.

## Referenzdatei: linkedin-posts.json

Im Repo liegt eine Datei `linkedin-posts.json` (wird mitgeliefert), die alle geplanten Posts mit Metadaten enthält. Diese Datei dient dem späteren Blog-Publisher-Skill als Quelle. Sie enthält pro Post: `source_file`, `slug`, `title`, `date`, `tags`, `linkedin_url`, `status`.

Für den Erstpush wird nur der erste Post verwendet. Die `posts.json` (die das Blog-System selbst nutzt) wird aus den relevanten Feldern der `linkedin-posts.json` abgeleitet.

## posts.json — Struktur

```json
[
  {
    "slug": "ambient-ai-hedy",
    "title": "KI, die im Hintergrund für dich arbeitet...",
    "date": "2026-04-11",
    "teaser": "Ambient AI – ein Konzept, das meine Sicht auf KI-Implementierung nachhaltig verändert hat. Was Julian Pscheid von Hedy AI auf dem KI-Summit Germany beschrieben hat.",
    "tags": ["Hedy", "Ambient AI"],
    "linkedin_url": "https://www.linkedin.com/feed/update/urn:li:activity:7448642198016806912"
  }
]
```

## index.html — Blog-Übersicht

### Layout

```
┌─────────────────────────────────────────┐
│  Logo (32px, links)    "Zur Website →"  │  ← target="_blank" auf berent.ai
├─────────────────────────────────────────┤
│                                         │
│  BLOG (Bebas Neue, Kupfer, groß)        │
│  Beratung + Entwicklung · Gedanken      │  ← Muted-Farbe
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ + Titel des Beitrags            │   │  ← Plus-Symbol in Gold, Titel in Kupfer
│  │   11.04.2026 · VAaaS, KI        │   │  ← Datum + Tags in Muted
│  │   Teaser-Text hier...            │   │  ← Fließtext-Farbe
│  └──────────────────────────────────┘   │
│                                         │
│  (weitere Posts)                        │
│                                         │
├─────────────────────────────────────────┤
│  Footer (Pflichtstruktur, s.o.)         │
└─────────────────────────────────────────┘
```

### Anforderungen

- Statisch: Alle Posts stehen als HTML-Elemente im DOM (SEO)
- Kein JavaScript zum Rendern der Post-Liste — die Übersichtsseite wird bei jedem neuen Post statisch neu generiert (durch den Claude-Skill in Stufe 2)
- Jeder Post-Eintrag verlinkt auf `/{slug}` (Vercel-Rewrite löst auf)
- Posts absteigend nach Datum sortiert
- Kein Tag-Filter im ersten Wurf (kommt später)
- Responsive: Mobile-first, max-width ~720px für Lesbarkeit

### SEO-Elemente

```html
<title>Blog — BERENT | Beratung + Entwicklung</title>
<meta name="description" content="Gedanken zu KI-Transformation, Automatisierung und Telefonassistenten im Mittelstand.">
<meta property="og:title" content="Blog — BERENT">
<meta property="og:description" content="Gedanken zu KI-Transformation, Automatisierung und Telefonassistenten im Mittelstand.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://blog.berent.ai">
<link rel="canonical" href="https://blog.berent.ai">
```

## Einzelseite (posts/*.html) — Template

### Layout

```
┌─────────────────────────────────────────┐
│  Logo (32px, links)   "← Übersicht"    │  ← Link auf /index.html (gleicher Tab)
├─────────────────────────────────────────┤
│                                         │
│  HEADLINE (Bebas Neue, Kupfer, groß)    │
│  11.04.2026 · VAaaS, KI-Transformation │  ← Datum + Tags in Muted
│                                         │
│  ───────── (Kupfer-Linie, 1px) ───────  │
│                                         │
│  Post-Inhalt (Lora 300, --text)         │
│  Absätze mit großzügigem Zeilenabstand  │
│  (line-height: 1.7)                     │
│                                         │
│  ───────── (Kupfer-Linie, 1px) ───────  │
│                                         │
│  "Auf LinkedIn lesen →"                 │  ← target="_blank", nur wenn linkedin_url
│                                         │
├─────────────────────────────────────────┤
│  Footer (Pflichtstruktur, s.o.)         │
└─────────────────────────────────────────┘
```

### SEO-Elemente pro Post

```html
<title>[Post-Titel] — BERENT Blog</title>
<meta name="description" content="[Teaser-Text]">
<meta property="og:title" content="[Post-Titel]">
<meta property="og:description" content="[Teaser-Text]">
<meta property="og:type" content="article">
<meta property="og:url" content="https://blog.berent.ai/[slug]">
<link rel="canonical" href="https://blog.berent.ai/[slug]">
```

### Schema.org Article-Markup

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Post-Titel]",
  "datePublished": "[ISO-Datum]",
  "author": {
    "@type": "Person",
    "name": "Marcus Kunkel",
    "url": "https://berent.ai/profil.html"
  },
  "publisher": {
    "@type": "Organization",
    "name": "BERENT | Beratung + Entwicklung",
    "url": "https://berent.ai"
  },
  "description": "[Teaser]",
  "mainEntityOfPage": "https://blog.berent.ai/[slug]"
}
</script>
```

## sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://blog.berent.ai/</loc>
    <lastmod>2026-04-11</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://blog.berent.ai/ambient-ai-hedy</loc>
    <lastmod>2026-04-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

Wird bei jedem neuen Post erweitert (durch den Skill in Stufe 2).

## robots.txt

```
User-agent: *
Allow: /

Sitemap: https://blog.berent.ai/sitemap.xml
```

## manifest.json (PWA)

```json
{
  "name": "BERENT Blog",
  "short_name": "BERENT Blog",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#090806",
  "theme_color": "#B5742A",
  "icons": [
    { "src": "/assets/images/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/images/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

## Erster Post: Ambient AI / Hedy

Erstelle `/posts/ambient-ai-hedy.html` mit dem folgenden Inhalt (1:1 aus LinkedIn übernommen, als HTML-Absätze formatiert):

**Titel:** KI, die im Hintergrund für dich arbeitet...
**Datum:** 2026-04-11
**Tags:** Hedy, Ambient AI
**LinkedIn-URL:** https://www.linkedin.com/feed/update/urn:li:activity:7448642198016806912

**Post-Inhalt (als HTML-Absätze umsetzen):**

```
KI, die im Hintergrund für dich arbeitet...

... nicht als Überwachung, Sondern als stille Unterstützung.

Das ist Ambient AI – ein Konzept, das Julian Pscheid, Gründer von Hedy AI, auf dem KI-Summit Germany in Bad Homburg beschrieben hat.

Ich war dabei... und dieser Vortrag hat meine Sicht auf KI-Implementierung nachhaltig verändert.


Was zeichnet Ambient AI aus?

Julian hat es auf drei Eigenschaften herunter gebrochen:

1. Verfügbar bei Bedarf

Die KI ist da, wenn du sie brauchst. Sie drängt sich nicht auf. Sie erkennt den Moment, in dem ihre Unterstützung sinnvoll ist... und bietet sie an.

Stell dir vor, du sitzt in einem Kundengespräch. Dein Gegenüber erwähnt zum dritten Mal ein Budgetproblem, ohne konkret zu werden. Eine Ambient AI erkennt dieses Muster und schlägt dir dezent vor: „Vielleicht ist jetzt der Moment, direkt nach dem Budget zu fragen."

2. Still, wenn nicht benötigt

Kein ständiges Piepen. Keine Benachrichtigungsflut. Keine KI, die permanent um Aufmerksamkeit buhlt.

Ambient AI hält sich zurück. Sie beobachtet, analysiert, wartet...
und meldet sich erst, wenn ihr Einsatz einen echten Unterschied macht.

3. Beobachtbar und kontrollierbar

Du siehst, was die KI tut. Du verstehst, weshalb sie etwas vorschlägt. Du entscheidest, was sie tun darf... und was nicht.

Transparenz statt Blackbox.

Das ist der entscheidende Unterschied zu dem, was viele Menschen befürchten, wenn sie „KI im Hintergrund" hören.
Es geht nicht um Überwachung.
Es geht um Unterstützung, die du jederzeit nachvollziehen und steuern kannst.

Weshalb mich das so angesprochen hat?

Weil Julian einen Gedanken formuliert hat, der in der aktuellen KI-Debatte häufiger untergeht:

Implementierung schlägt Modell

Nicht das nächste große Sprachmodell entscheidet über den Nutzen von KI in deinem Alltag,
sondern wie du KI in deine konkreten Arbeitsabläufe integrierst.

Die Frage lautet nicht: „Welches Tool ist das beste?"
Die Frage lautet: „Welcher meiner Arbeitsabläufe profitiert am meisten?"

Oder wie Julian es auf den Punkt gebracht hat:

Menschen, um Beziehungen aufzubauen, Urteile zu fällen, kreative Probleme zu lösen –
ein System für alles andere.

In den nächsten Wochen teile ich weitere Gedanken dazu, eingebettet in meine regulären Beiträge.

Denn Ambient AI ist für mich mehr als ein Konzept:
Es ist der Ansatz, der die Protokollkultur grundlegend verändern wird.

Nicht nachher.
Nicht als Zusammenfassung.
Sondern währenddessen.

Wenn dich das Thema interessiert: Folge mir oder schreib mir direkt.
```

**Formatierungshinweise für den HTML-Post:**
- Jeder Absatz wird ein `<p>`
- Die drei Eigenschaften (1. Verfügbar bei Bedarf, 2. Still, 3. Beobachtbar) als Zwischenüberschriften (`<h2>` oder `<h3>` in Kupfer)
- "Implementierung schlägt Modell" als hervorgehobenes Zitat (visuell abgesetzt, z.B. mit Kupfer-Border links)
- Das Julian-Zitat ebenfalls visuell absetzen
- Den CTA am Ende ("Folge mir oder schreib mir direkt") weglassen oder durch den LinkedIn-Link ersetzen

## Akzeptanzkriterien

1. `blog.berent.ai` zeigt die Übersichtsseite mit dem Post "KI, die im Hintergrund für dich arbeitet..."
2. `blog.berent.ai/ambient-ai-hedy` zeigt die Einzelseite mit dem vollständigen Post
3. Alle Texte in korrekten CI-Farben und Fonts (lokal gehostet)
4. Plus-Symbol in Gold als Bullet in der Post-Liste
5. Footer enthält Impressum + Datenschutz + Zurück-Link (alle `target="_blank"`)
6. Header enthält Logo + "Zur Website" (Übersicht) bzw. "← Übersicht" (Einzelseite)
7. Alle externen Links öffnen neuen Tab
8. Schema.org Article-Markup auf der Einzelseite
9. `sitemap.xml`, `robots.txt`, `vercel.json`, `manifest.json` vorhanden
10. PWA-Icons (192, 512, apple-touch-icon) erzeugt aus `BE_Farbe_V3.png`
11. Responsive: lesbar auf Mobile (320px) bis Desktop
12. Favicon gesetzt
13. `linkedin-posts.json` liegt im Repo als Referenzdatei für den späteren Skill
14. "Auf LinkedIn lesen →" Link am Ende des Posts (target="_blank")

## Dateien

- `/index.html` — Übersichtsseite (neu erstellen)
- `/posts/ambient-ai-hedy.html` — Erster echter Blog-Post (neu erstellen)
- `/css/style.css` — Stylesheet mit CI-Variablen + Font-Faces (neu erstellen)
- `/posts.json` — Post-Datenbank (neu erstellen)
- `/linkedin-posts.json` — LinkedIn-Link-Verwaltung für den Skill (neu erstellen)
- `/sitemap.xml` — Blog-Sitemap (neu erstellen)
- `/robots.txt` — Crawling-Konfiguration (neu erstellen)
- `/vercel.json` — Vercel-Konfiguration (neu erstellen)
- `/manifest.json` — PWA-Manifest (neu erstellen)
- `/assets/fonts/*` — Fonts herunterladen und ablegen
- `/assets/images/*` — Logos aus Hauptrepo kopieren, PWA-Icons erzeugen

## Wichtige Hinweise

- Kein Tailwind, kein Build-Schritt — reines CSS mit CSS-Variablen
- Kein JavaScript zum Rendern von Inhalten — alles statisch im HTML
- Kein Google Fonts CDN — Fonts lokal hosten (DSGVO)
- Die Logo-Dateien `logo_farbe_v3.webp` und `BE_Farbe_V3.png` müssen aus dem Repo `peerendees/berent.ai` (Ordner `images/`) kopiert werden — falls sie dort nicht unter diesen Namen existieren, im Hauptrepo nachschauen und die korrekten Dateien verwenden

## Abschluss

Wenn alle Änderungen umgesetzt sind:
```bash
git add -A
git commit -m "feat: Blog-System Erstpush — Übersicht, Template, Assets, SEO"
git push
```
