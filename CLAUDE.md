# SEDAI 프로젝트 개발 문서

이 문서는 SEDAI (Spec-Exact Development by AI) 프로젝트의 구현 내용과 개발 가이드를 담고 있습니다.

## 📋 구현된 기능

### 1. 프로젝트 초기화

- ✅ TypeScript 기반 개발 환경
- ✅ Node.js 버전 20으로 고정 (`.nvmrc`, `package.json` engines)
- ✅ Unit test 환경 (Vitest 2.0)

### 2. NPM 패키지 설정

- ✅ `npm i -g sedai` 로 설치 가능
- ✅ `npx sedai --help` 명령으로 사용 가능
- ✅ CLI 명령어 구현:
  - `sedai doctor` - 스펙 검증
  - `sedai init` - 프로젝트 초기화
  - `sedai validate <file>` - 단일 파일 검증
  - `sedai score <file>` - 점수 계산

### 3. SED 개념 문서화

- ✅ 한글 내용을 영문으로 완전히 번역
- ✅ README.md에 상세한 설명 포함:
  - Origin Story (탄생 배경)
  - Core Principles (기본 원칙)
  - Development Process Phases (개발 프로세스)
  - Philosophy Summary (철학 요약)
  - Spec File Structure (스펙 파일 구조)
  - Testing Specifications (테스트 명세)

## ⚙️ 개발 워크플로우

**중요: 개발자가 요청할 때마다 항상 아래 워크플로우를 따라야 합니다.**

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
- **Styling:** Chalk 5.3.0
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

현재는 TODO 상태인 기능들을 구현해야 합니다:

- [ ] 스펙 파일 파싱 (YAML 파서)
- [ ] 스펙 구조 검증 로직
- [ ] 점수 계산 알고리즘
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

모든 파일은 **UTF-8 인코딩(BOM 없음)**으로 작성되어야 합니다.

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
