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

import { writeFileSync, readFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, store, menu, gallery, hero, ogImage, imgBase, hasBreak, parkingLots, notice, holidayOpen } from './src/store.mjs';
import { news } from './src/news.mjs';
import { t, menuNames, galleryAlt } from './src/i18n.mjs';
import { tw, menuNamesTw, galleryAltTw } from './src/i18n.tw.mjs';
import { hood, spots, hoodImages } from './src/hood.mjs';
import { reviews, reviewsMeta } from './src/reviews.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// 정적 자산 캐시 무효화 버전. assets/ 안의 CSS·JS 를 고치면 이 숫자를 올리세요.
// (GitHub Pages 와 브라우저가 예전 파일을 붙들고 있는 것을 막습니다.)
const ASSET_V = 25;

// 빌드 날짜(한국 시간). 사이트맵 lastmod 에 찍히고, 기한이 지난 공지·특별 영업일을 빼는 데 씁니다.
// `BUILD_DATE=2026-09-28 node build.mjs` 처럼 주면 그 날짜로 빌드한 것처럼 동작합니다(점검용).
const BUILD_DAY = process.env.BUILD_DATE || new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10); // KST(UTC+9) 기준 날짜 — UTC 로 잡으면 오전 9시 전 빌드가 전날로 찍힙니다.
const BUILD_NOW = process.env.BUILD_DATE ? Date.parse(`${process.env.BUILD_DATE}T00:00:00+09:00`) : Date.now();

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
// 구글 지도 임베드 — API 키 없이 쓰는 output=embed 방식. 손님에게 익숙하고
// 가게 핀·리뷰가 같이 보입니다. (2026-09-04 사장님 요청으로 OSM 에서 교체)
const osmEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(store.legalKo + ' ' + store.roadKo)}&ll=${store.lat},${store.lng}&z=17&hl=ko&output=embed`;

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

  // 명절·공휴일에도 평소대로 여는 날(src/store.mjs 의 holidayOpen). 그 날짜의 영업시간을
  // 「특별 영업시간」으로 한 번 더 못박아 「공휴일 휴무일지도」 하는 추측을 없앱니다.
  // 브레이크타임은 그날도 그대로라 평소와 같은 구간으로 냅니다. 지난 날짜는 빼고 냅니다.
  const holidayHours = holidayOpen.filter((d) => d >= BUILD_DAY).flatMap((d) =>
    hours.map((h) => ({ '@type': 'OpeningHoursSpecification', validFrom: d, validThrough: d, opens: h.opens, closes: h.closes })));

  const restaurant = {
    '@type': 'Restaurant',
    '@id': site.baseUrl + '#restaurant',
    name: lang === 'ko' ? store.legalKo : `${strip(L.footerBiz).split('·')[0].trim()}`,
    alternateName: [store.nameKo, store.nameHanja, 'Cheongwoo Haejang', store.branchKo],
    description: L.description,
    url,
    telephone: '+82-53-255-7052',
    image: gallery.slice(0, 6).map((g) => imgAbs(g.src)),
    logo: imgAbs('images/logo.png'),
    priceRange: store.priceRange,
    currenciesAccepted: store.currency,
    servesCuisine: ['Korean', 'Korean soup', 'Haejang-guk', 'Galbi-tang'],
    foundingDate: String(store.founded),
    acceptsReservations: 'True',
    publicAccess: true,
    maximumAttendeeCapacity: store.seats,
    address: {
      '@type': 'PostalAddress',
      streetAddress: lang === 'ko' ? '남성로 11, 1층' : '11 Namseong-ro, 1F',
      addressLocality: lang === 'ko' ? '중구' : 'Jung-gu',
      addressRegion: lang === 'ko' ? '대구광역시' : 'Daegu',
      postalCode: store.postalCode,
      addressCountry: 'KR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: store.lat, longitude: store.lng },
    hasMap: [links.naverPlace, links.kakaoPlace, links.googlePlace].filter(Boolean),
    openingHoursSpecification: hours,
    ...(holidayHours.length ? { specialOpeningHoursSpecification: holidayHours } : {}),
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
        hasMenuItem: menu.filter((m) => !m.offSeason).map((m) => ({
          '@type': 'MenuItem',
          name: names[m.id].n,
          description: names[m.id].d,
          ...(m.price ? { offers: { '@type': 'Offer', price: m.price, priceCurrency: store.currency } } : {}),
        })),
      }],
    },
    sameAs: [links.naverPlace, links.googlePlace, store.naverBlogUrl, links.kakaoPlace, store.instagramUrl].filter(Boolean),
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
   약전골목(남성로)에서 왼쪽 → 청우해장.
   도보 시간은 카카오맵 도보 길찾기 실측(2026-09): 더현대 대구 382m·약 6분, 반월당역 15번 출구 499m·약 7분.
   15번 이외의 출구 번호와 구간별 분 수는 확정되지 않아 쓰지 않습니다.
   좌표 출처: 네이버 지역검색. */
function sketchMap(lang) {
  const T = {
    ko: { title: '약도', n: '북', store: '청우해장', road: '남성로 · 약전골목', station: '반월당역', dept: '더현대 대구', exit: '더현대 방면 출구', museum: '한의약박물관', park: '공영주차장 (도보 1분)',
          s1: '반월당역에서 「더현대 대구」 쪽 출구로 나옵니다', s2: '백화점 옆 골목을 따라 북쪽으로 올라옵니다', s3: '박물관 지나 약전골목에서 왼쪽 → 청우해장', total: '더현대 대구에서 도보 약 6분', save: '약도 저장', saving: '저장 중…', saveHint: '이미지를 길게 눌러 「이미지 저장」을 누르세요', close: '닫기' },
    en: { title: 'Sketch map', n: 'N', store: 'Cheongwoo Haejang', road: 'Namseong-ro · Herbal alley', station: 'Banwoldang Stn.', dept: 'The Hyundai Daegu', exit: 'exit toward The Hyundai', museum: 'Herbal Medicine Museum', park: 'Public parking (1 min)',
          s1: 'Leave Banwoldang Station by the exit toward The Hyundai Daegu', s2: 'Walk north along the lane beside the store', s3: 'Past the museum, turn left into the herbal alley → here', total: 'About 6 min on foot from The Hyundai Daegu', save: 'Save map', saving: 'Saving…', saveHint: 'Press and hold the image, then tap "Save Image"', close: 'Close' },
    ja: { title: '略図', n: '北', store: 'チョンウヘジャン', road: '南城路 · 薬田横丁', station: '半月堂駅', dept: 'ザ・現代 大邱', exit: '現代百貨店方面の出口', museum: '韓医薬博物館', park: '公営駐車場（徒歩1分）',
          s1: '半月堂駅を「ザ・現代 大邱」方面の出口から出ます', s2: '百貨店脇の路地を北へ進みます', s3: '博物館を過ぎ、薬田横丁で左折 → 当店', total: 'ザ・現代 大邱から徒歩約6分', save: '略図を保存', saving: '保存中…', saveHint: '画像を長押しして「画像を保存」を選んでください', close: '閉じる' },
    zh: { title: '简图', n: '北', store: '青友解酲', road: '南城路 · 药田胡同', station: '半月堂站', dept: 'The Hyundai 大邱', exit: '往 The Hyundai 的出口', museum: '韩医药博物馆', park: '公共停车场（步行1分钟）',
          s1: '从半月堂站往「The Hyundai 大邱」方向的出口出来', s2: '沿百货公司旁的小巷向北走', s3: '经过博物馆，在药田胡同左转 → 本店', total: '距 The Hyundai 大邱步行约6分钟', save: '保存简图', saving: '保存中…', saveHint: '长按图片，选择「保存图片」', close: '关闭' },
    tw: { title: '簡圖', n: '北', store: '青友解酲', road: '南城路 · 藥田巷', station: '半月堂站', dept: 'The Hyundai 大邱', exit: '往 The Hyundai 的出口', museum: '韓醫藥博物館', park: '公有停車場（步行 1 分鐘）',
          s1: '從半月堂站往「The Hyundai 大邱」方向的出口出來', s2: '沿百貨公司旁的小巷向北走', s3: '經過博物館，在藥田巷左轉 → 本店', total: '距 The Hyundai 大邱步行約 6 分鐘', save: '儲存簡圖', saving: '儲存中…', saveHint: '長按圖片，選擇「儲存影像」', close: '關閉' },
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
<figure class="sketch" id="sketch" aria-label="${e(T.title)}" data-save-title="${e(T.title)} — ${e(T.store)}" data-save-file="${e(T.store.replace(/\s+/g, "-"))}-map.jpg" data-save-addr="${e(store.roadKo)}" data-save-tel="${e(store.telDisplay)}" data-save-saving="${e(T.saving)}" data-save-hint="${e(T.saveHint)}" data-save-label="${e(T.save)}" data-save-qr="images/qr/map-${lang}.png" data-save-url="cheongwoohaejang.com">
  ${svg}
  <figcaption class="sketch-cap"><span>${e(T.title)}</span><span><button type="button" class="printbtn" data-open-sketch>${e(T.title)} +</button> <button type="button" class="printbtn sketch-save" data-save-sketch data-track="directions" data-track-label="sketch-save">${e(T.save)}</button></span></figcaption>
</figure>`;
  // 모달은 <body> 끝에 따로 붙입니다 — 섹션 안에 두면 .rv 의 transform 때문에
  // position:fixed 가 화면이 아니라 섹션 기준이 되어 안 보입니다.
  const modal = `
<div class="sketch-modal" id="sketch-modal" role="dialog" aria-modal="true" aria-label="${e(T.title)}" hidden>
  <div class="sketch-modal-box">${svg}<button type="button" class="sketch-close sketch-save-modal" data-save-sketch data-track="directions" data-track-label="sketch-save-modal">${e(T.save)}</button><button type="button" class="sketch-close" data-close-sketch>${e(T.close)}</button></div>
</div>`;
  return { figure, modal };
}

