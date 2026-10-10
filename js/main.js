(function () {
  'use strict';

  var doc  = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     THEME
  --------------------------------------------------------- */
  var THEME_KEY = 'spasiv-theme';
  var themeBtn  = document.getElementById('theme-toggle');
  var stored    = null;

  try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}

  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    doc.setAttribute('data-theme', theme);
    if (!themeBtn) return;
    var isDark = theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(isDark));
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  applyTheme(stored || (prefersDark ? 'dark' : 'light'));

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------------------------------------------------------
     HEADER SCROLL STATE
  --------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  var scrollCue = document.getElementById('scrollCue');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (scrollCue) scrollCue.style.opacity = y > 120 ? '0' : '';
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------
     MOBILE NAV
  --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');

  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL (with per-group stagger)
  --------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var groups = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      var i = groups.get(parent) || 0;
      groups.set(parent, i + 1);
      el.style.transitionDelay = Math.min(i, 5) * 75 + 'ms';
    });

    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------
     COUNT-UP STATS
  --------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    if (!isFinite(target)) return;

    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('.num[data-target]'));

  if (counters.length) {
    if (!('IntersectionObserver' in window) || reduceMotion) {
      counters.forEach(function (el) {
        el.textContent = parseFloat(el.getAttribute('data-target')).toLocaleString('en-IN') +
                         (el.getAttribute('data-suffix') || '');
      });
    } else {
      var countObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });

      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------------------------------------------------------
     WHATSAPP POPUP — quote.html
  --------------------------------------------------------- */
  var waWidget = document.getElementById('waWidget');
  var waButton = document.getElementById('waButton');
  var waClose  = document.getElementById('waClose');

  if (waWidget && waButton) {
    function toggleWa(open) {
      waWidget.classList.toggle('is-open', open);
      waButton.setAttribute('aria-label', open ? 'Close WhatsApp chat' : 'Chat on WhatsApp');
    }

    waButton.addEventListener('click', function () {
      toggleWa(!waWidget.classList.contains('is-open'));
    });

    if (waClose) {
      waClose.addEventListener('click', function () { toggleWa(false); });
    }

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && waWidget.classList.contains('is-open')) toggleWa(false);
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!waWidget.classList.contains('is-open')) return;
      if (!waWidget.contains(e.target)) toggleWa(false);
    });
  }

    /* ---------------------------------------------------------
     WHATSAPP WIDGET (used on quote.html, work.html, contact.html)
  --------------------------------------------------------- */
  var waWidget = document.getElementById('waWidget');
  var waButton = document.getElementById('waButton');
  var waClose  = document.getElementById('waClose');

  if (waWidget && waButton) {
    function toggleWa(open) {
      waWidget.classList.toggle('is-open', open);
      waButton.setAttribute('aria-label', open ? 'Close WhatsApp chat' : 'Chat on WhatsApp');
    }

    waButton.addEventListener('click', function () {
      toggleWa(!waWidget.classList.contains('is-open'));
    });

    if (waClose) {
      waClose.addEventListener('click', function () { toggleWa(false); });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && waWidget.classList.contains('is-open')) toggleWa(false);
    });

    document.addEventListener('click', function (e) {
      if (!waWidget.classList.contains('is-open')) return;
      if (!waWidget.contains(e.target)) toggleWa(false);
    });
  }
  /* ---------------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  
})();