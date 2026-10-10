(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. Entrada ao rolar, com atraso escalonado */
  var alvos = [
    ['.hero .w > div:first-child > *', 110],
    ['section h2', 0], ['section .lead', 0],
    ['.dif > div', 100], ['.cats > .cat', 100], ['.zones > div', 100],
    ['.marquee', 0], ['.band .w > *', 100], ['footer .w > div', 100]
  ];
  var todos = [];
  alvos.forEach(function (a) {
    $(a[0]).forEach(function (el, i) {
      el.style.setProperty('--d', (i * a[1]) + 'ms');
      todos.push(el);
    });
  });

  if (reduce || !('IntersectionObserver' in window)) {
    todos.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        if (!it.isIntersecting) return;
        var el = it.target;
        el.classList.add('in');
        io.unobserve(el);
        /* libera o transform para o hover depois da entrada */
        setTimeout(function () { el.classList.remove('rv'); }, 1100 + (parseInt(el.style.getPropertyValue('--d'), 10) || 0));
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    todos.forEach(function (el) { el.classList.add('rv'); io.observe(el); });
  }

  /* 2. Cabeçalho encolhido + barra de progresso */
  var header = document.querySelector('header');
  var barra = document.createElement('div');
  barra.className = 'progress';
  barra.setAttribute('aria-hidden', 'true');
  document.body.appendChild(barra);
  var ticking = false;
  function aoRolar() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('scrolled', y > 24);
    barra.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  aoRolar();

  /* 3. Link ativo no menu conforme a seção visível */
  var links = $('header nav a[href^="#"]');
  if ('IntersectionObserver' in window && links.length) {
    var spy = new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        if (!it.isIntersecting) return;
        links.forEach(function (a) {
          var ativo = a.getAttribute('href') === '#' + it.target.id;
          a.classList.toggle('active', ativo);
          if (ativo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute('href'));
      if (sec) spy.observe(sec);
    });
  }
})();
