---
name: sed
version: 1.0.2
description: SEDAI (NODE.JS NPM Module) 을 작성하기 위한 SED 가이드
author: JaeHo Song
email: thruthesky@gmail.com
homepage: https://github.com/thruthesky/
license: SED Specification License v1.0
dependencies:
---

# SEDAI Specifications - Index (DTOC)

## Overview

SEDAI (Spec-Exact Development by AI) 프로젝트의 모든 명세 문서를 정리한 문서입니다. 이 문서는 Detailed Table of Contents(DTOC)로서 개발자와 AI가 필요한 명세를 빠르게 찾고 참조할 수 있도록 구조화되어 있습니다.

## Project Information

- **Project Name:** SEDAI (Spec-Exact Development by AI)
- **Description:** A development methodology and CLI toolset where AI implements solutions strictly according to specifications
- **Repository:** https://github.com/thruthesky/sedai
- **NPM Package:** https://www.npmjs.com/package/sedai
- **Author:** JaeHo Song <thruthesky@gmail.com>
- **License:** GPL (specifications), MIT (code)
- **Current Version:** 0.1.0
- **Node.js:** ≥20.0.0
- **Status:** Active Development

## Architecture Overview

```
SEDAI
├── CLI Commands (sedai, spec)
│   ├── init        ✅ Implemented
│   ├── doctor      ⏳ Planned
│   ├── validate    ⏳ Planned
│   ├── score       ⏳ Planned
│   └── help        ✅ Implemented
├── Core Modules
│   ├── YAML Parser
│   ├── Spec Validator
│   └── Score Calculator
└── Testing
    ├── Unit Tests  ✅ Implemented (2 tests)
    └── E2E Tests   ⏳ Planned
```

## Specification Documents

### 1. Setup & Configuration

#### [sed-setup-nodejs.md](sed-setup-nodejs.md)
**Purpose:** Node.js 프로젝트 설정 및 개발환경 구축

**Contains:**
- Node.js 20.10.0 LTS 설치 (nvm 사용)
- TypeScript 5.6.0 설정
- package.json 구성
- 의존성 설치 (commander, chalk, prompts, yaml)
- 개발 도구 세팅
- .nvmrc, tsconfig.json, vitest.config.ts 설정
- 빌드 및 실행 방법

**When to use:**
- 새로운 프로젝트 설정 시
- 의존성 추가/변경 시
- TypeScript 설정 변경 시

**Key Commands:**
```bash
nvm install 20.10.0
npm init -y
npm install --save-dev typescript @types/node
npm install commander chalk prompts yaml
npm run build
```

---

### 2. CLI Commands

#### [sed-cli-options.md](sed-cli-options.md)
**Purpose:** 전역 CLI 옵션 및 명령어 개요

**Contains:**
- 전역 옵션 (`--version`, `--help`)
- 이중 명령어 개요 및 설정
- 명령어 목록
- 출력 포맷

**When to use:**
- CLI 전역 구조 변경 시
- 새로운 명령어 추가 시
- 옵션 동작 확인 시

**Key Information:**
- Dual command support: `sedai` and `spec`
- Commander.js 기반
- 모든 명령어는 `--help` 지원

---

#### [sed-command-init.md](sed-command-init.md) ✅ **Fully Implemented**
**Purpose:** `spec init` 명령어 완전 구현 명세

**Contains:**
- 대화형 프롬프트 구현 (prompts 라이브러리)
- 비대화형 옵션 (`-n`, `-s`, `-a`, `-e`)
- `./specs` 디렉토리 생성
- 4개 기본 파일 생성:
  - `<name>-index.md`
  - `<name>-setup-database.md`
  - `<name>-setup-backend.md`
  - `<name>-setup-frontend.md`
- YAML 헤더 생성 (title, description, author, email, date, version, status)
- UTF-8 인코딩 보장
- 이메일 검증 (정규식 RFC 5322)
- 에러 처리 (취소 시, 잘못된 입력 등)

**When to use:**
- init 명령 구현 시
- 새로운 옵션 추가 시
- 검증 로직 수정 시
- 에러 처리 개선 시

**Implementation Location:**
- `src/cli.ts:59-207`
- Function: `createYamlHeader()` at line 131-166

**Key Commands:**
```bash
# Interactive
npx spec init

# Non-interactive
npx spec init -n "my-app" -s "Description" -a "Author" -e "email@example.com"
```

---

#### [sed-command-doctor.md](sed-command-doctor.md) ⏳ **Planned**
**Purpose:** 전체 프로젝트 스펙 검증 및 진단 도구

**Contains:**
- 스펙 디렉토리 스캔 (기본: `./specs`)
- 모든 `.md` 파일 검사
- YAML 헤더 검증 (필수 필드, 형식)
- 필수 섹션 존재 확인 (Overview, Requirements, Workflow)
- 파일별 진단 결과 (0-100)
- 전체 프로젝트 진단
- 통과 기준 파일 리스트
- 개선 권고사항 출력

**When to use:**
- 프로젝트 전체 스펙 검증 시
- CI/CD 파이프라인에서 자동 검증 시
- 통과 여부 확인 시

