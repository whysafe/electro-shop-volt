const PROMO = { START10: 0.10, VOLT5: 0.05 };
let promo = sessionStorage.getItem('volt-promo') || '';
const FREE_FROM = 30000, DELIVERY = 490;

function totals() {
  const items = Cart.read().map(i => ({ ...i, p: byId(i.id) })).filter(i => i.p);
  const sum = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  // Промокод действует только на товары без скидки (уценённые, у которых есть старая цена, не участвуют)
  const eligible = items.filter(i => !i.p.old).reduce((s, i) => s + i.p.price * i.qty, 0);
  const discount = Math.round(eligible * (PROMO[promo] || 0));
  const pickup = $('input[name="delivery"]:checked')?.value === 'pickup';
  const delivery = !items.length || pickup || sum - discount >= FREE_FROM ? 0 : DELIVERY;
  return { items, sum, eligible, discount, delivery, total: sum - discount + delivery };
}

function render() {
  const t = totals();
  if (!t.items.length) {
    $('#cart').innerHTML = `<div class="done" style="grid-column:1/-1"><h1>Корзина пуста</h1><p>Загляните в каталог: там скидки до 20%.</p><a class="btn" href="index.html">Перейти в каталог</a></div>`;
    return;
  }
  $('#lines').innerHTML = t.items.map((i, idx) => `
    <div class="line">
      <div class="pic">${deviceSVG(i.p.cat, i.color)}</div>
      <div><a href="product.html?id=${i.p.id}">${i.p.name}</a><br><span class="rating">${rub(i.p.price)} за шт</span><br>${i.p.old && PROMO[promo] ? '<span class="rating">Уценённый товар: промокод не действует</span><br>' : ''}
        <button class="remove" type="button" data-remove="${idx}">Удалить</button></div>
      <div class="qty"><button type="button" data-dec="${idx}" aria-label="Меньше">−</button><span>${i.qty}</span><button type="button" data-inc="${idx}" aria-label="Больше">+</button></div>
      <b>${rub(i.p.price * i.qty)}</b>
    </div>`).join('');
  $('#sum').textContent = rub(t.sum);
  $('#discountRow').hidden = !t.discount;
  $('#discountRow').firstElementChild.textContent = t.eligible < t.sum ? 'Скидка (кроме уценённых)' : 'Скидка';
  if (PROMO[promo] && !t.eligible) { const msg = $('#promoMsg'); msg.className = 'msg err'; msg.textContent = `Промокод ${promo} не действует на уценённые товары, а других в корзине нет.`; }
  $('#discount').textContent = '−' + rub(t.discount);
  $('#delivery').textContent = t.delivery ? rub(t.delivery) : 'бесплатно';
  $('#total').textContent = rub(t.total);
  const left = FREE_FROM - (t.sum - t.discount);
  $('#freeHint').textContent = left > 0 && $('input[name="delivery"]:checked').value === 'courier' ? `До бесплатной доставки ещё ${rub(left)}` : '';
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-inc],[data-dec],[data-remove]');
  if (!b) return;
  const items = Cart.read();
  if (b.dataset.inc) items[+b.dataset.inc].qty = Math.min(10, items[+b.dataset.inc].qty + 1);
  if (b.dataset.dec) { const i = +b.dataset.dec; if (--items[i].qty <= 0) items.splice(i, 1); }
  if (b.dataset.remove) items.splice(+b.dataset.remove, 1);
  Cart.write(items); render();
});

$('#applyPromo').addEventListener('click', () => {
  const code = $('#promo').value.trim().toUpperCase(), msg = $('#promoMsg');
  if (PROMO[code]) { promo = code; sessionStorage.setItem('volt-promo', code); msg.className = 'msg ok'; msg.textContent = `Промокод ${code} применён: скидка ${PROMO[code] * 100}% на товары без уценки`; }
  else { msg.className = 'msg err'; msg.textContent = 'Такого промокода нет. Проверьте написание.'; }
  render();
});

$$('input[name="delivery"]').forEach(r => r.addEventListener('change', () => {
  $('#addressField').hidden = r.value === 'pickup' && r.checked;
  render();
}));

const phone = $('#checkout').phone;
phone.addEventListener('input', () => {
  let d = phone.value.replace(/\D/g, ''); if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
  let o = '+7'; if (d.length > 1) o += ' (' + d.slice(1, 4); if (d.length > 4) o += ') ' + d.slice(4, 7); if (d.length > 7) o += '-' + d.slice(7, 9); if (d.length > 9) o += '-' + d.slice(9);
  phone.value = o;
});

$('#checkout').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, errs = [];
  if (f.name.value.trim().length < 2) errs.push('имя');
  if (phone.value.replace(/\D/g, '').length !== 11) errs.push('телефон');
  if (f.delivery.value === 'courier' && f.address.value.trim().length < 5) errs.push('адрес доставки');
  const msg = $('#orderMsg');
  if (errs.length) { msg.className = 'msg err'; msg.textContent = 'Заполните: ' + errs.join(', ') + '.'; return; }
  const t = totals(), num = 'V-' + Date.now().toString().slice(-6);
  Cart.write([]); sessionStorage.removeItem('volt-promo');
  $('#cart').innerHTML = `<div class="done" style="grid-column:1/-1"><h1>Заказ ${num} оформлен</h1>
    <p>Сумма ${rub(t.total)}. ${f.delivery.value === 'courier' ? 'Курьер позвонит за час до доставки.' : 'Заказ будет готов к выдаче в магазине через 2 часа.'}</p>
    <a class="btn" href="index.html">Продолжить покупки</a></div>`;
});

if (promo) $('#promo').value = promo;
render();
