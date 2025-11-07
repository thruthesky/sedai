---
name: sedaiweb-firebase-security-testing
version: 1.0.0
description: Firebase App Check 구현 테스트 가이드
author: Song Jaeho
email: thruthesky@gmail.com
license: MIT
step: 16
dependencies: sedaiweb-firebase-security
---

## 개요

본 문서는 Firebase App Check 구현 후 로컬 개발 환경 및 프로덕션 환경에서 테스트하는 방법을 단계별로 설명합니다.

**구현 완료된 파일:**
- `assets/js/spec-repositories.js` - Repository 관리 페이지용 App Check
- `assets/js/auth.js` - 로그인 페이지용 App Check

**적용된 기능:**
- reCAPTCHA Enterprise 통합
- 자동 디버그 모드 감지 (localhost)
- 토큰 자동 갱신
- 에러 처리

## 로컬 개발 환경 테스트

### 단계 1: 로컬 서버 실행

로컬 개발 환경에서 테스트하기 위해 HTTP 서버를 실행합니다:

**방법 1: Python HTTP Server (권장)**
```bash
cd sedai-homepage
python3 -m http.server 8000
```

**방법 2: Node.js http-server**
```bash
cd sedai-homepage
npx http-server -p 8000
```

**방법 3: VS Code Live Server**
- VS Code에서 `index.html` 또는 `spec-repositories.html` 우클릭
- "Open with Live Server" 선택

### 단계 2: 디버그 토큰 생성

1. 브라우저에서 `http://localhost:8000/spec-repositories.html` 접속
2. 브라우저 개발자 도구 열기 (F12 또는 Cmd+Option+I)
3. Console 탭으로 이동
4. 다음과 같은 로그 확인:
   ```
   [App Check] Debug mode enabled - Check console for debug token
   [App Check] Initialized successfully
   ```
5. 디버그 토큰이 콘솔에 표시됨 (UUID 형식):
   ```
   Firebase App Check debug token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
6. 이 토큰을 복사

**중요:**
- 디버그 토큰은 `localhost` 또는 `127.0.0.1`에서만 자동으로 활성화됩니다
- 다른 도메인에서는 디버그 모드가 비활성화됩니다

### 단계 3: Firebase Console에 디버그 토큰 등록

1. Firebase Console 접속: https://console.firebase.google.com
2. 프로젝트 선택: `sedai-firebase`
3. 좌측 메뉴에서 "App Check" 클릭
4. 상단 탭에서 "Manage debug tokens" 또는 "Debug tokens" 클릭
5. "Add debug token" 버튼 클릭
6. 복사한 디버그 토큰 붙여넣기
7. 토큰 이름 입력 (예: "Local Development - My Computer")
8. "Add" 버튼 클릭

**예상 결과:**
- 디버그 토큰이 리스트에 추가됨
- 유효 기간: 기본 30일 (연장 가능)

### 단계 4: 로컬 환경에서 기능 테스트

#### 테스트 4-1: Repository 조회 (읽기)

1. `http://localhost:8000/spec-repositories.html` 접속
2. 브라우저 콘솔 확인:
   ```
   [App Check] Debug mode enabled
   [App Check] Initialized successfully
   [repository] Received snapshot update
   ```
3. Repository 리스트가 정상적으로 표시되는지 확인
4. 네트워크 탭 (Network tab) 확인:
   - Firebase Realtime Database 요청 확인
   - Request Headers에 `X-Firebase-AppCheck` 헤더 포함 확인

#### 테스트 4-2: Repository 등록 (쓰기)

1. "Register Your Repository" 버튼 클릭
2. 로그인 페이지로 이동하여 인증 (필요시)
3. 폼 작성:
   - Spec Name: `Test Repository`
   - Description: `Testing App Check integration`
   - Specs URL: `https://github.com/test/specs`
   - Author: `Test User`
   - Email: `test@example.com`
   - License: `MIT`
4. "Register Repository" 버튼 클릭
5. 성공 메시지 확인:
   ```
   Your specification has been submitted successfully!
   ```
6. Firebase Console > Realtime Database에서 데이터 생성 확인

#### 테스트 4-3: 로그인 테스트

1. `http://localhost:8000/login.html` 접속
2. 전화번호 입력 (E.164 형식): `+821012345678`
3. 브라우저 콘솔 확인:
   ```
   [App Check] Debug mode enabled
   [App Check] Initialized successfully
   ```
4. "Send SMS Code" 버튼 클릭
5. SMS 코드 수신 및 입력
6. 로그인 성공 확인

### 단계 5: 디버그 모드 동작 확인

