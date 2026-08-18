// ---------------------------------------------------------------------------
// 언어별 문안. 키워드는 네이버 데이터랩 검색량 분석 결과를 반영해 배치했습니다.
// (대구맛집 > 해장국 > 대구여행 > 갈비탕 > 대구중구맛집 > 약령시/서문시장 순)
// ---------------------------------------------------------------------------

import { store, hasBreak, hasLastOrder } from './store.mjs';

// 영업시간은 store.mjs 의 `hours` 하나에서 나옵니다. 아래 문안에 시간을 직접
// 적지 마세요 — 시간이 바뀌면 5개 언어가 서로 어긋납니다.
const H = store.hours;

export const menuNames = {
  ko: {
    clear:      { n: '청우 맑은해장국', d: '뼈를 오래 고아 낸 맑은 국물. 자극 없이 속을 데워주는 청우해장의 기본.' },
    spicy:      { n: '얼큰해장국',      d: '다진 양념을 풀어 낸 얼큰한 국물. 전날 술자리 뒤에 가장 많이 나가는 메뉴.' },
    galbitang:  { n: '청우 약전 갈비탕', d: '진하고 깊은 국물에 부드러운 갈비. 어르신 모시고 오시기 좋은 대표 메뉴.' },
    yukhoe:     { n: '청우 육회 비빔밥', d: '신선한 육회에 청우만의 숙성 특제 간장 소스로 맛을 낸 비빔밥.' },
    arong:      { n: '아롱사태 냉채',    d: '푹 삶아 익힌 아롱사태를 새콤달콤한 청우 특제 냉채 소스에 무쳐 냅니다.' },
    kalguksu:   { n: '얼큰장칼국수',    d: '된장을 풀어 끓인 얼큰한 칼국수. 국물과 면을 같이 즐기고 싶을 때.' },
    ribs:       { n: '매운갈비찜',      d: '유튜브 먹방으로 알려진 메뉴. 대구식 찜갈비의 매운맛 그대로, 2~4인 나눠 먹기 좋은 크기입니다.' },
    oxtail:     { n: '소꼬리찜',        d: '아침부터 눌러 낸 소꼬리. 가족 모임·회식 상차림용.' },
    suyuk:      { n: '아롱사태수육',    d: '결 좋은 아롱사태를 삶아 얇게 저며 냅니다. 어르신 상에 잘 어울립니다.' },
    naengmyeon: { n: '평양냉면 · 고기냉국수', d: '여름 한정. 슴슴한 육수의 평양냉면과 고기 고명을 얹은 냉국수.' },
  },
  en: {
    clear:      { n: 'Clear Haejang-guk', d: 'Beef bone broth simmered for hours — clean, gentle, no chili. The house basic.' },
    spicy:      { n: 'Spicy Haejang-guk', d: 'The same broth with house chili paste. Korea’s classic hangover soup.' },
    galbitang:  { n: 'Galbi-tang (Short Rib Soup)', d: 'Tender short ribs in a deep, rich broth. Mild — good for kids and elders.' },
    yukhoe:     { n: 'Yukhoe Bibimbap (Beef Tartare Rice Bowl)', d: 'Fresh raw beef over rice with our own aged soy sauce dressing.' },
    arong:      { n: 'Chilled Beef Shank (Naengchae)', d: 'Slow-boiled beef shank tossed in our sweet-and-sour chilled dressing. Served cold.' },
    kalguksu:   { n: 'Spicy Doenjang Kalguksu', d: 'Hand-cut noodles in a spicy soybean-paste broth.' },
    ribs:       { n: 'Spicy Braised Short Ribs', d: 'The dish that went viral on Korean YouTube. Shareable for 2–4 people.' },
    oxtail:     { n: 'Braised Oxtail', d: 'Oxtail pressed and braised from early morning. A table centrepiece.' },
    suyuk:      { n: 'Boiled Beef Shank (Suyuk)', d: 'Slow-boiled beef shank, thinly sliced. Not spicy at all.' },
    naengmyeon: { n: 'Pyeongyang Naengmyeon / Cold Noodles', d: 'Summer only. Cold buckwheat noodles in a subtle chilled broth.' },
  },
  ja: {
    clear:      { n: '澄んだヘジャンクク', d: '牛骨をじっくり煮出した澄んだスープ。辛くないので朝食にも。' },
    spicy:      { n: '辛口ヘジャンクク',   d: '自家製の薬味を溶いたピリ辛スープ。二日酔いの定番です。' },
    galbitang:  { n: 'カルビタン（牛カルビスープ）', d: '濃厚なスープに柔らかいカルビ。辛くないのでお子様やご年配の方にも。' },
    yukhoe:     { n: 'ユッケビビンバ', d: '新鮮なユッケに、自家製の熟成醤油ダレを合わせたビビンバ。' },
    arong:      { n: '牛すね肉の冷菜', d: 'じっくり茹でた牛すね肉を、自家製の甘酸っぱい冷菜ダレで和えた一品。冷たいまま出します。' },
    kalguksu:   { n: '辛味噌カルグクス',   d: 'テンジャン（味噌）ベースの辛いスープに手打ち麺。' },
    ribs:       { n: '辛口カルビチム',     d: '韓国のグルメ動画で話題になった一品。2〜4人でシェアできます。' },
    oxtail:     { n: '牛テールの煮込み',   d: '早朝から仕込む牛テール。会食やご家族の集まりに。' },
    suyuk:      { n: '牛すね肉のスユク',   d: 'ゆでた牛すね肉を薄切りに。辛さは一切ありません。' },
    naengmyeon: { n: '平壌冷麺・肉冷麺',   d: '夏季限定。あっさりしたスープの冷たいそば麺。' },
  },
  zh: {
    clear:      { n: '清汤解酒汤', d: '牛骨长时间熬煮的清汤，不辣，暖胃，本店基本款。' },
    spicy:      { n: '香辣解酒汤', d: '加入自制辣酱的浓郁汤底，韩国经典的解酒汤。' },
    galbitang:  { n: '药田排骨汤', d: '浓郁汤底配软嫩牛排骨，不辣，适合老人和小孩。' },
    yukhoe:     { n: '生牛肉拌饭', d: '新鲜生牛肉配本店秘制熟成酱油汁的拌饭。' },
    arong:      { n: '凉拌牛腱', d: '慢炖牛腱拌上本店特制酸甜凉拌汁，凉着上桌。' },
    kalguksu:   { n: '辣味大酱刀削面', d: '大酱汤底配手工面条，汤面一起享用。' },
    ribs:       { n: '辣炖牛排骨', d: '因韩国美食视频走红的招牌菜，2〜4 人分享刚好。' },
    oxtail:     { n: '炖牛尾',     d: '每天清晨开始炖煮的牛尾，适合家庭聚餐。' },
    suyuk:      { n: '水煮牛腱片', d: '慢煮牛腱切薄片，完全不辣。' },
    naengmyeon: { n: '平壤冷面 · 肉冷面', d: '夏季限定。清爽汤底的荞麦冷面。' },
  },
};

