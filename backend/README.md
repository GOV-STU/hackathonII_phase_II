# Todo App Backend

FastAPI backend for the Phase II Todo Web Application.

## Prerequisites

- Python 3.11 or higher
- Neon Serverless PostgreSQL account

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your Neon PostgreSQL connection string
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the development server:
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc

## API Endpoints

- `GET /api/v1/health` - Health check
- `GET /api/v1/todos` - List all todos
- `POST /api/v1/todos` - Create a new todo
- `GET /api/v1/todos/{id}` - Get a specific todo
- `PUT /api/v1/todos/{id}` - Update a todo
- `DELETE /api/v1/todos/{id}` - Delete a todo
- `POST /api/v1/todos/{id}/toggle` - Toggle completion status

## Development

Run tests:
```bash
pytest
```

Check code formatting:
```bash
black src/
```

Type checking:
```bash
mypy src/
```
