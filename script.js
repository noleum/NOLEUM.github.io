// =========================
// 🔹 네비게이션 스크롤 & ScrollSpy
// =========================
document.querySelectorAll('.nav__link').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

const navLinks = [...document.querySelectorAll('.nav__link')];
const linkMap = new Map(navLinks.map((l) => [l.getAttribute('href').slice(1), l]));
const headerH =
  parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      const link = linkMap.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');
      }
    });
  },
  { rootMargin: `-${headerH + 20}px 0px -60% 0px`, threshold: 0.4 }
);

document.querySelectorAll('section[data-section]').forEach((sec) => spy.observe(sec));

// =========================
// 🔹 진행바
// =========================
const bar = document.getElementById('progress');
function setProgress() {
  const h = document.documentElement;
  const scrollTop = h.scrollTop || document.body.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  const p = max ? (scrollTop / max) * 100 : 0;
  bar.style.width = p + '%';
}
addEventListener('scroll', setProgress, { passive: true });
addEventListener('resize', setProgress);
setProgress();

// =========================
// 🔹 TEAM 슬라이더
// =========================
const data = [
  { name: '이태형', role: 'PROGRAMMER', mail: 'leetaehyung@naver.com', bg: '#555' },
  { name: '이태형', role: 'DESIGNER', mail: 'leetaehyung@naver.com', bg: '#374056' },
  { name: '이태형', role: 'PLANNER', mail: 'leetaehyung@naver.com', bg: '#756565ff' },
  { name: '이태형', role: '3D ARTIST', mail: 'leetaehyung@naver.com', bg: '#697565ff' },
  { name: '이태형', role: 'PROGRAMMER', mail: 'leetaehyung@naver.com', bg: '#645d71ff' },
  { name: '이태형', role: 'DESIGNER', mail: 'leetaehyung@naver.com', bg: '#674968ff' },
  { name: '이태형', role: 'PLANNER', mail: 'leetaehyung@naver.com', bg: '#677d83ff' }
];

const stage = document.querySelector('#team .stage');
const card = stage.querySelector('.card');
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
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') go(index + 1);
  if (e.key === 'ArrowLeft') go(index - 1);
});

// 초기 렌더
render(0, 'left');

// ======== 아래 "중복 블록"은 반드시 삭제하세요 ========
// - 'data.forEach((_,i)=>{ ... });' 로 도트 또 만드는 블록
// - let i=0; 로 다시 상태 만들고, render/go 다시 정의하는 블록
// - prev/next/keydown 또 추가하는 블록
// - render(i); 다시 호출하는 블록


// =========================
// 🔹 DESIGN HERO (스크롤 시 이미지/글 전환)
// =========================

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#design-hero');
  if (!root) return;

  const slides = [...root.querySelectorAll('.sh-slide')];
  const dotsWrap = root.querySelector('.sh-dots');
  dotsWrap.innerHTML = slides.map(() => '<i></i>').join('');
  const dots = [...dotsWrap.querySelectorAll('i')];
  let current = 0;

  function setIndex(i) {
    const idx = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
    dots.forEach((d, k) => d.classList.toggle('is-on', k === idx));
  }

  // 🔑 스크롤 계산 (정확한 비율 계산)
  function getIndex() {
    const rect = root.getBoundingClientRect();
    const visible = Math.min(window.innerHeight, Math.max(0, window.innerHeight - Math.abs(rect.top)));
    const progress = 1 - (rect.bottom - window.innerHeight) / (root.offsetHeight - window.innerHeight);
    return Math.max(0, Math.min(slides.length - 1, Math.round(progress * (slides.length - 1))));
  }

  let raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const newIndex = getIndex();
      if (newIndex !== current) {
        current = newIndex;
        setIndex(current);
      }
    });
  }

  // 초기화
  setIndex(0);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
});
