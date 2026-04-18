/* ═══════════════════════════════════════════
   HARVEST HEROES — Game Engine v2
   Drag-to-move, plant seeds, stem growth
   ═══════════════════════════════════════════ */

const SEEDS = [
  // Page 1 — Vegetables (green & colorful)
  { name: 'Tomato',      emoji: '🍅', flower: '🌼', color: '#E53935', growTime: 8,  maxKg: 3.2, stemColor: '#4CAF50', page: 0 },
  { name: 'Carrot',      emoji: '🥕', flower: '🌸', color: '#FF8C00', growTime: 6,  maxKg: 1.8, stemColor: '#66BB6A', page: 0 },
  { name: 'Broccoli',    emoji: '🥦', flower: '🌼', color: '#4CAF50', growTime: 10, maxKg: 2.5, stemColor: '#388E3C', page: 0 },
  { name: 'Corn',        emoji: '🌽', flower: '🌾', color: '#FFD700', growTime: 12, maxKg: 4.0, stemColor: '#8BC34A', page: 0 },
  { name: 'Pepper',      emoji: '🫑', flower: '🌸', color: '#388E3C', growTime: 7,  maxKg: 2.0, stemColor: '#4CAF50', page: 0 },
  { name: 'Eggplant',    emoji: '🍆', flower: '💜', color: '#7B1FA2', growTime: 11, maxKg: 3.5, stemColor: '#66BB6A', page: 0 },
  { name: 'Potato',      emoji: '🥔', flower: '🌸', color: '#C8A86E', growTime: 9,  maxKg: 2.8, stemColor: '#8BC34A', page: 0 },
  { name: 'Lettuce',     emoji: '🥬', flower: '🌼', color: '#66BB6A', growTime: 4,  maxKg: 0.8, stemColor: '#4CAF50', page: 0 },
  { name: 'Cabbage',     emoji: '🥬', flower: '🌸', color: '#81C784', growTime: 7,  maxKg: 2.0, stemColor: '#388E3C', page: 0 },
  // Page 2 — Fruits
  { name: 'Strawberry',  emoji: '🍓', flower: '🌸', color: '#FF6B9D', growTime: 5,  maxKg: 1.2, stemColor: '#4CAF50', page: 1 },
  { name: 'Orange',      emoji: '🍊', flower: '🌼', color: '#FF9800', growTime: 9,  maxKg: 2.8, stemColor: '#795548', page: 1 },
  { name: 'Watermelon',  emoji: '🍉', flower: '🌼', color: '#66BB6A', growTime: 15, maxKg: 8.0, stemColor: '#4CAF50', page: 1 },
  { name: 'Apple',       emoji: '🍎', flower: '🌸', color: '#E53935', growTime: 10, maxKg: 3.0, stemColor: '#795548', page: 1 },
  { name: 'Grape',       emoji: '🍇', flower: '💜', color: '#9C27B0', growTime: 8,  maxKg: 2.2, stemColor: '#795548', page: 1 },
  { name: 'Peach',       emoji: '🍑', flower: '🌸', color: '#FFAB91', growTime: 7,  maxKg: 2.0, stemColor: '#795548', page: 1 },
  { name: 'Blueberry',   emoji: '🫐', flower: '🌸', color: '#5C6BC0', growTime: 6,  maxKg: 1.0, stemColor: '#4CAF50', page: 1 },
  // Page 3 — Exotic
  { name: 'Pineapple',   emoji: '🍍', flower: '🌺', color: '#FDD835', growTime: 14, maxKg: 5.0, stemColor: '#8BC34A', page: 2 },
  { name: 'Coconut',     emoji: '🥥', flower: '🌺', color: '#8D6E63', growTime: 16, maxKg: 6.0, stemColor: '#795548', page: 2 },
  { name: 'Mango',       emoji: '🥭', flower: '🌼', color: '#FF9800', growTime: 11, maxKg: 3.5, stemColor: '#795548', page: 2 },
  { name: 'Lemon',       emoji: '🍋', flower: '🌼', color: '#FDD835', growTime: 6,  maxKg: 1.5, stemColor: '#4CAF50', page: 2 },
  { name: 'Cherry',      emoji: '🍒', flower: '🌸', color: '#C62828', growTime: 5,  maxKg: 1.0, stemColor: '#795548', page: 2 },
  { name: 'Banana',      emoji: '🍌', flower: '🌺', color: '#FFE082', growTime: 8,  maxKg: 2.5, stemColor: '#8BC34A', page: 2 },
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
  sprinkler:  { emoji: '💦', name: 'Auto Sprinkler', boost: 0 },
};

