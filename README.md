# V Grand Restaurant - Premium Ordering Platform

V Grand Restaurant is a modern, production-ready web application for restaurant ordering, specifically tailored for the "Raja of Biryanis" in Ongole. Built with a focus on speed, mobile responsiveness, and seamless user experience.

## 🚀 Live Demo
The application is currently configured for local development and testing.

## ✨ Features

- **Biryani Specialization**: Highlights signature dishes like Mutton Biryani and the "Special Kumbhakarna Biryani."
- **Seamless Ordering**: Streamlined guest checkout flow without the need for mandatory authentication.
- **Dynamic Cart**: Real-time shopping bag integration with live item counts and persistent state.
- **Smart Delivery Fees**: Automated distance-based delivery fee calculation logic:
  - **Free**: Within 10km for orders over ₹300.
  - **₹30**: Within 10km for orders under ₹300.
  - **₹50**: Beyond 10km or for far locations.
- **Order Tracking**: "My Orders" page for tracking order history via phone number.
- **WhatsApp Integration**: Direct "Order on WhatsApp" functionality for quick customer support and alternate ordering.
- **Mobile-First Design**: Fully responsive UI with sticky navigation and premium aesthetics (#0F0F0F Dark, #8B0000 Red, #D4AF37 Gold).

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **State Management**: React Context & Hooks
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Icons**: Lucide React
- **Animations**: Motion

## 📦 Getting Started

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/varunkumar06011/vgrand-restaurant.git
   cd vgrand-restaurant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Run the development server:
   ```bash
   npx vite --host 127.0.0.1
   ```
   Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.

## 📁 Project Structure

```text
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-level components (Home, Menu, Checkout, My Orders)
│   ├── context/       # Global state management
│   ├── services/      # Supabase & API interaction logic
│   ├── layout/        # Shared layouts (Navbar, Footer)
│   ├── lib/           # Utility functions (cn, delivery fee logic)
│   ├── types/         # TypeScript definitions
│   └── main.tsx       # Entry point
├── supabase/          # Database migrations & schemas
├── public/            # Static assets
└── tailwind.config.js # Styling configurations
```

## 🛡️ Security & Quality
- **Audit**: Zero high-risk vulnerabilities found in dependency audit.
- **Linting**: Biome-based linting for code quality.
- **Safety**: Null/undefined safety checks implemented across all data-driven components.

## 📄 License
Internal use only.

---
Developed for **V Grand Restaurant - Raja of Biryanis.**