export const galleryAlt = {
  ko: {
    exterior: '대구 중구 남성로 청우해장 외관 — 파란 한글 간판과 靑友解酲 한자 간판',
    hall: '청우해장 홀 — 통유리 창가 원목 테이블 좌석',
    counter: '청우해장 매장 안쪽 홀과 메뉴 포스터',
    menuwall: '청우해장 벽면 메뉴 — 얼큰장칼국수·얼큰해장국·맑은해장국',
    window: '약전골목에서 바라본 청우해장 통유리 창',
    aisle: '청우해장 테이블 사이 통로와 간접조명 벽면',
    kitchen: '청우해장 오픈 주방과 반찬대',
    through: '창 너머로 보이는 청우해장 홀 전경',
    table: '청우해장 원목 4인 테이블과 간접조명',
    door: '청우해장 출입문 — 청우해장 靑友解酲 유리 사인',
  },
  en: {
    exterior: 'Cheongwoo Haejang storefront on Namseong-ro, Jung-gu, Daegu',
    hall: 'Dining hall with wooden tables along the full-height window',
    counter: 'Inner dining room and menu posters at Cheongwoo Haejang',
    menuwall: 'Menu posters — spicy kalguksu, spicy and clear haejang-guk',
    window: 'The restaurant seen from Yakjeon-golmok herbal medicine alley',
    aisle: 'Aisle between tables under warm indirect lighting',
    kitchen: 'Open kitchen and banchan station',
    through: 'The dining hall seen through the front window',
    table: 'A four-seat oak table under warm light',
    door: 'Entrance door with the Cheongwoo Haejang glass signage',
  },
  ja: {
    exterior: '大邱市中区南城路のチョンウヘジャン外観',
    hall: '大きな窓沿いの木製テーブル席',
    counter: '店内奥のホールとメニューポスター',
    menuwall: '壁のメニュー — 辛味噌カルグクス、辛口・澄んだヘジャンクク',
    window: '薬田横丁から見た店舗のガラス窓',
    aisle: 'テーブルの間の通路と間接照明の壁',
    kitchen: 'オープンキッチンとおかずコーナー',
    through: '窓越しに見えるホール全景',
    table: '木製の4人掛けテーブル',
    door: 'チョンウヘジャンの入口ドア',
  },
  zh: {
    exterior: '大邱市中区南城路 青友解酲 店面外观',
    hall: '落地窗旁的实木餐桌区',
    counter: '店内后厅与菜单海报',
    menuwall: '墙上菜单 — 辣味大酱刀削面、香辣与清汤解酒汤',
    window: '从药田胡同看到的店面玻璃窗',
    aisle: '餐桌之间的过道与暖色间接照明',
    kitchen: '开放式厨房与小菜区',
    through: '透过窗户看到的用餐区',
    table: '实木四人餐桌',
    door: '青友解酲 入口玻璃门',
  },
};

