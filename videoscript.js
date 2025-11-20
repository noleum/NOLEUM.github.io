document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('promoVideo');
  const controls = document.getElementById('promoControls');
  const playBtn = document.getElementById('playBtn');
  const muteBtn = document.getElementById('muteBtn');
  const progressBar = document.getElementById('progressBar');

  if (!video) {
    console.error("Video element with ID 'promoVideo' not found.");
    return;
  }

  const FADE_DURATION = 1500; // ✅ 1.5초 페이드 (밀리초)

  // ============================
  // 🔊 볼륨 페이드 함수
  // ============================
  let volumeFadeFrame = null;

  function fadeVideoVolume(targetVolume, duration = FADE_DURATION, onDone) {
    if (!video) return;

    const startVolume = video.volume;
    const startTime = performance.now();
    const clampedTarget = Math.max(0, Math.min(1, targetVolume));

    if (volumeFadeFrame) {
      cancelAnimationFrame(volumeFadeFrame);
    }

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current =
        startVolume + (clampedTarget - startVolume) * progress;

      video.volume = current;

      if (progress < 1) {
        volumeFadeFrame = requestAnimationFrame(step);
      } else {
        volumeFadeFrame = null;
        if (onDone) onDone();
      }
    }

    volumeFadeFrame = requestAnimationFrame(step);
  }

  // 🔹 스크롤 위치에 따라 자동 재생 / 일시정지
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 뷰포트에 50% 이상 보일 때
          if (video.paused) {
            video.muted = true; // 자동재생 정책 우회용 (처음엔 무음)
            video.play().catch((error) => {
              console.warn("자동 재생이 차단되었습니다 (Autoplay Blocked). 에러:", error);
            });
          }
        } else {
          // 뷰포트를 벗어났을 때 정지 (🔊 1.5초 페이드 아웃 후 pause)
          if (!video.paused) {
            // 소리가 실제로 나고 있을 때만 페이드 아웃
            if (!video.muted && video.volume > 0.05) {
              fadeVideoVolume(0, FADE_DURATION, () => {
                video.pause();
              });
            } else {
              // 이미 음소거 상태거나 거의 0이면 그냥 바로 멈춤
              video.pause();
            }
          }
        }
      });
    },
    {
      rootMargin: '0px',
      threshold: 0.5, // 영상이 50% 이상 보일 때 작동
    }
  );

  observer.observe(video);

  // ============================
  // 🎛 커스텀 컨트롤 세팅
  // ============================
  if (!controls || !playBtn || !muteBtn || !progressBar) return;

  // 기본 브라우저 컨트롤 숨기기
  video.controls = false;

  // 컨트롤바는 항상 보이게 (CSS에서 .custom-controls 기본 display로)
  controls.classList.add('is-visible'); // 이 클래스 안 써도 되면 생략 가능

  /* ▶︎ 재생/일시정지 */
  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playBtn.textContent = '⏸';
    } else {
      video.pause();
      playBtn.textContent = '▶︎';
    }
  });

  /* 🔇 음소거 / 🔊 해제 (1.5초 페이드 인/아웃) */
  muteBtn.addEventListener('click', () => {
    // 현재가 "꺼진 상태"라고 판단: muted 이거나, 볼륨이 0에 가까움
    const isCurrentlyMuted = video.muted || video.volume < 0.05;

    if (isCurrentlyMuted) {
      // 🔊 켜기: 0 → 1로 페이드 인
      video.muted = false;
      video.volume = 0;
      fadeVideoVolume(1, FADE_DURATION);
      muteBtn.textContent = '🔊';
    } else {
      // 🔇 끄기: 현재 볼륨 → 0으로 페이드 아웃 후 muted 처리
      fadeVideoVolume(0, FADE_DURATION, () => {
        video.muted = true;
      });
      muteBtn.textContent = '🔇';
    }
  });

  /* 진행바 업데이트 */
  video.addEventListener('timeupdate', () => {
    if (!isNaN(video.duration) && video.duration > 0) {
      progressBar.value = (video.currentTime / video.duration) * 100;
    }
  });

  /* 진행바 드래그 → 영상 위치 이동 */
  progressBar.addEventListener('input', () => {
    if (!isNaN(video.duration) && video.duration > 0) {
      video.currentTime = (progressBar.value / 100) * video.duration;
    }
  });

  // 📌 최초 자동재생 시도 + 소리 ON 유도 (영상 위 첫 클릭 시 1.5초 페이드 인)
  video.play().catch(() => {
    // 첫 클릭에서 소리 On — 단, 영상 위에서만 작동
    video.addEventListener(
      'click',
      () => {
        // 처음엔 무조건 페이드 인으로 켜주기
        video.muted = false;
        video.volume = 0;
        video.play().catch(() => {});
        fadeVideoVolume(1, FADE_DURATION);
        muteBtn.textContent = '🔊';
      },
      { once: true }
    );
  });

  // 초기값: 자동재생 구간에서는 무음 재생을 가정
  video.volume = 1; // 기본 볼륨(페이드 인/아웃 기준치)
});
