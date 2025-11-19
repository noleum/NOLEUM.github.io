(function(){
  const OVERLAY_ID = '__dev_grid_overlay__';
  const cfg = { count: 4, colorHex: 'FF0000', opacityPercent: 10, gutter: 50, margin: 150 };

  function hexToRgba(hex, alpha){
    hex = hex.replace('#','');
    if(hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
    return `rgba(${parseInt(hex.slice(0,2),16)},${parseInt(hex.slice(2,4),16)},${parseInt(hex.slice(4,6),16)},${alpha})`;
  }

  function toggleGrid(){
    const exist = document.getElementById(OVERLAY_ID);
    if (exist) return exist.remove();

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.style = `
      position: fixed;
      inset: 0;
      display: grid;
      grid-template-columns: repeat(${cfg.count}, 1fr);
      column-gap: ${cfg.gutter}px;
      padding-left: ${cfg.margin}px;
      padding-right: ${cfg.margin}px;
      pointer-events: none;
      z-index: 2147483646;
      box-sizing: border-box;
    `;
    const rgba = hexToRgba(cfg.colorHex, cfg.opacityPercent/100);
    for (let i = 0; i < cfg.count; i++){
      const col = document.createElement('div');
      col.style.background = rgba;
      overlay.appendChild(col);
    }
    document.body.appendChild(overlay);
  }

  // 키 바인딩 (새로고침 후에도 계속 작동)
  window.addEventListener("keydown", e=>{
    const cmd = e.metaKey || e.ctrlKey;
    if(cmd && e.altKey && e.key.toLowerCase() === "g"){
      e.preventDefault();
      toggleGrid();
    }
  });

})();
