/**
 * SEDAI Repository Module
 *
 * Firebase Realtime Database를 사용하여 Spec Repository 등록 및 조회 기능을 구현합니다.
 * - 인증 확인 (Firebase Auth)
 * - Repository 제출 폼 (유효성 검증 + RTDB 저장)
 * - Repository 리스트 실시간 구독 및 렌더링
 * - License 필터 기능
 * - 중복 체크 (email, specsUrl)
 */

// Firebase SDK imports (ES Module)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app-check.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import {
    getDatabase,
    ref,
    set,
    get,
    push,
    update,
    onValue,
    query,
    orderByChild,
    limitToLast,
    runTransaction,
    child
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

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
        provider: new ReCaptchaEnterpriseProvider('6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP'),
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
        console.error('  2. reCAPTCHA key: 6LcuKwUsAAAAAEczBhW_kNwvLOlLpSZqtv4UzPmP');
        console.error('  3. Check Google Cloud Console: https://console.cloud.google.com/security/recaptcha');
    } else {
        console.error('[App Check] Register debug token in Firebase Console to continue');
    }
}

// 다른 Firebase 서비스 초기화
const auth = getAuth(app);
const db = getDatabase(app);

// 허용된 라이선스 목록
const ALLOWED_LICENSES = [
    'SED 1.0',
    'MIT',
    'Apache-2.0',
    'GPL-3.0',
    'GPL-2.0',
    'LGPL-3.0',
    'LGPL-2.1',
    'BSD-3-Clause',
    'BSD-2-Clause',
    'ISC',
    'MPL-2.0',
    'AGPL-3.0',
    'Unlicense',
    'CC0-1.0',
    'CC-BY-4.0',
    'CC-BY-SA-4.0',
    'Proprietary'
];

// 에러 코드
const RepositoryErrorCode = {
    DUPLICATE_EMAIL: 'duplicate_email',
    DUPLICATE_URL: 'duplicate_url',
    FIREBASE_WRITE_FAILED: 'firebase_write_failed',
    VALIDATION_FAILED: 'validation_failed',
    AUTH_REQUIRED: 'auth_required'
};

// 전역 변수
let cachedElements = null;
let currentFilter = 'all';
let allRepositories = [];
let myRepositories = [];
let editingRepositoryId = null; // 편집 중인 repository ID

/**
 * SHA-256 해시 생성
 * @param {string} input - 해시할 문자열
 * @returns {Promise<string>} "sha256:..." 형식의 해시
 */
async function hashSha256(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `sha256:${hashHex}`;
}

/**
 * DOM 요소 캐싱
 * @returns {Object} 캐시된 DOM 요소들
 */
function cacheRepositoryDom() {
    return {
        form: document.getElementById('repository-form'),
        submitButton: document.getElementById('repository-submit-button'),
        registerButton: document.getElementById('register-button'),
        feedback: document.getElementById('repository-feedback'),
        list: document.getElementById('repository-list'),
        empty: document.getElementById('repository-empty'),
        filterLicense: document.getElementById('repository-filter-license'),
        licenseSelect: document.getElementById('license'),
        myList: document.getElementById('my-repository-list'),
        myEmpty: document.getElementById('my-repository-empty'),
        myNotLoggedIn: document.getElementById('my-repository-not-logged-in')
    };
}

/**
 * 라이선스 옵션 로드
 * @param {HTMLSelectElement} selectElement - Select 요소
 */
function preloadAllowedLicenses(selectElement) {
    if (!selectElement) return;

    ALLOWED_LICENSES.forEach(license => {
        const option = document.createElement('option');
        option.value = license;
        option.textContent = license;
        selectElement.appendChild(option);
    });
}

/**
 * 라이선스 필터 옵션 로드
 * @param {HTMLSelectElement} filterElement - Filter select 요소
 */
function loadLicenseFilterOptions(filterElement) {
    if (!filterElement) return;

    // 이미 로드된 경우 스킵
    if (filterElement.children.length > 1) return;

    ALLOWED_LICENSES.forEach(license => {
        const option = document.createElement('option');
        option.value = license;
        option.textContent = license;
        filterElement.appendChild(option);
    });
}

