/* ═══════════════════════════════════════════
   HARVEST HEROES — Game Engine
   ═══════════════════════════════════════════ */

const SEEDS = [
  { name: 'Tomato',   emoji: '🍅', color: '#E53935', growTime: 8,  maxKg: 3.2 },
  { name: 'Carrot',   emoji: '🥕', color: '#FF8C00', growTime: 6,  maxKg: 1.8 },
  { name: 'Broccoli', emoji: '🥦', color: '#4CAF50', growTime: 10, maxKg: 2.5 },
  { name: 'Corn',     emoji: '🌽', color: '#FFD700', growTime: 12, maxKg: 4.0 },
  { name: 'Strawberry', emoji: '🍓', color: '#FF6B9D', growTime: 5, maxKg: 1.2 },
  { name: 'Orange',   emoji: '🍊', color: '#FF9800', growTime: 9,  maxKg: 2.8 },
  { name: 'Watermelon', emoji: '🍉', color: '#66BB6A', growTime: 15, maxKg: 8.0 },
  { name: 'Pepper',   emoji: '🫑', color: '#388E3C', growTime: 7,  maxKg: 2.0 },
  { name: 'Eggplant', emoji: '🍆', color: '#7B1FA2', growTime: 11, maxKg: 3.5 },
];

const FARMERS = [
  { name: 'Sunny',  emoji: '👨‍🌾' },
  { name: 'Daisy',  emoji: '👩‍🌾' },
  { name: 'Sage',   emoji: '🧑‍🌾' },
  { name: 'Sprout', emoji: '🧒' },
];

const TOOLS = {
  none:       { emoji: '🤚', name: 'Hand' },
  water:      { emoji: '🚿', name: 'Water Can', boost: 1.5 },
  shovel:     { emoji: '🔧', name: 'Shovel', boost: 1.2 },
  fertilizer: { emoji: '💊', name: 'Fertilizer', boost: 2.0 },
};

