#!/usr/bin/env node
/* ==========================================================================
   청우해장 홈페이지 빌더
   --------------------------------------------------------------------------
   실행:  node build.mjs
   결과:  index.html(한국어) / en.html / ja.html / zh.html / tw.html
          + sitemap.xml + robots.txt

   내용을 고칠 때는 HTML 을 직접 건드리지 말고 src/ 안의 데이터 파일을
   수정한 뒤 이 스크립트를 다시 돌리세요. 다섯 개 언어가 한 번에 맞춰집니다.
   의존성은 없습니다 — Node 18 이상이면 그대로 돕니다.
   ========================================================================== */

import { writeFileSync, readFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, store, menu, gallery, hero, ogImage, imgBase, hasBreak, parkingLots } from './src/store.mjs';
import { t, menuNames, galleryAlt } from './src/i18n.mjs';
import { tw, menuNamesTw, galleryAltTw } from './src/i18n.tw.mjs';
import { hood, spots, hoodImages } from './src/hood.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// 정적 자산 캐시 무효화 버전. assets/ 안의 CSS·JS 를 고치면 이 숫자를 올리세요.
// (GitHub Pages 와 브라우저가 예전 파일을 붙들고 있는 것을 막습니다.)
const ASSET_V = 7;

// 번체 중국어를 나머지 언어와 같은 표에 합칩니다.
t.tw = tw;
menuNames.tw = menuNamesTw;
galleryAlt.tw = galleryAltTw;

/* ---------------------------- 작은 도우미들 ---------------------------- */
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** 메타 설명·JSON-LD 에 넣기 위해 태그를 벗겨 냅니다. */
const strip = (s = '') => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
/** 페이지 절대 주소. 기본 언어의 index.html 은 디렉터리 주소(/)로 씁니다 —
 *  `/` 와 `/index.html` 을 둘 다 노출하면 검색엔진이 중복 페이지로 봅니다. */