/**
 * 현재 사용자 인증 상태 확인
 * @returns {Promise<User|null>}
 */
async function checkUserAuthentication() {
    return auth.currentUser;
}

/**
 * 로그인 페이지로 리다이렉트
 * @param {string} returnUrl - 로그인 후 돌아올 URL
 */
function redirectToLogin(returnUrl) {
    const redirect = returnUrl || window.location.pathname;
    window.location.href = `login.html?redirect=${encodeURIComponent(redirect)}`;
}

/**
 * Repository 폼 표시
 */
function showRepositoryForm() {
    if (cachedElements && cachedElements.form) {
        cachedElements.form.classList.remove('d-none');
        cachedElements.registerButton.classList.add('d-none');
    }
}

/**
 * Repository 폼 숨김
 */
function hideRepositoryForm() {
    if (cachedElements && cachedElements.form) {
        cachedElements.form.classList.add('d-none');
        cachedElements.registerButton.classList.remove('d-none');
    }
}

/**
 * 폼 데이터 수집
 * @param {HTMLFormElement} form - 폼 요소
 * @returns {Object} 폼 데이터 객체
 */
function collectFormValues(form) {
    const formData = new FormData(form);
    const values = {};

    for (const [key, value] of formData.entries()) {
        values[key] = typeof value === 'string' ? value.trim() : value;
    }

    // homepage가 빈 문자열이면 null로 변환
    if (!values.homepage || values.homepage === '') {
        values.homepage = null;
    }

    return values;
}

/**
 * 입력값 유효성 검증
 * @param {Object} values - 검증할 값들
 * @returns {Object} { valid: boolean, errors: Map }
 */
function validateRepositoryValues(values) {
    const errors = new Map();

    // Name: 4~120자
    if (!values.repositoryName || values.repositoryName.length < 4 || values.repositoryName.length > 120) {
        errors.set('repositoryName', 'Spec name must be between 4 and 120 characters.');
    }

    // Description: 32~2000자
    if (!values.repositoryDescription || values.repositoryDescription.length < 32 || values.repositoryDescription.length > 2000) {
        errors.set('repositoryDescription', 'Description must be between 32 and 2000 characters.');
    }

    // Specs URL: HTTPS only
    try {
        const url = new URL(values.specsUrl);
        if (url.protocol !== 'https:') {
            errors.set('specsUrl', 'Specification URL must use HTTPS protocol.');
        }
        if (values.specsUrl.length > 512) {
            errors.set('specsUrl', 'Specification URL must be less than 512 characters.');
        }
    } catch (e) {
        errors.set('specsUrl', 'Must be a valid HTTPS URL.');
    }

    // Author: 2~80자, 숫자만으로 구성 불가
    if (!values.author || values.author.length < 2 || values.author.length > 80) {
        errors.set('author', 'Author name must be between 2 and 80 characters.');
    } else if (/^\d+$/.test(values.author)) {
        errors.set('author', 'Author name cannot be only numbers.');
    }

    // Email: 이메일 형식
    if (!values.email || !/.+@.+\..+/.test(values.email)) {
        errors.set('email', 'Must be a valid email address.');
    }

    // Homepage (Optional): HTTPS only
    if (values.homepage && values.homepage !== '') {
        try {
            const homepageUrl = new URL(values.homepage);
            if (homepageUrl.protocol !== 'https:') {
                errors.set('homepage', 'Homepage URL must use HTTPS protocol.');
            }
        } catch (e) {
            errors.set('homepage', 'Must be a valid HTTPS URL if provided.');
        }
    }

    // License: 허용된 목록 중 하나
    if (!values.license || !ALLOWED_LICENSES.includes(values.license)) {
        errors.set('license', 'Please select a valid license.');
    }

    return {
        valid: errors.size === 0,
        errors
    };
}

/**
 * 이메일 중복 체크
 * @param {string} emailHash - 이메일 해시
 * @returns {Promise<boolean>} 중복 여부
 */
async function checkEmailDuplicate(emailHash) {
    const emailIndexRef = ref(db, `repository/index/email/${emailHash}`);
    const snapshot = await get(emailIndexRef);
    return snapshot.exists();
}

