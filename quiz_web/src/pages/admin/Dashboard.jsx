import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import apiClient from '../../lib/apiClient';

export default function Dashboard() {
  const [deleteModal, setDeleteModal] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/quizzes');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/quizzes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      showToast('Quiz deleted', 'success');
      setDeleteModal(null);
    },
    onError: (error) => {
      showToast(error.response?.data?.error?.message || 'Delete failed', 'error');
    },
  });

  const copyLink = (slug) => {
    const link = `${window.location.origin}/q/${slug}`;
    navigator.clipboard.writeText(link);
    showToast('Link copied to clipboard', 'success');
  };

  const statusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      published: 'bg-green-500',
      archived: 'bg-yellow-500',
    };
    return (
      <span className={`px-2 py-1 rounded text-white text-xs ${colors[status] || 'bg-gray-500'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background-muted p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <Button onClick={() => navigate('/admin/quizzes/new')}>New Quiz</Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : data?.quizzes?.length === 0 ? (
          <Card>
            <p className="text-center text-muted">No quizzes yet. Create your first quiz!</p>
          </Card>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Card>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Slug</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Updated</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.quizzes?.map((quiz) => (
                      <tr key={quiz.id} className="border-b border-border">
                        <td className="py-3 px-4">{quiz.title}</td>
                        <td className="py-3 px-4 text-muted">{quiz.slug}</td>
                        <td className="py-3 px-4">{statusBadge(quiz.status)}</td>
                        <td className="py-3 px-4 text-muted text-sm">
                          {new Date(quiz.updated_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}>
                              Edit
                            </Button>
                            <Button variant="ghost" onClick={() => copyLink(quiz.slug)}>
                              Copy Public Link
                            </Button>
                            <Button variant="danger" onClick={() => setDeleteModal(quiz)}>
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {data?.quizzes?.map((quiz) => (
                <Card key={quiz.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                    {statusBadge(quiz.status)}
                  </div>
                  <p className="text-sm text-muted mb-4">{quiz.slug}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}>
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => copyLink(quiz.slug)}>
                      Copy Link
                    </Button>
                    <Button variant="danger" onClick={() => setDeleteModal(quiz)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        <Modal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Delete Quiz"
          onConfirm={() => deleteMutation.mutate(deleteModal.id)}
          variant="danger"
          confirmText="Delete"
        >
          <p>Are you sure you want to delete "{deleteModal?.title}"? This action cannot be undone.</p>
        </Modal>
      </div>
    </div>
  );
}

