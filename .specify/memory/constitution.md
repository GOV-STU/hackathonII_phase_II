<!--
Sync Impact Report - Constitution v1.0.0
========================================
Version Change: Initial creation → 1.0.0
Ratification Date: 2026-01-11

Principles Established:
- I. Spec-Driven Development (NON-NEGOTIABLE)
- II. Client-Server Architecture (NON-NEGOTIABLE)
- III. Frontend Constraints
- IV. Backend Constraints
- V. Database Constraints
- VI. Quality & Reliability Standards

Sections Added:
- Core Principles (6 principles)
- Feature Scope (Phase II Only)
- Explicit Exclusions
- Evolution Readiness
- Governance

Templates Requiring Updates:
✅ plan-template.md - Constitution Check section aligns with principles
✅ spec-template.md - Requirements structure supports constitution constraints
✅ tasks-template.md - Task organization supports phased implementation

Follow-up TODOs: None - all placeholders resolved

Commit Message: docs: establish Phase II constitution v1.0.0 (full-stack todo web app governance)
-->

# Evolution of Todo - Phase II Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

All application code MUST be generated exclusively by Claude Code. Manual writing or editing of implementation code is strictly forbidden. Specifications are the single source of truth.

**Rules:**
- If generated output is incorrect, incomplete, or suboptimal, the specification MUST be refined instead of modifying code directly
- Each generation must be deterministic and reproducible from the specification
- No manual code edits are permitted; all changes flow through spec updates

**Rationale:** Ensures consistency, traceability, and reproducibility. Prevents drift between specification and implementation. Maintains a clear audit trail of all design decisions.

### II. Client-Server Architecture (NON-NEGOTIABLE)

The system MUST follow a strict client-server architecture with complete decoupling between frontend and backend.

**Rules:**
- Frontend and backend MUST be fully decoupled
- All business logic, validation, and data rules MUST reside in the backend
- The frontend MUST act only as a presentation and interaction layer
- Communication between frontend and backend MUST occur exclusively via RESTful HTTP APIs
- No shared code, libraries, or direct database access from frontend

**Rationale:** Enforces separation of concerns, enables independent scaling, simplifies testing, and prepares for future AI integration without frontend changes.

### III. Frontend Constraints

The frontend layer is strictly limited to presentation and user interaction.

**Technology Stack:**
- Framework: Next.js using the App Router
- Language: TypeScript

**Rules:**
- The UI MUST be minimal, functional, and form-based
- The frontend MUST NOT contain business logic or database logic
- Client-side validation MUST be limited to basic form validation only (e.g., required fields, format checks)
- All data validation and business rules MUST be enforced by the backend
- No AI, natural language processing, or automation logic is permitted in the frontend

**Rationale:** Keeps the frontend simple, maintainable, and focused on user experience. Prevents logic duplication and ensures single source of truth for business rules.

### IV. Backend Constraints

The backend owns all business logic, data validation, and API contracts.

**Technology Stack:**
- Framework: FastAPI
- Language: Python
- Data Models: SQLModel

**Rules:**
- The backend MUST expose RESTful endpoints only
- API behavior MUST be deterministic and stateless
- All input validation MUST occur at the backend boundary
- No GraphQL, WebSockets, background workers, or message queues are allowed
- All business logic and data transformations MUST be implemented in the backend

**Rationale:** Maintains API simplicity, ensures predictable behavior, and establishes clear contracts for future AI agent integration.

### V. Database Constraints

Persistent storage is mandatory with schema-first design.

**Technology Stack:**
- Database: Neon Serverless PostgreSQL

**Rules:**
- Persistent storage is mandatory for all application data
- Schema-first design MUST be followed (define schema before implementation)
- Database connection details MUST be managed via environment variables
- The database schema MUST support future AI-driven interactions without modification
- No in-memory-only storage or file-based databases are permitted

**Rationale:** Ensures data durability, enables proper data modeling, and prepares for AI agent access patterns in Phase III.

### VI. Quality & Reliability Standards

All code must meet production-grade quality standards.

**Rules:**
- API responses MUST use clear and consistent HTTP status codes (200, 201, 400, 404, 500, etc.)
- Error handling MUST be explicit and predictable with structured error responses
- Input validation MUST be enforced at the backend boundary with clear error messages
- Generated code MUST be readable, modular, and production-oriented
- All endpoints MUST handle edge cases and invalid inputs gracefully

**Rationale:** Ensures system reliability, simplifies debugging, and provides clear feedback to clients and future AI agents.

## Feature Scope (Phase II Only)

The following features define the complete scope for Phase II implementation:

**Core CRUD Operations:**
- Create, read, update, and delete Todo items
- Toggle task completion status

**Task Organization:**
- Assign priority levels (high, medium, low)
- Assign tags or categories to tasks

**Task Discovery:**
- Search tasks by text (title, description)
- Filter tasks by status (completed, pending)
- Filter tasks by priority level
- Sort tasks by priority, title, or creation time

**Data Model Requirements:**
- Each Todo item MUST have: id, title, description, status, priority, tags, created_at, updated_at
- Status values: pending, completed
- Priority values: high, medium, low

## Explicit Exclusions

The following are explicitly OUT OF SCOPE for Phase II:

**AI & Automation:**
- No AI agents, chatbots, or language models
- No natural language input or interpretation
- No automated task generation or suggestions

**Infrastructure & Deployment:**
- No Kubernetes, Docker, or container orchestration
- No event-driven architecture, Kafka, or Dapr
- No service mesh or microservices patterns

**Advanced Features:**
- No voice input or multimedia features
- No real-time collaboration or WebSocket connections
- No background job processing or scheduled tasks
- No user authentication or multi-tenancy (single-user system)

**Rationale:** Maintains focus on core functionality and clean architecture. Deferred features will be addressed in Phase III with AI integration.

## Evolution Readiness

Phase II establishes the foundation for Phase III AI integration.

**Forward Compatibility Requirements:**
- The system design MUST remain extensible for AI agent integration in Phase III
- Data models and API contracts MUST remain stable across phases
- Database schema MUST accommodate future AI-driven task creation and updates
- API endpoints MUST be designed to support both human and AI clients
- No breaking changes to core entities (Todo structure) are permitted in future phases

**Rationale:** Ensures smooth transition to AI-enhanced capabilities without requiring system rewrites or data migrations.

## Governance

This constitution supersedes all other development practices and guidelines for the Evolution of Todo project Phase II.

**Amendment Process:**
- All amendments require documentation of rationale and impact analysis
- Version number MUST be incremented according to semantic versioning:
  - MAJOR: Backward incompatible governance or principle removals/redefinitions
  - MINOR: New principles added or materially expanded guidance
  - PATCH: Clarifications, wording fixes, non-semantic refinements
- Amendments MUST include a migration plan if existing code is affected
- All amendments MUST be approved before implementation begins

**Compliance:**
- All pull requests and code reviews MUST verify compliance with this constitution
- Any complexity or deviation MUST be explicitly justified in the implementation plan
- Constitution violations require either: (a) spec refinement to comply, or (b) formal amendment with justification

**Runtime Guidance:**
- See `CLAUDE.md` for agent-specific development guidance and execution workflows
- Constitution principles take precedence over runtime guidance in case of conflict

**Version**: 1.0.0 | **Ratified**: 2026-01-11 | **Last Amended**: 2026-01-11
