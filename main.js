import { animate, inView, stagger } from 'framer-motion/dom'
import EmblaCarousel from 'embla-carousel'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
if (location.hash) history.replaceState(null, '', location.pathname)
window.scrollTo(0, 0)

const ease = [0.25, 0.46, 0.45, 0.94]

// ─── LOADER ──────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  animate(
    '#loader .loader-logo',
    { opacity: [0, 1], y: [20, 0] },
    { duration: 1, delay: 0.3, ease }
  )

  setTimeout(() => {
    animate('#loader', { opacity: [1, 0] }, { duration: 0.8, ease }).then(() => {
      const loader = document.getElementById('loader')
      loader.style.visibility = 'hidden'
      loader.style.pointerEvents = 'none'
    })
  }, 1800)
})

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar')
let rafPending = false
window.addEventListener('scroll', () => {
  if (rafPending) return
  rafPending = true
  requestAnimationFrame(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 60)
    rafPending = false
  })
}, { passive: true })

// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle')
const navLinks = document.getElementById('navLinks')
let menuIsOpen = false
let menuAnimating = false

async function openMenu() {
  if (menuAnimating) return
  menuAnimating = true
  menuIsOpen = true
  menuToggle.classList.add('open')
  document.documentElement.style.overflow = 'hidden'
  navLinks.style.visibility = 'visible'
  navLinks.style.pointerEvents = 'auto'

  animate(navLinks, { opacity: [0, 1] }, { duration: 0.35, ease })
  await animate(
    Array.from(navLinks.querySelectorAll('li')),
    { opacity: [0, 1], y: [28, 0] },
    { duration: 0.4, delay: stagger(0.07, { startDelay: 0.1 }), ease }
  )
  menuAnimating = false
}

async function closeMenu() {
  if (menuAnimating) return
  menuAnimating = true
  menuIsOpen = false
  menuToggle.classList.remove('open')
  document.documentElement.style.overflow = ''
  navLinks.style.pointerEvents = 'none'

  animate(
    Array.from(navLinks.querySelectorAll('li')).reverse(),
    { opacity: [1, 0], y: [0, 14] },
    { duration: 0.22, delay: stagger(0.05), ease }
  )
  await animate(navLinks, { opacity: [1, 0] }, { duration: 0.3, delay: 0.12, ease })
  navLinks.style.visibility = 'hidden'
  menuAnimating = false
}

menuToggle.addEventListener('click', () => {
  if (menuIsOpen) closeMenu()
  else openMenu()
})

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => { if (menuIsOpen) closeMenu() })
})

// ─── HERO — staggered entrance ───────────────────────────────────────────────
animate('.hero-tag',  { opacity: [0, 1], y: [10, 0] }, { duration: 0.7,  delay: 1.2,  ease })
animate('.hero h1',   { opacity: [0, 1], y: [28, 0] }, { duration: 1.1,  delay: 1.5,  ease: [0.16, 1, 0.3, 1] })
animate('.hero-desc', { opacity: [0, 1], y: [18, 0] }, { duration: 0.85, delay: 1.85, ease })
animate('.hero-cta',  { opacity: [0, 1], y: [14, 0] }, { duration: 0.75, delay: 2.8,  ease })

// scroll-hint: opacity only — preserves translateX(-50%) centering
animate('.scroll-hint', { opacity: [0, 1] }, { duration: 1, delay: 2.5, ease })

// ─── SCROLL REVEALS — fade up ─────────────────────────────────────────────────
document
  .querySelectorAll('.reveal:not(.service-card):not(.test-card)')
  .forEach(el => {
    const stop = inView(el, () => {
      animate(el, { opacity: [0, 1], y: [50, 0] }, { duration: 0.9, ease })
      stop()
    }, { amount: 0.15 })
  })

// ─── SCROLL REVEALS — slide from left ────────────────────────────────────────
document.querySelectorAll('.reveal-left').forEach(el => {
  const stop = inView(el, () => {
    animate(el, { opacity: [0, 1], x: [-60, 0] }, { duration: 1, ease })
    stop()
  }, { amount: 0.15 })
})

// ─── SCROLL REVEALS — slide from right ───────────────────────────────────────
document.querySelectorAll('.reveal-right').forEach(el => {
  const stop = inView(el, () => {
    animate(el, { opacity: [0, 1], x: [60, 0] }, { duration: 1, ease })
    stop()
  }, { amount: 0.15 })
})

// ─── RESULTS CAROUSEL (Embla) ────────────────────────────────────────────────
const emblaViewport = document.querySelector('.embla__viewport')
const prevBtn = document.querySelector('.results-prev')
const nextBtn = document.querySelector('.results-next')
if (emblaViewport && prevBtn && nextBtn) {
  const embla = EmblaCarousel(emblaViewport, { loop: false, align: 'start', dragFree: false })

  const updateButtons = () => {
    prevBtn.disabled = !embla.canScrollPrev()
    nextBtn.disabled = !embla.canScrollNext()
  }
  updateButtons()
  embla.on('select', updateButtons)
  embla.on('reInit', updateButtons)

  prevBtn.addEventListener('click', () => embla.scrollPrev())
  nextBtn.addEventListener('click', () => embla.scrollNext())
}

// ─── STAGGERED REVEALS — service cards ──────────────────────────────────────
const stopServices = inView('.services-grid', () => {
  document.querySelectorAll('.service-card').forEach((card, i) => {
    animate(card, { opacity: [0, 1], y: [50, 0] }, { duration: 0.8, ease, delay: i * 0.1 })
  })
  stopServices()
}, { amount: 0.08 })

// ─── STAGGERED REVEALS — testimonial cards ───────────────────────────────────
const stopTest = inView('.test-grid', () => {
  document.querySelectorAll('.test-card').forEach((card, i) => {
    animate(card, { opacity: [0, 1], y: [50, 0] }, { duration: 0.8, ease, delay: i * 0.15 })
  })
  stopTest()
}, { amount: 0.08 })

// ─── HOVER — apenas em dispositivos com ponteiro real (não touch) ─────────────
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      animate(card, { y: -8 }, { duration: 0.35, ease })
    })
    card.addEventListener('mouseleave', () => {
      animate(card, { y: 0 }, { duration: 0.4, ease })
    })
  })

  document.querySelectorAll('.test-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      animate(card, { y: -5 }, { duration: 0.3, ease })
    })
    card.addEventListener('mouseleave', () => {
      animate(card, { y: 0 }, { duration: 0.4, ease })
    })
  })
}

// ─── ANCHOR LINKS — scroll suave sem alterar a URL ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href')
    if (href === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    const target = document.querySelector(href)
    if (!target) return
    e.preventDefault()
    target.scrollIntoView({ behavior: 'smooth' })
  })
})
