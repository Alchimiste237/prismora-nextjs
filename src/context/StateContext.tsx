
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { User, Playlist, Video } from '@/types';

// Mock Data
const MOCK_USER: User = { id: '1', email: 'parent@prismora.com', name: 'N' };
const MOCK_PLAYLISTS: Playlist[] = [
  { id: 'pl1', name: 'Weekend Cartoons', videos: [] },
  { id: 'pl2', name: 'Educational Clips', videos: [] },
];

interface StateContextType {
  user: User | null;
  mode: 'parent' | 'child';
  playlists: Playlist[];
  videoToAddToPlaylist: Video | null;
  login: () => void;
  logout: () => void;
  switchToChildMode: () => void;
  switchToParentMode: () => void;
  setVideoToAddToPlaylist: (video: Video | null) => void;
  handleAddToPlaylist: (playlistId: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<'parent' | 'child'>('parent');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [videoToAddToPlaylist, setVideoToAddToPlaylist] = useState<Video | null>(null);

  const login = () => {
    setUser(MOCK_USER);
    setPlaylists(MOCK_PLAYLISTS);
  };

  const logout = () => {
    setUser(null);
    setPlaylists([]);
  };

  const switchToChildMode = () => {
    setMode('child');
  };

  const switchToParentMode = () => {
    const password = prompt("Please enter your password to return to Parent Mode:");
    if (password === 'password') { // In a real app, this should be a secure check
      setMode('parent');
    } else {
      alert("Incorrect password.");
    }
  };

  const handleAddToPlaylist = useCallback((playlistId: string) => {
    if (!videoToAddToPlaylist) return;
    console.log(`Adding video ${videoToAddToPlaylist.videoTitle} to playlist ${playlistId}`);
    alert(`Video "${videoToAddToPlaylist.videoTitle}" added to playlist!`);
    // Here you would update the playlist state, e.g., call an API
    setVideoToAddToPlaylist(null); // Close the modal
  }, [videoToAddToPlaylist]);

  const value = {
    user,
    mode,
    playlists,
    videoToAddToPlaylist,
    login,
    logout,
    switchToChildMode,
    switchToParentMode,
    setVideoToAddToPlaylist,
    handleAddToPlaylist,
  };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};

export const useAppContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a StateProvider');
  }
  return context;
};
