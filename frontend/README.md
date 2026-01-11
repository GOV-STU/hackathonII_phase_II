# Todo App Frontend

Next.js frontend for the Phase II Todo Web Application.

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local if needed (default points to http://localhost:8000/api/v1)
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Features

- Create, view, update, and delete todo items
- Mark todos as complete or pending
- Assign priority levels (high, medium, low)
- Add tags to organize todos
- Search todos by text
- Filter by status and priority
- Sort by priority, title, or creation time

## Development

Run tests:
```bash
npm test
```

Lint code:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/services/` - API client services
- `src/types/` - TypeScript type definitions
- `tests/` - Component tests
