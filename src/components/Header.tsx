"use client";

import React, { useState } from 'react';
import { useAppContext } from '../context/StateContext';

interface HeaderProps {
  onNavigate?: (view: 'home' | 'saved' | 'playlists' | 'history' | 'scan-history' | 'login' | 'signup' | 'about' | 'contact') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate = () => {} }) => {
  const { user, logout, switchToChildMode, isHydrated } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-6 px-12 bg-[#FEFDF0]">
      <h1
        className="text-2xl font-bold text-purple-600 cursor-pointer"
        onClick={() => onNavigate('home')}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter') onNavigate('home'); }}
      >
        Prismora
      </h1>
      {isHydrated && (
        <nav>
          <ul className="flex items-center space-x-8 text-gray-600 font-medium">
          <li>
            <span
              className="hover:text-purple-600 transition-colors cursor-pointer"
              onClick={() => onNavigate('home')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') onNavigate('home'); }}
            >
              Home
            </span>
          </li>
          <li>
            <span
              className="hover:text-purple-600 transition-colors cursor-pointer"
              onClick={() => onNavigate('about')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') onNavigate('about'); }}
            >
              About us
            </span>
          </li>
          <li>
            <span
              className="hover:text-purple-600 transition-colors cursor-pointer"
              onClick={() => onNavigate('contact')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') onNavigate('contact'); }}
            >
              Contact us
            </span>
          </li>
          {user ? (
            <>
              <li>
                <span
                  className="hover:text-purple-600 transition-colors cursor-pointer"
                  onClick={() => onNavigate('saved')}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === 'Enter') onNavigate('saved'); }}
                >
                  Saved Videos
                </span>
              </li>
              <li className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
                  Account
                  <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <li>
                      <span
                        onClick={() => { onNavigate('playlists'); setDropdownOpen(false); }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => { if (e.key === 'Enter') { onNavigate('playlists'); setDropdownOpen(false); } }}
                      >
                        Playlists
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={() => { onNavigate('history'); setDropdownOpen(false); }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => { if (e.key === 'Enter') { onNavigate('history'); setDropdownOpen(false); } }}
                      >
                        Watching History
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={() => { onNavigate('scan-history'); setDropdownOpen(false); }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => { if (e.key === 'Enter') { onNavigate('scan-history'); setDropdownOpen(false); } }}
                      >
                        Scan History
                      </span>
                    </li>
                    <li>
                      <button onClick={() => { switchToChildMode(); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Switch to Child Mode</button>
                    </li>
                    <li><hr className="my-1"/></li>
                    <li>
                      <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Logout</button>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                <span
                  className="hover:text-purple-600 transition-colors cursor-pointer"
                  onClick={() => onNavigate('login')}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === 'Enter') onNavigate('login'); }}
                >
                  Login
                </span>
              </li>
              <li>
                <span
                  className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-gray-700 cursor-pointer"
                  onClick={() => onNavigate('signup')}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === 'Enter') onNavigate('signup'); }}
                >
                  Sign Up
                </span>
              </li>
            </>
          )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
