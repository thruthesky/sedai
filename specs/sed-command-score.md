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

# SED Command: score

## Overview

`spec score` 명령어는 단일 스펙 파일의 완성도 점수를 계산하는 명령어입니다. SEDAI의 핵심 원칙인 0-100점 점수제를 구현한 명령어입니다.

**상태:** ⏳ Planned (Coming Soon)

## Requirements

### Environment
- **Node.js:** ≥20.0.0
- **YAML Parser:** yaml ^2.5.0

## Workflow

### 1. 명령어 실행
```bash
npx spec score specs/sed-command-init.md
```

### 2. 점수 계산

#### 2.1. YAML 헤더 (20점) - 필수 항목
- **YAML 구조 존재 (10점):** 파일 시작 부분에 `---`로 시작하고 끝나는 YAML 블록 존재
- **필수 필드 6개 존재 (6점):** name, version, description, author, email, license
- **이메일 형식 검증 (2점):** RFC 5322 형식 (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **버전 형식 검증 (2점):** Semantic Versioning 형식 (`/^\d+\.\d+\.\d+$/`)

#### 2.2. Overview 섹션 (15점) - 필수 항목
- **섹션 존재 (5점):** `## Overview` 헤딩 존재
- **최소 길이 (5점):** 100자 이상
- **구체적 설명 (5점):** 명령어/기능의 목적과 역할을 명확히 설명

#### 2.3. Requirements 섹션 (20점) - 필수 항목
- **섹션 존재 (5점):** `## Requirements` 헤딩 존재
- **환경 요구사항 명시 (5점):** Node.js, npm 버전 등
- **설치 명령어 포함 (5점):** `npm install`, `npx` 등의 설치 예시
- **의존성 라이브러리 명시 (5점):** 필요한 패키지와 버전

#### 2.4. Workflow 섹션 (30점) - 필수 항목, 높은 점수
- **섹션 존재 (5점):** `## Workflow` 헤딩 존재
- **단계별 설명 (10점):** 명확한 단계 구분 (1, 2, 3...)
- **명령어 예시 (8점):** 실행 가능한 bash 명령어 코드 블록
- **출력 예시 (7점):** 예상 출력 결과 표시

#### 2.5. 항목 개수 (15점) - 통합 평균 기준
- **20개 이상 (15점):** 모든 스펙 파일의 평균 헤딩(`##`, `###`) 개수가 20개 이상
- **15-19개 (10점):** 15개 이상 20개 미만
- **10-14개 (5점):** 10개 이상 15개 미만
- **10개 미만 (0점):** 불충분한 문서 구조

**측정 방식:** 전체 스펙 디렉토리의 모든 `.md` 파일에서 헤딩(`## `, `### `) 개수를 계산하여 평균을 구함

### 3. 결과 출력
```
🎯 Calculating score for: specs/sed-command-init.md

Score Breakdown:
  YAML Header:     20/20 ✅
  Overview:        15/15 ✅
  Requirements:    18/20 ⚠️
  Workflow:        28/30 ✅
  Heading Count:   15/15 ✅

Total Score: 96/100 ✅ (Above threshold)

Recommendations:
  - Add specific version numbers in Requirements
  - Include installation command examples
```

## Details

### 점수 계산 로직

```typescript
/**
 * 점수 계산 기준 인터페이스
 */
interface ScoringCriteria {
  yamlHeader: number;      // 0-20 (필수)
  overview: number;         // 0-15 (필수)
  requirements: number;     // 0-20 (필수)
  workflow: number;         // 0-30 (필수, 높은 점수)
  headingCount: number;     // 0-15 (평균 기준)
}

/**
 * YAML 헤더 점수 계산
 * @param content - 파일 전체 내용
 * @returns 0-20점
 */
function scoreYamlHeader(content: string): number {
  let score = 0;

  // YAML 블록 추출
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!yamlMatch) return 0;

  score += 10; // YAML 구조 존재

  const yamlContent = yamlMatch[1];
  const requiredFields = ['name', 'version', 'description', 'author', 'email', 'license'];
  const foundFields = requiredFields.filter(field =>
    new RegExp(`^${field}:`, 'm').test(yamlContent)
  );

  score += foundFields.length; // 각 필드당 1점 (최대 6점)

  // 이메일 형식 검증 (2점)
  const emailMatch = yamlContent.match(/email:\s*(.+)/);
  if (emailMatch && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailMatch[1].trim())) {
    score += 2;
  }

  // 버전 형식 검증 (2점)
  const versionMatch = yamlContent.match(/version:\s*(.+)/);
  if (versionMatch && /^\d+\.\d+\.\d+/.test(versionMatch[1].trim())) {
    score += 2;
  }

  return Math.min(score, 20);
}

/**
 * Overview 섹션 점수 계산
 * @param content - 파일 전체 내용
 * @returns 0-15점
 */
function scoreOverview(content: string): number {
  let score = 0;

  const overviewMatch = content.match(/## Overview\n\n([\s\S]*?)(?=\n## |$)/);
  if (!overviewMatch) return 0;

  score += 5; // 섹션 존재

  const overviewContent = overviewMatch[1].trim();
  if (overviewContent.length >= 100) {
    score += 5; // 최소 길이
  }

  // 구체적 설명 (키워드 존재 확인)
  if (overviewContent.length >= 200) {
    score += 5;
  }

  return Math.min(score, 15);
}

/**
 * Requirements 섹션 점수 계산
 * @param content - 파일 전체 내용
 * @returns 0-20점
 */
function scoreRequirements(content: string): number {
  let score = 0;

  const reqMatch = content.match(/## Requirements\n\n([\s\S]*?)(?=\n## |$)/);
  if (!reqMatch) return 0;

  score += 5; // 섹션 존재

  const reqContent = reqMatch[1];

  // 환경 요구사항 (Node.js, npm 등)
  if (/Node\.js|npm|node/i.test(reqContent)) {
    score += 5;
  }

  // 설치 명령어
  if (/npm install|npx|yarn add/i.test(reqContent)) {
    score += 5;
  }

  // 의존성 라이브러리
  if (/\^[\d.]+|~[\d.]+|>=[\d.]+/i.test(reqContent)) {
    score += 5;
  }

  return Math.min(score, 20);
}

/**
 * Workflow 섹션 점수 계산
 * @param content - 파일 전체 내용
 * @returns 0-30점
 */
function scoreWorkflow(content: string): number {
  let score = 0;

  const workflowMatch = content.match(/## Workflow\n\n([\s\S]*?)(?=\n## |$)/);
  if (!workflowMatch) return 0;

  score += 5; // 섹션 존재

  const workflowContent = workflowMatch[1];

  // 단계별 설명 (### 1., ### 2. 등)
  const stepMatches = workflowContent.match(/###\s+\d+\./g);
  if (stepMatches && stepMatches.length >= 3) {
    score += 10;
  } else if (stepMatches && stepMatches.length >= 1) {
    score += 5;
  }

  // 명령어 예시 (```bash 코드 블록)
  const codeBlocks = workflowContent.match(/```(?:bash|shell|sh)/g);
  if (codeBlocks && codeBlocks.length >= 2) {
    score += 8;
  } else if (codeBlocks && codeBlocks.length >= 1) {
    score += 4;
  }

  // 출력 예시
  if (workflowContent.length >= 500) {
    score += 7;
  } else if (workflowContent.length >= 300) {
    score += 3;
  }

  return Math.min(score, 30);
}

/**
 * 헤딩 개수 점수 계산 (전체 평균 기준)
 * @param allFiles - 모든 스펙 파일 경로 배열
 * @returns 0-15점
 */
function scoreHeadingCount(allFiles: string[]): number {
  let totalHeadings = 0;

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const headings = content.match(/^##+ /gm);
    if (headings) {
      totalHeadings += headings.length;
    }
  }

  const average = totalHeadings / allFiles.length;

  if (average >= 20) return 15;
  if (average >= 15) return 10;
  if (average >= 10) return 5;
  return 0;
}

/**
 * 전체 점수 계산
 * @param specFile - 대상 스펙 파일 경로
 * @param allFiles - 평균 계산을 위한 전체 파일 목록
 * @returns 0-100점
 */
function calculateScore(specFile: string, allFiles: string[]): number {
  const content = fs.readFileSync(specFile, 'utf-8');

  const scores: ScoringCriteria = {
    yamlHeader: scoreYamlHeader(content),
    overview: scoreOverview(content),
    requirements: scoreRequirements(content),
    workflow: scoreWorkflow(content),
    headingCount: scoreHeadingCount(allFiles),
  };

  return Object.values(scores).reduce((a, b) => a + b, 0);
}
```

### 점수 등급 분류
- **90-100:** ✅ Excellent (개발 가능)
- **80-89:** ⚠️ Good (보완 권장)
- **70-79:** ⚠️ Fair (보완 필수)
- **0-69:** ❌ Poor (개발 불가)

## Testing

### 테스트 체크리스트
1. ✅ 완벽한 스펙 파일 시 점수 100
2. ✅ 빈 YAML 헤더 시 점수 0
3. ✅ 필수 섹션 누락 시 감점
4. ✅ 최소 길이 미달 시 감점

## Notes

### SED 원칙
SED는 90점 이상의 스펙만 개발이 가능합니다. 이 명령어는 그 기준을 명확히 제시합니다.

### 관련 문서
- `sed-command-doctor.md` - 전체 프로젝트 검증
- `sed-command-validate.md` - 단일 파일 검증