/**
 * URL 중복 체크
 * @param {string} urlHash - URL 해시
 * @returns {Promise<boolean>} 중복 여부
 */
async function checkUrlDuplicate(urlHash) {
    const urlIndexRef = ref(db, `repository/index/specsUrl/${urlHash}`);
    const snapshot = await get(urlIndexRef);
    return snapshot.exists();
}

/**
 * Repository Payload 생성
 * @param {Object} values - 폼 값
 * @param {Object} user - 로그인한 사용자 정보
 * @returns {Promise<Object>} Payload 객체
 */
async function buildRepositoryPayload(values, user) {
    const now = Date.now();
    const repositoryId = `repo-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}-${Math.random().toString(36).slice(2, 8)}`;

    // URL에서 호스트 추출
    const specsUrl = new URL(values.specsUrl);
    const specsHost = specsUrl.hostname;

    // 정규화된 이름 (소문자 + 공백 제거)
    const normalizedName = values.repositoryName.toLowerCase().replace(/\s+/g, '-');

    // 해시 생성
    const emailHash = await hashSha256(values.email.toLowerCase());
    const specsUrlHash = await hashSha256(values.specsUrl);

    // License slug
    const licenseSlug = values.license.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // 사용자 정보 (로그인한 사용자의 정보 사용)
    const uid = user.uid;
    const phoneNumber = user.phoneNumber || '';
    const email = user.email || values.email;

    return {
        repositoryId,
        name: values.repositoryName,
        description: values.repositoryDescription,
        specsUrl: values.specsUrl,
        specsHost,
        author: values.author,
        email: email,
        homepage: values.homepage,
        license: values.license,
        status: 'pending',
        reviewComment: null,
        createdAt: now,
        updatedAt: now,
        createdIpHash: 'sha256:client-not-tracked', // 명세에 따라 고정값 사용
        uid,
        phoneNumber,
        metadata: {
            normalizedName,
            emailHash,
            specsUrlHash,
            licenseSlug,
            schemaVersion: 1,
            score: 0
        }
    };
}

/**
 * Repository를 RTDB에 저장
 * @param {Object} payload - Repository payload
 * @returns {Promise<void>}
 */
async function executeRepositoryWrite(payload) {
    const id = payload.repositoryId;

    try {
        // 1. 다중 경로 업데이트
        const updates = {};
        updates[`repository/entries/${id}`] = payload;
        updates[`repository/index/email/${payload.metadata.emailHash}/${id}`] = true;
        updates[`repository/index/specsUrl/${payload.metadata.specsUrlHash}/${id}`] = true;
        updates[`repository/index/license/${payload.metadata.licenseSlug}/${id}`] = true;

        await update(ref(db), updates);

        // 2. 통계 업데이트 (Transaction)
        await runTransaction(ref(db, 'repository/stats/totals'), (current) => {
            const next = current ?? { all: 0, pending: 0, approved: 0, rejected: 0 };
            next.all = (next.all || 0) + 1;
            next.pending = (next.pending || 0) + 1;
            next.lastUpdated = Date.now();
            return next;
        });

        // 3. 감사 로그
        const auditRef = push(ref(db, `repository/audit/${id}`));
        await set(auditRef, {
            auditId: auditRef.key,
            action: 'create',
            performedBy: payload.uid || 'public-web',
            details: {
                fields: ['name', 'description', 'specsUrl', 'license']
            },
            at: Date.now()
        });

        console.log('[repository] Successfully submitted:', id);

        // Google Tag Manager 이벤트 (있는 경우)
        if (window.dataLayer) {
            window.dataLayer.push({
                event: 'repository_submit',
                license: payload.license
            });
        }

    } catch (error) {
        console.error('[repository] Firebase write failed:', error);
        throw new Error(RepositoryErrorCode.FIREBASE_WRITE_FAILED);
    }
}

/**
 * Repository 업데이트
 * @param {string} repositoryId - Repository ID
 * @param {Object} payload - 업데이트할 payload
 * @returns {Promise<void>}
 */
