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

# SED Command: validate

## Overview

`spec validate` 명령어는 단일 스펙 파일을 검증하는 명령어입니다. YAML 헤더, 필수 섹션, 내용 완성도를 검증하여 통과/실패 여부를 반환합니다.

**상태:** ⏳ Planned (Coming Soon)

## Requirements

### Environment
- **Node.js:** ≥20.0.0
- **YAML Parser:** yaml ^2.5.0

## Workflow

### 1. 명령어 실행
```bash
npx spec validate specs/sed-command-init.md
```

### 2. 파일 존재 확인
- 파일이 없을 시 에러: `Error: File not found: specs/sed-command-init.md`
- 종료 코드: 2

### 3. YAML 헤더 파싱
```typescript
// 파일 시작 '---'로 시작하는지 확인
// 다음 '---'까지 YAML로 파싱
// 필수 필드 검증
```

### 4. 필수 섹션 확인
- `## Overview`
- `## Requirements`
- `## Workflow`

### 5. 결과 출력
```
🔍 Validating specification file: specs/sed-command-init.md

✅ YAML header valid
✅ Required sections present
✅ Content completeness OK

✅ Validation passed
```

## Details

### 검증 항목

#### YAML 헤더
- ✅ 올바른 YAML 형식
- ✅ 필수 필드 존재
- ✅ 이메일 형식 검증
- ✅ 버전 형식 검증 (Semantic Versioning)

#### 필수 섹션
- ✅ `## Overview` 존재
- ✅ `## Requirements` 존재
- ✅ `## Workflow` 존재
- ✅ 각 섹션 최소 50자 이상

#### 내용 완성도
- ✅ 명령어 예시 포함 여부
- ✅ 설명 충분 여부
- ✅ 코드 블록 포함 여부

### 종료 코드
- `0` - 검증 성공
- `1` - 검증 실패
- `2` - 파일 없음 또는 읽기 실패

## Testing

### 테스트 체크리스트
1. ✅ 올바른 스펙 파일 시 검증 통과
2. ✅ YAML 헤더 없을 시 실패
3. ✅ 필수 섹션 누락 시 실패
4. ✅ 파일 없을 시 에러

## Notes

### 관련 문서
- `sed-command-doctor.md` - 전체 프로젝트 검증
- `sed-command-score.md` - 점수 계산
