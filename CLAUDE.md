# SEDAI 프로젝트 개발 문서

이 문서는 SEDAI (Spec-Exact Development by AI) 프로젝트의 구현 내용과 개발 가이드를 담고 있습니다.

## 📋 구현된 기능

### 1. 프로젝트 초기화

- ✅ TypeScript 기반 개발 환경
- ✅ Node.js 버전 20으로 고정 (`.nvmrc`, `package.json` engines)
- ✅ Unit test 환경 (Vitest 2.0)

### 2. NPM 패키지 설정

- ✅ `npm i -g sedai` 로 설치 가능
- ✅ `npx sedai --help` 또는 `npx spec --help` 명령으로 사용 가능
- ✅ **이중 명령어 지원**: `sedai`와 `spec` 둘 다 사용 가능
- ✅ CLI 명령어 구현:
  - `spec doctor` - 스펙 검증 (예정)
  - **`spec init`** - **프로젝트 초기화 (✅ 완전 구현됨)**
  - `spec validate <file>` - 단일 파일 검증 (예정)
  - `spec score <file>` - 점수 계산 (예정)

### 3. `spec init` 명령어 (완전 구현)

`spec init` 명령어는 새로운 SED 프로젝트를 초기화합니다:

**기능:**
- 대화형 프롬프트로 프로젝트 정보 수집
- `./specs` 폴더 자동 생성
- YAML 헤더가 포함된 4개의 기본 스펙 파일 생성:
  - `index.md` - 메인 인덱스 스펙 (이전: `<name>-index.md`, 하위 호환성 유지)
  - `<name>-setup-database.md` - 데이터베이스 설정
  - `<name>-setup-backend.md` - 백엔드 설정
  - `<name>-setup-frontend.md` - 프론트엔드 설정
- UTF-8 인코딩 보장

**사용 방법:**

```bash
# 대화형 모드 (사용자 입력 받음)
npx spec init

# 비대화형 모드 (모든 옵션 제공)
npx spec init -n "my-app" -s "My awesome application" -a "Your Name" -e "your@email.com"

# 일부 옵션만 제공 (나머지는 대화형으로 입력)
npx spec init -n "my-app"
```

**옵션:**
- `-n, --name <name>` - 프로젝트 이름
- `-s, --summary <summary>` - 프로젝트 요약/설명
- `-a, --author <author>` - 작성자 이름
- `-e, --email <email>` - 작성자 이메일

**생성되는 YAML 헤더 예시:**
```yaml
---
title: my-app - Index
description: Main index specification for my-app
author: Your Name
email: your@email.com
date: 2025-11-05
version: 1.0.0
status: draft
---
```

### 4. SED 개념 문서화

- ✅ 한글 내용을 영문으로 완전히 번역
- ✅ README.md에 상세한 설명 포함:
  - Origin Story (탄생 배경)
  - Core Principles (기본 원칙)
  - Development Process Phases (개발 프로세스)
  - Philosophy Summary (철학 요약)
  - Spec File Structure (스펙 파일 구조)
  - Testing Specifications (테스트 명세)

## 🔥 UTF-8 인코딩 필수 규칙

**🔥🔥🔥 최강력 경고: 모든 문서와 소스 코드는 반드시 UTF-8 인코딩으로 작성해야 합니다 🔥🔥🔥**

### UTF-8 인코딩 규칙

- **✅ 필수**: 모든 문서(\*.md) 파일은 **반드시 UTF-8 인코딩**으로 저장
- **✅ 필수**: 모든 소스 코드(\*.ts, \*.js, \*.json) 파일은 **반드시 UTF-8 인코딩**으로 저장
- **✅ 필수**: BOM(Byte Order Mark) 없는 UTF-8 사용
- **✅ 필수**: 파일 생성 시 편집기의 인코딩 설정을 UTF-8로 지정
- **❌ 금지**: EUC-KR, CP949, ISO-8859-1 등 다른 인코딩 사용 절대 금지
- **❌ 금지**: ASCII만 지원하는 에디터 사용 금지

### 인코딩 확인 방법

**macOS/Linux:**
```bash
# 파일 인코딩 확인
file -I docs/api.md

# 올바른 출력: charset=utf-8
# 잘못된 출력: charset=binary, charset=us-ascii
```

**VSCode 설정:**
```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": false
}
```

### 위반 시 결과

- 한글이 깨져서 표시됨 (예: 문서 → �8)
- 파일을 읽을 수 없음
- Git에서 충돌 발생
- 웹사이트에서 한글이 제대로 표시되지 않음

