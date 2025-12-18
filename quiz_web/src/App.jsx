import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToastContainer from './components/ui/Toast';
import { auth } from './lib/auth';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import CreateQuiz from './pages/admin/CreateQuiz';
import EditQuiz from './pages/admin/EditQuiz';

// Public pages
import QuizList from './pages/public/QuizList';
import QuizLanding from './pages/public/QuizLanding';
import TakeQuiz from './pages/public/TakeQuiz';
import QuizResult from './pages/public/QuizResult';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function AppContent() {
  return (
    <>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes/new"
          element={
            <ProtectedRoute>
              <CreateQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes/:id/edit"
          element={
            <ProtectedRoute>
              <EditQuiz />
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/q/:slug" element={<QuizLanding />} />
        <Route path="/q/:slug/take" element={<TakeQuiz />} />
        <Route path="/q/:slug/result/:attemptId" element={<QuizResult />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/quizzes" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
