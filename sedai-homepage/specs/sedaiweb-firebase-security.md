---
name: sedaiweb-firebase-security
version: 1.0.0
description: Firebase App Check를 사용한 SEDAI 웹 애플리케이션 보안 강화 명세
author: Song Jaeho
email: thruthesky@gmail.com
license: MIT
step: 15
dependencies: sedaiweb-firebase-setup
---

## 개요

본 명세는 Firebase App Check를 사용하여 SEDAI 웹 애플리케이션의 Firebase 서비스(Realtime Database, Authentication 등)를 무단 액세스로부터 보호하는 방법을 정의합니다. reCAPTCHA Enterprise를 사용하여 웹 클라이언트의 진정성을 검증하고, Firebase Realtime Database에 대한 요청을 보호합니다.

**기반:**
- Firebase App Check 공식 문서: https://firebase.google.com/docs/app-check
- Web Custom Provider 문서: https://firebase.google.com/docs/app-check/web/custom-provider
- Firebase JS SDK v12.5.0 (ES Module)

**현재 상태:**
- reCAPTCHA Enterprise 클라이언트 키: `6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP`
- Firebase Console에서 서버 키 설정 완료
- Realtime Database에서 App Check Enforced 상태

## 요구사항

### 브라우저 호환성
- ES 모듈(ESM)을 지원하는 최신 브라우저
- Chrome 61+, Firefox 60+, Safari 11+, Edge 79+
- JavaScript 활성화 필수

### Firebase 서비스
- Firebase 프로젝트 생성 완료
- Firebase Console에서 App Check 활성화
- reCAPTCHA Enterprise API 활성화 (Google Cloud Console)
- Realtime Database 또는 기타 Firebase 서비스 설정

### 개발 환경
- Firebase SDK v12.5.0 이상
- CDN 접근을 위한 인터넷 연결
- HTTPS 프로토콜 (App Check는 localhost 제외 HTTPS 필요)

## 워크플로우

1. Firebase Console에서 App Check 활성화
2. reCAPTCHA Enterprise 설정 및 사이트 키 획득
3. Firebase Realtime Database에 App Check Enforcement 설정
4. HTML에 Firebase App Check SDK 추가
5. JavaScript에서 App Check 초기화
6. 기존 Firebase 서비스와 통합
7. 개발 및 테스트 환경 설정
8. 프로덕션 배포 및 모니터링

## 상세 내용

### 단계 1: Firebase Console에서 App Check 활성화

**Firebase Console로 이동:**
1. https://console.firebase.google.com 접속
2. 프로젝트 선택 (`sedai-firebase`)
3. 좌측 메뉴에서 "App Check" 클릭
4. "시작하기" 버튼 클릭

**예상 결과:**
- App Check 대시보드 접근 가능
- 웹 앱 등록 인터페이스 표시

### 단계 2: reCAPTCHA Enterprise 설정

**웹 앱에 대한 App Check 등록:**

1. App Check 대시보드에서 웹 앱 선택
2. 제공업체로 "reCAPTCHA Enterprise" 선택
3. reCAPTCHA 사이트 키 입력: `6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP`
4. "저장" 클릭

**reCAPTCHA Enterprise 확인:**
- Google Cloud Console에서 reCAPTCHA Enterprise API가 활성화되어 있는지 확인
- 사이트 키가 올바른 도메인에 등록되어 있는지 확인

**예상 결과:**
- App Check가 웹 앱에 대해 활성화됨
- reCAPTCHA Enterprise 제공업체 설정 완료

### 단계 3: Realtime Database에 App Check Enforcement 설정

**Enforcement 활성화:**

1. Firebase Console의 App Check 대시보드로 이동
2. "APIs" 탭 선택
3. "Firebase Realtime Database" 찾기
4. "Enforced" 상태로 변경

**확인:**
- 스크린샷과 같이 Realtime Database에서 다음 표시:
  - Verified requests: 0%
  - Unverified requests: 100%
  - Status: Enforced (녹색 체크)

**중요:**
- Enforced 상태에서는 App Check 토큰이 없는 모든 요청이 거부됨
- 기존 클라이언트가 중단될 수 있으므로 주의 필요
- 개발 중에는 "Unenforced" 또는 "Metrics only" 모드 사용 가능

### 단계 4: Firebase App Check SDK 추가

**ES Module 방식 (권장):**

