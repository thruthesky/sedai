---
name: sedaiweb-firebase-login
version: 1.0.0
description: Firebase Phone Authentication implementation specification for SEDAI web
author: Song Jaeho
email: thruthesky@gmail.com
license: MIT
step: 15
dependencies: sedai-homepage/specs/sedaiweb-firebase-setup.md
---

# SEDAI Firebase Phone Authentication Specification

## Overview

이 문서는 README.md가 정의한 SED 철학("AI develops exactly as the spec defines — no interpretation, no assumption")에 따라, Firebase Phone Authentication을 SEDAI 웹사이트에 정확하게 구현하는 명세를 제공합니다.

Firebase Phone Authentication은 사용자가 전화번호를 사용하여 인증할 수 있도록 하며, SMS를 통해 인증 코드를 받아 로그인을 완료합니다. 이 문서는 `sedaiweb-firebase-setup.md`가 정의한 Firebase 설정을 기반으로 합니다.

**보안 고려사항**: Firebase 공식 문서에 따르면, 전화번호 기반 인증은 이메일/비밀번호 인증, OAuth보다 보안 수준이 낮습니다. 사용자에게 보안 트레이드오프를 명확히 고지하고, 중요한 민감 정보를 다루는 서비스에서는 추가 인증 방법을 병행하는 것이 권장됩니다.

## Requirements

### Firebase 설정

- **Firebase Project**: `sedai-firebase` (프로젝트 ID)
- **Firebase SDK**: v12.5.0 (CDN, ES Module)
- **인증 방법 활성화**: Firebase Console > Authentication > Sign-in method > Phone 활성화 필요
- **OAuth 리다이렉트 도메인 승인**: Firebase Console > Authentication > Settings > Authorized domains
  - 프로덕션 도메인 추가 필요
  - localhost는 기본적으로 허용됨 (개발 시 사용)

### 클라이언트 요구사항

- **reCAPTCHA 지원**: 최신 브라우저 필수 (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+)
- **JavaScript 활성화** 필요
- **인터넷 연결** 필요 (reCAPTCHA 검증)

### 의존성

```javascript
// Firebase Authentication imports
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
```

## Workflow

전화번호 인증 프로세스는 다음 7단계로 진행됩니다:

1. **RecaptchaVerifier 초기화**
   - 페이지 로드 시 RecaptchaVerifier 객체 생성
   - Invisible 또는 Visible 모드 선택

2. **전화번호 입력**
   - 사용자로부터 전화번호 입력 받음
   - E.164 형식 검증 (예: +821012345678)

3. **SMS 인증 코드 전송**
   - `signInWithPhoneNumber()` 함수 호출
   - Firebase가 SMS로 6자리 인증 코드 전송
   - `ConfirmationResult` 객체 반환

4. **인증 코드 입력**
   - 사용자가 SMS로 받은 6자리 코드 입력
   - UI에 코드 입력 폼 표시

5. **코드 검증**
   - `confirmationResult.confirm(code)` 호출
   - Firebase가 코드를 검증하고 인증

6. **로그인 완료**
   - 성공 시 `UserCredential` 객체 반환
   - `onAuthStateChanged` 리스너로 로그인 상태 감지

7. **후속 처리**
   - 사용자 정보 저장 및 UI 업데이트
   - 필요시 다른 페이지로 리다이렉트

## Details

### 1. RecaptchaVerifier 설정

RecaptchaVerifier는 봇 방지를 위한 필수 컴포넌트입니다.

#### 1.1 Invisible reCAPTCHA (권장)

**사용 시점**: 사용자 경험을 해치지 않으면서 봇 방지를 하고 싶을 때 사용

**구현 코드**:

```javascript
// 파일: assets/js/auth.js
import { getAuth, RecaptchaVerifier } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

const auth = getAuth();

// Invisible reCAPTCHA 설정
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
  'size': 'invisible',
  'callback': (response) => {
    // reCAPTCHA 검증 성공 시 SMS 전송 시작
    console.log('reCAPTCHA verified');
  },
  'expired-callback': () => {
    // reCAPTCHA 만료 시 처리
    console.warn('reCAPTCHA expired. Please try again.');
  }
});
```

