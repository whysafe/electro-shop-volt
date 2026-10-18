const CATEGORIES = {phone:'Смартфоны', laptop:'Ноутбуки', audio:'Наушники', watch:'Часы', tablet:'Планшеты'};
const PRODUCTS = [
  {id:1, cat:'phone', name:'Nova X 5G, 256 ГБ', price:54990, old:61990, rating:4.8, reviews:312, colors:['#1F2937','#C7D2FE','#F5F5F4'], specs:{'Экран':'6,7″ AMOLED, 120 Гц','Процессор':'8 ядер, 3,2 ГГц','Память':'8/256 ГБ','Камера':'50 + 12 + 8 Мп','Аккумулятор':'5000 мА·ч'}},
  {id:2, cat:'phone', name:'Nova Lite, 128 ГБ', price:21990, rating:4.5, reviews:845, colors:['#111827','#86EFAC'], specs:{'Экран':'6,5″ IPS, 90 Гц','Память':'6/128 ГБ','Камера':'48 Мп','Аккумулятор':'5000 мА·ч'}},
  {id:3, cat:'phone', name:'Pixelon 9 Pro, 512 ГБ', price:89990, rating:4.9, reviews:127, colors:['#374151','#FDE68A'], specs:{'Экран':'6,8″ LTPO OLED','Память':'12/512 ГБ','Камера':'50 + 48 + 48 Мп','Защита':'IP68'}},
  {id:4, cat:'laptop', name:'AirBook 14, M-серия, 16 ГБ', price:119990, old:129990, rating:4.9, reviews:204, colors:['#D1D5DB','#1F2937'], specs:{'Экран':'14,2″ 3024×1964','ОЗУ':'16 ГБ','SSD':'512 ГБ','Вес':'1,4 кг','Работа от батареи':'до 18 ч'}},
  {id:5, cat:'laptop', name:'Workstation 16 Pro, RTX', price:164990, rating:4.7, reviews:58, colors:['#111827'], specs:{'Экран':'16″ 2560×1600, 165 Гц','Процессор':'14 ядер','Видеокарта':'RTX, 8 ГБ','ОЗУ':'32 ГБ','SSD':'1 ТБ'}},
  {id:6, cat:'laptop', name:'Student 15, 8/256 ГБ', price:42990, rating:4.4, reviews:530, colors:['#9CA3AF','#BFDBFE'], specs:{'Экран':'15,6″ Full HD','ОЗУ':'8 ГБ','SSD':'256 ГБ','Вес':'1,7 кг'}},
  {id:7, cat:'audio', name:'Buds Pro 2 с шумоподавлением', price:12990, old:15990, rating:4.7, reviews:1290, colors:['#111827','#F9FAFB'], specs:{'Тип':'TWS, внутриканальные','Шумоподавление':'Активное, до −45 дБ','Работа':'7 ч + 28 ч с кейсом','Защита':'IPX4'}},
  {id:8, cat:'audio', name:'Studio Over-Ear', price:24990, rating:4.8, reviews:402, colors:['#1F2937','#E7E5E4','#93C5FD'], specs:{'Тип':'Полноразмерные','Шумоподавление':'Адаптивное','Работа':'до 40 ч','Кодеки':'AAC, LDAC'}},
  {id:9, cat:'watch', name:'Pulse Watch 3, 45 мм', price:18990, rating:4.6, reviews:688, colors:['#111827','#FCA5A5','#A7F3D0'], specs:{'Экран':'1,9″ AMOLED','Датчики':'Пульс, SpO2, ЭКГ','Защита':'5 ATM','Работа':'до 7 дней'}},
  {id:10,cat:'watch', name:'Pulse Band 8', price:3990, old:4990, rating:4.5, reviews:2410, colors:['#1F2937','#FBCFE8'], specs:{'Экран':'1,6″ AMOLED','Режимы спорта':'150+','Работа':'до 16 дней'}},
  {id:11,cat:'tablet', name:'Tab S 11″, 128 ГБ', price:39990, rating:4.7, reviews:275, colors:['#9CA3AF','#E0E7FF'], specs:{'Экран':'11″ 2560×1600, 120 Гц','Память':'8/128 ГБ','Стилус':'В комплекте','Аккумулятор':'8000 мА·ч'}},
  {id:12,cat:'tablet', name:'Tab Kids 8″ с чехлом', price:11990, rating:4.3, reviews:190, colors:['#FDBA74','#7DD3FC'], specs:{'Экран':'8″ HD','Память':'3/32 ГБ','Родительский контроль':'Да','Чехол':'Противоударный'}}
];

// Простые векторные иллюстрации вместо фото: проект не зависит от внешних картинок
function deviceSVG(cat, color = '#1F2937') {
  const shapes = {
    phone: `<rect x="30" y="5" width="60" height="110" rx="12" fill="${color}"/><rect x="35" y="14" width="50" height="90" rx="6" fill="#fff" opacity=".9"/><circle cx="60" cy="10" r="2" fill="#fff"/>`,
    laptop: `<rect x="18" y="20" width="84" height="56" rx="5" fill="${color}"/><rect x="23" y="25" width="74" height="46" rx="2" fill="#fff" opacity=".9"/><path d="M8 80h104l-6 10H14z" fill="${color}"/>`,
    audio: `<path d="M25 70V55a35 35 0 0 1 70 0v15" fill="none" stroke="${color}" stroke-width="8"/><rect x="15" y="62" width="22" height="38" rx="8" fill="${color}"/><rect x="83" y="62" width="22" height="38" rx="8" fill="${color}"/>`,
    watch: `<rect x="44" y="5" width="32" height="110" rx="8" fill="${color}" opacity=".55"/><rect x="34" y="32" width="52" height="56" rx="14" fill="${color}"/><rect x="40" y="38" width="40" height="44" rx="9" fill="#fff" opacity=".9"/>`,
    tablet: `<rect x="15" y="12" width="90" height="96" rx="10" fill="${color}"/><rect x="21" y="18" width="78" height="84" rx="5" fill="#fff" opacity=".9"/>`
  };
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><g stroke="rgba(0,0,0,.18)" stroke-width="1.5">${shapes[cat]}</g></svg>`;
}
