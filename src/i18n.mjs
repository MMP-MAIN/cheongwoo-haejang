// ---------------------------------------------------------------------------
// 언어별 문안. 키워드는 네이버 데이터랩 검색량 분석 결과를 반영해 배치했습니다.
// (대구맛집 > 해장국 > 대구여행 > 갈비탕 > 대구중구맛집 > 약령시/서문시장 순)
// ---------------------------------------------------------------------------

import { store, hasBreak, hasLastOrder } from './store.mjs';

// 영업시간은 store.mjs 의 `hours` 하나에서 나옵니다. 아래 문안에 시간을 직접
// 적지 마세요 — 시간이 바뀌면 5개 언어가 서로 어긋납니다.
const H = store.hours;

export const menuNames = {
  // 이름은 네이버 플레이스에 사장님이 등록한 표기를 따릅니다 (2026-08-18).
  ko: {
    naengmyeon: { n: '청우 평양냉면',       d: '양지와 사태만 고집해 12시간 넘게 우려낸 진한 소고기 육수. 여름 한정 메뉴.' },
    galbitang:  { n: '청우 약전 소갈비탕',  d: '진하고 깊은 국물에 부드러운 갈비. 어르신 모시고 오시기 좋은 대표 메뉴.' },
    spicy:      { n: '대구 얼큰해장국 (따로국밥)', d: '소 양지를 48시간 이상 고아 만든 대구식 소고기 국. 얼큰하지만 속을 편안하게 데워 줍니다.' },
    ribs:       { n: '소갈비찜 마늘폭탄',   d: '특제 소스에 마늘을 듬뿍 올린 갈비찜. 대구식 찜갈비의 매운맛 그대로.' },
    oxtail:     { n: '소꼬리찜',            d: '쫄깃한 소꼬리에 아삭한 부추를 곁들인 새콤한 소꼬리찜. 가족 모임·회식 상차림용.' },
    yukhoe:     { n: '육회비빔밥',          d: '신선한 육회에 청우만의 숙성 간장으로 맛을 낸 비빔밥.' },
    clear:      { n: '맑은 해장국 (소고기맑은국)', d: '맑은 국물로 속을 편안하게. 깊고 깔끔한 나주곰탕 스타일의 해장국.' },
    kalguksu:   { n: '얼큰 장칼국수',       d: '된장을 풀어 끓인 얼큰한 칼국수. 겨울 계절 메뉴.' },
    jeongol:    { n: '아롱사태 수육 전골',  d: '아롱사태와 스지를 넣어 끓이는 수육 전골. 2~3인 나눠 먹기 좋습니다.' },
    arong:      { n: '아롱사태 냉채',       d: '푹 삶아 익힌 아롱사태를 새콤달콤한 청우 특제 냉채 소스에 무쳐 냅니다.' },
    suyuk:      { n: '아롱사태 수육',       d: '결 좋은 아롱사태를 삶아 얇게 저며 냅니다. 소 18,000원 · 대 23,000원.' },
  },
  en: {
    naengmyeon: { n: 'Cheongwoo Pyeongyang Naengmyeon', d: 'Cold buckwheat noodles in a rich beef broth simmered 12+ hours from brisket and shank only. Summer seasonal.' },
    galbitang:  { n: 'Galbi-tang (Beef Short Rib Soup)', d: 'Tender short ribs in a deep, rich broth. Mild — good for kids and elders.' },
    spicy:      { n: 'Daegu Spicy Beef Soup (Haejang-guk)', d: 'Daegu-style beef soup — brisket simmered 48+ hours, gently spicy. Warming, not fiery.' },
    ribs:       { n: 'Garlic-Bomb Braised Short Ribs', d: 'Braised short ribs in our house sauce, piled with garlic. Daegu-style spicy jjim-galbi.' },
    oxtail:     { n: 'Braised Oxtail',            d: 'Chewy oxtail with crisp chives in a tangy sauce. A table centrepiece for groups.' },
    yukhoe:     { n: 'Yukhoe Bibimbap (Beef Tartare Rice Bowl)', d: 'Fresh raw beef over rice with our own aged soy dressing.' },
    clear:      { n: 'Clear Beef Soup (Haejang-guk)', d: 'Clean, gentle beef broth in the Naju-gomtang style. No chili.' },
    kalguksu:   { n: 'Spicy Doenjang Kalguksu',   d: 'Hand-cut noodles in a spicy soybean-paste broth. Winter seasonal.' },
    jeongol:    { n: 'Beef Shank Hot Pot (Jeongol)', d: 'Sliced beef shank and tendon in a bubbling hot pot. Good for 2–3.' },
    arong:      { n: 'Chilled Beef Shank (Naengchae)', d: 'Slow-boiled beef shank tossed in our sweet-and-sour chilled dressing. Served cold.' },
    suyuk:      { n: 'Boiled Beef Shank (Suyuk)', d: 'Slow-boiled beef shank, thinly sliced. Not spicy. Small ₩18,000 · Large ₩23,000.' },
  },
  ja: {
    naengmyeon: { n: '清友 平壌冷麺',           d: '牛バラとスネ肉だけで12時間以上煮出した濃厚な牛肉スープの冷麺。夏季限定。' },
    galbitang:  { n: '薬田 牛カルビタン',       d: '濃厚なスープに柔らかいカルビ。辛くないのでお子様やご年配の方にも。' },
    spicy:      { n: '大邱 辛口ヘジャンクク',   d: '牛バラを48時間以上煮込んだ大邱式の牛肉スープ。ピリ辛ですが、体を優しく温めてくれます。' },
    ribs:       { n: 'ニンニク爆弾 牛カルビチム', d: '特製ダレにたっぷりのニンニクをのせた牛カルビの煮込み。大邱式の辛口です。' },
    oxtail:     { n: '牛テールの煮込み',         d: '弾力のある牛テールにシャキシャキのニラ。会食やご家族の集まりに。' },
    yukhoe:     { n: 'ユッケビビンバ',           d: '新鮮なユッケに、自家製の熟成醤油ダレを合わせたビビンバ。' },
    clear:      { n: '澄んだ牛肉スープ',         d: '羅州コムタン風の澄んだ牛骨スープ。辛くないので朝食にも。' },
    kalguksu:   { n: '辛味噌カルグクス',         d: 'テンジャン（味噌）ベースの辛いスープに手打ち麺。冬季限定。' },
    jeongol:    { n: '牛すね肉の鍋（チョンゴル）', d: '牛すね肉とスジを煮込む鍋。2〜3人でシェアできます。' },
    arong:      { n: '牛すね肉の冷菜',           d: 'じっくり茹でた牛すね肉を、自家製の甘酸っぱい冷菜ダレで和えた一品。' },
    suyuk:      { n: '牛すね肉のスユク',         d: 'ゆでた牛すね肉を薄切りに。辛さは一切ありません。小 18,000ウォン・大 23,000ウォン。' },
  },
  zh: {
    naengmyeon: { n: '清友平壤冷面',     d: '只用牛腩和牛腱熬煮12小时以上的浓郁牛肉汤底冷面。夏季限定。' },
    galbitang:  { n: '药田牛排骨汤',     d: '浓郁汤底配软嫩牛排骨，不辣，适合老人和小孩。' },
    spicy:      { n: '大邱香辣牛肉汤（解酒汤）', d: '牛腩熬煮48小时以上的大邱式牛肉汤。微辣，暖胃舒服。' },
    ribs:       { n: '蒜香炸弹炖牛排骨', d: '特制酱汁配满满蒜瓣的炖牛排骨。大邱式辣味。' },
    oxtail:     { n: '炖牛尾',           d: '有嚼劲的牛尾配爽脆韭菜，酸香开胃。适合家庭聚餐。' },
    yukhoe:     { n: '生牛肉拌饭',       d: '新鲜生牛肉配本店秘制熟成酱油汁的拌饭。' },
    clear:      { n: '清汤牛肉汤',       d: '罗州牛骨汤风格的清汤，不辣，暖胃。' },
    kalguksu:   { n: '辣味大酱刀削面',   d: '大酱汤底配手工面条。冬季限定。' },
    jeongol:    { n: '牛腱火锅',         d: '牛腱与牛筋一起煮的火锅，适合 2〜3 人分享。' },
    arong:      { n: '凉拌牛腱',         d: '慢炖牛腱拌上本店特制酸甜凉拌汁，凉着上桌。' },
    suyuk:      { n: '水煮牛腱片',       d: '慢煮牛腱切薄片，完全不辣。小份 18,000 · 大份 23,000 韩元。' },
  },
};

