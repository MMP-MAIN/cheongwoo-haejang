# 이어서 할 일 (인수인계)

> 이 파일은 다음 세션이 바로 이어받도록 쓴 것입니다.
> **저장소: `MMP-MAIN/cheongwoo-haejang` · 사이트: https://cheongwoohaejang.com** (2026-08-18 라이브)
> 로컬 작업 폴더: `~/Desktop/클로드 청우해장/cheongwoo-haejang/`

---

## 지금까지 된 것

대구 중구 남성로 11 **한식당 청우해장**의 다국어 홈페이지를 만들었습니다.
`cheongwoo/` 폴더 안에 전부 들어 있고, `node build.mjs` 하나로 5개 언어가 나옵니다.

- 한국어 · English · 日本語 · 简体中文 · **繁體中文(대만)** — 각각 독립 HTML + hreflang
- 전화 예약 / 네이버·카카오·구글 길찾기 / OpenStreetMap 임베드
- 메타 픽셀 · 구글 광고 · GA4 · 카카오 통합 추적 (`assets/config.js` 에 ID만 넣으면 작동)
  - 세션당 1회 전환 집계, 캠페인 파라미터 동봉, 내부 트래픽 제외
- 구조화 데이터 5종, 약전골목·근대골목 역사 섹션, FAQ
- 상세 문서: `README.md`(운영) `MARKETING.md`(키워드·광고) `DOMAIN.md`(도메인)

---

## 남은 일 — 이 순서대로

### 1. 저장소 분리 + 도메인 연결 ✅ 2026-08-18 완료

- 저장소 **`MMP-MAIN/cheongwoo-haejang`** (hwanman2 가 아니라 MMP-MAIN 계정 — 크롬 로그인 계정 기준)
- 가비아 DNS: A ×4 (185.199.108~111.153) + `www` CNAME → `mmp-main.github.io.` — 전파 확인
- GitHub Pages: Source = **GitHub Actions**, Custom domain = `cheongwoohaejang.com`, **HTTPS 강제 ON**
- `main` 에 푸시하면 `.github/workflows/deploy.yml` 이 `npm run images → node build.mjs → 배포` 를 자동으로 돌립니다
- `www.cheongwoohaejang.com` → 루트로 301, `mmp-main.github.io/cheongwoo-haejang/` → 도메인으로 301

**weco 저장소 정리는 필요 없었습니다.** `cheongwoo/` 는 `claude/…` 브랜치에만 있었고
main 에 합쳐진 적이 없어서 옛 URL 이 애초에 살아 있지 않았습니다. 그 브랜치는 그대로 두면 됩니다.

**이미지 파이프라인 추가:** `npm run images` (sharp) 가 AVIF/WebP 4크기를 만들고,
`build.mjs` 가 `<picture>` 로 냅니다. 사진이 바뀔 때만 돌리면 됩니다. README 3번 참고.

### 2. 영업시간·가격 확정 ✅ 2026-08-18 완료 (네이버 플레이스 기준)

처음엔 카카오맵 등록 정보로 맞췄다가, 같은 날 **네이버 플레이스(ID 1059841507)** 를
직접 읽어 보니 값이 달랐습니다. 네이버가 대표 채널(리뷰 3,251건, 광고 랜딩)이라 네이버로 확정.
- 영업시간 **11:00–22:00 · 브레이크 15:00–17:00 · 라스트오더 21:00**, 7일 동일
- 메뉴 11종 이름·가격·설명·사진을 플레이스 등록값 그대로 (README 8번 표)
- `naverPlaceId` 채움 → 네이버 링크가 가게 페이지로 직행. **카카오맵 링크는 뺐음** (kakaoPlaceId 빈 값)

`src/store.mjs` 의 `hours` 한 곳만 바꾸면 5개 언어 본문·FAQ·배지·구조화 데이터가 따라옵니다.

### 3. 음식 사진 넣기 ✅ 2026-08-18 완료

스마트플레이스 사장님 등록 사진 11장을 `images/` 에 넣고 히어로를 갈비탕으로 바꿨습니다.
메뉴 줄마다 썸네일이 붙습니다 (`menu[].img`). 더 좋은 원본을 받으면 같은 파일명으로 덮고
`npm run images && node build.mjs`.

### 4. 검색엔진 등록 — 구글 ✅ / 네이버 ★ 사장님(또는 운영자) 손 필요