const abs = (p) => site.baseUrl + (p === site.file[site.defaultLang] ? '' : p.replace(/^\.\//, ''));
/** images/ 는 상위 폴더에 있으므로 ../ 를 붙입니다. */
const img = (p) => imgBase + p;
/** 절대 URL(구조화 데이터·OG 용) */
/** 공유 카드·구조화 데이터에 넣을 절대 주소. 이미지가 사이트 안으로 들어와서
 *  상위 폴더가 아니라 자기 주소 기준으로 만듭니다. */
const imgAbs = (p) => site.baseUrl + p.replace(/^\.\//, '');
const won = (n) => n.toLocaleString('ko-KR') + '원';

/* ------------------------- 최적화 사진 (AVIF/WebP) -------------------------
   `npm run images` 가 만들어 둔 images/manifest.json 이 있으면 <picture> 로
   AVIF·WebP 를 먼저 내보냅니다. 없으면 지금까지처럼 그냥 <img> 입니다 —
   그래서 이 빌더는 여전히 의존성이 0개이고, sharp 없이도 돌아갑니다. */
let manifest = {};
try {
  manifest = JSON.parse(readFileSync(join(HERE, 'images/manifest.json'), 'utf-8'));
} catch { /* 최적화 전이면 그냥 원본을 씁니다 */ }

const srcset = (list) => list.map((v) => `${imgBase}${v.path} ${v.w}w`).join(', ');

/**
 * 사진 한 장을 <picture> 로 감싸 냅니다.
 * @param {string} src    store.mjs 에 적힌 원본 경로 (예: 'images/cheongwoo-02.jpg')
 * @param {string} alt    대체 텍스트
 * @param {object} opt    { w, h, sizes, className, style, attrs }
 */
function picture(src, alt, opt = {}) {
  const m = manifest[src];
  const w = opt.w, h = opt.h;
  const sizes = opt.sizes || '100vw';
  const extra = opt.attrs || '';
  const style = opt.style ? ` style="${opt.style}"` : '';
  const imgTag =
    `<img src="${img(src)}" alt="${esc(alt)}" width="${w}" height="${h}"${style} ${extra} />`;

  if (!m) return imgTag;   // 최적화본이 없으면 원본 그대로

  return `<picture>` +
    `<source type="image/avif" srcset="${srcset(m.avif)}" sizes="${sizes}">` +
    `<source type="image/webp" srcset="${srcset(m.webp)}" sizes="${sizes}">` +
    imgTag +
  `</picture>`;
}


const money = (n, lang) => lang === 'ko' ? won(n) : '₩' + n.toLocaleString('en-US');

/* ------------------------- 외부 지도 / 길찾기 링크 ------------------------- */
const NAME_ENC = encodeURIComponent(store.legalKo);              // '한식당 청우해장'
// 이름 + 도로명주소 — 구글이 이 조합이면 다른 지점과 헷갈리지 않고 정확히 찾습니다.
const NAME_ADDR = encodeURIComponent(`${store.legalKo} ${store.roadKo}`);

const links = {
  // ---- 네이버 ----
  // 플레이스 ID 를 채우면 가게 페이지로 직행, 비어 있으면 이름 검색으로 동작합니다.
  naverPlace: store.naverPlaceId
    ? `https://map.naver.com/p/entry/place/${store.naverPlaceId}`
    : `https://map.naver.com/p/search/${NAME_ENC}`,
  naverDir: store.naverPlaceId
    ? `https://map.naver.com/p/entry/place/${store.naverPlaceId}?c=15.00,0,0,0,dh`
    : `https://map.naver.com/p/directions/-/${store.lng},${store.lat},${NAME_ENC}/-/transit`,

  // ---- 카카오 ----
  // ---- 카카오 ---- (kakaoPlaceId 가 비어 있으면 버튼·링크가 전부 빠집니다)
  kakaoPlace: store.kakaoPlaceId ? `https://place.map.kakao.com/${store.kakaoPlaceId}` : '',
  kakaoDir: store.kakaoPlaceId ? `https://map.kakao.com/link/to/${NAME_ENC},${store.lat},${store.lng}` : '',

  // ---- 구글 ----
  // CID 를 채우면 등록된 비즈니스 프로필로 직행합니다.
  googlePlace: store.googleCid
    ? `https://maps.google.com/?cid=${store.googleCid}`
    : `https://www.google.com/maps/search/?api=1&query=${NAME_ADDR}`,
  googleDir: `https://www.google.com/maps/dir/?api=1&destination=${NAME_ADDR}`,
};
// 오픈스트리트맵 임베드 — API 키가 필요 없고 어느 나라에서 접속해도 뜹니다.
const d = 0.0042;
const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${(store.lng - d).toFixed(5)}%2C${(store.lat - d / 1.6).toFixed(5)}%2C${(store.lng + d).toFixed(5)}%2C${(store.lat + d / 1.6).toFixed(5)}&layer=mapnik&marker=${store.lat}%2C${store.lng}`;

/* ------------------------------ 아이콘 ------------------------------ */
const ICON = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};

/* -------------------------- 구조화 데이터(JSON-LD) -------------------------- */
function jsonLd(lang) {
  const L = t[lang];
  const H = hood[lang];
  const url = abs(site.file[lang]);
  const names = menuNames[lang];

  // 브레이크타임이 있으면 두 구간으로, 없으면 한 구간으로 냅니다.
  // (구글은 끊긴 구간 두 개를 「점심에 문 닫는 가게」로 읽으므로, 없는 브레이크를
  //  넣으면 검색 결과에 실제로 「영업 종료」가 뜹니다.)
  const hours = hasBreak
    ? [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: store.openDays, opens: store.hours.open, closes: store.hours.breakStart },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: store.openDays, opens: store.hours.breakEnd, closes: store.hours.close },
      ]
    : [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: store.openDays, opens: store.hours.open, closes: store.hours.close },
      ];

  const restaurant = {
    '@type': 'Restaurant',
    '@id': site.baseUrl + '#restaurant',
    name: lang === 'ko' ? store.legalKo : `${strip(L.footerBiz).split('·')[0].trim()}`,
    alternateName: [store.nameKo, store.nameHanja, 'Cheongwoo Haejang', store.branchKo],
    description: L.description,
    url,
    telephone: '+82-53-255-7052',
    image: gallery.slice(0, 6).map((g) => imgAbs(g.src)),
    logo: imgAbs(hero.src),
    priceRange: store.priceRange,
    currenciesAccepted: store.currency,
    servesCuisine: ['Korean', 'Korean soup', 'Haejang-guk', 'Galbi-tang'],
    acceptsReservations: 'True',
    publicAccess: true,
    maximumAttendeeCapacity: store.seats,
    address: {
      '@type': 'PostalAddress',
      streetAddress: lang === 'ko' ? '남성로 11' : '11 Namseong-ro',
      addressLocality: lang === 'ko' ? '중구' : 'Jung-gu',
      addressRegion: lang === 'ko' ? '대구광역시' : 'Daegu',
      postalCode: store.postalCode,
      addressCountry: 'KR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: store.lat, longitude: store.lng },
    hasMap: [links.naverPlace, links.kakaoPlace, links.googlePlace].filter(Boolean),
    openingHoursSpecification: hours,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Parking', value: store.parking },
      { '@type': 'LocationFeatureSpecification', name: 'Group reservations (up to 40)', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Takeaway', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'High chairs', value: true },
    ],
    hasMenu: {
      '@type': 'Menu',
      name: L.menuTitle,
      inLanguage: site.hreflang[lang],
      hasMenuSection: [{
        '@type': 'MenuSection',
        name: L.menuTitle,
        hasMenuItem: menu.map((m) => ({
          '@type': 'MenuItem',
          name: names[m.id].n,
          description: names[m.id].d,
          ...(m.price ? { offers: { '@type': 'Offer', price: m.price, priceCurrency: store.currency } } : {}),
        })),
      }],
    },
    sameAs: [store.naverBlogUrl, links.kakaoPlace, store.instagramUrl].filter(Boolean),
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': url + '#faq',
    inLanguage: site.hreflang[lang],
    mainEntity: L.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const crumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: site.customDomain
      ? [{ '@type': 'ListItem', position: 1, name: store.nameKo, item: site.baseUrl }]
      : [
          { '@type': 'ListItem', position: 1, name: 'WECO', item: site.parentUrl },
          { '@type': 'ListItem', position: 2, name: store.nameKo, item: url },
        ],
  };

  // 주변 관광지 — 「대구여행 / 근대골목」 검색으로 들어오는 유입을 잡습니다.
  const around = {
    '@type': 'ItemList',
    '@id': url + '#around',
    name: H.courseTitle,
    itemListElement: spots.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'TouristAttraction',
        name: H.spots[s.key].n,
        description: H.spots[s.key].d,
        address: { '@type': 'PostalAddress', addressLocality: lang === 'ko' ? '중구' : 'Jung-gu', addressRegion: 'Daegu', addressCountry: 'KR' },
      },
    })),
  };

  const page = {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: L.title,
    description: L.description,
    inLanguage: site.hreflang[lang],
    isPartOf: { '@type': 'WebSite', '@id': site.baseUrl + '#website', url: site.baseUrl, name: store.nameKo },
    about: { '@id': site.baseUrl + '#restaurant' },
    primaryImageOfPage: imgAbs(ogImage),
  };

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [page, restaurant, faq, crumbs, around] });
}


/* ------------------------------ 약도 (SVG) ------------------------------
   어르신 손님이 많아 「지도 앱」보다 「종이 약도」가 낫습니다. 실측이 아니라 방향과
   순서만 맞춘 개념도이고, 글씨를 크게 둡니다. 가장 빠른 길(2026-08-19 확인):
   반월당역 → 「더현대 대구」 방면 출구 → 백화점 옆 골목으로 북쪽 → 한의약박물관 지나
   약전골목(남성로)에서 왼쪽 → 청우해장. 약 315m, 도보 4분. (18번 출구는 6분)
   좌표 출처: 네이버 지역검색. */
function sketchMap(lang) {
  const T = {
    ko: { title: '약도', n: '북', store: '청우해장', road: '남성로 · 약전골목', station: '반월당역', dept: '더현대 대구', exit: '더현대 방면 출구', museum: '한의약박물관', park: '공영주차장 (도보 1분)',
          s1: '반월당역에서 「더현대 대구」 쪽 출구로 나옵니다', s2: '백화점 옆 골목으로 북쪽으로 3분 올라옵니다', s3: '박물관 지나 약전골목에서 왼쪽 → 청우해장', total: '도보 4분', print: '약도 인쇄', close: '닫기' },
    en: { title: 'Sketch map', n: 'N', store: 'Cheongwoo Haejang', road: 'Namseong-ro · Herbal alley', station: 'Banwoldang Stn.', dept: 'The Hyundai Daegu', exit: 'exit toward The Hyundai', museum: 'Herbal Medicine Museum', park: 'Public parking (1 min)',
          s1: 'Leave Banwoldang Station by the exit toward The Hyundai Daegu', s2: 'Walk north 3 min along the lane beside the store', s3: 'Past the museum, turn left into the herbal alley → here', total: '4 min on foot', print: 'Print map', close: 'Close' },
    ja: { title: '略図', n: '北', store: 'チョンウヘジャン', road: '南城路 · 薬田横丁', station: '半月堂駅', dept: 'ザ・現代 大邱', exit: '現代百貨店方面の出口', museum: '韓医薬博物館', park: '公営駐車場（徒歩1分）',
          s1: '半月堂駅を「ザ・現代 大邱」方面の出口から出ます', s2: '百貨店脇の路地を北へ3分歩きます', s3: '博物館を過ぎ、薬田横丁で左折 → 当店', total: '徒歩4分', print: '略図を印刷', close: '閉じる' },
    zh: { title: '简图', n: '北', store: '青友解酲', road: '南城路 · 药田胡同', station: '半月堂站', dept: 'The Hyundai 大邱', exit: '往 The Hyundai 的出口', museum: '韩医药博物馆', park: '公共停车场（步行1分钟）',
          s1: '从半月堂站往「The Hyundai 大邱」方向的出口出来', s2: '沿百货公司旁的小巷向北走 3 分钟', s3: '经过博物馆，在药田胡同左转 → 本店', total: '步行 4 分钟', print: '打印简图', close: '关闭' },
    tw: { title: '簡圖', n: '北', store: '青友解酲', road: '南城路 · 藥田巷', station: '半月堂站', dept: 'The Hyundai 大邱', exit: '往 The Hyundai 的出口', museum: '韓醫藥博物館', park: '公有停車場（步行 1 分鐘）',
          s1: '從半月堂站往「The Hyundai 大邱」方向的出口出來', s2: '沿百貨公司旁的小巷向北走 3 分鐘', s3: '經過博物館，在藥田巷左轉 → 本店', total: '步行 4 分鐘', print: '列印簡圖', close: '關閉' },
  }[lang];
  const e = esc;
  // 실사 지도: tools/sketch-map.mjs 가 OSM 타일 + 실제 도보 경로로 만든 images/sketch-map.jpg
  // (지도 라벨은 한국어. 다른 언어는 아래 3단계 안내가 번역돼 나갑니다.)
  const mapImg = picture('images/sketch-map.jpg', `${T.title} — ${T.store}`, {
    w: 2237, h: 1978, sizes: '(max-width: 700px) 100vw, 1000px', attrs: 'loading="lazy" decoding="async"',
  });
  const steps = `
    <ol class="sketch-steps">
      <li><b>1</b><span>${e(T.s1)}</span></li>
      <li><b>2</b><span>${e(T.s2)}</span></li>
      <li><b>3</b><span>${e(T.s3)}</span></li>
    </ol>
    <p class="sketch-total">${e(T.total)} · <span class="sketch-p">P</span> ${e(T.park)}</p>`;
  const svg = `<div class="sketch-body"><div class="sketch-img">${mapImg}</div><div class="sketch-side">${steps}</div></div>`;
  const figure = `
<figure class="sketch" id="sketch" aria-label="${e(T.title)}">
  ${svg}
  <figcaption class="sketch-cap"><span>${e(T.title)}</span><span><button type="button" class="printbtn" data-open-sketch>${e(T.title)} +</button> <button type="button" class="printbtn" onclick="window.print()">${e(T.print)}</button></span></figcaption>
</figure>`;
  // 모달은 <body> 끝에 따로 붙입니다 — 섹션 안에 두면 .rv 의 transform 때문에
  // position:fixed 가 화면이 아니라 섹션 기준이 되어 안 보입니다.
  const modal = `
<div class="sketch-modal" id="sketch-modal" role="dialog" aria-modal="true" aria-label="${e(T.title)}" hidden>
  <div class="sketch-modal-box">${svg}<button type="button" class="sketch-close" data-close-sketch>${e(T.close)}</button></div>
</div>`;
  return { figure, modal };
}

/* ------------------------------ 부분 조각들 ------------------------------ */
const langSwitcher = (lang, cls) => site.langs.map((l) =>
  `<a href="${site.file[l]}" hreflang="${site.hreflang[l]}" lang="${site.hreflang[l]}"${l === lang ? ' class="on" aria-current="true"' : ''} data-track="language" data-track-label="${l}">${{ ko: 'KO', en: 'EN', ja: 'JA', zh: '简', tw: '繁' }[l]}</a>`
).join('');

function menuRows(lang) {
  const L = t[lang], names = menuNames[lang];
  const seasonalWords = {
    winter: { ko: '겨울 한정', en: 'Winter only', ja: '冬季限定', zh: '冬季限定', tw: '冬季限定' },
    summer: { ko: '여름 한정', en: 'Summer only', ja: '夏季限定', zh: '夏季限定', tw: '夏季限定' },
  };
  return menu.map((m) => `
      <div class="mrow rv${m.img ? ' has-img' : ''}">
        ${m.img ? `<div class="mimg">${picture(m.img, names[m.id].n, {
          w: 640, h: 640,
          sizes: '(max-width: 700px) 30vw, 140px',
          attrs: 'loading="lazy" decoding="async"',
        })}</div>` : ''}
        <h3>${esc(names[m.id].n)}${m.signature ? `<span class="tag">${esc(L.menuSignature)}</span>` : ''}${m.seasonal ? `<span class="tag tag-season tag-${m.seasonal}">${esc(seasonalWords[m.seasonal][lang])}</span>` : ''}</h3>
        <span class="price${m.price ? '' : ' ask'}">${m.price ? esc(money(m.price, lang)) : esc(L.menuAsk)}</span>
        <p>${esc(names[m.id].d)}</p>
      </div>`).join('');
}

/* 근처 주차장 목록 — 이름을 누르면 네이버지도 길찾기가 그 주차장으로 열립니다. */
function parkingList(lang) {
  if (!parkingLots.length) return '';
  const walk = { ko: (m) => `도보 ${m}분`, en: (m) => `${m} min walk`, ja: (m) => `徒歩${m}分`, zh: (m) => `步行 ${m} 分钟`, tw: (m) => `步行 ${m} 分鐘` }[lang];
  const kindWord = { ko: { public: '공영', private: '민영' }, en: { public: 'Public', private: 'Private' }, ja: { public: '公営', private: '民営' }, zh: { public: '公共', private: '民营' }, tw: { public: '公有', private: '民營' } }[lang];
  return `<ul class="parking-list">${parkingLots.map((p) => {
    const name = lang === 'ko' ? p.nameKo : p.nameEn;
    const dir = `https://map.naver.com/p/directions/-/${p.lng},${p.lat},${encodeURIComponent(p.nameKo)}/-/car`;
    return `<li><a href="${dir}" target="_blank" rel="noopener" data-track="directions" data-track-label="parking-${p.id}"><strong>${esc(name)}</strong><span class="pk-meta">${esc(kindWord[p.kind])} · ${esc(walk(p.walkMin))}</span>${lang === 'ko' ? `<span class="pk-addr">${esc(p.addrKo)}</span>` : ''}</a></li>`;
  }).join('')}</ul>`;
}

function galleryFigures(lang) {
  const alts = galleryAlt[lang];
  const shape = ['wide', 'tall', '', '', 'tall', '', 'tall', '', '', '', '', ''];
  return gallery.map((g, i) => `
        <figure class="${shape[i]}">
          ${picture(g.src, alts[g.key], {
            w: g.w, h: g.h,
            sizes: '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw',
            attrs: `data-full="${img(g.src)}" loading="lazy" decoding="async"`,
          })}
        </figure>`).join('');
}

function hoodSection(lang) {
  const H = hood[lang];
  return `
  <section class="section" id="hood">
    <div class="container">
      <div class="sec-head rv">
        <span class="sec-kicker">${esc(H.kicker)}</span>
        <h2>${H.title}</h2>
        <p>${H.lede}</p>
      </div>
      <div class="story-grid three">
        ${H.blocks.map((b) => `<article class="story-card rv"><h3>${esc(b.h)}</h3><p>${b.p}</p></article>`).join('\n        ')}
      </div>

      <div class="archive rv">
        <h3 class="course-title">${esc(H.archiveTitle)}</h3>
        <p class="archive-lede">${esc(H.archiveLede)}</p>
        <div class="archive-grid">
          ${hoodImages.map((im) => `<figure class="archive-item${im.key === 'map1930' ? ' wide' : ''}">
            ${picture(im.src, H.archive[im.key], { w: im.w, h: im.h, sizes: '(max-width: 700px) 100vw, 50vw', attrs: 'loading="lazy" decoding="async"' })}
            <figcaption><span>${esc(H.archive[im.key])}</span><small>${esc(im.credit)}</small></figcaption>
          </figure>`).join('\n          ')}
        </div>
      </div>

      <div class="course rv">
        <h3 class="course-title">${esc(H.courseTitle)}</h3>
        <ul class="course-list">
          ${spots.map((s) => `<li><span class="c-min">${s.min}′</span><span class="c-body"><strong>${esc(H.spots[s.key].n)}</strong><em>${esc(H.spots[s.key].d)}</em></span></li>`).join('\n          ')}
        </ul>
        <p class="menu-note">${esc(H.courseNote)}</p>
      </div>
    </div>
  </section>`;
}

/* ------------------------------ 페이지 조립 ------------------------------ */
function page(lang) {
  const L = t[lang];
  const file = site.file[lang];
  const url = abs(file);
  const names = menuNames[lang];

  const alternates = site.langs.map((l) =>
    `<link rel="alternate" hreflang="${site.hreflang[l]}" href="${abs(site.file[l])}" />`).join('\n');

  return `<!DOCTYPE html>
<html lang="${site.hreflang[lang]}">
<head>
<script>document.documentElement.classList.add('js')</script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${esc(L.title)}</title>
<meta name="description" content="${esc(L.description)}" />
<meta name="keywords" content="${esc(L.keywords)}" />
<meta name="author" content="${esc(store.legalKo)}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
${site.naverSiteVerification ? `<meta name="naver-site-verification" content="${site.naverSiteVerification}" />` : '<!-- 네이버 서치어드바이저 소유확인 코드를 src/store.mjs 의 naverSiteVerification 에 넣으세요 -->'}
${site.googleSiteVerification ? `<meta name="google-site-verification" content="${site.googleSiteVerification}" />` : '<!-- 구글 서치콘솔 소유확인 코드를 src/store.mjs 의 googleSiteVerification 에 넣으세요 -->'}
${site.bingSiteVerification ? `<meta name="msvalidate.01" content="${site.bingSiteVerification}" />` : ''}
<meta name="theme-color" content="#171310" />

<link rel="canonical" href="${url}" />
${alternates}
<link rel="alternate" hreflang="x-default" href="${abs(site.file[site.defaultLang])}" />

<!-- 지역 정보 -->
<meta name="geo.region" content="${store.region}" />
<meta name="geo.placename" content="Daegu Jung-gu Namseong-ro" />
<meta name="geo.position" content="${store.lat};${store.lng}" />
<meta name="ICBM" content="${store.lat}, ${store.lng}" />

<!-- 공유 미리보기 -->
<meta property="og:type" content="restaurant.restaurant" />
<meta property="og:site_name" content="${esc(store.nameKo)}" />
<meta property="og:title" content="${esc(L.title)}" />
<meta property="og:description" content="${esc(L.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${imgAbs(ogImage)}" />
<meta property="og:image:width" content="1600" />
<meta property="og:image:height" content="1067" />
<meta property="og:locale" content="${L.ogLocale}" />
${site.langs.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${t[l].ogLocale}" />`).join('\n')}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(L.title)}" />
<meta name="twitter:description" content="${esc(L.description)}" />
<meta name="twitter:image" content="${imgAbs(ogImage)}" />

<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="image" href="${img(hero.src)}" fetchpriority="high" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600&display=swap" />
<link rel="stylesheet" href="assets/site.css?v=${ASSET_V}" />

<script>/* 광고·측정 ID 설정 */</script>
<script src="assets/config.js?v=${ASSET_V}"></script>
<script src="assets/tracking.js?v=${ASSET_V}"></script>

<script type="application/ld+json">${jsonLd(lang)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(L.skip)}</a>

<!-- ================= 상단바 ================= -->
<header class="topbar" id="topbar">
  <div class="container topbar-inner">
    <button class="menubtn" id="menubtn" type="button" aria-label="Menu" aria-controls="gnb" aria-expanded="false"><span></span><span></span><span></span></button>
    <a class="brand" href="${file}"><span>${esc(store.nameKo)}</span><span class="hanja">${esc(store.nameHanja)}</span></a>
    <nav class="gnb" id="gnb" aria-label="${esc(L.nav.menu)}">
      <a href="#menu">${esc(L.nav.menu)}</a>
      <a href="#story">${esc(L.nav.story)}</a>
      <a href="#hood">${esc(L.nav.hood)}</a>
      <a href="#gallery">${esc(L.nav.gallery)}</a>
      <a href="#visit">${esc(L.nav.visit)}</a>
      <a href="#faq">${esc(L.nav.faq)}</a>
    </nav>
    <div class="topbar-actions">
      <div class="langsw" role="group" aria-label="${esc(L.langLabel)}">${langSwitcher(lang)}</div>
      <a class="bar-cta" href="tel:${store.telHref}" data-track="call" data-track-label="topbar">${ICON.phone}${esc(L.navReserve)}</a>
    </div>
  </div>
</header>

<main id="main">

<!-- ================= 히어로 ================= -->
<section class="hero hero--${hero.kind}">
  <div class="hero-bg">
    ${picture(hero.src, hero.kind === 'food' ? L.heroAltFood : galleryAlt[lang].exterior, {
      w: hero.width, h: hero.height,
      sizes: '100vw',
      style: `object-position:${hero.position}`,
      attrs: 'fetchpriority="high" decoding="async"',
    })}
  </div>
  <div class="hero-veil"></div>
  <div class="container hero-inner">
    <span class="eyebrow">${esc(L.heroBadge)}</span>
    <h1 id="hero-title" data-titles='${JSON.stringify(L.heroTitles || [L.heroTitle])}'>${(L.heroTitles || [L.heroTitle])[0]}</h1>
    <p class="hero-lede">${L.heroLede}</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="tel:${store.telHref}" data-track="call" data-track-label="hero">${ICON.phone}${esc(L.heroCtaCall)}</a>
      <a class="btn btn-ghost" href="#sketch-sec" data-open-sketch data-track="directions" data-track-label="hero-sketch">${ICON.pin}${esc(L.heroCtaMap)}</a>
      <a class="btn btn-ghost" href="#menu" data-track="menu" data-track-label="hero">${esc(L.heroCtaMenu)}${ICON.arrow}</a>
    </div>
  </div>
</section>

<!-- ================= 빠른 정보 ================= -->
<section class="quickbar">
  <div class="container quickgrid">
    <div class="quick">
      <h3>${esc(L.quickHours)}</h3>
      <p>${esc(L.quickHoursVal)} <span id="open-now" class="open-now"
        data-hours="${store.hours.open},${store.hours.breakStart || ''},${store.hours.breakEnd || ''},${store.hours.close}"
        data-open="${lang === 'ko' ? '영업 중' : lang === 'ja' ? '営業中' : lang === 'zh' ? '营业中' : lang === 'tw' ? '營業中' : 'Open now'}"
        data-break="${lang === 'ko' ? '브레이크타임' : lang === 'ja' ? '休憩中' : lang === 'zh' ? '休息中' : lang === 'tw' ? '休息中' : 'On break'}"
        data-before="${lang === 'ko' ? '영업 전' : lang === 'ja' ? '開店前' : lang === 'zh' ? '尚未营业' : lang === 'tw' ? '尚未營業' : 'Opens ' + store.hours.open}"
        data-closed="${lang === 'ko' ? '영업 종료' : lang === 'ja' ? '営業終了' : lang === 'zh' ? '已打烊' : lang === 'tw' ? '已打烊' : 'Closed'}"></span></p>
      <small>${esc(L.quickBreak)}</small>
    </div>
    <div class="quick">
      <h3>${esc(L.quickAddr)}</h3>
      <p><a href="${links.naverPlace}" target="_blank" rel="noopener" data-track="directions" data-track-label="quickbar-address">${esc(lang === 'ko' ? store.roadKo : store.roadEn)}</a></p>
      <small>${esc(lang === 'ko' ? store.areaKo : 'Yakjeon-golmok · 5 min from Banwoldang Stn.')}</small>
    </div>
    <div class="quick">
      <h3>${esc(L.quickTel)}</h3>
      <p><a href="tel:${store.telHref}" data-track="call" data-track-label="quickbar">${esc(store.telDisplay)}</a></p>
      <small>${esc(store.telSafeDisplay)}</small>
    </div>
    <div class="quick">
      <h3>${esc(L.quickPark)}</h3>
      <p>${esc(L.quickParkVal)}</p>
    </div>
  </div>
</section>

<!-- ================= 이야기 ================= -->
<section class="section" id="story">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">${esc(L.nav.story)}</span>
      <h2>${esc(L.storyTitle)}</h2>
      <p>${L.storyLede}</p>
    </div>
    <div class="story-grid">
      ${L.story.map((s) => `<article class="story-card rv"><h3>${esc(s.h)}</h3><p>${s.p}</p></article>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- ================= 약도 (대표 메뉴 위) ================= -->
<section class="section sketch-sec" id="sketch-sec">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">${esc(L.nav.visit)}</span>
      <h2>${esc(L.heroCtaMap)}</h2>
      <p>${esc(L.visitLede)}</p>
    </div>
    <div class="rv">${sketchMap(lang).figure}</div>
  </div>
</section>

<!-- ================= 메뉴 ================= -->
<section class="section alt" id="menu">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">${esc(L.nav.menu)}</span>
      <h2>${esc(L.menuTitle)}</h2>
      <p>${esc(L.menuLede)}</p>
    </div>
    <div class="menu-list">${menuRows(lang)}
    </div>
    <p class="menu-note rv">${esc(L.menuNote)}</p>
  </div>
</section>

<!-- ================= 약전골목 이야기 ================= -->
${hoodSection(lang)}

<!-- ================= 갤러리 ================= -->
<section class="section alt" id="gallery">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">${esc(L.nav.gallery)}</span>
      <h2>${esc(L.galleryTitle)}</h2>
      <p>${esc(L.galleryLede)}</p>
    </div>
    <div class="gal rv">${galleryFigures(lang)}
    </div>
  </div>
</section>

<!-- ================= 오시는 길 ================= -->
<section class="section" id="visit">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">${esc(L.nav.visit)}</span>
      <h2>${esc(L.visitTitle)}</h2>
      <p>${esc(L.visitLede)}</p>
    </div>
    <div class="visit">
      <div class="rv">
        <div class="map-wrap">
          <iframe id="map-frame" data-src="${osmEmbed}" title="${esc(L.mapAlt)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div class="route-btns">
          <a class="btn btn-ink" href="${links.naverDir}" target="_blank" rel="noopener" data-track="directions" data-track-label="naver">${ICON.pin}${esc(L.visitNaver)}</a>
          ${links.kakaoDir ? `<a class="btn btn-outline" href="${links.kakaoDir}" target="_blank" rel="noopener" data-track="directions" data-track-label="kakao">${esc(L.visitKakao)}</a>` : ''}
          <a class="btn btn-outline" href="${links.googleDir}" target="_blank" rel="noopener" data-track="directions" data-track-label="google">${esc(L.visitGoogle)}</a>
        </div>
      </div>
      <div class="infolist rv">
        <div class="infoitem">
          <h3>${esc(L.quickAddr)}</h3>
          <p class="big">${esc(lang === 'ko' ? store.roadKo : store.roadEn)}</p>
          ${lang === 'ko' ? `<p>${esc(store.jibunKo)}</p>` : `<p>${esc(store.roadKo)}</p>`}
          <button type="button" class="copybtn" data-copy="${esc(store.roadKo)}" data-label-copied="${esc(L.visitCopied)}"><span>${esc(L.visitCopy)}</span></button>
        </div>
        <div class="infoitem">
          <h3>${esc(L.transitTitle)}</h3>
          <ul>${L.transit.map((x) => `<li>${x}</li>`).join('')}</ul>
        </div>
        <div class="infoitem">
          <h3>${esc(L.parkingTitle)}</h3>
          <p>${esc(L.parkingBody)}</p>
          ${parkingList(lang)}
        </div>
        <div class="infoitem">
          <h3>${esc(L.quickHours)}</h3>
          <p class="big">${esc(L.quickHoursVal)}</p>
          <p>${esc(L.quickBreak)}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= 예약 ================= -->
<section class="section alt" id="reserve">
  <div class="container">
    <div class="reserve rv">
      <h2>${esc(L.reserveTitle)}</h2>
      <p>${esc(L.reserveLede)}</p>
      <a class="tel-big" href="tel:${store.telHref}" data-track="call" data-track-label="reserve-big">${esc(store.telDisplay)}</a>
      <div class="reserve-cta">
        <a class="btn btn-primary" href="tel:${store.telHref}" data-track="call" data-track-label="reserve">${ICON.phone}${esc(L.reserveCall)}</a>
        <a class="btn btn-ghost" href="tel:${store.telSafeHref}" data-track="call" data-track-label="reserve-safe">${esc(L.reserveCallSafe)}</a>
        ${store.naverBookingUrl ? `<a class="btn btn-ghost" href="${store.naverBookingUrl}" target="_blank" rel="noopener" data-track="reserve" data-track-label="naver-booking">${ICON.book}${esc(L.reserveNaver)}</a>` : ''}
        ${store.naverBlogUrl ? `<a class="btn btn-ghost" href="${store.naverBlogUrl}" target="_blank" rel="noopener" data-track="blog" data-track-label="naver-blog">${esc(L.reserveBlog)}</a>` : ''}
        ${store.instagramUrl ? `<a class="btn btn-ghost" href="${store.instagramUrl}" target="_blank" rel="noopener" data-track="blog" data-track-label="instagram">Instagram</a>` : ''}
      </div>
      <p class="reserve-note">${esc(L.reserveHoursNote)}</p>
    </div>
  </div>
</section>

<!-- ================= FAQ ================= -->
<section class="section" id="faq">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">FAQ</span>
      <h2>${esc(L.faqTitle)}</h2>
    </div>
    <div class="faq rv">
      ${L.faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>

</main>

<!-- ================= 푸터 ================= -->
<footer class="foot">
  <div class="container">
    <div class="foot-top">
      <div>
        <div class="foot-brand"><span>${esc(store.nameKo)}</span><span class="hanja">${esc(store.nameHanja)}</span></div>
        <p class="foot-tag">${esc(L.footerTagline)}</p>
      </div>
      <nav class="foot-links" aria-label="${esc(L.nav.visit)}">
        <a href="tel:${store.telHref}" data-track="call" data-track-label="footer">${esc(store.telDisplay)}</a>
        <a href="${links.naverPlace}" target="_blank" rel="noopener" data-track="directions" data-track-label="footer-naver">NAVER</a>
        ${links.kakaoPlace ? `<a href="${links.kakaoPlace}" target="_blank" rel="noopener" data-track="directions" data-track-label="footer-kakao">KakaoMap</a>` : ''}
        <a href="${links.googlePlace}" target="_blank" rel="noopener" data-track="directions" data-track-label="footer-google">Google Maps</a>
        ${store.naverBlogUrl ? `<a href="${store.naverBlogUrl}" target="_blank" rel="noopener" data-track="blog" data-track-label="footer-blog">Blog</a>` : ''}
        ${store.instagramUrl ? `<a href="${store.instagramUrl}" target="_blank" rel="noopener" data-track="blog" data-track-label="footer-instagram">Instagram</a>` : ''}
      </nav>
    </div>
    <div class="foot-bottom">
      <span>${esc(L.footerBiz)}</span>
      <span><a href="${site.parentUrl}" target="_blank" rel="noopener">${esc(L.footerCredit)}</a></span>
      <span>${esc(L.footerRights)}</span>
    </div>
  </div>
</footer>

<!-- 모바일 하단 고정 액션 — 손님이 가장 많이 누르는 두 가지만 둡니다 -->
<div class="mobile-bar">
  <a class="m-call" href="tel:${store.telHref}" data-track="call" data-track-label="mobilebar">${ICON.phone}${esc(L.heroCtaCall)}</a>
  <a class="m-dir" href="${links.naverDir}" target="_blank" rel="noopener" data-track="directions" data-track-label="mobilebar">${ICON.pin}${esc(L.heroCtaDir)}</a>
</div>

<!-- 갤러리 확대 -->
${sketchMap(lang).modal}
<div class="lb" id="lightbox" role="dialog" aria-modal="true" aria-label="${esc(L.galleryTitle)}">
  <button class="lb-close" type="button" aria-label="Close">&times;</button>
  <button class="lb-nav lb-prev" type="button" aria-label="Previous">&#8249;</button>
  <img src="" alt="" />
  <button class="lb-nav lb-next" type="button" aria-label="Next">&#8250;</button>
  <p class="lb-cap"></p>
</div>

<script src="assets/site.js?v=${ASSET_V}"></script>
</body>
</html>
`;
}

/* -------------------------------- 실행 -------------------------------- */
mkdirSync(HERE, { recursive: true });
let bytes = 0;
for (const lang of site.langs) {
  const html = page(lang);
  const out = join(HERE, site.file[lang]);
  writeFileSync(out, html, 'utf8');
  bytes += Buffer.byteLength(html);
  console.log(`  ✓ ${site.file[lang].padEnd(11)} ${site.hreflang[lang].padEnd(8)} ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}

/* 사이트맵 — 5개 언어를 서로 alternate 로 묶어 줍니다. */
const today = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${site.langs.map((lang) => `  <url>
    <loc>${abs(site.file[lang])}</loc>
${site.langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${site.hreflang[l]}" href="${abs(site.file[l])}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(site.file[site.defaultLang])}" />
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${lang === site.defaultLang ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(HERE, 'sitemap.xml'), sitemap, 'utf8');

/* robots.txt
   자체 도메인을 쓰면 이 파일이 도메인 최상단에 놓여 검색엔진이 실제로 읽습니다.
   (위코 하위 경로에 있을 때는 /weco/robots.txt 라 무시됐습니다.)
   운영 문서는 사이트 동작과 무관하고 외부에 보일 이유가 없어 색인에서 뺍니다. */
const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  '# 운영 문서 — 색인 제외',
  'Disallow: /README.md',
  'Disallow: /MARKETING.md',
  'Disallow: /DOMAIN.md',
  'Disallow: /PLACE-정보-붙여넣기.md',
  'Disallow: /src/',
  'Disallow: /build.mjs',
  '',
  `Sitemap: ${site.baseUrl}sitemap.xml`,
  '',
].join('\n');
writeFileSync(join(HERE, 'robots.txt'), robots, 'utf8');
console.log('  ✓ robots.txt');

/* GitHub Pages 커스텀 도메인 설정 파일.
   customDomain 을 채우면 만들어지고, 비우면 지웁니다. */
const cnamePath = join(HERE, 'CNAME');
if (site.customDomain) {
  writeFileSync(cnamePath, site.customDomain + '\n', 'utf8');
  console.log(`  ✓ CNAME       ${site.customDomain}`);
} else if (existsSync(cnamePath)) {
  rmSync(cnamePath);
  console.log('  ✓ CNAME       제거 (customDomain 비어 있음)');
}
console.log(`  ✓ sitemap.xml (${site.langs.length} urls)`);
console.log(`\n총 ${(bytes / 1024).toFixed(1)} KB · ${site.langs.length}개 언어 생성 완료`);
