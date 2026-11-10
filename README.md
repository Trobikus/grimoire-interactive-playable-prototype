# Grimoire Interactive — The Hollow

Eigenständiger, browserbasierter Playable Prototype für die Vorführung am 11.11.2026. Das Projekt ist ein kleiner, nachvollziehbarer Entwicklungsstand und kein fertiges Produkt.

**Demo spielen:** [The Hollow auf GitHub Pages](https://trobikus.github.io/grimoire-interactive-playable-prototype/)

## Spielen

Für die Vorführung genügt ein aktueller Browser: nach erfolgreichem GitHub-Pages-Release den Link öffnen und **Runter in die Gruft** wählen. Es ist keine Installation erforderlich. Lokal kann der gebaute Ordner `dist/` direkt über einen statischen Webserver bereitgestellt werden.

## Lokal entwickeln

Voraussetzung: die studio-weit installierte Node.js-/npm-Umgebung. Im Projektordner:

```sh
npm ci
npm run dev
```

Build und lokale Vorschau:

```sh
npm run build
npm run preview
```

## Steuerung und Spielschleife

- WASD oder Pfeiltasten: bewegen
- Leertaste antippen: ein einzelner Klingenschlag
- Shift: kurzer Ausweichschritt mit knapper Unverwundbarkeit
- E: nahe Beute einsammeln; nach drei Siegen am geöffneten Tor entkommen
- Q: Heiltrank aus der Tasche trinken
- Gegner besiegen, EP sammeln, Stufen aufsteigen, Gold und Tränke finden
- Nach drei besiegten Gruftwachen erscheint der Gruftwächter als Boss; erst nach seinem Fall öffnet sich der Ausgang
- Der Boss kündigt seinen Flächenangriff mit einem pulsierenden Kreis an; mit Shift aus dem Wirkungsbereich ausweichen
- Wächterwams und Mondstahl-Klinge verbessern die Ausrüstung
- Ein Sieg- und ein Game-over-Bildschirm schließen den Durchlauf ab; ein Neustart setzt Werte und Ausrüstung zurück
- Bei 0 Leben kann ein neuer Versuch gestartet werden

Touch-Steuerung ist für die Vorführung auf Mobilgeräten vorhanden.

## Aufbau

- `src/main.ts` — UI-Einstieg und Verknüpfung der Bedienelemente
- `src/game.ts` — Spielzustand, Bewegung, Kampf, Gegner, Beute und Canvas-Zeichnung
- `src/style.css` — responsives Grimoire-Branding und HUD
- `vite.config.ts` — Vite- und GitHub-Pages-Basispfad

Keine externen Laufzeitpakete und keine Bilddateien erforderlich. Die Schriftarten werden bei bestehender Verbindung von Google Fonts geladen; System-Fallbacks bleiben verfügbar. Optionale Synth-Soundeffekte starten erst nach Aktivierung über **Ton an**.

## GitHub Pages

Ein Workflow unter `.github/workflows/pages.yml` baut und veröffentlicht den statischen Vite-Build bei Push auf `main`. GitHub Pages ist auf **GitHub Actions** gestellt. Das öffentliche Repository ist [Trobikus/grimoire-interactive-playable-prototype](https://github.com/Trobikus/grimoire-interactive-playable-prototype); die Demo-URL verwendet dessen Repository-Namen.

## Grenzen des Prototyps

Eine einzelne Gruft, einfache Canvas-Pixelgrafik und ein Nahkampfangriff. Noch keine Speicherfunktion, keine weiteren Gebiete und kein serverseitiger Spielfortschritt. Für die Präsentation ehrlich als Prototyp kennzeichnen.
