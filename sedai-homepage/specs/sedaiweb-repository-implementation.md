---
name: sedaiweb-repository-implementation
version: 1.0.0
description: Implementation specification for the SEDAI repository submission and listing experience
author: Song Jaeho
email: thruthesky@gmail.com
license: MIT
step: 30
dependencies:
  - sedai-homepage/specs/instructions.md
  - sedai-homepage/specs/sedaiweb-design-bootstrap.md
  - sedai-homepage/specs/sedaiweb-firebase-setup.md
  - sedai-homepage/specs/sedaiweb-firebase-database.md
---

# SEDAI Repository Implementation Spec

## 1. Overview

README.md 가 정의한 SED 철학에 따라, 본 명세는 Firebase Realtime Database `/repository` 노드(데이터 구조: `sedaiweb-firebase-database.md`)를 실제 웹 인터페이스와 스크립트 로직으로 연결하는 전 과정을 정의한다. AI는 여기서 정의한 흐름과 함수, UI 텍스트, 에러 처리 절차를 단 하나도 벗어나지 말고 그대로 구현한다.

## 2. Scope

- **포함**
  - 스펙 저장소 제출 폼(UI/UX + 검증 로직)
  - 제출 데이터의 정규화 및 RTDB 다중 경로 업데이트
  - 제출 리스트 실시간 조회 및 렌더링
  - 통계/인덱스/감사 로그 업데이트 트리거
  - 에러/성공 상태 표현, 접근성
- **제외**
  - 관리자(approved/rejected) 승인 UI
  - 서버 측 Cloud Functions
  - 외부 API 호출

## 3. User Roles & Flows

| 역할 | 권한 | UX 흐름 |
| --- | --- | --- |
| Visitor | 읽기 전용 | Repository 리스트 탐색 (`onValue` → 카드 렌더링) |
| Contributor | 제출 | 폼 작성 → 클라이언트 검증 → Firebase 저장 → 성공 메시지 |
| Moderator (auth admin) | 상태 변경 | 별도 툴에서 처리 (본 명세 범위 밖) |

### 3.1 Submission Flow (필수 단계)

1. `initRepositoryModule()` 실행 시 Firebase 앱과 DOM 요소를 결속.
2. 폼 입력값 수집 → `collectFormValues()` → `validateRepositoryValues()`.
3. 유효성 통과 시 `buildRepositoryPayload()` 로 DB 스키마에 맞는 payload 생성.
4. `executeRepositoryWrite()` 가 다중 경로 업데이트(`repository/entries`, `index/*`, `stats`)를 한 번에 수행.
5. `logRepositoryAudit()` 로 감사 기록 생성.
6. 성공 UI 피드백 → 폼 초기화 → 토스트 메시지 표출.

### 3.2 Listing Flow

1. `subscribeRepositoryEntries()` 가 `query(ref(db, 'repository/entries'), orderByChild('createdAt'))` 로 마지막 50건을 구독.
2. 스냅샷을 `transformEntriesForUi()` 에 전달해 DTO 생성.
3. `renderRepositoryList()` 가 Bootstrap 카드/테이블 형태로 DOM을 갱신.
4. 라이선스 필터/검색 입력값 변화를 `filterRepositoryList()` 에 적용.

## 4. UI Specification

### 4.1 Section Placement

- `index.html` 하단(footer 위)에 두 개의 섹션을 연속 배치:
  1. `Repository Gallery` (id `repository-showcase`)
  2. `Submit Your Spec` (id `repository-submit`)
- 두 섹션 모두 Bootstrap 5.3.8 그리드/컴포넌트만 사용한다. 커스텀 CSS는 `custom.css` 에 최소한으로 추가.

### 4.2 Repository Gallery Markup

```html
<section id="repository-showcase" class="py-5 bg-light">
  <div class="container">
    <div class="row align-items-center mb-4">
      <div class="col-lg-8">
        <h2 class="display-6 mb-2">Community Spec Repository</h2>
        <p class="text-muted mb-0">
          Discover SED-compliant specification repositories submitted by engineers worldwide.
        </p>
      </div>
      <div class="col-lg-4">
        <label for="repository-filter-license" class="form-label fw-semibold mb-1">Filter by License</label>
        <select id="repository-filter-license" class="form-select">
          <option value="all">All licenses</option>
          <!-- Options appended dynamically -->
        </select>
      </div>
    </div>
    <div id="repository-list" class="row g-4" aria-live="polite" aria-busy="true">
      <!-- Cards injected by renderRepositoryList -->
    </div>
    <div id="repository-empty" class="alert alert-info mt-4 d-none">
      No repositories yet. Be the first to register your spec.
    </div>
  </div>
</section>
```

