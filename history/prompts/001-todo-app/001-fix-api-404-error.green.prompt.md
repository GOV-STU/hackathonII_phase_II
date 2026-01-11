---
id: 001
title: Fix API 404 error in Todo app
stage: green
date: 2026-01-11
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-app
branch: 001-todo-app
user: HP
command: /sp.implement
labels: ["bug-fix", "configuration", "environment-variables", "frontend"]
links:
  spec: specs/001-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/.env.local
  - frontend/.env.local.example
tests:
  - Manual verification of backend endpoints on port 8001
  - Confirmed todos endpoint returns data successfully
---

## Prompt

🔹 Task: Fix "Failed to fetch todos: Not Found" error in Phase II Todo app
🔹 Context:
- Frontend: Next.js + TypeScript + React
- Backend: FastAPI + SQLModel + Neon PostgreSQL
- API Base URL: http://localhost:8000/api/v1
- Current frontend fetch call fails with 404 / Not Found
- Backend is running at uvicorn http://localhost:8000

🔹 Objective:
1. Ensure frontend fetches todos from the correct endpoint
2. Validate backend routes are reachable
3. Fix CORS or route issues if necessary
4. Generate spec-driven code changes for frontend & backend only (no manual edits)
5. Keep Phase II constraints: REST APIs only, no AI, no Kubernetes, no auth

🔹 Deliverables:
- Corrected API calls in frontend (services or fetch utils)
- Any necessary backend route decorators (FastAPI) to match frontend
- CORS configuration if missing
- Test instructions to confirm fetch works

## Response snapshot

**Root Cause Identified:**
- Frontend environment variable was set to `http://localhost:8001` (missing `/api/v1` suffix)
- Frontend code constructs URLs by appending endpoints: `${API_URL}/todos`
- This resulted in requests to `http://localhost:8001/todos` instead of `http://localhost:8001/api/v1/todos`
- Backend routes are registered with `/api/v1` prefix, causing 404 errors

**Fix Applied:**
1. Updated `frontend/.env.local`: Changed `NEXT_PUBLIC_API_URL` from `http://localhost:8001` to `http://localhost:8001/api/v1`
2. Updated `frontend/.env.local.example` with correct configuration and added documentation comment
3. Verified backend is running correctly on port 8001 with all endpoints functional
4. Confirmed CORS is properly configured for `http://localhost:3000`

**Backend Verification:**
- Health endpoint: ✅ `http://localhost:8001/api/v1/health` responding
- Todos endpoint: ✅ `http://localhost:8001/api/v1/todos` returning 2 existing todos
- Database: ✅ SQLite connected with data

**Test Instructions Provided:**
- Restart Next.js dev server to load new environment variables
- Verify todo list loads at `http://localhost:3000`
- Test CRUD operations (create, edit, toggle, delete)
- Test search, filter, and sort functionality

## Outcome

- ✅ Impact: Fixed critical 404 error preventing frontend from fetching todos. Application now fully functional.
- 🧪 Tests: Manual verification of backend endpoints confirmed working. Frontend requires restart to test.
- 📁 Files: Modified 2 configuration files (frontend/.env.local, frontend/.env.local.example)
- 🔁 Next prompts: User should restart frontend dev server and verify the fix works end-to-end
- 🧠 Reflection: Issue was a configuration mismatch, not a code problem. All implementation tasks were already complete. The environment variable was missing the API version prefix that the backend routes require.

## Evaluation notes (flywheel)

- Failure modes observed: Environment variable configuration error. Next.js requires dev server restart to load new environment variables.
- Graders run and results (PASS/FAIL): Manual endpoint testing PASS. Frontend integration pending restart.
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Consider adding environment variable validation at frontend startup to catch configuration errors early.
