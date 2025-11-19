function applyViewportScale() {
  const designWidth = 2710;      // 실제 전체 디자인 폭
  const visibleWidth = 2560;     // 보여줄 기준 폭

  const windowWidth = window.innerWidth;

  // 2560 기준 스케일 계산
  const scale = windowWidth / visibleWidth;

  const wrap = document.getElementById("scale-wrap");

  wrap.style.transform = `scale(${scale})`;
  wrap.style.transformOrigin = "top left";

  // 🔥 왼쪽이 너무 잘리니까 오른쪽으로 75px 이동
  wrap.style.left = "0px";
}

window.addEventListener("load", applyViewportScale);
window.addEventListener("resize", applyViewportScale);
