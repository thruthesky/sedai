---
name: sedaiweb-firebase-database
version: 1.0.0
description: Firebase Realtime Database schema for the SEDAI repository submission feature
author: Song Jaeho
email: thruthesky@gmail.com
license: MIT
step: 20
dependencies:
  - sedai-homepage/specs/instructions.md
  - sedai-homepage/specs/sedaiweb-firebase-setup.md
---

# SEDAI Realtime Database Specification

## Overview

본 명세는 README.md 에 정의된 SED 철학(“AI develops exactly as the spec defines — no interpretation, no assumption”)을 기반으로, Firebase Realtime Database(RTDB)에 `/repository` 노드를 구축하기 위한 완전한 데이터 구조를 설명한다. 이 노드는 전 세계 SED 실천가들이 직접 작성한 스펙 저장소(spec repository)를 제출하고, 다른 사용자가 탐색할 수 있도록 관리한다. 구현 로직은 별도 명세(sedaiweb-repository-implementation.md)에 정의하며, 본 문서는 **데이터 구조와 규칙**만 다룬다.

## Firebase Instance

- **Project ID:** `sedai-homepage`
- **Database URL:** `https://sedai-homepage-default-rtdb.asia-southeast1.firebasedatabase.app`
- **Region:** `asia-southeast1`
- **SDK Version:** Firebase JS SDK v12.5.0 (CDN, ES Module) — 의존성은 `sedaiweb-firebase-setup` 명세에 정의된 구성과 동일하게 유지한다.
- **Transport:** HTTPS (TLS 1.2 이상)

## Naming & Typing Rules

| 항목 | 규칙 |
| --- | --- |
| Repository ID | `repo-{yyyyMMddHHmmss}-{randomBase36}` (예: `repo-20250105143712-x9v2d4`). Frontend 에서 작성 후 그대로 키로 사용한다. |
| 문자열 길이 | UTF-8 바이트 기준 2~1024 바이트. (필드별 최대 길이는 아래 세부 스키마 참고) |
| URL | 반드시 `https://` 로 시작하며, RFC 3986 준수. |
| 이메일 | 소문자, RFC 5322 양식. 저장 전 `trim()` 수행. |
| 타임스탬프 | `number` 타입의 Unix epoch milliseconds. |
| 인코딩 | UTF-8 (BOM 없음). |

## Node Map

| Path | 목적 | 설명 |
| --- | --- | --- |
| `/repository/meta` | 스키마 메타데이터 | 스키마 버전, 허용 라이선스 목록, 필드 제한값을 중앙 관리. |
| `/repository/entries/{repositoryId}` | 제출 데이터 본문 | 사용자가 제출한 스펙 저장소 정보. |
| `/repository/index/email/{emailHash}/{repositoryId}` | 이메일 인덱스 | 동일 이메일 중복 제출 방지 및 빠른 조회. |
| `/repository/index/specsUrl/{urlHash}/{repositoryId}` | URL 인덱스 | URL 기반 중복 검사 및 탐색. |
| `/repository/index/license/{spdxId}/{repositoryId}` | 라이선스 인덱스 | 특정 라이선스에 속한 스펙 모음. |
| `/repository/stats` | 통계 | 총 등록 수, 상태별 집계 등 숫자 기반 데이터. |
| `/repository/audit/{repositoryId}/{auditId}` | 변경 로그 | 항목별 변경 이력 및 검증 결과. |

## `/repository/meta`

```json
{
  "schemaVersion": 1,
  "updatedAt": 1736035200000,
  "allowedLicenses": [
    "MIT",
    "Apache-2.0",
    "GPL-3.0-only",
    "BSD-3-Clause",
    "CC-BY-4.0"
  ],
  "fieldLimits": {
    "name": { "min": 4, "max": 120 },
    "description": { "min": 32, "max": 2000 },
    "specsUrl": { "max": 512 },
    "author": { "min": 2, "max": 80 },
    "email": { "max": 254 },
    "homepage": { "max": 512 }
  }
}
```

- **관리 주체:** 운영자 전용. 클라이언트는 읽기 전용이며 구성값을 참고하여 유효성 검사를 수행한다.

