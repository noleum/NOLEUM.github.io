function applyViewportScale() {
  const designWidth = 2710;      
  const visibleWidth = 2560;     

  const windowWidth = window.innerWidth;

  const scale = windowWidth / visibleWidth;

  const wrap = document.getElementById("scale-wrap");

  wrap.style.transform = `scale(${scale})`;
  wrap.style.transformOrigin = "top left";

  wrap.style.left = "0px";
}

window.addEventListener("load", applyViewportScale);
window.addEventListener("resize", applyViewportScale);