// ─── Game State ───
const Game = {
  playerCount: 1,
  level: 1,
  players: [],
  farmerSelectStep: 0, // 0 = selecting farmer 1, 1 = selecting farmer 2
  selectedFarmerIdx: 0,
  selectedSeeds: [],
  gameTimer: null,
  gameDuration: 60, // seconds per round
  timeLeft: 60,
  animFrame: null,

  // ═══ Screen Management ═══
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      if (s.classList.contains('overlay')) s.classList.add('hidden');
    });
    const el = document.getElementById('screen-' + id);
    if (el) {
      el.classList.add('active');
      if (el.classList.contains('overlay')) el.classList.remove('hidden');
    }
  },

  // ═══ Title Screen ═══
  selectPlayers(n) {
    this.playerCount = n;
    this.players = [];
    this.farmerSelectStep = 0;
    this.selectedFarmerIdx = 0;
    document.getElementById('farmer-select-title').textContent = 'Choose Farmer 1';
    this.updateFarmerCards();
    this.showScreen('farmer');
  },

  // ═══ Farmer Select ═══
  updateFarmerCards() {
    document.querySelectorAll('.farmer-card').forEach((c, i) => {
      c.classList.toggle('selected', i === this.selectedFarmerIdx);
    });
  },

  pickFarmer(idx) {
    this.selectedFarmerIdx = idx;
    this.updateFarmerCards();
  },

  confirmFarmer() {
    const farmer = FARMERS[this.selectedFarmerIdx];
    this.players.push({
      farmer: { ...farmer },
      seeds: [],
      tool: 'none',
      x: 0, y: 0,
      totalKg: 0,
      plots: [],
      houseLevel: 1,
    });

    if (this.playerCount === 2 && this.farmerSelectStep === 0) {
      this.farmerSelectStep = 1;
      this.selectedFarmerIdx = 1; // default to next farmer
      document.getElementById('farmer-select-title').textContent = 'Choose Farmer 2';
      this.updateFarmerCards();
    } else {
      this.showSeedSelect();
    }
  },

  // ═══ Seed Select ═══
  showSeedSelect() {
    this.selectedSeeds = [];
    const grid = document.getElementById('seed-grid');
    grid.innerHTML = '';
    SEEDS.forEach((seed, i) => {
      const card = document.createElement('div');
      card.className = 'seed-card';
      card.dataset.idx = i;
      card.innerHTML = `<div class="seed-emoji">${seed.emoji}</div><div class="seed-name">${seed.name}</div>`;
      card.onclick = () => this.toggleSeed(i);
      grid.appendChild(card);
    });
    this.updateSeedUI();
    this.showScreen('seeds');
  },

  toggleSeed(idx) {
    const pos = this.selectedSeeds.indexOf(idx);
    if (pos >= 0) {
      this.selectedSeeds.splice(pos, 1);
    } else if (this.selectedSeeds.length < 3) {
      this.selectedSeeds.push(idx);
    }
    this.updateSeedUI();
  },

  updateSeedUI() {
    document.querySelectorAll('.seed-card').forEach((card, i) => {
      card.classList.toggle('selected', this.selectedSeeds.includes(i));
    });
    document.getElementById('seed-count').textContent = `${this.selectedSeeds.length} / 3 selected`;
    const btn = document.getElementById('btn-start-game');
    btn.classList.toggle('disabled', this.selectedSeeds.length < 3);
  },

  // ═══ Start Game ═══
  startFarming() {
    if (this.selectedSeeds.length < 3) return;

    // Assign seeds to all players
    const seedObjs = this.selectedSeeds.map(i => ({ ...SEEDS[i] }));
    this.players.forEach(p => {
      p.seeds = seedObjs.map(s => ({ ...s }));
      p.tool = 'none';
      p.totalKg = 0;
      p.houseLevel = 1;
      p.plots = this.createPlots(seedObjs);
    });

    this.timeLeft = this.gameDuration;
    this.showScreen('game');
    // Delay setup so DOM is visible and getBoundingClientRect works
    requestAnimationFrame(() => {
      this.setupGameScreen();
      this.startGameLoop();
    });
  },

  createPlots(seeds) {
    return seeds.map((seed, i) => ({
      seed: { ...seed },
      x: 120 + i * 100,
      y: 200,
      growth: 0,     // 0-100
      watered: 0,
      fertilized: false,
      harvested: false,
      currentKg: 0,
    }));
  },

  // ═══ Game Screen Setup ═══
  setupGameScreen() {
    const v2 = document.getElementById('viewport-2');
    const tc2 = document.getElementById('touch-controls-2');

    if (this.playerCount === 2) {
      v2.classList.remove('hidden');
      tc2.classList.remove('hidden');
    } else {
      v2.classList.add('hidden');
      tc2.classList.add('hidden');
    }

    // Set HUD
    this.players.forEach((p, i) => {
      document.getElementById(`hud-avatar-${i+1}`).textContent = p.farmer.emoji;
      document.getElementById(`hud-name-${i+1}`).textContent = p.farmer.name;
      document.getElementById(`hud-weight-${i+1}`).textContent = '0.0 kg';
      document.getElementById(`hud-tool-${i+1}`).textContent = TOOLS[p.tool].emoji;

      // Init position
      p.x = 60;
      p.y = 160;
    });

    // Setup canvases
    this.canvases = [];
    for (let i = 0; i < this.playerCount; i++) {
      const canvas = document.getElementById(`canvas-${i+1}`);
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.canvases.push({ canvas, ctx, w: rect.width, h: rect.height });
    }

    this.setupJoysticks();
  },

  // ═══ Joystick ═══
  joysticks: [{dx:0,dy:0},{dx:0,dy:0}],

  setupJoysticks() {
    for (let i = 0; i < this.playerCount; i++) {
      const zone = document.getElementById(`joystick-${i+1}`);
      const knob = document.getElementById(`knob-${i+1}`);
      const base = zone.querySelector('.joystick-base');
      let touching = false;
      let baseRect;

      const onStart = (e) => {
        touching = true;
        baseRect = base.getBoundingClientRect();
        this.handleJoystickMove(e, i, knob, baseRect);
      };
      const onMove = (e) => {
        if (!touching) return;
        e.preventDefault();
        this.handleJoystickMove(e, i, knob, baseRect);
      };
      const onEnd = () => {
        touching = false;
        this.joysticks[i] = { dx: 0, dy: 0 };
        knob.style.transform = 'translate(0, 0)';
      };

      zone.addEventListener('touchstart', onStart, { passive: false });
      zone.addEventListener('touchmove', onMove, { passive: false });
      zone.addEventListener('touchend', onEnd);
      zone.addEventListener('touchcancel', onEnd);

      // Mouse fallback
      zone.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
    }

    // Keyboard for P1 (desktop)
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup')    this.joysticks[0].dy = -1;
      if (k === 's' || k === 'arrowdown')   this.joysticks[0].dy = 1;
      if (k === 'a' || k === 'arrowleft')   this.joysticks[0].dx = -1;
      if (k === 'd' || k === 'arrowright')   this.joysticks[0].dx = 1;
      if (k === ' ' || k === 'e') this.doAction(0);
    });
    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup' || k === 's' || k === 'arrowdown') this.joysticks[0].dy = 0;
      if (k === 'a' || k === 'arrowleft' || k === 'd' || k === 'arrowright') this.joysticks[0].dx = 0;
    });
  },

  handleJoystickMove(e, idx, knob, baseRect) {
    const touch = e.touches ? e.touches[0] : e;
    const cx = baseRect.left + baseRect.width / 2;
    const cy = baseRect.top + baseRect.height / 2;
    let dx = touch.clientX - cx;
    let dy = touch.clientY - cy;
    const maxR = baseRect.width / 2 - 10;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > maxR) {
      dx = dx / dist * maxR;
      dy = dy / dist * maxR;
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    this.joysticks[idx] = {
      dx: dx / maxR,
      dy: dy / maxR,
    };
  },

  // ═══ Game Loop ═══
  startGameLoop() {
    if (this.gameTimer) clearInterval(this.gameTimer);
    if (this.animFrame) cancelAnimationFrame(this.animFrame);

    this.gameTimer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endRound();
      }
      // Grow plants
      this.players.forEach(p => {
        p.plots.forEach(plot => {
          if (!plot.harvested && plot.growth < 100) {
            let rate = 100 / (plot.seed.growTime * 10); // base growth per 100ms tick
            if (plot.watered > 0) { rate *= 1.5; plot.watered--; }
            if (plot.fertilized) rate *= 2;
            plot.growth = Math.min(100, plot.growth + rate);
            plot.currentKg = (plot.growth / 100) * plot.seed.maxKg;
          }
        });
        p.totalKg = p.plots.reduce((sum, pl) => sum + pl.currentKg, 0);
      });
    }, 100);

    const loop = () => {
      this.update();
      this.render();
      this.animFrame = requestAnimationFrame(loop);
    };
    this.animFrame = requestAnimationFrame(loop);
  },

  update() {
    const speed = 3;
    this.players.forEach((p, i) => {
      const j = this.joysticks[i];
      p.x += j.dx * speed;
      p.y += j.dy * speed;
      // Clamp
      p.x = Math.max(20, Math.min(380, p.x));
      p.y = Math.max(40, Math.min(280, p.y));

      // Check proximity to interactables
      let nearAction = null;
      let actionIcon = '✋';

      // Near shed door?
      if (p.x > 300 && p.y < 80) {
        nearAction = 'shed';
        actionIcon = '🚪';
      }

      // Near a plot?
      p.plots.forEach((plot, pi) => {
        const dist = Math.abs(p.x - plot.x) + Math.abs(p.y - plot.y);
        if (dist < 50) {
          if (p.tool === 'water') {
            nearAction = `water_${pi}`;
            actionIcon = '💧';
          } else if (p.tool === 'shovel' && plot.growth >= 100) {
            nearAction = `harvest_${pi}`;
            actionIcon = '🧺';
          } else if (p.tool === 'fertilizer') {
            nearAction = `fertilize_${pi}`;
            actionIcon = '💊';
          } else if (plot.growth >= 100 && !plot.harvested) {
            nearAction = `harvest_${pi}`;
            actionIcon = '🧺';
          }
        }
      });

      p._nearAction = nearAction;

      // Update action button
      const btn = document.getElementById(`action-btn-${i+1}`);
      if (nearAction) {
        btn.classList.remove('hidden');
        btn.querySelector('.action-icon').textContent = actionIcon;
      } else {
        btn.classList.add('hidden');
      }

      // Update HUD
      document.getElementById(`hud-weight-${i+1}`).textContent = p.totalKg.toFixed(1) + ' kg';
      document.getElementById(`hud-tool-${i+1}`).textContent = TOOLS[p.tool].emoji;
    });
  },

  // ═══ Actions ═══
  doAction(playerIdx) {
    const p = this.players[playerIdx];
    if (!p._nearAction) return;

    const action = p._nearAction;

    if (action === 'shed') {
      this._shedPlayer = playerIdx;
      const overlay = document.getElementById('screen-shed');
      overlay.classList.remove('hidden');
      overlay.classList.add('active');
      return;
    }

    const parts = action.split('_');
    const type = parts[0];
    const plotIdx = parseInt(parts[1]);
    const plot = p.plots[plotIdx];

    if (type === 'water' && p.tool === 'water') {
      plot.watered = Math.min(plot.watered + 30, 50);
      this.showFloater(playerIdx, plot.x, plot.y - 20, '💧');
    } else if (type === 'fertilize' && p.tool === 'fertilizer') {
      plot.fertilized = true;
      p.tool = 'none'; // used up
      this.showFloater(playerIdx, plot.x, plot.y - 20, '💊✨');
    } else if (type === 'harvest' && plot.growth >= 100 && !plot.harvested) {
      plot.harvested = true;
      this.showFloater(playerIdx, plot.x, plot.y - 20, `${plot.seed.emoji} ${plot.currentKg.toFixed(1)}kg`);
    }
  },

  floaters: [],
  showFloater(playerIdx, x, y, text) {
    this.floaters.push({ playerIdx, x, y, text, life: 60 });
  },

  // ═══ Shed ═══
  pickTool(tool) {
    const p = this.players[this._shedPlayer || 0];
    p.tool = tool;
    this.closeShed();
  },

  upgradeHouse() {
    const p = this.players[this._shedPlayer || 0];
    p.houseLevel++;
    this.showFloater(this._shedPlayer || 0, 180, 60, `🏠 Lv.${p.houseLevel}!`);
    this.closeShed();
  },

  closeShed() {
    const overlay = document.getElementById('screen-shed');
    overlay.classList.add('hidden');
    overlay.classList.remove('active');
  },

  // ═══ Rendering ═══
  render() {
    this.players.forEach((p, i) => {
      if (!this.canvases[i]) return;
      const { ctx, w, h } = this.canvases[i];
      this.renderWorld(ctx, w, h, p, i);
    });
  },

  renderWorld(ctx, w, h, player, idx) {
    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
    skyGrad.addColorStop(0, '#5BB5E8');
    skyGrad.addColorStop(1, '#87CEEB');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.4);

    // Sun
    ctx.font = '30px serif';
    ctx.fillText('🌞', w - 50, 35);

    // Ground
    const groundGrad = ctx.createLinearGradient(0, h * 0.35, 0, h);
    groundGrad.addColorStop(0, '#66BB6A');
    groundGrad.addColorStop(0.3, '#4CAF50');
    groundGrad.addColorStop(1, '#388E3C');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, h * 0.35, w, h * 0.65);

    // Soil patches for plots
    player.plots.forEach(plot => {
      const px = plot.x / 400 * w;
      const py = (plot.y / 300) * h;

      // Soil
      ctx.fillStyle = '#8B6914';
      ctx.beginPath();
      ctx.ellipse(px, py + 10, 30, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Plant
      if (plot.growth > 0 && !plot.harvested) {
        const size = 12 + (plot.growth / 100) * 28;
        ctx.font = `${size}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(plot.seed.emoji, px, py - plot.growth / 10);

        // Growth bar
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(px - 18, py + 18, 36, 5);
        ctx.fillStyle = plot.growth >= 100 ? '#FFD700' : '#66BB6A';
        ctx.fillRect(px - 18, py + 18, 36 * (plot.growth / 100), 5);
      }

      // Watered indicator
      if (plot.watered > 0) {
        ctx.font = '12px serif';
        ctx.fillText('💧', px + 22, py);
      }
      if (plot.fertilized) {
        ctx.font = '12px serif';
        ctx.fillText('✨', px - 22, py);
      }
    });

    // Shed
    const shedX = (320 / 400) * w;
    const shedY = (50 / 300) * h;
    ctx.font = '36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏠', shedX, shedY);
    ctx.font = `bold 10px ${getComputedStyle(document.documentElement).getPropertyValue('--font-display')}`;
    ctx.fillStyle = '#5D4037';
    ctx.fillText('SHED', shedX, shedY + 18);

    // Player character
    const charX = (player.x / 400) * w;
    const charY = (player.y / 300) * h;
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.fillText(player.farmer.emoji, charX, charY);

    // Tool indicator
    if (player.tool !== 'none') {
      ctx.font = '16px serif';
      ctx.fillText(TOOLS[player.tool].emoji, charX + 18, charY - 16);
    }

    // Floaters
    this.floaters = this.floaters.filter(f => {
      if (f.playerIdx !== idx) return true;
      f.y -= 0.5;
      f.life--;
      ctx.globalAlpha = f.life / 60;
      ctx.font = 'bold 14px Fredoka, sans-serif';
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      const fx = (f.x / 400) * w;
      const fy = (f.y / 300) * h;
      ctx.strokeText(f.text, fx, fy);
      ctx.fillText(f.text, fx, fy);
      ctx.globalAlpha = 1;
      return f.life > 0;
    });

    // Timer (top-right area)
    ctx.textAlign = 'right';
    ctx.font = 'bold 16px Fredoka, sans-serif';
    ctx.fillStyle = this.timeLeft <= 10 ? '#E53935' : '#FFF';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    const timerText = `⏱ ${this.timeLeft}s`;
    ctx.strokeText(timerText, w - 10, 24);
    ctx.fillText(timerText, w - 10, 24);

    ctx.textAlign = 'start'; // reset
  },

  // ═══ End Round ═══
  endRound() {
    clearInterval(this.gameTimer);
    cancelAnimationFrame(this.animFrame);

    // Harvest any remaining grown plots
    this.players.forEach(p => {
      p.plots.forEach(plot => {
        if (plot.growth >= 100 && !plot.harvested) {
          plot.harvested = true;
        }
      });
      p.totalKg = p.plots.reduce((sum, pl) => sum + pl.currentKg, 0);
    });

    this.showResults();
  },

  showResults() {
    const container = document.getElementById('result-players');
    container.innerHTML = '';

    let maxKg = 0;
    let winnerIdx = 0;
    this.players.forEach((p, i) => {
      if (p.totalKg > maxKg) { maxKg = p.totalKg; winnerIdx = i; }
    });

    this.players.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'result-card' + (this.playerCount > 1 && i === winnerIdx ? ' winner' : '');
      card.innerHTML = `
        <div class="rc-avatar">${p.farmer.emoji}</div>
        <div class="rc-name">${p.farmer.name}</div>
        <div class="rc-weight">${p.totalKg.toFixed(1)} kg</div>
      `;
      container.appendChild(card);
    });

    const winnerEl = document.getElementById('result-winner');
    if (this.playerCount > 1) {
      winnerEl.textContent = `🎉 ${this.players[winnerIdx].farmer.name} Wins!`;
    } else {
      winnerEl.textContent = `🌟 Great harvest, ${this.players[0].farmer.name}!`;
    }

    this.showScreen('result');
  },

  // ═══ Replay ═══
  playAgain() {
    this.players = [];
    this.showScreen('title');
  },

  nextLevel() {
    this.level++;
    // Increase time slightly, unlock more seeds
    this.gameDuration = 60 + (this.level - 1) * 10;
    // For level 3+, could unlock more players (TODO)
    this.players = [];
    this.farmerSelectStep = 0;
    this.selectedFarmerIdx = 0;
    document.getElementById('farmer-select-title').textContent = 'Choose Farmer 1';
    this.updateFarmerCards();
    this.showScreen('farmer');
  },
};

// ═══ Init ═══
document.addEventListener('DOMContentLoaded', () => {
  Game.showScreen('title');
});
