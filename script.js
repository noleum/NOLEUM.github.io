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
const headerEl = document.querySelector('.header');

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      const link = linkMap.get(id);
      if (!link) return;

      if (entry.isIntersecting) {
        // 네비 현재 위치 표시
        navLinks.forEach((l) => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');

        // 🔹 섹션이 밝은 섹션인지에 따라 헤더 테마 변경
        if (headerEl) {
          if (entry.target.classList.contains('section-light')) {
            headerEl.classList.add('header--light');
          } else {
            headerEl.classList.remove('header--light');
          }
        }
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
  if (!bar) return;
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
// 🔹 스크롤 리빌(.reveal-text / PLANNING / VENN / PILL)
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const options = { threshold: 0.25 };

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getPillDelay(el) {
    if (el.classList.contains('ph-pill--a')) return 250;
    if (el.classList.contains('ph-pill--b')) return 500;
    if (el.classList.contains('ph-pill--c')) return 550;
    return 0;
  }

  function animatePill(pill) {
    if (prefersReduced) {
      pill.style.opacity = '1';
      pill.style.transform = 'translate(-50%, -50%) scale(1)';
      pill.style.filter = 'none';
      return;
    }

    const delay = getPillDelay(pill);

    const landingAnim = pill.animate(
      [
        {
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.1)',
          filter: 'blur(6px)',
          boxShadow: '0 0 0 rgba(60, 60, 60, 0)',
          offset: 0,
        },
        {
          opacity: 0,
          transform: 'translate(-50%, -65%) scale(0.2)',
          filter: 'blur(6px)',
          boxShadow: '50px 10px 30px rgba(107, 107, 107, 0.14)',
          offset: 0.2,
        },
        {
          opacity: 0.8,
          transform: 'translate(-50%, -108%) scale(0.5)',
          filter: 'blur(4px)',
          boxShadow: '20px 30px 30px rgba(107, 107, 107, 0.14)',
          offset: 0.3,
        },
        {
          opacity: 1,
          transform: 'translate(-50%, -40%) scale(1.08)',
          filter: 'blur(1px)',
          boxShadow: '30px 40px 30px rgba(107, 107, 107, 0.14)',
          offset: 0.6,
        },
        {
          opacity: 1,
          transform: 'translate(-50%, -10%) scale(1)',
          filter: 'blur(0)',
          boxShadow: '98px 110px 30px rgba(107, 107, 107, 0.14)',
          offset: 0.65,
        },
        {
          opacity: 1,
          transform: 'translate(-50%, -30%) scale(1)',
          offset: 0.7,
        },
        {
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)',
          filter: 'blur(0)',
          boxShadow: 'var(--ph-shape-shadow)',
          offset: 1,
        },
      ],
      { duration: 1500, delay, fill: 'forwards' }
    );

    landingAnim.onfinish = () => {
      if (!pill.isConnected) return;

      pill.animate(
        [
          { transform: 'translate(-50%, -50%) scale(1)' },
          { transform: 'translate(-50%, -54%) scale(1)' },
          { transform: 'translate(-50%, -50%) scale(1)' },
          { transform: 'translate(-50%, -54%) scale(1)' },
          { transform: 'translate(-50%, -50%) scale(1)' },
        ],
        { duration: 2600, iterations: Infinity, easing: 'ease-in-out' }
      );
    };
  }

  const revealOnScroll = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('is-visible');

        if (el.classList.contains('ph-pill')) {
          animatePill(el);
        }
        observer.unobserve(el);
      }
    });
  };

  const observer = new IntersectionObserver(revealOnScroll, options);

  const intro = document.querySelector('.ph-text-section2');
  if (intro) observer.observe(intro);

  document.querySelectorAll('.info-box').forEach((box) => observer.observe(box));
  document.querySelectorAll('.reveal-text').forEach((item) => observer.observe(item));

  const vennTarget = document.querySelector('#planning-venn .venn-right');
  if (vennTarget) {
    const vennObserver = new IntersectionObserver(
      (entries, ob) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vennTarget.classList.add('is-active');
            ob.unobserve(vennTarget);
          }
        });
      },
      { threshold: 0.35 }
    );
    vennObserver.observe(vennTarget);
  }

  document.querySelectorAll('.ph-pill').forEach((pill) => observer.observe(pill));

  // =========================
  // 🔹 TEAM SCROLL (가로 휠 부드럽게)
  // =========================
  const teamScroll = document.querySelector('.team-scroll');

  if (teamScroll) {
    let targetScroll = teamScroll.scrollLeft;
    let isAnimating = false;

    function animateScroll() {
      if (!isAnimating) return;

      const current = teamScroll.scrollLeft;
      const diff = targetScroll - current;

      if (Math.abs(diff) < 0.5) {
        teamScroll.scrollLeft = targetScroll;
        isAnimating = false;
        return;
      }

      teamScroll.scrollLeft = current + diff * 0.15;
      requestAnimationFrame(animateScroll);
    }

    teamScroll.addEventListener(
      'wheel',
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();

          const speed = 1; // 속도 조절
          targetScroll += e.deltaY * speed;

          const maxScroll = teamScroll.scrollWidth - teamScroll.clientWidth;
          if (targetScroll < 0) targetScroll = 0;
          if (targetScroll > maxScroll) targetScroll = maxScroll;

          if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(animateScroll);
          }
        }
      },
      { passive: false }
    );
  }

  // =========================
  // PLANNING-VENN: 민속촌 / 박물관 토글
  // =========================
  const vennTabs = document.querySelectorAll('.venn-tab');
  const vennWordSets = document.querySelectorAll('.venn-words');
  const vennBox = document.querySelector('#planning-venn .venn-box');
  const vennToggle = document.querySelector('.venn-toggle-wrap');

  if (vennTabs.length && vennWordSets.length) {
    document.body.classList.add('pre-venn');
    vennTabs.forEach((t) => t.classList.remove('is-active'));

    vennWordSets.forEach((set) => {
      const name = set.getAttribute('data-name');
      set.classList.toggle('is-active', name === 'folk');
    });

    let firstClicked = false;

    if (vennBox) {
      const boxObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              vennBox.classList.add('is-active');
              if (vennToggle) vennToggle.classList.add('is-active');
              boxObserver.unobserve(vennBox);
            }
          });
        },
        { threshold: 0.2 }
      );
      boxObserver.observe(vennBox);
    }

    vennTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;

        if (!firstClicked) {
          firstClicked = true;
          document.body.classList.remove('pre-venn');
        }

        vennTabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        vennWordSets.forEach((set) => {
          const name = set.getAttribute('data-name');
          set.classList.toggle('is-active', name === target);
        });
      });
    });
  }

  // =========================
  // 팀 섹션 카드 클릭 → 링크 이동
  // =========================
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach((card) => {
    const url = card.getAttribute('data-link');
    if (!url) return;

    const photoWrap = card.querySelector('.team-photo-wrap');
    if (photoWrap) {
      photoWrap.style.cursor = 'pointer';
      photoWrap.addEventListener('click', () => window.open(url, '_blank'));
    }

    const overlay = card.querySelector('.team-photo-ig');
    if (overlay && overlay.tagName !== 'A') {
      overlay.style.cursor = 'pointer';
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(url, '_blank');
      });
    }
  });

  // =========================
  // ⭐ ORBIT → 개요텍스트 흐려지는 기능
  // =========================
  const planningOrbits = document.querySelector('.planning-orbits');

  if (planningOrbits) {
    planningOrbits.addEventListener('mouseenter', () => {
      document.body.classList.add('orbits-hover');
    });
    planningOrbits.addEventListener('mouseleave', () => {
      document.body.classList.remove('orbits-hover');
    });
  }

  // =========================
  // ⭐ MODELING PROCESS: 스크롤 리빌
  // =========================
  const processItems = document.querySelectorAll('#process .process-item');
  if (processItems.length) {
    const processObserver = new IntersectionObserver(
      (entries, ob) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          ob.unobserve(entry.target);
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    processItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 80}ms`;
      processObserver.observe(item);
    });
  }
}); // 🔚 DOMContentLoaded 끝

// =========================
// 🔹 GRAPH BAR 애니메이션
// =========================
(function () {
  const bars = Array.from(document.querySelectorAll('.bar'));
  if (!bars.length) return;

  const manualHeights = [280, 438, 718, 852];
  const manualWidth = '252px';

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function toMs(str) {
    if (!str) return 0;
    const s = String(str).trim().split(',')[0];
    if (s.endsWith('ms')) return parseFloat(s);
    if (s.endsWith('s')) return parseFloat(s) * 1000;
    return parseFloat(s) || 0;
  }

  function animateNumber(el, start, end, duration) {
    if (!el) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = Math.round(end);
      return;
    }

    const startTime = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = easeOutCubic(t);
      el.textContent = Math.round(start + (end - start) * eased);
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              const barEl = entry.target;
              const index = bars.indexOf(barEl);
              const shape = barEl.querySelector('.bar-shape');
              const numEl = barEl.querySelector('.bar-num');
              const dataVal = Number(barEl.getAttribute('data-value')) || 0;

              barEl.style.width = manualWidth;

              if (shape) {
                shape.style.height = `${manualHeights[index] || 200}px`;
                // 강제 리플로우
                /* eslint-disable no-unused-expressions */
                shape.offsetHeight;
                /* eslint-enable no-unused-expressions */
              }

              const baseDelay = 180;
              const stepDelay = 140;
              const staggerDelay = baseDelay + index * stepDelay;
              barEl.style.setProperty('--stagger', `${staggerDelay}ms`);

              if (shape) shape.style.transitionDelay = `${staggerDelay}ms`;
              barEl.classList.add('in-view');

              if (numEl && shape) {
                const cs = getComputedStyle(shape);
                const transDur = toMs(cs.transitionDuration) || 1600;
                const transDelay = toMs(cs.transitionDelay) || 0;

                if (
                  window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ) {
                  numEl.textContent = Math.round(dataVal);
                } else {
                  setTimeout(
                    () => animateNumber(numEl, 0, dataVal, transDur),
                    transDelay
                  );
                }
              }

              observer.unobserve(barEl);
            });
          },
          { threshold: 0.5, rootMargin: '0px 0px -20% 0px' }
        )
      : null;

  if (io) bars.forEach((b) => io.observe(b));
})();

// =========================
// 🔹 3D 마키 라이트박스
// =========================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.process-marquee').forEach((el) => {
    const src = el.getAttribute('data-img');
    if (!src) return;

    el.style.setProperty('--img', `url("${src}")`);

    const img = new Image();
    img.onload = () => {
      const ratio =
        img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 3;
      el.style.setProperty('--ratio', ratio);
    };
    img.src = src;
  });

  const overlay = document.createElement('div');
  overlay.className = 'pm-overlay';

  const bigImg = document.createElement('img');
  bigImg.alt = '';
  overlay.appendChild(bigImg);

  document.body.appendChild(overlay);

  function closeZoom() {
    overlay.classList.remove('is-active');
    bigImg.src = '';
    document.querySelectorAll('.process-track.freeze').forEach((t) => t.classList.remove('freeze'));
  }

  document.querySelectorAll('.pm-img').forEach((img) => {
    img.addEventListener('click', () => {
      const track = img.closest('.process-track');
      if (track) track.classList.add('freeze');
      bigImg.src = img.src;
      overlay.classList.add('is-active');
    });
  });

  overlay.addEventListener('click', closeZoom);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeZoom();
  });
});

// 섹션 테마에 따라 헤더 색 바꾸기
const header = document.querySelector(".header");
const themedSections = document.querySelectorAll("[data-section]");

const headerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const isLight = entry.target.classList.contains("section-light");
      if (isLight) {
        header.classList.add("header--light");
      } else {
        header.classList.remove("header--light");
      }
    });
  },
  {
    threshold: 0.3, // 섹션이 30% 정도 보일 때 전환
  }
);

themedSections.forEach((sec) => headerObserver.observe(sec));