모든 HTML 파일의 `<head>` 섹션에 다음 스크립트를 추가합니다:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEDAI - Spec Repository</title>

    <!-- Firebase SDK -->
    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
        import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app-check.js';
        import { getAuth } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
        import { getDatabase } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

        // Firebase 구성
        const firebaseConfig = {
            apiKey: "AIzaSyCb6xetNmUryJB44czwe9BrQPwYaSee7Rs",
            authDomain: "sedai-firebase.firebaseapp.com",
            databaseURL: "https://sedai-firebase-default-rtdb.firebaseio.com",
            projectId: "sedai-firebase",
            storageBucket: "sedai-firebase.firebasestorage.app",
            messagingSenderId: "275784781126",
            appId: "1:275784781126:web:91b75808d32ec3fa28a947"
        };

        // Firebase 초기화
        const app = initializeApp(firebaseConfig);

        // App Check 초기화 (다른 서비스보다 먼저 초기화해야 함)
        const appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaEnterpriseProvider('6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP'),
            isTokenAutoRefreshEnabled: true // 토큰 자동 갱신 활성화
        });

        // 다른 Firebase 서비스 초기화
        const auth = getAuth(app);
        const db = getDatabase(app);

        console.log('[App Check] Initialized successfully');
    </script>
</head>
<body>
    <!-- 페이지 콘텐츠 -->
</body>
</html>
```

**주요 옵션 설명:**

| 옵션 | 타입 | 설명 |
|------|------|------|
| `provider` | ReCaptchaEnterpriseProvider | reCAPTCHA Enterprise 제공업체 인스턴스 |
| `isTokenAutoRefreshEnabled` | boolean | 토큰 자동 갱신 활성화 (기본값: false) |

**토큰 자동 갱신:**
- `true`로 설정하면 토큰 만료 전에 자동으로 갱신
- 장시간 실행되는 앱에 권장
- Firebase SDK가 백그라운드에서 자동 처리

### 단계 5: 기존 코드에 App Check 통합

**옵션 1: 인라인 스크립트에서 초기화**

HTML 파일에서 직접 App Check 초기화:

```html
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
    import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app-check.js';

    const firebaseConfig = { /* ... */ };
    const app = initializeApp(firebaseConfig);

    // App Check를 가장 먼저 초기화
    initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider('6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP'),
        isTokenAutoRefreshEnabled: true
    });

    // 나머지 초기화 코드...
</script>
```

**옵션 2: 별도 JavaScript 파일에서 초기화 (권장)**

기존 `spec-repositories.js`, `auth.js` 등에서 App Check 초기화:

```javascript
// spec-repositories.js 또는 auth.js 파일 상단
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app-check.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

// Firebase 구성
const firebaseConfig = {
    apiKey: "AIzaSyCb6xetNmUryJB44czwe9BrQPwYaSee7Rs",
    authDomain: "sedai-firebase.firebaseapp.com",
    databaseURL: "https://sedai-firebase-default-rtdb.firebaseio.com",
    projectId: "sedai-firebase",
    storageBucket: "sedai-firebase.firebasestorage.app",
    messagingSenderId: "275784781126",
    appId: "1:275784781126:web:91b75808d32ec3fa28a947"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// App Check 초기화 (반드시 다른 서비스보다 먼저)
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider('6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP'),
    isTokenAutoRefreshEnabled: true
});

// 이제 다른 Firebase 서비스를 사용할 수 있음
const auth = getAuth(app);
const db = getDatabase(app);

export { app, appCheck, auth, db };
```

**중요 주의사항:**
- **App Check는 반드시 다른 Firebase 서비스보다 먼저 초기화해야 함**
- 초기화 순서가 잘못되면 App Check 토큰이 첫 번째 요청에 포함되지 않을 수 있음

### 단계 6: 개발 환경 설정

**로컬 개발을 위한 디버그 토큰:**

프로덕션 환경에서만 App Check를 적용하고 개발 환경에서는 디버그 토큰을 사용할 수 있습니다:

```javascript
// 개발 환경 감지
const isDevelopment = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';

if (isDevelopment) {
    // 디버그 모드 활성화 (브라우저 콘솔에 디버그 토큰 표시)
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log('[App Check] Debug mode enabled - Check console for debug token');
}

// App Check 초기화
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider('6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP'),
    isTokenAutoRefreshEnabled: true
});
```

**디버그 토큰 등록:**
1. 개발 환경에서 앱 실행
2. 브라우저 콘솔에서 디버그 토큰 복사
3. Firebase Console > App Check > 디버그 토큰 관리
4. 복사한 토큰 추가

**예상 결과:**
- 로컬 개발 시 App Check 검증 없이 작동
- 프로덕션에서는 reCAPTCHA 검증 사용

### 단계 7: 에러 처리 및 모니터링

**App Check 초기화 에러 처리:**

```javascript
try {
    const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider('6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP'),
        isTokenAutoRefreshEnabled: true
    });
    console.log('[App Check] Initialized successfully');
} catch (error) {
    console.error('[App Check] Initialization failed:', error);
    // 에러를 사용자에게 표시하거나 대체 로직 실행
}
```

**토큰 갱신 실패 처리:**

```javascript
import { getToken } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app-check.js';

