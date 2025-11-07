---
name: sedaiweb-development-run
version: 1.0.0
description: SEDAI 웹 애플리케이션 로컬 개발 환경 설정 및 Hot Reload 구현
author: Song Jaeho
email: thruthesky@gmail.com
license: MIT
step: 17
dependencies: sedaiweb-firebase-setup, sedaiweb-firebase-security
---

## 개요

본 명세는 SEDAI 웹 애플리케이션을 로컬 개발 환경에서 실행하고, Hot Reload 기능을 구현하는 방법을 정의합니다.

**주요 기능:**
- Node.js 기반 개발 서버
- 파일 변경 감지 (chokidar)
- 실시간 브라우저 자동 새로고침 (Socket.IO)
- CSS Hot Swap (전체 리로드 없이 CSS만 갱신)
- Firebase App Check 디버그 토큰 지원

**기술 스택:**
- Node.js (Express)
- Socket.IO (실시간 통신)
- Chokidar (파일 감시)

## 요구사항

### 시스템 요구사항
- Node.js >= 14.0.0
- npm >= 6.0.0
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)

### 프로젝트 구조
```
sedai-homepage/
├── server.js                    # Hot reload 서버
├── package.json                 # NPM 설정
├── assets/
│   └── js/
│       └── hot-reload.js        # 클라이언트 스크립트
├── *.html                       # HTML 파일들
└── specs/                       # 명세 문서들
```

## 워크플로우

1. Node.js 패키지 설치 (chokidar, socket.io, express)
2. Hot reload 서버 구현 (server.js)
3. 클라이언트 스크립트 작성 (hot-reload.js)
4. package.json에 dev 스크립트 추가
5. HTML 파일에 hot-reload.js 포함
6. 개발 서버 실행 및 테스트

## 상세 단계

### 단계 1: Node.js 패키지 설치

프로젝트 루트 디렉토리에서 필요한 패키지를 설치합니다:

```bash
cd sedai-homepage
npm init -y  # package.json이 없는 경우
npm install --save-dev chokidar socket.io express
```

**설치되는 패키지:**
- `chokidar`: 파일 시스템 변경 감지
- `socket.io`: 실시간 양방향 통신
- `express`: HTTP 서버

**예상 결과:**
```
package.json에 다음 의존성 추가:
{
  "devDependencies": {
    "chokidar": "^3.x.x",
    "socket.io": "^4.x.x",
    "express": "^4.x.x"
  }
}
```

### 단계 2: Hot Reload 서버 구현

프로젝트 루트에 `server.js` 파일을 생성합니다:

**파일: `server.js`**
```javascript
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
```

**주요 기능:**
- Express로 정적 파일 서빙
- Socket.IO로 클라이언트와 실시간 통신
- Chokidar로 파일 변경 감지
- CSS 파일은 Hot Swap, 나머지는 전체 리로드

### 단계 3: 클라이언트 스크립트 작성

`assets/js/hot-reload.js` 파일을 생성합니다:

**파일: `assets/js/hot-reload.js`**
```javascript
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
```

**주요 기능:**
- 개발 환경 자동 감지
- Socket.IO CDN 동적 로드
- CSS Hot Swap (캐시 버스팅)
- 전체 페이지 리로드

### 단계 4: package.json에 dev 스크립트 추가

`package.json` 파일의 `scripts` 섹션에 다음을 추가합니다:

```json
{
  "name": "sedai-homepage",
  "version": "1.0.0",
  "description": "SEDAI Web Application",
  "scripts": {
    "dev": "node server.js",
    "start": "npm run dev"
  },
  "devDependencies": {
    "chokidar": "^3.5.3",
    "socket.io": "^4.5.4",
    "express": "^4.18.2"
  }
}
```

**사용 방법:**
```bash
npm run dev     # 개발 서버 실행
npm start       # 동일 (dev의 별칭)
```

### 단계 5: HTML 파일에 hot-reload.js 포함

모든 HTML 파일의 `<head>` 섹션 또는 `</body>` 직전에 다음을 추가합니다:

**예시: spec-repositories.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEDAI - Spec Repositories</title>

    <!-- 기존 CSS 및 스크립트 -->
    <link rel="stylesheet" href="...">
</head>
<body>
    <!-- 페이지 콘텐츠 -->

    <!-- Hot Reload (개발 환경에서만 동작) -->
    <script src="./assets/js/hot-reload.js"></script>
