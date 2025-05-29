document.getElementById('nav-profile').classList.add('active');

const form       = document.getElementById('profile-form');
const userIn     = document.getElementById('username');
const sensIn     = document.getElementById('sensValorant');
const hsSpan     = document.getElementById('highscore');

function loadProfile() {
  userIn.value      = localStorage.getItem('username')    || '';
  sensIn.value      = localStorage.getItem('sensValorant')|| '';
  hsSpan.textContent= localStorage.getItem('highscore')   || '0';
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
