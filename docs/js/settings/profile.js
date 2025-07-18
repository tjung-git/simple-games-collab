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

// Default profile picture from Wikimedia Commons
const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';

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
  
  

  (function () {
  const mm16 = JSON.parse(localStorage.getItem('memoryMatchHighScore_16') || '0');
  const mm36 = JSON.parse(localStorage.getItem('memoryMatchHighScore_36') || '0');

  const normalTxt = mm16
    ? `Normal(4x4) : ${mm16.moves} m, ${mm16.time}s`
    : 'Normal(4x4) : --';
  const hardTxt   = mm36
    ? `Hard(6x6) : ${mm36.moves} m, ${mm36.time}s`
    : 'Hard(6x6) : --';

  hsMemoryEl.innerHTML = '<br>' + normalTxt + '<br>' + hardTxt;
})();
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
    localStorage.removeItem('memoryMatchHighScore_16');
    localStorage.removeItem('memoryMatchHighScore_36');
  
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
