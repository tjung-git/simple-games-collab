document.getElementById('nav-profile').classList.add('active');

const form       = document.getElementById('profile-form');
const userIn     = document.getElementById('username');
const sensIn     = document.getElementById('sensValorant');
const hsAimEl     = document.getElementById('highscore-aim');
const hsGuessEl   = document.getElementById('highscore-guess');
const hsMemoryEl  = document.getElementById('highscore-memory');

function loadProfile() {
  userIn.value   = localStorage.getItem('username')      || '';
  sensIn.value   = localStorage.getItem('sensValorant')  || '';
  hsAimEl.textContent    = localStorage.getItem('highscore-aim')    || '0';
  hsGuessEl.textContent  = localStorage.getItem('highscore-guess')  || '0';
  hsMemoryEl.textContent = localStorage.getItem('highscore-memory') || '0';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!sensIn.value.trim()) {
    return alert('Please enter your Valorant sensitivity before saving.');
  }
  localStorage.setItem('username',     userIn.value.trim());
  localStorage.setItem('sensValorant', sensIn.value.trim());
  alert('Profile saved!');
});

loadProfile();
