/* ==========================================================================
   청우해장 — 화면 동작
   외부 라이브러리 없이 순수 자바스크립트로 씁니다. 의존성이 없으면
   깨질 일도 없고, 느린 모바일 회선에서도 먼저 뜹니다.
   ========================================================================== */
(function () {
  'use strict';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ---- 상단바: 스크롤하면 배경을 채웁니다 ---- */
  var bar = $('#topbar');
  var hero = $('.hero');
  function onScroll() {
    var trigger = hero ? hero.offsetHeight * 0.72 : 120;
    bar.classList.toggle('solid', window.scrollY > trigger);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- 히어로 문구 로테이션 ---- */
  var heroTitle = $('#hero-title');
  if (heroTitle && heroTitle.dataset.titles &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    try {
      var td = JSON.parse(heroTitle.dataset.titles);
      // 계절 문구: 5~9월엔 여름(냉면), 나머지 달엔 겨울(장칼국수) 문구를 섞습니다.
      var month = new Date().getMonth() + 1;
      var titles = Array.isArray(td)
        ? td
        : td.a.concat(month >= 5 && month <= 9 ? td.s : td.w);
      if (titles.length > 1) {
        var ti = 0;
        setInterval(function () {
          if (document.hidden) return; // 백그라운드 탭에서 타이머가 늘어지며 제목이 빈 채로 남는 것 방지
          heroTitle.classList.add('swap');
          setTimeout(function () {
            ti = (ti + 1) % titles.length;
            heroTitle.innerHTML = titles[ti];
            heroTitle.classList.remove('swap');
          }, 600);
        }, 6000);
      }
    } catch (e) { /* 문구 데이터가 깨져 있으면 첫 문구 그대로 둡니다 */ }
  }

  /* ---- 모바일 메뉴 ---- */
  var toggle = $('#menubtn'), gnb = $('#gnb');
  if (toggle && gnb) {
    toggle.addEventListener('click', function () {
      var open = gnb.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', gnb).forEach(function (a) {
      a.addEventListener('click', function () {
        gnb.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- 스크롤 등장 ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    $$('.rv').forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- 주소 복사 ---- */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        var old = btn.getAttribute('data-label-copied');
        var span = $('span', btn) || btn;
        var prev = span.textContent;
        span.textContent = old;
        setTimeout(function () { span.textContent = prev; }, 2000);
        if (window.cwTrack) window.cwTrack('copyaddress', { label: text });
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  });

  /* ---- 갤러리 라이트박스 ---- */
  var lb = $('#lightbox');
  if (lb) {
    var lbImg = $('img', lb), lbCap = $('.lb-cap', lb);
    var figs = $$('.gal figure'), idx = 0;

    function show(i) {
      idx = (i + figs.length) % figs.length;
      var im = $('img', figs[idx]);
      lbImg.src = im.getAttribute('data-full') || im.src;
      lbImg.alt = im.alt;
      lbCap.textContent = im.alt;
      lb.classList.add('on');
      document.body.style.overflow = 'hidden';
    }
    function hide() { lb.classList.remove('on'); document.body.style.overflow = ''; lbImg.src = ''; }

    figs.forEach(function (f, i) {
      f.addEventListener('click', function () {
        show(i);
        if (window.cwTrack) window.cwTrack('gallery', { label: 'photo-' + (i + 1) }, { once: true });
      });
    });
    $('.lb-close', lb).addEventListener('click', hide);
    $('.lb-prev', lb).addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    $('.lb-next', lb).addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) hide(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---- 지도는 스크롤이 닿았을 때 불러옵니다 (첫 화면 속도 확보) ---- */
  var mapFrame = $('#map-frame');
  if (mapFrame && 'IntersectionObserver' in window) {
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.src = en.target.getAttribute('data-src');
          mio.unobserve(en.target);
        }
      });
    }, { rootMargin: '300px' });
    mio.observe(mapFrame);
  } else if (mapFrame) {
    mapFrame.src = mapFrame.getAttribute('data-src');
  }

  /* ---- 약도 모달 ---- */
  var sm = $('#sketch-modal');
  if (sm) {
    var openSketch = function (e) { e.preventDefault(); sm.hidden = false; document.body.style.overflow = 'hidden'; };
    var closeSketch = function () { sm.hidden = true; document.body.style.overflow = ''; };
    $$('[data-open-sketch]').forEach(function (b) { b.addEventListener('click', openSketch); });
    $$('[data-close-sketch]', sm).forEach(function (b) { b.addEventListener('click', closeSketch); });
    sm.addEventListener('click', function (e) { if (e.target === sm) closeSketch(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sm.hidden) closeSketch(); });
  }

  /* ---- 약도 저장 (휴대폰 앨범) ----
     인쇄 대신 「저장」. 지도 사진 + 3단계 안내 + 주소·전화를 캔버스에서 한 장의
     JPG 로 합친 뒤,
       1) 공유 시트(navigator.share, 파일 지원)  → 아이폰 「이미지 저장」, 안드로이드 갤러리/포토
       2) 안 되면 다운로드(<a download>)         → 안드로이드는 갤러리에 뜸, PC 는 다운로드 폴더
       3) 그것도 안 되면 새 탭에 이미지를 열고 「길게 눌러 저장」 안내
     순서로 시도합니다. 문구·주소는 <figure class="sketch"> 의 data-save-* 로 내려옵니다. ---- */
  var sketchFig = $('figure.sketch');
  if (sketchFig && $$('[data-save-sketch]').length) {
    var D = function (k) { return sketchFig.getAttribute('data-save-' + k) || ''; };
    var FONT = '-apple-system, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Hiragino Sans", "PingFang TC", sans-serif';

    var loadImg = function (src) {
      return new Promise(function (ok, no) {
        var im = new Image();
        im.onload = function () { ok(im); };
        im.onerror = no;
        im.src = src;
      });
    };
    var wrap = function (ctx, text, maxW) {
      // 한국어는 띄어쓰기 단위, 그래도 넘치면 글자 단위로 자릅니다.
      var lines = [], line = '';
      var push = function (t) { if (line) lines.push(line); line = t; };
      text.split(/\s+/).forEach(function (w) {
        var cand = line ? line + ' ' + w : w;
        if (ctx.measureText(cand).width <= maxW) { line = cand; return; }
        if (ctx.measureText(w).width <= maxW) { push(w); return; }
        push('');
        for (var i = 0; i < w.length; i++) {
          if (ctx.measureText(line + w[i]).width > maxW) { lines.push(line); line = ''; }
          line += w[i];
        }
      });
      if (line) lines.push(line);
      return lines;
    };

    var composeSketch = function () {
      var img = $('.sketch-img img', sketchFig);
      var src = (img && (img.currentSrc || img.src)) || '';
      var steps = $$('.sketch-steps li span', sketchFig).map(function (s) { return s.textContent.trim(); });
      var total = ($('.sketch-total', sketchFig) || {}).textContent || '';
      total = total.replace(/\s+/g, ' ').trim();
      return loadImg(src).then(function (im) {
        var W = 1400, pad = 56;
        var mapH = Math.round(W * im.naturalHeight / im.naturalWidth);
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        // 본문 높이를 먼저 재고 캔버스 크기를 정합니다.
        ctx.font = '600 40px ' + FONT;
        var stepLines = steps.map(function (t) { return wrap(ctx, t, W - pad * 2 - 90); });
        var stepsH = stepLines.reduce(function (h, ls) { return h + Math.max(ls.length, 1) * 54 + 26; }, 0);
        var headH = 120, footH = 150;
        c.width = W; c.height = headH + mapH + 40 + stepsH + 70 + footH;

        ctx.fillStyle = '#fbfaf7'; ctx.fillRect(0, 0, c.width, c.height);
        // 머리: 가게 이름 · 약도
        ctx.fillStyle = '#1b1712'; ctx.font = '800 54px ' + FONT; ctx.textBaseline = 'middle';
        ctx.fillText(D('title'), pad, headH / 2 + 4);
        // 지도
        ctx.drawImage(im, 0, headH, W, mapH);
        // 3단계
        var y = headH + mapH + 40;
        ctx.font = '600 40px ' + FONT;
        stepLines.forEach(function (ls, i) {
          ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(pad + 30, y + 26, 30, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = '800 34px ' + FONT; ctx.textAlign = 'center';
          ctx.fillText(String(i + 1), pad + 30, y + 28);
          ctx.textAlign = 'left'; ctx.fillStyle = '#1b1712'; ctx.font = '600 40px ' + FONT;
          ls.forEach(function (l, j) { ctx.fillText(l, pad + 90, y + 26 + j * 54); });
          y += Math.max(ls.length, 1) * 54 + 26;
        });
        ctx.fillStyle = '#8f6322'; ctx.font = '800 40px ' + FONT;
        ctx.fillText(total, pad, y + 24);
        // 바닥: 주소 · 전화
        var fy = c.height - footH;
        ctx.fillStyle = '#ece7de'; ctx.fillRect(0, fy, W, footH);
        ctx.fillStyle = '#1b1712'; ctx.font = '600 36px ' + FONT;
        ctx.fillText(D('addr'), pad, fy + 52);
        ctx.fillText('☎ ' + D('tel'), pad, fy + 104);
        return new Promise(function (ok) { c.toBlob(ok, 'image/jpeg', 0.9); });
      });
    };

    var saveSketch = function (e) {
      e.preventDefault();
      var btn = e.currentTarget, label = btn.textContent;
      var btns = $$('[data-save-sketch]');
      btns.forEach(function (b) { b.disabled = true; });
      btn.textContent = D('saving');
      var done = function () { btns.forEach(function (b) { b.disabled = false; }); btn.textContent = label; };
      composeSketch().then(function (blob) {
        var file = new File([blob], D('file'), { type: 'image/jpeg' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: D('title') }).catch(function (err) {
            if (err && err.name === 'AbortError') return;   // 사용자가 공유 시트를 닫음
            throw err;
          });
        }
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        if ('download' in a) {
          a.href = url; a.download = D('file'); document.body.appendChild(a); a.click(); a.remove();
        } else {
          window.open(url, '_blank');
          alert(D('hint'));
        }
        setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      }).catch(function () {
        // 최후: 원본 지도 이미지라도 새 탭에 열어 길게 눌러 저장하게 합니다.
        var img = $('.sketch-img img', sketchFig);
        if (img) window.open(img.currentSrc || img.src, '_blank');
        alert(D('hint'));
      }).then(done, done);
    };
    $$('[data-save-sketch]').forEach(function (b) { b.addEventListener('click', saveSketch); });
  }

  /* ---- 지금 영업 중인지 표시 (한국 시간 기준) ----
     영업시간은 페이지의 data-hours 로 내려옵니다. 시간이 바뀌면
     src/store.mjs 의 hours 만 고치고 다시 빌드하면 여기까지 같이 바뀝니다. ---- */
  var badge = $('#open-now');
  if (badge) {
    var hm = function (s) { var p = (s || '').split(':'); return (+p[0]) * 60 + (+p[1]); };
    var parts = (badge.getAttribute('data-hours') || '11:00,,,23:00').split(',');
    var open = hm(parts[0]), close = hm(parts[3]);
    // 브레이크타임이 없는 가게면 가운데 두 칸이 빈 문자열로 내려옵니다.
    var hasBreak = !!(parts[1] && parts[2]);
    var bStart = hasBreak ? hm(parts[1]) : -1, bEnd = hasBreak ? hm(parts[2]) : -1;

    var now = new Date();
    var kst = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + 9 * 3600000);
    var mins = kst.getHours() * 60 + kst.getMinutes();

    var state;
    if (mins < open) state = 'before';                                   // 아직 문 열기 전
    else if (mins >= close) state = 'closed';                            // 마감
    else state = (hasBreak && mins >= bStart && mins < bEnd) ? 'break' : 'open';  // 영업 중 / 브레이크

    badge.textContent = badge.getAttribute('data-' + state) || '';
    badge.setAttribute('data-state', state);
  }
})();
