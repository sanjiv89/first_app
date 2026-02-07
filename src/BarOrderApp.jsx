import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Clock, CreditCard, ShoppingCart, Plus, Minus, X, ChevronRight, Star, Sparkles, MapPin, Search, Navigation, Map, List } from 'lucide-react';

// Mock data for different bars - in production, this would come from an API
const bars = [
  {
    id: 1,
    name: 'The Cozy Bar',
    address: '123 Main St, Ann Arbor, MI',
    lat: 42.2808,
    lng: -83.7430,
    distance: 0.5,
    rating: 4.8,
    image: '🍺',
    menu: [
      { id: 1, name: 'Draft Beer', price: 7, category: 'Beer', image: '🍺', description: 'Crisp and refreshing', popular: true },
      { id: 2, name: 'Craft IPA', price: 9, category: 'Beer', image: '🍺', description: 'Bold hoppy flavor' },
      { id: 3, name: 'House Wine', price: 10, category: 'Wine', image: '🍷', description: 'Red or white' },
      { id: 4, name: 'Margarita', price: 12, category: 'Cocktails', image: '🍹', description: 'Classic on the rocks', popular: true },
      { id: 5, name: 'Old Fashioned', price: 14, category: 'Cocktails', image: '🥃', description: 'Timeless whiskey cocktail' },
    ]
  },
  {
    id: 2,
    name: 'Downtown Pub',
    address: '456 Liberty St, Ann Arbor, MI',
    lat: 42.2790,
    lng: -83.7410,
    distance: 1.2,
    rating: 4.6,
    image: '🍻',
    menu: [
      { id: 1, name: 'Local Lager', price: 8, category: 'Beer', image: '🍺', description: 'Ann Arbor favorite', popular: true },
      { id: 2, name: 'Whiskey Flight', price: 16, category: 'Spirits', image: '🥃', description: '4 premium whiskeys' },
      { id: 3, name: 'Moscow Mule', price: 11, category: 'Cocktails', image: '🍸', description: 'Spicy and refreshing' },
      { id: 4, name: 'Red Wine', price: 12, category: 'Wine', image: '🍷', description: 'Cabernet or Merlot', popular: true },
    ]
  },
  {
    id: 3,
    name: 'Sunset Lounge',
    address: '789 State St, Ann Arbor, MI',
    lat: 42.2825,
    lng: -83.7445,
    distance: 2.1,
    rating: 4.9,
    image: '🌅',
    menu: [
      { id: 1, name: 'Mojito', price: 13, category: 'Cocktails', image: '🍹', description: 'Minty and refreshing', popular: true },
      { id: 2, name: 'Cosmopolitan', price: 14, category: 'Cocktails', image: '🍸', description: 'Classic pink cocktail' },
      { id: 3, name: 'Champagne', price: 18, category: 'Wine', image: '🥂', description: 'Sparkling celebration' },
      { id: 4, name: 'Gin & Tonic', price: 10, category: 'Cocktails', image: '🍸', description: 'Light and crisp', popular: true },
      { id: 5, name: 'Tequila Sunrise', price: 12, category: 'Cocktails', image: '🍹', description: 'Tropical vibes' },
    ]
  }
];

