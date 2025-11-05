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

# SED Production: NPM Publish

## Overview

SEDAI를 NPM 레지스트리에 배포하는 프로세스입니다. 배포 전 체크리스트, 배포 후 확인, 롤백 절차까지 모든 과정을 명시합니다.

## Requirements

### Environment
- **Node.js:** ≥20.0.0
- **npm:** ≥10.2.3
- **NPM Account:** npmjs.com 계정 필수
- **Git:** Clean working directory (커밋 안된 변경사항 없음)

### Permissions
- NPM 패키지 소유자 또는 maintainer 권한 필요

## Workflow

### 1. 배포 전 체크리스트

#### 1.1 코드 품질 확인
```bash
# 모든 테스트 통과
npm test
# 출력: ✅ All tests passed

# TypeScript 빌드 성공
npm run build
# 출력: 빌드 완료 오류 없음

# 린트 검사 통과
npm run lint
# 출력: 린트 오류 없음

# 포맷 확인
npm run format
# 출력: 포맷 변경사항 없음
```

#### 1.2 버전 업데이트
```bash
# package.json 버전 확인
grep '"version"' package.json
# 출력: "version": "0.1.0"

# src/version.ts 버전 동기화 확인
grep 'version' src/version.ts
# 출력: export const version = '0.1.0';

# 버전 업데이트 (필요시)
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0
```

#### 1.3 프로덕션 CLI 테스트
```bash
npm run test:prod
```

**test:prod 스크립트 내용:**
```bash
#!/bin/bash
# tests/prod/test.sh

npm run build

echo "Testing CLI commands..."

# --help
node dist/cli.js --help || exit 1

# --version
node dist/cli.js --version || exit 1

# init (비대화형)
node dist/cli.js init -n "test-app" -s "Test" -a "Tester" -e "test@test.com" || exit 1

# 생성된 파일 확인
[ -d "specs" ] || exit 1
[ -f "specs/test-app-index.md" ] || exit 1

# 정리
rm -rf specs/

echo "✅ All production tests passed"
```

#### 1.4 package.json 검증
```json
{
  "name": "sedai",
  "version": "0.1.0",
  "description": "...",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "sedai": "dist/cli.js",
    "spec": "dist/cli.js"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

확인 사항:
- ✅ `files` 필드에 `dist` 포함
- ✅ `main`이 `dist/index.js`를 가리킴
- ✅ `types`가 `dist/index.d.ts`를 가리킴
- ✅ `bin` 필드 올바름
- ✅ `prepublishOnly` 스크립트 존재

#### 1.5 README 및 LICENSE 확인
```bash
# README.md 존재 확인
[ -f "README.md" ] && echo "✅ README.md exists"

# LICENSE 존재 확인
[ -f "LICENSE" ] && echo "✅ LICENSE exists"

# package.json license 필드 확인
grep '"license"' package.json
# 출력: "license": "MIT"
```

### 2. NPM 배포

#### 2.1 NPM 로그인
```bash
npm login

# 프롬프트 입력:
Username: thruthesky
Password: ********
Email: thruthesky@gmail.com

# 로그인 확인
npm whoami
# 출력: thruthesky
```

#### 2.2 Dry Run (실제 배포 없이 시뮬레이션)
```bash
npm publish --dry-run
```

**출력 예시:**
```
npm notice
npm notice 📦 sedai@0.1.0
npm notice === Tarball Contents ===
npm notice 1.1kB  LICENSE
npm notice 5.2kB  README.md
npm notice 658B   package.json
npm notice 2.3kB  dist/cli.js
npm notice 524B   dist/index.js
npm notice 1.2kB  dist/index.d.ts
npm notice === Tarball Details ===
npm notice name:          sedai
npm notice version:       0.1.0
npm notice filename:      sedai-0.1.0.tgz
npm notice package size:  3.2 kB
npm notice unpacked size: 11.0 kB
npm notice total files:   6
npm notice
```

확인 사항:
- ✅ `dist/` 파일들이 포함됨
- ✅ `src/` 파일들이 제외됨
- ✅ `node_modules/` 제외됨
- ✅ 패키지 크기가 합리적 (보통 수 MB 이하)

#### 2.3 실제 배포
```bash
npm publish
```

**출력:**
```
npm notice
npm notice 📦 sedai@0.1.0
npm notice === Tarball Contents ===
...
npm notice === Tarball Details ===
...
+ sedai@0.1.0
```

### 3. 배포 후 확인

#### 3.1 NPM 레지스트리 확인
```bash
# 배포된 패키지 정보 확인
npm view sedai