const FOODS = [
  { emoji: '🍔', name: 'Burger',   effect: 'speed',  value: 1.5, duration: 150 },
  { emoji: '🍕', name: 'Pizza',    effect: 'speed',  value: 1.3, duration: 200 },
  { emoji: '🍪', name: 'Cookie',   effect: 'energy', value: 20,  duration: 0 },
  { emoji: '🍎', name: 'Apple',    effect: 'energy', value: 30,  duration: 0 },
  { emoji: '🧃', name: 'Juice',    effect: 'speed',  value: 1.4, duration: 180 },
  { emoji: '🍰', name: 'Cake',     effect: 'energy', value: 50,  duration: 0 },
];

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
  dayDuration: 8, // real seconds per game-day (slower pace)
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
      p.speedMult = 1;
      p.speedTimer = 0;
      p.sprinklers = []; // placed sprinklers: [{x, y, plotIdx}]
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
      { type: 'shovel',    emoji: '🔧', x: 60,  y: 260 },
      { type: 'water',     emoji: '🚿', x: 350, y: 260 },
      { type: 'sprinkler', emoji: '💦', x: 200, y: 270 },
    ];
    // Spawn food items
    this.groundFoods = [];
    this.spawnFood();
  },

  spawnFood() {
    // Spawn a random food at a random position
    const food = FOODS[Math.floor(Math.random() * FOODS.length)];
    this.groundFoods.push({
      ...food,
      x: 40 + Math.random() * 320,
      y: 180 + Math.random() * 80,
    });
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
      let touchStartPos = null;
      let touchStartTime = 0;
      let moved = false;
      
      const getPos = (e) => {
        const t = e.touches ? e.touches[0] : e;
        const rect = viewport.getBoundingClientRect();
        return {
          x: (t.clientX - rect.left) / rect.width * 400,
          y: (t.clientY - rect.top) / rect.height * 300,
        };
      };
      
      const onStart = (e) => {
        e.preventDefault(); // always prevent default to avoid scroll
        const pos = getPos(e);
        touchStartPos = { ...pos };
        touchStartTime = Date.now();
        moved = false;
        const p = this.players[i];
        const dist = Math.sqrt((pos.x - p.x) ** 2 + (pos.y - p.y) ** 2);
        
        if (dist < 45) {
          dragging = true;
          p.dragging = true;
          offsetX = p.x - pos.x;
          offsetY = p.y - pos.y;
        }
      };
      
      const onMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        moved = true;
        const pos = getPos(e);
        const p = this.players[i];
        p.x = Math.max(20, Math.min(380, pos.x + offsetX));
        p.y = Math.max(40, Math.min(280, pos.y + offsetY));
      };
      
      const onEnd = (e) => {
        const elapsed = Date.now() - touchStartTime;
        const pos = touchStartPos;
        
        // Short tap (< 200ms) or no movement = interaction, not drag
        if (pos && elapsed < 250 && !moved) {
          this.handleTap(i, pos);
        }
        
        dragging = false;
        if (this.players[i]) this.players[i].dragging = false;
        touchStartPos = null;
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

    // Tap near food?
    for (let fi = this.groundFoods.length - 1; fi >= 0; fi--) {
      const food = this.groundFoods[fi];
      const dist = Math.abs(pos.x - food.x) + Math.abs(pos.y - food.y);
      if (dist < 45) {
        // Eat it!
        if (food.effect === 'speed') {
          p.speedMult = food.value;
          p.speedTimer = food.duration;
          this.showFloater(playerIdx, food.x, food.y - 15, `${food.emoji} Speed ⚡`);
        } else {
          this.showFloater(playerIdx, food.x, food.y - 15, `${food.emoji} Yum!`);
        }
        this.groundFoods.splice(fi, 1);
        // Spawn new food after a delay
        setTimeout(() => this.spawnFood(), 5000);
        return;
      }
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
    
    // Find closest plot to tap position
    let bestPlotIdx = -1;
    let bestDist = Infinity;
    p.plots.forEach((plot, pi) => {
      const tapDist = Math.abs(pos.x - plot.x) + Math.abs(pos.y - plot.y);
      if (tapDist < bestDist) {
        bestDist = tapDist;
        bestPlotIdx = pi;
      }
    });
    // Interact if close enough
    if (bestPlotIdx >= 0) {
      const hasSeeds = p.heldSeeds.length > 0 && !p.plots[bestPlotIdx].planted;
      const threshold = hasSeeds ? 80 : 65;
      if (bestDist < threshold) {
        this.interactPlot(playerIdx, bestPlotIdx);
      }
    }
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
    
    // Not planted yet — plant a seed from hand, and walk farmer to plot
    if (!plot.planted && p.heldSeeds.length > 0) {
      const seed = p.heldSeeds.shift();
      plot.seed = seed;
      plot.planted = true;
      plot.growth = 0;
      plot.plantedDay = this.currentDay;
      // Snap farmer near the plot
      p.x = plot.x;
      p.y = plot.y - 30;
      this.showFloater(playerIdx, plot.x, plot.y - 20, `${seed.emoji} Planted!`);
      this.updateHeldDisplay(playerIdx);
      return;
    }
    
    if (!plot.planted || plot.harvested) return;

    // Sprinkler: place it next to the plot
    if (p.tool === 'sprinkler') {
      const alreadyHas = p.sprinklers.some(s => s.plotIdx === plotIdx);
      if (!alreadyHas) {
        p.sprinklers.push({ x: plot.x + 25, y: plot.y + 5, plotIdx });
        p.tool = 'none';
        this.showFloater(playerIdx, plot.x, plot.y - 20, '💦 Sprinkler set!');
        this.updateHeldDisplay(playerIdx);
      }
      return;
    }

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
            // Growth = discrete per day (each new day adds a chunk)
            const daysGrown = this.currentDay - (plot.plantedDay || 1);
            let growthPerDay = 100 / plot.seed.growTime;
            if (plot.watered > 0) { growthPerDay *= 1.3; plot.watered = Math.max(0, plot.watered - 0.1); }
            if (plot.fertilized) growthPerDay *= 1.5;
            const target = Math.min(100, daysGrown * growthPerDay);
            // Smooth lerp toward target (so it doesn't jump instantly)
            plot.growth += (target - plot.growth) * 0.1;
            if (Math.abs(plot.growth - target) < 0.5) plot.growth = target;
            plot.currentKg = (plot.growth / 100) * plot.seed.maxKg;
          }
        });
        // Auto-sprinklers water their plots
        p.sprinklers.forEach(spr => {
          const plot = p.plots[spr.plotIdx];
          if (plot && plot.planted && !plot.harvested) {
            plot.watered = Math.min(plot.watered + 0.5, 50);
          }
        });

        // Speed boost timer
        if (p.speedTimer > 0) {
          p.speedTimer--;
          if (p.speedTimer <= 0) p.speedMult = 1;
        }

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
      document.getElementById(`hud-weight-${i+1}`).textContent = p.totalKg > 0 ? p.totalKg.toFixed(1) + ' kg' : '';
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

    // Ground foods
    this.groundFoods.forEach(food => {
      const fx = food.x * scaleX;
      const fy = food.y * scaleY;
      // Bounce animation
      const bounce = Math.sin(Date.now() / 300 + food.x) * 3;
      ctx.font = `${22 * scaleX}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(food.emoji, fx, fy + bounce);
      // Glow
      ctx.font = `bold ${7 * scaleX}px Fredoka, sans-serif`;
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeText('EAT', fx, fy + 16 * scaleY);
      ctx.fillText('EAT', fx, fy + 16 * scaleY);
    });

    // Placed sprinklers
    player.sprinklers.forEach(spr => {
      const sx = spr.x * scaleX;
      const sy = spr.y * scaleY;
      ctx.font = `${14 * scaleX}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('💦', sx, sy);
      // Water drops animation
      const drops = Math.sin(Date.now() / 200 + spr.x) * 2;
      ctx.globalAlpha = 0.5;
      ctx.fillText('💧', sx - 8 * scaleX, sy - 10 * scaleY + drops);
      ctx.fillText('💧', sx + 8 * scaleX, sy - 14 * scaleY - drops);
      ctx.globalAlpha = 1;
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
        // Growth phases: 0-20% sprout, 20-50% stem+leaves, 50-75% flower, 75-100% fruit
        const stemMaxH = 50 * scaleY;
        const stemHeight = Math.min(growthFrac * 1.3, 1) * stemMaxH;
        const stemX = px;
        const stemBottom = py + 6 * scaleY;
        const stemTop = stemBottom - stemHeight;
        
        // Phase 1: Sprout (0-20%)
        if (growthFrac > 0.02 && stemHeight > 2) {
          // Main stem
          ctx.strokeStyle = plot.seed.stemColor;
          ctx.lineWidth = (2 + growthFrac * 2) * scaleX;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(stemX, stemBottom);
          ctx.quadraticCurveTo(stemX + 3 * scaleX * Math.sin(growthFrac * 3), stemBottom - stemHeight * 0.5, stemX, stemTop);
          ctx.stroke();
        }

        // Phase 2: Leaves (20%+)
        if (growthFrac > 0.2) {
          const leafScale = Math.min((growthFrac - 0.2) / 0.3, 1);
          const leafY = stemBottom - stemHeight * 0.4;
          ctx.font = `${(8 + leafScale * 8) * scaleX}px serif`;
          ctx.textAlign = 'center';
          ctx.fillText('🌿', stemX - 12 * scaleX, leafY);
          if (growthFrac > 0.35) {
            const leafY2 = stemBottom - stemHeight * 0.65;
            ctx.fillText('🍃', stemX + 12 * scaleX, leafY2);
          }
        }

        // Phase 3: Flower (50-80%) — flower appears, then fades as fruit grows
        if (growthFrac > 0.5 && growthFrac < 0.85 && !plot.harvested) {
          const flowerAlpha = growthFrac < 0.75 ? 1 : 1 - (growthFrac - 0.75) / 0.1;
          ctx.globalAlpha = Math.max(0, flowerAlpha);
          const flowerSize = 16 + (Math.min(growthFrac, 0.75) - 0.5) * 40;
          ctx.font = `${flowerSize * scaleX}px serif`;
          ctx.textAlign = 'center';
          ctx.fillText(plot.seed.flower || '🌸', stemX, stemTop - 2 * scaleY);
          ctx.globalAlpha = 1;
        }

        // Phase 4: Fruit (75%+) — fruit appears where flower was
        if (growthFrac > 0.75 && !plot.harvested) {
          const fruitGrow = (growthFrac - 0.75) / 0.25; // 0 to 1
          const fruitSize = 10 + fruitGrow * 26;
          ctx.font = `${fruitSize * scaleX}px serif`;
          ctx.textAlign = 'center';
          ctx.fillText(plot.seed.emoji, stemX, stemTop - 2 * scaleY);
        }

        // Tiny sprout emoji for very early stage
        if (growthFrac > 0 && growthFrac <= 0.15 && !plot.harvested) {
          ctx.font = `${12 * scaleX}px serif`;
          ctx.textAlign = 'center';
          ctx.fillText('🌱', stemX, stemBottom - 6 * scaleY);
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

    // Player character — body + legs drawn on canvas
    const charX = player.x * scaleX;
    const charY = player.y * scaleY;
    
    if (player.dragging) {
      ctx.shadowColor = 'rgba(255,215,0,0.6)';
      ctx.shadowBlur = 15;
    }

    // Legs (two little lines)
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 3 * scaleX;
    ctx.lineCap = 'round';
    // Left leg
    ctx.beginPath();
    ctx.moveTo(charX - 6 * scaleX, charY + 4 * scaleY);
    ctx.lineTo(charX - 8 * scaleX, charY + 18 * scaleY);
    ctx.stroke();
    // Right leg
    ctx.beginPath();
    ctx.moveTo(charX + 6 * scaleX, charY + 4 * scaleY);
    ctx.lineTo(charX + 8 * scaleX, charY + 18 * scaleY);
    ctx.stroke();
    // Boots
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.ellipse(charX - 8 * scaleX, charY + 19 * scaleY, 5 * scaleX, 3 * scaleY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(charX + 8 * scaleX, charY + 19 * scaleY, 5 * scaleX, 3 * scaleY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Farmer face/body emoji
    ctx.font = `${32 * scaleX}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(player.farmer.emoji, charX, charY);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Held items — seeds shown as seed packets, tool shown next to farmer
    if (player.heldSeeds.length > 0) {
      // Show seed emojis in small circles above farmer
      player.heldSeeds.forEach((s, si) => {
        const sx = charX + (-12 + si * 14) * scaleX;
        const sy = charY - 22 * scaleY;
        // Seed bag background (compatible circle)
        ctx.fillStyle = 'rgba(139,105,20,0.7)';
        ctx.beginPath();
        ctx.arc(sx, sy - 3 * scaleY, 9 * scaleX, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `${11 * scaleX}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(s.emoji, sx, sy + 1 * scaleY);
      });
    } else if (player.tool !== 'none') {
      ctx.font = `${18 * scaleX}px serif`;
      ctx.fillText(TOOLS[player.tool].emoji, charX + 20 * scaleX, charY - 8 * scaleY);
    }

    // "Drag me!" hint (first day)
    if (this.currentDay <= 1 && this.dayTimer < this.dayDuration * 5) {
      const hintAlpha = 1 - this.dayTimer / (this.dayDuration * 5);
      ctx.globalAlpha = hintAlpha;
      ctx.font = `bold ${11 * scaleX}px Fredoka, sans-serif`;
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      const hint = '👆 Drag me!';
      ctx.strokeText(hint, charX, charY - 30 * scaleY);
      ctx.fillText(hint, charX, charY - 30 * scaleY);
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