**⚠️ 모든 파일 생성 및 수정 시 반드시 UTF-8 인코딩을 확인하세요! ⚠️**

---

## ⚙️ 개발 워크플로우

**🚨 필수 준수 사항: 개발자(AI 포함)가 작업할 때마다 반드시 아래 워크플로우를 따라야 합니다 🚨**

### 코드 작성 전 필수 체크리스트

- [ ] **UTF-8 인코딩 확인**: 모든 파일이 UTF-8 인코딩(BOM 없음)으로 작성되었는지 확인
- [ ] **스펙 문서 검토**: 구현하려는 기능의 스펙이 CLAUDE.md 또는 관련 문서에 명확히 정의되어 있는지 확인
- [ ] **타입 정의 확인**: TypeScript 인터페이스와 타입이 src/index.ts에 정의되어 있는지 확인
- [ ] **기존 코드 검토**: 유사한 기능이나 패턴이 이미 구현되어 있는지 확인

### 개발 단계

- [ ] **브랜치 생성**: 기능별로 새로운 브랜치 생성 (`feature/기능명` 또는 `fix/버그명`)
- [ ] **코드 작성**: TypeScript strict 모드 준수, 모든 함수에 JSDoc 주석 추가
- [ ] **한글 주석 작성**: 복잡한 로직에는 한글로 상세한 설명 추가
- [ ] **에러 처리**: 적절한 에러 핸들링과 사용자 친화적인 에러 메시지 작성

### 테스트 단계

- [ ] **단위 테스트 작성**: 새로운 기능에 대한 테스트 파일 생성 (`*.test.ts`)
- [ ] **테스트 실행**: `npm test` 명령으로 모든 테스트가 통과하는지 확인
- [ ] **커버리지 확인**: `npm run test:coverage`로 코드 커버리지 80% 이상 유지
- [ ] **엣지 케이스 테스트**: 경계값, null/undefined, 빈 배열 등 예외 상황 테스트

### 빌드 및 검증 단계

- [ ] **타입 체크**: `npm run build`로 TypeScript 컴파일 오류 없는지 확인
- [ ] **린트 검사**: `npm run lint`로 코드 스타일 위반 사항 수정
- [ ] **포맷팅**: `npm run format`으로 코드 포맷팅 적용
- [ ] **CLI 테스트**: `node dist/cli.js` 명령으로 실제 동작 확인

### 문서화 단계

- [ ] **CLAUDE.md 업데이트**: 새로운 기능이나 변경사항을 이 문서에 반영
- [ ] **README.md 업데이트**: 사용자 대상 문서가 필요한 경우 README.md 수정
- [ ] **JSDoc 주석**: 모든 public API에 대한 문서화 주석 작성
- [ ] **CHANGELOG 작성**: 주요 변경사항을 CHANGELOG.md에 기록 (해당되는 경우)

### 커밋 및 배포 단계

- [ ] **파일 인코딩 최종 확인**: `file -I <파일명>`으로 UTF-8 인코딩 재확인
- [ ] **변경사항 검토**: `git diff`로 의도하지 않은 변경사항 없는지 확인
- [ ] **커밋 메시지 작성**: 명확하고 구체적인 커밋 메시지 작성 (Conventional Commits 권장)
- [ ] **푸시 전 테스트**: 최종적으로 `npm test && npm run build` 실행하여 확인
- [ ] **버전 업데이트**: package.json과 src/version.ts의 버전 동기화 (필요시)

### 코드 리뷰 체크리스트

- [ ] **SED 원칙 준수**: 코드가 Spec-Exact Development 원칙을 따르는지 확인
- [ ] **명세 일치성**: 구현 내용이 스펙 문서와 정확히 일치하는지 확인
- [ ] **보안 검토**: 잠재적인 보안 취약점(XSS, SQL Injection 등) 없는지 확인
- [ ] **성능 고려**: 불필요한 반복문이나 비효율적인 알고리즘 없는지 확인
- [ ] **의존성 확인**: 새로운 외부 라이브러리 추가 시 필요성과 안정성 검토

## 🔧 기술 스택

- **Language:** TypeScript 5.6.0
- **Runtime:** Node.js ≥20.0.0
- **CLI Framework:** Commander.js 12.0
- **User Input:** Prompts 2.4.2
- **Styling:** Chalk 5.3.0
- **YAML Parser:** yaml 2.5.0
- **Testing:** Vitest 2.0
- **Build Tool:** TypeScript Compiler

