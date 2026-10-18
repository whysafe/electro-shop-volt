const params = new URLSearchParams(location.search);
const state = { cat: params.get('cat') || 'all', q: (params.get('q') || '').toLowerCase(), sort: 'popular', sale: false };

$('#chips').innerHTML = [['all', 'Все товары'], ...Object.entries(CATEGORIES)]
  .map(([k, v]) => `<button class="chip" type="button" data-cat="${k}">${v}</button>`).join('');

function render() {
  $$('#chips .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.cat === state.cat));
  let list = PRODUCTS.filter(p => (state.cat === 'all' || p.cat === state.cat) &&
    (!state.q || p.name.toLowerCase().includes(state.q) || CATEGORIES[p.cat].toLowerCase().includes(state.q)) &&
    (!state.sale || p.old));
  const s = { popular: (a, b) => b.reviews - a.reviews, cheap: (a, b) => a.price - b.price, expensive: (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating };
  list.sort(s[state.sort]);
  $('#count').textContent = state.q ? `По запросу «${state.q}» найдено: ${list.length}` : `Товаров: ${list.length}`;
  $('#grid').innerHTML = list.length ? list.map(productCard).join('')
    : `<div class="empty"><h3>Ничего не нашлось</h3><p>Попробуйте другое слово или <a href="index.html">посмотрите весь каталог</a>.</p></div>`;
}

$('#chips').addEventListener('click', e => { const c = e.target.closest('[data-cat]'); if (c) { state.cat = c.dataset.cat; render(); } });
$('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
$('#saleOnly').addEventListener('change', e => { state.sale = e.target.checked; render(); });
render();