/* ------------------------------ 부분 조각들 ------------------------------ */
/* 홈 상단 한 줄 공지 (src/store.mjs 의 notice) — 히어로 글머리 위에 얇게 얹습니다.
   기한(until)이 지나면
     · 빌드 시점: 아예 안 넣고
     · 브라우저: 바로 뒤 인라인 스크립트가 화면을 그리기 전에 DOM 에서 지웁니다.
       재빌드 없이도 그 시각부터 안 보이고, 통째로 빠지므로 빈 자리·뒤늦은 밀림이 없습니다.
       (assets/site.js 가 data-until 을 한 번 더 확인합니다 — 이중 장치)
   until 을 잘못 적어 날짜로 못 읽으면 공지를 내지 않습니다(영영 남는 쪽보다 안전). */
function noticeLine(lang) {
  if (!notice || !notice.lead || !notice.lead[lang]) return '';
  const until = Date.parse(notice.until);
  if (!(until > BUILD_NOW)) return '';
  const rest = notice.rest && notice.rest[lang];
  return `<p class="notice" id="notice" data-notice="${esc(notice.id)}" data-until="${esc(notice.until)}"><strong>${esc(notice.lead[lang])}</strong>${rest ? ` · <span>${esc(rest)}</span>` : ''}</p>
    <script>(function(n,s){if(n&&Date.now()>=${until}){n.parentNode.removeChild(n);if(s)s.parentNode.removeChild(s)}})(document.getElementById('notice'),document.currentScript)</script>`;
}

/* 첫 화면 기본 정보 한 줄 — 영업시간·거리·포장·평점. 공지(notice)가 내려가도 늘 남습니다.
   (2026-09-27 점검: 추석 공지가 빠지면 첫 화면에 영업시간·거리·평점이 하나도 없었음) */
function heroFacts(lang) {
  const h = store.hours;
  const hh = (x) => x.slice(0, 2).replace(/^0/, '');
  const brk = hasBreak;
  const naver = `<a href="${NAVER_REVIEW}" target="_blank" rel="noopener" data-track="naverplace" data-track-label="home-hero">`;
  const google = `<a href="${links.googlePlace}" target="_blank" rel="noopener" data-track="googleplace" data-track-label="home-hero">`;
  const items = {
    ko: [
      `매일 ${h.open}–${h.close}${brk ? ` · 브레이크 ${hh(h.breakStart)}–${hh(h.breakEnd)}시` : ''}`,
      '반월당역 15번 출구 도보 약 7분',
      '포장 가능',
      `${naver}네이버 ★${reviewsMeta.naver.rating} · 방문자 리뷰 ${reviewsMeta.naver.countText}+</a>`,
    ],
    en: [
      `Daily ${h.open}–${h.close}${brk ? ` · break ${h.breakStart}–${h.breakEnd}` : ''}`,
      'About 7 min walk from Banwoldang Stn. Exit 15',
      'Takeaway available',
      `${google}Google ★${reviewsMeta.rating} · ${reviewsMeta.count} reviews</a>`,
    ],
    ja: [
      `毎日 ${h.open}〜${h.close}${brk ? `・休憩 ${h.breakStart}〜${h.breakEnd}` : ''}`,
      '半月堂駅15番出口から徒歩約7分',
      'テイクアウト可',
      `${google}Google ★${reviewsMeta.rating}・クチコミ${reviewsMeta.count}件</a>`,
    ],
    zh: [
      `每天 ${h.open}–${h.close}${brk ? ` · ${h.breakStart}–${h.breakEnd} 休息` : ''}`,
      '半月堂站15号出口步行约7分钟',
      '可外带',
      `${google}Google ★${reviewsMeta.rating} · ${reviewsMeta.count} 条评价</a>`,
    ],
    tw: [
      `每天 ${h.open}–${h.close}${brk ? ` · ${h.breakStart}–${h.breakEnd} 休息` : ''}`,
      '半月堂站 15 號出口步行約 7 分鐘',
      '可外帶',
      `${google}Google ★${reviewsMeta.rating} · ${reviewsMeta.count} 則評論</a>`,
    ],
  }[lang];
  return `<ul class="hero-facts">${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
}

/* 포장 광고(utm_campaign 에 takeout)로 들어온 손님에게만 보이는 포장 안내 — site.js 가 hidden 을 풉니다.
   (2026-09-27 점검: 포장 릴스 광고가 홈으로 오는데 「포장」이 모바일 10화면 아래에 처음 나왔음) */
function takeoutHint(lang) {
  if (lang !== 'ko') return '';
  return `<p class="notice takeout-hint" id="takeout-hint" hidden><strong>포장 주문</strong> · <a href="tel:${store.telHref}" data-track="call" data-track-label="takeout-hint">${esc(store.telDisplay)} 전화로 미리 주문</a> · <a href="daegu-takeout.html" data-track="guide" data-track-label="takeout-hint">포장 메뉴·가격 보기</a></p>`;
}

/* 제목용 명조체(Noto Serif KR)는 제목에 쓰인 글자만 받습니다 (Google Fonts text= 서브셋).
   전체 글꼴을 부르면 휴대폰 첫 방문에 파일 17개·약 720KB 를 받았음 → 1개·수십 KB.
   명조가 쓰이는 곳: 홈은 .brand·h1·h2·h3·.tel-big·.foot-brand·.course-title·약도/예약 워터마크,
   가이드는 h1·h2. 제목 글자를 바꾸면 빌드만 다시 돌리면 됩니다 (가이드 정적 페이지도 같이 갱신). */
const SERIF_HREF_RE = /https:\/\/fonts\.googleapis\.com\/css2\?family=Noto\+Serif\+(KR|JP|TC|SC)[^"]*/g;
const decodeEnt = (x) => x.replace(/&(amp|lt|gt|quot|#39|nbsp|middot);/g, (m, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ', middot: '·' }[e]))
  .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d)).replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)));
function serifSubset(html) {
  if (!SERIF_HREF_RE.test(html)) return html;
  SERIF_HREF_RE.lastIndex = 0;
  const texts = ['靑友解酲'];
  // data-titles 속 <br> 때문에 태그 끝을 잘못 잡지 않도록 속성을 빼고 훑습니다 (문구는 아래에서 따로 넣음)
  const bare = html.replace(/data-titles='[^']*'/g, '');
  for (const m of bare.matchAll(/<(h[1-3])\b[^>]*>([\s\S]*?)<\/\1>/g)) texts.push(m[2]);
  for (const m of bare.matchAll(/<(\w+)\b[^>]*class="[^"]*\b(brand|foot-brand|tel-big|course-title)\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/g)) texts.push(m[3]);
  for (const m of html.matchAll(/data-titles='([^']*)'/g)) {
    try { const d = JSON.parse(m[1]); texts.push(...[].concat(d.a || [], d.s || [], d.w || [], Array.isArray(d) ? d : [])); } catch { /* 무시 */ }
  }
  const chars = new Set();
  for (const t of texts) for (const ch of decodeEnt(t.replace(/<[^>]+>/g, ''))) if (!/\s/.test(ch)) chars.add(ch);
  const text = [...chars].sort().join('');
  const q = encodeURIComponent(text).replace(/'/g, '%27');
  return html.replace(SERIF_HREF_RE, (u, fam) => {
    // text= 는 URL 안의 모든 글꼴에 걸리므로, 다른 글꼴이 같이 묶여 있으면 건드리지 않습니다 (따로 <link> 로 분리할 것)
    if ((u.match(/family=/g) || []).length > 1) { console.warn(`  ! 명조 링크에 다른 글꼴이 같이 있어 서브셋을 건너뜀: ${u.slice(0, 90)}`); return u; }
    return `https://fonts.googleapis.com/css2?family=Noto+Serif+${fam}:wght@400;500;600&text=${q}&display=swap`.replace(/&/g, '&amp;');
  });
}

