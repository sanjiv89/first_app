import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, CreditCard, Menu, Plus, Minus, X } from 'lucide-react';

// Simulated backend - in production, replace with real API calls
const mockBackend = {
  menu: [
    { id: 1, name: 'Draft Beer', price: 7, category: 'Beer', image: '🍺' },
    { id: 2, name: 'Craft IPA', price: 9, category: 'Beer', image: '🍺' },
    { id: 3, name: 'House Wine', price: 10, category: 'Wine', image: '🍷' },
    { id: 4, name: 'Margarita', price: 12, category: 'Cocktails', image: '🍹' },
    { id: 5, name: 'Old Fashioned', price: 14, category: 'Cocktails', image: '🥃' },
    { id: 6, name: 'Mojito', price: 12, category: 'Cocktails', image: '🍹' },
    { id: 7, name: 'Whiskey Sour', price: 13, category: 'Cocktails', image: '🥃' },
    { id: 8, name: 'Vodka Soda', price: 8, category: 'Cocktails', image: '🍸' },
  ],
  orders: []
};

// Main App Component
export default function BarOrderApp() {
  const [view, setView] = useState('customer'); // customer, staff, admin
  const [tableNumber, setTableNumber] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Simulate table number from QR code
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
    // In production, this would call Stripe API
    // For now, simulate payment processing
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold">The Cozy Bar</h1>
              {tableNumber && <p className="text-sm opacity-90">Table {tableNumber}</p>}
            </div>
            <button 
              onClick={() => setShowCart(true)}
              className="relative bg-white text-purple-600 px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition"
            >
              <Menu size={20} />
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Order Complete Notification */}
        {orderComplete && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-bounce">
            <CheckCircle size={24} />
            <span className="font-semibold">Order placed! Your drinks are on the way.</span>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white border-b sticky top-16 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === 'All' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="max-w-4xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenu.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{item.image}</span>
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">${item.price}</p>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Overlay */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full md:max-w-2xl md:rounded-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-lg">Your cart is empty</p>
                  <p className="text-sm mt-2">Add some drinks to get started!</p>
                </div>
              ) : (
                <>
                  <div className="p-4 space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                        <span className="text-3xl">{item.image}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-purple-600">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                    >
                      <CreditCard size={24} />
                      Pay ${getCartTotal().toFixed(2)} & Order
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Payment powered by Stripe (Demo Mode)
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4">
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <p className="text-sm opacity-90">Manage incoming orders</p>
        </div>

        <div className="max-w-6xl mx-auto p-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pending Orders */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="text-orange-500" />
                Pending Orders ({pendingOrders.length})
              </h2>
              <div className="space-y-4">
                {pendingOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending orders</p>
                ) : (
                  pendingOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">Table {order.table}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Pending
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="font-bold">Total: ${order.total.toFixed(2)}</span>
                        <button
                          onClick={() => completeOrder(order.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Orders */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                Completed ({completedOrders.length})
              </h2>
              <div className="space-y-4">
                {completedOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No completed orders yet</p>
                ) : (
                  completedOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 opacity-75">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">Table {order.table}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Completed
                        </span>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t mt-2">
                        <span className="font-bold text-sm">Total: ${order.total.toFixed(2)}</span>
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

  // View Selector
  return (
    <div>
      {/* Dev View Switcher - Remove in production */}
      <div className="fixed bottom-4 right-4 z-50 bg-black text-white p-2 rounded-lg text-sm flex gap-2">
        <button 
          onClick={() => setView('customer')}
          className={`px-3 py-1 rounded ${view === 'customer' ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
          Customer
        </button>
        <button 
          onClick={() => setView('staff')}
          className={`px-3 py-1 rounded ${view === 'staff' ? 'bg-green-600' : 'bg-gray-700'}`}
        >
          Staff
        </button>
      </div>

      {view === 'customer' && <CustomerView />}
      {view === 'staff' && <StaffView />}
    </div>
  );
}