**구글 서치콘솔 ✅ 2026-08-18 완료**
- URL 접두어 속성 `https://cheongwoohaejang.com/` 소유확인 (HTML 파일 + meta 태그 둘 다)
- sitemap.xml 제출 → 성공, 페이지 5개 발견
- 도메인 속성(`cheongwoohaejang.com`)도 만들어 두었으나 DNS TXT 미인증 상태.
  가비아 DNS 에 TXT `@` = `google-site-verification=ucPfF2Kfn43TwqNxO72CR-TdrTEGyaWWvG9I_b9Qs58`
  를 넣고 서치콘솔에서 「확인」 누르면 됩니다 (선택 사항 — URL 접두어 속성으로 이미 충분).

**네이버 서치어드바이저 — 자동화 불가 (브라우저 정책으로 naver 도메인 차단). 3분 걸립니다:**
1. https://searchadvisor.naver.com → 로그인 → 웹마스터 도구 → 사이트 등록: `https://cheongwoohaejang.com`
2. 소유확인 → **HTML 태그** 선택 → `<meta name="naver-site-verification" content="XXXX" />` 의 XXXX 값을 복사
3. 그 값을 `src/store.mjs` 의 `naverSiteVerification: ''` 에 넣고 → `node build.mjs` → 커밋·푸시 (1분 뒤 배포)
4. 서치어드바이저로 돌아가 「소유확인」 → 요청 → **사이트맵 제출**: `https://cheongwoohaejang.com/sitemap.xml`
5. 같은 화면에서 **RSS 제출은 건너뛰고**, 「웹 페이지 수집」에서 `https://cheongwoohaejang.com/` 수집 요청

**그 다음이 진짜 큰 한 방:** 네이버 스마트플레이스(사장님 계정) → 업체 정보 → **홈페이지**에
`https://cheongwoohaejang.com` 입력. 플레이스 리뷰 3,251건의 신뢰가 홈페이지로 옮겨옵니다.
카카오맵·구글 비즈니스 프로필도 같은 방식.

### 5. 광고 픽셀 ✅ 메타 완료 / 구글·GA4 남음

- **메타 픽셀 ✅** 데이터 세트 「청우해장 웹사이트」 ID `4502054576777925` (MPmarketing 소유,
  광고 계정 661052520659038 연결). `assets/config.js` 에 입력·배포·라이브 발사 확인.
- 지금 돌아가는 **냉면 광고(master 계정, ₩30/클릭)** 는 네이버 플레이스로 링크돼 있어 픽셀이
  안 울립니다. **그대로 두기로 했습니다.** 다음 광고부터 랜딩을 홈페이지로 잡으면 픽셀·리마케팅이 쌓입니다.
  그때 master 계정(976230043878568)에도 데이터 세트를 공유해야 합니다 (비즈니스 설정 → 데이터 세트 → 연결된 자산 → 자산 연결).
- 구글 광고 전환·GA4 는 `assets/config.js` 의 빈 칸. `MARKETING.md` 참고.

---

## 확인이 필요한 사항 (사장님께)

`README.md` 8번에 표로 정리돼 있습니다. 요약하면:

- ~~영업시간 22시 vs 23시~~ → **23시로 확정** (카카오 등록 정보)
- ~~갈비탕 가격, 「보약 갈비탕」 존재 여부~~ → **약전 갈비탕 13,000원으로 확정**
- ~~정기 휴무일~~ → **연중무휴 확정**
- 가게 앞 주차 1~2대 가능 여부 (근처 공영주차장 4곳은 홈페이지에 넣었음)
- 간판 한자 — 사진 확대로는 **靑友解酲**, 인스타 계정명은 淸友解酲
- 인스타 `instagram.com/chungwoo.official` 이 공식 계정 맞는지

---

## 작업 원칙 (앞 세션에서 지킨 것)

- HTML 을 직접 고치지 말 것. `src/` 데이터를 고치고 `node build.mjs`.
- 확인되지 않은 가격은 넣지 말 것. 「가격 문의」로 두는 편이 낫습니다.
  틀린 가격은 계산대에서 손님과 분쟁이 됩니다.
- 음식 사진이 없다고 인테리어 사진을 음식 자리에 넣지 말 것.
  손님이 헷갈리고 구조화 데이터도 틀어집니다.
- 외부 JS 라이브러리를 쓰지 않습니다. 글꼴 두 개(Pretendard, Noto Serif KR)뿐입니다.
