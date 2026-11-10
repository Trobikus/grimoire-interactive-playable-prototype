# Notizen — The Hollow

## 10.11.2026 — Prototypstart (vor Veröffentlichung)

- Als eigenständigen Prototyp unter `projects/` angelegt, getrennt vom längerfristigen Ordner `top-down-fantasy-arpg-mmorpg`.
- Vite + TypeScript, ohne Tauri oder externe Spiel-Engine. Canvas-Zeichnung hält den Prototyp ohne Asset-Abhängigkeiten lauffähig.
- GitHub-Pages-Workflow vorbereitet; öffentliche Veröffentlichung steht noch aus.
- Der Sound-Schalter ist derzeit nur ein UI-Platzhalter; es gibt keine Audioausgabe.

## 10.11.2026 — Vorführreife 0.2.0

- Quest jetzt mit erkennbarem Tor und erreichbarem Siegabschluss; Neustart setzt Ausrüstung und Werte verlässlich zurück.
- Heiltrank kommt garantiert als erster Drop in die Tasche und wird mit Q genutzt. Zweiter Kill garantiert den Wächterwams; dritter Kill öffnet den Ausgang und lässt die Mondstahl-Klinge fallen. Gold droppt nach jedem Kill.
- Rüstung reduziert Gegner-Schaden. Synth-SFX sind optional, starten nach bewusster Aktivierung und können stumm bleiben.
- Kurztasten-Eingabe so angepasst, dass schnelle E/Q-Tastenimpulse nicht vor dem nächsten Animationsframe verloren gehen.

## 10.11.2026 — Action-RPG-Politur 0.3.0

- Leertaste löst nun genau einen Angriff pro Tastendruck aus; Gedrückthalten wiederholt die Attacke nicht.
- Shift führt einen kurzen Ausweichschritt mit 0,48 Sekunden Unverwundbarkeit und 1,1 Sekunden Abklingzeit aus.
- Nach drei Wachen erscheint ein eigener Gruftwächter mit größerem Sprite, eigenem Lebensbalken und stärkerem Treffer. Erst sein Fall öffnet das Tor.
- Ziel: den Prototyp als kleine Action-RPG-Vertikalprobe lesbar machen, ohne AAA-Umfang vorzutäuschen.
