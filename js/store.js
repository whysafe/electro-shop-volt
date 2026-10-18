const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rub = n => Math.round(n).toLocaleString('ru-RU') + ' ₽';
const byId = id => PRODUCTS.find(p => p.id === +id);

// Корзина: [{id, color, qty}] в localStorage
const Cart = {
  key: 'volt-cart',
  read() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
  write(items) { try { localStorage.setItem(this.key, JSON.stringify(items)); } catch {} Cart.badge(); },
  add(id, color, qty = 1) {
    const items = this.read(), ex = items.find(i => i.id === id && i.color === color);
    // Не больше 10 штук одной позиции, как и в корзине
    ex ? ex.qty = Math.min(10, ex.qty + qty) : items.push({ id, color, qty: Math.min(10, qty) });
    this.write(items);
  },
  count() { return this.read().reduce((s, i) => s + i.qty, 0); },
  badge() { const b = $('#cartCount'); if (b) b.textContent = Cart.count(); }
};

function header() {
  const q = new URLSearchParams(location.search).get('q') || '';
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="top"><div class="wrap">
    <a class="logo" href="index.html"><svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#2457FF"/></svg>Вольт</a>
    <form action="index.html" role="search"><input name="q" type="search" placeholder="Поиск: наушники, ноутбук…" value="${q.replace(/"/g, '&quot;')}" aria-label="Поиск по каталогу"></form>
    <a class="cart-link" href="cart.html">Корзина <b id="cartCount">0</b></a>
  </div></header>`);
  document.body.insertAdjacentHTML('beforeend', `<footer><div class="wrap">© 2026 Вольт · доставка по Москве и области</div></footer>`);
  Cart.badge();
}

function stars(r) { return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r)); }
function productCard(p) {
  return `<article class="p-card">
    ${p.old ? `<span class="sale">−${Math.round((1 - p.price / p.old) * 100)}%</span>` : ''}
    <div class="pic">${deviceSVG(p.cat, p.colors[0])}</div>
    <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
    <span class="rating" aria-label="Рейтинг ${p.rating} из 5">${stars(p.rating)} ${p.rating} · ${p.reviews} отзывов</span>
    <div class="prices"><b>${rub(p.price)}</b>${p.old ? `<s>${rub(p.old)}</s>` : ''}</div>
    <button class="btn" type="button" data-add="${p.id}">В корзину</button>
  </article>`;
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-add]');
  if (!b) return;
  const p = byId(b.dataset.add);
  Cart.add(p.id, p.colors[0]);
  b.textContent = 'Добавлено ✓';
  setTimeout(() => { b.textContent = 'В корзину'; }, 1200);
});

header();