async function executeRepositoryUpdate(repositoryId, payload) {
    try {
        // 기존 repository 가져오기
        const existingRepo = myRepositories.find(repo => repo.repositoryId === repositoryId);

        if (!existingRepo) {
            throw new Error('Repository not found');
        }

        // 업데이트할 데이터 (일부 필드만 업데이트)
        const updatedData = {
            ...existingRepo,
            name: payload.name,
            description: payload.description,
            specsUrl: payload.specsUrl,
            specsHost: payload.specsHost,
            author: payload.author,
            email: payload.email,
            homepage: payload.homepage,
            license: payload.license,
            updatedAt: Date.now(),
            metadata: {
                ...existingRepo.metadata,
                normalizedName: payload.metadata.normalizedName,
                emailHash: payload.metadata.emailHash,
                specsUrlHash: payload.metadata.specsUrlHash,
                licenseSlug: payload.metadata.licenseSlug
            }
        };

        // 1. 다중 경로 업데이트
        const updates = {};
        updates[`repository/entries/${repositoryId}`] = updatedData;

        // 기존 인덱스와 새 인덱스가 다른 경우 인덱스 업데이트
        if (existingRepo.metadata.emailHash !== payload.metadata.emailHash) {
            updates[`repository/index/email/${existingRepo.metadata.emailHash}/${repositoryId}`] = null;
            updates[`repository/index/email/${payload.metadata.emailHash}/${repositoryId}`] = true;
        }

        if (existingRepo.metadata.specsUrlHash !== payload.metadata.specsUrlHash) {
            updates[`repository/index/specsUrl/${existingRepo.metadata.specsUrlHash}/${repositoryId}`] = null;
            updates[`repository/index/specsUrl/${payload.metadata.specsUrlHash}/${repositoryId}`] = true;
        }

        if (existingRepo.metadata.licenseSlug !== payload.metadata.licenseSlug) {
            updates[`repository/index/license/${existingRepo.metadata.licenseSlug}/${repositoryId}`] = null;
            updates[`repository/index/license/${payload.metadata.licenseSlug}/${repositoryId}`] = true;
        }

        await update(ref(db), updates);

        // 2. 감사 로그
        const auditRef = push(ref(db, `repository/audit/${repositoryId}`));
        await set(auditRef, {
            auditId: auditRef.key,
            action: 'update',
            performedBy: payload.uid || 'public-web',
            details: {
                fields: ['name', 'description', 'specsUrl', 'license', 'author', 'email', 'homepage']
            },
            at: Date.now()
        });

        console.log('[repository] Successfully updated:', repositoryId);

    } catch (error) {
        console.error('[repository] Firebase update failed:', error);
        throw new Error(RepositoryErrorCode.FIREBASE_WRITE_FAILED);
    }
}

/**
 * Repository 폼 리셋
 * @param {HTMLFormElement} form - 폼 요소
 */
function resetRepositoryForm(form) {
    form.reset();

    // 모든 validation 클래스 제거
    const inputs = form.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });

    // 버튼 상태 복원
    if (cachedElements && cachedElements.submitButton) {
        cachedElements.submitButton.disabled = false;
        cachedElements.submitButton.innerHTML = 'Register Repository';
    }

    // 편집 모드 초기화
    editingRepositoryId = null;
}

/**
 * 폼 검증 UI 업데이트
 * @param {Map} errors - 에러 맵
 */
function updateValidationUI(errors) {
    // 모든 필드 초기화
    const inputs = document.querySelectorAll('#repository-form .form-control, #repository-form .form-select');
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
    });

    // 에러가 있는 필드에 표시
    errors.forEach((message, fieldName) => {
        const input = document.querySelector(`[name="${fieldName}"]`);
        if (input) {
            input.classList.add('is-invalid');
            const feedback = input.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = message;
            }
        }
    });
}

/**
 * 피드백 메시지 표시
 * @param {string} type - 'success' 또는 'danger'
 * @param {string} message - 메시지
 */
