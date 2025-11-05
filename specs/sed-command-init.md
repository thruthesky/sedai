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

# SED Command: init

## Overview

`spec init` 명령어는 새 SED(Spec-Exact Development) 프로젝트를 초기화하는 CLI 명령어입니다. 이 명령어는 사용자 입력을 받아 프로젝트를 설정하고, `./specs` 폴더를 생성하며, YAML 헤더가 포함된 기본 스펙 파일들을 생성합니다.

## Requirements

### Environment
- **Node.js:** ≥20.0.0 (LTS)
- **npm:** ≥10.2.3
- **Operating System:** macOS 14.2+, Ubuntu 22.04+, Windows 10+

### Dependencies
- **prompts:** ^2.4.2 (사용자 입력)
- **chalk:** ^5.3.0 (터미널 스타일링)
- **commander:** ^12.0.0 (CLI 프레임워크)

### Installation
```bash
npm install -g sedai
# 또는
npx sedai@latest
```

## Workflow

### 1. 명령어 실행
사용자는 두 가지 방법으로 명령어를 실행할 수 있습니다:

**대화형 모드:**
```bash
npx spec init
```

**비대화형 모드 (옵션으로 모든 값 제공):**
```bash
npx spec init -n "my-app" -s "My awesome application" -a "Your Name" -e "your@email.com"
```

**부분 옵션 제공 (나머지는 대화형):**
```bash
npx spec init -n "my-app"
```

### 2. 사용자 입력 받기
다음 항목들을 순서대로 물어봅니다 (옵션으로 제공되지 않은 경우에만 질문):

1. **Spec name** (필수)
   - 검증: 빈 문자열 불가
   - 에러 메시지: "Spec name is required"

2. **Spec summary/description** (필수)
   - 검증: 빈 문자열 불가
   - 에러 메시지: "Summary is required"

3. **Your name** (필수)
   - 검증: 빈 문자열 불가
   - 에러 메시지: "Author name is required"

4. **Your email** (필수)
   - 검증: RFC 5322 이메일 형식
   - 정규식: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - 에러 메시지: "Valid email is required"

### 3. Specs 폴더 생성
- **경로:** `./specs` (현재 작업 폴더 기준)
- **권한:** `755` (읽기/쓰기/실행)
- **동작:**
  - 폴더가 없을 시 생성: `✅ Created directory: /path/to/specs`
  - 폴더가 이미 있을 시 경고: `⚠️  Directory already exists: /path/to/specs`

### 4. 스펙 파일 생성
다음 4개의 Markdown 파일을 생성합니다:

#### 4.1. `<name>-index.md`
- **Title:** `{name} - Index`
- **Description:** `Main index specification for {name}. {summary}`
- **용도:** 프로젝트 전체 구조를 정리하는 DTOC(Detailed Table of Contents)

#### 4.2. `<name>-setup-database.md`
- **Title:** `{name} - Database Setup`
- **Description:** `Database setup and configuration for {name}`
- **용도:** 데이터베이스 선택, 스키마, 마이그레이션

#### 4.3. `<name>-setup-backend.md`
- **Title:** `{name} - Backend Setup`
- **Description:** `Backend setup and API implementation for {name}`
- **용도:** 백엔드 프레임워크, API 엔드포인트, 비즈니스 로직

#### 4.4. `<name>-setup-frontend.md`
- **Title:** `{name} - Frontend Setup`
- **Description:** `Frontend setup and UI implementation for {name}`
- **용도:** 프론트엔드 프레임워크, 컴포넌트, UI/UX

### 5. YAML 헤더 생성
각 파일 상단에 다음 YAML 헤더를 추가합니다:

```yaml
---
title: {파일 제목}
description: {파일 설명}
author: {사용자가 입력한 이름}
email: {사용자가 입력한 이메일}
date: {YYYY-MM-DD 형식의 현재 날짜}
version: 1.0.0
status: draft
---
```

