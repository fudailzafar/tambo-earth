import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-[#E0F2FE] overflow-hidden font-sans">
      {children}
    </div>
  );
};

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-[300px] md:w-[400px] lg:w-[450px] xl:w-[500px] h-full bg-white flex flex-col shadow-xl z-10 shrink-0">
      {children}
    </div>
  );
};

export const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex-1 relative h-full">
      {children}
    </div>
  );
};