## 📦 NPM 스크립트

```bash
npm run build          # TypeScript 빌드
npm run dev            # Watch 모드 개발
npm test               # 단위 테스트 실행 (Vitest)
npm run test:ui        # Vitest UI 모드
npm run test:coverage  # 커버리지 포함 테스트
npm run test:prod      # 프로덕션 CLI 테스트 (배포 전 필수)
npm run lint           # ESLint 실행
npm run format         # Prettier 포맷팅
```

## 🚀 사용 방법

### 로컬에서 빌드 후 테스트

```bash
# TypeScript 빌드
npm run build

# CLI 도움말 확인
node dist/cli.js --help

# init 명령 테스트 (대화형)
node dist/cli.js init

# init 명령 테스트 (비대화형 - 모든 옵션 제공)
node dist/cli.js init -n "my-app" -s "My awesome app" -a "Your Name" -e "your@email.com"

# doctor 명령 테스트
node dist/cli.js doctor
```

### 테스트 실행

```bash
# 테스트 실행 (2개 테스트 모두 통과 확인됨)
npm test
```

### NPM에 배포하기 전 로컬 테스트

배포 전에 실제 사용 환경과 동일하게 CLI를 테스트할 수 있습니다:

```bash
# 자동화된 프로덕션 테스트 실행
npm run test:prod
```

또는 수동으로 개별 명령어 테스트:

```bash
# tests/prod 폴더로 이동
cd tests/prod

# 개별 명령어 테스트
node ../../dist/cli.js --help
node ../../dist/cli.js --version
node ../../dist/cli.js doctor
node ../../dist/cli.js init --name my-project
node ../../dist/cli.js validate test-spec.md
node ../../dist/cli.js score test-spec.md
```

자동화 스크립트는 다음을 수행합니다:
- TypeScript 빌드
- 모든 CLI 명령어 테스트 (--help, --version, doctor, init, validate, score)
- 결과를 색상으로 구분하여 출력
- 각 테스트의 성공/실패 표시

### NPM에 배포

```bash
# NPM 로그인
npm login

# 패키지 배포
npm publish
```

## 📝 다음 단계 제안

### 1. 실제 기능 구현

- [x] **`init` 명령어** - ✅ **완료됨** (대화형 입력, 파일 생성, YAML 헤더)
- [ ] 스펙 파일 파싱 (YAML 파서)
- [ ] `doctor` 명령어 - 스펙 구조 검증 로직
- [ ] `validate` 명령어 - 단일 파일 검증
- [ ] `score` 명령어 - 점수 계산 알고리즘
- [ ] Dependencies 해석 및 로드

### 2. 추가 테스트 작성

각 기능에 대한 단위 테스트 추가가 필요합니다.

### 3. CI/CD 설정

GitHub Actions로 자동 빌드/테스트/배포 파이프라인 구성이 필요합니다.

### 4. 문서 보완

- API 문서
- 사용 예제
- 기여 가이드

## 📂 프로젝트 구조

```
sedai/
├── 📄 package.json          # NPM 패키지 설정 (bin 설정 포함)
├── 📄 package-lock.json     # 의존성 잠금 파일
├── 📄 tsconfig.json         # TypeScript 컴파일러 설정
├── 📄 vitest.config.ts      # Vitest 테스트 설정
├── 📄 .nvmrc                # Node.js 버전 20 고정
├── 📄 .gitignore            # Git 무시 파일 목록
├── 📄 LICENSE               # MIT 라이선스
├── 📄 README.md             # 프로젝트 문서 (영문 번역 완료)
├── 📄 CLAUDE.md             # 개발 문서 (이 파일)
├── 📁 src/                  # TypeScript 소스 코드
│   ├── 📄 index.ts          # 메인 모듈 (타입 정의 및 export)
│   ├── 📄 cli.ts            # CLI 진입점 (commander 기반)
│   ├── 📄 version.ts        # 버전 정보
│   └── 📄 index.test.ts     # 단위 테스트
├── 📁 tests/                # 테스트 디렉토리
│   └── 📁 prod/             # 프로덕션 CLI 테스트
│       ├── 📄 test.sh       # 자동화된 테스트 스크립트
│       ├── 📄 test-spec.md  # 테스트용 예시 스펙 파일
│       └── 📄 README.md     # 테스트 가이드
├── 📁 dist/                 # 빌드된 JavaScript 파일
│   ├── 📄 cli.js            # CLI 실행 파일 (#!/usr/bin/env node)
│   ├── 📄 index.js          # 메인 모듈
│   └── ...                  # d.ts, map 파일들
└── 📁 node_modules/         # NPM 의존성 패키지
```

