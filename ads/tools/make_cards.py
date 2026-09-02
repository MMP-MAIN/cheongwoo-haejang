# -*- coding: utf-8 -*-
"""청우해장 메타 캐러셀 카드 생성 (1080x1080). 가격 바뀌면 CARDS만 고치고 다시 실행.
   실행: python3 ads/tools/make_cards.py  (레포 루트에서)"""
from PIL import Image, ImageDraw, ImageFont
import os, sys
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC=os.path.join(ROOT,"images"); OUT=os.path.join(ROOT,"ads","carousel-2026-09")
F=os.path.expanduser("~/Library/Fonts")
BLACK,BOLD,MED=f"{F}/Pretendard-Black.otf",f"{F}/Pretendard-Bold.otf",f"{F}/Pretendard-Medium.otf"
S,GOLD=1080,(216,168,74)
def fit(path,focus=0.5):
    im=Image.open(path).convert("RGB"); w,h=im.size
    if w>h:
        nw=int(w*S/h); im=im.resize((nw,S),Image.LANCZOS); l=(nw-S)//2; return im.crop((l,0,l+S,S))
    nh=int(h*S/w); im=im.resize((S,nh),Image.LANCZOS); t=int((nh-S)*focus); return im.crop((0,t,S,t+S))
def grad(im,height=560,strength=232):
    g=Image.new("L",(1,height))
    for y in range(height): g.putpixel((0,y),int(strength*((y/(height-1))**1.7)))
    g=g.resize((S,height)); blk=Image.new("RGB",(S,height),(14,11,9))
    im.paste(Image.composite(blk,im.crop((0,S-height,S,S)),g),(0,S-height)); return im
def badge(d,t,x=64,y=64):
    f=ImageFont.truetype(BOLD,34); tw=d.textlength(t,font=f)
    d.rounded_rectangle([x,y,x+tw+52,y+62],radius=31,fill=GOLD); d.text((x+26,y+12),t,font=f,fill=(26,20,14))
def block(d,lines,price=None,note=None):
    fh,fp,fn=ImageFont.truetype(BLACK,78),ImageFont.truetype(BLACK,62),ImageFont.truetype(MED,38)
    y=S-92
    if note: y-=46; d.text((64,y),note,font=fn,fill=(232,222,205))
    if price: y-=78; d.text((64,y),price,font=fp,fill=GOLD)
    for ln in reversed(lines): y-=96; d.text((64,y),ln,font=fh,fill=(255,255,255))
# (파일, 저장명, 배지, [헤드라인], 가격, 보조문구, 세로크롭 위치)  — 가격은 네이버 스마트플레이스 2026-09-01 기준
CARDS=[
 ("cheongwoo-queue.jpg","01-hook","약령시 350년 골목",["줄 서는 데는","이유가 있습니다"],None,"반월당역 도보 5분 · 청우해장",0.35),
 ("food-galbitang.jpg","02-galbitang","대표 메뉴",["갈빗대 통째로","소갈비탕"],"16,000원","12시간 고아낸 맑은 소고기 육수",0.5),
 ("food-ribs.jpg","03-ribs","대구 10미",["소갈비찜","마늘폭탄"],"22,000원","대구식 매운 찜갈비 그대로",0.5),
 ("food-spicy.jpg","04-spicy","해장 1순위",["48시간 고아낸","따로국밥"],"13,000원","얼큰하지만 속은 편안하게",0.42),
 ("food-clear.jpg","05-clear","아이·어르신",["고춧가루 없는","맑은 해장국"],"12,000원","온 가족이 같이 드실 수 있게",0.42),
 ("food-yukhoe.jpg","06-yukhoe","점심 인기",["신선한","육회비빔밥"],"14,000원","청우만의 숙성 간장으로",0.5),
 ("food-naengmyeon.jpg","07-naengmyeon","여름 한정",["청우","평양냉면"],"13,000원","양지·사태만 12시간 우린 육수",0.5),
 ("hood-gate.jpg","08-cta","근대골목투어 코스",["약전골목에서","기다립니다"],None,"전화 예약 053-255-7052 · 매일 11:00–22:00",0.5),
 ("cheongwoo-02.jpg","09-review","구글 리뷰 4.8★",["국물이 시원해서","몸보신하는 기분"],None,"실제 방문 후기 · 남녀노소 다들 좋아할 맛",0.45),
 ("hood-mural.jpg","10-tourist","근대골목 도보 3분",["대구 나들이","점심은 여기서"],None,"약령시 · 서문시장 · 동성로 모두 도보권",0.5),
]
os.makedirs(OUT,exist_ok=True)
for fn,name,bg,lines,price,note,focus in CARDS:
    p=os.path.join(SRC,fn)
    if not os.path.exists(p): print("MISSING",fn); continue
    im=grad(fit(p,focus)); d=ImageDraw.Draw(im); badge(d,bg); block(d,lines,price,note)
    im.save(os.path.join(OUT,f"{name}.jpg"),"JPEG",quality=92,optimize=True); print("OK",name,price or "")
# 미리보기 시트
import glob
fs=[f for f in sorted(glob.glob(os.path.join(OUT,"*.jpg"))) if not os.path.basename(f).startswith("_")]
T=380; sh=Image.new("RGB",(T*5,T*2),(18,16,14))
for i,f in enumerate(fs): sh.paste(Image.open(f).resize((T-8,T-8),Image.LANCZOS),((i%5)*T+4,(i//5)*T+4))
sh.save(os.path.join(OUT,"_preview-sheet.jpg"),quality=88); print("sheet",len(fs))
