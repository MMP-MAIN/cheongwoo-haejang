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
  googleSiteVerification: '',
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
  // 카카오는 확인 완료. 아래 ID 들은 채우면 링크가 「검색」이 아니라
  // 「그 가게 페이지」로 바로 꽂힙니다. 비어 있으면 이름+주소 검색으로 동작합니다.
  kakaoPlaceId: '983201124',

  // 네이버지도에서 매장을 열었을 때 주소창의
  // map.naver.com/p/entry/place/**1234567890** ← 이 숫자
  naverPlaceId: '',

  // 구글지도에서 매장을 열고 공유 → 링크 복사 하면 나오는
  // maps.app.goo.gl/... 또는 ?cid=1234567890 의 숫자
  googleCid: '',

  naverBookingUrl: '',     // 네이버 예약 URL (있으면 예약 버튼 생성)
  instagramUrl: 'https://www.instagram.com/chungwoo.official/',
  naverBlogUrl: 'https://blog.naver.com/zzyy004',

  // ---- 영업 정보 ----
  // ※ 2026-08-18 카카오맵 「인증 매장」(사업자 정보 확인됨) 등록 정보로 확정했습니다.
  //    7일 전부 11:00~23:00, 브레이크타임 등록 없음.
  //    breakStart/breakEnd 가 null 이면 브레이크타임 문구·배지·구조화 데이터가
  //    전부 자동으로 빠집니다. 브레이크타임이 실제로 있으면 여기에 시간만 넣으세요.
  //    lastOrder 도 확인되면 넣으세요. null 이면 라스트오더 문구가 나오지 않습니다.
  hours: { open: '11:00', close: '23:00', breakStart: null, breakEnd: null, lastOrder: null },
  openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

  priceRange: '₩₩',
  currency: 'KRW',
  seats: 40,          // 40명 이하 단체 예약 가능
  parking: false,     // 전용 주차장 없음 → 인근 공영주차장 (가게 앞 1~2대 가능하다는 제보 있음, 확인 필요)
};

// 영업시간 문구용 조각. i18n 이 이 값을 읽어 쓰므로, 위 `hours` 만 고치면
// 5개 언어의 본문·FAQ·구조화 데이터가 한 번에 같이 바뀝니다.
export const hasBreak = Boolean(store.hours.breakStart && store.hours.breakEnd);
export const hasLastOrder = Boolean(store.hours.lastOrder);

// 대표 메뉴. price 가 null 이면 "가격 문의" 로 표시됩니다.
// ※ 2026-08-18, 카카오맵에 **가게가 직접 등록한** 메뉴 6종의 이름·가격·설명을
//    그대로 반영했습니다. 매장 전체 메뉴는 18종이라 아래에 없는 것도 있습니다.
//    카카오에 등록되지 않은 메뉴(매운갈비찜·장칼국수·평양냉면)는 리뷰에 등장해
//    존재는 확실하지만 가격이 확인되지 않아 null 로 둡니다 — 틀린 가격을 적는 것보다
//    「가격 문의」가 낫습니다.
// img 는 음식 사진을 확보하면 채우세요. 지금은 매장 사진밖에 없어 비워 둡니다.
export const menu = [
  // --- 카카오맵 등록 정보로 확정 (2026-08-18) ---
  { id: 'spicy',     price: 12000, img: null, signature: true },
  { id: 'clear',     price: 9900,  img: null, signature: true },
  { id: 'galbitang', price: 13000, img: null, signature: true },
  { id: 'yukhoe',    price: 13000, img: null, signature: true },
  { id: 'oxtail',    price: 47000, img: null, signature: true },
  { id: 'arong',     price: 18000, img: null, signature: false },
  // --- 존재는 확인, 가격 미확인 ---
  { id: 'ribs',      price: null,  img: null, signature: false },
  { id: 'kalguksu',  price: null,  img: null, signature: false },
  { id: 'naengmyeon',price: null,  img: null, signature: false },
];

// 갤러리 — 위코컴퍼니가 시공/촬영한 실제 매장 사진
export const gallery = [
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
  src: 'images/cheongwoo-02.jpg',
  kind: 'exterior',          // 'food' | 'exterior' | 'interior'
  position: 'center 62%',
  width: 1600,
  height: 1067,
};

// 카카오톡·네이버 공유 미리보기 카드에 뜨는 사진.
// 보통 히어로와 같게 두면 됩니다.
export const ogImage = hero.src;

// 이미지는 이 폴더 안(cheongwoo/images/)에 있습니다. 상위 폴더에 의존하지
// 않으므로, 나중에 이 폴더만 떼어 별도 저장소·도메인으로 옮겨도 그대로 돕니다.
export const imgBase = '';
