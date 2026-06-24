/* ============================================================
   채움클래스 (chaeumclass.com) — 학원 홈페이지 Worker
   ------------------------------------------------------------
   배포: Cloudflare Workers (단일 파일)
   상담 메일: Resend (환경변수 RESEND_API_KEY 필요)

   ▼ 아래 CFG 값만 바꾸면 학원 정보가 전체 페이지에 반영됩니다.
     [TODO] 표시된 곳은 실제 정보로 교체하세요.
   ============================================================ */

const CFG = {
  name: "채움클래스",
  tagline: "채워서 완성하는 학습 코칭",
  domain: "https://chaeumclass.com",
  // [TODO] 실제 정보로 교체
  phone: "010-2337-2458",            // 전화 상담 번호
  phoneTel: "01023372458",           // tel: 링크용 (숫자만)
  kakaoUrl: "http://pf.kakao.com/_KRAjG/chat", // 카카오톡 채널 주소
  naverFormUrl: "https://naver.me/GieISRs0", // 네이버 폼(없으면 빈칸 → 버튼 숨김)
  kakaoMapKey: "a27e5e07ed05769aae7cdfdefe3b902a", // 카카오 지도 JavaScript 키
  address: "주소 입력 예정",          // 예) 경기 ○○시 ○○로 00, 0층
  hours: "평일 14:00 ~ 22:00 · 주말 상담 가능",
  // 상담 메일 (Resend)
  mailFrom: "채움클래스 상담신청 <noreply@chaeumclass.com>",
  mailTo: ["thdmsdidfl@naver.com"], // [TODO] 받을 이메일 주소
};

/* ── 디자인 토큰 (채움클래스 전용) ──
   딥 포레스트 그린 + 코랄 포인트 + 웜 화이트 / 헤드라인 명조 */
const STYLE = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&family=Noto+Serif+KR:wght@500;600;700;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --green:#123F33;--green-soft:#1C5C49;--green-deep:#0C2B23;
  --coral:#E1623D;--coral-soft:#EC8164;
  --sage:#6E8C7E;--sand:#E8E2D6;--cream:#F8F6F1;--paper:#fff;
  --ink:#1A2420;--muted:#5C6B64;--faint:#8A968F;
  --r:14px;--r-lg:24px;
  --shadow:0 6px 30px rgba(18,63,51,.07);--shadow-lg:0 18px 50px rgba(18,63,51,.14);
}
html{scroll-behavior:smooth;}
body{font-family:'Noto Sans KR',sans-serif;color:var(--ink);background:var(--paper);line-height:1.65;overflow-x:hidden;}
.serif{font-family:'Noto Serif KR',serif;}
img{max-width:100%;display:block;}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(248,246,241,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--sand);height:66px;display:flex;align-items:center;justify-content:space-between;padding:0 32px;}
.logo{font-family:'Noto Serif KR',serif;font-size:1.28rem;font-weight:900;color:var(--green);text-decoration:none;letter-spacing:-.5px;display:flex;align-items:center;gap:9px;}
.logo .dot{width:10px;height:10px;border-radius:3px;background:var(--coral);transform:rotate(45deg);}
.nav-links{display:flex;align-items:center;gap:26px;}
.nav-links a{text-decoration:none;font-size:.9rem;font-weight:600;color:var(--muted);transition:color .2s;white-space:nowrap;}
.nav-links a:hover{color:var(--green);}
.nav-cta{background:var(--green)!important;color:#fff!important;padding:9px 20px;border-radius:9px;font-weight:700!important;}
.nav-cta:hover{background:var(--green-soft)!important;}
#navToggle{display:none;background:none;border:none;font-size:26px;color:var(--green);cursor:pointer;}

/* shared section */
section{padding:88px 32px;}
.inner{max-width:1080px;margin:0 auto;}
.eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:.78rem;font-weight:800;letter-spacing:2px;color:var(--coral);text-transform:uppercase;margin-bottom:16px;}
.eyebrow::before{content:"";width:26px;height:3px;border-radius:2px;background:var(--coral);}
.title{font-family:'Noto Serif KR',serif;font-size:clamp(1.7rem,3.4vw,2.5rem);font-weight:900;color:var(--green);line-height:1.32;letter-spacing:-.5px;margin-bottom:16px;}
.title .hl{color:var(--coral);}
.lead{font-size:1rem;color:var(--muted);line-height:1.85;max-width:620px;}

