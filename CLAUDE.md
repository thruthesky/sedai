# SEDAI 프로젝트 개발 문서

이 문서는 SEDAI (Spec-Exact Development by AI) 프로젝트의 구현 내용과 개발 가이드를 담고 있습니다.

## 📋 구현된 기능

### 1. 프로젝트 초기화

- ✅ TypeScript 기반 개발 환경
- ✅ Node.js 버전 24로 고정 (`.nvmrc`, `package.json` engines)
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

## 🔧 기술 스택

- **Language:** TypeScript 5.6.0
- **Runtime:** Node.js ≥24.0.0
- **CLI Framework:** Commander.js 12.0
- **Styling:** Chalk 5.3.0
- **Testing:** Vitest 2.0
- **Build Tool:** TypeScript Compiler

## 📦 NPM 스크립트

```bash
npm run build          # TypeScript 빌드
npm run dev            # Watch 모드 개발
npm test               # 테스트 실행
npm run test:coverage  # 커버리지 포함 테스트
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
├── 📄 .nvmrc                # Node.js 버전 24 고정
├── 📄 .gitignore            # Git 무시 파일 목록
├── 📄 LICENSE               # MIT 라이선스
├── 📄 README.md             # 프로젝트 문서 (영문 번역 완료)
├── 📄 CLAUDE.md             # 개발 문서 (이 파일)
├── 📁 src/                  # TypeScript 소스 코드
│   ├── 📄 index.ts          # 메인 모듈 (타입 정의 및 export)
│   ├── 📄 cli.ts            # CLI 진입점 (commander 기반)
│   ├── 📄 version.ts        # 버전 정보
│   └── 📄 index.test.ts     # 단위 테스트
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
