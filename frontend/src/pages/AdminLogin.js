import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_URL = 'https://static.prod-images.emergentagent.com/jobs/24fe9bf0-ff71-4d55-a047-9b199488b204/images/5122189d90748987590e6af7ebeb136d28430af64ac43d92a38b0fb3cade986d.png';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/login`, {
        username,
        password
      });

      localStorage.setItem('admin_token', response.data.access_token);
      toast.success('Login realizado com sucesso!');
      navigate('/admin/dashboard');
    } catch (error) {
      const errorMsg = 'Credenciais inválidas. Verifique seu usuário e senha.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="noise-overlay" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#121212] border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col items-center mb-8">
            <img src={LOGO_URL} alt="Logo" className="h-16 w-16 mb-4" />
            <h1 className="bebas text-4xl tracking-tight">Admin Panel</h1>
            <p className="text-[#A3A3A3] text-sm mt-2">Ricardo ZapDelivery</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm" data-testid="login-error">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Usuário</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="bg-[#1A1A1A] border-white/10"
                data-testid="username-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#1A1A1A] border-white/10"
                data-testid="password-input"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4500] hover:bg-[#E03C00] rounded-full py-6 text-lg font-bold"
              data-testid="login-button"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#A3A3A3]">
            <p>Credenciais padrão:</p>
            <p className="font-mono">admin / admin123</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-[#A3A3A3] hover:text-white transition-colors"
          >
            ← Voltar para o site
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;