function showFeedback(type, message) {
    if (!cachedElements || !cachedElements.feedback) return;

    cachedElements.feedback.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

/**
 * 피드백 메시지 숨김
 */
function hideFeedback() {
    if (cachedElements && cachedElements.feedback) {
        cachedElements.feedback.innerHTML = '';
    }
}

/**
 * 폼 제출 핸들러
 * @param {Event} event - Submit 이벤트
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    // 로그인 확인
    const user = await checkUserAuthentication();
    if (!user) {
        showFeedback('danger', 'You must be logged in to register a repository.');
        redirectToLogin('spec-repositories.html');
        return;
    }

    // 폼 데이터 수집
    const values = collectFormValues(event.target);

    // 유효성 검증
    const validation = validateRepositoryValues(values);
    if (!validation.valid) {
        updateValidationUI(validation.errors);
        showFeedback('danger', 'Please fix the errors in the form.');
        return;
    }

    // 버튼 비활성화 및 로딩 표시
    cachedElements.submitButton.disabled = true;
    cachedElements.submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Submitting...
    `;

    hideFeedback();

    try {
        // Payload 생성
        const payload = await buildRepositoryPayload(values, user);

        // 편집 모드인지 확인
        const isEditMode = editingRepositoryId !== null;

        if (isEditMode) {
            // 편집 모드: 업데이트 실행
            await executeRepositoryUpdate(editingRepositoryId, payload);

            // 성공 메시지
            showFeedback('success', 'Your repository has been updated successfully!');

        } else {
            // 신규 등록 모드: 중복 체크 후 생성
            const emailDuplicate = await checkEmailDuplicate(payload.metadata.emailHash);
            if (emailDuplicate) {
                showFeedback('danger', 'This email already owns a registered spec. Please update the original submission instead.');
                cachedElements.submitButton.disabled = false;
                cachedElements.submitButton.innerHTML = 'Register Repository';
                return;
            }

            const urlDuplicate = await checkUrlDuplicate(payload.metadata.specsUrlHash);
            if (urlDuplicate) {
                showFeedback('danger', 'This specification URL is already indexed in SEDAI repository.');
                cachedElements.submitButton.disabled = false;
                cachedElements.submitButton.innerHTML = 'Register Repository';
                return;
            }

            // RTDB에 저장
            await executeRepositoryWrite(payload);

            // 성공 메시지
            showFeedback('success', 'Your specification has been submitted successfully! We will review it shortly.');
        }

        // 폼 리셋 및 숨김
        resetRepositoryForm(event.target);
        hideRepositoryForm();

        // 페이지 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('[repository] Form submission failed:', error);
        const errorMessage = editingRepositoryId
            ? 'Failed to update repository. Please try again later.'
            : 'Failed to submit repository. Please try again later.';
        showFeedback('danger', errorMessage);
        cachedElements.submitButton.disabled = false;
        cachedElements.submitButton.innerHTML = editingRepositoryId ? 'Update Repository' : 'Register Repository';
    }
}

/**
 * Register 버튼 클릭 핸들러
 */
async function handleRegisterButtonClick() {
    const user = await checkUserAuthentication();

    if (!user) {
        alert('You must be logged in to register a repository.');
        redirectToLogin('spec-repositories.html');
        return;
    }

    // 로그인 상태 → 폼 표시
    showRepositoryForm();
}

/**
 * Repository 카드 렌더링
 * @param {Object} entry - Repository 데이터
 * @returns {string} HTML 문자열
 */
function renderRepositoryCard(entry) {
    const statusBadgeClass = {
        'pending': 'text-bg-warning',
        'approved': 'text-bg-success',
        'rejected': 'text-bg-danger'
    }[entry.status] || 'text-bg-secondary';

    const homepageButton = entry.homepage
        ? `<a href="${entry.homepage}" class="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener">Author Homepage</a>`
        : '<button class="btn btn-sm btn-outline-secondary" disabled>No Homepage</button>';

    const createdDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <div class="col-md-6">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h3 class="h5 mb-0">${escapeHtml(entry.name)}</h3>
                        <span class="badge ${statusBadgeClass}">${entry.status}</span>
                    </div>
                    <p class="text-muted small repository-description mb-3">
                        ${escapeHtml(entry.description)}
                    </p>
                    <div class="d-flex flex-wrap gap-2 small text-muted mb-3">
                        <span><strong>Author:</strong> ${escapeHtml(entry.author)}</span>
                        <span>•</span>
                        <span><strong>License:</strong> <span class="badge text-bg-primary">${entry.license}</span></span>
                        <span>•</span>
                        <span>${createdDate}</span>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="${entry.specsUrl}" class="btn btn-sm btn-primary" target="_blank" rel="noopener">
                            View Specification
                        </a>
                        ${homepageButton}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * HTML 이스케이프
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * My Repository 카드 렌더링 (Edit 버튼 포함)
 * @param {Object} entry - Repository 데이터
 * @returns {string} HTML 문자열
 */
function renderMyRepositoryCard(entry) {
    const statusBadgeClass = {
        'pending': 'text-bg-warning',
        'approved': 'text-bg-success',
        'rejected': 'text-bg-danger'
    }[entry.status] || 'text-bg-secondary';

    const createdDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <div class="col-md-6">
            <div class="card h-100 shadow-sm border-primary">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h3 class="h6 mb-0">${escapeHtml(entry.name)}</h3>
                        <span class="badge ${statusBadgeClass}">${entry.status}</span>
                    </div>
                    <p class="text-muted small repository-description mb-2">
                        ${escapeHtml(entry.description)}
                    </p>
                    <div class="d-flex flex-wrap gap-2 small text-muted mb-2">
                        <span><strong>License:</strong> <span class="badge text-bg-primary">${entry.license}</span></span>
                        <span>•</span>
                        <span>${createdDate}</span>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="${entry.specsUrl}" class="btn btn-sm btn-primary" target="_blank" rel="noopener">
                            View Spec
                        </a>
                        <button class="btn btn-sm btn-outline-primary edit-repo-btn" data-repo-id="${entry.repositoryId}">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * My Repository 리스트 렌더링
 * @param {Array} entries - My Repository 배열
 */
function renderMyRepositoryList(entries) {
    if (!cachedElements) return;

    const user = auth.currentUser;

    // 로그인하지 않은 경우
    if (!user) {
        cachedElements.myList.innerHTML = '';
        cachedElements.myEmpty.classList.add('d-none');
        cachedElements.myNotLoggedIn.classList.remove('d-none');
        return;
    }

    cachedElements.myNotLoggedIn.classList.add('d-none');

    // Repository가 없는 경우
    if (entries.length === 0) {
        cachedElements.myList.innerHTML = '';
        cachedElements.myEmpty.classList.remove('d-none');
        return;
    }

    // Repository가 있는 경우
    cachedElements.myEmpty.classList.add('d-none');
    cachedElements.myList.innerHTML = entries.map(entry => renderMyRepositoryCard(entry)).join('');

    // Edit 버튼 이벤트 바인딩
    const editButtons = cachedElements.myList.querySelectorAll('.edit-repo-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const repoId = e.target.dataset.repoId;
            handleEditButtonClick(repoId);
        });
    });
}

