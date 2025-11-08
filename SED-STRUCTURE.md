# SED Specification File Structure

This document provides a comprehensive guide to SED (Spec-Exact Development) specification file structure, YAML headers, naming conventions, and complete examples.

## Table of Contents

- [Introduction](#introduction)
- [File Structure Overview](#file-structure-overview)
- [YAML Header Specification](#yaml-header-specification)
- [Spec Content Structure](#spec-content-structure)
- [Dependencies System](#dependencies-system)
- [File Organization](#file-organization)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)

---

## Introduction

SED specifications are Markdown files with YAML front matter that define complete, unambiguous implementation blueprints. Every specification file follows a standardized structure to ensure AI can parse, understand, and execute them without interpretation.

**Key Principles:**
- **Spec is the absolute standard** — AI executes exactly what is written
- **Zero ambiguity** — Everything must be explicitly defined
- **Complete specifications** — No room for assumptions or interpretation
- **Structured format** — Consistent organization enables systematic processing

---

## File Structure Overview

Every SED specification file consists of three main parts:

```markdown
---
# 1. YAML Header (metadata)
name: project-module-feature
version: 1.0.0
description: Brief description
author: Your Name
email: your@email.com
---

# 2. Document Sections
## Overview
## Requirements
## Workflow
## Details

# 3. Implementation Specifications
(Detailed specifications for every aspect)
```

---

## YAML Header Specification

### Required Fields

All specification files **must** include these fields:

```yaml
---
name: project-module-feature           # Unique identifier
version: 1.0.0                         # Semantic versioning
description: Brief description         # ≤4096 characters
author: Your Name                      # ≤64 characters
email: your@email.com                  # ≤64 characters
---
```

### Optional Fields

Additional fields enhance functionality:

```yaml
---
homepage: https://example.com          # Project website
funding: https://example.com/donate    # Support/payment route
license: MIT                           # License identifier
step: 20                               # Execution order
screenshot: https://example.com/img.png # Preview image URL
dependencies: account/repo/specs       # External spec dependencies
---
```

### Field Descriptions

#### `name` (Required)
- **Purpose:** Unique identifier for the specification
- **Format:** English letters, numbers, hyphens only
- **Length:** ≤255 characters
- **Convention:** `<project>-<module>-<feature>` (e.g., `my-app-auth-login`)
- **Important:** All spec files in the same `./specs` directory must share the same `name` value

#### `version` (Required)
- **Purpose:** Track specification version
- **Format:** Semantic versioning (MAJOR.MINOR.PATCH)
- **Example:** `1.0.0`, `2.3.1`

#### `description` (Required)
- **Purpose:** Brief summary of the specification
- **Length:** ≤4096 characters
- **Content:** Clear, concise explanation of what this spec defines

#### `author` (Required)
- **Purpose:** Specification author's name
- **Length:** ≤64 characters

#### `email` (Required)
- **Purpose:** Author's contact email
- **Length:** ≤64 characters
- **Format:** Valid email address

#### `homepage` (Optional)
- **Purpose:** Reference website or documentation
- **Format:** Valid URL

#### `funding` (Optional)
- **Purpose:** Payment route for supporting the spec maintainer
- **Format:** Valid URL (e.g., GitHub Sponsors, PayPal, custom page)

#### `license` (Optional)
- **Purpose:** Specify copyright and usage terms
- **Values:** `MIT`, `GPL`, `SED Specification License`, proprietary, etc.
- **Note:** Each spec file can have a different license
- **Default:** If omitted, copyright belongs to the author
- **SED License:** View at [SED-LICENSE](https://github.com/thruthesky/sedai/blob/main/SED-LICENSE)

#### `step` (Optional)
- **Purpose:** Define execution order when AI processes multiple specs
- **Format:** Integers (recommended: increments of 10)
- **Example:** `step: 10`, `step: 20`, `step: 30`
- **Execution Rule:** Lower numbers execute first
- **Concurrent Execution:** Files with the same step value run simultaneously
- **Usage:**
  ```yaml
  step: 10   # Database setup (runs first)
  step: 20   # Backend API (runs second)
  step: 20   # Frontend setup (runs concurrently with backend)
  step: 30   # Integration tests (runs after both)
  ```

#### `screenshot` (Optional)
- **Purpose:** Visual preview specific to this spec file
- **Format:** Valid URL pointing to an image
- **Use Case:** Documentation tools and spec viewers can display this image
- **Example:** `screenshot: https://example.com/screenshots/auth-preview.png`

#### `dependencies` (Optional)
- **Purpose:** Reference or require other specifications for reuse
- **Format:** Comma-separated list of spec repository paths
- **Details:** See [Dependencies System](#dependencies-system) section

---

## Spec Content Structure

Every specification file follows this standard structure:

### 1. Overview

Brief summary of the specification's purpose and scope.

```markdown
## Overview

User authentication system supporting email/password and OAuth 2.0 (Google, Facebook, Apple).
Includes session management, password reset, and two-factor authentication (2FA).
```

### 2. Requirements

Complete list of prerequisites:
- **Libraries:** Exact package names and versions
- **Tools:** Required software and utilities
- **Environment:** Operating system, runtime versions
- **Configuration:** Environment variables, config files
- **Installation:** Commands to set up dependencies

```markdown
## Requirements

### Libraries
- bcrypt ^5.1.0 — Password hashing
- jsonwebtoken ^9.0.0 — JWT token generation
- passport ^0.6.0 — Authentication middleware
- @google-oauth/client ^2.0.0 — Google OAuth integration

### Environment
- Node.js 20.10.0 LTS
- TypeScript 5.3.3
- PostgreSQL 15.4

### Installation
```bash
npm install bcrypt jsonwebtoken passport @google-oauth/client
```
```

### 3. Workflow

Step-by-step process AI must follow. Each step should be clear and actionable.

```markdown
## Workflow

1. User submits credentials (email + password) via `/auth/login` endpoint
2. Validate input format:
   - Email: RFC 5322 compliant
   - Password: Minimum 8 characters
3. Query database for user record matching email
4. If user not found, return `401 Unauthorized`
5. Compare submitted password with stored hash using bcrypt
6. If password invalid, return `401 Unauthorized`
7. Generate JWT token with 24-hour expiration
8. Return token and user profile to client
```

### 4. Details

Exhaustive implementation specifications. This is the most critical section where **every detail** must be specified:

```markdown
## Details

### Function: `authenticateUser`

**Purpose:** Authenticate user credentials and generate session token

**Location:** `/src/services/auth.service.ts`

**Parameters:**
- `email: string` (required) — User's email address
- `password: string` (required) — Plain text password (minimum 8 characters)

**Return Type:** `Promise<AuthResult>`
```typescript
interface AuthResult {
  success: boolean;
  token?: string;
  user?: UserProfile;
  error?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
```

**Implementation:**
```typescript
/**
 * Authenticates a user with email and password
 *
 * @param email - User's email address (must be valid format)
 * @param password - Plain text password (will be hashed for comparison)
 * @returns Promise resolving to JWT token and user data
 * @throws {AuthError} When credentials are invalid
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResult> {
  // Validate email format before querying database
  if (!isValidEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  // Query database for user record
  const user = await db.users.findOne({ email });

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  // Use constant-time comparison to prevent timing attacks
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  // Generate JWT token with 24-hour expiration
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }
  };
}
```

**Error Handling:**
- `ValidationError`: Invalid email format → `400 Bad Request`
- `AuthError`: Invalid credentials → `401 Unauthorized`
- `DatabaseError`: Database connection failure → `500 Internal Server Error`

**Test Cases:**
1. Valid credentials → Returns token and user profile
2. Invalid email format → Returns validation error
3. Non-existent user → Returns authentication error
4. Incorrect password → Returns authentication error
5. Database unavailable → Returns server error
```

---

## Dependencies System

The `dependencies` field enables spec reuse and composition.

### Basic Format

```yaml
dependencies: account/repo/specs
```

**Important:** All dependency paths **must** end with `/specs` (plural form required).

### GitHub Dependencies

GitHub repositories use the format: `[account]/[repository]/[path]/specs`

If the path does not start with `http://` or `https://`, it is interpreted as a GitHub path.

```yaml
# GitHub repository examples
dependencies: thruthesky/forum/specs
dependencies: withcenter/chat/firebase/specs
```

**Expands to:**
- `github.com/thruthesky/forum/specs`
- `github.com/withcenter/chat/firebase/specs`

### Non-GitHub Dependencies

For non-GitHub resources, include the full URL ending with `/specs`:

```yaml
dependencies: https://abc.com/def/specs
dependencies: https://cdn.example.com/shared/specs
```

### Priority System

Use leading asterisks (`*`) to indicate priority when multiple specs contain similar content:

- **No asterisk:** Normal priority (default)
- **`*`:** Priority level 1
- **`**`:** Priority level 2 (highest)
- More asterisks = higher priority when conflicts occur

```yaml
dependencies: |
  thruthesky/forum/specs,
  *withcenter/chat/firebase/specs,
  **https://example.com/high-priority/specs
```

**Resolution:** If multiple specs define the same functionality, higher priority specs override lower priority ones.

### Specific File References

You can reference individual files or sections within a spec repository:

**Option 1: Bracket Notation (path must end with /specs)**
```yaml
dependencies: withcenter/chat/firebase/specs[chat-rooms-join.md]
dependencies: withcenter/chat/firebase/specs[chat-rooms-join.md#overview]
```

**Option 2: Direct File Paths (must be under /specs directory)**
```yaml
dependencies: thruthesky/forum/specs/authentication.md
dependencies: *https://abc.com/def/specs/validation.md
dependencies: **another/project/specs/main.md
```

### Multiple Dependencies

Separate multiple dependencies with commas:

```yaml
dependencies: |
  my-app/database/specs[users-schema.md],
  my-app/security/specs[encryption.md#password],
  *external/package/specs,
  **https://cdn.example.com/shared/specs[validation.md]
```

---

## File Organization

### Spec Repository Structure

All project specifications **must** be stored in the `./specs` directory:

```
project-root/
├── specs/                    # All spec files go here
│   ├── index.md              # DTOC (Detailed Table of Contents)
│   ├── instructions.md       # AI workflow guidelines (MANDATORY)
│   ├── preview.png           # Spec repository preview image (1024×1024)
│   ├── project-setup.md
│   ├── project-database.md
│   ├── project-auth-login.md
│   └── project-auth-signup.md
├── src/                      # Implementation code
└── README.md
```

### File Naming Convention

**Pattern:** `<project>-<module>-<feature>.md`

**Examples:**
- `my-app-auth-login.md`
- `my-app-database-schema.md`
- `my-app-api-users.md`
- `forum-posts-create.md`

**Benefits:**
- Clear hierarchy (project → module → feature)
- Easy to locate specific functionality
- Systematic organization for large projects

### Mandatory Files

#### `index.md` (REQUIRED)

**Purpose:** Detailed Table of Contents (DTOC) serving as the navigation hub for AI and developers

**What is DTOC?**

DTOC (Detailed Table of Contents) is not just a simple list of files—it's a comprehensive navigation map that answers the **5W1H questions** (Who, What, When, Where, Why, How) for each specification file in your project.

**Why DTOC is Critical for SED:**

When AI starts working on a task, it first reads `index.md` to understand:
- **What** each spec file contains (summary and purpose)
- **When** each spec should be used (triggering conditions, workflow order)
- **Where** the spec fits in the project architecture
- **Why** the spec exists (problems it solves, requirements it fulfills)
- **How** the spec relates to other specs (dependencies, execution order)
- **Who** created and maintains the spec (authorship, ownership)

This allows AI to make intelligent decisions about which specifications to load and in what order to execute them, following the **5W1H principle** to determine relevance to the current task.

**Content Requirements:**
- **YAML header** with the same `name` as all other specs in the directory
- **Project overview** — High-level description of the entire project
- **Summaries of each specification file** — Brief description of purpose and scope
- **Contextual information** — When to use each spec (5W1H guidance)
- **Navigation map** — Logical organization showing relationships between specs
- **Execution guidance** — Step values and dependency chains

**Example:**
```markdown
---
name: my-app
version: 1.0.0
description: My App - Detailed Table of Contents (DTOC)
author: Your Name
email: your@email.com
---

# My App - Specification Index (DTOC)

## Project Overview

My App is a full-stack web application built with TypeScript, React, and PostgreSQL, providing user authentication, content management, and real-time collaboration features.

## How to Use This Index

This DTOC follows the **5W1H principle** to help AI and developers understand:
- **What**: Purpose and content of each specification
- **When**: Conditions triggering the use of each spec
- **Where**: Location in project architecture
- **Why**: Problems solved and requirements fulfilled
- **How**: Implementation approach and dependencies
- **Who**: Authorship and maintenance responsibility

## Specification Files

### Setup & Configuration (Execute First - Step 10)

**my-app-setup-database.md**
- **What**: Complete database schema definitions for PostgreSQL 15.4
- **When**: Use during initial project setup and database migrations
- **Where**: Database layer — tables, indexes, foreign keys, constraints
- **Why**: Establishes data structure foundation for the entire application
- **How**: SQL scripts with CREATE TABLE, INDEX, and CONSTRAINT statements
- **Who**: Database architect, backend developers
- **Dependencies**: None (foundation spec)
- **Execution Step**: 10 (runs first)

**my-app-setup-backend.md**
- **What**: Node.js/Express backend configuration and API structure
- **When**: Use after database setup, before implementing features
- **Where**: Backend layer — server, middleware, routes, environment
- **Why**: Provides runtime environment and API framework
- **How**: Express.js configuration with middleware chain and route definitions
- **Who**: Backend developers
- **Dependencies**: my-app-setup-database.md
- **Execution Step**: 20

### Authentication (Step 30)

**my-app-auth-login.md**
- **What**: Email/password authentication flow with JWT tokens
- **When**: Use when implementing user login functionality
- **Where**: Auth module — login endpoint, token generation, session management
- **Why**: Enables secure user authentication and session handling
- **How**: bcrypt password hashing + JWT token generation + session validation
- **Who**: Auth developers, security team
- **Dependencies**: my-app-setup-database.md[users-schema], my-app-setup-backend.md
- **Execution Step**: 30

**my-app-auth-signup.md**
- **What**: User registration with email verification
- **When**: Use when implementing new user account creation
- **Where**: Auth module — signup endpoint, email verification, validation
- **Why**: Allows new users to create accounts with verified emails
- **How**: Input validation + password hashing + email verification workflow
- **Who**: Auth developers
- **Dependencies**: my-app-setup-database.md[users-schema], my-app-auth-login.md
- **Execution Step**: 30

### Content Management (Step 40)

**my-app-posts-create.md**
- **What**: Post creation with rich text editor and media upload
- **When**: Use when authenticated users create new content
- **Where**: Content module — post creation endpoint, media storage, validation
- **Why**: Enables users to publish content with text and multimedia
- **How**: Multipart form handling + S3 upload + database insertion
- **Who**: Content developers
- **Dependencies**: my-app-auth-login.md (requires authentication)
- **Execution Step**: 40

## Execution Order

```
Step 10: Database Setup
    ↓
Step 20: Backend Configuration
    ↓
Step 30: Authentication (login + signup in parallel)
    ↓
Step 40: Content Management
```

## Development Workflow

1. **Initial Setup**: Start with Step 10 specs (database, backend)
2. **Authentication**: Implement Step 30 specs (login, signup)
3. **Feature Development**: Build Step 40+ specs based on requirements
4. **Always check**: Use 5W1H principle to determine which specs are relevant to your current task
```

**Key Points:**
- **DTOC is a decision-making tool** for AI to determine which specs to load
- **5W1H guidance** helps AI understand context and relevance
- **Summaries are not just descriptions** — they include when, why, and how information
- **Relationships and dependencies** are explicitly documented
- **Execution order is clear** through step values and dependency chains

#### `instructions.md` (MANDATORY)

**Purpose:** AI Development Directive — The mandatory guideline document that AI must strictly follow when working with specifications

**What is instructions.md?**

`instructions.md` is **not just documentation**—it is a **directive file** that defines the rules, conventions, and workflows that AI must obey when executing specifications. This file serves as the **AI's operational manual** for the project.

**Why instructions.md is Critical for SED:**

According to SED principles, AI must:
1. **Read `specs/instructions.md` FIRST** before starting any task
2. **Follow the instructions EXACTLY** as written, without interpretation
3. **Apply these rules consistently** throughout development
4. **Report violations** if instructions conflict with specifications

This file transforms AI from a passive code generator into a **compliant development agent** that follows project-specific rules with absolute fidelity.

**Content Requirements:**

**Mandatory Sections:**

1. **SED Compliance Rules** — How to follow Spec-Exact Development principles
2. **Code Style Guidelines** — Formatting, naming, structure requirements
3. **Testing Requirements** — Coverage targets, test types, assertion patterns
4. **Error Handling Standards** — How to handle and report errors
5. **Development Workflow** — Step-by-step process for implementing specs
6. **Quality Checks** — Pre-commit validation, review criteria
7. **Communication Protocol** — How AI should request clarification

**Template:** You can copy `sed-instructions.md` as a starting point

**Example:**
```markdown
# AI Development Instructions

## CRITICAL: Read This First

**Before starting ANY task, you MUST:**

1. Read this entire `instructions.md` file
2. Read `specs/index.md` to understand the project structure (DTOC)
3. Use 5W1H principle to identify relevant specification files
4. Execute specifications with ABSOLUTE OBEDIENCE

## SED Compliance Rules

### Rule 1: Absolute Specification Compliance

- Follow specifications EXACTLY as written, word for word
- The specification is the absolute rule that overrides all other considerations
- Even if the specification appears incorrect, you MUST follow it precisely
- Never deviate from the spec based on your own judgment or "best practices"

### Rule 2: Zero Interpretation and Assumption

- Never interpret or assume anything beyond what is explicitly stated
- Do not perform any task that is not explicitly defined in the specification
- Do not infer intent, fill in gaps, or "improve" the spec with your ideas
- If something is not in the spec, it should NOT be implemented

### Rule 3: Critical Error Reporting

- If you discover severe errors or critical issues in the specification, STOP immediately
- Report the issue clearly: explain what is wrong and why it prevents execution
- Provide specific details about the problematic section
- Wait for developer confirmation or specification update before proceeding
- NEVER perform tasks not in the spec, even when reporting errors

### Rule 4: Request Clarification for Ambiguity

- When specifications are ambiguous, incomplete, or unclear, STOP and ask
- Request clarification from the developer rather than making assumptions
- Provide specific examples of what information is missing
- Do not proceed until you receive clear guidance

## Code Style Guidelines

### TypeScript Requirements

- **Strict Mode**: Always enable TypeScript strict mode
- **No `any` Type**: Avoid using `any` type unless explicitly specified in spec
- **Explicit Return Types**: All functions must have explicit return type annotations
- **Interface Over Type**: Prefer `interface` for object shapes, `type` for unions/intersections

### Naming Conventions

- **camelCase**: Variables, functions, properties
  ```typescript
  const userName = 'John';
  function getUserProfile() { }
  ```

- **PascalCase**: Classes, interfaces, types, enums
  ```typescript
  interface UserProfile { }
  class AuthService { }
  type ApiResponse = { };
  ```

- **UPPER_SNAKE_CASE**: Constants, environment variables
  ```typescript
  const MAX_LOGIN_ATTEMPTS = 5;
  const API_BASE_URL = process.env.API_BASE_URL;
  ```

### File Organization

- One component/service per file
- File name matches export name (e.g., `UserProfile.tsx` exports `UserProfile`)
- Group related files in feature folders

## Testing Requirements

### Coverage Targets

- **Minimum**: 80% coverage (statement, branch, function, line)
- **Target**: 90%+ coverage for critical business logic
- **100% Coverage Required**: Authentication, payment, data validation modules

### Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Initialize test environment
  });

  // Test cases
  it('should handle success case', () => {
    // Arrange, Act, Assert
  });

  it('should handle error case', () => {
    // Test error scenarios
  });

  // Cleanup
  afterEach(() => {
    // Clean up resources
  });
});
```

### Required Test Types

1. **Unit Tests**: Test individual functions in isolation
2. **Integration Tests**: Test interaction between modules
3. **E2E Tests**: Test complete user workflows
4. **Edge Cases**: Test boundary conditions, null/undefined, empty arrays
5. **Error Cases**: Test error handling and recovery

## Error Handling Standards

### Error Hierarchy

```typescript
// Custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends Error { }
class DatabaseError extends Error { }
```

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: string;           // User-friendly message
  code: string;            // Error code (e.g., 'INVALID_EMAIL')
  statusCode: number;      // HTTP status code
  details?: any;           // Additional context (dev only)
}
```

### Error Logging

- **Development**: Log full error stack traces
- **Production**: Log error codes and sanitized messages
- **Never Log**: Passwords, tokens, personal data

## Development Workflow

### 1. Preparation

- [ ] Read `specs/instructions.md` (this file)
- [ ] Read `specs/index.md` (DTOC)
- [ ] Identify relevant specs using 5W1H principle
- [ ] Verify spec score is ≥95

### 2. Implementation

- [ ] Create feature branch: `feature/spec-name`
- [ ] Implement EXACTLY as specified
- [ ] Add comprehensive JSDoc comments
- [ ] Follow code style guidelines

### 3. Testing

- [ ] Write unit tests first (TDD approach)
- [ ] Achieve minimum 80% coverage
- [ ] Test all edge cases and error scenarios
- [ ] Run full test suite: `npm test`

### 4. Quality Checks

- [ ] Run linter: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] Build without errors: `npm run build`
- [ ] Check for TypeScript errors: `npm run type-check`

### 5. Commit and Review

- [ ] Stage changes: `git add .`
- [ ] Commit with descriptive message
- [ ] Push to remote: `git push`
- [ ] Create pull request if required

## Communication Protocol

### When to Ask for Clarification

Ask when you encounter:
- Ambiguous or contradictory specifications
- Missing information required for implementation
- Unclear dependencies or execution order
- Potential security or performance issues

### How to Request Clarification

Use this format:
```
CLARIFICATION NEEDED

Section: [Spec file name and section]
Issue: [Describe the ambiguity or missing information]
Impact: [Explain why this prevents implementation]
Question: [Specific question to resolve the issue]
```

### When to Report Errors

Report when you find:
- Critical security vulnerabilities
- Logic errors that would cause system failure
- Contradictions between specifications
- Impossible requirements (e.g., performance targets that exceed physical limits)

### How to Report Errors

Use this format:
```
CRITICAL ERROR DETECTED

Spec: [File name]
Section: [Specific section]
Error: [Describe the problem]
Impact: [Potential consequences]
Recommendation: [Suggested fix or alternative]
Status: HALTED - Awaiting developer confirmation
```

## Prohibited Practices

### ❌ NEVER Do These:

1. **Modify specs autonomously** — AI cannot change specifications
2. **Implement features not in spec** — No "nice to have" additions
3. **Use deprecated patterns** — Follow modern best practices only if specified
4. **Skip tests** — Testing is mandatory for all code
5. **Ignore errors** — All errors must be handled explicitly
6. **Guess intent** — Ask for clarification instead

### ✅ ALWAYS Do These:

1. **Follow spec exactly** — Zero deviation from specifications
2. **Write tests first** — TDD approach ensures compliance
3. **Document thoroughly** — JSDoc comments for all public APIs
4. **Handle errors properly** — Never let errors propagate silently
5. **Ask when unclear** — Request clarification for ambiguities
6. **Report critical issues** — Stop and report severe problems

## Final Checklist

Before marking any task as complete:

- [ ] Code matches specification 100%
- [ ] All tests pass (≥80% coverage)
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] JSDoc comments added for public APIs
- [ ] Error handling implemented
- [ ] Edge cases tested
- [ ] Code formatted consistently
- [ ] Git commit message is descriptive
- [ ] No console.log or debug code remaining
```

**Key Points:**
- **Instructions are directives, not suggestions** — AI must obey them absolutely
- **Read first, every time** — AI must read instructions before starting any task
- **Project-specific rules** — Each project can define its own workflow and standards
- **SED compliance enforcement** — Instructions reinforce Spec-Exact Development principles
- **Error reporting protocol** — Defines how AI should communicate issues
- **Quality gates** — Establishes clear criteria for acceptable implementation

#### `preview.png` (RECOMMENDED)

**Purpose:** Visual identity for the specification repository

**Format:**
- Square image (width equals height)
- Size: 1024px × 1024px
- Location: `./specs/preview.png`

**Usage:** Spec browsers, catalogs, and repository viewers display this image to help users quickly identify specifications.

---

## Complete Examples

### Example 1: User Authentication Spec

```markdown
---
name: my-app-user-authentication
version: 1.0.0
description: User authentication specification for My App
author: Your Name
email: your@email.com
license: MIT
step: 20
screenshot: https://example.com/screenshots/auth-preview.png
dependencies: my-app/database/specs[users-schema.md], my-app/security/specs[encryption.md#password]
---

## Overview

User authentication system supporting email/password and OAuth 2.0 (Google, Facebook).
Includes session management, password reset, and account lockout after failed attempts.

## Requirements

### Libraries
- bcrypt ^5.1.0 — Password hashing with salt rounds
- jsonwebtoken ^9.0.0 — JWT token generation and verification
- passport ^0.6.0 — Authentication middleware
- passport-google-oauth20 ^2.0.0 — Google OAuth 2.0 strategy

### Environment Variables
```bash
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=24h
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BCRYPT_ROUNDS=12
```

### Installation
```bash
npm install bcrypt jsonwebtoken passport passport-google-oauth20
```

## Workflow

1. User submits credentials via POST `/api/auth/login`
   - Body: `{ email: string, password: string }`
2. Validate input format:
   - Email: RFC 5322 compliant
   - Password: Not empty
3. Query database: `SELECT * FROM users WHERE email = ?`
4. If user not found: Return `401 Unauthorized` with message "Invalid credentials"
5. Check account status:
   - If `locked_until > NOW()`: Return `423 Locked` with message "Account temporarily locked"
6. Compare password using bcrypt:
   - `bcrypt.compare(password, user.password_hash)`
7. If password invalid:
   - Increment `failed_attempts` in database
   - If `failed_attempts >= 5`: Set `locked_until = NOW() + 15 minutes`
   - Return `401 Unauthorized` with message "Invalid credentials"
8. If password valid:
   - Reset `failed_attempts` to 0
   - Update `last_login` to current timestamp
   - Generate JWT token with payload: `{ userId, email, role }`
   - Token expiration: 24 hours
9. Return response:
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "user-uuid",
       "email": "user@example.com",
       "name": "John Doe",
       "role": "user"
     }
   }
   ```

## Details

### Function: `authenticateUser`

**Location:** `/src/services/auth.service.ts`

**Purpose:** Authenticate user credentials and generate session token

**Parameters:**
- `email: string` (required) — User's email address
- `password: string` (required) — Plain text password (minimum 8 characters)

**Return Type:** `Promise<AuthResult>`

**Interface Definitions:**
```typescript
interface AuthResult {
  success: boolean;
  token?: string;
  user?: UserProfile;
  error?: string;
  statusCode?: number;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLogin: Date;
}
```

**Complete Implementation:**
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

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database';

/**
 * Authenticates a user with email and password
 *
 * @param email - User's email address (must be valid format)
 * @param password - Plain text password (will be hashed for comparison)
 * @returns Promise resolving to JWT token and user data
 * @throws {AuthError} When credentials are invalid
 * @throws {DatabaseError} When database connection fails
 * @example
 * const result = await authenticateUser('user@example.com', 'password123');
 * if (result.success) {
 *   console.log('Token:', result.token);
 * }
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResult> {
  // Verify email format before querying database to reduce unnecessary DB calls
  if (!isValidEmail(email)) {
    return {
      success: false,
      error: 'Invalid email format',
      statusCode: 400
    };
  }

  try {
    // Query database for user record
    const user = await db.users.findOne({ email });

    if (!user) {
      // Use generic message to prevent email enumeration attacks
      return {
        success: false,
        error: 'Invalid credentials',
        statusCode: 401
      };
    }

    // Check if account is temporarily locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return {
        success: false,
        error: 'Account temporarily locked. Please try again later.',
        statusCode: 423
      };
    }

    // Use constant-time comparison to prevent timing attacks
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      // Increment failed login attempts
      await incrementFailedAttempts(user.id);

      return {
        success: false,
        error: 'Invalid credentials',
        statusCode: 401
      };
    }

    // Reset failed attempts and update last login timestamp
    await db.users.update(user.id, {
      failedAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date()
    });

    // Generate JWT token with 24-hour expiration
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: new Date()
      },
      statusCode: 200
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Internal server error',
      statusCode: 500
    };
  }
}

/**
 * Validates email format using RFC 5322 regex
 *
 * @param email - Email address to validate
 * @returns True if email is valid, false otherwise
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Increments failed login attempts and locks account if threshold reached
 *
 * @param userId - User ID to update
 */
async function incrementFailedAttempts(userId: string): Promise<void> {
  const user = await db.users.findById(userId);
  const newAttempts = (user.failedAttempts || 0) + 1;

  const updates: any = {
    failedAttempts: newAttempts
  };

  // Lock account for 15 minutes after 5 failed attempts
  if (newAttempts >= 5) {
    updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
  }

  await db.users.update(userId, updates);
}
```

### Error Handling

| Error Type | Condition | HTTP Status | Message |
|------------|-----------|-------------|---------|
| ValidationError | Invalid email format | 400 | "Invalid email format" |
| AuthError | User not found | 401 | "Invalid credentials" |
| AuthError | Wrong password | 401 | "Invalid credentials" |
| AuthError | Account locked | 423 | "Account temporarily locked. Please try again later." |
| DatabaseError | Database failure | 500 | "Internal server error" |

### Testing Requirements

**Unit Tests:**
```typescript
describe('authenticateUser', () => {
  it('should return token for valid credentials', async () => {
    const result = await authenticateUser('user@example.com', 'password123');
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.user?.email).toBe('user@example.com');
  });

  it('should return error for invalid email format', async () => {
    const result = await authenticateUser('invalid-email', 'password123');
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(400);
  });

  it('should return error for non-existent user', async () => {
    const result = await authenticateUser('notfound@example.com', 'password123');
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(401);
  });

  it('should lock account after 5 failed attempts', async () => {
    // Simulate 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      await authenticateUser('user@example.com', 'wrongpassword');
    }

    const result = await authenticateUser('user@example.com', 'password123');
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(423);
  });
});
```

**Coverage Target:** ≥80% (statement, branch, function, line)

### Database Schema

**Table:** `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_locked_until ON users(locked_until) WHERE locked_until IS NOT NULL;
```

### API Endpoint

**Route:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "lastLogin": "2025-01-08T12:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Error Response (423):**
```json
{
  "success": false,
  "error": "Account temporarily locked. Please try again later."
}
```
```

---

### Example 2: Database Schema Spec

```markdown
---
name: forum-database-schema
version: 1.0.0
description: Complete database schema for forum application
author: Your Name
email: your@email.com
license: MIT
step: 10
---

## Overview

PostgreSQL 15.4 database schema for a forum application with users, posts, comments, and categories.
Includes indexes, foreign keys, constraints, and triggers for data integrity.

## Requirements

### Database
- PostgreSQL 15.4 Community Edition
- Extensions: uuid-ossp, pg_trgm (for full-text search)

### Installation
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

## Workflow

1. Create database: `forum_db`
2. Enable required extensions
3. Create tables in order: users → categories → posts → comments
4. Create indexes for performance optimization
5. Add foreign key constraints
6. Create triggers for updated_at timestamps

## Details

### Database Configuration

**Database Name:** `forum_db`
**Character Set:** `UTF8`
**Collation:** `en_US.UTF-8`
**Connection String:** `postgresql://user:password@localhost:5432/forum_db`

### Table: `users`

**Purpose:** Store user account information

**Schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

### Table: `categories`

**Purpose:** Organize forum posts into categories

**Schema:**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7), -- Hex color code (#RRGGBB)
  post_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_display_order ON categories(display_order);
```

### Table: `posts`

**Purpose:** Store forum posts/threads

**Schema:**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) NOT NULL,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  tags VARCHAR(255)[], -- PostgreSQL array for tags
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_last_activity ON posts(last_activity_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags); -- GIN index for array search

-- Full-text search index
CREATE INDEX idx_posts_search ON posts USING GIN(to_tsvector('english', title || ' ' || content));
```

### Table: `comments`

**Purpose:** Store comments on posts

**Schema:**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
```

### Triggers

**Purpose:** Automatically update `updated_at` timestamps

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Sample Data

**Insert test data for development:**

```sql
-- Insert test user
INSERT INTO users (email, username, password_hash, display_name, role, email_verified)
VALUES (
  'admin@example.com',
  'admin',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW3PCuv8jTOu', -- 'password123'
  'Administrator',
  'admin',
  true
);

-- Insert test category
INSERT INTO categories (name, slug, description, color)
VALUES (
  'General Discussion',
  'general',
  'General topics and casual conversation',
  '#6366F1'
);

-- Insert test post
INSERT INTO posts (category_id, author_id, title, content, slug)
SELECT
  c.id,
  u.id,
  'Welcome to the Forum!',
  'This is the first post. Feel free to discuss anything here.',
  'welcome-to-the-forum'
FROM categories c, users u
WHERE c.slug = 'general' AND u.username = 'admin';
```
```

---

## Best Practices

### 1. Completeness Over Brevity

**Bad Example:**
```yaml
description: User auth
```

**Good Example:**
```yaml
description: Complete user authentication system with email/password login, OAuth 2.0 (Google, Facebook), session management, password reset, and account lockout after failed attempts
```

### 2. Explicit Version Numbers

**Bad Example:**
```markdown
### Libraries
- bcrypt
- jsonwebtoken
```

**Good Example:**
```markdown
### Libraries
- bcrypt ^5.1.0 — Password hashing with configurable salt rounds
- jsonwebtoken ^9.0.0 — JWT token generation and verification
```

### 3. Complete Code Examples

**Bad Example:**
```markdown
Create a function to authenticate users
```

**Good Example:**
```typescript
/**
 * Authenticates a user with email and password
 * @param email - User's email address
 * @param password - Plain text password
 * @returns Promise<AuthResult>
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResult> {
  // Complete implementation here...
}
```

### 4. Detailed Error Handling

**Bad Example:**
```markdown
Handle errors appropriately
```

**Good Example:**
```markdown
### Error Handling

| Error Type | HTTP Status | Message | Action |
|------------|-------------|---------|--------|
| ValidationError | 400 | "Invalid email format" | Return immediately |
| AuthError | 401 | "Invalid credentials" | Increment failed attempts |
| DatabaseError | 500 | "Internal server error" | Log error and notify admin |
```

### 5. Specific Test Cases

**Bad Example:**
```markdown
Write tests for the authentication function
```

**Good Example:**
```markdown
### Test Cases

1. **Valid credentials** → Returns token and user profile (200)
2. **Invalid email format** → Returns validation error (400)
3. **Non-existent user** → Returns authentication error (401)
4. **Incorrect password** → Returns authentication error (401)
5. **5 failed attempts** → Locks account for 15 minutes (423)
6. **Database unavailable** → Returns server error (500)

**Coverage Target:** ≥80% (statement, branch, function, line)
```

### 6. User-Facing Text

Specify exact text strings that users will see:

**Bad Example:**
```markdown
Show an error message
```

**Good Example:**
```markdown
### Error Messages

- Invalid email: "Please enter a valid email address."
- Wrong password: "Invalid credentials. Please try again."
- Account locked: "Your account has been temporarily locked due to multiple failed login attempts. Please try again in 15 minutes."
```

### 7. CSS and Styling

Define exact visual specifications:

**Bad Example:**
```markdown
Style the button nicely
```

**Good Example:**
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
```

---

## Summary

SED specification files are complete implementation blueprints that enable AI to execute exactly as defined without interpretation. Every spec must include:

✅ **Complete YAML header** with all required fields
✅ **Standard structure** (Overview, Requirements, Workflow, Details)
✅ **Exhaustive details** — function names, parameters, return types, implementations
✅ **Explicit error handling** — every error case documented
✅ **Complete test cases** — coverage targets and specific scenarios
✅ **User-facing elements** — exact text, styling, and visual specifications
✅ **Dependencies** — clearly defined external spec references

**Remember:** In SED, the specification is not documentation—it is the source of truth that AI executes with absolute fidelity. Every pixel, every word, every function is part of the specification. Nothing is left to interpretation or assumption.

---

For more information about SED methodology, see the [README](README.md).
