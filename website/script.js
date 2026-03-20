/**
 * Vikram Sankhala - Portfolio Website
 * Smooth scroll, nav, and scroll-triggered animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initSmoothScroll();
  initMobileMenu();
  initVideos();
});

// Navigation scroll effect
function initNav() {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

// Scroll-triggered animations (Intersection Observer)
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Videos section - render, search, filter
function initVideos() {
  if (typeof SAP_VIDEOS === 'undefined') return;

  const grid = document.getElementById('videosGrid');
  const searchInput = document.getElementById('videoSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const countEl = document.getElementById('videosCount');

  const categories = [...new Set(SAP_VIDEOS.map(v => v.category))].sort();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  function renderVideos(videos) {
    grid.innerHTML = '';
    videos.forEach((v, i) => {
      const vid = v.url.match(/[?&]v=([^&]+)/)?.[1] || '';
      const card = document.createElement('a');
      card.href = v.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'video-card glass';
      card.setAttribute('data-aos', '');
      card.innerHTML = `
        <div class="video-thumb">
          <img src="https://img.youtube.com/vi/${vid}/mqdefault.jpg" alt="${v.title}" loading="lazy">
          <span class="video-play">▶</span>
        </div>
        <div class="video-info">
          <span class="video-cat">${v.category}</span>
          <h4>${v.title}</h4>
        </div>
      `;
      grid.appendChild(card);
    });
    countEl.textContent = `${videos.length} videos`;
    document.querySelectorAll('#videosGrid [data-aos]').forEach(el => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }

  function filterVideos() {
    const q = (searchInput?.value || '').toLowerCase();
    const cat = categoryFilter?.value || '';
    const filtered = SAP_VIDEOS.filter(v => {
      const matchSearch = !q || v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
      const matchCat = !cat || v.category === cat;
      return matchSearch && matchCat;
    });
    renderVideos(filtered);
  }

  searchInput?.addEventListener('input', filterVideos);
  categoryFilter?.addEventListener('change', filterVideos);
  renderVideos(SAP_VIDEOS);
}

// Mobile menu toggle
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
  }
}
