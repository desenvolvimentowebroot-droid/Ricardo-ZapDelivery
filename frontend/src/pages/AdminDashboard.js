import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, LogOut, Package, TrendingUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOGO_URL = 'https://static.prod-images.emergentagent.com/jobs/24fe9bf0-ff71-4d55-a047-9b199488b204/images/5122189d90748987590e6af7ebeb136d28430af64ac43d92a38b0fb3cade986d.png';

const categories = [
  { id: 'hamburgueres', label: 'Hambúrgueres' },
  { id: 'acompanhamentos', label: 'Acompanhamentos' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'sobremesas', label: 'Sobremesas' }
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total_products: 0, by_category: {} });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('todos');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'hamburgueres',
    image_url: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadProducts();
    loadStats();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      Authorization: `Bearer ${token}`
    };
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/products`, {
        headers: getAuthHeaders()
      });
      setProducts(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Sessão expirada');
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } else {
        toast.error('Erro ao carregar produtos');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`, {
        headers: getAuthHeaders()
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.info('Logout realizado');
    navigate('/admin/login');
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        image_url: product.image_url
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'hamburgueres',
        image_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      if (editingProduct) {
        await axios.put(
          `${API}/admin/products/${editingProduct.id}`,
          productData,
          { headers: getAuthHeaders() }
        );
        toast.success('Produto atualizado!');
      } else {
        await axios.post(
          `${API}/admin/products`,
          productData,
          { headers: getAuthHeaders() }
        );
        toast.success('Produto criado!');
      }
      setIsModalOpen(false);
      loadProducts();
      loadStats();
    } catch (error) {
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await axios.delete(`${API}/admin/products/${productId}`, {
        headers: getAuthHeaders()
      });
      toast.success('Produto excluído!');
      loadProducts();
      loadStats();
    } catch (error) {
      toast.error('Erro ao excluir produto');
    }
  };

  const filteredProducts = filterCategory === 'todos'
    ? products
    : products.filter(p => p.category === filterCategory);

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="noise-overlay" />

      {/* Header */}
      <header className="glass-header border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Logo" className="h-12 w-12" />
            <div>
              <span className="bebas text-2xl tracking-tight block">Painel Admin</span>
              <span className="text-xs text-[#A3A3A3]">Ricardo ZapDelivery</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-[#121212] border-white/10 hover:bg-[#1A1A1A]"
            >
              Ver Site
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="icon"
              className="bg-[#121212] border-white/10 hover:bg-[#1A1A1A]"
              data-testid="logout-button"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212] border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-[#FF4500]" />
              <div>
                <p className="text-[#A3A3A3] text-sm">Total</p>
                <p className="bebas text-3xl">{stats.total_products}</p>
              </div>
            </div>
          </motion.div>

          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#121212] border border-white/10 rounded-2xl p-6"
            >
              <p className="text-[#A3A3A3] text-sm mb-1">{cat.label}</p>
              <p className="bebas text-3xl">{stats.by_category[cat.id] || 0}</p>
            </motion.div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setFilterCategory('todos')}
              className={`category-pill px-6 py-2.5 rounded-full whitespace-nowrap font-medium text-sm ${
                filterCategory === 'todos' ? 'active text-white' : 'text-[#A3A3A3]'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`category-pill px-6 py-2.5 rounded-full whitespace-nowrap font-medium text-sm ${
                  filterCategory === cat.id ? 'active text-white' : 'text-[#A3A3A3]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <Button
            onClick={() => openModal()}
            className="bg-[#FF4500] hover:bg-[#E03C00] rounded-full flex items-center gap-2"
            data-testid="add-product-button"
          >
            <Plus className="h-5 w-5" />
            Novo Produto
          </Button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF4500] border-r-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#121212] border border-white/10 rounded-3xl overflow-hidden group"
                data-testid={`admin-product-${product.id}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-[#A3A3A3] mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-xl font-bold text-[#FF4500] mb-3">R$ {product.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openModal(product)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/10 hover:bg-[#1A1A1A]"
                      data-testid={`edit-product-${product.id}`}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                      data-testid={`delete-product-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20 text-[#A3A3A3]">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#050505] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="bebas text-3xl tracking-tight">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Formulário para {editingProduct ? 'editar' : 'criar'} produto
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Produto</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Classic Burger"
                className="bg-[#121212] border-white/10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do produto"
                className="bg-[#121212] border-white/10 resize-none"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="28.90"
                  className="bg-[#121212] border-white/10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-sm"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL da Imagem</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="bg-[#121212] border-white/10"
                required
              />
              {formData.image_url && (
                <div className="mt-3">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=Imagem+Inválida';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border-white/10 hover:bg-[#1A1A1A]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#FF4500] hover:bg-[#E03C00]"
                data-testid="save-product-button"
              >
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;