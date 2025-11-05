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

# SED Setup: Node.js Project

## Overview

SEDAI CLI 도구를 개발하기 위한 Node.js 프로젝트 초기 설정 명세입니다. 이 문서는 Node.js 20.10.0 LTS, TypeScript 5.6.0, 그리고 필수 의존성 패키지들의 정확한 설치 및 설정 방법을 정의합니다.

## Requirements

### Environment
- **Node.js:** 20.10.0 LTS (nvm으로 관리)
- **npm:** Node.js에 포함된 버전 사용
- **TypeScript:** ^5.6.0
- **Package Manager:** npm (yarn, pnpm 사용 금지)

### Dependencies

#### Production Dependencies
```json
{
  "commander": "^12.0.0",
  "chalk": "^5.3.0",
  "prompts": "^2.4.2",
  "yaml": "^2.5.0"
}
```

#### Development Dependencies
```json
{
  "typescript": "^5.6.0",
  "@types/node": "^20.10.0",
  "@types/prompts": "^2.4.9",
  "vitest": "^2.0.0",
  "@vitest/ui": "^2.0.0"
}
```

## Workflow

### 1. Node.js 설치

#### nvm 설치 (macOS/Linux)
```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 설치 확인
nvm --version
```

#### Node.js 20.10.0 설치
```bash
# Node.js 20.10.0 설치
nvm install 20.10.0

# 기본 버전으로 설정
nvm use 20.10.0

# 확인
node --version  # v20.10.0
npm --version   # 10.2.3 (Node.js 20.10.0에 포함된 버전)
```

### 2. 프로젝트 초기화

#### 프로젝트 디렉토리 생성
```bash
mkdir sedai
cd sedai
```

#### npm 프로젝트 초기화
```bash
npm init -y
```

#### .nvmrc 파일 생성
```bash
echo "20.10.0" > .nvmrc
```

**목적:** 프로젝트에 진입할 때마다 `nvm use` 명령으로 Node.js 버전을 자동으로 전환할 수 있도록 함.

### 3. TypeScript 설정

#### TypeScript 및 타입 정의 설치
```bash
npm install --save-dev typescript @types/node @types/prompts
```

#### tsconfig.json 생성
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 4. 의존성 패키지 설치

#### Commander.js (CLI 프레임워크)
```bash
npm install commander
```
- **목적:** CLI 명령어, 옵션, 인자 파싱
- **버전:** ^12.0.0

#### Chalk (터미널 스타일링)
```bash
npm install chalk
```
- **목적:** 터미널 출력에 색상 및 스타일 추가
- **버전:** ^5.3.0
- **주의:** ESM 전용 패키지이므로 `type: "module"` 설정 필요

#### Prompts (대화형 프롬프트)
```bash
npm install prompts
```
- **목적:** 사용자 입력을 대화형으로 받기
- **버전:** ^2.4.2

#### YAML (YAML 파서)
```bash
npm install yaml
```
- **목적:** YAML 헤더 파싱 및 생성
- **버전:** ^2.5.0

### 5. 테스트 환경 설정

#### Vitest 설치
```bash
npm install --save-dev vitest @vitest/ui
```