## `/repository/entries/{repositoryId}`

### 필드 정의

| 필드 | 타입 | 필수 여부 | 제약/설명 | 예시 |
| --- | --- | --- | --- | --- |
| `repositoryId` | string | 필수 | 키와 동일, `repo-` prefix. | `repo-20250105143712-x9v2d4` |
| `name` | string | 필수 | 4~120자, ANSI/한글 허용, 앞뒤 공백 제거. | `Spec-Exact Task Runner` |
| `description` | string | 필수 | 32~2000자, Markdown (CommonMark) 텍스트 허용. | `Implements SED init workflow…` |
| `specsUrl` | string | 필수 | `https://` required, 512자 이하. GitHub, GitLab, 개인 호스팅 허용. | `https://github.com/user/sed-specs` |
| `specsHost` | string | 필수 | `URL.hostname` 자동 추출, 영문 소문자. | `github.com` |
| `author` | string | 필수 | 2~80자, 실명 또는 팀명. | `Song Jaeho` |
| `email` | string | 필수 | 소문자, RFC 5322, 공백 없음. | `thruthesky@gmail.com` |
| `homepage` | string\|null | 선택 | 값이 없으면 `null`. `https://` required. | `https://sedai.dev` |
| `license` | string | 필수 | SPDX Identifier, `meta.allowedLicenses` 중 하나. | `MIT` |
| `status` | string | 필수 | `pending`, `approved`, `rejected` 중 하나. 초기값 `pending`. | `pending` |
| `reviewComment` | string\|null | 선택 | 검증자가 남기는 메시지. 0~1000자. | `Missing README anchors.` |
| `createdAt` | number | 필수 | Epoch ms. 클라이언트에서 `Date.now()` 사용. | `1736035200000` |
| `updatedAt` | number | 필수 | 변경 시마다 갱신. 초기값 = `createdAt`. | `1736035200000` |
| `createdIpHash` | string | 필수 | 사용자의 공개 IP를 SHA-256으로 해시한 값. IP를 수집할 수 없으면 고정 문자열 `sha256:client-not-tracked`. | `sha256:client-not-tracked` |
| `metadata` | object | 필수 | 파생 값 모음 (아래 표 참고). | `{…}` |

### `metadata` 필드

| 하위 필드 | 타입 | 설명 |
| --- | --- | --- |
| `normalizedName` | string | 소문자, 공백을 하이픈으로 치환 (`sedai-spec-exchange`). |
| `emailHash` | string | `sha256` 해시. `/repository/index/email` 키와 동일. |
| `specsUrlHash` | string | `sha256(specsUrl)`. URL 인덱스 키와 동일. |
| `licenseSlug` | string | 소문자 변환(`mit`, `apache-2.0`). |
| `schemaVersion` | number | 현재 스키마 버전. `meta.schemaVersion`과 동기화. |
| `score` | number | 스펙 검증 점수(0~100). 초기 `0`. 향후 validator가 갱신. |

### 예시

```json
{
  "repository": {
    "entries": {
      "repo-20250105143712-x9v2d4": {
        "repositoryId": "repo-20250105143712-x9v2d4",
        "name": "Spec-Exact Task Runner",
        "description": "Implements the **SED** init workflow with zero deviation.\n- Provides CLI blueprints\n- Ships complete Firebase config",
        "specsUrl": "https://github.com/sedai/spec-task-runner",
        "specsHost": "github.com",
        "author": "Song Jaeho",
        "email": "thruthesky@gmail.com",
        "homepage": "https://sedai.dev",
        "license": "MIT",
        "status": "pending",
        "reviewComment": null,
        "createdAt": 1736035200000,
        "updatedAt": 1736035200000,
        "createdIpHash": "sha256:client-not-tracked",
        "metadata": {
          "normalizedName": "spec-exact-task-runner",
          "emailHash": "sha256:879ab0d0443a...",
          "specsUrlHash": "sha256:c2f7f5b3913c...",
          "licenseSlug": "mit",
          "schemaVersion": 1,
          "score": 0
        }
      }
    }
  }
}
```

## Index Nodes

