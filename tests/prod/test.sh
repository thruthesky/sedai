#!/bin/bash

# SEDAI CLI 로컬 테스트 스크립트
# NPM 배포 전에 실제 명령어를 테스트합니다.

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  SEDAI CLI Local Test${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 프로젝트 루트로 이동
cd "$(dirname "$0")/../.."
PROJECT_ROOT=$(pwd)
echo -e "${YELLOW}📂 Project Root: ${PROJECT_ROOT}${NC}"
echo ""

# 빌드
echo -e "${YELLOW}🔨 Building TypeScript...${NC}"
npm run build
echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# CLI 경로 설정
CLI_PATH="${PROJECT_ROOT}/dist/cli.js"

# tests/prod 폴더로 이동
cd tests/prod
TEST_DIR=$(pwd)
echo -e "${YELLOW}📂 Test Directory: ${TEST_DIR}${NC}"
echo ""

# 테스트 시작
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Running CLI Tests${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 테스트 1: --help
echo -e "${YELLOW}📝 Test 1: sedai --help${NC}"
node "${CLI_PATH}" --help
echo -e "${GREEN}✅ Test 1 passed${NC}"
echo ""

# 테스트 2: --version
echo -e "${YELLOW}📝 Test 2: sedai --version${NC}"
node "${CLI_PATH}" --version
echo -e "${GREEN}✅ Test 2 passed${NC}"
echo ""

# 테스트 3: doctor
echo -e "${YELLOW}📝 Test 3: sedai doctor${NC}"
node "${CLI_PATH}" doctor
echo -e "${GREEN}✅ Test 3 passed${NC}"
echo ""

# 테스트 4: init
echo -e "${YELLOW}📝 Test 4: sedai init --name test-project${NC}"
# 이전 테스트 프로젝트 삭제
rm -rf test-project
node "${CLI_PATH}" init --name test-project
echo -e "${GREEN}✅ Test 4 passed${NC}"
echo ""

# 테스트 5: validate (예시 스펙 파일이 있다면)
if [ -f "test-spec.md" ]; then
    echo -e "${YELLOW}📝 Test 5: sedai validate test-spec.md${NC}"
    node "${CLI_PATH}" validate test-spec.md
    echo -e "${GREEN}✅ Test 5 passed${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Test 5 skipped: test-spec.md not found${NC}"
    echo ""
fi

# 테스트 6: score (예시 스펙 파일이 있다면)
if [ -f "test-spec.md" ]; then
    echo -e "${YELLOW}📝 Test 6: sedai score test-spec.md${NC}"
    node "${CLI_PATH}" score test-spec.md
    echo -e "${GREEN}✅ Test 6 passed${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Test 6 skipped: test-spec.md not found${NC}"
    echo ""
fi

# 테스트 완료
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 All tests passed!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: You can run individual commands like:${NC}"
echo -e "   node ${CLI_PATH} --help"
echo -e "   node ${CLI_PATH} doctor"
echo ""