const hrefOf = (f) => (f === 'index.html' ? './' : f);
const langSwitcher = (lang, cls) => site.langs.map((l) =>
  `<a href="${hrefOf(site.file[l])}" hreflang="${site.hreflang[l]}" lang="${site.hreflang[l]}"${l === lang ? ' class="on" aria-current="true"' : ''} data-track="language" data-track-label="${l}">${{ ko: 'KO', en: 'EN', ja: 'JA', zh: '简', tw: '繁' }[l]}</a>`
).join('');

const TENMI = new Set(['spicy', 'ribs']);   // 대구 10미: 따로국밥·찜갈비
const TENMI_WORD = { ko: '대구 10미', en: 'Daegu 10-mi', ja: '大邱十味', zh: '大邱十味', tw: '大邱十味' };

const MENU_PAGE_KO = {
  galbitang: ['daegu-galbitang.html', '대구 갈비탕 이야기'],
  kalguksu: ['daegu-kalguksu.html', '대구 장칼국수 이야기'],
  ribs: ['daegu-jjimgalbi.html', '대구 찜갈비 이야기'],
  spicy: ['daegu-ttarogukbap.html', '대구 따로국밥 이야기'],
  clear: ['daegu-haejangguk.html', '대구 해장국 이야기'],
};

// 여름 메뉴(냉면)가 시즌 종료면 히어로의 여름 문구도 끕니다.
const SUMMER_ON = !(menu.find((m) => m.id === 'naengmyeon') || {}).offSeason;

// 네이버 플레이스 방문자 리뷰 탭 (모바일·PC 모두 열림)
const NAVER_REVIEW = `https://m.place.naver.com/restaurant/${store.naverPlaceId}/review/visitor`;

function menuRows(lang) {
  const L = t[lang], names = menuNames[lang];
  const seasonalWords = {
    // 장칼국수 — 9월 중순부터 판매 (2026-09-19 사장님 확인). 「겨울 한정」이면 지금 안 파는 걸로 읽힘
    winter: { ko: '가을·겨울', en: 'Autumn–winter', ja: '秋冬限定', zh: '秋冬限定', tw: '秋冬限定' },
    summer: { ko: '여름 한정', en: 'Summer only', ja: '夏季限定', zh: '夏季限定', tw: '夏季限定' },
  };
  return menu.filter((m) => !m.offSeason).map((m) => `
      <div class="mrow rv${m.img ? ' has-img' : ''}">
        ${m.img ? `<div class="mimg">${picture(m.img, names[m.id].n, {
          w: 640, h: 640,
          sizes: '(max-width: 700px) 30vw, 140px',
          attrs: 'loading="lazy" decoding="async"',
        })}</div>` : ''}
        <h3>${esc(names[m.id].n)}${TENMI.has(m.id) ? `<span class="tag tag-tenmi">${TENMI_WORD[lang]}</span>` : ''}${m.signature ? `<span class="tag">${esc(L.menuSignature)}</span>` : ''}${m.seasonal ? `<span class="tag tag-season tag-${m.seasonal}">${esc(seasonalWords[m.seasonal][lang])}</span>` : ''}</h3>
        <span class="price${m.price ? '' : ' ask'}">${m.price ? esc(money(m.price, lang)) : esc(L.menuAsk)}</span>
        <p>${esc(names[m.id].d)}${lang === 'ko' && MENU_PAGE_KO[m.id] ? ` <a class="mmore" href="${MENU_PAGE_KO[m.id][0]}" data-track="guide" data-track-label="home-menu-${MENU_PAGE_KO[m.id][0].replace('.html', '')}">${MENU_PAGE_KO[m.id][1]} →</a>` : ''}</p>
      </div>`).join('');
}


