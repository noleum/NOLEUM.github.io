// 부드러운 스크롤(네비 클릭)
document.querySelectorAll('.nav__link').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // 접근성 보조: 포커스 이동
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll:true });
  });
});

// ScrollSpy: 현재 보이는 섹션에 nav 활성화
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
},{
  rootMargin: `-${headerH + 20}px 0px -60% 0px`,
  threshold: 0.4
});
document.querySelectorAll('section[data-section]').forEach(sec=>spy.observe(sec));

// 상단 진행바
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

// 키보드 네비게이션(선택)
addEventListener('keydown', (e)=>{
  if(!['PageDown','PageUp','ArrowDown','ArrowUp'].includes(e.key)) return;
  e.preventDefault();
  const sections = [...document.querySelectorAll('section[data-section]')];
  // 현재 섹션 인덱스 추정
  const y = window.scrollY + headerH + 1;
  const idx = sections.findIndex(s => s.offsetTop <= y && y < s.offsetTop + s.offsetHeight);
  let next = idx;
  if(e.key==='PageDown' || e.key==='ArrowDown') next = Math.min(sections.length-1, idx+1);
  if(e.key==='PageUp'   || e.key==='ArrowUp')   next = Math.max(0, idx-1);
  sections[next]?.scrollIntoView({behavior:'smooth', block:'start'});
});
