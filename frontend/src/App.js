import { useEffect, useState, useCallback } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminSettings from '@/pages/AdminSettings';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 30
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const carouselImages = [
    {
      url: 'https://customer-assets.emergentagent.com/job_smooth-food-order/artifacts/59mcit0i_pexels-ollivves-1025804.jpg',
      alt: 'Hambúrguer gourmet duplo'
    },
    {
      url: 'https://customer-assets.emergentagent.com/job_smooth-food-order/artifacts/ysb12jnq_pexels-christina-petsos-200616875-11568799.jpg',
      alt: 'Hambúrguer artesanal com batatas'
    },
    {
      url: 'https://customer-assets.emergentagent.com/job_smooth-food-order/artifacts/wzllt6ve_pexels-adrian-dorobantu-989175-2089717.jpg',
      alt: 'Hambúrguer triplo premium'
    },
    {
      url: 'https://customer-assets.emergentagent.com/job_smooth-food-order/artifacts/kj497g99_pexels-atomlaborblog-776314.jpg',
      alt: 'Hambúrguer na grelha'
    },
    {
      url: 'https://images.unsplash.com/photo-1611309454921-16cef3438ee0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHxnb3VybWV0JTIwYnVyZ2VyJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc0Mzk5OTc1fDA&ixlib=rb-4.1.0&q=85',
      alt: 'Hambúrguer clássico'
    }
  ];

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
            <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
              <div className="flex">
                {carouselImages.map((image, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-auto max-w-2xl rounded-3xl object-cover"
                      style={{ aspectRatio: '1/1' }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-40 rounded-3xl pointer-events-none"></div>
            
            {/* Carousel dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? 'bg-[#FF4500] w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
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
          <SheetDescription className="sr-only">Revise seu pedido e finalize no WhatsApp</SheetDescription>
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

const FeaturedDeals = ({ products, onAddToCart }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-[#050505] to-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#FF4500]/10 border border-[#FF4500]/30 rounded-full text-[#FF4500] text-sm font-bold mb-4">
            🔥 PROMOÇÕES DO DIA
          </span>
          <h2 className="bebas text-5xl sm:text-6xl tracking-tight mb-4">
            Combos Imperdíveis
          </h2>
          <p className="text-[#A3A3A3] text-lg max-w-2xl mx-auto">
            Aproveite nossas ofertas especiais e economize no seu pedido
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-[#FF4500]/20 rounded-3xl overflow-hidden hover:border-[#FF4500]/50 transition-all duration-300"
              data-testid={`featured-product-${product.id}`}
            >
              {/* Badge "COMBO X" */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block px-4 py-2 bg-[#FF4500] text-white font-bold rounded-full text-sm bebas tracking-wide">
                  {product.name.split(' ')[0]} {product.name.split(' ')[1]}
                </span>
              </div>

              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="bebas text-2xl tracking-tight mb-2">{product.name}</h3>
                <p className="text-sm text-[#A3A3A3] mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#A3A3A3] line-through block">R$ {(product.price * 1.3).toFixed(2)}</span>
                    <span className="text-3xl font-bold text-[#FF4500]">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={() => onAddToCart(product)}
                    className="bg-[#FF4500] hover:bg-[#E03C00] rounded-full px-6 py-6"
                    data-testid={`add-featured-${product.id}`}
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {/* Economia badge */}
                <div className="mt-4 inline-block px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-500 text-xs font-bold">
                  💰 Economia de R$ {((product.price * 1.3) - product.price).toFixed(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('5512988043993');

  useEffect(() => {
    const initProducts = async () => {
      try {
        await axios.post(`${API}/seed-products`);
        loadProducts();
        loadSettings();
        loadFeaturedProducts();
      } catch (e) {
        console.error('Error seeding products:', e);
      }
    };
    initProducts();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setWhatsappNumber(response.data.whatsapp_number);
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API}/products/featured`);
      setFeaturedProducts(response.data);
    } catch (e) {
      console.error('Error loading featured products:', e);
    }
  };

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

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
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

      <FeaturedDeals products={featuredProducts} onAddToCart={addToCart} />

      <div id="menu-section">
        {/* Menu Title */}
        <div className="py-16 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="bebas text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-4">
                Nossos Famosos e{' '}
                <span className="gradient-text">Tradicionais</span>
              </h2>
              <p className="text-[#A3A3A3] text-lg max-w-2xl mx-auto">
                Escolha entre nossa seleção premium de hambúrgueres artesanais, acompanhamentos crocantes e bebidas geladas
              </p>
            </motion.div>
          </div>
        </div>

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
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;