**HTML 요소**:

```html
<!-- sign-in-button ID를 가진 버튼에 reCAPTCHA가 자동으로 연결됨 -->
<button id="sign-in-button" class="btn btn-primary">Send SMS Code</button>
```

#### 1.2 Visible reCAPTCHA 옵션

**사용 시점**: 사용자에게 명시적으로 reCAPTCHA 체크박스를 보여주고 싶을 때 사용

**구현 코드**:

```javascript
// Visible reCAPTCHA 설정
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  'size': 'normal',
  'callback': (response) => {
    // reCAPTCHA 완료
    console.log('reCAPTCHA solved');
    // SMS 전송 버튼 활성화 가능
  },
  'expired-callback': () => {
    // reCAPTCHA 만료
    console.warn('reCAPTCHA expired');
  }
});

// reCAPTCHA 위젯 렌더링
window.recaptchaVerifier.render().then((widgetId) => {
  window.recaptchaWidgetId = widgetId;
});
```

**HTML 요소**:

```html
<!-- reCAPTCHA 위젯이 표시될 컨테이너 -->
<div id="recaptcha-container"></div>
<button id="send-sms-button" class="btn btn-primary">Send SMS Code</button>
```

#### 1.3 reCAPTCHA 언어 설정

```javascript
// 한국어로 reCAPTCHA 표시
auth.languageCode = 'ko';

// 또는 브라우저의 기본 언어 사용
auth.useDeviceLanguage();
```

### 2. 전화번호 인증 플로우

#### 2.1 전화번호 입력 및 검증

**함수 시그니처**: `validatePhoneNumber(phoneNumber: string): boolean`

**목적**: 사용자가 입력한 전화번호가 E.164 형식인지 검증

**파라미터**:
- `phoneNumber` (string, required): 검증할 입력 전화번호

**반환값**:
- `true`: 올바른 E.164 형식
- `false`: 잘못된 형식

**구현**:

```javascript
/**
 * 전화번호 E.164 형식 검증
 * @param {string} phoneNumber - 검증할 전화번호
 * @returns {boolean} 유효성 여부
 */
function validatePhoneNumber(phoneNumber) {
  // E.164 형식: +[국가코드][전화번호]
  // 예: +821012345678 (한국), +14155552671 (미국)
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}
```

**사용 예시**:

```javascript
const phoneInput = document.getElementById('phone-number').value.trim();

if (!validatePhoneNumber(phoneInput)) {
  showError('Please enter a valid phone number in E.164 format (e.g., +821012345678)');
  return;
}
```

#### 2.2 SMS 인증 코드 전송

**함수 시그니처**: `sendSmsCode(phoneNumber: string): Promise<ConfirmationResult>`

**목적**: Firebase를 통해 SMS 인증 코드 전송

**파라미터**:
- `phoneNumber` (string, required): E.164 형식 전화번호

**반환값**:
- `Promise<ConfirmationResult>`: 코드 검증에 사용할 ConfirmationResult 객체

**에러**:
- `auth/invalid-phone-number`: 잘못된 전화번호 형식
- `auth/too-many-requests`: SMS 전송 횟수 초과
- `auth/quota-exceeded`: 일일 SMS 할당량 초과

**구현**:

```javascript
import { getAuth, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

/**
 * SMS 인증 코드 전송
 * @param {string} phoneNumber - E.164 형식 전화번호
 * @returns {Promise<ConfirmationResult>}
 */
async function sendSmsCode(phoneNumber) {
  const auth = getAuth();
  const appVerifier = window.recaptchaVerifier;

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

    // ConfirmationResult를 전역 변수에 저장 (코드 검증 시 사용)
    window.confirmationResult = confirmationResult;

    console.log('SMS sent successfully');
    return confirmationResult;

  } catch (error) {
    console.error('SMS send failed:', error);

    // reCAPTCHA 리셋 (재시도를 위해)
    if (window.recaptchaWidgetId !== undefined) {
      grecaptcha.reset(window.recaptchaWidgetId);
    }

    throw error;
  }
}
```

