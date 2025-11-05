# SEDAI - Spec-Exact Development by AI

> "AI develops exactly as the spec defines — no interpretation, no assumption."

A development methodology and toolset where artificial intelligence implements solutions strictly according to specifications without deviation.

[![npm version](https://img.shields.io/npm/v/sedai.svg)](https://www.npmjs.com/package/sedai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen)](https://nodejs.org/)

---

## Installation

```bash
# Global installation
npm install -g sedai

# Or use with npx
npx sedai --help
```

## Quick Start

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

## CLI Commands

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

---

## Spec-Exact Development (SED) Manifesto

### Spec-Exact Development at a Glance

- **Tagline:** *"AI develops exactly as the spec defines — no interpretation, no assumption."*
- **Background:** A new development methodology created by **Song Jaeho** on **November 4, 2025** to overcome the limitations of vibe coding.
- **Name:** Spec-Exact Development (SED).

#### Problems with Prior Approaches

- Specifications, context, and required skills are often described vaguely.
- MCPs provide only fragmented pieces of information.
- AI freely interprets requirements, creating unpredictable outcomes.

#### SED's Solution

- Provide AI with complete blueprints.
- AI follows the blueprints precisely without making inferences.
- Specifications become the absolute standard that guarantees consistency.

---

### 1. Concept Definition

**Spec-Exact Development (SED)** is an AI-driven development paradigm in which the AI never deviates by even a single line from the specification.

- The specification is the absolute standard.
- AI neither interprets nor infers intent—it executes exactly what is written.
- Therefore, specifications must be meticulously precise and complete.
- In practice, the AI is given a complete architectural blueprint and reproduces it without deviation.

> *"If the spec is wrong, the product is wrong — by design."*

---

### 2. Fundamental Principles

#### 2.1 Spec-Exactness Principle

1. Development implements only what the specification defines.
2. If the specification is incomplete, the AI must immediately return a **Spec Error** and stop development.

#### 2.2 Spec Completeness Scoring

1. Before development begins, the AI evaluates the specification and assigns a score from **0–100**.
2. Development may start only when the score is **90 or higher**.
3. The score evaluates:
   - Database design completeness
   - Clarity of business logic
   - Specificity of UI/UX requirements
   - Detail of the testing plan (unit/widget/e2e)
   - Definition of deployment and operational environments

**Example: Insufficient spec score error**

```
SpecError: Insufficient specification to execute.
Reason: Database schema, authentication flow, or encryption detail missing.
Required Spec Score: ≥90
Current Score: 42
```

#### 2.3 Spec Is the Law

1. AI never attempts to infer human intent.
2. Ambiguous sentences in the specification are ignored and not implemented.
3. Guessing is forbidden; only written instructions are executed.
4. Specifications are absolute, but they may still contain mistakes.
   - Even if the specification is wrong, the AI must still follow it without inference.
   - When an error is suspected, the AI may request confirmation or revisions from a developer.
   - The AI may ask humans to update the spec but cannot modify the spec on its own.
5. Ultimately, **the AI must always follow the specification.**

---

### 3. Development Process Phases

#### 3.1 Preparation Phase

The AI analyzes the provided specification and assigns a score. In SED, the preparation phase requires a multi-dimensional blueprint so subsequent stages proceed smoothly.

##### 3.1.1 Write Specification Storylines

- Draft an **overall storyline** describing the complete product flow and **detailed storylines** for each feature or module—at least **100 items each**.
- For a complete SNS web/app service, the storyline should be roughly **10,000 tokens** (about 14 pages).
- The detailed specification must be at least **20 times longer** than the storyline (~2,800 pages) and may be longer or shorter as needed. Keep this scale in mind while designing the storyline.
- Each storyline should concisely summarize core goals, primary user roles, and major feature flows.

##### 3.1.2 Write Detailed Specifications

Convert every item derived from the storyline into blueprint-level detail, removing redundant explanations and keeping only essential information.

###### Spec Ownership and Personal Philosophy

You may copy specs written by others or ask AI to draft them, but the final decision about what to build is always human. Therefore, you must fully understand the spec and revise it to reflect your own philosophy.

###### Database Specification

- **DBMS:** MySQL 8.0.35 Community Edition
- **Hosting Environment:** Self-hosted on AWS EC2 t3.medium (2 vCPU, 4GB RAM)
- **Operating System:** Ubuntu 22.04.3 LTS (Jammy Jellyfish)
- **Network:** Private IP `10.0.1.50`, Port `3306`, SSH Port `22`
- **Access Accounts:** `dev@10.0.1.50` (SSH key `~/.ssh/dev_rsa`), DB user `app_dev` (password stored in `.env`)
- **SQL Settings:** SQL Mode `STRICT_TRANS_TABLES`, Character Set `utf8mb4`, Collation `utf8mb4_unicode_ci`
- **Table Structures:**
  - `users` (`id`, `email`, `password_hash`, `created_at`)
  - `posts` (`id`, `user_id`, `title`, `content`, `created_at`)
  - `comments` (`id`, `post_id`, `user_id`, `content`)
- **Indexes:** `users.email` (UNIQUE), `posts.user_id` (INDEX), `comments.post_id + created_at` (COMPOSITE INDEX)
- **Foreign Keys:** `posts.user_id → users.id (ON DELETE CASCADE)`, `comments.post_id → posts.id (ON DELETE CASCADE)`
- **Transaction Isolation:** READ COMMITTED (InnoDB engine)
- **Backup Policy:** Daily full backup at 03:00 UTC via `mysqldump`, retained for 7 days
- **Utilities:** `mysqldump 8.0.35`, `mysql-client 8.0.35`, `pt-online-schema-change 3.5.0`

###### Feature Specification

**User Registration**

- Email/password signup with RFC 5322 validation
- Passwords: minimum 8 characters, include uppercase, lowercase, numbers, and special characters
- Phone verification via Twilio API v2022-05-01, six-digit SMS OTP, valid for 5 minutes
- Social login: Google OAuth 2.0 (Client ID: `xxx`), Facebook Login v18.0, Apple Sign-In (Team ID: `xxx`)
- Password encryption: bcrypt (cost factor 12, 10 salt rounds)
- Email verification via SendGrid API v3; verification link valid for 24 hours
- Duplicate checks: enforce DB UNIQUE constraint and application-level validation
- Error handling: `409 Conflict` (email already exists), `400 Bad Request` (invalid format), `500 Internal Server Error` (server failure)

**Forum**

- Full CRUD operations
- Pagination: 20 items per page
- Sorting: newest, view count, like count
- Search: title, content, author
- File upload: images up to 5 MB, formats JPG/PNG/GIF

**Payment**

- Stripe API v2023-10-16
- Payment gateways: Stripe and Toss Payments
- Methods: card, bank transfer, simple payment
- Amount range: ₩1,000–₩10,000,000

**Notification**

- Firebase Cloud Messaging (FCM) v1 API
- Push notifications: comments, likes, mentions
- Email notifications: daily summary, weekly report
- Notification settings: per-user ON/OFF toggle

###### Routing Specification

- SED mandates explicit routes for every path; record concrete paths such as `/auth/signup`, `/auth/verify`, `/dashboard`.
- Specify exactly where signup begins (e.g., `/auth/signup`) and where the user is directed after completion (e.g., `/onboarding/profile`).
- Provide a full journey map (e.g., signup → verification → onboarding → dashboard) with route diagrams.
- Document redirect conditions, exception flows (failure paths), and access control guards directly in the spec.

###### Function Specification

SED requires every function's name, purpose, parameters, location, and usage to be explicitly defined so AI never invents its own design.

- **Function Name:** Provide the precise identifier, e.g., `handleLikeCreate()`, `parseLikeId()`, `updatePostLikeCount()`.
- **Function Role:** Describe responsibilities, e.g., "Increase `likeCount` and update analytics when a like is created" or "Parse `likeId` to extract `type`, `nodeId`, and `uid`."
- **Parameters:** Declare each parameter's name, type, and whether it is required.
  - `handleLikeCreate(likeId: string)` — required, format `post-{postId}-{uid}`
  - `updateProfile(userId: UserId, data: Partial<UserProfile>)` — `userId` required, `data` is a partial update object
- **Return Value:** Define the structure, e.g., `Promise<{ success: boolean; type?: string; error?: string }>`.
- **File Location:** Indicate where the function lives.
  - `handleLikeCreate()` → `/firebase/functions/src/handlers/like.handler.ts`
  - `parseLikeId()` → `/firebase/functions/src/utils/like.utils.ts`
  - `toggleLike()` → `/web/src/lib/services/like.ts`
- **Call Site:** Specify when and where it runs.
  - `handleLikeCreate()` triggers on Firebase Cloud Functions `/likes/{likeId}` onCreate.
  - `toggleLike()` fires when the PostItem component's like button is clicked.
  - `parseLikeId()` runs inside `handleLikeCreate()` when validating the ID.

**Example Function Specification**

- **Name:** `handleLikeCreate`
- **Role:** Increment `likeCount` and update global statistics when a like is added.
- **Parameters:**
  - `likeId: string` (required)
    - Format: `"post-{postId}-{uid}"` or `"comment-{commentId}-{uid}"`
- **Return:** `Promise<{ success: boolean; type?: string; nodeId?: string; uid?: string; error?: string }>`
- **Location:** `/firebase/functions/src/handlers/like.handler.ts`
- **Invocation:** Firebase Cloud Functions `onCreate` trigger for `/likes/{likeId}`
- **Workflow:**
  1. Parse `likeId` using `parseLikeId`.
  2. If `type === "post"`, increment the corresponding post's `likeCount` by 1.
  3. If `type === "comment"`, increment the corresponding comment's `likeCount` by 1.
  4. Increment `/stats/counters/like` global counter by 1.
- **Error Handling:**
  - On parse failure, return `{ success: false, error: "Invalid likeId format" }`.
  - When target post/comment is missing, return `{ success: false, error: "Post/Comment not found" }`.

*Function specs must be so detailed that AI can implement them flawlessly without human coding. Leave nothing ambiguous—name, parameters, location, call timing, everything must be explicit.*

###### UI/UX Requirements (Design Specification)

- **Design System:** Material Design 3.0
- **Primary Color:** `#6366F1`
- **Secondary Color:** `#8B5CF6`
- **Typography:** Pretendard Variable (Korean), Inter (English)
- **Responsive Breakpoints:**
  - Mobile: `< 768px`
  - Tablet: `768px–1024px`
  - Desktop: `> 1024px`
  - Based on Tailwind CSS v3.4
- **Layout Components:**
  - Header: fixed, 64px height
  - Sidebar: collapsible, 280px width
  - Main content: max-width 1280px, centered
  - Footer: 120px height
- **User Flow:** Login → Dashboard → Post List → Post Detail → Comment Creation → Notification Receipt (Figma reference: `https://figma.com/file/xxx`)
- **Accessibility:** WCAG 2.1 Level AA, keyboard navigation, ARIA labels for screen readers
- **Animation:** Framer Motion v11 — page transitions (fade-in 300 ms), button hover (scale 1.05 over 200 ms), modal (slide-up 250 ms)

###### Testing Specification — the Most Detailed Section

*Testing is paramount in SED. The items below are minimum requirements; real projects demand far more precision.*

- **Languages & Environment:** TypeScript 5.3.3, Node.js 20.10.0 LTS, npm 10.2.3
- **Testing Stacks:**
  - Unit: Vitest 1.0.4 (Jest-compatible, ESM support)
  - Component: Testing Library (`@testing-library/svelte` 4.0.5)
  - E2E: Playwright 1.40.1 (Chromium 120.0, Firefox 121.0, WebKit 17.4)
- **Environment Setup:**
  - Local: Docker Compose v2.23.0 (MySQL 8.0 + Redis 7.2 + Node.js 20)
  - CI: GitHub Actions (`ubuntu-latest`, Node.js 20.x matrix)
  - Test DB: MySQL 8.0 container on port 3307 (init script `/docker/mysql/init.sql`)
  - Mock data: Faker.js 8.3.1 (100 users, 500 posts, 2,000 comments)
  - Environment variables: `.env.test` (`DATABASE_URL`, `API_KEY`, `JWT_SECRET`, etc.)
- **Unit Test Scenarios:**
  - Coverage target ≥ 80% (statement/branch/function/line)
  - Minimum 200 cases (utils: 50, services: 80, stores: 70)
  - Command: `npm run test:unit` (parallel with max 4 workers)
  - Example: `auth.service.test.ts` covering login success, failure, network error, token expiration (12 cases)
- **E2E Test Scenarios:**
  - Primary journey: signup → login → create post → create comment → logout (15 steps)
  - Browsers: Chromium desktop (1920×1080), mobile (iPhone 13, 390×844)
  - Command: `npx playwright test` (headless, 3 parallel workers)
  - Capture screenshots at each step; on failure, collect full-page screenshot and video
  - Example: `e2e/auth.spec.ts` verifying lockout after three invalid password attempts
- **Performance Testing:**
  - Tools: Lighthouse CI 0.12.1, k6 0.48.0
  - Targets: LCP < 2.5 s, FID < 100 ms, CLS < 0.1, TTI < 3.8 s
  - Load test: 1,000 concurrent users for 10 minutes, 500 RPS goal via k6
- **Security Testing:**
  - Tools: OWASP ZAP 2.14.0, `npm audit`, Snyk CLI 1.1266.0
  - Weekly scans for SQL injection, XSS, CSRF, and package vulnerabilities
- **CI/CD Pipeline:**
  - Triggers: pushes to `main`/`develop`, and pull request creation
  - Stages: Lint (ESLint 8.56) → Build → Unit Tests → E2E Tests → Deploy to staging
  - Time limit: entire pipeline must finish within 15 minutes or fail
  - Automated deployments: staging on `develop`, production on `main` (with manual approval)
  - Notifications: Slack `#dev-alerts` channel (build successes/failures, deployment completion)
- **Test Automation:**
  - Husky 8.0.3 + lint-staged 15.2.0 (pre-commit: lint, format, affected tests)
  - Change detection: analyze `git diff` to run only impacted tests (e.g., `auth.ts` → `auth.test.ts`)
  - Caching: GitHub Actions cache for `node_modules`, Playwright browsers, and build artifacts
- **Test Result Reports:**
  - Formats: JUnit XML (Vitest), HTML (Playwright), coverage via Istanbul/NYC
  - Storage: `/test-results` (gitignored) and S3 bucket `s3://test-reports/YYYY-MM-DD/` (30-day retention)
  - Dashboards: Codecov (coverage trends), Allure Report (E2E history)
  - Failure analysis: include screenshots, error stacks, run duration, reproduction steps

###### Spec File Structure and Naming Convention

Organize specifications so AI can locate information quickly and reuse documents consistently.

- **File Naming Pattern:**
  - `<project-name>-<module-name>-<function-name>.md`
  - Use the structure “project-module(feature)-function(detail unit)” with a Markdown extension.
- **YAML Header Template:** Include the following front matter at the top of every spec file.

  ```yaml
  ---
  name: Spec or project name (English, numbers, hyphens only, ≤255 chars)
  version: Spec version (follows Semantic Versioning)
  description: Project description (≤4096 chars)
  author: Author name (≤64 chars)
  email: Author email (≤64 chars)
  homepage: Reference homepage URL
  funding: Payment route for supporting the spec maintainer
  license: License identifier (MIT, GPL, etc.)
  dependencies: thruthesky/forum-spec, *withcenter/chat-spec[chat-rooms-join.md#chat-overview], **https://doma.com/abc/def
  ---
  ```

- **Dependencies Guidelines:**
  - Use dependencies to reference or require other specs for reuse.
  - GitHub repositories use the `account/repository` format (e.g., `thruthesky/forum-spec`).
  - Non-GitHub resources must include the full URL (e.g., `https://doma.com/abc/def`).
  - Indicate priority with leading asterisks—more asterisks mean higher priority when duplicates exist.

    ```
    *withcenter/chat-spec     # Priority 1
    **another/spec            # Priority 2 (highest)
    ```

  - To reference specific files or sections, append `[file.md]` or `[file.md#section-name]`.

    ```
    withcenter/chat-spec[chat-rooms-join.md]           # Particular file only
    withcenter/chat-spec[chat-rooms-join.md#overview]  # Specific section only
    ```

- **Index Specification:** Every project must provide `<project-name>-index.md` as a detailed table of contents (DTOC).
  - Summarize the specs contained in each file for quick navigation.
  - LLMs can consult the index to decide which document to open for additional detail.
  - The index file also begins with the YAML header above.
- **Spec Content Structure:** Each specification file follows this outline:
  1. **YAML Header** — includes dependency declarations.
  2. **Overview** — brief summary of the document.
  3. **Requirements** — prerequisites such as commands, libraries, and environment variables.
  4. **Workflow** — ordered steps the AI must follow.
  5. **Detail Items** — exhaustive descriptions for each component.

*Benefits:* Clear structure and naming conventions enable systematic management, easy reuse, and faster retrieval of relevant specs, especially for large projects.

###### Firebase Functions Testing Specification (Unit + Handler E2E)

*Testing is non-negotiable in SED; the requirements below are the bare minimum—real projects must go even deeper.*

- **Structure Principle:** Place event handlers only in `firebase/functions/src/index.ts`; separate business logic into pure modules for direct unit testing without emulators.
- **Unit Tests:** Call the extracted logic functions directly, minimizing external dependencies or replacing them with simple mocks.
- **Handler E2E Tests:** Use `firebase-functions-test` to wrap handlers and simulate events without an emulator.
  - For Realtime Database events, construct `event.data` via `functionsTest.database.makeDataSnapshot`.
- **Environment Initialization:**
  ```ts
  const testEnv = functionsTest({
    projectId: 'demo-project',
    databaseURL: 'https://demo-project.firebaseio.com',
  });

  after(() => testEnv.cleanup());
  ```
- **Example Handler Test:**
  ```ts
  import * as functionsTest from 'firebase-functions-test';
  import { onPostCreate } from '../src/index';

  const testEnv = functionsTest({
    projectId: 'demo-project',
    databaseURL: 'https://demo-project.firebaseio.com',
  });

  after(() => testEnv.cleanup());

  it('increments category stats when a new post is created', async () => {
    const wrapped = testEnv.wrap(onPostCreate);
    const snapshot = testEnv.database.makeDataSnapshot(
      { category: 'community' },
      '/posts/post123'
    );

    await wrapped({ data: snapshot, params: { postId: 'post123' } });

    // Verify admin.database().ref().update was invoked
    ...
  });
  ```

**Key Takeaways**

1. Separate handlers and logic to maximize testability.
2. Perform unit tests on pure logic, and handler E2E tests on the wrapped handlers.
3. Use `firebase-functions-test` extensively to simulate production-like behavior without emulators.

###### Development Environment

- **Language:** TypeScript 5.3.3 (strict mode, ESNext target)
- **Framework:** Svelte 5.0.0 (Runes API), SvelteKit 2.0.0 (`adapter-vercel`)
- **Build Tooling:** Vite 5.0.10 (esbuild, Rollup 4.9.4)
- **Package Manager:** npm 10.2.3 (lockfile version 3)
- **Operating Systems:** macOS 14.2 Sonoma (development), Ubuntu 22.04 (production)
- **Containers:** Docker 24.0.7, Docker Compose 2.23.0
- **Editor:** VS Code 1.85 with Svelte, ESLint, Prettier, and Playwright Test extensions
- **Version Control:** Git 2.43.0 with GitHub (`main`/`develop` branches, Conventional Commits)

###### Deployment & Operations

- **Hosting:** Vercel (frontend, Edge Functions), AWS ECS Fargate (backend APIs)
- **CDN:** Cloudflare (caching, DDoS protection, SSL/TLS 1.3)
- **Monitoring:** Sentry (errors, release tracking), Datadog (APM, logs, metrics)
- **Logging:** AWS CloudWatch Logs (30-day retention), ELK Stack (Elasticsearch 8.11, Logstash 8.11, Kibana 8.11)
- **Alerts:** PagerDuty for critical errors, Slack for warnings/info
- **Backups:** Databases (daily full + hourly incremental), file storage (S3 versioning with lifecycle policy)

> ✅ Development may begin **only** when the spec score is 90 or higher. Achieving this requires every section to contain meticulous, fine-grained specifications like those above.

---

### Why Must Specifications Be This Detailed?

SED's core principle is "AI does not infer."

- If the spec merely states "Use MySQL":
  - Which version? (5.7 vs. 8.0 have syntax differences.)
  - Which edition? (Community vs. Enterprise offer different features.)
  - What settings? (Character set, SQL mode, etc., change behavior.)
  - Where will it run? (Local vs. AWS RDS affects connectivity.)

AI cannot infer these details—nor should it. Every piece of information must be explicitly documented.

> **Complete specification = everything a developer would need to know when implementing the system manually.**

This is the level of rigor SED demands.

---

### Spec Validation

- Use validation tools to compute a score for each spec; development proceeds only when the score is **90 or above**.
- If the score falls short, identify the deficient sections and return to the storyline/detailed spec stages for revisions.
- Record validation results and revision history to maintain traceability between specs and implementation.

---

### 3.2 Execution Phase

- The AI implements precisely what the specification dictates—nothing more, nothing less.
- Anything outside the specification is ignored.
- If humans intervene, those adjustments must be captured as updated specifications.
- *In SED, “code changes” and “spec updates” are inseparable.*

### 3.3 Verification Phase
- Verification runs autonomously based on the specification.
- Test cases and expected outcomes are derived directly from the spec.
- Every feature is evaluated solely by the question: "Does it match the specification?"
- If verification fails, the AI returns:
### 3.4 Deployment Phase
- Human involvement is mandatory.
- AI can generate deployment scripts, environment configs, and CI/CD procedures, but humans must review and execute the actual deployment commands.
### 3.5 Operation Phase
- The specification must cover operational automation, including logging, error reporting, and update scenarios.
- During operations, AI monitors, reports, and recommends automated fixes.
- When new requirements appear, follow the loop: **update spec → re-evaluate score → redevelop.**

---
### 4. Philosophy Summary

| Category | Content |
| --- | --- |
| **Philosophy** | Spec is the truth. Development simply executes that truth. |
| **AI's Role** | Makes no judgments—executes the specification without interpretation. |
| **Developer's Role** | Devote energy to crafting complete, unambiguous specifications. |
| **Quality Assurance** | Testing and verification are fully automated from the specification. |
| **Deliverable Traits** | Consistent, verifiable, maintainable, and predictably high-quality. |
---
### 5. Slogans and Core Messages
- 🧠 *"AI does not imagine. It executes."*
- 📜 *"Spec is the contract. Spec is the code."*
- ⚙️ *"No assumption. No improvisation. Only implementation."*
---
### SED's Core Challenge
SED demands precision and completeness, which naturally enlarges the specification—and therefore the token budget.
To craft a truly complete specification, expect book-length documentation. Supplying that to an LLM consumes a significant number of tokens.
#### Proposed Solutions

- Partition the entire spec into logical units (by module, feature, or layer).
- Provide the LLM only with the relevant spec fragment for each stage.
- Validate output at every stage before proceeding.
- Design spec documents hierarchically.
- Build reusable shared-spec libraries.

This approach preserves SED's philosophy while making it practical for real projects.
> "Spec-Exact Development (SED) moves beyond prompt engineering. It establishes an AI-driven development philosophy centered on specification completeness, automated verification, and uncompromising consistency."
---
## Example Spec File Structure

1. User submits credentials.
2. Validate input format.
3. Check user existence in database.
4. Verify password hash.
5. Generate JWT token.
6. Return token to client.
---

## Contributing

## License
MIT License — see the [LICENSE](LICENSE) file for details.
## Author

**Song Jaeho (송재호)**
- Email: [thruthesky@gmail.com](mailto:thruthesky@gmail.com)

> *"In SED, the specification is not just documentation—it is the source of truth that directly drives development."*
>
> *"Spec-Exact Development transforms specifications into executable reality."*
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
