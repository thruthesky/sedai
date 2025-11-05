/**
 * SEDAI 스펙 파일 점수 계산 모듈
 *
 * 스펙 파일의 완성도를 0-100점 사이의 점수로 측정합니다.
 */

import * as fs from 'fs';

/**
 * 점수 계산 기준 인터페이스
 */
export interface ScoringCriteria {
  yamlHeader: number;      // 0-20 (필수)
  overview: number;         // 0-15 (필수)
  requirements: number;     // 0-20 (필수)
  workflow: number;         // 0-30 (필수, 높은 점수)
  headingCount: number;     // 0-15 (평균 기준)
}

/**
 * 점수 계산 결과
 */
export interface ScoreResult {
  total: number;
  breakdown: ScoringCriteria;
  recommendations: string[];
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
  if (!yamlContent) return score;

  const requiredFields = ['name', 'version', 'description', 'author', 'email', 'license'];
  const foundFields = requiredFields.filter(field =>
    new RegExp(`^${field}:`, 'm').test(yamlContent)
  );

  score += foundFields.length; // 각 필드당 1점 (최대 6점)

  // 이메일 형식 검증 (2점)
  const emailMatch = yamlContent.match(/email:\s*(.+)/);
  if (emailMatch?.[1] && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailMatch[1].trim())) {
    score += 2;
  }

  // 버전 형식 검증 (2점)
  const versionMatch = yamlContent.match(/version:\s*(.+)/);
  if (versionMatch?.[1] && /^\d+\.\d+\.\d+/.test(versionMatch[1].trim())) {
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

  const overviewContent = overviewMatch[1]?.trim();
  if (!overviewContent) return score;
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
  if (!reqContent) return score;

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
  if (!workflowContent) return score;

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
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const headings = content.match(/^##+ /gm);
      if (headings) {
        totalHeadings += headings.length;
      }
    } catch (error) {
      // 파일 읽기 실패 시 무시
      continue;
    }
  }

  if (allFiles.length === 0) return 0;

  const average = totalHeadings / allFiles.length;

  if (average >= 20) return 15;
  if (average >= 15) return 10;
  if (average >= 10) return 5;
  return 0;
}

/**
 * 개선 제안 생성
 * @param scores - 점수 세부 내역
 * @returns 개선 제안 배열
 */
function generateRecommendations(scores: ScoringCriteria): string[] {
  const recommendations: string[] = [];

  if (scores.yamlHeader < 20) {
    recommendations.push('Add missing YAML header fields (name, version, description, author, email, license)');
  }

  if (scores.overview < 15) {
    recommendations.push('Expand Overview section with more detailed explanation (at least 200 characters)');
  }

  if (scores.requirements < 20) {
    recommendations.push('Add specific version numbers and installation commands in Requirements');
  }

  if (scores.workflow < 30) {
    recommendations.push('Add more workflow steps with bash command examples and output examples');
  }

  if (scores.headingCount < 15) {
    recommendations.push('Increase document structure with more sections and subsections (average 20+ headings)');
  }

  return recommendations;
}

/**
 * 전체 점수 계산
 * @param specFile - 대상 스펙 파일 경로
 * @param allFiles - 평균 계산을 위한 전체 파일 목록
 * @returns 점수 계산 결과
 */
export function calculateScore(specFile: string, allFiles: string[]): ScoreResult {
  const content = fs.readFileSync(specFile, 'utf-8');

  const breakdown: ScoringCriteria = {
    yamlHeader: scoreYamlHeader(content),
    overview: scoreOverview(content),
    requirements: scoreRequirements(content),
    workflow: scoreWorkflow(content),
    headingCount: scoreHeadingCount(allFiles),
  };

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const recommendations = generateRecommendations(breakdown);

  return {
    total,
    breakdown,
    recommendations,
  };
}
