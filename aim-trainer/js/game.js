// Grab DOM elements
const canvas    = document.getElementById('game');
const ctx       = canvas.getContext('2d');
const menu      = document.getElementById('menu');
const stats     = document.getElementById('stats');
const scoreEl   = document.getElementById('score');
const accEl     = document.getElementById('acc');
const restartBtn= document.getElementById('restart');

// Difficulty settings
const settings = {
  easy:   { spawnInterval: 1500, targetSize: 40, duration: 30 },
  medium: { spawnInterval: 1000, targetSize: 30, duration: 30 },
  hard:   { spawnInterval:  600, targetSize: 20, duration: 30 },
};

// Game state
let game = {
  state: 'menu',    // 'menu' | 'playing' | 'over'
  difficulty: null,
  timer: 0,
  score: 0,
  hits: 0,
  shots: 0,
  activeTargets: []
};

let lastTime   = 0;
let spawnTimer = 0;

// Start a new round
function startGame(diff) {
  game.state       = 'playing';
  game.difficulty  = diff;
  game.timer       = settings[diff].duration;
  game.score       = 0;
  game.hits        = 0;
  game.shots       = 0;
  game.activeTargets = [];
  menu.style.display  = 'none';
  stats.style.display = 'none';
  canvas.style.display= 'block';
  lastTime = performance.now();
  spawnTimer = 0;
  requestAnimationFrame(loop);
}

// End the round
function endGame() {
  game.state = 'over';
  canvas.style.display  = 'none';
  stats.style.display   = 'block';
  scoreEl.textContent   = game.score;
  const accuracy = game.shots
    ? Math.round(100 * game.hits / game.shots)
    : 0;
  accEl.textContent = `${accuracy}%`;
}

// Spawn a new target
function spawnTarget() {
  const { targetSize } = settings[game.difficulty];
  const x = Math.random() * (canvas.width - targetSize * 2) + targetSize;
  const y = Math.random() * (canvas.height - targetSize * 2) + targetSize;
  game.activeTargets.push({
    x,
    y,
    r: targetSize / 2,
    created: performance.now()
  });
}

// Game update logic
function update(dt, now) {
  if (game.state !== 'playing') return;

  // Spawn logic
  spawnTimer += dt * 1000;
  if (spawnTimer >= settings[game.difficulty].spawnInterval) {
    spawnTarget();
    spawnTimer = 0;
  }

  // Countdown timer
  game.timer -= dt;
  if (game.timer <= 0) {
    endGame();
    return;
  }

  // (Optional) expire old targets after full duration
  // game.activeTargets = game.activeTargets.filter(
  //   t => now - t.created < settings[game.difficulty].duration * 1000
  // );
}

// Game render logic
function render() {
  if (game.state !== 'playing') return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw each target
  ctx.fillStyle = 'red';
  for (const t of game.activeTargets) {
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw HUD
  ctx.fillStyle = '#0f0';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Time: ${Math.ceil(game.timer)}`, 10, 20);
  ctx.fillText(`Score: ${game.score}`, 10, 40);
}

// Handle clicks for hits
canvas.addEventListener('click', e => {
  if (game.state !== 'playing') return;

  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;
  game.shots++;

  for (let i = 0; i < game.activeTargets.length; i++) {
    const t = game.activeTargets[i];
    const dx = mx - t.x, dy = my - t.y;
    if (dx * dx + dy * dy <= t.r * t.r) {
      game.score++;
      game.hits++;
      game.activeTargets.splice(i, 1);
      break;
    }
  }
});

// Main loop
function loop(timestamp) {
  const dt  = (timestamp - lastTime) / 1000;
  lastTime  = timestamp;

  update(dt, timestamp);
  render();

  if (game.state === 'playing') {
    requestAnimationFrame(loop);
  }
}

// Menu buttons
document.querySelectorAll('#menu button').forEach(btn => {
  btn.addEventListener('click', () => startGame(btn.dataset.diff));
});

// Restart button
restartBtn.addEventListener('click', () => startGame(game.difficulty));