export const galleryAlt = {
  ko: {
    queueDay: '점심시간, 청우해장 앞 약전골목에 줄 선 손님들',
    queue: '저녁 무렵 청우해장 앞에 줄 선 손님들',
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
    queueDay: 'Lunchtime queue outside Cheongwoo Haejang in the herbal alley',
    queue: 'Guests queuing outside Cheongwoo Haejang in the evening',
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
    queueDay: '昼どき、薬田横丁の店の前に並ぶお客さん',
    queue: '夕方、店の前に並ぶお客さん',
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
    queueDay: '午餐时间在药田胡同店门口排队的客人',
    queue: '傍晚在店门口排队的客人',
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
    title: '청우해장 — 대구 약전골목 한식당 | 갈비탕·소갈비찜·평양냉면 · 반월당·동성로 대구맛집',
    description:
      `대구 중구 남성로 청우해장. 약령시 약전골목의 소고기 국물 한식당 — 약전 소갈비탕, 청우 평양냉면(여름), 맑은·얼큰 해장국, 소갈비찜 마늘폭탄, 소꼬리찜. 반월당역 도보 5분, 근대골목투어 코스 대구맛집. 매일 ${H.open}~${H.close}, 전화 예약 053-255-7052.`,
    keywords:
      '대구맛집, 대구 맛집, 대구중구맛집, 반월당 맛집, 반월당역 맛집, 약전골목 맛집, 약령시 맛집, 갈비탕, 맑은갈비탕, 대구 갈비탕, 갈비찜, 매운갈비찜, 소갈비찜, 대구찜갈비, 찜갈비, 대구 찜갈비 맛집, 해장국, 얼큰해장국, 맑은해장국, 대구해장국, 소꼬리찜, 아롱사태수육, 평양냉면, 청우해장, 근대골목투어, 대구근대골목, 동성로 맛집, 서문시장 맛집, 대구여행, 대구 가볼만한곳, 대구10미, 대구 한식당, 가족모임 식당 대구',
    ogLocale: 'ko_KR',
    heroAltFood: '청우해장 대표 메뉴 — 갈비를 산더미로 올린 맑은 갈비탕',

    nav: { menu: '메뉴', story: '이야기', hood: '약전골목', gallery: '매장', visit: '오시는 길', faq: '자주 묻는 질문' },
    navReserve: '전화 예약',
    skip: '본문 바로가기',

    heroBadge: '대구 중구 · 약령시 약전골목',
    heroTitle: '몸을 돌보는 한 그릇,<br>약령시 약전골목에서',
    heroTitles: [
      '몸을 돌보는 한 그릇,<br>약령시 약전골목에서',
      '하루 종일 고아 낸<br>맑은 소고기 국물',
      '해장부터 외식까지,<br>400년 골목의 밥상',
    ],
    heroTitlesSummer: ['여름 한정 별미,<br>청우 평양냉면'],
    heroTitlesWinter: ['속까지 뜨끈하게,<br>겨울 얼큰 장칼국수'],
    heroLede:
      '400년 약령시 골목 안, <strong>청우해장</strong>은 양지와 사태를 하루 종일 고아 낸 맑은 소고기 국물로 <strong>갈비탕</strong>·<strong>해장국</strong>·<strong>평양냉면</strong>을 냅니다. 자극은 덜고 국물은 깊게 — 아침 첫 끼로, 어르신 모시는 상으로, 가족의 든든한 외식으로.',
    heroCtaCall: '전화로 예약하기',
    heroCtaDir: '길찾기',
    heroCtaMap: '약도 보기',
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
    quickParkVal: '전용 주차장 없음 · 약령시서문 공영주차장 도보 1분',

    storyTitle: '청우해장이 지키는 것',
    storyLede:
      '약을 다루던 골목에서 밥을 짓습니다. 화려한 양념보다 오래 고은 국물, 한 그릇으로 속이 편해지는 밥상 — 대구를 찾는 분들과 이 동네 어르신들께 몸이 기억하는 한 끼를 드리는 것이 청우해장의 바람입니다.',
    story: [
      { h: '국물이 먼저입니다', p: '아침마다 양지와 사태를 눌러 국물부터 냅니다. 맑은 해장국은 자극 없이, 얼큰 해장국은 다진 양념을 풀어 얼큰하게. 같은 국물에서 두 갈래로 나갑니다. 「해장」이라는 이름이지만 아침·점심 든든한 한 끼로 오시는 분이 더 많습니다.' },
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
      '지하철 1·2호선 <strong>반월당역</strong> → 「더현대 대구」 방면 출구로 나와 북쪽으로 도보 4분 (18번 출구는 6분)',
      '지하철 1호선 <strong>중앙로역</strong> → 도보 약 8분',
      '<strong>약령시 한의약박물관</strong> 바로 옆 약전골목 안쪽',
    ],
    parkingTitle: '주차',
    parkingBody:
      '매장 전용 주차장은 없지만 바로 옆에 공영주차장이 있습니다. 가장 가까운 약령시서문 공영주차장은 가게에서 도보 1분입니다. 아래 이름을 누르면 길찾기가 열립니다.',

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
      { q: '주차는 어디에 하나요?', a: '매장 전용 주차장은 없지만 약령시서문 공영주차장이 도보 1분 거리에 있습니다. 약령시한의약박물관 주차장(2분), 약령시서편 공영주차장(4분)도 가깝습니다. 「오시는 길」에 길찾기 링크가 있습니다.' },
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
    title: 'Korean Restaurant in Daegu | Cheongwoo Haejang — Daegu Food near Banwoldang (Galbitang, Beef Soup, Naengmyeon)',
    description:
      `Daegu food & travel: Cheongwoo Haejang is a family-run Korean restaurant in Yangnyeongsi, the 400-year-old herbal medicine alley — galbitang (short rib soup), Daegu beef soup, Pyeongyang naengmyeon in summer, braised ribs. English menu, 5 min from Banwoldang Station, open daily ${H.open}–${H.close}. Call +82-53-255-7052.`,
    keywords:
      'Daegu restaurant, Daegu food, what to eat in Daegu, haejang-guk, Korean beef soup, galbitang, Korean beef short rib soup, galbijjim, Daegu braised short ribs, spicy braised ribs, Banwoldang, Yangnyeongsi herbal medicine market, Daegu Modern History Street, Korean restaurant Daegu, Seomun Market food, Daegu 10 tastes',
    ogLocale: 'en_US',
    heroAltFood: 'Galbi-tang at Cheongwoo Haejang — beef short ribs piled in clear broth',

    nav: { menu: 'Menu', story: 'Our Story', hood: 'The Alley', gallery: 'The Room', visit: 'Getting Here', faq: 'FAQ' },
    navReserve: 'Call to book',
    skip: 'Skip to content',

    heroBadge: 'Jung-gu, Daegu · Herbal Medicine Alley',
    heroTitle: 'A bowl that looks after you,<br>in Daegu’s herbal alley.',
    heroTitles: [
      'A bowl that looks after you,<br>in Daegu’s herbal alley.',
      'Beef broth simmered all day —<br>clear, deep, and gentle.',
      'From morning soup to family dinner,<br>steps from Banwoldang.',
    ],
    heroTitlesSummer: ['Summer special —<br>Pyeongyang cold noodles.'],
    heroTitlesWinter: ['Winter warmer —<br>spicy kalguksu noodles.'],
    heroLede:
      'Inside Yangnyeongsi, Daegu’s 400-year-old herbal medicine alley, <strong>Cheongwoo Haejang</strong> serves clear beef broth simmered all day from brisket and shank — short rib soup, beef soup, cold noodles in summer. Less seasoning, deeper broth: breakfast, a meal with elders, a wholesome family lunch.',
    heroCtaCall: 'Call to book',
    heroCtaDir: 'Directions',
    heroCtaMap: 'Sketch map',
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
    quickParkVal: 'No private lot · public car park 1 min away',

    storyTitle: 'What we hold to',
    storyLede:
      'We cook in an alley that once dealt in medicine. Long-simmered broth over heavy seasoning, a table that leaves you settled rather than stuffed — our hope is that visitors to Daegu and the neighbourhood’s elders remember one honest bowl.',
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
      '<strong>Banwoldang Station</strong> (Lines 1 & 2) → take the exit toward The Hyundai Daegu, then 4 min north on foot',
      '<strong>Jungangno Station</strong> (Line 1) → about 8 min on foot',
      'Inside Yakjeon-golmok, next to the <strong>Yangnyeongsi Herbal Medicine Museum</strong>',
    ],
    parkingTitle: 'Parking',
    parkingBody:
      'We have no private car park, but the Yangnyeongsi West Gate public car park is a 1-minute walk away. Tap a name below for directions.',

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
      { q: 'What food is Daegu famous for?', a: 'Daegu’s signature dishes are jjim-galbi (spicy braised short ribs), ttaro-gukbap (Daegu-style beef soup) and Pyeongyang-style naengmyeon in summer — all on our menu, a 5-minute walk from Banwoldang Station in the Yangnyeongsi herbal alley.' },
      { q: 'What are the best things to see near the restaurant?', a: 'We sit inside Yangnyeongsi Herbal Medicine Alley, one of Daegu’s best-known tourist attractions. Within a 15-minute walk you can visit the Modern History Alley (Cheongna Hill, Gyesan Cathedral) and Seomun Market — easy places to visit on a half-day Daegu travel itinerary, with our table as the lunch stop.' },
      { q: 'Can I make a reservation?', a: 'Yes, by phone. We accept group bookings for up to 40 people. Call +82 53-255-7052.' },
      { q: 'Is there parking?', a: 'No private car park, but the Yangnyeongsi West Gate public car park is a 1-minute walk away, with 2–3 more within 2–4 minutes. See “Getting here” for directions links.' },
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
    title: '大邱グルメ・大邱観光の食事に｜チョンウヘジャン — 薬令市の韓国料理店（半月堂 ランチ・カルビタン・冷麺）',
    description:
      `大邱観光・大邱グルメなら薬令市の韓国料理店チョンウヘジャン。半月堂のランチにも。牛骨をじっくり煮出したカルビタン、大邱式ヘジャンクク、夏は平壌冷麺、辛口カルビチム。日本語メニューあり。半月堂駅から徒歩5分、近代路地ツアーの途中に。毎日${H.open}〜${H.close}、電話予約 +82-53-255-7052。`,
    keywords:
      '大邱 グルメ, 大邱 レストラン, 大邱 韓国料理, 大邱 名物, ヘジャンクク, カルビタン, カルビチム, 大邱 カルビチム, 辛口カルビチム, 半月堂, 薬令市, 大邱 近代路地, 大邱 旅行, 西門市場 グルメ, 東城路 グルメ, 大邱十味',
    ogLocale: 'ja_JP',
    heroAltFood: 'チョンウヘジャンのカルビタン — 骨付きカルビが山盛りの澄んだスープ',

    nav: { menu: 'メニュー', story: 'お店について', hood: '薬田横丁', gallery: '店内', visit: 'アクセス', faq: 'よくある質問' },
    navReserve: '電話で予約',
    skip: '本文へ',

    heroBadge: '大邱・中区 薬令市 薬田横丁',
    heroTitle: '体をいたわる一杯を、<br>薬令市の薬田横丁で。',
    heroTitles: [
      '体をいたわる一杯を、<br>薬令市の薬田横丁で。',
      '一日かけて煮出した、<br>澄んだ深い牛スープ。',
      '朝の一杯から家族の食事まで、<br>400年の路地の食卓。',
    ],
    heroTitlesSummer: ['夏限定の名物、<br>平壌冷麺。'],
    heroTitlesWinter: ['冬は熱々の<br>ピリ辛カルグクス。'],
    heroLede:
      '400年の歴史をもつ薬令市の路地で、<strong>チョンウヘジャン</strong>は牛バラとスネ肉を一日かけて煮出した澄んだスープをお出しします。カルビタン、ヘジャンクク、夏は平壌冷麺。刺激は控えめに、スープは深く — 朝食に、ご年配の方との食事に、家族の健やかな外食に。',
    heroCtaCall: '電話で予約',
    heroCtaDir: '道順を見る',
    heroCtaMap: '略図を見る',
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
    quickParkVal: '専用駐車場なし · 徒歩1分に公営駐車場',

    storyTitle: '私たちが大切にしていること',
    storyLede:
      'かつて薬を商った路地で、ご飯を炊いています。派手な味付けよりも長く煮出したスープ、一杯で体が落ち着く食卓 — 大邱を訪れる方と地元のご年配の方に、体が覚えている一食をお届けするのが私たちの願いです。',
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
      '地下鉄1・2号線 <strong>半月堂駅</strong> → 「ザ・現代 大邱」方面の出口から北へ徒歩4分',
      '地下鉄1号線 <strong>中央路駅</strong> → 徒歩約8分',
      '<strong>薬令市韓医薬博物館</strong>のすぐ隣、薬田横丁の中',
    ],
    parkingTitle: '駐車場',
    parkingBody:
      '専用駐車場はございませんが、薬令市西門公営駐車場が徒歩1分です。下の名前をタップすると経路案内が開きます。',

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
      { q: '大邱観光でおすすめの食事は？', a: '大邱の名物はカルビチム（辛口の牛カルビ煮込み）、タロクッパ（大邱式牛肉スープ）、夏の平壌冷麺。当店で全部召し上がれます。半月堂駅から徒歩5分、薬令市の路地です。' },
      { q: '近くの大邱観光スポットは？', a: '当店は大邱旅行で人気の観光地・薬令市の路地の中にあります。徒歩15分圏内に近代文化横丁（青蘿の丘・桂山聖堂）や西門市場があり、テグ観光の合間の食事にちょうど良い立地です。' },
      { q: '予約はできますか。', a: 'はい、お電話で承ります。40名以下の団体予約も可能です。+82 53-255-7052 までどうぞ。' },
      { q: '駐車場はありますか。', a: '専用駐車場はありませんが、薬令市西門公営駐車場が徒歩1分です。他にも徒歩2〜4分に2〜3か所あります。「アクセス」に経路リンクがあります。' },
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
    title: '大邱美食・大邱旅游必吃｜青友解酲 — 药令市韩式餐厅（近代胡同旁・半月堂站）',
    description:
      `大邱美食推荐：药令市（药田胡同）的韩式餐厅青友解酲。慢熬牛骨排骨汤、大邱式牛肉汤、夏季平壤冷面、辣炖牛排骨。有中文菜单。半月堂站步行5分钟，近代胡同游览路线上。每天 ${H.open}–${H.close} 营业，电话预订 +82-53-255-7052。`,
    keywords:
      '大邱美食, 大邱美食推荐, 大邱必吃, 大邱餐厅, 大邱韩餐, 大邱自由行, 解酒汤, 排骨汤, 炖排骨, 辣炖排骨, 大邱炖排骨, 半月堂, 药令市, 大邱近代胡同, 大邱旅游, 大邱景点, 西门市场美食, 东城路美食, 大邱十味',
    ogLocale: 'zh_CN',
    heroAltFood: '青友解酲的排骨汤 — 清汤里堆满牛排骨',

    nav: { menu: '菜单', story: '关于我们', hood: '药田胡同', gallery: '店内', visit: '交通', faq: '常见问题' },
    navReserve: '电话预订',
    skip: '跳到正文',

    heroBadge: '大邱中区 · 药令市药田胡同',
    heroTitle: '一碗照顾身体的汤，<br>在药令市药田胡同。',
    heroTitles: [
      '一碗照顾身体的汤，<br>在药令市药田胡同。',
      '慢炖一整天的牛肉清汤，<br>清澈而醇厚。',
      '从早餐解酒汤到家庭聚餐，<br>400年老巷的餐桌。',
    ],
    heroTitlesSummer: ['夏季限定，<br>平壤冷面'],
    heroTitlesWinter: ['冬天来一碗<br>热辣刀削面'],
    heroLede:
      '在有 400 年历史的药令市胡同里，<strong>青友解酲</strong>用牛腩和牛腱熬上一整天的清汤，做排骨汤、牛肉汤，夏天有平壤冷面。少些刺激，多些汤的深度 — 早餐、陪长辈用餐、一家人安心的外食。',
    heroCtaCall: '电话预订',
    heroCtaDir: '查看路线',
    heroCtaMap: '查看简图',
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
    quickParkVal: '无专用停车场 · 步行1分钟有公共停车场',

    storyTitle: '我们坚持的',
    storyLede:
      '在曾经卖药的胡同里做饭。比起浓重调味，我们更看重久熬的汤，一碗下去让身体舒坦的一餐 — 让来大邱的客人和街坊长辈记住一碗踏实的汤，是青友解酲的心愿。',
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
      '地铁1、2号线 <strong>半月堂站</strong> → 从往 The Hyundai 大邱的出口出来向北步行 4 分钟',
      '地铁1号线 <strong>中央路站</strong> → 步行约8分钟',
      '<strong>药令市韩医药博物馆</strong>旁，药田胡同内',
    ],
    parkingTitle: '停车',
    parkingBody:
      '本店没有专用停车场，但药令市西门公共停车场步行仅 1 分钟。点击下方名称即可打开导航。',

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
      { q: '大邱必吃美食有哪些？', a: '大邱的招牌是炖排骨（辣味牛排骨）、大邱式牛肉汤（따로국밥）和夏天的平壤冷面 — 本店都有。半月堂站步行5分钟，就在药令市胡同里。' },
      { q: '可以预订吗？', a: '可以，请致电预订。也接受 40 人以下的团体预订。电话 +82 53-255-7052。' },
      { q: '有停车场吗？', a: '没有专用停车场，但药令市西门公共停车场步行仅 1 分钟，附近还有 2〜3 个停车场。「交通」区有导航链接。' },
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