/* 메뉴별 이야기 카드 — 콘텐츠 SEO 페이지로 가는 내부 링크. 언어별로 있는 페이지만. */
const GUIDE_CARDS = {
  ko: { title: '메뉴별 이야기', lede: '어떤 국물인지, 누구와 오면 좋은지 — 메뉴마다 따로 적었습니다.', cards: [
    ['daegu-galbitang.html', 'images/food-galbitang.jpg', '대구 갈비탕 맛집', '하루 종일 고아 낸 국물에 부드러운 갈비. 어르신 모시기 좋은 대표 메뉴.'],
    ['daegu-jjimgalbi.html', 'images/food-ribs.jpg', '대구 찜갈비·갈비찜 맛집', '마늘을 산처럼 올린 소갈비찜 마늘폭탄 — 대구 10미 찜갈비의 매운맛.'],
    ['daegu-haejangguk.html', 'images/food-clear.jpg', '대구 해장국 맛집', '맑은 국물과 얼큰한 국물, 같은 솥에서 두 갈래로. 매일 11시, 반월당 약전골목에서.'],
    ['daegu-ttarogukbap.html', 'images/food-spicy.jpg', '대구 따로국밥', '1929년 대구탕반의 계보를 잇는 대구 10미 — 밥은 따로, 대구식으로.'],
    ['daegu-kalguksu.html', 'images/food-kalguksu.jpg', '대구 장칼국수', '소고기 국물에 된장을 풀어 얼큰하게. 가을·겨울 계절 칼국수.'],
    ['daegu-suyuk.html', 'images/food-jeongol.jpg', '대구 수육 맛집', '결 좋은 아롱사태를 삶아 얇게 저며. 수육·전골·냉채, 술자리와 어르신 상.'],
    ['daegu-oxtail.html', 'images/food-oxtail.jpg', '대구 소꼬리찜', '상 한가운데 놓는 메뉴. 가족 모임·회식 한 상 짜기.'],
    ['daegu-yukhoe.html', 'images/food-yukhoe.jpg', '육회비빔밥', '숙성 간장으로 비빈 담백한 육회. 국물집의 또 다른 얼굴.'],
    ['daegu-10mi.html', 'images/food-spicy.jpg', '대구 10미 안내', '열 가지 음식과 먹는 동네. 그중 따로국밥·대구식 찜갈비 두 가지를 약전골목에서 냅니다.'],
    ['daegu-dongseongno.html', 'images/cheongwoo-01.jpg', '동성로 맛집', '동성로 중심에서 도보 약 15분, 약전골목 소고기 국물 밥집. 놀고 나서·해장·부모님 모시고.'],
    ['daegu-modern-alley.html', 'images/hood-gate.jpg', '대구 근대골목 2코스', '청라언덕→계산성당→약령시→진골목, 순서대로. 코스 한가운데가 약전골목입니다.'],
    ['daegu-family.html', 'images/cheongwoo-01.jpg', '대구 가족외식·부모님 생신', '맵지 않은 소갈비탕과 얼큰한 국을 한 상에. 40석, 단체 40명까지 전화 예약.'],
    ['daegu-dongdaegu.html', 'images/food-galbitang.jpg', '동대구역에서 오는 길', '1호선 5정거장, 환승 없이 반월당. 기차 시간에 맞춰 밥 먹는 법.'],
  ] },
  en: { title: 'Stories by dish', lede: 'What is in the bowl, and who it suits — written dish by dish.', cards: [
    ['daegu-beef-soup-en.html', 'images/food-spicy.jpg', 'Ttaro Gukbap & Beef Soup in Daegu', 'Daegu’s signature spicy beef soup, one of the city’s 10 delicacies — about 7 min on foot from Banwoldang Station.'],
    ['daegu-food-tour-en.html', 'images/hood-gate.jpg', 'Daegu Day Trip Food Walk', 'A half-day route from Banwoldang to Seomun Market, planned around where to eat.'],
  ] },
  ja: { title: 'メニューの話', lede: 'どんなスープか、誰と来るとよいか — 一品ずつ。', cards: [
    ['daegu-banwoldang-food-ja.html', 'images/food-galbitang.jpg', '大邱・半月堂グルメ', '薬令市の路地で牛肉スープとカルビタン。半月堂駅から徒歩約7分。'],
    ['daegu-food-tour-ja.html', 'images/hood-gate.jpg', '大邱観光モデルコース', '半月堂→薬令市→西門市場、徒歩半日のグルメさんぽ。'],
  ] },
  zh: { title: '菜品故事', lede: '是什么汤、适合和谁来 — 一道一道写。', cards: [
    ['daegu-banwoldang-food-tw.html', 'images/food-galbitang.jpg', '大邱半月堂美食', '药令市巷子里的牛肉汤与牛排骨汤，半月堂站步行约 7 分钟。'],
    ['daegu-food-tour-tw.html', 'images/hood-gate.jpg', '大邱一日游美食路线', '半月堂→药令市→西门市场，徒步半日。'],
  ] },
  tw: { title: '菜色故事', lede: '是什麼湯、適合和誰來 — 一道一道寫。', cards: [
    ['daegu-banwoldang-food-tw.html', 'images/food-galbitang.jpg', '大邱半月堂美食', '藥令市巷弄裡的牛肉湯與牛排骨湯，半月堂站步行約 7 分鐘。'],
    ['daegu-food-tour-tw.html', 'images/hood-gate.jpg', '大邱一日遊美食路線', '半月堂→藥令市→西門市場，徒步半日。'],
  ] },
};
/* 긴 섹션 접기 라벨 — 글은 HTML 에 그대로 남아 검색엔진은 전부 읽고, 손님 화면만 짧아집니다. */
const FOLD = {
  guides: { ko: (n) => `메뉴·동네 이야기 ${n}편 펼쳐 보기`, en: (n) => `Show all ${n} guides`, ja: (n) => `ガイド${n}件を開く`, zh: (n) => `展开全部 ${n} 篇`, tw: (n) => `展開全部 ${n} 篇` },
  hood: { ko: '옛 사진과 근대골목 코스 펼쳐 보기', en: 'Show old photos & walking course', ja: '古写真と散策コースを開く', zh: '展开老照片与步行路线', tw: '展開老照片與步行路線' },
};
function guidesSection(lang) {
  const G = GUIDE_CARDS[lang];
  if (!G || !G.cards.length) return '';
  return `<section class="section" id="guides">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">${esc(G.title)}</span>
      <h2>${esc(G.title)}</h2>
      <p>${esc(G.lede)}</p>
    </div>
    <details class="fold rv">
      <summary>${esc(FOLD.guides[lang](G.cards.length))}</summary>
      <div class="guide-grid">
      ${G.cards.map(([href, src, title, blurb]) => `<a class="guide-card" href="${href}" data-track="guide" data-track-label="home-guide-${href.replace('.html', '')}"><div class="gimg">${picture(src, title, { w: 640, h: 480, sizes: '(max-width: 640px) 100vw, 33vw', attrs: 'loading="lazy" decoding="async"' })}</div><h3>${esc(title)}</h3><p>${esc(blurb)}</p></a>`).join('\n      ')}
      </div>
    </details>
  </div>
</section>`;
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
  // 실제 칸 너비: 860px 이하 2열, 1024px 이하 3열, 그 위 4열 (wide 는 2칸)
  const sizesFor = (sh) => (sh === 'wide'
    ? '(max-width: 860px) 100vw, (max-width: 1024px) 67vw, 50vw'
    : '(max-width: 860px) 50vw, (max-width: 1024px) 34vw, 25vw');
  return gallery.map((g, i) => `
        <figure class="${shape[i]}">
          ${picture(g.src, alts[g.key], {
            w: g.w, h: g.h,
            sizes: sizesFor(shape[i]),
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

      <details class="fold rv">
      <summary>${esc(FOLD.hood[lang])}</summary>
      <div class="archive">
        <h3 class="course-title">${esc(H.archiveTitle)}</h3>
        <p class="archive-lede">${esc(H.archiveLede)}</p>
        <div class="archive-grid">
          ${hoodImages.map((im) => `<figure class="archive-item${im.key === 'map1930' ? ' wide' : ''}">
            ${picture(im.src, H.archive[im.key], { w: im.w, h: im.h, sizes: '(max-width: 700px) 100vw, 50vw', attrs: 'loading="lazy" decoding="async"' })}
            <figcaption><span>${esc(H.archive[im.key])}</span><small>${esc(im.credit)}</small></figcaption>
          </figure>`).join('\n          ')}
        </div>
      </div>

      <div class="course">
        <h3 class="course-title">${esc(H.courseTitle)}</h3>
        <ul class="course-list">
          ${spots.map((s) => `<li><span class="c-min">${s.min}′</span><span class="c-body"><strong>${esc(H.spots[s.key].n)}</strong><em>${esc(H.spots[s.key].d)}</em></span></li>`).join('\n          ')}
        </ul>
        <p class="menu-note">${esc(H.courseNote)}</p>
      </div>
      </details>
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
${site.fbDomainVerification ? `<meta name="facebook-domain-verification" content="${site.fbDomainVerification}" />` : ''}
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

<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600&display=swap" />
<link rel="stylesheet" href="assets/site.css?v=${ASSET_V}" />
<link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32.png" />
<link rel="icon" type="image/png" sizes="192x192" href="images/logo-icon-192.png" />
<link rel="apple-touch-icon" href="images/apple-touch-icon.png" />

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
    <a class="brand" href="${hrefOf(file)}"><span>${esc(store.nameKo)}</span><span class="hanja">${esc(store.nameHanja)}</span></a>
    <nav class="gnb" id="gnb" aria-label="${esc(L.nav.menu)}">
      <a href="#menu">${esc(L.nav.menu)}</a>
      <a href="#visit">${esc(L.nav.visit)}</a>
      <a href="#reviews">${esc(reviewsMeta.t[lang].kicker)}</a>
      <a href="#gallery">${esc(L.nav.gallery)}</a>
      <a href="#story">${esc(L.nav.story)}</a>
      <a href="#hood">${esc(L.nav.hood)}</a>
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
    ${noticeLine(lang)}
    ${heroFacts(lang)}
    ${takeoutHint(lang)}
    <span class="eyebrow">${esc(L.heroBadge)}</span>
    <h1 id="hero-title" data-titles='${JSON.stringify({ a: L.heroTitles || [L.heroTitle], s: SUMMER_ON ? (L.heroTitlesSummer || []) : [], w: L.heroTitlesWinter || [] })}'>${(L.heroTitles || [L.heroTitle])[0]}</h1>
    <p class="hero-lede">${SUMMER_ON && L.heroLedeSummer ? L.heroLedeSummer : L.heroLede}</p>
    ${L.heroNote ? `<p class="hero-note">${L.heroNote}</p>` : ''}
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
        data-hours="${store.hours.open},${store.hours.breakStart || ''},${store.hours.breakEnd || ''},${store.hours.close},${store.hours.lastOrder || ''}"
        data-lastorder="${lang === 'ko' ? '주문 마감' : lang === 'ja' ? 'ラストオーダー終了' : lang === 'zh' ? '已停止点餐' : lang === 'tw' ? '已停止點餐' : 'Last orders taken'}"
        data-open="${lang === 'ko' ? '영업 중' : lang === 'ja' ? '営業中' : lang === 'zh' ? '营业中' : lang === 'tw' ? '營業中' : 'Open now'}"
        data-break="${lang === 'ko' ? '브레이크타임' : lang === 'ja' ? '休憩中' : lang === 'zh' ? '休息中' : lang === 'tw' ? '休息中' : 'On break'}"
        data-before="${lang === 'ko' ? '영업 전' : lang === 'ja' ? '開店前' : lang === 'zh' ? '尚未营业' : lang === 'tw' ? '尚未營業' : 'Opens ' + store.hours.open}"
        data-closed="${lang === 'ko' ? '영업 종료' : lang === 'ja' ? '営業終了' : lang === 'zh' ? '已打烊' : lang === 'tw' ? '已打烊' : 'Closed'}"></span></p>
      <small>${esc(L.quickBreak)}</small>
    </div>
    <div class="quick">
      <h3>${esc(L.quickAddr)}</h3>
      <p><a href="${links.naverPlace}" target="_blank" rel="noopener" data-track="directions" data-track-label="quickbar-address">${esc(lang === 'ko' ? store.roadKo : store.roadEn)}</a></p>
      <small>${esc(lang === 'ko' ? '약전골목 · 반월당역 15번 출구 도보 약 7분' : 'Yakjeon-golmok · about 7 min on foot from Banwoldang Stn.')}</small>
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

${L.why ? `<!-- ================= 이래서 (USP) ================= -->
<section class="section why-sec" id="why">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">${esc(L.whyKicker)}</span>
      <h2>${esc(L.whyTitle)}</h2>
    </div>
    <div class="why-grid">
      ${L.why.map((w) => `<article class="why-card rv"><h3>${esc(w.h)}</h3><p>${esc(w.p)}</p>${w.line ? `<p class="why-line">${w.line}</p>` : ''}</article>`).join('\n      ')}
    </div>
    ${L.whyProof ? `<p class="why-proof rv">${esc(L.whyProof)}</p>` : ''}
  </div>
</section>

` : ''}<!-- ================= 메뉴 ================= -->
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
    ${lang === 'ko' && news.length ? `<p class="news-strip rv"><a class="ns-head" href="news.html" data-track="guide" data-track-label="home-news">소식</a>${news.slice(0, 2).map((n) => `<a href="news-${n.slug}.html" data-track="guide" data-track-label="home-news-${n.slug}"><time datetime="${n.date}">${+n.date.slice(5, 7)}/${+n.date.slice(8, 10)}</time> ${esc(n.title)}</a>`).join('')}</p>` : ''}
  </div>
</section>

<!-- ================= 약도 (메뉴 바로 아래, 오시는 길 위) ================= -->
<section class="section sketch-sec" id="sketch-sec">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">${esc(L.nav.visit)}</span>
      <h2>${esc(L.heroCtaMap)}</h2>
    </div>
    <div class="rv">${sketchMap(lang).figure}</div>
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
          <p class="big">${esc(lang === 'ko' ? `${store.roadKo} 1층` : `1F, ${store.roadEn}`)}</p>
          ${lang === 'ko' ? '' : `<p>${esc(store.roadKo)}</p>`}
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

<!-- ================= 손님 후기 ================= -->
<section class="section" id="reviews">
  <div class="container">
    <div class="sec-head rv">
      <span class="sec-kicker">${esc(reviewsMeta.t[lang].kicker)}</span>
      <h2>${esc(reviewsMeta.t[lang].title)}</h2>
      ${lang === 'ko'
        ? `<p class="review-badge"><span class="stars" aria-hidden="true">★★★★★</span> 네이버 <strong>${reviewsMeta.naver.rating}</strong> / 5 · <a href="${NAVER_REVIEW}" target="_blank" rel="noopener" data-track="naverplace" data-track-label="home-reviews">네이버 방문자 리뷰 ${reviewsMeta.naver.countText}개 넘게 보기</a> · <a href="${links.googlePlace}" target="_blank" rel="noopener" data-track="googleplace" data-track-label="reviews-google">Google 리뷰 (${reviewsMeta.count})</a></p>`
        : `<p class="review-badge"><span class="stars" aria-hidden="true">★★★★★</span> <strong>${reviewsMeta.rating}</strong> / 5 · <a href="${links.googlePlace}" target="_blank" rel="noopener" data-track="googleplace" data-track-label="reviews-google">${esc(reviewsMeta.t[lang].link)} (${reviewsMeta.count})</a></p>`}
    </div>
    <div class="review-grid rv">
      ${reviews.map((r) => `<blockquote class="review-card">
        <p>“${esc(r[lang])}”</p>
        <footer>— ${esc(r.author)} · Google</footer>
      </blockquote>`).join('\n      ')}
    </div>
    <p class="review-cta rv" style="text-align:center;margin-top:1.6rem"><a class="btn btn-primary" href="${links.googlePlace}" target="_blank" rel="noopener" data-track="reviewintent" data-track-label="write-review">${esc({ ko: '구글 리뷰 남기기', en: 'Write a Google review', ja: 'Googleレビューを書く', zh: '撰写谷歌评价', tw: '撰寫 Google 評論' }[lang])}</a></p>
  </div>
</section>

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

<!-- ================= 메뉴별 이야기 (콘텐츠 페이지 카드) ================= -->
${guidesSection(lang)}

<!-- ================= 약전골목 이야기 ================= -->
${hoodSection(lang)}

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
        ${lang === 'ko' ? `<a href="daegu-food-tour.html" data-track="guide" data-track-label="footer-guide">대구 여행 가이드</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-galbitang.html" data-track="guide" data-track-label="footer-galbitang">대구 갈비탕 맛집</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-jjimgalbi.html" data-track="guide" data-track-label="footer-jjimgalbi">대구 갈비찜 맛집</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-haejangguk.html" data-track="guide" data-track-label="footer-haejangguk">대구 해장국 맛집</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-ttarogukbap.html" data-track="guide" data-track-label="footer-ttaro">대구 따로국밥 맛집</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-suyuk.html" data-track="guide" data-track-label="footer-suyuk">대구 수육 맛집</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-kalguksu.html" data-track="guide" data-track-label="footer-kalguksu">대구 장칼국수</a>` : ''}
        ${lang === 'ko' ? `<a href="news.html" data-track="guide" data-track-label="footer-news">소식</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-takeout.html" data-track="guide" data-track-label="footer-takeout">대구 포장맛집</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-oxtail.html" data-track="guide" data-track-label="footer-oxtail">대구 소꼬리찜</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-banwoldang.html" data-track="guide" data-track-label="footer-banwoldang">반월당 맛집</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-gukbap.html" data-track="guide" data-track-label="footer-gukbap">대구 국밥 맛집</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-hansik.html" data-track="guide" data-track-label="footer-hansik">대구 한식당</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-dongseongno.html" data-track="guide" data-track-label="footer-dongseongno">동성로 맛집</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-yukhoe.html" data-track="guide" data-track-label="footer-yukhoe">육회비빔밥</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-attractions.html" data-track="guide" data-track-label="footer-attractions">대구 가볼만한 곳</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-modern-alley.html" data-track="guide" data-track-label="footer-alley">대구 근대골목</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-family.html" data-track="guide" data-track-label="footer-family">대구 가족외식</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-dongdaegu.html" data-track="guide" data-track-label="footer-dongdaegu">동대구역에서 오는 길</a>` : ''}
        ${lang === 'ko' ? `<a href="daegu-10mi.html" data-track="guide" data-track-label="footer-10mi">대구 10미</a>` : ''}
        ${lang === 'tw' ? `<a href="daegu-banwoldang-food-tw.html" data-track="guide" data-track-label="footer-banwoldang">大邱半月堂美食</a>` : ''}
        ${lang === 'tw' ? `<a href="daegu-food-tour-tw.html" data-track="guide" data-track-label="footer-guide">大邱一日遊指南</a>` : ''}
        ${lang === 'en' ? `<a href="daegu-beef-soup-en.html" data-track="guide" data-track-label="footer-beefsoup">Ttaro Gukbap &amp; Beef Soup in Daegu</a>` : ''}
        ${lang === 'en' ? `<a href="daegu-food-tour-en.html" data-track="guide" data-track-label="footer-guide">Daegu Day Trip Guide</a>` : ''}
        ${lang === 'ja' ? `<a href="daegu-banwoldang-food-ja.html" data-track="guide" data-track-label="footer-banwoldang">大邱 半月堂グルメ</a>` : ''}
        ${lang === 'ja' ? `<a href="daegu-food-tour-ja.html" data-track="guide" data-track-label="footer-guide">大邱観光モデルコース</a>` : ''}
      </nav>
    </div>
    <div class="foot-bottom">
      <span>${esc(L.footerBiz)}</span>
      <span><a href="${site.parentUrl}" target="_blank" rel="noopener">${esc(L.footerCredit)}</a></span>
      <span>${esc(L.footerRights)}</span>
    </div>
  </div>
</footer>

<!-- 모바일 하단 고정 액션 — 손님이 자주 누르는 두 가지만 둡니다 -->
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


/* ============================== 소식 게시판 ==============================
   src/news.mjs 의 글로 news.html(목록)과 news-<slug>.html(글)을 만듭니다. 모양은 가이드 페이지와 같게
   daegu-galbitang.html 의 <style>·하단 고정 바를 그대로 빌려 씁니다. */
function newsPages() {
  const tpl = readFileSync(join(HERE, 'daegu-galbitang.html'), 'utf8');
  const style = tpl.slice(tpl.indexOf('<style>'), tpl.indexOf('</style>') + 8)
    .replace('</style>', '  .nlist{list-style:none;padding:0}\n  .nlist li{border-bottom:1px solid var(--line);padding:16px 0;margin:0}\n  .nlist time,.ndate{display:block;font-size:.82rem;color:var(--sub);margin-bottom:4px}\n  .nlist a.t{font-weight:700;font-size:1.05rem;text-decoration:none;color:var(--ink)}\n  .nlist p{margin:6px 0 0;color:var(--sub);font-size:.92rem}\n</style>');
  const mbarOf = (label) => { const i = tpl.indexOf('<div class="mbar">'); return tpl.slice(i, tpl.indexOf('</body>', i)).trim().replace(/galbitang-bar/g, label); };
  const kdate = (d) => `${d.slice(0, 4)}년 ${+d.slice(5, 7)}월 ${+d.slice(8, 10)}일`;
  const shell = ({ title, desc, url, ogImage, jsonld, main, label }) => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${imgAbs(ogImage || 'images/food-galbitang.jpg')}" />
<meta property="og:locale" content="ko_KR" />
<link rel="alternate" type="application/rss+xml" title="청우해장 소식" href="${site.baseUrl}rss.xml" />
<link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32.png" />
<link rel="apple-touch-icon" href="images/apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600&amp;display=swap" />
<script src="assets/config.js?v=${ASSET_V}"></script>
<script src="assets/tracking.js?v=${ASSET_V}"></script>
${style}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<header class="top">
  <div class="top-in">
    <a class="brand" href="/">청우해장<span class="hanja">靑友解酲</span></a>
    <a class="cta" href="tel:${store.telHref}" data-track="call" data-track-label="${label}-top">전화 예약</a>
  </div>
</header>
<main>
${main}
</main>
<footer>
  <a href="/" data-track="guide" data-track-label="${label}-foot">청우해장 홈</a> · <a href="news.html" data-track="guide" data-track-label="${label}-foot">소식</a> · <a href="/#menu">메뉴</a> · <a href="/#visit">오시는 길</a>
  <p style="margin-top:10px">© 청우해장 靑友解酲 · 대구 중구 남성로 11</p>
</footer>
${mbarOf(label + '-bar')}
</body>
</html>
`;
  const out = [];
  const listUrl = `${site.baseUrl}news.html`;
  out.push(['news.html', shell({
    title: '청우해장 소식 — 계절 메뉴·영업 안내 | 대구 약전골목',
    desc: '청우해장 소식 게시판. 계절 메뉴 시작과 종료, 명절 영업, 가격 변경을 날짜순으로 알려 드립니다.',
    url: listUrl, ogImage: 'images/food-galbitang.jpg', label: 'news',
    jsonld: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'CollectionPage', '@id': `${listUrl}#page`, name: '청우해장 소식', url: listUrl, inLanguage: 'ko',
        hasPart: news.map((n) => ({ '@type': 'Article', headline: n.title, url: `${site.baseUrl}news-${n.slug}.html`, datePublished: n.date })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: '청우해장', item: site.baseUrl },
        { '@type': 'ListItem', position: 2, name: '소식', item: listUrl }] }] },
    main: `  <nav class="crumb"><a href="/">홈</a> › 소식</nav>
  <h1>청우해장 소식</h1>
  <p class="lede">계절 메뉴 시작과 종료, 명절 영업, 가격 변경처럼 가게에 실제로 바뀐 일이 있을 때만 적습니다.</p>
  <ul class="nlist">
${news.map((n) => `    <li><time datetime="${n.date}">${kdate(n.date)}</time><a class="t" href="news-${n.slug}.html" data-track="guide" data-track-label="news-list">${esc(n.title)}</a><p>${esc(n.summary)}</p></li>`).join('\n')}
  </ul>`,
  })]);
  for (const n of news) {
    const url = `${site.baseUrl}news-${n.slug}.html`;
    out.push([`news-${n.slug}.html`, shell({
      title: `${n.title} | 청우해장 소식`, desc: n.summary, url, ogImage: n.image || 'images/food-galbitang.jpg', label: `news-${n.slug}`,
      jsonld: { '@context': 'https://schema.org', '@graph': [
        { '@type': 'Article', '@id': `${url}#article`, headline: n.title, description: n.summary, datePublished: n.date, dateModified: n.date,
          image: imgAbs(n.image || 'images/food-galbitang.jpg'), inLanguage: 'ko', mainEntityOfPage: url,
          author: { '@type': 'Organization', name: store.nameKo, url: site.baseUrl },
          publisher: { '@type': 'Organization', name: store.nameKo, logo: { '@type': 'ImageObject', url: imgAbs('images/logo.png') } } },
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: '청우해장', item: site.baseUrl },
          { '@type': 'ListItem', position: 2, name: '소식', item: listUrl },
          { '@type': 'ListItem', position: 3, name: n.title, item: url }] }] },
      main: `  <nav class="crumb"><a href="/">홈</a> › <a href="news.html">소식</a> › ${esc(n.title)}</nav>
  <h1>${esc(n.title)}</h1>
  <p class="ndate"><time datetime="${n.date}">${kdate(n.date)}</time> · 청우해장</p>
${n.image ? `  <figure>${picture(n.image, n.title, { w: 1024, h: 1536, sizes: '(max-width: 800px) 100vw, 720px', attrs: 'loading="eager" decoding="async"' })}</figure>\n` : ''}  ${n.body}
  <p style="margin-top:28px"><a href="news.html" data-track="guide" data-track-label="news-back">← 소식 목록</a></p>`,
    })]);
  }
  return out;
}

