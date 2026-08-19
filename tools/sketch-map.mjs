#!/usr/bin/env node
/* ==========================================================================
   실사 약도 생성 — OpenStreetMap 타일 위에 실제 도로 경로(OSRM 도보)와 큰 글씨 라벨
   --------------------------------------------------------------------------
   실행:  node tools/sketch-map.mjs   →  images/sketch-map.jpg (+ @2x)
   타일/경로는 tools/sketch-cache/ 에 캐시합니다. 결과물은 커밋합니다.
   ========================================================================== */
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CACHE = join(HERE, 'sketch-cache'); mkdirSync(CACHE, { recursive: true });
const UA = 'cheongwoohaejang.com sketch-map builder (storm2119@gmail.com)';

const Z = 19;   // 레티나용 2배 해상도
const P = { // 네이버 지역검색 좌표 (2026-08-18)
  store:   { lat: 35.8687847, lng: 128.5884600 },
  hyundai: { lat: 35.8673087, lng: 128.5901352 },  // 더현대 대구 출구 (반월당역 지하 연결)
  exit18:  { lat: 35.8661687, lng: 128.5909148 },
  park1:   { lat: 35.8689680, lng: 128.5882798 },  // 약령시서문 공영주차장
  museum:  { lat: 35.8683970, lng: 128.5899063 },
  park2:   { lat: 35.8677306, lng: 128.5904823 },  // 약령시서편 공영주차장
};
// 화면에 담을 범위 (가게~반월당역)
const BBOX = { lat0: 35.8655, lat1: 35.8698, lng0: 128.5866, lng1: 128.5926 };

