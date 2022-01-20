function displayToggle() {
  document.getElementById('navMenu').classList.toggle('js-hidden');
  document.getElementById('navBtn').classList.toggle('js-menuOpen');
}

window.onclick = function (event) {
  if (!event.target.matches('.nav-btn') &&
  !event.target.matches('.nav-btn span')) {
    var navMenu = document.getElementById('navMenu');
    var navBtn = document.getElementById('navBtn');
    if (!navMenu.classList.contains('js-hidden')) {
      navMenu.classList.add('js-hidden');
      navBtn.classList.remove('js-menuOpen');
    }
  }
};