/**
 * 사용자의 Repository 로드
 */
async function loadMyRepositories() {
    const user = auth.currentUser;

    if (!user) {
        renderMyRepositoryList([]);
        return;
    }

    const uid = user.uid;

    // 모든 repository에서 현재 사용자의 것만 필터링
    myRepositories = allRepositories.filter(entry => entry.uid === uid);

    renderMyRepositoryList(myRepositories);
}

/**
 * Edit 버튼 클릭 핸들러
 * @param {string} repositoryId - Repository ID
 */
function handleEditButtonClick(repositoryId) {
    const repository = myRepositories.find(repo => repo.repositoryId === repositoryId);

    if (!repository) {
        showFeedback('danger', 'Repository not found.');
        return;
    }

    // 편집 모드 설정
    editingRepositoryId = repositoryId;

    // 폼에 기존 데이터 로드
    populateFormWithData(repository);

    // 폼 표시
    showRepositoryForm();

    // 버튼 텍스트 변경
    if (cachedElements && cachedElements.submitButton) {
        cachedElements.submitButton.innerHTML = 'Update Repository';
    }

    // 폼 상단으로 스크롤
    document.getElementById('repository-submit').scrollIntoView({ behavior: 'smooth' });
}

/**
 * 폼에 기존 데이터 로드
 * @param {Object} repository - Repository 데이터
 */
