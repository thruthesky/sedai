#!/usr/bin/env node

/**
 * SEDAI CLI 진입점
 *
 * Spec-Exact Development by AI (SED) 명령줄 인터페이스
 * 사용자가 npx sedai 또는 sedai 명령으로 실행할 수 있습니다.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import * as fs from 'fs';
import * as path from 'path';
import { version } from './version.js';
import { calculateScore } from './scorer.js';

/**
 * CLI 프로그램 초기화 및 실행
 */
const program = new Command();

program
  .name('sedai')
  .description('Spec-Exact Development by AI - AI develops exactly as the spec defines')
  .version(version);

/**
 * doctor 명령어: 스펙 파일 검증
 *
 * 프로젝트의 스펙 파일들을 분석하고 완성도 점수를 매깁니다.
 */
program
  .command('doctor')
  .description('Analyze and validate your SED specifications')
  .option('-p, --path <path>', 'Path to specifications directory', './specs')
  .option('-s, --score <number>', 'Minimum required score', '90')
  .action(async (options) => {
    console.log(chalk.blue('\n🔍 Analyzing your SED specifications...\n'));
    console.log(chalk.yellow(`📁 Specification directory: ${options.path}`));
    console.log(chalk.yellow(`🎯 Required score: ${options.score}/100\n`));

    // TODO: 실제 스펙 검증 로직 구현
    console.log(chalk.green('✅ Spec validation feature coming soon!'));
    console.log(chalk.dim('\nThis will analyze:'));
    console.log(chalk.dim('  - YAML header structure'));
    console.log(chalk.dim('  - Overview section'));
    console.log(chalk.dim('  - Requirements completeness'));
    console.log(chalk.dim('  - Workflow definitions'));
    console.log(chalk.dim('  - Dependencies resolution\n'));
  });

/**
 * init 명령어: 새 SED 프로젝트 초기화
 */
program
  .command('init')
  .description('Initialize a new SED project')
  .option('-n, --name <name>', 'Project name')
  .option('-s, --summary <summary>', 'Project summary/description')
  .option('-a, --author <author>', 'Author name')
  .option('-e, --email <email>', 'Author email')
  .action(async (options) => {
    console.log(chalk.blue('\n🚀 Initializing new SED project...\n'));

    // 사용자로부터 프로젝트 정보 수집
    const questions = [];

    // 옵션으로 제공되지 않은 항목만 질문
    if (!options.name) {
      questions.push({
        type: 'text' as const,
        name: 'name',
        message: 'Spec name:',
        validate: (value: string) => value.trim().length > 0 ? true : 'Spec name is required'
      });
    }

    if (!options.summary) {
      questions.push({
        type: 'text' as const,
        name: 'summary',
        message: 'Spec summary/description:',
        validate: (value: string) => value.trim().length > 0 ? true : 'Summary is required'
      });
    }

    if (!options.author) {
      questions.push({
        type: 'text' as const,
        name: 'author',
        message: 'Your name:',
        validate: (value: string) => value.trim().length > 0 ? true : 'Author name is required'
      });
    }

    if (!options.email) {
      questions.push({
        type: 'text' as const,
        name: 'email',
        message: 'Your email:',
        validate: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value) ? true : 'Valid email is required';
        }
      });
    }

    const response = await prompts(questions);

    // 사용자가 취소한 경우 (Ctrl+C)
    if (!response.name && !options.name) {
      console.log(chalk.yellow('\n⚠️  Initialization cancelled.\n'));
      return;
    }

    const specName = options.name || response.name;
    const summary = options.summary || response.summary;
    const author = options.author || response.author;
    const email = options.email || response.email;

    // specs 폴더 생성
    const specsDir = path.join(process.cwd(), 'specs');
    if (!fs.existsSync(specsDir)) {
      fs.mkdirSync(specsDir, { recursive: true });
      console.log(chalk.green(`✅ Created directory: ${specsDir}`));
    } else {
      console.log(chalk.yellow(`⚠️  Directory already exists: ${specsDir}`));
    }

    // 현재 날짜 (ISO 형식)
    const currentDate = new Date().toISOString().split('T')[0];

    // YAML 헤더를 생성하는 함수
    const createYamlHeader = (title: string, description: string) => {
      return `---
title: ${title}
description: ${description}
author: ${author}
email: ${email}
date: ${currentDate}
version: 1.0.0
status: draft
---

# ${title}

## Overview

${description}

## Requirements

- Requirement 1
- Requirement 2

## Workflow

1. Step 1
2. Step 2

## Dependencies

None

## Notes

Add any additional notes here.
`;
    };

    // 생성할 파일 목록
    const files = [
      {
        name: `${specName}-index.md`,
        title: `${specName} - Index`,
        description: `Main index specification for ${specName}. ${summary}`
      },
      {
        name: `${specName}-setup-database.md`,
        title: `${specName} - Database Setup`,
        description: `Database setup and configuration for ${specName}`
      },
      {
        name: `${specName}-setup-backend.md`,
        title: `${specName} - Backend Setup`,
        description: `Backend setup and API implementation for ${specName}`
      },
      {
        name: `${specName}-setup-frontend.md`,
        title: `${specName} - Frontend Setup`,
        description: `Frontend setup and UI implementation for ${specName}`
      }
    ];

    // 파일 생성
    files.forEach(file => {
      const filePath = path.join(specsDir, file.name);
      const content = createYamlHeader(file.title, file.description);

      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(chalk.green(`✅ Created: ${file.name}`));
    });

    console.log(chalk.blue('\n🎉 SED project initialized successfully!\n'));
    console.log(chalk.dim('Created files:'));
    files.forEach(file => {
      console.log(chalk.dim(`  - specs/${file.name}`));
    });
    console.log();
  });

