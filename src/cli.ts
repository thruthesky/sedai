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
import { parse as parseYaml } from 'yaml';
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
        name: `index.md`,
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
 * install 명령어: 스펙 파일의 dependencies 다운로드
 *
 * 각 스펙 파일의 YAML 헤더에서 dependencies를 추출하고,
 * URL 형식의 dependencies를 다운로드하여 ./specs/dependencies/ 폴더에 저장합니다.
 */
program
  .command('install')
  .alias('i')
  .description('Download and install specification dependencies')
  .option('-p, --path <path>', 'Path to specifications directory', './specs')
  .action(async (options) => {
    console.log(chalk.blue('\n📦 Installing specification dependencies...\n'));

    const specsDir = path.resolve(options.path);

    // specs 폴더 확인
    if (!fs.existsSync(specsDir)) {
      console.log(chalk.red(`❌ Error: Specifications directory not found: ${specsDir}\n`));
      console.log(chalk.yellow('💡 Tip: Run "sedai init" to create a new project first.\n'));
      process.exit(1);
    }

    // dependencies 폴더 생성
    const depsDir = path.join(specsDir, 'dependencies');
    if (!fs.existsSync(depsDir)) {
      fs.mkdirSync(depsDir, { recursive: true });
      console.log(chalk.green(`✅ Created directory: ${depsDir}\n`));
    }

    // 모든 스펙 파일 찾기
    const specFiles = fs.readdirSync(specsDir)
      .filter(file => file.endsWith('.md') && file !== 'dependencies')
      .map(file => path.join(specsDir, file));

    if (specFiles.length === 0) {
      console.log(chalk.yellow('⚠️  No specification files found.\n'));
      return;
    }

    console.log(chalk.cyan(`📄 Found ${specFiles.length} specification file(s)\n`));

    // 모든 dependencies 수집
    const allDependencies = new Set<string>();
    let processedFiles = 0;

    for (const specFile of specFiles) {
      const fileName = path.basename(specFile);
      const content = fs.readFileSync(specFile, 'utf-8');

      // YAML 헤더 파싱
      const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!yamlMatch || !yamlMatch[1]) {
        console.log(chalk.dim(`⏭️  ${fileName}: No YAML header found, skipping`));
        continue;
      }

      try {
        const yaml: any = parseYaml(yamlMatch[1]);

        if (yaml && yaml.dependencies) {
          const deps = Array.isArray(yaml.dependencies)
            ? yaml.dependencies
            : [yaml.dependencies];

          deps.forEach((dep: any) => {
            if (typeof dep === 'string' && dep.trim()) {
              allDependencies.add(dep.trim());
            }
          });

          if (deps.length > 0) {
            console.log(chalk.green(`✅ ${fileName}: Found ${deps.length} dependenc${deps.length === 1 ? 'y' : 'ies'}`));
            processedFiles++;
          }
        }
      } catch (error) {
        console.log(chalk.yellow(`⚠️  ${fileName}: Failed to parse YAML header`));
      }
    }

    console.log();

    if (allDependencies.size === 0) {
      console.log(chalk.yellow('ℹ️  No dependencies found in specification files.\n'));
      return;
    }

    console.log(chalk.cyan(`📥 Downloading ${allDependencies.size} unique dependenc${allDependencies.size === 1 ? 'y' : 'ies'}...\n`));

    // dependencies 다운로드
    let downloadedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const dep of allDependencies) {
      // URL 형식인지 확인
      if (!dep.startsWith('http://') && !dep.startsWith('https://')) {
        console.log(chalk.dim(`⏭️  Skipped: ${dep} (not a URL)`));
        skippedCount++;
        continue;
      }

      try {
        // URL에서 파일명 추출
        const url = new URL(dep);
        const fileName = path.basename(url.pathname);
        const outputPath = path.join(depsDir, fileName);

        // 이미 파일이 존재하는지 확인
        if (fs.existsSync(outputPath)) {
          console.log(chalk.dim(`⏭️  ${fileName}: Already exists, skipping`));
          skippedCount++;
          continue;
        }

        // 파일 다운로드
        console.log(chalk.cyan(`⬇️  Downloading: ${fileName}...`));
        const response = await fetch(dep);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const fileContent = await response.text();

        // UTF-8 인코딩으로 파일 저장
        fs.writeFileSync(outputPath, fileContent, 'utf-8');

        console.log(chalk.green(`✅ Downloaded: ${fileName}`));
        downloadedCount++;

      } catch (error) {
        const fileName = dep.split('/').pop() || dep;
        console.log(chalk.red(`❌ Failed: ${fileName} - ${error instanceof Error ? error.message : 'Unknown error'}`));
        failedCount++;
      }
    }

    // 결과 요약
    console.log();
    console.log(chalk.bold('Installation Summary:'));
    console.log(chalk.green(`  ✅ Downloaded: ${downloadedCount}`));
    console.log(chalk.dim(`  ⏭️  Skipped: ${skippedCount}`));
    if (failedCount > 0) {
      console.log(chalk.red(`  ❌ Failed: ${failedCount}`));
    }
    console.log();

    if (downloadedCount > 0) {
      console.log(chalk.green('🎉 Dependencies installed successfully!\n'));
    } else if (failedCount === 0) {
      console.log(chalk.yellow('ℹ️  All dependencies were already installed or skipped.\n'));
    } else {
      console.log(chalk.yellow('⚠️  Installation completed with errors.\n'));
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
        name: `index.md`,
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

  // 필수 파일 확인
  let hasErrors = false;

  // instructions.md 파일 확인
  const instructionsPath = path.join(specsDir, 'instructions.md');
  if (!fs.existsSync(instructionsPath)) {
    console.log(chalk.red('❌ MISSING: specs/instructions.md is required'));
    console.log(chalk.dim('   This file must contain AI development instructions'));
    console.log(chalk.dim('   You can copy sed-instructions.md as a starting template\n'));
    hasErrors = true;
  } else {
    console.log(chalk.green('✅ FOUND: specs/instructions.md'));
  }

  // index.md 파일 확인
  const indexPath = path.join(specsDir, 'index.md');
  if (!fs.existsSync(indexPath)) {
    console.log(chalk.red('❌ MISSING: specs/index.md is required'));
    console.log(chalk.dim('   This file serves as the main index (table of contents)\n'));
    hasErrors = true;
  } else {
    console.log(chalk.green('✅ FOUND: specs/index.md'));
  }

  console.log();

  // 각 스펙 파일의 YAML 헤더 검증
  console.log(chalk.blue('🔍 Validating YAML headers in spec files...\n'));

  for (const file of specFiles) {
    const fileName = path.basename(file);

    // instructions.md는 YAML 헤더가 선택사항이므로 검증에서 제외
    if (fileName === 'instructions.md') {
      console.log(chalk.dim(`⏭️  ${fileName}: Skipped (YAML header is optional for instructions.md)`));
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');

    // YAML 헤더 확인 (--- 로 시작하고 끝나는지)
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!yamlMatch || !yamlMatch[1]) {
      console.log(chalk.red(`❌ ${fileName}: Missing or invalid YAML header`));
      hasErrors = true;
    } else {
      const yamlContent = yamlMatch[1];

      // 필수 필드 확인
      const requiredFields = ['title', 'description', 'author', 'email', 'date', 'version', 'status'];
      const missingFields = [];

      for (const field of requiredFields) {
        if (!yamlContent.includes(`${field}:`)) {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        console.log(chalk.yellow(`⚠️  ${fileName}: Missing YAML fields: ${missingFields.join(', ')}`));
      } else {
        console.log(chalk.green(`✅ ${fileName}: Valid YAML header`));
      }
    }
  }

  console.log();

  if (hasErrors) {
    console.log(chalk.red('⚠️  Some required files are missing. Please add them before continuing.\n'));
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
