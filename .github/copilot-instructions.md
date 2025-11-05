# SEDAI - AI Coding Agent Instructions

SEDAI (Spec-Exact Development by AI)는 AI가 명세서에 정확히 따라 개발을 수행하는 방법론과 도구입니다.

## 🎯 핵심 철학

**절대 원칙**: 명세서가 법칙입니다. AI는 추론하지 않고 오직 명세서에 명시된 것만 구현합니다.

- 명세서가 불완전하면 개발을 중단하고 SpecError를 반환
- 완성도 점수 90점 이상일 때만 개발 시작
- 모호한 부분은 구현하지 않음 - 개발자에게 명확화 요청

## 🏗️ 프로젝트 구조

```
sedai/
├── src/
│   ├── cli.ts        # CLI 진입점 (Commander.js 기반)
│   ├── index.ts      # 메인 API 및 타입 정의
│   ├── version.ts    # 버전 정보 (package.json과 동기화)
│   └── *.test.ts     # Vitest 기반 단위 테스트
├── dist/             # TypeScript 빌드 결과물
└── .github/          # GitHub 설정 및 문서
```

## ⚙️ 개발 환경

- **Runtime**: Node.js ≥24.0.0 (`.nvmrc`, `package.json` engines 참조)
- **Language**: TypeScript 5.6+ (엄격한 타입 체크 활성화)
- **CLI Framework**: Commander.js 12.0
- **Testing**: Vitest 2.0 (globals 활성화, node 환경)
- **Build**: TypeScript Compiler → CommonJS 모듈 출력

## 🛠️ 핵심 개발 워크플로우

### 빌드 및 테스트
```bash
npm run build          # TypeScript 컴파일 (dist/ 출력)
npm run dev            # Watch 모드 개발
npm test               # Vitest 실행 (모든 *.test.ts 파일)
npm run test:coverage  # 커버리지 리포트 생성
```

### CLI 디버깅
```bash
# 로컬 빌드로 CLI 테스트
node dist/cli.js doctor
node dist/cli.js --help
```

## 📝 코딩 규칙

### 파일 구조 패턴
- `src/cli.ts`: Commander.js 명령어 정의, chalk로 컬러 출력
- `src/index.ts`: TypeScript 인터페이스 및 공개 API export
- `src/*.test.ts`: Vitest describe/it/expect 패턴 사용
- `src/version.ts`: package.json과 수동 동기화 필요

### 타입 시스템
- 모든 공개 인터페이스는 JSDoc 주석 필수
- `SpecHeader` 인터페이스: YAML 헤더 구조 정의
- `ValidationResult` 인터페이스: 스펙 검증 결과 구조
- strict 모드: `noUncheckedIndexedAccess`, `noImplicitReturns` 활성화

### CLI 명령어 패턴
- `sedai doctor`: 스펙 파일 검증 및 점수 계산
- `sedai init`: 새 SED 프로젝트 초기화
- `sedai validate <file>`: 단일 스펙 파일 검증
- `sedai score <file>`: 스펙 완성도 점수 계산

## 🧪 테스트 규칙

- 파일명: `*.test.ts` (Vitest 자동 감지)
- 테스트는 한국어 describe/it 메시지 사용
- 버전 정보 동기화 테스트 필수
- 커버리지 제외: `node_modules/`, `dist/`, 테스트 파일, `types.ts`

## 📦 배포 프로세스

1. `npm run build` - TypeScript 컴파일 확인
2. 테스트 통과 확인: `npm test`
3. `src/version.ts`와 `package.json` 버전 동기화 확인
4. `npm publish` (prepublishOnly 훅이 자동 빌드)

## 🚨 중요한 제약사항

- **Node.js 24+ 필수**: ES2022 타겟, 최신 기능 활용
- **CommonJS 출력**: ESM이 아닌 CommonJS로 빌드 (`"module": "CommonJS"`)
- **엄격한 TypeScript**: 모든 타입 체크 옵션 활성화
- **버전 수동 동기화**: `version.ts`는 자동 업데이트되지 않음

## 📖 SED 방법론 구현

이 프로젝트는 SED 방법론 자체를 구현하는 도구이므로:
- 스펙 검증 로직은 90점 기준 엄격하게 적용
- YAML 헤더 파싱과 검증이 핵심 기능
- CLI 출력은 명확한 오류/경고/제안 구분 필요