### 6. 기본 내용 추가
각 파일에 다음 템플릿을 사용합니다:

```markdown
# {Title}

## Overview

{Description}

## Requirements

- Requirement 1
- Requirement 2

## Workflow

1. Step 1
2. Step 2

## Dependencies

None

## Notes

Add any additional notes here.
```

### 7. UTF-8 인코딩 적용
- **인코딩:** UTF-8 (BOM 없음)
- **개행:** LF (`\n`)
- **검증:** `file -I {filename}` 시 `charset=utf-8`

### 8. 완료 메시지 출력
```
🎉 SED project initialized successfully!

Created files:
  - specs/{name}-index.md
  - specs/{name}-setup-database.md
  - specs/{name}-setup-backend.md
  - specs/{name}-setup-frontend.md
```

## Details

### CLI 옵션

| 옵션 | 짧은 형식 | 긴 형식 | 타입 | 필수 | 설명 |
|------|----------|---------|------|------|------|
| Name | `-n` | `--name` | string | ✅ | 프로젝트 이름 |
| Summary | `-s` | `--summary` | string | ✅ | 프로젝트 요약/설명 |
| Author | `-a` | `--author` | string | ✅ | 작성자 이름 |
| Email | `-e` | `--email` | string | ✅ | 작성자 이메일 |

### 함수 정의

#### `init` Command Action Handler
- **위치:** `src/cli.ts:59-207`
- **시그니처:** `async (options: CommandOptions) => Promise<void>`
- **매개변수:**
  - `options.name?: string` - 프로젝트 이름
  - `options.summary?: string` - 프로젝트 요약
  - `options.author?: string` - 작성자 이름
  - `options.email?: string` - 작성자 이메일
- **동작:**
  1. 옵션으로 제공되지 않은 값은 `prompts` 라이브러리로 입력 받음
  2. `Ctrl+C` 입력 시 취소 메시지 출력 후 종료
  3. `./specs` 폴더 생성 (이미 있으면 건너뜀)
  4. 4개의 스펙 파일 생성 (YAML 헤더 + 기본 내용)
  5. 성공 메시지 출력

#### `createYamlHeader` 헬퍼 함수
- **위치:** `src/cli.ts:131-166`
- **시그니처:** `(title: string, description: string) => string`
- **매개변수:**
  - `title: string` - 파일 제목
  - `description: string` - 파일 설명
- **반환:** YAML 헤더와 기본 내용이 포함된 완전한 Markdown 문자열
- **인코딩:** UTF-8 (BOM 없음)

### 에러 처리

#### 사용자 취소 (Ctrl+C)
```typescript
if (!response.name && !options.name) {
  console.log(chalk.yellow('\n⚠️  Initialization cancelled.\n'));
  return;
}
```

#### 입력 값 검증
- **Spec name:** 빈 문자열 입력 시 `'Spec name is required'` 에러 메시지 표시 후 재입력 요청
- **Summary:** 빈 문자열 입력 시 `'Summary is required'` 에러 메시지 표시 후 재입력 요청
- **Author:** 빈 문자열 입력 시 `'Author name is required'` 에러 메시지 표시 후 재입력 요청
- **Email:** 이메일 형식 아닐 시 `'Valid email is required'` 에러 메시지 표시 후 재입력 요청

#### 폴더 생성 실패
```typescript
if (!fs.existsSync(specsDir)) {
  fs.mkdirSync(specsDir, { recursive: true });
  console.log(chalk.green(`✅ Created directory: ${specsDir}`));
}
```
- **권한 오류:** 시스템 에러 메시지 출력 후 프로그램 종료
- **디스크 공간:** Node.js 기본 에러 표시

### 실행 예시

