# Bar Order App - Deployment Guide

## 🍹 What You've Got

A complete bar ordering app with:
- **Customer View**: QR code access, browse menu, add to cart, pay
- **Staff Dashboard**: See and manage incoming orders in real-time
- **Payment Ready**: Stripe integration (currently in demo mode)

## 🚀 Quick Deploy to Vercel (Free)

### Step 1: Download Your Files
All your files are ready in the outputs folder.

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click "Add New Project"
3. Drag and drop your entire project folder OR:
   - Connect your GitHub account
   - Push these files to a new repo
   - Import that repo in Vercel
4. Vercel will auto-detect it's a Vite app
5. Click "Deploy"
6. Done! Your app will be live in ~2 minutes

**Your URL will be**: `your-app-name.vercel.app`

---

## 📱 How to Use It

### For Customers (QR Code Setup)
1. Your deployed URL is the base: `https://your-app.vercel.app`
2. Add table number to URL: `https://your-app.vercel.app?table=5`
3. Generate QR codes for each table pointing to their specific URL
4. Print and place QR codes on tables

**Free QR Code Generator**: [qr-code-generator.com](https://www.qr-code-generator.com)

### For Staff
Navigate to your app and click the "Staff" button in the bottom-right corner to see the dashboard.

---

## 💳 Adding Real Stripe Payments

Right now, the app simulates payments. To add real Stripe:

### Step 1: Get Stripe Account
1. Sign up at [stripe.com](https://stripe.com)
2. Get your **Publishable Key** from the Dashboard

### Step 2: Install Stripe
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Step 3: Replace Mock Payment
In `src/bar-order-app.jsx`, find the `handleCheckout` function and replace with real Stripe checkout flow.

**Example Stripe Integration** (simplified):
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key');

const handleCheckout = async () => {
  const stripe = await stripePromise;
  
  // Call your backend to create a payment intent
  const response = await fetch('/api/create-payment', {
    method: 'POST',
    body: JSON.stringify({
      amount: getCartTotal() * 100, // Stripe uses cents
      items: cart
    })
  });
  
  const { clientSecret } = await response.json();
  
  // Redirect to Stripe checkout
  await stripe.confirmPayment({
    clientSecret,
    confirmParams: {
      return_url: window.location.origin + '/success',
    },
  });
};
```

You'll need a backend API endpoint (`/api/create-payment`) - can deploy serverless on Vercel!

---

## 🛠 Running Locally

Want to test before deploying?

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open `http://localhost:5173?table=1` in your browser.

---

## 🎨 Customization Ideas

### Change Menu Items
Edit the `mockBackend.menu` array in `src/bar-order-app.jsx`:
```javascript
{ id: 1, name: 'Your Drink', price: 10, category: 'Category', image: '🍸' }
```

### Add Your Branding
- Change "The Cozy Bar" to your bar name
- Update colors in the gradient classes (e.g., `from-purple-600` → `from-blue-600`)
- Add your logo image

### Add Backend
Currently everything is frontend-only. To persist orders:
1. Add a database (Supabase, Firebase, or PostgreSQL)
2. Replace `mockBackend` with API calls
3. Add authentication for staff dashboard

---

## 📊 Next Steps

**For Production:**
- [ ] Connect real Stripe payments
- [ ] Add backend/database for order persistence
- [ ] Set up staff authentication
- [ ] Add order notifications (SMS/email)
- [ ] Analytics tracking
- [ ] Tips/gratuity option

**Advanced Features:**
- [ ] Kitchen printer integration
- [ ] Split payments
- [ ] Loyalty program
- [ ] Drink customization (ice, garnishes)
- [ ] Age verification for alcohol

---

## 🆘 Need Help?

**Common Issues:**
- Build fails? Run `npm install` first
- QR codes not working? Make sure URL includes `?table=X`
- Styling broken? Check that Tailwind is installed

**File Structure:**
```
bar-order-app/
├── src/
│   ├── bar-order-app.jsx  (main app)
│   ├── main.jsx           (entry point)
│   └── index.css          (styles)
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 💡 Pro Tips

1. **Test with ?table=1**: Always test customer view with a table number in URL
2. **Mobile First**: App is designed for phones, test on actual devices
3. **Staff View**: Toggle views with the button (remove in production)
4. **Demo Mode**: Current payment is simulated - perfect for testing!

---

**Questions?** The code is well-commented. Check `src/bar-order-app.jsx` for details!

🍻 Happy ordering!
