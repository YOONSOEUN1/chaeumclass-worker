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
  phone: "010-0000-0000",            // 전화 상담 번호
  phoneTel: "01000000000",           // tel: 링크용 (숫자만)
  kakaoUrl: "https://pf.kakao.com/", // 카카오톡 채널 주소
  naverFormUrl: "",                  // 네이버 폼(없으면 빈칸 → 버튼 숨김)
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
    <a href="#visit">오시는 길</a>
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
  <p>${CFG.address} · ${CFG.hours}</p>
  <p>© ${new Date().getFullYear()} ${CFG.name}. All Rights Reserved.</p>
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
<title>${CFG.name} | ${CFG.tagline} · 초·중·고 학습코칭 학원</title>
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
      <div class="hstat"><div class="num" data-to="12"><span class="v">0</span><span class="u">학년</span></div><div class="lab">초1 ~ 고3 전 학년</div></div>
      <div class="hstat"><div class="num" data-to="4"><span class="v">0</span><span class="u">단계</span></div><div class="lab">진단·설계·코칭·관리</div></div>
      <div class="hstat"><div class="num">1:1</div><div class="lab">개별 맞춤 코칭</div></div>
    </div>
  </div>
</header>

<!-- WHY -->
<section id="why">
  <div class="inner head-center">
    <span class="eyebrow">Why ${CFG.name}</span>
    <h2 class="title">왜 <span class="hl">${CFG.name}</span>일까요?</h2>
    <p class="lead">문제만 풀리는 학원이 아니라, 공부하는 방법과 습관까지 채워주는 학습코칭 학원입니다.</p>
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

<!-- VISIT -->
<section id="visit">
  <div class="inner">
    <div class="head-center">
      <span class="eyebrow">Visit</span>
      <h2 class="title">오시는 길</h2>
    </div>
    <div class="visit-grid">
      <div class="visit-info">
        <div class="vi"><span class="vic">📍</span><div><div class="vk">주소</div><div class="vv">${CFG.address}</div></div></div>
        <div class="vi"><span class="vic">📞</span><div><div class="vk">전화</div><div class="vv"><a href="tel:${CFG.phoneTel}" style="color:#fff;text-decoration:none;">${CFG.phone}</a></div></div></div>
        <div class="vi"><span class="vic">🕒</span><div><div class="vk">운영·상담 시간</div><div class="vv">${CFG.hours}</div></div></div>
        <div class="vi"><span class="vic">💬</span><div><div class="vk">카카오톡</div><div class="vv"><a href="${CFG.kakaoUrl}" target="_blank" rel="noopener" style="color:#fff;text-decoration:none;">채널 바로가기 →</a></div></div></div>
      </div>
      <div class="visit-map">[지도 영역] 카카오/네이버 지도 임베드 코드를<br>여기에 넣어주세요</div>
    </div>
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
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${CFG.domain}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
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

    // 그 외 모든 경로는 홈으로 (단일 페이지 구성)
    return new Response(HOME(), { headers: H });
  }
};
