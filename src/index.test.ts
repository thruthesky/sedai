/**
 * SEDAI 기본 기능 테스트
 */

import { describe, it, expect } from 'vitest';
import { version } from './index';

describe('SEDAI 기본 테스트', () => {
  it('버전 정보가 올바르게 export 되어야 함', () => {
    expect(version).toBeDefined();
    expect(typeof version).toBe('string');
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('버전이 0.1.0이어야 함', () => {
    expect(version).toBe('0.1.0');
  });
});
