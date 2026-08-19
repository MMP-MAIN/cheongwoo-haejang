// ---------------------------------------------------------------------------
// 「골목」 섹션 — 약령시·약전골목의 역사, 근대문화골목, 대구여행 도보 코스.
// 관광 키워드(대구여행·근대골목투어·약령시)로 들어오는 검색 유입을
// 매장 방문으로 연결하는 것이 이 섹션의 목적입니다.
// 역사 서술은 네이버 지식백과(한국민족문화대백과, 대구 중구 향토문화전자대전)
// 표제 내용을 근거로 했고, 확정하기 어려운 연도는 단정하지 않았습니다.
// ---------------------------------------------------------------------------

// 도보 시간은 남성로 11 기준 대략치입니다.
const spots = [
  { key: 'museum',  min: 1 },
  { key: 'jingolmok', min: 3 },
  { key: 'gyesan',  min: 5 },
  { key: 'leesang', min: 6 },
  { key: 'dongseong', min: 8 },
  { key: 'cheongna', min: 10 },
  { key: 'seomun',  min: 13 },
];
export { spots };

// 옛 자료·골목 사진 — 전부 저작권이 깨끗한 것만 (위키미디어 공용, 2026-08-19 확인)
//  map1930: 조선총독부 1:10,000 지형도 「대구」(1930) — 공유저작물(저작권 만료)
//  mural:   약령시 옛 약방 벽화 사진 (Wol, CC0)          herbs: 약령시 약재 진열 (Wol, CC0)
//  gate:    약령문 (Wikimedia Commons User:Mobius6, CC BY-SA 4.0 — 출처 표기 필수)
export const hoodImages = [
  { key: 'map1930', src: 'images/hood-map-1930.jpg', w: 1800, h: 1200, credit: '조선총독부 지형도 (1930) · Public domain' },
  { key: 'mural',   src: 'images/hood-mural.jpg',    w: 2000, h: 1352, credit: 'Wikimedia Commons · CC0' },
  { key: 'herbs',   src: 'images/hood-herbs.jpg',    w: 1890, h: 1417, credit: 'Wikimedia Commons · CC0' },
  { key: 'gate',    src: 'images/hood-gate.jpg',     w: 2000, h: 1333, credit: 'Mobius6 / Wikimedia Commons · CC BY-SA 4.0' },
];

