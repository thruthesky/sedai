/**
 * Hot Reload Client Script
 *
 * 서버에서 전송하는 파일 변경 이벤트를 받아서
 * 브라우저를 자동으로 새로고침하거나 CSS를 갱신합니다.
 */

(() => {
    // 개발 환경에서만 실행
    const isDevelopment = window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1';

    if (!isDevelopment) {
        console.log('[Hot Reload] Disabled (not in development environment)');
        return;
    }

    // Socket.IO 서버 URL (개발 서버와 동일한 호스트)
    const hotReloadUrl = `http://${window.location.hostname}:${window.location.port || 8000}`;

    console.log('[Hot Reload] Connecting to:', hotReloadUrl);

    // Socket.IO CDN이 로드되지 않은 경우 스크립트 동적 로드
    if (typeof io === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
        script.onload = () => connectToServer();
        document.head.appendChild(script);
    } else {
        connectToServer();
    }

    function connectToServer() {
        const socket = io(hotReloadUrl, {
            transports: ['websocket', 'polling'],
            withCredentials: false
        });

        socket.on('connect', () => {
            console.log('[Hot Reload] ✅ Connected:', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.warn('[Hot Reload] ⚠️ Connection error:', error.message);
        });

        socket.on('disconnect', () => {
            console.log('[Hot Reload] ❌ Disconnected');
        });

        // CSS 파일만 갱신 (Hot Swap)
        socket.on('css', ({ file }) => {
            console.log('[Hot Reload] 🎨 CSS updated:', file);

            let matched = false;
            const fileName = file.split('/').pop();

            // 변경된 CSS 파일만 리로드
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const href = link.getAttribute('href') || '';
                if (href.includes(fileName)) {
                    const url = new URL(link.href, location.origin);
                    url.searchParams.set('v', Date.now().toString());
                    link.href = url.toString();
                    matched = true;
                }
            });

            // 매칭 실패 시 모든 CSS 리프레시
            if (!matched) {
                document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                    const url = new URL(link.href, location.origin);
                    url.searchParams.set('v', Date.now().toString());
                    link.href = url.toString();
                });
            }
        });

        // 전체 페이지 리로드
        socket.on('reload', () => {
            console.log('[Hot Reload] 🔄 Reloading page...');
            location.reload();
        });
    }
})();
