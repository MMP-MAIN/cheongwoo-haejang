/* ==========================================================================
   손님 후기 — 구글 지도 공개 리뷰에서 발췌 (2026-08-22 수집, 평점 4.8 / 47개)
   원문은 한국어이며 외국어 페이지용 번역을 함께 둡니다.
   새 리뷰로 갈아끼울 때는 quote 를 원문 그대로(맞춤법만) 옮기고 이름은 가운데
   글자를 ○ 처리합니다.
   ========================================================================== */

export const reviewsMeta = {
  rating: '4.8',
  count: 47,
  // 섹션 제목·구글 링크 라벨
  t: {
    ko: { kicker: '손님 후기', title: '다녀가신 분들의 말', link: 'Google 리뷰 전체 보기' },
    en: { kicker: 'Reviews', title: 'What guests say', link: 'Read all Google reviews' },
    ja: { kicker: 'クチコミ', title: 'お客様の声', link: 'Googleのクチコミを見る' },
    zh: { kicker: '评价', title: '食客评价', link: '查看全部Google评价' },
    tw: { kicker: '評價', title: '食客評價', link: '查看全部Google評價' },
  },
};

export const reviews = [
  {
    author: '이○석',
    ko: '맛과 서비스, 식당 청결함이 최고의 식당입니다. 아롱사태수육 정말 맛깔납니다.',
    en: 'Top marks for taste, service and cleanliness. The boiled beef shank is genuinely delicious.',
    ja: '味もサービスも清潔さも最高のお店。牛すね肉のスユクが本当に美味しいです。',
    zh: '味道、服务、店内整洁都是一流。水煮牛腱肉真的很好吃。',
    tw: '味道、服務、店內整潔都是一流。水煮牛腱肉真的很好吃。',
  },
  {
    author: '김○영',
    ko: '오래된 노포 갈비탕 맛이라고 할 정도로 맛있네요. 갈빗대를 3대나 넣어주시고, 아이 먹이기 참 좋았습니다.',
    en: 'Tastes like galbitang from a decades-old institution. Three big ribs in the bowl — great for kids too.',
    ja: '老舗のカルビタンと言われるほどの味。カルビが3本も入っていて、子どもにも安心です。',
    zh: '味道像几十年老店的排骨汤。碗里有三大块排骨，带孩子吃也很合适。',
    tw: '味道像幾十年老店的排骨湯。碗裡有三大塊排骨，帶孩子吃也很合適。',
  },
  {
    author: 'S. Baeck',
    ko: '국물이 시원해서 몸보신하는 기분입니다. 고기도 부드러워서 남녀노소 다들 좋아할 것 같습니다.',
    en: 'The broth is deeply restorative, and the meat is so tender — something for every age.',
    ja: 'スープが体に染みて、滋養をとっている気分。肉も柔らかく、老若男女みんな好きな味です。',
    zh: '汤头清爽滋补，肉也很嫩，男女老少都会喜欢。',
    tw: '湯頭清爽滋補，肉也很嫩，男女老少都會喜歡。',
  },
  {
    author: 'Eva',
    ko: '소꼬리찜이 이렇게 맛있는 거였다니… 소면이 진짜 킥이고, 마무리 볶음밥까지 너무 행복했습니다.',
    en: 'I had no idea braised oxtail could taste this good — the somyeon noodles are the kick, and the fried rice finish made my day.',
    ja: 'テールの煮込みがこんなに美味しいとは…素麺が最高のアクセントで、締めの炒飯まで幸せでした。',
    zh: '没想到炖牛尾这么好吃…配的素面是点睛之笔，最后的炒饭也让人幸福。',
    tw: '沒想到燉牛尾這麼好吃…配的素麵是點睛之筆，最後的炒飯也讓人幸福。',
  },
];