# 출력:
# sedai@0.1.0 | MIT | deps: 4 | versions: 1
# Spec-Exact Development by AI
# https://github.com/thruthesky/sedai

# 최신 버전 확인
npm view sedai version
# 출력: 0.1.0
```

#### 3.2 설치 테스트
```bash
# 새로운 디렉토리에서 테스트
cd /tmp
mkdir test-sedai-install
cd test-sedai-install

# npx로 즉시 테스트
npx sedai@latest --version
# 출력: 0.1.0

npx spec@latest --version
# 출력: 0.1.0

# init 명령 테스트
npx spec@latest init -n "test" -s "Test" -a "Tester" -e "test@test.com"
# 출력: ✅ 파일 생성 성공

# 정리
cd ~
rm -rf /tmp/test-sedai-install
```

#### 3.3 GitHub Release (선택사항)
```bash
# Git 태그 생성
git tag -a v0.1.0 -m "Release version 0.1.0"

# GitHub에 푸시
git push origin v0.1.0

# GitHub Releases 페이지에서 릴리스 노트 작성
```

### 4. 버전 업데이트 및 준비

#### 4.1 CHANGELOG 업데이트
```markdown
# CHANGELOG.md

## [0.1.0] - 2025-11-05

### Added
- ✅ `spec init` command with interactive prompts
- ✅ Dual command support: `sedai` and `spec`
- ✅ YAML header generation
- ✅ UTF-8 encoding guarantee

### Changed
- Updated README.md with usage examples

### Fixed
- None
```

#### 4.2 다음 개발용 버전으로 전환
```bash
# package.json 버전 업데이트 (선택사항)
npm version prerelease --preid=dev
# 0.1.0 → 0.1.1-dev.0

# src/version.ts 동기화
echo "export const version = '0.1.1-dev.0';" > src/version.ts

# 커밋
git add .
git commit -m "chore: bump version to 0.1.1-dev.0"
git push
```

## Details

### prepublishOnly 스크립트
```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```
- `npm publish` 실행 전에 자동으로 `npm run build` 실행
- 빌드 실패 시 배포 중단
- 항상 최신 빌드로 배포됨이 보장

### .npmignore vs files
**권장: `files` 필드 사용**

```json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```
- Whitelist 방식 (명시한 파일만 포함)
- `.npmignore`보다 안전
- 실수로 민감한 파일 포함 방지

### 배포 실패 시 대응 방법

#### 버전 중복
```
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/sedai
npm ERR! You cannot publish over the previously published versions
```
**해결:** 버전 업데이트 후 재배포
```bash
npm version patch
npm publish
```

#### 권한 없음
```
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/sedai
npm ERR! You do not have permission to publish "sedai"
```
**해결:** 패키지 소유자에게 권한을 요청하거나 다른 패키지 이름 사용

#### 네트워크 타임아웃
```
npm ERR! network timeout
```
**해결:** 네트워크 확인 후 재시도
```bash
npm publish --registry https://registry.npmjs.org/
```

## Testing

### 배포 전 체크리스트
- ✅ `npm test` 통과
- ✅ `npm run build` 성공
- ✅ `npm run test:prod` 통과
- ✅ `package.json` 버전 업데이트
- ✅ `src/version.ts` 동기화
- ✅ `CHANGELOG.md` 업데이트
- ✅ Git clean working directory
- ✅ README.md 최신화
- ✅ LICENSE 파일 존재

### 배포 후 체크리스트
- ✅ `npm view sedai` 확인
- ✅ `npx sedai@latest --version` 테스트
- ✅ `npx spec@latest init` 테스트
- ✅ GitHub Release 생성
- ✅ Git 태그 생성

## Notes

### SED 원칙
- ✅ 모든 배포 절차는 정확히 명시됨
- ✅ 체크리스트 기반 검증 필수
- ✅ 배포 후 테스트 필수
- ✅ 버전 관리 철저히 수행

### Semantic Versioning
- **Major (1.0.0):** Breaking changes
- **Minor (0.1.0):** New features, backward compatible
- **Patch (0.0.1):** Bug fixes, backward compatible

### 관련 문서
- `sed-test-unit.md` - 단위 테스트
- `sed-setup-nodejs.md` - 환경 설정
