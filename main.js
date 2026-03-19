/* ═══════════════════════════════════════════════════
   SILVERSTONES — main.js
   Language switching, Scroll animations, Navbar, Form
═══════════════════════════════════════════════════ */

/* ─── LANGUAGE SYSTEM ─── */
let currentLang = localStorage.getItem('ss-lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ss-lang', lang);

  // Toggle active button state
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btn-' + lang)?.classList.add('active');
  document.getElementById('m-btn-' + lang)?.classList.add('active');

  // Update all elements with data-en / data-ru
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (!text) return;

    // Handle innerHTML if it contains tags like <em>
    if (text.includes('<')) {
      el.innerHTML = text;
    } else {
      // For inputs/select options check tag
      if (el.tagName === 'OPTION') {
        el.textContent = text;
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        // don't overwrite values, just placeholder if needed
      } else {
        el.textContent = text;
      }
    }
  });

  // Select options placeholders
  document.querySelectorAll('select option[data-en]').forEach(opt => {
    opt.textContent = opt.getAttribute('data-' + lang) || opt.getAttribute('data-en');
  });

  // Update <html> lang attribute
  document.documentElement.lang = lang;
}

/* ─── NAVBAR ─── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNavLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

/* ─── ACTIVE NAV LINK ─── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightNavLink() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ─── SCROLL REVEAL (Intersection Observer) ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── CONTACT FORM ─── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const name = document.getElementById('cf-name').value;
  const email = document.getElementById('cf-email').value;
  const subject = document.getElementById('cf-subject').value;
  const message = document.getElementById('cf-message').value;

  // Build mailto link
  const mailBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailLink = `mailto:ditrix.live@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
  window.location.href = mailLink;

  // Visual feedback
  const originalText = btn.querySelector('span')?.textContent || btn.textContent;
  btn.textContent = currentLang === 'ru' ? '✓ Открывается почта...' : '✓ Opening mail app...';
  btn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
  setTimeout(() => {
    if (btn.querySelector('span')) btn.querySelector('span').textContent = originalText;
    else btn.textContent = originalText;
    btn.style.background = '';
  }, 3000);
}

/* ─── SMOOTH SCROLL for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
  highlightNavLink();
});
