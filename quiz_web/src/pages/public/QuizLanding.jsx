import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import apiClient from '../../lib/apiClient';

export default function QuizLanding() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['public-quiz', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/public/quizzes/${slug}`);
      return response.data;
    },
  });

  const createAttemptMutation = useMutation({
    mutationFn: () => apiClient.post(`/public/quizzes/${slug}/attempts`),
    onSuccess: (response) => {
      const { attempt_id, public_session_id } = response.data;
      sessionStorage.setItem('attempt_id', attempt_id);
      sessionStorage.setItem('public_session_id', public_session_id);
      navigate(`/q/${slug}/take`);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-muted">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-muted">
        <Card>
          <p className="text-center text-danger">Quiz not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-muted p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/quizzes')}>
            ← Back to All Quizzes
          </Button>
        </div>
        <Card>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-muted mb-6">{quiz.description}</p>
          )}
          
          <div className="space-y-2 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Questions:</strong> {quiz.questions?.length || 0}
            </p>
            {quiz.time_limit_seconds && (
              <p className="text-sm text-gray-700">
                <strong>Time Limit:</strong> {Math.floor(quiz.time_limit_seconds / 60)} minutes
              </p>
            )}
          </div>

          <Button
            onClick={() => createAttemptMutation.mutate()}
            loading={createAttemptMutation.isPending}
            className="w-full"
          >
            Start Quiz
          </Button>
        </Card>
      </div>
    </div>
  );
}

