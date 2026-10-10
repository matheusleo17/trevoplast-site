(function () {
  'use strict';
  /* CONFIGURAÇÃO: coloque o WhatsApp com 55 + DDD + número (ex.: '5511999999999').
     Vazio = o pedido é enviado por e-mail. */
  var WHATSAPP = '';
  var EMAIL = 'trevoplast@terra.com.br';
  var KEY = 'trevoplast_orcamento';
  var ICONS = {"tubos": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n  \n  <path d=\"M3 4h8\" />\n  <path d=\"M4 4v5a6 6 0 0 0 6 6h3a1 1 0 0 1 1 1v4\" />\n  <path d=\"M10 4v4a1 1 0 0 0 1 1h3a6 6 0 0 1 6 6v5\" />\n  <path d=\"M13 20h8\" />\n  <path d=\"M12 9v6\" />\n</svg>", "caixas": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n  \n  <path d=\"M4.072 20.3a2.999 2.999 0 0 0 3.856 0a3.002 3.002 0 0 0 .67 -3.798l-2.095 -3.227a.6 .6 0 0 0 -1.005 0l-2.098 3.227a3.003 3.003 0 0 0 .671 3.798\" />\n  <path d=\"M16.072 20.3a2.999 2.999 0 0 0 3.856 0a3.002 3.002 0 0 0 .67 -3.798l-2.095 -3.227a.6 .6 0 0 0 -1.005 0l-2.098 3.227a3.003 3.003 0 0 0 .671 3.798\" />\n  <path d=\"M10.072 10.3a2.999 2.999 0 0 0 3.856 0a3.002 3.002 0 0 0 .67 -3.798l-2.095 -3.227a.6 .6 0 0 0 -1.005 0l-2.098 3.227a3.003 3.003 0 0 0 .671 3.798l.001 0\" />\n</svg>", "sanitarios": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n  \n  <path d=\"M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1\" />\n  <path d=\"M6 12v-7a2 2 0 0 1 2 -2h3v2.25\" />\n  <path d=\"M4 21l1 -1.5\" />\n  <path d=\"M20 21l-1 -1.5\" />\n</svg>", "incendio": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n  \n  <path d=\"M5 21h14\" />\n  <path d=\"M17 21v-5h1a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-1v-4a5 5 0 0 0 -10 0v4h-1a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h1v5\" />\n  <path d=\"M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" />\n  <path d=\"M6 8h12\" />\n</svg>"};

  var CATS = window.CATEGORIAS || [], PRODS = window.PRODUTOS || [];
  var byCod = {}; PRODS.forEach(function (p) { byCod[p.cod] = p; });
  var $ = function (s) { return document.querySelector(s); };
  var norm = function (s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); };
  var state = { cats: [], marcas: [], q: '', ord: 'nome' };
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  Object.keys(cart).forEach(function (c) { if (!byCod[c]) delete cart[c]; });
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }

  /* ---------- filtros ---------- */
  function checkbox(host, value, label, group) {
    var l = document.createElement('label'); l.className = 'fi';
    var i = document.createElement('input'); i.type = 'checkbox'; i.value = value;
    i.checked = state[group].indexOf(value) > -1;
    i.addEventListener('change', function () {
      var a = state[group], k = a.indexOf(value);
      if (i.checked && k < 0) a.push(value); else if (!i.checked && k > -1) a.splice(k, 1);
      render();
    });
    var s = document.createElement('span'); s.textContent = label;
    l.appendChild(i); l.appendChild(s); host.appendChild(l);
  }
  function buildFilters() {
    var fc = $('#f-cats'), fm = $('#f-marcas'); fc.innerHTML = ''; fm.innerHTML = '';
    CATS.forEach(function (c) { checkbox(fc, c.id, c.nome, 'cats'); });
    var marcas = []; PRODS.forEach(function (p) { if (marcas.indexOf(p.marca) < 0) marcas.push(p.marca); });
    marcas.sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); });
    marcas.forEach(function (m) { checkbox(fm, m, m, 'marcas'); });
  }
  function clearAll() { state.cats = []; state.marcas = []; state.q = ''; $('#q').value = ''; buildFilters(); render(); }

  /* ---------- lista de produtos ---------- */
  function filtered() {
    var q = norm(state.q);
    var r = PRODS.filter(function (p) {
      if (state.cats.length && state.cats.indexOf(p.cat) < 0) return false;
      if (state.marcas.length && state.marcas.indexOf(p.marca) < 0) return false;
      if (q && norm(p.nome + ' ' + p.cod + ' ' + p.marca).indexOf(q) < 0) return false;
      return true;
    });
    r.sort(function (a, b) {
      var n = a.nome.localeCompare(b.nome, 'pt-BR');
      return state.ord === 'marca' ? (a.marca.localeCompare(b.marca, 'pt-BR') || n) : n;
    });
    return r;
  }
  function card(p) {
    var c = document.createElement('article'); c.className = 'pc';
    var im = document.createElement('div'); im.className = 'pimg';
    if (p.img) { var t = document.createElement('img'); t.src = p.img; t.alt = p.nome; t.loading = 'lazy'; im.appendChild(t); }
    else im.innerHTML = ICONS[p.cat] || '';
    var cod = document.createElement('div'); cod.className = 'pcod'; cod.textContent = 'Cód. ' + p.cod;
    var nm = document.createElement('div'); nm.className = 'pnm'; nm.textContent = p.nome;
    var mk = document.createElement('span'); mk.className = 'pmk'; mk.textContent = p.marca;
    var act = document.createElement('div'); act.className = 'pact';
    var add = document.createElement('button'); add.type = 'button'; add.className = 'padd'; add.textContent = 'Adicionar ao orçamento';
    var st = document.createElement('div'); st.className = 'pstep';
    var minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '\u2212'; minus.setAttribute('aria-label', 'Diminuir quantidade de ' + p.nome);
    var info = document.createElement('span'); info.className = 'pq'; info.setAttribute('aria-live', 'polite');
    var plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', 'Aumentar quantidade de ' + p.nome);
    st.appendChild(minus); st.appendChild(info); st.appendChild(plus);
    act.appendChild(add); act.appendChild(st);
    function paint() {
      var q = cart[p.cod] || 0;
      add.hidden = q > 0; st.hidden = q === 0;
      info.textContent = q + (q === 1 ? ' unidade' : ' unidades');
    }
    add.addEventListener('click', function () { setQty(p.cod, 1); plus.focus(); });
    plus.addEventListener('click', function () { setQty(p.cod, (cart[p.cod] || 0) + 1); });
    minus.addEventListener('click', function () { setQty(p.cod, (cart[p.cod] || 0) - 1); if (!cart[p.cod]) add.focus(); });
    c._paint = paint; paint();
    c.appendChild(im); c.appendChild(cod); c.appendChild(nm); c.appendChild(mk); c.appendChild(act);
    return c;
  }
  function render() {
    var list = filtered(), g = $('#grid'); g.innerHTML = '';
    list.forEach(function (p) { g.appendChild(card(p)); });
    $('#empty').hidden = list.length > 0;
    $('#count').textContent = list.length + (list.length === 1 ? ' produto' : ' produtos');
    var one = state.cats.length === 1 ? CATS.filter(function (c) { return c.id === state.cats[0]; })[0] : null;
    $('#title').textContent = one ? one.nome : 'Todos os produtos';
    document.title = (one ? one.nome : 'Produtos') + ' | Trevoplast';
    try {
      var u = new URLSearchParams();
      if (state.cats.length) u.set('cat', state.cats.join(','));
      if (state.marcas.length) u.set('marca', state.marcas.join(','));
      if (state.q) u.set('q', state.q);
      history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
    } catch (e) {}
  }

  /* ---------- orçamento ---------- */
  var drawer = $('#drawer'), lastFocus = null;
  function total() { return Object.keys(cart).reduce(function (s, c) { return s + cart[c]; }, 0); }
  function setQty(cod, q) {
    if (q <= 0) delete cart[cod]; else cart[cod] = Math.min(q, 999);
    save(); renderCart(true); render_cards_labels();
  }
  function render_cards_labels() { document.querySelectorAll('.pc').forEach(function (c) { if (c._paint) c._paint(); }); }
  function message() {
    var l = ['Olá! Gostaria de solicitar um orçamento:', ''];
    Object.keys(cart).forEach(function (c) { var p = byCod[c]; l.push('• ' + cart[c] + 'x ' + p.nome + ' (' + p.marca + ') – cód. ' + p.cod); });
    l.push('', 'Obrigado!'); return l.join('\n');
  }
  function renderCart(bump) {
    var n = total(), qb = $('#qb'); qb.textContent = n;
    if (bump) { qb.classList.remove('bump'); void qb.offsetWidth; qb.classList.add('bump'); }
    var ul = $('#dl'); ul.innerHTML = '';
    Object.keys(cart).forEach(function (c) {
      var p = byCod[c], li = document.createElement('li');
      var d = document.createElement('div');
      var a = document.createElement('div'); a.className = 'n'; a.textContent = p.nome;
      var s = document.createElement('div'); s.className = 's'; s.textContent = p.marca + ' · cód. ' + p.cod;
      d.appendChild(a); d.appendChild(s);
      var st = document.createElement('div'); st.className = 'stp';
      var m = document.createElement('button'); m.type = 'button'; m.textContent = '−'; m.setAttribute('aria-label', 'Diminuir ' + p.nome);
      var q = document.createElement('span'); q.textContent = cart[c];
      var pl = document.createElement('button'); pl.type = 'button'; pl.textContent = '+'; pl.setAttribute('aria-label', 'Aumentar ' + p.nome);
      m.addEventListener('click', function () { setQty(c, cart[c] - 1); });
      pl.addEventListener('click', function () { setQty(c, cart[c] + 1); });
      st.appendChild(m); st.appendChild(q); st.appendChild(pl);
      var r = document.createElement('button'); r.type = 'button'; r.className = 'rm'; r.textContent = 'Remover';
      r.addEventListener('click', function () { setQty(c, 0); });
      li.appendChild(d); li.appendChild(st); li.appendChild(r); ul.appendChild(li);
    });
    $('#dv').hidden = n > 0;
    var send = $('#send'), msg = message();
    if (!n) { send.setAttribute('aria-disabled', 'true'); send.href = '#'; }
    else {
      send.removeAttribute('aria-disabled');
      if (WHATSAPP) { send.textContent = 'Enviar pelo WhatsApp'; send.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg); }
      else { send.textContent = 'Enviar por e-mail'; send.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Pedido de orçamento') + '&body=' + encodeURIComponent(msg); }
    }
    if (!n) send.textContent = WHATSAPP ? 'Enviar pelo WhatsApp' : 'Enviar por e-mail';
  }
  function openQ() { lastFocus = document.activeElement; drawer.classList.add('open'); $('#close-q').focus(); }
  function closeQ() { drawer.classList.remove('open'); if (lastFocus) lastFocus.focus(); }
  $('#open-q').addEventListener('click', openQ);
  $('#close-q').addEventListener('click', closeQ);
  $('#ov').addEventListener('click', closeQ);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('open')) closeQ(); });
  $('#copy').addEventListener('click', function () {
    if (!total()) return;
    var btn = this, txt = message();
    function ok() { btn.textContent = 'Copiado!'; setTimeout(function () { btn.textContent = 'Copiar lista'; }, 1800); }
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, function () {});
    else { var t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (e) {} t.remove(); }
  });

  /* ---------- início ---------- */
  var qs = new URLSearchParams(location.search);
  var split = function (k) { return (qs.get(k) || '').split(',').filter(Boolean); };
  state.cats = split('cat').filter(function (c) { return CATS.some(function (x) { return x.id === c; }); });
  state.marcas = split('marca'); state.q = qs.get('q') || '';
  $('#q').value = state.q;
  $('#q').addEventListener('input', function () { state.q = this.value; render(); });
  $('#ord').addEventListener('change', function () { state.ord = this.value; render(); });
  $('#clear').addEventListener('click', clearAll); $('#clear2').addEventListener('click', clearAll);
  var det = $('#filters'), mq = window.matchMedia('(min-width:901px)');
  function sync() { if (mq.matches) det.open = true; }
  sync(); (mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync));
  buildFilters(); render(); renderCart(false);
})();
