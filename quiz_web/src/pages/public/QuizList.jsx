import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import apiClient from '../../lib/apiClient';

export default function QuizList() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['public-quizzes'],
    queryFn: async () => {
      const response = await apiClient.get('/public/quizzes');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-muted p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Quizzes</h1>
          <p className="text-muted">Choose a quiz to test your knowledge</p>
        </div>

        {data?.quizzes?.length === 0 ? (
          <Card>
            <p className="text-center text-muted py-8">No quizzes available at the moment.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.quizzes?.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/q/${quiz.slug}`)}>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h2>
                {quiz.description && (
                  <p className="text-muted text-sm mb-4 line-clamp-2">{quiz.description}</p>
                )}
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>{quiz.question_count} {quiz.question_count === 1 ? 'question' : 'questions'}</span>
                  {quiz.time_limit_seconds && (
                    <span>{Math.floor(quiz.time_limit_seconds / 60)} min</span>
                  )}
                </div>
                <Button className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/q/${quiz.slug}`);
                }}>
                  Start Quiz
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

