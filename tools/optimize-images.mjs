#!/usr/bin/env node
/* ==========================================================================
   사진 최적화 — images/*.jpg → images/opt/*.avif · *.webp (여러 크기)
   --------------------------------------------------------------------------
   실행:  npm run images      (사진을 새로 넣거나 바꿨을 때만 돌리면 됩니다)

   왜 필요한가
     원본은 1600px JPEG 한 장에 300KB 넘습니다. 휴대폰으로 들어온 손님도
     그 큰 파일을 그대로 받습니다. 화면 폭에 맞는 크기로 미리 잘라 두고
     AVIF·WebP 로 바꾸면 같은 사진이 1/3~1/5 로 줄어듭니다.
     식당 홈페이지는 첫 화면이 늦게 뜨면 손님이 그냥 나갑니다.

   설계 원칙
     · 이 스크립트만 sharp 를 씁니다. `build.mjs` 는 의존성이 하나도 없는
       상태를 유지합니다 — 결과 목록을 images/manifest.json 으로 넘겨줍니다.
     · 결과물(opt/ 와 manifest.json)은 저장소에 같이 커밋합니다.
       그래야 GitHub Pages 나 남의 맥에서 sharp 없이도 그대로 뜹니다.
     · 원본 JPEG 은 지우지 않습니다. AVIF·WebP 를 못 읽는 브라우저와
       카카오톡·네이버 공유 미리보기가 원본을 씁니다.
   ========================================================================== */

import { readdirSync, mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SRC = join(ROOT, 'images');
const OUT = join(SRC, 'opt');

// 만들 가로 크기. 원본보다 큰 크기는 건너뜁니다(늘리면 화질만 나빠집니다).
//  360·720  → 휴대폰 (1배·2배)
//  1080     → 태블릿·작은 노트북
//  1600     → 데스크톱 히어로
const WIDTHS = [360, 720, 1080, 1600];

// 품질. AVIF 는 같은 숫자에서 WebP 보다 더 잘 버팁니다.
const AVIF_Q = 52;
const WEBP_Q = 78;

const kb = (n) => (n / 1024).toFixed(0) + 'KB';

if (!existsSync(SRC)) {
  console.error('images/ 폴더가 없습니다.');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const sources = readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .sort();

if (!sources.length) {
  console.error('images/ 안에 사진이 없습니다.');
  process.exit(1);
}

const manifest = {};
let beforeTotal = 0;
let afterTotal = 0;

for (const file of sources) {
  const srcPath = join(SRC, file);
  const stem = basename(file, extname(file));
  const meta = await sharp(srcPath).metadata();
  const origBytes = statSync(srcPath).size;
  beforeTotal += origBytes;

  // 원본보다 큰 크기는 만들지 않되, 최소 한 장(원본 크기)은 남깁니다.
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);

  const entry = { w: meta.width, h: meta.height, src: `images/${file}`, avif: [], webp: [] };

  for (const w of widths) {
    const h = Math.round((meta.height / meta.width) * w);
    const pipe = sharp(srcPath).resize({ width: w, withoutEnlargement: true });

    const avifName = `${stem}-${w}.avif`;
    const webpName = `${stem}-${w}.webp`;

    const [avifInfo, webpInfo] = await Promise.all([
      pipe.clone().avif({ quality: AVIF_Q, effort: 6 }).toFile(join(OUT, avifName)),
      pipe.clone().webp({ quality: WEBP_Q, effort: 5 }).toFile(join(OUT, webpName)),
    ]);

    entry.avif.push({ w, h, path: `images/opt/${avifName}`, bytes: avifInfo.size });
    entry.webp.push({ w, h, path: `images/opt/${webpName}`, bytes: webpInfo.size });
  }

  // 실제로 페이지가 받게 될 무게는 가장 큰 AVIF 한 장 기준으로 봅니다.
  const biggestAvif = entry.avif[entry.avif.length - 1].bytes;
  afterTotal += biggestAvif;

  manifest[`images/${file}`] = entry;
  console.log(
    `  ✓ ${file.padEnd(20)} ${String(meta.width).padStart(4)}px  ` +
    `${kb(origBytes).padStart(6)} → ${kb(biggestAvif).padStart(6)} (avif)  ` +
    `· ${widths.length}개 크기`
  );
}

writeFileSync(
  join(SRC, 'manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
  'utf-8'
);

const saved = 1 - afterTotal / beforeTotal;
console.log(
  `\n총 ${sources.length}장 · 원본 ${kb(beforeTotal)} → AVIF ${kb(afterTotal)} ` +
  `(${(saved * 100).toFixed(0)}% 감소)\n` +
  `images/manifest.json 갱신 완료 — 이제 \`node build.mjs\` 를 돌리세요.`
);
