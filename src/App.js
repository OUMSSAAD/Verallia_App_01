import React, { useState, useEffect } from 'react';
import { Leaf, ShoppingCart, Heart, Star, Package, Truck, Shield, CreditCard, Check, X, Plus, Minus, Sparkles, TrendingUp, Users, Award, Clock, Zap, Gift, ChevronRight, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function VeralliaStore() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    promoCode: ''
  });

  // Catalogue de produits
  const products = [
    {
      id: 1,
      name: 'Verallia Shampoing Hydratant',
      subtitle: 'Formule Signature',
      price: 89.99,
      oldPrice: 189,
      image: '/shampoing-hydratant.png',
      badge: 'BEST SELLER',
      rating: 4.9,
      reviews: 2847,
      size: '50ml',
      benefits: ['Hydratation 48h', 'Brillance intense', 'Sans sulfates'],
      inStock: true,
      discount: '-21%'
    },
    {
      id: 2,
      name: 'Verallia Shampoing + Après-Shampoing',
      subtitle: 'Pack Duo Soin Complet',
      price: 179.99,
      oldPrice: 349,
      image: '/pack-duo.png',
      badge: 'PACK DUO',
      rating: 4.9,
      reviews: 1923,
      size: '2 x 50ml',
      benefits: ['Économisez 80 DH', 'Routine complète', 'Résultats optimaux'],
      inStock: true,
      discount: '-23%'
    },
    {
      id: 3,
      name: 'Verallia Masque Capillaire',
      subtitle: 'Soin Profond Intensif',
      price: 99.99,
      oldPrice: 122,
      image: '/masque-capillaire.png',
      badge: 'Pas disponible',
      rating: 4.8,
      reviews: 856,
      size: '100ml',
      benefits: ['Réparation profonde', 'Nutrition intense', 'Usage hebdomadaire'],
      inStock: true,
      discount: '-22%'
    },
    {
      id: 4,
      name: 'Pack Famille Verallia',
      subtitle: '3 Shampoings + 1 Masque GRATUIT',
      price: 369.89,
      oldPrice: 656,
      image: '/pack-famille.png',
      badge: 'PROMO -31%',
      rating: 5.0,
      reviews: 1456,
      size: 'Pack complet',
      benefits: ['1 masque offert', 'Économisez 207 DH', 'Pour toute la famille'],
      inStock: true,
      discount: '-31%',
      popular: true
    },
    {
      id: 5,
      name: 'Verallia Huile Capillaire',
      subtitle: 'Huile Sèche Nourrissante',
      price: 119,
      oldPrice: 159,
      image: '/huile-capillaire.png',
      badge: 'Pas disponible',
      rating: 4.7,
      reviews: 742,
      size: '30ml',
      benefits: ['Finition brillance', 'Anti-frisottis', '100% naturelle'],
      inStock: true,
      discount: '-19%'
    },
    {
      id: 6,
      name: 'Coffret Découverte Verallia',
      subtitle: 'Tous les Produits Format Voyage',
      price: 199,
      oldPrice: 279,
      image: '/coffret-decouverte.png',
      badge: 'Pas disponible ',
      rating: 4.8,
      reviews: 634,
      size: '5 miniatures',
      benefits: ['Testez tout', 'Idéal voyage', 'Cadeau parfait'],
      inStock: true,
      discount: '-29%'
    }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Initialiser EmailJS avec la Public Key
    emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    
    // Popup promo après 3 secondes
    const timer = setTimeout(() => setShowPromoPopup(true), 3000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    setShowCart(true);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const totalCart = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Appliquer le code promo
  const applyPromoCode = () => {
    if (customerInfo.promoCode.toUpperCase() === 'VERALLIA20') {
      return totalCart * 0.8; // -20%
    }
    return totalCart;
  };

  const finalTotal = applyPromoCode();
  const discount = totalCart - finalTotal;

  // Gérer la commande
  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  // Envoyer email à l'entreprise avec EmailJS
  const sendOrderEmailToCompany = async (orderDetails) => {
    try {
      // Préparer la liste des produits
      const productsList = orderDetails.items.map(item => 
        `${item.name} x${item.quantity} - ${item.price * item.quantity} DH`
      ).join('\n');

      // Paramètres du template EmailJS
      const templateParams = {
        customer_name: orderDetails.customer.name,
        customer_phone: orderDetails.customer.phone,
        customer_email: orderDetails.customer.email,
        customer_city: orderDetails.customer.city,
        customer_address: orderDetails.customer.address,
        products_list: productsList,
        subtotal: orderDetails.subtotal,
        discount: orderDetails.discount > 0 ? orderDetails.discount.toFixed(0) : '',
        total: orderDetails.total.toFixed(0),
        order_date: new Date().toLocaleString('fr-MA', {
          dateStyle: 'full',
          timeStyle: 'short'
        })
      };

      // Envoyer l'email via EmailJS
      const response = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Email envoyé avec succès !', response.status, response.text);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      // Ne pas bloquer la commande même si l'email échoue
      return false;
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    // Préparer les détails de la commande
    const orderDetails = {
      customer: customerInfo,
      items: cart,
      subtotal: totalCart,
      discount: discount,
      promoCode: customerInfo.promoCode.toUpperCase() === 'VERALLIA20' ? 'VERALLIA20' : '',
      total: finalTotal,
      orderDate: new Date().toISOString()
    };

    // Envoyer email à l'entreprise
    await sendOrderEmailToCompany(orderDetails);
    
    // Afficher la confirmation au client
    setShowCheckout(false);
    setOrderComplete(true);
    
    // Réinitialiser après 5 secondes
    setTimeout(() => {
      setCart([]);
      setOrderComplete(false);
      setCustomerInfo({
        name: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        promoCode: ''
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Cart Badge */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-emerald-800 to-green-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform group"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-500 text-emerald-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm animate-pulse">
            {totalItems}
          </span>
        )}
      </button>

      {/* Promo Popup */}
      {showPromoPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl border-2 border-amber-400">
            <button
              onClick={() => setShowPromoPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Gift className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-emerald-900 mb-4">
                🎉 Offre Spéciale !
              </h3>
              
              <p className="text-xl text-gray-600 mb-6">
                <span className="text-4xl font-bold text-amber-600 block mb-2">-20%</span>
                sur votre première commande
              </p>
              
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Utilisez le code :</p>
                <p className="text-2xl font-bold text-emerald-800 tracking-wider">VERALLIA20</p>
              </div>
              
              <button
                onClick={() => {
                  setShowPromoPopup(false);
                  document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-emerald-900 py-4 rounded-full font-bold text-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-lg"
              >
                J'en Profite !
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl animate-slide-in">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Votre Panier</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center px-6">
                <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h4>
                <p className="text-gray-600 mb-6">Ajoutez des produits pour commencer !</p>
                <button
                  onClick={() => setShowCart(false)}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-stone-50 rounded-2xl p-4 border-2 border-stone-200 hover:border-emerald-700 transition-all">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-stone-100 rounded-xl flex items-center justify-center border border-emerald-200 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-emerald-900 mb-1">{item.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.size}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-white rounded-full border-2 border-emerald-200">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-emerald-50 rounded-full transition-colors"
                              >
                                <Minus className="w-4 h-4 text-emerald-800" />
                              </button>
                              <span className="font-semibold px-2 text-emerald-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-emerald-50 rounded-full transition-colors"
                              >
                                <Plus className="w-4 h-4 text-emerald-800" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-emerald-800">{item.price * item.quantity} DH</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span className="font-semibold">{totalCart} DH</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Livraison</span>
                      <span>GRATUITE</span>
                    </div>
                    <div className="border-t border-stone-300 pt-4 flex justify-between text-xl font-bold">
                      <span className="text-emerald-900">Total</span>
                      <span className="text-emerald-800">{totalCart} DH</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-emerald-800 to-green-900 text-white py-4 rounded-full font-bold text-lg hover:from-emerald-900 hover:to-green-950 transition-all shadow-lg mb-3 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Commander Maintenant
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <div className="text-center text-sm text-gray-500">
                    🔒 Paiement 100% sécurisé
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Form */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white p-6 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">Finaliser Votre Commande</h2>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-white hover:text-amber-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleOrderSubmit} className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Informations Client */}
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                      <Users className="w-6 h-6" />
                      Vos Informations
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom Complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none transition-colors"
                          placeholder="Votre nom complet"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none transition-colors"
                          placeholder="06 XX XX XX XX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none transition-colors"
                          placeholder="votre@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ville *
                        </label>
                        <select
                          required
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none transition-colors"
                        >
                          <option value="">Sélectionnez votre ville</option>
                          <option value="Casablanca">Casablanca</option>
                          <option value="Rabat">Rabat</option>
                          <option value="Marrakech">Marrakech</option>
                          <option value="Fès">Fès</option>
                          <option value="Tanger">Tanger</option>
                          <option value="Agadir">Agadir</option>
                          <option value="Settat">Settat</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Adresse Complète *
                        </label>
                        <textarea
                          required
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                          rows="3"
                          placeholder="Numéro, rue, quartier..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Code Promo
                        </label>
                        <input
                          type="text"
                          value={customerInfo.promoCode}
                          onChange={(e) => setCustomerInfo({...customerInfo, promoCode: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none transition-colors"
                          placeholder="VERALLIA20"
                        />
                        {customerInfo.promoCode.toUpperCase() === 'VERALLIA20' && (
                          <p className="text-emerald-600 text-sm mt-2 font-semibold flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Code promo appliqué : -20%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Résumé Commande */}
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6" />
                      Résumé de la Commande
                    </h3>

                    <div className="bg-stone-50 rounded-2xl p-6 mb-6 border-2 border-stone-200">
                      <div className="space-y-4 mb-6">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center py-3 border-b border-stone-200 last:border-0">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-12 h-12 object-contain rounded-lg"
                              />
                              <div>
                                <p className="font-semibold text-emerald-900">{item.name}</p>
                                <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-bold text-emerald-800">{item.price * item.quantity} DH</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 border-t border-stone-300 pt-4">
                        <div className="flex justify-between text-gray-600">
                          <span>Sous-total</span>
                          <span className="font-semibold">{totalCart} DH</span>
                        </div>
                        
                        {discount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-semibold">
                            <span>Réduction (-20%)</span>
                            <span>-{discount.toFixed(0)} DH</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Livraison</span>
                          <span>GRATUITE</span>
                        </div>
                        
                        <div className="border-t-2 border-stone-300 pt-3 flex justify-between text-2xl font-bold">
                          <span className="text-emerald-900">Total</span>
                          <span className="text-emerald-800">{finalTotal.toFixed(0)} DH</span>
                        </div>
                      </div>
                    </div>

                    {/* Méthode de Paiement */}
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
                      <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Mode de Paiement
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="payment" value="cash" defaultChecked className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium">Paiement à la Livraison (Cash)</span>
                        </label>
                        <p className="text-sm text-gray-600 ml-7">
                          Payez en espèces lors de la réception de votre commande
                        </p>
                      </div>
                    </div>

                    {/* Garanties */}
                    <div className="space-y-3 mb-6">
                      {[
                        { icon: Truck, text: 'Livraison Gratuite au Maroc' },
                        { icon: Shield, text: 'Garantie 30 jours' },
                        { icon: CreditCard, text: 'Paiement 100% Sécurisé' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                          <item.icon className="w-5 h-5 text-emerald-600" />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bouton Valider */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-emerald-900 py-4 rounded-full font-bold text-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Valider la Commande
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                      🔒 Vos informations sont sécurisées et confidentielles
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation */}
      {orderComplete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">
              Commande Confirmée ! 🎉
            </h2>
            
            <p className="text-xl text-gray-700 mb-6">
              Merci <span className="font-bold text-emerald-800">{customerInfo.name}</span> pour votre confiance !
            </p>
            
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
              <p className="text-gray-700 mb-4">
                Vous allez recevoir un SMS et un email de confirmation à :
              </p>
              <p className="font-bold text-emerald-900">{customerInfo.phone}</p>
              <p className="font-bold text-emerald-900">{customerInfo.email}</p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Truck className="w-6 h-6 text-amber-600" />
                <h3 className="font-bold text-gray-900">Livraison</h3>
              </div>
              <p className="text-gray-700">
                Votre commande sera livrée sous <span className="font-bold text-emerald-800">2-4 jours ouvrables</span> à {customerInfo.city}
              </p>
            </div>

            <div className="text-2xl font-bold text-emerald-800 mb-6">
              Total: {finalTotal.toFixed(0)} DH
            </div>

            <button
              onClick={() => {
                setOrderComplete(false);
                setCart([]);
              }}
              className="bg-gradient-to-r from-emerald-800 to-green-900 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-900 hover:to-green-950 transition-all"
            >
              Retour à l'Accueil
            </button>

            <p className="text-sm text-gray-500 mt-6">
              Cette fenêtre se fermera automatiquement dans 5 secondes...
            </p>
          </div>
        </div>
      )}

      {/* Top Banner Promo */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white py-3 px-6 text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap text-sm md:text-base">
          <Zap className="w-5 h-5 animate-pulse text-amber-400" />
          <span className="font-bold">OFFRE LIMITÉE :</span>
          <span>-20% avec le code VERALLIA20 + Livraison GRATUITE</span>
          <Zap className="w-5 h-5 animate-pulse text-amber-400" />
        </div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-white'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/Log__mark.png" 
                alt="Verallia Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold text-emerald-900" style={{ fontFamily: 'serif' }}>VERALLIA</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#catalogue" className="text-gray-700 hover:text-emerald-800 font-medium transition-colors">
                Catalogue
              </a>
              <a href="#benefices" className="text-gray-700 hover:text-emerald-800 font-medium transition-colors">
                Avantages
              </a>
              <a href="#temoignages" className="text-gray-700 hover:text-emerald-800 font-medium transition-colors">
                Avis
              </a>
            </div>
            
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-gradient-to-r from-emerald-800 to-green-900 text-white px-6 py-2.5 rounded-full font-semibold hover:from-emerald-900 hover:to-green-950 transition-colors flex items-center gap-2 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Panier
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-400/30 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium">N°1 des Shampoings Bio au Maroc</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Transformez
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  Vos Cheveux
                </span>
                Naturellement
              </h1>
              
              <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
                Shampoing bio 100% naturel fabriqué au Maroc. Des résultats visibles dès la première utilisation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button
                  onClick={() => document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-gradient-to-r from-amber-500 to-yellow-600 text-emerald-900 px-8 py-4 rounded-full font-bold text-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-2xl flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Acheter Maintenant
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="flex items-center gap-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="text-sm">
                  <div className="font-bold text-white">5000+</div>
                  <div className="text-emerald-200">Clients Satisfaits</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-amber-400/30">
                <div className="mb-4 flex justify-center">
                  <img 
                    src={products[0].image}
                    alt={products[0].name}
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 text-amber-400">Offre Spéciale</h3>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold">89.99 DH</div>
                  <div className="text-emerald-200 line-through text-xl">189 DH</div>
                  <div className="inline-block bg-amber-500 text-emerald-900 px-4 py-1 rounded-full font-bold text-sm mt-2">
                    -21% AUJOURD'HUI
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {['✓ Livraison GRATUITE', '✓ Paiement sécurisé', '✓ Garantie 30 jours'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-emerald-100">
                      {item}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addToCart(products[0])}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-emerald-900 py-4 rounded-full font-bold text-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-lg"
                >
                  Ajouter au Panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-stone-50 border-y border-stone-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, text: 'Livraison Gratuite', sub: 'Partout au Maroc' },
              { icon: Shield, text: 'Garantie 30 Jours', sub: 'Satisfait ou Remboursé' },
              { icon: CreditCard, text: 'Paiement Sécurisé', sub: '100% Protégé' },
              { icon: Award, text: 'Certifié Bio', sub: 'Ingrédients Naturels' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 justify-center text-center md:text-left">
                <item.icon className="w-10 h-10 text-emerald-800 flex-shrink-0" />
                <div>
                  <div className="font-bold text-emerald-900 text-sm">{item.text}</div>
                  <div className="text-xs text-gray-600">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section id="catalogue" className="py-20 px-6 bg-gradient-to-b from-white to-stone-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-2 rounded-full font-semibold text-sm mb-6">
              <Package className="w-4 h-4" />
              Catalogue Produits
            </div>
            <h2 className="text-5xl font-bold text-emerald-900 mb-6">
              Nos Produits Phares
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre gamme complète de soins capillaires naturels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className={`group relative bg-white rounded-3xl border-2 ${
                  product.popular ? 'border-amber-500 shadow-2xl ring-4 ring-amber-100' : 'border-stone-200'
                } hover:border-emerald-700 hover:shadow-2xl transition-all duration-300 overflow-hidden`}
              >
                {/* Popular Badge */}
                {product.popular && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-emerald-900 px-4 py-2 rounded-full font-bold text-sm z-10 shadow-lg flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    PLUS POPULAIRE
                  </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full font-bold text-sm z-10 shadow-lg">
                  {product.discount}
                </div>

                <div className="p-8">
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-emerald-50 to-stone-50 rounded-2xl mb-6 text-center group-hover:scale-105 transition-transform border border-emerald-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="inline-block bg-gradient-to-r from-emerald-800 to-green-900 text-white px-3 py-1 rounded-full text-xs font-bold -mt-4 relative">
                      {product.badge}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-emerald-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{product.subtitle}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-semibold text-sm">{product.rating}</span>
                      <span className="text-gray-500 text-sm">({product.reviews} avis)</span>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2 mb-6">
                      {product.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>

                    {/* Size */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                      <Package className="w-4 h-4 text-emerald-800" />
                      <span>{product.size}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="border-t border-stone-200 pt-6">
                    <div className="flex items-end gap-3 mb-4">
                      <div className="text-3xl font-bold text-emerald-800">
                        {product.price} DH
                      </div>
                      <div className="text-gray-400 line-through text-lg mb-1">
                        {product.oldPrice} DH
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-emerald-800 to-green-900 text-white py-4 rounded-full font-bold hover:from-emerald-900 hover:to-green-950 transition-all shadow-lg flex items-center justify-center gap-2 group-hover:scale-105"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au Panier
                    </button>
                    
                    {product.popular && (
                      <p className="text-center text-xs text-amber-700 font-semibold mt-3">
                        ⭐ Choix préféré des clients
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Clock className="w-12 h-12 animate-pulse" />
            <h3 className="text-4xl font-bold">Offre Limitée !</h3>
          </div>
          <p className="text-2xl mb-8">
            Plus que <span className="font-bold text-yellow-300">12 heures</span> pour profiter de -20%
          </p>
          <button
            onClick={() => document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg inline-flex items-center gap-2"
          >
            J'en Profite Maintenant
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Social Proof */}
      <section id="temoignages" className="py-20 px-6 bg-stone-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-emerald-900 mb-4">
              5000+ Clients Nous Font Confiance
            </h2>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-2xl font-bold ml-2">4.9/5</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Amina K.',
                text: 'Mes cheveux n\'ont jamais été aussi beaux ! Résultats visibles dès la première semaine.',
                rating: 5
              },
              {
                name: 'Karim M.',
                text: 'Produit exceptionnel, livraison rapide. Je recommande à 100%',
                rating: 5
              },
              {
                name: 'Sarah L.',
                text: 'Enfin un shampoing naturel qui fonctionne vraiment. Mon coup de cœur !',
                rating: 5
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200 hover:border-emerald-700 transition-all">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                <p className="font-bold text-emerald-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Prêt(e) à Transformer Vos Cheveux ?
          </h2>
          <p className="text-2xl mb-8 text-emerald-100">
            Commandez maintenant et profitez de la livraison GRATUITE
          </p>
          <button
            onClick={() => document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 text-emerald-900 px-12 py-5 rounded-full font-bold text-xl hover:from-amber-600 hover:to-yellow-700 transition-all shadow-2xl inline-flex items-center gap-3"
          >
            <ShoppingCart className="w-6 h-6" />
            Voir le Catalogue
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="/Log__mark.png" 
              alt="Verallia Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-3xl font-bold" style={{ fontFamily: 'serif' }}>VERALLIA</span>
          </div>
          <p className="text-gray-400 mb-2">
            La nature aux cœurs de vos cheveux
          </p>
          <p className="text-gray-400 mb-8">
            © 2024 Verallia. Tous droits réservés. Made with ❤️ in Morocco
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-amber-400 transition-colors">CGV</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}