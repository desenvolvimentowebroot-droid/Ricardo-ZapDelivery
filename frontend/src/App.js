import { useEffect, useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WHATSAPP_NUMBER = '5512988043993';
const DELIVERY_FEE = 8.00;

const LOGO_URL = 'https://static.prod-images.emergentagent.com/jobs/24fe9bf0-ff71-4d55-a047-9b199488b204/images/5122189d90748987590e6af7ebeb136d28430af64ac43d92a38b0fb3cade986d.png';

const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'hamburgueres', label: 'Hambúrgueres' },
  { id: 'acompanhamentos', label: 'Acompanhamentos' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'sobremesas', label: 'Sobremesas' }
];

const Header = ({ cartCount, onCartClick }) => {
  return (
    <header className="glass-header fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Logo" className="h-12 w-12" />
          <span className="bebas text-2xl tracking-tight">Ricardo ZapDelivery</span>
        </div>
        <Button
          onClick={onCartClick}
          variant="outline"
          size="icon"
          className="relative bg-[#121212] border-white/10 hover:bg-[#1A1A1A] hover:border-[#FF4500]/50"
          data-testid="cart-button"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FF4500] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
};

const Hero = ({ onExploreClick }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <motion.h1
              className="bebas text-6xl sm:text-7xl lg:text-8xl leading-none tracking-tighter mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              OS MELHORES
              <br />
              <span className="gradient-text">HAMBÚRGUERES</span>
              <br />
              DA CIDADE
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-[#A3A3A3] mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Delivery rápido direto pelo WhatsApp. Hambúrgueres artesanais feitos com ingredientes premium.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={onExploreClick}
                size="lg"
                className="bg-[#FF4500] hover:bg-[#E03C00] text-white rounded-full px-8 py-6 text-lg font-bold"
                data-testid="explore-menu-button"
              >
                Explorar Cardápio
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <img
              src="https://images.unsplash.com/photo-1611309454921-16cef3438ee0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHxnb3VybWV0JTIwYnVyZ2VyJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc0Mzk5OTc1fDA&ixlib=rb-4.1.0&q=85"
              alt="Gourmet Burger"
              className="floating-burger w-full h-auto max-w-2xl rounded-3xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CategoryFilter = ({ categories, activeCategory, onChange }) => {
  return (
    <div className="sticky top-20 z-30 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={`category-pill px-6 py-2.5 rounded-full whitespace-nowrap font-medium text-sm ${
                activeCategory === cat.id ? 'active text-white' : 'text-[#A3A3A3]'
              }`}
              data-testid={`category-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAdd }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="product-card rounded-3xl overflow-hidden"
      data-testid={`product-card-${product.id}`}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-image w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="bebas text-2xl tracking-tight mb-2">{product.name}</h3>
        <p className="text-sm text-[#A3A3A3] mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#FF4500]">
            R$ {product.price.toFixed(2)}
          </span>
          <Button
            onClick={() => onAdd(product)}
            size="icon"
            className="bg-[#FF4500] hover:bg-[#E03C00] rounded-full"
            data-testid={`add-product-${product.id}`}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const CartDrawer = ({ cart, onUpdateQuantity, onRemove, onCheckout, isOpen, onOpenChange }) => {
  const [address, setAddress] = useState('');
  const [observations, setObservations] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  const handleCheckout = () => {
    if (!address.trim()) {
      toast.error('Por favor, informe o endereço de entrega');
      return;
    }
    onCheckout(address, observations, subtotal, total);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-[#050505] border-white/10 w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="bebas text-3xl tracking-tight">Seu Pedido</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-[#A3A3A3]">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            <>
              <div className="space-y-4" data-testid="cart-items">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-[#121212] border border-white/5 rounded-2xl p-4"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.name}</h4>
                      <p className="text-[#FF4500] font-bold">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-[#A3A3A3] hover:text-red-500"
                        data-testid={`remove-item-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-[#1A1A1A] hover:bg-[#FF4500] flex items-center justify-center"
                          data-testid={`decrease-quantity-${item.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-bold" data-testid={`quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-[#1A1A1A] hover:bg-[#FF4500] flex items-center justify-center"
                          data-testid={`increase-quantity-${item.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Endereço de Entrega</label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, bairro"
                    className="bg-[#121212] border-white/10"
                    data-testid="address-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Observações</label>
                  <Textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Ex: sem cebola, ponto da carne, etc."
                    className="bg-[#121212] border-white/10 resize-none"
                    rows={3}
                    data-testid="observations-input"
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-[#A3A3A3]">
                  <span>Subtotal</span>
                  <span data-testid="subtotal">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#A3A3A3]">
                  <span>Taxa de Entrega</span>
                  <span data-testid="delivery-fee">R$ {DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span className="text-[#FF4500]" data-testid="total">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-[#25D366] hover:bg-[#1FAD53] text-white rounded-full py-6 text-lg font-bold"
                data-testid="checkout-button"
              >
                Finalizar no WhatsApp
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initProducts = async () => {
      try {
        await axios.post(`${API}/seed-products`);
        loadProducts();
      } catch (e) {
        console.error('Error seeding products:', e);
      }
    };
    initProducts();
  }, []);

  const loadProducts = async (category = 'todos') => {
    try {
      setLoading(true);
      const url = category === 'todos' ? `${API}/products` : `${API}/products?category=${category}`;
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (e) {
      console.error('Error loading products:', e);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    loadProducts(category);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    toast.info('Item removido do carrinho');
  };

  const handleCheckout = (address, observations, subtotal, total) => {
    const message = `🍔 *Novo Pedido - Ricardo ZapDelivery*\n\n` +
      `*Itens:*\n${cart.map((item) => `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\n` +
      `*Endereço:* ${address}\n` +
      `${observations ? `*Observações:* ${observations}\n` : ''}\n` +
      `*Subtotal:* R$ ${subtotal.toFixed(2)}\n` +
      `*Taxa de Entrega:* R$ ${DELIVERY_FEE.toFixed(2)}\n` +
      `*Total:* R$ ${total.toFixed(2)}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setCart([]);
    setIsCartOpen(false);
    toast.success('Pedido enviado! Aguarde o contato no WhatsApp.');
  };

  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="noise-overlay" />
      
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      
      <Hero onExploreClick={scrollToMenu} />

      <div id="menu-section">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
        />

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF4500] border-r-transparent"></div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAdd={addToCart} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>

      <CartDrawer
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
      />

      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 lg:hidden z-30"
        >
          <Button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#FF4500] hover:bg-[#E03C00] rounded-full py-6 text-lg font-bold flex items-center justify-between"
            data-testid="mobile-cart-button"
          >
            <span>Ver Carrinho ({cartCount})</span>
            <span>R$ {(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + DELIVERY_FEE).toFixed(2)}</span>
          </Button>
        </motion.div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;