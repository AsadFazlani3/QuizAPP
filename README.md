# Quiz Management System

A full-stack quiz management application built with Rails API backend and React frontend. This system allows administrators to create and manage quizzes with multiple question types, and enables public users to take quizzes and view their results.

## 🏗️ Architecture

The project consists of two main components:

- **quiz_api**: Rails 8.1.1 API-only backend
- **quiz_web**: React 19.2 + Vite + Tailwind CSS frontend

## ✨ Features

### Admin Features
- **Authentication**: JWT-based admin authentication
- **Quiz Management**: Create, edit, delete, and publish quizzes
- **Question Management**: Support for multiple question types:
  - Single-choice multiple choice (MCQ Single)
  - Multi-choice multiple choice (MCQ Multi)
  - True/False questions
  - Text-based questions
- **Question Ordering**: Position-based question ordering
- **Quiz Publishing**: Draft/Published/Archived status management
- **Time Limits**: Optional time limits for quizzes

### Public Features
- **Quiz Discovery**: Browse available published quizzes
- **Quiz Taking**: Take quizzes with real-time progress tracking
- **Answer Submission**: Submit answers for automatic scoring
- **Results View**: View quiz results with score breakdown
- **Session Management**: Secure attempt tracking

## 🚀 Quick Start

### Prerequisites

- **Backend**:
  - Ruby 3.3.6
  - PostgreSQL
  - Bundler

- **Frontend**:
  - Node.js (v18+)
  - npm or yarn

### Backend Setup

1. Navigate to the API directory:
```bash
cd quiz_api
```

2. Install dependencies:
```bash
bundle install
```

3. Setup database:
```bash
rails db:create
rails db:migrate
rails db:seed
```

4. (Optional) Create `.env` file:
```bash
# JWT_SECRET=your_secret_here
# DATABASE_URL=postgresql://localhost/quiz_api_development
```

5. Start the Rails server:
```bash
rails server
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the web directory:
```bash
cd quiz_web
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔐 Default Credentials

After running `rails db:seed`, you can log in with:

- **Email**: `admin@example.com`
- **Password**: `password123`

## 📚 API Documentation

### Admin Endpoints

#### Authentication
- `POST /api/v1/admin/auth/login` - Admin login
- `POST /api/v1/admin/auth/logout` - Admin logout

#### Quizzes
- `GET /api/v1/admin/quizzes` - List all quizzes (paginated)
- `POST /api/v1/admin/quizzes` - Create a new quiz
- `GET /api/v1/admin/quizzes/:id` - Get quiz details with questions
- `PATCH /api/v1/admin/quizzes/:id` - Update quiz
- `DELETE /api/v1/admin/quizzes/:id` - Delete quiz
- `POST /api/v1/admin/quizzes/:id/publish` - Publish quiz

#### Questions
- `POST /api/v1/admin/quizzes/:quiz_id/questions` - Create question
- `PATCH /api/v1/admin/questions/:id` - Update question
- `DELETE /api/v1/admin/questions/:id` - Delete question

### Public Endpoints

- `GET /api/v1/public/quizzes` - List published quizzes
- `GET /api/v1/public/quizzes/:slug` - Get published quiz (without correct answers)
- `POST /api/v1/public/quizzes/:slug/attempts` - Create quiz attempt
- `POST /api/v1/public/attempts/:attempt_id/submit` - Submit quiz answers

## 🎯 Frontend Routes

### Admin Routes
- `/admin/login` - Admin login page
- `/admin` - Dashboard (list all quizzes)
- `/admin/quizzes/new` - Create new quiz
- `/admin/quizzes/:id/edit` - Edit quiz and manage questions

### Public Routes
- `/quizzes` - List all published quizzes
- `/q/:slug` - Quiz landing page
- `/q/:slug/take` - Take quiz
- `/q/:slug/result/:attemptId` - View quiz results

## 🗄️ Database Schema

- `admin_users` - Admin user accounts
- `quizzes` - Quiz definitions
- `questions` - Quiz questions (supports multiple types)
- `choices` - Question answer choices
- `attempts` - User quiz attempts
- `answers` - User answers to questions
- `answer_choices` - Associations between answers and choices

## 🧪 Testing

### Backend Tests
```bash
cd quiz_api
rspec
```

The backend includes comprehensive RSpec tests for:
- Models
- Controllers
- Services
- Request specs

## 🛠️ Technology Stack

### Backend
- **Framework**: Rails 8.1.1 (API-only)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Serialization**: Blueprinter
- **Pagination**: Kaminari
- **Testing**: RSpec, FactoryBot, Faker
- **CORS**: Rack CORS

### Frontend
- **Framework**: React 19.2
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM 7.11
- **Data Fetching**: TanStack React Query 5.90
- **HTTP Client**: Axios 1.13
- **Linting**: ESLint

## 📁 Project Structure

```
tacnique_assesment/
├── quiz_api/              # Rails API backend
│   ├── app/
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # ActiveRecord models
│   │   ├── services/      # Business logic services
│   │   └── blueprints/    # JSON serializers
│   ├── config/            # Rails configuration
│   ├── db/                # Database migrations and seeds
│   └── spec/              # RSpec tests
│
└── quiz_web/              # React frontend
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components
    │   ├── lib/           # Utilities and API client
    │   └── App.jsx        # Main app component
    └── public/            # Static assets
```

## 🔒 Security Features

- JWT-based authentication for admin routes
- Password hashing with bcrypt
- CORS configuration for API access
- Secure session management for quiz attempts
- Input validation and sanitization

## 📝 Development Notes

- The backend uses Rails API-only mode for lightweight JSON responses
- Frontend uses Tailwind CSS exclusively (no custom CSS files)
- React Query handles caching and data synchronization
- Mobile-first responsive design
- All admin routes are protected by authentication middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is part of a technical assessment.

