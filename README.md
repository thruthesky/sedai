# SEDAI - Spec-Exact Development with AI

> "AI develops exactly as the spec defines — no interpretation, no assumption."

A development methodology and toolset where artificial intelligence implements solutions strictly according to specifications without deviation.

[![npm version](https://img.shields.io/npm/v/sedai.svg)](https://www.npmjs.com/package/sedai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)

---

## The Origin of SED

### The Skepticism Behind SED's Birth

When new Vibe Coding concepts, methodologies, tools, and agents emerged, I remained deeply skeptical. All of these approaches, regardless of their packaging, boiled down to the same fundamental question: **How can we effectively inject context into AI?**

Whether humans communicate with AI through text, voice, or video, it's ultimately just a prompt. This fundamental nature will never change. All the fancy tools—Context, SpecKit, Skills, MCP—are merely different vehicles for context injection.

### The Reality of Vibe Coding

When I first started with Vibe Coding, I'd give AI a single prompt: "Build me a website I'll love." The AI would autonomously create elaborate specifications and generate impressive-looking code. But here's the problem: **I don't even know exactly what I want**, yet the AI produces something grand that looks beautiful but proves utterly impractical in real-world use.

### Where Everything Falls Apart

The real problem begins with the **second prompt**. When you request modifications to parts you don't like, your intent starts diverging from the AI's original plan. The AI begins making errors in the code and logic it previously generated. You find yourself trapped in an endless cycle of corrections, constantly trying to fix issues. Eventually, even the smallest modification request consumes enormous amounts of time, often without reaching a proper solution.

This is the **"hamster wheel"** problem—running endlessly without making real progress.

### SED's Radical Solution

SED takes a radically different approach: **Provide complete specifications to the AI and demand absolute obedience**. Even if the spec is wrong, follow the spec exactly.

Of course, AI does have two authorities:

1. **Authority to halt**: If the specification contains critical errors that would cause severe problems, AI has the authority to stop work
2. **Authority to request improvements**: AI can point out errors in the specification and request humans to improve them

However, **AI does not have the authority to modify specifications on its own**.

This is the core essence of SED—complete specifications plus absolute AI obedience, with limited but crucial AI authority to protect against critical errors.

---

## Community & Sharing

**Homepage:** [https://sedai.dev](https://sedai.dev)
**Spec Repository Collection:** [https://sedai.dev/spec-repositories](https://sedai.dev/spec-repositories)

Anyone can write their specifications in SED format, publish them online, and share them with the community. We encourage everyone to participate and contribute their specifications!

To share your specifications:
1. Write your specification following the SED format
2. Publish it in a public repository (GitHub, GitLab, or your own server)
3. Register it at [https://sedai.dev/spec-repositories](https://sedai.dev/spec-repositories)
4. Help build the growing collection of reusable specifications

Your contributions help the entire SED community by providing proven, reusable specifications that others can learn from and build upon.

---

## Getting Started with SED

For a comprehensive step-by-step guide to getting started with SED, please refer to:

**🚀 [Quick Start Guide](https://sedai.dev/quickstarts)**

This guide provides:
- 7-step setup process from scratch
- Detailed instructions for creating specs directory, index.md, and instructions.md
- Guidelines for writing individual specification files
- AI evaluation prompt template for scoring your specifications
- Development workflow (proceed only when score ≥ 95)
- System prompt configuration examples for AI compliance
- Best practices for creating high-quality specifications

**Note:** The CLI tool (`npx spec init`) can help scaffold the initial structure, but understanding the manual process ensures you grasp SED fundamentals.

---

## Specification Scoring Criteria

Before development begins, AI evaluates specifications using a comprehensive scoring system. Understanding these criteria helps you write complete, high-quality specs.

For detailed information about specification scoring criteria, evaluation dimensions, and scoring thresholds, please refer to:

**📊 [Specification Scoring Criteria](https://sedai.dev/score)**

This comprehensive guide covers:
- Six key evaluation dimensions (YAML Header, Required Sections, Detail Completeness, etc.)
- Scoring thresholds and status levels (95-100: Excellent, 90-94: Good, etc.)
- AI recommendations for improvement
- Minimum passing score requirements

**Key Principle:** Development may begin **only** when the overall project score is **95 or higher**. This ensures AI can execute specifications without interpretation, assumption, or guesswork.

---

## Spec-Exact Development (SED) Manifesto

### Spec-Exact Development at a Glance

- **Tagline:** *"AI develops exactly as the spec defines — no interpretation, no assumption."*
- **Background:** A new development methodology created by **Song Jaeho** on **November 4, 2025** to overcome the limitations of vibe coding.
- **Name:** Spec-Exact Development (SED).

#### Problems with Prior Approaches

All modern AI development tools—Context, SpecKit, Skills, MCP, and others—are fundamentally the same: they all inject prompts to AI in identical ways, just with different names. This is the eternal nature of AI interaction.

The critical problem is not the tools themselves, but how AI interprets these prompts:

- Specifications, context, and required skills are often described vaguely.
- MCPs provide only fragmented pieces of information.
- AI freely interprets requirements based on assumptions, creating unpredictable outcomes.
- When AI produces incorrect results, developers enter a "hamster wheel" of iterative corrections.
- This cycle repeats endlessly because AI has no choice but to interpret ambiguous instructions.
- The fundamental flaw lies in the prompt itself, not the AI's capabilities.

#### SED's Solution

SED fundamentally solves the contradiction in how humans communicate with AI:

- **AI Evaluates Prompts**: AI actively scores specifications and identifies gaps before execution.
- **Requests Improvements**: AI can ask developers to enhance incomplete specifications rather than making assumptions.
- **Creates Better Specifications**: Through this feedback loop, specifications become increasingly complete and precise.
- **Strict Execution Only**: AI executes exactly what is specified—no interpretation, no improvisation, no assumptions.
- **Breaks the Hamster Wheel**: By demanding complete specifications upfront, SED eliminates the cycle of guess-fix-repeat.

The specification becomes the absolute standard that guarantees consistency. AI neither interprets nor infers—it executes only what is explicitly written.

---

### 1. Concept Definition

**Spec-Exact Development (SED)** is an AI-driven development paradigm in which the AI never deviates by even a single line from the specification.

- The specification is the absolute standard.
- AI neither interprets nor infers intent—it executes exactly what is written.
- Therefore, specifications must be meticulously precise and complete.
- In practice, the AI is given a complete architectural blueprint and reproduces it without deviation.

> *"If the spec is wrong, the product is wrong — by design."*

#### The Root Problem SED Solves

Traditional AI development approaches—whether using Context files, SpecKits, Skills, or MCPs—all suffer from the same fundamental issue: they deliver prompts that AI must interpret. Regardless of the tool's name or format, the core problem remains unchanged. AI interprets these prompts freely, often incorrectly, leading developers into an endless cycle of corrections. This "hamster wheel" exists not because AI is flawed, but because the prompts themselves are inherently incomplete and ambiguous.

SED breaks this cycle by transforming the relationship between developers and AI. Instead of passively accepting vague prompts, AI actively evaluates them, assigns completeness scores, and requests improvements before execution. This collaborative validation process creates specifications of unprecedented clarity and completeness. Once validated, AI executes these specifications with absolute fidelity—no interpretation, no guesswork, only precise implementation.

#### What Must Be Specified

SED specifications are not limited to high-level concepts like file names, route names, or page names. They must include:

- **Class Names and Function Names:** Every class, function, and method must be explicitly named in the specification.
- **Implementation Details:** From simple calculations to complex algorithms and business logic, everything must be documented.
- **Data Structures:** Variable names, types, and data flow must be clearly defined.
- **Control Flow:** Conditional logic, loops, and error handling paths must be specified.
- **Complete Source Code:** Specifications include fully implemented source code for logic, functions, classes, and concepts—not just conceptual descriptions. To ensure complete AI compliance, everything is provided in executable form.
- **Code Comments:** Documentation comments, inline comments, and JSDoc/TSDoc annotations that should appear in the source code must be specified in advance.
- **CSS Styling:** All styling information including colors, spacing, fonts, animations, responsive breakpoints, and visual design details must be defined.
- **User-Facing Text:** Every text string displayed to users—labels, buttons, messages, tooltips, placeholders—must be specified verbatim.
- **Internationalization (i18n):** Translation dictionaries for all supported languages, including locale-specific formats, pluralization rules, and right-to-left (RTL) support requirements.

The specification is a complete implementation blueprint that leaves no room for AI interpretation. By providing complete, executable code examples within the specification, we eliminate ambiguity and ensure the AI can follow the exact implementation pattern required. This includes not just functional code, but also comments, styling, user interface text, and translations—everything that comprises the final product.

#### Intellectual Property and Copyright

When development is conducted using publicly available SED specifications with AI assistance:

- **Copyright Ownership:** The copyright of the resulting code belongs to the **specification author**, not to the AI.
- **Rationale:** Since the AI strictly follows the specification without making creative decisions, the intellectual property derives from the specification itself.
- **Author Rights:** The person who writes the specification is the creator of the work, regardless of who or what implements it.

This principle recognizes that in SED, the specification is the true creative work, and the implementation is merely its mechanical execution.

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

#### 2.4 AI's Role in Spec Validation

While AI cannot directly modify specifications, it plays a crucial role in maintaining spec quality:

1. **Logic Verification:** AI can analyze the specification logic for inconsistencies, contradictions, or potential issues.
2. **Testing and Validation:** AI executes tests based on the specification and reports results to developers.
3. **Advisory Function:** AI can recommend spec updates, suggest improvements, and identify areas requiring clarification.
4. **Feedback Loop:** AI reports findings to developers, who then update the specification accordingly.

This creates a collaborative workflow where AI serves as both executor and quality assurance advisor, while developers maintain full control over specification content.

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

###### Code Comments, Styling, Text, and Internationalization

SED specifications must include every element that appears in the final product—not just code structure, but also documentation, presentation, and language support.

**Code Comments Specification**

All comments that should appear in the source code must be specified in advance:

- **File Headers:**
  ```typescript
  /**
   * User Authentication Service
   *
   * Handles user login, registration, password reset, and session management.
   * Uses bcrypt for password hashing and JWT for session tokens.
   *
   * @module services/auth
   * @author Your Name
   * @version 1.0.0
   */
  ```

- **Function Documentation:**
  ```typescript
  /**
   * Authenticates a user with email and password
   *
   * @param email - User's email address (must be valid format)
   * @param password - Plain text password (will be hashed for comparison)
   * @returns Promise resolving to JWT token and user data
   * @throws {AuthError} When credentials are invalid
   * @example
   * const result = await authenticateUser('user@example.com', 'password123');
   */
  ```

- **Inline Comments:**
  ```typescript
  // Verify email format before querying database to reduce unnecessary DB calls
  if (!isValidEmail(email)) {
    throw new ValidationError('Invalid email format');
  }

  // Use constant-time comparison to prevent timing attacks
  const isValid = await bcrypt.compare(password, user.passwordHash);
  ```

**CSS and Styling Specification**

Every visual detail must be explicitly defined:

- **Component Styles:**
  ```css
  .button-primary {
    background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    transition: all 200ms ease-in-out;
    cursor: pointer;
  }

  .button-primary:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  .button-primary:active {
    transform: scale(0.98);
  }
  ```

- **Responsive Design:**
  ```css
  /* Mobile: < 768px */
  @media (max-width: 767px) {
    .container {
      padding: 16px;
      max-width: 100%;
    }
  }

  /* Tablet: 768px - 1024px */
  @media (min-width: 768px) and (max-width: 1024px) {
    .container {
      padding: 24px;
      max-width: 720px;
    }
  }

  /* Desktop: > 1024px */
  @media (min-width: 1025px) {
    .container {
      padding: 32px;
      max-width: 1280px;
    }
  }
  ```

**User-Facing Text Specification**

Every text string that users see must be specified exactly as it should appear:

- **Button Labels:**
  - Primary action: "Sign In"
  - Secondary action: "Create Account"
  - Cancel action: "Cancel"
  - Delete confirmation: "Delete Post"

- **Form Labels and Placeholders:**
  - Email input label: "Email Address"
  - Email input placeholder: "Enter your email"
  - Password input label: "Password"
  - Password input placeholder: "Enter your password (minimum 8 characters)"

- **Messages and Notifications:**
  - Success: "Your account has been created successfully!"
  - Error (invalid email): "Please enter a valid email address."
  - Error (weak password): "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters."
  - Loading: "Processing your request..."
  - Empty state: "No posts yet. Create your first post to get started!"

- **Tooltips and Help Text:**
  - Password requirements: "Must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters"
  - Profile visibility: "Choose who can see your profile information"

**Internationalization (i18n) Specification**

For multilingual applications, specify complete translation dictionaries:

- **Translation Keys and Values:**
  ```json
  {
    "en": {
      "auth.signIn": "Sign In",
      "auth.signUp": "Create Account",
      "auth.forgotPassword": "Forgot Password?",
      "auth.emailLabel": "Email Address",
      "auth.passwordLabel": "Password",
      "auth.emailPlaceholder": "Enter your email",
      "auth.passwordPlaceholder": "Enter your password",
      "auth.success": "Welcome back, {username}!",
      "auth.error.invalidCredentials": "Invalid email or password.",
      "auth.error.weakPassword": "Password must be at least 8 characters."
    },
    "ko": {
      "auth.signIn": "로그인",
      "auth.signUp": "계정 만들기",
      "auth.forgotPassword": "비밀번호를 잊으셨나요?",
      "auth.emailLabel": "이메일 주소",
      "auth.passwordLabel": "비밀번호",
      "auth.emailPlaceholder": "이메일을 입력하세요",
      "auth.passwordPlaceholder": "비밀번호를 입력하세요",
      "auth.success": "환영합니다, {username}님!",
      "auth.error.invalidCredentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
      "auth.error.weakPassword": "비밀번호는 최소 8자 이상이어야 합니다."
    },
    "ja": {
      "auth.signIn": "ログイン",
      "auth.signUp": "アカウント作成",
      "auth.forgotPassword": "パスワードをお忘れですか？",
      "auth.emailLabel": "メールアドレス",
      "auth.passwordLabel": "パスワード",
      "auth.emailPlaceholder": "メールアドレスを入力",
      "auth.passwordPlaceholder": "パスワードを入力",
      "auth.success": "おかえりなさい、{username}さん！",
      "auth.error.invalidCredentials": "メールアドレスまたはパスワードが正しくありません。",
      "auth.error.weakPassword": "パスワードは8文字以上である必要があります。"
    }
  }
  ```

- **Locale-Specific Formatting:**
  - Date format (en-US): `MM/DD/YYYY` → `12/31/2025`
  - Date format (ko-KR): `YYYY.MM.DD` → `2025.12.31`
  - Date format (ja-JP): `YYYY年MM月DD日` → `2025年12月31日`
  - Number format (en-US): `1,234.56`
  - Number format (de-DE): `1.234,56`
  - Currency (USD): `$1,234.56`
  - Currency (KRW): `₩1,234`
  - Currency (JPY): `¥1,234`

- **RTL (Right-to-Left) Support:**
  ```css
  /* Arabic and Hebrew language support */
  [dir="rtl"] .container {
    text-align: right;
    direction: rtl;
  }

  [dir="rtl"] .sidebar {
    left: auto;
    right: 0;
  }
  ```

**Why This Level of Detail Matters**

By specifying comments, styles, text, and translations in advance:
- **Consistency:** All user-facing elements maintain uniform voice and style
- **Localization Accuracy:** Translations are contextually appropriate and culturally sensitive
- **Maintainability:** Future developers understand intent through comprehensive comments
- **Reproducibility:** AI can recreate the exact look, feel, and language of the application
- **Quality Assurance:** No ambiguity about how the final product should appear and behave

*In SED, every pixel, every word, and every comment is part of the specification. Nothing is left to interpretation or assumption.*

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

###### Spec File Structure

For detailed information about SED specification file structure, YAML headers, naming conventions, dependencies system, and complete examples, please refer to:

**📘 [SED Spec Structure Documentation](https://sedai.dev/structure)**

This comprehensive guide covers:
- File naming conventions and organization
- YAML header specification (required and optional fields)
- Spec content structure (Overview, Requirements, Workflow, Details)
- Dependencies system with priority levels
- Complete examples with code implementations
- Best practices for writing SED specifications

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

### 6. Prohibited Practices

SED strictly prohibits the following development approaches to maintain specification integrity:

#### 6.1 Incremental Prompt-Based Modifications

**❌ Prohibited:**
- Making iterative adjustments to AI output through progressive prompting
- Asking AI to "fix this part" or "change that section" without updating the specification
- Performing piecemeal modifications when the AI's implementation doesn't meet expectations

**✅ Required Approach:**
1. When AI output is unsatisfactory, **update the specification first**
2. Clearly document what needs to change and why in the spec
3. Instruct AI to re-implement based on the updated specification
4. Maintain full traceability between spec changes and code changes

**Example of Prohibited Workflow:**
```
Developer: "Make the button bigger"
Developer: "No, change the color to blue"
Developer: "Add a shadow effect"
Developer: "Move it to the right"
```

**Example of Correct Workflow:**
```
Developer: [Updates design spec]
  - Button: 48px height (increased from 40px)
  - Color: Primary blue (#6366F1)
  - Shadow: 0 2px 8px rgba(0,0,0,0.1)
  - Position: Right-aligned in container

Developer: "The specification has been updated. Please re-implement according to the new spec."
```

#### 6.2 Design Modifications Without Spec Updates

**❌ Prohibited:**
- Requesting design changes through ad-hoc prompts
- Iteratively refining UI/UX by giving AI incremental feedback
- Making visual adjustments without documenting them in the design specification

**✅ Required Approach:**
1. Document all design requirements in the specification
2. Include exact measurements, colors, spacing, typography, and behavior
3. When design needs to change, update the design spec with precise details
4. Have AI re-implement based on the updated design specification

**Why This Matters:**
- **Consistency:** Every change is traceable and documented
- **Reproducibility:** Anyone can recreate the exact implementation from specs
- **Maintainability:** Future modifications have clear historical context
- **Quality Assurance:** Specifications serve as the single source of truth

> *"In SED, there are no 'quick fixes' or 'small tweaks.' Every change starts with the specification."*

---
### 7. SED's Core Challenge
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

## Specification Examples

For complete specification file examples including YAML headers, detailed implementations, code samples, and database schemas, please refer to:

**📘 [SED Spec Structure Documentation - Complete Examples](https://sedai.dev/structure#complete-examples)**

The documentation includes:
- User authentication specification with complete implementation
- Database schema specification with tables, indexes, and triggers
- Function specifications with TypeScript code and error handling
- Testing requirements and coverage targets
- API endpoints with request/response examples

---

## SEDAI Utilities (Optional)

**Note:** The tools and utilities described in this section are **optional convenience features**. The core of SED is the methodology described in [Getting Started with SED](#getting-started-with-sed). You can practice SED by manually creating specification files following the SED principles—no tools required.

These utilities simply help automate some repetitive tasks, but understanding and following the SED methodology is what truly matters.

---

### Installation

```bash
# Global installation
npm install -g sedai

# Or use with npx (both commands work)
npx sedai --help
npx spec --help
```

### CLI Commands

Both `sedai` and `spec` commands are available:

```bash
# Initialize new project (fully implemented)
spec init [options]
  -n, --name <name>        Project name
  -s, --summary <summary>  Project summary/description
  -a, --author <author>    Author name
  -e, --email <email>      Author email

# Validate specifications (coming soon)
spec doctor [options]

# Validate single file (coming soon)
spec validate <file>

# Calculate specification score (coming soon)
spec score <file>
```

### Quick Start with CLI

```bash
# Initialize a new SED project (interactive mode)
npx spec init

# Or with all options (non-interactive)
npx spec init -n "my-project" -s "My awesome project" -a "Your Name" -e "your@email.com"

# Validate your specifications (coming soon)
npx spec doctor

# Validate a single spec file (coming soon)
npx spec validate specs/my-spec.md

# Calculate specification score (coming soon)
npx spec score specs/my-spec.md
```

**Remember:** These utilities are helpers, not requirements. Focus on understanding and applying SED principles as described in the [Getting Started with SED](#getting-started-with-sed) section.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This SEDAI tool is released under the MIT License - see the [LICENSE](LICENSE) file for details.

### SED Specification License

Specification documents created using SEDAI can be licensed under the **SED Specification License** to protect the author's copyright while enabling proper sharing and collaboration. By using the SED Specification License, specification authors can:

- Protect their intellectual property rights
- Define clear terms for usage and distribution
- Maintain attribution and recognition
- Enable collaborative development under specified terms

Authors are free to choose any license (MIT, GPL, SED Specification License, proprietary, etc.) that best suits their project needs.

For the full text of the SED Specification License, see: [SED-LICENSE](https://github.com/thruthesky/sedai/blob/main/SED-LICENSE)

## Author

**Song Jaeho**
- Email: thruthesky@gmail.com
- Created: November 4, 2025

---

> *"In SED, the specification is not just documentation—it is the source of truth that directly drives development."*
>
> *"Spec-Exact Development transforms specifications into executable reality."*