**UI 통합**:

```javascript
// Send SMS 버튼 클릭 이벤트
document.getElementById('send-sms-button').addEventListener('click', async () => {
  const phoneNumber = document.getElementById('phone-number').value.trim();

  // 전화번호 검증
  if (!validatePhoneNumber(phoneNumber)) {
    showError('Invalid phone number format');
    return;
  }

  // 로딩 스피너 표시
  showLoading('Sending SMS code...');

  try {
    await sendSmsCode(phoneNumber);

    // SMS 전송 성공 시 코드 입력 UI 표시
    hideLoading();
    showSmsCodeInput();
    showSuccess('SMS code sent! Please check your phone.');

  } catch (error) {
    hideLoading();
    showError(getErrorMessage(error.code));
  }
});
```

### 3. SMS 코드 검증

**함수 시그니처**: `verifySmsCode(code: string): Promise<UserCredential>`

**목적**: 사용자가 입력한 SMS 코드를 검증하고 로그인 완료

**파라미터**:
- `code` (string, required): 6자리 SMS 인증 코드

**반환값**:
- `Promise<UserCredential>`: 로그인된 사용자 정보

**에러**:
- `auth/invalid-verification-code`: 잘못된 인증 코드
- `auth/code-expired`: 인증 코드 만료 (5분 경과)

**구현**:

```javascript
/**
 * SMS 인증 코드 검증 및 로그인
 * @param {string} code - 6자리 SMS 코드
 * @returns {Promise<UserCredential>}
 */
async function verifySmsCode(code) {
  if (!window.confirmationResult) {
    throw new Error('No confirmation result available. Please send SMS first.');
  }

  // 코드 형식 검증 (6자리 숫자)
  if (!/^\d{6}$/.test(code)) {
    throw new Error('SMS code must be 6 digits');
  }

  try {
    const result = await window.confirmationResult.confirm(code);
    const user = result.user;

    console.log('User signed in successfully:', user.uid);
    return result;

  } catch (error) {
    console.error('Code verification failed:', error);
    throw error;
  }
}
```

**UI 통합**:

```javascript
// Verify Code 버튼 클릭 이벤트
document.getElementById('verify-code-button').addEventListener('click', async () => {
  const code = document.getElementById('sms-code').value.trim();

  if (!code) {
    showError('Please enter the SMS code');
    return;
  }

  // 로딩 스피너 표시
  showLoading('Verifying code...');

  try {
    const userCredential = await verifySmsCode(code);

    hideLoading();
    showSuccess('Login successful!');

    // 로그인 완료 후 리다이렉트
    setTimeout(() => {
      window.location.href = 'spec-repositories.html';
    }, 1000);

  } catch (error) {
    hideLoading();
    showError(getErrorMessage(error.code));
  }
});
```

### 4. 인증 상태 관리

#### 4.1 로그인 상태 감지

**함수 시그니처**: `onAuthStateChanged(auth, callback)`

**목적**: 사용자 로그인/로그아웃 상태 변경을 실시간으로 감지

**구현**:

```javascript
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

const auth = getAuth();

// 인증 상태 리스너
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 로그인됨
    console.log('User logged in:', user.uid);
    console.log('Phone number:', user.phoneNumber);

    // UI 업데이트: 로그인 상태로 전환하여 표시
    updateUIForLoggedInUser(user);

  } else {
    // 로그아웃됨
    console.log('User logged out');

    // UI 업데이트: 로그아웃 상태로 전환하여 표시
    updateUIForLoggedOutUser();
  }
});
```

#### 4.2 로그아웃

**함수 시그니처**: `signOutUser(): Promise<void>`

**목적**: 현재 로그인된 사용자 로그아웃

**구현**:

