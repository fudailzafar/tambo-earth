import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden font-sans">
      {children}
    </div>
  );
};

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="absolute top-4 right-4 bottom-4 w-[380px] bg-white rounded-3xl shadow-2xl z-20 flex flex-col overflow-hidden border border-white/50 backdrop-blur-sm">
      {children}
    </div>
  );
};

export const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-[400px] z-0">
      {children}
    </div>
  );
};
