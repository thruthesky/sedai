/**
 * Firebase Phone Authentication Module
 *
 * Firebase Phone Authentication을 사용하여 전화번호 인증을 구현합니다.
 * - RecaptchaVerifier (Invisible 모드)
 * - SMS 코드 전송 및 검증
 * - 인증 상태 관리
 * - 로그아웃 기능
 */

// Firebase SDK imports (ES Module)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app-check.js';
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyCb6xetNmUryJB44czwe9BrQPwYaSee7Rs",
    authDomain: "sedai-firebase.firebaseapp.com",
    databaseURL: "https://sedai-firebase-default-rtdb.firebaseio.com",
    projectId: "sedai-firebase",
    storageBucket: "sedai-firebase.firebasestorage.app",
    messagingSenderId: "275784781126",
    appId: "1:275784781126:web:91b75808d32ec3fa28a947"
};

// 개발 환경 감지 및 디버그 모드 설정
const isDevelopment = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';

if (isDevelopment) {
    // 디버그 모드 활성화 (브라우저 콘솔에 디버그 토큰 표시)
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log('[App Check] Debug mode enabled - Check console for debug token');
}

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// App Check 초기화 (반드시 다른 Firebase 서비스보다 먼저 초기화)
let appCheck;
try {
    appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider('6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP'),
        isTokenAutoRefreshEnabled: true // 토큰 자동 갱신 활성화
    });
    console.log('[App Check] Initialized successfully');
} catch (error) {
    console.error('[App Check] Initialization failed:', error);
    // App Check 실패해도 앱 실행은 계속 (개발 중에는 디버그 토큰 등록 필요)
}

// 다른 Firebase 서비스 초기화
const auth = getAuth(app);

// 전역 변수
let recaptchaVerifier = null;
let confirmationResult = null;

/**
 * 에러 코드별 메시지 매핑
 */
const AuthErrorMessages = {
    'auth/invalid-phone-number': 'Invalid phone number format. Please use E.164 format (e.g., +821012345678)',
    'auth/too-many-requests': 'Too many SMS requests. Please try again later.',
    'auth/quota-exceeded': 'SMS quota exceeded. Please contact support.',
    'auth/invalid-verification-code': 'Invalid verification code. Please check and try again.',
    'auth/code-expired': 'Verification code has expired. Please request a new code.',
    'auth/missing-phone-number': 'Phone number is required.',
    'auth/missing-verification-code': 'Verification code is required.',
    'auth/invalid-app-credential': 'reCAPTCHA verification failed. Please try again.',
    'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/operation-not-allowed': 'Phone authentication is not enabled. Please contact support.'
};

/**
 * 에러 메시지 가져오기
 * @param {string} errorCode - Firebase 에러 코드
 * @returns {string} 사용자 친화적인 에러 메시지
 */
function getErrorMessage(errorCode) {
    return AuthErrorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
}

/**
 * 전화번호 형식 검증 (E.164)
 * @param {string} phoneNumber - 검증할 전화번호
 * @returns {boolean} 유효성 여부
 */
function validatePhoneNumber(phoneNumber) {
    // E.164 형식: +[국가코드][전화번호]
    // 예: +821012345678 (한국), +14155552671 (미국)
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
}

/**
 * SMS 코드 형식 검증 (6자리 숫자)
 * @param {string} code - 검증할 코드
 * @returns {boolean} 유효성 여부
 */
function validateSmsCode(code) {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
}

/**
 * RecaptchaVerifier 초기화 (Invisible 모드)
 * - send-sms-button에 연결된 Invisible reCAPTCHA 생성
 * - 사용자가 버튼을 클릭하면 자동으로 reCAPTCHA 검증 실행
 */
function initRecaptchaVerifier() {
    if (recaptchaVerifier) {
        return; // 이미 초기화됨
    }

    try {
        recaptchaVerifier = new RecaptchaVerifier(auth, 'send-sms-button', {
            'size': 'invisible',
            'callback': (response) => {
                console.log('reCAPTCHA verified successfully');
            },
            'expired-callback': () => {
                console.warn('reCAPTCHA expired. Please try again.');
                showError('reCAPTCHA expired. Please refresh the page and try again.');
            }
        });

        console.log('RecaptchaVerifier initialized successfully');
    } catch (error) {
        console.error('RecaptchaVerifier initialization failed:', error);
        showError('Failed to initialize reCAPTCHA. Please refresh the page.');
    }
}

/**
 * SMS 코드 전송
 * @param {string} phoneNumber - E.164 형식의 전화번호
 * @returns {Promise<void>}
 */
async function sendSmsCode(phoneNumber) {
    // 전화번호 검증
    if (!validatePhoneNumber(phoneNumber)) {
        showError('Please enter a valid phone number in E.164 format (e.g., +821012345678)');
        return;
    }

    // 로딩 표시
    showLoading(true);
    hideError();
    hideSuccess();

    try {
        // SMS 전송
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

        console.log('SMS sent successfully to', phoneNumber);

        // 성공 시 UI 업데이트
        showLoading(false);
        showSuccess('Verification code sent! Please check your phone.');
        switchToCodeStep();

    } catch (error) {
        console.error('SMS send failed:', error);
        showLoading(false);
        showError(getErrorMessage(error.code));

        // reCAPTCHA 리셋 (재시도를 위해)
        if (recaptchaVerifier) {
            try {
                recaptchaVerifier.clear();
                recaptchaVerifier = null;
                initRecaptchaVerifier(); // 재초기화
            } catch (resetError) {
                console.error('Failed to reset reCAPTCHA:', resetError);
            }
        }
    }
}

/**
 * SMS 코드 검증
 * @param {string} code - 6자리 SMS 코드
 * @returns {Promise<void>}
 */
