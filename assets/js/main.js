/* Hotspots — comportements progressifs. Le site reste entièrement lisible sans JavaScript. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* Thème clair / sombre (préférence mémorisée localement, facultative) */
  function storedTheme() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
  function storeTheme(v) { try { localStorage.setItem('theme', v); } catch (e) {} }
  var t = storedTheme();
  if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t);
  var toggle = document.querySelector('.theme-toggle');
  function currentTheme() {
    var a = root.getAttribute('data-theme');
    if (a) return a;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function labelToggle() {
    if (!toggle) return;
    var dark = currentTheme() === 'dark';
    toggle.textContent = dark ? 'Mode clair' : 'Mode sombre';
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }
  if (toggle) {
    toggle.hidden = false;
    labelToggle();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      storeTheme(next);
      labelToggle();
    });
  }

  /* Menu mobile */
  var navBtn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (navBtn && nav) {
    nav.setAttribute('data-open', 'false');
    navBtn.hidden = false;
    navBtn.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', open ? 'false' : 'true');
      navBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  /* Infobulles des graphiques : chaque marque porte data-tip */
  document.querySelectorAll('figure.chart').forEach(function (fig) {
    var tip = document.createElement('div');
    tip.className = 'chart-tip';
    tip.setAttribute('role', 'status');
    tip.setAttribute('aria-live', 'polite');
    fig.appendChild(tip);
    function show(el, x, y) {
      tip.textContent = el.getAttribute('data-tip');
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
      tip.setAttribute('data-show', 'true');
    }
    function hide() { tip.setAttribute('data-show', 'false'); }
    fig.querySelectorAll('[data-tip]').forEach(function (el) {
      el.addEventListener('mousemove', function (ev) {
        var r = fig.getBoundingClientRect();
        show(el, ev.clientX - r.left, ev.clientY - r.top);
      });
      el.addEventListener('mouseleave', hide);
      el.addEventListener('focus', function () {
        var r = fig.getBoundingClientRect(), b = el.getBoundingClientRect();
        show(el, b.left - r.left + b.width / 2, b.top - r.top);
      });
      el.addEventListener('blur', hide);
    });
  });

  /* Filtres de la chronologie */
  var tl = document.querySelector('[data-timeline]');
  var fbar = document.querySelector('[data-timeline-filters]');
  if (tl && fbar) {
    fbar.hidden = false;
    fbar.addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (!b) return;
      fbar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var cat = b.getAttribute('data-cat');
      tl.querySelectorAll('li').forEach(function (li) {
        li.hidden = !(cat === 'all' || (li.getAttribute('data-cat') || '').split(' ').indexOf(cat) > -1);
      });
    });
  }

  /* Filtre du glossaire */
  var gq = document.getElementById('glossary-filter');
  if (gq) {
    gq.parentElement.hidden = false;
    var items = Array.prototype.slice.call(document.querySelectorAll('.glossary dt'));
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    gq.addEventListener('input', function () {
      var q = norm(gq.value.trim());
      items.forEach(function (dt) {
        var dd = dt.nextElementSibling;
        var hit = !q || norm(dt.textContent + ' ' + (dd ? dd.textContent : '')).indexOf(q) > -1;
        dt.hidden = !hit; if (dd) dd.hidden = !hit;
      });
    });
  }
})();