### 4.3 Repository Card Layout

- 각 항목은 `div.col-md-6` 안에 `div.card.h-100.shadow-sm`.
- 카드 본문 구조:
  - 제목: `<h3 class="h5 mb-2">`.
  - 설명: `<p class="text-muted small repository-description">` (최대 3줄, CSS `line-clamp`).
  - 메타: `<div class="d-flex flex-wrap gap-2 small text-muted">`.
  - 버튼 그룹:
    - `View Specification` → `specsUrl` (target `_blank`, rel `noopener`).
    - `Author Homepage` (옵션, 없으면 버튼 비활성 처리).
- 배지:
  - 라이선스: `<span class="badge text-bg-primary">MIT</span>`
  - 상태: `pending`=warning, `approved`=success, `rejected`=danger.

### 4.4 Submission Form Markup

```html
<section id="repository-submit" class="py-5">
  <div class="container">
    <div class="row">
      <div class="col-lg-7">
        <h2 class="display-6 mb-3">Submit Your Spec Repository</h2>
        <p class="text-muted">
          Provide the exact repository URL and metadata. Only specifications that already follow SED rules will be listed.
        </p>
      </div>
      <div class="col-lg-5">
        <div class="alert alert-warning small mb-3" role="alert">
          Make sure your spec repository clearly states the license, author, and complete implementation blueprint.
        </div>
      </div>
    </div>
    <form id="repository-form" class="card shadow-sm border-0">
      <div class="card-body p-4">
        <!-- rows defined below -->
      </div>
    </form>
    <div id="repository-feedback" class="mt-3" aria-live="polite"></div>
  </div>
</section>
```

#### Form Fields

| Order | `name` 속성 | Label | Placeholder | Validation |
| --- | --- | --- | --- | --- |
| 1 | `repositoryName` | Spec name | `Spec-Exact CLI Blueprint` | 4~120자 |
| 2 | `repositoryDescription` | Description | `Explain what this spec covers…` | 32~2000자 |
| 3 | `specsUrl` | Specification URL | `https://github.com/...` | HTTPS, 512자 이하 |
| 4 | `author` | Author | `Song Jaeho` | 2~80자 |
| 5 | `email` | Contact email | `name@example.com` | RFC 5322 |
| 6 | `homepage` | Homepage (optional) | `https://sedai.dev` | 빈 문자열이면 `null` |
| 7 | `license` | License | `<select>` — meta.allowedLicenses 기준 | 필수 |

- 각 필드 하단에 `.invalid-feedback` 를 두고 검증 실패 시 Bootstrap `is-invalid` 클래스를 추가한다.
- 제출 버튼 텍스트: `Register Repository`.
- 버튼 상태:
  - 기본: `btn btn-primary w-100 py-2`.
  - 제출 중: `disabled` + 스피너 (`<span class="spinner-border spinner-border-sm me-2"></span>`).

## 5. JavaScript Architecture

### 5.1 File Layout

| 파일 | 설명 |
| --- | --- |
| `sedai-homepage/assets/js/repository.js` | 모든 Repository 로직 (ES Module). |
| `sedai-homepage/assets/js/firebase-app.js` | Firebase 초기화 래퍼. `initializeApp` + 서비스 export. (기존 `sedaiweb-firebase-setup` 명세 예제를 모듈화.) |
| `index.html` | 두 모듈을 `<script type="module">` 로 임포트: `import { initRepositoryModule } from './assets/js/repository.js';` |

### 5.2 Types

```ts
type RepositoryStatus = 'pending' | 'approved' | 'rejected';

interface RepositoryFormValues {
  name: string;
  description: string;
  specsUrl: string;
  author: string;
  email: string;
  homepage: string | null;
  license: string;
}

interface RepositoryEntryPayload {
  repositoryId: string;
  name: string;
  description: string;
  specsUrl: string;
  specsHost: string;
  author: string;
  email: string;
  homepage: string | null;
  license: string;
  status: RepositoryStatus;
  reviewComment: string | null;
  createdAt: number;
  updatedAt: number;
  createdIpHash: string;
  metadata: {
    normalizedName: string;
    emailHash: string;
    specsUrlHash: string;
    licenseSlug: string;
    schemaVersion: number;
    score: number;
  };
}
```

### 5.3 Module Initialization

