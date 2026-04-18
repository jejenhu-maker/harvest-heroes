/* ═══════════════════════════════════════════
   HARVEST HEROES — Game Engine v2
   Drag-to-move, plant seeds, stem growth
   ═══════════════════════════════════════════ */

const SEEDS = [
  // Page 1 — Vegetables
  { name: 'Tomato',     emoji: '🍅', color: '#E53935', growTime: 8,  maxKg: 3.2, stemColor: '#4CAF50', page: 0 },
  { name: 'Carrot',     emoji: '🥕', color: '#FF8C00', growTime: 6,  maxKg: 1.8, stemColor: '#66BB6A', page: 0 },
  { name: 'Broccoli',   emoji: '🥦', color: '#4CAF50', growTime: 10, maxKg: 2.5, stemColor: '#388E3C', page: 0 },
  { name: 'Corn',       emoji: '🌽', color: '#FFD700', growTime: 12, maxKg: 4.0, stemColor: '#8BC34A', page: 0 },
  { name: 'Pepper',     emoji: '🫑', color: '#388E3C', growTime: 7,  maxKg: 2.0, stemColor: '#4CAF50', page: 0 },
  { name: 'Eggplant',   emoji: '🍆', color: '#7B1FA2', growTime: 11, maxKg: 3.5, stemColor: '#66BB6A', page: 0 },
  { name: 'Potato',     emoji: '🥔', color: '#C8A86E', growTime: 9,  maxKg: 2.8, stemColor: '#8BC34A', page: 0 },
  // Page 2 — Fruits
  { name: 'Strawberry', emoji: '🍓', color: '#FF6B9D', growTime: 5,  maxKg: 1.2, stemColor: '#4CAF50', page: 1 },
  { name: 'Orange',     emoji: '🍊', color: '#FF9800', growTime: 9,  maxKg: 2.8, stemColor: '#795548', page: 1 },
  { name: 'Watermelon', emoji: '🍉', color: '#66BB6A', growTime: 15, maxKg: 8.0, stemColor: '#4CAF50', page: 1 },
  { name: 'Apple',      emoji: '🍎', color: '#E53935', growTime: 10, maxKg: 3.0, stemColor: '#795548', page: 1 },
  { name: 'Grape',      emoji: '🍇', color: '#9C27B0', growTime: 8,  maxKg: 2.2, stemColor: '#795548', page: 1 },
  { name: 'Peach',      emoji: '🍑', color: '#FFAB91', growTime: 7,  maxKg: 2.0, stemColor: '#795548', page: 1 },
  // Page 3 — Exotic
  { name: 'Pineapple',  emoji: '🍍', color: '#FDD835', growTime: 14, maxKg: 5.0, stemColor: '#8BC34A', page: 2 },
  { name: 'Coconut',    emoji: '🥥', color: '#8D6E63', growTime: 16, maxKg: 6.0, stemColor: '#795548', page: 2 },
  { name: 'Mango',      emoji: '🥭', color: '#FF9800', growTime: 11, maxKg: 3.5, stemColor: '#795548', page: 2 },
  { name: 'Lemon',      emoji: '🍋', color: '#FDD835', growTime: 6,  maxKg: 1.5, stemColor: '#4CAF50', page: 2 },
  { name: 'Cherry',     emoji: '🍒', color: '#C62828', growTime: 5,  maxKg: 1.0, stemColor: '#795548', page: 2 },
  { name: 'Banana',     emoji: '🍌', color: '#FFE082', growTime: 8,  maxKg: 2.5, stemColor: '#8BC34A', page: 2 },
];

