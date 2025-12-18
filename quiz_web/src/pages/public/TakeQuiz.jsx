import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Checkbox from '../../components/ui/Checkbox';
import { useToast } from '../../components/ui/Toast';
import apiClient from '../../lib/apiClient';

export default function TakeQuiz() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['public-quiz', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/public/quizzes/${slug}`);
      return response.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data) => {
      const attemptId = sessionStorage.getItem('attempt_id');
      return apiClient.post(`/public/attempts/${attemptId}/submit`, data);
    },
    onSuccess: (response) => {
      const attemptId = sessionStorage.getItem('attempt_id');
      navigate(`/q/${slug}/result/${attemptId}`, { state: response.data });
    },
    onError: (error) => {
      showToast(error.response?.data?.error?.message || 'Submit failed', 'error');
    },
  });

  const updateAnswer = (questionId, questionType, value) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      if (questionType === 'text') {
        updated[questionId] = { answer_text: value };
      } else {
        updated[questionId] = { choice_ids: Array.isArray(value) ? value : [value] };
      }
      return updated;
    });
    // Clear error for this question
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleSubmit = () => {
    // Validate required questions
    const newErrors = {};
    quiz.questions.forEach((q) => {
      if (q.required && !answers[q.id]) {
        newErrors[q.id] = 'This question is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please answer all required questions', 'error');
      return;
    }

    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: parseInt(questionId),
      ...answer,
    }));

    const publicSessionId = sessionStorage.getItem('public_session_id');
    submitMutation.mutate({
      public_session_id: publicSessionId,
      answers: answersArray,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-muted">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-muted p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-6 text-gray-900">{quiz.title}</h1>

          <div className="space-y-6">
            {quiz.questions?.map((question) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                value={answers[question.id]}
                onChange={(value) => updateAnswer(question.id, question.question_type, value)}
                error={errors[question.id]}
              />
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Button onClick={handleSubmit} loading={submitMutation.isPending} className="w-full">
              Submit Quiz
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuestionRenderer({ question, value, onChange, error }) {
  const renderQuestion = () => {
    switch (question.question_type) {
      case 'mcq_single':
      case 'true_false':
        return (
          <div className="space-y-2">
            {question.choices?.map((choice) => (
              <label
                key={choice.id}
                className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-background-muted"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={value?.choice_ids?.includes(choice.id) || false}
                  onChange={() => onChange(choice.id)}
                  className="mr-3"
                />
                <span>{choice.text}</span>
              </label>
            ))}
          </div>
        );

      case 'mcq_multi':
        return (
          <div className="space-y-2">
            {question.choices?.map((choice) => (
              <label
                key={choice.id}
                className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-background-muted"
              >
                <input
                  type="checkbox"
                  checked={value?.choice_ids?.includes(choice.id) || false}
                  onChange={(e) => {
                    const currentIds = value?.choice_ids || [];
                    if (e.target.checked) {
                      onChange([...currentIds, choice.id]);
                    } else {
                      onChange(currentIds.filter((id) => id !== choice.id));
                    }
                  }}
                  className="mr-3"
                />
                <span>{choice.text}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={value?.answer_text || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
            rows={4}
            placeholder="Type your answer here..."
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${error ? 'border-danger' : 'border-border'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{question.prompt}</h3>
        {question.required && <span className="text-danger text-sm">Required</span>}
      </div>
      {renderQuestion()}
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}

