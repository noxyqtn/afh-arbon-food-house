/* ============================================
   AFH Arbon Food House – Main Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initMobileMenu();
  initStickyHeader();
  initSmoothScroll();
  initMagneticButtons();
  initHeroParallax();
  initScrollReveal();
  initCartButton();
});

/* ------------------------------------------------------------------
   Custom Cursor
   ------------------------------------------------------------------ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Follower lags behind slightly
  function animateFollower() {
    const dx = mouseX - followerX;
    const dy = mouseY - followerY;
    followerX += dx * 0.15;
    followerY += dy * 0.15;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state on interactive elements
  const interactives = document.querySelectorAll('a, button, [data-magnetic]');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2.5)';
      cursor.style.background = 'rgba(255, 107, 0, 0.25)';
      cursor.style.borderColor = 'rgba(255, 107, 0, 0.5)';
      follower.style.transform = 'scale(1.5)';
      follower.style.borderColor = 'rgba(255, 107, 0, 0.4)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.background = 'rgba(255, 107, 0, 0.1)';
      cursor.style.borderColor = 'rgba(255, 107, 0, 0.3)';
      follower.style.transform = 'scale(1)';
      follower.style.borderColor = 'rgba(255, 107, 0, 0.2)';
    });
  });

  // Hide cursor on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
  }
}

/* ------------------------------------------------------------------
   Mobile Menu Toggle
   ------------------------------------------------------------------ */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const links = menu.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  let isOpen = false;

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    menu.classList.toggle('hidden', !isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      isOpen = false;
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ------------------------------------------------------------------
   Sticky Header on scroll
   ------------------------------------------------------------------ */
function initStickyHeader() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function update() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 20) {
      navbar.classList.add('shadow-glow');
      navbar.classList.add('bg-dark-900/95');
    } else {
      navbar.classList.remove('shadow-glow');
      navbar.classList.remove('bg-dark-900/95');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ------------------------------------------------------------------
   Smooth Scroll for internal anchor links
   ------------------------------------------------------------------ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerOffset = 80;
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
   Magnetic Buttons (buttons that pull toward cursor)
   ------------------------------------------------------------------ */
function initMagneticButtons() {
  const magnets = document.querySelectorAll('[data-magnetic], .btn-primary, .btn-outline, .cart-btn');

  magnets.forEach((magnet) => {
    magnet.addEventListener('mousemove', (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = 'translate(0, 0)';
    });
  });
}

/* ------------------------------------------------------------------
   Hero Parallax (image + glow move slower on scroll)
   ------------------------------------------------------------------ */
function initHeroParallax() {
  const heroImage = document.getElementById('heroImage');
  const heroGlow = document.getElementById('heroGlow');
  const heroSection = document.getElementById('home');

  if (!heroSection) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const sectionTop = heroSection.offsetTop;
    const sectionHeight = heroSection.offsetHeight;

    if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
      const progress = (scrollY - sectionTop) / sectionHeight;

      if (heroImage) {
        heroImage.style.transform = `scale(${1 + progress * 0.15})`;
      }
      if (heroGlow) {
        heroGlow.style.opacity = Math.max(0, 0.1 - progress * 0.1);
        heroGlow.style.transform = `translate(-50%, -50%) scale(${1 + progress * 0.3})`;
      }
    }
  }, { passive: true });
}

/* ------------------------------------------------------------------
   Scroll Reveal Animations with GSAP ScrollTrigger
   ------------------------------------------------------------------ */
function initScrollReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Reveal elements on scroll
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Stagger service cards
  gsap.fromTo(
    '.service-card',
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // Stagger menu cards
  gsap.fromTo(
    '.menu-card',
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#menu',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // Stagger review cards
  gsap.fromTo(
    '.review-card',
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#reviews',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // Hero title split animation
  gsap.fromTo(
    '#home h1',
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3,
    }
  );

  gsap.fromTo(
    '#home .btn-primary, #home .btn-outline',
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.8,
    }
  );
}

/* ------------------------------------------------------------------
   Cart Button 3D Tilt Effect
   ------------------------------------------------------------------ */
function initCartButton() {
  const cartBtn = document.querySelector('.cart-btn');
  if (!cartBtn) return;

  cartBtn.addEventListener('mousemove', (e) => {
    const rect = cartBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    cartBtn.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  cartBtn.addEventListener('mouseleave', () => {
    cartBtn.style.transform = 'perspective(500px) rotateX(0) rotateY(0) scale(1)';
  });
}

/* ------------------------------------------------------------------
   Expose for inline handlers
   ------------------------------------------------------------------ */
window.AFH = {
  scrollToSection: (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
};