/* -------------------------------- 실행 -------------------------------- */
mkdirSync(HERE, { recursive: true });
let bytes = 0;
for (const lang of site.langs) {
  const html = serifSubset(page(lang));
  const out = join(HERE, site.file[lang]);
  writeFileSync(out, html, 'utf8');
  bytes += Buffer.byteLength(html);
  console.log(`  ✓ ${site.file[lang].padEnd(11)} ${site.hreflang[lang].padEnd(8)} ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}

// 소식 게시판 (news.html + 글마다 news-<slug>.html)
for (const [f, html] of newsPages()) { writeFileSync(join(HERE, f), serifSubset(html), 'utf8'); console.log(`  ✓ ${f}`); }

// 정적 가이드 페이지(daegu-*.html)·404 는 빌드 대상이 아니지만, 명조 글꼴 링크만은 제목 글자에 맞춰 갱신합니다.
for (const f of process.env.SKIP_STATIC ? [] : readdirSync(HERE).filter((n) => /^(daegu-.*|404)\.html$/.test(n))) {
  const path = join(HERE, f);
  const before = readFileSync(path, 'utf8');
  const after = serifSubset(before);
  if (after !== before) { writeFileSync(path, after, 'utf8'); console.log(`  ✓ ${f} (명조 서브셋)`); }
}

/* 사이트맵 — 5개 언어를 서로 alternate 로 묶어 줍니다. */
// 가이드(콘텐츠 SEO) 페이지 — 손으로 만든 정적 파일이지만 사이트맵에는 여기서 등록합니다.
const GUIDES = ['daegu-kalguksu.html', 'daegu-takeout.html', 'daegu-10mi.html', 'daegu-dongdaegu.html', 'daegu-dongseongno.html', 'daegu-yukhoe.html', 'daegu-hansik.html', 'daegu-gukbap.html', 'daegu-banwoldang.html', 'daegu-oxtail.html', 'daegu-jjimgalbi.html', 'daegu-suyuk.html', 'daegu-ttarogukbap.html', 'daegu-banwoldang-food-tw.html', 'daegu-banwoldang-food-ja.html', 'daegu-beef-soup-en.html', 'daegu-galbitang.html', 'daegu-haejangguk.html', 'daegu-modern-alley.html', 'daegu-family.html', 'daegu-food-tour.html', 'daegu-food-tour-tw.html', 'daegu-food-tour-en.html', 'daegu-food-tour-ja.html', 'daegu-attractions.html'];
const today = BUILD_DAY;
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
${news.length ? `  <url>
    <loc>${site.baseUrl}news.html</loc>
    <lastmod>${news[0].date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
` : ''}${news.map((n) => `  <url>
    <loc>${site.baseUrl}news-${n.slug}.html</loc>
    <lastmod>${n.date}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
`).join('')}${GUIDES.map((g) => `  <url>
    <loc>${site.baseUrl}${g}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(HERE, 'sitemap.xml'), sitemap, 'utf8');

/* RSS — 네이버 서치어드바이저 「RSS 제출」용. 네이버 웹문서 수집은 사이트맵보다 RSS 를
   더 잘 따라오므로(2026-09-04 네이버 통합검색 사이트 섹션 강화에 대응) 사이트맵과 같은
   11개 URL 을 최신순으로 냅니다. 가이드 페이지 제목·설명은 정적 HTML 의 head 에서 읽습니다. */
const rssEsc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const headOf = (file) => {
  const h = readFileSync(join(HERE, file), 'utf8');
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || file;
  const desc = (h.match(/name="description" content="([^"]*)"/) || [])[1] || '';
  return { title: title.replace(/&amp;/g, '&'), desc: desc.replace(/&amp;/g, '&') };
};
const rssItems = [
  ...news.map((n) => ({ url: `${site.baseUrl}news-${n.slug}.html`, title: `${n.title} | 청우해장 소식`, desc: n.summary, date: n.date })),
  ...site.langs.map((lang) => ({ url: abs(site.file[lang]), title: t[lang].title, desc: strip(t[lang].description) })),
  ...GUIDES.map((g) => ({ url: site.baseUrl + g, ...headOf(g) })),
];
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${rssEsc(store.legalKo)}</title>
  <link>${site.baseUrl}</link>
  <description>${rssEsc(strip(t.ko.description))}</description>
  <language>ko</language>
  <lastBuildDate>${new Date(today).toUTCString()}</lastBuildDate>
  <atom:link href="${site.baseUrl}rss.xml" rel="self" type="application/rss+xml" />
${rssItems.map((it) => `  <item>
    <title>${rssEsc(it.title)}</title>
    <link>${it.url}</link>
    <guid isPermaLink="true">${it.url}</guid>
    <description>${rssEsc(it.desc)}</description>
    <pubDate>${new Date(it.date ? `${it.date}T09:00:00+09:00` : today).toUTCString()}</pubDate>
  </item>`).join('\n')}
</channel>
</rss>
`;
writeFileSync(join(HERE, 'rss.xml'), rss, 'utf8');
console.log(`  ✓ rss.xml     (${rssItems.length} items)`);

/* robots.txt
   자체 도메인을 쓰면 이 파일이 도메인 최상단에 놓여 검색엔진이 실제로 읽습니다.
   (위코 하위 경로에 있을 때는 /weco/robots.txt 라 무시됐습니다.)
   운영 문서(*.md)·src/·build.mjs·tools/ 는 deploy.yml 의 rsync 에서 이미 빠져 라이브에 없지만,
   혹시 올라가도 긁지 않도록 모든 그룹(* 와 AI 크롤러 각각)에 같은 Disallow 를 둡니다.
   (예전엔 파일 끝에 붙어 있어 마지막 그룹인 CCBot 에만 적용됐습니다.) */
const DISALLOW = ['/*.md$', '/src/', '/build.mjs', '/tools/'].map((p) => `Disallow: ${p}`);
const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',          // OpenAI (챗GPT 검색·브라우징)
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', // Anthropic
  'PerplexityBot', 'Perplexity-User',                  // Perplexity
  'Google-Extended',                                   // Gemini 학습
  'Applebot-Extended', 'Amazonbot', 'meta-externalagent', 'cohere-ai', 'CCBot',
];
const robots = [
  'User-agent: *',
  'Allow: /',
  ...DISALLOW,
  '',
  '# AI 검색·어시스턴트 크롤러 명시 허용 — AI 답변에 가게 정보가 인용되도록 환영합니다.',
  ...AI_CRAWLERS.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', ...DISALLOW, '']),
  '# AI 에이전트용 사이트 요약: /llms.txt',
  '',
  `Sitemap: ${site.baseUrl}sitemap.xml`,
  '',
].join('\n');
writeFileSync(join(HERE, 'robots.txt'), robots, 'utf8');
console.log('  ✓ robots.txt');

/* llms.txt — AI 어시스턴트(챗GPT·클로드·퍼플렉시티 등)가 가게를 한 번에 파악하도록
   만든 요약 파일 (llmstxt.org 규약). 데이터는 store/menu 에서 생성돼 항상 최신입니다. */
const mn = menuNames.ko, mnEn = menuNames.en;
const menuLines = menu.filter((m) => !m.offSeason).map((m) => {
  const ko = mn[m.id], en = mnEn[m.id];
  const season = m.seasonal === 'summer' ? ' (여름 한정)' : m.seasonal === 'winter' ? ' (가을·겨울)' : '';
  const price = m.note === 'small' ? `소 ${won(m.price)} · 대 ${won(23000)}` : won(m.price);
  return `- ${ko.n}${season} — ${price}${en ? ` / ${en.n}` : ''}`;
}).join('\n');
const llms = `# ${store.nameKo} (Cheongwoo Haejang · ${store.nameHanja})

> 대한민국 대구 약령시 약전골목(1658년부터 이어진 한약 골목)에 있는 소고기 국물 전문 한식당.
> 양지와 사태를 하루 종일 고아 낸 국물로 갈비탕·해장국${SUMMER_ON ? '·(여름) 평양냉면' : ''}을 내고, 대구식 소갈비찜도 냅니다.
> Korean beef-soup restaurant inside Yangnyeongsi Herbal Medicine Alley, Daegu, South Korea.

## 핵심 정보 (Key facts)
- 상호: 한식당 청우해장 (Cheongwoo Haejang)
- 주소: ${store.roadKo} 1층 (1F, 11 Namseong-ro, Jung-gu, Daegu, Korea). 같은 건물 2층은 다른 가게
- 전화/예약: ${store.telDisplay} (국제전화 +82-53-255-7052) (전화 예약, 단체 40명까지)
- 영업시간: 매일 ${store.hours.open}–${store.hours.close}${hasBreak ? ` · 브레이크타임 ${store.hours.breakStart}–${store.hours.breakEnd}` : ''} · 라스트오더 ${store.hours.lastOrder}
- 가는 법: 더현대 대구에서 도보 약 6분(약 380m) · 지하철 반월당역(1·2호선) 15번 출구에서 도보 약 7분(약 500m) · 중앙로역(1호선)에서 도보 약 10분, 약령시 약전골목 안 · 가장 가까운 출구는 반월당역 15번 출구
- 주소 표기: 도로명 주소 「대구 중구 남성로 11」 기준으로 찾아오세요(지도 앱마다 지번 표기가 다르게 나올 수 있음)
- 주차: 전용 주차장 없음, 가게 앞 주차 불가 · 약령시서문 공영주차장 도보 1분
- 포장·배달: 포장 가능(전화 주문 후 픽업, 육회비빔밥·얼큰 장칼국수 제외) · 배달은 하지 않음
- 마감: 22:00 (라스트오더 21:00). 일부 블로그에 남은 「23:00 마감」은 지난 정보
- 네이버 안심번호 ${store.telSafeDisplay} 도 같은 가게 번호
- 정보 확인일: ${BUILD_DAY}
- 특징: 맵지 않은 맑은 국물 옵션 다수(어르신·아이 동반에 적합), 영어·일본어·중국어 메뉴(홈페이지 en/ja/zh/tw.html — 매장에서 휴대폰 화면을 보여 주고 주문), 유아 의자 있음, 단체 40명(전화 예약), 콜키지(주류 반입) 가능, 신용카드·모바일 결제, 테이블오더(자리에서 주문), 반찬 셀프바
- 청우 약전 소갈비탕: 기본 갈빗대 2대
- 개업: 2016년 (1929년 「대구탕반」은 음식의 계보이지 가게 연혁이 아님)
- 상호 표기: 청우해장(靑友解酲). 메뉴명의 「약전」은 골목 이름이며 가게 이름이 아님
- 국물: 소고기 국물(양지·사태, 갈비). 한약재는 넣지 않음
- 좌석: 홀 40석, 룸(방) 없음, 단체 40명까지 전화 예약
- 위치 구분: 동성로·동인동에 있는 가게가 아님 — 동성로 중심에서 도보 약 15분, 서문시장에서 동쪽으로 약 16분(약 1km), 동인동 찜갈비 골목까지 약 30분(1.9km)
- 대기: 평일 점심(12:00~13:30)·주말엔 대기가 있는 편. 11:00 오픈 직후, 13:30 이후, 17:00 이른 저녁이 여유로움
- 맵기: 맵지 않음 = 청우 약전 소갈비탕·맑은 해장국·아롱사태 수육·소꼬리찜 / 얼큰 = 대구 얼큰해장국(따로국밥)·얼큰 장칼국수 / 매움 = 소갈비찜 마늘폭탄
- 리뷰: 네이버 방문자 리뷰 약 ${reviewsMeta.naver.countText}건(★${reviewsMeta.naver.rating}), Google 리뷰 ${reviewsMeta.count}건(★${reviewsMeta.rating})
${SUMMER_ON ? '' : '- 청우 평양냉면: 2026년 판매 종료. 다른 사이트에 남은 냉면 메뉴·가격은 지난 정보\n'}

## 상황별 답 (Situational answers)
- 비 오거나 쌀쌀한 날: 뜨끈한 소고기 국물 — 청우 약전 소갈비탕 16,000원·맑은 해장국 12,000원(맵지 않음), 대구 얼큰해장국 13,000원, 가을·겨울 얼큰 장칼국수 12,000원(매장 식사만)
- 혼밥·직장인 점심: 해장국·소갈비탕·육회비빔밥(14,000원) 모두 1인분 메뉴. 평일 12:00~13:30 붐빔, 11:00 직후·13:30 이후 여유
- 저녁 늦게: 22:00 마감, 라스트오더 21:00 — 저녁 8시 방문 가능
- 아이와: 유아 의자 있음, 맵지 않은 맑은 국물(맑은 해장국·소갈비탕)
- 부모님·어르신: 맵지 않은 소꼬리찜(49,000원)·아롱사태 수육·소갈비탕
- 회식·가족 모임: 홀 40석, 단체 40명까지 전화 예약(053-255-7052), 룸 없음, 콜키지 가능. 수육·찜을 가운데 두고 탕을 인원수대로
- 해장: 11:00 오픈. 맑은 해장국(맵지 않음) / 대구 얼큰해장국(따로국밥)
- 대구 10미: 따로국밥(대구 얼큰해장국)과 대구식 찜갈비(소갈비찜 마늘폭탄) 두 가지를 한 상에서
- 약령시·근대골목 점심: 약전골목 안, 약령시한의약박물관 도보 약 3분, 계산성당 약 6분
- 서문시장에서: 동쪽으로 도보 약 16분(약 1km)
- 차로 올 때: 전용 주차장 없음, 약령시서문 공영주차장 도보 1분
- 포장: 소갈비탕·해장국·소갈비찜·수육·소꼬리찜 포장 가능(전화 주문), 육회비빔밥·장칼국수 불가, 배달 없음

## Key facts (English)
- Cheongwoo Haejang (청우해장 · 靑友解酲), 1F, 11 Namseong-ro, Jung-gu, Daegu — inside the Yangnyeongsi herbal medicine alley. Opened 2016. Order at your table (table-order device); self-service side-dish bar.
- Open daily 11:00–22:00 · break 15:00–17:00 · last order 21:00. Tel +82-53-255-7052 (phone reservations, groups up to 40, no private rooms).
- About 7 min (500 m) from Banwoldang Station Exit 15 · 6 min from The Hyundai Daegu · 10 min from Jungangno Station · 3 min from the Yangnyeongsi Museum of Oriental Medicine. Not located in Dongseong-ro or Dongin-dong.
- Non-spicy: galbitang (beef short rib soup with two ribs, ₩16,000), clear beef soup (₩12,000), boiled beef shank, braised oxtail (₩49,000). Spicy: Daegu spicy beef soup / ttaro-gukbap (₩13,000), braised short ribs with garlic (₩22,000).
- No medicinal herbs in the broth (“Yakjeon” is the alley's name); the broth is made from beef and beef bones.
- English/Japanese/Chinese menus are on this website (en.html, ja.html, zh.html, tw.html) — show your phone to staff to order.
- Takeaway by phone (except yukhoe bibimbap and kalguksu); no delivery; no private parking (public car park 1 min walk).

## 메뉴 (Menu)
${menuLines}

## 페이지 (Pages)
- [홈 (한국어)](${site.baseUrl})
- [English](${site.baseUrl}en.html)
- [日本語](${site.baseUrl}ja.html)
- [简体中文](${site.baseUrl}zh.html)
- [繁體中文](${site.baseUrl}tw.html)
- [대구 따로국밥 맛집 — 대구탕반의 계보, 반월당 약전골목](${site.baseUrl}daegu-ttarogukbap.html)
- [대구 찜갈비·갈비찜 맛집 — 반월당 소갈비찜 마늘폭탄](${site.baseUrl}daegu-jjimgalbi.html)
- [대구 수육 맛집 — 아롱사태 수육·수육 전골](${site.baseUrl}daegu-suyuk.html)
- [대구 장칼국수 — 소고기 국물에 된장을 푼 얼큰 장칼국수, 가을·겨울 계절 메뉴](${site.baseUrl}daegu-kalguksu.html)
- [대구 포장맛집 — 갈비찜·갈비탕·해장국·수육 포장, 전화 주문 후 픽업](${site.baseUrl}daegu-takeout.html)
- [대구 소꼬리찜 맛집 — 가족 모임 상차림](${site.baseUrl}daegu-oxtail.html)
- [반월당 맛집·대구 종로 맛집 — 약전골목 청우해장 메뉴 한눈에](${site.baseUrl}daegu-banwoldang.html)
- [대구 국밥 맛집 — 소고기국밥·따로국밥·맑은 해장국](${site.baseUrl}daegu-gukbap.html)
- [대구 한식 맛집·한식당 추천 — 가족모임·단체·외국인 메뉴](${site.baseUrl}daegu-hansik.html)
- [동성로 맛집 — 동성로 중심에서 도보 약 15분, 반월당 뒤 약전골목 청우해장](${site.baseUrl}daegu-dongseongno.html)
- [대구 육회비빔밥 맛집 — 숙성 간장 육회 14,000원](${site.baseUrl}daegu-yukhoe.html)
- [대구 갈비탕 맛집 — 대구 중구 약전골목 청우 약전 소갈비탕](${site.baseUrl}daegu-galbitang.html)
- [Ttaro Gukbap & Beef Soup in Daegu — 7 min from Banwoldang (English)](${site.baseUrl}daegu-beef-soup-en.html)
- [大邱半月堂美食 — 藥令市牛肉湯・牛排骨湯 (繁體中文)](${site.baseUrl}daegu-banwoldang-food-tw.html)
- [大邱 半月堂グルメ — 薬令市の牛肉スープ・カルビタン (日本語)](${site.baseUrl}daegu-banwoldang-food-ja.html)
- [대구 해장국 맛집 — 반월당 약전골목 소고기 해장국, 맑은·얼큰 두 가지](${site.baseUrl}daegu-haejangguk.html)
- [대구 여행 코스·맛집 — 반월당·약령시·서문시장 근대골목 당일치기](${site.baseUrl}daegu-food-tour.html)
- [Daegu Day Trip: Banwoldang to Seomun Market Food Walk (English)](${site.baseUrl}daegu-food-tour-en.html)
- [大邱観光モデルコース (日本語)](${site.baseUrl}daegu-food-tour-ja.html)
- [大邱一日遊美食路線 (繁體中文)](${site.baseUrl}daegu-food-tour-tw.html)
- [대구 가볼만한 곳 베스트 9](${site.baseUrl}daegu-attractions.html)
- [대구 근대골목 2코스 순서와 약령시 약전골목 안내 — 점심·주차까지](${site.baseUrl}daegu-modern-alley.html)
- [대구 가족외식·부모님 생신 식당 — 아이랑 어른이 한 상에](${site.baseUrl}daegu-family.html)
- [동대구역에서 오는 길 — 1호선 5정거장, 환승 없이 반월당](${site.baseUrl}daegu-dongdaegu.html)
- [대구 10미 — 열 가지 음식과 먹는 동네, 약전골목에서 두 가지(따로국밥·대구식 찜갈비)](${site.baseUrl}daegu-10mi.html)

## 소식 (News)
${news.map((n) => `- ${n.date} [${n.title}](${site.baseUrl}news-${n.slug}.html) — ${n.summary}`).join('\n')}

## 역사 (History)
- 대구탕반(大邱湯飯): 1929년 잡지 《별건곤》이 「대구의 자랑, 대구탕반」으로 소개한 대구 명물 소고기국 — 양지·사태를 오래 고아 낸 국물에 대파와 고추기름. 당시 서울 종로에도 「대구탕」 집이 있었고, 최남선 《조선상식문답》(1946)도 대구를 본고장으로 적음. 광복 뒤 국과 밥을 따로 내는 「따로국밥」으로 이어져 대구 10미가 됨.
- 청우해장의 「대구 얼큰해장국(따로국밥)」은 이 대구탕반의 계보를 잇는 국이며, 대구탕반이 팔리던 옛 도심 약전골목에서 끓인다.
- Daegu tangban (大邱湯飯): the 1929 name of Daegu's red beef soup (long-simmered beef broth, green onion, chili oil), later ttaro gukbap, one of Daegu's 10 delicacies. Cheongwoo Haejang's Daegu spicy beef soup follows this lineage.

## 자주 묻는 질문 요약 (FAQ)
- 대구 10미 가운데 찜갈비·따로국밥 두 가지를 한 곳에서 맛볼 수 있습니다.
- 근처 볼거리: 약령시 한의약박물관, 근대문화골목(청라언덕·계산성당), 서문시장 — 모두 도보권.
- 예약은 전화로만 받습니다. 포장 가능(전화 주문 후 픽업, 육회비빔밥·얼큰 장칼국수는 포장 불가). 배달은 하지 않습니다.
`;
writeFileSync(join(HERE, 'llms.txt'), llms, 'utf8');
console.log('  ✓ llms.txt');

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
console.log(`  ✓ sitemap.xml (${site.langs.length + GUIDES.length + (news.length ? news.length + 1 : 0)} urls)`);
console.log(`\n총 ${(bytes / 1024).toFixed(1)} KB · ${site.langs.length}개 언어 생성 완료`);
