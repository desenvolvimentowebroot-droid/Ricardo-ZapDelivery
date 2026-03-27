import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Settings, Phone, Lock, ArrowLeft } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSettings = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadSettings();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      Authorization: `Bearer ${token}`
    };
  };

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setWhatsappNumber(response.data.whatsapp_number);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    }
  };

  const handleUpdateWhatsapp = async (e) => {
    e.preventDefault();
    
    if (!whatsappNumber || whatsappNumber.length < 10) {
      toast.error('Digite um número válido (com DDD e código do país)');
      return;
    }

    setLoadingWhatsapp(true);
    try {
      await axios.put(
        `${API}/admin/settings`,
        { whatsapp_number: whatsappNumber },
        { headers: getAuthHeaders() }
      );
      toast.success('Número do WhatsApp atualizado com sucesso!');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Sessão expirada');
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } else {
        toast.error('Erro ao atualizar WhatsApp');
      }
    } finally {
      setLoadingWhatsapp(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoadingPassword(true);
    try {
      await axios.post(
        `${API}/admin/change-password`,
        {
          current_password: currentPassword,
          new_password: newPassword
        },
        { headers: getAuthHeaders() }
      );
      
      toast.success('Senha alterada! Faça login novamente.');
      
      // Logout after 2 seconds
      setTimeout(() => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      }, 2000);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Senha atual incorreta');
      } else if (error.response?.status === 401) {
        toast.error('Sessão expirada');
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } else {
        toast.error('Erro ao alterar senha');
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="noise-overlay" />

      {/* Header */}
      <header className="glass-header border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/admin/dashboard')}
              variant="outline"
              size="icon"
              className="bg-[#121212] border-white/10 hover:bg-[#1A1A1A]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <span className="bebas text-2xl tracking-tight block">Configurações</span>
              <span className="text-xs text-[#A3A3A3]">Ricardo ZapDelivery</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* WhatsApp Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212] border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#25D366]/10 p-3 rounded-xl">
                <Phone className="h-6 w-6 text-[#25D366]" />
              </div>
              <div>
                <h2 className="bebas text-2xl tracking-tight">Número do WhatsApp</h2>
                <p className="text-sm text-[#A3A3A3]">
                  Pedidos dos clientes serão enviados para este número
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateWhatsapp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Número com código do país e DDD
                </label>
                <Input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="5512988043993"
                  className="bg-[#1A1A1A] border-white/10"
                  data-testid="whatsapp-input"
                />
                <p className="text-xs text-[#A3A3A3] mt-2">
                  Exemplo: 5512988043993 (55 = Brasil, 12 = DDD, resto = número)
                </p>
              </div>

              <Button
                type="submit"
                disabled={loadingWhatsapp}
                className="bg-[#25D366] hover:bg-[#1FAD53] text-white"
                data-testid="save-whatsapp-button"
              >
                {loadingWhatsapp ? 'Salvando...' : 'Salvar Número'}
              </Button>
            </form>
          </motion.div>

          {/* Password Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#121212] border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#FF4500]/10 p-3 rounded-xl">
                <Lock className="h-6 w-6 text-[#FF4500]" />
              </div>
              <div>
                <h2 className="bebas text-2xl tracking-tight">Alterar Senha</h2>
                <p className="text-sm text-[#A3A3A3]">
                  Troque a senha de acesso ao painel administrativo
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Senha Atual</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="bg-[#1A1A1A] border-white/10"
                  data-testid="current-password-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nova Senha</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="bg-[#1A1A1A] border-white/10"
                  data-testid="new-password-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirmar Nova Senha</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a nova senha novamente"
                  className="bg-[#1A1A1A] border-white/10"
                  data-testid="confirm-password-input"
                  required
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                <p className="text-sm text-yellow-500">
                  ⚠️ Após alterar a senha, você será desconectado e precisará fazer login novamente.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loadingPassword}
                className="bg-[#FF4500] hover:bg-[#E03C00]"
                data-testid="change-password-button"
              >
                {loadingPassword ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
