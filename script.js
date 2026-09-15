particlesJS("particles-js", {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 900 } },
    color: { value: "#a855f7" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
    size: { value: 2, random: true, anim: { enable: true, speed: 2, size_min: 0.5, sync: false } },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#a855f7",
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out"
    }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      grab: { distance: 160, line_linked: { opacity: 0.5 } },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});

const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');
const spotlight = document.querySelector('.spotlight');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
  spotlight.style.left = mouseX + 'px';
  spotlight.style.top = mouseY + 'px';
});

function animateCursor() {
  outlineX += (mouseX - outlineX) * 0.15;
  outlineY += (mouseY - outlineY) * 0.15;
  outline.style.left = outlineX + 'px';
  outline.style.top = outlineY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .avatar-card').forEach(el => {
  el.addEventListener('mouseenter', () => outline.classList.add('hover'));
  el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
});

const card = document.getElementById('avatar-card');
const container = document.querySelector('.container');

document.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 768) return;
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rotateY = ((e.clientX - centerX) / rect.width) * 20;
  const rotateX = -((e.clientY - centerY) / rect.height) * 20;
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

card.addEventListener('mouseleave', () => {
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const particles = document.getElementById('particles-js');
  if (particles) particles.style.transform = `translateY(${scrollY * 0.3}px)`;
  if (card) card.style.marginTop = `${scrollY * 0.05}px`;
});

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeIcon.textContent = next === 'dark' ? '🌙' : '☀️';
  const particleColor = next === 'dark' ? '#a855f7' : '#7c3aed';
  if (window.pJSDom && window.pJSDom[0]) {
    window.pJSDom[0].pJS.particles.color.value = particleColor;
    window.pJSDom[0].pJS.particles.line_linked.color = particleColor;
    window.pJSDom[0].pJS.fn.particlesRefresh();
  }
});

const copyBtn = document.getElementById('copy-btn');
const toast = document.getElementById('toast');

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(CONFIG.copyLink);
    showToast('Скопировано!');
  } catch (err) {
    const temp = document.createElement('input');
    temp.value = CONFIG.copyLink;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    showToast('Скопировано!');
  }
});

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

const typedEl = document.getElementById('typed');
const text = CONFIG.channelName;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!isDeleting) {
    typedEl.textContent = text.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === text.length) {
      isDeleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
    setTimeout(typeLoop, 150);
  } else {
    typedEl.textContent = text.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      setTimeout(typeLoop, 500);
      return;
    }
    setTimeout(typeLoop, 80);
  }
}
typeLoop();

let currentLang = localStorage.getItem('lang') || 'ru';

async function loadLang(lang) {
  try {
    const res = await fetch(`locales/${lang}.json`);
    const data = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (data[key]) el.textContent = data[key];
    });
    document.getElementById('lang-toggle').textContent = lang === 'ru' ? 'EN' : 'RU';
  } catch (e) {
    console.error('Lang load error', e);
  }
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  currentLang = currentLang === 'ru' ? 'en' : 'ru';
  localStorage.setItem('lang', currentLang);
  loadLang(currentLang);
});

loadLang(currentLang);
