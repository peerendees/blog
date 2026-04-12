# Cursor-Briefing: Blog-Strukturbereinigung (posts/-Konvention)

## Kontext

Blog auf blog.berent.ai, Repo `peerendees/blog`. Vercel mit `cleanUrls: true`.
Erster Post (`ambient-ai-hedy.html`) liegt im Root statt in `posts/`.
Zweiter Post (`marathon-muenchen-ausloeser.html`) liegt korrekt in `posts/`.
Die Übersichtsseite verlinkt vermutlich inkonsistent.

## Aufgabe

### 1. Datei verschieben

```bash
mv ambient-ai-hedy.html posts/ambient-ai-hedy.html
```

### 2. build.js prüfen und korrigieren

Sicherstellen, dass `build.js` für alle Posts den Pfad `/posts/[slug]` generiert — sowohl in der index.html (Post-Cards) als auch in der sitemap.xml.

Erwartete URL-Struktur:
- Übersicht: `blog.berent.ai/`
- Einzelseite: `blog.berent.ai/posts/[slug]` (Clean URL, kein .html)
- Canonical: `https://blog.berent.ai/posts/[slug]`

### 3. Canonical-URL in ambient-ai-hedy.html prüfen

Falls die Canonical-URL und og:url noch auf `/ambient-ai-hedy` zeigen, auf `/posts/ambient-ai-hedy` korrigieren.

### 4. Testen

Nach Push prüfen:
- `blog.berent.ai/` → Übersicht mit beiden Posts, Links zeigen auf `/posts/[slug]`
- `blog.berent.ai/posts/ambient-ai-hedy` → erreichbar
- `blog.berent.ai/posts/marathon-muenchen-ausloeser` → erreichbar
- `blog.berent.ai/ambient-ai-hedy` → sollte 404 sein (nicht mehr im Root)

## Konvention für die Zukunft

Alle Blog-Post-HTML-Dateien liegen in `posts/`. Der Blog-Publisher-Skill liefert sie bereits so.
