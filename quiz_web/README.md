# Quiz Web - Frontend

React 19.2 + Vite + Tailwind CSS frontend for the Quiz Management System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your API base URL (default: http://localhost:3000)

4. Start development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Routes

### Admin Routes
- `/admin/login` - Admin login page
- `/admin` - Dashboard (list quizzes)
- `/admin/quizzes/new` - Create new quiz
- `/admin/quizzes/:id/edit` - Edit quiz and manage questions

### Public Routes
- `/q/:slug` - Quiz landing page
- `/q/:slug/take` - Take quiz
- `/q/:slug/result/:attemptId` - View quiz results

## Features

- Mobile-first responsive design
- Tailwind CSS styling (no custom CSS)
- React Query for data fetching
- React Router for navigation
- JWT authentication for admin routes