async function checkAppCheckToken() {
    try {
        const token = await getToken(appCheck);
        console.log('[App Check] Token obtained successfully');
        return true;
    } catch (error) {
        console.error('[App Check] Failed to get token:', error);
        // 사용자에게 페이지 새로고침 요청 등
        return false;
    }
}
```

**Firebase Console에서 모니터링:**
1. Firebase Console > App Check > "APIs" 탭
2. Realtime Database 메트릭 확인:
   - Verified requests (App Check 통과)
   - Unverified requests (App Check 실패)
3. 비정상적인 패턴 감지

## 테스트 시나리오

### 시나리오 1: App Check 없이 요청 (실패 예상)

**목적:** App Check Enforcement가 작동하는지 확인

**단계:**
1. 브라우저 개발자 도구 열기
2. App Check 초기화 코드를 주석 처리
3. Firebase Realtime Database에 데이터 읽기/쓰기 시도
4. 네트워크 탭에서 요청 확인

**예상 결과:**
```
Error: Permission denied
Firebase Response: 401 Unauthorized
```

**검증:**
- Firebase Console에서 "Unverified requests" 카운트 증가
- 클라이언트에서 permission denied 에러 발생

### 시나리오 2: App Check와 함께 요청 (성공 예상)

**목적:** App Check가 올바르게 작동하는지 확인

**단계:**
1. App Check 초기화 코드 활성화
2. 페이지 새로고침
3. 브라우저 콘솔에서 App Check 초기화 메시지 확인
4. Firebase Realtime Database에 데이터 읽기/쓰기 시도
5. 네트워크 탭에서 요청 헤더 확인

**예상 결과:**
```
[App Check] Initialized successfully
Request Headers:
  X-Firebase-AppCheck: <token>
Response: 200 OK
```

**검증:**
- Firebase Console에서 "Verified requests" 카운트 증가
- 데이터 읽기/쓰기 성공
- 네트워크 요청에 `X-Firebase-AppCheck` 헤더 포함

### 시나리오 3: 토큰 자동 갱신 테스트

**목적:** 토큰 자동 갱신이 작동하는지 확인

**단계:**
1. App Check 초기화 (`isTokenAutoRefreshEnabled: true`)
2. 페이지를 1시간 이상 열어둠 (토큰 TTL: 1시간)
3. 브라우저 콘솔에서 토큰 갱신 로그 확인
4. 시간 경과 후 Firebase 요청 시도

**예상 결과:**
```
[App Check] Token refreshed successfully
Request successful after token refresh
```

**검증:**
- 토큰 만료 전에 자동 갱신됨
- 사용자 경험 중단 없음
- 지속적으로 Firebase 서비스 사용 가능

### 시나리오 4: 디버그 모드 테스트

**목적:** 로컬 개발 환경에서 디버그 토큰 작동 확인

**단계:**
1. `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true` 설정
2. localhost에서 앱 실행
3. 브라우저 콘솔에서 디버그 토큰 복사
4. Firebase Console에 디버그 토큰 등록
5. Firebase 요청 시도

**예상 결과:**
```
[App Check] Debug mode enabled
Debug token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Request successful with debug token
```

**검증:**
- 디버그 토큰이 콘솔에 표시됨
- Firebase Console에 등록 후 요청 성공
- reCAPTCHA 없이 작동

### 시나리오 5: 프로덕션 배포 테스트

**목적:** 프로덕션 환경에서 reCAPTCHA가 작동하는지 확인

**단계:**
1. 프로덕션 도메인에 배포
2. 디버그 모드 비활성화
3. 페이지 로드 시 reCAPTCHA 배지 확인
4. Firebase 요청 시도
5. 네트워크 탭에서 reCAPTCHA 요청 확인

**예상 결과:**
- 페이지 하단에 reCAPTCHA 배지 표시
- Firebase 요청 성공
- 네트워크 탭에서 `https://www.recaptcha.net` 요청 확인

**검증:**
- reCAPTCHA Enterprise가 정상 작동
- App Check 토큰이 자동으로 요청에 포함
- Firebase Console에서 Verified requests 증가

## 주의사항 및 Best Practices

### 보안 고려사항

1. **API 키 노출:**
   - Firebase API 키는 클라이언트에 노출되어도 안전함
   - 실제 보안은 Firebase 보안 규칙과 App Check로 제공됨
   - 절대로 서버 키나 서비스 계정 키를 클라이언트에 노출하지 말 것

