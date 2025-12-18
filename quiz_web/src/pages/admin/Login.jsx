import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import apiClient from '../../lib/apiClient';
import { auth } from '../../lib/auth';
import { useToast } from '../../components/ui/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/admin/auth/login', { email, password });
      auth.setToken(response.data.token);
      auth.setAdmin(response.data.admin);
      navigate('/admin');
    } catch (error) {
      showToast(error.response?.data?.error?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-muted p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}