```javascript
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

/**
 * 사용자 로그아웃
 * @returns {Promise<void>}
 */
async function signOutUser() {
  const auth = getAuth();

  try {
    await signOut(auth);
    console.log('User signed out successfully');

    // 로그아웃 후 로그인 페이지로 리다이렉트
    window.location.href = 'login.html';

  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}
```

**UI 연동**:

```javascript
// Logout 버튼 클릭 이벤트
document.getElementById('logout-button').addEventListener('click', async () => {
  try {
    await signOutUser();
  } catch (error) {
    showError('Logout failed. Please try again.');
  }
});
```

### 5. 에러 처리

#### 5.1 에러 코드 정의

```javascript
/**
 * Firebase Authentication 에러 코드 매핑
 */
const AuthErrorMessages = {
  // 전화번호 관련
  'auth/invalid-phone-number': 'Invalid phone number format. Please use E.164 format (e.g., +821012345678)',
  'auth/missing-phone-number': 'Phone number is required',

  // SMS 전송 관련
  'auth/too-many-requests': 'Too many SMS requests. Please try again later.',
  'auth/quota-exceeded': 'SMS quota exceeded. Please contact support.',

  // 인증 코드 관련
  'auth/invalid-verification-code': 'Invalid verification code. Please check and try again.',
  'auth/code-expired': 'Verification code has expired. Please request a new code.',
  'auth/missing-verification-code': 'Verification code is required',

  // reCAPTCHA 관련
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
  'auth/invalid-app-credential': 'Invalid app credential. Please check Firebase configuration.',

  // 기타
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/operation-not-allowed': 'Phone authentication is not enabled. Please contact support.',

  // 기본 메시지
  'default': 'An error occurred. Please try again.'
};

/**
 * 에러 코드를 사용자 친화적인 메시지로 변환
 * @param {string} errorCode - Firebase 에러 코드
 * @returns {string} 사용자 메시지
 */
function getErrorMessage(errorCode) {
  return AuthErrorMessages[errorCode] || AuthErrorMessages['default'];
}
```

#### 5.2 에러 상황 처리

1. **SMS 전송 실패 시**:
   - reCAPTCHA 리셋 (`grecaptcha.reset()`)
   - 사용자에게 에러 메시지 표시
   - 재시도 가능하도록 UI 상태 복원

2. **코드 검증 실패 시**:
   - 입력 필드 초기화
   - 에러 메시지 표시
   - 재입력 또는 새 코드 요청 옵션 제공

3. **네트워크 오류**:
   - 인터넷 연결 확인 요청
   - 재시도 버튼 제공

### 6. UI 명세

#### 6.1 로그인 페이지 (login.html)

**전체적인 구조**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - SEDAI</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4">Phone Login</h2>

                        <!-- 단계 1: 전화번호 입력 -->
                        <div id="phone-input-section">
                            <div class="mb-3">
                                <label for="phone-number" class="form-label">Phone Number</label>
                                <input type="tel"
                                       class="form-control"
                                       id="phone-number"
                                       placeholder="+821012345678"
                                       aria-describedby="phoneHelp">
                                <div id="phoneHelp" class="form-text">
                                    Enter your phone number in E.164 format (e.g., +821012345678 for Korea)
                                </div>
                                <div class="invalid-feedback" id="phone-error"></div>
                            </div>

                            <!-- Invisible reCAPTCHA는 버튼에 자동 연결 -->
                            <!-- Visible reCAPTCHA를 사용할 경우 아래 컨테이너 사용 -->
                            <!-- <div id="recaptcha-container" class="mb-3"></div> -->

                            <button id="sign-in-button" class="btn btn-primary w-100">
                                Send SMS Code
                            </button>
                        </div>

                        <!-- 단계 2: SMS 코드 입력 (초기에는 숨김) -->
                        <div id="code-input-section" class="d-none">
                            <div class="alert alert-info">
                                SMS code sent! Please check your phone.
                            </div>

                            <div class="mb-3">
                                <label for="sms-code" class="form-label">Verification Code</label>
                                <input type="text"
                                       class="form-control"
                                       id="sms-code"
                                       placeholder="123456"
                                       maxlength="6"
                                       pattern="\d{6}"
                                       aria-describedby="codeHelp">
                                <div id="codeHelp" class="form-text">
                                    Enter the 6-digit code sent to your phone
                                </div>
                                <div class="invalid-feedback" id="code-error"></div>
                            </div>

                            <button id="verify-code-button" class="btn btn-success w-100 mb-2">
                                Verify Code
                            </button>

                            <button id="resend-code-button" class="btn btn-outline-secondary w-100">
                                Resend Code
                            </button>
                        </div>

                        <!-- 로딩 스피너 -->
                        <div id="loading-spinner" class="text-center d-none">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2" id="loading-message">Processing...</p>
                        </div>

                        <!-- 성공/에러 피드백 -->
                        <div id="feedback-message" class="mt-3" aria-live="polite"></div>
                    </div>
                </div>

                <!-- 보안 경고 -->
                <div class="alert alert-warning mt-3" role="alert">
                    <strong>Security Notice:</strong> Phone authentication provides convenience but has lower security than email/password authentication. Please be aware of this trade-off.
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="assets/js/auth.js"></script>
</body>
</html>
```

#### 6.2 UI 제어 함수

```javascript
/**
 * 전화번호 입력 섹션 표시
 */
