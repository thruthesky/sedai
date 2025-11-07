---
name: sedaiweb-deploy-overview
version: 1.0.0
description: SEDAI 웹 애플리케이션 배포 프로세스 및 검증 가이드
author: Song Jaeho
email: thruthesky@gmail.com
license: MIT
step: 20
dependencies: sedaiweb-firebase-setup, sedaiweb-firebase-security, sedaiweb-development-run
---

## 개요

본 명세는 SEDAI 웹 애플리케이션의 배포 프로세스, 배포 후 검증 방법, 그리고 Firebase App Check 설정을 포함한 프로덕션 환경 구성 가이드를 정의합니다.

**주요 내용:**
- GitHub Pages 자동 배포 워크플로우
- 버전 표시를 통한 배포 검증
- Firebase App Check 프로덕션 설정
- 배포 후 테스트 시나리오
- 트러블슈팅 가이드

**기술 스택:**
- GitHub Pages (정적 사이트 호스팅)
- Firebase App Check (reCAPTCHA Enterprise)
- Git (버전 관리)
- wget/curl (배포 검증)

## 요구사항

### 시스템 요구사항
- Git >= 2.0
- GitHub 계정 (Pages 활성화)
- Firebase 프로젝트 (App Check 설정 완료)
- Google Cloud Console 접근 권한 (reCAPTCHA Enterprise 설정)

### 프로젝트 구조
```
sedai-homepage/
├── index.html
├── spec-repositories.html
├── login.html
├── assets/
│   ├── js/
│   │   ├── spec-repositories.js
│   │   ├── auth.js
│   │   └── hot-reload.js
│   └── css/
└── specs/
    └── sedaiweb-*.md
```

### Firebase 설정 전제조건
- Firebase App Check 활성화
- reCAPTCHA Enterprise 키 생성
- 클라이언트 키: `6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP`

## 배포 워크플로우

### 단계 1: 버전 정보 추가

배포 검증을 위해 HTML 파일 하단에 버전 정보를 추가합니다.

**파일: `spec-repositories.html`** (또는 배포할 HTML 파일)

```html
<footer class="bg-dark text-white pt-5 pb-3 mt-4">
    <div class="container">
        <!-- ... 기존 footer 내용 ... -->
        <hr class="border-secondary">
        <div class="text-center py-3">
            <p class="small text-muted mb-0">&copy; 2025 Song Jaeho. All rights reserved.</p>
            <!-- 버전 정보 추가 -->
            <p class="small text-muted mb-0 mt-1">Version: v2025.11.07.001</p>
        </div>
    </div>
</footer>
```

**버전 명명 규칙:**
- 형식: `vYYYY.MM.DD.NNN`
- 예시: `v2025.11.07.001` (2025년 11월 7일, 첫 번째 배포)
- NNN: 같은 날 여러 번 배포 시 증가 (001, 002, 003, ...)

### 단계 2: 변경사항 커밋 및 푸시

```bash
cd sedai-homepage

# 변경 파일 스테이징
git add spec-repositories.html

# 커밋 (명확한 메시지 작성)
git commit -m "feat: Add version display v2025.11.07.001 to spec-repositories page footer

Added version information at the bottom of the page to track deployments and verify successful updates on production site.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# GitHub에 푸시
git push origin main
```

**커밋 메시지 규칙:**
- Conventional Commits 형식 사용
- 타입: feat, fix, docs, chore 등
- 버전 정보 명시

### 단계 3: 배포 완료 대기

GitHub Pages는 푸시 후 자동으로 배포를 시작합니다.

**배포 소요 시간:**
- 평균: 약 **50초**
- 범위: 30초 ~ 2분
- 요인: GitHub Actions 큐, 캐시 상태, 파일 크기

**대기 명령어:**
```bash
echo "Waiting 55 seconds for deployment to complete..."
sleep 55
echo "Deployment should be complete now."
```

**GitHub Actions 진행 상황 확인:**
```bash
# GitHub CLI 사용
gh workflow list
gh run list --limit 1
gh run view <run-id> --log
```

또는 GitHub 웹사이트:
- Repository → Actions 탭
- 최근 workflow run 확인

### 단계 4: 배포 검증 - 버전 확인

배포가 완료되었는지 프로덕션 사이트에서 버전 정보를 확인합니다.

**방법 1: wget 사용**
```bash
wget -q -O - https://sedai.dev/spec-repositories.html | grep -i "version"
```

**예상 출력:**
```html
<p class="small text-muted mb-0 mt-1">Version: v2025.11.07.001</p>
```

