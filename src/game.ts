type UI = Record<string, HTMLElement>;
type Mob = { x:number; y:number; hp:number; max:number; hit:number; kind:"wraith"|"slime"; attack:number; dead:boolean; hurt:number };
type Loot = { x:number; y:number; name:string; type:"gold"|"potion"|"sword"; value:number; taken:boolean };

export class Game {
  private ctx: CanvasRenderingContext2D;
  private keys = new Set<string>();
  private running = false;
  private ended = false;
  private player = { x:400, y:300, hp:100, max:100, xp:0, level:1, gold:0, kills:0, damage:12, swing:0, invuln:0, facing:0 };
  private mobs: Mob[] = [];
  private loot: Loot[] = [];
  private elapsed = 0;
  private last = 0;
  private spawnTimer = 2;
  private toastTimer = 0;
  private particles: {x:number;y:number;life:number;color:string}[] = [];
  private readonly W=800;
  private readonly H=600;
  constructor(private canvas:HTMLCanvasElement, private ui:UI) {
    this.ctx=canvas.getContext("2d")!;
    this.canvas.width=this.W; this.canvas.height=this.H;
    addEventListener("keydown", e=>{ if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault(); this.key(e.code==="Space"?"Space":e.key.toLowerCase(),true); });
    addEventListener("keyup", e=>this.key(e.code==="Space"?"Space":e.key.toLowerCase(),false));
  }
  key(key:string,down:boolean){ if(down)this.keys.add(key.toLowerCase()); else this.keys.delete(key.toLowerCase()); }
  start(){ if(this.ended){this.reset();return;} this.running=true; this.ui.overlay.classList.add("hidden"); this.toast("Die Gruft erwacht …"); }
  reset(){ this.player={x:400,y:300,hp:100,max:100,xp:0,level:1,gold:0,kills:0,damage:12,swing:0,invuln:0,facing:0}; this.mobs=[];this.loot=[];this.elapsed=0;this.spawnTimer=1;this.ended=false;this.running=true;this.ui.overlay.classList.add("hidden");this.updateUI(); }
  run(){ requestAnimationFrame(t=>this.frame(t)); }
  private frame(t:number){ const dt=Math.min((t-this.last)/1000||0,0.04);this.last=t;if(this.running&&!this.ended)this.update(dt);this.draw();requestAnimationFrame(n=>this.frame(n)); }
  private update(dt:number){ this.elapsed+=dt; this.player.swing=Math.max(0,this.player.swing-dt);this.player.invuln=Math.max(0,this.player.invuln-dt);this.toastTimer=Math.max(0,this.toastTimer-dt);this.ui.toast.classList.toggle("visible",this.toastTimer>0);
    let dx=0,dy=0;if(this.keys.has("w")||this.keys.has("arrowup"))dy--;if(this.keys.has("s")||this.keys.has("arrowdown"))dy++;if(this.keys.has("a")||this.keys.has("arrowleft"))dx--;if(this.keys.has("d")||this.keys.has("arrowright"))dx++;
    if(dx||dy){const l=Math.hypot(dx,dy);dx/=l;dy/=l;this.player.x=Math.max(48,Math.min(this.W-48,this.player.x+dx*190*dt));this.player.y=Math.max(70,Math.min(this.H-48,this.player.y+dy*190*dt));this.player.facing=Math.atan2(dy,dx);}
    if(this.keys.has("space")&&this.player.swing<=0)this.attack();
    if(this.keys.has("e"))this.pickup();
    this.spawnTimer-=dt;if(this.spawnTimer<=0&&this.mobs.filter(m=>!m.dead).length<3){this.spawn();this.spawnTimer=Math.max(2.1,4.2-this.elapsed/180);}
    for(const m of this.mobs){if(m.dead)continue;m.hurt=Math.max(0,m.hurt-dt);m.attack-=dt;const d=Math.hypot(this.player.x-m.x,this.player.y-m.y);if(d>34){m.x+=(this.player.x-m.x)/d*38*dt;m.y+=(this.player.y-m.y)/d*38*dt;}else if(m.attack<=0&&this.player.invuln<=0){this.player.hp=Math.max(0,this.player.hp-7);this.player.invuln=.75;m.attack=1.55;this.toast("Die Gruftwache trifft dich!");if(this.player.hp===0)this.gameOver();}}
    this.particles=this.particles.filter(p=>(p.life-=dt)>0);this.updateUI();
  }
  private spawn(){const edge=Math.floor(Math.random()*4), pad=40;let x=edge===0?pad:edge===1?this.W-pad:Math.random()*this.W,y=edge===2?pad:edge===3?this.H-pad:70+Math.random()*(this.H-110);if(y<70)y=70;
    const kind=Math.random()<.68?"wraith":"slime";this.mobs.push({x,y,hp:kind==="wraith"?30:42,max:kind==="wraith"?30:42,hit:0,kind,attack:1.2+Math.random(),dead:false,hurt:0});}
  private attack(){this.player.swing=.34;let hits=0;for(const m of this.mobs){if(m.dead)continue;const d=Math.hypot(m.x-this.player.x,m.y-this.player.y);if(d<78){m.hp-=this.player.damage;m.hurt=.16;hits++;this.burst(m.x,m.y,"#f1c477");if(m.hp<=0){m.dead=true;this.defeat(m);}}}if(!hits)this.toast("Dein Hieb schneidet durch die Luft."); }
  private defeat(m:Mob){this.player.kills++;this.player.xp+=35;this.toast(m.kind==="wraith"?"Gruftwache besiegt · +35 EP":"Schleim besiegt · +35 EP");if(Math.random()<.86)this.loot.push({x:m.x,y:m.y,name:"Goldmünzen",type:"gold",value:5+Math.floor(Math.random()*12),taken:false});if(Math.random()<.22)this.loot.push({x:m.x+12,y:m.y+8,name:"Heiltrank",type:"potion",value:35,taken:false});if(this.player.kills===3&&!this.loot.some(l=>l.type==="sword")){this.loot.push({x:m.x-14,y:m.y+6,name:"Mondstahl-Klinge",type:"sword",value:8,taken:false});this.toast("Ein seltenes Leuchten! Hebe die Klinge mit E auf.");}while(this.player.xp>=this.player.level*100){this.player.xp-=this.player.level*100;this.player.level++;this.player.max+=15;this.player.hp=Math.min(this.player.max,this.player.hp+35);this.player.damage+=2;this.toast("Aufgestiegen! Du bist jetzt Stufe "+this.player.level+".");}}
  private pickup(){const l=this.loot.find(a=>!a.taken&&Math.hypot(a.x-this.player.x,a.y-this.player.y)<55);if(!l)return;l.taken=true;if(l.type==="gold")this.player.gold+=l.value;else if(l.type==="potion"){this.player.hp=Math.min(this.player.max,this.player.hp+l.value);this.toast("Heiltrank getrunken · +"+l.value+" Leben");}else{this.player.damage+=l.value;this.ui.weaponName.textContent=l.name;this.ui.attack.textContent=String(this.player.damage);this.toast("Mondstahl-Klinge ausgerüstet · Angriff +"+l.value);}if(l.type==="gold")this.toast("+"+l.value+" Gold");this.updateUI();}
  private gameOver(){this.ended=true;this.running=false;this.ui.overlay.classList.remove("hidden");this.ui.overlay.innerHTML=`<div class="overlay-rune">☾</div><div class="eyebrow">DIE GRUFT HAT GEWONNEN</div><h2>ENDE <em>DER REISE</em></h2><p>Du hast ${this.player.kills} Gegner besiegt und ${this.player.gold} Gold gefunden.</p><button class="primary-button" id="play-again">NOCH EIN VERSUCH <span>↻</span></button><small>DEIN FORTSCHRITT WIRD BEIM NEUSTART ZURÜCKGESETZT</small>`;this.ui.overlay.querySelector("button")!.addEventListener("click",()=>this.reset());}
  private toast(s:string){this.ui.toast.textContent=s;this.toastTimer=1.7;this.ui.toast.classList.add("visible");}
  private burst(x:number,y:number,color:string){for(let i=0;i<7;i++)this.particles.push({x:x+(Math.random()-.5)*25,y:y+(Math.random()-.5)*22,life:.35+Math.random()*.4,color});}
  private updateUI(){const p=this.player;this.ui.hp.textContent=`${p.hp} / ${p.max}`;(this.ui.hpMeter as HTMLElement).style.width=`${p.hp/p.max*100}%`;this.ui.xp.textContent=`${p.xp} / ${p.level*100}`;(this.ui.xpMeter as HTMLElement).style.width=`${p.xp/(p.level*100)*100}%`;this.ui.gold.textContent=String(p.gold);this.ui.kills.textContent=String(p.kills);this.ui.attack.textContent=String(p.damage);this.ui.level.textContent=String(p.level).padStart(2,"0");const bag=this.loot.filter(l=>l.taken&&l.type!=="gold").length;this.ui.bag.textContent=String(Math.min(8,bag));this.ui.quest.textContent=p.kills>=3?"Finde den Ausgang":"Säubere die Gruft";this.ui.questDetail.textContent=p.kills>=3?"Die Mondstahl-Klinge wartet auf dich":"Besiege 3 Gruftwachen";this.ui.questProgress.textContent=p.kills>=3?"✓":`${Math.min(3,p.kills)}/3`;const remain=this.loot.filter(l=>!l.taken);this.ui.loot.innerHTML=remain.length?remain.map(l=>`<div class="loot-item"><span class="loot-icon ${l.type}">${l.type==="gold"?"◈":l.type==="potion"?"♜":"⚔"}</span><span>${l.name}</span><b>${l.type==="gold"?`+${l.value}`:l.type==="sword"?`+${l.value} ANG`:"HEILT"}</b></div>`).join(""):`<div class="empty-loot">${this.loot.some(l=>l.taken)?"Deine Beute ist eingesammelt.":"Noch nichts gefunden."}<br><span>E drücken, um nahe Beute aufzuheben.</span></div>`;this.ui.clock.textContent=`${String(Math.floor(this.elapsed/60)).padStart(2,"0")}:${String(Math.floor(this.elapsed%60)).padStart(2,"0")}`;}
  private draw(){const c=this.ctx;c.imageSmoothingEnabled=false;c.clearRect(0,0,this.W,this.H);c.fillStyle="#1a201b";c.fillRect(0,0,this.W,this.H);
    // worn flagstone floor
    for(let y=52;y<this.H;y+=48)for(let x=0;x<this.W;x+=64){const seed=((x*13+y*7)%9);c.fillStyle=seed<3?"#222923":seed<6?"#202620":"#252b24";c.fillRect(x+1+(y%96?18:0),y+1,62,46);c.fillStyle="#2b3129";c.fillRect(x+8+(y%96?18:0),y+7,2,2);if(seed===2){c.strokeStyle="#171d19";c.beginPath();c.moveTo(x+42,y+18);c.lineTo(x+39,y+27);c.lineTo(x+46,y+31);c.stroke();}}
    // walls and crypt pillars
    c.fillStyle="#111512";c.fillRect(0,0,this.W,52);c.fillRect(0,0,24,this.H);c.fillRect(this.W-24,0,24,this.H);c.fillRect(0,this.H-20,this.W,20);c.fillStyle="#343a31";c.fillRect(24,48,this.W-48,5);c.fillRect(24,48,5,this.H-68);c.fillRect(this.W-29,48,5,this.H-68);
    for(const [x,y] of [[120,125],[680,125],[120,475],[680,475]] as number[][]){c.fillStyle="#111512";c.fillRect(x-12,y-12,34,34);c.fillStyle="#474539";c.fillRect(x-9,y-9,28,28);c.fillStyle="#68614a";c.fillRect(x-5,y-5,20,20);c.fillStyle="#343b32";c.fillRect(x-1,y-1,12,12);}
    // lantern pools
    for(const [x,y] of [[70,86],[730,86],[70,520],[730,520]] as number[][]){const g=c.createRadialGradient(x,y,3,x,y,92);g.addColorStop(0,"rgba(214,151,67,.17)");g.addColorStop(1,"rgba(214,151,67,0)");c.fillStyle=g;c.fillRect(x-92,y-92,184,184);c.fillStyle="#634b2c";c.fillRect(x-3,y-9,6,12);c.fillStyle="#f2bf61";c.fillRect(x-2,y-14,4,6);c.fillStyle="#ffe6a0";c.fillRect(x-1,y-12,2,3);}
    for(const l of this.loot)if(!l.taken){c.globalAlpha=.65+Math.sin(this.elapsed*5+l.x)*.25;c.fillStyle=l.type==="gold"?"#f3ce72":l.type==="potion"?"#dc7870":"#a5c4d1";c.fillRect(l.x-4,l.y-4,8,8);c.fillRect(l.x-2,l.y-7,4,3);c.globalAlpha=1;}
    for(const m of this.mobs)if(!m.dead)this.drawMob(m);
    this.drawPlayer();for(const p of this.particles){c.globalAlpha=p.life*1.6;c.fillStyle=p.color;c.fillRect(p.x,p.y,3,3);}c.globalAlpha=1;
    const v=c.createRadialGradient(400,300,220,400,300,490);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(5,8,7,.6)");c.fillStyle=v;c.fillRect(0,0,this.W,this.H);
  }
  private drawMob(m:Mob){const c=this.ctx;c.save();c.translate(m.x,m.y);c.fillStyle="rgba(0,0,0,.35)";c.fillRect(-13,11,26,5);if(m.kind==="wraith"){c.fillStyle=m.hurt?"#ffe3ca":"#93a99e";c.fillRect(-9,-15,18,20);c.fillRect(-13,-9,26,10);c.fillStyle="#ccd9c5";c.fillRect(-7,-21,14,9);c.fillStyle="#a84f45";c.fillRect(-5,-17,3,3);c.fillRect(3,-17,3,3);c.fillStyle="#6f877a";c.fillRect(-6,5,5,9);c.fillRect(2,5,5,9);}else{c.fillStyle=m.hurt?"#f5d7a7":"#a2bd73";c.fillRect(-13,-9,26,16);c.fillRect(-9,-13,18,4);c.fillStyle="#e7dca9";c.fillRect(-6,-5,3,3);c.fillRect(4,-5,3,3);c.fillStyle="#758e52";c.fillRect(-8,5,4,6);c.fillRect(4,5,4,6);}c.restore();if(m.hp<m.max){c.fillStyle="#301d1b";c.fillRect(m.x-15,m.y-25,30,3);c.fillStyle="#bd6653";c.fillRect(m.x-15,m.y-25,30*m.hp/m.max,3);}}
  private drawPlayer(){const c=this.ctx,p=this.player;c.save();c.translate(p.x,p.y);c.fillStyle="rgba(0,0,0,.35)";c.fillRect(-13,12,26,5);if(p.invuln>0&&Math.floor(this.elapsed*18)%2)c.globalAlpha=.45;c.fillStyle="#273447";c.fillRect(-10,-6,20,17);c.fillStyle="#415872";c.fillRect(-13,-3,5,11);c.fillRect(8,-3,5,11);c.fillStyle="#d5b98d";c.fillRect(-7,-17,14,13);c.fillStyle="#4b3830";c.fillRect(-8,-19,16,5);c.fillRect(-6,-22,12,4);c.fillStyle="#e7c588";c.fillRect(-5,-12,2,2);c.fillRect(4,-12,2,2);c.fillStyle="#94784d";c.fillRect(-8,10,6,6);c.fillRect(2,10,6,6);if(p.swing>0){c.save();c.rotate(p.facing);c.fillStyle="#c7d1ce";c.fillRect(13,-3,22,4);c.fillStyle="#e8cc8f";c.fillRect(10,-5,5,8);c.strokeStyle="rgba(244,218,160,.55)";c.lineWidth=3;c.beginPath();c.arc(0,0,48,-.9,.9);c.stroke();c.restore();}else{c.save();c.rotate(p.facing);c.fillStyle="#9f804e";c.fillRect(10,-2,15,4);c.fillStyle="#bac8cc";c.fillRect(22,-4,13,4);c.restore();}c.restore();}
}
