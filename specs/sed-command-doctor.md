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

# SED Command: doctor

## Overview

`spec doctor` 명령어는 프로젝트의 모든 스펙 파일들을 검증하고 진단하여 완성도를 평가하는 명령어입니다. SEDAI의 핵심 원칙인 "90점 이상의 스펙만 개발 가능"을 실현합니다.

**상태:** ⏳ Planned (Coming Soon)

## Requirements

### Environment
- **Node.js:** ≥20.0.0
- **YAML Parser:** yaml ^2.5.0

### Dependencies
- `sed-command-validate.md` - 단일 파일 검증 로직
- `sed-command-score.md` - 점수 계산 로직

## Workflow

### 1. 명령어 실행
```bash
npx spec doctor

# 또는 옵션 지정
npx spec doctor --path ./specs --score 90
```

### 2. 스펙 디렉토리 스캔
- 기본 경로: `./specs`
- 모든 `.md` 파일 검색
- YAML 헤더가 있는 파일만 검증

### 3. 각 파일 검증
다음 항목들을 검증합니다:

#### 3.1 YAML 헤더 검증
- `name` - 필수, 255자 이하
- `version` - 필수, Semantic Versioning 형식
- `description` - 필수, 4096자 이하
- `author` - 필수, 64자 이하
- `email` - 필수, 이메일 형식
- `license` - 필수

#### 3.2 필수 섹션 검증
- `## Overview` - 프로젝트 개요
- `## Requirements` - 요구사항 정의
- `## Workflow` - 작업 흐름

#### 3.3 내용 완성도 검증
- 각 섹션의 최소 길이 (최소 100자)
- 구체적인 내용 포함 여부
- 명령어 예시 포함 여부

### 4. 점수 계산
각 파일당 0-100점 점수:
- YAML 헤더: 20점
- Overview: 15점
- Requirements: 25점
- Workflow: 25점
- Details: 15점

### 5. 결과 출력
```
🔍 Analyzing your SED specifications...

📁 Specification directory: ./specs
✅ Required score: 90/100

Validating specifications:
  ✅ sed-index.md (95/100)
  ✅ sed-command-init.md (98/100)
  ❌ sed-command-doctor.md (45/100) - Below threshold
  ✅ sed-setup-nodejs.md (92/100)

Overall Score: 82/100
Status: ❌ FAIL - 1 file(s) below threshold

Recommendations:
  - sed-command-doctor.md: Add detailed workflow steps (missing 45 points)
```

## Details

### CLI 옵션

| 옵션 | 짧은 형식 | 긴 형식 | 기본값 | 목적 |
|------|----------|---------|--------|------|
| Path | `-p` | `--path` | `./specs` | 스펙 디렉토리 경로 |
| Score | `-s` | `--score` | `90` | 최소 요구 점수 |

### 종료 코드
- `0` - 모든 파일이 최소 점수 이상
- `1` - 일부 파일이 최소 점수 미달
- `2` - 스펙 디렉토리 없음 또는 파일 없음

## Testing

### 테스트 체크리스트
1. ✅ 모든 파일 90점 이상 시 종료 코드 0
2. ✅ 일부 파일 90점 미달 시 종료 코드 1
3. ✅ 스펙 디렉토리 없음 시 에러 메시지
4. ✅ YAML 헤더 없는 파일 시 경고
5. ✅ 빈 디렉토리 시 에러 메시지

## Notes

### 구현 순서
1. YAML 헤더 파싱
2. 필수 섹션 검증
3. 점수 계산 로직
4. 전체 통합

### 관련 문서
- `sed-command-validate.md` - 단일 파일 검증
- `sed-command-score.md` - 점수 계산 명세