**Exit Codes:**
- 0: 모든 파일 통과 여부
- 1: 일부 파일 통과 실패
- 2: 디렉토리 없음

**Dependencies:**
- `sed-command-validate.md`
- `sed-command-score.md`

---

#### [sed-command-validate.md](sed-command-validate.md) ⏳ **Planned**
**Purpose:** 단일 스펙 파일 검증

**Contains:**
- 파일 존재 확인
- YAML 헤더 파싱 및 검증
- 필수 섹션 존재 확인
- 이메일 형식 검증 (RFC 5322)
- 버전 형식 검증 (Semantic Versioning)
- 내용 완성도 검사 (각각 최소)
- 성공/실패 결과 출력

**When to use:**
- 단일 파일 검증 시
- CI/CD에서 변경된 파일만 검증 시
- 스펙 작성 중 중간 검증 시

**Exit Codes:**
- 0: 검증 성공
- 1: 검증 실패
- 2: 파일 없음

**Dependencies:**
- YAML parser (yaml ^2.5.0)

---

#### [sed-command-score.md](sed-command-score.md) ⏳ **Planned**
**Purpose:** 스펙 완성도 점수 계산 (0-100)

**Contains:**
- 점수 계산 알고리즘:
  - YAML Header: 20점
  - Overview: 15점
  - Requirements: 25점
  - Workflow: 25점
  - Details: 15점
- 평가 기준:
  - 90-100: Excellent (프로젝트 준비)
  - 80-89: Good (개선 필요)
  - 70-79: Fair (개선 다수)
  - 0-69: Poor (프로젝트 준비)
- 점수 상세 분석 출력
- 개선 권고사항

**When to use:**
- 스펙 작성 완성도 확인 시
- 통과 여부 확인 시
- 개선 대상 파악 시

**Key Interface:**
```typescript
interface ScoringCriteria {
  yamlHeader: number;      // 0-20
  overview: number;         // 0-15
  requirements: number;     // 0-25
  workflow: number;         // 0-25
  details: number;          // 0-15
}
```

**Dependencies:**
- `sed-command-validate.md`

---

#### [sed-command-help.md](sed-command-help.md) ✅ **Implemented**
**Purpose:** CLI 도움말 출력

**Contains:**
- 전역 명령어 도움말 (`--help`)
- 개별 명령어 도움말 (`help <command>`)
- Commander.js 기본 기능 출력
- 색상화된 포맷

**When to use:**
- 도움말 출력 수정 시
- 새로운 명령어 추가 시

**Implementation:**
- Commander.js `.configureHelp()` 메서드 사용
- 자동 생성 (별도 구현 불필요)

---

### 3. Testing

#### [sed-test-unit.md](sed-test-unit.md)
**Purpose:** 단위 테스트 명세 및 가이드

**Contains:**
- Vitest 2.0 설정
- 테스트 파일 구조 (`*.test.ts`)
- AAA 패턴 (Arrange-Act-Assert)
- 커버리지 목표 (≥80%)
- 테스트 유형:
  - 타입정의 테스트
  - CLI 명령어 테스트
  - 함수 로직 테스트
- 현재 상태: 2개 기본 테스트 통과
- CI/CD 연동 (GitHub Actions)

**When to use:**
- 새로운 테스트 작성 시
- 커버리지 확인 시
- CI/CD 설정 시

**Key Commands:**
```bash
npm test                # 테스트 실행
npm run test:ui         # UI 모드
npm run test:coverage   # 커버리지 확인
```

**Current Status:**
- ✅ `src/index.test.ts` - 2 tests passing
- ⏳ CLI commands tests
- ⏳ Validator tests
- ⏳ Integration tests

---

### 4. Production & Deployment

#### [sed-production-publish.md](sed-production-publish.md)
**Purpose:** NPM 배포 프로세스 완전 가이드

**Contains:**
- 배포 전 체크리스트:
  - `npm test` 통과
  - `npm run build` 성공
  - `npm run test:prod` 통과
  - 버전 동기화 (package.json 및 src/version.ts)
  - Git clean working directory
- NPM 로그인 및 배포:
  - `npm login`
  - `npm publish --dry-run` (시뮬레이션)
  - `npm publish` (실제 배포)
- 배포 후 확인:
  - `npm view sedai`
  - `npx sedai@latest --version`
  - 실제 사용 테스트
- 버전 관리:
  - Semantic Versioning
  - CHANGELOG.md 업데이트
  - Git 태그 생성
  - GitHub Release
- 롤백 절차:
  - 버전 철회
  - 핫픽스 배포
  - 사용자 공지

**When to use:**
- NPM 배포 전
- 버전 업데이트 시
- 배포 후 문제 발생 시

**Key Commands:**
```bash
npm run test:prod       # 프로덕션 테스트
npm publish --dry-run   # 시뮬레이션
npm publish             # 실제 배포
npm view sedai          # 배포 확인
```

