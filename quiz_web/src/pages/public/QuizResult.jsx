import { useParams, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';

export default function QuizResult() {
  const { slug, attemptId } = useParams();
  const location = useLocation();
  const resultData = location.state;

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-muted">
        <Card>
          <p className="text-center text-danger">Result data not found</p>
        </Card>
      </div>
    );
  }

  const { score, max_score, results } = resultData;
  const percentage = max_score > 0 ? Math.round((score / max_score) * 100) : 0;

  return (
    <div className="min-h-screen bg-background-muted p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Quiz Results</h1>

          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-primary mb-2">
              {score} / {max_score}
            </div>
            <div className="text-xl text-muted">{percentage}%</div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Question Results</h2>
            {results?.map((result, index) => (
              <div
                key={result.question_id}
                className={`p-4 border rounded-lg ${
                  result.correct === true
                    ? 'border-green-500 bg-green-50'
                    : result.correct === false
                    ? 'border-danger bg-red-50'
                    : 'border-border'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">Question {index + 1}</span>
                  {result.correct === true && (
                    <span className="text-green-600 font-semibold">✓ Correct</span>
                  )}
                  {result.correct === false && (
                    <span className="text-danger font-semibold">✗ Incorrect</span>
                  )}
                  {result.correct === null && (
                    <span className="text-muted font-semibold">Not Graded</span>
                  )}
                </div>

                {result.correct !== null && (
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Your answer:</strong>{' '}
                      {result.your_choice_ids?.length > 0
                        ? `Choice IDs: ${result.your_choice_ids.join(', ')}`
                        : result.answer_text || 'No answer'}
                    </p>
                    {result.correct_choice_ids && (
                      <p>
                        <strong>Correct answer:</strong> Choice IDs: {result.correct_choice_ids.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {result.note && <p className="text-sm text-muted mt-2">{result.note}</p>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