```ts
export async function initRepositoryModule(): Promise<void> {
  const { db } = await import('./firebase-app.js');
  const elements = cacheRepositoryDom();
  preloadAllowedLicenses(elements.licenseSelect);
  bindRepositoryForm(elements, db);
  subscribeRepositoryEntries(elements, db);
}
```

- 초기화는 DOMContentLoaded 후 단 한 번만 실행.
- `cacheRepositoryDom()` 은 `repository-form`, `repository-list`, `repository-empty`, `repository-feedback`, `repository-filter-license` 요소를 캐싱한다.

### 5.4 Form Handling Functions

| 함수 | 역할 | 세부 규칙 |
| --- | --- | --- |
| `collectFormValues(form: HTMLFormElement): RepositoryFormValues` | FormData → 객체 | `homepage` 가 빈 문자열이면 `null`. 모든 문자열 `trim()`. |
| `validateRepositoryValues(values, limits, allowedLicenses): ValidationResult` | 입력 검증 | `limits` 는 `/repository/meta/fieldLimits`. 실패 시 `errors` map 반환. |
| `hashSha256(input: string): Promise<string>` | 해시 유틸 | `crypto.subtle.digest('SHA-256', TextEncoder())` 사용, hex 문자열 앞에 `sha256:` 접두사. |
| `buildRepositoryPayload(values, context): Promise<RepositoryEntryPayload>` | 스키마 변환 | `repositoryId`, `specsHost`, `normalizedName`, 해시 필드, timestamp 생성. |
| `executeRepositoryWrite(payload, db): Promise<void>` | RTDB 업데이트 | 1) 다중 경로 업데이트 2) 통계 transaction 3) 감사 로그 push 순으로 진행. |
| `resetRepositoryForm(form)` | 성공 후 초기화 | 폼 리셋 + 버튼/메시지 상태 복원. |

#### `repositoryId` 생성 규칙

```ts
const repositoryId = `repo-${format(new Date(), 'yyyyMMddHHmmss')}-${Math.random().toString(36).slice(2, 8)}`;
```

#### 다중 경로 업데이트

```ts
const updates: Record<string, unknown> = {};
updates[`repository/entries/${id}`] = payload;
updates[`repository/index/email/${payload.metadata.emailHash}/${id}`] = true;
updates[`repository/index/specsUrl/${payload.metadata.specsUrlHash}/${id}`] = true;
updates[`repository/index/license/${payload.license}/${id}`] = true;
await update(ref(db), updates);
```

- `createdIpHash` 는 `values.ipAddress` 를 서버에서 받을 수 없으므로, 클라이언트는 Cloudflare Trace API 등 외부 호출을 하지 않고 사용자가 직접 입력한 IP를 받지 않는다. 대신 `createdIpHash` 는 `sha256:browser-fingerprint` 패턴으로 작성하며 구현 명세는 추후 확장 시 업데이트한다. 현재는 문자열 `"sha256:client-not-tracked"` 로 고정 저장한다.

#### 통계 업데이트

```ts
await runTransaction(ref(db, 'repository/stats/totals'), current => {
  const next = current ?? { all: 0, pending: 0, approved: 0, rejected: 0 };
  next.all += 1;
  next.pending += 1;
  next.lastUpdated = Date.now();
  return next;
});
```

#### 감사 로그

```ts
const auditRef = push(ref(db, `repository/audit/${id}`));
await set(auditRef, {
  auditId: auditRef.key,
  action: 'create',
  performedBy: 'public-web',
  details: { fields: ['name','description','specsUrl','license'] },
  at: Date.now()
});
```

### 5.5 Duplicate Guard

1. `checkEmailDuplicate(emailHash)` → `get(child(emailIndexRef, emailHash)).exists()`.
2. `checkUrlDuplicate(urlHash)` → 동일 방식.
3. 하나라도 true 이면 `RepositoryErrorCode.DUPLICATE_EMAIL` 또는 `DUPLICATE_URL` 반환.
4. 에러 메시지:
   - 이메일 중복: `This email already owns a registered spec. Please update the original submission instead.`
   - URL 중복: `This specification URL is already indexed in SEDAI repository.`

### 5.6 Listing Functions

| 함수 | 역할 |
| --- | --- |
| `subscribeRepositoryEntries(elements, db)` | `onValue(query(ref(db, 'repository/entries'), orderByChild('createdAt'), limitToLast(50)))` 로 실시간 데이터 구독. |
| `transformEntriesForUi(snapshot)` | 객체 → 최신순 배열, `createdAt` 내림차순 정렬. |
| `renderRepositoryList(entries, elements)` | 카드 DOM 렌더링. 항목 0개면 `repository-empty` 표시. |
| `bindLicenseFilter(elements)` | `<select>` 변경 시 리스트 필터 적용. |

