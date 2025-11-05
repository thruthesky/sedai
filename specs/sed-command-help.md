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

# SED Command: help

## Overview

`spec help` 명령어는 SEDAI CLI의 도움말을 표시하는 명령어입니다. 전체 명령어 목록과 각 명령어의 사용법을 보여줍니다.

**상태:** ✅ 완전 구현됨 (Commander.js 기본 기능)

## Requirements

### Environment
- **Node.js:** ≥20.0.0
- **Commander.js:** ^12.0.0

## Workflow

### 1. 전체 도움말
```bash
npx spec --help
# 또는
npx spec help
```

**출력:**
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

### 2. 특정 명령어 도움말
```bash
npx spec help init
```

**출력:**
```
Usage: sedai init [options]

Initialize a new SED project

Options:
  -n, --name <name>        Project name
  -s, --summary <summary>  Project summary/description
  -a, --author <author>    Author name
  -e, --email <email>      Author email
  -h, --help               display help for command
```

## Details

### 구현 위치
- `src/cli.ts:94-98`
- Commander.js 내장 기능으로 자동 구현

### 커스터마이징
Commander의 `.configureHelp()` 메서드로 도움말 형식을 커스터마이징할 수 있습니다:

```typescript
program.configureHelp({
  sortSubcommands: true,
  sortOptions: true,
});
```

## Testing

### 테스트 체크리스트
1. ✅ `--help` 옵션 시 전체 도움말 출력
2. ✅ `help` 명령 시 전체 도움말 출력
3. ✅ `help <command>` 시 특정 명령어 도움말 출력
4. ✅ 잘못된 명령어 입력 시 오류 출력

## Notes

### 관련 문서
- `sed-cli-options.md` - 전체 CLI 옵션
