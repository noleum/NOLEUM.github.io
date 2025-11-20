document.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgmAudio");
  const bgmBtn = document.getElementById("bgmToggle");
  const video = document.getElementById("promoVideo");

  if (!bgm || !bgmBtn) {
    console.warn("[BGM] bgmAudio 또는 bgmToggle 요소를 찾을 수 없음");
    return;
  }

  // ===== 상수 & 상태값 =====
  const BGM_MAX_VOLUME = 0.3; // 배경음 최종 볼륨
  let bgmDesired = true;      // 사용자가 "BGM 켜두고 싶다/끄고 싶다"
  let scrollTriggered = false; // 첫 스크롤 여부

  // ===== 공통: 오디오 페이드 함수 =====
  function fadeAudio(audio, targetVolume, duration = 500, pauseWhenZero = false) {
    if (!audio) return;

    const startVolume = audio.volume;
    const startTime = performance.now();
    const clampedTarget = Math.max(0, Math.min(1, targetVolume));

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current =
        startVolume + (clampedTarget - startVolume) * progress;

      audio.volume = Math.max(0, Math.min(1, current));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // 완전히 0까지 내려왔고, 필요하면 일시정지
        if (pauseWhenZero && clampedTarget === 0) {
          audio.pause();
        }
      }
    }

    requestAnimationFrame(step);
  }

  // 현재 영상이 '소리가 나는 상태'인지 체크
  function isVideoAudible() {
    if (!video) return false;
    return !video.paused && !video.muted && video.volume > 0;
  }

  // 버튼 모양/aria 상태 갱신
  function updateBgmButton() {
    const isOn =
      !bgm.paused &&
      bgmDesired &&
      !isVideoAudible() &&
      bgm.volume > 0.05;

    bgmBtn.textContent = isOn ? "🔊" : "🔈";
    bgmBtn.setAttribute("aria-pressed", isOn ? "true" : "false");
    bgmBtn.setAttribute(
      "aria-label",
      isOn ? "배경 음악 끄기" : "배경 음악 켜기"
    );
  }

  // BGM 재생 시도 (조건 맞을 때만, 페이드 인 포함)
  function tryPlayBgm() {
    if (!bgmDesired) return;        // 사용자가 끈 상태면 재생 X
    if (isVideoAudible()) return;   // 영상에서 이미 소리 나오면 재생 X

    // 이미 재생 중이면 볼륨만 서서히 올려줌
    if (!bgm.paused) {
      fadeAudio(bgm, BGM_MAX_VOLUME, 1500);
      return;
    }

    bgm.volume = 0;
    const p = bgm.play();
    if (p && typeof p.then === "function") {
      p
        .then(() => {
          fadeAudio(bgm, BGM_MAX_VOLUME, 1500);
        })
        .catch((err) => {
          console.warn("[BGM] 재생 실패 (브라우저 정책 등):", err);
        });
    }
  }

  // 영상 상태에 따라 BGM을 부드럽게 멈추거나 다시 재생
  function syncWithVideo() {
    if (isVideoAudible()) {
      // 🎬 영상에서 소리가 나기 시작/나는 중 → BGM 페이드 아웃
      if (!bgm.paused && bgm.volume > 0) {
        fadeAudio(bgm, 0, 1500, true); // 0까지 내리고 나면 pause
      } else {
        bgm.pause();
      }
    } else {
      // ⏸ 영상이 멈췄거나 음소거 → 사용자가 BGM을 원할 때만 페이드 인
      tryPlayBgm();
    }
    updateBgmButton();
  }

  // ✅ 첫 스크롤에서 한 번 BGM 재생 시도 (페이드 인)
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTriggered) return;
      scrollTriggered = true;
      tryPlayBgm();
    },
    { passive: true }
  );

  // ✅ 오른쪽 하단 버튼으로 BGM 온/오프 (페이드 아웃/인)
  bgmBtn.addEventListener("click", () => {
    bgmDesired = !bgmDesired;

    if (!bgmDesired) {
      // 사용자가 "끄기"를 누른 경우 → 페이드 아웃 후 정지
      if (!bgm.paused && bgm.volume > 0) {
        fadeAudio(bgm, 0, 1500, true);
      } else {
        bgm.pause();
      }
    } else {
      // 다시 켠 경우 → 영상 소리 안 나면 페이드 인
      tryPlayBgm();
    }

    updateBgmButton();
  });

  // ✅ 동영상 이벤트에 따라 BGM 자동 동기화 (전환 시 페이드)
  if (video) {
    ["play", "pause", "volumechange", "ended"].forEach((ev) => {
      video.addEventListener(ev, syncWithVideo);
    });
  }

  // ✅ BGM이 재생/정지될 때 버튼 상태 반영
  bgm.addEventListener("play", updateBgmButton);
  bgm.addEventListener("pause", updateBgmButton);

  // 초기 설정
  bgm.volume = BGM_MAX_VOLUME; // 기본 볼륨
  updateBgmButton();
});
