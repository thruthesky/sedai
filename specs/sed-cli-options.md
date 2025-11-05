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

# SED CLI: Global Options

## Overview

SEDAI CLI의 전역 옵션과 명령어 목록을 정의하는 문서입니다. 모든 하위 명령어가 공통적으로 사용하는 옵션들을 명시합니다.

## Requirements

### Environment
- **Node.js:** ≥20.0.0
- **Commander.js:** ^12.0.0

## Workflow

### 전역 옵션 사용 방법
1. CLI 진입 시 전역 옵션 파싱
2. 하위 명령어 옵션 파싱
3. 충돌 옵션은 명령어 우선

## Details

### 전역 옵션 정의

#### `-V, --version`
- **목적:** SEDAI 버전 출력
- **예시:**
  ```bash
  npx spec --version
  # 출력: 0.1.0
  ```
- **구현 위치:** `src/cli.ts:22`
- **주의:** `package.json`의 `version` 필드와 출력 값이 동기화

#### `-h, --help`
- **목적:** 도움말 메시지 출력
- **예시:**
  ```bash
  npx spec --help
  ```
- **출력 예시:**
  ```
  Usage: sedai [options] [command]

  Spec-Exact Development by AI - AI develops exactly as the spec defines

  Options:
    -V, --version     output the version number
    -h, --help        display help for command

  Commands:
    doctor [options]  Analyze and validate your SED specifications
    init [options]    Initialize a new SED project
    validate <file>   Validate a single specification file
    score <file>      Calculate specification completeness score
    help [command]    display help for command
  ```

### 명령어 목록

#### `init`
- **목적:** Initialize a new SED project
- **옵션:**
  - `-n, --name <name>` - Project name
  - `-s, --summary <summary>` - Project summary
  - `-a, --author <author>` - Author name
  - `-e, --email <email>` - Author email
- **명세 문서:** `sed-command-init.md`

#### `doctor`
- **목적:** Analyze and validate your SED specifications
- **옵션:**
  - `-p, --path <path>` - Path to specifications directory (기본: ./specs)
  - `-s, --score <number>` - Minimum required score (기본: 90)
- **상태:** ⏳ Planned
- **명세 문서:** `sed-command-doctor.md`

#### `validate`
- **목적:** Validate a single specification file
- **인자:** `<file>` - Spec file path (필수)
- **상태:** ⏳ Planned
- **명세 문서:** `sed-command-validate.md`

#### `score`
- **목적:** Calculate specification completeness score
- **인자:** `<file>` - Spec file path (필수)
- **상태:** ⏳ Planned
- **명세 문서:** `sed-command-score.md`

## Testing

### 테스트 체크리스트
1. ✅ `--version` 옵션 시 버전 출력
2. ✅ `--help` 도움말 출력
3. ✅ 잘못된 명령 시 에러 메시지 출력
4. ✅ 각 하위 명령어 출력 시 도움말 포함

## Notes

### SED 원칙
- ✅ 모든 옵션은 정확히 문서화됨
- ✅ 기본값은 명시적
- ✅ 각 옵션의 주의사항 명시 필요

### 관련 문서
- `sed-command-init.md`
- `sed-command-doctor.md`
- `sed-command-validate.md`
- `sed-command-score.md`
