(function () {
  // Menu téléphone
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function meta(o) { return [o.source, o.date].filter(Boolean).map(esc).join(' · '); }

  function videoHTML(v) {
    return '<a class="video reveal" href="https://www.youtube.com/watch?v=' + esc(v.id) + '" target="_blank" rel="noopener">' +
      '<div class="thumb"><img src="https://img.youtube.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">' +
      '<span class="play" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="#6A1A2B"><path d="M8 5v14l11-7z"/></svg></span></div>' +
      '<span class="meta">' + meta(v) + '</span><span class="t">' + esc(v.title) + '</span></a>';
  }
  function articleHTML(a) {
    var ext = a.page ? '">' : '" target="_blank" rel="noopener">';
    return '<li class="reveal"><a href="' + esc(a.page || a.url) + ext +
      '<span class="meta">' + meta(a) + '</span><span class="t">' + esc(a.title) + '</span></a></li>';
  }

  function fill(el, list, tpl) {
    var step = parseInt(el.getAttribute('data-limit'), 10) || list.length;
    var shown = 0;
    var btn = el.getAttribute('data-more') ? document.getElementById(el.getAttribute('data-more')) : null;
    function more() {
      el.insertAdjacentHTML('beforeend', list.slice(shown, shown + step).map(tpl).join(''));
      shown += step;
      if (btn) btn.hidden = shown >= list.length;
      observe();
    }
    more();
    if (btn) btn.addEventListener('click', more);
  }

  document.querySelectorAll('[data-videos]').forEach(function (el) { fill(el, window.KEG_VIDEOS || [], videoHTML); });
  document.querySelectorAll('[data-articles]').forEach(function (el) { fill(el, window.KEG_ARTICLES || [], articleHTML); });
  document.querySelectorAll('[data-related]').forEach(function (el) {
    var cur = el.getAttribute('data-related');
    var list = (window.KEG_ARTICLES || []).filter(function (a) { return a.page && a.page !== cur; }).slice(0, 3);
    el.innerHTML = list.map(articleHTML).join('');
  });

  // Apparition douce au défilement
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
  }, { threshold: 0.08 }) : null;
  function observe() {
    document.querySelectorAll('.reveal:not(.on)').forEach(function (el) {
      if (io) io.observe(el); else el.classList.add('on');
    });
  }
  observe();

  // Bouton retour en haut
  var top = document.createElement('button');
  top.className = 'to-top'; top.type = 'button';
  top.setAttribute('aria-label', 'العودة إلى أعلى الصفحة');
  top.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.appendChild(top);
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('scroll', function () { top.classList.toggle('show', window.scrollY > 600); }, { passive: true });
})();
