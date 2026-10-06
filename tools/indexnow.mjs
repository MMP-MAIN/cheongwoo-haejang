#!/usr/bin/env node
/* IndexNow — 네이버(searchadvisor.naver.com/indexnow)·빙에 URL 색인 요청.
   실행: node tools/indexnow.mjs                      (사이트맵 URL 전부)
         node tools/indexnow.mjs --since=2026-10-05   (사이트맵 lastmod 가 그 날짜 이상인 URL 만)
   배포가 끝난 뒤에 돌리세요 — 키 파일이 라이브여야 합니다. */
import { site } from '../src/store.mjs';
const host = new URL(site.baseUrl).host;
// 사이트맵에 있는 URL — 홈 5개 언어 + 소식 + 가이드·콘텐츠 페이지 (2026-09-04 확장)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const sitemap = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'sitemap.xml'), 'utf8');

// --since=YYYY-MM-DD (2026-10-05 추가): 바뀐 페이지만 보내기. 사이트맵 lastmod 가 실제 수정일이라 가능해짐.
const sinceArg = process.argv.slice(2).find((a) => a.startsWith('--since'));
let since = null;
if (sinceArg) {
  since = sinceArg.includes('=') ? sinceArg.split('=')[1] : process.argv[process.argv.indexOf(sinceArg) + 1];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(since || '')) {
    console.error(`--since 는 YYYY-MM-DD 형식이어야 합니다 (받은 값: ${since})`);
    process.exit(1);
  }
}

const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: (m[1].match(/<loc>(.*?)<\/loc>/) || [])[1],
  lastmod: ((m[1].match(/<lastmod>(.*?)<\/lastmod>/) || [])[1] || '').slice(0, 10),
})).filter((e) => e.loc);
const urls = (since ? entries.filter((e) => e.lastmod && e.lastmod >= since) : entries).map((e) => e.loc);

console.log(since ? `lastmod ≥ ${since}: ${urls.length}/${entries.length}개 URL` : `사이트맵 URL 전부: ${urls.length}개`);
if (!urls.length) { console.log('보낼 URL 이 없습니다.'); process.exit(0); }

const body = { host, key: site.indexNowKey, keyLocation: `${site.baseUrl}${site.indexNowKey}.txt`, urlList: urls };
for (const ep of ['https://searchadvisor.naver.com/indexnow', 'https://www.bing.com/indexnow']) {
  const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
  console.log(ep, '→', r.status, r.statusText, (await r.text()).slice(0, 200));
}