#### 대화형 모드 예시
```bash
$ npx spec init

🚀 Initializing new SED project...

? Spec name: › my-awesome-app
? Spec summary/description: › A revolutionary application
? Your name: › John Doe
? Your email: › john.doe@example.com

✅ Created directory: /Users/john/projects/my-project/specs
✅ Created: my-awesome-app-index.md
✅ Created: my-awesome-app-setup-database.md
✅ Created: my-awesome-app-setup-backend.md
✅ Created: my-awesome-app-setup-frontend.md

🎉 SED project initialized successfully!

Created files:
  - specs/my-awesome-app-index.md
  - specs/my-awesome-app-setup-database.md
  - specs/my-awesome-app-setup-backend.md
  - specs/my-awesome-app-setup-frontend.md
```

#### 비대화형 모드 예시
```bash
$ npx spec init -n "my-app" -s "My app description" -a "Jane Doe" -e "jane@example.com"

🚀 Initializing new SED project...

✅ Created directory: /Users/jane/projects/my-app/specs
✅ Created: my-app-index.md
✅ Created: my-app-setup-database.md
✅ Created: my-app-setup-backend.md
✅ Created: my-app-setup-frontend.md

🎉 SED project initialized successfully!

Created files:
  - specs/my-app-index.md
  - specs/my-app-setup-database.md
  - specs/my-app-setup-backend.md
  - specs/my-app-setup-frontend.md
```

### 생성된 파일 예시

#### `my-app-index.md`
```markdown
---
title: my-app - Index
description: Main index specification for my-app. My app description
author: Jane Doe
email: jane@example.com
date: 2025-11-05
version: 1.0.0
status: draft
---

# my-app - Index

## Overview

Main index specification for my-app. My app description

## Requirements

- Requirement 1
- Requirement 2

## Workflow

1. Step 1
2. Step 2

## Dependencies

None

## Notes

Add any additional notes here.
```

## Testing

### Unit Tests
- **파일:** `src/cli.test.ts` (향후 구현)
- **프레임워크:** Vitest 2.0
- **커버리지 목표:** ≥80%

### 테스트 체크리스트
1. ✅ 대화형 모드로 입력 시 파일 생성
2. ✅ 비대화형 모드로 옵션 전달 시 파일 생성
3. ✅ 부분 옵션만 제공 시 나머지 대화형 입력
4. ✅ 이메일 형식 검증
5. ✅ 빈 입력 거부
6. ✅ UTF-8 인코딩 확인
7. ✅ Ctrl+C 입력 시 취소 (프로그램 종료)
8. ✅ 폴더 생성 실패 시 에러 (권한 오류)

### 수동 테스트
```bash
# 프로젝트 빌드 (테스트 전)
npm run build
node dist/cli.js init -n "test-app" -s "Test description" -a "Tester" -e "test@test.com"

# 파일 확인
ls -la specs/
file -I specs/*.md

# UTF-8 인코딩 확인
file -I specs/test-app-index.md
# 출력: specs/test-app-index.md: text/plain; charset=utf-8
```

## Notes

### SED 원칙 준수
이 명령어는 다음 SED 원칙을 따릅니다:
- ✅ **Spec-Exactness:** 모든 동작이 명세서에 정확히 명시됨
- ✅ **No Inference:** AI는 명세서에 없는 것을 추론하지 않음
- ✅ **Completeness:** 모든 옵션, 에러 처리, 출력 형식이 명시됨
- ✅ **Traceability:** 코드 위치, 함수 시그니처, 동작 순서가 문서화됨

### 향후 개선 사항
- [ ] `--template` 옵션으로 다른 템플릿 사용
- [ ] `--force` 옵션으로 기존 파일 덮어쓰기
- [ ] `--lang` 옵션으로 언어별 템플릿 제공
- [ ] 프로젝트 타입별 템플릿 (web, mobile, api, cli)
- [ ] Git 초기화 옵션
- [ ] package.json 자동 생성 옵션

### 관련 문서
- `sed-cli-options.md` - 전체 CLI 옵션 명세
- `sed-command-doctor.md` - 스펙 검증 명령어
- `sed-index.md` - SEDAI 프로젝트 전체 목차
