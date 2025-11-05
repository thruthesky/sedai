/**
 * SEDAI - Spec-Exact Development by AI
 *
 * AI가 명세(specification)에 단 한 줄도 벗어나지 않고 개발을 수행하는
 * 인공지능 기반 개발 패러다임을 위한 도구입니다.
 *
 * @packageDocumentation
 */

export { version } from './version';

/**
 * 스펙 파일의 YAML 헤더 구조
 */
export interface SpecHeader {
  /** 스펙 이름 (영문, 숫자, 하이픈만 지원, 255자 이내) */
  name: string;
  /** 스펙 버전 (Semantic Versioning) */
  version: string;
  /** 프로젝트 설명 (4096자 이내) */
  description: string;
  /** 작성자 이름 (64자 이내) */
  author: string;
  /** 작성자 이메일 (64자 이내) */
  email: string;
  /** 참고 홈페이지 주소 */
  homepage?: string;
  /** 금전적 지원 경로 */
  funding?: string;
  /** 라이선스 */
  license: string;
  /** 의존 스펙 목록 */
  dependencies?: string[];
}

/**
 * 스펙 검증 결과
 */
export interface ValidationResult {
  /** 검증 성공 여부 */
  valid: boolean;
  /** 완성도 점수 (0-100) */
  score: number;
  /** 오류 메시지 목록 */
  errors: string[];
  /** 경고 메시지 목록 */
  warnings: string[];
  /** 개선 제안 목록 */
  suggestions: string[];
}

/**
 * 스펙 파일 구조
 */
export interface SpecFile {
  /** YAML 헤더 */
  header: SpecHeader;
  /** 개요 섹션 */
  overview: string;
  /** 요구사항 섹션 */
  requirements: string;
  /** 워크플로우 섹션 */
  workflow: string;
  /** 세부 항목 섹션 */
  details: string;
}

/**
 * 스펙 점수 계산 기준
 */
export interface ScoringCriteria {
  /** 데이터베이스 설계의 완전성 (0-20점) */
  databaseDesign: number;
  /** 비즈니스 로직의 명확성 (0-20점) */
  businessLogic: number;
  /** UI/UX 요구사항의 구체성 (0-20점) */
  uiUxRequirements: number;
  /** 테스트 계획의 상세도 (0-20점) */
  testPlan: number;
  /** 배포 및 운영 환경 정의 (0-20점) */
  deploymentOps: number;
}

// TODO: 실제 기능 구현
// - 스펙 파일 파싱
// - YAML 헤더 검증
// - 스펙 구조 검증
// - 점수 계산 알고리즘
// - Dependencies 해석 및 불러오기
