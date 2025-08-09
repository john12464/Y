document.getElementById('year').textContent = new Date().getFullYear()

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle')
const nav = document.getElementById('site-nav')
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open')
    toggle.setAttribute('aria-expanded', String(open))
  })
}

// Initialize animations if elements exist
if (document.getElementById('galaxy')) {
  window.NebulaGalaxy && window.NebulaGalaxy.init('#galaxy')
}
if (document.getElementById('cubes-scene')) {
  window.NebulaCubes && window.NebulaCubes.init('#cubes-scene', '#cubes-wrapper')
}