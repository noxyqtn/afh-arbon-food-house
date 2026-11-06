/* ============================================
   AFH Arbon Food House – Main Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initScrollReveal();
  initSmoothScroll();
  initCartButton();
});

/* ------------------------------------------------------------------
   Mobile Menu Toggle
   ------------------------------------------------------------------ */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const links = menu.querySelectorAll('[data-close-menu]');

  if (!btn || !menu) return;

  let isOpen = false;

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.classList.toggle('hidden', !isOpen);

    // Animate hamburger to X
    const svg = btn.querySelector('svg');
    if (isOpen) {
      svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    } else {
      svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
    }
  });

  // Close when clicking a link
  links.forEach((link) => {
    link.addEventListener('click', () => {
      isOpen = false;
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      const svg = btn.querySelector('svg');
      svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
    });
  });
}

/* ------------------------------------------------------------------
   Sticky Header on scroll
   ------------------------------------------------------------------ */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

/* ------------------------------------------------------------------
   Scroll Reveal Animations (Intersection Observer)
   ------------------------------------------------------------------ */
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-aos attribute
  document.querySelectorAll('[data-aos]').forEach((el) => {
    el.classList.add('reveal');
    const delay = el.dataset.aosDelay || '0';
    el.style.transitionDelay = `${delay}s`;
    observer.observe(el);
  });
}

/* ------------------------------------------------------------------
   Smooth Scroll for internal anchor links
   ------------------------------------------------------------------ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerOffset = 80; // height of sticky header
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    });
  });
}

/* ------------------------------------------------------------------
   Cart Button Hover Enhancements
   ------------------------------------------------------------------ */
function initCartButton() {
  const cartBtn = document.querySelector('.cart-btn');
  if (!cartBtn) return;

  // Add a subtle scale on mousemove for a 3D tilt effect
  cartBtn.addEventListener('mousemove', (e) => {
    const rect = cartBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5; // max 5deg
    const rotateY = ((x - centerX) / centerX) * 5;

    cartBtn.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  cartBtn.addEventListener('mouseleave', () => {
    cartBtn.style.transform = 'perspective(500px) rotateX(0) rotateY(0) scale(1)';
  });
}

/* ------------------------------------------------------------------
   Expose for inline handlers if needed
   ------------------------------------------------------------------ */
window.AFH = {
  scrollToSection: (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
};