### `/repository/index/email/{emailHash}/{repositoryId}`
- **값:** `true`
- **역할:** 동일 이메일의 중복 제출을 감지하거나, 특정 작성자의 모든 스펙을 빠르게 조회.
- **emailHash 생성 규칙:** `sha256(email.trim().toLowerCase())`, 접두사 `sha256:` 포함.

### `/repository/index/specsUrl/{specsUrlHash}/{repositoryId}`
- **값:** `true`
- **역할:** 동일 URL로 여러 번 제출하는 것을 차단.
- **specsUrlHash:** 입력 URL의 전체 문자열을 SHA-256 해시 후 hex. 접두사 `sha256:` 포함.

### `/repository/index/license/{spdxId}/{repositoryId}`
- **값:** `true`
- **역할:** 특정 라이선스 기준으로 목록을 생성할 때 사용.
- **SPDX ID:** 대문자 그대로 저장 (`MIT`, `Apache-2.0` 등).

## `/repository/stats`

```json
{
  "totals": {
    "all": 12,
    "pending": 5,
    "approved": 6,
    "rejected": 1
  },
  "lastUpdated": 1736038800000
}
```

- **업데이트 방식:** RTDB `runTransaction` 사용. 클라이언트는 `pending` 등록 시 `totals.pending`과 `totals.all`을 +1 증가시킨다.

## `/repository/audit/{repositoryId}/{auditId}`

| 필드 | 설명 |
| --- | --- |
| `auditId` | `audit-{timestamp}-{rand}` |
| `action` | `create`, `update`, `status-change`, `score-change` |
| `performedBy` | `auth.uid` 또는 `system` |
| `details` | JSON 객체 (변경된 필드, 이전/이후 값). |
| `at` | Epoch ms |

감사 로그는 읽기 전용. 최대 100건만 유지하며, 초과 시 가장 오래된 항목을 삭제한다.

## Security Rules (요약)

```json
{
  "rules": {
    "repository": {
      "meta": {
        ".read": true,
        ".write": "auth != null && auth.token.admin === true"
      },
      "entries": {
        "$repositoryId": {
          ".read": true,
          ".write": "auth != null",
          ".validate":
            "newData.hasChildren(['repositoryId','name','description','specsUrl','specsHost','author','email','license','status','createdAt','updatedAt','createdIpHash','metadata'])" &&
            "newData.child('status').val() in ['pending','approved','rejected']" &&
            "newData.child('metadata').child('schemaVersion').val() == root.child('repository/meta/schemaVersion').val()"
        }
      },
      "index": {
        "email": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        "specsUrl": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        "license": {
          ".read": true,
          ".write": "auth != null"
        }
      },
      "stats": {
        ".read": true,
        ".write": "auth != null"
      },
      "audit": {
        ".read": "auth != null && auth.token.admin === true",
        ".write": "auth != null && auth.token.admin === true"
      }
    }
  }
}
```

- `repository/entries` 루트에는 `".indexOn": ["createdAt", "metadata/normalizedName", "license", "status"]` 를 선언해 정렬/검색 속도를 확보한다.
- 보안 규칙은 **추후 Firebase Console > Realtime Database > Rules** 탭에 그대로 입력할 수 있도록 JSON 형태로 기술한다.

## Data Retention & Backup

1. **Retention:** `/repository/entries` 는 삭제하지 않는다. 잘못된 데이터는 `status = rejected` 로만 표시한다.
2. **Backup:** Firebase Scheduled Backups를 매일 03:00 UTC에 Cloud Storage `gs://sedai-homepage-backup/rtdb/{date}/repository.json` 으로 내보낸다.
3. **Anonymization:** `createdIpHash` 는 복호화 불가능한 해시 또는 `sha256:client-not-tracked` sentinel value 만 저장한다.

## Implementation Hand-off

- 본 스키마는 **데이터 구조 정의만 포함**한다.
- 실제 데이터 생성, 검증, UI/UX, Firebase SDK 로직, 통계 업데이트 규칙 등은 `sedaiweb-repository-implementation.md` 명세에서 다룬다.
- 두 명세는 항상 동일한 `schemaVersion` 을 유지해야 하며, 스키마가 변경될 경우 `meta.schemaVersion` 과 문서 버전을 동시에 올린다.