**방법 2: curl 사용**
```bash
curl -s https://sedai.dev/spec-repositories.html | grep -i "version"
```

**방법 3: 브라우저에서 확인**
1. `https://sedai.dev/spec-repositories.html` 접속
2. 페이지 하단으로 스크롤
3. Footer에서 "Version: v2025.11.07.001" 확인

**검증 성공 기준:**
- ✅ 버전 정보가 표시됨
- ✅ 버전 번호가 최신 커밋과 일치함
- ✅ 페이지가 정상적으로 로드됨

**검증 실패 시:**
- 브라우저 캐시 삭제 후 재확인 (Cmd+Shift+R / Ctrl+Shift+F5)
- 배포 시간 추가 대기 (1~2분)
- GitHub Actions 로그 확인

### 단계 5: 배포 검증 - App Check 상태 확인

Firebase App Check가 프로덕션 환경에서 정상 작동하는지 확인합니다.

**방법 1: 브라우저 콘솔 확인**
1. `https://sedai.dev/spec-repositories.html` 접속
2. 브라우저 개발자 도구 열기 (F12)
3. Console 탭 확인

**정상 상태 (성공):**
```
[App Check] 🌐 Production mode - Domain: sedai.dev
[App Check] Initializing with reCAPTCHA Enterprise...
[App Check] ✅ Initialized successfully (Production mode)
[App Check] reCAPTCHA Enterprise is active
[repository] Initializing module...
[repository] Module initialized successfully
```

**에러 상태 (실패):**
```
POST https://content-firebaseappcheck.googleapis.com/.../exchangeRecaptchaEnterpriseToken 400 (Bad Request)

[App Check] ❌ Initialization failed
[App Check] 🚨 PRODUCTION ERROR: Please verify the following:
  1. Domain "sedai.dev" is added to reCAPTCHA Enterprise key
  2. reCAPTCHA key: 6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP
  3. Check Google Cloud Console: https://console.cloud.google.com/security/recaptcha

[FIREBASE WARNING: Invalid appcheck token]
```

