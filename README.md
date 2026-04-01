# V Grand Restaurant - Premium Ordering & Management Platform 👑

V Grand Restaurant is a modern, high-performance web application designed for the "Raja of Biryanis" in Ongole. This production-ready platform combines a premium user-facing ordering site with a robust real-time management dashboard.

## 🚀 Live Features

### 🤖 Intelligent AI Chatbot
- **Automated Reservations**: A step-by-step conversational flow for booking tables, collecting guest counts, and pre-ordering special dishes.
- **Dual-Layer Architecture**: Uses Supabase Edge Functions for intelligent parsing with a robust local state-machine fallback.
- **Real-time Status**: Instantly notifies users via the chat interface when an admin approves or rejects their reservation.

### 🛡️ Real-time Admin Dashboard
- **Live Order Management**: Track and manage incoming orders as they happen.
- **Reservation Control**: Approve or reject table bookings with one click, triggering instant customer notifications.
- **Menu Management**: Real-time control over item availability, pricing, and "Bestseller" status.
- **Review Moderation**: Seamlessly manage customer feedback before it goes live.

### ✨ Premium User Experience
- **Royal Luxury Aesthetic**: A high-end visual identity featuring deep "Biryani Red," "Royal Gold," and sleek dark themes.
- **Biryani Specialization**: High-impact "Biryani Frames" and hero sections dedicated to signature dishes like the "Kumbhakarna Biryani."
- **Smart Logistics**: Integrated distance-based delivery fee calculations and automated guest checkouts.
- **WhatsApp Integration**: Direct-to-WhatsApp ordering and customer support buttons.

## 🛠️ Tech Stack

### Frontend & UI
- **React (v18)** + **TypeScript**: Robust, type-safe functional components.
- **Vite**: Ultra-fast build tool for optimal performance.
- **Tailwind CSS**: Utility-first styling for a completely responsive layout.
- **Radix UI + Shadcn/UI**: Premium, accessible UI components.
- **Framer Motion**: Smooth animations and high-quality transitions.

### Backend & Infrastructure
- **Supabase (BaaS)**: 
  - **PostgreSQL**: Structured data storage.
  - **Realtime**: Instant sync between Admin and User interfaces.
  - **Edge Functions**: Serverless logic for Chatbot and Payment processing.
- **Zod + React Hook Form**: Strict schema validation and efficient form management.
- **Lucide React**: Modern iconography.

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
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```text
├── src/
│   ├── admin/         # Real-time Management Dashboard
│   ├── components/    # UI Components (chatbot, restaurant, ui helpers)
│   ├── contexts/      # Global state management (Cart, Chat, Auth)
│   ├── db/            # Supabase & API logic (api.ts, supabase.ts)
│   ├── services/      # Business logic (chatbotService.ts)
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components (Home, Menu, FunctionHall)
│   └── main.tsx       # Application entry point
├── supabase/          # Edge Functions & Database migrations
└── tailwind.config.js # Custom design tokens & theme
```

## 📄 License
Internal use only. Developed for **V Grand Restaurant - Raja of Biryanis.**