#### vitest.config.ts 생성
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.config.ts',
      ],
    },
  },
});
```

### 6. package.json 설정

#### 필수 필드 설정
```json
{
  "name": "sedai",
  "version": "0.1.0",
  "description": "Spec-Exact Development by AI - CLI tool for AI-driven development",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "bin": {
    "sedai": "./dist/cli.js",
    "spec": "./dist/cli.js"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:prod": "node tests/prod/test.sh"
  },
  "keywords": [
    "ai",
    "cli",
    "development",
    "specification",
    "sed"
  ],
  "author": "JaeHo Song <thruthesky@gmail.com>",
  "license": "MIT",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

**중요 포인트:**
- `"type": "module"`: ESM 모듈 사용
- `"bin"`: 이중 명령어 지원 (`sedai`, `spec`)
- `"engines"`: Node.js 20 이상 필수
- `"files"`: NPM 배포 시 포함할 파일 목록

### 7. 소스 코드 디렉토리 생성

```bash
mkdir src
```

#### src/index.ts (메인 모듈)
```typescript
/**
 * SEDAI 메인 모듈
 * 타입 정의 및 공개 API
 */

export interface SpecHeader {
  name: string;
  version: string;
  description: string;
  author: string;
  email: string;
  homepage?: string;
  license: string;
  dependencies?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface SpecFile {
  header: SpecHeader;
  content: string;
}

export interface ScoringCriteria {
  yamlHeader: number;      // 0-20
  overview: number;         // 0-15
  requirements: number;     // 0-25
  workflow: number;         // 0-25
  details: number;          // 0-15
}
```

#### src/version.ts (버전 정보)
```typescript
/**
 * 버전 정보
 * package.json과 동기화되어야 함
 */
export const VERSION = '0.1.0';
```

#### src/cli.ts (CLI 진입점)
```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { VERSION } from './version.js';

const program = new Command();

program
  .name('sedai')
  .description('Spec-Exact Development by AI - AI develops exactly as the spec defines')
  .version(VERSION);

// 명령어 추가는 sed-command-*.md 스펙에 따라 구현

program.parse();
```

### 8. 빌드 및 실행

#### 빌드
```bash
npm run build
```

**결과:** `dist/` 디렉토리에 JavaScript 파일 생성
- `dist/index.js`
- `dist/cli.js`
- `*.d.ts` (타입 정의 파일)
- `*.map` (소스맵)

#### 로컬 테스트
```bash
# CLI 도움말
node dist/cli.js --help

# 버전 확인
node dist/cli.js --version
```

## Details

### 프로젝트 구조

```
sedai/
├── src/
│   ├── index.ts          # 메인 모듈 (타입 정의)
│   ├── cli.ts            # CLI 진입점
│   ├── version.ts        # 버전 정보
│   └── index.test.ts     # 단위 테스트
├── dist/                 # 빌드 결과 (생성됨)
├── node_modules/         # 의존성 (생성됨)
├── tests/
│   └── prod/             # 프로덕션 테스트
├── specs/                # 스펙 문서 (이 파일 포함)
├── package.json
├── package-lock.json
├── tsconfig.json
├── vitest.config.ts
├── .nvmrc
├── .gitignore
├── README.md
├── CLAUDE.md
└── LICENSE
```

### .gitignore 설정

```gitignore
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist/
*.tsbuildinfo

# Testing
coverage/
.vitest/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
```

### ESM 모듈 설정

**중요:** 이 프로젝트는 ESM (ECMAScript Modules)을 사용합니다.

#### package.json에 필수
```json
{
  "type": "module"
}
```

#### import 시 확장자 포함 필수
```typescript
// ✅ 올바른 방식
import { VERSION } from './version.js';

// ❌ 잘못된 방식
import { VERSION } from './version';
```

### CLI 실행 권한

#### src/cli.ts 첫 줄에 shebang 추가
```typescript
#!/usr/bin/env node
```

#### 빌드 후 실행 권한 부여 (선택사항)
```bash
chmod +x dist/cli.js
```

## Testing

### 테스트 실행

```bash
# 모든 테스트 실행
npm test

# Watch 모드
npm test -- --watch

# UI 모드
npm run test:ui

# 커버리지 확인
npm run test:coverage
```

### 빌드 검증

```bash
# TypeScript 컴파일 확인
npm run build

# 생성된 파일 확인
ls -la dist/
```

### 프로덕션 테스트

```bash
# 배포 전 프로덕션 환경 테스트
npm run test:prod
```

## Notes

### SED 준수 사항
- ✅ 모든 버전 번호는 정확히 명시
- ✅ 설치 명령어는 검증된 순서대로 실행
- ✅ 설정 파일은 완전한 형태로 제공
- ✅ ESM 모듈 사용 필수

### 주의사항

1. **Node.js 버전 고정**
   - 반드시 20.10.0 사용
   - .nvmrc 파일로 버전 관리

2. **ESM 모듈**
   - `type: "module"` 필수
   - import 시 `.js` 확장자 포함

3. **Chalk 5.x**
   - ESM 전용 패키지
   - CommonJS에서 사용 불가

4. **의존성 버전**
   - package.json의 버전 범위는 `^` 사용
   - 메이저 버전 변경 시 테스트 필요

### 관련 문서
- `sed-test-unit.md` - 테스트 작성 가이드
- `sed-production-publish.md` - NPM 배포 가이드
- `sed-cli-options.md` - CLI 구조 설정