function showPhoneInputSection() {
  document.getElementById('phone-input-section').classList.remove('d-none');
  document.getElementById('code-input-section').classList.add('d-none');
}

/**
 * SMS 코드 입력 섹션 표시
 */
function showSmsCodeInput() {
  document.getElementById('phone-input-section').classList.add('d-none');
  document.getElementById('code-input-section').classList.remove('d-none');
}

/**
 * 로딩 스피너 표시
 * @param {string} message - 로딩 메시지
 */
function showLoading(message = 'Processing...') {
  document.getElementById('loading-message').textContent = message;
  document.getElementById('loading-spinner').classList.remove('d-none');
}

/**
 * 로딩 스피너 숨김
 */
function hideLoading() {
  document.getElementById('loading-spinner').classList.add('d-none');
}

/**
 * 성공 메시지 표시
 * @param {string} message - 성공 메시지
 */
function showSuccess(message) {
  const feedback = document.getElementById('feedback-message');
  feedback.innerHTML = `<div class="alert alert-success">${message}</div>`;
}

/**
 * 에러 메시지 표시
 * @param {string} message - 에러 메시지
 */
function showError(message) {
  const feedback = document.getElementById('feedback-message');
  feedback.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}

/**
 * 로그인 상태에서 UI 업데이트
 * @param {User} user - Firebase User 객체
 */
function updateUIForLoggedInUser(user) {
  // 페이지 상단에 사용자 정보 표시
  const userInfo = document.getElementById('user-info');
  if (userInfo) {
    userInfo.innerHTML = `
      <div class="text-white small mb-2">
        <i class="bi bi-person-circle"></i> ${user.phoneNumber}
      </div>
      <button id="logout-button" class="btn btn-sm btn-outline-light w-100">
        Logout
      </button>
    `;
  }
}

/**
 * 로그아웃 상태에서 UI 업데이트
 */
