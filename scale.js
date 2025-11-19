function applyScale() {
  const baseW = 2560;
  const baseH = 1440;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // 가로/세로 중 작은 비율로 페이지 전체 축소
  const scaleW = vw / baseW;
  const scaleH = vh / baseH;
  const scale = Math.min(scaleW, scaleH);

  const wrap = document.getElementById("scale-wrap");
  wrap.style.transform = `scale(${scale})`;

  // transform은 실제 요소 크기를 줄이지 않으므로,
  // 스케일 후에도 스크롤 생기게 전체 크기 보정
  wrap.style.width = baseW + "px";
  wrap.style.height = baseH + "px";
}

window.addEventListener("load", applyScale);
window.addEventListener("resize", applyScale);
