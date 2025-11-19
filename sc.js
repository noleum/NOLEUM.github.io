    pill.animate(
      [
        {
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.7)',
          filter: 'blur(6px)',
          boxShadow: '0 0 0 rgba(60, 60, 60, 0)',
          offset: 0,
          easing: 'cubic-bezier(.2, .6, .82, 1)',
        },
        // 0% – 멀리 위, 작고 흐릿
        {
          opacity: 0,
          transform: 'translate(-50%, -95%) scale(0.7)',
          filter: 'blur(6px)',
          boxShadow: '0 0 0 rgba(60, 60, 60, 0)',
          offset: 0.1,
          easing: 'cubic-bezier(.2, .6, .82, 1)',
        },
        // 18% – 위로 더 슈욱 올라가며 가속
        {
          opacity: 0.8,
          transform: 'translate(-50%, -108%) scale(0.8)',
          filter: 'blur(4px)',
          offset: 0.25,
          easing: 'cubic-bezier(1, 0, .89, 1)',
        },
        // 38% – 앞으로 확 다가오면서 거의 최전방 – 살짝 크게
        {
          opacity: 1,
          transform: 'translate(-50%, -42%) scale(1.08)',
          filter: 'blur(1px)',
          boxShadow: '0 22px 42px rgba(75, 75, 75, 0.35)',
          offset: 0.45,
          easing: 'cubic-bezier(1, 1, 1, 1)',
        },
        // 55% – 바닥에 “텅” 닿으면서 눌리는 구간
        {
          opacity: 1,
          transform: 'translate(-50%, -40%) scale(1.2)',
          filter: 'blur(0)',
          boxShadow: '0 20px 38px rgba(97, 97, 97, 0.28)',
          offset: 0.55,
          easing: 'cubic-bezier(1, 1, 1, 1)',
        },
        // 72% – 한 번 통! 튕겨 올라감
        {
          opacity: 1,
          transform: 'translate(-50%, -45%) scale(1)',
          boxShadow: '0 24px 44px rgba(90, 90, 90, 0.32)',
          offset: 0.60,
          easing: 'cubic-bezier(.16, .82, .28, 1)',
        },
        // 100% – 제자리에서 안정
        {
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)',
          filter: 'blur(0)',
          boxShadow: 'var(--ph-shape-shadow)',
          offset: 1,
          easing: 'cubic-bezier(1, .9, .3, .1)',
        },
      ],
      {
        duration: 1500,
        delay,
        fill: 'forwards',
      }
    );