### 5.7 Accessibility & Feedback

- `repository-list` 컨테이너는 `aria-live="polite"` 와 `aria-busy` 속성을 사용해 갱신 상태를 알린다.
- 폼 에러 메시지는 `<div class="invalid-feedback" id="repositoryNameHelp">` 형태로 작성하고, `aria-describedby` 로 연결한다.
- 성공 시 `#repository-feedback` 영역에 `<div class="alert alert-success">Your specification has been submitted. We will review it shortly.</div>` 삽입.
- 실패 시 `alert alert-danger` 로 동일 위치에 표시.

## 6. Validation Rules (클라이언트)

| 필드 | 규칙 |
| --- | --- |
| name | `^[\\p{L}\\p{N}\\s\\-:_]{4,120}$` (Unicode letter/number 허용, 정규식은 `u` 플래그). |
| description | 길이 32~2000, `<` `>` 허용 (HTML Escape 필수: `textContent`). |
| specsUrl | `new URL(value)` 성공 & `protocol === 'https:'`. |
| author | `length 2~80`, 숫자만 허용 X. |
| email | `/.+@.+\\..+/` + `.toLowerCase()`. |
| homepage | 빈 문자열 → `null`, 값 존재 시 `https` 강제. |
| license | `/repository/meta/allowedLicenses` 중 하나인지 확인. |

## 7. Error Codes

```ts
export const RepositoryErrorCode = {
  DUPLICATE_EMAIL: 'duplicate_email',
  DUPLICATE_URL: 'duplicate_url',
  FIREBASE_WRITE_FAILED: 'firebase_write_failed',
  VALIDATION_FAILED: 'validation_failed'
} as const;
```

- UI 에는 영어 문장을 표시하되, `console.error` 에는 코드와 payload를 함께 로깅한다.

## 8. Testing & QA Checklist

1. **Happy Path:** 모든 필드를 올바르게 입력하고 제출 → 성공 메시지 확인, RTDB 에 새로운 entry 확인.
2. **Validation:** 각 필드에 대해 최소/최대/빈 값 케이스를 테스트, UI에 정확한 invalid 메시지 확인.
3. **Duplicate:** 같은 이메일/URL 로 두 번 제출 → 에러 토스트/메시지 출력.
4. **License 필터:** 특정 라이선스 선택 시 리스트가 해당 라이선스만 표시되는지 확인.
5. **Accessibility:** 폼 필드에 `Tab` 키로 접근 가능, 스크린 리더에서 라벨이 올바르게 읽히는지 확인.
6. **Offline Handling:** 네트워크를 끊고 제출 시 에러 메시지 `We could not reach Firebase. Please retry.` 노출.

## 9. Logging & Analytics

- 모든 성공 제출은 `window.dataLayer.push({ event: 'repository_submit', license: payload.license });` 로 기록 (Google Tag Manager 연동 가정).
- 에러는 `console.error('[repository]', code, details);` 로 남기고, 치명적 오류(예: Firebase write 실패)는 `alert-danger` 메시지로 사용자에게 알린다.

## 10. Implementation Constraints

1. **Spec Obedience:** 여기 정의되지 않은 추가 필드/기능을 추가하지 않는다.
2. **No Hidden Requests:** 외부 API 호출 금지 (IP 확인, Geo, analytics 제외).
3. **Single Source of Truth:** 모든 허용 라이선스/길이 제한은 `/repository/meta` 에서 읽은 값을 기준으로 한다.
4. **Schema Sync:** `metadata.schemaVersion` 은 DB 메타와 항상 동일해야 하므로, 모듈 로드 시 `get(metaRef)` 로 읽어와 캐시한다.
5. **Error Surfacing:** Firebase 예외 발생 시 `RepositoryErrorCode.FIREBASE_WRITE_FAILED` 와 `error.message` 를 함께 사용자에게 전달.

---

본 명세를 준수하면, SEDAI 홈페이지는 README.md 가 정의한 Spec-Exact Development 정신에 맞춰 사용자 제출 스펙 저장소를 일관되게 수집·노출할 수 있다. 구현체는 어떤 경우에도 명세 외 구현을 추가해서는 안 되며, 변경이 필요한 경우 본 문서부터 업데이트한다.