/**
 * validate 명령어: 단일 스펙 파일 검증
 */
program
  .command('validate <file>')
  .description('Validate a single specification file')
  .action(async (file: string) => {
    console.log(chalk.blue(`\n🔍 Validating specification file: ${file}\n`));

    // TODO: 단일 파일 검증 로직 구현
    console.log(chalk.green('✅ File validation feature coming soon!'));
  });

/**
 * score 명령어: 스펙 점수 계산
 */
program
  .command('score <file>')
  .description('Calculate specification completeness score')
  .action(async (file: string) => {
    console.log(chalk.blue(`\n🎯 Calculating score for: ${file}\n`));

    // 파일 존재 확인
    if (!fs.existsSync(file)) {
      console.log(chalk.red(`❌ Error: File not found: ${file}\n`));
      process.exit(2);
    }

    // specs 폴더의 모든 파일 찾기 (평균 계산용)
    const specsDir = path.dirname(file);
    const allFiles = fs.readdirSync(specsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => path.join(specsDir, f));

    // 점수 계산
    const result = calculateScore(file, allFiles);

    // 결과 출력
    console.log(chalk.bold('Score Breakdown:'));
    console.log(`  ${chalk.cyan('YAML Header:    ')} ${result.breakdown.yamlHeader}/20 ${result.breakdown.yamlHeader >= 18 ? '✅' : '⚠️'}`);
    console.log(`  ${chalk.cyan('Overview:       ')} ${result.breakdown.overview}/15 ${result.breakdown.overview >= 13 ? '✅' : '⚠️'}`);
    console.log(`  ${chalk.cyan('Requirements:   ')} ${result.breakdown.requirements}/20 ${result.breakdown.requirements >= 18 ? '✅' : '⚠️'}`);
    console.log(`  ${chalk.cyan('Workflow:       ')} ${result.breakdown.workflow}/30 ${result.breakdown.workflow >= 27 ? '✅' : '⚠️'}`);
    console.log(`  ${chalk.cyan('Heading Count:  ')} ${result.breakdown.headingCount}/15 ${result.breakdown.headingCount >= 13 ? '✅' : '⚠️'}`);
    console.log();

    // 총점 출력
    const statusEmoji = result.total >= 90 ? '✅' : result.total >= 80 ? '⚠️' : '❌';
    const statusText = result.total >= 90 ? '(Above threshold)' : result.total >= 80 ? '(Good, improvement recommended)' : '(Below threshold)';
    console.log(chalk.bold(`Total Score: ${result.total}/100 ${statusEmoji} ${statusText}\n`));

    // 개선 제안
    if (result.recommendations.length > 0) {
      console.log(chalk.yellow('Recommendations:'));
      result.recommendations.forEach(rec => {
        console.log(chalk.yellow(`  - ${rec}`));
      });
      console.log();
    } else {
      console.log(chalk.green('🎉 Perfect score! No recommendations.\n'));
    }
  });

/**
 * 기본 워크플로우 실행
 * npx sedai 명령을 인자 없이 실행했을 때 자동으로 실행됩니다.
 *
 * 실행 순서:
 * 1. specs 폴더 확인 및 init (필요시)
 * 2. 모든 스펙 파일에 대해 validate 실행
 * 3. doctor 실행
 * 4. 모든 스펙 파일에 대해 score 실행
 */
