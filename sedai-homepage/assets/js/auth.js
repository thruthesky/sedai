/**
 * Firebase Email/Password Authentication Module
 *
 * Firebase Email/Password Authentication을 사용하여 로그인을 구현합니다.
 * - 이메일/비밀번호 로그인
 * - 자동 회원가입 (계정이 없을 경우)
 * - 인증 상태 관리
 * - 로그아웃 기능
 */

// Firebase SDK imports (ES Module)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app-check.js';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
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
    console.log('[App Check] 🔧 Debug mode enabled - Check console for debug token');
} else {
    // 프로덕션 환경
    console.log(`[App Check] 🌐 Production mode - Domain: ${window.location.hostname}`);
}

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// App Check 초기화 (반드시 다른 Firebase 서비스보다 먼저 초기화)
let appCheck;
try {
    console.log('[App Check] Initializing with reCAPTCHA Enterprise...');
    appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider('6Lc4HAUsAAAAABJ8FeyXPeprPHh0njp4PPcKtMfm'),
        isTokenAutoRefreshEnabled: true // 토큰 자동 갱신 활성화
    });

    if (isDevelopment) {
        console.log('[App Check] ✅ Initialized successfully (Debug mode)');
    } else {
        console.log('[App Check] ✅ Initialized successfully (Production mode)');
        console.log('[App Check] reCAPTCHA Enterprise is active');
    }
} catch (error) {
    console.error('[App Check] ❌ Initialization failed:', error);

    if (!isDevelopment) {
        // 프로덕션 환경에서 실패 시 도메인 설정 확인 안내
        console.error('[App Check] 🚨 PRODUCTION ERROR: Please verify the following:');
        console.error(`  1. Domain "${window.location.hostname}" is added to reCAPTCHA Enterprise key`);
        console.error('  2. reCAPTCHA key: 6Lc4HAUsAAAAABJ8FeyXPeprPHh0njp4PPcKtMfm');
        console.error('  3. Check Google Cloud Console: https://console.cloud.google.com/security/recaptcha');
    } else {
        console.error('[App Check] Register debug token in Firebase Console to continue');
    }
}

// 다른 Firebase 서비스 초기화
const auth = getAuth(app);

/**
 * 에러 코드별 메시지 매핑
 */
const AuthErrorMessages = {
    'auth/invalid-email': 'Invalid email address format.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email. Creating new account...',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    'auth/operation-not-allowed': 'Email/password authentication is not enabled.',
    'auth/invalid-credential': 'Invalid email or password. Creating new account...',
    'auth/missing-email': 'Email address is required.',
    'auth/missing-password': 'Password is required.'
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
 * 이메일 형식 검증
 * @param {string} email - 검증할 이메일
 * @returns {boolean} 유효성 여부
 */
function validateEmail(email) {
    // 기본 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 비밀번호 형식 검증
 * @param {string} password - 검증할 비밀번호
 * @returns {boolean} 유효성 여부
 */
function validatePassword(password) {
    // Firebase 최소 요구사항: 6자 이상
    return password && password.length >= 6;
}

/**
 * 이메일/비밀번호로 로그인 또는 회원가입
 * - 먼저 로그인 시도
 * - 계정이 없으면 자동으로 회원가입 후 로그인
 * @param {string} email - 이메일 주소
 * @param {string} password - 비밀번호
 * @returns {Promise<void>}
 */
async function signInOrRegister(email, password) {
    // 이메일 검증
    if (!validateEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }

    // 비밀번호 검증
    if (!validatePassword(password)) {
        showError('Password must be at least 6 characters long.');
        return;
    }

    // 로딩 표시
    showLoading(true);
    hideError();
    hideSuccess();

    try {
        // 먼저 로그인 시도
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        console.log('User signed in successfully:', user.uid);
        console.log('Email:', user.email);

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
        console.log('Login failed:', error.code);

        // 계정이 없거나 잘못된 인증 정보인 경우 자동으로 회원가입 시도
        if (error.code === 'auth/user-not-found' ||
            error.code === 'auth/invalid-credential' ||
            error.code === 'auth/invalid-login-credentials') {

            console.log('Account not found. Attempting to create new account...');
            showSuccess('Creating new account...');

            try {
                // 회원가입
                const registerResult = await createUserWithEmailAndPassword(auth, email, password);
                const newUser = registerResult.user;

                console.log('Account created successfully:', newUser.uid);
                console.log('Email:', newUser.email);

                // 성공 메시지
                showLoading(false);
                showSuccess('Account created! Redirecting...');

                // 리다이렉트
                setTimeout(() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectUrl = urlParams.get('redirect') || 'spec-repositories.html';
                    window.location.href = redirectUrl;
                }, 1500);

            } catch (registerError) {
                console.error('Account creation failed:', registerError);
                showLoading(false);
                showError(getErrorMessage(registerError.code));
            }
        } else {
            // 다른 에러 (예: 비밀번호 틀림)
            showLoading(false);
            showError(getErrorMessage(error.code));
        }
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

// =====================
// 이벤트 리스너 설정
// =====================

/**
 * 인증 모듈 초기화
 * - 이벤트 리스너 설정
 * - 인증 상태 리스너 설정
 */
export function initAuth() {
    console.log('Initializing auth module...');

    // 인증 상태 리스너 설정
    setupAuthStateListener();

    // Login 버튼 이벤트
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            await signInOrRegister(email, password);
        });
    }

    // Enter 키로 폼 제출
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                passwordInput?.focus();
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginButton?.click();
            }
        });
    }

    console.log('Auth module initialized successfully');
}

// =====================
// Export 함수들
// =====================

export {
    signInOrRegister,
    signOutUser,
    getCurrentUser,
    getAuth as getFirebaseAuth
};
