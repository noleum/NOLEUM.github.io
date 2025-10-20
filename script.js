// ======== 위쪽(스크롤/네비/프로그레스 등) 기존 코드 그대로 두세요 ========
// 부드러운 스크롤(네비 클릭)
document.querySelectorAll('.nav__link').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll:true });
  });
});

// ScrollSpy
const navLinks = [...document.querySelectorAll('.nav__link')];
const linkMap = new Map(navLinks.map(l => [l.getAttribute('href').slice(1), l]));
const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
const spy = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const id = entry.target.id;
    const link = linkMap.get(id);
    if(!link) return;
    if(entry.isIntersecting){
      navLinks.forEach(l=>l.removeAttribute('aria-current'));
      link.setAttribute('aria-current','page');
    }
  });
},{ rootMargin: `-${headerH + 20}px 0px -60% 0px`, threshold: 0.4 });
document.querySelectorAll('section[data-section]').forEach(sec=>spy.observe(sec));

// 진행바
const bar = document.getElementById('progress');
function setProgress(){
  const h = document.documentElement;
  const scrollTop = h.scrollTop || document.body.scrollTop;
  const max = (h.scrollHeight - h.clientHeight);
  const p = max ? (scrollTop / max) * 100 : 0;
  bar.style.width = p + '%';
}
addEventListener('scroll', setProgress, {passive:true});
addEventListener('resize', setProgress);
setProgress();

// 키보드 페이지 이동
addEventListener('keydown', (e)=>{
  if(!['PageDown','PageUp','ArrowDown','ArrowUp'].includes(e.key)) return;
  e.preventDefault();
  const sections = [...document.querySelectorAll('section[data-section]')];
  const y = window.scrollY + headerH + 1;
  const idx = sections.findIndex(s => s.offsetTop <= y && y < s.offsetTop + s.offsetHeight);
  let next = idx;
  if(e.key==='PageDown' || e.key==='ArrowDown') next = Math.min(sections.length-1, idx+1);
  if(e.key==='PageUp'   || e.key==='ArrowUp')   next = Math.max(0, idx-1);
  sections[next]?.scrollIntoView({behavior:'smooth', block:'start'});
});


// ======== 여기부터 TEAM 슬라이더: "한 벌"만 남깁니다 ========

// 슬라이드 데이터 (원하는 만큼 추가)
const data = [
  { name:'이태형', role:'PROGRAMMER', mail:'leetaehyung@naver.com', bg:'#555' },
  { name:'이태형', role:'DESIGNER',    mail:'leetaehyung@naver.com', bg:'#374056' },
  { name:'이태형', role:'PLANNER',     mail:'leetaehyung@naver.com', bg:'#756565ff' },
  { name:'이태형', role:'3D ARTIST',   mail:'leetaehyung@naver.com', bg:'#697565ff' },
  { name:'이태형', role:'PROGRAMMER',  mail:'leetaehyung@naver.com', bg:'#645d71ff' },
  { name:'이태형', role:'DESIGNER',    mail:'leetaehyung@naver.com', bg:'#674968ff' },
  { name:'이태형', role:'PLANNER',     mail:'leetaehyung@naver.com', bg:'#677d83ff' }
];

const stage  = document.querySelector('#team .stage');
const card   = stage.querySelector('.card');
const nameEl = card.querySelector('.name');
const roleEl = card.querySelector('.role');
const mailEl = card.querySelector('.mail');

const prevBtn = document.querySelector('#team .prev');
const nextBtn = document.querySelector('#team .next');
const dotsBox = document.querySelector('#team .dots');

// --- 도트 생성: data.length 개로 "단 한 번"만 만든다.
dotsBox.innerHTML = ''; // 중복 방지
const dots = [];
for (let i = 0; i < data.length; i++) {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `${i + 1}번`);
  if (i === 0) dot.setAttribute('aria-current', 'true');
  dot.addEventListener('click', () => go(i));
  dotsBox.appendChild(dot);
  dots.push(dot);
}

// 상태
let index = 0;

// 렌더
function render(i, dir = 'left') {
  const item = data[i];
  nameEl.textContent = item.name;
  roleEl.textContent = item.role;
  mailEl.textContent = item.mail;
  mailEl.href = `mailto:${item.mail}`;
  card.style.background = item.bg;

  // 애니메이션
  card.classList.remove('slide-left', 'slide-right');
  void card.offsetWidth; // reflow
  card.classList.add(dir === 'left' ? 'slide-left' : 'slide-right');

  // 도트 상태
  dots.forEach((d, k) => {
    if (k === i) d.setAttribute('aria-current', 'true');
    else d.removeAttribute('aria-current');
  });
}

// 이동
function go(newIndex) {
  if (newIndex === index) return;
  const dir = newIndex > index ? 'left' : 'right';
  index = (newIndex + data.length) % data.length;
  render(index, dir);
}

// 버튼/키보드
prevBtn.addEventListener('click', () => go(index - 1));
nextBtn.addEventListener('click', () => go(index + 1));
document.addEventListener('keydown', (e)=>{
  if (e.key === 'ArrowRight') go(index + 1);
  if (e.key === 'ArrowLeft')  go(index - 1);
});

// 초기 렌더
render(0, 'left');


// ======== 아래 "중복 블록"은 반드시 삭제하세요 ========
// - 'data.forEach((_,i)=>{ ... });' 로 도트 또 만드는 블록
// - let i=0; 로 다시 상태 만들고, render/go 다시 정의하는 블록
// - prev/next/keydown 또 추가하는 블록
// - render(i); 다시 호출하는 블록
