document.getElementById('nav-game2').classList.add('active');

document.addEventListener('DOMContentLoaded', () => {
  // Game elements
  const difficultySelect = document.getElementById('difficulty-game2');
  const startButton = document.getElementById('start-btn-game2');
  const guessInput = document.getElementById('guess-input-game2');
  const submitButton = document.getElementById('submit-guess-game2');
  const messageElement = document.getElementById('message-game2');
  const attemptsElement = document.getElementById('attempts-game2');
  const scoreElement = document.getElementById('score-game2');
  const highScoreElement = document.getElementById('high-score-game2');
  const guessHistoryElement = document.getElementById('guess-history-game2');
  const numberRangeElement = document.querySelector('.number-range-game2');
  const errorElement = document.getElementById('input-error-game2');
  const gameStatsOverlay = document.getElementById('game-stats-game2');
  const finalAttemptsElement = document.getElementById('final-attempts-game2');
  const finalScoreElement = document.getElementById('final-score-game2');
  const finalHighScoreElement = document.getElementById('final-high-score-game2');
  const playAgainButton = document.getElementById('play-again-game2');

  // Game state
  let gameActive = false;
  let secretNumber = 0;
  let attempts = 0;
  let score = 0;
  let highScore = localStorage.getItem('game2-high-score') ? parseInt(localStorage.getItem('game2-high-score')) : 0;
  let maxNumber = parseInt(difficultySelect.value);
  let guessHistory = [];

  // Update high score display
  if (highScoreElement) {
    highScoreElement.textContent = `High Score: ${highScore}`;
  }

  // Initialize the game
  function initGame() {
    // Reset game state
    gameActive = true;
    attempts = 0;
    score = 0;
    guessHistory = [];
    maxNumber = parseInt(difficultySelect.value);
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    
    // Update UI
    updateUI();
    
    // Hide game stats overlay if it's visible
    hideGameStatsOverlay();
  }

  // Update all UI elements
  function updateUI() {
    if (guessInput) {
      guessInput.max = maxNumber;
      guessInput.disabled = false;
      guessInput.value = '';
      guessInput.focus();
    }
    
    if (numberRangeElement) {
      numberRangeElement.textContent = `1-${maxNumber}`;
    }
    
    if (attemptsElement) {
      attemptsElement.textContent = `Attempts: ${attempts}`;
    }
    
    if (scoreElement) {
      scoreElement.textContent = `Score: ${score}`;
    }
    
    if (messageElement) {
      messageElement.textContent = '';
      messageElement.className = '';
    }

    if (guessHistoryElement) {
      guessHistoryElement.innerHTML = '';
    }
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    // Enable submit button
    if (submitButton) {
      submitButton.disabled = false;
    }
  }

  // Hide game stats overlay
  function hideGameStatsOverlay() {
    if (gameStatsOverlay) {
      if (gameStatsOverlay.style.display === 'flex') {
        gameStatsOverlay.classList.remove('active');
        setTimeout(() => {
          gameStatsOverlay.style.display = 'none';
        }, 300);
      } else {
        gameStatsOverlay.style.display = 'none';
        gameStatsOverlay.classList.remove('active');
      }
    }
  }

  // Check the player's guess
  function checkGuess() {
    if (!guessInput) return;
    
    const guess = parseInt(guessInput.value);
    
    // Validate input
    if (isNaN(guess) || guess < 1 || guess > maxNumber) {
      if (errorElement) {
        errorElement.textContent = `Please enter a number between 1 and ${maxNumber}.`;
      }
      return;
    }
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    attempts++;
    if (attemptsElement) {
      attemptsElement.textContent = `Attempts: ${attempts}`;
    }
    
    // Add to guess history
    addToHistory(guess);
    
    // Check if guess is correct
    if (guess === secretNumber) {
      handleCorrectGuess();
    } else if (guess < secretNumber) {
      if (messageElement) {
        messageElement.textContent = 'Too low! Try a higher number.';
        messageElement.className = 'error-game2';
      }
    } else {
      if (messageElement) {
        messageElement.textContent = 'Too high! Try a lower number.';
        messageElement.className = 'error-game2';
      }
    }
    
    // Clear input for next guess
    guessInput.value = '';
    guessInput.focus();
  }

  // Add guess to history
  function addToHistory(guess) {
    if (!guessHistoryElement) return;
    
    guessHistory.push(guess);
    
    const listItem = document.createElement('li');
    listItem.textContent = guess;
    
    // Style based on comparison to secret number
    if (guess === secretNumber) {
      listItem.classList.add('success-game2');
    } else if (guess < secretNumber) {
      listItem.classList.add('too-low-game2');
    } else {
      listItem.classList.add('too-high-game2');
    }
    
    guessHistoryElement.appendChild(listItem);
  }

  // Handle correct guess
  function handleCorrectGuess() {
    gameActive = false;
    
    // Calculate score based on attempts and difficulty
    score = calculateScore();
    if (scoreElement) {
      scoreElement.textContent = `Score: ${score}`;
    }
    
    // Update high score if needed
    updateHighScore();
    
    // Display success message
    if (messageElement) {
      messageElement.textContent = `Congratulations! You guessed the number ${secretNumber} in ${attempts} attempts!`;
      messageElement.className = 'success-game2';
    }
    
    // Disable input and submit button
    if (guessInput) {
      guessInput.disabled = true;
    }
    
    if (submitButton) {
      submitButton.disabled = true;
    }
    
    // Show game stats overlay
    showGameStats();
  }

  // Update high score if current score is higher
  function updateHighScore() {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('game2-high-score', highScore);
      if (highScoreElement) {
        highScoreElement.textContent = `High Score: ${highScore}`;
      }
    }
  }

  // Calculate score based on attempts and difficulty
  function calculateScore() {
    // Base score depends on difficulty
    const baseScore = maxNumber;
    
    // Penalty for each attempt
    const attemptPenalty = Math.ceil(baseScore / 20);
    
    // Calculate score (minimum score is 1)
    return Math.max(1, baseScore - (attempts - 1) * attemptPenalty);
  }

  // Show game stats overlay
  function showGameStats() {
    if (!gameStatsOverlay) return;
    
    if (finalAttemptsElement) {
      finalAttemptsElement.textContent = attempts;
    }
    
    if (finalScoreElement) {
      finalScoreElement.textContent = score;
    }
    
    if (finalHighScoreElement) {
      finalHighScoreElement.textContent = highScore;
    }
    
    gameStatsOverlay.style.display = 'flex';
    setTimeout(() => {
      gameStatsOverlay.classList.add('active');
    }, 10);
  }

  // Set up event listeners
  function setupEventListeners() {
    if (startButton) {
      startButton.addEventListener('click', initGame);
    }
    
    if (submitButton) {
      submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (gameActive) {
          checkGuess();
        }
      });
    }
    
    if (guessInput) {
      guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && gameActive) {
          e.preventDefault();
          checkGuess();
        }
      });
    }
    
    if (playAgainButton) {
      playAgainButton.addEventListener('click', () => {
        if (gameStatsOverlay) {
          gameStatsOverlay.classList.remove('active');
        }
        setTimeout(initGame, 300);
      });
    }
    
    if (difficultySelect) {
      difficultySelect.addEventListener('change', () => {
        maxNumber = parseInt(difficultySelect.value);
        if (numberRangeElement) {
          numberRangeElement.textContent = `1-${maxNumber}`;
        }
        if (guessInput) {
          guessInput.max = maxNumber;
        }
      });
    }
  }

  // Initialize the game
  setupEventListeners();
  initGame();
});