const n = 2 ** Z;
const toTile = (lat, lng) => [(lng + 180) / 360 * n, (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n];
const [x0f, y1f] = toTile(BBOX.lat0, BBOX.lng0); const [x1f, y0f] = toTile(BBOX.lat1, BBOX.lng1);
const tx0 = Math.floor(x0f), tx1 = Math.floor(x1f), ty0 = Math.floor(y0f), ty1 = Math.floor(y1f);
const W = (tx1 - tx0 + 1) * 256, H = (ty1 - ty0 + 1) * 256;
const px = (lat, lng) => { const [x, y] = toTile(lat, lng); return [(x - tx0) * 256, (y - ty0) * 256]; };

// 1) 타일
const tiles = [];
for (let x = tx0; x <= tx1; x++) for (let y = ty0; y <= ty1; y++) {
  const f = join(CACHE, `${Z}_${x}_${y}.png`);
  if (!existsSync(f)) execFileSync('curl', ['-s', '-A', UA, '-o', f, `https://tile.openstreetmap.org/${Z}/${x}/${y}.png`]);
  tiles.push({ input: f, left: (x - tx0) * 256, top: (y - ty0) * 256 });
}

// 2) 경로 (OSRM 도보) — 더현대 출구 → 가게
const rf = join(CACHE, 'route.json');
if (!existsSync(rf)) execFileSync('curl', ['-s', '-A', UA, '-o', rf, `https://router.project-osrm.org/route/v1/foot/${P.hyundai.lng},${P.hyundai.lat};${P.store.lng},${P.store.lat}?overview=full&geometries=geojson`]);
const route = JSON.parse(readFileSync(rf, 'utf-8')).routes[0];
const line = route.geometry.coordinates.map(([lng, lat]) => px(lat, lng).map(v => v.toFixed(1)).join(',')).join(' ');
const walkMin = Math.max(3, Math.round(route.distance * 1.15 / 70));  // 어르신 걸음 70m/분

// 3) 오버레이 SVG
const S = 2;   // z19 라 픽셀이 2배 → 글씨·선도 2배
const font = "'Apple SD Gothic Neo','Pretendard','Noto Sans KR','Malgun Gothic',sans-serif";
const [sx, sy] = px(P.store.lat, P.store.lng);
const [hx, hy] = px(P.hyundai.lat, P.hyundai.lng);
const [ex, ey] = px(P.exit18.lat, P.exit18.lng);
const [p1x, p1y] = px(P.park1.lat, P.park1.lng);
const [p2x, p2y] = px(P.park2.lat, P.park2.lng);
const [mx, my] = px(P.museum.lat, P.museum.lng);
const label = (x, y, text, opt = {}) => {
  const fs = (opt.fs || 22) * S, pad = 10 * S, w = text.length * fs * (opt.cjk === false ? 0.58 : 0.98) + pad * 2, h = fs + 16;
  const ax = opt.anchor === 'end' ? x - w : opt.anchor === 'middle' ? x - w / 2 : x;
  return `<g><rect x="${ax}" y="${y - h / 2}" width="${w}" height="${h}" rx="${8*S}" fill="${opt.bg || '#fff'}" stroke="${opt.stroke || 'rgba(0,0,0,.18)'}" stroke-width="${1.5*S}"/>
    <text x="${ax + w / 2}" y="${y + fs * 0.36}" font-family="${font}" font-size="${fs}" font-weight="${opt.fw || 700}" fill="${opt.fg || '#1c1916'}" text-anchor="middle">${text}</text></g>`;
};
const pin = (x, y, color, letter) => `<g><circle cx="${x}" cy="${y}" r="${17*S}" fill="${color}" stroke="#fff" stroke-width="${3*S}"/><text x="${x}" y="${y + 7*S}" font-family="${font}" font-size="${19*S}" font-weight="800" fill="#fff" text-anchor="middle">${letter}</text></g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="rgba(255,255,255,.18)"/>
  <!-- 경로 -->
  <polyline points="${line}" fill="none" stroke="#fff" stroke-width="${16*S}" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
  <polyline points="${line}" fill="none" stroke="#c0392b" stroke-width="${9*S}" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- 주차 1: 가게 바로 옆 → 핀 위쪽에 가운데 정렬 -->
  ${pin(p1x, p1y, '#1c3f86', 'P')}${label(p1x, p1y - 44*S, '약령시서문 공영주차장 · 도보 1분', { fs: 16, fw: 600, anchor: 'middle' })}
  <!-- 주차 2 -->
  ${pin(p2x, p2y, '#1c3f86', 'P')}${label(p2x + 24*S, p2y, '약령시서편 공영주차장', { fs: 15, fw: 600 })}
  <!-- 박물관 -->
  ${label(mx, my + 40*S, '약령시 한의약박물관', { fs: 15, fw: 600, anchor: 'middle', bg: 'rgba(255,255,255,.92)' })}
  <!-- 출발: 더현대 → 라벨을 핀 왼쪽으로 -->
  ${pin(hx, hy, '#1c6b48', 'M')}${label(hx - 26*S, hy - 4*S, '반월당역 → 더현대 대구 출구', { fs: 19, bg: '#e8f4ee', fg: '#0f4a30', stroke: '#1c6b48', anchor: 'end' })}
  ${label(hx - 26*S, hy + 36*S, '여기서 출발 · 도보 ' + walkMin + '분', { fs: 16, fw: 600, bg: '#e8f4ee', fg: '#0f4a30', stroke: '#1c6b48', anchor: 'end' })}
  <!-- 18번 출구 (보조) -->
  ${label(ex, ey, '18번 출구', { fs: 14, fw: 600, anchor: 'middle', bg: 'rgba(255,255,255,.9)' })}
  <!-- 도착: 청우해장 → 라벨을 별 왼쪽으로 -->
  <circle cx="${sx}" cy="${sy}" r="${24*S}" fill="#c0392b" stroke="#fff" stroke-width="${4*S}"/>
  <text x="${sx}" y="${sy + 8*S}" font-family="${font}" font-size="${22*S}" font-weight="800" fill="#fff" text-anchor="middle">★</text>
  ${label(sx - 32*S, sy + 2*S, '청우해장', { fs: 28, bg: '#1c1916', fg: '#fff', stroke: '#1c1916', anchor: 'end' })}
  <text x="${12*S}" y="${H - 10*S}" font-family="${font}" font-size="${12*S}" fill="#555">© OpenStreetMap contributors · 경로는 참고용</text>
</svg>`;

// 4) 합성 → 크롭 → 출력
const [cx0, cy0] = px(BBOX.lat1, BBOX.lng0); const [cx1, cy1] = px(BBOX.lat0, BBOX.lng1);
const crop = { left: Math.round(cx0), top: Math.round(cy0), width: Math.round(cx1 - cx0), height: Math.round(cy1 - cy0) };
const base = sharp({ create: { width: W, height: H, channels: 3, background: '#eee' } }).composite([...tiles, { input: Buffer.from(svg), left: 0, top: 0 }]).png();
const buf = await base.toBuffer();
const out = sharp(buf).extract(crop);
const info = await out.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(join(ROOT, 'images/sketch-map.jpg'));
console.log(`✓ images/sketch-map.jpg ${info.width}x${info.height} (${(info.size / 1024).toFixed(0)}KB) · 경로 ${Math.round(route.distance)}m ≈ ${walkMin}분`);
writeFileSync(join(CACHE, 'meta.json'), JSON.stringify({ crop, W, H, walkMin, distance: route.distance }, null, 1));
