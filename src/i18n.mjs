// ---------------------------------------------------------------------------
// 언어별 문안. 키워드는 네이버 데이터랩 검색량 분석 결과를 반영해 배치했습니다.
// (대구맛집 > 해장국 > 대구여행 > 갈비탕 > 대구중구맛집 > 약령시/서문시장 순)
// ---------------------------------------------------------------------------

import { store, hasBreak, hasLastOrder, menu } from './store.mjs';

// 영업시간은 store.mjs 의 `hours` 하나에서 나옵니다. 아래 문안에 시간을 직접
// 적지 마세요 — 시간이 바뀌면 5개 언어가 서로 어긋납니다.
const H = store.hours;
// 가격도 store.mjs 의 menu 하나에서 나옵니다 (네이버 플레이스 기준). 문안에 숫자로 적지 마세요.
const W = (id) => `${menu.find((m) => m.id === id).price.toLocaleString('ko-KR')}원`;

export const menuNames = {
  // 이름은 네이버 플레이스에 사장님이 등록한 표기를 따릅니다 (2026-08-18).
  ko: {
    naengmyeon: { n: '청우 평양냉면',       d: '양지와 사태만 고집해 오래 우려낸 진한 소고기 육수. 여름 한정 메뉴.' },
    galbitang:  { n: '청우 약전 소갈비탕',  d: '맑은 소고기 국물에 기본 갈빗대 2대. 갈비가 부드러워 어르신·아이와 드시기 좋습니다. 이름의 「약전」은 약전골목에서 따왔습니다.' },
    spicy:      { n: '대구 얼큰해장국 (따로국밥)', d: '양지와 사태를 하루 종일 고아 만든 대구식 얼큰한 소고기 국. 따로국밥 계보의 맛입니다.' },
    ribs:       { n: '소갈비찜 마늘폭탄',   d: '특제 소스에 마늘을 듬뿍 올린 갈비찜. 대구식 찜갈비의 매운맛 그대로.' },
    oxtail:     { n: '소꼬리찜',            d: '쫄깃한 소꼬리에 아삭한 부추를 곁들인 새콤한 소꼬리찜. 가족 모임·회식 상차림용.' },
    yukhoe:     { n: '육회비빔밥',          d: '신선한 육회에 숙성 간장으로 맛을 낸 비빔밥. 매장에서만 드실 수 있습니다(포장 불가).' },
    clear:      { n: '맑은 해장국 (소고기맑은국)', d: '고춧가루 없이 맑고 깔끔한 소고기 국물. 나주곰탕 스타일이라 맵지 않습니다.' },
    kalguksu:   { n: '얼큰 장칼국수',       d: '소고기 국물에 제면소 수제면으로 끓인 얼큰한 칼국수. 가을·겨울 메뉴, 매장에서만 드실 수 있습니다.' },
    jeongol:    { n: '아롱사태 수육 전골',  d: '아롱사태와 스지를 넣어 끓이는 수육 전골. 2~3인 나눠 먹기 좋습니다.' },
    arong:      { n: '아롱사태 냉채',       d: '푹 삶아 익힌 아롱사태를 새콤달콤한 청우 특제 냉채 소스에 무쳐 냅니다.' },
    suyuk:      { n: '아롱사태 수육',       d: '결 좋은 아롱사태를 삶아 얇게 저며 냅니다. 소 18,000원 · 대 23,000원.' },
  },
  en: {
    naengmyeon: { n: 'Cheongwoo Pyeongyang Naengmyeon', d: 'Cold buckwheat noodles in a rich, slow-simmered beef broth. Summer seasonal.' },
    galbitang:  { n: 'Galbi-tang (Beef Short Rib Soup)', d: 'Tender short ribs in a deep, rich broth. Mild — good for kids and elders.' },
    spicy:      { n: 'Daegu Spicy Beef Soup (Haejang-guk)', d: 'Daegu-style beef soup — beef and beef bones simmered all day, gently spicy. Warming, not fiery.' },
    ribs:       { n: 'Garlic-Bomb Braised Short Ribs', d: 'Braised short ribs in our house sauce, piled with garlic. Daegu-style spicy jjim-galbi.' },
    oxtail:     { n: 'Braised Oxtail',            d: 'Chewy oxtail with crisp chives in a tangy sauce. A table centrepiece for groups.' },
    yukhoe:     { n: 'Yukhoe Bibimbap (Beef Tartare Rice Bowl)', d: 'Fresh raw beef over rice with our own aged soy dressing.' },
    clear:      { n: 'Clear Beef Soup (Haejang-guk)', d: 'Clean, gentle beef broth in the Naju-gomtang style. No chili.' },
    kalguksu:   { n: 'Spicy Doenjang Kalguksu',   d: 'Handmade noodles in a spicy soybean-paste broth. Autumn–winter seasonal.' },
    jeongol:    { n: 'Beef Shank Hot Pot (Jeongol)', d: 'Sliced beef shank and tendon in a bubbling hot pot. Good for 2–3.' },
    arong:      { n: 'Chilled Beef Shank (Naengchae)', d: 'Slow-boiled beef shank tossed in our sweet-and-sour chilled dressing. Served cold.' },
    suyuk:      { n: 'Boiled Beef Shank (Suyuk)', d: 'Slow-boiled beef shank, thinly sliced. Not spicy. Small ₩18,000 · Large ₩23,000.' },
  },
  ja: {
    naengmyeon: { n: '清友 平壌冷麺',           d: '牛肉だけでじっくり煮出した濃厚な牛肉スープの冷麺。夏季限定。' },
    galbitang:  { n: '薬田 牛カルビタン',       d: '濃厚なスープに柔らかいカルビ。辛くないのでお子様やご年配の方にも。' },
    spicy:      { n: '大邱 辛口ヘジャンクク',   d: '牛肉と牛骨を一日中煮込んだ大邱式の牛肉スープ。ピリ辛ですが、体を優しく温めてくれます。' },
    ribs:       { n: 'ニンニク爆弾 牛カルビチム', d: '特製ダレにたっぷりのニンニクをのせた牛カルビの煮込み。大邱式の辛口です。' },
    oxtail:     { n: '牛テールの煮込み',         d: '弾力のある牛テールにシャキシャキのニラ。会食やご家族の集まりに。' },
    yukhoe:     { n: 'ユッケビビンバ',           d: '新鮮なユッケに、自家製の熟成醤油ダレを合わせたビビンバ。' },
    clear:      { n: '澄んだ牛肉スープ',         d: '羅州コムタン風の澄んだ牛骨スープ。辛くないので朝食にも。' },
    kalguksu:   { n: '辛味噌カルグクス',         d: 'テンジャン（味噌）ベースの辛いスープに手作りの麺。秋冬限定。' },
    jeongol:    { n: '牛すね肉の鍋（チョンゴル）', d: '牛すね肉とスジを煮込む鍋。2〜3人でシェアできます。' },
    arong:      { n: '牛すね肉の冷菜',           d: 'じっくり茹でた牛すね肉を、自家製の甘酸っぱい冷菜ダレで和えた一品。' },
    suyuk:      { n: '牛すね肉のスユク',         d: 'ゆでた牛すね肉を薄切りに。辛さは一切ありません。小 18,000ウォン・大 23,000ウォン。' },
  },
  zh: {
    naengmyeon: { n: '清友平壤冷面',     d: '用牛肉慢火熬煮的浓郁牛肉汤底冷面。夏季限定。' },
    galbitang:  { n: '药田牛排骨汤',     d: '浓郁汤底配软嫩牛排骨，不辣，适合老人和小孩。' },
    spicy:      { n: '大邱香辣牛肉汤（解酒汤）', d: '牛肉和牛骨熬煮一整天的大邱式牛肉汤。微辣，暖胃舒服。' },
    ribs:       { n: '蒜香炸弹炖牛排骨', d: '特制酱汁配满满蒜瓣的炖牛排骨。大邱式辣味。' },
    oxtail:     { n: '炖牛尾',           d: '有嚼劲的牛尾配爽脆韭菜，酸香开胃。适合家庭聚餐。' },
    yukhoe:     { n: '生牛肉拌饭',       d: '新鲜生牛肉配本店秘制熟成酱油汁的拌饭。' },
    clear:      { n: '清汤牛肉汤',       d: '罗州牛骨汤风格的清汤，不辣，暖胃。' },
    kalguksu:   { n: '辣味大酱刀切面',   d: '大酱汤底配手工面条。秋冬限定。' },
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
    menuwall: '墙上菜单 — 辣味大酱刀切面、香辣与清汤解酒汤',
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
    title: '청우해장 — 대구 약전골목 한식당 | 갈비탕·소갈비찜·따로국밥 · 반월당·동성로 대구맛집',
    description:
      `대구 중구 약령시 약전골목 한식당 청우해장 — 청우 약전 소갈비탕, 소갈비찜 마늘폭탄, 대구 얼큰해장국(따로국밥)·맑은 해장국, 소꼬리찜. 더현대 대구 도보 약 6분·반월당역 약 7분, 근대골목투어 대구맛집. 매일 ${H.open}~${H.close}${hasBreak ? `(브레이크 ${H.breakStart.slice(0, 2)}–${H.breakEnd.slice(0, 2)}시)` : ''}, 053-255-7052.`,
    keywords:
      '대구맛집, 대구 맛집, 대구 맛집 추천, 대구 소고기 맛집, 대구 점심 맛집, 동성로 맛집, 더현대 대구 맛집, 대구 가볼만한 곳, 육회비빔밥, 대구 한식당, 대구 한식 맛집, 대구 시내 맛집, 대구중구맛집, 대구 종로 맛집, 반월당 맛집, 반월당역 맛집, 약전골목 맛집, 대구 수육, 아롱사태 수육, 소꼬리찜, 아롱사태수육, 청우해장, 근대골목투어, 대구근대골목, 서문시장 맛집, 대구여행, 대구 가볼만한곳',
    ogLocale: 'ko_KR',
    heroAltFood: '청우 약전 소갈비탕 — 맑은 소고기 국물에 소갈비',

    nav: { menu: '메뉴', story: '이야기', hood: '약전골목', gallery: '매장', visit: '오시는 길', faq: '자주 묻는 질문' },
    navReserve: '전화 예약·문의',
    skip: '본문 바로가기',

    heroBadge: '대구 약전골목 · 소고기 해장국·갈비탕·찜갈비',
    heroTitle: '부드러운 갈비탕부터<br>얼큰한 해장국까지',
    heroTitles: [
      '부드러운 갈비탕부터<br>얼큰한 해장국까지',
      '맑은 해장국도,<br>얼큰한 해장국도',
      '약령시 골목 한 집에서<br>따로국밥도, 찜갈비도',
    ],
    heroTitlesSummer: ['여름 한정 별미,<br>청우 평양냉면'],
    heroTitlesWinter: ['속까지 뜨끈하게,<br>얼큰 장칼국수'],
    heroLede:
      `<strong>맑은 해장국</strong> ${W('clear')} · <strong>대구 얼큰해장국</strong> ${W('spicy')} · <strong>소갈비탕</strong> ${W('galbitang')}. 혼자 오셔도, 두 분이 하나씩 나눠 드셔도 좋습니다.`,
    heroNote: '부모님·아이와도 편하게 오세요. 차는 약령시서문 공영주차장(도보 1분)에 세우시면 됩니다.',
    heroCtaCall: '전화 예약·문의',
    heroCtaDir: '길찾기',
    heroCtaMap: '가는 길 약도',
    heroCtaMenu: '메뉴·가격 보기',
    heroScroll: '아래로',

    whyKicker: '이래서 청우해장',
    whyTitle: '입맛이 달라도 한 상에서',
    why: [
      { h: '맑게도, 얼큰하게도', p: '맑은 국물과 얼큰한 국물, 입맛대로 고르시거나 하나씩 시켜 나눠 드세요.', line: `맑은 해장국 ${W('clear')} · 대구 얼큰해장국 ${W('spicy')}` },
      { h: '혼자 오셔도 편하게', p: '자리에서 테이블오더로 바로 주문하시고, 반찬은 셀프바에서 원하는 만큼 더 드세요.', line: '해장국·갈비탕·육회비빔밥은 1인분씩 · 홀 40석' },
      { h: '부모님·아이와 함께', p: '부드러운 소갈비탕에 아롱사태 수육을 곁들이면 온 가족이 한 상에서 나눠 드시기 좋습니다.', line: `<a href="#menu">청우 약전 소갈비탕 ${W('galbitang')}(기본 갈빗대 2대) · 아롱사태 수육 ${W('suyuk')}부터</a>` },
    ],
    whyProof: '네이버 방문자 리뷰 「혼밥하기 좋아요」 607표 · 「매장이 청결해요」 885표 (2026-10-02 기준)',

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

    storyTitle: '처음 오시는 분께',
    storyLede:
      '무엇을 고를지, 누구와 오면 좋을지 미리 적어 두었습니다.',
    story: [
      { h: '맑은 국물, 얼큰한 국물', p: `맑은 해장국(${W('clear')})은 고춧가루 없이 맑고 깔끔하게, 대구 얼큰해장국(${W('spicy')})은 얼큰하게 냅니다. 둘 다 소고기 양지·사태를 오래 고아 낸 국물입니다. 고르기 어려우시면 두 분이 하나씩 시켜 나눠 드셔 보세요. 「해장」이라는 이름이지만 아침·점심 든든한 한 끼로도 좋습니다.` },
      { h: '부모님·아이와 오실 때', p: `청우 약전 소갈비탕(${W('galbitang')})은 기본 갈빗대 2대에 맑은 국물을 부어 냅니다. 아롱사태 수육(소 ${W('suyuk')} · 대 23,000원)을 곁들이면 어르신·아이와 한 상에서 나눠 드시기 좋습니다.` },
      { h: '약령시 골목 구경길에', p: '약령시 한의약박물관에서 걸어서 약 3분, 진골목에서 약 8분, 반월당역 15번 출구에서 약 7분입니다. 360년 넘게 이어 온 대구약령시, 그 약전골목 안에 청우해장은 2016년에 문을 열었습니다. 메뉴 이름의 「약전」도 이 골목 이름에서 따왔고, 국물은 소고기 양지·사태로 냅니다.' },
      { h: '모임은 전화로 먼저', p: `홀은 40석이고 별도 룸은 없습니다. 단체는 40명까지 전화(053-255-7052)로 받습니다. 상 가운데 소꼬리찜(${W('oxtail')})이나 아롱사태 수육 전골(${W('jeongol')})을 두고 국·탕을 곁들이시면 한 상이 됩니다. 인원에 맞는 양은 전화로 여쭤 주세요.` },
      { h: '따로국밥의 뿌리, 대구탕반', p: '1929년 잡지 《별건곤》은 「대구의 자랑, 대구탕반」이라는 글을 실었습니다. 밥을 따로 내는 따로국밥이 그 계보를 이어, 지금은 <a href="daegu-10mi.html" data-track="guide" data-track-label="home-story-10mi" style="text-decoration:underline">대구 10미</a> 가운데 하나입니다. 청우해장의 대구 얼큰해장국은 이 대구식 소고기 국을 따릅니다.' },
    ],

    menuTitle: '대표 메뉴',
    menuLede: `처음이시면 많이 주문하시는 청우 약전 소갈비탕(${W('galbitang')}, 기본 갈빗대 2대)이나 대구 얼큰해장국(${W('spicy')})부터 보세요. 해장국·갈비탕·육회비빔밥은 1인분씩 주문하실 수 있습니다.`,
    menuSignature: '대표',
    menuAsk: '가격 문의',
    menuNote: '※ 매장 사정에 따라 일부 메뉴는 조기 소진될 수 있습니다.',

    galleryTitle: '매장',
    galleryLede: '1층 홀 40석입니다. 자리에서 테이블오더로 주문하시고, 반찬은 셀프바에서 가져다 드시면 됩니다.',

    visitTitle: '오시는 길',
    visitLede: `반월당역 15번 출구에서 걸어서 약 7분, 더현대 대구에서 약 6분입니다. 차로 오시면 약령시서문 공영주차장(도보 1분)을 이용해 주세요. 가게 앞에는 세울 수 없습니다.${hasLastOrder ? ` 주문은 ${H.lastOrder}까지 받습니다.` : ''}`,
    visitNaver: '네이버지도 길찾기',
    visitKakao: '카카오맵 길찾기',
    visitGoogle: '구글지도 길찾기',
    visitCopy: '주소 복사',
    visitCopied: '주소를 복사했습니다',
    mapAlt: '청우해장 위치 지도',
    transitTitle: '대중교통',
    transit: [
      '지하철 1·2호선 <strong>반월당역</strong> 15번 출구 → 도보 약 7분 (약 500m)',
      '<strong>더현대 대구</strong> → 백화점 옆 골목을 따라 북쪽으로, 한의약박물관을 지나 도보 약 6분 (약 380m)',
      '지하철 1호선 <strong>중앙로역</strong> → 도보 약 10분',
      '<strong>약령시 한의약박물관</strong>에서 도보 약 3분, 약전골목 안쪽',
    ],
    parkingTitle: '주차',
    parkingBody:
      '매장 전용 주차장은 없습니다. 약령시서문 공영주차장이 가게에서 도보 1분이고, 근처 공영주차장이 몇 곳 더 있습니다. 아래 이름을 누르면 길찾기가 열립니다.',

    reserveTitle: '예약 · 문의',
    reserveLede:
      `예약 없이 오셔도 되고, 전화로 예약하셔도 됩니다. 단체는 40명까지 받습니다(별도 룸 없음). 포장은 전화로 미리 주문해 주세요. 육회비빔밥·장칼국수는 포장이 안 되고, 배달은 하지 않습니다. 점심 12:00~13:30, 특히 주말에는 자리가 찰 수 있어 ${H.open} 오픈 직후가 비교적 여유롭습니다.`,
    reserveCall: '053-255-7052 로 전화',
    reserveCallSafe: '안심번호로 전화',
    reserveNaver: '네이버 예약',
    reserveBlog: '네이버 블로그',
    reserveHoursNote: `전화는 영업시간(${H.open}~${H.close}) 중에 받습니다.`,

    faqTitle: '자주 묻는 질문',
    faq: [
      { q: '예약이 되나요?', a: '네, 전화 예약을 받습니다. 홀은 40석이고 단체는 40명까지 예약할 수 있습니다. 별도의 방(룸)은 없으니 053-255-7052로 날짜·인원·도착 시간을 미리 알려 주세요.' },
      { q: '반월당역 몇 번 출구에서 가깝나요?', a: '반월당역(1·2호선) 15번 출구에서 약 500m, 도보 약 7분입니다. 더현대 대구에서는 도보 약 6분, 중앙로역에서는 약 10분입니다.' },
      { q: '주차는 어디에 하나요?', a: '매장 전용 주차장은 없고 가게 앞에도 주차할 수 없습니다. 약령시서문 공영주차장이 도보 1분 거리에 있습니다. 약령시한의약박물관 주차장(2분), 약령시서편 공영주차장(4분)도 가깝습니다. 「오시는 길」에 길찾기 링크가 있습니다.' },
      { q: '브레이크타임이 있나요?', a: hasBreak
          ? `네, ${H.breakStart}~${H.breakEnd} 이 브레이크타임입니다. 마감은 ${H.close}${hasLastOrder ? `, 라스트오더는 ${H.lastOrder}` : ''} 입니다.`
          : `브레이크타임 없이 ${H.open}부터 ${H.close}까지 계속 영업합니다. 점심과 저녁 사이 한가한 시간에 오셔도 됩니다.` },
      { q: '맵지 않은 메뉴도 있나요?', a: '맑은 해장국(고춧가루 없는 맑은 국물), 청우 약전 소갈비탕, 아롱사태 수육은 맵지 않습니다. 어르신이나 아이와 함께 오셔도 괜찮습니다.' },
      { q: '웨이팅이 많나요?', a: '평일 점심(12:00~13:30)과 주말에는 대기가 있는 편입니다. 오픈 직후나 저녁 이른 시간이 여유롭습니다.' },
      { q: '포장이 되나요?', a: '네, 포장 가능합니다. 전화로 미리 주문해 두시면 기다리지 않고 가져가실 수 있습니다. 육회비빔밥과 얼큰 장칼국수는 포장이 안 되고, 그 밖의 메뉴는 주문하실 때 여쭤 주세요. 배달은 하지 않습니다.' },
      { q: '외국어 메뉴가 있나요?', a: '이 홈페이지에서 영어·일본어·중국어로 메뉴를 확인하실 수 있습니다. 매장 직원에게 화면을 보여주셔도 됩니다.' },
      { q: '대구 10미 따로국밥과 찜갈비를 한 곳에서 먹을 수 있나요?', a: '네. 따로국밥 계보의 대구 얼큰해장국(13,000원)과 동인동식 매운 찜갈비인 소갈비찜 마늘폭탄(22,000원)을 한 상에서 드실 수 있습니다. 가게는 동인동이 아니라 약령시 약전골목 안(남성로 11)입니다.' },
      { q: '동성로나 동인동에 있는 가게인가요?', a: '아닙니다. 대구 중구 남성로 11, 약령시 약전골목 안에 있습니다. 동성로 중심에서 도보 약 15분, 중앙로역에서 약 10분, 서문시장에서 동쪽으로 약 16분(약 1km)이고, 동인동 찜갈비 골목까지는 약 30분 거리입니다.' },
      { q: '비 오거나 쌀쌀한 날 먹기 좋은 메뉴가 있나요?', a: '뜨끈한 소고기 국물이 있습니다. 청우 약전 소갈비탕(16,000원)과 맑은 해장국(12,000원), 얼큰한 대구 얼큰해장국(따로국밥, 13,000원)을 내고, 가을·겨울 계절 메뉴로 얼큰 장칼국수(12,000원, 매장 식사만)도 있습니다. 반월당역 15번 출구에서 도보 약 7분, 더현대 대구에서 약 6분입니다.' },
      { q: '혼자 가도 되나요? 직장인 점심으로도 괜찮나요?', a: '네. 대구 얼큰해장국·맑은 해장국·청우 약전 소갈비탕·육회비빔밥(14,000원)은 모두 1인분 메뉴라 혼자 드시기 편하고, 자리에서 테이블오더로 바로 주문하실 수 있습니다. 평일 점심 12:00~13:30에는 대기가 있을 수 있어, 점심시간이 빠듯하면 11시 오픈 직후나 13:30 이후(브레이크 15:00 전)가 여유롭습니다.' },
      { q: '저녁 8시쯤 가도 식사할 수 있나요?', a: '네. 저녁은 17:00부터 22:00까지이고 라스트오더는 21:00입니다. 늦게 오실 때 꼭 드시고 싶은 메뉴가 있으면 053-255-7052로 미리 확인해 주세요.' },
      { q: '아이와 함께 가도 되나요?', a: '네. 맑은 해장국과 청우 약전 소갈비탕은 맵지 않은 맑은 국물이라 아이와 나눠 드시기 좋습니다.' },
      { q: '부모님 모시고 가기 좋은, 자극적이지 않은 소고기 요리가 있나요?', a: '청우 약전 소갈비탕(16,000원), 아롱사태 수육(소 18,000원·대 23,000원), 맑은 해장국(12,000원)은 맵지 않은 소고기 요리입니다. 수육을 가운데 두고 탕을 곁들이면 온 가족이 한 상에서 드실 수 있습니다.' },
      { q: '오래된 가게인가요?', a: '골목은 360년 넘은 약령시 약전골목이지만, 청우해장은 2016년에 문을 열었습니다.' },
      { q: '주문은 어떻게 하나요? 반찬은 더 먹을 수 있나요?', a: '자리에 앉아 테이블오더로 주문하시면 됩니다. 반찬은 셀프바에서 직접 더 가져다 드실 수 있습니다.' },
      { q: '갈비탕에 고기는 얼마나 들어가나요?', a: '청우 약전 소갈비탕(16,000원)에는 기본으로 갈빗대 2대가 들어갑니다. 부드럽게 익힌 소갈비에 맑은 소고기 국물을 부어 냅니다.' },
      { q: '국물에 한약재가 들어가나요?', a: '아니요. 메뉴 이름의 「약전」은 가게가 있는 약전골목에서 따온 이름입니다. 국물은 양지와 사태로 낸 소고기 국물이고 한약재는 넣지 않습니다.' },
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
    title: 'Cheongwoo Haejang | Korean Beef Soup & Galbitang in Daegu',
    description:
      `Beef-soup restaurant in Daegu's 360-year-old Yangnyeongsi herbal alley: galbitang, spicy beef soup, braised ribs. About 7 min from Banwoldang. English menu.`,
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
      'From morning soup to family dinner,<br>a short walk from Banwoldang.',
    ],
    heroTitlesSummer: ['Summer special —<br>Pyeongyang cold noodles.'],
    heroTitlesWinter: ['Cold-weather warmer —<br>spicy kalguksu noodles.'],
    heroLede:
      'Inside Yangnyeongsi, Daegu’s 360-year-old herbal medicine alley, <strong>Cheongwoo Haejang</strong> serves clear beef broth simmered all day from beef and beef bones — short rib soup and beef soup. Less seasoning, deeper broth: breakfast, a meal with elders, a wholesome family lunch.',
    // 여름 메뉴(냉면) 판매 중일 때만 쓰는 문단 — build.mjs 의 SUMMER_ON
    heroLedeSummer:
      'Inside Yangnyeongsi, Daegu’s 360-year-old herbal medicine alley, <strong>Cheongwoo Haejang</strong> serves clear beef broth simmered all day from beef and beef bones — short rib soup, beef soup, cold noodles in summer. Less seasoning, deeper broth: breakfast, a meal with elders, a wholesome family lunch.',
    heroNote: 'Our spicy beef soup carries the lineage of <strong>Daegu tangban</strong>, praised as “Daegu’s pride” in 1929 — one of Daegu’s 10 delicacies, in the herbal alley.',
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
      { h: 'Daegu tangban, a name 100 years old', p: 'In 1929 the magazine Byeolgeongon ran a piece titled “Daegu’s pride, Daegu tangban”: a red beef soup simmered for hours with heaps of green onion, already so well known that Seoul restaurants hung “Daegu-tang” signs. After 1945 it became ttaro gukbap — rice served separately — now one of Daegu’s 10 delicacies. Our Daegu spicy beef soup sits on that lineage: the same long-simmered beef broth, cooked in the old heart of the city where it was first sold.' },
      { h: 'The broth comes first', p: 'Beef and beef bones go on every morning. The clear haejang-guk is gentle and not spicy; the spicy version is the same broth with our own chili paste stirred in.' },
      { h: 'Easy for elders and children', p: 'The clear short rib soup and the boiled beef shank carry no chili at all. Good for birthdays and family holidays.' },
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
    visitLede: 'About a 7-minute walk from Banwoldang Station (Metro Lines 1 & 2, Exit 15) and 6 minutes from The Hyundai Daegu, just past the Yangnyeongsi Herbal Medicine Museum.',
    visitNaver: 'Open in Naver Map',
    visitKakao: 'Open in KakaoMap',
    visitGoogle: 'Open in Google Maps',
    visitCopy: 'Copy address',
    visitCopied: 'Address copied',
    mapAlt: 'Map showing the location of Cheongwoo Haejang',
    transitTitle: 'By metro',
    transit: [
      '<strong>Banwoldang Station</strong> (Lines 1 & 2), Exit 15 → about 7 min on foot (about 500 m)',
      '<strong>The Hyundai Daegu</strong> → follow the lane beside the store north, past the Herbal Medicine Museum — about 6 min on foot (about 380 m)',
      '<strong>Jungangno Station</strong> (Line 1) → about 10 min on foot',
      'Inside Yakjeon-golmok, about a 3-minute walk from the <strong>Yangnyeongsi Herbal Medicine Museum</strong>',
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
      { q: 'What food is Daegu famous for?', a: 'Daegu’s signature dishes are jjim-galbi (spicy braised short ribs), and ttaro-gukbap (Daegu-style beef soup) — both on our menu, about a 7-minute walk from Banwoldang Station (Exit 15), 6 minutes from The Hyundai Daegu, in the Yangnyeongsi herbal alley.' },
      { q: 'What are the best things to see near the restaurant?', a: 'We sit inside Yangnyeongsi Herbal Medicine Alley, one of Daegu’s best-known tourist attractions. On foot, Gyesan Cathedral is about 6 minutes away, Cheongna Hill about 11 and Seomun Market about 16 — easy places to visit on a half-day Daegu travel itinerary, with our table as the lunch stop.' },
      { q: 'Can I make a reservation?', a: 'Yes, by phone. We accept group bookings for up to 40 people. Call +82 53-255-7052.' },
      { q: 'Which Banwoldang Station exit is closest?', a: 'Exit 15 of Banwoldang Station (Lines 1 & 2) — about 500 m, roughly a 7-minute walk. It is about 6 minutes on foot from The Hyundai Daegu.' },
      { q: 'Is there parking?', a: 'No private car park and no parking in front of the restaurant, but the Yangnyeongsi West Gate public car park is a 1-minute walk away, with 2–3 more within 2–4 minutes. See “Getting here” for directions links.' },
      { q: 'Is there a break time?', a: hasBreak
          ? `Yes — ${H.breakStart} to ${H.breakEnd}. We close at ${H.close}${hasLastOrder ? ` (last order ${H.lastOrder})` : ''}.`
          : `No. We serve straight through from ${H.open} to ${H.close}, so the quiet hours between lunch and dinner are fine.` },
      { q: 'Do you have non-spicy dishes?', a: 'Yes. The clear beef soup, the short rib soup (galbitang), the boiled beef shank and the braised oxtail contain no chili.' },
      { q: 'Will I have to queue?', a: 'Weekday lunch (12:00–13:30) and weekends can be busy. Just after opening or early evening is quieter.' },
      { q: 'Do you do takeaway?', a: 'Yes. Call ahead and your order will be ready to collect. Yukhoe bibimbap and the spicy kalguksu are dine-in only; ask about other dishes when you call. We don’t deliver.' },
      { q: 'Is there an English menu?', a: 'This page carries the menu in English, Japanese and Chinese. Showing the screen to our staff works fine.' },
      { q: 'Where can I get galbitang or beef soup near Banwoldang Station?', a: 'Here — Cheongwoo Haejang (청우해장), 11 Namseong-ro, inside the Yangnyeongsi herbal medicine alley, about a 7-minute walk (500 m) from Banwoldang Station Exit 15. Galbitang (beef short rib soup, ₩16,000) and the clear beef soup (₩12,000) are not spicy; the Daegu spicy beef soup (ttaro-gukbap, ₩13,000) is.' },
      { q: 'Is it a good lunch stop after the Yangnyeongsi herbal medicine market?', a: 'Yes. We are inside the Yangnyeongsi alley, about 3 minutes on foot from the Yangnyeongsi Museum of Oriental Medicine. Open daily 11:00–22:00 (break 15:00–17:00, last order 21:00).' },
      { q: 'Are there medicinal herbs in the soup?', a: 'No. “Yakjeon” in our dish names is the name of the alley. The broth is made from beef and beef bones, with no medicinal herbs.' },
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
    title: '大邱グルメ・大邱観光の食事に｜チョンウヘジャン — 薬令市の韓国料理店（半月堂 ランチ・カルビタン・カルビチム）',
    description:
      `大邱観光・大邱グルメなら薬令市の韓国料理店チョンウヘジャン。牛骨をじっくり煮出したカルビタン、大邱式ヘジャンクク、辛口カルビチム。日本語メニューあり。半月堂駅15番出口から徒歩約7分、ザ・現代 大邱から徒歩約6分。毎日${H.open}〜${H.close}${hasBreak ? `（休憩${H.breakStart.slice(0, 2)}〜${H.breakEnd.slice(0, 2)}時）` : ''}、電話予約 +82-53-255-7052。`,
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
      '朝の一杯から家族の食事まで、<br>360年の路地の食卓。',
    ],
    heroTitlesSummer: ['夏限定の名物、<br>平壌冷麺。'],
    heroTitlesWinter: ['寒い日は熱々の<br>ピリ辛カルグクス。'],
    heroLede:
      '360年の歴史をもつ薬令市の路地で、<strong>チョンウヘジャン</strong>は牛肉と牛骨を一日かけて煮出した澄んだスープをお出しします。カルビタンにヘジャンクク。刺激は控えめに、スープは深く — 朝食に、ご年配の方との食事に、家族の健やかな外食に。',
    // 여름 메뉴(냉면) 판매 중일 때만 쓰는 문단 — build.mjs 의 SUMMER_ON
    heroLedeSummer:
      '360年の歴史をもつ薬令市の路地で、<strong>チョンウヘジャン</strong>は牛肉と牛骨を一日かけて煮出した澄んだスープをお出しします。カルビタン、ヘジャンクク、夏は平壌冷麺。刺激は控えめに、スープは深く — 朝食に、ご年配の方との食事に、家族の健やかな外食に。',
    heroNote: '1929年に「大邱の誇り」と呼ばれた<strong>大邱湯飯</strong>の系譜を継ぐタロクッパ — 大邱十味を薬令市の路地で。',
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
      { h: '大邱湯飯（テグタンバン）、100年前の名', p: '1929年、雑誌《別乾坤》は「大邱の誇り、大邱湯飯」という記事を載せました。牛肉を長時間煮出した赤いスープにネギをたっぷり入れたこの一杯は、当時すでにソウル鍾路に「大邱湯」の看板を掲げる店が数軒あるほど全国に知られた大邱の味で、戦後はご飯を別に出す「タロクッパ」として受け継がれ、今の大邱十味になりました。チョンウヘジャンの辛口牛肉スープはその系譜の上にあります。' },
      { h: 'まずスープから', p: '毎朝、牛肉と牛骨を寸胴にかけるところから始めます。澄んだヘジャンククは辛くなく、辛口は同じスープに自家製の薬味を溶いたものです。' },
      { h: 'ご年配の方にも', p: 'カルビタンと牛すね肉のスユクは全く辛くありません。ご家族のお祝いの席にも向いています。' },
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
    visitLede: '地下鉄1・2号線 半月堂駅15番出口から徒歩約7分、ザ・現代 大邱から徒歩約6分。薬令市韓医薬博物館を過ぎた先、薬田横丁の中です。',
    visitNaver: 'NAVERマップで開く',
    visitKakao: 'カカオマップで開く',
    visitGoogle: 'Googleマップで開く',
    visitCopy: '住所をコピー',
    visitCopied: '住所をコピーしました',
    mapAlt: 'チョンウヘジャンの位置を示す地図',
    transitTitle: '地下鉄',
    transit: [
      '地下鉄1・2号線 <strong>半月堂駅</strong> 15番出口 → 徒歩約7分（約500m）',
      '<strong>ザ・現代 大邱</strong> → 百貨店脇の路地を北へ、韓医薬博物館を過ぎて徒歩約6分（約380m）',
      '地下鉄1号線 <strong>中央路駅</strong> → 徒歩約10分',
      '<strong>薬令市韓医薬博物館</strong>から徒歩約3分、薬田横丁の中',
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
      { q: '大邱観光でおすすめの食事は？', a: '大邱の名物はカルビチム（辛口の牛カルビ煮込み）、タロクッパ（大邱式牛肉スープ）。どちらも当店で召し上がれます。半月堂駅15番出口から徒歩約7分、ザ・現代 大邱から徒歩約6分、薬令市の路地です。' },
      { q: '近くの大邱観光スポットは？', a: '当店は大邱旅行で人気の観光地・薬令市の路地の中にあります。徒歩で桂山聖堂まで約6分、青蘿の丘まで約11分、西門市場まで約16分。テグ観光の合間の食事にちょうど良い立地です。' },
      { q: '予約はできますか。', a: 'はい、お電話で承ります。40名以下の団体予約も可能です。+82 53-255-7052 までどうぞ。' },
      { q: '半月堂駅の何番出口が近いですか。', a: '半月堂駅（1・2号線）15番出口から約500m、徒歩約7分です。ザ・現代 大邱からは徒歩約6分です。' },
      { q: '駐車場はありますか。', a: '専用駐車場はなく、店の前にも停められません。薬令市西門公営駐車場が徒歩1分です。他にも徒歩2〜4分に2〜3か所あります。「アクセス」に経路リンクがあります。' },
      { q: '休憩時間はありますか。', a: hasBreak
          ? `はい、${H.breakStart}〜${H.breakEnd} が休憩時間です。閉店は${H.close}${hasLastOrder ? `（ラストオーダー${H.lastOrder}）` : ''}です。`
          : `休憩なしで${H.open}から${H.close}まで通しで営業しています。昼と夜の間の空いている時間帯でもご利用いただけます。` },
      { q: '辛くない料理はありますか。', a: '澄んだヘジャンクク、カルビタン、牛すね肉のスユク、牛テールの煮込みは全く辛くありません。' },
      { q: '待ち時間はありますか。', a: '平日の昼（12:00〜13:30）と週末は混み合います。開店直後か夕方早めが比較的空いています。' },
      { q: 'テイクアウトはできますか。', a: 'はい。事前にお電話いただければ、お待たせせずにお渡しできます。ユッケビビンバと辛味噌カルグクスはお持ち帰りできません。その他のメニューはお電話でお尋ねください。デリバリーはしていません。' },
      { q: '日本語メニューはありますか。', a: 'このページで日本語のメニューをご覧いただけます。画面をスタッフにお見せください。' },
      { q: '半月堂駅の近くでカルビタンが食べられますか。', a: 'はい。半月堂駅（1・2号線）15番出口から徒歩約7分、薬令市の路地（南城路11）のチョンウヘジャン（청우해장）で、牛カルビタン（16,000ウォン）と澄んだヘジャンクク（12,000ウォン）を召し上がれます。どちらも辛くありません。' },
      { q: '薬令市観光のあとのランチにちょうどいいですか。', a: 'はい。薬令市韓医薬博物館から徒歩約3分の路地の中です。日本語・英語・中国語のメニューはこのサイトにあり、スマホの画面をスタッフに見せれば注文できます。毎日11:00〜22:00（休憩15:00〜17:00、ラストオーダー21:00）。' },
      { q: 'スープに韓方の薬材は入っていますか。', a: 'いいえ。メニュー名の「薬田」は路地の名前です。スープは牛肉と牛骨でとり、韓方の薬材は入れていません。' },
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
      `大邱美食推荐：药令市（药田胡同）的韩式餐厅青友解酲。慢熬牛骨排骨汤、大邱式牛肉汤、辣炖牛排骨。有中文菜单。距半月堂站15号出口步行约7分钟，距 The Hyundai 大邱步行约6分钟，近代胡同游览路线上。每天 ${H.open}–${H.close} 营业${hasBreak ? `（${H.breakStart}–${H.breakEnd} 休息）` : ''}，电话预订 +82-53-255-7052。`,
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
      '从早餐解酒汤到家庭聚餐，<br>360年老巷的餐桌。',
    ],
    heroTitlesSummer: ['夏季限定，<br>平壤冷面'],
    heroTitlesWinter: ['天冷来一碗<br>热辣刀切面'],
    heroLede:
      '在有 360 年历史的药令市胡同里，<strong>青友解酲</strong>用牛肉和牛骨熬上一整天的清汤，做排骨汤和牛肉汤。少些刺激，多些汤的深度 — 早餐、陪长辈用餐、一家人安心的外食。',
    // 여름 메뉴(냉면) 판매 중일 때만 쓰는 문단 — build.mjs 의 SUMMER_ON
    heroLedeSummer:
      '在有 360 年历史的药令市胡同里，<strong>青友解酲</strong>用牛肉和牛骨熬上一整天的清汤，做排骨汤、牛肉汤，夏天有平壤冷面。少些刺激，多些汤的深度 — 早餐、陪长辈用餐、一家人安心的外食。',
    heroNote: '承接1929年被誉为“大邱的骄傲”的<strong>大邱汤饭</strong>脉络 — 大邱十味，就在药令市巷子里。',
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
      { h: '大邱汤饭，百年前的大邱之名', p: '1929年，杂志《别乾坤》刊登了《大邱的骄傲——大邱汤饭》一文。用牛肉长时间熬出的红汤，加入大量大葱——当时首尔钟路已有好几家挂着“大邱汤”招牌的店，可见其闻名全国。光复后演变为“米饭另上”的 ttarogukbap，成为今天的大邱十味之一。青友解酲的香辣牛肉汤正承接这一脉络。' },
      { h: '汤是根本', p: '每天清晨从熬牛肉和牛骨开始。清汤解酒汤不辣，香辣款是同一锅汤加入自制辣酱。' },
      { h: '适合长辈与孩子', p: '清汤排骨汤和水煮牛腱片完全不辣，也适合家庭聚餐与寿宴。' },
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
    visitLede: '距地铁1、2号线半月堂站15号出口步行约7分钟，距 The Hyundai 大邱步行约6分钟。经过药令市韩医药博物馆，就在药田胡同里。',
    visitNaver: '用 NAVER 地图打开',
    visitKakao: '用 KakaoMap 打开',
    visitGoogle: '用 Google 地图打开',
    visitCopy: '复制地址',
    visitCopied: '地址已复制',
    mapAlt: '青友解酲位置地图',
    transitTitle: '地铁',
    transit: [
      '地铁1、2号线 <strong>半月堂站</strong> 15号出口 → 步行约7分钟（约500米）',
      '<strong>The Hyundai 大邱</strong> → 沿百货公司旁的小巷向北，经过韩医药博物馆，步行约6分钟（约380米）',
      '地铁1号线 <strong>中央路站</strong> → 步行约10分钟',
      '距<strong>药令市韩医药博物馆</strong>步行约3分钟，药田胡同内',
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
      { q: '大邱必吃美食有哪些？', a: '大邱的招牌是炖排骨（辣味牛排骨）、大邱式牛肉汤（ttarogukbap）— 本店都有。距半月堂站15号出口步行约7分钟，距 The Hyundai 大邱步行约6分钟，就在药令市胡同里。' },
      { q: '可以预订吗？', a: '可以，请致电预订。也接受 40 人以下的团体预订。电话 +82 53-255-7052。' },
      { q: '离半月堂站几号出口近？', a: '半月堂站（1、2号线）15号出口约500米，步行约7分钟；距 The Hyundai 大邱步行约6分钟。' },
      { q: '有停车场吗？', a: '没有专用停车场，店门口也不能停车，但药令市西门公共停车场步行仅 1 分钟，附近还有 2〜3 个停车场。「交通」区有导航链接。' },
      { q: '有休息时间吗？', a: hasBreak
          ? `有，${H.breakStart}–${H.breakEnd} 为休息时间。${H.close} 打烊${hasLastOrder ? `（最后点餐 ${H.lastOrder}）` : ''}。`
          : `没有。从 ${H.open} 到 ${H.close} 连续营业，午餐和晚餐之间的空闲时段也可以来。` },
      { q: '有不辣的菜吗？', a: '清汤解酒汤、排骨汤和水煮牛腱片完全不辣。' },
      { q: '需要排队吗？', a: '工作日午餐（12:00–13:30）和周末较忙。刚开门或傍晚早些时候比较空。' },
      { q: '可以外带吗？', a: '可以。提前致电点餐，到店即可取走。生拌牛肉拌饭和辣味大酱刀切面不能外带，其他菜品请在电话中询问。不提供外送。' },
      { q: '有中文菜单吗？', a: '本页面提供中文菜单，把屏幕给店员看即可点单。' },
      { q: '半月堂站附近有牛排骨汤或解酒汤吗？', a: '有。青友解酲（청우해장）在药令市胡同里（南城路 11），距半月堂站 15 号出口步行约 7 分钟。排骨汤 16,000 韩元、清汤解酒汤 12,000 韩元都不辣；辣味的大邱牛肉汤饭（ttaro-gukbap）13,000 韩元。' },
      { q: '逛完药令市，可以用中文菜单点餐吗？', a: '可以。本店距药令市韩医药博物馆步行约 3 分钟。简体中文、繁体中文、英文、日文菜单都在本网站上，把手机画面给店员看就能点餐。每天 11:00–22:00（15:00–17:00 休息，最后点餐 21:00）。' },
      { q: '汤里有中药材吗？', a: '没有。菜名里的“药田”是胡同的名字，汤用牛肉和牛骨熬成，不加中药材。' },
    ],

    footerTagline: '大邱药田胡同的韩式餐厅',
    footerBiz: '青友解酲 · 大邱广域市中区南城路 11',
    footerCredit: '内装 · 摄影 · 网站制作 : WECO Company',
    footerRights: '© 청우해장. All rights reserved.',
    langLabel: '语言',
  },
};