**확인 사항:**
- ✅ 콘솔에 "Debug mode enabled" 메시지 표시
- ✅ 디버그 토큰이 UUID 형식으로 표시
- ✅ reCAPTCHA 배지가 표시되지 않음 (디버그 모드에서는 불필요)
- ✅ Firebase 요청이 정상적으로 완료됨
- ✅ Firebase Console에서 "Verified requests" 카운트 증가

## 프로덕션 환경 테스트

### ⚠️ 사전 요구사항: reCAPTCHA Enterprise 도메인 설정 (필수)

프로덕션 배포 **전에 반드시** reCAPTCHA Enterprise 키에 프로덕션 도메인을 추가해야 합니다.

**단계:**

1. **Google Cloud Console 접속**
   - [https://console.cloud.google.com/security/recaptcha](https://console.cloud.google.com/security/recaptcha) 접속
   - `sedai-firebase` 프로젝트 선택

2. **reCAPTCHA 키 선택**
   - 키 목록에서 사용 중인 키 찾기
   - 키 ID: `6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP`
   - 키 이름 클릭하여 상세 페이지로 이동

3. **도메인 추가**
   - **"도메인"** 또는 **"Domains"** 섹션 찾기
   - **"도메인 추가"** 또는 **"Add domain"** 클릭
   - 프로덕션 도메인 입력:
     - `sedai.dev` (메인 도메인)
     - `www.sedai.dev` (www 서브도메인 사용 시)
   - **주의**: 프로토콜(https://)이나 경로(/)는 포함하지 않음
   - **저장** 클릭

4. **개발 환경 도메인도 추가 (선택사항)**
   - `localhost` (로컬 개발용)
   - 스테이징 도메인 (있는 경우)

5. **설정 확인**
   - 도메인 목록에 다음이 포함되어 있는지 확인:
     ```
     ✓ sedai.dev
     ✓ www.sedai.dev (선택)
     ✓ localhost
     ```

**중요 참고사항:**
- 도메인 설정 없이 배포하면 "Missing appcheck token" 에러 발생
- 도메인 추가 후 즉시 적용됨 (별도 배포 불필요)
- 여러 도메인 추가 가능 (개발/스테이징/프로덕션 모두 허용)

### 단계 1: 프로덕션 배포

프로덕션 도메인에 배포합니다. HTTPS가 필수입니다.

**배포 예시 (Firebase Hosting):**
```bash
cd sedai-homepage
firebase deploy --only hosting
```

**배포 예시 (GitHub Pages, Netlify, Vercel 등):**
- 각 플랫폼의 배포 가이드 참조
- HTTPS가 자동으로 설정되는지 확인

### 단계 2: 프로덕션 도메인 확인

1. 배포된 URL 접속 (예: `https://sedai-web.com`)
2. **중요:** 디버그 모드가 비활성화되어야 함
3. 브라우저 콘솔 확인:
   ```
   [App Check] Initialized successfully
   ```
   (디버그 모드 메시지는 나타나지 않아야 함)

### 단계 3: reCAPTCHA 동작 확인

1. 페이지 로드 시 우측 하단에 reCAPTCHA 배지 표시 확인:
   ```
   [reCAPTCHA 아이콘]
   Protected by reCAPTCHA
   Privacy - Terms
   ```

2. 네트워크 탭에서 reCAPTCHA 요청 확인:
   ```
   https://www.recaptcha.net/recaptcha/enterprise/...
   ```

3. Firebase 요청 헤더에 App Check 토큰 포함 확인:
   ```
   X-Firebase-AppCheck: <token>
   ```

### 단계 4: Enforcement 동작 확인

#### 테스트 4-1: App Check 토큰 있는 경우 (정상)

1. `https://your-domain.com/spec-repositories.html` 접속
2. Repository 리스트 정상 표시 확인
3. Firebase Console > App Check > APIs 탭에서:
   - "Firebase Realtime Database" 확인
   - "Verified requests" 카운트 증가 확인
   - "Unverified requests" 카운트 변화 없음

#### 테스트 4-2: App Check 토큰 없는 경우 (실패 예상)

**주의: 이 테스트는 개발 목적으로만 수행하세요.**

1. 브라우저 개발자 도구 > Sources 탭
2. `spec-repositories.js` 파일 찾기
3. App Check 초기화 코드 주석 처리:
   ```javascript
   // try {
   //     appCheck = initializeAppCheck(app, {
   //         provider: new ReCaptchaEnterpriseProvider('...'),
   //         isTokenAutoRefreshEnabled: true
   //     });
   // } catch (error) {
   //     console.error('[App Check] Initialization failed:', error);
   // }
   ```
4. 페이지 새로고침
5. 예상 결과:
   - Firebase 요청 실패
   - 에러 메시지: "Permission denied" 또는 "401 Unauthorized"
   - Firebase Console에서 "Unverified requests" 카운트 증가

### 단계 5: 토큰 자동 갱신 테스트

1. 프로덕션 페이지 열어둠
2. 1시간 이상 페이지 유지 (토큰 TTL: 1시간)
3. 브라우저 콘솔에서 토큰 갱신 로그 확인:
   ```
   [App Check] Token refreshed successfully
   ```
4. 1시간 후 Repository 리스트가 여전히 작동하는지 확인

### 단계 6: Firebase Console 모니터링

1. Firebase Console > App Check > APIs 탭
2. "Firebase Realtime Database" 메트릭 확인:
   - **Verified requests:** 높은 비율 (90% 이상 권장)
   - **Unverified requests:** 낮은 비율
   - **Status:** Enforced (녹색 체크)

3. 시간대별 그래프 확인:
   - 정상 트래픽 패턴
   - 비정상적인 스파이크 감지

## 에러 시나리오 및 해결 방법

### 에러 0: "Missing appcheck token" (프로덕션 환경)

**증상:**
```
FIREBASE WARNING: Missing appcheck token (https://sedai-firebase-default-rtdb.firebaseio.com/)
```

또는 브라우저 콘솔에:
```
[App Check] ❌ Initialization failed
[App Check] 🚨 PRODUCTION ERROR: Please verify the following:
  1. Domain "sedai.dev" is added to reCAPTCHA Enterprise key
  2. reCAPTCHA key: 6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP
  3. Check Google Cloud Console: https://console.cloud.google.com/security/recaptcha
```

**원인:**
- **프로덕션 도메인이 reCAPTCHA Enterprise 키에 등록되지 않음** (가장 흔한 원인)
- reCAPTCHA Enterprise API가 비활성화됨
- 잘못된 사이트 키 사용

**해결 방법:**

1. **Google Cloud Console에서 도메인 추가 (필수)**
   - [https://console.cloud.google.com/security/recaptcha](https://console.cloud.google.com/security/recaptcha) 접속
   - 프로젝트 `sedai-firebase` 선택
   - 키 `6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP` 클릭
   - "도메인" 섹션에서 **"도메인 추가"** 클릭
   - `sedai.dev` 입력 (프로토콜 제외)
   - 저장

2. **reCAPTCHA Enterprise API 활성화 확인**
   - [https://console.cloud.google.com/apis/library/recaptchaenterprise.googleapis.com](https://console.cloud.google.com/apis/library/recaptchaenterprise.googleapis.com)
   - "사용 설정" 또는 "ENABLE" 버튼 확인
   - 이미 활성화되어 있으면 "API 사용 설정됨" 표시

3. **브라우저 캐시 삭제 및 새로고침**
   - Cmd+Shift+R (Mac) / Ctrl+Shift+F5 (Windows)
   - 또는 시크릿 모드에서 테스트

4. **확인**
   - 브라우저 콘솔에서 성공 메시지 확인:
     ```
     [App Check] 🌐 Production mode - Domain: sedai.dev
     [App Check] ✅ Initialized successfully (Production mode)
     [App Check] reCAPTCHA Enterprise is active
     ```

**참고:**
- 위 "프로덕션 환경 테스트 > 사전 요구사항" 섹션 참조
- 도메인 추가 후 즉시 적용됨 (별도 배포 불필요)

### 에러 1: "App Check token is invalid" (개발 환경)

**증상:**
```
Error: App Check: Fetch server returned an HTTP error status. HTTP status: 401.
```

**원인:**
- 디버그 토큰이 Firebase Console에 등록되지 않음
- 디버그 토큰이 만료됨
- reCAPTCHA 사이트 키가 잘못됨

**해결:**
1. 디버그 토큰을 다시 생성하고 Firebase Console에 등록
2. reCAPTCHA 사이트 키 확인: `6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP`
3. Firebase Console에서 App Check가 활성화되어 있는지 확인

### 에러 2: "Permission denied"

**증상:**
```
Error: PERMISSION_DENIED: Permission denied
```

**원인:**
- App Check Enforcement가 활성화되었지만 클라이언트에 App Check가 없음
- 네트워크 요청에 App Check 토큰이 포함되지 않음

**해결:**
1. App Check 초기화 코드가 다른 Firebase 서비스보다 먼저 실행되는지 확인
2. 브라우저 콘솔에서 `[App Check] Initialized successfully` 메시지 확인
3. 네트워크 탭에서 `X-Firebase-AppCheck` 헤더 확인

### 에러 3: "reCAPTCHA verification failed"

**증상:**
```
Error: reCAPTCHA verification failed
```

**원인:**
- reCAPTCHA Enterprise API가 활성화되지 않음
- 잘못된 도메인에서 요청
- 서버 키가 Firebase Console에 설정되지 않음

**해결:**
1. Google Cloud Console에서 reCAPTCHA Enterprise API 활성화 확인
2. reCAPTCHA 사이트 키의 도메인 설정 확인
3. Firebase Console > App Check에서 서버 키 재설정

### 에러 4: "Too many requests"

**증상:**
```
Error: Too many App Check token requests
```

**원인:**
- 짧은 시간에 너무 많은 토큰 요청
- 무한 루프 또는 재귀 호출

**해결:**
1. App Check 초기화 코드가 한 번만 실행되는지 확인
2. 토큰 자동 갱신이 활성화되어 있는지 확인 (`isTokenAutoRefreshEnabled: true`)
3. 불필요한 페이지 새로고침 방지

## 검증 체크리스트

구현 및 테스트 완료 후 다음 항목을 확인하세요:

### 로컬 개발 환경
- [ ] localhost에서 디버그 모드 자동 활성화
- [ ] 디버그 토큰이 브라우저 콘솔에 표시
- [ ] 디버그 토큰이 Firebase Console에 등록됨
- [ ] Repository 조회 기능 정상 작동
- [ ] Repository 등록 기능 정상 작동
- [ ] 로그인 기능 정상 작동
- [ ] 브라우저 콘솔에 에러 없음

### 프로덕션 환경
- [ ] HTTPS로 배포 완료
- [ ] 디버그 모드 비활성화 (콘솔에 메시지 없음)
- [ ] reCAPTCHA 배지가 페이지 하단에 표시
- [ ] Firebase 요청에 `X-Firebase-AppCheck` 헤더 포함
- [ ] Repository 조회 기능 정상 작동
- [ ] Repository 등록 기능 정상 작동
- [ ] 로그인 기능 정상 작동
- [ ] Firebase Console에서 "Verified requests" 증가 확인
- [ ] "Unverified requests"가 0% 또는 매우 낮음
- [ ] 1시간 후 토큰 자동 갱신 확인

### Firebase Console
- [ ] App Check가 활성화되어 있음
- [ ] reCAPTCHA Enterprise 제공업체 설정 완료
- [ ] Realtime Database에 "Enforced" 상태
- [ ] 디버그 토큰 목록 확인 (로컬 개발용)
- [ ] 메트릭에서 정상 트래픽 패턴 확인

## 트러블슈팅 팁

### 1. 브라우저 콘솔 활용

항상 브라우저 개발자 도구를 열어두고 다음을 확인하세요:
- `[App Check]` 로그 메시지
- Firebase 에러 메시지
- 네트워크 요청/응답

### 2. 네트워크 탭 확인

Firebase Realtime Database 요청을 찾아서:
- Request Headers에 `X-Firebase-AppCheck: <token>` 확인
- Response Status가 200 OK인지 확인
- reCAPTCHA 요청이 성공했는지 확인

### 3. Firebase Console 모니터링

실시간 메트릭을 확인하여:
- Verified requests 비율이 높은지 확인
- Unverified requests가 갑자기 증가하는지 모니터링
- 비정상적인 패턴 감지

### 4. 시크릿 모드로 테스트

브라우저 캐시나 쿠키의 영향을 배제하기 위해:
- Chrome 시크릿 모드 (Cmd+Shift+N / Ctrl+Shift+N)
- Safari Private Browsing
- Firefox Private Window

### 5. 다른 브라우저에서 테스트

크로스 브라우저 호환성 확인:
- Chrome
- Firefox
- Safari
- Edge

## 추가 리소스

- Firebase App Check 문서: https://firebase.google.com/docs/app-check
- reCAPTCHA Enterprise 문서: https://cloud.google.com/recaptcha-enterprise/docs
- Firebase Console: https://console.firebase.google.com
- 구현 명세: `sedaiweb-firebase-security.md`

## 버전 히스토리

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| 1.0.0 | 2025-11-07 | 초기 버전 - Firebase App Check 테스트 가이드 작성 |

---

**작성자:** Song Jaeho (thruthesky@gmail.com)
**최종 수정일:** 2025-11-07
**라이선스:** MIT
