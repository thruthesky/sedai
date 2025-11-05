---
name: test-project-example
version: 1.0.0
description: Example specification for testing SEDAI CLI
author: Test User
email: test@example.com
license: MIT
---

## Overview

This is a test specification file for validating SEDAI CLI functionality.

## Requirements

- Node.js ≥20.0.0
- TypeScript 5.x

## Workflow

1. Initialize project
2. Write specifications
3. Validate specifications
4. Calculate spec score
5. Begin development

## Details

### Database Schema

- Users table with id, email, password_hash
- Posts table with id, user_id, title, content
- Comments table with id, post_id, user_id, content

### API Endpoints

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/posts
- POST /api/posts
- GET /api/posts/:id
- POST /api/posts/:id/comments

### Testing

- Unit tests with Vitest
- E2E tests with Playwright
- Coverage target: 80%