async function verifySmsCode(code) {
    // confirmationResult 확인
    if (!confirmationResult) {
        showError('No verification in progress. Please send SMS code first.');
        return;
    }

    // 코드 형식 검증
    if (!validateSmsCode(code)) {
        showError('Verification code must be 6 digits.');
        return;
    }

    // 로딩 표시
    showLoading(true);
    hideError();
    hideSuccess();

    try {
        // 코드 검증
        const result = await confirmationResult.confirm(code);
        const user = result.user;

        console.log('User signed in successfully:', user.uid);
        console.log('Phone number:', user.phoneNumber);

        // 성공 메시지
        showLoading(false);
        showSuccess('Login successful! Redirecting...');

        // 리다이렉트 (redirect 파라미터가 있으면 해당 페이지로, 없으면 spec-repositories.html로)
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect') || 'spec-repositories.html';
            window.location.href = redirectUrl;
        }, 1500);

    } catch (error) {
        console.error('Code verification failed:', error);
        showLoading(false);
        showError(getErrorMessage(error.code));
    }
}

/**
 * 로그아웃
 * @returns {Promise<void>}
 */
async function signOutUser() {
    try {
        await signOut(auth);
        console.log('User signed out successfully');
        showSuccess('Logged out successfully');
    } catch (error) {
        console.error('Sign out failed:', error);
        showError('Failed to log out. Please try again.');
    }
}

/**
 * 현재 로그인된 사용자 가져오기
 * @returns {Promise<User|null>}
 */
function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

/**
 * 인증 상태 변경 리스너 설정
 */
function setupAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('User is signed in:', user.uid);
            console.log('Phone number:', user.phoneNumber);
            console.log('Email:', user.email);

            // 로그인 페이지에 있고 이미 로그인된 경우 리다이렉트
            if (window.location.pathname.includes('login.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                const redirectUrl = urlParams.get('redirect') || 'spec-repositories.html';
                console.log('User already logged in, redirecting to:', redirectUrl);
                window.location.href = redirectUrl;
            }
        } else {
            console.log('User is signed out');
        }
    });
}

// =====================
// UI 헬퍼 함수들
// =====================

/**
 * 에러 메시지 표시
 * @param {string} message - 에러 메시지
 */
function showError(message) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;

    alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

/**
 * 성공 메시지 표시
 * @param {string} message - 성공 메시지
 */
function showSuccess(message) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;

    alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

/**
 * 에러 메시지 숨기기
 */
function hideError() {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
}

/**
 * 성공 메시지 숨기기
 */
function hideSuccess() {
    hideError(); // 같은 컨테이너 사용
}

/**
 * 로딩 스피너 표시/숨기기
 * @param {boolean} show - 표시 여부
 */
function showLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (!spinner) return;

    if (show) {
        spinner.classList.add('active');
    } else {
        spinner.classList.remove('active');
    }
}

/**
 * 전화번호 입력 단계에서 코드 입력 단계로 전환
 */
function switchToCodeStep() {
    const phoneStep = document.getElementById('phone-step');
    const codeStep = document.getElementById('code-step');

    if (phoneStep) phoneStep.classList.remove('active');
    if (codeStep) codeStep.classList.add('active');
}

/**
 * 코드 입력 단계에서 전화번호 입력 단계로 전환
 */
function switchToPhoneStep() {
    const phoneStep = document.getElementById('phone-step');
    const codeStep = document.getElementById('code-step');

    if (phoneStep) phoneStep.classList.add('active');
    if (codeStep) codeStep.classList.remove('active');

    // 입력 필드 초기화
    const verificationCodeInput = document.getElementById('verification-code');
    if (verificationCodeInput) {
        verificationCodeInput.value = '';
    }
}

// =====================
// 이벤트 리스너 설정
// =====================

/**
 * 인증 모듈 초기화
 * - RecaptchaVerifier 초기화
 * - 이벤트 리스너 설정
 * - 인증 상태 리스너 설정
 */
export function initAuth() {
    console.log('Initializing auth module...');

    // RecaptchaVerifier 초기화
    initRecaptchaVerifier();

    // 인증 상태 리스너 설정
    setupAuthStateListener();

    // Send SMS 버튼 이벤트
    const sendSmsButton = document.getElementById('send-sms-button');
    if (sendSmsButton) {
        sendSmsButton.addEventListener('click', async () => {
            const phoneNumber = document.getElementById('phone-number').value.trim();
            await sendSmsCode(phoneNumber);
        });
    }

    // Verify Code 버튼 이벤트
    const verifyCodeButton = document.getElementById('verify-code-button');
    if (verifyCodeButton) {
        verifyCodeButton.addEventListener('click', async () => {
            const code = document.getElementById('verification-code').value.trim();
            await verifySmsCode(code);
        });
    }

    // Resend Code 버튼 이벤트
    const resendCodeButton = document.getElementById('resend-code-button');
    if (resendCodeButton) {
        resendCodeButton.addEventListener('click', () => {
            switchToPhoneStep();
            hideError();
            hideSuccess();
            showSuccess('Please enter your phone number again to receive a new code.');
        });
    }

    // Enter 키로 폼 제출
    const phoneInput = document.getElementById('phone-number');
    if (phoneInput) {
        phoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendSmsButton?.click();
            }
        });
    }

    const codeInput = document.getElementById('verification-code');
    if (codeInput) {
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyCodeButton?.click();
            }
        });

        // 숫자만 입력 가능하도록 제한
        codeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    console.log('Auth module initialized successfully');
}

// =====================
// Export 함수들
// =====================

export {
    sendSmsCode,
    verifySmsCode,
    signOutUser,
    getCurrentUser,
    getAuth as getFirebaseAuth
};