2. **reCAPTCHA 사이트 키:**
   - 공개 키이므로 클라이언트 코드에 포함 가능
   - 서버 키(비밀 키)는 Firebase Console에서만 관리

3. **Enforcement 전환 시기:**
   - 모든 클라이언트가 App Check를 구현한 후에만 Enforced 모드로 전환
   - 먼저 "Metrics only" 모드로 테스트
   - Verified requests가 90% 이상일 때 Enforced로 전환 권장

### 성능 최적화

1. **토큰 캐싱:**
   - Firebase SDK가 자동으로 토큰 캐싱 처리
   - 명시적인 캐싱 로직 불필요

2. **자동 갱신:**
   - `isTokenAutoRefreshEnabled: true` 설정으로 자동 갱신 활성화
   - 장시간 실행되는 Single Page Application에 필수

3. **초기 로딩 시간:**
   - reCAPTCHA 스크립트 로딩으로 약간의 지연 발생 가능
   - 비동기 로딩 및 lazy loading 고려

### 개발 워크플로우

1. **로컬 개발:**
   ```javascript
   if (location.hostname === 'localhost') {
       self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
   }
   ```

2. **스테이징 환경:**
   - 별도의 Firebase 프로젝트 사용 권장
   - 또는 디버그 토큰 사용

3. **프로덕션:**
   - 디버그 모드 완전히 제거
   - reCAPTCHA Enterprise 사용
   - 모니터링 활성화

### 에러 처리

1. **App Check 초기화 실패:**
   ```javascript
   try {
       initializeAppCheck(app, { /* config */ });
   } catch (error) {
       console.error('App Check failed:', error);
       // 사용자에게 알림 또는 대체 로직
   }
   ```

2. **토큰 획득 실패:**
   - 네트워크 문제
   - reCAPTCHA 차단
   - 잘못된 설정

   → 사용자에게 페이지 새로고침 요청

3. **Permission Denied:**
   - App Check 토큰 없음
   - 만료된 토큰
   - 잘못된 토큰

   → 디버그 로그 확인 및 재초기화

### 디버깅 팁

1. **브라우저 콘솔 로그:**
   ```javascript
   console.log('[App Check] Initialized:', appCheck);
   ```

2. **네트워크 탭 확인:**
   - `X-Firebase-AppCheck` 헤더 존재 여부
   - reCAPTCHA 요청 상태

3. **Firebase Console 메트릭:**
   - Verified vs Unverified 비율
   - 에러 패턴 분석

## 추가 리소스

### 공식 문서
- Firebase App Check 개요: https://firebase.google.com/docs/app-check
- Web 통합 가이드: https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider
- Custom Provider: https://firebase.google.com/docs/app-check/web/custom-provider
- Monitoring: https://firebase.google.com/docs/app-check/monitor-with-metrics

### 관련 명세
- `sedaiweb-firebase-setup.md`: Firebase SDK 초기 설정
- `sedaiweb-firebase-database.md`: Realtime Database 구조 및 보안 규칙
- `sedaiweb-firebase-login.md`: Firebase Authentication 구현

### 문제 해결
- App Check FAQ: https://firebase.google.com/docs/app-check/faq
- GitHub Issues: https://github.com/firebase/firebase-js-sdk/issues

## 버전 히스토리

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| 1.0.0 | 2025-11-07 | 초기 버전 - Firebase App Check 구현 명세 작성 |

## 검증 체크리스트

구현 완료 후 다음 항목을 확인하세요:

- [ ] Firebase Console에서 App Check 활성화됨
- [ ] reCAPTCHA Enterprise 사이트 키 설정 완료
- [ ] Realtime Database에서 App Check Enforced 상태
- [ ] Firebase SDK에 App Check 모듈 추가
- [ ] JavaScript에서 App Check 초기화 구현
- [ ] `isTokenAutoRefreshEnabled` 옵션 활성화
- [ ] 로컬 개발을 위한 디버그 토큰 설정 (선택사항)
- [ ] 에러 처리 로직 구현
- [ ] 프로덕션 환경에서 테스트 완료
- [ ] Firebase Console에서 Verified requests 확인
- [ ] 네트워크 요청에 `X-Firebase-AppCheck` 헤더 포함 확인
- [ ] 브라우저 콘솔에 에러 없음
- [ ] reCAPTCHA 배지 표시 확인
- [ ] 토큰 자동 갱신 작동 확인
- [ ] 문서화 및 코드 주석 작성 완료

---

**작성자:** Song Jaeho (thruthesky@gmail.com)
**최종 수정일:** 2025-11-07
**라이선스:** MIT
