import "./style.css";
import { Game } from "./game.ts";

const root = document.querySelector<HTMLDivElement>("#app")!;
root.innerHTML = `
  <main class="shell">
    <header class="topbar"><a class="brand" href="#" aria-label="Grimoire Interactive"><span class="brand-mark">✦</span><span>GRIMOIRE <i>INTERACTIVE</i></span></a><div class="top-meta"><span class="live-dot"></span> PLAYABLE PROTOTYPE <span class="divider">/</span> BUILD 0.2.0</div><button class="sound-button muted-sound" id="sound" aria-label="Ton einschalten">♫ <span>TON AUS</span></button></header>
    <section class="intro"><div><div class="eyebrow">EIN SPIELBARER ENTWICKLUNGSSTAND</div><h1>THE <em>HOLLOW</em></h1><p>Ein Flüstern lockt dich in die vergessene Gruft. Was dort unten ruht, gehört bald dir — wenn du es überlebst.</p></div><div class="intro-stamp"><span>EARLY</span><b>ACCESS</b><small>DEMO · 2026</small></div></section>
    <section class="game-layout"><div class="game-frame"><div class="frame-top"><span><b class="frame-light"></b> GRUFT DER VERLORENEN</span><span>FLOOR <b>01</b> <span class="frame-sep">·</span> <span id="clock">00:00</span></span></div><div class="canvas-wrap"><canvas id="game" aria-label="Spielfeld The Hollow"></canvas><div class="overlay" id="overlay"><div class="overlay-rune">✦</div><div class="eyebrow">GRIMOIRE INTERACTIVE PRESENTS</div><h2>THE <em>HOLLOW</em></h2><p>Die Gruft hat dich gerufen.</p><button class="primary-button" id="start">RUNTER IN DIE GRUFT <span>→</span></button><small>WASD / PFEILTASTEN BEWEGEN · SPACE ANGREIFEN · E AKTION · Q TRANK</small></div><div class="toast" id="toast"></div><div class="mobile-controls"><button data-key="ArrowUp">▲</button><div><button data-key="ArrowLeft">◀</button><button data-key="Space" class="attack-button">✦</button><button data-key="ArrowRight">▶</button></div><button data-key="ArrowDown">▼</button><button data-key="e" class="interact-button">E · AKTION</button></div></div><div class="frame-bottom"><span><span class="keycap">W A S D</span> BEWEGEN <span class="bottom-gap"></span><span class="keycap wide">SPACE</span> ANGRIFF <span class="bottom-gap"></span><span class="keycap">E</span> AKTION <span class="keycap">Q</span> TRANK</span><span>FINDEN · KÄMPFEN · ENTKOMMEN</span></div></div>
    <aside class="side-panel"><section class="panel-card hero-card"><div class="card-heading">DEIN ABENTEURER <span>LV. <b id="level">01</b></span></div><div class="hero-row"><div class="hero-portrait">♟<span class="portrait-spark">✦</span></div><div><h3>Der Wanderer</h3><p>Klingenhüter <span>·</span> Mensch</p></div></div><div class="stat"><div class="stat-label"><span>LEBEN</span><b id="hp-label">100 / 100</b></div><div class="meter"><i id="hp-meter"></i></div></div><div class="stat"><div class="stat-label"><span>ERFAHRUNG</span><b id="xp-label">0 / 100</b></div><div class="meter xp-meter"><i id="xp-meter"></i></div></div><div class="quick-stats"><div><small>ANGRIFF</small><b id="attack-stat">12</b></div><div><small>RÜSTUNG</small><b id="defense-stat">0</b></div><div><small>GOLD</small><b>◈ <span id="gold">0</span></b></div><div><small>GEFALLEN</small><b id="kills">0</b></div></div></section>
    <section class="panel-card inventory-card"><div class="card-heading">AUSRÜSTUNG <span class="subtle">TASCHE <b id="bag-count">0</b>/8</span></div><div class="equipment"><div class="equip-slot equipped" id="weapon-slot"><span class="slot-label">WAFFE</span><span class="slot-icon">⚔</span><span class="slot-name" id="weapon-name">Rostige Klinge</span></div><div class="equip-slot" id="armor-slot"><span class="slot-label">RÜSTUNG</span><span class="slot-icon empty" id="armor-icon">—</span><span class="slot-name muted" id="armor-name">Leer</span></div></div><div class="loot-heading">BEUTE AM BODEN <span>AUFHEBEN MIT E</span></div><div class="loot-list" id="loot-list"><div class="empty-loot">Noch nichts gefunden.<br><span>Besiege Gegner, um Beute zu erhalten.</span></div></div><div class="loot-heading inventory-heading">TASCHE <span>Q · TRANK TRINKEN</span></div><div class="loot-list bag-list" id="inventory-list"><div class="empty-loot">Deine Tasche ist leer.</div></div></section>
    <section class="quest-card"><span class="quest-icon">✧</span><div><small>AKTUELLES ZIEL</small><b id="quest">Säubere die Gruft</b><span id="quest-detail">Besiege 3 Gruftwachen</span></div><span class="quest-progress" id="quest-progress">0/3</span></section>
    </aside></section>
    <footer><span>© 2026 GRIMOIRE INTERACTIVE</span><span>EIN KLEINER SCHRITT AUF EINER GROSSEN REISE <b>✦</b></span><button id="restart">NEUER VERSUCH ↗</button></footer>
  </main>`;

const game = new Game(document.querySelector<HTMLCanvasElement>("#game")!, {
  hp: document.querySelector("#hp-label")!, hpMeter: document.querySelector("#hp-meter")!, xp: document.querySelector("#xp-label")!, xpMeter: document.querySelector("#xp-meter")!, gold: document.querySelector("#gold")!, kills: document.querySelector("#kills")!, attack: document.querySelector("#attack-stat")!, defense: document.querySelector("#defense-stat")!, level: document.querySelector("#level")!, bag: document.querySelector("#bag-count")!, loot: document.querySelector("#loot-list")!, inventory: document.querySelector("#inventory-list")!, weaponName: document.querySelector("#weapon-name")!, armorName: document.querySelector("#armor-name")!, armorIcon: document.querySelector("#armor-icon")!, quest: document.querySelector("#quest")!, questDetail: document.querySelector("#quest-detail")!, questProgress: document.querySelector("#quest-progress")!, toast: document.querySelector("#toast")!, overlay: document.querySelector("#overlay")!, clock: document.querySelector("#clock")!,
});
document.querySelector("#start")!.addEventListener("click", () => game.start());
document.querySelector("#restart")!.addEventListener("click", () => game.reset());
document.querySelectorAll<HTMLButtonElement>(".mobile-controls button").forEach((b) => {
  const key = b.dataset.key!;
  const down = (e: Event) => { e.preventDefault(); game.key(key, true); };
  const up = (e: Event) => { e.preventDefault(); game.key(key, false); };
  b.addEventListener("pointerdown", down); b.addEventListener("pointerup", up); b.addEventListener("pointerleave", up);
});
document.querySelector<HTMLButtonElement>("#sound")!.addEventListener("click", (e) => {
  const b = e.currentTarget as HTMLButtonElement;
  const on = game.toggleSound();
  b.classList.toggle("muted-sound", !on);
  b.querySelector("span")!.textContent = on ? "TON AN" : "TON AUS";
  b.setAttribute("aria-label", on ? "Ton ausschalten" : "Ton einschalten");
});
game.run();
