document.getElementById("nav-game3").classList.add("active");
//Grid & Deck Generation
var symbols = [
  "🍎",
  "🍌",
  "🍇",
  "🍓",
  "🍍",
  "🥝",
  "🍉",
  "🍒",
  "🍑",
  "🍋",
  "🍊",
  "🥭",
  "🍐",
  "🍈",
  "🍏",
  "🍅",
  "🥥",
  "🥑",
];

var grid = document.querySelector(".grid-game3");
var difficulty = document.getElementById("difficulty");
var moves = document.getElementById("moves");
var resetBtn = document.getElementById("reset-btn-game3");
var timer = document.getElementById("timer");
var gameStats = document.getElementById("game-stats-game3");
var finalMoves = document.getElementById("final-moves");
var finalTime = document.getElementById("final-time");
var playAgain = document.getElementById("play-again");
var highScore = document.getElementById('high-score-game3');
var firstCard = null;
var secondCard = null;
var lockFlip = false;
var moveCount = 0;
var timerId = null;
var seconds = 0;

function init() {
  moveCount = 0;
  moves.textContent = "Moves: 0";
  firstCard = null;
  secondCard = null;
  lockFlip = false;
  clearInterval(timerId);
  timerId = null;
  seconds = 0;
  timer.textContent = "Time: 0s";
  gameStats.classList.remove("active");
  var total = parseInt(difficulty.value, 10);
  var pairCount = total / 2;
  var chosen = symbols.slice(0, pairCount);
  var deck = chosen.concat(chosen).sort(function () {
    return Math.random() - 0.5;
  });

  grid.classList.remove("grid-4", "grid-6");
  if (total === 16) {
    grid.classList.add("grid-4");
  } else {
    grid.classList.add("grid-6");
  }

  // clear any existing cards
  grid.innerHTML = "";
  loadHighScore();

  // create each card element
  for (var i = 0; i < deck.length; i++) {
    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      '<div class="card-inner">' +
      '<div class="card-face-front">?</div>' +
      '<div class="card-face-back">' +
      deck[i] +
      "</div>" +
      "</div>";
    card.addEventListener("click", onCardClick);
    grid.appendChild(card);
  }
}

function onCardClick() {
  if (!timerId) {
    timerId = setInterval(function () {
      seconds++;
      timer.textContent = "Time: " + seconds + "s";
    }, 1000);
  }
  if (lockFlip || this.classList.contains("flip")) return;
  this.classList.add("flip");
  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockFlip = true;

  // update moves
  moveCount++;
  moves.textContent = "Moves: " + moveCount;

  var a = firstCard.querySelector(".card-face-back").textContent;
  var b = secondCard.querySelector(".card-face-back").textContent;

  if (a === b) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard = null;
    secondCard = null;
    lockFlip = false;
  } else {
    setTimeout(function () {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      firstCard = null;
      secondCard = null;
      lockFlip = false;
    }, 800);
  }
  var matchedCount = document.querySelectorAll(".card.matched").length;
  var total = parseInt(difficulty.value, 10);
  if (matchedCount === total) {
    clearInterval(timerId);
    finalMoves.textContent = moveCount;
    finalTime.textContent = seconds;
    saveHighScore();
    gameStats.classList.add("active");
  }
}

function getHighScoreKey() {
  var total = parseInt(difficulty.value, 10);
  return 'memoryMatchHighScore_' + total;
}

function loadHighScore() {
  var key = getHighScoreKey();
  var raw = localStorage.getItem(key);
  if (!raw) {
    highScore.textContent = 'Best Score: --';
    return;
  }
  var hs = JSON.parse(raw);
  highScore.textContent =
    'Best Scote: ' + hs.moves + ' moves, ' + hs.time + 's';
}

function saveHighScore() {
  var key = getHighScoreKey();
  var raw = localStorage.getItem(key);
  var old = raw ? JSON.parse(raw) : null;
  var better =
    !old ||
    moveCount < old.moves ||
    (moveCount === old.moves && seconds < old.time);
  if (!better) return;

  var hs = { moves: moveCount, time: seconds };
  localStorage.setItem(key, JSON.stringify(hs));
  highScore.textContent =
    'Best Score: ' + hs.moves + ' moves, ' + hs.time + 's';
}



// 4. Run init on page load and when difficulty changes
document.addEventListener("DOMContentLoaded", init);
difficulty.addEventListener("change", init);
resetBtn.addEventListener("click", init);
playAgain.addEventListener("click", init);
