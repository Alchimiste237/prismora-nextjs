"use client";

import React from 'react';
import Header from './Header';
import { useAppContext } from '../context/StateContext';
import { useRouter } from 'next/navigation';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  const router = useRouter();

  const onNavigate = (view: 'home' | 'saved' | 'playlists' | 'history' | 'login' | 'signup' | 'about' | 'contact') => {
    switch (view) {
      case 'home':
        router.push('/');
        break;
      case 'saved':
        router.push('/saved');
        break;
      case 'playlists':
        router.push('/playlists');
        break;
      case 'history':
        router.push('/history');
        break;
      case 'login':
        router.push('/login');
        break;
      case 'signup':
        router.push('/signup');
        break;
      case 'about':
        router.push('/about');
        break;
      case 'contact':
        router.push('/contact');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen font-sans">       
      <div className="flex-1 bg-[#FEFDF0] overflow-y-auto">
        <Header onNavigate={onNavigate} />
        <main className="max-w-4xl mx-auto px-8 py-16 text-center">
            {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
