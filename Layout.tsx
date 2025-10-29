import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Extract page info from URL or use a default
  const [currentPage, setCurrentPage] = useState('home');

  // This is a simplified approach - in a real app you'd use proper routing
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // In a real app, you'd handle navigation here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}