function updateUIForLoggedOutUser() {
  const userInfo = document.getElementById('user-info');
  if (userInfo) {
    userInfo.innerHTML = `
      <a href="login.html" class="btn btn-sm btn-outline-light w-100">
        Login
      </a>
    `;
  }
}
```

### 7. 보안 고려사항

#### 7.1 Firebase Console 설정

**Phone Authentication 활성화**:
1. Firebase Console 접속
2. Authentication > Sign-in method 선택
3. Phone 활성화
4. Test phone numbers 설정 (개발 시 사용, 실제 프로덕션에서는 제거)

**OAuth 리다이렉트 도메인 승인**:
1. Authentication > Settings 선택
2. Authorized domains에 프로덕션 도메인 추가
3. localhost는 기본적으로 허용됨

#### 7.2 SMS 할당량 및 제한

- **일일 할당량**: 약 10,000 SMS (Firebase 무료 플랜)
- **Rate limiting**: IP당 하루 3번 SMS 전송
- **코드 유효 기간**: 5분
- **재시도 제한**: 최대 30초마다 전송

#### 7.3 보안 권장사항

1. **reCAPTCHA 필수 사용**: 봇 방지
2. **테스트 제한 설정**: Firebase Console에서 특정 국가만 허용 가능 (프로덕션)
3. **다중 인증 요소 권장**: 전화번호 인증만으로는 OAuth와 비교해 보안 취약
4. **사용자 교육**: 보안 트레이드오프를 명시적으로 경고
5. **로그 모니터링**: 의심스러운 SMS 전송 패턴 감지

### 8. 테스트

#### 8.1 테스트 체크리스트

- [ ] RecaptchaVerifier가 정상적으로 초기화됨
- [ ] 올바른 전화번호로 SMS 전송 성공
- [ ] 잘못된 전화번호 입력 시 에러 메시지 표시
- [ ] SMS 코드가 5분 내에 도착함
- [ ] 정확한 코드 입력 시 로그인 성공
- [ ] 잘못된 코드 입력 시 에러 메시지 표시
- [ ] 코드 만료 시 재시도 가능 여부 확인
- [ ] reCAPTCHA 만료 시 재시도 가능
- [ ] 로그인 상태가 `onAuthStateChanged`로 감지됨
- [ ] 로그아웃 기능 정상 작동
- [ ] 모바일 브라우저에서 정상 작동
- [ ] 네트워크 오류 시 적절한 에러 메시지 표시

#### 8.2 테스트 시나리오

**Happy Path (정상 플로우)**:
1. 로그인 페이지 접속
2. 전화번호 입력 (+821012345678)
3. "Send SMS Code" 버튼 클릭
4. reCAPTCHA 검증 통과
5. SMS 수신 확인
6. 6자리 코드 입력
7. "Verify Code" 버튼 클릭
8. 로그인 완료 및 spec-repositories.html로 리다이렉트

**에러 시나리오 1 (잘못된 전화번호)**:
1. 전화번호 입력 (잘못된 형식: 01012345678)
2. "Send SMS Code" 버튼 클릭
3. 에러 메시지 표시: "Invalid phone number format..."

**에러 시나리오 2 (잘못된 코드)**:
1. 전화번호 입력 및 SMS 전송 성공
2. 잘못된 코드 입력 (123456 대신 000000)
3. "Verify Code" 버튼 클릭
4. 에러 메시지 표시: "Invalid verification code..."

**에러 시나리오 3 (코드 만료)**:
1. 전화번호 입력 및 SMS 전송 성공
2. 5분 경과 대기
3. 코드 입력 및 검증 시도
4. 에러 메시지 표시: "Verification code has expired..."
5. "Resend Code" 버튼으로 재시도

#### 8.3 테스트 전화번호 (개발 시 사용)

Firebase Console에서 테스트 전화번호 설정 가능:

**예시**:
- 전화번호: +82 10 1234 5678
- SMS 코드: 123456

실제 SMS 전송 없이 테스트 가능.

## 참고자료

- Firebase Phone Authentication 공식 문서: https://firebase.google.com/docs/auth/web/phone-auth
- Firebase JavaScript SDK 참고: https://firebase.google.com/docs/reference/js/auth
- reCAPTCHA v3 문서: https://developers.google.com/recaptcha/docs/v3
- E.164 전화번호 형식: https://en.wikipedia.org/wiki/E.164

## Implementation Hand-off

- 이 문서는 **Firebase Phone Authentication 구현 방법**을 정의합니다.
- 모든 UI 구현, 페이지 구조, 에러 처리 등 세부 사항을 포함한 구현 가이드입니다.
- `sedaiweb-repository-implementation.md`와 함께 사용하여 로그인한 사용자만 Repository를 제출할 수 있도록 합니다.