async function runDefaultWorkflow() {
  console.log(chalk.bold.blue('\n🚀 Running SEDAI default workflow...\n'));

  const specsDir = path.join(process.cwd(), 'specs');

  // 1. specs 폴더 확인 및 생성
  if (!fs.existsSync(specsDir)) {
    console.log(chalk.yellow('⚠️  specs directory not found. Running init...\n'));

    // init 명령 실행 (대화형)
    const questions = [
      {
        type: 'text' as const,
        name: 'name',
        message: 'Spec name:',
        validate: (value: string) => value.trim().length > 0 ? true : 'Spec name is required'
      },
      {
        type: 'text' as const,
        name: 'summary',
        message: 'Spec summary/description:',
        validate: (value: string) => value.trim().length > 0 ? true : 'Summary is required'
      },
      {
        type: 'text' as const,
        name: 'author',
        message: 'Your name:',
        validate: (value: string) => value.trim().length > 0 ? true : 'Author name is required'
      },
      {
        type: 'text' as const,
        name: 'email',
        message: 'Your email:',
        validate: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value) ? true : 'Valid email is required';
        }
      }
    ];

    const response = await prompts(questions);

    // 사용자가 취소한 경우 (Ctrl+C)
    if (!response.name) {
      console.log(chalk.yellow('\n⚠️  Workflow cancelled.\n'));
      return;
    }

    // specs 폴더 생성
    fs.mkdirSync(specsDir, { recursive: true });
    console.log(chalk.green(`✅ Created directory: ${specsDir}\n`));

    // 현재 날짜 (ISO 형식)
    const currentDate = new Date().toISOString().split('T')[0];

    // YAML 헤더 생성 함수
    const createYamlHeader = (title: string, description: string) => {
      return `---
title: ${title}
description: ${description}
author: ${response.author}
email: ${response.email}
date: ${currentDate}
version: 1.0.0
status: draft
---

# ${title}

## Overview

${description}

## Requirements

- Requirement 1
- Requirement 2

## Workflow

1. Step 1
2. Step 2

## Dependencies

None

## Notes

Add any additional notes here.
`;
    };

    // 생성할 파일 목록
    const files = [
      {
        name: `${response.name}-index.md`,
        title: `${response.name} - Index`,
        description: `Main index specification for ${response.name}. ${response.summary}`
      },
      {
        name: `${response.name}-setup-database.md`,
        title: `${response.name} - Database Setup`,
        description: `Database setup and configuration for ${response.name}`
      },
      {
        name: `${response.name}-setup-backend.md`,
        title: `${response.name} - Backend Setup`,
        description: `Backend setup and API implementation for ${response.name}`
      },
      {
        name: `${response.name}-setup-frontend.md`,
        title: `${response.name} - Frontend Setup`,
        description: `Frontend setup and UI implementation for ${response.name}`
      }
    ];

    // 파일 생성
    files.forEach(file => {
      const filePath = path.join(specsDir, file.name);
      const content = createYamlHeader(file.title, file.description);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(chalk.green(`✅ Created: ${file.name}`));
    });

    console.log(chalk.blue('\n✅ Init completed!\n'));
  } else {
    console.log(chalk.green('✅ specs directory found.\n'));
  }

  // specs 폴더의 모든 .md 파일 찾기
  const specFiles = fs.readdirSync(specsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(specsDir, file));

  if (specFiles.length === 0) {
    console.log(chalk.yellow('⚠️  No spec files found in specs directory.\n'));
    return;
  }

  // 2. Validate 실행
  console.log(chalk.bold.cyan('📋 Step 2: Validating specifications...\n'));
  for (const file of specFiles) {
    console.log(chalk.blue(`🔍 Validating: ${path.basename(file)}`));
    console.log(chalk.dim('  ✅ File validation feature coming soon!\n'));
  }

  // 3. Doctor 실행
  console.log(chalk.bold.cyan('📋 Step 3: Running doctor...\n'));
  console.log(chalk.blue('🔍 Analyzing your SED specifications...'));
  console.log(chalk.yellow(`📁 Specification directory: ${specsDir}`));
  console.log(chalk.yellow('🎯 Required score: 90/100\n'));
  console.log(chalk.green('✅ Spec validation feature coming soon!'));
  console.log(chalk.dim('This will analyze:'));
  console.log(chalk.dim('  - YAML header structure'));
  console.log(chalk.dim('  - Overview section'));
  console.log(chalk.dim('  - Requirements completeness'));
  console.log(chalk.dim('  - Workflow definitions'));
  console.log(chalk.dim('  - Dependencies resolution\n'));

  // 4. Score 실행
  console.log(chalk.bold.cyan('📋 Step 4: Calculating scores...\n'));

  let totalScore = 0;
  let fileCount = 0;

  for (const file of specFiles) {
    console.log(chalk.blue(`📊 ${path.basename(file)}`));

    const result = calculateScore(file, specFiles);
    totalScore += result.total;
    fileCount++;

    const statusEmoji = result.total >= 90 ? '✅' : result.total >= 80 ? '⚠️' : '❌';
    console.log(chalk.dim(`   Score: ${result.total}/100 ${statusEmoji}`));
    console.log();
  }

  const averageScore = Math.round(totalScore / fileCount);
  const overallStatus = averageScore >= 90 ? '✅ PASS' : averageScore >= 80 ? '⚠️ GOOD' : '❌ FAIL';

  console.log(chalk.bold(`Average Score: ${averageScore}/100 ${overallStatus}\n`));
  console.log(chalk.bold.green('🎉 SEDAI workflow completed!\n'));
}

// 명령어가 제공되지 않았을 때 기본 워크플로우 실행
if (!process.argv.slice(2).length) {
  runDefaultWorkflow();
} else {
  // 명령어가 있을 때만 파싱
  program.parse(process.argv);
}
