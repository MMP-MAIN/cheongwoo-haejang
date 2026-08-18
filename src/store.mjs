// ---------------------------------------------------------------------------
// 청우해장 — 매장 원본 데이터 (Single Source of Truth)
// 이 파일만 고치고 `node build.mjs` 를 돌리면 4개 언어 페이지가 전부 갱신됩니다.
// ---------------------------------------------------------------------------

export const site = {
  // ---------------------------------------------------------------------
  // 사이트 주소
  // ---------------------------------------------------------------------
  // 도메인을 사면 customDomain 한 줄만 채우세요. 그러면
  //   · 모든 페이지의 canonical / hreflang / og:url
  //   · sitemap.xml
  //   · 구조화 데이터의 주소
  //   · GitHub Pages 용 CNAME 파일
  // 이 전부 새 도메인으로 바뀝니다. 빈 문자열이면 지금 주소를 씁니다.
  customDomain: 'cheongwoohaejang.com',   // 가비아 구매 완료

  // 도메인이 없을 때 쓰는 현재 주소 (GitHub Pages 하위 경로)
  fallbackUrl: 'https://hwanman2.github.io/weco/cheongwoo/',

  parentUrl: 'https://hwanman2.github.io/weco/',
  defaultLang: 'ko',

  // ---- 검색엔진 소유확인 코드 ----
  // 값이 있을 때만 <meta> 태그가 생깁니다. 발급받으면 여기 넣고 다시 빌드하세요.
  //  네이버 : searchadvisor.naver.com → 웹마스터도구 → 사이트 등록 → HTML 태그
  //  구글   : search.google.com/search-console → 속성 추가 → HTML 태그
  naverSiteVerification: '',
  googleSiteVerification: 'ucPfF2Kfn43TwqNxO72CR-TdrTEGyaWWvG9I_b9Qs58',   // 서치콘솔 URL 접두어 속성 (2026-08-18)
  bingSiteVerification: '',

  langs: ['ko', 'en', 'ja', 'zh', 'tw'],
  // 언어별 파일명. 기본 언어는 index.html 로 뽑습니다.
  file: { ko: 'index.html', en: 'en.html', ja: 'ja.html', zh: 'zh.html', tw: 'tw.html' },
  // 검색엔진에 노출할 hreflang 코드
  hreflang: { ko: 'ko-KR', en: 'en', ja: 'ja', zh: 'zh-Hans', tw: 'zh-Hant' },
};

// 실제로 쓰이는 최종 주소. 도메인이 있으면 그쪽, 없으면 현재 주소.
site.baseUrl = site.customDomain
  ? `https://${site.customDomain}/`
  : site.fallbackUrl;

export const store = {
  nameKo: '청우해장',
  nameHanja: '靑友解酲',
  legalKo: '한식당 청우해장',
  branchKo: '진청우해장 종로본점',

  // 연락처 — 간판 번호(053)를 대표로, 안심번호(0507)는 예비로 둡니다.
  telDisplay: '053-255-7052',
  telHref: '+82532557052',
  telSafeDisplay: '0507-1380-7052',
  telSafeHref: '+8250713807052',

  // 주소
  roadKo: '대구광역시 중구 남성로 11',
  roadEn: '11 Namseong-ro, Jung-gu, Daegu, South Korea',
  jibunKo: '대구광역시 중구 남성로 82',
  areaKo: '약령시·약전골목 / 반월당역 도보권',
  postalCode: '41934',        // 카카오맵 인증 매장 정보 (기존 41945 는 오기)
  region: 'KR-27',

  // 좌표 (네이버 지역검색 API 기준)
  lat: 35.8687847,
  lng: 128.5884600,

  // ---- 외부 플레이스 식별자 ----
  // 채우면 링크가 「검색」이 아니라 「그 가게 페이지」로 바로 꽂힙니다.
  //
  // ★ 확정본은 네이버 플레이스입니다 (2026-08-18 확인: 리뷰 3,251건 · 4.82점,
  //   사장님이 스마트플레이스에 직접 등록한 영업시간·메뉴·사진). 카카오맵은
  //   등록 정보가 오래돼 영업시간·가격이 달라서 홈페이지에서 뺐습니다.
  naverPlaceId: '1059841507',

  // 카카오맵 — 비워 두면 카카오 길찾기 버튼과 구조화 데이터의 카카오 링크가 빠집니다.
  // (카카오 등록 정보가 최신이 아니라 일부러 비웠습니다. 다시 쓰려면 '983201124')
  kakaoPlaceId: '',

  // 구글지도에서 매장을 열고 공유 → 링크 복사 하면 나오는
  // maps.app.goo.gl/... 또는 ?cid=1234567890 의 숫자
  googleCid: '',

  naverBookingUrl: '',     // 네이버 예약 URL (있으면 예약 버튼 생성)
  instagramUrl: 'https://www.instagram.com/chungwoo.official/',
  naverBlogUrl: 'https://blog.naver.com/zzyy004',

  // ---- 영업 정보 ----
  // ※ 2026-08-18 **네이버 플레이스** 사장님 등록 정보로 확정 (7일 동일).
  //    카카오맵은 11:00~23:00 · 브레이크 없음으로 돼 있으나 오래된 정보입니다.
  //    breakStart/breakEnd 를 null 로 두면 브레이크타임 문구·배지·구조화 데이터가
  //    자동으로 빠지고, lastOrder 가 null 이면 라스트오더 문구가 빠집니다.
  hours: { open: '11:00', close: '22:00', breakStart: '15:00', breakEnd: '17:00', lastOrder: '21:00' },
  openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

  priceRange: '₩₩',
  currency: 'KRW',
  seats: 40,          // 40명 이하 단체 예약 가능
  parking: false,     // 전용 주차장 없음. 근처 공영·민영 주차장은 아래 `parkingLots` 참고
};

