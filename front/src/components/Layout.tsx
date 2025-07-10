import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-white">
    <Header />
    <main className='pt-20  text-white'>{children}</main>
    <div className='fixed top-0 w-screen h-screen bg-gray-900 z-[-20]'/>
    <Footer />
  </div>
);

export default Layout;