**방법 2: Firebase Console 확인**
1. [Firebase Console](https://console.firebase.google.com) 접속
2. `sedai-firebase` 프로젝트 선택
3. 좌측 메뉴: **빌드 > App Check**
4. **Metrics** 탭 확인
5. "Verified requests" 그래프에서 프로덕션 트래픽 확인

**검증 성공 기준:**
- ✅ Console에 에러 없음
- ✅ reCAPTCHA 배지가 페이지 우하단에 표시됨
- ✅ Firebase 요청이 정상적으로 완료됨
- ✅ Repository 리스트가 정상 로드됨

## Firebase App Check 프로덕션 설정

### 사전 요구사항: reCAPTCHA Enterprise 도메인 등록 (필수)

⚠️ **중요**: 프로덕션 배포 **전에 반드시** 다음 설정을 완료해야 합니다.

**증상 (설정하지 않은 경우):**
```
POST .../exchangeRecaptchaEnterpriseToken 400 (Bad Request)
AppCheck: 400 error
FIREBASE WARNING: Invalid appcheck token
```

**해결 방법:**

#### 1단계: Google Cloud Console 접속

1. [https://console.cloud.google.com/security/recaptcha](https://console.cloud.google.com/security/recaptcha) 접속
2. 프로젝트 선택: `sedai-firebase`

#### 2단계: reCAPTCHA 키 선택

1. 키 목록에서 사용 중인 키 찾기
   - 키 ID: `6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP`
   - 키 유형: `Enterprise`
2. 키 이름 클릭하여 상세 페이지로 이동

#### 3단계: 프로덕션 도메인 추가

1. **"도메인"** 또는 **"Domains"** 섹션 찾기
2. **"도메인 추가"** 또는 **"Add domain"** 버튼 클릭
3. 도메인 입력:
   ```
   sedai.dev
   ```
   - ⚠️ **주의**: 프로토콜(`https://`)이나 경로(`/`)는 포함하지 않음
   - ✅ 올바른 예: `sedai.dev`
   - ❌ 잘못된 예: `https://sedai.dev`, `sedai.dev/`
4. (선택) www 서브도메인 추가:
   ```
   www.sedai.dev
   ```
5. **저장** 클릭

#### 4단계: 설정 확인

도메인 목록에 다음이 포함되어 있는지 확인:
```
✓ sedai.dev
✓ www.sedai.dev (선택사항)
✓ localhost (개발용)
```

#### 5단계: 브라우저에서 검증

1. 브라우저 캐시 삭제 (Cmd+Shift+R / Ctrl+Shift+F5)
2. `https://sedai.dev/spec-repositories.html` 접속
3. 브라우저 콘솔에서 성공 메시지 확인:
   ```
   [App Check] ✅ Initialized successfully (Production mode)
   [App Check] reCAPTCHA Enterprise is active
   ```

**적용 시간:**
- 즉시 적용됨 (별도 배포 불필요)
- 브라우저 캐시 삭제 후 확인 권장

### 개발 환경 vs 프로덕션 환경

#### 개발 환경 (localhost)

- 환경 감지: `window.location.hostname === 'localhost'`
- App Check 모드: **Debug Mode**
- reCAPTCHA: 표시되지 않음
- 디버그 토큰: 자동 생성 (UUID 형식)
- 토큰 등록: Firebase Console에 수동 등록 필요

**콘솔 로그:**
```
[App Check] 🔧 Debug mode enabled - Check console for debug token
Firebase App Check debug token: 19c97634-f808-4fd9-99a8-e5135ce88f5e
[App Check] ✅ Initialized successfully (Debug mode)
```

#### 프로덕션 환경 (sedai.dev)

- 환경 감지: `window.location.hostname !== 'localhost'`
- App Check 모드: **Production Mode**
- reCAPTCHA: 페이지 우하단에 배지 표시
- 검증 방식: reCAPTCHA Enterprise 토큰 교환
- 도메인 등록: Google Cloud Console에서 사전 등록 필수

**콘솔 로그:**
```
[App Check] 🌐 Production mode - Domain: sedai.dev
[App Check] Initializing with reCAPTCHA Enterprise...
[App Check] ✅ Initialized successfully (Production mode)
[App Check] reCAPTCHA Enterprise is active
```

## 테스트 시나리오

### 시나리오 1: 버전 정보 표시 검증

**목적:** 배포된 HTML 파일에 버전 정보가 올바르게 표시되는지 확인

**단계:**
1. 로컬에서 버전 정보 추가 (`v2025.11.07.001`)
2. 변경사항 커밋 및 푸시
3. 55초 대기
4. `wget -q -O - https://sedai.dev/spec-repositories.html | grep -i "version"` 실행

**예상 결과:**
```html
<p class="small text-muted mb-0 mt-1">Version: v2025.11.07.001</p>
```

**성공 기준:**
- ✅ 버전 정보가 정확히 표시됨
- ✅ 버전 번호가 최신 커밋과 일치

### 시나리오 2: App Check 프로덕션 정상 작동 검증

**목적:** Firebase App Check가 프로덕션 환경에서 정상적으로 작동하는지 확인

**전제조건:**
- `sedai.dev` 도메인이 reCAPTCHA Enterprise 키에 등록되어 있어야 함

**단계:**
1. 브라우저에서 `https://sedai.dev/spec-repositories.html` 접속
2. 개발자 도구 Console 탭 열기
3. App Check 초기화 로그 확인
4. reCAPTCHA 배지가 페이지 우하단에 표시되는지 확인
5. Repository 리스트가 정상 로드되는지 확인

**예상 결과:**
```
[App Check] 🌐 Production mode - Domain: sedai.dev
[App Check] Initializing with reCAPTCHA Enterprise...
[App Check] ✅ Initialized successfully (Production mode)
[App Check] reCAPTCHA Enterprise is active
[repository] Initializing module...
[repository] Module initialized successfully
[repository] Received snapshot update
```

**성공 기준:**
- ✅ Console에 App Check 에러 없음
- ✅ reCAPTCHA 배지 표시됨
- ✅ Repository 데이터 로드 성공
- ✅ Firebase Realtime Database 읽기 성공

### 시나리오 3: 도메인 미등록 시 에러 처리 검증

**목적:** 도메인이 등록되지 않았을 때 명확한 에러 메시지가 표시되는지 확인

**전제조건:**
- `sedai.dev` 도메인이 reCAPTCHA Enterprise 키에 등록되어 있지 않아야 함 (테스트용)

**단계:**
1. Google Cloud Console에서 `sedai.dev` 도메인 제거 (테스트 목적)
2. 브라우저 캐시 삭제 (Cmd+Shift+R)
3. `https://sedai.dev/spec-repositories.html` 접속
4. 개발자 도구 Console 탭 확인

**예상 결과:**
```
POST .../exchangeRecaptchaEnterpriseToken 400 (Bad Request)

[App Check] ❌ Initialization failed
[App Check] 🚨 PRODUCTION ERROR: Please verify the following:
  1. Domain "sedai.dev" is added to reCAPTCHA Enterprise key
  2. reCAPTCHA key: 6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP
  3. Check Google Cloud Console: https://console.cloud.google.com/security/recaptcha

[FIREBASE WARNING: Invalid appcheck token]
```

**성공 기준:**
- ✅ 에러 메시지가 명확하게 표시됨
- ✅ Google Cloud Console 링크가 제공됨
- ✅ 필요한 조치가 명시되어 있음

**복구:**
- 테스트 후 `sedai.dev` 도메인을 다시 reCAPTCHA Enterprise 키에 등록

### 시나리오 4: GitHub Actions 배포 파이프라인 검증

**목적:** 자동 배포 파이프라인이 정상적으로 작동하는지 확인

**단계:**
1. 로컬에서 HTML 파일 수정 (버전 증가)
2. Git 커밋 및 푸시
3. GitHub Actions 웹사이트 접속
   - Repository → Actions 탭
4. 최근 workflow run 클릭
5. 각 단계별 로그 확인

**예상 결과:**
- ✅ "Build and Deploy" workflow 자동 실행
- ✅ 모든 단계 성공 (녹색 체크)
- ✅ 배포 완료 알림

**성공 기준:**
- ✅ Workflow가 에러 없이 완료됨
- ✅ 배포 시간이 50초 ~ 2분 이내
- ✅ 프로덕션 사이트에 변경사항 반영됨

## 트러블슈팅

### 문제 1: 배포 후 버전이 업데이트되지 않음

**증상:**
```bash
wget -q -O - https://sedai.dev/spec-repositories.html | grep -i "version"
# 이전 버전이 표시됨
```

**원인:**
- GitHub Actions 배포가 아직 완료되지 않음
- 브라우저 또는 CDN 캐시
- GitHub Pages 빌드 실패

**해결 방법:**

1. **배포 완료 대기**
   ```bash
   # 추가로 1~2분 대기
   sleep 120
   wget -q -O - https://sedai.dev/spec-repositories.html | grep -i "version"
   ```

2. **GitHub Actions 로그 확인**
   - GitHub Repository → Actions 탭
   - 최근 workflow run 클릭
   - 에러 로그 확인

3. **브라우저 캐시 삭제**
   - 강력 새로고침: Cmd+Shift+R (Mac) / Ctrl+Shift+F5 (Windows)
   - 또는 시크릿 모드에서 접속

4. **CDN 캐시 무효화**
   ```bash
   # 캐시 버스팅 파라미터 추가
   wget -q -O - https://sedai.dev/spec-repositories.html?v=$(date +%s) | grep -i "version"
   ```

### 문제 2: App Check 400 Bad Request 에러

**증상:**
```
POST .../exchangeRecaptchaEnterpriseToken 400 (Bad Request)
[App Check] ❌ Initialization failed
[FIREBASE WARNING: Invalid appcheck token]
```

**원인:**
- 프로덕션 도메인이 reCAPTCHA Enterprise 키에 등록되지 않음

**해결 방법:**

1. **Google Cloud Console에서 도메인 추가**
   - [https://console.cloud.google.com/security/recaptcha](https://console.cloud.google.com/security/recaptcha) 접속
   - 프로젝트 `sedai-firebase` 선택
   - 키 `6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP` 클릭
   - "도메인" 섹션에서 `sedai.dev` 추가
   - 저장

2. **브라우저 캐시 삭제 및 재접속**
   ```bash
   # Chrome
   Cmd+Shift+R (Mac) / Ctrl+Shift+F5 (Windows)

   # 또는 시크릿 모드
   Cmd+Shift+N (Mac) / Ctrl+Shift+N (Windows)
   ```

3. **성공 확인**
   - 브라우저 콘솔에서 다음 메시지 확인:
     ```
     [App Check] ✅ Initialized successfully (Production mode)
     ```

**참고 문서:**
- `sedaiweb-firebase-security-testing.md` - 에러 0: Missing appcheck token

### 문제 3: reCAPTCHA 배지가 표시되지 않음

**증상:**
- 페이지 우하단에 reCAPTCHA 배지가 없음
- Console에 "Fetch failed loading: POST www.google.com/recaptcha/enterprise/clr" 에러

**원인:**
- reCAPTCHA Enterprise API가 차단됨 (방화벽, 광고 차단기)
- 잘못된 사이트 키
- reCAPTCHA Enterprise API 비활성화

**해결 방법:**

1. **광고 차단기 비활성화**
   - AdBlock, uBlock Origin 등 임시 비활성화
   - 페이지 새로고침

2. **방화벽/보안 소프트웨어 확인**
   - `www.google.com` 도메인이 차단되지 않았는지 확인
   - 네트워크 관리자에게 문의

3. **reCAPTCHA Enterprise API 활성화 확인**
   - [https://console.cloud.google.com/apis/library/recaptchaenterprise.googleapis.com](https://console.cloud.google.com/apis/library/recaptchaenterprise.googleapis.com)
   - "사용 설정" 버튼 확인

4. **사이트 키 확인**
   - `spec-repositories.js` 파일 확인
   - 클라이언트 키: `6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP`

### 문제 4: GitHub Actions 배포 실패

**증상:**
- GitHub Actions workflow run이 실패 (빨간색 X)
- 에러 메시지: "Failed to deploy"

**원인:**
- GitHub Pages 설정 문제
- 잘못된 파일 경로
- 권한 문제

**해결 방법:**

1. **GitHub Actions 로그 확인**
   - Repository → Actions 탭
   - 실패한 workflow run 클릭
   - 각 단계별 에러 로그 확인

2. **GitHub Pages 설정 확인**
   - Repository → Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` (또는 `gh-pages`)
   - Folder: `/` (root)

3. **로컬에서 빌드 테스트**
   ```bash
   cd sedai-homepage

   # 파일 구조 확인
   ls -la

   # HTML 파일 유효성 검증
   npm install -g html-validator-cli
   html-validator --file=spec-repositories.html
   ```

4. **재배포 시도**
   ```bash
   git commit --allow-empty -m "chore: trigger redeployment"
   git push origin main
   ```

### 문제 5: Firebase Realtime Database 읽기 실패

**증상:**
```
[repository] Received snapshot update
Error: Permission denied
```

**원인:**
- Firebase Realtime Database 보안 규칙에서 App Check 토큰 검증 실패
- App Check 토큰이 유효하지 않음

**해결 방법:**

1. **App Check 상태 확인**
   - 문제 2 참조 (도메인 등록 확인)

2. **Firebase Realtime Database 보안 규칙 확인**
   ```json
   {
     "rules": {
       "repository": {
         ".read": "request.app != null",
         ".write": "auth != null && request.app != null"
       }
     }
   }
   ```

3. **Firebase Console에서 App Check 메트릭 확인**
   - Firebase Console → App Check → Metrics
   - "Verified requests" 그래프 확인
   - 프로덕션 트래픽이 표시되는지 확인

**참고 문서:**
- `sedaiweb-firebase-security.md` - Realtime Database 보안 규칙

## 검증 체크리스트

배포 완료 후 다음 항목을 확인하세요:

### 버전 표시
- [ ] HTML 파일에 버전 정보 추가
- [ ] 버전 번호가 최신 커밋과 일치
- [ ] 프로덕션 사이트에서 버전 표시 확인

### Git 및 배포
- [ ] 변경사항 커밋 완료
- [ ] GitHub에 푸시 완료
- [ ] GitHub Actions workflow 성공
- [ ] 배포 시간 (50초 ~ 2분) 대기

### Firebase App Check 설정
- [ ] reCAPTCHA Enterprise 도메인 등록 (`sedai.dev`)
- [ ] Google Cloud Console에서 도메인 목록 확인
- [ ] reCAPTCHA Enterprise API 활성화

### 프로덕션 검증
- [ ] 브라우저에서 사이트 정상 접속
- [ ] Console에 App Check 에러 없음
- [ ] reCAPTCHA 배지 표시됨
- [ ] Repository 리스트 정상 로드
- [ ] Firebase Realtime Database 읽기 성공

### 브라우저 테스트
- [ ] Chrome에서 테스트
- [ ] Firefox에서 테스트
- [ ] Safari에서 테스트 (macOS)
- [ ] Edge에서 테스트 (Windows)
- [ ] 모바일 브라우저에서 테스트

## 추가 리소스

- **GitHub Pages 문서**: https://docs.github.com/pages
- **Firebase App Check 문서**: https://firebase.google.com/docs/app-check
- **reCAPTCHA Enterprise**: https://cloud.google.com/recaptcha-enterprise/docs
- **관련 명세**:
  - `sedaiweb-firebase-security.md` - Firebase 보안 설정
  - `sedaiweb-firebase-security-testing.md` - 상세 테스트 가이드
  - `sedaiweb-development-run.md` - 로컬 개발 환경

## 버전 히스토리

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| 1.0.0 | 2025-11-07 | 초기 버전 - 배포 프로세스 및 검증 가이드 작성 |

---

**작성자:** Song Jaeho (thruthesky@gmail.com)
**최종 수정일:** 2025-11-07
**라이선스:** MIT
