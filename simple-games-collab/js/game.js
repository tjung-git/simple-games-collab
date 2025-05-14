// ——————————————————————————
// DOM & Routing
// ——————————————————————————
const navGame         = document.getElementById('nav-game');
const navProfile      = document.getElementById('nav-profile');
const gameContainer   = document.getElementById('game-container');
const profileContainer= document.getElementById('profile-container');

// Profile form fields
const profileForm     = document.getElementById('profile-form');
const usernameInput   = document.getElementById('username');
const sensValorant    = document.getElementById('sensValorant');
const highscoreSpan   = document.getElementById('highscore');

// Game elements
const canvas   = document.getElementById('game');
const ctx      = canvas.getContext('2d');
const menu     = document.getElementById('menu');
const stats    = document.getElementById('stats');
const scoreEl  = document.getElementById('score');
const accEl    = document.getElementById('acc');
const restart  = document.getElementById('restart');

// ——————————————————————————
// SETTINGS & STATE
// ——————————————————————————
const settings = {
  easy:   { spawnInterval: 1000, targetSize: 40, lifespan: 2000 },
  medium: { spawnInterval: 750, targetSize: 40, lifespan: 1000 },
  hard:   { spawnInterval: 500, targetSize: 40, lifespan: 750 },
};
const ROUND_DURATION = 30;  // seconds

let game = {
  state: 'menu', difficulty: null,
  timer: 0, score: 0, hits: 0, shots: 0,
  activeTargets: []
};
let lastTime = 0, spawnTimer = 0;

// Crosshair
let crosshair = { x: canvas.width/2, y: canvas.height/2 };

// ——————————————————————————
// PROFILE: load & save
// ——————————————————————————
function loadProfile() {
  usernameInput.value    = localStorage.getItem('username')    || '';
  sensValorant.value     = localStorage.getItem('sensValorant')|| '';
  highscoreSpan.textContent = localStorage.getItem('highscore') || '0';
}

profileForm.addEventListener('submit', e => {
  e.preventDefault();
  const sens = sensValorant.value.trim();
  if (!sens) {
    alert('Please enter your Valorant sensitivity before saving.');
    return;
  }
  localStorage.setItem('username',     usernameInput.value.trim());
  localStorage.setItem('sensValorant', sens);
  alert('Profile saved!');
});

// ——————————————————————————
// ROUTING
// ——————————————————————————
function route() {
  const hash = window.location.hash || '#game';
  if (hash === '#profile') {
    navGame.classList.remove('active');
    navProfile.classList.add('active');
    gameContainer.style.display    = 'none';
    profileContainer.style.display = 'block';
    loadProfile();
  } else {
    navProfile.classList.remove('active');
    navGame.classList.add('active');
    profileContainer.style.display = 'none';
    gameContainer.style.display    = 'block';
    menu.style.display   = 'block';
    stats.style.display  = 'none';
    canvas.style.display = 'none';
    game.state           = 'menu';
  }
}
window.addEventListener('hashchange', route);
route();

// ——————————————————————————
// INPUT SCALING (Valorant only)
// ——————————————————————————
function getScaledMovement(dx, dy) {
  const vs = parseFloat(localStorage.getItem('sensValorant') || '1');
  return { dx: dx * vs, dy: dy * vs };
}

// Pointer‑Lock
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

// ——————————————————————————
// GAME LOGIC
// ——————————————————————————
function startGame(diff) {
  // require sensValorant
  if (!localStorage.getItem('sensValorant')) {
    alert('Please configure your Valorant sensitivity in Profile first.');
    window.location.hash = '#profile';
    return;
  }

  game = {
    state: 'playing',
    difficulty: diff,
    timer: ROUND_DURATION,
    score: 0, hits: 0, shots: 0,
    activeTargets: []
  };
  crosshair = { x: canvas.width/2, y: canvas.height/2 };

  menu.style.display   = 'none';
  stats.style.display  = 'none';
  canvas.style.display = 'block';
  canvas.requestPointerLock();

  lastTime = performance.now();
  spawnTimer = 0;
  requestAnimationFrame(loop);
}

function endGame() {
  game.state = 'over';
  document.exitPointerLock();
  canvas.style.display = 'none';
  stats.style.display  = 'block';
  scoreEl.textContent  = game.score;
  const acc = game.shots ? Math.round(100 * game.hits / game.shots) : 0;
  accEl.textContent    = `${acc}%`;
  // save high score
  const curHigh = parseInt(localStorage.getItem('highscore')||'0',10);
  if (game.score > curHigh) localStorage.setItem('highscore', game.score);
}

function spawnTarget() {
  const { targetSize, lifespan } = settings[game.difficulty];
  const x = Math.random()*(canvas.width-2*targetSize)+targetSize;
  const y = Math.random()*(canvas.height-2*targetSize)+targetSize;
  game.activeTargets.push({ x, y, r: targetSize/2, created: performance.now() });
}

function update(dt, now) {
  if (game.state !== 'playing') return;

  // spawn every 1s
  spawnTimer += dt*1000;
  if (spawnTimer >= settings[game.difficulty].spawnInterval) {
    spawnTarget();
    spawnTimer = 0;
  }

  // expire old targets
  game.activeTargets = game.activeTargets.filter(
    t => now - t.created < settings[game.difficulty].lifespan
  );

  // round timer
  game.timer -= dt;
  if (game.timer <= 0) endGame();
}

function render() {
  if (game.state !== 'playing') return;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // draw targets
  ctx.fillStyle = 'red';
  game.activeTargets.forEach(t => {
    ctx.beginPath();
    ctx.arc(t.x,t.y,t.r,0,Math.PI*2);
    ctx.fill();
  });

  // draw crosshair
  ctx.strokeStyle = '#0f0';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(crosshair.x-10, crosshair.y);
  ctx.lineTo(crosshair.x+10, crosshair.y);
  ctx.moveTo(crosshair.x, crosshair.y-10);
  ctx.lineTo(crosshair.x, crosshair.y+10);
  ctx.stroke();

  // HUD
  ctx.fillStyle = '#0f0';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Time: ${Math.ceil(game.timer)}`,10,20);
  ctx.fillText(`Score: ${game.score}`,10,40);
}

canvas.addEventListener('mousedown', e => {
  if (game.state!=='playing' || e.button!==0) return;
  game.shots++;
  for (let i=0; i<game.activeTargets.length; i++){
    const t = game.activeTargets[i];
    const dx = crosshair.x - t.x, dy = crosshair.y - t.y;
    if (dx*dx + dy*dy <= t.r*t.r) {
      game.score++; game.hits++;
      game.activeTargets.splice(i,1);
      break;
    }
  }
});

function loop(ts) {
  const dt = (ts - lastTime)/1000;
  lastTime = ts;
  update(dt, ts);
  render();
  if (game.state==='playing') requestAnimationFrame(loop);
}

// menu buttons
document.querySelectorAll('#menu button').forEach(btn =>
  btn.addEventListener('click', () => startGame(btn.dataset.diff))
);
// restart button
restart.addEventListener('click', () => startGame(game.difficulty));