export const hood = {
  ko: {
    kicker: '동네 이야기',
    title: '350년 약전골목,<br>그 한가운데서 국을 끓입니다',
    lede:
      '청우해장이 있는 남성로는 그냥 길이 아닙니다. 조선 후기부터 한약재가 오가던 <strong>대구약령시</strong>의 본거리이자, 오늘날 <strong>근대문화골목</strong> 투어가 지나는 길목입니다.',
    blocks: [
      {
        h: '약령시와 약전골목',
        p: '대구약령시는 조선 효종 연간, 경상감영 객사 주변에서 한약재를 사고팔던 계절시장으로 시작했습니다. 봄·가을 한 달씩 열리던 장이 오늘날에는 상설 시장이 되어 남성로 일대 — 사람들이 <strong>약전골목</strong>이라 부르는 이 거리 — 에 자리 잡았습니다. 지금도 골목을 걸으면 한약방에서 새어 나오는 약재 냄새가 납니다. 청우해장은 그 골목 안, 약령시한의약박물관 바로 옆에 있습니다.',
      },
      {
        h: '근대문화골목',
        p: '대구 중구의 골목투어 「근대로의 여행」 제2코스가 <strong>근대문화골목</strong>입니다. 2012년 한국 관광의 별로 뽑혔고 한국관광 100선에도 연이어 이름을 올린, 골목투어를 전국 콘텐츠로 만든 길입니다. 청라언덕의 선교사 주택에서 시작해 3·1만세운동길 계단을 내려와 계산성당과 이상화·서상돈 고택을 지나면, 길은 자연스럽게 약전골목으로 이어집니다.',
      },
      {
        h: '걷다가 한 그릇',
        p: '골목투어는 대개 두세 시간이 걸립니다. 코스 한가운데에서 뜨거운 국물 한 그릇 놓고 앉으면 나머지 절반이 훨씬 수월합니다. 아침 일찍 오신 분은 맑은 해장국을, 걷고 오신 분은 갈비탕을 많이 드십니다.',
      },
    ],
    courseTitle: '걸어서 닿는 곳',
    courseNote: '※ 도보 시간은 청우해장(남성로 11) 기준 대략치입니다.',
    archiveTitle: '옛 지도와 골목 풍경',
    archiveLede: '1930년 지형도 속 대구 시가지 — 약령시는 옛 성곽 남쪽 길, 지금의 남성로에 섰습니다. 그 길에서 400년 가까이 약재가 오갔고, 지금은 그 골목에서 국을 끓입니다.',
    archive: { map1930: '1930년 대구 시가지 지형도 (조선총독부)', mural: '약령시 골목의 옛 약방 벽화', herbs: '약전골목 약재 진열', gate: '약령시 정문 「약령문」' },
    spots: {
      museum:   { n: '약령시한의약박물관', d: '약령시의 역사를 모아 둔 박물관. 매장 바로 옆입니다.' },
      jingolmok:{ n: '진골목', d: '근대 대구 부호들이 살던 좁고 긴 골목.' },
      gyesan:   { n: '계산성당', d: '1898년 본당이 선 대구 천주교의 주교좌성당. 붉은 벽돌 서양식 건물.' },
      leesang:  { n: '이상화·서상돈 고택', d: '「빼앗긴 들에도 봄은 오는가」의 시인과 국채보상운동을 일으킨 이의 집.' },
      dongseong:{ n: '동성로', d: '대구에서 가장 붐비는 번화가.' },
      cheongna: { n: '청라언덕 · 3·1만세운동길', d: '담쟁이 덮인 언덕 위 선교사 주택과 90계단.' },
      seomun:   { n: '서문시장', d: '조선시대부터 이어져 온 대구의 큰 장. 야시장으로도 유명합니다.' },
    },
  },

  en: {
    kicker: 'The neighbourhood',
    title: 'Four centuries of herbal medicine —<br>and a pot of broth in the middle of it',
    lede:
      'Namseong-ro is not just a street. It is the main lane of <strong>Yangnyeongsi</strong>, Daegu’s historic herbal medicine market, and it sits on the route of the <strong>Modern History Street</strong> walking tour.',
    blocks: [
      {
        h: 'Yangnyeongsi and Yakjeon-golmok',
        p: 'Daegu’s Yangnyeongsi began in the late Joseon period as a seasonal market for medicinal herbs, held near the guesthouse of the Gyeongsang provincial office. What was once a month-long fair each spring and autumn is now a permanent market along Namseong-ro — the street everyone calls <strong>Yakjeon-golmok</strong>, the herbal medicine alley. Walk it today and the smell of dried roots still drifts out of the shops. We are inside that alley, right beside the Yangnyeongsi Herbal Medicine Museum.',
      },
      {
        h: 'The Modern History Street',
        p: 'Course 2 of Jung-gu’s “Journey into the Modern Era” walking tour is the <strong>Modern Culture Alley</strong>. Named a Star of Korean Tourism in 2012 and listed repeatedly among Korea’s 100 best destinations, it is the route that turned alley-walking into a national pastime. It starts at the missionary houses on Cheongna Hill, comes down the March First Movement stairs, passes Gyesan Cathedral and the houses of the poet Lee Sang-hwa and the patriot Seo Sang-don — and then runs straight into our alley.',
      },
      {
        h: 'A bowl halfway through',
        p: 'The full walk takes two to three hours. Sitting down to a hot bowl at the halfway point makes the second half far easier. Early visitors tend to order the clear haejang-guk; those who have already been walking usually want the short rib soup.',
      },
    ],
    courseTitle: 'Within walking distance',
    courseNote: '※ Walking times are approximate, measured from our door at 11 Namseong-ro.',
    archiveTitle: 'Old map, old alley',
    archiveLede: 'Daegu on a 1930 survey map — Yangnyeongsi grew along the road south of the old town wall, today’s Namseong-ro. Herbs changed hands here for close to 400 years; now we simmer broth on the same lane.',
    archive: { map1930: 'Daegu city centre, 1930 topographic map', mural: 'Mural of an old herbal pharmacy in Yangnyeongsi', herbs: 'Dried herbs on display in the alley', gate: 'Yangnyeongmun, the market gate' },
    spots: {
      museum:   { n: 'Yangnyeongsi Herbal Medicine Museum', d: 'The history of the herb market, gathered in one building — right next door.' },
      jingolmok:{ n: 'Jin-golmok', d: 'A narrow lane where Daegu’s wealthy merchant families once lived.' },
      gyesan:   { n: 'Gyesan Cathedral', d: 'A red-brick Western-style cathedral; the parish was founded in 1898.' },
      leesang:  { n: 'Lee Sang-hwa & Seo Sang-don Houses', d: 'Homes of a resistance poet and the man who launched the National Debt Repayment Movement.' },
      dongseong:{ n: 'Dongseong-ro', d: 'Daegu’s busiest shopping and nightlife street.' },
      cheongna: { n: 'Cheongna Hill & March First Stairs', d: 'Ivy-covered hill with missionary houses, and the 90-step lane.' },
      seomun:   { n: 'Seomun Market', d: 'One of Korea’s great historic markets, famous for its night market.' },
    },
  },

  ja: {
    kicker: 'この街のこと',
    title: '350年の薬田横丁、<br>その真ん中でスープを炊く',
    lede:
      '南城路はただの通りではありません。朝鮮時代から漢方薬材が行き交った<strong>薬令市</strong>の本通りであり、今日の<strong>近代路地ツアー</strong>が通る道です。',
    blocks: [
      {
        h: '薬令市と薬田横丁',
        p: '大邱の薬令市は、朝鮮後期に慶尚監営の客舎周辺で漢方薬材を売買する季節市として始まりました。春と秋にひと月ずつ立った市は、今では南城路一帯 — 人々が<strong>薬田横丁</strong>と呼ぶこの通り — に常設の市場として根を下ろしています。今も横丁を歩けば漢方薬局から薬材の香りが漂います。チョンウヘジャンはその横丁の中、薬令市韓医薬博物館のすぐ隣にあります。',
      },
      {
        h: '近代文化路地',
        p: '大邱中区の路地ツアー「近代への旅」第2コースが<strong>近代文化路地</strong>です。2012年に「韓国観光の星」に選ばれ、韓国観光100選にも名を連ねた、路地歩きを全国的な観光コンテンツにした道です。青蘿の丘の宣教師住宅から始まり、三・一万歳運動路の階段を下り、桂山聖堂と李相和・徐相敦の旧宅を過ぎると、道は自然に薬田横丁へと続きます。',
      },
      {
        h: '歩く途中の一杯',
        p: 'ツアーは通常2〜3時間かかります。コースの真ん中で熱いスープを一杯いただくと、後半がずっと楽になります。朝早い方は澄んだヘジャンクク、歩いてこられた方はカルビタンをよく注文されます。',
      },
    ],
    courseTitle: '徒歩圏内の見どころ',
    courseNote: '※ 所要時間は南城路11（当店）からのおおよその目安です。',
    archiveTitle: '古地図と路地の風景',
    archiveLede: '1930年の地形図に見る大邱市街 — 薬令市は旧城郭の南側の道、今の南城路に立ちました。400年近く薬材が行き交ったこの路地で、今はスープを煮ています。',
    archive: { map1930: '1930年 大邱市街地形図（朝鮮総督府）', mural: '薬令市の路地に描かれた昔の薬房の壁画', herbs: '薬田横丁の薬材', gate: '薬令市の正門「薬令門」' },
    spots: {
      museum:   { n: '薬令市韓医薬博物館', d: '薬令市の歴史を集めた博物館。当店のすぐ隣です。' },
      jingolmok:{ n: 'チンゴルモク（陣路地）', d: '近代大邱の富豪たちが暮らした細長い路地。' },
      gyesan:   { n: '桂山聖堂', d: '1898年に本堂が立った大邱カトリックの司教座聖堂。赤レンガの洋風建築。' },
      leesang:  { n: '李相和・徐相敦 旧宅', d: '抵抗詩人と国債報償運動を起こした人物の家。' },
      dongseong:{ n: '東城路', d: '大邱で最も賑わう繁華街。' },
      cheongna: { n: '青蘿の丘・三・一万歳運動路', d: '蔦に覆われた丘の宣教師住宅と90段の階段。' },
      seomun:   { n: '西門市場', d: '朝鮮時代から続く大邱の大きな市場。夜市でも有名です。' },
    },
  },

  zh: {
    kicker: '街区故事',
    title: '三百五十年的药田胡同，<br>我们在正中间熬汤',
    lede:
      '南城路不只是一条路。它是朝鲜时代以来药材往来的<strong>药令市</strong>主街，也是今天<strong>近代胡同游览</strong>路线经过的地方。',
    blocks: [
      {
        h: '药令市与药田胡同',
        p: '大邱药令市始于朝鲜后期，最初是在庆尚监营客舍附近买卖中药材的季节市集。当年春秋各开一个月的集市，如今已成为南城路一带的常设市场 — 人们把这条街叫作<strong>药田胡同</strong>。今天走过胡同，药铺里仍飘出药材的气味。青友解酲就在胡同里，药令市韩医药博物馆的旁边。',
      },
      {
        h: '近代文化胡同',
        p: '大邱中区胡同游览「走进近代」的第二条路线就是<strong>近代文化胡同</strong>。它在 2012 年被选为「韩国观光之星」，并连续入选韩国观光 100 选，是把胡同散步变成全国性旅游内容的一条路。路线从青萝丘的传教士住宅出发，走下三一万岁运动路的台阶，经过桂山圣堂与李相和·徐相敦故居，然后自然地接入药田胡同。',
      },
      {
        h: '走到一半，来一碗',
        p: '整条路线通常要走两三个小时。在中途坐下来喝一碗热汤，后半段会轻松很多。一早来的客人多点清汤解酒汤，走累了来的客人多点排骨汤。',
      },
    ],
    courseTitle: '步行可达',
    courseNote: '※ 步行时间以本店（南城路 11）为起点，仅供参考。',
    archiveTitle: '老地图与老巷',
    archiveLede: '1930年地形图上的大邱市区 — 药令市沿着旧城墙南侧的路兴起，也就是今天的南城路。近400年药材在此往来，如今我们在同一条巷子里熬汤。',
    archive: { map1930: '1930年大邱市区地形图（朝鲜总督府）', mural: '药令市巷子里的老药房壁画', herbs: '药田胡同的药材陈列', gate: '药令市正门「药令门」' },
    spots: {
      museum:   { n: '药令市韩医药博物馆', d: '收藏药令市历史的博物馆，就在本店旁边。' },
      jingolmok:{ n: '真胡同', d: '近代大邱富商聚居的狭长小巷。' },
      gyesan:   { n: '桂山圣堂', d: '1898 年设立堂区的大邱天主教主教座堂，红砖西式建筑。' },
      leesang:  { n: '李相和·徐相敦故居', d: '抗日诗人与国债报偿运动发起者的旧居。' },
      dongseong:{ n: '东城路', d: '大邱最热闹的商圈。' },
      cheongna: { n: '青萝丘 · 三一万岁运动路', d: '爬满常春藤的山丘、传教士住宅与九十级台阶。' },
      seomun:   { n: '西门市场', d: '自朝鲜时代延续至今的大市场，夜市也很有名。' },
    },
  },

  tw: {
    kicker: '街區故事',
    title: '三百五十年的藥田巷，<br>我們在正中間熬湯',
    lede:
      '南城路不只是一條路。它是朝鮮時代以來藥材往來的<strong>藥令市</strong>主街，也是今天<strong>近代胡同散步</strong>路線經過的地方。',
    blocks: [
      {
        h: '藥令市與藥田巷',
        p: '大邱藥令市始於朝鮮後期，最初是在慶尚監營客舍附近買賣中藥材的季節市集。當年春秋各開一個月的市集，如今已成為南城路一帶的常設市場 — 人們把這條街叫作<strong>藥田巷</strong>。今天走過巷子，藥鋪裡仍飄出藥材的氣味。青友解酲就在巷子裡，藥令市韓醫藥博物館的旁邊。',
      },
      {
        h: '近代文化胡同',
        p: '大邱中區胡同散步「走進近代」的第二條路線就是<strong>近代文化胡同</strong>。它在 2012 年獲選「韓國觀光之星」，並連續入選韓國觀光 100 選，是把巷弄散步變成全國性旅遊內容的一條路。路線從青蘿丘的傳教士住宅出發，走下三一萬歲運動路的階梯，經過桂山聖堂與李相和·徐相敦故居，然後自然地接進藥田巷。',
      },
      {
        h: '走到一半，來一碗',
        p: '整條路線通常要走兩三個小時。在中途坐下來喝一碗熱湯，後半段會輕鬆很多。一早來的客人多點清湯解酒湯，走累了來的客人多點牛小排湯。',
      },
    ],
    courseTitle: '步行可達',
    courseNote: '※ 步行時間以本店（南城路 11）為起點，僅供參考。',
    archiveTitle: '老地圖與老巷',
    archiveLede: '1930 年地形圖上的大邱市區 — 藥令市沿著舊城牆南側的路興起，也就是今天的南城路。近 400 年藥材在此往來，如今我們在同一條巷子裡熬湯。',
    archive: { map1930: '1930 年大邱市區地形圖（朝鮮總督府）', mural: '藥令市巷子裡的老藥房壁畫', herbs: '藥田巷的藥材陳列', gate: '藥令市正門「藥令門」' },
    spots: {
      museum:   { n: '藥令市韓醫藥博物館', d: '收藏藥令市歷史的博物館，就在本店旁邊。' },
      jingolmok:{ n: '真胡同', d: '近代大邱富商聚居的狹長小巷。' },
      gyesan:   { n: '桂山聖堂', d: '1898 年設立堂區的大邱天主教主教座堂，紅磚西式建築。' },
      leesang:  { n: '李相和·徐相敦故居', d: '抗日詩人與國債報償運動發起者的舊居。' },
      dongseong:{ n: '東城路', d: '大邱最熱鬧的商圈。' },
      cheongna: { n: '青蘿丘 · 三一萬歲運動路', d: '爬滿常春藤的山丘、傳教士住宅與九十級階梯。' },
      seomun:   { n: '西門市場', d: '自朝鮮時代延續至今的大市場，夜市也很有名。' },
    },
  },
};
