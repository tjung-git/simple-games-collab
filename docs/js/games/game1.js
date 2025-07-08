// Highlight active nav item
const navGame1 = document.getElementById("nav-game1");
navGame1?.classList.add("active");

// DOM Elements & Containers
const gameContainer = document.getElementById("game-container");
const canvas        = document.getElementById("game");
const ctx           = canvas.getContext("2d");
const menu          = document.getElementById("menu");
const stats         = document.getElementById("stats");
const scoreEl       = document.getElementById("score");
const accEl         = document.getElementById("acc");
const restart       = document.getElementById("restart");

// INITIAL UI STATE
gameContainer.style.display = "block";
menu.style.display          = "block";
canvas.style.display        = "none";
stats.style.display         = "none";

// SETTINGS & STATE
const settings = {
  easy:   { spawnInterval: 1000, targetSize: 40, lifespan: 2000 },
  medium: { spawnInterval: 750,  targetSize: 40, lifespan: 1000 },
  hard:   { spawnInterval: 500,  targetSize: 40, lifespan: 750  },
  hell:   { spawnInterval: 250,  targetSize: 40, lifespan: 500  },
};
const ROUND_DURATION = 30;

let game = {
  state: 'menu',
  difficulty: null,
  timer: 0,
  score: 0,
  hits: 0,
  shots: 0,
  activeTargets: []
};
let lastTime    = 0;
let spawnTimer  = 0;
let crosshair   = { x: canvas.width/2, y: canvas.height/2 };

// INPUT SCALING (Valorant only)
function getScaledMovement(dx, dy) {
  const vs = parseFloat(localStorage.getItem('sensValorant') || '1');
  return { dx: dx * vs, dy: dy * vs };
}

// POINTER-LOCK HANDLING
function onPointerLockChange() {
  if (document.pointerLockElement === canvas) {
    document.addEventListener('mousemove', onMouseMove);
  } else {
    document.removeEventListener('mousemove', onMouseMove);
  }
}
function onMouseMove(e) {
  const mv = getScaledMovement(e.movementX, e.movementY);
  crosshair.x = Math.max(0, Math.min(canvas.width,  crosshair.x + mv.dx));
  crosshair.y = Math.max(0, Math.min(canvas.height, crosshair.y + mv.dy));
}
document.addEventListener('pointerlockchange', onPointerLockChange);

// GAME CONTROL
function startGame(diff) {
  if (!localStorage.getItem('sensValorant')) {
    alert('Please configure your Valorant sensitivity in Profile first.');
    window.location.href = '../settings/profile.html';
    return;
  }

  // show game UI
  menu.style.display   = "none";
  stats.style.display  = "none";
  canvas.style.display = "block";
  canvas.requestPointerLock();

  game = {
    state: 'playing',
    difficulty: diff,
    timer: ROUND_DURATION,
    score: 0,
    hits: 0,
    shots: 0,
    activeTargets: []
  };
  crosshair = { x: canvas.width/2, y: canvas.height/2 };
  lastTime   = performance.now();
  spawnTimer = 0;
  requestAnimationFrame(loop);
}

function endGame() {
  game.state = 'over';
  document.exitPointerLock();
  canvas.style.display = 'none';
  stats.style.display  = 'block';

  scoreEl.textContent = game.score;
  const acc = game.shots ? Math.round(100 * game.hits / game.shots) : 0;
  accEl.textContent   = `${acc}%`;

  // update high score
  const curHigh = parseInt(localStorage.getItem('highscore') || '0', 10);
  if (game.score > curHigh) {
    localStorage.setItem('highscore-aim', game.score);
  }
}

// TARGET MANAGEMENT
function spawnTarget() {
  const { targetSize, lifespan } = settings[game.difficulty];
  const x = Math.random() * (canvas.width - 2 * targetSize) + targetSize;
  const y = Math.random() * (canvas.height - 2 * targetSize) + targetSize;
  game.activeTargets.push({ x, y, r: targetSize/2, created: performance.now() });
}

function update(dt, now) {
  if (game.state !== 'playing') return;

  spawnTimer += dt * 1000;
  if (spawnTimer >= settings[game.difficulty].spawnInterval) {
    spawnTarget();
    spawnTimer = 0;
  }

  game.activeTargets = game.activeTargets.filter(
    t => now - t.created < settings[game.difficulty].lifespan
  );

  game.timer -= dt;
  if (game.timer <= 0) endGame();
}

function render() {
  if (game.state !== 'playing') return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw targets
  ctx.fillStyle = 'red';
  game.activeTargets.forEach(t => {
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // draw crosshair
  ctx.strokeStyle = '#0f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(crosshair.x - 10, crosshair.y);
  ctx.lineTo(crosshair.x + 10, crosshair.y);
  ctx.moveTo(crosshair.x, crosshair.y - 10);
  ctx.lineTo(crosshair.x, crosshair.y + 10);
  ctx.stroke();

  // HUD
  ctx.fillStyle = '#0f0';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Time: ${Math.ceil(game.timer)}`, 10, 20);
  ctx.fillText(`Score: ${game.score}`, 10, 40);
}

// SHOOTING & INPUT
canvas.addEventListener('mousedown', e => {
  if (game.state !== 'playing' || e.button !== 0) return;
  game.shots++;
  for (let i = 0; i < game.activeTargets.length; i++) {
    const t = game.activeTargets[i];
    const dx = crosshair.x - t.x;
    const dy = crosshair.y - t.y;
    if (dx * dx + dy * dy <= t.r * t.r) {
      game.score++;
      game.hits++;
      game.activeTargets.splice(i, 1);
      break;
    }
  }
});

// GAMEPLAY LOOP
function loop(ts) {
  const dt = (ts - lastTime) / 1000;
  lastTime = ts;
  update(dt, ts);
  render();
  if (game.state === 'playing') requestAnimationFrame(loop);
}

document.querySelectorAll('#menu button').forEach(btn =>
  btn.addEventListener('click', () => startGame(btn.dataset.diff))
);
restart.addEventListener('click', () => startGame(game.difficulty));