export default function BarOrderApp() {
  const [selectedBar, setSelectedBar] = useState(null);
  const [view, setView] = useState('customer');
  const [tableNumber, setTableNumber] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapView, setMapView] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const barId = params.get('bar');
    
    if (table) setTableNumber(table);
    if (barId) {
      const bar = bars.find(b => b.id === parseInt(barId));
      if (bar) setSelectedBar(bar);
    }
  }, []);

  // Initialize Google Map
  useEffect(() => {
    if (mapView && mapRef.current && !googleMapRef.current && window.google) {
      // Default center (Ann Arbor)
      const center = userLocation || { lat: 42.2808, lng: -83.7430 };
      
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 14,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
      });

      // Add markers for each bar
      bars.forEach(bar => {
        const marker = new window.google.maps.Marker({
          position: { lat: bar.lat, lng: bar.lng },
          map: googleMapRef.current,
          title: bar.name,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: `data:image/svg+xml,${encodeURIComponent(`
              <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0C8.954 0 0 8.954 0 20c0 11.046 20 30 20 30s20-18.954 20-30C40 8.954 31.046 0 20 0z" fill="%237C3AED"/>
                <circle cx="20" cy="20" r="10" fill="white"/>
                <text x="20" y="26" text-anchor="middle" font-size="16" fill="%237C3AED">${bar.image}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(40, 50),
          }
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #333;">${bar.image} ${bar.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${bar.address}</p>
              <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                <span style="background: #FEF3C7; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">⭐ ${bar.rating}</span>
                <span style="background: #DBEAFE; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">📍 ${bar.distance} mi</span>
              </div>
              <button 
                onclick="window.selectBarFromMap(${bar.id})"
                style="width: 100%; background: linear-gradient(to right, #9333EA, #EC4899); color: white; border: none; padding: 10px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px;"
              >
                View Menu →
              </button>
            </div>
          `
        });

        marker.addListener('click', () => {
          // Close all other info windows
          markersRef.current.forEach(m => m.infoWindow.close());
          infoWindow.open(googleMapRef.current, marker);
        });

        marker.addListener('mouseover', () => {
          setHoveredBar(bar.id);
        });

        marker.addListener('mouseout', () => {
          setHoveredBar(null);
        });

        markersRef.current.push({ marker, infoWindow, barId: bar.id });
      });

      // Add user location marker if available
      if (userLocation) {
        new window.google.maps.Marker({
          position: userLocation,
          map: googleMapRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4F46E5',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          }
        });
      }
    }
  }, [mapView, userLocation]);

  // Global function for map info window buttons
  useEffect(() => {
    window.selectBarFromMap = (barId) => {
      const bar = bars.find(b => b.id === barId);
      if (bar) {
        setSelectedBar(bar);
      }
    };
    return () => {
      delete window.selectBarFromMap;
    };
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          // Re-center map if it exists
          if (googleMapRef.current) {
            googleMapRef.current.setCenter(location);
          }
        },
        (error) => {
          alert('Location access denied. Please enable location services or enter your ZIP code.');
        }
      );
    }
  };

  const handleZipCodeSearch = async (e) => {
    e.preventDefault();
    if (!zipCode || zipCode.length !== 5) {
      alert('Please enter a valid 5-digit ZIP code');
      return;
    }

    try {
      // Use Google Geocoding API to convert ZIP to coordinates
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyCTvKipcJkA-Ph-zFHOU4gmDN6pfmOoKoA`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setUserLocation(location);
        
        // Re-center map if it exists
        if (googleMapRef.current) {
          googleMapRef.current.setCenter(location);
          googleMapRef.current.setZoom(14);
        }
        
        // Switch to map view to show results
        setMapView(true);
      } else {
        alert('Could not find location for this ZIP code. Please try again.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error searching ZIP code. Please try again.');
    }
  };

  const filteredBars = searchQuery 
    ? bars.filter(bar => 
        bar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bar.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bars;

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
      bar: selectedBar.name,
      table: tableNumber,
      items: cart,
      total: getCartTotal(),
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    setOrders([...orders, newOrder]);
    setCart([]);
    setShowCart(false);
    setOrderComplete(true);
    
    setTimeout(() => setOrderComplete(false), 3000);
  };

  // Bar Selection View
  const BarSelectionView = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white p-6 shadow-xl">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 mb-2">
              <Sparkles className="animate-pulse" size={32} />
              Find Your Bar
            </h1>
            <p className="text-sm opacity-90">Choose a nearby bar to start ordering</p>
          </div>
        </div>

        {/* Location Search */}
        <div className="max-w-4xl mx-auto p-5">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-purple-600" size={24} />
              Your Location
            </h2>
            
            {/* Location Button */}
            <button
              onClick={requestLocation}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mb-4"
            >
              <Navigation size={24} />
              Use My Location
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Zip Code Input */}
            <form onSubmit={handleZipCodeSearch} className="flex gap-2">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZIP code"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                maxLength="5"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all font-bold shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </form>
          </div>

          {/* View Toggle: Map vs List */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-purple-100 flex gap-2">
            <button
              onClick={() => setMapView(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                !mapView 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List size={20} />
              List View
            </button>
            <button
              onClick={() => setMapView(true)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                mapView 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Map size={20} />
              Map View
            </button>
          </div>

          {/* Map View */}
          {mapView ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-100">
              <div 
                ref={mapRef} 
                className="w-full h-[500px]"
              />
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                <p className="text-sm text-gray-600 text-center">
                  📍 Click on a marker to see bar details and view menu
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-purple-100">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bars by name or address..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                  />
                </div>
              </div>

              {/* Bars List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="text-purple-600" size={24} />
                  Nearby Bars ({filteredBars.length})
                </h3>
                
                {filteredBars.map(bar => (
                  <div
                    key={bar.id}
                    onClick={() => setSelectedBar(bar)}
                    onMouseEnter={() => setHoveredBar(bar.id)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className={`bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all cursor-pointer border-2 ${
                      hoveredBar === bar.id ? 'border-purple-400 scale-105' : 'border-purple-100'
                    } transform group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-6xl">{bar.image}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                              {bar.name}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <MapPin size={14} />
                              {bar.address}
                            </p>
                          </div>
                          <ChevronRight className="text-purple-600 group-hover:translate-x-1 transition-transform" size={28} />
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                            <Star size={16} fill="#FCD34D" className="text-yellow-400" />
                            <span className="font-bold text-gray-800">{bar.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-full">
                            <MapPin size={16} className="text-purple-600" />
                            <span className="font-semibold text-purple-700">{bar.distance} mi away</span>
                          </div>
                          <div className="bg-green-50 px-3 py-1 rounded-full">
                            <span className="font-semibold text-green-700">Open Now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Customer Menu View (same as before)
  const CustomerView = () => {
    if (!selectedBar) return <BarSelectionView />;

    const categories = [...new Set(selectedBar.menu.map(item => item.category))];
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredMenu = selectedCategory === 'All' 
      ? selectedBar.menu 
      : selectedBar.menu.filter(item => item.category === selectedCategory);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white p-5 sticky top-0 z-10 shadow-2xl">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <div className="flex-1">
              <button
                onClick={() => setSelectedBar(null)}
                className="text-sm opacity-90 hover:opacity-100 flex items-center gap-1 mb-2 bg-white/20 px-3 py-1 rounded-full"
              >
                ← Change Bar
              </button>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <span className="text-3xl">{selectedBar.image}</span>
                {selectedBar.name}
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
            <CheckCircle size={28} />
            <div>
              <p className="font-bold text-lg">Order Placed!</p>
              <p className="text-sm opacity-90">Your drinks are being prepared</p>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-[100px] z-10 shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4 flex gap-2 overflow-x-auto">
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

        {/* Cart Overlay - same as before */}
        {showCart && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full md:max-w-2xl md:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 flex justify-between items-center shadow-lg z-10">
                <div>
                  <h2 className="text-2xl font-bold">Your Order</h2>
                  <p className="text-sm opacity-90">{selectedBar.name} • {cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
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

  // Staff View - simplified
  const StaffView = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-2xl shadow-xl mb-8">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-sm opacity-90 mt-1">Manage incoming orders</p>
        </div>
        <div className="text-center text-gray-600">
          <Clock size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl font-semibold">No orders yet</p>
          <p className="text-sm">Orders will appear here once customers start ordering</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Google Maps Script */}
      {!window.google && (
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`}
          async
          defer
        />
      )}

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
