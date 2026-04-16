<!--
Sync Impact Report
===================
Version change: [TEMPLATE] → 1.0.0
Modified principles: N/A (initial constitution)
Added sections:
  - Core Principles (5): Clean Code, Source Code Organization,
    Next.js Best Practices, OWASP Secure Coding, Testing & Quality
  - Security Requirements (OWASP detail)
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check compatible)
  - .specify/templates/spec-template.md ✅ (requirements align)
  - .specify/templates/tasks-template.md ✅ (security hardening phase present)
Follow-up TODOs: None
-->

# Expense Tracker Constitution

## Core Principles

### I. Clean Code

All code MUST be readable, concise, and self-documenting.

- Functions and variables MUST have descriptive, intention-revealing names
- Functions MUST do one thing and do it well (Single Responsibility)
- DRY (Don't Repeat Yourself): extract shared logic only when
  duplication is real and proven, not speculative
- KISS (Keep It Simple): prefer the simplest solution that meets
  requirements; avoid premature abstraction
- YAGNI (You Aren't Gonna Need It): do not build features or
  abstractions for hypothetical future requirements
- Files MUST NOT exceed 300 lines; functions MUST NOT exceed 50 lines;
  extract when these limits are exceeded
- No dead code, no commented-out code in production branches
- TypeScript strict mode MUST be enabled; `any` type is prohibited
  except at system boundaries with explicit justification

### II. Source Code Organization

The project MUST follow a clear, predictable folder structure.

- Use Next.js App Router directory conventions (`app/`, `components/`,
  `lib/`, `types/`, `hooks/`, `services/`, `utils/`)
- Co-locate related files: component + styles + tests in the same
  directory when practical
- Separate concerns: UI components MUST NOT contain business logic;
  business logic lives in `lib/` or `services/`
- Shared types MUST reside in `types/` directory
- Custom hooks MUST reside in `hooks/` directory
- Utility functions MUST reside in `utils/` directory
- Environment-specific configuration MUST be centralized in a single
  config module, never scattered across files
- Import paths MUST use path aliases (e.g., `@/components/`) instead
  of relative paths deeper than one level

### III. Next.js Best Practices

All development MUST follow current Next.js 16 and React 19 patterns.

- Default to Server Components; use `"use client"` directive only when
  client interactivity is required (event handlers, hooks, browser APIs)
- Use the App Router exclusively; Pages Router patterns are prohibited
- Data fetching MUST use Server Components with `async/await` or
  React 19 `use()` where appropriate
- Route handlers (`route.ts`) MUST validate request input and return
  proper HTTP status codes
- Leverage Next.js built-in optimizations: `next/image` for images,
  `next/font` for fonts, `next/link` for navigation
- Metadata MUST be defined using the Metadata API (`generateMetadata`
  or static `metadata` export)
- Loading and error states MUST be handled via `loading.tsx` and
  `error.tsx` boundary files
- IMPORTANT: Read the relevant guide in
  `node_modules/next/dist/docs/` before writing any code that touches
  Next.js APIs; heed deprecation notices

### IV. OWASP Secure Coding Practices

All code MUST comply with OWASP secure coding standards.

- **Input Validation**: All user input MUST be validated and sanitized
  on the server side; never trust client-side validation alone
- **Output Encoding**: All dynamic content rendered in HTML MUST be
  properly encoded to prevent XSS; use React's built-in escaping and
  avoid `dangerouslySetInnerHTML`
- **Authentication & Session Management**: Sessions MUST use secure,
  HttpOnly, SameSite cookies; tokens MUST have expiration; credentials
  MUST never be stored in client-side storage
- **Access Control**: Every API route and server action MUST verify
  authorization before processing; deny by default
- **Error Handling**: Error messages MUST NOT expose internal system
  details, stack traces, or database structure to end users
- **Data Protection**: Sensitive data MUST be encrypted at rest and in
  transit; secrets MUST use environment variables, never hardcoded
- **Dependency Security**: Dependencies MUST be regularly audited;
  `npm audit` MUST pass with zero critical/high vulnerabilities
- **CSRF Protection**: All state-changing operations MUST be protected
  against CSRF attacks
- **SQL Injection / NoSQL Injection**: All database queries MUST use
  parameterized queries or ORM methods; raw query strings are prohibited

### V. Testing & Quality Assurance

Code quality MUST be verified through automated checks.

- ESLint MUST pass with zero errors before code is committed
- TypeScript compilation MUST succeed with zero errors
- All shared utility functions and service modules MUST have unit tests
- Critical user flows MUST have integration or end-to-end tests
- Test files MUST be co-located with source or in a parallel `__tests__/`
  directory
- Tests MUST be deterministic: no reliance on external services, timing,
  or shared mutable state without explicit isolation

## Security Requirements

Detailed OWASP compliance requirements for this project:

- **Content Security Policy (CSP)**: MUST be configured via Next.js
  middleware or headers to restrict script sources
- **HTTP Security Headers**: MUST include `Strict-Transport-Security`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
- **Rate Limiting**: API routes handling authentication or sensitive
  operations MUST implement rate limiting
- **Logging & Monitoring**: Security-relevant events (login attempts,
  authorization failures, input validation failures) MUST be logged
  without including sensitive data in log entries
- **File Upload**: If implemented, file uploads MUST validate file type,
  size, and content; store files outside the web root
- **Environment Variables**: `.env` files MUST be listed in `.gitignore`;
  production secrets MUST NOT exist in the repository

## Development Workflow

Standards for the development process:

- **Branch Strategy**: Feature branches MUST follow the naming convention
  defined in the project's Git configuration
- **Commit Messages**: MUST be descriptive and follow conventional commit
  format (e.g., `feat:`, `fix:`, `docs:`, `refactor:`)
- **Code Review**: All changes MUST be reviewed before merging to the
  main branch
- **Linting & Formatting**: Code MUST be formatted consistently using
  the project's ESLint and Prettier/Tailwind configuration
- **No Secrets in Code**: Commits MUST NOT contain API keys, passwords,
  tokens, or other credentials; use pre-commit hooks to detect secrets
- **Incremental Delivery**: Features MUST be delivered in small,
  independently testable increments aligned with user stories

## Governance

This constitution is the authoritative source of development standards
for the Expense Tracker project. All code contributions, reviews, and
architectural decisions MUST comply with these principles.

- **Precedence**: This constitution supersedes informal conventions and
  individual preferences
- **Amendment Process**: Amendments require documented justification,
  team review, and version increment before taking effect
- **Versioning**: Constitution versions follow Semantic Versioning —
  MAJOR for principle removals/redefinitions, MINOR for new principles
  or material expansions, PATCH for clarifications and wording fixes
- **Compliance Review**: All pull requests MUST be verified against
  these principles; reviewers MUST flag violations before approval
- **Complexity Justification**: Any deviation from these principles
  MUST be documented with rationale and approved during code review
- **Runtime Guidance**: Use CLAUDE.md and AGENTS.md for runtime
  development guidance and agent-specific instructions

**Version**: 1.0.0 | **Ratified**: 2026-04-16 | **Last Amended**: 2026-04-16