</body>
</html>
```

**중요:**
- `hot-reload.js`는 개발 환경에서만 작동합니다 (localhost/127.0.0.1)
- 프로덕션 배포 시에도 포함되어 있어도 자동으로 비활성화됩니다

### 단계 6: 개발 서버 실행

터미널에서 다음 명령어를 실행합니다:

```bash
cd sedai-homepage
npm run dev
```

**예상 출력:**
```
🔍 Starting file watcher...

🚀 Hot Reload Development Server
   URL: http://localhost:8000
   Socket: http://localhost:8000 (Socket.IO)

📁 Watching for changes in:
   • ./assets
   • ./specs
   • ./*.html

💡 Open http://localhost:8000 in your browser
   Changes will be reflected automatically.
```

**브라우저에서 확인:**
1. `http://localhost:8000/spec-repositories.html` 접속
2. 브라우저 콘솔 확인:
   ```
   [Hot Reload] Connecting to: http://localhost:8000
   [Hot Reload] ✅ Connected: ABC123xyz
   ```

## 테스트 시나리오

### 시나리오 1: CSS Hot Swap 테스트

**목적:** CSS 변경 시 전체 페이지 리로드 없이 스타일만 갱신되는지 확인

**단계:**
1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `http://localhost:8000/index.html` 접속
3. CSS 파일 수정 (예: `assets/css/main.css`)
4. 변경사항 저장

**예상 결과:**
- 서버 콘솔:
  ```
  📝 change: assets/css/main.css
     → CSS hot swap
  ```
- 브라우저 콘솔:
  ```
  [Hot Reload] 🎨 CSS updated: assets/css/main.css
  ```
- 페이지 리로드 없이 스타일만 변경됨

### 시나리오 2: HTML 파일 변경 테스트

**목적:** HTML 파일 변경 시 전체 페이지가 리로드되는지 확인

**단계:**
1. 개발 서버 실행
2. 브라우저에서 페이지 접속
3. HTML 파일 수정 (예: `index.html`의 제목 변경)
4. 변경사항 저장

**예상 결과:**
- 서버 콘솔:
  ```
  📝 change: index.html
     → Full reload
  ```
- 브라우저 콘솔:
  ```
  [Hot Reload] 🔄 Reloading page...
  ```
- 페이지 전체가 자동으로 새로고침됨

### 시나리오 3: JavaScript 파일 변경 테스트

**목적:** JavaScript 파일 변경 시 페이지가 리로드되는지 확인

**단계:**
1. 개발 서버 실행
2. 브라우저에서 페이지 접속
3. JavaScript 파일 수정 (예: `assets/js/spec-repositories.js`)
4. 변경사항 저장

**예상 결과:**
- 서버 콘솔:
  ```
  📝 change: assets/js/spec-repositories.js
     → Full reload
  ```
- 브라우저가 자동으로 새로고침됨

### 시나리오 4: 여러 브라우저 동시 연결 테스트

**목적:** 여러 브라우저 탭/창에서 동시에 Hot Reload가 작동하는지 확인

**단계:**
1. 개발 서버 실행
2. 브라우저 탭 2개 열기:
   - 탭 1: `http://localhost:8000/index.html`
   - 탭 2: `http://localhost:8000/spec-repositories.html`
3. HTML 또는 CSS 파일 수정
4. 변경사항 저장

**예상 결과:**
- 서버 콘솔:
  ```
  ✅ Client connected: ABC123
  ✅ Client connected: XYZ789
  📝 change: assets/css/main.css
     → CSS hot swap
  ```
- 모든 열린 탭이 동시에 업데이트됨

### 시나리오 5: 프로덕션 환경에서 비활성화 확인

**목적:** 프로덕션 환경에서는 Hot Reload가 작동하지 않는지 확인

**단계:**
1. 파일을 프로덕션 서버에 배포 (HTTPS 도메인)
2. 브라우저에서 프로덕션 URL 접속
3. 브라우저 콘솔 확인

**예상 결과:**
- 브라우저 콘솔:
  ```
  [Hot Reload] Disabled (not in development environment)
  ```
- Socket.IO 연결 시도 없음

## Firebase App Check 디버그 토큰 사용

로컬 개발 환경에서 Firebase App Check를 사용하려면 디버그 토큰이 필요합니다.

### 디버그 토큰 생성 및 등록

1. **자동 생성 방식 (권장):**
   - `spec-repositories.js` 및 `auth.js`에 이미 디버그 모드가 구현되어 있습니다
   - `localhost` 또는 `127.0.0.1`에서 실행 시 자동 활성화
   - 브라우저 콘솔에 디버그 토큰 표시:
     ```
     [App Check] Debug mode enabled - Check console for debug token
     Firebase App Check debug token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     ```

2. **Firebase Console에 등록:**
   - Firebase Console > App Check > Debug tokens
   - "Add debug token" 클릭
   - 콘솔에 표시된 토큰 붙여넣기
   - 저장

3. **확인:**
   - 페이지 새로고침
   - Firebase 요청이 정상적으로 작동하는지 확인

**참고 문서:**
- `sedaiweb-firebase-security.md`: App Check 구현 명세
- `sedaiweb-firebase-security-testing.md`: 상세 테스트 가이드

## 트러블슈팅

### 문제 1: "Cannot find module 'chokidar'"

**원인:** Node.js 패키지가 설치되지 않음

**해결:**
```bash
npm install
```

### 문제 2: Hot Reload가 작동하지 않음

**원인:** Socket.IO 연결 실패

**해결:**
1. 브라우저 콘솔에서 에러 메시지 확인
2. 서버가 실행 중인지 확인: `http://localhost:8000/health`
3. 방화벽이 포트 8000을 차단하고 있는지 확인

### 문제 3: CSS Hot Swap이 안 됨

**원인:** CSS 파일 경로 매칭 실패

**해결:**
1. 서버 콘솔에서 파일 경로 확인
2. `hot-reload.js`의 파일명 매칭 로직 확인
3. 브라우저 캐시 삭제 (Cmd+Shift+R / Ctrl+Shift+R)

### 문제 4: 포트 8000이 이미 사용 중

**원인:** 다른 프로세스가 포트 8000 사용 중

**해결:**
```bash
# 다른 포트 사용
PORT=8001 npm run dev

# 또는 package.json 수정:
"dev": "PORT=8001 node server.js"
```

### 문제 5: Firebase App Check 에러

**원인:** 디버그 토큰이 등록되지 않음

**해결:**
- `sedaiweb-firebase-security-testing.md` 참조
- 디버그 토큰을 Firebase Console에 등록

## 검증 체크리스트

개발 환경 설정 완료 후 다음 항목을 확인하세요:

### Node.js 패키지 설치
- [ ] `package.json` 파일 존재
- [ ] `chokidar`, `socket.io`, `express` 설치 완료
- [ ] `npm run dev` 스크립트 등록

### 서버 구현
- [ ] `server.js` 파일 생성
- [ ] Express 서버 정상 작동
- [ ] Socket.IO 서버 정상 작동
- [ ] Chokidar 파일 감시 정상 작동

### 클라이언트 스크립트
- [ ] `assets/js/hot-reload.js` 파일 생성
- [ ] 개발 환경 자동 감지 기능
- [ ] Socket.IO 연결 기능
- [ ] CSS Hot Swap 기능
- [ ] 전체 리로드 기능

### HTML 통합
- [ ] 모든 HTML 파일에 `hot-reload.js` 포함
- [ ] 브라우저 콘솔에 Hot Reload 로그 표시

### 기능 테스트
- [ ] CSS 변경 시 Hot Swap 작동
- [ ] HTML 변경 시 전체 리로드 작동
- [ ] JavaScript 변경 시 전체 리로드 작동
- [ ] 여러 브라우저 탭에서 동시 작동
- [ ] 프로덕션 환경에서 자동 비활성화

### Firebase 통합
- [ ] Firebase App Check 디버그 모드 작동
- [ ] 디버그 토큰 생성 및 등록
- [ ] Firebase 요청 정상 작동

## 추가 리소스

- Chokidar 문서: https://github.com/paulmillr/chokidar
- Socket.IO 문서: https://socket.io/docs/
- Express 문서: https://expressjs.com/
- Firebase App Check: `sedaiweb-firebase-security.md`

## 버전 히스토리

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| 1.0.0 | 2025-11-07 | 초기 버전 - Hot Reload 개발 환경 명세 작성 |

---

**작성자:** Song Jaeho (thruthesky@gmail.com)
**최종 수정일:** 2025-11-07
**라이선스:** MIT
