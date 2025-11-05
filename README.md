# >é SEDAI - Spec-Exact Development by AI

> "AI develops exactly as the spec defines  no interpretation, no assumption."

A development methodology and toolset where artificial intelligence performs development adhering strictly to specifications without deviation.

[![npm version](https://img.shields.io/npm/v/sedai.svg)](https://www.npmjs.com/package/sedai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen)](https://nodejs.org/)

## =æ Installation

```bash
# Global installation
npm install -g sedai

# Or use with npx
npx sedai --help
```

## =€ Quick Start

```bash
# Validate your specifications
npx sedai doctor

# Initialize a new SED project
npx sedai init --name my-project

# Validate a single spec file
npx sedai validate specs/my-spec.md

# Calculate specification score
npx sedai score specs/my-spec.md
```

## =¡ Origin Story

Created by **Song Jaeho** on **November 4, 2025** to overcome the limitations of vibe coding.

**Problems with existing approaches:**
- Spec, context, and skills provide vague descriptions
- MCP provides only fragmented information
- AI freely interprets requirements, leading to unexpected results

**SED's Solution:**
- Provide complete blueprints to AI
- AI follows blueprints precisely without inference
- Specifications serve as absolute standards ensuring consistency

## =Ú What is SED?

**Spec-Exact Development (SED)** is an AI-based development paradigm where AI performs development without deviating even a single line from the specification.

The specification is the absolute standard. AI does not interpret or inferit executes only as specified.

**This means specifications must be precise and perfect.**

In other words, **provide complete blueprints to AI, and AI creates exactly according to those blueprints without any deviation.**

> "If the spec is wrong, the product is wrong  by design."
> (If the specification is wrong, the product is wrong. But that's intentional.)

## =9 Core Principles

### 1. Spec-Exactness Principle

- Development performs only what is defined in the specification
- If the specification is incomplete, AI immediately returns a Spec Error and halts development

### 2. Spec Completeness Scoring

- Before development begins, AI evaluates the given specification and assigns a **score (0-100 points)**
- Development starts only when the score is **90 points or higher**
- Scoring criteria consist of:
  - Database design completeness
  - Business logic clarity
  - UI/UX requirements specificity
  - Test plan detail (unit/widget/e2e)
  - Deployment and operational environment definition

**Example: Error when spec score is insufficient**

```
SpecError: Insufficient specification to execute.
Reason: Database schema, authentication flow, or encryption detail missing.
Required Spec Score: e90
Current Score: 42
```

### 3. Spec is the Law

- AI does not infer human intent
- If there are ambiguous sentences in the specification, those parts are not executed
- "Guessing" is prohibited; only "what is documented" is executed
- **Specifications are absolute standards, but specifications themselves can contain errors**
  - Even if there are errors in the specification, AI must follow the spec without inference
  - If errors in the specification are suspected, AI can request confirmation or revision from developers
  - **AI can request spec modifications from humans but cannot modify specs itself**
  - Ultimately, AI must follow the specification as the principle

## =9 Development Process Phases

### >ñ Preparation Phase

AI analyzes specifications provided by developers and assigns scores. In SED, specifications must be designed in three dimensions from the preparation phase for subsequent phases to proceed smoothly.

#### 1. **Writing Spec Storylines**

- Write **overall storyline** explaining the entire product flow and **detailed storylines** for each feature/module, defining each as 100+ items
- For a complete SNS web/app service, storylines should be organized to approximately 10,000 tokens (about 14 pages)
- Actual detailed specifications should be at least 20 times the storyline (approximately 2,800 pages), though more or less may be needed. Keep this scale in mind when designing from the storyline stage
- Each storyline summarizes core objectives, main user roles, and core feature flows for easy understanding

#### 2. **Writing Detailed Specifications**

Organize all detailed items derived from storylines to blueprint level, removing redundant or miscellaneous descriptions and keeping only necessary information.

  **Spec Ownership and Personal Philosophy**
While you can copy specs made by others or get help by asking AI to create specs, ultimately humans decide what to create, so you must familiarize yourself with all spec content and modify it to reflect personal philosophy.

##### **Database Design (Database Specification)**

- **DBMS Type and Version:** MySQL 8.0.35 Community Edition
- **Hosting Environment:** Self-hosted on AWS EC2 t3.medium (2 vCPU, 4GB RAM)
- **Operating System:** Ubuntu 22.04.3 LTS (Jammy Jellyfish)
- **Network Information:** Private IP 10.0.1.50, Port 3306, SSH Port 22
- **Access Account:** dev@10.0.1.50 (SSH key: ~/.ssh/dev_rsa), DB user: app_dev / password stored in .env
- **SQL Version and Settings:** SQL Mode = STRICT_TRANS_TABLES, Character Set = utf8mb4, Collation = utf8mb4_unicode_ci
- **Table Structure:** users (id, email, password_hash, created_at), posts (id, user_id, title, content, created_at), comments (id, post_id, user_id, content)
- **Indexes:** users.email (UNIQUE), posts.user_id (INDEX), comments.post_id + created_at (COMPOSITE INDEX)
- **Foreign Keys:** posts.user_id ’ users.id (ON DELETE CASCADE), comments.post_id ’ posts.id (ON DELETE CASCADE)
- **Transaction Isolation Level:** READ COMMITTED (using InnoDB engine)
- **Backup Policy:** Daily full backup at 03:00 UTC via mysqldump, retained for 7 days
- **Utility Versions:** mysqldump 8.0.35, mysql-client 8.0.35, pt-online-schema-change 3.5.0

##### **Feature Specification**

**User Registration:**
- Email/Password Registration: Email format validation (RFC 5322), password minimum 8 characters + uppercase/lowercase + numbers + special characters
- Phone Verification: Using Twilio API v2022-05-01, SMS 6-digit OTP, valid for 5 minutes
- SNS Login: Google OAuth 2.0 (Client ID: xxx), Facebook Login v18.0, Apple Sign-In (Team ID: xxx)
- Password Encryption: bcrypt (cost factor 12), salt rounds 10
- Email Verification: Using SendGrid API v3, verification link valid for 24 hours
- Duplicate Check: Email duplicate check (DB UNIQUE constraint + application level validation)
- Error Handling: 409 Conflict (existing email), 400 Bad Request (invalid format), 500 Internal Server Error (server error)

**Forum:** CRUD operations, pagination (20 per page), sorting criteria (latest/views/likes), search (title/content/author), file upload (image max 5MB, formats: JPG/PNG/GIF)

**Payment:** Stripe API v2023-10-16, PG companies: Stripe + Toss Payments, payment methods (card/bank transfer/simple payment), payment amount range (minimum 1,000 KRW ~ maximum 10,000,000 KRW)

**Notification:** Firebase Cloud Messaging (FCM) v1 API, push notifications (comments/likes/mentions), email notifications (daily summary/weekly report), notification settings (user-specific ON/OFF)

##### **Routing Specification**

- SED specifications **characteristically provide all route paths directly as a principle**, so record actual paths in the spec like: `/auth/signup`, `/auth/verify`, `/dashboard`
- Specify where signup starts (e.g., `/auth/signup`) and where it moves after completion (e.g., `/onboarding/profile`)
- Include path sequence diagrams for entire user journeys like signup ’ verification ’ onboarding ’ dashboard to completely describe the flow
- Write redirect conditions, exception flows (failure paths), access control guards, etc., directly in the spec

##### **Function Specification**

SED specifications **clearly define all function names, roles, parameters, and usage locations as a principle**, so write directly in the spec to prevent AI from arbitrarily inferring or designing function names.

- **Function Name:** Provide exact function names. Examples: `handleLikeCreate()`, `parseLikeId()`, `updatePostLikeCount()`
- **Function Role:** Clearly describe tasks and responsibilities the function performs. Example: "Increase likeCount and update statistics when adding like", "Parse likeId to extract type, nodeId, uid"
- **Function Parameters:** Specify names, types, and required status of all parameters. Examples:
  - `handleLikeCreate(likeId: string)` - likeId required, format: "post-{postId}-{uid}"
  - `updateProfile(userId: UserId, data: Partial<UserProfile>)` - userId required, data is partial update object
- **Return Value:** Define type and structure of values returned by function. Example: `Promise<{success: boolean; type?: string; error?: string}>`
- **Function Location:** Specify file path where function should be written. Examples:
  - `handleLikeCreate()` ’ `/firebase/functions/src/handlers/like.handler.ts`
  - `parseLikeId()` ’ `/firebase/functions/src/utils/like.utils.ts`
  - `toggleLike()` ’ `/web/src/lib/services/like.ts`
- **Function Call Location:** Specify where and when the function should be called. Examples:
  - `handleLikeCreate()` automatically executes in Firebase Cloud Functions' `/likes/{likeId}` onCreate trigger
  - `toggleLike()` called when like button clicked in client's PostItem component
  - `parseLikeId()` called within `handleLikeCreate()` when validating likeId

**Note:** Function specifications must be detailed enough for AI to implement accurately without developers writing code. No aspectfunction name, parameters, location, call timingshould be left ambiguous.

##### **UI/UX Requirements (Design Specification)**

- **Design System:** Material Design 3.0, Primary Color #6366F1, Secondary Color #8B5CF6, Font: Pretendard Variable (Korean), Inter (English)
- **Responsive Rules:** Mobile (<768px), Tablet (768px~1024px), Desktop (>1024px), Breakpoint standard: Tailwind CSS v3.4
- **Widget Composition:** Header (fixed, height 64px), Sidebar (collapsible, width 280px), Main Content (max-width 1280px, center aligned), Footer (height 120px)
- **User Flow:** Login ’ Dashboard ’ Post List ’ Post Detail ’ Comment Creation ’ Notification Reception (Figma link: https://figma.com/file/xxx)
- **Accessibility:** WCAG 2.1 Level AA compliance, keyboard navigation support, screen reader compatible (ARIA labels)
- **Animation:** Framer Motion v11, page transitions (fade-in 300ms), button hover (scale 1.05 200ms), modal (slide-up 250ms)

##### **Testing Specification  The Section Requiring Greatest Precision**

**SED prioritizes testing above all, and the items below are only minimum requirements; actual projects need far more precise specifications.**

- **Test Language and Environment:** TypeScript 5.3.3, Node.js 20.10.0 LTS, npm 10.2.3
- **Test Platforms:**
  - Unit tests: Vitest 1.0.4 (Jest-compatible, ESM support)
  - Component tests: Testing Library (@testing-library/svelte 4.0.5)
  - E2E tests: Playwright 1.40.1 (Chromium 120.0, Firefox 121.0, WebKit 17.4)
- **Test Environment Setup:**
  - Local development: Docker Compose v2.23.0 (MySQL 8.0 + Redis 7.2 + Node.js 20)
  - CI environment: GitHub Actions (ubuntu-latest, Node.js 20.x matrix)
  - Test DB: MySQL 8.0 (Docker container, port 3307, initialization script: /docker/mysql/init.sql)
  - Mock data: Faker.js 8.3.1 (automatically generate 100 users, 500 posts, 2000 comments)
  - Environment variables: .env.test file (DATABASE_URL, API_KEY, JWT_SECRET, etc.)
- **Unit Test Scenarios:**
  - Coverage goal: Minimum 80% (Statement/Branch/Function/Line)
  - Test case count: Minimum 200 (utils: 50, services: 80, stores: 70)
  - Execution command: `npm run test:unit` (parallel execution, max workers 4)
  - Example: auth.service.test.ts - login() function (12 cases including success/failure/network error/token expiration)
- **E2E Test Scenarios:**
  - Main user flow: Signup ’ Login ’ Create Post ’ Create Comment ’ Logout (total 15 steps)
  - Browsers: Chromium (Desktop 1920x1080), Mobile (iPhone 13, 390x844)
  - Execution command: `npx playwright test` (headless mode, parallel 3)
  - Screenshots: Automatic capture at each step, full page screenshot + video recording on failure
  - Example: e2e/auth.spec.ts - Login failure and retry scenario (wrong password 3 times ’ verify account lock)

 **Development can only start when spec score is 90 points or higher.**
Detailed and precise specifications like above must be included in all items to receive 90+ points.

=¡ **Why must it be this detailed?**

SED's core principle is "AI does not infer."

If the spec only states "Use MySQL":
- Which version? (5.7 vs 8.0 - syntax differences exist)
- Which edition? (Community vs Enterprise - feature differences)
- What settings? (Character Set, SQL Mode - behavioral differences)
- Where to run? (Local vs AWS RDS - access method differences)

AI cannot infer these, nor should it. Therefore, all information must be explicitly documented in specifications.

"Complete specification = all information a developer needs to know when developing directly"

This is the level of specification SED requires.

#### 3. **Spec File Structure and Naming Convention**

To systematically manage specs and enable AI to efficiently reference them, clearly define spec file structure and naming conventions.

**Spec File Name Structure:**

```
<project-name>-<module-name>-<function-name>.md
```

Basically follows "project-name-module(feature)-function(detail unit)" structure with Markdown file extension `.md`.

**Spec File YAML Header Structure:**

All spec files have the following YAML structure at the top:

```yaml
---
name: Spec (or project) name. English, numbers, hyphens only. (Within 255 characters)
version: Spec version. (Semantic Versioning principle)
description: Project description (Within 4096 characters)
author: Author name (Within 64 characters)
email: Author email address (Within 64 characters)
homepage: Reference homepage URL
funding: Payment path for financial support to spec maintainer
license: GPL, MIT, etc.
dependencies: thruthesky/forum-spec, *withcenter/chat-spec[chat-rooms-join.md#chat-overview], **https://doma.com/abc/def
---
```

**Dependencies Explanation:**

- **Basic Format:** Reference or depend (must use) on other specs, allowing reuse of others' specs
- **GitHub Repository:** Write as `account/repository` format (e.g., `thruthesky/forum-spec`)
- **External URL:** Specify full URL path if not GitHub (e.g., `https://doma.com/abc/def`)
- **Priority Designation:** Asterisks (*) indicate priority. With multiple specs of identical content, more asterisks means higher priority reference
  ```
  *withcenter/chat-spec     (Priority 1)
  **another/spec            (Priority 2, highest)
  ```
- **Specific File/Section Reference:** Content like `[xxx-yyy-zzz.md#section-name]` at spec end means don't reference entire spec, but only specific file, or with `#section-name`, only that section from that file
  ```
  withcenter/chat-spec[chat-rooms-join.md]           # Specific file only
  withcenter/chat-spec[chat-rooms-join.md#overview]  # Specific section only
  ```

**Spec Index Structure:**

Every project must include the following index file:

```
<project-name>-index.md
```

- **DTOC Format:** Write as Detailed Table of Contents (DTOC) format
- **Table of Contents and Summary:** Include table of contents with summary/storyline of specs each file (item) contains
- **LLM Utilization:** For large-scale specs, LLM can reference index.md file to decide when to reference which document
- **Top YAML:** Index file also includes YAML header at top

**Spec File Content Structure:**

Individual spec files follow this structure:

1. **YAML Header:** Located at file top, records dependencies to indicate which documents to reference. Can reference external and internal documents
2. **Overview:** Must include short summary Overview section below YAML header
3. **Requirements:** Specify prerequisites needed to implement the spec. Includes command execution, library installation, environment settings
4. **Workflow:** Workflow must follow requirements. Workflow includes steps AI must follow
5. **Detail Items:** Detail item descriptions follow below workflow

 **Advantages of Spec File Structuring**
Clear file structure and naming conventions enable systematic spec management in large projects and allow AI to quickly find and reference needed information. By specifying inter-spec dependencies through Dependencies, spec reusability and consistency can be enhanced.

#### 4. **Spec Validation**

- Written specs calculate scores through validation tools; development can proceed only with **90 points or higher**
- If score is insufficient, identify items needing supplement and return to storyline and detailed spec stages for revision
- Record all validation results and supplement history to maintain traceability between specs and implementation

### ™ Execution Phase

- AI implements precisely only what is defined in specs
- All content outside specs is ignored
- If humans intervene midway, those changes must also be re-documented as specs
- "Code modification" means "spec update"

### = Verification Phase

- Verification is also performed autonomously based on specs
- Test cases and expected results are extracted from specs
- All features are evaluated on the criterion "Does it match the spec?"
- If verification doesn't pass, AI returns the following message:

```
SpecDeviationError: Implementation diverged from specification on module 'auth'.
Suggested Action: Review and revise spec or code alignment.
```

### =€ Deployment Phase

- Human intervention is essential for deployment
- AI automatically generates deployment scripts, environment configuration files, and CI/CD procedures, but actual deployment commands are executed after human verification

### = Operation Phase

- Specs must include "operational automation" content. Examples: log collection, error reporting, update scenarios
- AI performs monitoring, reporting, and automatic fix suggestion roles in the operation phase
- When new requirements arise, follow the sequence: spec update ’ score re-evaluation ’ redevelopment

## =9 Philosophy Summary

| Category | Content |
|----------|---------|
| **Philosophy** | Spec is the Truth. Development is the act of executing truth. |
| **AI Role** | Does not judge. Only executes specs without interpretation. |
| **Developer Role** | Focus on creating complete and clear specifications. |
| **Quality Assurance** | Testing and verification are all performed through spec-based automation. |
| **Deliverable Characteristics** | Consistency, verifiability, ease of maintenance, predictable quality. |

## =9 Slogans and Core Messages

- >à "AI does not imagine. It executes."
- =Ü "Spec is the contract. Spec is the code."
- ™ "No assumption. No improvisation. Only implementation."

##   SED's Challenges

SED's biggest challenge is that specifications must be precise and complete, which means **specification size also increases**. This means **token count increases**.

To create perfect specifications, you must write detailed specifications equivalent to a book's worth of content, and injecting this into LLMs requires a considerable amount of tokens.

### =¡ Solution

To solve this problem, **specs must be separated by stage** and work assigned to LLMs.

- Divide entire spec into logical units (by module, feature, layer)
- Deliver only necessary specs to LLM at each stage
- Validate stage results and proceed to next stage
- Design spec documents themselves with hierarchical structure
- Build reusable common spec libraries

Through this approach, SED's philosophy can be maintained while developing into a form applicable to actual projects.

## =à CLI Commands

```bash
# Validate specifications
sedai doctor [options]

# Initialize new project
sedai init --name <project-name>

# Validate single file
sedai validate <file>

# Calculate specification score
sedai score <file>
```

## =Ý Example Spec File

```markdown
---
name: my-app-user-authentication
version: 1.0.0
description: User authentication specification for My App
author: Your Name
email: your.email@example.com
license: MIT
dependencies: my-app-database[users-schema.md], my-app-security[encryption.md#password]
---

## Overview
User authentication system supporting email/password and OAuth 2.0 (Google, Facebook).

## Requirements

### Libraries
- bcrypt ^5.1.0
- jsonwebtoken ^9.0.0
- passport ^0.6.0

### Installation
\`\`\`bash
npm install bcrypt jsonwebtoken passport
\`\`\`

## Workflow
1. User submits credentials
2. Validate input format
3. Check user existence in database
4. Verify password hash
5. Generate JWT token
6. Return token to client

## Details
...
```

## > Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## =Ä License

MIT License - see the [LICENSE](LICENSE) file for details.

## =d Author

**Song Jaeho (¡¬8)**
- Email: thruthesky@gmail.com
- Created: November 4, 2025

---

**Remember:** In SED, the specification is not just documentationit is the source of truth that directly drives development.

> "Spec-Exact Development transforms specifications into executable reality."