const PAGE_NAMES = ['🥬 Vegetables', '🍎 Fruits', '🌴 Exotic'];

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
  farmerSelectStep: 0,
  selectedFarmerIdx: 0,
  selectedSeeds: [],
  gameTimer: null,
  gameDuration: 60,
  timeLeft: 60,
  currentDay: 1,
  dayTimer: 0,
  dayDuration: 5, // real seconds per game-day
  animFrame: null,
  seedPage: 0,
  seedSwipe: { startX: 0, currentX: 0, swiping: false },

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
      heldSeeds: [],    // seeds in hand (up to 3)
      tool: 'none',
      x: 60, y: 160,
      totalKg: 0,
      plots: [],
      houseLevel: 1,
      dragging: false,
    });

    if (this.playerCount === 2 && this.farmerSelectStep === 0) {
      this.farmerSelectStep = 1;
      this.selectedFarmerIdx = 1;
      document.getElementById('farmer-select-title').textContent = 'Choose Farmer 2';
      this.updateFarmerCards();
    } else {
      this.showSeedSelect();
    }
  },

  // ═══ Seed Select — Swipeable Pages ═══
  showSeedSelect() {
    this.selectedSeeds = [];
    this.seedPage = 0;
    this.buildSeedPages();
    this.updateSeedUI();
    this.setupSeedSwipe();
    this.showScreen('seeds');
  },

  buildSeedPages() {
    const track = document.getElementById('seed-track');
    track.innerHTML = '';
    
    for (let p = 0; p < PAGE_NAMES.length; p++) {
      const page = document.createElement('div');
      page.className = 'seed-page';
      page.dataset.page = p;
      
      const title = document.createElement('div');
      title.className = 'seed-page-title';
      title.textContent = PAGE_NAMES[p];
      page.appendChild(title);
      
      const grid = document.createElement('div');
      grid.className = 'seed-grid';
      
      SEEDS.filter(s => s.page === p).forEach((seed, i) => {
        const globalIdx = SEEDS.indexOf(seed);
        const card = document.createElement('div');
        card.className = 'seed-card';
        card.dataset.idx = globalIdx;
        card.innerHTML = `<div class="seed-emoji">${seed.emoji}</div><div class="seed-name">${seed.name}</div>`;
        card.addEventListener('click', () => this.toggleSeed(globalIdx));
        grid.appendChild(card);
      });
      
      page.appendChild(grid);
      track.appendChild(page);
    }
  },

  setupSeedSwipe() {
    const container = document.getElementById('seed-swipe-container');
    const track = document.getElementById('seed-track');
    
    let startX = 0;
    let startPage = 0;
    
    const onStart = (e) => {
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      startPage = this.seedPage;
      track.style.transition = 'none';
    };
    
    const onMove = (e) => {
      if (startX === null) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const dx = x - startX;
      const offset = -startPage * container.offsetWidth + dx;
      track.style.transform = `translateX(${offset}px)`;
    };
    
    const onEnd = (e) => {
      const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const dx = x - startX;
      const threshold = container.offsetWidth * 0.2;
      
      if (dx < -threshold && this.seedPage < PAGE_NAMES.length - 1) {
        this.seedPage++;
      } else if (dx > threshold && this.seedPage > 0) {
        this.seedPage--;
      }
      
      this.scrollSeedPage();
      startX = null;
    };
    
    container.addEventListener('touchstart', onStart, { passive: true });
    container.addEventListener('touchmove', onMove, { passive: true });
    container.addEventListener('touchend', onEnd);
    container.addEventListener('mousedown', onStart);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseup', onEnd);
  },

  scrollSeedPage() {
    const container = document.getElementById('seed-swipe-container');
    const track = document.getElementById('seed-track');
    const offset = -this.seedPage * container.offsetWidth;
    track.style.transition = 'transform 0.3s ease';
    track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    document.querySelectorAll('.page-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.seedPage);
    });
  },

  goSeedPage(p) {
    this.seedPage = p;
    this.scrollSeedPage();
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
    document.querySelectorAll('.seed-card').forEach(card => {
      const idx = parseInt(card.dataset.idx);
      card.classList.toggle('selected', this.selectedSeeds.includes(idx));
    });
    document.getElementById('seed-count').textContent = `${this.selectedSeeds.length} / 3 selected`;
    const btn = document.getElementById('btn-start-game');
    btn.classList.toggle('disabled', this.selectedSeeds.length < 3);
  },

  // ═══ Start Game ═══
  startFarming() {
    if (this.selectedSeeds.length < 3) return;

    const seedObjs = this.selectedSeeds.map(i => ({ ...SEEDS[i] }));
    this.players.forEach(p => {
      p.seeds = seedObjs.map(s => ({ ...s }));
      p.heldSeeds = seedObjs.map(s => ({ ...s })); // seeds in hand!
      p.tool = 'none';
      p.totalKg = 0;
      p.houseLevel = 1;
      p.plots = this.createEmptyPlots();
      p.x = 60;
      p.y = 200;
      p.finished = false;
      p.finishDay = 0;
    });

    this.timeLeft = this.gameDuration;
    this.spawnGroundTools();
    this.showScreen('game');
    requestAnimationFrame(() => {
      this.setupGameScreen();
      this.startGameLoop();
    });
  },

  createEmptyPlots() {
    // 3 empty soil plots ready for planting
    return [
      { seed: null, x: 100, y: 220, growth: 0, watered: 0, fertilized: false, harvested: false, currentKg: 0, planted: false },
      { seed: null, x: 200, y: 220, growth: 0, watered: 0, fertilized: false, harvested: false, currentKg: 0, planted: false },
      { seed: null, x: 300, y: 220, growth: 0, watered: 0, fertilized: false, harvested: false, currentKg: 0, planted: false },
    ];
  },

  // Ground tools that can be picked up by tapping
  groundTools: [],

  spawnGroundTools() {
    this.groundTools = [
      { type: 'shovel',  emoji: '🔧', x: 60,  y: 260 },
      { type: 'water',   emoji: '🚿', x: 350, y: 260 },
    ];
  },

  // ═══ Game Screen Setup ═══
  setupGameScreen() {
    const v2 = document.getElementById('viewport-2');

    if (this.playerCount === 2) {
      v2.classList.remove('hidden');
    } else {
      v2.classList.add('hidden');
    }

    this.players.forEach((p, i) => {
      document.getElementById(`hud-avatar-${i+1}`).textContent = p.farmer.emoji;
      document.getElementById(`hud-name-${i+1}`).textContent = p.farmer.name;
      document.getElementById(`hud-weight-${i+1}`).textContent = '0.0 kg';
      this.updateHeldDisplay(i);
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

    this.setupDragControls();
  },

  updateHeldDisplay(playerIdx) {
    const p = this.players[playerIdx];
    const el = document.getElementById(`hud-held-${playerIdx+1}`);
    if (p.heldSeeds.length > 0) {
      el.textContent = p.heldSeeds.map(s => s.emoji).join('');
    } else {
      el.textContent = TOOLS[p.tool].emoji;
    }
  },

  // ═══ Drag-to-Move Controls ═══
  setupDragControls() {
    for (let i = 0; i < this.playerCount; i++) {
      const canvas = document.getElementById(`canvas-${i+1}`);
      const viewport = canvas.parentElement;
      
      let dragging = false;
      let offsetX = 0, offsetY = 0;
      
      const getPos = (e) => {
        const t = e.touches ? e.touches[0] : e;
        const rect = viewport.getBoundingClientRect();
        return {
          x: (t.clientX - rect.left) / rect.width * 400,
          y: (t.clientY - rect.top) / rect.height * 300,
        };
      };
      
      const onStart = (e) => {
        const pos = getPos(e);
        const p = this.players[i];
        const dist = Math.sqrt((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2);
        
        if (dist < 40) {
          dragging = true;
          p.dragging = true;
          offsetX = p.x - pos.x;
          offsetY = p.y - pos.y;
          e.preventDefault();
        } else {
          // Tap on a plot to interact
          this.handleTap(i, pos);
        }
      };
      
      const onMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        const pos = getPos(e);
        const p = this.players[i];
        p.x = Math.max(20, Math.min(380, pos.x + offsetX));
        p.y = Math.max(40, Math.min(280, pos.y + offsetY));
      };
      
      const onEnd = () => {
        dragging = false;
        if (this.players[i]) this.players[i].dragging = false;
      };
      
      canvas.addEventListener('touchstart', onStart, { passive: false });
      canvas.addEventListener('touchmove', onMove, { passive: false });
      canvas.addEventListener('touchend', onEnd);
      canvas.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
    }
    
    // Keyboard for P1 (desktop testing)
    const keys = {};
    window.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'e') this.handleNearestAction(0);
    });
    window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
    
    this._keys = keys;
  },

  handleTap(playerIdx, pos) {
    const p = this.players[playerIdx];
    
    // Tap near shed?
    if (pos.x > 320 && pos.y < 80) {
      this._shedPlayer = playerIdx;
      const overlay = document.getElementById('screen-shed');
      overlay.classList.remove('hidden');
      overlay.classList.add('active');
      return;
    }

    // Tap near a ground tool?
    for (let ti = this.groundTools.length - 1; ti >= 0; ti--) {
      const tool = this.groundTools[ti];
      const dist = Math.abs(pos.x - tool.x) + Math.abs(pos.y - tool.y);
      if (dist < 40) {
        p.tool = tool.type;
        p.heldSeeds = [];
        this.showFloater(playerIdx, tool.x, tool.y - 15, `Got ${tool.emoji}!`);
        this.updateHeldDisplay(playerIdx);
        this.groundTools.splice(ti, 1);
        return;
      }
    }
    
    // Tap near a plot?
    p.plots.forEach((plot, pi) => {
      const dist = Math.abs(pos.x - plot.x) + Math.abs(pos.y - plot.y);
      if (dist < 45) {
        this.interactPlot(playerIdx, pi);
      }
    });
  },

  handleNearestAction(playerIdx) {
    const p = this.players[playerIdx];
    // Check shed
    if (p.x > 300 && p.y < 80) {
      this._shedPlayer = playerIdx;
      const overlay = document.getElementById('screen-shed');
      overlay.classList.remove('hidden');
      overlay.classList.add('active');
      return;
    }
    // Check nearest plot
    let nearestDist = 999, nearestIdx = -1;
    p.plots.forEach((plot, pi) => {
      const dist = Math.abs(p.x - plot.x) + Math.abs(p.y - plot.y);
      if (dist < 60 && dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = pi;
      }
    });
    if (nearestIdx >= 0) this.interactPlot(playerIdx, nearestIdx);
  },

  interactPlot(playerIdx, plotIdx) {
    const p = this.players[playerIdx];
    const plot = p.plots[plotIdx];
    
    // Not planted yet — plant a seed from hand
    if (!plot.planted && p.heldSeeds.length > 0) {
      const seed = p.heldSeeds.shift();
      plot.seed = seed;
      plot.planted = true;
      plot.growth = 0;
      this.showFloater(playerIdx, plot.x, plot.y - 20, `${seed.emoji} Planted!`);
      this.updateHeldDisplay(playerIdx);
      return;
    }
    
    if (!plot.planted || plot.harvested) return;

    // Harvest first — ripe fruit can always be picked (hand, shovel, any tool)
    if (plot.growth >= 100) {
      plot.harvested = true;
      this.showFloater(playerIdx, plot.x, plot.y - 30, `${plot.seed.emoji} ${plot.currentKg.toFixed(1)}kg!`);
      return;
    }
    
    // Not ripe yet — use tool
    if (p.tool === 'water') {
      plot.watered = Math.min(plot.watered + 30, 50);
      this.showFloater(playerIdx, plot.x, plot.y - 30, '💧');
    } else if (p.tool === 'fertilizer') {
      plot.fertilized = true;
      p.tool = 'none';
      this.showFloater(playerIdx, plot.x, plot.y - 30, '💊✨');
      this.updateHeldDisplay(playerIdx);
    } else if (p.tool === 'shovel') {
      // Shovel digs = speeds up growth a bit
      plot.growth = Math.min(100, plot.growth + 15);
      this.showFloater(playerIdx, plot.x, plot.y - 30, '⛏️ Dig!');
    }
  },

  // ═══ Game Loop ═══
  startGameLoop() {
    if (this.gameTimer) clearInterval(this.gameTimer);
    if (this.animFrame) cancelAnimationFrame(this.animFrame);

    this.currentDay = 1;
    this.dayTimer = 0;

    this.gameTimer = setInterval(() => {
      this.dayTimer++;
      // Every dayDuration seconds = 1 game day
      if (this.dayTimer >= this.dayDuration * 10) {
        this.dayTimer = 0;
        this.currentDay++;
      }

      // Grow plants based on days
      this.players.forEach(p => {
        p.plots.forEach(plot => {
          if (plot.planted && !plot.harvested && plot.growth < 100) {
            // Growth tied to day progress
            const dayProgress = (this.currentDay - 1 + this.dayTimer / (this.dayDuration * 10));
            let growthTarget = (dayProgress / plot.seed.growTime) * 100;
            // Boosts
            if (plot.watered > 0) { growthTarget *= 1.3; plot.watered = Math.max(0, plot.watered - 0.1); }
            if (plot.fertilized) growthTarget *= 1.5;
            plot.growth = Math.min(100, growthTarget);
            plot.currentKg = (plot.growth / 100) * plot.seed.maxKg;
          }
        });
        p.totalKg = p.plots.reduce((sum, pl) => sum + (pl.harvested ? pl.currentKg : 0), 0);

        // Check win: all plots planted & harvested
        const allPlanted = p.plots.every(pl => pl.planted);
        const allHarvested = p.plots.every(pl => pl.harvested);
        if (allPlanted && allHarvested && !p.finished) {
          p.finished = true;
          p.finishDay = this.currentDay;
        }
      });

      // Check if game is over (all players finished, or in 1P just P1)
      const allDone = this.players.every(p => p.finished);
      if (allDone) this.endRound();
    }, 100);

    const loop = () => {
      this.updateKeyboard();
      this.updateActionButtons();
      this.render();
      this.animFrame = requestAnimationFrame(loop);
    };
    this.animFrame = requestAnimationFrame(loop);
  },

  updateKeyboard() {
    if (!this._keys || !this.players[0]) return;
    const speed = 3;
    const p = this.players[0];
    if (this._keys['w'] || this._keys['arrowup'])    p.y = Math.max(40, p.y - speed);
    if (this._keys['s'] || this._keys['arrowdown'])  p.y = Math.min(280, p.y + speed);
    if (this._keys['a'] || this._keys['arrowleft'])  p.x = Math.max(20, p.x - speed);
    if (this._keys['d'] || this._keys['arrowright']) p.x = Math.min(380, p.x + speed);
  },

  updateActionButtons() {
    this.players.forEach((p, i) => {
      const btn = document.getElementById(`action-btn-${i+1}`);
      let nearAction = false;
      let icon = '✋';

      if (p.x > 300 && p.y < 80) { nearAction = true; icon = '🚪'; }

      p.plots.forEach(plot => {
        const dist = Math.abs(p.x - plot.x) + Math.abs(p.y - plot.y);
        if (dist < 50) {
          nearAction = true;
          if (!plot.planted && p.heldSeeds.length > 0) icon = '🌱';
          else if (plot.planted && plot.growth >= 100 && !plot.harvested) icon = '🧺';
          else if (plot.planted && p.tool === 'water') icon = '💧';
          else if (plot.planted && p.tool === 'fertilizer') icon = '💊';
        }
      });

      if (nearAction) {
        btn.classList.remove('hidden');
        btn.querySelector('.action-icon').textContent = icon;
      } else {
        btn.classList.add('hidden');
      }

      // Update HUD weight
      document.getElementById(`hud-weight-${i+1}`).textContent = p.totalKg.toFixed(1) + ' kg';
    });
  },

  doAction(playerIdx) {
    this.handleNearestAction(playerIdx);
  },

  floaters: [],
  showFloater(playerIdx, x, y, text) {
    this.floaters.push({ playerIdx, x, y, text, life: 60 });
  },

  // ═══ Shed ═══
  pickTool(tool) {
    const p = this.players[this._shedPlayer || 0];
    p.tool = tool;
    p.heldSeeds = []; // drop seeds to use tool
    this.updateHeldDisplay(this._shedPlayer || 0);
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
    const scaleX = w / 400;
    const scaleY = h / 300;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    skyGrad.addColorStop(0, '#5BB5E8');
    skyGrad.addColorStop(1, '#87CEEB');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.45);

    // Sun
    ctx.font = `${28 * scaleX}px serif`;
    ctx.textAlign = 'left';
    ctx.fillText('🌞', w - 50 * scaleX, 35 * scaleY);

    // Ground
    const groundGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
    groundGrad.addColorStop(0, '#66BB6A');
    groundGrad.addColorStop(0.15, '#4CAF50');
    groundGrad.addColorStop(1, '#388E3C');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, h * 0.4, w, h * 0.6);

    // Ground tools
    this.groundTools.forEach(tool => {
      const tx = tool.x * scaleX;
      const ty = tool.y * scaleY;
      // Shadow circle
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.beginPath();
      ctx.ellipse(tx, ty + 8 * scaleY, 14 * scaleX, 5 * scaleY, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tool emoji
      ctx.font = `${24 * scaleX}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(tool.emoji, tx, ty);
      // Pickup hint
      ctx.font = `bold ${8 * scaleX}px Fredoka, sans-serif`;
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1.5;
      ctx.strokeText('TAP', tx, ty + 18 * scaleY);
      ctx.fillText('TAP', tx, ty + 18 * scaleY);
    });

    // Fence (decorative)
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 2;
    for (let fx = 20; fx < w - 20; fx += 40) {
      ctx.beginPath();
      ctx.moveTo(fx * 1, h * 0.42);
      ctx.lineTo(fx * 1, h * 0.48);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(20, h * 0.44);
    ctx.lineTo(w - 20, h * 0.44);
    ctx.stroke();

    // Plots (soil + stems + plants)
    player.plots.forEach(plot => {
      const px = plot.x * scaleX;
      const py = plot.y * scaleY;

      // Soil mound
      ctx.fillStyle = '#8B6914';
      ctx.beginPath();
      ctx.ellipse(px, py + 12 * scaleY, 32 * scaleX, 10 * scaleY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6B4F12';
      ctx.beginPath();
      ctx.ellipse(px, py + 14 * scaleY, 28 * scaleX, 6 * scaleY, 0, 0, Math.PI * 2);
      ctx.fill();

      if (plot.planted && plot.seed) {
        const growthFrac = plot.growth / 100;
        
        // Stem — grows from soil upward
        const stemHeight = growthFrac * 45 * scaleY;
        const stemX = px;
        const stemBottom = py + 6 * scaleY;
        const stemTop = stemBottom - stemHeight;
        
        if (stemHeight > 2) {
          ctx.strokeStyle = plot.seed.stemColor;
          ctx.lineWidth = 3 * scaleX;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(stemX, stemBottom);
          // Slight curve for natural look
          ctx.quadraticCurveTo(stemX + 3 * scaleX * Math.sin(growthFrac * 2), stemBottom - stemHeight * 0.5, stemX, stemTop);
          ctx.stroke();
          
          // Leaves (appear at 30%+)
          if (growthFrac > 0.3) {
            const leafY = stemBottom - stemHeight * 0.5;
            ctx.font = `${10 + growthFrac * 6}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('🌿', stemX - 10 * scaleX, leafY);
          }
          
          // Second leaf at 60%
          if (growthFrac > 0.6) {
            const leafY2 = stemBottom - stemHeight * 0.7;
            ctx.font = `${8 + growthFrac * 5}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('🍃', stemX + 10 * scaleX, leafY2);
          }
        }
        
        // Fruit/Veggie on top of stem
        if (growthFrac > 0.1) {
          const fruitSize = 14 + growthFrac * 22;
          ctx.font = `${fruitSize * scaleX}px serif`;
          ctx.textAlign = 'center';
          
          if (!plot.harvested) {
            ctx.fillText(plot.seed.emoji, stemX, stemTop - 2 * scaleY);
          }
        }
        
        // Growth bar below soil
        const barW = 36 * scaleX;
        const barH = 4 * scaleY;
        const barX = px - barW / 2;
        const barY = py + 22 * scaleY;
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = plot.growth >= 100 ? '#FFD700' : '#66BB6A';
        ctx.fillRect(barX, barY, barW * growthFrac, barH);

        // Days label (e.g. "3 days")
        ctx.font = `bold ${8 * scaleX}px Fredoka, sans-serif`;
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.textAlign = 'center';
        const daysLabel = plot.growth >= 100 ? '✅ Ready!' : `${plot.seed.growTime}d`;
        ctx.strokeText(daysLabel, px, barY + 12 * scaleY);
        ctx.fillText(daysLabel, px, barY + 12 * scaleY);
        
        // "Ready!" sparkle
        if (plot.growth >= 100 && !plot.harvested) {
          ctx.font = `${12 * scaleX}px serif`;
          ctx.fillText('✨', px + 20 * scaleX, stemTop);
        }
      } else if (!plot.planted) {
        // Empty plot — show hole
        ctx.fillStyle = '#6B4F12';
        ctx.beginPath();
        ctx.ellipse(px, py + 5 * scaleY, 10 * scaleX, 5 * scaleY, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Water/fertilizer indicators
      if (plot.watered > 0) {
        ctx.font = `${10 * scaleX}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText('💧', px + 25 * scaleX, py);
      }
      if (plot.fertilized) {
        ctx.font = `${10 * scaleX}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText('✨', px - 25 * scaleX, py);
      }
    });

    // Shed building
    const shedX = 340 * scaleX;
    const shedY = 55 * scaleY;
    ctx.font = `${36 * scaleX}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText('🏠', shedX, shedY);
    ctx.font = `bold ${9 * scaleX}px Fredoka, sans-serif`;
    ctx.fillStyle = '#5D4037';
    ctx.fillText('SHED', shedX, shedY + 16 * scaleY);

    // Player character — with glow when dragging
    const charX = player.x * scaleX;
    const charY = player.y * scaleY;
    
    if (player.dragging) {
      ctx.shadowColor = 'rgba(255,215,0,0.6)';
      ctx.shadowBlur = 15;
    }
    ctx.font = `${32 * scaleX}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(player.farmer.emoji, charX, charY);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Held seeds or tool indicator next to farmer
    if (player.heldSeeds.length > 0) {
      ctx.font = `${14 * scaleX}px serif`;
      player.heldSeeds.forEach((s, si) => {
        ctx.fillText(s.emoji, charX + (18 + si * 14) * scaleX, charY - 12 * scaleY);
      });
    } else if (player.tool !== 'none') {
      ctx.font = `${16 * scaleX}px serif`;
      ctx.fillText(TOOLS[player.tool].emoji, charX + 18 * scaleX, charY - 12 * scaleY);
    }

    // "Drag me!" hint (first few seconds)
    if (this.timeLeft > 55) {
      ctx.globalAlpha = (this.timeLeft - 55) / 5;
      ctx.font = `bold ${11 * scaleX}px Fredoka, sans-serif`;
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      const hint = '👆 Drag me!';
      ctx.strokeText(hint, charX, charY - 24 * scaleY);
      ctx.fillText(hint, charX, charY - 24 * scaleY);
      ctx.globalAlpha = 1;
    }

    // Floaters
    this.floaters = this.floaters.filter(f => {
      if (f.playerIdx !== idx) return true;
      f.y -= 0.5;
      f.life--;
      ctx.globalAlpha = f.life / 60;
      ctx.font = `bold ${13 * scaleX}px Fredoka, sans-serif`;
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      const fx = f.x * scaleX;
      const fy = f.y * scaleY;
      ctx.textAlign = 'center';
      ctx.strokeText(f.text, fx, fy);
      ctx.fillText(f.text, fx, fy);
      ctx.globalAlpha = 1;
      return f.life > 0;
    });

    // Day counter
    ctx.textAlign = 'right';
    ctx.font = `bold ${15 * scaleX}px Fredoka, sans-serif`;
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    const dayText = `📅 Day ${this.currentDay}`;
    ctx.strokeText(dayText, w - 8, 22 * scaleY);
    ctx.fillText(dayText, w - 8, 22 * scaleY);

    // Day progress bar
    const dpBarW = 60 * scaleX;
    const dpBarH = 4 * scaleY;
    const dpX = w - 8 - dpBarW;
    const dpY = 28 * scaleY;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(dpX, dpY, dpBarW, dpBarH);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(dpX, dpY, dpBarW * (this.dayTimer / (this.dayDuration * 10)), dpBarH);

    ctx.textAlign = 'start';
  },

  // ═══ End Round ═══
  endRound() {
    clearInterval(this.gameTimer);
    cancelAnimationFrame(this.animFrame);

    this.players.forEach(p => {
      p.plots.forEach(plot => {
        if (plot.planted && plot.growth >= 100 && !plot.harvested) plot.harvested = true;
      });
      p.totalKg = p.plots.reduce((sum, pl) => sum + pl.currentKg, 0);
    });

    this.showResults();
  },

  showResults() {
    const container = document.getElementById('result-players');
    container.innerHTML = '';

    // In 2P, winner = finished first (lowest finishDay)
    let winnerIdx = 0;
    if (this.playerCount > 1) {
      let bestDay = Infinity;
      this.players.forEach((p, i) => {
        if (p.finishDay < bestDay) { bestDay = p.finishDay; winnerIdx = i; }
      });
    }

    this.players.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'result-card' + (this.playerCount > 1 && i === winnerIdx ? ' winner' : '');
      card.innerHTML = `
        <div class="rc-avatar">${p.farmer.emoji}</div>
        <div class="rc-name">${p.farmer.name}</div>
        <div class="rc-weight">${p.totalKg.toFixed(1)} kg</div>
        <div class="rc-days">📅 Day ${p.finishDay || this.currentDay}</div>
      `;
      container.appendChild(card);
    });

    const winnerEl = document.getElementById('result-winner');
    if (this.playerCount > 1) {
      winnerEl.textContent = `🎉 ${this.players[winnerIdx].farmer.name} Wins!`;
    } else {
      winnerEl.textContent = `🌟 Harvested in ${this.players[0].finishDay || this.currentDay} days!`;
    }

    this.showScreen('result');
  },

  playAgain() {
    this.players = [];
    this.showScreen('title');
  },

  nextLevel() {
    this.level++;
    this.gameDuration = 60 + (this.level - 1) * 10;
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