**prepublishOnly Hook:**
```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

---

## Development Workflow

### 새로운 명령어 추가 시
1. `sed-command-<name>.md` 스펙 작성 (통과 점수 확보)
2. `sed-cli-options.md` 업데이트
3. `src/cli.ts`에 명령어 구현
4. `src/<name>.test.ts` 테스트 작성
5. `npm test` 통과 확인
6. `sed-index.md` (이 파일) 업데이트
7. `npm run test:prod` 실행
8. Git 커밋 및 푸시

### 기존 명령 구현 시
1. 관련 스펙 문서 정독
2. 구현 코드 작성 (`src/`)
3. 테스트 업데이트
4. `npm test` 통과
5. 버전 업데이트 (필요시)
6. 배포

## File Structure

```
sedai/
├── specs/                           # 📚 Specification Documents
│   ├── sed-index.md                 # 📚📖 This file (DTOC)
│   ├── sed-setup-nodejs.md          # 🔧📖 Node.js setup
│   ├── sed-cli-options.md           # 🔨 CLI global options
│   ├── sed-command-init.md          # ✅ init command (implemented)
│   ├── sed-command-doctor.md        # ⏳ doctor command (planned)
│   ├── sed-command-validate.md      # ⏳ validate command (planned)
│   ├── sed-command-score.md         # ⏳ score command (planned)
│   ├── sed-command-help.md          # ✅ help command (implemented)
│   ├── sed-test-unit.md             # 🧪 Unit testing
│   └── sed-production-publish.md    # 📦 NPM publishing
├── src/                             # 💻 Source Code
│   ├── index.ts                     # Main module (types)
│   ├── cli.ts                       # CLI entry point
│   ├── version.ts                   # Version info
│   └── index.test.ts                # Unit tests
├── dist/                            # 📦 Built files (generated)
├── tests/prod/                      # 🧪 Production tests
├── package.json                     # 📦 NPM package config
├── tsconfig.json                    # 🔧 TypeScript config
├── vitest.config.ts                 # 🧪 Vitest config
├── .nvmrc                           # 📦 Node.js version (20)
├── README.md                        # 📖 Project documentation
├── CLAUDE.md                        # 🤖 Development guide
└── LICENSE                          # 📜 MIT License
```

## Quick Reference

### Most Important Documents

| Document | Status | Use Case |
|----------|--------|----------|
| `sed-setup-nodejs.md` | ✅ Complete | 환경 설정, 의존성 설치 |
| `sed-command-init.md` | ✅ Implemented | init 명령 구현/개선 |
| `sed-test-unit.md` | ✅ Complete | 테스트 작성 |
| `sed-production-publish.md` | ✅ Complete | NPM 배포 |
| `sed-cli-options.md` | ✅ Complete | CLI 구조 변경 |

### Planned Features

| Document | Status | Priority |
|----------|--------|----------|
| `sed-command-doctor.md` | ⏳ Planned | High |
| `sed-command-validate.md` | ⏳ Planned | High |
| `sed-command-score.md` | ⏳ Planned | Medium |

## Version History

### 1.0.2 (Current)
- ✅ 전체 스펙 문서 작성 완료
- ✅ `spec init` 명령어 완전 구현
- ✅ DTOC (이 문서) 작성
- ✅ SED 철학 영문화

### 1.0.1
- ✅ TypeScript 환경 설정
- ✅ 기본 CLI 구조
- ✅ 테스트 환경 설정

### 1.0.0
- ✅ 프로젝트 초기화
- ✅ README.md 작성
- ✅ 기본 구조 설정

## SED Compliance

이 프로젝트 및 모든 스펙 문서는 아래 SED 원칙을 준수합니다:

- ✅ **Spec-Exactness:** 스펙 구현은 정확히 일치해야 함
- ✅ **No Inference:** AI는 추측이나 추론 없이 스펙만 구현
- ✅ **Completeness:** 통과 점수인 완성도 확보
- ✅ **Traceability:** 모든 기능은 스펙 문서로 추적 가능
- ✅ **Version Control:** 버전 관리 및 스펙 변경 추적

## Notes

### How to Use This Index

**For Developers:**
1. 구현하려는 기능의 스펙 문서 찾기
2. 관련 문서의 Workflow 섹션 따르기
3. Details 섹션에서 구체적인 구현 방법 확인
4. Testing 섹션에서 테스트 가이드 확인

**For AI:**
1. 사용자 요구사항 분석
2. 이 프로젝트에서 관련 스펙 문서 찾기
3. 관련 문서의 정확히 따름
4. 추측이나 확장 없이 정확히 구현
5. 스펙의 모든 요소를 빠짐없이 구현

### Maintenance

이 프로젝트는 아래 경우에만 업데이트됩니다:
- 새로운 스펙 문서 추가 시
- 기존 스펙 문서 구현 시 (상태 변경)
- 새로운 명령어 구현 시
- 버전 업데이트 시

### Related Documents

- [README.md](../README.md) - User-facing documentation
- [CLAUDE.md](../CLAUDE.md) - Development workflow guide
- [package.json](../package.json) - NPM package configuration

## Contact

- **Author:** JaeHo Song
- **Email:** thruthesky@gmail.com
- **GitHub:** https://github.com/thruthesky
- **Issues:** https://github.com/thruthesky/sedai/issues
