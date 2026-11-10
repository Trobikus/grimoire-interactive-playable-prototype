# Entwicklung — The Hollow

## Technik

- Node.js und npm: vorhandene Studio-Installation (siehe `../../documentation/SETUP.md`)
- Vite + TypeScript; Browserziel, keine Desktop-Shell
- `npm ci` installiert nur die manifestierten Projektpakete in diesem Projektordner

## Befehle

- `npm run dev` — lokale Entwicklung
- `npm run build` — TypeScript-Prüfung und statischer Build nach `dist/`
- `npm run preview` — lokalen Produktionsbuild ansehen

## Arbeitsregeln

GitHub-Repository-Erstellung, Push und öffentliche Veröffentlichung bleiben separate Schritte und wurden noch nicht ausgeführt. Projektabhängigkeiten und Lockfile zusammen halten; `node_modules/` und `dist/` nicht einchecken.
