---
name: sed
version: 1.0.2
description: SEDAI (NODE.JS NPM Module) 을 작성하기 위한 SED 가이드
author: JaeHo Song
email: thruthesky@gmail.com
homepage: https://github.com/thruthesky/
license: GPL
dependencies:
---

# SED Testing: Unit Tests

## Overview

SEDAI 프로젝트의 단위 테스트 작성 가이드입니다. Vitest 2.0을 사용하여 모든 함수와 기능을 테스트합니다.

## Requirements

### Testing Framework
- **Vitest:** ^2.0.0
- **@vitest/ui:** ^2.0.0 (UI 모드)
- **Node.js:** ≥20.0.0

### Coverage Target
- **Statement Coverage:** ≥80%
- **Branch Coverage:** ≥80%
- **Function Coverage:** ≥80%
- **Line Coverage:** ≥80%

## Workflow

### 1. 테스트 환경 설정

#### vitest.config.ts
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

### 2. 테스트 파일 작성

#### 파일 이름 규칙
- `{module}.test.ts` 형식
- 예: `src/index.test.ts`, `src/cli.test.ts`

#### 테스트 템플릿
```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from './module';

describe('Module Name', () => {
  describe('functionName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionToTest(input);

      // Assert
      expect(result).toBe('expected');
    });

    it('should handle edge cases', () => {
      expect(functionToTest('')).toThrow();
    });
  });
});
```

### 3. 테스트 실행

```bash
# 단일 실행
npm test

# Watch 모드
npm test -- --watch

# UI 모드
npm run test:ui

# 커버리지 포함
npm run test:coverage
```

## Details

### 테스트 예시

#### 1. 타입 정의 테스트
```typescript
// src/index.test.ts
import { describe, it, expect } from 'vitest';
import type { SpecHeader, ValidationResult } from './index';

describe('Type Definitions', () => {
  it('should have valid SpecHeader interface', () => {
    const header: SpecHeader = {
      name: 'test',
      version: '1.0.0',
      description: 'Test spec',
      author: 'Test Author',
      email: 'test@example.com',
      license: 'MIT',
    };

    expect(header.name).toBe('test');
  });
});
```

#### 2. CLI 명령어 테스트 (향후 구현)
```typescript
// src/cli.test.ts
import { describe, it, expect, vi } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('CLI Commands', () => {
  it('should show version', async () => {
    const { stdout } = await execAsync('node dist/cli.js --version');
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should show help', async () => {
    const { stdout } = await execAsync('node dist/cli.js --help');
    expect(stdout).toContain('Usage: sedai');
  });
});
```

#### 3. 함수 단위 테스트 (향후 구현)
```typescript
// src/validator.test.ts
import { describe, it, expect } from 'vitest';
import { validateYamlHeader } from './validator';

describe('validateYamlHeader', () => {
  it('should validate correct YAML header', () => {
    const yaml = `---
name: test
version: 1.0.0
description: Test
author: Author
email: test@example.com
license: MIT
---`;

    const result = validateYamlHeader(yaml);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid email', () => {
    const yaml = `---
email: invalid-email
---`;

    const result = validateYamlHeader(yaml);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid email format');
  });
});
```

### 현재 테스트 상태

#### ✅ 완료
- `src/index.test.ts` - 기본 타입정의 테스트 2개

#### ⏳ 예정
- CLI 명령어 테스트
- YAML 파싱 테스트
- 파일 검증 테스트
- 점수 계산 테스트

### 커버리지 확인

```bash
npm run test:coverage
```

**출력 예시:**
```
 % Coverage report from v8
-----------------|---------|----------|---------|---------|
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
All files        |   85.71 |      100 |      80 |   85.71 |
 index.ts        |   85.71 |      100 |      80 |   85.71 |
-----------------|---------|----------|---------|---------|
```

## Testing

### CI/CD 통합

#### GitHub Actions (향후 구현)
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

### 테스트 체크리스트
- ✅ 모든 테스트 통과
- ✅ 커버리지 80% 이상
- ✅ 엣지 케이스 모두 테스트
- ✅ 에러 상황 처리 테스트
- ✅ 통합 테스트

## Notes

### SED 원칙
- ✅ 모든 public 함수 테스트 필수
- ✅ 테스트 코드도 구체적 명세 필요
- ✅ AAA 패턴 (Arrange-Act-Assert) 준수

### 관련 문서
- `sed-setup-nodejs.md` - 테스트 환경 설정
- `sed-production-publish.md` - 배포 전 테스트
