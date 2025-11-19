document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('promoVideo');
    if (!video) {
        console.error("Video element with ID 'promoVideo' not found.");
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 뷰포트에 50% 이상 보일 때
                if (video.paused) {
                    // **음소거 상태를 다시 확인**하고 재생 시도 (정책 우회)
                    video.muted = true; 
                    video.play().catch(error => {
                        console.warn("자동 재생이 차단되었습니다 (Autoplay Blocked). 에러:", error);
                        // 사용자에게 상호작용을 유도하는 UI 표시 등을 고려
                    });
                }
            } else {
                // 뷰포트를 벗어났을 때 정지
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, {
        rootMargin: '0px', 
        threshold: 0.5 // 영상이 50% 이상 보일 때 작동
    });

    observer.observe(video);
});