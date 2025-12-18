import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import apiClient from '../../lib/apiClient';

export default function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimitSeconds, setTimeLimitSeconds] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/admin/quizzes', {
        title,
        description,
        time_limit_seconds: timeLimitSeconds ? parseInt(timeLimitSeconds) : null,
      });
      navigate(`/admin/quizzes/${response.data.id}/edit`);
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Failed to create quiz', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-muted p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            ← Back to Dashboard
          </Button>
        </div>
        <Card>
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Create Quiz</h1>
          <form onSubmit={handleSubmit}>
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <Input
              label="Time Limit (seconds)"
              type="number"
              value={timeLimitSeconds}
              onChange={(e) => setTimeLimitSeconds(e.target.value)}
              helper="Leave empty for no time limit"
            />
            <div className="flex gap-2">
              <Button type="submit" loading={loading}>
                Save Quiz
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/admin')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

