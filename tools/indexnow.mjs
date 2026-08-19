#!/usr/bin/env node
/* IndexNow — 네이버(searchadvisor.naver.com/indexnow)·빙에 URL 색인 요청.
   실행: node tools/indexnow.mjs   (배포가 끝난 뒤에 돌리세요 — 키 파일이 라이브여야 합니다) */
import { site } from '../src/store.mjs';
const host = new URL(site.baseUrl).host;
const urls = site.langs.map((l) => site.baseUrl + (site.file[l] === site.file[site.defaultLang] ? '' : site.file[l]));
const body = { host, key: site.indexNowKey, keyLocation: `${site.baseUrl}${site.indexNowKey}.txt`, urlList: urls };
for (const ep of ['https://searchadvisor.naver.com/indexnow', 'https://www.bing.com/indexnow']) {
  const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
  console.log(ep, '→', r.status, r.statusText, (await r.text()).slice(0, 200));
}
