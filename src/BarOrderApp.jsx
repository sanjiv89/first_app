import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, CreditCard, ShoppingCart, Plus, Minus, X, ChevronRight, Star, Sparkles } from 'lucide-react';

// Simulated backend - in production, replace with real API calls
const mockBackend = {
  menu: [
    { id: 1, name: 'Draft Beer', price: 7, category: 'Beer', image: '🍺', description: 'Crisp and refreshing', popular: true },
    { id: 2, name: 'Craft IPA', price: 9, category: 'Beer', image: '🍺', description: 'Bold hoppy flavor' },
    { id: 3, name: 'House Wine', price: 10, category: 'Wine', image: '🍷', description: 'Red or white' },
    { id: 4, name: 'Margarita', price: 12, category: 'Cocktails', image: '🍹', description: 'Classic on the rocks', popular: true },
    { id: 5, name: 'Old Fashioned', price: 14, category: 'Cocktails', image: '🥃', description: 'Timeless whiskey cocktail' },
    { id: 6, name: 'Mojito', price: 12, category: 'Cocktails', image: '🍹', description: 'Minty and refreshing' },
    { id: 7, name: 'Whiskey Sour', price: 13, category: 'Cocktails', image: '🥃', description: 'Smooth and tangy', popular: true },
    { id: 8, name: 'Vodka Soda', price: 8, category: 'Cocktails', image: '🍸', description: 'Light and bubbly' },
  ],
  orders: []
};

// Main App Component
export default function BarOrderApp() {
  const [view, setView] = useState('customer');
  const [tableNumber, setTableNumber] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) {
      setTableNumber(table);
    }
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, delta) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    const newOrder = {
      id: Date.now(),
      table: tableNumber,
      items: cart,
      total: getCartTotal(),
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    setOrders([...orders, newOrder]);
    mockBackend.orders.push(newOrder);
    setCart([]);
    setShowCart(false);
    setOrderComplete(true);
    
    setTimeout(() => setOrderComplete(false), 3000);
  };

  // Customer View
  const CustomerView = () => {
    const categories = [...new Set(mockBackend.menu.map(item => item.category))];
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredMenu = selectedCategory === 'All' 
      ? mockBackend.menu 
      : mockBackend.menu.filter(item => item.category === selectedCategory);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white p-5 sticky top-0 z-10 shadow-2xl backdrop-blur-sm">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="animate-pulse" size={28} />
                The Cozy Bar
              </h1>
              {tableNumber && (
                <p className="text-sm opacity-90 mt-1 flex items-center gap-1">
                  <span className="bg-white/20 px-2 py-0.5 rounded-full">Table {tableNumber}</span>
                </p>
              )}
            </div>
            <button 
              onClick={() => setShowCart(true)}
              className="relative bg-white text-purple-700 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <ShoppingCart size={22} />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Order Complete Notification */}
        {orderComplete && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle size={28} className="animate-spin" style={{animationDuration: '2s'}} />
            <div>
              <p className="font-bold text-lg">Order Placed!</p>
              <p className="text-sm opacity-90">Your drinks are being prepared</p>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-[88px] z-10 shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all font-semibold shadow-md ${
                selectedCategory === 'All' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:scale-105'
              }`}
            >
              ✨ All Drinks
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all font-semibold shadow-md ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-700 hover:bg-purple-50 hover:scale-105'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="max-w-4xl mx-auto p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredMenu.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-purple-100 hover:border-purple-300 relative group"
              >
                {item.popular && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10">
                    <Star size={12} fill="currentColor" />
                    Popular
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="text-6xl drop-shadow-lg">{item.image}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-800 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                          <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${item.price}
                        </p>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2 font-bold"
                        >
                          <Plus size={20} />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Overlay */}
        {showCart && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white w-full md:max-w-2xl md:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0 duration-300">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 flex justify-between items-center shadow-lg z-10">
                <div>
                  <h2 className="text-2xl font-bold">Your Order</h2>
                  <p className="text-sm opacity-90">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                </div>
                <button 
                  onClick={() => setShowCart(false)} 
                  className="p-2 hover:bg-white/20 rounded-full transition-all"
                >
                  <X size={28} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <ShoppingCart size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-xl font-semibold mb-2">Your cart is empty</p>
                  <p className="text-sm">Add some drinks to get started!</p>
                </div>
              ) : (
                <>
                  <div className="p-5 space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-100 shadow-md">
                        <span className="text-5xl">{item.image}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price} each</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-md">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-purple-100 text-purple-700 p-2 rounded-lg hover:bg-purple-200 transition-all"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-purple-100 text-purple-700 p-2 rounded-lg hover:bg-purple-200 transition-all"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-purple-700">${(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm hover:underline font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t-2 border-purple-100 p-5 shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-semibold text-gray-700">Total</span>
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                    >
                      <CreditCard size={28} />
                      Pay ${getCartTotal().toFixed(2)} & Order
                      <ChevronRight size={24} />
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-3">
                      💳 Secure payment powered by Stripe (Demo Mode)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Staff View
  const StaffView = () => {
    const allOrders = [...orders, ...mockBackend.orders];
    const pendingOrders = allOrders.filter(o => o.status === 'pending');
    const completedOrders = allOrders.filter(o => o.status === 'completed');

    const completeOrder = (orderId) => {
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: 'completed' } : o
      ));
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 shadow-xl">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-sm opacity-90 mt-1">Manage incoming orders</p>
        </div>

        <div className="max-w-7xl mx-auto p-5">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pending Orders */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Clock className="text-orange-500" size={28} />
                Pending Orders 
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  {pendingOrders.length}
                </span>
              </h2>
              <div className="space-y-4">
                {pendingOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-md">
                    <Clock size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-semibold">No pending orders</p>
                    <p className="text-sm">New orders will appear here</p>
                  </div>
                ) : (
                  pendingOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-orange-500 hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">Table {order.table}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold shadow-md">
                          Pending
                        </span>
                      </div>
                      <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-xl">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-700">{item.quantity}x {item.name}</span>
                            <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                        <span className="font-bold text-lg text-gray-800">Total: ${order.total.toFixed(2)}</span>
                        <button
                          onClick={() => completeOrder(order.id)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          ✓ Complete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Orders */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <CheckCircle className="text-green-500" size={28} />
                Completed
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  {completedOrders.length}
                </span>
              </h2>
              <div className="space-y-4">
                {completedOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-md">
                    <CheckCircle size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-semibold">No completed orders yet</p>
                  </div>
                ) : (
                  completedOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-500 opacity-75 hover:opacity-100 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-700">Table {order.table}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(order.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          ✓ Done
                        </span>
                      </div>
                      <div className="space-y-1 mb-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <span className="font-bold text-sm text-gray-700">Total: ${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Dev View Switcher */}
      <div className="fixed bottom-5 right-5 z-50 bg-black/90 backdrop-blur-sm text-white p-3 rounded-2xl text-sm flex gap-2 shadow-2xl">
        <button 
          onClick={() => setView('customer')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            view === 'customer' ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          👥 Customer
        </button>
        <button 
          onClick={() => setView('staff')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            view === 'staff' ? 'bg-gradient-to-r from-green-600 to-teal-600 shadow-lg' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          📋 Staff
        </button>
      </div>

      {view === 'customer' && <CustomerView />}
      {view === 'staff' && <StaffView />}
    </div>
  );
}
