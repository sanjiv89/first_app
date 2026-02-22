import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';

// Mock data
const barsData = [
  {
    id: 1,
    name: 'Cozy Bar',
    address: '123 Main St, Downtown',
    phone: '555-0101',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    menu: [
      { id: 1, name: 'Margarita', price: 8, category: 'Cocktails' },
      { id: 2, name: 'Beer', price: 5, category: 'Beer' },
      { id: 3, name: 'Wine', price: 7, category: 'Wine' },
    ],
  },
  {
    id: 2,
    name: 'Downtown Pub',
    address: '456 Oak Ave, Midtown',
    phone: '555-0102',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    menu: [
      { id: 4, name: 'Whiskey Neat', price: 10, category: 'Spirits' },
      { id: 5, name: 'Craft Beer', price: 6, category: 'Beer' },
      { id: 6, name: 'Mojito', price: 9, category: 'Cocktails' },
    ],
  },
  {
    id: 3,
    name: 'Sunset Lounge',
    address: '789 Sunset Blvd, Beach',
    phone: '555-0103',
    coordinates: { lat: 40.5731, lng: -73.9712 },
    menu: [
      { id: 7, name: 'Piña Colada', price: 9, category: 'Cocktails' },
      { id: 8, name: 'Tropical Beer', price: 6, category: 'Beer' },
      { id: 9, name: 'Sangria', price: 8, category: 'Wine' },
    ],
  },
];

// Customer View
function BarSelectionView({ bars, userLocation, onSelectBar, searchQuery, onSearchChange, zipCode, onZipCodeChange, onZipCodeSearch }) {
  const [filteredBars, setFilteredBars] = useState(bars);

  useEffect(() => {
    const filtered = bars.filter(bar =>
      bar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bar.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBars(filtered);
  }, [searchQuery, bars]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">🍸 Cheers</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg mb-8 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Find Your Bar</h2>
          
          <form onSubmit={onZipCodeSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ZIP Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="5"
                  value={zipCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                    onZipCodeChange(val);
                  }}
                  placeholder="Enter ZIP code"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:border-yellow-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded transition"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Search Bars</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or address..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:border-yellow-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredBars.map((bar) => (
            <div
              key={bar.id}
              className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-yellow-500 transition cursor-pointer"
              onClick={() => onSelectBar(bar)}
            >
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{bar.name}</h3>
              <p className="text-gray-300 mb-1">📍 {bar.address}</p>
              <p className="text-gray-400 text-sm">📞 {bar.phone}</p>
            </div>
          ))}
        </div>

        {filteredBars.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p>No bars found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Bar Detail View
function BarDetailView({ selectedBar, onBack, onPlaceOrder }) {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSubmitOrder = () => {
    if (!tableNumber.trim()) {
      alert('Please enter a table number');
      return;
    }
    if (cart.length === 0) {
      alert('Please add items to your order');
      return;
    }
    const order = {
      id: Date.now(),
      bar: selectedBar.name,
      table: tableNumber,
      items: cart,
      total,
      timestamp: new Date().toLocaleTimeString(),
    };
    onPlaceOrder(order);
  };

  if (!selectedBar) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition"
        >
          ← Back
        </button>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">{selectedBar.name}</h1>
          <p className="text-gray-300">📍 {selectedBar.address}</p>
          <p className="text-gray-400">📞 {selectedBar.phone}</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Menu</h2>
            <div className="space-y-2">
              {selectedBar.menu.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 p-4 rounded border border-gray-800 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-gray-100">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-yellow-400 font-bold">${item.price}</p>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-gray-900 p-6 rounded border border-gray-800 sticky top-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Your Order</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Table Number</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                    <span className="text-sm">{item.name} - ${item.price}</span>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-400 hover:text-red-300 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="text-lg font-bold text-yellow-400 mb-4">Total: ${total.toFixed(2)}</p>
                <button
                  onClick={handleSubmitOrder}
                  className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded transition"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Staff View
function StaffView({ orders, onClearOrder }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">📋 Active Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No pending orders</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900 p-6 rounded border border-yellow-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-lg font-bold text-yellow-400">{order.bar}</p>
                    <p className="text-gray-300">Table {order.table}</p>
                    <p className="text-gray-400 text-sm">{order.timestamp}</p>
                  </div>
                  <button
                    onClick={() => onClearOrder(order.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition"
                  >
                    Ready
                  </button>
                </div>

                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-gray-300">
                      {item.name} - ${item.price}
                    </p>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-lg font-bold text-yellow-400">Total: ${order.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main App
export default function Cheers() {
  const [currentView, setCurrentView] = useState('selection');
  const [selectedBar, setSelectedBar] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [orders, setOrders] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const handleZipCodeSearch = (e) => {
    e.preventDefault();
    if (zipCode.length === 5) {
      alert(`Searching bars near ${zipCode}...`);
    }
  };

  const handleSelectBar = (bar) => {
    setSelectedBar(bar);
    setCurrentView('bar');
  };

  const handlePlaceOrder = (order) => {
    setOrders([...orders, order]);
    alert(`Order placed! Bar: ${order.bar}, Table: ${order.table}`);
    setCurrentView('selection');
    setSelectedBar(null);
  };

  const handleClearOrder = (orderId) => {
    setOrders(orders.filter((o) => o.id !== orderId));
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900 border-b border-yellow-500 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">🍸 Cheers</h1>
          <div className="space-x-4">
            <button
              onClick={() => setCurrentView('selection')}
              className={`px-4 py-2 rounded font-bold transition ${
                currentView === 'selection'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-100 hover:bg-gray-700'
              }`}
            >
              Order
            </button>
            <button
              onClick={() => setCurrentView('staff')}
              className={`px-4 py-2 rounded font-bold transition ${
                currentView === 'staff'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-100 hover:bg-gray-700'
              }`}
            >
              Staff ({orders.length})
            </button>
          </div>
        </div>
      </nav>

      {currentView === 'selection' && (
        <BarSelectionView
          bars={barsData}
          userLocation={userLocation}
          onSelectBar={handleSelectBar}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          zipCode={zipCode}
          onZipCodeChange={setZipCode}
          onZipCodeSearch={handleZipCodeSearch}
        />
      )}

      {currentView === 'bar' && (
        <BarDetailView
          selectedBar={selectedBar}
          onBack={() => setCurrentView('selection')}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {currentView === 'staff' && (
        <StaffView orders={orders} onClearOrder={handleClearOrder} />
      )}
    </div>
  );
}