function populateFormWithData(repository) {
    document.getElementById('repositoryName').value = repository.name;
    document.getElementById('repositoryDescription').value = repository.description;
    document.getElementById('specsUrl').value = repository.specsUrl;
    document.getElementById('author').value = repository.author;
    document.getElementById('email').value = repository.email;
    document.getElementById('homepage').value = repository.homepage || '';
    document.getElementById('license').value = repository.license;
}

/**
 * Repository 리스트 렌더링
 * @param {Array} entries - Repository 배열
 */
function renderRepositoryList(entries) {
    if (!cachedElements) return;

    if (entries.length === 0) {
        cachedElements.list.innerHTML = '';
        cachedElements.empty.classList.remove('d-none');
        return;
    }

    cachedElements.empty.classList.add('d-none');
    cachedElements.list.innerHTML = entries.map(entry => renderRepositoryCard(entry)).join('');
    cachedElements.list.setAttribute('aria-busy', 'false');
}

/**
 * 스냅샷을 UI용 배열로 변환
 * @param {DataSnapshot} snapshot - Firebase 스냅샷
 * @returns {Array} Repository 배열 (최신순)
 */
function transformEntriesForUi(snapshot) {
    if (!snapshot.exists()) {
        return [];
    }

    const entries = [];
    snapshot.forEach(childSnapshot => {
        entries.push(childSnapshot.val());
    });

    // createdAt 기준 내림차순 정렬 (최신순)
    entries.sort((a, b) => b.createdAt - a.createdAt);

    return entries;
}

/**
 * Repository 리스트 필터링
 * @param {string} license - 필터할 라이선스 ('all' 또는 특정 라이선스)
 */
function filterRepositoryList(license) {
    currentFilter = license;

    if (license === 'all') {
        renderRepositoryList(allRepositories);
    } else {
        const filtered = allRepositories.filter(entry => entry.license === license);
        renderRepositoryList(filtered);
    }
}

/**
 * Repository 엔트리 실시간 구독
 */
function subscribeRepositoryEntries() {
    const entriesRef = ref(db, 'repository/entries');
    const entriesQuery = query(entriesRef, orderByChild('createdAt'), limitToLast(50));

    onValue(entriesQuery, (snapshot) => {
        console.log('[repository] Received snapshot update');
        allRepositories = transformEntriesForUi(snapshot);
        filterRepositoryList(currentFilter);

        // My Repositories도 업데이트
        loadMyRepositories();
    }, (error) => {
        console.error('[repository] Failed to subscribe:', error);
        showFeedback('danger', 'Failed to load repositories. Please refresh the page.');
    });
}

/**
 * License 필터 바인딩
 */
function bindLicenseFilter() {
    if (!cachedElements || !cachedElements.filterLicense) return;

    cachedElements.filterLicense.addEventListener('change', (e) => {
        filterRepositoryList(e.target.value);
    });
}

/**
 * Repository 모듈 초기화
 */
export async function initRepositoryModule() {
    console.log('[repository] Initializing module...');

    // DOM 요소 캐싱
    cachedElements = cacheRepositoryDom();

    // 라이선스 옵션 로드
    preloadAllowedLicenses(cachedElements.licenseSelect);
    loadLicenseFilterOptions(cachedElements.filterLicense);

    // Register 버튼 이벤트
    if (cachedElements.registerButton) {
        cachedElements.registerButton.addEventListener('click', handleRegisterButtonClick);
    }

    // 폼 제출 이벤트
    if (cachedElements.form) {
        cachedElements.form.addEventListener('submit', handleFormSubmit);
    }

    // License 필터 바인딩
    bindLicenseFilter();

    // Repository 리스트 구독
    subscribeRepositoryEntries();

    // Auth 상태 리스너 (로그인/로그아웃 시 My Repositories 업데이트)
    onAuthStateChanged(auth, (user) => {
        console.log('[repository] Auth state changed:', user ? 'logged in' : 'logged out');
        loadMyRepositories();
    });

    console.log('[repository] Module initialized successfully');
}
