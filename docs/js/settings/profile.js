document.getElementById('nav-profile').classList.add('active');

const form = document.getElementById('profile-form');
const userIn = document.getElementById('username');
const photoIn = document.getElementById('photo');
const sensIn = document.getElementById('sensValorant');
const hsAimEl = document.getElementById('highscore-aim');
const hsGuessEl = document.getElementById('highscore-guess');
const hsMemoryEl = document.getElementById('highscore-memory');
const resetButton = document.getElementById('reset-profile');

// Profile display elements
const displayUsername = document.getElementById('display-username');
const displaySensitivity = document.getElementById('display-sensitivity');
const profilePhoto = document.getElementById('profile-photo');

// Default avatar as data URI
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzM0M2E0MCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEwMCIgcj0iNTAiIGZpbGw9IiM3ZjhjOGQiLz48cGF0aCBkPSJNMjE0IDIxNy4xQzIxNCAyMTcuMSAxODkuNCAxNjggMTI4IDE2OEMxMjggMTY4IDY2LjYgMTY4IDQyIDE3Ny4xQzE3LjQgMTg2LjIgNDIgMjE3LjEgNDIgMjE3LjFIMjE0WiIgZmlsbD0iIzdmOGM4ZCIvPjwvc3ZnPg==';

function loadProfile() {
  const username = localStorage.getItem('username') || '';
  const sensitivity = localStorage.getItem('sensValorant') || '';
  const photoUrl = localStorage.getItem('profilePhoto');
  
  userIn.value = username;
  sensIn.value = sensitivity;
  displayUsername.textContent = username || 'Username';
  displaySensitivity.textContent = sensitivity || '0.45';
  
  // Update profile photo if exists
  if (photoUrl) {
    profilePhoto.src = photoUrl;
  } else {
    profilePhoto.src = DEFAULT_AVATAR;
  }
  
  // Update highscores
  hsAimEl.textContent = localStorage.getItem('highscore-aim') || '0';
  
  // Get game2 high score from localStorage
  const game2HighScore = localStorage.getItem('game2-high-score') || '0';
  hsGuessEl.textContent = game2HighScore;
  
  hsMemoryEl.textContent = localStorage.getItem('highscore-memory') || '0';
}

// Reset profile data
function resetProfile() {
  // Ask for confirmation
  const confirmReset = confirm("Are you sure you want to reset your profile? This will clear all your profile data and high scores.");
  
  if (confirmReset) {
    // Clear profile data
    localStorage.removeItem('username');
    localStorage.removeItem('sensValorant');
    localStorage.removeItem('profilePhoto');
    
    // Clear high scores
    localStorage.removeItem('highscore-aim');
    localStorage.removeItem('game2-high-score');
    localStorage.removeItem('highscore-memory');
    
    // Reset form and display
    userIn.value = '';
    sensIn.value = '';
    displayUsername.textContent = 'Username';
    displaySensitivity.textContent = '0.45';
    profilePhoto.src = DEFAULT_AVATAR;
    
    // Reset high score displays
    hsAimEl.textContent = '0';
    hsGuessEl.textContent = '0';
    hsMemoryEl.textContent = '0';
    
    alert('Profile has been reset successfully.');
  }
}

// Handle profile photo upload
photoIn.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const photoUrl = event.target.result;
      profilePhoto.src = photoUrl;
    };
    reader.readAsDataURL(file);
  }
});

// Clear custom validation messages when input changes
sensIn.addEventListener('input', () => {
  sensIn.setCustomValidity('');
});

form.addEventListener('submit', e => {
  e.preventDefault();
  
  // Check HTML5 form validation first
  if (!form.checkValidity()) {
    // If the form is invalid, trigger the browser's validation UI
    form.reportValidity();
    return;
  }
  
  // Additional validation for sensitivity
  const sensitivityValue = parseFloat(sensIn.value.trim());
  if (!sensitivityValue) {
    sensIn.setCustomValidity('Please enter your sensitivity before saving.');
    sensIn.reportValidity();
    return;
  }
  
  if (sensitivityValue < 0.01 || sensitivityValue > 10) {
    sensIn.setCustomValidity('Sensitivity must be between 0.01 and 10.');
    sensIn.reportValidity();
    return;
  } else {
    // Clear any previous custom validity message
    sensIn.setCustomValidity('');
  }
  
  // Save form data
  const username = userIn.value.trim();
  const sensitivity = sensitivityValue.toString();
  
  localStorage.setItem('username', username);
  localStorage.setItem('sensValorant', sensitivity);
  
  // Save profile photo if a new one was uploaded
  if (photoIn.files && photoIn.files[0]) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const photoUrl = event.target.result;
      localStorage.setItem('profilePhoto', photoUrl);
    };
    reader.readAsDataURL(photoIn.files[0]);
  }
  
  // Update display elements
  displayUsername.textContent = username || 'Username';
  displaySensitivity.textContent = sensitivity || '0.45';
  
  alert('Profile saved!');
});

// Add event listener for reset button
resetButton.addEventListener('click', resetProfile);

// Initialize profile
loadProfile();
