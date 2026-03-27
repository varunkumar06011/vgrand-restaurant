import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import FunctionHallPage from './pages/FunctionHallPage';
import ContactPage from './pages/ContactPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />
  },
  {
    name: 'Menu',
    path: '/menu',
    element: <MenuPage />
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <CheckoutPage />
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    element: <PaymentSuccessPage />
  },
  {
    name: 'Order Success',
    path: '/order-success',
    element: <OrderSuccessPage />
  },
  {
    name: 'Function Hall',
    path: '/function-hall',
    element: <FunctionHallPage />
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <ContactPage />
  }
];

export default routes;
