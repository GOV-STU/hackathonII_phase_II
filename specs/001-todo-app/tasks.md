---

description: "Task list for Full-Stack Todo Web Application implementation"
---

# Tasks: Full-Stack Todo Web Application

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/` at repository root
- **Frontend**: `frontend/src/`, `frontend/tests/` at repository root
- Paths shown below follow web application structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure (backend/src/models/, backend/src/services/, backend/src/api/, backend/tests/)
- [x] T002 Create frontend directory structure (frontend/src/app/, frontend/src/components/, frontend/src/services/, frontend/src/types/, frontend/tests/)
- [x] T003 [P] Initialize Python project with requirements.txt in backend/ (FastAPI, SQLModel, Pydantic, asyncpg, uvicorn, python-dotenv, alembic)
- [x] T004 [P] Initialize Node.js project with package.json in frontend/ (Next.js 14+, React 18+, TypeScript 5.x)
- [x] T005 [P] Create backend/.env.example with DATABASE_URL, ENVIRONMENT, LOG_LEVEL, CORS_ORIGINS placeholders
- [x] T006 [P] Create frontend/.env.local.example with NEXT_PUBLIC_API_URL placeholder
- [x] T007 [P] Create backend/README.md with setup instructions
- [x] T008 [P] Create frontend/README.md with setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create backend/src/config.py with environment variable loading and configuration class
- [x] T010 Create backend/src/database.py with SQLModel engine, session management, and connection pooling for Neon PostgreSQL
- [x] T011 Create backend/src/main.py with FastAPI app initialization, CORS middleware, and error handlers
- [x] T012 [P] Create backend/src/api/__init__.py as empty file for package initialization
- [x] T013 [P] Create backend/src/api/health.py with GET /api/v1/health endpoint returning status and timestamp
- [x] T014 [P] Create frontend/src/app/layout.tsx with root HTML structure and metadata
- [x] T015 [P] Create frontend/src/app/globals.css with minimal base styles
- [x] T016 [P] Create frontend/tsconfig.json with TypeScript compiler options for Next.js
- [x] T017 [P] Create frontend/next.config.js with Next.js configuration
- [x] T018 Create database migration script using Alembic in backend/alembic/ for todos table with indexes

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Task Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to create, view, update, delete, and complete todo items

**Independent Test**: Create a todo item, view it in the list, edit its details, mark it complete, and delete it. This delivers a complete task management experience without any additional features.

### Backend Implementation for User Story 1

- [x] T019 [P] [US1] Create backend/src/models/__init__.py as empty file for package initialization
- [x] T020 [P] [US1] Create backend/src/models/todo.py with TodoStatus enum, TodoPriority enum, TodoBase, Todo, TodoCreate, TodoUpdate, TodoRead SQLModel classes
- [x] T021 [US1] Create backend/src/services/__init__.py as empty file for package initialization
- [x] T022 [US1] Create backend/src/services/todo_service.py with create_todo, get_todos, get_todo_by_id, update_todo, delete_todo, toggle_todo_status functions
- [x] T023 [US1] Create backend/src/api/todos.py with POST /api/v1/todos endpoint (create todo)
- [x] T024 [US1] Add GET /api/v1/todos endpoint to backend/src/api/todos.py (list all todos, basic version without filters)
- [x] T025 [US1] Add GET /api/v1/todos/{todo_id} endpoint to backend/src/api/todos.py (get single todo)
- [x] T026 [US1] Add PUT /api/v1/todos/{todo_id} endpoint to backend/src/api/todos.py (update todo)
- [x] T027 [US1] Add DELETE /api/v1/todos/{todo_id} endpoint to backend/src/api/todos.py (delete todo)
- [x] T028 [US1] Add POST /api/v1/todos/{todo_id}/toggle endpoint to backend/src/api/todos.py (toggle completion status)
- [x] T029 [US1] Register todos router in backend/src/main.py with /api/v1 prefix

### Frontend Implementation for User Story 1

- [x] T030 [P] [US1] Create frontend/src/types/todo.ts with TodoStatus enum, TodoPriority enum, Todo, TodoCreate, TodoUpdate TypeScript interfaces
- [x] T031 [US1] Create frontend/src/services/todoApi.ts with HTTP client functions: fetchTodos, createTodo, getTodo, updateTodo, deleteTodo, toggleTodoStatus
- [x] T032 [P] [US1] Create frontend/src/components/TodoItem.tsx displaying todo title, status, priority, tags with edit, delete, and toggle buttons
- [x] T033 [P] [US1] Create frontend/src/components/TodoForm.tsx with form for creating/editing todos (title, description, priority, tags inputs)
- [x] T034 [US1] Create frontend/src/components/TodoList.tsx displaying array of TodoItem components with loading and error states
- [x] T035 [US1] Create frontend/src/app/page.tsx integrating TodoList and TodoForm with state management for CRUD operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can create, view, edit, delete, and complete todos.

---

## Phase 4: User Story 2 - Task Organization (Priority: P2)

**Goal**: Enable users to assign priorities and tags to organize and categorize tasks

**Independent Test**: Create todos with different priority levels (high, medium, low) and assign multiple tags to tasks. This delivers organizational capabilities that enhance the basic task manager.

**Note**: Priority and tags are already included in the Todo model from User Story 1. This phase focuses on enhancing the UI to make these features more prominent and user-friendly.

### Frontend Enhancements for User Story 2

- [x] T036 [P] [US2] Enhance frontend/src/components/TodoForm.tsx to add prominent priority selector dropdown (high, medium, low)
- [x] T037 [P] [US2] Enhance frontend/src/components/TodoForm.tsx to add tags input field with add/remove tag functionality
- [x] T038 [P] [US2] Enhance frontend/src/components/TodoItem.tsx to display priority with visual indicators (colors or icons)
- [x] T039 [P] [US2] Enhance frontend/src/components/TodoItem.tsx to display tags as badges or chips
- [x] T040 [US2] Update frontend/src/app/page.tsx to ensure priority defaults to "medium" when creating new todos

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can organize tasks with priorities and tags.

---

## Phase 5: User Story 3 - Task Discovery (Priority: P3)

**Goal**: Enable users to search, filter, and sort todos to quickly find and focus on specific tasks

**Independent Test**: Create multiple todos with different attributes, then use search to find specific text, filters to show only high-priority or completed tasks, and sorting to reorder by priority or title. This delivers advanced discovery capabilities.

### Backend Enhancements for User Story 3

- [x] T041 [US3] Enhance GET /api/v1/todos endpoint in backend/src/api/todos.py to add query parameters: status, priority, search, tag, sort_by, sort_order
- [x] T042 [US3] Enhance backend/src/services/todo_service.py get_todos function to implement filtering by status and priority
- [x] T043 [US3] Enhance backend/src/services/todo_service.py get_todos function to implement full-text search on title and description
- [x] T044 [US3] Enhance backend/src/services/todo_service.py get_todos function to implement filtering by tags
- [x] T045 [US3] Enhance backend/src/services/todo_service.py get_todos function to implement sorting by priority, title, or created_at

### Frontend Implementation for User Story 3

- [x] T046 [P] [US3] Create frontend/src/components/SearchBar.tsx with text input for search with debouncing
- [x] T047 [P] [US3] Create frontend/src/components/FilterControls.tsx with dropdowns for status and priority filters
- [x] T048 [P] [US3] Create frontend/src/components/SortControls.tsx with dropdown for sort field and order
- [x] T049 [US3] Update frontend/src/services/todoApi.ts fetchTodos function to accept query parameters for search, filter, and sort
- [x] T050 [US3] Update frontend/src/app/page.tsx to integrate SearchBar, FilterControls, and SortControls with state management
- [x] T051 [US3] Update frontend/src/app/page.tsx to pass query parameters to fetchTodos and update list dynamically

**Checkpoint**: All user stories should now be independently functional. Users can search, filter, and sort their todo list.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T052 [P] Add comprehensive error handling to all backend endpoints in backend/src/api/todos.py with consistent error response format
- [x] T053 [P] Add input validation error messages to frontend/src/components/TodoForm.tsx for title length, description length, tags count
- [x] T054 [P] Add loading spinners and error states to frontend/src/components/TodoList.tsx
- [x] T055 [P] Add confirmation dialog for delete action in frontend/src/components/TodoItem.tsx
- [x] T056 [P] Add toast notifications for success/error feedback in frontend/src/app/page.tsx
- [x] T057 Verify all endpoints match OpenAPI specification in specs/001-todo-app/contracts/api.openapi.yaml
- [x] T058 Validate quickstart.md instructions by following setup steps in specs/001-todo-app/quickstart.md
- [x] T059 [P] Add logging to backend/src/services/todo_service.py for debugging
- [x] T060 [P] Optimize frontend bundle size by checking Next.js build output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but US1 already includes priority/tags in model
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 list endpoint but independently testable

### Within Each User Story

- Backend models before services
- Services before API endpoints
- API endpoints before frontend API client
- Frontend types before components
- Components before page integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003-T008)
- All Foundational tasks marked [P] can run in parallel within Phase 2 (T012-T017)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within User Story 1: T019-T020 (models), T030 (types), T032-T033 (components) can run in parallel
- Within User Story 2: T036-T039 (all frontend enhancements) can run in parallel
- Within User Story 3: T046-T048 (all new components) can run in parallel
- All Polish tasks marked [P] can run in parallel (T052-T056, T059-T060)

---

## Parallel Example: User Story 1

```bash
# Launch backend models and frontend types together:
Task: "Create backend/src/models/todo.py with SQLModel classes"
Task: "Create frontend/src/types/todo.ts with TypeScript interfaces"

# Launch frontend components together (after types are done):
Task: "Create frontend/src/components/TodoItem.tsx"
Task: "Create frontend/src/components/TodoForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (T019-T035)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T019-T035) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (T036-T040) → Test independently → Deploy/Demo
4. Add User Story 3 (T041-T051) → Test independently → Deploy/Demo
5. Add Polish (T052-T060) → Final validation → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T019-T035)
   - Developer B: User Story 2 (T036-T040) - can start immediately since model already has priority/tags
   - Developer C: User Story 3 backend (T041-T045)
   - Developer D: User Story 3 frontend (T046-T051)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests are NOT included as they were not requested in the specification
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 60
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 10 tasks (BLOCKING)
- Phase 3 (User Story 1 - P1): 17 tasks (MVP)
- Phase 4 (User Story 2 - P2): 5 tasks
- Phase 5 (User Story 3 - P3): 11 tasks
- Phase 6 (Polish): 9 tasks

**Parallel Opportunities**: 28 tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:
- US1: Create, view, edit, delete, complete todos
- US2: Assign priorities and tags to todos
- US3: Search, filter, and sort todos

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1) = 35 tasks
