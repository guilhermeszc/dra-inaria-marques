// Loader
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1800);
});

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// Smooth counter animation for stats
const counters = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const num = parseInt(text.replace(/\D/g, ''));
      const suffix = text.replace(/[0-9]/g, '');
      let current = 0;
      const step = Math.ceil(num / 60);
      const timer = setInterval(() => {
        current += step;
        if (current >= num) { current = num; clearInterval(timer); }
        el.textContent = current + suffix;
      }, 25);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));