// 영업시간 문구용 조각. i18n 이 이 값을 읽어 쓰므로, 위 `hours` 만 고치면
// 5개 언어의 본문·FAQ·구조화 데이터가 한 번에 같이 바뀝니다.
export const hasBreak = Boolean(store.hours.breakStart && store.hours.breakEnd);
export const hasLastOrder = Boolean(store.hours.lastOrder);

// 대표 메뉴. price 가 null 이면 "가격 문의" 로 표시됩니다.
// ※ 2026-08-18 **네이버 플레이스** 에 사장님이 직접 등록한 메뉴 19종에서
//    대표 11종을 골라 이름·가격·설명·사진을 그대로 옮겼습니다.
//    카카오맵 등록가와 다른 것: 맑은해장국 11,000(카카오 9,900) · 갈비탕 15,000(카카오 13,000)
//    → 네이버가 더 최근이고 항목이 많아 네이버를 따랐습니다. README 8번 참고.
// img 는 스마트플레이스에 사장님이 올린 사진(저작권 문제 없음)입니다.
// seasonal: 'summer' | 'winter' 이면 「여름 한정 / 겨울 한정」 표시가 붙습니다.
export const menu = [
  { id: 'naengmyeon', price: 12000, img: 'images/food-naengmyeon.jpg', signature: true,  seasonal: 'summer' },
  { id: 'galbitang',  price: 15000, img: 'images/food-galbitang.jpg',  signature: true },
  { id: 'spicy',      price: 12000, img: 'images/food-spicy.jpg',      signature: true },
  { id: 'ribs',       price: 20000, img: 'images/food-ribs.jpg',       signature: true },
  { id: 'oxtail',     price: 47000, img: 'images/food-oxtail.jpg',     signature: true },
  { id: 'yukhoe',     price: 13000, img: 'images/food-yukhoe.jpg',     signature: true },
  { id: 'clear',      price: 11000, img: 'images/food-clear.jpg',      signature: false },
  { id: 'kalguksu',   price: 12000, img: 'images/food-kalguksu.jpg',   signature: false, seasonal: 'winter' },
  { id: 'jeongol',    price: 32000, img: 'images/food-jeongol.jpg',    signature: false },
  { id: 'arong',      price: 18000, img: 'images/food-arong.jpg',      signature: false },
  { id: 'suyuk',      price: 17000, img: null,                         signature: false, note: 'small' },   // 소 17,000 · 대 22,000
];

