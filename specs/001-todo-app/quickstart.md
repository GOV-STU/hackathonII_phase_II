# Quickstart Guide: Full-Stack Todo Web Application

**Feature**: 001-todo-app
**Date**: 2026-01-11
**Phase**: Phase 1 - Development Setup Guide

## Overview

This guide provides step-by-step instructions for setting up and running the Todo application locally. The application consists of a FastAPI backend and a Next.js frontend, connected to a Neon Serverless PostgreSQL database.

## Prerequisites

### Required Software

- **Python 3.11+**: [Download](https://www.python.org/downloads/)
- **Node.js 18+**: [Download](https://nodejs.org/)
- **Git**: [Download](https://git-scm.com/)
- **Code Editor**: VS Code, PyCharm, or similar

### Required Accounts

- **Neon Account**: Sign up at [neon.tech](https://neon.tech) for PostgreSQL database

### Verify Installations

```bash
# Check Python version
python --version  # Should be 3.11 or higher

# Check Node.js version
node --version  # Should be 18 or higher

# Check npm version
npm --version

# Check Git version
git --version
```

## Database Setup

### 1. Create Neon Database

1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign in or create an account
3. Click "Create Project"
4. Name your project: "todo-app-phase2"
5. Select region closest to you
6. Click "Create Project"

### 2. Get Connection String

1. In your Neon project dashboard, click "Connection Details"
2. Copy the connection string (it looks like: `postgresql://user:password@host/database`)
3. Save this for the backend configuration

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy example file
cp .env.example .env
```

Edit `.env` and add your Neon connection string:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Environment
ENVIRONMENT=development

# Logging
LOG_LEVEL=INFO

# CORS (for frontend)
CORS_ORIGINS=http://localhost:3000
```

### 5. Initialize Database

```bash
# Run database migrations
alembic upgrade head

# Verify database connection
python -c "from src.database import engine; print('Database connected!')"
```

### 6. Run Backend Server

```bash
# Start the FastAPI server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at:
- **API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc

### 7. Verify Backend

Open http://localhost:8000/docs in your browser. You should see the interactive API documentation.

Test the health endpoint:
```bash
curl http://localhost:8000/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-11T12:00:00Z"
}
```

## Frontend Setup

### 1. Navigate to Frontend Directory

Open a **new terminal** (keep backend running) and navigate to frontend:

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
# Copy example file
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4. Run Frontend Server

```bash
npm run dev
```

The frontend will be available at:
- **Application**: http://localhost:3000

### 5. Verify Frontend

Open http://localhost:3000 in your browser. You should see the Todo application interface.

## Testing the Application

### Create a Todo

1. Open http://localhost:3000
2. Enter a title: "Test Todo"
3. Optionally add description, priority, and tags
4. Click "Create"
5. The todo should appear in the list

### Update a Todo

1. Click "Edit" on a todo item
2. Modify the title or other fields
3. Click "Save"
4. Changes should be reflected immediately

### Toggle Completion

1. Click the checkbox next to a todo item
2. The todo should be marked as completed (visual change)
3. Click again to mark as pending

### Search and Filter

1. Type in the search box to filter by text
2. Use the status filter to show only pending or completed todos
3. Use the priority filter to show only high, medium, or low priority todos
4. Use the sort dropdown to reorder by priority, title, or creation time

### Delete a Todo

1. Click "Delete" on a todo item
2. Confirm the deletion
3. The todo should be removed from the list

## Development Workflow

### Backend Development

**Run tests**:
```bash
cd backend
pytest
```

**Run with auto-reload** (already enabled with `--reload` flag):
```bash
uvicorn src.main:app --reload
```

**Check code formatting**:
```bash
black src/
```

**Type checking**:
```bash
mypy src/
```

### Frontend Development

**Run tests**:
```bash
cd frontend
npm test
```

**Run with auto-reload** (already enabled with `npm run dev`):
```bash
npm run dev
```

**Lint code**:
```bash
npm run lint
```

**Format code**:
```bash
npm run format
```

**Build for production**:
```bash
npm run build
```

## Troubleshooting

### Backend Issues

**Database connection fails**:
- Verify DATABASE_URL in `.env` is correct
- Check Neon dashboard to ensure database is active
- Verify network connectivity

**Port 8000 already in use**:
```bash
# Find process using port 8000
# On Windows:
netstat -ano | findstr :8000
# On macOS/Linux:
lsof -i :8000

# Kill the process or use a different port
uvicorn src.main:app --reload --port 8001
```

**Import errors**:
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**Port 3000 already in use**:
- Next.js will automatically try port 3001, 3002, etc.
- Or manually specify: `npm run dev -- -p 3001`

**API connection fails**:
- Verify backend is running on http://localhost:8000
- Check NEXT_PUBLIC_API_URL in `.env.local`
- Check browser console for CORS errors

**Module not found errors**:
- Delete `node_modules/` and `.next/`
- Reinstall: `npm install`

### Database Issues

**Migration fails**:
```bash
# Reset database (WARNING: deletes all data)
alembic downgrade base
alembic upgrade head
```

**Connection pool exhausted**:
- Restart backend server
- Check for unclosed database connections in code

## API Endpoints Reference

### Health Check
- `GET /api/v1/health` - Check API health

### Todos
- `GET /api/v1/todos` - List all todos (with optional filters)
- `POST /api/v1/todos` - Create a new todo
- `GET /api/v1/todos/{id}` - Get a specific todo
- `PUT /api/v1/todos/{id}` - Update a todo
- `DELETE /api/v1/todos/{id}` - Delete a todo
- `POST /api/v1/todos/{id}/toggle` - Toggle completion status

### Query Parameters (for GET /api/v1/todos)
- `status`: Filter by status (pending, completed)
- `priority`: Filter by priority (high, medium, low)
- `search`: Search text in title and description
- `tag`: Filter by tag (can specify multiple times)
- `sort_by`: Sort field (priority, title, created_at)
- `sort_order`: Sort order (asc, desc)

## Next Steps

1. **Explore the API**: Visit http://localhost:8000/docs to interact with the API
2. **Create sample data**: Add several todos with different priorities and tags
3. **Test all features**: Try search, filter, sort, and CRUD operations
4. **Review the code**: Explore `backend/src/` and `frontend/src/` directories
5. **Run tests**: Execute `pytest` (backend) and `npm test` (frontend)

## Development Tips

### Backend Tips

- Use FastAPI's automatic documentation at `/docs` for API testing
- Enable debug logging: Set `LOG_LEVEL=DEBUG` in `.env`
- Use `pytest -v` for verbose test output
- Use `pytest --cov` to check test coverage

### Frontend Tips

- Use React DevTools browser extension for debugging
- Check Network tab in browser DevTools for API calls
- Use `console.log()` for debugging (remove before commit)
- Use TypeScript strict mode for better type safety

### Database Tips

- Use Neon dashboard to view database contents
- Use `psql` or a GUI tool (pgAdmin, DBeaver) to query the database
- Keep migrations versioned and tested
- Back up database before major changes

## Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **SQLModel Documentation**: https://sqlmodel.tiangolo.com/
- **Neon Documentation**: https://neon.tech/docs
- **OpenAPI Specification**: See `specs/001-todo-app/contracts/api.openapi.yaml`

## Support

For issues or questions:
1. Check this quickstart guide
2. Review the specification: `specs/001-todo-app/spec.md`
3. Review the implementation plan: `specs/001-todo-app/plan.md`
4. Check the data model: `specs/001-todo-app/data-model.md`
5. Review the API contract: `specs/001-todo-app/contracts/api.openapi.yaml`