## 🔍 주요 파일 설명

### `src/index.ts`

프로젝트의 메인 모듈로, 다음을 포함합니다:

- `SpecHeader` 인터페이스: 스펙 파일의 YAML 헤더 구조
- `ValidationResult` 인터페이스: 스펙 검증 결과
- `SpecFile` 인터페이스: 스펙 파일 전체 구조
- `ScoringCriteria` 인터페이스: 스펙 점수 계산 기준

### `src/cli.ts`

CLI 진입점으로, Commander.js를 사용하여 다음 명령어를 구현합니다:

- `doctor`: 스펙 파일 검증
- `init`: 새 SED 프로젝트 초기화
- `validate`: 단일 스펙 파일 검증
- `score`: 스펙 점수 계산

### `src/version.ts`

버전 정보를 관리합니다. `package.json`의 버전과 동기화되어야 합니다.

## 💡 개발 참고사항

### 언어 사용 규칙

**문서 및 코드 작성 시 언어 사용 원칙:**

- **README.md**: 반드시 **영문으로만** 작성 (국제 사용자 대상)
- **소스 코드 주석**: 모두 **한글**로 작성 (개발자 이해도 향상)
- **기타 문서** (CLAUDE.md, CHANGELOG.md 등): **한글**로 작성
- **사용자 대상 메시지** (CLI 출력, 에러 메시지, 로그 등): 반드시 **영문**으로 작성
  - 예: `console.log()`, `chalk.green()`, `throw new Error()` 등의 메시지
  - 모든 최종 사용자가 영어만 사용할 수 있다고 가정

### Homepage (Web) Development




#### Workflow for Claude SED Agent

- [ ] Learn SED Methodology: Read the following pages and understand SED methodology:
  - https://sedai.dev
  - https://sedai.dev/principles
  - https://sedai.dev/philosophy

- [ ] Always Consult Specifications First: Before starting any development task, read https://sedai.dev/instructions and ./specs/index.md

- [ ] Strict Specification Obedience:
  - Follow specifications exactly, even if they appear incorrect
  - Never implement features not defined in specifications
  - Never modify specifications directly during implementation
  - If specifications are unclear, ask for clarification rather than guessing

- [ ] Error Reporting Protocol: When critical errors are detected in specifications:
  - Halt development immediately
  - Report the issue to developers with specific details
  - Recommend specification improvements
  - Wait for specification updates before continuing

- [ ] Ask for Clarification When Needed: When specifications are ambiguous or incomplete:
  - Request clarification from the developer instead of making assumptions
  - Ask for specific details about logic, source code, styles, or any other information needed
  - Never proceed with implementation based on guesswork or inference
  - Ensure all details are explicitly documented before continuing development

**예시:**

```typescript
/**
 * 스펙 파일을 검증하는 함수
 * @param filePath - 검증할 파일 경로
 * @returns 검증 결과 객체
 */
export function validateSpec(filePath: string): ValidationResult {
  // 파일이 존재하는지 확인
  if (!fs.existsSync(filePath)) {
    // ✅ 사용자에게 표시되는 메시지는 영문으로
    throw new Error('Spec file not found');
  }

  // 파일 내용을 읽어옴
  const content = fs.readFileSync(filePath, 'utf-8');

  // ✅ 사용자에게 표시되는 메시지는 영문으로
  console.log('Validating spec file...');

  return { valid: true, errors: [] };
}
```

### UTF-8 인코딩

**🔥 중요**: 모든 파일은 **UTF-8 인코딩(BOM 없음)**으로 작성되어야 합니다.

자세한 내용은 상단의 [UTF-8 인코딩 필수 규칙](#-utf-8-인코딩-필수-규칙) 섹션을 참조하세요.

**파일 작성 후 반드시 인코딩을 확인하세요:**
```bash
file -I <파일명>
# 출력에 charset=utf-8 이 나와야 합니다
```

### 코드 스타일

- TypeScript strict 모드 사용
- 모든 함수와 인터페이스에 JSDoc 주석 추가
- 한글 주석 적극 활용

### 테스트 작성

- Vitest를 사용하여 단위 테스트 작성
- 모든 public 함수는 테스트 커버리지 필수
- `*.test.ts` 파일명 규칙 준수

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
