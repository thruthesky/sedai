/**
 * Hot Reload Development Server
 *
 * 파일 변경을 감지하여 브라우저를 자동으로 새로고침합니다.
 * - CSS 파일: Hot Swap (전체 리로드 없이 CSS만 갱신)
 * - 기타 파일: 전체 페이지 리로드
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const chokidar = require('chokidar');

// 설정
const PORT = process.env.PORT || 8000;

const app = express();

// 정적 파일 서빙 (현재 디렉토리)
app.use(express.static('./'));

// HTTP 서버 생성
const server = http.createServer(app);

// Socket.IO 서버 (CORS 허용)
const io = new Server(server, {
    cors: { origin: true, credentials: true },
});

// 상태 체크 엔드포인트
app.get('/health', (_, res) => res.send('ok'));

// 감시 대상 경로
const WATCH_PATHS = [
    './assets',
    './specs',
    './*.html',
];

// 무시 목록
const IGNORED = [
    '**/.git/**',
    '**/node_modules/**',
    '**/vendor/**',
    '**/.*',  // 숨김 파일
    '**/dist/**',
];

// 디바운스 타이머
let timer = null;
function debounced(fn, delay = 200) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, delay);
}

// CSS 파일 체크
const CSS_EXT = new Set(['.css']);
function isCssFile(file) {
    return CSS_EXT.has(path.extname(file).toLowerCase());
}

// 파일 감시 시작
console.log('🔍 Starting file watcher...');
chokidar.watch(WATCH_PATHS, {
    ignoreInitial: true,
    ignored: IGNORED,
}).on('all', (event, file) => {
    console.log(`📝 ${event}: ${file}`);

    // CSS 파일만 변경된 경우: CSS Hot Swap
    if (isCssFile(file)) {
        debounced(() => {
            io.emit('css', { file });
            console.log('   → CSS hot swap');
        });
        return;
    }

    // 그 외 파일 변경: 전체 리로드
    debounced(() => {
        io.emit('reload');
        console.log('   → Full reload');
    });
});

// 클라이언트 연결 이벤트
io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// 서버 시작
server.listen(PORT, () => {
    console.log('\n🚀 Hot Reload Development Server');
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Socket: http://localhost:${PORT} (Socket.IO)`);
    console.log('\n📁 Watching for changes in:');
    WATCH_PATHS.forEach(p => console.log(`   • ${p}`));
    console.log('\n💡 Open http://localhost:' + PORT + ' in your browser');
    console.log('   Changes will be reflected automatically.\n');
});
