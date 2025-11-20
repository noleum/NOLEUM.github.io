document.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgmAudio");
  const bgmBtn = document.getElementById("bgmToggle");
  const video = document.getElementById("promoVideo");

  if (!bgm || !bgmBtn) {
    console.warn("[BGM] bgmAudio 또는 bgmToggle 요소를 찾을 수 없음");
    return;
  }

  // ===== 상수 & 상태값 =====
  const BGM_MAX_VOLUME = 0.3;     
  const FADE_IN_DURATION = 3000;   // 💛 페이드 인: 2초
  const FADE_OUT_DURATION = 1000;  // 💙 페이드 아웃: 1초
  let bgmDesired = true;           
  let audioUnlocked = false;       

  // ===== 공통: 오디오 페이드 함수 =====
  function fadeAudio(audio, targetVolume, duration, pauseWhenZero = false) {
    if (!audio) return;

    const startVolume = audio.volume;
    const startTime = performance.now();
    const to = Math.max(0, Math.min(1, targetVolume));

    function step(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const curr = startVolume + (to - startVolume) * p;

      audio.volume = Math.max(0, Math.min(1, curr));

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        if (pauseWhenZero && to === 0) audio.pause();
      }
    }

    requestAnimationFrame(step);
  }

  function isVideoAudible() {
    if (!video) return false;
    return !video.paused && !video.muted && video.volume > 0;
  }

  function updateBgmButton() {
    const isOn =
      !bgm.paused &&
      bgmDesired &&
      !isVideoAudible() &&
      bgm.volume > 0.05;

    bgmBtn.textContent = isOn ? "🔊" : "🔈";
    bgmBtn.setAttribute("aria-pressed", isOn ? "true" : "false");
  }

  // 🎵 BGM 재생 시도 — 페이드 인(2초)
  function tryPlayBgm() {
    if (!bgmDesired) return;
    if (isVideoAudible()) return;
    if (!audioUnlocked) return;

    if (!bgm.paused) {
      fadeAudio(bgm, BGM_MAX_VOLUME, FADE_IN_DURATION);
      return;
    }

    bgm.volume = 0;
    const p = bgm.play();
    if (p && typeof p.then === "function") {
      p
        .then(() => fadeAudio(bgm, BGM_MAX_VOLUME, FADE_IN_DURATION))
        .catch((err) => console.warn("[BGM] 재생 실패:", err));
    }
  }

  // 🎥 영상에 따라 BGM 조절
  function syncWithVideo() {
    if (isVideoAudible()) {
      // 영상 소리 시작 → BGM 페이드 아웃(1초)
      if (!bgm.paused && bgm.volume > 0) {
        fadeAudio(bgm, 0, FADE_OUT_DURATION, true);
      } else bgm.pause();
    } else {
      tryPlayBgm();
    }
    updateBgmButton();
  }

  // 🔓 첫 유저 제스처에서 한 번만 BGM 시작 시도
  function unlockAudioOnce() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    if (!bgmDesired) return;
    if (isVideoAudible()) return;

    bgm.volume = 0;
    const p = bgm.play();
    if (p && typeof p.then === "function") {
      p
        .then(() => fadeAudio(bgm, BGM_MAX_VOLUME, FADE_IN_DURATION))
        .catch((err) => console.warn("[BGM] 최초 재생 실패:", err));
    }
    updateBgmButton();
  }

  // 유저 행동으로 unlock
  ["click", "wheel", "keydown", "touchstart"].forEach((ev) => {
    window.addEventListener(ev, unlockAudioOnce, { once: true, passive: true });
  });

  // 🔊 토글 버튼 누를 때
  bgmBtn.addEventListener("click", () => {
    if (!audioUnlocked) audioUnlocked = true;

    const isOnNow =
      !bgm.paused &&
      !isVideoAudible() &&
      bgm.volume > 0.05;

    if (isOnNow) {
      // 끄기 → 페이드 아웃(1초)
      bgmDesired = false;
      fadeAudio(bgm, 0, FADE_OUT_DURATION, true);
    } else {
      // 켜기 → 페이드 인(2초)
      bgmDesired = true;
      tryPlayBgm();
    }

    updateBgmButton();
  });

  // 영상 이벤트 → BGM 전환
  if (video) {
    ["play", "pause", "volumechange", "ended"].forEach((ev) => {
      video.addEventListener(ev, syncWithVideo);
    });
  }

  bgm.addEventListener("play", updateBgmButton);
  bgm.addEventListener("pause", updateBgmButton);

  // 초기 설정
  bgm.volume = BGM_MAX_VOLUME;
  updateBgmButton();
});