// 근처 주차장 — 전용 주차장이 없어서 손님이 제일 많이 묻는 것.
// 2026-08-18 네이버 지역검색으로 확인. 좌표가 있어서 「길찾기」가 그 주차장으로 바로 꽂힙니다.
// walkMin 은 직선거리 ×1.3 / 분속 80m 로 계산한 도보 시간입니다.
export const parkingLots = [
  { id: 'seomun',  nameKo: '약령시서문 공영주차장', nameEn: 'Yangnyeongsi West Gate Public Parking', addrKo: '대구 중구 남성로 33',       lat: 35.8689680, lng: 128.5882798, walkMin: 1, kind: 'public' },
  { id: 'museum',  nameKo: '약령시한의약박물관 주차장', nameEn: 'Yangnyeongsi Museum Parking',   addrKo: '대구 중구 수동 (달성로 인근)', lat: 35.8687259, lng: 128.5897326, walkMin: 2, kind: 'public' },
  { id: 'seopyeon',nameKo: '약령시서편 공영주차장', nameEn: 'Yangnyeongsi East Public Parking', addrKo: '대구 중구 남성로 61-2',     lat: 35.8677306, lng: 128.5904823, walkMin: 4, kind: 'public' },
  { id: 'sehwa',   nameKo: '세화민영주차장',        nameEn: 'Sehwa Private Parking',            addrKo: '대구 중구 남성로 69',       lat: 35.8675988, lng: 128.5908229, walkMin: 4, kind: 'private' },
];

// 갤러리 — 위코컴퍼니가 시공/촬영한 실제 매장 사진
export const gallery = [
  { src: 'images/cheongwoo-queue-day.jpg', key: 'queueDay', w: 1085, h: 814 },  // 인스타 @chungwoo.official (사장님 허락)
  { src: 'images/cheongwoo-queue.jpg', key: 'queue',   w: 800,  h: 1066 },   // 네이버 플레이스 사장님 등록 사진
  { src: 'images/cheongwoo-02.jpg', key: 'exterior',  w: 1600, h: 1067 },
  { src: 'images/cheongwoo-01.jpg', key: 'hall',      w: 1600, h: 1067 },
  { src: 'images/cheongwoo-05.jpg', key: 'counter',   w: 1600, h: 1067 },
  { src: 'images/cheongwoo-07.jpg', key: 'menuwall',  w: 1067, h: 1600 },
  { src: 'images/cheongwoo-03.jpg', key: 'window',    w: 1600, h: 1067 },
  { src: 'images/cheongwoo-04.jpg', key: 'aisle',     w: 1067, h: 1600 },
  { src: 'images/cheongwoo-06.jpg', key: 'kitchen',   w: 1600, h: 1067 },
  { src: 'images/cheongwoo-08.jpg', key: 'through',   w: 1600, h: 1067 },
  { src: 'images/cheongwoo-09.jpg', key: 'table',     w: 1067, h: 1600 },
  { src: 'images/cheongwoo-10.jpg', key: 'door',      w: 1067, h: 1600 },
];

// ---------------------------------------------------------------------------
// 첫 화면(히어로) 사진
// ---------------------------------------------------------------------------
// 식당 홈페이지의 첫 화면은 음식 사진이 가장 강합니다.
// 음식 사진을 확보하면 아래 두 줄만 바꾸고 `node build.mjs` 하세요:
//
//   src:  'images/cheongwoo-food-01.jpg'
//   kind: 'food'
//
// kind 를 'food' 로 두면 어둡게 덮는 그라데이션이 왼쪽으로 쏠려서
// 글씨는 읽히고 오른쪽의 음식은 가려지지 않습니다.
// position 은 사진에서 어느 부분을 화면 중앙에 둘지 정합니다.
// (그릇이 아래쪽에 있으면 'center 60%', 위쪽이면 'center 35%')
export const hero = {
  src: 'images/food-galbitang.jpg',   // 네이버 플레이스 사장님 등록 사진 (2026-08-18)
  kind: 'food',              // 'food' | 'exterior' | 'interior'
  position: 'center 55%',
  width: 2000,
  height: 1500,
};

// 카카오톡·네이버 공유 미리보기 카드에 뜨는 사진.
// 보통 히어로와 같게 두면 됩니다.
export const ogImage = hero.src;

// 이미지는 이 폴더 안(cheongwoo/images/)에 있습니다. 상위 폴더에 의존하지
// 않으므로, 나중에 이 폴더만 떼어 별도 저장소·도메인으로 옮겨도 그대로 돕니다.
export const imgBase = '';
