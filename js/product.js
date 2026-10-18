const p = byId(new URLSearchParams(location.search).get('id'));
const root = $('#product');

if (!p) {
  root.innerHTML = `<div class="done"><h1>Товар не найден</h1><p><a href="index.html">Вернуться в каталог</a></p></div>`;
} else {
  document.title = `${p.name} — Вольт`;
  let color = p.colors[0], qty = 1;
  root.innerHTML = `
    <p class="crumbs"><a href="index.html">Каталог</a> / <a href="index.html?cat=${p.cat}">${CATEGORIES[p.cat]}</a></p>
    <div class="product">
      <div class="gallery" id="gallery">${deviceSVG(p.cat, color)}</div>
      <div>
        <h1>${p.name}</h1>
        <span class="rating">${stars(p.rating)} ${p.rating} · ${p.reviews} отзывов</span>
        <div class="buy">
          <div class="prices"><b>${rub(p.price)}</b>${p.old ? `<s>${rub(p.old)}</s>` : ''}</div>
          <p class="rating">Цвет</p>
          <div class="swatches" role="group" aria-label="Цвет">${p.colors.map((c, i) => `<button class="swatch" type="button" data-color="${c}" style="background:${c}" aria-label="Цвет ${i + 1}" aria-pressed="${i === 0}"></button>`).join('')}</div>
          <div class="buy-row">
            <div class="qty"><button type="button" id="minus" aria-label="Меньше">−</button><span id="qty">1</span><button type="button" id="plus" aria-label="Больше">+</button></div>
            <button class="btn" type="button" id="toCart">Добавить в корзину</button>
            <a class="btn sec" href="cart.html" id="goCart" hidden>Перейти в корзину</a>
          </div>
          <p class="rating">Доставка завтра, бесплатно от 30 000 ₽. Гарантия 1 год.</p>
        </div>
        <h2 style="font-size:1.3rem">Характеристики</h2>
        <table class="specs"><tbody>${Object.entries(p.specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</tbody></table>
      </div>
    </div>
    <h2>С этим покупают</h2>
    <div class="grid">${PRODUCTS.filter(x => x.cat !== p.cat).sort((a, b) => b.reviews - a.reviews).slice(0, 4).map(productCard).join('')}</div>`;

  $$('.swatch').forEach(s => s.addEventListener('click', () => {
    color = s.dataset.color;
    $$('.swatch').forEach(x => x.setAttribute('aria-pressed', x === s));
    $('#gallery').innerHTML = deviceSVG(p.cat, color);
  }));
  $('#minus').onclick = () => { qty = Math.max(1, qty - 1); $('#qty').textContent = qty; };
  $('#plus').onclick = () => { qty = Math.min(10, qty + 1); $('#qty').textContent = qty; };
  $('#toCart').onclick = () => {
    Cart.add(p.id, color, qty);
    $('#toCart').textContent = 'Добавлено ✓'; $('#goCart').hidden = false;
    setTimeout(() => { $('#toCart').textContent = 'Добавить ещё'; }, 1200);
  };
}
