/* ==========================================================================
   청우해장 — 통합 전환 추적
   --------------------------------------------------------------------------
   한 번의 cwTrack() 호출로 메타 픽셀 · 구글 광고 · GA4 · 카카오에 동시에
   같은 이벤트를 보냅니다. 플랫폼별 이벤트 이름은 아래 EVENTS 표에서 매핑합니다.

   HTML 쪽에서는 버튼에 data-track="call" 만 붙이면 자동으로 잡힙니다.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.CW_CONFIG || {};
  var log = function () {
    if (CFG.debug && window.console) console.log.apply(console, ['[cw]'].concat([].slice.call(arguments)));
  };

  /* ---------------------------------------------------------------------
     1. 이벤트 매핑표
     내부 이벤트 이름 → 각 광고 플랫폼의 표준 이벤트 이름
     --------------------------------------------------------------------- */
  var EVENTS = {
    // 전화 걸기 — 이 업종에서 가장 중요한 전환입니다.
    call:        { meta: 'Contact',       ga4: 'click_to_call',      kakao: 'completeRegistration', label: 'call',       value: 30000, dedupe: true },
    // 길찾기 — 실제 방문 의도가 매우 높은 신호입니다.
    directions:  { meta: 'FindLocation',  ga4: 'get_directions',     kakao: 'search',               label: 'directions', value: 25000, dedupe: true },
    // 예약 시도(네이버 예약 등 외부 예약 링크 클릭)
    reserve:     { meta: 'Schedule',      ga4: 'reservation_intent', kakao: 'purchase',             label: 'reserve',    value: 40000, dedupe: true },
    // 메뉴 열람 — 보조 전환. 리마케팅 모수 만들 때 씁니다.
    menu:        { meta: 'ViewContent',   ga4: 'view_menu',          kakao: 'viewContent',          label: 'menu',       value: 0 },
    // 갤러리 확대 / 주소 복사 / 언어 전환 / 깊은 스크롤 — 관심도 신호
    gallery:     { meta: 'ViewContent',   ga4: 'view_gallery',       kakao: null,                   label: null,         value: 0 },
    copyaddress: { meta: 'FindLocation',  ga4: 'copy_address',       kakao: null,                   label: null,         value: 0 },
    language:    { meta: null,            ga4: 'language_switch',    kakao: null,                   label: null,         value: 0 },
    engaged:     { meta: null,            ga4: 'scroll_deep',        kakao: null,                   label: null,         value: 0 },
    blog:        { meta: null,            ga4: 'outbound_blog',      kakao: null,                   label: null,         value: 0 },
  };

  /* ---------------------------------------------------------------------
     1-A. 내부 트래픽 제외
     사장님·직원·대행사가 자기 사이트를 보는 것까지 전환으로 잡히면
     광고 알고리즘이 엉뚱한 사람을 닮은 모수를 찾아갑니다.
     각자 폰에서 딱 한 번 아래 주소로 들어가면 그 기기는 영구 제외됩니다.

        .../cheongwoo/?cw_optout=1     ← 제외 켜기
        .../cheongwoo/?cw_optout=0     ← 제외 끄기
     --------------------------------------------------------------------- */
  var qs = new URLSearchParams(location.search);
  try {
    if (qs.has('cw_optout')) {
      if (qs.get('cw_optout') === '0') localStorage.removeItem('cw_optout');
      else localStorage.setItem('cw_optout', '1');
    }
  } catch (e) { /* 시크릿 모드 등 */ }

  var OPTED_OUT = false;
  try { OPTED_OUT = localStorage.getItem('cw_optout') === '1'; } catch (e) {}
  if (OPTED_OUT) {
    window.cwTrack = function () {};
    log('내부 트래픽으로 표시된 기기입니다. 측정을 보내지 않습니다.');
    return;   // 픽셀 자체를 로드하지 않습니다.
  }

  /* ---------------------------------------------------------------------
     1-B. 유입 캠페인 기억하기
     「어느 광고가 전화를 울렸나」를 알려면 전환 이벤트에 캠페인 정보가
     같이 붙어야 합니다. 첫 진입 때 한 번 읽어서 세션 내내 들고 다닙니다.
     --------------------------------------------------------------------- */
  var CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
                       'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid'];

  var campaign = {};
  try {
    var saved = sessionStorage.getItem('cw_campaign');
    if (saved) campaign = JSON.parse(saved);
  } catch (e) {}

  var fresh = {};
  CAMPAIGN_KEYS.forEach(function (k) { if (qs.get(k)) fresh[k] = qs.get(k); });
  if (Object.keys(fresh).length) {
    campaign = fresh;                                   // 새 클릭이 들어오면 갱신
    campaign.landing_page = location.pathname;
    try { sessionStorage.setItem('cw_campaign', JSON.stringify(campaign)); } catch (e) {}
  }
  if (!campaign.utm_source && document.referrer && !campaign.gclid && !campaign.fbclid) {
    try { campaign.referrer_host = new URL(document.referrer).hostname; } catch (e) {}
  }

  /* ---------------------------------------------------------------------
     1-C. 진입 환경 감지 — GA4 의 「미분류(Unassigned)」를 홈페이지가 직접 분류
     카톡·인스타 같은 앱 안 브라우저는 리퍼러(출처)를 안 넘기지만,
     브라우저 지문(User-Agent)에는 자기 이름을 남깁니다. 그걸 읽어서
     모든 GA4 이벤트에 entry_env 로 붙입니다.
     값 예시: kakao_inapp · instagram_inapp · facebook_inapp · naver_inapp ·
              line_inapp · homescreen(홈화면 추가) · bookmark_or_typed(북마크/직접입력) ·
              referred:도메인 · browser(일반 유입)
     --------------------------------------------------------------------- */
  var ENTRY_ENV = (function () {
    var ua = navigator.userAgent || '';
    if (/KAKAOTALK/i.test(ua)) return 'kakao_inapp';
    if (/Instagram/i.test(ua)) return 'instagram_inapp';
    if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'facebook_inapp';
    if (/NAVER\(inapp/i.test(ua)) return 'naver_inapp';
    if (/ Line\//i.test(ua)) return 'line_inapp';
    if (/Threads/i.test(ua)) return 'threads_inapp';
    // 홈 화면에 추가해서 앱처럼 여는 경우
    try {
      if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) return 'homescreen';
    } catch (e) {}
    // 앱도 아니고 출처도 없으면: 북마크·주소 직접 입력·저장해 둔 링크
    if (!document.referrer && !campaign.utm_source && !campaign.gclid && !campaign.fbclid) return 'bookmark_or_typed';
    if (!campaign.utm_source && campaign.referrer_host) return 'referred:' + campaign.referrer_host;
    return 'browser';
  })();
  campaign.entry_env = ENTRY_ENV;   // 전환 이벤트(전화·길찾기)에도 같이 실립니다

  /* 세션당 한 번만 세는 전환을 위한 표시 */
  function seenThisSession(key) {
    try {
      if (sessionStorage.getItem('cw_fired_' + key)) return true;
      sessionStorage.setItem('cw_fired_' + key, '1');
      return false;
    } catch (e) { return false; }
  }

  /* 메타 전환 API 를 나중에 붙일 때 중복 제거에 쓰이는 ID */
  function eventId(name) {
    return name + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  /* ---------------------------------------------------------------------
     2. 유틸 — 스크립트 주입
     --------------------------------------------------------------------- */
  function inject(src, attrs) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (attrs) Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
    return s;
  }

  /* ---------------------------------------------------------------------
     3. 구글 (Consent Mode v2 → gtag → GA4 + Google Ads)
     --------------------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var hasGoogle = !!(CFG.ga4Id || CFG.googleAdsId);

  // 동의 기본값은 스크립트가 로드되기 전에 선언해야 효력이 있습니다.
  if (hasGoogle || CFG.gtmId) {
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      region: CFG.consentRegions || [],
      wait_for_update: 500,
    });
    // 그 외 지역(한국 등)은 기본 허용
    gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    gtag('js', new Date());
  }

  if (hasGoogle) {
    inject('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CFG.ga4Id || CFG.googleAdsId));
    // 진입 환경을 사용자 속성 + 모든 이벤트 매개변수로 붙입니다 (미분류 트래픽 분류용)
    gtag('set', 'user_properties', { entry_env: ENTRY_ENV });
    if (CFG.ga4Id) gtag('config', CFG.ga4Id, { send_page_view: true, entry_env: ENTRY_ENV });
    if (CFG.googleAdsId) gtag('config', CFG.googleAdsId, { allow_enhanced_conversions: true });
    log('google loaded', CFG.ga4Id, CFG.googleAdsId);
  }

  // 구글 태그 매니저 (별도로 쓰는 경우)
  if (CFG.gtmId) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    inject('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CFG.gtmId));
  }

  /* ---------------------------------------------------------------------
     4. 메타 픽셀
     --------------------------------------------------------------------- */
  if (CFG.metaPixelId) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', CFG.metaPixelId);
    window.fbq('track', 'PageView');
    log('meta pixel loaded', CFG.metaPixelId);
  }

  /* ---------------------------------------------------------------------
     5. 카카오 픽셀 (선택)
     --------------------------------------------------------------------- */
  if (CFG.kakaoPixelId) {
    var ks = inject('//t1.daumcdn.net/adfit/static/kp.js');
    ks.onload = function () {
      try { window.kakaoPixel(CFG.kakaoPixelId).pageView(); } catch (e) { log('kakao init failed', e); }
    };
  }

  /* ---------------------------------------------------------------------
     6. 네이버 공통 측정 (선택)
     --------------------------------------------------------------------- */
  if (CFG.naverCommonId) {
    var nw = inject('//wcs.naver.net/wcslog.js');
    nw.onload = function () {
      try {
        if (!window.wcs_add) window.wcs_add = {};
        window.wcs_add.wa = CFG.naverCommonId;
        if (window.wcs) window.wcs_do();
      } catch (e) { log('naver init failed', e); }
    };
  }

  /* ---------------------------------------------------------------------
     7. 공개 API — cwTrack('call', {...})
     --------------------------------------------------------------------- */
  var fired = {};   // 같은 이벤트가 스크롤 등으로 중복 발사되는 것을 막습니다.

  function cwTrack(name, params, opts) {
    var map = EVENTS[name];
    if (!map) { log('unknown event', name); return; }
    params = params || {};
    opts = opts || {};

    if (opts.once) {
      if (fired[name]) return;
      fired[name] = true;
    }

    // ── 세션당 1회 집계 ────────────────────────────────────────────────
    // 한 사람이 전화 버튼을 세 번 누른다고 손님이 셋이 되지는 않습니다.
    // 그런데 그대로 세 번 보내면 광고 알고리즘은 전환 가치를 세 배로 잘못
    // 배우고, 그 결과 엉뚱한 모수에 예산을 더 씁니다. 그래서 진짜 전환은
    // 세션당 한 번만 보내고, 두 번째부터는 GA4 참고용 이벤트로만 남깁니다.
    var repeat = map.dedupe && seenThisSession(name);

    var payload = Object.assign({
      event_category: 'engagement',
      page_language: document.documentElement.lang || 'ko',
      transport_type: 'beacon',        // 전화·외부링크로 페이지를 떠나도 유실되지 않게
    }, campaign, params);

    // --- GA4 ---
    if (CFG.ga4Id && map.ga4) {
      gtag('event', repeat ? map.ga4 + '_repeat' : map.ga4, payload);
    }

    if (repeat) { log('track(중복, 집계 제외)', name); return; }

    var eid = eventId(name);

    // --- 구글 광고 전환 ---
    if (CFG.googleAdsId && map.label && CFG.googleAdsLabels && CFG.googleAdsLabels[map.label]) {
      gtag('event', 'conversion', {
        send_to: CFG.googleAdsId + '/' + CFG.googleAdsLabels[map.label],
        value: map.value || 0,
        currency: 'KRW',
        transaction_id: eid,           // 같은 전환이 두 번 집계되는 것을 막습니다
      });
    }

    // --- 메타 픽셀 ---
    if (CFG.metaPixelId && map.meta && window.fbq) {
      var metaPayload = { content_name: params.label || name, content_category: 'restaurant' };
      if (map.value) { metaPayload.value = map.value; metaPayload.currency = 'KRW'; }
      // eventID 는 나중에 전환 API(서버 전송)를 붙였을 때
      // 브라우저 전송분과 서버 전송분을 같은 건으로 묶어 줍니다.
      window.fbq('track', map.meta, metaPayload, { eventID: eid });
    }

    // --- 카카오 ---
    if (CFG.kakaoPixelId && map.kakao && window.kakaoPixel) {
      try { window.kakaoPixel(CFG.kakaoPixelId)[map.kakao](); } catch (e) { /* noop */ }
    }

    log('track', name, payload, eid);
  }
  window.cwTrack = cwTrack;

  /* ---------------------------------------------------------------------
     8. 자동 바인딩 — data-track 속성이 붙은 요소의 클릭을 잡습니다.
     --------------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el) return;
    cwTrack(el.getAttribute('data-track'), {
      label: el.getAttribute('data-track-label') || el.textContent.trim().slice(0, 60),
      link_url: el.getAttribute('href') || '',
    });
  }, { passive: true });

  /* ---------------------------------------------------------------------
     9. 관심도 신호 — 75% 스크롤과 30초 체류를 각각 한 번씩 보냅니다.
     리마케팅 모수를 '진짜 관심 있는 방문자'로 좁히는 데 씁니다.
     --------------------------------------------------------------------- */
  var scrollBound = false;
  function onScroll() {
    var h = document.documentElement;
    var pct = (h.scrollTop + window.innerHeight) / h.scrollHeight;
    if (pct >= 0.75) {
      cwTrack('engaged', { depth: '75%' }, { once: true });
      window.removeEventListener('scroll', onScroll);
    }
  }
  if (!scrollBound) { window.addEventListener('scroll', onScroll, { passive: true }); scrollBound = true; }

  setTimeout(function () {
    if (!document.hidden) cwTrack('engaged', { depth: '30s' }, { once: false });
  }, 30000);
})();
