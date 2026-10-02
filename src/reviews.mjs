/* ==========================================================================
   손님 후기 — 구글 지도 공개 리뷰에서 발췌 (2026-08-22 수집, 2026-10-02 교체: 「갈빗대 3대」(기본 2대와 어긋남)·
   「몸보신」(효능 암시)·「최고의」(최상급) 문장을 내리고 실제 후기 문장만 그대로 옮김)
   원문은 한국어이며 외국어 페이지용 번역을 함께 둡니다.
   새 리뷰로 갈아끼울 때는 quote 를 원문 그대로(맞춤법만) 옮기고 이름은 가운데
   글자를 ○ 처리합니다.
   ========================================================================== */

export const reviewsMeta = {
  rating: '4.9',
  count: 118,         // 2026-10-02 구글 지도 「4.9 · 리뷰 118개」 (9/28 은 4.8·104)
  // 네이버 플레이스 방문자 리뷰 — 링크가 방문자 리뷰 탭으로 가므로 그 탭의 숫자를 씁니다
  // (블로그 리뷰는 따로 셉니다). 리뷰는 늘기만 하므로 「넘게」 표기로 오래 둬도 틀리지 않게.
  naver: { rating: '4.8', countText: '3,500' },   // 2026-09-27 방문자 3,515 · 블로그 864
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
    author: '김○지',
    ko: '갈비도 흐물흐물 잘 벗겨지고 부드럽고 진짜 맛있어요.',
    en: 'The rib meat comes right off the bone — so tender and really delicious.',
    ja: 'カルビがほろっと骨から外れて、柔らかくて本当に美味しいです。',
    zh: '排骨一碰就脱骨，软嫩又真的好吃。',
    tw: '排骨一碰就脫骨，軟嫩又真的好吃。',
  },
  {
    author: '송○우',
    ko: '갈비탕 맛이 아주 깔끔하고 위생상태가 청결합니다.',
    en: 'The galbitang tastes very clean, and the place is spotless.',
    ja: 'カルビタンの味がとてもすっきりしていて、衛生面も清潔です。',
    zh: '排骨汤味道非常清爽，卫生也很干净。',
    tw: '排骨湯味道非常清爽，衛生也很乾淨。',
  },
  {
    author: '이○석',
    ko: '아롱사태수육 정말 맛깔납니다.',
    en: 'The boiled beef shank is genuinely delicious.',
    ja: '牛すね肉のスユクが本当に美味しいです。',
    zh: '水煮牛腱肉真的很好吃。',
    tw: '水煮牛腱肉真的很好吃。',
  },
  {
    author: 'Eva',
    ko: '소꼬리찜이 이렇게 맛있는 거였다니…',
    en: 'I had no idea braised oxtail could taste this good…',
    ja: 'テールの煮込みがこんなに美味しいとは…',
    zh: '没想到炖牛尾这么好吃…',
    tw: '沒想到燉牛尾這麼好吃…',
  },
];
