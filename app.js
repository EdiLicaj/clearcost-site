/* Clearcost — site interactions (vanilla JS, no build step) */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- mobile menu ---------- */
  var burger = $('#burger'), menu = $('#mobileMenu');
  if (burger) burger.addEventListener('click', function () { menu.classList.toggle('open'); });
  $$('#mobileMenu a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });

  /* ---------- live clocks ---------- */
  function tick() {
    var fmt = function (tz) { return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date()); };
    var cn = $('#clockCN'), nl = $('#clockNL');
    if (cn) cn.textContent = fmt('Asia/Shanghai');
    if (nl) nl.textContent = fmt('Europe/Amsterdam');
  }
  tick(); setInterval(tick, 15000);

  /* ---------- how it works stepper ---------- */
  var steps = [
    { num: '1', title: 'Intro call', sub: '20 minutes, no obligation', when: 'Day 0', head: 'A Dutch account manager gets to know your store, products and markets.',
      body: 'A short call in Dutch or English. You tell us what you sell and where; we tell you honestly whether Clearcost is the right fit and what it would cost per order.',
      points: ['Your products, volumes and target countries', 'How sourcing, QC and shipping would work for you', 'Clear answer: fit or no fit'] },
    { num: '2', title: 'Sourcing & quote', sub: 'Within 48 hours', when: 'Day 1–2', head: 'Our agents find the factory and send you an itemised quote.',
      body: 'Send us your product links (AliExpress, 1688, a competitor). We negotiate directly with the factory and quote product price, shipping per country and packaging options — nothing hidden in the shipping line.',
      points: ['Factory price per variant', 'Shipping per destination and weight', 'Branded packaging quoted per item'] },
    { num: '3', title: 'Connect & go live', sub: 'Shopify or WooCommerce', when: 'Day 3–5', head: 'Your store is connected and your products are mapped once.',
      body: 'We link your Shopify or WooCommerce store, map each product to its factory SKU and agree on packaging. From then on every order flows to our warehouse automatically.',
      points: ['One-time product mapping', 'Packaging and inserts approved', 'Optional pre-stock for your winners'] },
    { num: '4', title: 'We fulfil, you scale', sub: 'Daily, 7 days a week', when: 'Ongoing', head: 'Orders are checked, packed and shipped while you focus on growth.',
      body: 'Every order is picked, inspected with photo proof, packed in your branding and dispatched within 24–48 hours on the fastest line for that country. Tracking is pushed back to your store.',
      points: ['24–48h from order to dispatch', 'Photo QC on every batch', 'Live status in your Clearcost backend'] }
  ];
  var step = 0, list = $('#stepList');
  if (list) {
    steps.forEach(function (s, i) {
      var b = document.createElement('button');
      b.className = 'stepbtn'; b.type = 'button';
      b.innerHTML = '<span class="n">' + s.num + '</span><span><strong>' + s.title + '</strong><small>' + s.sub + '</small></span>';
      b.addEventListener('click', function () { step = i; renderStep(); });
      list.appendChild(b);
    });
    $('#stepNext').addEventListener('click', function () { step = (step + 1) % steps.length; renderStep(); });
  }
  function renderStep() {
    var s = steps[step];
    $$('.stepbtn').forEach(function (b, i) { b.classList.toggle('on', i === step); });
    $('#stepMeta').textContent = 'Step ' + s.num + ' / 4 · ' + s.when;
    $('#stepDots').innerHTML = steps.map(function (_, i) { return '<i class="' + (i === step ? 'on' : '') + '"></i>'; }).join('');
    $('#stepHead').textContent = s.head;
    $('#stepBody').textContent = s.body;
    $('#stepPoints').innerHTML = s.points.map(function (p) {
      return '<li><svg width="18" height="18" fill="none" stroke="#F5841F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><use href="#i-check"/></svg>' + p + '</li>';
    }).join('');
    $('#stepNext').textContent = step === steps.length - 1 ? 'Back to step 1' : 'Next step →';
  }
  if (list) renderStep();

  /* ---------- backend tabs ---------- */
  function setTab(name) {
    $$('.tab').forEach(function (t) { t.classList.toggle('on', t.dataset.tab === name); });
    $$('.panel').forEach(function (p) { p.classList.toggle('on', p.dataset.panel === name); });
    $$('.side .it[data-side]').forEach(function (it) { it.classList.toggle('on', it.dataset.side === name); });
  }
  $$('.tab').forEach(function (t) { t.addEventListener('click', function () { setTab(t.dataset.tab); }); });
  $$('.side .it[data-side]').forEach(function (it) { it.style.cursor = 'pointer'; it.addEventListener('click', function () { setTab(it.dataset.side); }); });

  /* profit bars */
  var bars = $('#bars');
  if (bars) {
    var rev = [62,48,55,70,44,58,66,52,74,95,60,57,68,49,63,77,54,59,71,46,65,80,58,62,69,53,61,88,56,50];
    bars.innerHTML = rev.map(function (r, i) {
      var ad = Math.round(r * 0.44), pr = Math.max(4, Math.round(r * 0.13) + (i % 4 === 0 ? 4 : 0));
      return '<i style="background:linear-gradient(to top,#5FE0A0 0 ' + pr + '%,#3E3A5A ' + pr + '% ' + ad + '%,#7C5CFF ' + ad + '% ' + r + '%,transparent ' + r + '%)"></i>';
    }).join('');
  }
  var pg = $('.profit-grid');
  if (pg && window.matchMedia('(min-width: 1024px)').matches) pg.style.gridTemplateColumns = '1fr 300px';

  /* ---------- shipping route map ---------- */
  var hub = { x: 640, y: 235 };
  var dests = [
    { id: 'us', short: 'United States', name: 'United States', x: 96, y: 210, days: '6–10', line: 'US special line (YunExpress / 4PX class)', tax: 'DDP available' },
    { id: 'ca', short: 'Canada', name: 'Canada', x: 120, y: 132, days: '8–14', line: 'Global standard line', tax: 'DDP available' },
    { id: 'uk', short: 'UK', name: 'United Kingdom', x: 318, y: 128, days: '5–9', line: 'UK special line', tax: 'VAT-paid (DDP)' },
    { id: 'nl', short: 'NL · BE', name: 'Netherlands & Belgium', x: 372, y: 148, days: '5–8', line: 'EU special line', tax: 'IOSS · VAT paid upfront' },
    { id: 'de', short: 'DE · Nordics', name: 'Germany & Nordics', x: 418, y: 118, days: '6–10', line: 'EU special line', tax: 'IOSS · VAT paid upfront' },
    { id: 'fr', short: 'FR · ES · IT', name: 'France, Spain & Italy', x: 350, y: 205, days: '6–10', line: 'EU special line', tax: 'IOSS · VAT paid upfront' },
    { id: 'au', short: 'Australia', name: 'Australia', x: 700, y: 440, days: '8–14', line: 'Global standard line', tax: 'GST handled at checkout' }
  ];
  var map = $('#map'), svg = $('#mapSvg');
  if (map) {
    var arc = function (d) { var mx = (hub.x + d.x) / 2, my = Math.min(hub.y, d.y) - Math.abs(hub.x - d.x) * 0.28; return 'M' + hub.x + ' ' + hub.y + ' Q' + mx + ' ' + my + ' ' + d.x + ' ' + d.y; };
    svg.innerHTML = dests.map(function (d) { return '<path data-id="' + d.id + '" d="' + arc(d) + '"/>'; }).join('') +
      '<circle cx="640" cy="235" r="34" fill="#F5841F" opacity=".12"/><circle cx="640" cy="235" r="18" fill="#F5841F" opacity=".25"/><circle cx="640" cy="235" r="8" fill="#F5841F"/>';
    dests.forEach(function (d) {
      var b = document.createElement('button');
      b.className = 'pin'; b.type = 'button'; b.setAttribute('aria-label', d.name);
      b.style.left = (d.x / 820 * 100) + '%'; b.style.top = (d.y / 520 * 100) + '%';
      b.innerHTML = '<i></i><span>' + d.short + '</span>';
      var pick = function () { selectDest(d.id); };
      b.addEventListener('click', pick); b.addEventListener('mouseenter', pick);
      map.appendChild(b);
    });
  }
  function selectDest(id) {
    var d = dests.filter(function (x) { return x.id === id; })[0];
    $$('.pin').forEach(function (p) { p.classList.toggle('on', p.getAttribute('aria-label') === d.name); });
    $$('#mapSvg path').forEach(function (p) { p.classList.toggle('on', p.dataset.id === id); });
    $('#selName').textContent = d.name; $('#selDays').textContent = d.days; $('#selLine').textContent = d.line; $('#selTax').textContent = d.tax;
  }
  if (map) selectDest('nl');

  /* ---------- booking placeholder ---------- */
  var daysEl = $('#days'), slotsEl = $('#slots'), confirm = $('#confirm');
  if (daysEl) {
    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], days = [], d = new Date();
    while (days.length < 5) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d)); }
    var selDay = 0, selSlot = 2, slots = ['09:30', '11:00', '13:30', '15:00', '16:30', '18:00'];
    var render = function () {
      daysEl.innerHTML = days.map(function (dt, i) { return '<button type="button" class="' + (i === selDay ? 'on' : '') + '">' + dayNames[dt.getDay()].toUpperCase() + '<b>' + dt.getDate() + '</b></button>'; }).join('');
      slotsEl.innerHTML = slots.map(function (s, i) { return '<button type="button" class="' + (i === selSlot ? 'on' : '') + '">' + s + '</button>'; }).join('');
      $$('button', daysEl).forEach(function (b, i) { b.addEventListener('click', function () { selDay = i; render(); }); });
      $$('button', slotsEl).forEach(function (b, i) { b.addEventListener('click', function () { selSlot = i; render(); }); });
      var dt = days[selDay], label = dayNames[dt.getDay()] + ' ' + dt.getDate() + ' ' + dt.toLocaleString('en-GB', { month: 'short' }) + ', ' + slots[selSlot];
      confirm.textContent = 'Confirm call · ' + label;
      confirm.href = 'mailto:hello@clearcost.eu?subject=' + encodeURIComponent('Intro call request — ' + label) + '&body=' + encodeURIComponent('Hi Clearcost,\n\nI would like an intro call on ' + label + ' (Europe/Amsterdam).\n\nStore: \nMain markets: \nOrders per month: \n\nThanks!');
    };
    render();
  }
})();
