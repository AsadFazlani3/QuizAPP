import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import apiClient from '../../lib/apiClient';

const QUESTION_TYPES = [
  { value: 'mcq_single', label: 'MCQ Single' },
  { value: 'mcq_multi', label: 'MCQ Multi' },
  { value: 'true_false', label: 'True/False' },
  { value: 'text', label: 'Text' },
];

export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [deleteModal, setDeleteModal] = useState(null);
  const [publishError, setPublishError] = useState('');

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/quizzes/${id}`);
      return response.data;
    },
  });

  const updateQuizMutation = useMutation({
    mutationFn: (data) => apiClient.patch(`/admin/quizzes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', id] });
      showToast('Settings saved', 'success');
    },
    onError: (error) => {
      showToast(error.response?.data?.error?.message || 'Update failed', 'error');
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => apiClient.post(`/admin/quizzes/${id}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', id] });
      showToast('Quiz published', 'success');
      setPublishError('');
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Publish failed';
      setPublishError(message);
      showToast(message, 'error');
    },
  });

  const [quizSettings, setQuizSettings] = useState({
    title: '',
    description: '',
    time_limit_seconds: '',
  });

  useEffect(() => {
    if (quiz) {
      setQuizSettings({
        title: quiz.title || '',
        description: quiz.description || '',
        time_limit_seconds: quiz.time_limit_seconds || '',
      });
    }
  }, [quiz]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateQuizMutation.mutate({
      title: quizSettings.title,
      description: quizSettings.description,
      time_limit_seconds: quizSettings.time_limit_seconds ? parseInt(quizSettings.time_limit_seconds) : null,
    });
  };

  return (
    <div className="min-h-screen bg-background-muted p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            ← Back to Dashboard
          </Button>
        </div>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quiz Settings */}
            <div className="lg:col-span-1">
              <Card title="Quiz Settings">
                <form onSubmit={handleSaveSettings}>
                  <Input
                    label="Title"
                    value={quizSettings.title}
                    onChange={(e) => setQuizSettings({ ...quizSettings, title: e.target.value })}
                    required
                  />
                  <Textarea
                    label="Description"
                    value={quizSettings.description}
                    onChange={(e) => setQuizSettings({ ...quizSettings, description: e.target.value })}
                    rows={4}
                  />
                  <Input
                    label="Time Limit (seconds)"
                    type="number"
                    value={quizSettings.time_limit_seconds}
                    onChange={(e) => setQuizSettings({ ...quizSettings, time_limit_seconds: e.target.value })}
                  />
                  <Button type="submit" loading={updateQuizMutation.isPending} className="w-full">
                    Save Settings
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button
                    variant="primary"
                    onClick={() => publishMutation.mutate()}
                    loading={publishMutation.isPending}
                    className="w-full"
                  >
                    Publish Quiz
                  </Button>
                  {publishError && (
                    <p className="mt-2 text-sm text-danger">{publishError}</p>
                  )}
                  {quiz?.status === 'published' && (
                    <p className="mt-2 text-sm text-green-600">✓ Published</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Questions Builder */}
            <div className="lg:col-span-2">
              <QuestionsBuilder quizId={id} questions={quiz?.questions || []} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionsBuilder({ quizId, questions: initialQuestions }) {
  const [questions, setQuestions] = useState([]);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    // Merge fetched questions with local unsaved questions
    setQuestions(prev => {
      const fetchedQuestions = initialQuestions.map(q => ({ ...q, temp_id: null }));
      const unsavedQuestions = prev.filter(q => q.temp_id);
      
      // Create a map of saved questions by ID
      const savedQuestionsMap = new Map(fetchedQuestions.map(q => [q.id, q]));
      
      // Merge: keep unsaved questions, update saved ones from fetch
      const merged = [
        ...fetchedQuestions,
        ...unsavedQuestions.filter(q => !savedQuestionsMap.has(q.id))
      ].sort((a, b) => (a.position || 0) - (b.position || 0));
      
      return merged;
    });
  }, [initialQuestions]);

  const createQuestionMutation = useMutation({
    mutationFn: ({ data, tempId }) => {
      return apiClient.post(`/admin/quizzes/${quizId}/questions`, data).then(response => {
        // Attach tempId to response for cleanup
        return { response, tempId };
      });
    },
    onSuccess: ({ response, tempId }) => {
      // Remove the temp question from local state before refetch
      if (tempId) {
        setQuestions(prev => prev.filter(q => q.temp_id !== tempId));
      }
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      showToast('Question created', 'success');
    },
    onError: (error) => {
      showToast(error.response?.data?.error?.message || 'Failed to create question', 'error');
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(`/admin/questions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      showToast('Question updated', 'success');
    },
    onError: (error) => {
      showToast(error.response?.data?.error?.message || 'Failed to update question', 'error');
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      showToast('Question deleted', 'success');
      setDeleteModal(null);
    },
    onError: (error) => {
      showToast(error.response?.data?.error?.message || 'Failed to delete question', 'error');
    },
  });

  const addQuestion = () => {
    const tempId = `tmp-${Date.now()}`;
    const newQuestion = {
      temp_id: tempId,
      question_type: 'mcq_single',
      prompt: '',
      points: 1,
      required: true,
      position: questions.length + 1,
      choices: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, updates) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const saveQuestion = async (question, index) => {
    if (question.temp_id) {
      // Create new
      const payload = {
        question_type: question.question_type,
        prompt: question.prompt,
        points: question.points,
        required: question.required,
        position: question.position,
        choices: question.choices?.map((c, i) => ({
          text: c.text,
          is_correct: c.is_correct || false,
          position: i + 1,
        })) || [],
      };
      createQuestionMutation.mutate({
        data: payload,
        tempId: question.temp_id
      });
    } else {
      // Update existing
      const existingChoices = question.choices || [];
      const payload = {
        prompt: question.prompt,
        points: question.points,
        required: question.required,
        position: question.position,
        question_type: question.question_type,
        choices: existingChoices.map((c) => ({
          id: c.id,
          text: c.text,
          is_correct: c.is_correct || false,
          position: c.position,
        })),
        deleted_choice_ids: [],
      };
      updateQuestionMutation.mutate({ id: question.id, data: payload });
    }
  };

  const deleteQuestion = (question) => {
    if (question.temp_id) {
      setQuestions(questions.filter(q => q.temp_id !== question.temp_id));
    } else {
      deleteQuestionMutation.mutate(question.id);
    }
  };

  const moveQuestion = async (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === questions.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    updated[index].position = index + 1;
    updated[newIndex].position = newIndex + 1;
    setQuestions(updated);

    // Update positions on server
    if (!updated[index].temp_id) {
      updateQuestionMutation.mutate({
        id: updated[index].id,
        data: { position: updated[index].position },
      });
    }
    if (!updated[newIndex].temp_id) {
      updateQuestionMutation.mutate({
        id: updated[newIndex].id,
        data: { position: updated[newIndex].position },
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
        <Button onClick={addQuestion}>Add Question</Button>
      </div>

      {questions.length === 0 ? (
        <Card>
          <p className="text-center text-muted">No questions yet. Add your first question!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id || question.temp_id}
              question={question}
              index={index}
              onUpdate={(updates) => updateQuestion(index, updates)}
              onSave={() => saveQuestion(question, index)}
              onDelete={() => setDeleteModal(question)}
              onMoveUp={() => moveQuestion(index, 'up')}
              onMoveDown={() => moveQuestion(index, 'down')}
              isFirst={index === 0}
              isLast={index === questions.length - 1}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Question"
        onConfirm={() => deleteQuestion(deleteModal)}
        variant="danger"
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this question?</p>
      </Modal>
    </div>
  );
}

function QuestionCard({ question, index, onUpdate, onSave, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [localQuestion, setLocalQuestion] = useState(question);

  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const updateLocal = (updates) => {
    const updated = { ...localQuestion, ...updates };
    setLocalQuestion(updated);
    onUpdate(updates);
  };

  const addChoice = () => {
    const choices = localQuestion.choices || [];
    updateLocal({
      choices: [...choices, { text: '', is_correct: false, position: choices.length + 1 }],
    });
  };

  const updateChoice = (choiceIndex, updates) => {
    const choices = [...(localQuestion.choices || [])];
    choices[choiceIndex] = { ...choices[choiceIndex], ...updates };
    updateLocal({ choices });
  };

  const removeChoice = (choiceIndex) => {
    const choices = localQuestion.choices || [];
    updateLocal({ choices: choices.filter((_, i) => i !== choiceIndex) });
  };

  const isUnsaved = !!localQuestion.temp_id;
  const showChoices = ['mcq_single', 'mcq_multi', 'true_false'].includes(localQuestion.question_type);

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900">Question {index + 1}</h3>
          <div className="flex gap-1">
            <Button variant="ghost" onClick={onMoveUp} disabled={isFirst}>↑</Button>
            <Button variant="ghost" onClick={onMoveDown} disabled={isLast}>↓</Button>
            <Button variant="danger" onClick={onDelete}>Delete</Button>
          </div>
        </div>

        <Textarea
          label="Prompt"
          value={localQuestion.prompt || ''}
          onChange={(e) => updateLocal({ prompt: e.target.value })}
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Question Type"
            value={localQuestion.question_type}
            onChange={(e) => {
              const newType = e.target.value;
              updateLocal({
                question_type: newType,
                choices: newType === 'text' ? [] : localQuestion.choices,
              });
            }}
            options={QUESTION_TYPES}
          />
          <Input
            label="Points"
            type="number"
            value={localQuestion.points || 1}
            onChange={(e) => updateLocal({ points: parseInt(e.target.value) || 1 })}
          />
          <div className="flex items-end">
            <Checkbox
              label="Required"
              checked={localQuestion.required !== false}
              onChange={(e) => updateLocal({ required: e.target.checked })}
            />
          </div>
        </div>

        {showChoices && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Choices</label>
              <Button variant="ghost" onClick={addChoice}>Add Choice</Button>
            </div>
            <div className="space-y-2">
              {(localQuestion.choices || []).map((choice, choiceIndex) => (
                <div key={choiceIndex} className="flex gap-2 items-start">
                  <input
                    type={localQuestion.question_type === 'mcq_multi' ? 'checkbox' : 'radio'}
                    name={`question-${index}-correct`}
                    checked={choice.is_correct || false}
                    onChange={(e) => {
                      if (localQuestion.question_type === 'mcq_single' || localQuestion.question_type === 'true_false') {
                        // Only one correct for single/multi
                        const choices = (localQuestion.choices || []).map((c, i) => ({
                          ...c,
                          is_correct: i === choiceIndex ? e.target.checked : false,
                        }));
                        updateLocal({ choices });
                      } else {
                        updateChoice(choiceIndex, { is_correct: e.target.checked });
                      }
                    }}
                    className="mt-2"
                  />
                  <input
                    type="text"
                    value={choice.text || ''}
                    onChange={(e) => updateChoice(choiceIndex, { text: e.target.value })}
                    placeholder="Choice text"
                    className="flex-1 px-3 py-2 border border-border rounded-lg"
                  />
                  <Button variant="ghost" onClick={() => removeChoice(choiceIndex)}>×</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={onSave} variant="primary">
          {isUnsaved ? 'Save Question' : 'Update'}
        </Button>
      </div>
    </Card>
  );
}