export const t = {
  // =========================== 한국어 ===========================
  ko: {
    htmlLang: 'ko',
    langName: '한국어',
    title: '청우해장 — 대구 약전골목 갈비탕·매운갈비찜·해장국 | 반월당역 대구맛집',
    description:
      `대구 중구 남성로 청우해장. 약령시 약전골목 한식당으로 갈비 산더미 맑은갈비탕, 대구식 매운갈비찜(찜갈비), 맑은·얼큰 해장국, 소꼬리찜을 냅니다. 반월당역 도보 5분, 근대골목투어 코스 대구맛집. 매일 ${H.open}~${H.close}, 전화 예약 053-255-7052.`,
    keywords:
      '대구맛집, 대구 맛집, 대구중구맛집, 반월당 맛집, 반월당역 맛집, 약전골목 맛집, 약령시 맛집, 갈비탕, 맑은갈비탕, 대구 갈비탕, 갈비찜, 매운갈비찜, 소갈비찜, 대구찜갈비, 찜갈비, 대구 찜갈비 맛집, 해장국, 얼큰해장국, 맑은해장국, 대구해장국, 소꼬리찜, 아롱사태수육, 평양냉면, 청우해장, 근대골목투어, 대구근대골목, 동성로 맛집, 서문시장 맛집, 대구여행, 대구 가볼만한곳, 대구10미, 대구 한식당, 가족모임 식당 대구',
    ogLocale: 'ko_KR',
    heroAltFood: '청우해장 대표 메뉴 — 갈비를 산더미로 올린 맑은 갈비탕',

    nav: { menu: '메뉴', story: '이야기', hood: '약전골목', gallery: '매장', visit: '오시는 길', faq: '자주 묻는 질문' },
    navReserve: '전화 예약',
    skip: '본문 바로가기',

    heroBadge: '대구 중구 · 약령시 약전골목',
    heroTitle: '해장에도, 대접에도<br>한 그릇이면 됩니다',
    heroLede:
      '반월당역에서 걸어 5분. 약전골목 안쪽 <strong>청우해장</strong>은 뼈를 오래 고아 낸 맑은 해장국, 갈비 산더미 <strong>갈비탕</strong>, 대구식 <strong>매운갈비찜</strong>을 냅니다. 근대골목투어 중간에, 회식 다음 날 아침에, 어르신 모시는 자리에.',
    heroCtaCall: '전화로 예약하기',
    heroCtaDir: '길찾기',
    heroCtaMenu: '메뉴 보기',
    heroScroll: '아래로',

    quickHours: '영업시간',
    quickHoursVal: `매일 ${H.open} – ${H.close}`,
    quickBreak: [
      hasBreak ? `브레이크타임 ${H.breakStart}–${H.breakEnd}` : '브레이크타임 없이 종일 영업',
      hasLastOrder ? `라스트오더 ${H.lastOrder}` : '연중무휴',
    ].join(' · '),
    quickAddr: '주소',
    quickTel: '전화',
    quickPark: '주차',
    quickParkVal: '전용 주차장 없음 · 인근 공영주차장 이용',

    storyTitle: '청우해장은',
    storyLede:
      '대구 약령시 약전골목, 근대골목투어 길목에 있는 한식당입니다. 관광 오신 분도 근처에서 일하시는 분도 부담 없이 한 끼 드시고 가시라고 문을 열었습니다.',
    story: [
      { h: '국물이 먼저입니다', p: '아침마다 뼈를 눌러 국물부터 냅니다. 맑은 해장국은 자극 없이, 얼큰 해장국은 다진 양념을 풀어 얼큰하게. 같은 국물에서 두 갈래로 나갑니다.' },
      { h: '어르신 모시기 좋은 상', p: '맑은 갈비탕과 아롱사태수육은 맵지 않습니다. 생신·어버이날·가족 모임 상차림으로 가장 많이 찾으시는 메뉴입니다.' },
      { h: '관광 동선 한가운데', p: '약령시·서문시장·동성로·근대골목 어디서든 걸어서 닿습니다. 근처 호텔 투숙객이 아침·점심으로 들르기 좋은 위치입니다.' },
      { h: '단체도 받습니다', p: '40명 이하 단체 예약이 가능합니다. 점심 웨이팅이 잦으니 인원이 많으면 미리 전화 주세요.' },
    ],

    menuTitle: '대표 메뉴',
    menuLede: '가격과 구성은 계절에 따라 달라질 수 있습니다. 정확한 내용은 전화로 확인해 주세요.',
    menuSignature: '대표',
    menuAsk: '가격 문의',
    menuNote: '※ 매장 사정에 따라 일부 메뉴는 조기 소진될 수 있습니다.',

    galleryTitle: '매장',
    galleryLede: '2024년 새로 단장한 매장입니다. 통유리 창가석과 원목 테이블, 40석 규모.',

    visitTitle: '오시는 길',
    visitLede: '지하철 1·2호선 반월당역에서 도보 5분. 약령시 한의약박물관 옆 약전골목 안쪽입니다.',
    visitNaver: '네이버지도 길찾기',
    visitKakao: '카카오맵 길찾기',
    visitGoogle: '구글지도 길찾기',
    visitCopy: '주소 복사',
    visitCopied: '주소를 복사했습니다',
    mapAlt: '청우해장 위치 지도',
    transitTitle: '대중교통',
    transit: [
      '지하철 1·2호선 <strong>반월당역</strong> 13번 출구 → 도보 약 5분',
      '지하철 1호선 <strong>중앙로역</strong> → 도보 약 8분',
      '<strong>약령시 한의약박물관</strong> 바로 옆 약전골목 안쪽',
    ],
    parkingTitle: '주차',
    parkingBody:
      '매장 전용 주차장은 없습니다. 약령시 공영주차장 등 인근 유료 주차장을 이용해 주세요. 주말 점심에는 대중교통을 권해 드립니다.',

    reserveTitle: '예약 · 문의',
    reserveLede:
      '예약은 전화로 받습니다. 40명 이하 단체 가능, 포장 가능. 점심시간(12:00~13:30)에는 웨이팅이 있을 수 있습니다.',
    reserveCall: '053-255-7052 로 전화',
    reserveCallSafe: '안심번호로 전화',
    reserveNaver: '네이버 예약',
    reserveBlog: '네이버 블로그',
    reserveHoursNote: `전화는 영업시간(${H.open}~${H.close}) 중에 받습니다.`,

    faqTitle: '자주 묻는 질문',
    faq: [
      { q: '예약이 되나요?', a: '네, 전화 예약을 받습니다. 40명 이하 단체 예약도 가능합니다. 053-255-7052 로 연락 주세요.' },
      { q: '주차는 어디에 하나요?', a: '매장 전용 주차장은 없습니다. 약령시 공영주차장 등 인근 유료 주차장을 이용해 주세요.' },
      { q: '브레이크타임이 있나요?', a: hasBreak
          ? `네, ${H.breakStart}~${H.breakEnd} 이 브레이크타임입니다. 마감은 ${H.close} 입니다.`
          : `브레이크타임 없이 ${H.open}부터 ${H.close}까지 계속 영업합니다. 점심과 저녁 사이 한가한 시간에 오셔도 됩니다.` },
      { q: '맵지 않은 메뉴도 있나요?', a: '맑은해장국, 청우 약전 갈비탕, 아롱사태수육은 맵지 않습니다. 어르신이나 아이와 함께 오셔도 괜찮습니다.' },
      { q: '웨이팅이 많나요?', a: '평일 점심(12:00~13:30)과 주말에는 대기가 있는 편입니다. 오픈 직후나 저녁 이른 시간이 여유롭습니다.' },
      { q: '포장이 되나요?', a: '네, 포장 가능합니다. 전화로 미리 주문해 두시면 기다리지 않고 가져가실 수 있습니다.' },
      { q: '외국어 메뉴가 있나요?', a: '이 홈페이지에서 영어·일본어·중국어로 메뉴를 확인하실 수 있습니다. 매장 직원에게 화면을 보여주셔도 됩니다.' },
    ],

    footerTagline: '대구 중구 약전골목 한식당',
    footerBiz: '상호 한식당 청우해장 · 대구광역시 중구 남성로 11',
    footerCredit: '매장 사진·홈페이지 제작 : 위코컴퍼니',
    footerRights: '© 청우해장. All rights reserved.',
    langLabel: '언어',
  },

  // =========================== English ===========================
  en: {
    htmlLang: 'en',
    langName: 'English',
    title: 'Cheongwoo Haejang — Korean Hangover Soup & Short Rib Soup in Daegu',
    description:
      `A Korean restaurant in Yakjeon-golmok, the herbal medicine alley of central Daegu. Clear and spicy haejang-guk, short rib soup, braised ribs. 5 minutes on foot from Banwoldang Station. Open daily ${H.open}–${H.close}.`,
    keywords:
      'Daegu restaurant, Daegu food, what to eat in Daegu, haejang-guk, Korean hangover soup, galbitang, Korean beef short rib soup, galbijjim, Daegu braised short ribs, spicy braised ribs, Banwoldang, Yangnyeongsi herbal medicine market, Daegu Modern History Street, Korean restaurant Daegu, Seomun Market food, Daegu 10 tastes',
    ogLocale: 'en_US',
    heroAltFood: 'Galbi-tang at Cheongwoo Haejang — beef short ribs piled in clear broth',

    nav: { menu: 'Menu', story: 'Our Story', hood: 'The Alley', gallery: 'The Room', visit: 'Getting Here', faq: 'FAQ' },
    navReserve: 'Call to book',
    skip: 'Skip to content',

    heroBadge: 'Jung-gu, Daegu · Herbal Medicine Alley',
    heroTitle: 'One bowl.<br>Morning after, or family dinner.',
    heroLede:
      'Five minutes on foot from Banwoldang Station, tucked inside Yakjeon-golmok. <strong>Cheongwoo Haejang</strong> serves beef bone broth simmered from dawn and short rib soup piled high. A natural stop on the Modern History Street walking course.',
    heroCtaCall: 'Call to book',
    heroCtaDir: 'Directions',
    heroCtaMenu: 'See the menu',
    heroScroll: 'Scroll',

    quickHours: 'Hours',
    quickHoursVal: `Daily ${H.open} – ${H.close}`,
    quickBreak: [
      hasBreak ? `Break ${H.breakStart}–${H.breakEnd}` : 'No break — open all day',
      hasLastOrder ? `Last order ${H.lastOrder}` : 'Open every day',
    ].join(' · '),
    quickAddr: 'Address',
    quickTel: 'Phone',
    quickPark: 'Parking',
    quickParkVal: 'No private lot · public car parks nearby',

    storyTitle: 'About us',
    storyLede:
      'We are a Korean restaurant inside Yakjeon-golmok, the 400-year-old herbal medicine alley of Daegu, right on the Modern History Street walking route. Visitors and neighbourhood regulars eat side by side.',
    story: [
      { h: 'The broth comes first', p: 'Beef bones go on every morning. The clear haejang-guk is gentle and not spicy; the spicy version is the same broth with our own chili paste stirred in.' },
      { h: 'Easy for elders and children', p: 'The clear short rib soup and the boiled beef shank carry no chili at all. These are what families order for birthdays and holidays.' },
      { h: 'In the middle of the walk', p: 'Yangnyeongsi Herbal Medicine Museum, Seomun Market, Dongseong-ro and the Modern History Street are all within walking distance. Convenient for hotel guests nearby.' },
      { h: 'Groups welcome', p: 'We take group bookings for up to 40 people. Lunch gets busy, so please call ahead for larger parties.' },
    ],

    menuTitle: 'What we serve',
    menuLede: 'Prices and line-up may change with the season. Please call to confirm.',
    menuSignature: 'Signature',
    menuAsk: 'Ask in store',
    menuNote: '※ Some dishes may sell out before closing.',

    galleryTitle: 'The room',
    galleryLede: 'Refitted in 2024 — full-height windows, oak tables, around 40 seats.',

    visitTitle: 'Getting here',
    visitLede: 'Five minutes on foot from Banwoldang Station (Metro Lines 1 & 2), beside the Yangnyeongsi Herbal Medicine Museum.',
    visitNaver: 'Open in Naver Map',
    visitKakao: 'Open in KakaoMap',
    visitGoogle: 'Open in Google Maps',
    visitCopy: 'Copy address',
    visitCopied: 'Address copied',
    mapAlt: 'Map showing the location of Cheongwoo Haejang',
    transitTitle: 'By metro',
    transit: [
      '<strong>Banwoldang Station</strong> (Lines 1 & 2), Exit 13 → about 5 min on foot',
      '<strong>Jungangno Station</strong> (Line 1) → about 8 min on foot',
      'Inside Yakjeon-golmok, next to the <strong>Yangnyeongsi Herbal Medicine Museum</strong>',
    ],
    parkingTitle: 'Parking',
    parkingBody:
      'We have no private car park. Please use the Yangnyeongsi public car park or another paid lot nearby. On weekend lunchtimes we recommend the metro.',

    reserveTitle: 'Booking & enquiries',
    reserveLede:
      'Bookings are taken by phone. Groups up to 40, takeaway available. Expect a short wait at lunch (12:00–13:30). Staff speak limited English — showing this page works well.',
    reserveCall: 'Call +82 53-255-7052',
    reserveCallSafe: 'Call the alternate line',
    reserveNaver: 'Naver booking',
    reserveBlog: 'Naver blog',
    reserveHoursNote: `The phone is answered during opening hours (${H.open}–${H.close} KST).`,

    faqTitle: 'Frequently asked',
    faq: [
      { q: 'Can I make a reservation?', a: 'Yes, by phone. We accept group bookings for up to 40 people. Call +82 53-255-7052.' },
      { q: 'Is there parking?', a: 'There is no private car park. Please use the Yangnyeongsi public car park or another paid lot nearby.' },
      { q: 'Is there a break time?', a: hasBreak
          ? `Yes — ${H.breakStart} to ${H.breakEnd}. We close at ${H.close}.`
          : `No. We serve straight through from ${H.open} to ${H.close}, so the quiet hours between lunch and dinner are fine.` },
      { q: 'Do you have non-spicy dishes?', a: 'Yes. The clear haejang-guk, the short rib soup and the boiled beef shank contain no chili.' },
      { q: 'Will I have to queue?', a: 'Weekday lunch (12:00–13:30) and weekends can be busy. Just after opening or early evening is quieter.' },
      { q: 'Do you do takeaway?', a: 'Yes. Call ahead and your order will be ready to collect.' },
      { q: 'Is there an English menu?', a: 'This page carries the menu in English, Japanese and Chinese. Showing the screen to our staff works fine.' },
    ],

    footerTagline: 'Korean restaurant in Yakjeon-golmok, Daegu',
    footerBiz: 'Cheongwoo Haejang · 11 Namseong-ro, Jung-gu, Daegu, Korea',
    footerCredit: 'Interior, photography and website by WECO Company',
    footerRights: '© Cheongwoo Haejang. All rights reserved.',
    langLabel: 'Language',
  },

  // =========================== 日本語 ===========================
  ja: {
    htmlLang: 'ja',
    langName: '日本語',
    title: 'チョンウヘジャン — 大邱・薬田横丁のヘジャンククとカルビタン',
    description:
      `大邱中区南城路の韓国料理店。牛骨をじっくり煮出したヘジャンクク、カルビが山盛りのカルビタン、辛口カルビチム。半月堂駅から徒歩5分、近代路地ツアーの途中に。毎日${H.open}〜${H.close}。`,
    keywords:
      '大邱 グルメ, 大邱 レストラン, 大邱 韓国料理, 大邱 名物, ヘジャンクク, カルビタン, カルビチム, 大邱 カルビチム, 辛口カルビチム, 半月堂, 薬令市, 大邱 近代路地, 大邱 旅行, 西門市場 グルメ, 東城路 グルメ, 大邱十味',
    ogLocale: 'ja_JP',
    heroAltFood: 'チョンウヘジャンのカルビタン — 骨付きカルビが山盛りの澄んだスープ',

    nav: { menu: 'メニュー', story: 'お店について', hood: '薬田横丁', gallery: '店内', visit: 'アクセス', faq: 'よくある質問' },
    navReserve: '電話で予約',
    skip: '本文へ',

    heroBadge: '大邱・中区 薬令市 薬田横丁',
    heroTitle: '二日酔いの朝にも、<br>大切な会食にも。',
    heroLede:
      '半月堂駅から徒歩5分、薬田横丁の中ほど。<strong>チョンウヘジャン</strong>は毎朝仕込む牛骨スープのヘジャンククと、カルビが山盛りのカルビタンをお出しします。近代路地ツアーの途中にどうぞ。',
    heroCtaCall: '電話で予約',
    heroCtaDir: '道順を見る',
    heroCtaMenu: 'メニューを見る',
    heroScroll: 'スクロール',

    quickHours: '営業時間',
    quickHoursVal: `毎日 ${H.open} – ${H.close}`,
    quickBreak: [
      hasBreak ? `休憩 ${H.breakStart}–${H.breakEnd}` : '休憩なし・通し営業',
      hasLastOrder ? `ラストオーダー ${H.lastOrder}` : '年中無休',
    ].join(' · '),
    quickAddr: '住所',
    quickTel: '電話',
    quickPark: '駐車場',
    quickParkVal: '専用駐車場なし · 近隣の公営駐車場をご利用ください',

    storyTitle: 'お店について',
    storyLede:
      '大邱・薬令市の薬田横丁、近代路地ツアーの通り道にある韓国料理店です。観光の方も近所の常連さんも、気軽に一杯どうぞ。',
    story: [
      { h: 'まずスープから', p: '毎朝、牛骨を寸胴にかけるところから始めます。澄んだヘジャンククは辛くなく、辛口は同じスープに自家製の薬味を溶いたものです。' },
      { h: 'ご年配の方にも', p: 'カルビタンと牛すね肉のスユクは全く辛くありません。ご家族のお祝いの席で最も多くご注文いただくメニューです。' },
      { h: '観光ルートの真ん中', p: '薬令市韓医薬博物館、西門市場、東城路、近代路地。すべて徒歩圏内です。近隣ホテルの朝食・昼食にも。' },
      { h: '団体も承ります', p: '40名以下の団体予約が可能です。昼は混み合いますので、人数が多い場合はお電話ください。' },
    ],

    menuTitle: 'おすすめ',
    menuLede: '価格・内容は季節により変わることがあります。詳しくはお電話でご確認ください。',
    menuSignature: '看板',
    menuAsk: '店頭にて',
    menuNote: '※ 一部メニューは早めに売り切れる場合があります。',

    galleryTitle: '店内',
    galleryLede: '2024年に改装。大きな窓と木のテーブル、約40席。',

    visitTitle: 'アクセス',
    visitLede: '地下鉄1・2号線 半月堂駅から徒歩5分。薬令市韓医薬博物館の隣、薬田横丁の中ほどです。',
    visitNaver: 'NAVERマップで開く',
    visitKakao: 'カカオマップで開く',
    visitGoogle: 'Googleマップで開く',
    visitCopy: '住所をコピー',
    visitCopied: '住所をコピーしました',
    mapAlt: 'チョンウヘジャンの位置を示す地図',
    transitTitle: '地下鉄',
    transit: [
      '地下鉄1・2号線 <strong>半月堂駅</strong> 13番出口 → 徒歩約5分',
      '地下鉄1号線 <strong>中央路駅</strong> → 徒歩約8分',
      '<strong>薬令市韓医薬博物館</strong>のすぐ隣、薬田横丁の中',
    ],
    parkingTitle: '駐車場',
    parkingBody:
      '専用駐車場はございません。薬令市公営駐車場など近隣の有料駐車場をご利用ください。週末のお昼は地下鉄をおすすめします。',

    reserveTitle: 'ご予約・お問い合わせ',
    reserveLede:
      'ご予約はお電話で承ります。40名以下の団体可、テイクアウト可。昼（12:00〜13:30）は待ち時間が出ることがあります。',
    reserveCall: '+82 53-255-7052 に電話',
    reserveCallSafe: '別回線に電話',
    reserveNaver: 'NAVER予約',
    reserveBlog: 'NAVERブログ',
    reserveHoursNote: `お電話は営業時間内（韓国時間 ${H.open}〜${H.close}）に承ります。`,

    faqTitle: 'よくある質問',
    faq: [
      { q: '予約はできますか。', a: 'はい、お電話で承ります。40名以下の団体予約も可能です。+82 53-255-7052 までどうぞ。' },
      { q: '駐車場はありますか。', a: '専用駐車場はありません。薬令市公営駐車場など近隣の有料駐車場をご利用ください。' },
      { q: '休憩時間はありますか。', a: hasBreak
          ? `はい、${H.breakStart}〜${H.breakEnd} が休憩時間です。閉店は${H.close}です。`
          : `休憩なしで${H.open}から${H.close}まで通しで営業しています。昼と夜の間の空いている時間帯でもご利用いただけます。` },
      { q: '辛くない料理はありますか。', a: '澄んだヘジャンクク、カルビタン、牛すね肉のスユクは全く辛くありません。' },
      { q: '待ち時間はありますか。', a: '平日の昼（12:00〜13:30）と週末は混み合います。開店直後か夕方早めが比較的空いています。' },
      { q: 'テイクアウトはできますか。', a: 'はい。事前にお電話いただければ、お待たせせずにお渡しできます。' },
      { q: '日本語メニューはありますか。', a: 'このページで日本語のメニューをご覧いただけます。画面をスタッフにお見せください。' },
    ],

    footerTagline: '大邱・薬田横丁の韓国料理店',
    footerBiz: 'チョンウヘジャン · 大邱広域市 中区 南城路 11',
    footerCredit: '内装・写真・ウェブサイト制作 : WECO Company',
    footerRights: '© 청우해장. All rights reserved.',
    langLabel: '言語',
  },

  // =========================== 中文 ===========================
  zh: {
    htmlLang: 'zh-Hans',
    langName: '中文',
    title: '青友解酲 — 大邱药田胡同的解酒汤与排骨汤',
    description:
      `位于大邱中区南城路的韩式餐厅。清汤与香辣解酒汤、堆满牛排骨的排骨汤、辣炖牛排骨。半月堂站步行5分钟，近代胡同游览路线上。每天 ${H.open}–${H.close} 营业。`,
    keywords:
      '大邱美食, 大邱美食推荐, 大邱必吃, 大邱餐厅, 大邱韩餐, 大邱自由行, 解酒汤, 排骨汤, 炖排骨, 辣炖排骨, 大邱炖排骨, 半月堂, 药令市, 大邱近代胡同, 大邱旅游, 大邱景点, 西门市场美食, 东城路美食, 大邱十味',
    ogLocale: 'zh_CN',
    heroAltFood: '青友解酲的排骨汤 — 清汤里堆满牛排骨',

    nav: { menu: '菜单', story: '关于我们', hood: '药田胡同', gallery: '店内', visit: '交通', faq: '常见问题' },
    navReserve: '电话预订',
    skip: '跳到正文',

    heroBadge: '大邱中区 · 药令市药田胡同',
    heroTitle: '宿醉的早晨，<br>家宴的餐桌。',
    heroLede:
      '从半月堂站步行5分钟，就在药田胡同里。<strong>青友解酲</strong>每天清晨开始熬煮牛骨清汤，排骨汤里堆满牛排骨。近代胡同游览途中的一顿好饭。',
    heroCtaCall: '电话预订',
    heroCtaDir: '查看路线',
    heroCtaMenu: '查看菜单',
    heroScroll: '向下',

    quickHours: '营业时间',
    quickHoursVal: `每天 ${H.open} – ${H.close}`,
    quickBreak: [
      hasBreak ? `休息 ${H.breakStart}–${H.breakEnd}` : '中午到晚上不休息',
      hasLastOrder ? `最后点单 ${H.lastOrder}` : '全年无休',
    ].join(' · '),
    quickAddr: '地址',
    quickTel: '电话',
    quickPark: '停车',
    quickParkVal: '无专用停车场 · 请使用附近公共停车场',

    storyTitle: '关于我们',
    storyLede:
      '我们是一家位于大邱药令市药田胡同的韩式餐厅，就在近代胡同游览路线上。游客与街坊常客同桌而食。',
    story: [
      { h: '汤是根本', p: '每天清晨从熬牛骨开始。清汤解酒汤不辣，香辣款是同一锅汤加入自制辣酱。' },
      { h: '适合长辈与孩子', p: '清汤排骨汤和水煮牛腱片完全不辣，是家庭聚餐与寿宴最常点的菜。' },
      { h: '就在游览路线中间', p: '药令市韩医药博物馆、西门市场、东城路、近代胡同，全都在步行范围内。附近酒店客人早餐午餐皆宜。' },
      { h: '接待团体', p: '可预订 40 人以下团体。午餐时段较忙，人数较多请提前致电。' },
    ],

    menuTitle: '招牌菜',
    menuLede: '价格与菜品可能随季节调整，详情请致电确认。',
    menuSignature: '招牌',
    menuAsk: '店内询问',
    menuNote: '※ 部分菜品可能提前售罄。',

    galleryTitle: '店内',
    galleryLede: '2024 年重新装修 — 落地窗、实木餐桌，约 40 个座位。',

    visitTitle: '交通',
    visitLede: '地铁1、2号线半月堂站步行5分钟，药令市韩医药博物馆旁边。',
    visitNaver: '用 NAVER 地图打开',
    visitKakao: '用 KakaoMap 打开',
    visitGoogle: '用 Google 地图打开',
    visitCopy: '复制地址',
    visitCopied: '地址已复制',
    mapAlt: '青友解酲位置地图',
    transitTitle: '地铁',
    transit: [
      '地铁1、2号线 <strong>半月堂站</strong> 13号出口 → 步行约5分钟',
      '地铁1号线 <strong>中央路站</strong> → 步行约8分钟',
      '<strong>药令市韩医药博物馆</strong>旁，药田胡同内',
    ],
    parkingTitle: '停车',
    parkingBody:
      '本店没有专用停车场。请使用药令市公共停车场等附近的收费停车场。周末午餐时段建议乘坐地铁。',

    reserveTitle: '预订与咨询',
    reserveLede:
      '预订请致电。可接待 40 人以下团体，可打包外带。午餐时段（12:00–13:30）可能需要等位。',
    reserveCall: '致电 +82 53-255-7052',
    reserveCallSafe: '致电备用号码',
    reserveNaver: 'NAVER 预订',
    reserveBlog: 'NAVER 博客',
    reserveHoursNote: `电话在营业时间内（韩国时间 ${H.open}–${H.close}）接听。`,

    faqTitle: '常见问题',
    faq: [
      { q: '可以预订吗？', a: '可以，请致电预订。也接受 40 人以下的团体预订。电话 +82 53-255-7052。' },
      { q: '有停车场吗？', a: '没有专用停车场。请使用药令市公共停车场等附近的收费停车场。' },
      { q: '有休息时间吗？', a: hasBreak
          ? `有，${H.breakStart}–${H.breakEnd} 为休息时间。${H.close} 打烊。`
          : `没有。从 ${H.open} 到 ${H.close} 连续营业，午餐和晚餐之间的空闲时段也可以来。` },
      { q: '有不辣的菜吗？', a: '清汤解酒汤、排骨汤和水煮牛腱片完全不辣。' },
      { q: '需要排队吗？', a: '工作日午餐（12:00–13:30）和周末较忙。刚开门或傍晚早些时候比较空。' },
      { q: '可以外带吗？', a: '可以。提前致电点餐，到店即可取走。' },
      { q: '有中文菜单吗？', a: '本页面提供中文菜单，把屏幕给店员看即可点单。' },
    ],

    footerTagline: '大邱药田胡同的韩式餐厅',
    footerBiz: '青友解酲 · 大邱广域市中区南城路 11',
    footerCredit: '内装 · 摄影 · 网站制作 : WECO Company',
    footerRights: '© 청우해장. All rights reserved.',
    langLabel: '语言',
  },
};