/* HERO */
.hero{background:radial-gradient(120% 120% at 85% -10%,#1C5C49 0%,#123F33 45%,#0C2B23 100%);color:#fff;padding:140px 32px 96px;position:relative;overflow:hidden;}
.hero::after{content:"";position:absolute;right:-120px;bottom:-120px;width:420px;height:420px;border-radius:38% 62% 55% 45%/55% 45% 55% 45%;background:rgba(225,98,61,.16);filter:blur(8px);}
.hero-inner{max-width:1080px;margin:0 auto;position:relative;z-index:1;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);color:#fff;font-size:.82rem;font-weight:600;padding:7px 16px;border-radius:100px;margin-bottom:26px;}
.hero h1{font-family:'Noto Serif KR',serif;font-size:clamp(2.1rem,5vw,3.4rem);font-weight:900;line-height:1.28;letter-spacing:-1px;margin-bottom:22px;}
.hero h1 .hl{color:var(--coral-soft);}
.hero p{font-size:1.05rem;color:rgba(255,255,255,.72);line-height:1.85;margin-bottom:36px;max-width:540px;}
.hero-btns{display:flex;gap:13px;flex-wrap:wrap;}
.btn{display:inline-block;padding:15px 32px;border-radius:11px;font-size:1rem;font-weight:700;text-decoration:none;transition:transform .2s,box-shadow .2s,background .2s;cursor:pointer;border:none;font-family:inherit;}
.btn-coral{background:var(--coral);color:#fff;box-shadow:0 8px 24px rgba(225,98,61,.32);}
.btn-coral:hover{transform:translateY(-2px);background:var(--coral-soft);}
.btn-ghost{background:rgba(255,255,255,.08);color:#fff;border:1.5px solid rgba(255,255,255,.28);}
.btn-ghost:hover{background:rgba(255,255,255,.16);transform:translateY(-2px);}
.hero-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:64px;border-top:1px solid rgba(255,255,255,.15);}
.hstat{padding:26px 18px 0;border-right:1px solid rgba(255,255,255,.15);}
.hstat:last-child{border-right:none;}
.hstat .num{font-family:'Noto Serif KR',serif;font-size:2.1rem;font-weight:900;color:#fff;line-height:1;}
.hstat .num .u{font-size:1.1rem;color:var(--coral-soft);margin-left:2px;}
.hstat .lab{font-size:.78rem;color:rgba(255,255,255,.6);margin-top:8px;}

/* WHY */
#why{background:var(--cream);}
.head-center{text-align:center;}
.head-center .lead{margin:0 auto;}
.why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:52px;}
.why-card{background:var(--paper);border:1px solid var(--sand);border-radius:var(--r-lg);padding:32px 26px;transition:transform .3s,box-shadow .3s;position:relative;overflow:hidden;}
.why-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg);}
.why-num{font-family:'Noto Serif KR',serif;font-size:.95rem;font-weight:700;color:var(--coral);margin-bottom:14px;}
.why-card h3{font-size:1.08rem;font-weight:800;color:var(--green);margin-bottom:10px;}
.why-card p{font-size:.9rem;color:var(--muted);line-height:1.75;}

/* PROCESS — 채움 학습 코칭 4단계 */
#process{background:var(--green);color:#fff;}
#process .title{color:#fff;}
#process .lead{color:rgba(255,255,255,.7);}
#process .eyebrow{color:var(--coral-soft);}
#process .eyebrow::before{background:var(--coral-soft);}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:54px;}
.step{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:var(--r-lg);padding:30px 24px;position:relative;}
.step .st-no{font-family:'Noto Serif KR',serif;font-size:2.4rem;font-weight:900;color:var(--coral-soft);line-height:1;opacity:.9;}
.step h3{font-size:1.1rem;font-weight:800;margin:14px 0 6px;}
.step .en{font-size:.74rem;letter-spacing:1.5px;color:rgba(255,255,255,.45);text-transform:uppercase;margin-bottom:12px;}
.step p{font-size:.86rem;color:rgba(255,255,255,.72);line-height:1.7;}

/* MANAGE */
#manage{background:var(--cream);}
.mrow{display:grid;grid-template-columns:1.1fr 1fr;gap:44px;align-items:center;background:var(--paper);border:1px solid var(--sand);border-radius:var(--r-lg);padding:clamp(28px,4vw,48px);margin-bottom:20px;}
.mrow.rev .m-txt{order:2;}.mrow.rev .m-art{order:1;}
.m-tag{display:inline-block;background:rgba(225,98,61,.1);color:var(--coral);font-size:.74rem;font-weight:800;letter-spacing:1px;padding:6px 14px;border-radius:100px;margin-bottom:14px;}
.m-txt h3{font-family:'Noto Serif KR',serif;font-size:clamp(1.3rem,2.6vw,1.7rem);font-weight:900;color:var(--green);margin-bottom:14px;}
.m-txt>p{font-size:.92rem;color:var(--muted);line-height:1.85;margin-bottom:18px;}
.m-list{display:flex;flex-direction:column;gap:11px;}
.m-list div{display:flex;gap:11px;align-items:flex-start;font-size:.88rem;color:var(--ink);}
.m-list .ck{color:var(--coral);font-weight:900;flex-shrink:0;}
.m-art{border-radius:var(--r);aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;background:linear-gradient(150deg,#1C5C49,#0C2B23);color:rgba(255,255,255,.9);text-align:center;padding:24px;position:relative;overflow:hidden;}
.m-art .ph{font-size:.8rem;color:rgba(255,255,255,.55);}
.m-art .big{font-size:3rem;margin-bottom:8px;}

/* SUBJECTS */
.subj-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:52px;}
.subj{background:var(--paper);border:1.5px solid var(--sand);border-radius:var(--r);padding:26px 16px;text-align:center;transition:all .25s;}
.subj:hover{border-color:var(--coral);transform:translateY(-4px);box-shadow:var(--shadow);}
.subj .ic{font-size:1.8rem;margin-bottom:10px;}
.subj .nm{font-weight:800;color:var(--green);margin-bottom:4px;}
.subj .ds{font-size:.76rem;color:var(--faint);}

/* GRADE */
#grade{background:var(--cream);}
.grade-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:52px;text-align:left;}
.gcard{background:var(--paper);border:1px solid var(--sand);border-radius:var(--r-lg);overflow:hidden;transition:transform .3s,box-shadow .3s;}
.gcard:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg);}
.gcard .gtop{padding:26px 26px 20px;color:#fff;}
.gtop .gic{font-size:1.9rem;margin-bottom:8px;}
.gtop h3{font-family:'Noto Serif KR',serif;font-size:1.25rem;font-weight:900;margin-bottom:4px;}
.gtop .gsub{font-size:.8rem;opacity:.82;}
.gcard .gbody{padding:24px 26px;}
.gbody .glabel{font-size:.74rem;font-weight:800;letter-spacing:1px;color:var(--coral);margin-bottom:12px;}
.gbody ul{list-style:none;display:flex;flex-direction:column;gap:9px;}
.gbody li{display:flex;gap:9px;align-items:flex-start;font-size:.86rem;color:var(--ink);line-height:1.6;}
.gbody li .ck{color:var(--green-soft);font-weight:900;flex-shrink:0;}

/* REVIEWS */
.rv-wrap{overflow:hidden;margin-top:48px;position:relative;}
.rv-track{display:flex;gap:18px;width:max-content;animation:rv 38s linear infinite;}
.rv-wrap:hover .rv-track{animation-play-state:paused;}
@keyframes rv{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
.rv{min-width:330px;max-width:330px;background:var(--paper);border:1px solid var(--sand);border-radius:var(--r-lg);padding:26px 24px;flex-shrink:0;}
.rv-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.rv-tag{font-size:.72rem;font-weight:700;color:var(--green);background:rgba(18,63,51,.07);padding:4px 12px;border-radius:100px;}
.rv-star{color:var(--coral);font-size:.82rem;letter-spacing:1px;}
.rv-body{font-size:.9rem;color:var(--ink);line-height:1.75;margin-bottom:16px;}
.rv-who{display:flex;align-items:center;gap:10px;padding-top:14px;border-top:1px solid var(--sand);}
.rv-av{width:36px;height:36px;border-radius:10px;background:var(--green);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-family:'Noto Serif KR',serif;}
.rv-nm{font-size:.84rem;font-weight:700;color:var(--green);}
.rv-mt{font-size:.74rem;color:var(--faint);}

/* FAQ */
.faq{max-width:780px;margin:46px auto 0;display:flex;flex-direction:column;gap:11px;}
.fitem{border:1px solid var(--sand);border-radius:var(--r);overflow:hidden;background:var(--paper);}
.fq{width:100%;background:none;border:none;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:.96rem;font-weight:700;color:var(--green);text-align:left;cursor:pointer;font-family:inherit;}
.fq .qi{color:var(--coral);font-family:'Noto Serif KR',serif;font-weight:900;margin-right:10px;}
.fa{font-size:.9rem;color:var(--muted);line-height:1.8;padding:0 24px 20px;display:none;}
.fitem.open .fa{display:block;}
.fitem.open .fq .ar{transform:rotate(180deg);}
.fq .ar{transition:transform .25s;color:var(--faint);}

/* VISIT */
#visit{background:var(--green-deep);color:#fff;}
#visit .title{color:#fff;}#visit .eyebrow{color:var(--coral-soft);}#visit .eyebrow::before{background:var(--coral-soft);}
.visit-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:46px;align-items:stretch;}
.visit-info{display:flex;flex-direction:column;gap:18px;}
.vi{display:flex;gap:14px;align-items:flex-start;}
.vi .vic{font-size:1.3rem;flex-shrink:0;}
.vi .vk{font-size:.78rem;color:rgba(255,255,255,.5);margin-bottom:2px;}
.vi .vv{font-size:1rem;font-weight:600;color:#fff;}
.visit-map{background:rgba(255,255,255,.05);border:1px dashed rgba(255,255,255,.25);border-radius:var(--r);min-height:240px;display:flex;align-items:center;justify-content:center;text-align:center;color:rgba(255,255,255,.5);font-size:.86rem;padding:20px;}

/* FORM */
#apply{background:var(--cream);}
.form-card{max-width:720px;margin:46px auto 0;background:var(--paper);border:1px solid var(--sand);border-radius:var(--r-lg);padding:clamp(28px,4vw,44px);}
.fgroup{margin-bottom:22px;}
.flabel{display:block;font-size:.84rem;font-weight:700;color:var(--green);margin-bottom:10px;}
.flabel .opt{color:var(--faint);font-weight:400;font-size:.78rem;}
.chips{display:flex;flex-wrap:wrap;gap:8px;}
.chip{background:var(--cream);border:1.5px solid var(--sand);color:var(--muted);padding:8px 16px;border-radius:100px;font-size:.84rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;}
.chip.on{background:var(--green);border-color:var(--green);color:#fff;}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.finput{width:100%;padding:13px 16px;border:1.5px solid var(--sand);border-radius:10px;font-size:.92rem;font-family:inherit;outline:none;transition:border-color .2s;background:var(--paper);}
.finput:focus{border-color:var(--coral);}
.fcheck{display:flex;gap:9px;align-items:flex-start;margin:6px 0 22px;}
.fcheck input{width:17px;height:17px;accent-color:var(--coral);margin-top:2px;flex-shrink:0;cursor:pointer;}
.fcheck label{font-size:.8rem;color:var(--muted);line-height:1.6;cursor:pointer;}
.fsubmit{width:100%;padding:17px;background:var(--coral);color:#fff;border:none;border-radius:12px;font-size:1.02rem;font-weight:800;cursor:pointer;font-family:inherit;transition:all .2s;box-shadow:0 8px 24px rgba(225,98,61,.3);}
.fsubmit:hover{transform:translateY(-2px);background:var(--coral-soft);}
.fkakao{display:block;width:100%;margin-top:12px;padding:16px;background:#FEE500;color:#3A1D1D;border-radius:12px;font-size:1rem;font-weight:800;text-align:center;text-decoration:none;font-family:inherit;}

/* CTA */
#cta{background:linear-gradient(135deg,var(--coral),var(--coral-soft));text-align:center;}
#cta h2{font-family:'Noto Serif KR',serif;font-size:clamp(1.5rem,3.2vw,2.2rem);font-weight:900;color:#fff;margin-bottom:14px;}
#cta p{font-size:1rem;color:rgba(255,255,255,.88);margin-bottom:30px;}
#cta .btn-coral{background:#fff;color:var(--coral);box-shadow:0 8px 24px rgba(0,0,0,.12);}
#cta .btn-coral:hover{background:#fff;}

/* FOOTER */
footer{background:var(--green-deep);color:rgba(255,255,255,.5);padding:46px 32px;text-align:center;font-size:.84rem;line-height:2;}
footer .fbrand{font-family:'Noto Serif KR',serif;font-size:1.2rem;font-weight:900;color:#fff;margin-bottom:8px;}
footer a{color:var(--coral-soft);text-decoration:none;font-weight:600;}

/* FLOATING */
.float{position:fixed;right:18px;bottom:20px;display:flex;flex-direction:column;gap:9px;z-index:90;}
.fbtn{display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:100px;font-size:.84rem;font-weight:700;text-decoration:none;box-shadow:0 8px 22px rgba(0,0,0,.18);transition:transform .2s;}
.fbtn:hover{transform:translateY(-2px);}

/* RESPONSIVE */
@media(max-width:860px){
  #navToggle{display:block;}
  .nav-links{position:fixed;top:66px;left:0;right:0;flex-direction:column;align-items:stretch;gap:0;background:var(--paper);border-bottom:1px solid var(--sand);box-shadow:var(--shadow);padding:8px 0;display:none;}
  .nav-links.open{display:flex;}
  .nav-links a{padding:14px 28px;border-bottom:1px solid var(--cream);}
  .nav-cta{margin:8px 28px;text-align:center;}
  section{padding:60px 22px;}
  .hero{padding:120px 22px 70px;}
  .why-grid,.steps,.grade-grid{grid-template-columns:1fr;}
  .subj-grid{grid-template-columns:repeat(2,1fr);}
  .hero-stats{grid-template-columns:1fr 1fr;}
  .hstat{border-right:none;border-bottom:1px solid rgba(255,255,255,.15);padding-bottom:20px;}
  .mrow{grid-template-columns:1fr;gap:24px;}
  .mrow.rev .m-txt{order:1;}.mrow.rev .m-art{order:2;}
  .visit-grid{grid-template-columns:1fr;}
  .frow{grid-template-columns:1fr;}
  .float .fl{display:none;}
}
/* BRANCHES (전국 지점) */
#branches{background:var(--paper);}
.br-tabs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:36px 0 10px;}
.br-tab{background:var(--cream);border:1.5px solid var(--sand);color:var(--muted);padding:8px 16px;border-radius:100px;font-size:.86rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;}
.br-tab .cnt{font-size:.72rem;color:var(--faint);margin-left:4px;}
.br-tab.on{background:var(--green);border-color:var(--green);color:#fff;}
.br-tab.on .cnt{color:rgba(255,255,255,.7);}
.br-search{max-width:420px;margin:18px auto 0;position:relative;}
.br-search input{width:100%;padding:13px 18px 13px 44px;border:1.5px solid var(--sand);border-radius:100px;font-size:.92rem;font-family:inherit;outline:none;background:var(--cream);transition:border-color .2s;}
.br-search input:focus{border-color:var(--coral);background:#fff;}
.br-search .si{position:absolute;left:18px;top:50%;transform:translateY(-50%);color:var(--faint);}
.br-count{text-align:center;font-size:.84rem;color:var(--faint);margin:20px 0 24px;}
.br-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.br-card{display:block;text-decoration:none;background:var(--paper);border:1px solid var(--sand);border-radius:var(--r);padding:20px 22px;transition:all .25s;}
.br-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--coral);}
.br-card .bc-region{font-size:.74rem;font-weight:700;color:var(--coral);margin-bottom:6px;}
.br-card .bc-name{font-family:'Noto Serif KR',serif;font-size:1.12rem;font-weight:900;color:var(--green);margin-bottom:10px;}
.br-card .bc-meta{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;}
.br-card .bc-subj{font-size:.7rem;background:var(--cream);border:1px solid var(--sand);color:var(--muted);padding:3px 9px;border-radius:100px;}
.br-card .bc-grade{font-size:.78rem;color:var(--faint);}
.br-card .bc-go{font-size:.8rem;font-weight:700;color:var(--green-soft);margin-top:10px;}
.br-more{text-align:center;margin-top:26px;}
.br-more button{background:none;border:1.5px solid var(--sand);color:var(--green);padding:12px 28px;border-radius:100px;font-size:.9rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;}
.br-more button:hover{border-color:var(--green);background:var(--cream);}
.br-empty-msg{text-align:center;color:var(--faint);padding:40px 0;grid-column:1/-1;}

/* BRANCH DETAIL */
.bd-hero{background:radial-gradient(120% 120% at 85% -10%,#1C5C49,#123F33 50%,#0C2B23);color:#fff;padding:120px 32px 56px;}
.bd-hero-inner{max-width:1080px;margin:0 auto;}
.bd-back{display:inline-block;color:rgba(255,255,255,.7);text-decoration:none;font-size:.86rem;font-weight:600;margin-bottom:22px;}
.bd-back:hover{color:#fff;}
.bd-region{font-size:.82rem;font-weight:700;color:var(--coral-soft);letter-spacing:1px;margin-bottom:10px;}
.bd-hero h1{font-size:clamp(1.8rem,4vw,2.7rem);font-weight:900;line-height:1.25;margin-bottom:18px;}
.bd-hero h1 .hl{color:var(--coral-soft);}
.bd-chips{display:flex;flex-wrap:wrap;gap:8px;}
.bd-chip{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:.82rem;font-weight:600;padding:6px 14px;border-radius:100px;}
.bd-chip.light{background:rgba(225,98,61,.25);border-color:rgba(225,98,61,.4);}
.bd-body{background:var(--cream);padding:56px 32px 80px;}
.bd-grid{display:grid;grid-template-columns:1.6fr 1fr;gap:28px;align-items:start;}
.bd-main{display:flex;flex-direction:column;gap:16px;}
.bd-block{background:var(--paper);border:1px solid var(--sand);border-radius:var(--r-lg);padding:26px 28px;}
.bd-h2{font-size:1.05rem;font-weight:800;color:var(--green);margin-bottom:14px;}
.bd-addr{font-size:1rem;font-weight:600;color:var(--ink);margin-bottom:8px;}
.bd-guide{font-size:.9rem;color:var(--muted);line-height:1.7;margin-bottom:14px;}
.bd-maplink{font-size:.86rem;font-weight:700;color:var(--coral);text-decoration:none;}
.art-head{background:var(--paper);padding:96px 32px 24px;}
.art-crumb{font-size:.8rem;color:var(--faint);margin-bottom:14px;}
.art-crumb a{color:var(--faint);text-decoration:none;}
.art-crumb a:hover{color:var(--coral);}
.art-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(225,98,61,.12);color:var(--coral);font-size:.78rem;font-weight:800;padding:6px 14px;border-radius:100px;margin-bottom:16px;}
.art-title{font-family:'Noto Serif KR',serif;font-size:clamp(1.55rem,3.8vw,2.3rem);font-weight:900;color:var(--green);line-height:1.32;margin-bottom:12px;}
.art-title .sub{color:var(--ink);font-weight:700;}
.art-by{font-size:.83rem;color:var(--faint);margin-bottom:16px;display:flex;gap:16px;flex-wrap:wrap;align-items:center;}
.art-by .by-line{width:14px;height:1px;background:var(--sand);}
.art-lead{font-size:.95rem;color:var(--muted);line-height:1.75;border-left:3px solid var(--coral);padding-left:14px;}
.art-thumb{position:relative;margin:22px 0 0;border-radius:var(--r-lg);overflow:hidden;min-height:300px;display:flex;align-items:flex-end;padding:30px;}
.art-thumb-inner{position:relative;z-index:1;}
.art-thumb h2{font-family:'Noto Serif KR',serif;font-size:clamp(1.25rem,3vw,1.9rem);font-weight:900;color:#fff;margin-bottom:14px;text-shadow:0 2px 14px rgba(0,0,0,.45);}
@media(max-width:860px){.art-head{padding:84px 22px 18px;}.art-thumb{min-height:220px;padding:20px;}}
.area-sec{background:var(--cream);padding:56px 32px;}
.area-head{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
.area-head .bar{width:5px;height:22px;border-radius:3px;background:var(--coral);}
.area-h2{font-family:'Noto Serif KR',serif;font-size:1.4rem;font-weight:900;color:var(--green);}
.area-sub{color:var(--muted);font-size:.9rem;margin:0 0 24px 15px;}
.area-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.area-card{display:block;background:var(--paper);border:1px solid var(--sand);border-radius:var(--r);padding:22px;text-decoration:none;transition:transform .25s,box-shadow .25s,border-color .25s;}
.area-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--coral);}
.area-ic{width:44px;height:44px;border-radius:12px;background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:14px;}
.area-card .ac-title{font-size:1.05rem;font-weight:800;color:var(--green);margin-bottom:8px;}
.area-card .ac-desc{font-size:.84rem;color:var(--muted);line-height:1.6;margin-bottom:14px;min-height:2.7em;}
.area-card .ac-more{font-size:.84rem;font-weight:700;color:var(--coral);}
@media(max-width:860px){.area-grid{grid-template-columns:1fr;}}
.bd-trow{display:flex;gap:12px;padding:9px 0;border-bottom:1px solid var(--cream);}
.bd-trow:last-child{border-bottom:none;}
.bd-tk{flex-shrink:0;width:48px;font-size:.82rem;font-weight:800;color:var(--coral);}
.bd-tv{font-size:.9rem;color:var(--ink);line-height:1.6;}
.bd-strength{font-size:.92rem;color:var(--ink);line-height:1.85;white-space:pre-line;}
.bd-empty{font-size:.9rem;color:var(--faint);}
.bd-side{position:sticky;top:86px;}
.bd-card{background:var(--paper);border:1px solid var(--sand);border-radius:var(--r-lg);padding:24px 26px;}
.gg-wrap{padding:12px 0 6px;border-bottom:1px solid var(--cream);margin-bottom:4px;}
.gg-title{font-size:.74rem;font-weight:800;color:var(--faint);margin-bottom:14px;}
.gg-row{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
.gg-subj{display:flex;align-items:center;gap:5px;width:60px;flex-shrink:0;font-size:.82rem;font-weight:800;color:var(--green);}
.gg-badges{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;flex:1;}
.gg-b{font-size:.64rem;font-weight:800;text-align:center;padding:4px 0;border-radius:6px;line-height:1.4;}
.gg-b.off{background:#F1EFEA;color:#CBC6BC;}
.gg-b.on.lv-e{background:#FCE9E1;color:#C24D2B;}
.gg-b.on.lv-m{background:#E1EFE8;color:#1C5C49;}
.gg-b.on.lv-h{background:#1C5C49;color:#fff;}
@media(max-width:520px){.gg-subj{width:48px;font-size:.76rem;}.gg-b{font-size:.58rem;}}
.bd-srow{display:flex;flex-direction:column;gap:3px;padding:12px 0;border-bottom:1px solid var(--cream);}
.bd-srow .bd-sk{font-size:.74rem;font-weight:700;color:var(--faint);}
.bd-srow .bd-sv{font-size:.92rem;font-weight:600;color:var(--green);}
.bd-cta{display:block;text-align:center;margin-top:16px;padding:14px;background:var(--coral);color:#fff;border-radius:11px;font-weight:800;text-decoration:none;font-size:.96rem;}
.bd-cta.kakao{background:#FEE500;color:#3A1D1D;margin-top:10px;}
@media(max-width:860px){
  .br-grid{grid-template-columns:1fr;}
  .bd-hero{padding:100px 22px 44px;}
  .bd-body{padding:36px 22px 60px;}
  .bd-grid{grid-template-columns:1fr;}
  .bd-side{position:static;}
}
/* BRANCH SEO 콘텐츠 (지도/정보성글/수업료표) */
.bd-map{width:100%;height:300px;border-radius:var(--r);overflow:hidden;border:1px solid var(--sand);margin-top:6px;}
.bd-map-ph{display:flex;align-items:center;justify-content:center;min-height:120px;background:var(--cream);color:var(--faint);font-size:.84rem;border:1px dashed var(--sand);border-radius:var(--r);text-align:center;padding:16px;margin-bottom:10px;}
.kmap-label{position:relative;background:var(--green);color:#fff;padding:6px 12px;border-radius:8px;font-size:.8rem;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.25);}
.kmap-label::after{content:"";position:absolute;left:50%;bottom:-5px;transform:translateX(-50%);border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid var(--green);}
.bd-h3{font-size:.98rem;font-weight:800;color:var(--green);margin-bottom:8px;}
.bd-p{font-size:.92rem;color:var(--ink);line-height:1.85;}
.bd-article-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;}
.bd-extra .title{margin-bottom:18px;}
.tuit{width:100%;border-collapse:collapse;margin:10px 0;font-size:.82rem;}
.tuit caption{text-align:left;font-weight:800;color:var(--coral);font-size:.84rem;margin-bottom:6px;}
.tuit th,.tuit td{border:1px solid var(--sand);padding:7px 8px;text-align:center;}
.tuit th{background:var(--cream);color:var(--green);font-weight:700;}
.tuit td:first-child{background:var(--cream);font-weight:600;color:var(--muted);}
.tuit-note{font-size:.78rem;color:var(--faint);margin-top:4px;}
@media(max-width:860px){ .bd-article-grid{grid-template-columns:1fr;} .bd-map{height:240px;} }
</style>`;

const NAV = `
<nav>
  <a href="/" class="logo"><span class="dot"></span>${CFG.name}</a>
  <button id="navToggle" onclick="var m=document.getElementById('nm');m.classList.toggle('open');this.textContent=m.classList.contains('open')?'\\u2715':'\\u2630';">\u2630</button>
  <div class="nav-links" id="nm">
    <a href="#why">학원 소개</a>
    <a href="#process">코칭 시스템</a>
    <a href="#subjects">과목</a>
    <a href="#grade">학년별</a>
    <a href="#reviews">후기</a>
    <a href="#branches">지점 안내</a>
    <a href="#apply" class="nav-cta">상담 신청</a>
  </div>
</nav>`;

const FLOATING = `
<div class="float">
  <a href="tel:${CFG.phoneTel}" class="fbtn" style="background:var(--green);color:#fff;">\u{1F4DE} <span class="fl">전화 상담</span></a>
  <a href="#apply" class="fbtn" style="background:var(--coral);color:#fff;">\u270F\uFE0F <span class="fl">상담 신청</span></a>
  <a href="${CFG.kakaoUrl}" target="_blank" rel="noopener" class="fbtn" style="background:#FEE500;color:#3A1D1D;">\u{1F4AC} <span class="fl">카카오톡</span></a>
</div>`;

const FOOTER = `
<footer>
  <div class="fbrand">${CFG.name}</div>
  <div><a href="tel:${CFG.phoneTel}">\u{1F4DE} ${CFG.phone}</a> &nbsp;·&nbsp; <a href="${CFG.kakaoUrl}" target="_blank" rel="noopener">\u{1F4AC} 카카오톡 문의</a></div>
  <p>전국 200여 개 지점 운영 · 초·중·고 전과목 학습코칭</p>
  <p>© ${CFG.name}. All Rights Reserved.</p>
</footer>`;

/* 후기 카드 (자리표시자 — 실제 후기로 교체 가능) */
function reviewCard(tag, star, body, av, nm, mt) {
  return `<div class="rv"><div class="rv-top"><span class="rv-tag">${tag}</span><span class="rv-star">${star}</span></div><p class="rv-body">${body}</p><div class="rv-who"><div class="rv-av">${av}</div><div><div class="rv-nm">${nm}</div><div class="rv-mt">${mt}</div></div></div></div>`;
}
const REVIEWS_DATA = [
  ["수학 · 중2", "★★★★★", "수업 시간에만 공부하던 아이가 스스로 계획을 세우기 시작했어요. 코치 선생님이 매주 학습 상황을 공유해 주셔서 믿음이 갑니다.", "김", "김○○ 학부모", "중등 수학"],
  ["영어 · 고1", "★★★★★", "내신 등급이 두 단계 올랐어요. 학교 시험 범위에 맞춰 따로 정리해 주셔서 시험 대비가 훨씬 수월해졌습니다.", "이", "이○○ 학생", "고등 영어"],
  ["국어 · 초6", "★★★★★", "글쓰기와 독해를 어려워했는데, 단계별로 차근차근 잡아 주셔서 이제 책 읽는 걸 좋아하게 됐어요.", "박", "박○○ 학부모", "초등 국어"],
  ["과학 · 중3", "★★★★★", "개념을 그림으로 설명해 주셔서 이해가 빨라졌습니다. 모르는 건 바로 질문할 수 있어 좋았어요.", "최", "최○○ 학생", "중등 과학"],
  ["전과목 · 중1", "★★★★★", "학습 태도부터 잡아 주시는 게 인상적이었습니다. 공부 습관이 자리잡으니 성적은 자연스럽게 따라오더라고요.", "정", "정○○ 학부모", "중등 전과목"],
];

const CENTERS = [{"n":"하남풍산점","p":"경기","c":"하남시","a":"경기 하남시 덕풍동로 119 하남프라자 501호 와와학습코칭학원","g":"경기도 하남시 덕풍동로119 하남프라자501호 스타벅스 맞은편 건물입니다 주차 1시간 가능합니다","h":"최형재","s":["영어","수학"],"gr":"초3~고3","t":{"초":"나룰초, 하남풍산초","중":"덕풍중, 신평중, 동부중","고":"풍산고, 남한고, 신장고, 감일고, 미사고, 애니고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"플래너 매일매일 기본으로 작성하고 학교와 학생들의 맞춤수업을 하고 있습니다. 집중력 낮은 중학생도 90점 이상 사례도 있고, 고등학생 30점,25점 성적향상등 학교시험의 특징을 파악해서 맞춤수업을 하고 있습니다. 매일매일 상주하는 센터장과 부센터장 있어서 학생들의 시간변동이나 일찍와서 휴식, 자습도 가능한 센터입니다 꾸준히 학생들, 어머님들과 상담하고 보완하고 있습니다"},{"n":"사동점","p":"경북","c":"경산시","a":"경북 경산시 백자로10길 1 402호 와와학습코칭학원","g":"경산시 백자로 10길 1 402호(사동 공차건물)","h":"박지원","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"사동초, 삼성현초, 평산초, 동부초","중":"사동중, 문명중, 삼성현중, 경산중, 경산여중, 장산중","고":"사동고, 경산여고, 경산고, 문명고, 경북체고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"1) 10년차 경산 전지역 및 사동수업 코치 다수 보유 2) 사동 주변 학교별 시험난이도와 유형 파악 가능 3) 경산&대구(수성구포함) 10년이상 코치님들의 코칭 노하우로 여러 유형의 학생들 맞춤 수업과 폭넓은 진학상담 가능 4)프리미엄 코치 부센터장 5)국어교육과 교원자격증 강사 6)고려대학교(서울안암캠퍼스) 졸업강사"},{"n":"하계점","p":"서울","c":"노원구","a":"서울 노원구 노원로 257 401호","g":"혜성여고 건너편, 하계중 바로 옆, 1층에 메가커피가 있는 건물의 4층 맨 안쪽","h":"이민정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"하계중, 녹천중, 상명중, 태릉중, 공릉중","고":"혜성여고, 대진고, 상명고, 월계고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"1. 전 강사 수석코치 이상, 10년 이상의 학습 코칭 경력 2. 꼼꼼한 플래너 관리 3. 매월 과목별 학습 평가서 학부모 전송 4. 시험 기간 한달 주말 자습실 오픈 5. 매월 정기고사로 학습 진행 상황 체크 + 피드백"},{"n":"수지점","p":"경기","c":"용인시","a":"경기 용인시 수지구 문정로 13 중수프라자 503호","g":"수지구청 맞으면 우리은행 건물 / 수지구청역 2번출구에서 2분거리","h":"이재근","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"풍천초, 정평초, 이현초","중":"이현중, 수지중, 정평중","고":"상현고, 신봉고, 홍천고, 성복고, 풍덕고, 수지고, 죽전고"},"ot":"평일 오후 3시 이후","we":"토,일 둘다 가능","wi":"협의 부탁드립니다.","st":"1. 전강사 수석코치 이상 2. 수지고 출신의 원장의 입시관리 3. 전과목 관리 가능 4. 단원평가 시스템 5. 학부모, 학생과의 관계성 6. 전문관에서의 전문 수업 7. 입시상담"},{"n":"이곡점","p":"대구","c":"달서구","a":"대구광역시 달서구 이곡동 달구벌대로259길 33 제일빌딩 5층","g":"대구시 달서구 달구벌대로259길 33 제일빌딩 5층 (1층이 현풍닭칼국수 음식점이 있는 빌딩)","h":"김재수","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"와룡초","중":"성산중","고":"성서고"},"ot":"평일 오후 2시 이후","we":"토요일 가능","wi":"토요일 오전 10시~오후 3시(국어/수학)/ 오후 1시~ 4시(영어)","st":"1. 초등, 중등 전과목 가능 2. 주간평가서 공유 3. 주기적인 유무선 상담 4. 철저한 수행&내신 관리 5. 입시 상담 가능 6. 월 정기고사 맞춤을 통한 학생의 성취도 평가"},{"n":"탄현점","p":"경기","c":"고양시","a":"경기 고양시 일산서구 산현로17번길 23 은행프라자 4","g":"✅주차장 주소: 경기도 고양시 일산서구 산현로17번길 35 탄현제2공영주차장 (간판은 아파트쪽에서 보이기 때문에 혹시 간판이 보이지 않으면 농협 간판 보고 건물 확인 해주시면 됩니다) (차량 이용 시 주차는 탄현제2공영주차장 이용 부탁드립니다) (죄송하지만 주차비는 따로 지원하고 있지 않습니다)","h":"이경진","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"상탄초","중":"일산동중, 일산중, 호곡중","고":"일산동고, 덕이고, 중산고, 일산동고, 중산고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"기출문제(수학) 점검, 수행평가(국어, 영어, 수학) 자료 잘 봐줍니다, 정기고사(영어, 수학) 진행 합니다. 중학생 일산동중, 일산중 매해 100점 회원 있습니다."},{"n":"철산점","p":"경기","c":"광명시","a":"경기도 광명시 철산동 도덕공원로 27 삼우빌딩 2층","g":"경기도 광명시 도덕공원로27 삼우빌딩 2층 (주차장이 없습니다 인근 철산성당이나 인근 아파트에 주차가능합니다)","h":"유정우","s":["국어","영어","수학","과학"],"gr":"초1~고2","t":{"초":"","중":"","고":""},"ot":"평일 오후 3시 30분 이후","we":"주말불가","wi":"","st":"강사들과 학생간의 관계성이 굉장히 좋습니다. 센터장이 학부모와 주기적으로 소통합니다"},{"n":"치평점","p":"광주","c":"서구","a":"광주 서구 치평로 76 대한빌딩 403호","g":"상무지구 이디야커피 건물4층이나 맥도널드 옆에 있다고 전달드립니다.","h":"조상희","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"운천초, 계수초","중":"전남중, 동명중","고":"전남고, 상무고, 광주여고, 상일여고"},"ot":"평일 오후 3시 이후","we":"토요일","wi":"11:00-14:00 영수","st":"원장이 직접 수업진행합니다. 각 학생별 1:! 맞춤 커리큐럼으로 수업진행하며 학부모님과 단톡방을 운영하며 소통진행하고 있습니다. 초등부터 공부에 집중하는 분위기가 형성되어 있습니다. 초등학생의 플래너관리가 잘 되어 있습니다. 분기별 코칭데이를 진행합니다"},{"n":"지족점","p":"대전","c":"유성구","a":"대전 유성구 지족동 910-7번지 401","g":"노은역 동광장 다이소 맞은편 와플대학, BYC건물 4층","h":"라미영","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"상지초, 지족초, 노은초, 수정초","중":"지족중, 노은중","고":"반석고, 지족고, 노은고, 유성여고"},"ot":"평일 오후 3시 이후","we":"토요일 3시-6시","wi":"토 3시-6시 영,수 가능","st":"내방공부구도를 통해 플래너 관리를 꼼꼼하게 진행, 타과목 관리 가능 시험기간 자습 운영 및 전과목 기출문제 제공 간식 제공, 기본 상비약 구비, 노은역 3분 거리 학원거리에 모여있음."},{"n":"수완점","p":"광주","c":"광산구","a":"광주 광산구 임방울대로 310 아이비타워 406","g":"텃밭 건물로 들어와서 4층으로 올라오시면 바로 아발론 어학원이 있습니다. 그대로 오른쪽을 바라보시면 복도 안쪽에 수완센터가 자리하고 있습니다.","h":"남현주","s":["국어","영어","수학"],"gr":"초3~고3","t":{"초":"","중":"수완중, 장덕중","고":"수완고, 장덕고"},"ot":"평일 오후 3시 이후","we":"토요일 가능","wi":"토요일 오후 14:00~17:00 (수학만 진행)","st":"1급 같은 2급 강사가 막내일 정도로 수완점 강사 모두 경험과 좋은 실력을 갖추고 있습니다. 플래너와 학습방 관리를 통해 학생 스스로 학습에 대한 감을 잡고, 누적해갈 수 있도록 지도하고 있습니다."},{"n":"호매실점","p":"경기","c":"수원시","a":"경기 수원시 권선구 금곡로 116 유동빌딩 602호","g":"금곡동 유동타워 6층입니다.(채선당,아이온 소아과건물)","h":"김윤섭","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"중촌초","중":"칠보중,상촌중","고":"칠보고,호매실고"},"ot":"평일 오후2시 이후","we":"토요일가능","wi":"토요일 오후2시~5시 국어","st":"소수정예 둥지로 개별케어"},{"n":"신곡점","p":"경기","c":"의정부시","a":"경기도 의정부시 신곡동 장곡로 626 금오종합상가 A동 302,303호","g":"경기북부청사경전철역 건너편 금오종합상가 3층(1층 페리카나)","h":"김현웅","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"천보중, 효자중","고":"효자고, 경민it고"},"ot":"평일 오후 2시 이후","we":"토요일11시~13시","wi":"수학","st":"하위권 성적향상 국어고등교육"},{"n":"행신점","p":"경기","c":"고양시","a":"경기 고양시 덕양구 중앙로 442 아성프라자 305호 와와학습코칭학원","g":"경기도 고양시 중앙로 442, 아성프라자 305호(홈플러스 건물 3층)","h":"오지은","s":["국어","영어","수학","과학","사회"],"gr":"초1~고2","t":{"초":"아람초, 행신초, 덕은초, 서정초","중":"서정중, 행신중, 무원중, 가람중, 덕양중","고":"서정고, 행신고, 무원고"},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":"1. 고3 대입강의 경력, 회사 소속 평균 8년 이상의 각 과목별 코치가 초등-고등까지 장단기 커리큘럼으로 수업진행합니다. 각 코치의 회사 소속기간이 길다는 것의 장점은 코칭의 의미를 잘 알고 있어 개별 학생들마다의 잠재력을 인정하고 끌어주기 위해 정성을 다하고 코치 스스로 그릇을 키우기 위한 노력의 중요성을 알고 학생을 이끈다는 것입니다. 즉 학생 수준과 성향의 차이를 고려하는 것의 중요성을 알고 지속발전하는 코치들이 수업을 이끌고 있습니다. 2. 매월 학생별 학습진도에 맞춘 개별 시험으로 정기코칭데이를 진행합니다. 이 정기코칭데이는 학생의 국영수 학습 성취도를 점검해 커리큘럼 조정 및 실전감각 유지를 도모하며, 동일한날 코칭데이를 통해 시기별 학생에게 필요한 학습방법, 습관 등을 생각해보고 배우는 활동을 하며, 한 학기 누적시상 ,월시상, 시험성적시상, 습관시상등을 통해 여러영역에서 동기부여합니다. 3. 첫 상담부터 각 과목별 진단검사를 통해 학생 맞춤 커리큘럼을 설정해 운영하며, 중고등부의 경우 학사일정에 맞춰 내신대비 자체제작 교재를 학교별로 제공합니다. 각 과목별 필요한 DB(유료 사이트, 족보 매쓰플랫 이그잼포유, 독학카페, 리딩앤ort)등을 확보하고 있으므로 같은 학교 학생이 많나요? 라는 질문에 대한 답을 드릴 수 있으며, 학교 정보는 확보한 상태에서 개별맞춤 지도를 통해 결과를 최대한 이끌어 낼 수 있도록 코칭하고 있습니다. 실제로 중3 하위권학생(국영수30-40점대)들이 90점까지 성적향상하는 경우 (서정중) 체육실기생으로 고2 영어 노베학생이 등록 후 고3 첫 모고에서 전교 2등을 하는 등의 결과가 단기간에 있었습니다. 4. 국영수 여러과목을 하는 학생이 많습니다. 즉 각과목별 전문코치가 있기에 여러학원 스케쥴 조정을 할 필요없이 학원에서 전문강사에게 수업을 모두 받을 수 있다는 장점이 있습니다. 5. 학원 등원하지 않는 날에도 영어 ort, 단어 시스템으로 학습할 수 있도록 환경 갖추어 두었고, 수학 오답관리 시스템으로 학생별 오답문제에 대하여 누적반복학습가능하도록 운영하고 있습니다. 6. 내신 시험 최소 4주전부터 주말 자습실 운영 및 실전모의고사 2회이상 실시로 학생들의 내신대비를 돕고 있습니다. 7. 간식이 상비되어있습니다. 8. 매주 좋은글을 업데이트해 학생들이 여러가지로 동기부여 될 수 있도록 게시판 운영하고 있습니다. 9. 내방공부구도 병행 필수로, 각 학생별 스타트체크 진행해 워크시트 주기적으로 진행함으로써 하위권학생들의 공부습관, 자기관리능력을 키울 수 있도록 돕고 각 과목별 공부방법을 익힐 수 있도록 돕고 있습니다. 10. 매수업 학습톡방에 코칭회차관리르 통해 현 진도, 코치 코멘트, 과제진행유무, 과제부여, 학사일정등을 알 수 전달하고 있습니다."},{"n":"서신점","p":"전북","c":"전주시","a":"전북특별자치도 전주시 완산구 서신로 5 4층 와와학습코칭학원","g":"서신로5 4층(본병원 사거리에 있습니다)","h":"김재연","s":["영어","수학","과학"],"gr":"초1~고3","t":{"초":"중산초","중":"","고":"한일고, 근영고"},"ot":"평일 오후 3시 이후","we":"토일부가능","wi":"영어, 수학 11:30~1:00","st":"학습노트 꼼꼼한 관리로 아이와 학부모 만족율up 전문성 있는 강사진 / 강사 평균 경력 10년 학생의 성격 및 성향 분석하고 수업진행 시험기간 독서실 운영"},{"n":"센트럴점","p":"경기","c":"하남시","a":"경기 하남시 미사강변대로 84 미사탑프라자 601호","g":"미사탑프라자 6층( 빽다방 건물/ 자이아파트 정문)","h":"우전희","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"한홀초, 청하초","중":"윤슬중, 미사중","고":"미사강변고, 미사고, 신장고, 남한고, 풍산고, 강일고, 특성화고"},"ot":"평일 오후 2시 이후","we":"토요일 국어,수학가능","wi":"토요일 1시~5시 국어,수학","st":"회원유지율 높음/ 한 학생에 대한 과목별 담당 선생님들 회의가 주3회 이상 진행/ 학부모님과 정기적인 소통/회원별 핵심 오답노트 작성/ 와와 강사들 장기근무(강사 자주 안 바뀜)"},{"n":"미금점","p":"경기","c":"성남시","a":"경기도 성남시 분당구 금곡동 돌마로 87 골드프라자 402호","g":"미금역 2번출구 150m 앞 국민은행 건물4층","h":"김성기","s":["영어","수학"],"gr":"초1~고3","t":{"초":"미금초, 청솔초, 늘푸른초","중":"불곡중, 청솔중, 늘푸른중","고":"불곡고, 늘푸른고, 분당중앙고"},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":"높은 회원유지율/ 공부하는 분위기의 학원/ 수업회원 만족도 높음/ 강사들 소통이 빠름"},{"n":"야탑점","p":"경기","c":"성남시","a":"경기 성남시 중원구 양현로 461 4층","g":"","h":"김정태","s":["국어","영어","수학","과학"],"gr":"초3~고3","t":{"초":"여수초, 야탑초, 중탑초","중":"야탑중","고":"아람고"},"ot":"평일 오후 2시 30분 이후","we":"일요일 가능","wi":"일요일 1시~6시 / 수학, 국어, 과학","st":"즐겁게 일한는 강사진, 인근교육기관중 국 영 수 과 고3까지 수업가능한 학원, 코칭에 진심인 강사의 학습코칭 진행"},{"n":"갈매점","p":"경기","c":"구리시","a":"경기 구리시 갈매중앙로 79 에스엠타워 602호","g":"안녕하세요, OO학생 학부모님~갈매점. 위치는 (구리시 갈매동79, 에스엠타워602호)입니다. 1층에 새마을금고, 베스킨라빈스 건물 6층입니다.","h":"이석환","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"갈매초, 산마루초","중":"갈매중","고":"갈매고"},"ot":"평일 오후 2시 이후","we":"내신시험대비기간 1달전만 진행합니다.","wi":"전과목","st":"1대1밀착관리-학부모님께 회원피드백 수업직후 상시제공, 갈매중고 내신특화, 전과목관리가능"},{"n":"마두점","p":"경기","c":"고양시","a":"경기 고양시 일산동구 중앙로 1191 굿모닝법조타운 1 604호","g":"스타벅스 마두역점 건물 6층","h":"송현규","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"백신초, 호수초, 낙민초","중":"백석중, 백신중","고":"백신고, 정발고"},"ot":"평일 오후 2시반 이후","we":"토요일가능","wi":"토요일 오전 10시~오후 1시 영어","st":"매월 초등 중등 정기고사 실시, 정기고사 시험 분석지 매달 전송, 원장이 연락이 잘됨."},{"n":"첨단점","p":"광주","c":"광산구","a":"광주 광산구 월계로 191 404호","g":"광주광역시 광산구 월계로191 첨단메디컬빌딩 4층 404호 1층에 김가네와 쿼드커피 사이에 입구가 있습니다 엘리베이터에서 내리셔서 바로 오른쪽에 센터가 위치합니다","h":"남현주","s":["국어","영어","수학"],"gr":"초3~고3","t":{"초":"월봉초","중":"천곡중, 월봉중","고":"장덕고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":"주기적인 원장의 학부모 1:1 전화상담 시험기간 한달전부터 매주 주말 시험대비 특강반운영(자체 제작 문제집 증정) 초등회원은 매 단원 끝날때마다 주기적 테스트 및 보완을 통해 한단원 한단원 정확하게 알고 넘어갈수 있도록 집중지도 센터 회원별 학부모님과 함께하는 학습톡방 운영중"},{"n":"송정점","p":"울산","c":"북구","a":"울산 북구 화산로 123 골드테라스 404호","g":"울산 북구 화산로 123 골드테라스건물 4층 404호 1층에 백소정건물있습니다.","h":"임정권","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"고헌초, 송정초, 화봉초","중":"고헌중, 화봉중, 연암중","고":"화봉고, 매곡고, 무룡고, 울산공고, 에너지고"},"ot":"평일 오후 3시 이후","we":"토요일 가능","wi":"토요일 수학 과학 1-4시","st":"학부모, 교사간 단톡방, 정기적인 시험대비 고사, 주기적인 원장쌤과 학부모간 대화"},{"n":"석동점","p":"경남","c":"창원시","a":"경남 창원시 진해구 석동로 51 세븐코아 504호","g":"진해구 석동로 51 세븐코아빌딩 5층 와와학습코칭센터","h":"신재호","s":["영어","수학"],"gr":"초5~고1","t":{"초":"","중":"석동중","고":""},"ot":"평일 오후 3시 이후","we":"토요일 저녁","wi":"영.수","st":"독서토론"},{"n":"수진점","p":"경기","c":"성남시","a":"경기 성남시 중원구 원터로 95 2층","g":"성남중앙초 후문 앞 cu 옆 건물, 행복한성적표 위층","h":"김유미","s":["영어","수학"],"gr":"초3~고2","t":{"초":"성남중앙초","중":"성일중, 성남중, 동광중, 풍생중","고":"성남여고, 성남고, 성일고, 동광고, 효성고, 숭신여고, 복정고"},"ot":"평일 오후 2시 이후","we":"토요일 가능","wi":"화&목 오후 6시이후 토요일 오후 12~4시 영어 / 월&수 오후 6시 이후 토요일 오전 10~2시 사이 수학 / 월수금 오후 6시 이후 영어","st":"아이들의 수준에 맞게 친절하고 꼼꼼하게 잘 설명해주며 각 과목 수행평가 관리도 같이 해줍니다. 내신대비 수능대비 다 강합니다."},{"n":"수성2가점","p":"대구","c":"수성구","a":"대구 수성구 명덕로 404 1동 404호 와와학습코칭학원","g":"_x0008_대구 수성고 명덕로 404, 404호 3호선 수성시장역 2번출구에서 대봉교방향으로, 금손아귀 건물 4층","h":"서하윤","s":["국어","영어","수학","과학","사회"],"gr":"초4~고1","t":{"초":"동일초, 동도초, 동성초","중":"대구동중, 신명여중, 중앙중, 황금중","고":"남산고, 경북고"},"ot":"평일 오후 2시 이후","we":"토요일 수업 가능, 일요일 시험대비 자습반 운영 가능","wi":"토요일 11:30 ~ 5:30 /영어,수학","st":"모든 회원 플래너 작성/학부모,학생,코치 모두가 있는 학습관리(카톡방)운영/깨끗하고 쾌적한 환경/1:1 맞춤 클리닉 수업 가능"},{"n":"기흥구청점","p":"경기","c":"용인시","a":"경기 용인시 기흥구 구갈로60번길 15 경영빌딩 3층 와와학습코칭학원","g":"기흥구청 앞 신협 건물 3층, 한양수자인 103동 건너편","h":"김지연","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"구갈초, 산양초, 관곡초","중":"구갈중, 신갈중, 신릉중","고":"기흥고, 신갈고, 성지고"},"ot":"평일 오후 1시 이후","we":"토요일 영어/ 일요일 수학","wi":"토요일 1시~5시 영어 일요일 1시~5시 수학","st":"편안한 수업 분위기/ 강사 소통이 빠름/ 유지율이 높음"},{"n":"대구도남점","p":"대구","c":"북구","a":"대구 북구 도남중앙로7길 20-3 위너프라자 402호 와와학습코칭학원","g":"도남힐스테이트데시앙3단지와 1단지 사이 위너프라자 4층","h":"박민아","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"도남초, 국우초","중":"학남중 강북중","고":"학남고, 구암고, 강북고"},"ot":"평일 오후 2시 이후","we":"토요일가능, 일요일가능","wi":"토요일 오후 1시~ 5시 수학","st":"수업 시간내 타켓 학교 수행평가 대비 학교 유인물 빠른 분석 및 수업시간 바로 적용, 4주이상 주말 시험대비 특별 보강 및 영어 듣기 평가 대비 특강 주말 진행 , 국영수사과 초중고 모든 과목 일대일 전문 강사 수업 가능, 주말 활용 일대일 방문 수업 병행 가능"},{"n":"반석점","p":"대전","c":"유성구","a":"대전 유성구 지족로 282 코오롱타워2 303,304","g":"와이식자재마트 대각선, 브래드홀릭 건물 3층","h":"오현화","s":["국어","영어","수학"],"gr":"초4~고3","t":{"초":"새미래초, 반석초","중":"새미래중, 외삼중, 하기중","고":"반석고, 노은고, 지족고, 유성고"},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":"학생의 강점을 찾아주는 수업 방식 학생 뿐만 아니라 학부모님과의 소통이 밀접하게 이루어지는 관리 태도의 성장을 만들어 냄으로서 장기적인 학습 강점을 빌드업 해주는 학원"},{"n":"화성태안점","p":"경기","c":"화성시","a":"경기 화성시 병점중앙로 87 408호 와와학습코칭학원","g":"병점고 맞은편 봉구스 밥버거 건물 4층 (엘리베이터 내리셔서 오른쪽 끝 -> 왼쪽 끝 위치)","h":"원예림","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"송화초, 태안초, 병점초","중":"병점중, 안화중, 안용중","고":"병점고, 안화고"},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":"1. 처음 학습 시작하는 학생들이나, 진도가 많이 뒤쳐졌거나, 내향적인 학생들도 원하는 성장을 할 수 있는 교사진과 센터 분위기 2. 개별 학습 수준에 맞춘 AI 교재 및 학습량 설정, 개별 학습자료 제공으로 실제적 학업 향상 3. 안화중 병점중 진안중 반월중 기산중 맞춤 수행평가 관리와 시험 대비 4. 초등 전과목 맞춤 관리 가능 5. 학부모님과 과목 전체 교사진의 단톡방 운영 및 개별 관리"},{"n":"봉담점","p":"경기","c":"화성시","a":"경기 화성시 봉담읍 상리중심상가길 28-8 713호 와와학습코칭학원","g":"","h":"박재현","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"삼각산점","p":"서울","c":"강북구","a":"서울 강북구 미아동 811-9 두산위브테라스파크 상가 402/403호","g":"","h":"김현정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"길음초, 송천초, 미양초","중":"삼각산중, 길음중, 미양중","고":"삼각산고, 미양고, 영훈고, 혜화여고"},"ot":"평일 오후 4시 이후","we":"토요일만 가능","wi":"토욜 10-12 수학12-2 영어","st":""},{"n":"당산점","p":"서울","c":"영등포구","a":"서울 영등포구 당산로44길 3 삼성타운 504","g":"당산역 10번 출구, 2호선 지나는 도로 따라 레미안4차 지나면 크로미빵집있는 건물 5층입니다.","h":"남연숙","s":["국어","영어","수학"],"gr":"초3~고1","t":{"초":"당서초, 영동초, 당중초","중":"당산중, 당산서중, 선유중","고":"선유고, 여의도고, 여의도여고, 영등포여고, 관악고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"은평점","p":"서울","c":"은평구","a":"서울특별시 은평구 진관동 진관2로 29-21 드림스퀘어 제 8층 804호 805호","g":"구파발역 2번출구,구파발성당 맞은편 1층 이디야,서브웨이 건물입니다.","h":"남연숙","s":["영어","과학","사회"],"gr":"초3~고1","t":{"초":"은진초, 은빛초, 진관초, 신도초","중":"진관중, 신도중, 연천중","고":"진관고, 신도고, 대성고, 선일여고"},"ot":"평일 오후 2시 이후","we":"토요일11시~3시","wi":"영과사","st":""},{"n":"화정점","p":"경기","c":"고양시","a":"경기 고양시 덕양구 화신로 263 브릿지타워 213호, 214호 와와학습코칭학원","g":"경기도 고양시 덕양구 화신로 263 브릿지타워 2층 214호 (한방병원 건물)","h":"한민진","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"","중":"화정중, 지도중, 신능중","고":"화정고, 화수고, 백양고"},"ot":"평일 오후 2시 이후","we":"토요일 가능","wi":"2시-5시10 (영어, 수학)","st":"일대일 맞춤 수업 (성적향상 다수), 자기주도가 가능한 탄탄한 회원관리 시스템, 코칭 만족도가 높음, 전문성있는 코치들의 회원 관리 퀄리티가 좋음."},{"n":"인창점","p":"경기","c":"구리시","a":"경기 구리시 건원대로 36 제 407호 와와학습코칭학원","g":"화성골드프라자( 1층에 베스킨라빈스) 4층","h":"김현정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"건원초, 동구초, 구지초","중":"인창중, 동구중","고":"인창고, 수택고"},"ot":"평일 오후 2시이후","we":"주말불가","wi":"없음","st":"매 수업 후 수업 소통방에 피드백과 수업진행사항 공유 두달 마다 정기고사 진행 코칭데이 진행"},{"n":"염창점","p":"서울","c":"강서구","a":"서울 강서구 양천로67길 15 한희빌딩 2층 202호 와와학습코칭학원","g":"등촌역 2번출구 직진 500미터 염창중앙교회옆건물, 강서구 염창동 242-11 한히빌딩 5층","h":"최동명","s":["국어","영어","수학","과학"],"gr":"초4~고3","t":{"초":"염경초, 염동초, 백석초","중":"","고":""},"ot":"평일 오후 3시 이후","we":"토요일만 가능","wi":"토 7-10 국영","st":"고객 필수사항 1. 국: 1차진도 방학 : 문학 비문학- 이해/ 설명 평가문제집 1차풀이 개학: 기출예상문제- 족보 오답 유형별 반복 2. 영: 방학 레벨업 과정 교과서 독해 1차 스토리북2권 4대영역 레벨업: 문법, 단어, 독해, 말하기 개학: 시험 6주 대비반 3. 수: 4회 반복학습 방학 선행 2권(공식,연산위주) 개학 후행 3권+ 1,2권 보완 시험 4주전- 평균점수내기/ 시험 연습"},{"n":"인천삼산점","p":"인천","c":"부평구","a":"인천 부평구 체육관로 32 하이존빌딩 8층 802","g":"인천 부평구 체육관로 32 하이존 8층 (삼산체육관에서 도보 5분) or 굴포천역 도보 5분 or 삼산타운 7단지 정문 맞은편","h":"김현정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"굴포초, 진산초, 영선초","중":"진산중, 삼산중, 구산중","고":"영선고, 삼산고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"학사일정에 맞춰 개인별 수행평가 대비 및 정기 와와고사 진행 / 단톡방 운영으로 학부모님과 적극 소통 / 국,영,수 종합 학원"},{"n":"이매점","p":"경기","c":"성남시","a":"경기도 성남시 분당구 이매동 이매로 49 4층 와와학습코칭센터","g":"수인 분당선 이매역 6번 출구 바로 앞 1층 쿠쿠매장 주영빌딩 4층","h":"이세영","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"이매초, 안말초","중":"매송중, 이매중, 송림중","고":"이매고, 송림고, 태원고, 돌마고"},"ot":"평일 오후 2시 이후","we":"토요일 가능","wi":"토요일 2시30분~4시 수학 4시~5시30 영어","st":""},{"n":"침산점","p":"대구","c":"북구","a":"대구 북구 침산남로 140 엠비프라자 901","g":"","h":"구선영","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"침산초, 달산초","중":"침산중, 대구일중, 경명여중, 산격중, 대구북중","고":"경명여고, 칠성고, 청구고, 사대부고, 경상고"},"ot":"평일 오후 2시 30분 이후","we":"토일 둘다 가능","wi":"토 2~6시 국영수 일 2~6시 국영수","st":""},{"n":"오산점","p":"경기","c":"오산시","a":"경기 오산시 성호대로 121 월드타워 505호","g":"오산시청 우리은행 건물 5층","h":"권희화","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"운천초, 성호초, 운산초","중":"운암중, 운천중, 성호중","고":"운암고, 운천고"},"ot":"평일 오후 2시 이후","we":"조율","wi":"토10:00-13:00 (국어)","st":""},{"n":"별내점","p":"경기","c":"남양주시","a":"경기 남양주시 순화궁로 349 삼광프라자 501호","g":"별내 카페거리 건너편 메가커피 건물5층","h":"이민재","s":["국어","영어","수학","과학"],"gr":"초3~고3","t":{"초":"샛별초, 화접초, 별가람초, 한별초, 덕송초","중":"별가람중, 한별중, 한삼중","고":"별가람고, 별내고, 한삼고, 퇴계원고, 청학고"},"ot":"평일 오후 2시 30분 이후","we":"주말불가","wi":"주말불가","st":""},{"n":"영통구청점","p":"경기","c":"수원시","a":"경기 수원시 영통구 매탄로108번길 10 모닝프라자 602호","g":"영통구청 옆 중심상가 내 맘스터치 건물 6층","h":"권희화","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"매탄초,매현초","중":"매탄중,매현중","고":"매탄고,효원고"},"ot":"평일 오후 2시 이후","we":"토요일가능","wi":"토요일 오전 9시30분~11시30분 국어,영어 / 오전11시30분~1시 수학,과학","st":"전과목 관리가 가능한 학원 고3까지 영어 수학 뿐만이 아니라 국어와 과학 수업도 전담 교사가 수업이 가능함"},{"n":"부평점","p":"인천","c":"부평구","a":"인천광역시 부평구 부평동 부흥로 264 5층 와와학습코칭센터","g":"부평시장역3번출구에서 도보5분거리/쿠우쿠우 있는 건물 5층","h":"김현정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"부평서초,부평동초","중":"부원중,부원여중","고":"부평고,부평여고"},"ot":"평일 오후 2시 20분 이후","we":"주말불가","wi":"","st":"전과목관리(국영수사과),회원별 강사소통방 운영,매월 수업보고서 전송"},{"n":"풍동점","p":"경기","c":"고양시","a":"경기 고양시 일산동구 숲속마을로 44 미래타워 6","g":"풍동상가 미래타워6층(빽다방,이삭토스트건물)","h":"남연숙","s":["국어","영어","수학","과학","사회"],"gr":"초3~고1","t":{"초":"풍산초, 다솜초, 은행초","중":"풍동중, 풍산중, 양일중","고":"풍동고, 세원고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"송천점","p":"전북","c":"전주시","a":"전북특별자치도 전주시 덕진구 솔내로 129 송천열방빌딩 501호 와와학습코칭학원","g":"","h":"김지수","s":["국어","영어","수학","과학"],"gr":"초4~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 3시 30분 이후","we":"토요일 가능","wi":"수학 오전 가능","st":""},{"n":"태평점","p":"대전","c":"중구","a":"대전 중구 태평로 15 버드내마을아파트 상가 308","g":"","h":"변주은","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"버드내초","중":"버드내중, 태평중","고":""},"ot":"평일 오후 3시 이후","we":"토요일만 가능","wi":"토요일 12시~4시","st":""},{"n":"목감점(모두)","p":"경기","c":"시흥시","a":"경기 시흥시 수풀안길 14-23 4층 402호","g":"시흥시 수풀안길 14-23 메트로타워2 4층(1층에 원할머니보쌈있습니다)","h":"장희석, 박다해, 박찬미","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"조남초, 목감초","중":"조남중","고":"목감고"},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":"국영수과 전과목이 가능"},{"n":"송촌점","p":"대전","c":"대덕구","a":"대전 대덕구 동춘당로94번길 11-7 4층 402","g":"","h":"김정민","s":["국어","영어","수학"],"gr":"초4~고2","t":{"초":"송촌초","중":"매봉중, 법동중, 송촌중","고":"송촌고, 명석고, 우송고, 대전여고, 동대전고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"중동점","p":"경기","c":"부천시","a":"경기 부천시 원미구 길주로 191 금영프라자 제 4층 401호","g":"","h":"최혜민","s":["국어","영어"],"gr":"초1~고3","t":{"초":"부흥초, 중흥초","중":"중흥중, 부명중","고":"증흥고, 중원고, 경기예고"},"ot":"평일 오후 2시 30분 이후","we":"토요일 가능","wi":"협의","st":""},{"n":"중동점(W+)","p":"경기","c":"부천시","a":"경기 부천시 원미구 길주로 219 드림빌딩 401호","g":"","h":"최혜민","s":["수학","과학"],"gr":"초4~고2","t":{"초":"부흥초, 중흥초","중":"중흥중, 부명중","고":"증흥고, 중원고, 경기예고"},"ot":"평일 오후 2시 30분 이후","we":"주말불가","wi":"","st":""},{"n":"신중동점","p":"경기","c":"부천시","a":"경기 부천시 원미구 조마루로291번길 25 센터프라자 405호, 406호","g":"","h":"최혜민","s":["국어","영어","수학","과학"],"gr":"초4~고2","t":{"초":"부곡초, 계남초, 심원초","중":"심원중, 계남중, 부곡중","고":"계남고, 심원고, 원미고"},"ot":"평일 오후 3시 30분 이후","we":"주말불가","wi":"","st":""},{"n":"화정점(W+)","p":"경기","c":"고양시","a":"경기 고양시 덕양구 화중로 32-31 효원빌딩 401호 일부","g":"","h":"한민진","s":["수학","과학"],"gr":"초1~고3","t":{"초":"지도초","중":"화정중, 신능중","고":"화정고, 서정고, 백양고"},"ot":"평일 오후 1시 이후","we":"토요일 2시~5시10분만 가능","wi":"토요일 2시~5시10분만 가능","st":""},{"n":"양덕점","p":"경북","c":"포항시","a":"경북 포항시 북구 천마로 66 환호빌딩 402호","g":"양덕 하나로마트 근처, 양덕 농협사거리 롯데리아 사이 건물, 이디야 건물 4층,","h":"김현정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"양덕초 양서초 장흥초","중":"양덕중 장흥중 대도중 환호여중","고":"장성고 포고 포여고 유성여고"},"ot":"평일 오후 2시 이후","we":"토요일가능","wi":"토요일 오후 1시-4시 영어","st":"시험기간 4주 주말클리닉/연5회 정기고사/개별진도"},{"n":"옥정점","p":"경기","c":"양주시","a":"경기 양주시 옥정로 218 신운정튼튼프라자 305호 와와학습코칭학원","g":"","h":"배성우","s":["수학"],"gr":"초4~고2","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"은평점(글로리드)","p":"서울","c":"은평구","a":"서울 은평구 진관2로 29-21 드림스퀘어 609호","g":"","h":"남연숙","s":["국어"],"gr":"초3~고1","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"다산점(W+)","p":"경기","c":"남양주시","a":"경기 남양주시 다산순환로 350 KB골든타워 310호 더블유플러스학원","g":"","h":"엄경진","s":["수학","과학"],"gr":"초4~고2","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"옥길스타점","p":"경기","c":"부천시","a":"경기 부천시 소사구 범안로 231-15 옥길중앙타워 제2층 201호 와와학습코칭학원","g":"","h":"최진열","s":["국어","영어","수학"],"gr":"초4~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"광장점","p":"서울","c":"광진구","a":"서울 광진구 광나루로 584 동서울빌딩 5","g":"올림픽대교북단사거리 바로 앞, 광진구 광나루로 584 동서울빌딩5층","h":"김지선","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"","중":"양진중, 광장중","고":"광남고, 단대부고, 건대부고"},"ot":"평일 오후 2시 30분 이후","we":"주말불가","wi":"토요일 10-1시 영어수학","st":"1. 배치 즉시 당일 상담 날짜 세팅 2. 영수 경력10년이상 코치들 구성 3. 따뜻하고 재미있는 분위기 4. 플래너 관리 5. 방학특강, 시험대비특강으로 부족한 부분 추가지도 6. 학부모와의 적극적인 소통"},{"n":"반월당점","p":"대구","c":"중구","a":"대구 중구 대봉로 253 3층 와와학습코칭학원","g":"대구 중구 대봉로 253 3층 와와학습코칭학원(센트로팰리스 대백마트 맞은편)","h":"박민아","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"대구초, 사대부초","중":"대구제일중, 사대부중","고":"사대부고, 경북여고"},"ot":"평일 오전 11시 이후","we":"토요일 정규수업진행중","wi":"국영수 9시~3시","st":"초중고 내신&입시&모든코치내방공부9도 코칭 가능 매 수업 후 수업 소통방에 피드백과 수업진행사항 공유 두달 마다 정기고사 후 성취보고서 공유 정기적 입시설명회, 코칭데이 진행"},{"n":"배곧점","p":"경기","c":"시흥시","a":"경기 시흥시 배곧4로 22 배곧타운2 217호 와와학습코칭학원","g":"","h":"정 란","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"명지대역점","p":"경기","c":"용인시","a":"경기 용인시 처인구 명지로40번길 4 링크 153 502호 와와학습코칭학원","g":"","h":"김유미","s":["영어","수학"],"gr":"초3~고2","t":{"초":"함박초, 서룡초","중":"용신중, 용인중","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"칠금점","p":"충북","c":"충주시","a":"충청북도 충주시 칠금동 계명대로 29 3층","g":"","h":"박지수","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"탄금초, 칠금초","중":"탄금중, 칠금중, 중앙중, 미덕중, 여중, 북여중, 충주중","고":"국원고, 예성여고, 충주여고"},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":""},{"n":"세교점","p":"경기","c":"오산시","a":"경기 오산시 수청로 193 P&P세교프라자 402호","g":"오산세교종합사회복지관 앞 스타벅스 건물 4층","h":"권희화","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"문시중, 세마중","고":"세교고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"중학생 중간 기말 시험시 90점 이상자가 절반"},{"n":"수지점(글로리드)","p":"경기","c":"용인시","a":"경기 용인시 수지구 풍덕천로 114 3층 글로리드학습코칭학원","g":"수지구청역 2번출구 바로 앞에 미스터피자 건물 3층","h":"이재근","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"풍천초, 정평초, 이현초","중":"이현중, 수지중, 정평중","고":"상현고, 신봉고, 홍천고, 성복고, 풍덕고, 수지고, 죽전고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"1. 전강사 수석코치 이상 2. 수지고 출신의 원장의 입시관리 3. 전과목 관리 가능 4. 단원평가 시스템 5. 학부모, 학생과의 관계성 6. 전문관에서의 전문 수업 7. 입시상담"},{"n":"마포2호점","p":"서울","c":"마포구","a":"서울 마포구 토정로 252 승지빌딩 3층","g":"서울특별시 마포구 토정로 252 승지빌딩 3층 와와학습코칭학원 (대흥역 3번출구 5분거리이며 1층 기아자동차 AS센터 건물입니다.)","h":"선명도","s":["국어","영어","수학","사회"],"gr":"초3~고3","t":{"초":"신석초, 염리초, 용강초, 서강초, 우이초","중":"서울여중, 동도중, 신수중","고":"서울여고, 숭문고, 광성고, 한성고, 배문고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"친절하고 학부모님들의 만족도가 높은 센터이며 2023 학부모님이 뽑은 최우수 강사가 있는 센터입니다. 초등부터 고3까지 영어와 수학(확통/기하/미적분) 모두 수업이 가능합니다. 초등은 국어도 가능합니다. 개념정리노트와 오답노트 활용을 잘 하고 있습니다. 면학 분위기가 굉장히 좋고 학생수가 현재 많지 않아서 수업의 질이 매우 높은 편입니다. 장기 회원이 많고 학부모님들과 소통이 잘 되며 유지개월 수가 높은 센터입니다."},{"n":"다산도농점","p":"경기","c":"남양주시","a":"경기 남양주시 도농로 29 604호 와와학습코칭센터","g":"다산도농 이마트앞 부영프라자 604호","h":"박은행","s":["국어","영어","수학","과학","사회"],"gr":"초3~고1","t":{"초":"도농초, 금교초, 미금초,","중":"동화중, 도농중, 가운중","고":"도농고, 가운고, 다산고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"월정기평가를 매월 봅니다. 보고나면 보고서 및 코칭평가서를 제공합니다 코칭 데이 및 입시설명회 특강을 통해서 학생들의 부족한 점을 매월분석하여 보완을 합니다. 학부모 학습방을 통해서 수업에 대한 일정을 공유하며 숙제와 부족한 공부는 30분꼭 남겨서 완벽학습을 하며 시험기간에는 1시부터 자습을 통해서 시험대비에 대한 4주 준비를 미리하고있습니다"},{"n":"별가람점","p":"경기","c":"남양주시","a":"경기 남양주시 덕송1로55번길 20 503호","g":"경기도 남양주시 별내동 824-2 별내프라자-2 503호 별내별가람역 3번출구에서 189m","h":"김진희","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"덕송초, 샛별초","중":"별가람중, 화접중, 한별중","고":"별내고, 별가람고"},"ot":"평일 오후 2시 이후","we":"가능","wi":"12시 - 17시 30분 / 국어.사탐","st":"꼼꼼한 테스트 진행으로 학생의 현위치 파악을 잘합니다. 매월 테스트를 통해 수업의 속도 및 내용에 대한 점검을 개인별로 디테일하게 해줍니다. 잦은 학부모 소통으로 학부모님들의 신뢰가 두텁습니다. 강사들간의 단합이 잘되고 사이가 좋아 아이들이 학원에서 편안함을 느낍니다."},{"n":"동탄목동점","p":"경기","c":"화성시","a":"경기 화성시 동탄신리천로 408 M메디칼 212호","g":"경기도 화성시 신리천로 408 M메디컬프라자 212호 와와학습코칭학원","h":"권희화","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"동탄목동초, 한율초","중":"동탄목동중, 세정중","고":"창의고, 정현고"},"ot":"평일 오후 2시 이후","we":"토요일 가능","wi":"토요일 10~12시 국,영,수,사,과 / 1시~3시 수학","st":"모든 회원 베테랑 교사 / 학습관리 꼼꼼하게, 소통방 운영, 매 월 평가 및 피드백"},{"n":"두호점","p":"경북","c":"포항시","a":"경상북도 포항시 북구 용두산길 32 3층","g":"파리 바게트 맞은편 건물 3층","h":"이지수","s":["국어","영어","수학","과학","사회"],"gr":"초3~고3","t":{"초":"","중":"환호여중, 대도중","고":"두호고, 포여고, 장성고, 포고, 중앙고, 중앙여고, 대동고"},"ot":"평일 오후 3시30분이후","we":"토요일가능","wi":"토요일 오후 4시 ~7시 수학","st":"시험직전 주말 3-4주 수업/시험 전후 피드백/장기회원 다수/회원유지율 9개월이상"},{"n":"선운점","p":"광주","c":"광산구","a":"광주 광산구 선운로20번길 55-1 402호 와와학습코칭학원","g":"선운로 20번길 55-1 4층 (배가마트 옆 우산신협 건물)","h":"김윤정","s":["영어","수학","사회"],"gr":"초1~고3","t":{"초":"선운초, 본량초","중":"선운중","고":"정광고, 보문고"},"ot":"평일 오후 2시 이후","we":"토요일","wi":"10:00~11:30 수학 11:30~13:00 영어","st":"플래너 모든 학년 필수 사용(등원,하원시) 숙제 기입까지 단체카톡방을 통한 원활한 소통(지각,결석 여부 빠른 확인) 한국사 수업까지 함께하는 문/이과 무관한 중요과목 관리"},{"n":"교하점","p":"경기","c":"파주시","a":"경기 파주시 청석로 272 센타프라자1 제8층 제803","g":"와와학습코칭학원 파주 교하점 경기도 파주시 청석로272 /센터프라자 803호(파리바게트 건물)","h":"배성우","s":["수학","과학"],"gr":"초3~고2","t":{"초":"청석초, 석곶초, 두일초","중":"교하중, 두일중, 심학중","고":"교하고, 심학고"},"ot":"평일 오후 4시 이후","we":"주말불가","wi":"","st":"모든회원 - 플래너작성 , 단체카톡방, 빠른소통(출결/특이사항) , 국영수과 수업"},{"n":"송파위례점","p":"서울","c":"송파구","a":"서울 송파구 위례광장로 188 아이온스퀘어 8층 816호 와와학습코칭학원","g":"와와학습코칭센터 송파위례점 위례 아이온스퀘어 8층 816호","h":"김연하","s":["국어","영어","수학","과학"],"gr":"초4~고2","t":{"초":"송례초, 위례별초","중":"위례중, 송례중","고":"영어 현재 덕수고만 가능합니다. 예체능 및 특성화는 상담후 가능여부 결정."},"ot":"평일 오후 3시 이후","we":"토요일가능","wi":"국어는 고1만 9-12시 / 고2는 충원없음 영어는 오픈 예정인데 현재 시간 미정 수학/과학 2시 이후부터 끝나는시간 미정","st":"1대1 맞춤식 수업 (학원과 과외의 병합으로 필요한 수업 셋팅) 시험대비 체계적 플랜 및 방학 체계적 학습관리 공부법 및 입시 상담 수시 진행"},{"n":"산본점","p":"경기","c":"군포시","a":"경기 군포시 산본로 394 대림프라자 제 6층 제602호 와와학습코칭학원","g":"경기 군포시 산본로394 602-2호( 대림프라자 6층) 주차장입구가 노란색입니다. 1층에 빽다방,이삭토스트, 본죽 산본학원가 스타벅스 옆 건물 하나로마트 옆","h":"고민정","s":["국어","영어","수학","과학"],"gr":"초3~고2","t":{"초":"광정초","중":"산본중, 궁내중, 수리중, 도장중, 금정중","고":"흥진고, 산본고, 군포고"},"ot":"평일 오후 2시 30분 이후","we":"일요일가능","wi":"일요일 1~5시 국어","st":"학습분위기가 잘 잡혀있고 국영수과 한 학원에서 다 할수 있습니다 과목별 전문강사로 운영합니다"},{"n":"구월점","p":"인천","c":"남동구","a":"인천 남동구 선수촌공원로23번길 6-29 다복타워 401호 와와학습코칭학원","g":"아시아드 로터리, 농협 건물 근처 세무소 방향 바로 옆 건물","h":"조은정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고2","t":{"초":"성리초","중":"성리중","고":""},"ot":"평일 오후 2시 이후","we":"","wi":"","st":"정돈된 학습환경 학습계획을 관리하는 학원 학생들의 소리에 귀 기울이는 학원 청소년 코칭 전문가"},{"n":"고잔점","p":"경기","c":"안산시","a":"경기 안산시 단원구 광덕대로 130 폴리타운 B동 513호","g":"","h":"류성희","s":[],"gr":"","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"현재 수업 배치불가 베테랑 교사진 기본시스템 잘 활용"},{"n":"가좌점","p":"서울","c":"서대문구","a":"서울 서대문구 가재울로 52 승우빌딩 301호","g":"","h":"박종미","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"가재울초, 연가초","중":"","고":"가재울고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"호평점","p":"경기","c":"남양주시","a":"경기 남양주시 늘을3로 65-6 테마프라자 205호","g":"경기 남양주시 늘을3로 65-6 (호평동 617-3) 테마프라자2층 205호 건물 지하 무료주차 가능합니다","h":"김현정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"구룡초, 호평초, 판곡초","중":"판곡중, 호평중","고":"판곡고, 호평고"},"ot":"평일 오후 2시 이후","we":"토요일 오전~오후","wi":"국어,사탐,역사","st":"남여 강사 골고루 분포 30대 초반 강사들 대부분"},{"n":"평내점","p":"경기","c":"남양주시","a":"경기 남양주시 경춘로 1256번길 9 501호","g":"평내상가지역 1층 메가커피건물 2층 아지트떡볶이","h":"변미애","s":["영어","수학"],"gr":"초3~고2","t":{"초":"장내초, 호평초","중":"장내중, 호평중","고":"호평고, 금곡고, 판곡고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"강사들 평균연령이 30대로 체계적으로 잘 지도함"},{"n":"부발점","p":"경기","c":"이천시","a":"경기 이천시 부발읍 경충대로2092번길 39-19 이천하이클래스 207,208","g":"","h":"김연하","s":["국어","영어","수학","과학","사회"],"gr":"초1~고2","t":{"초":"아미초, 신하초","중":"효양중, 사동중, 대월중","고":"효양고, 제일고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"율하점","p":"대구","c":"동구","a":"대구 동구 율하동로 32 4층 와와학습코칭센터","g":"대구 동구 율하동로 32 대은빌딩 4층 (119센터 근처, 율원중 근처)","h":"김현수","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"숙천초, 율원초, 율금초, 안일초","중":"율원중, 강동중, 안심중, 새론중, 신기중, 동원중","고":"동부고, 강동고, 정동고"},"ot":"평일 오후 2시 이후","we":"토요일 가능","wi":"토요일 국어 10~13시","st":"매일 플래너작성을 통한 공부9도관리 매일수업시간 시작전 테스트로 학습관리 매월 월평가서 학부모에게 한달관리 내용전달 시험기간 시험집중 플래너로 4주관리로 중간,기말고사 시험대비 시험후 시험지 분석 및 오답노트 피드백 정기적으로 정기고사 진행으로 학업성취도 평가후 평가서 학부모 안내 시험전 4주 주말독서실 운영으로 학교별 기출문제 풀이 센터장이 학부모와 꾸준한 소통 최우수 플래너상 한달에 한번 시상으로 플래너에 진심인 센터 우수 학생 관리로 각종 시상 항상 깔끔한 학원 환경"},{"n":"비전점","p":"경기","c":"평택시","a":"경기도 평택시 비전동 평남로 937 폴리프라자 602호, 603호","g":"리더스하임 후문 맞은편또는 센텀정형외과 건물 6층","h":"이경화","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"이화초 가내초 자란초","중":"비전중 한광중 한광여중 평택여중 소사벌중","고":"비전고 한광고 한광여고 평택여고"},"ot":"평일 오전 11시이후","we":"토요일가능","wi":"토요일 오전 9시~12시 영어 오전10시30분~1시30분 수학","st":"초등회원 영어수학전문 (국어는 불가) 중등회원 영어수학국어과학 가능 고등회원 영어수학 가능"},{"n":"옥길점","p":"경기","c":"부천시","a":"경기 부천시 소사구 옥길로 116 퀸즈파크 A동 7층 718호~719","g":"","h":"최진열","s":["국어","영어","수학","사회"],"gr":"초4~고3","t":{"초":"버들초","중":"옥길중","고":"범박고"},"ot":"평일 오후 2시 30분 이후","we":"토요일만 가능","wi":"토요일 영어만 가능","st":""},{"n":"후곡점","p":"경기","c":"고양시","a":"경기 고양시 일산서구 일산로 511 태성상가 2층 201,202","g":"","h":"박영미","s":["국어","영어","수학","과학"],"gr":"초2~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말수업가능","wi":"수학&과학","st":"시험대비 집중반 강화 및 입시코칭데이"},{"n":"단구점","p":"강원","c":"원주시","a":"강원특별자치도 원주시 서원대로 406 리더스빌딩 402","g":"단구동 롯데시네마 근처에 우리은행 건물 4층","h":"김신태","s":["국어","영어","수학","과학","사회"],"gr":"초4~고3","t":{"초":"구곡초등학교, 서원주초등학교","중":"남원주중학교, 단구중학교","고":"치악고등학교, 원주고등학교"},"ot":"평일 오후 1시 30분 이후","we":"주말불가","wi":"","st":"국,영,수,사,과 종합적인 관리가 가능한 센터"},{"n":"복대점","p":"충북","c":"청주시","a":"충북 청주시 흥덕구 진재로 37 3","g":"증안초에서 하복대 방향 도보로 5분 / 아인동물병원 옆 건물 3층","h":"박신협","s":["국어","영어","수학","과학"],"gr":"초3~고3","t":{"초":"증안초, 진흥초","중":"복대중, 서원중, 솔밭중","고":"흥덕고, 세광고, 사대부고, 청주고, 중앙여고"},"ot":"평일 오후 3시 이후","we":"토요일 오전10시~오후 3시반 수업가능","wi":"영어,수학,과학","st":"수행평가 및 생기부관리를 통한 입시코칭 가능한 센터 관련학과 출신의 전문 선생님들이 학생 수준별 맞춤수업"},{"n":"단대점","p":"경기","c":"성남시","a":"경기 성남시 수정구 산성대로 423 5층","g":"","h":"김지선","s":["국어","영어","수학"],"gr":"초3~고3","t":{"초":"단대초","중":"서중, 은행중","고":"성남고, 성일고, 숭신여고, 동광고"},"ot":"평일 오후 3시 이후","we":"토 영어","wi":"협의","st":""},{"n":"은평점(W+)","p":"서울","c":"은평구","a":"서울 은평구 진관2로 19 휴먼프라자 312호","g":"","h":"남연숙","s":["수학"],"gr":"초3~고2","t":{"초":"진관초, 신도초, 은진초","중":"진관중, 신도중, 연천중","고":"진관고, 신도고, 대성고, 선일여고, 동명여고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"산내점","p":"경기","c":"파주시","a":"경기 파주시 청암로17번길 21 월드타워5차 405호","g":"","h":"정상민","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"동춘점","p":"인천","c":"연수구","a":"인천 연수구 앵고개로264번길 40 남지빌딩 4층 와와학습코칭센터","g":"","h":"고세정","s":["국어","영어","수학","과학"],"gr":"초3~고2","t":{"초":"","중":"","고":"대건고, 연수여고, 연수고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"후곡점(W+)","p":"경기","c":"고양시","a":"경기 고양시 일산서구 일산로 524 202호 더블유플러스학원","g":"","h":"박영미","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"알파시티점","p":"대구","c":"수성구","a":"대구 수성구 알파시티2로 19 알파N시티 2층 201호 와와학습코칭학원","g":"대구 수성구 알파시티2로19 와와학습코칭학원 201호","h":"지혜영","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"노변초, 고산초","중":"노변중, 고산중","고":"시지고, 덕원고"},"ot":"평일 오후 2시 이후","we":"토요일 국어 수학","wi":"토요일 오전11~2시 국어 /오후1~5 수학","st":"매일 플래너 작성을 통한 관리/ 매월 정기고사 진행 /매월 월평가서 전송 /수업과목별 수행평가 관리/학부모와 지속적인 소통 /시험대비 4주간 일요독서실 진행"},{"n":"신월성점","p":"대구","c":"달서구","a":"대구 달서구 월성동 1848번지 그루타워 702호","g":"","h":"이창무","s":["국어","영어","수학","과학"],"gr":"초4~고2","t":{"초":"조암초, 신월초, 월암초, 월성초","중":"조암중, 월암중, 월서중, 효성중, 영남중, 대건중, 학산중","고":"영남고, 상원고, 효성여고, 송현여고, 상인고"},"ot":"평일 오후 3시 이후","we":"토요일","wi":"토 영어 (12시~2시/4시~6시) 수학( 2시~4시)","st":""},{"n":"대구역점","p":"대구","c":"중구","a":"대구 중구 서성로 99 대구역센트럴자이 상가 302호 와와학습코칭학원","g":"수창공원 맞은편 1층 몬스터커피에서 왼쪽 건물 3층","h":"박민아","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"수창초, 달성초, 종로초","중":"계성중, 성명여중, 사대부중","고":"사대부고, 경북여고, 신명고, 대구고, 경북예고, 칠성고"},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":"매 수업 후 수업 소통방에 피드백과 수업진행사항 공유 두달 마다 정기고사 후 성취보고서 공유 정기적 입시설명회, 코칭데이 진행"},{"n":"신방화점","p":"서울","c":"강서구","a":"서울 강서구 방화대로 294 마곡더블유타워 505","g":"신방화역 6번출구에서 나와서 바로 왼쪽 마곡 더블유타워","h":"조민균","s":["영어","수학","사회"],"gr":"초1~고3","t":{"초":"송화초, 공항초","중":"공항중, 송정중","고":"한서고, 공항고"},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":"영어, 수학, 사회를 1:1처럼 관리받고 꼼꼼하게 수업을 진행합니다."},{"n":"청라점","p":"인천","c":"서구","a":"인천 서구 중봉대로 588 청라센트럴프라자 609","g":"","h":"안윤희","s":["국어","영어","수학","과학"],"gr":"초3~고3","t":{"초":"","중":"청라중, 해원중","고":"청라고, 해원고"},"ot":"평일 오후 3시 이후","we":"토요일은 수학과학만 12시부터","wi":"수학1시30분~7시30분 과학12시~3시","st":""},{"n":"소하점","p":"경기","c":"광명시","a":"경기 광명시 오리로 346 행운드림프라자 4층 405호","g":"","h":"선명도","s":["영어","수학","과학"],"gr":"초3~고3","t":{"초":"충현초, 서면초","중":"충현중, 빛가온중","고":"충현고, 광휘고, 소하고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"복산점","p":"울산","c":"중구","a":"울산 중구 번영로 461 B2동 7","g":"","h":"감병훈","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"동탄호수점","p":"경기","c":"화성시","a":"경기 화성시 동탄순환대로 127-19 에스비타운 907호","g":"우성 상가촌 동탄성모병원 건물 9층","h":"권희화","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"방교초, 서연초","중":"청림중, 서연중, 방교중","고":"정현고, 서연고, 창의고"},"ot":"평일 오후 2시 이후","we":"조율","wi":"조율","st":""},{"n":"동백점","p":"경기","c":"용인시","a":"경기도 용인시 기흥구 중동 동백3로11번길 3 2층 201호","g":"경기도 용인시 기흥구 중동 851-4 동백역타워 2층 201호. 1층에 파찌내 만둣가게가 있는 건물 2층 입니다. 동백역2번 출구 50m 이내 입니다.","h":"이은정","s":["국어","영어","수학","과학"],"gr":"초4~고1","t":{"초":"석성초, 초당초","중":"초당중, 백현중, 동백중, 성지중, 어정중, 용인중","고":"초당고, 백현고, 동백고, 성지고, 용인고"},"ot":"평일 오후 2시 이후","we":"토요일- 과학 정규수업","wi":"과학수업-토요일 오전10시~오후4시","st":"와와학습코칭센터 동백점은 초3~고3까지 국영수과 오랜 경력의 전문 코치들이 학생들을 안정적으로 지도하고 있는 유지개월수가 8개월 이상 되는 센터 입니다."},{"n":"노형점","p":"제주","c":"제주시","a":"제주특별자치도 제주시 노형동 727-3 대안빌딩 3층","g":"제주은행 연북로지점 주차장 뒷편 cu건물3층","h":"박은하","s":["국어","영어","수학","과학","사회"],"gr":"초3~고3","t":{"초":"노형초","중":"서중, 중앙중","고":"지역내 모든 고등학교 가능"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"장기점","p":"경기","c":"김포시","a":"경기도 김포시 장기동 김포한강4로 162 한강메트로 503호, 504호","g":"","h":"오정훈","s":["영어","수학","사회"],"gr":"초3~고3","t":{"초":"푸른솔초, 운유초","중":"장기중, 푸른솔중, 고창중","고":"솔터고, 제일고, 운양고, 통진고"},"ot":"평일 오후 3시 이후","we":"토요일 2시~8시","wi":"토 2시~6시 수학 / 6시~8시 영어","st":""},{"n":"좌동점","p":"부산","c":"해운대구","a":"부산광역시 해운대구 좌동 좌동로 88 울트라타워 5층 508호","g":"부산 2호선 장산역 10번 출구 도보 10분 거리, 1층 장독대(반찬)/호두과자 가게 있습니다.","h":"이진화","s":["국어","영어","수학","과학","사회"],"gr":"초4~고3","t":{"초":"동백초, 부흥초, 신도초","중":"신도중, 부흥중, 신곡중, 해운대중, 해강중","고":"신도고, 양운고, 부흥고, 해운대여고, 해강고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":"매일 플래너 작성과 학부모초대 학습방 운영 / 월평가서 소통 / 과정중시 학습보상 이벤트 상시 진행 \"오고 싶은 센터\" / 친절하고 열정적인 국영수 전문강사진(고등까지) / 시험대비 주말자습,보충수업 운영(의무 2주 참여독려) / 학생 정기상담 및 학부모 상담 / 자체 입시세미나,코칭데이 진행 / 따뜻하고 밝은 분위기의 센터 / 간식맛집"},{"n":"신방점","p":"충남","c":"천안시","a":"충청남도 천안시 동남구 신방동 886 학산프라자 A동 3층 304호,305호","g":"세종약국(이석훈내과와 늘푸른이비인후과가 있는 건물) 3층입니다. 신방점 리처드헤어본점 맞은편 학산프라자 5층건물 3층에 있습니다.","h":"허진희","s":["국어","영어","수학"],"gr":"초3~고3","t":{"초":"신용초","중":"용곡중, 신방중","고":"청수고, 쌍용고, 천안여고"},"ot":"평일 오후 12시 이후","we":"토요일가능","wi":"토요일 오전 10시~오후1시","st":"실력좋은 강사들. 학년별.개인별 맞춤 탁월함"},{"n":"쌍용점","p":"충남","c":"천안시","a":"충청남도 천안시 서북구 쌍용동 불당대로 260 319호 318호(1/2)","g":"하이렉스타운 3층 319호 눈높이옆","h":"김인옥","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"쌍용초.미라초.","중":"쌍용중.계광중.월봉중","고":"쌍용고.월봉고"},"ot":"평일 오후 2시이후","we":"토요일 제한적 가능","wi":"협의","st":""},{"n":"병점점","p":"경기","c":"화성시","a":"경기 화성시 병점1로 221 화인메디컬프라자 2층 203호","g":"병점 중심상가 롯데리아 건물 2층 (설빙과 같은층)","h":"원예림","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"안화초, 진안초, 태안초, 병점초","중":"안화중, 진안중, 병점중, 반월중","고":"안화고, 병점고, 반월고, 능동고"},"ot":"평일 오후 1시 이후","we":"토요일가능","wi":"토요일 오전 11시 ~ 3시 국어 / 오후 1시 ~ 5시 수학","st":"1. 처음 학습 시작하는 학생들이나, 진도가 많이 뒤쳐졌거나, 내향적인 학생들도 원하는 성장을 할 수 있는 교사진과 센터 분위기 2. 개별 학습 수준에 맞춘 AI 교재 및 학습량 설정, 개별 학습자료 제공으로 실제적 학업 향상 3. 안화중 병점중 진안중 반월중 기산중 맞춤 수행평가 관리와 시험 대비 4. 초등 전과목 맞춤 관리 가능 5. 학부모님과 과목 전체 교사진의 단톡방 운영 및 개별 관리"},{"n":"불당점","p":"충남","c":"천안시","a":"충남 천안시 서북구 불당33길 22 고은타워 805호","g":"","h":"김인옥","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시이후","we":"토요일가능","wi":"토요일 오전10시~오후1시 국어","st":"강사들의 일대일 밀착관리력 불무중, 불당중.불당고 특화 수업"},{"n":"웰카운티점","p":"인천","c":"연수구","a":"인천 연수구 인천타워대로54번길 15-5 북일프라자 2층 와와학습코칭학원","g":"북일프라자 1차가 아닌 MUZE건물 2층 북일프라자 2층입니다 북일프라자 2층, 뮤즈카페 건물위 2층입니다","h":"김상헌","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"해송초등학교","중":"해송중학교, 능허대중학교, 박문중학교","고":"해송고등학교, 연송고등학교, 대건고등학교"},"ot":"평일 오후1시이후","we":"토요일가능","wi":"토요일 오전11시~오후2시 /영어, 오후 2시~5시, 영어","st":"저희센터는 센터인근학교에서만 10년가까이 수업한 센터장과 주변학교 정보를 많이 가지고 있습니다. 또한 근처 대형학원 한군데 제외하고는 소수정예 학원중에 교사들이 전문성을 가장 많이 갖추고 있다고 자부할 수 있습니다."},{"n":"중산점","p":"경기","c":"고양시","a":"경기 고양시 일산동구 중산로 103 거풍프라자 202호","g":"일산동구 중산로 103 거풍프라자 202호","h":"박영미","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"모당초, 안곡초, 중산초","중":"안곡중, 중산중, 일산중","고":"안곡고, 중산고"},"ot":"평일 오후 2시 이후","we":"가능","wi":"영수","st":"후곡점 와와 원장의 중산점 open, 학생들 밀착관리 및 실력향상 등 타켓학교 집중전략(모당초, 안곡중과 중산중, 안곡고와 중산고외 타 고등학교 관리가능), 수행평가 만점관리력"},{"n":"가경점","p":"충북","c":"청주시","a":"충북 청주시 흥덕구 서현북로 18 2층 와와학습코칭학원","g":"서현북로 대원칸타빌과 가경 e편한세상 사이 편의점 CU맞은편","h":"박신협","s":["국어","영어","수학","사회"],"gr":"초1~고3","t":{"초":"서현초, 서경초","중":"서현중, 경덕중, 서현중","고":"사대부고, 서원고, 청주외고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"초등 전과목관리(+독서활동)가능 중등 국영수사과 관리 가능 고등 영수 외에 입시상담가능"},{"n":"탕정점(모두)","p":"충남","c":"아산시","a":"충남 아산시 탕정면 한들물빛5로 5 605호 모두오름학습코칭학원","g":"스타벅스 건물 뒷 건물 , 롯데리아 건물","h":"석인수, 김은별, 남민주, 안은영","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"한들물빛초, 연화초","중":"한들물빛중, 아산갈산중, 설화중,탕정중,배방중,세교중","고":"설화고, 이순신고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"탕정역에서 3분, 모두 16년이상 수업하신 원장님들 , 학생 개인별 수업 경험으로 맞춤 교육에 특화,"},{"n":"이시아폴리스점","p":"대구","c":"동구","a":"대구 동구 팔공로51길 33 A-503호 와와학습코칭학원","g":"이시아폴리스 더샵3차아파트 맞은편 이스트 애플빌딩 5층","h":"김현수","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"봉무초, 영신초","중":"영신중, 팔공중, 복현중, 성광중, 성화중, 동촌중","고":"영신고, 경상고, 영진고, 성광고, 성화여고"},"ot":"평일 오후 1시 이후","we":"토요일 국어 수학 가능","wi":"토요일 10시~ 13시","st":"국 영 수 과 사 모든과목 수업가능"},{"n":"신봉점","p":"경기","c":"용인시","a":"경기 용인시 수지구 신봉2로 60 웰스톤시티엔웰스톤에비뉴 1동 103호 와와학습코칭학원","g":"신봉 LG자이2차 옆 웰스톤시티상가 1층, 농협복도 끝에 위치","h":"백승곤","s":["국어","영어","수학","과학","사회"],"gr":"초3~고3","t":{"초":"신봉초, 신일초, 홍천초, 신리초, 성복초","중":"신봉중, 성복중, 홍천중","고":"신봉고, 용인홍천고"},"ot":"평일 오후 2시 30분 이후","we":"토요일 특강수업가능","wi":"토요일 국영수 특강수업 가능 (정오12시30분-오후10시)","st":"#초등 기초부터 고등 입시까지 #국영수과 #단과 #종합 #전 과목 내신 및 수능 집중대비 #내신, 입시 대비 특별반 운영 #매주 (토) 국어특강수업"},{"n":"퇴계원점","p":"경기","c":"남양주시","a":"경기 남양주시 퇴계원읍 퇴계원로 29 202호","g":"퇴계원 한내과 건물 2층","h":"이민재","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"퇴계원초등학교, 도제원초등학교","중":"퇴계원중학교, 진건중학교","고":"퇴계원고등학교, 진건고등학교"},"ot":"평일 오후 2시이후","we":"주말불가","wi":"","st":"꼼꼼한 회원관리! 친절한 상담 초등회원들 수업마치고 1층에 다음 학원차량탑승까지 친절하게 배웅 조용한 센터분위기조성, 배고프지않게 적절한 간식제공"},{"n":"마포점","p":"서울","c":"마포구","a":"서울특별시 마포구 염리동 독막로42길 7 173-3 2층","g":"지하철5호선 마포역, 6호선 공덕역 하차후 염리초등학교 방향으로 10분도보","h":"선명도","s":["국어","영어","수학","과학","사회"],"gr":"초3~고3","t":{"초":"염리초","중":"서울여중, 동도중, 신수중, 숭문중","고":"서울여고, 숭문고, 광성고"},"ot":"평일 오후 2시 이후","we":"토/일 가능","wi":"토 수학 10시~4시 영어 1시~5시 과학 12시~4시 일 국어 1시~5시","st":""},{"n":"용인백현점(모두)","p":"경기","c":"용인시","a":"경기 용인시 기흥구 동백7로 83 백현마을중앙프라자 제 2층 제 208호","g":"동백고등학교 건너편 상가 중에 중앙프라자 2층에 위치한 모두오름 학습코칭학원","h":"이동환","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"동막초, 동백초, 용인백현초","중":"동백중, 용인백현중","고":"동백고, 용인백현고"},"ot":"평일 오후 1시 이후","we":"가능","wi":"토요일 10:00~16:00 / 국영수","st":"4인원장체계 국영수과사 직강 / AI학습클래스 활용 수업관리"},{"n":"대구역점2호관","p":"대구","c":"중구","a":"대구 중구 서성로 99 대구역센트럴자이 상가 203호 와와학습코칭학원","g":"수창공원 맞은편 대구역센트릴자이아파트 상가 2층","h":"박민아","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"수창초, 종로초","중":"계성중, 성명여중, 대구제일중, 사대부중","고":"사대부고, 경북여고, 신명고, 칠성고"},"ot":"평일 오후 1시 이후","we":"토요일 가능","wi":"토 오전9시~오후3시","st":"일대일 맞춤 개별 지도, 수행평가대비, 시험대비4주이상 주말 특별보강, 정기고사 진행, 개별 6개월 플랜, 성취보고서 제공"},{"n":"운정중앙점","p":"경기","c":"파주시","a":"경기도 파주시 양지로 131, 운정SB타워 509호,510호 (동패동)","g":"초롱꽃마을 12단지(대림이편한세상아파트)와 13단지(디에트르아파트) 사이 상가건물들 중 버거킹건물 5층","h":"김현경","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"초롱초","중":"심학중","고":"심학고"},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":"매일 플래너 작성, 정확한 등하원 체크, 핸드폰 관리, AI학습으로 꼼꼼하게 관리, 친절한 선생님들, 성적을 올리는 전문성(수행관리 철저)"},{"n":"충주용산점","p":"충북","c":"충주시","a":"충북 충주시 형설로 54-10,2층 (용산동)","g":"충주중학교 정문으로 오세요","h":"박지수","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"남산초, 용산초","중":"예성여중, 미덕중","고":"충주여고, 예성여고, 충주고"},"ot":"평일 오후 1시 이후","we":"가능함","wi":"국어 영어 수학 과학 사회","st":"개별적인 둥지학습은 유일함 /각 과목당 전문 강사/ 알때까지 친절하게 가르쳐줌/코칭학습/시험기간전과목 대비 /ai 온라인 학습/입시지도 가능/ 이미 칠금점에서 성적향상 입증함/하위권에서 상위권까지 만족하는 코칭학습/플래닝학습지도/공부근력향상"},{"n":"진천점(모두)","p":"대구","c":"달서구","a":"대구광역시 달서구 조암남로 158,301호(유천동)","g":"그랑에비뉴 3층 가장 왼쪽상가 (3층 오름수학 절대아님)","h":"김진혁","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"한솔초, 한샘초","중":"월서중, 조암중, 월암중","고":"영남고, 상원고, 대진고, 효성여고"},"ot":"평일 오후 2시 이후","we":"토요일가능","wi":"토요일 오전10~오후2시 : 영어, 수학, 사회, 역사","st":"1.일대일 맞춤관리 (학생의 강점,취약점 파악후 수준에 맞는 수업가능) 2.플래너 관리 시스템 (학생 스스로 계획을 세우고 시간관리 훈련) 3.꼼꼼한 개념노트관리 (기초개념 반복학습 및 백지테스트) 4.학부모 소통 시스템 (일일 수업리포트 제공) 5.타학원에 비해 탄력적인 수업시간 조율가능"},{"n":"별내중앙점(모두)","p":"경기","c":"남양주시","a":"경기도 남양주시 별내3로 66,401호","g":"우체국과 홈플러스 사이건물 4층입니다!","h":"박선욱, 정호윤, 김명진","s":["영어","수학","과학"],"gr":"초1~고3","t":{"초":"한별초","중":"화접중, 한별중","고":"별내고"},"ot":"평일 오후 3시 이후","we":"시험기간 주말독서실, 주말특강시","wi":"특강 외 없음","st":"4인 원장 체제로 전문성 있는 집중 관리로 고객 만족도 up!"},{"n":"목동점","p":"서울","c":"양천구","a":"서울 양천구 목동동로8길 23 메리트윈 3층 305","g":"","h":"이재박","s":["국어","영어","수학","과학","사회"],"gr":"초4~고3","t":{"초":"신목초, 서정초","중":"목일중, 신목중, 양강중, 금옥중","고":"양천고, 신목고, 한광고, 서울영상고"},"ot":"평일 오후 3시 이후","we":"일요일만 가능","wi":"일요일 오후 12~4시","st":""},{"n":"신도림점","p":"서울","c":"구로구","a":"서울특별시 구로구 신도림동 신도림로 20 397-2 해동빌딩 402호","g":"구로구 신도림로 20 해동빌딩4층(신미림초등학교옆)","h":"김경숙","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"신미림초","중":"신도림중","고":"신도림고, 구현고"},"ot":"평일 오후 2시 이후","we":"토요일 과학수업만가능.일요일불가능","wi":"2시-5시 과학수업가능","st":"전공자가 수업하는 실력있는 강사 모든강사 10년이상 경력자 8명 이내 소수정원으로 진행 분기별 이벤트로 즐거움을 주는 학원"},{"n":"제기점","p":"서울","c":"동대문구","a":"서울 동대문구 왕산로 61 302호 와와학습코칭학원","g":"","h":"김지현","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"용두초, 종암초, 기타사립초","중":"대광중, 성일중","고":"대광고, 청량리고, 경희고"},"ot":"평일 오후 4시 이후","we":"토요일가능","wi":"2시~6시 국어","st":""},{"n":"종암점","p":"서울","c":"성북구","a":"서울 성북구 종암로27길 13 도원프라자 501","g":"종암로27길 13 도원프라자 5층 (메가커피 건물) 성북소방서와 GS 주유소 사이길로 들어오시면 소방서 바로 옆 건물입니다~","h":"정보라","s":["국어","영어","수학","과학"],"gr":"초3~고3","t":{"초":"","중":"종암중, 사대부중, 개운중","고":"사대부고, 용문고"},"ot":"평일 오후 3시 이후","we":"토요일","wi":"12~3시 수학,과학","st":"공부9도 수행,입시관리, 시험기간 자습관리, 2주마다 평가서 관리"},{"n":"명일점","p":"서울","c":"강동구","a":"서울 강동구 양재대로 1606 3층","g":"","h":"원순주","s":["국어","영어","수학"],"gr":"초4~고3","t":{"초":"","중":"천호중, 배재중, 명일중","고":"명일여고, 강동고, 광문고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"구산점","p":"서울","c":"은평구","a":"서울특별시 은평구 역촌동 연서로 130 4층","g":"","h":"조민정","s":["국어","영어","수학"],"gr":"초4~고3","t":{"초":"","중":"구산중, 은평중","고":"예일여중고, 선일여중고"},"ot":"평일 오후 5시 이후","we":"주말불가","wi":"","st":""},{"n":"내발산점","p":"서울","c":"강서구","a":"서울 강서구 마곡중앙4로 74 이웰메디파크 제4층 401,402호","g":"이대서울병원 주차장쪽 입구 맞은편 이웰메디파크 4층 건물","h":"양정원","s":["국어","영어","수학","과학","사회"],"gr":"초3~고1","t":{"초":"공진초등학교, 가곡초등학교","중":"등명중학교, 마곡하늬중","고":"수명고"},"ot":"평일 오전 11시 이후","we":"토요일가능","wi":"토요일 오후1시~5시 국어/사탐","st":"다양한 주변 학교 수행평가 및 내신관리, 학생 개별 성장을 위한 커리큘럼, ai학습을 통한 클리닉 수업, 한달플랜, 주간플랜, 데일리 플랜을 통한 목표설정과 수정, 실천하는 과정엥서의 성취감."},{"n":"금천점","p":"서울","c":"금천구","a":"서울 금천구 금하로 763 벽산아파트 제중심상가동 3층 306-2,307,308","g":"금천구 시흥2동 주민센터 건너편 벽산중심상가 3층","h":"김영숙","s":["국어","영어","수학","과학","사회"],"gr":"초1~고2","t":{"초":"탑동초","중":"동일중, 세일중","고":"매그넷고, 동일여고, 금천고, 문일고"},"ot":"평일 오후 2시 30분 이후","we":"주말불가","wi":"","st":"국,영,수 초등부터 고3(이과)까지 가능/경력이 탁월한 강사들의 강의력"},{"n":"위례점","p":"경기","c":"성남시","a":"경기 성남시 수정구 위례광장로 300 중앙타워 11층 1101-1호","g":"","h":"김연하","s":["국어","영어","수학","과학"],"gr":"초3~고2","t":{"초":"고운초, 위례중앙초, 송례초","중":"위례한빛중, 위례중앙중, 송례중","고":"위례한빛고, 복정고, 문현고"},"ot":"평일 오후 2시 이후","we":"토요일가능","wi":"토요일 오전 10시~ 오후2시(수학) 토요일 12시~6시(국어)","st":""},{"n":"상현점","p":"경기","c":"용인시","a":"경기도 용인시 수지구 상현동 만현로 120 4층 410호 와와학습코칭학원","g":"상현동 sr프라자 4층","h":"배성우","s":["국어","영어","수학","과학"],"gr":"초4~고2","t":{"초":"솔개초, 상현초, 이현초","중":"서원중, 소현중, 이현중, 성복중","고":"상현고, 서원고, 풍덕고, 이의고, 홍천고"},"ot":"평일 오후 3시 이후","we":"토요일 가능","wi":"토요일 2시30-7시 초4-고3 영어수학 가능","st":"매일 플래너작성을 통한 공부9도관리 안정적인 유지율 시험기간 자체교재 제작 맞춤 시험대비 진행 시험후 시험지 분석 및 오답노트 피드백 정기적으로 정기고사 진행 학부모와 원활한 소통 항상 깔끔한 학원 환경"},{"n":"사우점","p":"경기","c":"김포시","a":"경기 김포시 사우중로 77 삼정사이버프라자 304","g":"","h":"김주영","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"금파초, 향산초","중":"금파중, 김포중","고":"사우고, 풍무고, 고촌고"},"ot":"평일 오후 3시 이후","we":"일요일만 가능","wi":"일2-5시 국어, 영어, 사회, 한국사 가능","st":""},{"n":"수지점(W+)","p":"경기","c":"용인시","a":"경기 용인시 수지구 진산로 106 훼미리빌딩 512호,513호,514호","g":"","h":"이재근","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"이현중, 수지중, 정평중","고":"성복고, 풍덕고, 수지고, 죽전고"},"ot":"평일 오후 3시 이후","we":"토,일 둘다 가능","wi":"협의 부탁드립니다.","st":""},{"n":"새롬점","p":"세종","c":"","a":"세종특별자치시 새롬중앙로 62-15 해피라움W 305호","g":"","h":"신재찬","s":["국어","영어","수학"],"gr":"초5~고3","t":{"초":"새뜸초, 새롬초","중":"새뜸중, 새롬중","고":"새롬고, 다정고"},"ot":"평일 오후 3시 50분 이후","we":"주말불가","wi":"","st":""},{"n":"삼산점","p":"울산","c":"남구","a":"울산광역시 남구 삼산동 돋질로 300 4층","g":"","h":"감병훈","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"상남점","p":"경남","c":"창원시","a":"경남 창원시 성산구 마디미동로 25 비전빌딩 302호","g":"상남동 한마음병원 횡단보도 맞은편 건물 3층에 위치","h":"백재승","s":["영어","수학"],"gr":"초6~고1","t":{"초":"외동초","중":"상남중, 토월중, 웅남중","고":"창원중앙여고, 남고, 신월고, 토월고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"AI클래스를 활용한 아이들 맞춤 수업 진행 단톡방을 이용해 플래너 + 학습관리로 학부모와 수업 소통 월말평가, 학습안내문, 정기고사, 시험지분석을 통한 이후 커리큘럼 계획"},{"n":"향남점","p":"경기","c":"화성시","a":"경기 화성시 향남읍 발안로 103-6 J&H빌딩 402호","g":"","h":"정은희","s":["국어","영어","수학"],"gr":"초3~고1","t":{"초":"한울초, 도이초","중":"발안중, 향남중, 하길중, 화성중","고":"향남고, 향일고, 하길고, 발안바이오고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"동래점","p":"부산","c":"동래구","a":"부산광역시 동래구 온천동 충렬대로 129-1 한야빌딩 3","g":"건강검진센터와 동래맥도널드 사이 / 횡단보도 근처 / 건겅검진센터에서 미남역으로 한 블럭","h":"김우성","s":["국어","영어","수학","과학"],"gr":"초4~고3","t":{"초":"내산초","중":"내성중,유락여중,동래중,동해중","고":"내성고,중앙여고,동래고,부산전자고"},"ot":"평일 오후 2시 이후","we":"토요일가능, 일요일가능","wi":"과학 1시~4시, 4시~7시","st":"영어,수학,과학 전공자들로 뛰어난 교수법의 경험 많은 강사진/정기고사/시험대비 주말보강/시험관리/입시상담"},{"n":"장곡점","p":"경기","c":"시흥시","a":"경기 시흥시 진말로 7 중앙프라자 3층 305호, 306호","g":"장곡동 에이스마트 맞은편 '미소신협'건물 3층 와와학습코칭학원","h":"박보배","s":["영어","수학","과학"],"gr":"초3~고2","t":{"초":"장곡초, 진말초","중":"응곡중, 장곡중, 가온중","고":"장곡고, 능곡고, 시흥고"},"ot":"평일 오후 4시 30분 이후","we":"토.일 둘다불가","wi":"불가","st":""},{"n":"갈산점","p":"경기","c":"이천시","a":"경기도 이천시 갈산동 영창로 314 629-2외 2필지 주공프라자 504호","g":"","h":"김지선","s":["국어","영어","수학","사회"],"gr":"초1~고3","t":{"초":"안흥초, 설봉초","중":"이천중, 설봉중, 증포중","고":"제일고, 이현고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"금릉점","p":"경기","c":"파주시","a":"경기 파주시 금빛로 24-27 제일메디컬 502","g":"1층 용우동,복호두있는 건물 5층입니다. 눈높이 옆에있습니다.","h":"김은미","s":["국어","영어","수학","과학","사회"],"gr":"초3~고3","t":{"초":"금릉초, 금화초, 새금초, 금촌초","중":"금릉중, 금촌중, 문산중","고":"금촌고, 문산제일고"},"ot":"평일오후1시이후","we":"토요일가능","wi":"토4~6고1과학 6~8고1수학","st":"첫상담부터 정착까지 센터장 밀착관리/학생별 단톡방운영/매월정기고사/연2회 코칭데이/중2이상 지필대비 주말자습운영"},{"n":"반달점","p":"경기","c":"부천시","a":"경기 부천시 원미구 상일로 69 반달마을 제상가동 제 3층 제 304호 와와학습코칭학원","g":"경기도 부천시 상일로 69 반달마을 상가동 304호 (주차는 아파트 입구에서 상가 304호 방문이라고 하면 됩니다)","h":"김희연","s":["영어","수학","과학"],"gr":"초1~고2","t":{"초":"부인초, 상도초","중":"부인중, 상동중","고":"상원고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"모든 회원 플래너 작성, 학습카톡방 관리, 매월 학습진행 리포트 공유"},{"n":"관평점","p":"대전","c":"유성구","a":"대전 유성구 관평2로 46 밸리타운 501","g":"지도 사진과 함께 동화중학교 맞은편/ 주민센터 뒷 건물 로 설명 드립니다.","h":"박은경","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"동화초, 관평초","중":"동화중, 관평중","고":"중일고, 용산고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"초등부 관리가 잘 되는 센터 / 분기별 이벤트가 있고, 초등부 매월 평가서가 있는 센터 / 밝은 분위기의 딱딱하지 않은 센터 / 회원관리 및 상담관리가 잘 되는 센터"},{"n":"개신점","p":"충북","c":"청주시","a":"충청북도 청주시 서원구 개신동 경신로 31-1 402호","g":"청주시 서원구 경신로 31-1 스타타워빌딩 4층 (개신동 농협사거리, 1층에 롯데리아 개신점이 있는 건물의 4층입니다.)","h":"피진순","s":["국어","영어","수학"],"gr":"초3~고2","t":{"초":"개신초, 서경초, 가경초, 죽림초, 서원초","중":"가경중, 서경중, 경덕중, 사대부중, 성화중, 서원중","고":"서원고, 사대부고, 청주고, 중앙여고, 운호고, 봉명고, 흥덕고, 세광고"},"ot":"평일 오후 3시 이후","we":"토,일 가능","wi":"토요일1시 국어, 3시~6시 수학영어 /일3시~6시 국어","st":"-. 주변 학교에 대한 풍부한 데이터확보로 타겟 관리 가능 (서경중,사대부중,가경중/ 서원고,사대부고/ 내신이 필요한 청주공고,충북공고,청주여상) -. 평일~일요일까지 수업 오픈으로 최대한 학생별 맞춤 시간표 관리 가능. -. 초등~ 고3 수능준비까지 가능한 강사진. -. 전국 와와에서 회원 유지개월수가 높은 지점."},{"n":"상동점","p":"경기","c":"부천시","a":"경기 부천시 원미구 송내대로265번길 67 월드컵타운 305호 와와학습코칭센터","g":"진달래마을 정문 앞 청담 어학원 옆건물","h":"박경숙","s":["국어","영어","수학"],"gr":"초4~고2","t":{"초":"석천초 상인초","중":"석천중 상동중 상일중 부인중","고":"상동고 상일고 상원고 중흥고 중원고"},"ot":"평일 오후2시반 이후","we":"토요일가능","wi":"과학 국어","st":"부천시 상동 학원 밀집가 위치 주변 잘알려지 유명학원과 견주어 강사수준 학력좋음 대학교 입학부터 강의를 해서 30대로 젊으면서 연륜이 있는 강사진 학부모와의 상담은 타학원에 견주어 완전 잘하는편 학생 성향에 맞추어 티칭겸 코칭 석천초 중 상일초중 수행 및 성적 향상 관리 학원 이벤트 잘함 간식 자주 ㅋ"},{"n":"논현점","p":"인천","c":"남동구","a":"인천 남동구 청능대로 559 2","g":"인천 논현역 3번 출구에서 직진 200M 논현 메디컬 센터 2층","h":"김윤심","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"동방초, 원동초","중":"고잔중","고":"고잔고"},"ot":"평일 오후 3시 이후","we":"토요일 가능","wi":"토요일 1시~ 4시 (국영수)","st":""},{"n":"광명점","p":"경기","c":"광명시","a":"경기 광명시 광명로 823 광명현대타운 7층 701호","g":"","h":"배세연","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"","중":"광남중, 광문중","고":"광문고"},"ot":"평일 오후 4시 이후","we":"주말불가","wi":"","st":""},{"n":"정평점","p":"경북","c":"경산시","a":"경북 경산시 대학로 23 월드스퀘어 302","g":"","h":"박지원","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"사월초","중":"경산중, 사동중, 경산여중","고":"경산고, 사동고, 경산여고, 문경고"},"ot":"평일 오후 3시 이후","we":"토요일 가능","wi":"영어12~5시/ 수학 12시-6시","st":""},{"n":"영천점","p":"경기","c":"화성시","a":"경기 화성시 동탄순환대로 704 성산에이타워 제4층 제 403호 와와학습코칭학원","g":"","h":"박승균","s":["국어","영어","수학"],"gr":"초1~고2","t":{"초":"한백초, 다원초","중":"한백중, 다원중","고":"한백고, 이산고, 창의고"},"ot":"평일 오후 2시 이후","we":"토요일가능","wi":"불가","st":""},{"n":"송도점","p":"인천","c":"연수구","a":"인천 연수구 해돋이로 165 차오름프라자 302","g":"백제원 근처, 채드윅 근처, 1공구 학원가","h":"조은정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고2","t":{"초":"신정초","중":"신정중","고":"연송고"},"ot":"평일 오후 3시 이후","we":"토요일 가능","wi":"국어 10~1 국어 2~5 영어사회 6~9","st":"친절한 선생님, 따뜻한 분위기, 교재 활용을 넘어 학생 맞춤 개별교육자료(프린트) 제공에 강점이 강함"},{"n":"둔산점","p":"대전","c":"서구","a":"대전광역시 서구 둔산동 둔산로 142 신화빌딩 401호","g":"시청역 7번 출구쪽 스타벅스&올리브영 건물 4층.","h":"이지숙","s":["국어","영어","사회"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 1시 이후","we":"토요일 수업 가능","wi":"영어/ 오후1~5시","st":"다양한 스타일의 단어암기법. 나만의 문법책. 학습일지 작성. 매월 정기고사 후 우수자 시상과 게시"},{"n":"관저점","p":"대전","c":"서구","a":"대전 서구 구봉로 133 1542번지 205호","g":"마치광장 신협건물 2층","h":"이지숙","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"","고":"서일고, 서일여고"},"ot":"평일 오후 1시 이후","we":"토요일 가능","wi":"영어.수학/ 11~2시","st":"초등회원 <10분독서>로 수업 시작. 한 과목 두명의 강사가 관리. 매 수업 시간 학습일지 작성."},{"n":"전주혁신점","p":"전북","c":"완주군","a":"전북특별자치도 완주군 이서면 출판로 42 제 4층 제 402호 와와학습코칭학원","g":"전주 혁신도시 호반 베르디움 1차 맞은편 상가 / 굽네치킨 건물 4층","h":"김지수","s":["영어","수학","과학","사회"],"gr":"초4~고3","t":{"초":"","중":"양현중, 삼우중, 만성중","고":"양현고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"기존 송천점에서 관리력을 인정 받은 강사진 타과목 관리 가능 전주 고등학교 출신 선배와의 만남 주기적으로 진행"},{"n":"주엽점","p":"경기","c":"고양시","a":"경기도 고양시 일산서구 주엽동 주화로 88 502호","g":"","h":"박상연","s":["국어","영어","수학","사회"],"gr":"초1~고3","t":{"초":"강선초","중":"","고":""},"ot":"평일 오후 2시 30분 이후","we":"수학 과학 / 토요일","wi":"토요일 1시-5시","st":""},{"n":"주엽2호점","p":"경기","c":"고양시","a":"경기 고양시 일산서구 중앙로 1413 동영빌딩 10층 1003","g":"","h":"박상연","s":["영어","수학","과학"],"gr":"초1~고3","t":{"초":"강선초","중":"","고":""},"ot":"평일 오후 2시 30분 이후","we":"영어 국어 / 토요일","wi":"토요일 1시-5시","st":""},{"n":"다산점","p":"경기","c":"남양주시","a":"경기 남양주시 다산중앙로146번길 12-14 다산메트로타워 604호","g":"","h":"엄경진","s":["국어","영어","사회"],"gr":"초4~고2","t":{"초":"다산초","중":"다산중","고":"다산고, 도농고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"비산점","p":"경기","c":"안양시","a":"경기 안양시 동안구 관악대로 91 대림타워 1102호 와와학습코칭학원","g":"경기 안양시 동안구 관악대로 91 대림타워 1102호 와와학습코칭학원","h":"김래정","s":["국어","영어","수학"],"gr":"초3~고3","t":{"초":"중앙초","중":"비산중, 부흥중, 부림중, 신성중","고":"양명여고, 양명고, 관양고, 성문고, 동안고"},"ot":"평일 오후 4시 이후","we":"주말불가","wi":"","st":""},{"n":"두정점","p":"충남","c":"천안시","a":"충청남도 천안시 서북구 두정동 봉정로 382 성광빌딩 3층","g":"두정초 정문 앞, 8단지 맞은편 피자마루 건물 3층,","h":"정누리","s":["영어","수학"],"gr":"초5~고2","t":{"초":"두정초, 신대초","중":"두정중, 성성중, 성정중,","고":"오성고, 두정고, 신당고, 업성고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"원주시청점","p":"강원","c":"원주시","a":"강원특별자치도 원주시 시청로 22 2층 201","g":"원주시청 등지고 오른쪽 첫번째 버스정류장 옆건물(1층에 피자알볼로)","h":"김태훈","s":["영어","수학","과학"],"gr":"초4~고2","t":{"초":"만대초, 무실초","중":"대성중, 평원중, 원주여중, 남원주중","고":"대성고, 육민관고, 북원여고"},"ot":"평일 오후 2시 30분 이후","we":"주말불가","wi":"주말수업은 자율학습이나 특강으로 활용중입니다.","st":"성적 향상 사례 다수(최하위권에서 중위권 이상으로 사례 다수) 6년차 센터로 관리 노하우 축적 강원도 회원유지율 1위센터"},{"n":"오산대역점","p":"경기","c":"오산시","a":"경기 오산시 내삼미로 85 우정프라자 2","g":"","h":"홍동완","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"세미초, 화성초, 수청초","중":"매홀중, 세마중, 문시중, 대호중","고":"매홀고, 세교고, 오산고, 운천고, 운암고"},"ot":"평일 오후 3시 이후","we":"주말협의","wi":"주말협의","st":""},{"n":"신창점","p":"광주","c":"광산구","a":"광주 광산구 신창로 129 상민빌딩 302","g":"신창동 파리바게트 1호점 3층입니다.","h":"김윤정","s":["영어","수학","과학"],"gr":"초1~고2","t":{"초":"신창초, 수문초","중":"진흥중, 신창중, 진흥중","고":"숭덕고, 성덕고, 운남고, 장덕고"},"ot":"평일 오후 4시 이후","we":"토요일 수업","wi":"토요일 영어10:00/수학11:00/영어1:00","st":""},{"n":"칠곡점","p":"대구","c":"북구","a":"대구 북구 구암로 149 6층","g":"","h":"장동선","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"관음초","중":"구암중, 관천중, 운암중","고":"구암고, 함지고, 영송여고"},"ot":"평일 오후 2시 이후","we":"토요일 가능","wi":"토요일 오전 10~5시 국어 영어 사회","st":""},{"n":"운정점","p":"경기","c":"파주시","a":"경기 파주시 동패동 1758-1 삼융프라자2 302호","g":"","h":"정상민","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"한가람초","중":"","고":""},"ot":"평일 오후 2시 이후","we":"토요일 영어만 가능","wi":"영어(11:00~12:30) 영어(13:00~14:30)","st":""},{"n":"다산지금점","p":"경기","c":"남양주시","a":"경기 남양주시 다산지금로 139 3층 308호, 309호","g":"스타벅스 다산지금점 건물 3층(영신프라자)입니다.","h":"김현정","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"다산한강초","중":"다산한강중","고":""},"ot":"평일 오후 4시 이후","we":"주말불가","wi":"","st":""},{"n":"수성만촌점","p":"대구","c":"수성구","a":"대구 수성구 화랑로8길 11-11 7층","g":"","h":"서하윤","s":["국어","영어","수학","과학","사회"],"gr":"초4~고1","t":{"초":"","중":"동중","고":""},"ot":"평일 오후 1시 이후","we":"주말불가","wi":"","st":""},{"n":"천천점","p":"경기","c":"수원시","a":"경기 수원시 장안구 덕영대로535번길 34 천천그린프라자 제5층 제 502호 와와학습코칭학원","g":"천천점 스타벅스 건물에서 도보로 50미터","h":"권혁준","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"천천초","중":"천천중, 대평중","고":"천천고, 영생고, 대평고"},"ot":"평일 오후 3시 이후","we":"토요일가능","wi":"토요일 12~3시 수학, 과학","st":"학교를 중요하게 여겨서 국영수뿐만 아니라 서강대 출신 강사가(센터장 본인) 사회, 한국사, 성대 출신 강사가 과학이 가능한 점을 어필합니다. 중고등 전과목이 가능하다는 점과 시험 대비로 시험 4주전부터 토요일마다 수업비를 받고 진행"},{"n":"산남점","p":"충북","c":"청주시","a":"충청북도 청주시 서원구 산남동 산남로 18 이화빌딩 5층","g":"하나로 마트 건물 옆 1층 조은약국 건물","h":"이진선","s":["국어","영어","수학","과학","사회"],"gr":"초1~고2","t":{"초":"샛별초","중":"수곡중 산남중","고":"충북고 운호고 충북여고 산남고"},"ot":"평일 오후 2시 이후","we":"토요일가능, 일요일가능","wi":"토요일 오후12시~3시 수학/일요일 오후 3시~6시영어","st":"중등은 국영수사과 전과목 가능하고 과학은 고등수업까지가능합니다"},{"n":"석사점","p":"강원","c":"춘천시","a":"강원특별자치도 춘천시 지석로 85 703호","g":"지석로 85 강남프라자 7층 ( 투탑시티 카펠라 휘트니스 건너편 건물)","h":"류성희","s":[],"gr":"","t":{"초":"성림초, 성원초, 봄내초","중":"대룡중, 우석중, 남춘천중, 남춘천여중, 춘천중, 강원중","고":"강원고, 사대부고, 춘고, 춘여고, 봉의고, 성수여고, 유봉여고"},"ot":"평일 오후 3시 30분 이후","we":"토요일 일부 가능","wi":"토요일 3:30 ~ 5:30 수학만 가능 / 중,고등","st":"현재 수업 배치불가"},{"n":"후평점","p":"강원","c":"춘천시","a":"강원특별자치도 춘천시 춘천로 316 춘천더샵아파트상가2동 304.305","g":"후평사거리 포스코상가 3층 (정육점 건물 3층으로 말하시면 많이들 아십니다)","h":"조현구","s":["영어","수학"],"gr":"초6~고3","t":{"초":"","중":"후평중, 봉의중, 강원중","고":"강원고, 춘천여고, 봉의고"},"ot":"평일 오후 1시 이후","we":"일요일 일부 가능","wi":"일요일 수학 일부 가능","st":""},{"n":"옥계점","p":"경북","c":"구미시","a":"경북 구미시 산호대로31길 16 2","g":"양포 도서관 건너편 설기원 떡집 위층","h":"이창무","s":["국어","영어","수학","과학"],"gr":"초1~고2","t":{"초":"동부초","중":"해마루중, 옥계중","고":"산동고, 오상고, 금오여고"},"ot":"평일 오후 3시 이후","we":"토요일가능","wi":"토요일 오후3시~6시","st":""},{"n":"당진중앙점","p":"충남","c":"당진시","a":"충남 당진시 당진중앙2로 211-5 효명프라자 404호","g":"","h":"임충효","s":["국어","영어","수학","과학","사회"],"gr":"초5~고2","t":{"초":"탑동초","중":"호서중, 당진중","고":"호서고, 당진고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":""},{"n":"미사점","p":"경기","c":"하남시","a":"경기 하남시 미사강변대로 212 미사센트럴프라자 309","g":"https://naver.me/xhHGgP9o 학원 위치 안내드립니다^^~미사도서관이나 보건센터에서 도보로 2분 거리입니다.","h":"김경미","s":["국어","영어","수학","과학"],"gr":"초1~고1","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"","st":"플래너관리/학생별 학습코칭 다양/친절한 강사진/단톡방 관리 활성화"},{"n":"영통점","p":"경기","c":"수원시","a":"경기도 수원시 영통구 영통동 봉영로 1623 드림피아빌딩 301호, 302호 1/2","g":"영통역과 청명역 중간에 버거킹 건물 3층입니다.","h":"오영혁","s":["국어","영어","수학","과학","사회"],"gr":"초4~고3","t":{"초":"영덕초","중":"흥덕중, 서천중","고":"영덕고, 청명고, 태장고, 흥덕고, 서천고"},"ot":"평일 오후 2시 30분 이후","we":"토요일가능","wi":"토요일 오전10시~오후1시 정규수업 가능","st":"국영수사과 전과목 코칭을 넘어 입시컨설팅까지 완벽하게 케어하는 All Care Class 운영중입니다. 모든 과목 가능합니다 ."},{"n":"망포점","p":"경기","c":"수원시","a":"경기도 수원시 영통구 망포동 영통로 127 센터프라자 401호","g":"","h":"오영혁","s":["국어","영어","수학","과학","사회"],"gr":"초4~고3","t":{"초":"잠원초, 망포초, 대선초","중":"영동중, 잠원중, 망포중, 동학중","고":"태장고, 망포고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"강릉교동점","p":"강원","c":"강릉시","a":"강원특별자치도 강릉시 정원로 44 202호 와와학습코칭학원","g":"","h":"김태훈","s":["영어","수학"],"gr":"초1~고3","t":{"초":"율곡초, 경포초","중":"관동중, 율곡중, 해람중, 솔올중, 경포중","고":"강여고, 강일여고, 명륜고, 제일고, 강릉고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":"시험기간 자습반 운영 및 수업과목별 기출문제 보유. 시험기간 간식제공. 기본 상비약 구비. 시내에서 도보 7분거리 현재 소수정예로 지도 가능합니다. 새로 셋팅하여 환경이 깔끔합니다. 주위 유해시설 없습니다. 코치들이 상냥합니다. 하위권 성적 올린 사례 많습니다."},{"n":"서수원점","p":"경기","c":"수원시","a":"경기 수원시 권선구 호매실로104번길 90 JD타워 205호","g":"","h":"김미진","s":["국어","영어","수학","과학","사회"],"gr":"초1~고2","t":{"초":"능실초, 금호초","중":"오현초호매실중, 능실중, 영신중, 고색중","고":"호매실고, 영신여고, 고색고, 율천고, 동우여고"},"ot":"평일 오후 1시 이후","we":"보강수업","wi":"불가","st":""},{"n":"원당점","p":"경기","c":"고양시","a":"경기 고양시 덕양구 고양대로1384번길 7-5 서강프라자 502호","g":"신원당 입구 맘스터치 건물5층 502호","h":"최지혜","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"성라초 성사초","중":"화수중 성사중 원당중","고":"성사고 화수고"},"ot":"평일오후3시이후","we":"토요일가능","wi":"토요일 오후 2시5시 과학","st":"단톡방 개설하고 학부모님에게 매수업 이후 일일 수업 레포트 발송드리고 있고 이 부분이 고객들이 좋아하는 포인트입니다. 시험기간 주말수업4주간 진행하고 있고 고3까지 가능한 선생님들이 과목을 다 가르치고 계십니다."},{"n":"송도점(W+)","p":"인천","c":"연수구","a":"인천 연수구 해돋이로 160-6 꿈에계단 702호 일부(송도동)","g":"백제원 근처, 백제원 앞 랜드로버 방향 옆건물, 1층에 명월카츠","h":"조은정","s":["수학","과학"],"gr":"초1~고2","t":{"초":"신정초","중":"신정중","고":"연송고"},"ot":"평일 오후 3시 이후","we":"가능","wi":"토요일 수학과학 10~1시","st":"장기 수업코치들로 구성된 전문성 강화, 송도점 전문 강사, 채드윅, 포스코, 국제고, 과학고 가능"},{"n":"운양점","p":"경기","c":"김포시","a":"경기 김포시 김포한강11로 288-37 헤리움리버테라스 205호","g":"경기 김포시 운양동 1296-7 헤리움'리버테라스' 205호입니다 엘레베이터 열리고 바로 왼쪽으로 오시면 됩니다~","h":"배성우","s":["영어","수학"],"gr":"초4~고2","t":{"초":"하늘빛초, 청수초","중":"하늘빛중, 운양중, 푸른솔중","고":"제일고, 운양고, 운유고"},"ot":"평일 오후 2시 이후","we":"토요일만 가능","wi":"토요일 12시-3시 국어 수학","st":"1. 매 수업 시작 전 플래너 작성 2. 전강사 수석코치 이상 3. 자체교재로 주 1회 초등 인성코칭, 중고등 학습법코칭 진행 4. 단원평가, 모의평가 시스템 5. 학부모, 학생과의 관계성 6. 학교별 커리큘럼 보유"},{"n":"도안점","p":"대전","c":"서구","a":"대전 서구 동서대로 692 에프엠프라임 1차 501","g":"","h":"전영재","s":["영어","수학","과학"],"gr":"초3~고3","t":{"초":"흥도초","중":"유성중, 봉명중, 도안중","고":"유성고, 도안고, 서대전여고"},"ot":"평일 오후 4시 이후","we":"토요일 진행","wi":"09~12 / 13~18시 운영 국,영,수,과","st":""},{"n":"시흥대야점","p":"경기","c":"시흥시","a":"경기 시흥시 은행로167번길 7 크리스탈 빌딩 503호,504호","g":"","h":"최진수","s":["국어","영어","수학"],"gr":"초3~고3","t":{"초":"은계초, 은행초","중":"은행중, 은계중","고":"은행고"},"ot":"평일 오후 2시 이후","we":"일요일 영어만 가능","wi":"일요일 1시이후 영어만 가능","st":""},{"n":"둔산점(W+)","p":"대전","c":"서구","a":"대전 서구 둔산로 130 803호","g":"시청역 7번 출구쪽 30m","h":"이지숙","s":["수학","과학"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 30분 이후","we":"토요일 가능","wi":"수학/12시~4시","st":"매 수업마다 오답노트.개념노트.학습일지 작성, AI정기고사&분석리포트"},{"n":"반여점","p":"부산","c":"해운대구","a":"부산 해운대구 반여로 102 경성빌딩 501호","g":"아시아선수촌 정문 건너편 깨비블럭있는 건물 5층","h":"안혜민","s":["국어","영어","수학","과학"],"gr":"초3~고3","t":{"초":"인지초, 장산초, 무정초","중":"장산중, 인지중","고":"반여고"},"ot":"평일 오후 2시 이후","we":"주말불가","wi":"주말수업불가(시험기간4주 보강수업만 운영)","st":"1. 학생별 월 학습 계획에 따라 학습이 이루어 지고, 매주 진행상황에 따라 과목 선생님께서 주차별 코멘트를 작성해서 학생,학부모로 이루어진 단톡방에 공유합니다. 2. 과목 수업 학습 일지를 학생 스스로 작성하여 매일 학습양을 점검하고, 배운내용에 대해 개념 또는 오답노트를 작성하도록 합니다. 3. 학생 상황과 개별성에 맞게 수행평가 대비를 합니다."},{"n":"화명점","p":"부산","c":"북구","a":"부산 북구 금곡대로285번길 19 리버사이드빌딩 504","g":"일방통행길 빽다방 건물 5층, 또는 코오롱하늘채 2차 정문 앞 상가","h":"김연하","s":["국어","영어","수학","과학"],"gr":"초3~고2","t":{"초":"와석초, 학사초, 용수초","중":"명진중, 화명중, 용수중, 화신중","고":"화명고, 성동고, 낙동고, 금명여고, 금곡고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"국어 중등 내신 가능 수학 기하 불가능 과학 중등 내신 가능","st":"★매 수업마다 태도, 과제 수행, 당일 학습 내용, 단어 시험 결과, 담당 과목 코치의 코멘트들 등이 기록되고 한 달에 한번 [분기평가]의 형태로 학부모님들께 전송 됨. 다른 학원에 다닐 때 학생이 학원에서 무엇을 했고 어떤점이 부족했는지 상담을 들은적이 없는 학부모님들이 대부분이라 월평가서가 나간다고 했을 때 꼼꼼한 기록이 있고 코치들의 정성이 필요한 부분인 것 같다고 어머님들의 반응이 좋으셨음. ★학습카톡방에서 학생들의 학습일지가 기록되며 출결과 관련하여 타이트한 관리가 이뤄짐. ★고등부 경우 타 학원은 시험대비 전체를 1회독 조차 못하거나 부교재나 모의고사는 시험 대비에서 생략되기도 하는데, 최소 3개월 이상 ~ 6개월 정도 함께 한 학생이라면 전체 시험 범위 진도와 기출문제까지 다 풀고 시험에 돌입. 단 학생 개인의 편차 있을 수 있음. ★수업 마치기 전 오늘 배운 내용을 정리하여 학습 마무리 습관 형성에 기여 ★학생의 안전을 위해 태블릿 등원 하원 체크 철저히 하도록 장려하는 센터 ★연 2회 정도 코칭데이를 마련하여 기본 과목 외에 [코칭데이]를 진행하며, 학생들만의 행사가 아닌 학부모님들의 참여도 유도하여 민감한 시기의 아이들과 부모님들 사이에 가까워질 수 있는 기회를 제공해 부모님들의 피드백이 항상 긍정적이었음. 그 외에도 시험기간이나 학업 스트레스가 많은 시즌에 학업 성취 이벤트나 간식데이로 긴장감 완화를 위해 꾸준히 노력하는 센터"},{"n":"보라점","p":"경기","c":"용인시","a":"경기 용인시 기흥구 사은로126번길 6 신원프라자 303호","g":"쌍용아파트 입구 줄넘기 학원 건물 3층","h":"김영웅","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"나곡초","중":"나곡중/보라중/상갈중","고":"보라고/신갈고"},"ot":"평일 오후 2시 이후","we":"토요일가능","wi":"토요일 오후10시~2시 수학/과학/영어","st":"입시 기반 상담 및 커리큘럼 운용 학생 1대1 상담/관리/수업 매 수업마다 수업내용 발송 / 월1회 원장상담"},{"n":"대구장기점","p":"대구","c":"달서구","a":"대구 달서구 장기로 252 장기협성휴포레 2층 209,210","g":"버스정류장(장동초등학교앞) 바로 앞 대로변에 있습니다. 장기협성휴포레 상가 2층 (1층에 한솥 도시락이 있습니다)","h":"김재수","s":["국어","영어","수학","과학","사회"],"gr":"초2~고2","t":{"초":"장동초, 장기초, 성당초","중":"원화중","고":""},"ot":"평일 오후 12시 이후","we":"토요일 가능","wi":"토요일 영어(오전9:30~12:30)/수학(오전9:30~2:30)/국어(오후1:00~3:00)","st":"1. 주기적인 유무선 상담 2. 철저한 수행&내신 관리 3. 입시 상담 가능"},{"n":"범박점","p":"경기","c":"부천시","a":"경기 부천시 소사구 은성로 132 5층","g":"부천 은성로132 제일프라자 501호 (세븐일레븐건물 5층)","h":"박지은","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"창영초, 소안초, 소사초, 복사초","중":"일신중, 소사중, 부일중","고":"시온고, 소사고, 범박고"},"ot":"평일 오후 2시 이후","we":"가능","wi":"토 2~5시 수학","st":"sky 출신 강사들, 수학 국어 등 전공자 직강, 코칭 및 입시 전문가로 구성"},{"n":"위례창곡점","p":"경기","c":"성남시","a":"경기 성남시 수정구 위례동로 141 우성메디피아 401호","g":"경기도 성남시 수정구 위례동로 141 우성메디피아 401호 1층컴포즈커피","h":"김지선","s":["국어","영어","수학"],"gr":"초4~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"토요일 가능(시간협의)","wi":"토요일 가능(시간협의)","st":""},{"n":"혁신점","p":"강원","c":"원주시","a":"강원특별자치도 원주시 입춘로 110 파라다이스프라자 305호","g":"","h":"김태훈","s":["영어","수학"],"gr":"초3~고2","t":{"초":"버들초, 반고초","중":"버들중, 반곡중","고":""},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"원흥점","p":"경기","c":"고양시","a":"경기 고양시 덕양구 권율대로 672 원흥역봄오피스텔 217호","g":"원흥역 1번 출구 앞 1층 베스킨 라빈스 있는 건물 2층 217호","h":"이원희","s":["국어","영어","수학"],"gr":"초1~고3","t":{"초":"원흥초, 삼송초","중":"원흥중, 고양중","고":"신원고, 서정고"},"ot":"평일 오후 3시 이후","we":"토요일 가능","wi":"토요일 오후 2시~6시 수학","st":"학습 플래너 관리, 주기적인 상담, 시험대비 주말 운영"},{"n":"거제수월점","p":"경남","c":"거제시","a":"경남 거제시 수양로 462 3층","g":"수월사거리 파리바게트 맞은편 skT월드 건물 3층","h":"이경태","s":["영어","수학"],"gr":"초5~고2","t":{"초":"수월초, 제산초","중":"수월중, 거제중앙중","고":"거제중앙고, 연초고, 상문고"},"ot":"평일 오후 12시 이후","we":"토요일만 가능","wi":"토 1~5시 고등수학","st":"고등 회원이 많아서 면학분위기가 아주 잘 형성 되어져 있어서 초중등 부모님들께서 만족해 하십니다. 고등까지 전부 수업이 가능한 강사들로 이루어져 있어서 교수법이 뛰어납니다."},{"n":"덕이점","p":"경기","c":"고양시","a":"경기 고양시 일산서구 하이파크2로 40 금문프라자 804호","g":"금문프라자(농협 옆건물, 1층에 컴포즈 카페있는 건물, 7층 헬스장 바로 위 8층입니다)","h":"이경진","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"한산초, 덕이초, 백송초","중":"","고":""},"ot":"평일 오후 2시 이후","we":"토요일 : 고등모의고사 상시 특강(구문독해 실력향상>내신도 자연상승! 수능연습!)","wi":"고등 국어 모의고사 수업","st":"친절하고 실력있는 강사진/대부분 10년 전후 경력"},{"n":"삼송점","p":"경기","c":"고양시","a":"경기 고양시 덕양구 신원로 36 명승세도나3 701호","g":"신원마을6단지 맞은편 상가-명승세도나3차 맘스터치있는 건물 7층","h":"최원희","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"신원초","중":"신원중","고":"신원고"},"ot":"평일 오후 2시 이후","we":"주말 수학 ,과학가능","wi":"수학( 문과)&과학; 2시~4시","st":"실력,친절,열정의 간부급들 강사들, 학부모학생과 4자단톡방 ,담임제및 월평가서 제출, 성적시상,플래너시상등 이벤트다양"},{"n":"진월점","p":"광주","c":"남구","a":"광주 남구 광복마을길 47 4층","g":"광주광역시 남구 광복마을길 47 4층","h":"남현주","s":["영어","수학"],"gr":"초5~고3","t":{"초":"진월초, 주월초","중":"동성여중, 주월중","고":"대광여고, 동성고"},"ot":"평일 오후 2시 이후","we":"토요일가능","wi":"토요일 오전 10시~오전 12시 수학/ 오전10시~오후1시 영어","st":""},{"n":"이충점","p":"경기","c":"평택시","a":"경기 평택시 이충로 49-31 삼원프라자 201호","g":"이충상가 농협 옆건물 삼원프라자 2층, 1층 정관장 건물","h":"박승균","s":["영어","수학"],"gr":"초1~고2","t":{"초":"","중":"효명중, 이충중, 은혜중","고":"이충고, 은혜고, 효명고"},"ot":"평일 오후 12시 이후","we":"일요일가능","wi":"일요일 오후2시~5시 / 수학 영어","st":"카톡방 운영 하여 매일 수업 내용과 숙제에 대한 피드백 제공 초등 부터 고3까지 관리"},{"n":"루원시티점","p":"인천","c":"서구","a":"인천 서구 새오개로111번안길 23 대릉빌딩 302호","g":"","h":"정진영","s":["국어","영어","수학"],"gr":"초6~고2","t":{"초":"가현초","중":"신형중, 신현여중, 가현중","고":"신현고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"복현점","p":"대구","c":"북구","a":"대구 북구 동북로 247 이편한세상복현 상가동 305호 와와학습코칭학원","g":"대구 북구 복현동 713 e편한세상복현 상가동 305호","h":"구선영","s":["국어","영어","수학"],"gr":"초2~고3","t":{"초":"복현초","중":"북중, 성광중, 산격중","고":"경상고, 성광고, 영진고"},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":"경력 10년 이상 강사/ 플래너관리/회원별 수업소통방/ 데일리숙제관리"},{"n":"진접점","p":"경기","c":"남양주시","a":"경기 남양주시 진접읍 해밀예당1로 171 제일프라자 203호","g":"해밀예당 1로 171 203호 해밀초 대각선 건너편 1층에 와플대학 있는 건물 203호","h":"서소하","s":["국어","영어","수학"],"gr":"초3~고3","t":{"초":"해밀초 화봉초","중":"풍양중 주곡중","고":"진접고 오남고"},"ot":"평일 오후3시 이후","we":"주말불가","wi":"","st":"진접점은 해밀초 풍양중 주곡중 진접고에서 20분이내로 걸어올 수 있는 학원가 최상단 위치로 둥지당 5명이하 소규모 인원으로 개별 수업 진행!! 기존 수업 시간 이외에도 추가시간 확보로 자습진행, 매일 일일테스트 진행해서 학부모님 개별 통보 수업진행 일대일 피드백 드리고 있습니다. 기존 학생들 성적향상이 많이 되었고 강의/ 일대일 둥지수업의 가장 효율적인 공부방법을 제시하고 있습니다"},{"n":"사직점","p":"부산","c":"동래구","a":"부산 동래구 사직로 80 222동 311호 (사직쌍용예가아파트 상가)","g":"부산시 동래구 사직로 80 쌍용예가상가 222동 311호 (상가 두개 중 맑은샘사우나가 있는 상가 3에 위치)","h":"김우성","s":["영어","수학"],"gr":"초1~고3","t":{"초":"예원초, 사직초","중":"사직중, 사직여중","고":"사직고, 사직여고, 동인고"},"ot":"평일 오후 1시 30분 이후","we":"토요일가능","wi":"토요일 오전 10시 ~ 오후 5시 30분 수학(고등진도반)","st":"영어와 수학 모두 10년 이상의 베테랑 강사로 폭넓은 학생층 관리 가능. 학생들이 오고 싶어하는 학원으로 운영하며, 학부모의 입장에서 믿고 맡길 수 있도록 투명한 회원 관리 및 공유를 하고 있습니다"},{"n":"운정호수점","p":"경기","c":"파주시","a":"경기 파주시 경의로1240번길 37-1 명품프라자3차 605호","g":"운정역1번출구에서 걸어서 7분, 가람도서관 건너편, 할리스건물","h":"김현경","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"토요일만 가능","wi":"토요일 5~8시 과학","st":""},{"n":"탄벌점","p":"경기","c":"광주시","a":"경기 광주시 벌원길 61 2층","g":"","h":"이인희","s":["국어","영어","수학","과학"],"gr":"초1~고3","t":{"초":"","중":"","고":""},"ot":"평일 오후 3시 이후","we":"주말불가","wi":"","st":""},{"n":"남외점","p":"울산","c":"중구","a":"울산 중구 남외3길 15 남외프라자 401호","g":"남외초앞 파리바게트 사거리 마트위 4층","h":"김은희","s":["국어","영어","수학"],"gr":"초2~고3","t":{"초":"남외초","중":"남외중,울산중","고":"울산고,가온고"},"ot":"평일 오후2시 이후","we":"주말불가","wi":"","st":"남외중 내신대비에 강점인 센터이며 모의평가로 내신대비 적중률과 시험치는 분위기형성으로 상위권학생들이 많이 분포되어있고 시험기간에 국,영,수수업듣고있는 아이들에 한정해서 타과목특강이 있습니다~ 남외초학생들이 걸어오기좋은 거리에 남외초만을 위한형성평가대비및 코칭데이를통한 아이들학습습관과 기초부터심화까지 눈높이에 맞춘수업이가능합니다"},{"n":"흥덕점","p":"경기","c":"용인시","a":"경기 용인시 기흥구 흥덕2로 85 우연프라자 201호","g":"용인 흥덕 이마트 뒷편 세차장 옆건물 2층입니다.(경기도 용인시 흥덕2로 85 우연프라자 201호)","h":"박재현","s":["국어","영어","수학","과학","사회"],"gr":"초1~고3","t":{"초":"샘말초, 석현초, 흥덕초, 매원초","중":"흥덕중, 다산중, 광교호수중, 상현중","고":"흥덕고, 기흥고, 신갈고, 상현고, 매원고"},"ot":"평일 오후 3시 이후","we":"토요일만 가능","wi":"오전 11시~1시30분 수학, 영어, 한국사 오후 1시30~4시30 국어","st":""},{"n":"반송점","p":"경기","c":"화성시","a":"경기도 화성시 반송동 동탄원천로 163 503호","g":"","h":"정은희","s":["국어","영어","수학","과학","사회"],"gr":"초1~고1","t":{"초":"","중":"","고":""},"ot":"평일 오후 2시 이후","we":"국,과 / 토요일","wi":"국,과 / 토요일 오후 2시 ~ 오후 5시10분","st":""},{"n":"돈암점","p":"서울","c":"성북구","a":"서울특별시 성북구 돈암동 동소문로 190 중앙빌딩 201호","g":"성신여대역 1번출구, 직진 버스 1정거장 기아자동차 건물 2층","h":"박보영","s":["국어","영어","수학"],"gr":"초3~고3","t":{"초":"개운초","중":"개운중, 성신여중, 고명중","고":"용문고, 사대부고, 성신여고, 고대부고"},"ot":"평일 오후 3시 이후","we":"토.일 조율가능","wi":"주말불가","st":"1. 국영수 전강사 선임강사 이상, 회사입사 경력 10년이상된 베테랑 코치들 2. 고타임 회원관리 능력과 상담력 우수한 코치들로 구성 3. 성북구 돈암점 근처 학교 티칭 경력이 10년이상, 근처 학교 기출및 내신경향 파악 잘되어있음"},{"n":"동소문점","p":"서울","c":"성북구","a":"서울 성북구 아리랑로7길 5 4층 와와학습코칭학원","g":"할머니문방구 사거리 건물 4층","h":"김연하","s":["영어","수학"],"gr":"초3~고2","t":{"초":"정덕초, 우촌초, 정수초","중":"성신여중, 동구여중, 삼선중, 고명중","고":"성신여고, 홍대부고, 고대부고, 한성여고"},"ot":"평일 오후 2시 30분 이후","we":"주말불가","wi":"","st":"1. 자기주도학습의 A~Z 까지 완벽히 알려드립니다. 2. 장기근무 강사들의 지역내신 전문성을 보여드립니다. 3. 입시에 능통한 실력있는 강사들의 장기 로드맵으로 초등에서 대입까지 연계학습합니다."},{"n":"상암점","p":"서울","c":"마포구","a":"서울특별시 마포구 상암동 상암산로1길 73 202호","g":"","h":"오미라","s":["영어","수학"],"gr":"초3~고3","t":{"초":"중동초, 상지초, 상암초","중":"상암중, 중암중, 성산중, 성사중, 덕은한강중","고":"상암고, 예일여고, 대성고, 숭실고, 가재울고"},"ot":"평일 오후3시 이후","we":"주말불가","wi":"","st":"1. 배치 즉시 당일 상담 날짜 잡음 2. 영수 전문 고3까지 수업이 가능한 전문 강사들로만 구성되어있음 3. 여 강사다 보니 공감능력과 꼼꼼히 관리를 하며 학부모님들과 소통을 잘함. 4. 공부9도는 과목선생님이 아닌 다른 과목선생으로 분리해서 진행하기에 더욱 전문적임. 5. 월 정기고사 시험으로 한달 공부 한 내용들 점검하고 피드백 드림. 6. 내신대비로 타과목 관리 가능 7. 초등학생은 수준별 관리 철저"}];

const REGION_ORDER = ["경기","서울","대구","인천","대전","광주","충북","강원","충남","경북","부산","울산","전북","경남","제주","세종"];
const SUBJ_EMOJI = {"국어":"📖","영어":"🌍","수학":"🔢","과학":"🧪","사회":"🗺️"};

function esc(s){return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
// 표시용 주소: 끝에 붙은 프랜차이즈 명칭 제거
function cleanAddr(a){return (a||"").replace(/\s*(와와학습코칭센터|와와학습코칭|와와코칭|글로리드학습코칭|더블유플러스|모두오름학습코칭|모두오름)\s*(센터|학원|보습학원)?\s*$/,"").trim();}
function regionCounts(){const m={};CENTERS.forEach(c=>{m[c.p]=(m[c.p]||0)+1;});return m;}
// 클라이언트 지점 목록용 경량 데이터
function branchesLightJSON(){return JSON.stringify(CENTERS.map((c,i)=>({i:i,n:c.n,p:c.p,c:c.c,s:c.s,gr:c.gr})));}


/* ===== 지점 페이지 SEO 콘텐츠 (정보성 글 / FAQ / 후기 / 카카오 지도) ===== */
const STUDY_TIPS = {
  "국어":"국어는 매일 한 지문씩 꾸준히 읽고 분석하는 습관이 가장 중요합니다. 문학·비문학 유형별 독해 전략과 어휘·문법을 단계적으로 쌓아, 글의 구조를 스스로 파악하는 힘을 길러 줍니다.",
  "영어":"영어는 단어 암기·문법 이해·매일 독해가 함께 가야 실력이 쌓입니다. 어휘를 누적 관리하고 문장 구조를 분석하는 훈련으로 내신 서술형과 수능 독해를 동시에 대비합니다.",
  "수학":"수학은 개념을 정확히 이해한 뒤 충분한 문제 풀이로 체화하는 과목입니다. 오답 노트로 틀린 유형을 반복 점검하고, 단계별 난이도 풀이로 실수를 줄여 갑니다.",
  "과학":"과학은 원리를 그림과 실험 맥락으로 이해하면 암기 부담이 크게 줄어듭니다. 개념 간 연결을 잡고 학교 기출 유형으로 마무리해 내신 점수로 연결합니다.",
  "사회":"사회는 흐름과 맥락을 먼저 이해한 뒤 핵심 개념을 구조화해 암기하는 것이 효율적입니다. 자료 해석·시사 문제까지 단계적으로 대비합니다."
};

const TUITION_HTML = `
<table class="tuit"><caption>A. 서울 / 위례 / 미금 / 영통 / 동탄호수 / 동탄목동</caption>
<tr><th></th><th>초등</th><th>중등</th><th>고등</th></tr>
<tr><td>주 3회</td><td>230,000</td><td>247,000</td><td>280,000</td></tr>
<tr><td>주 4회</td><td>300,000</td><td>322,000</td><td>365,000</td></tr>
<tr><td>주 5회</td><td>370,000</td><td>397,000</td><td>450,000</td></tr></table>
<table class="tuit"><caption>B. 그 외 지점</caption>
<tr><th></th><th>초등</th><th>중등</th><th>고등</th></tr>
<tr><td>주 3회</td><td>200,000</td><td>217,000</td><td>250,000</td></tr>
<tr><td>주 4회</td><td>260,000</td><td>282,000</td><td>325,000</td></tr>
<tr><td>주 5회</td><td>320,000</td><td>347,000</td><td>400,000</td></tr></table>
<table class="tuit"><caption>송도 / 병점 / 삼산 / 청라</caption>
<tr><th></th><th>초등</th><th>중등</th><th>고등</th></tr>
<tr><td>주 1회</td><td>140,000</td><td>152,000</td><td>175,000</td></tr>
<tr><td>주 2회</td><td>260,000</td><td>282,000</td><td>325,000</td></tr>
<tr><td>주 3회</td><td>380,000</td><td>412,000</td><td>475,000</td></tr></table>
<p class="tuit-note">* 수업료는 지역·회수에 따라 차이가 있습니다. 정확한 금액은 상담 시 안내해 드립니다.</p>`;

function targetSummary(c){
  const t=c.t||{};
  const all=[t["초"],t["중"],t["고"]].filter(Boolean).join(", ");
  if(!all) return "인근 초·중·고 학생들이 다니고 있습니다.";
  const schools=all.split(",").map(s=>s.trim()).filter(Boolean).slice(0,5).join(", ");
  return "주요 인근 학교로는 "+esc(schools)+" 등이 있습니다.";
}

/* ── 지점별 고유 SEO 본문 v6 (지점명 토큰 분절 보장 / 3000자+ · 6어절 중복≈0) ── */
function strHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function splitSchools(v){return (v||"").split(/[,/·]/).map(x=>x.trim()).filter(Boolean);}

/* 짧은 술어 조각(≤4어절). 문장은 항상 '지점명/학교명/원장명 + 조각' 구조라 6어절 연속 공유가 발생하지 않음 */
const FR={
 core:["빈틈을 정확히 채웁니다","약점을 진단해 메웁니다","공부 습관을 잡아 줍니다","스스로 공부하도록 돕습니다","성적과 태도를 함께 봅니다","개념부터 다시 다집니다","오답을 반복해 점검합니다","눈높이에 맞춰 지도합니다","꾸준함을 만들어 줍니다","질문을 즉시 해결합니다","기초를 단단히 세웁니다","학습 방향을 바로잡습니다"],
 manage:["플래너로 시간을 관리합니다","주간 리포트로 공유합니다","복습 주기를 점검합니다","출결과 집중을 기록합니다","과제 이행을 확인합니다","학습톡방으로 소통합니다","월 정기고사로 점검합니다","개념노트를 관리합니다","수업 직후 피드백합니다"],
 exam:["시험 범위를 분석합니다","기출 유형을 점검합니다","예상 문제로 연습합니다","틀린 문제를 다시 봅니다","주말 자습으로 마무리합니다","출제 경향을 정리합니다","변형 문제로 응용합니다"],
 vac:["취약 단원을 보강합니다","다음 학기를 선행합니다","공부 리듬을 유지합니다","약점을 다시 정리합니다","기초를 한 번 더 봅니다","선행 비율을 조절합니다"],
 env:["통학이 편한 곳입니다","걸어 오기 좋습니다","면학 분위기가 좋습니다","집중하기 좋은 환경입니다","접근성이 뛰어납니다","쾌적하게 꾸며져 있습니다"],
 trust:["학부모와 자주 소통합니다","변화를 함께 확인합니다","투명하게 안내합니다","진행 상황을 공유합니다","작은 변화도 전합니다"],
 lead:["{N}은","{C}의 {N}은","{N}에서는","{N} 코치진은","{C} {N}은"]
};
const SJF={
 "국어":["문학·비문학을 유형별로 잡습니다","어휘와 문법을 누적합니다","독해 전략을 단계로 쌓습니다","서술형 답안을 연습합니다","지문 분석을 훈련합니다"],
 "영어":["단어를 누적 관리합니다","구문으로 독해를 잡습니다","문법을 독해에 적용합니다","서술형 빈출을 점검합니다","듣기와 어휘를 봅니다"],
 "수학":["개념을 스스로 설명합니다","오답 유형을 점검합니다","단계별로 실수를 줄입니다","이전 학년을 보강합니다","선행과 후행을 조절합니다"],
 "과학":["개념을 구조화합니다","자료 해석을 훈련합니다","개념도로 흐름을 잡습니다","기출로 마무리합니다","수행과 지필을 챙깁니다"],
 "사회":["흐름과 인과를 이해합니다","핵심만 구조화해 외웁니다","자료 해석을 반복합니다","마인드맵으로 정리합니다","서술형을 대비합니다"]
};
const SCH_TAIL={
 "초":["기초와 습관을 잡습니다","연산·독해를 다집니다","학습 루틴을 만듭니다","공부 재미를 키웁니다"],
 "중":["내신을 분석해 대비합니다","기출로 패턴을 잡습니다","수행평가를 챙깁니다","선행을 함께 설계합니다"],
 "고":["내신과 입시를 관리합니다","수능 유형을 대비합니다","취약 단원을 보강합니다","입시 전략을 세웁니다"]
};

/* ── 지역키워드·과목 전용 페이지 + 키워드 시작 정보성 본문 ── */
const SUBJ_SLUG={"국어":"kor","영어":"eng","수학":"math","과학":"sci","사회":"soc"};
const SLUG_SUBJ={kor:"국어",eng:"영어",math:"수학",sci:"과학",soc:"사회"};

/* 동 수정 사전: 도로명 추정이 틀린 지점은 여기에 '지점명':'정확한동' 추가하면 우선 적용됨 */
const DONG_FIX = {
  // 예) "마두점":"마두동", "수지점":"풍덕천동"
};

function areaKeyword(c){
  if(DONG_FIX[c.n]) return DONG_FIX[c.n];
  const toks=(c.a||"").split(/\s+/);
  let gi=-1, guIdx=-1, roadIdx=-1;
  for(let i=0;i<toks.length;i++){
    if(/(시|군|구)$/.test(toks[i]) && !/(로|길|대로)$/.test(toks[i])) gi=i;
    if(/구$/.test(toks[i]) && !/(로|길|대로)$/.test(toks[i])) guIdx=i;
    if(roadIdx<0 && /(대로|로|길)/.test(toks[i])) roadIdx=i;
  }
  // 1) 지번 주소의 법정동
  if(gi>=0 && gi+1<toks.length){
    const t=toks[gi+1], nx=toks[gi+2]||"";
    if(/^[가-힣]{1,4}동$/.test(t) && !/(동구|동로|동길)$/.test(t) && (/^\d/.test(nx)||/(로|길|대로|번지)/.test(nx))) return t;
  }
  // 2) 도로명에서 동 추정 (덕풍동로→덕풍동 / 구갈로→구갈동)
  if(roadIdx>=0){
    const r=toks[roadIdx];
    const m=r.match(/^([가-힣]{2,4}동)(로|길)/); if(m) return m[1];
    const m2=r.match(/^([가-힣]{2,3})(로|길)/); if(m2) return m2[1]+"동";
  }
  // 3) 구 → 시
  if(guIdx>=0) return toks[guIdx];
  return c.c||c.p;
}

/* 정보성 풀 (대폭 확장 — 같은 문장 충돌 최소화) */
const INFO={
 choose:[
  "학원을 고를 때는 수업 시간보다 ‘관리의 밀도’를 먼저 봐야 합니다.",
  "성적은 진도가 아니라 학생에게 맞는 설계에서 갈립니다.",
  "좋은 학습 코칭은 답이 아니라 공부하는 방법을 가르칩니다.",
  "학습 습관이 잡히면 성적은 자연스럽게 따라옵니다.",
  "내 아이에게 맞는 학원은 진단부터 다른 법입니다.",
  "수업의 양보다 학생을 얼마나 자주 들여다보는지가 중요합니다.",
  "같은 교재라도 누가 어떻게 관리하느냐에 따라 결과가 달라집니다.",
  "성적이 정체될 때는 공부량이 아니라 방법을 점검해야 합니다.",
  "학원 선택의 기준은 화려한 광고가 아니라 실제 관리 방식입니다.",
  "아이가 스스로 공부하게 만드는 곳이 결국 오래 가는 학원입니다."],
 coach:[
  "학습 코칭은 떠먹여 주는 수업이 아니라 스스로 공부하는 힘을 키우는 과정입니다.",
  "진단으로 약점을 찾고 설계로 방향을 잡아 코칭과 관리로 채워 갑니다.",
  "같은 학년이라도 비어 있는 단원이 달라 커리큘럼은 학생마다 달라야 합니다.",
  "플래너로 공부 시간을 확보하고 복습 주기를 정해 장기 기억으로 남깁니다.",
  "코칭의 목표는 점수 한 번이 아니라 스스로 공부하는 습관입니다.",
  "학생이 무엇을 모르는지 정확히 아는 데서 진짜 수업이 시작됩니다.",
  "정해진 진도가 아니라 학생의 속도에 맞추는 것이 코칭의 본질입니다.",
  "수업과 관리, 소통이 하나로 이어질 때 성적이 안정적으로 오릅니다."],
 habit:[
  "자기주도 학습은 매일 같은 시간에 앉는 작은 루틴에서 시작됩니다.",
  "오답은 다시 푸는 것이 아니라 ‘왜 틀렸는지’ 정리하는 데서 실력이 됩니다.",
  "공부의 양보다 방향이 먼저이고 방향이 맞으면 적은 시간으로도 오릅니다.",
  "계획표를 스스로 짜고 지키는 경험이 쌓일수록 자신감이 생깁니다.",
  "집중이 흐트러질 때는 시간을 늘리기보다 짧게 끊어 몰입하는 편이 낫습니다.",
  "매일 분량을 정해 끝내는 습관이 시험 직전의 불안을 줄여 줍니다.",
  "복습은 배운 당일과 사흘 뒤, 일주일 뒤로 나눠야 오래 기억됩니다.",
  "스스로 설명할 수 있어야 비로소 ‘아는 것’이 됩니다.",
  "작은 성공 경험이 쌓일수록 공부에 대한 거부감이 줄어듭니다.",
  "휴대폰을 멀리 두는 것만으로도 학습 효율이 눈에 띄게 올라갑니다."],
 exam:[
  "내신은 ‘우리 학교 시험’에 맞춘 대비가 핵심이라 학교별 기출 분석이 점수를 좌우합니다.",
  "시험 3~4주 전에는 범위를 한 차례 끝내고 남은 기간은 실전과 오답에 씁니다.",
  "서술형이 늘어난 만큼 답을 ‘아는 것’과 ‘쓰는 것’을 분리해 훈련해야 합니다.",
  "시험이 끝나면 결과를 분석해 다음 시험 계획을 다시 세우는 것이 중요합니다.",
  "출제 선생님의 스타일과 수업 강조점을 파악하면 대비가 훨씬 정확해집니다.",
  "벼락치기보다 4주 전부터의 누적 관리가 점수 편차를 줄여 줍니다.",
  "수행평가는 시험만큼 비중이 크므로 일정에 맞춰 미리 준비해야 합니다.",
  "오답을 모아 ‘나만의 약점 노트’를 만들면 시험 직전에 큰 힘이 됩니다."],
 vac:[
  "방학은 부족한 단원을 메우고 다음 학기를 미리 준비하기에 가장 좋은 시기입니다.",
  "학기 중 시간이 부족했던 단원은 방학에 깊이 있게 다지는 것이 효과적입니다.",
  "방학에는 선행과 보강의 비율을 학생 상태에 맞춰 조절해야 합니다.",
  "규칙적인 등원으로 공부 리듬을 유지하면 방학 뒤 성적 격차가 벌어집니다.",
  "방학 동안의 선행은 양보다 개념의 정확도를 우선해야 합니다.",
  "짧아도 매일 공부하는 습관을 유지하는 것이 방학 학습의 핵심입니다.",
  "다음 학기 첫 단원을 미리 잡아 두면 학기 초 적응이 훨씬 수월합니다."]
};

function branchArticle(c){
 const rng=mulberry32(strHash(c.n+"|"+c.a));
 const pk=a=>a[Math.floor(rng()*a.length)];
 const N=esc(c.n), C=esc(c.c||c.p), H=esc(c.h||"원장"), KW=esc(areaKeyword(c));
 const subjects=(c.s&&c.s.length)? c.s : ["국어","영어","수학","과학","사회"];
 const el=splitSchools(c.t&&c.t["초"]), mid=splitSchools(c.t&&c.t["중"]), hi=splitSchools(c.t&&c.t["고"]);
 const schoolAll=el.concat(mid,hi);
 const subjTxt=esc(subjects.join("·"));
 let schPtr=0;
 const nextSch=()=> schoolAll.length? esc(schoolAll[(schPtr++)%schoolAll.length]) : "";
 const block=(title,items)=> items.length? '<div class="bd-block"><h3 class="bd-h3">'+title+'</h3><p class="bd-p">'+items.join(" ")+'</p></div>':"";
 // 정보성 문장 끝에 고유 토큰(학교/키워드) 한 조각을 덧붙여 페이지 간 6어절 중복을 끊는다
 const u=(sentence)=> schoolAll.length
   ? sentence+" "+nextSch()+" 학생도 같은 원리로 지도합니다."
   : sentence;

 const intro=["<strong>"+KW+" 학원</strong>을 찾고 계신다면 한 가지만 기억하면 됩니다.",
   u(pk(INFO.choose)), pk(INFO.coach),
   "이곳에서는 "+subjTxt+" 과목을 "+esc(c.gr||"초1~고3")+" 학생에게 맞춰 지도합니다."];

 const loc=[];
 if(c.g) loc.push(esc(c.g)+".");
 loc.push(KW+" 일대 학생들이 가까운 거리에서 꾸준히 다니기 좋은 환경입니다.");

 const school=[];
 if(el.length) school.push("초등은 "+esc(el.join(", "))+" 학생의 기초와 학습 습관을 잡아 줍니다.");
 if(mid.length) school.push("중등은 "+esc(mid.join(", "))+" 등 인근 중학교 내신을 학교별로 분석해 대비합니다.");
 if(hi.length) school.push("고등은 "+esc(hi.join(", "))+" 학생의 내신과 입시를 출제 경향에 맞춰 관리합니다.");
 if(school.length) school.push("같은 학교 학생이 많을수록 시험 정보가 깊이 쌓여 내신 대비에 유리합니다.");

 const subjBlocks=subjects.filter(s=>SJF[s]).map(s=>
   '<div class="bd-block"><h4 class="bd-h3">'+(SUBJ_EMOJI[s]||"")+" "+s+' 공부법</h4><p class="bd-p">'+
   s+'는 '+pk(SJF[s])+'. '+(schoolAll.length? nextSch()+' 학생은 ':'')+pk(SJF[s])+'. 학교 시험 범위에 맞춰 '+pk(SJF[s])+'.</p></div>');

 const exam=[u(pk(INFO.exam)), pk(INFO.exam),
   (mid.concat(hi).length? esc(mid.concat(hi).slice(0,4).join(", "))+" 등 학생 학교의 출제 경향을 분석해 대비합니다.":"학생 학교의 출제 경향을 분석해 대비합니다.")];
 const vac=[u(pk(INFO.vac)), pk(INFO.vac), (schoolAll.length? nextSch()+" 학생도 ":"")+"방학 동안 데일리 플래너로 학습 리듬을 유지합니다."];
 const habit=[u(pk(INFO.habit)), pk(INFO.habit), u(pk(INFO.habit))];

 const we=c.we||"";
 const ops=[esc(c.n)+"은 "+esc(c.ot||"평일 오후")+"부터 수업하며 학생 일정에 맞춰 시간표를 조율합니다.",
   (!we||/불가/.test(we))? "주말 정규 수업 대신 평일 집중 관리와 시험 기간 보강으로 채웁니다."
     : "주말에도 "+esc(we)+(c.wi&&!/불가/.test(c.wi)?"("+esc(c.wi)+")":"")+" 수업을 운영합니다.",
   "첫 상담은 센터장 "+H+"이 직접 진행해 현재 수준과 학습 습관을 살핍니다.",
   "전화 "+esc(CFG.phone)+"·카카오톡·홈페이지 신청으로 부담 없이 문의하실 수 있습니다."];

 // 길이 보강: 고유 토큰(학교명)을 단 정보성 문장으로 채움
 const fills=[{a:habit,p:INFO.habit},{a:exam,p:INFO.exam},{a:vac,p:INFO.vac},{a:intro,p:INFO.coach},{a:habit,p:INFO.choose}];
 const len=()=>[intro,loc,school,exam,vac,habit,ops].reduce((x,y)=>x+y.join(" ").length,0)+subjBlocks.join(" ").length+(c.st?c.st.length:0);
 let g=0;
 while(len()<3400 && g<700){ const f=fills[g%fills.length]; f.a.push(u(pk(f.p))); g++; }

 let html="";
 html+=block(KW+" 학원을 찾는다면", intro);
 html+=block(KW+" 학습 환경과 통학", loc);
 html+=block(KW+" 인근 학교 내신 대비", school);
 html+='<h3 class="bd-h3" style="margin-top:24px;">과목별 공부 방법</h3><div class="bd-article-grid">'+subjBlocks.join("")+'</div>';
 html+=block("시험 기간 학습 전략", exam);
 html+=block("방학 학습 전략", vac);
 html+=block("자기주도 학습 습관 만들기", habit);
 html+=block("운영·상담 안내", ops);
 if(c.st) html+='<div class="bd-block"><h3 class="bd-h3">⭐ '+esc(c.n)+'의 강점</h3><p class="bd-p">'+esc(c.st)+'</p></div>';
 return html;
}

/* 과목별 한 줄 설명 (카드용) */
const SUBJ_DESC={
 "국어":"읽기·쓰기·어휘력 기초부터 서술형 대비까지 단계별로 지도합니다.",
 "영어":"파닉스·기초 문법·듣기·읽기를 체계적으로 지도합니다.",
 "수학":"연산·도형·문장제 개념을 탄탄하게 잡아드립니다.",
 "과학":"실험 원리와 탐구 능력을 키워 과학적 사고력을 기릅니다.",
 "사회":"지리·역사·일반사회 기초를 이해 중심으로 지도합니다."
};

/* 지역+과목 카드 그리드 (이미지 스타일) */
function areaSubjectCards(c, idx, exclude){
 const KW=esc(areaKeyword(c));
 const subjects=(c.s&&c.s.length? c.s : ["국어","영어","수학","과학","사회"]).filter(s=>SUBJ_SLUG[s] && s!==exclude);
 if(!subjects.length) return "";
 const cards=subjects.map(s=>
   '<a class="area-card" href="/branch/'+idx+'/'+SUBJ_SLUG[s]+'">'+
     '<div class="area-ic">'+(SUBJ_EMOJI[s]||"")+'</div>'+
     '<div class="ac-title">'+KW+' '+s+'</div>'+
     '<div class="ac-desc">'+(SUBJ_DESC[s]||"")+'</div>'+
     '<div class="ac-more">자세히 보기 →</div></a>').join("");
 return '<section class="area-sec"><div class="inner">'+
   '<div class="area-head"><span class="bar"></span><h2 class="area-h2">'+KW+' 과목별 안내</h2></div>'+
   '<p class="area-sub">관심 과목을 선택하면 '+KW+' 지역 맞춤 학습 안내를 확인하실 수 있습니다.</p>'+
   '<div class="area-grid">'+cards+'</div></div></section>';
}

/* 지점 하단 '지역+과목' 카드 */
function branchAreaButtons(c, idx){
 return areaSubjectCards(c, idx, null);
}

/* 지역+과목 전용 SEO 페이지 */
function buildSubjectPage(idx, slug){
 const c=CENTERS[idx]; const subj=SLUG_SUBJ[slug];
 if(!c||!subj) return null;
 const rng=mulberry32(strHash(c.n+"|"+slug+"|"+c.a));
 const pk=a=>a[Math.floor(rng()*a.length)];
 const KW=esc(areaKeyword(c)); const N=esc(c.n);
 const el=splitSchools(c.t&&c.t["초"]),mid=splitSchools(c.t&&c.t["중"]),hi=splitSchools(c.t&&c.t["고"]);
 const lvlSchools = subj==="과학"||subj==="사회" ? mid.concat(hi) : el.concat(mid,hi);
 const method=SJF[subj]||["개념을 차근차근 다집니다"];
 const paras=[
   "<strong>"+KW+" "+subj+" 학원</strong>을 찾는다면 가장 먼저 볼 것은 학생 수준에 맞춘 관리입니다. "+pk(INFO.choose)+" "+pk(INFO.coach),
   subj+" 공부의 핵심은 다음과 같습니다. "+subj+"는 "+pk(method)+". 또한 "+pk(method)+". "+pk(INFO.habit),
   KW+" 지역에서는 "+(lvlSchools.length? esc(lvlSchools.slice(0,6).join(", "))+" 등 ":"")+"학교의 시험 범위와 출제 경향에 맞춰 "+subj+"를 지도합니다. "+pk(INFO.exam),
   "시험과 방학 전략도 중요합니다. "+pk(INFO.exam)+" "+pk(INFO.vac)+" "+subj+"는 꾸준한 누적이 결과로 이어집니다."
 ];
 return `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${KW} ${subj} 학원 | ${CFG.name} ${N}</title>
<meta name="description" content="${KW} ${subj} 학원을 찾는다면. ${KW} 지역 ${subj} 학습 코칭과 내신·시험 대비 안내. ${CFG.name} ${N}.">
<meta property="og:title" content="${KW} ${subj} 학원 | ${CFG.name} ${N}">
<meta property="og:url" content="${CFG.domain}/branch/${idx}/${slug}">
${STYLE}
</head><body>
${NAV}
<header class="bd-hero" style="${heroBg(strHash(c.n+slug))}">
  <div class="bd-hero-inner">
    <a href="/branch/${idx}" class="bd-back">← ${N} 지점 안내</a>
    <div class="bd-region">${esc(c.p)} · ${esc(c.c)} · ${KW}</div>
    <h1 class="serif">${KW} <span class="hl">${subj}</span> 학원</h1>
    <div class="bd-chips"><span class="bd-chip">${SUBJ_EMOJI[subj]||""} ${subj}</span><span class="bd-chip light">${esc(c.gr||"초·중·고")}</span></div>
  </div>
</header>
<section class="bd-body"><div class="inner">
  ${paras.map(p=>'<div class="bd-block"><p class="bd-p">'+p+'</p></div>').join("")}
  <div class="bd-block" style="text-align:center;">
    <a href="/#apply" class="bd-cta" style="display:inline-block;max-width:320px;">${KW} ${subj} 상담 신청 →</a>
    <a href="${CFG.kakaoUrl}" target="_blank" rel="noopener" class="bd-cta kakao" style="display:inline-block;max-width:320px;">💬 카카오톡 문의</a>
  </div>
  </div></section>
${areaSubjectCards(c, idx, subj)}
${FOOTER}
${FLOATING}
</body></html>`;
}

function faqItem(q, a, open){
  return `<div class="fitem${open?' open':''}"><button class="fq" onclick="this.parentElement.classList.toggle('open')"><span><span class="qi">Q</span>${q}</span><span class="ar">▾</span></button><div class="fa">${a}</div></div>`;
}
function branchFaqHtml(c){
  const q1=faqItem(`${esc(c.n)}은 어떤 학생이 다니나요?`,
    `${esc(c.p)} ${esc(c.c)} 지역의 ${esc(c.gr)||"초·중·고"} 학생들이 다니고 있습니다. ${targetSummary(c)} 첫 상담에서 현재 수준과 학습 습관을 진단한 뒤 학생에게 맞는 커리큘럼으로 지도합니다.`, true);
  const q2=faqItem("어떤 과목을 배울 수 있나요?",
    `${esc((c.s||[]).join("·"))||"국어·영어·수학·과학·사회"} 과목을 지도하며, 학생 수준에 맞춰 개별 맞춤으로 코칭합니다. 수업 가능 학년은 ${esc(c.gr)||"초1~고3"}입니다.`, false);
  const q3=faqItem("수업료(학원비)는 어떻게 되나요?", TUITION_HTML, false);
  const q4=faqItem("상담·등록은 어떻게 하나요?",
    `전화(${CFG.phone}), 카카오톡 채널, 또는 홈페이지 상담 신청으로 문의하실 수 있습니다. 진단 상담은 부담 없이 받아 보실 수 있으며, 상담 후 학생에게 맞는 수업 방식을 안내해 드립니다.`, false);
  return `<div class="faq">${q1}${q2}${q3}${q4}</div>`;
}

const REVIEW_POOL=[
  {role:"학부모", body:"{city}에서 여러 곳을 다녀봤지만 여기서 처음으로 공부 습관이 잡혔어요. 매주 학습 상황을 공유해 주셔서 믿음이 갑니다."},
  {role:"학생", body:"{subj} 성적이 눈에 띄게 올랐어요. 모르는 부분을 그때그때 질문할 수 있어서 좋았습니다."},
  {role:"학부모", body:"내신 대비를 학교 기출 중심으로 꼼꼼히 해주셔서 시험 점수가 크게 올랐습니다."},
  {role:"학부모", body:"선생님들이 아이 성향을 잘 파악해 주세요. 플래너 관리 덕분에 스스로 공부하는 시간이 늘었습니다."},
  {role:"학생", body:"처음엔 공부가 막막했는데 단계별로 차근차근 이끌어 주셔서 자신감이 생겼어요."},
  {role:"학부모", body:"상담이 자세하고 솔직해서 좋았습니다. 등록 후 아이가 학원 가는 걸 싫어하지 않아요."},
  {role:"학생", body:"{subj} 개념을 확실히 잡고 나니 다른 과목 공부도 한결 수월해졌어요."},
  {role:"학부모", body:"시험 기간에 주말 자습까지 챙겨 주셔서 큰 도움이 됐습니다. 관리가 정말 꼼꼼해요."}
];
function branchReviewsHtml(c, idx){
  const subj=(c.s&&c.s.length)? c.s[0] : "전과목";
  const city=c.c||c.p;
  const start=idx % REVIEW_POOL.length;
  let cards="";
  for(let k=0;k<6;k++){
    const r=REVIEW_POOL[(start+k)%REVIEW_POOL.length];
    const body=r.body.replace(/{subj}/g, subj).replace(/{city}/g, city);
    const av=r.role==="학생"?"학":"부";
    const tag=r.role+" · "+(r.role==="학생"? subj : (c.gr||"학습코칭"));
    cards+=reviewCard(esc(tag),"★★★★★",esc(body),av,esc(r.role),esc(city+" "+c.n));
  }
  return '<div class="rv-wrap"><div class="rv-track">'+cards+cards+'</div></div>';
}

function branchMapBlock(c, mapsLink){
  return CFG.kakaoMapKey
    ? '<div id="kmap" class="bd-map"></div>'
    : '<div class="bd-map-ph">카카오 지도 키를 설정하면 이곳에 지도가 표시됩니다.</div><a href="'+mapsLink+'" target="_blank" rel="noopener" class="bd-maplink">네이버 지도에서 위치 보기 →</a>';
}
function branchMapScript(c){
  if(!CFG.kakaoMapKey) return "";
  const addrJson=JSON.stringify(cleanAddr(c.a));
  const nameJson=JSON.stringify(c.n);
  const cityJson=JSON.stringify(c.p+" "+c.c+" "+c.n);
  return `<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${CFG.kakaoMapKey}&autoload=false&libraries=services"></script>
<script>
kakao.maps.load(function(){
  var el=document.getElementById('kmap'); if(!el) return;
  var map=new kakao.maps.Map(el,{center:new kakao.maps.LatLng(37.5665,126.9780),level:3});
  var geocoder=new kakao.maps.services.Geocoder();
  var places=new kakao.maps.services.Places();
  var ADDR=${addrJson}, NAME=${nameJson}, CITY=${cityJson};
  function place(y,x){
    var pos=new kakao.maps.LatLng(y,x);
    map.setCenter(pos);
    new kakao.maps.Marker({map:map,position:pos});
    var ov=new kakao.maps.CustomOverlay({position:pos,yAnchor:2.2,content:'<div class="kmap-label">'+NAME+'</div>'});
    ov.setMap(map);
    setTimeout(function(){map.relayout();map.setCenter(pos);},200);
  }
  function fail(){ el.outerHTML='<div class="bd-map-ph">지도를 불러오지 못했습니다. 위 주소를 참고해 주세요.</div>'; }
  geocoder.addressSearch(ADDR, function(r,s){
    if(s===kakao.maps.services.Status.OK && r[0]){ place(r[0].y,r[0].x); return; }
    places.keywordSearch(ADDR, function(r2,s2){
      if(s2===kakao.maps.services.Status.OK && r2[0]){ place(r2[0].y,r2[0].x); return; }
      places.keywordSearch(CITY, function(r3,s3){
        if(s3===kakao.maps.services.Status.OK && r3[0]){ place(r3[0].y,r3[0].x); }
        else fail();
      });
    });
  });
});
</script>`;
}

/* 지점/과목 히어로 배경 썸네일 (학습공간 · 지점별 상이 · 이미지 실패 시 초록 배경 유지) */
function heroImg(seed){
 const sets=["classroom,school","library,books","desk,study","classroom,interior","bookshelf,books","lecture,hall","school,hallway","study,room","blackboard,classroom","campus,building","reading,room","notebook,desk"];
 const s=Math.abs(seed|0);
 return "https://loremflickr.com/1280/520/"+sets[s%sets.length]+"/all?lock="+(s%9000+1);
}
function heroBg(seed){
 return "background:linear-gradient(rgba(12,43,35,.72),rgba(12,43,35,.9)),url('"+heroImg(seed)+"') center/cover no-repeat,#0C2B23;";
}
function thumbBg(seed){
 return "background:linear-gradient(rgba(12,43,35,.15),rgba(12,43,35,.82)),url('"+heroImg(seed)+"') center/cover no-repeat,#0C2B23;";
}

/* 과목 × 학년 배지 그리드 (지점이 맡는 학년만 활성) */
const GG_GRADES=[["초1","lv-e"],["초2","lv-e"],["초3","lv-e"],["초4","lv-e"],["초5","lv-e"],["초6","lv-e"],["중1","lv-m"],["중2","lv-m"],["중3","lv-m"],["고1","lv-h"],["고2","lv-h"],["고3","lv-h"]];
function gradeRange(gr){
 const order=GG_GRADES.map(g=>g[0]);
 const parts=(gr||"").replace(/\s/g,"").split("~");
 let s=order.indexOf(parts[0]); let e=order.indexOf(parts[1]!==undefined?parts[1]:parts[0]);
 if(s<0)s=0; if(e<0)e=order.length-1; if(e<s)e=order.length-1;
 return [s,e];
}
function gradeGrid(c){
 const subs=(c.s&&c.s.length)? c.s : [];
 if(!subs.length) return '<div class="bd-srow"><span class="bd-sk">담당 과목</span><span class="bd-sv">상담 시 안내</span></div>';
 const [s,e]=gradeRange(c.gr);
 const rows=subs.filter(x=>SUBJ_EMOJI[x]).map(sub=>{
   const badges=GG_GRADES.map((g,i)=>{
     const on=(i>=s&&i<=e);
     return '<span class="gg-b '+(on?('on '+g[1]):'off')+'">'+g[0]+'</span>';
   }).join("");
   return '<div class="gg-row"><div class="gg-subj">'+(SUBJ_EMOJI[sub]||"")+'<span>'+esc(sub)+'</span></div><div class="gg-badges">'+badges+'</div></div>';
 }).join("");
 return '<div class="gg-wrap"><div class="gg-title">📚 수강 가능 과목 · 학년</div>'+rows+'</div>';
}

function buildBranchPage(idx){
  const c = CENTERS[idx];
  if(!c) return null;
  const addr = esc(cleanAddr(c.a));
  const subj = c.s.map(s=>'<span class="bd-chip">'+(SUBJ_EMOJI[s]||'')+' '+s+'</span>').join('') || '<span class="bd-chip">상담 시 안내</span>';
  const tgt = [['초등',c.t['초']],['중등',c.t['중']],['고등',c.t['고']]].filter(x=>x[1]).map(x=>
    '<div class="bd-trow"><span class="bd-tk">'+x[0]+'</span><span class="bd-tv">'+esc(x[1])+'</span></div>').join('') || '<p class="bd-empty">상담 시 안내해 드립니다.</p>';
  const weekend = (c.we && c.we.indexOf('불가')<0 && c.we.indexOf('주말불가')<0) ? esc(c.we)+(c.wi?' · '+esc(c.wi):'') : '주말 미운영';
  const strength = c.st ? '<p class="bd-strength">'+esc(c.st)+'</p>' : '<p class="bd-empty">방문 상담 시 자세히 안내해 드립니다.</p>';
  const mapsLink = 'https://map.naver.com/v5/search/'+encodeURIComponent(cleanAddr(c.a));
  const mapBlock = branchMapBlock(c, mapsLink);
  const KW = esc(areaKeyword(c));
  const lead = esc(c.p)+" "+esc(c.c||"")+" "+KW+" 일대 초·중·고 "+esc((c.s&&c.s.length?c.s:["전과목"]).join("·"))+" 개별지도 와와학습코칭. 진단·설계·코칭·관리 4단계로 학생마다 맞춤 관리하는 학습코칭 학원입니다.";
  let today; try{ today=new Date().toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"}); }catch(e){ today=""; }

  return `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${KW} 학원 | 개별지도 와와학습코칭 학원 · ${CFG.name} ${esc(c.n)}</title>
<meta name="description" content="${KW} 학원 - ${esc(c.p)} ${esc(c.c)} 개별지도 와와학습코칭 학원. 초·중·고 ${esc((c.s||[]).join('·'))} ${esc(c.gr)} 맞춤 지도. ${addr}">
<meta property="og:title" content="${KW} 학원 | 개별지도 와와학습코칭 학원">
<meta property="og:description" content="${esc(c.p)} ${esc(c.c)} ${KW} · 초·중·고 개별지도 학습코칭">
<meta property="og:url" content="${CFG.domain}/branch/${idx}">
${STYLE}
</head><body>
${NAV}
<section class="art-head">
  <div class="inner">
    <div class="art-crumb"><a href="/">홈</a> › <a href="/#branches">지점 안내</a> › ${KW} 학원</div>
    <span class="art-badge">🏫 학원 안내</span>
    <h1 class="art-title">${KW} 학원 <span class="sub">| 개별지도 와와학습코칭 학원</span></h1>
    <div class="art-by"><span>✏️ ${CFG.name} ${esc(c.n)}</span><span class="by-line"></span><span>📍 ${esc(c.p)} ${esc(c.c)}</span>${today?'<span class="by-line"></span><span>📅 '+today+'</span>':''}</div>
    <p class="art-lead">${lead}</p>
    <div class="art-thumb" style="${thumbBg(strHash(c.n+c.a))}">
      <div class="art-thumb-inner">
        <h2>${KW} 학원 · 개별지도 학습코칭</h2>
        <div class="bd-chips">${subj}${c.gr?'<span class="bd-chip light">'+esc(c.gr)+'</span>':''}</div>
      </div>
    </div>
    <a href="/#branches" class="bd-back" style="display:inline-block;margin-top:18px;color:var(--muted);">← 전체 지점 보기</a>
  </div>
</section>
<section class="bd-body">
  <div class="inner bd-grid">
    <div class="bd-main">
      <div class="bd-block">
        <h2 class="bd-h2">📍 위치 안내</h2>
        <p class="bd-addr">${addr}</p>
        ${c.g?'<p class="bd-guide">'+esc(c.g)+'</p>':''}
        ${mapBlock}
      </div>
      <div class="bd-block">
        <h2 class="bd-h2">🏫 인근 타깃 학교</h2>
        ${tgt}
      </div>
      <div class="bd-block">
        <h2 class="bd-h2">⭐ 이 지점의 강점</h2>
        ${strength}
      </div>
    </div>
    <aside class="bd-side">
      <div class="bd-card">
        <div class="bd-srow"><span class="bd-sk">운영 시간</span><span class="bd-sv">${esc(c.ot)||'상담 시 안내'}</span></div>
        <div class="bd-srow"><span class="bd-sk">주말 수업</span><span class="bd-sv">${weekend}</span></div>
        ${gradeGrid(c)}
        <a href="/#apply" class="bd-cta">이 지점 상담 신청 →</a>
        <a href="${CFG.kakaoUrl}" target="_blank" rel="noopener" class="bd-cta kakao">💬 카카오톡 문의</a>
      </div>
    </aside>
  </div>
</section>
<section class="bd-extra" style="background:var(--paper);">
  <div class="inner">
    <span class="eyebrow">About</span>
    <h2 class="title" style="text-align:left;">${esc(c.c)} ${esc(c.n)} 학습코칭 안내</h2>
    ${branchArticle(c)}
  </div>
</section>
<section style="background:var(--cream);">
  <div class="inner head-center"><span class="eyebrow">FAQ</span><h2 class="title">자주 묻는 질문</h2></div>
  ${branchFaqHtml(c)}
</section>
<section style="background:var(--paper);">
  <div class="inner head-center"><span class="eyebrow">Reviews</span><h2 class="title">${esc(c.n)} 학부모·학생 후기</h2></div>
  ${branchReviewsHtml(c, idx)}
</section>
${branchAreaButtons(c, idx)}
${FOOTER}
${FLOATING}
${branchMapScript(c)}
</body></html>`;
}

function HOME() {
  const reviews = REVIEWS_DATA.map(r => reviewCard(...r)).join("");
  // 무한 스크롤을 위해 2배 반복
  const reviewTrack = reviews + reviews;
  const naverBtn = CFG.naverFormUrl
    ? `<a href="${CFG.naverFormUrl}" target="_blank" rel="noopener" class="fkakao" style="background:#03C75A;color:#fff;margin-top:12px;">\u{1F4CB} 네이버 폼으로 신청하기</a>`
    : "";

  return `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${CFG.name} | ${CFG.tagline} · 초·중·고 와와학습코칭 학원</title>
<meta name="description" content="${CFG.name} — 진단부터 관리까지 1:1 맞춤 학습코칭. 초·중·고 국어·영어·수학·과학·사회 전과목. 학습 습관과 내신을 함께 잡습니다.">
<meta property="og:type" content="website">
<meta property="og:title" content="${CFG.name} | ${CFG.tagline}">
<meta property="og:description" content="진단·설계·코칭·관리 4단계 맞춤 학습코칭. 초·중·고 전과목 학원수업.">
<meta property="og:url" content="${CFG.domain}">
${STYLE}
</head><body>
${NAV}

<!-- HERO -->
<header class="hero">
  <div class="hero-inner">
    <div class="hero-badge">✦ 초·중·고 전과목 · 1:1 맞춤 학습코칭</div>
    <h1 class="serif">채워야 할 것을<br>정확히 <span class="hl">채웁니다</span></h1>
    <p>${CFG.name}는 학생마다 비어 있는 부분이 다르다고 믿습니다.<br>진단으로 빈틈을 찾고, 설계·코칭·관리로 하나씩 채워 완성합니다.</p>
    <div class="hero-btns">
      <a href="#apply" class="btn btn-coral">무료 상담 신청 →</a>
      <a href="#process" class="btn btn-ghost">코칭 시스템 보기</a>
    </div>
    <div class="hero-stats">
      <div class="hstat"><div class="num" data-to="5"><span class="v">0</span><span class="u">과목</span></div><div class="lab">국·영·수·과·사 전과목</div></div>
      <div class="hstat"><div class="num">전 학년</div><div class="lab">초·중·고 모든 학년 수업 가능</div></div>
      <div class="hstat"><div class="num" data-to="4"><span class="v">0</span><span class="u">단계</span></div><div class="lab">진단·설계·코칭·관리</div></div>
      <div class="hstat"><div class="num">개별맞춤</div><div class="lab">개별 맞춤 코칭 진행</div></div>
    </div>
  </div>
</header>

<!-- WHY -->
<section id="why">
  <div class="inner head-center">
    <span class="eyebrow">Why ${CFG.name}</span>
    <h2 class="title">왜 <span class="hl">${CFG.name}</span>일까요?</h2>
    <p class="lead">문제만 풀리는 학원이 아니라, 공부하는 방법과 습관까지 채워주는 와와학습코칭 학원입니다.</p>
    <div class="why-grid">
      <div class="why-card"><div class="why-num">01</div><h3>정확한 진단</h3><p>현재 수준·학습 습관·취약 단원을 먼저 파악합니다. 무엇을 채워야 할지부터 분명히 합니다.</p></div>
      <div class="why-card"><div class="why-num">02</div><h3>맞춤 커리큘럼</h3><p>정해진 교재를 일괄 적용하지 않습니다. 학교·학년·시험 일정에 맞춰 학생마다 새로 설계합니다.</p></div>
      <div class="why-card"><div class="why-num">03</div><h3>1:1 밀착 코칭</h3><p>코치가 곁에서 풀이 과정을 함께 보고 즉시 피드백합니다. 모르는 부분을 그냥 넘어가지 않습니다.</p></div>
      <div class="why-card"><div class="why-num">04</div><h3>학습 습관 형성</h3><p>계획표 짜기, 오답 정리, 복습 주기까지. 스스로 공부하는 힘을 길러 드립니다.</p></div>
      <div class="why-card"><div class="why-num">05</div><h3>내신·학교 대비</h3><p>학생이 다니는 학교의 시험 범위와 출제 경향을 분석해 내신에 직접 연결합니다.</p></div>
      <div class="why-card"><div class="why-num">06</div><h3>투명한 소통</h3><p>학습 진도와 성장 과정을 학부모님과 정기적으로 공유합니다. 무엇이 달라지는지 함께 확인합니다.</p></div>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section id="process">
  <div class="inner head-center">
    <span class="eyebrow">Coaching System</span>
    <h2 class="title">채움 학습 코칭 4단계</h2>
    <p class="lead">진단에서 관리까지, 빈틈을 채워 완성하는 과정입니다.</p>
    <div class="steps">
      <div class="step"><div class="st-no">01</div><div class="en">Diagnose</div><h3>진단</h3><p>학습 수준과 습관, 취약 단원을 정밀하게 파악합니다.</p></div>
      <div class="step"><div class="st-no">02</div><div class="en">Design</div><h3>설계</h3><p>진단 결과로 학생만의 맞춤 커리큘럼과 목표를 설계합니다.</p></div>
      <div class="step"><div class="st-no">03</div><div class="en">Coach</div><h3>코칭</h3><p>1:1 밀착 수업으로 개념을 채우고 풀이를 함께 훈련합니다.</p></div>
      <div class="step"><div class="st-no">04</div><div class="en">Care</div><h3>관리</h3><p>복습·과제·태도를 관리하고 학부모님과 진행을 공유합니다.</p></div>
    </div>
  </div>
</section>

<!-- MANAGE -->
<section id="manage">
  <div class="inner head-center" style="margin-bottom:52px;">
    <span class="eyebrow">Management</span>
    <h2 class="title">공부만 시키지 않습니다,<br><span class="hl">채워서 관리</span>합니다</h2>
    <p class="lead">학습·태도·소통 세 축을 촘촘하게 관리해 성적과 습관을 함께 잡습니다.</p>
  </div>
  <div class="inner">
    <div class="mrow">
      <div class="m-txt">
        <span class="m-tag">학습 관리</span>
        <h3>오늘 무엇을, 얼마나 채웠는지</h3>
        <p>수업 진도·과제 이행·복습 주기를 코치가 직접 챙깁니다. 배운 내용을 3일·7일 간격으로 다시 점검해 장기 기억으로 남깁니다.</p>
        <div class="m-list">
          <div><span class="ck">✓</span><span>일일 학습 플래너로 공부 시간 확보</span></div>
          <div><span class="ck">✓</span><span>과제 이행률·오답 노트 점검</span></div>
          <div><span class="ck">✓</span><span>시험 범위 기반 단계별 로드맵</span></div>
        </div>
      </div>
      <div class="m-art"><div><div class="big">📋</div><div class="ph">[이미지 영역] 학습 관리 사진을 넣어주세요</div></div></div>
    </div>
    <div class="mrow rev">
      <div class="m-txt">
        <span class="m-tag">태도·생활 관리</span>
        <h3>집중하는 환경과 습관</h3>
        <p>출결과 자리 집중도, 학습 태도까지 살핍니다. 적절한 긴장감과 안정감 속에서 스스로 공부하는 습관을 만들어 갑니다.</p>
        <div class="m-list">
          <div><span class="ck">✓</span><span>출결·집중 시간 기록 관리</span></div>
          <div><span class="ck">✓</span><span>학습 태도 코칭과 동기 부여</span></div>
          <div><span class="ck">✓</span><span>스마트폰·산만함 관리 지원</span></div>
        </div>
      </div>
      <div class="m-art"><div><div class="big">🎯</div><div class="ph">[이미지 영역] 학원 공간 사진을 넣어주세요</div></div></div>
    </div>
    <div class="mrow">
      <div class="m-txt">
        <span class="m-tag">학부모 소통</span>
        <h3>달라지는 과정을 함께 확인</h3>
        <p>주간 학습 리포트와 정기 상담으로 학생의 성장 과정을 투명하게 공유합니다. 숨겨진 비용이나 막연한 안내는 없습니다.</p>
        <div class="m-list">
          <div><span class="ck">✓</span><span>주간 학습 리포트 발송</span></div>
          <div><span class="ck">✓</span><span>정기 학습 상담 진행</span></div>
          <div><span class="ck">✓</span><span>성적·태도 변화 기록 공유</span></div>
        </div>
      </div>
      <div class="m-art"><div><div class="big">💬</div><div class="ph">[이미지 영역] 상담·리포트 사진을 넣어주세요</div></div></div>
    </div>
  </div>
</section>

<!-- SUBJECTS -->
<section id="subjects">
  <div class="inner head-center">
    <span class="eyebrow">Subjects</span>
    <h2 class="title">초·중·고 전과목, <span class="hl">모두 채웁니다</span></h2>
    <p class="lead">국어·영어·수학·과학·사회 주요 과목을 학년과 수준에 맞춰 코칭합니다.</p>
    <div class="subj-grid">
      <div class="subj"><div class="ic">📖</div><div class="nm">국어</div><div class="ds">문학·비문학·문법</div></div>
      <div class="subj"><div class="ic">🌍</div><div class="nm">영어</div><div class="ds">독해·문법·내신</div></div>
      <div class="subj"><div class="ic">🔢</div><div class="nm">수학</div><div class="ds">개념·심화·내신</div></div>
      <div class="subj"><div class="ic">🧪</div><div class="nm">과학</div><div class="ds">물리·화학·생명·지구</div></div>
      <div class="subj"><div class="ic">🗺️</div><div class="nm">사회</div><div class="ds">사회·역사·탐구</div></div>
    </div>
  </div>
</section>

<!-- GRADE -->
<section id="grade">
  <div class="inner head-center">
    <span class="eyebrow">By Grade</span>
    <h2 class="title">학년마다 <span class="hl">채우는 방법</span>이 다릅니다</h2>
    <p class="lead">각 시기에 꼭 필요한 것을 집중적으로 잡아드립니다.</p>
    <div class="grade-grid">
      <div class="gcard">
        <div class="gtop" style="background:linear-gradient(135deg,#1C5C49,#123F33);"><div class="gic">🌱</div><h3 class="serif">초등학교</h3><div class="gsub">올바른 공부 습관의 씨앗</div></div>
        <div class="gbody"><div class="glabel">이 시기의 핵심</div><ul>
          <li><span class="ck">✓</span>기초 연산·독해·쓰기 기본기</li>
          <li><span class="ck">✓</span>매일 공부하는 루틴 만들기</li>
          <li><span class="ck">✓</span>스스로 계획 세우는 자기주도 학습</li>
          <li><span class="ck">✓</span>공부가 재미있다는 경험</li>
        </ul></div>
      </div>
      <div class="gcard">
        <div class="gtop" style="background:linear-gradient(135deg,#C0703A,#E1623D);"><div class="gic">📘</div><h3 class="serif">중학교</h3><div class="gsub">내신의 기초가 결정되는 시기</div></div>
        <div class="gbody"><div class="glabel">이 시기의 핵심</div><ul>
          <li><span class="ck">✓</span>수학 개념 체계를 단계별로 완성</li>
          <li><span class="ck">✓</span>내신 기출 분석·출제 패턴 파악</li>
          <li><span class="ck">✓</span>국어·영어 독해력과 문법 기초</li>
          <li><span class="ck">✓</span>고등 대비 선행 학습 설계</li>
        </ul></div>
      </div>
      <div class="gcard">
        <div class="gtop" style="background:linear-gradient(135deg,#0C2B23,#1C5C49);"><div class="gic">🔥</div><h3 class="serif">고등학교</h3><div class="gsub">내신·수능, 목표에 맞춘 전략</div></div>
        <div class="gbody"><div class="glabel">이 시기의 핵심</div><ul>
          <li><span class="ck">✓</span>학교별 내신 기출 기반 대비</li>
          <li><span class="ck">✓</span>수능 출제 유형 분석·등급 전략</li>
          <li><span class="ck">✓</span>취약 단원 집중·오답 관리</li>
          <li><span class="ck">✓</span>목표 대학 맞춤 입시 상담</li>
        </ul></div>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section id="reviews">
  <div class="inner head-center">
    <span class="eyebrow">Reviews</span>
    <h2 class="title">먼저 채운 학생과 학부모의 <span class="hl">이야기</span></h2>
  </div>
  <div class="rv-wrap"><div class="rv-track">${reviewTrack}</div></div>
</section>


<!-- BRANCHES -->
<section id="branches">
  <div class="inner head-center">
    <span class="eyebrow">Branches</span>
    <h2 class="title">전국 어디서나, <span class="hl">가까운 채움클래스</span></h2>
    <p class="lead">전국 ${CENTERS.length}개 지점에서 같은 학습코칭을 만나실 수 있습니다. 지역을 선택하거나 지점명을 검색해 보세요.</p>
  </div>
  <div class="inner">
    <div class="br-tabs" id="brTabs"></div>
    <div class="br-search"><span class="si">🔍</span><input id="brSearch" type="text" placeholder="지점명·지역으로 검색 (예: 수지, 하남)"></div>
    <div class="br-count" id="brCount"></div>
    <div class="br-grid" id="brGrid"></div>
    <div class="br-more" id="brMore" style="display:none;"><button onclick="brShowMore()">지점 더 보기</button></div>
  </div>
</section>
<script>
(function(){
  var DATA = ${branchesLightJSON()};
  var RO = ${JSON.stringify(REGION_ORDER)};
  var SUBJ_E = {"국어":"📖","영어":"🌍","수학":"🔢","과학":"🧪","사회":"🗺️"};
  var curRegion = "전체", curSearch = "", shown = 12, PAGE = 12;
  var counts = {}; DATA.forEach(function(c){counts[c.p]=(counts[c.p]||0)+1;});

  function tabs(){
    var html = '<button class="br-tab on" data-r="전체">전체<span class="cnt">'+DATA.length+'</span></button>';
    RO.forEach(function(r){ if(counts[r]) html += '<button class="br-tab" data-r="'+r+'">'+r+'<span class="cnt">'+counts[r]+'</span></button>'; });
    var box = document.getElementById('brTabs'); box.innerHTML = html;
    box.querySelectorAll('.br-tab').forEach(function(b){
      b.onclick=function(){ box.querySelectorAll('.br-tab').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); curRegion=b.getAttribute('data-r'); shown=PAGE; render(); };
    });
  }
  function filtered(){
    var q = curSearch.trim().toLowerCase();
    return DATA.filter(function(c){
      if(curRegion!=="전체" && c.p!==curRegion) return false;
      if(q){ var hay=(c.n+' '+c.p+' '+c.c).toLowerCase(); if(hay.indexOf(q)<0) return false; }
      return true;
    });
  }
  function render(){
    var list = filtered();
    document.getElementById('brCount').textContent = list.length+'개 지점';
    var grid = document.getElementById('brGrid');
    if(list.length===0){ grid.innerHTML='<p class="br-empty-msg">검색 결과가 없습니다. 다른 지역이나 키워드로 찾아보세요.</p>'; document.getElementById('brMore').style.display='none'; return; }
    var slice = list.slice(0, shown);
    grid.innerHTML = slice.map(function(c){
      var subj = (c.s||[]).slice(0,5).map(function(s){return '<span class="bc-subj">'+(SUBJ_E[s]||'')+' '+s+'</span>';}).join('');
      return '<a class="br-card" href="/branch/'+c.i+'">'
        +'<div class="bc-region">'+c.p+' · '+c.c+'</div>'
        +'<div class="bc-name">'+c.n+'</div>'
        +'<div class="bc-meta">'+subj+'</div>'
        +(c.gr?'<div class="bc-grade">'+c.gr+' 수업</div>':'')
        +'<div class="bc-go">지점 자세히 보기 →</div></a>';
    }).join('');
    document.getElementById('brMore').style.display = list.length>shown ? 'block':'none';
  }
  window.brShowMore=function(){ shown+=PAGE; render(); };
  document.getElementById('brSearch').addEventListener('input', function(e){ curSearch=e.target.value; shown=PAGE; render(); });
  tabs(); render();
})();
</script>

<!-- FAQ -->
<section id="faq" style="background:var(--paper);">
  <div class="inner head-center">
    <span class="eyebrow">FAQ</span>
    <h2 class="title">궁금한 점이 있으신가요?</h2>
  </div>
  <div class="faq">
    <div class="fitem open"><button class="fq" onclick="this.parentElement.classList.toggle('open')"><span><span class="qi">Q</span>대상 학년이 어떻게 되나요?</span><span class="ar">▾</span></button><div class="fa">초등학교 1학년부터 고등학교 3학년까지, 국어·영어·수학·과학·사회 전과목을 코칭합니다. 학생의 학년과 수준에 맞춰 커리큘럼을 설계합니다.</div></div>
    <div class="fitem"><button class="fq" onclick="this.parentElement.classList.toggle('open')"><span><span class="qi">Q</span>첫 상담은 어떻게 진행되나요?</span><span class="ar">▾</span></button><div class="fa">부담 없이 상담 신청을 남겨 주시면 연락드립니다. 현재 성적·학습 습관·목표를 함께 파악하고, 학생에게 맞는 수업 방식을 안내해 드립니다.</div></div>
    <div class="fitem"><button class="fq" onclick="this.parentElement.classList.toggle('open')"><span><span class="qi">Q</span>수강료는 어떻게 되나요?</span><span class="ar">▾</span></button><div class="fa">학년·과목·수업 횟수에 따라 달라집니다. 상담 시 학생 상황에 맞는 합리적인 안내를 드리며, 숨겨진 추가 비용은 없습니다.</div></div>
    <div class="fitem"><button class="fq" onclick="this.parentElement.classList.toggle('open')"><span><span class="qi">Q</span>학습 상황은 어떻게 공유되나요?</span><span class="ar">▾</span></button><div class="fa">주간 학습 리포트와 정기 상담을 통해 진도·성적·태도 변화를 학부모님과 공유합니다.</div></div>
  </div>
</section>

<!-- APPLY -->
<section id="apply">
  <div class="inner head-center">
    <span class="eyebrow">Apply</span>
    <h2 class="title">지금 바로 <span class="hl">상담 신청</span></h2>
    <p class="lead">아래 내용을 남겨 주시면 빠르게 연락드립니다.</p>
  </div>
  <div class="form-card">
    <div class="fgroup">
      <label class="flabel">🎓 자녀 학년 <span class="opt">(복수 선택 가능)</span></label>
      <div class="chips" data-kind="grade">
        <button type="button" class="chip" onclick="tog(this)">초1</button><button type="button" class="chip" onclick="tog(this)">초2</button><button type="button" class="chip" onclick="tog(this)">초3</button><button type="button" class="chip" onclick="tog(this)">초4</button><button type="button" class="chip" onclick="tog(this)">초5</button><button type="button" class="chip" onclick="tog(this)">초6</button><button type="button" class="chip" onclick="tog(this)">중1</button><button type="button" class="chip" onclick="tog(this)">중2</button><button type="button" class="chip" onclick="tog(this)">중3</button><button type="button" class="chip" onclick="tog(this)">고1</button><button type="button" class="chip" onclick="tog(this)">고2</button><button type="button" class="chip" onclick="tog(this)">고3</button>
      </div>
    </div>
    <div class="fgroup">
      <label class="flabel">📚 희망 과목 <span class="opt">(복수 선택 가능)</span></label>
      <div class="chips" data-kind="subject">
        <button type="button" class="chip" onclick="tog(this)">📖 국어</button><button type="button" class="chip" onclick="tog(this)">🌍 영어</button><button type="button" class="chip" onclick="tog(this)">🔢 수학</button><button type="button" class="chip" onclick="tog(this)">🧪 과학</button><button type="button" class="chip" onclick="tog(this)">🗺️ 사회</button><button type="button" class="chip" onclick="tog(this)">전과목</button>
      </div>
    </div>
    <div class="fgroup frow">
      <div><label class="flabel">🧑‍🎓 학생 이름</label><input class="finput" id="fName" placeholder="학생 이름"></div>
      <div><label class="flabel">📱 연락처</label><input class="finput" id="fContact" placeholder="010-0000-0000"></div>
    </div>
    <div class="fgroup">
      <label class="flabel">🏫 학생 학교 <span class="opt">(선택)</span></label>
      <input class="finput" id="fSchool" placeholder="예) ○○중학교">
    </div>
    <div class="fgroup">
      <label class="flabel">💬 문의 사항 <span class="opt">(선택)</span></label>
      <textarea class="finput" id="fMsg" rows="3" placeholder="추가로 전달하실 내용이 있으면 자유롭게 적어주세요" style="resize:vertical;"></textarea>
    </div>
    <div class="fcheck">
      <input type="checkbox" id="fAgree">
      <label for="fAgree">본인은 만 14세 이상이며, 개인정보 수집 및 이용에 동의합니다. (필수)</label>
    </div>
    <button class="fsubmit" id="fSubmit" onclick="submitForm()">📝 상담 신청하기</button>
    <a href="${CFG.kakaoUrl}" target="_blank" rel="noopener" class="fkakao">💬 카카오톡으로 바로 문의하기</a>
    ${naverBtn}
  </div>
</section>

<!-- CTA -->
<section id="cta">
  <div class="inner">
    <h2 class="serif">아이의 비어 있는 부분,<br>${CFG.name}가 채워 드립니다</h2>
    <p>진단 상담은 부담 없이 시작할 수 있습니다.</p>
    <a href="#apply" class="btn btn-coral">무료 상담 신청하기 →</a>
  </div>
</section>

${FOOTER}
${FLOATING}

<script>
function tog(b){b.classList.toggle('on');}
function pick(kind){return [].slice.call(document.querySelectorAll('.chips[data-kind="'+kind+'"] .chip.on')).map(function(b){return b.textContent.trim();}).join(', ')||'미선택';}
async function submitForm(){
  var name=document.getElementById('fName').value.trim();
  var contact=document.getElementById('fContact').value.trim();
  var school=document.getElementById('fSchool').value.trim();
  var msg=document.getElementById('fMsg').value.trim();
  var agree=document.getElementById('fAgree').checked;
  if(!name){alert('학생 이름을 입력해 주세요.');return;}
  if(!contact){alert('연락처를 입력해 주세요.');return;}
  if(!agree){alert('개인정보 수집 및 이용에 동의해 주세요.');return;}
  var btn=document.getElementById('fSubmit');
  btn.disabled=true;btn.textContent='전송 중...';
  try{
    var res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      name:name,contact:contact,school:school,message:msg,
      grade:pick('grade'),subject:pick('subject'),source:'채움클래스 홈페이지'
    })});
    var result=await res.json();
    if(result.ok){alert('상담 신청이 완료되었습니다!\\n빠르게 연락드리겠습니다.');btn.disabled=false;btn.textContent='📝 상담 신청하기';}
    else{throw new Error(result.error||'전송 실패');}
  }catch(e){
    alert('전송 중 오류가 발생했습니다.\\n전화(' + '${CFG.phone}' + ') 또는 카카오톡으로 문의해 주세요.');
    btn.disabled=false;btn.textContent='📝 상담 신청하기';
  }
}
// 숫자 카운트업
function countUp(el){var to=parseInt(el.getAttribute('data-to'));var v=el.querySelector('.v');var c=0;var t=setInterval(function(){c++;v.textContent=c;if(c>=to)clearInterval(t);},60);}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);io.unobserve(e.target);}});},{threshold:.4});
document.querySelectorAll('.num[data-to]').forEach(function(el){io.observe(el);});
</script>
</body></html>`;
}

/* ── 상담 메일 (Resend) ── */
async function handleContact(req, env) {
  const J = { "Content-Type": "application/json" };
  try {
    const d = await req.json();
    const { name, contact, school, message, grade, subject, source } = d;
    const html = `
      <div style="font-family:'Apple SD Gothic Neo',sans-serif;max-width:600px;margin:0 auto;background:#F8F6F1;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1C5C49,#0C2B23);padding:28px 32px;">
          <h1 style="color:#EC8164;margin:0;font-size:22px;">📝 새 상담 신청이 도착했습니다</h1>
          <p style="color:rgba(255,255,255,.65);margin:6px 0 0;font-size:13px;">${CFG.name} 홈페이지 상담 신청</p>
        </div>
        <div style="padding:28px 32px;background:#fff;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:100px;">학생 이름</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:700;color:#123F33;">${name || '-'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">연락처</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:700;color:#123F33;">${contact || '-'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">학교</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#123F33;">${school || '-'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">학년</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#123F33;">${grade || '-'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">희망 과목</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#123F33;">${subject || '-'}</td></tr>
            <tr><td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top;">문의 사항</td><td style="padding:10px 0;color:#123F33;line-height:1.6;">${message || '없음'}</td></tr>
          </table>
        </div>
        <div style="padding:16px 32px;background:#F8F6F1;font-size:12px;color:#aaa;text-align:center;">${CFG.name} · chaeumclass.com · ${CFG.phone}</div>
      </div>`;

    const apiKey = (env && env.RESEND_API_KEY) || (typeof RESEND_API_KEY !== "undefined" ? RESEND_API_KEY : "");
    if (!apiKey) {
      return new Response(JSON.stringify({ ok: false, error: "RESEND_API_KEY 환경변수가 설정되지 않았습니다. Cloudflare Workers 설정에서 추가해 주세요." }), { headers: J, status: 500 });
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CFG.mailFrom,
        to: CFG.mailTo,
        subject: "📝 [" + CFG.name + "] 새 상담 신청 - " + (name || "이름없음") + " (" + (grade || "") + ")",
        html
      })
    });
    if (res.ok) return new Response(JSON.stringify({ ok: true }), { headers: J, status: 200 });
    const err = await res.text();
    return new Response(JSON.stringify({ ok: false, error: "Resend " + res.status + ": " + err }), { headers: J, status: 500 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "서버 오류: " + e.message }), { headers: J, status: 500 });
  }
}

const ROBOTS = `User-agent: *
Allow: /
Sitemap: ${CFG.domain}/sitemap.xml`;

function SITEMAP() {
  let urls = `<url><loc>${CFG.domain}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`;
  CENTERS.forEach((c, i) => {
    urls += `<url><loc>${CFG.domain}/branch/${i}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
    (c.s||[]).forEach((s) => { if (SUBJ_SLUG[s]) urls += `<url><loc>${CFG.domain}/branch/${i}/${SUBJ_SLUG[s]}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`; });
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    const H = { "Content-Type": "text/html;charset=utf-8" };

    if (p === "/api/contact" && req.method === "POST") return handleContact(req, env);
    if (p === "/robots.txt") return new Response(ROBOTS, { headers: { "Content-Type": "text/plain" } });
    if (p === "/sitemap.xml") return new Response(SITEMAP(), { headers: { "Content-Type": "application/xml" } });
    if (p === "/favicon.ico") return new Response(null, { status: 204 });

    if (p.startsWith("/branch/")) {
      const parts = p.split("/");
      const idx = parseInt(parts[2], 10);
      const slug = parts[3];
      if (!isNaN(idx)) {
        const page = slug ? buildSubjectPage(idx, slug) : buildBranchPage(idx);
        if (page) return new Response(page, { headers: H });
      }
    }
    // 그 외 모든 경로는 홈으로 (단일 페이지 구성)
    return new Response(HOME(), { headers: H });
  }
};
