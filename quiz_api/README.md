# Quiz API - Backend

Rails 8.1.1 API-only backend for the Quiz Management System.

## Prerequisites

- Ruby 3.3.6
- PostgreSQL
- Bundler

## Setup

1. Install dependencies:
```bash
bundle install
```

2. Setup database:
```bash
rails db:create
rails db:migrate
rails db:seed
```

3. Create `.env` file (optional, uses defaults in development):
```bash
# JWT_SECRET=your_secret_here
# DATABASE_URL=postgresql://localhost/quiz_api_development
```

4. Start server:
```bash
rails server
```

The API will be available at http://localhost:3000

## Seed Admin Credentials

- Email: `admin@example.com`
- Password: `password123`

## API Endpoints

### Admin Authentication
- `POST /api/v1/admin/auth/login` - Login
- `POST /api/v1/admin/auth/logout` - Logout

### Admin Quizzes
- `GET /api/v1/admin/quizzes` - List quizzes (paginated)
- `POST /api/v1/admin/quizzes` - Create quiz
- `GET /api/v1/admin/quizzes/:id` - Get quiz with questions
- `PATCH /api/v1/admin/quizzes/:id` - Update quiz
- `DELETE /api/v1/admin/quizzes/:id` - Delete quiz
- `POST /api/v1/admin/quizzes/:id/publish` - Publish quiz

### Admin Questions
- `POST /api/v1/admin/quizzes/:quiz_id/questions` - Create question
- `PATCH /api/v1/admin/questions/:id` - Update question
- `DELETE /api/v1/admin/questions/:id` - Delete question

### Public Quizzes
- `GET /api/v1/public/quizzes/:slug` - Get published quiz (no correct answers)

### Public Attempts
- `POST /api/v1/public/quizzes/:slug/attempts` - Create attempt
- `POST /api/v1/public/attempts/:attempt_id/submit` - Submit quiz answers

## Running Tests

```bash
rspec
```

## Database Schema

- `admin_users` - Admin users
- `quizzes` - Quizzes
- `questions` - Questions (mcq_single, mcq_multi, true_false, text)
- `choices` - Question choices
- `attempts` - Quiz attempts
- `answers` - User answers
- `answer_choices` - Answer-choice associations
