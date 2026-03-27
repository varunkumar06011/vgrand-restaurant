import React from 'react';
import TopNavigation from '@/components/restaurant/TopNavigation';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import WhatsAppButton from '@/components/restaurant/WhatsAppButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopNavigation />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <BottomNavigation />
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
