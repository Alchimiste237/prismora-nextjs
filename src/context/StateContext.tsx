
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import type { User, Playlist, Video, AnalysisReport, VideoDetails } from '@/types';

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
  analysisResult: AnalysisReport | null;
  videoDetails: VideoDetails | null;
  currentUrl: string;
  searchResults: VideoDetails[];
  history: Video[];
  scanHistory: any[];
  isHydrated: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchToChildMode: () => void;
  switchToParentMode: () => void;
  setVideoToAddToPlaylist: (video: Video | null) => void;
  handleAddToPlaylist: (playlistId: string) => void;
  createPlaylist: (name: string) => Promise<void>;
  setAnalysisResult: (result: AnalysisReport | null) => void;
  setVideoDetails: (details: VideoDetails | null) => void;
  setCurrentUrl: (url: string) => void;
  setSearchResults: (results: VideoDetails[]) => void;
  addToHistory: (video: Video) => void;
  addToScanHistory: (scan: any) => void;
  clearScanHistory: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [mode, setMode] = useState<'parent' | 'child'>('parent');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [videoToAddToPlaylist, setVideoToAddToPlaylist] = useState<Video | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisReport | null>(null);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [searchResults, setSearchResults] = useState<VideoDetails[]>([]);
  const [history, setHistory] = useState<Video[]>([]);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load playlists and history when user is set
  useEffect(() => {
    if (user) {
      const loadPlaylists = async () => {
        try {
          const response = await fetch(`/api/playlists?userId=${user.id}`);
          const data = await response.json();
          if (data.success) {
            setPlaylists(data.playlists);
          } else {
            console.error('Failed to fetch playlists:', data.message);
            setPlaylists([]);
          }
        } catch (error) {
          console.error('Error fetching playlists:', error);
          setPlaylists([]);
        }
      };

      const loadHistory = async () => {
        try {
          const response = await fetch(`/api/history?userId=${user.id}`);
          const data = await response.json();
          if (data.success) {
            setHistory(data.history);
          } else {
            console.error('Failed to fetch history:', data.message);
            setHistory([]);
          }
        } catch (error) {
          console.error('Error fetching history:', error);
          setHistory([]);
        }
      };

      const loadScanHistory = async () => {
        try {
          const response = await fetch(`/api/scan-history?userId=${user.id}`);
          const data = await response.json();
          if (data.success) {
            setScanHistory(data.scanHistory);
          } else {
            console.error('Failed to fetch scan history:', data.message);
            setScanHistory([]);
          }
        } catch (error) {
          console.error('Error fetching scan history:', error);
          setScanHistory([]);
        }
      };

      loadPlaylists();
      loadHistory();
      loadScanHistory();
    } else {
      setPlaylists([]);
      setHistory([]);
      setScanHistory([]);
    }
  }, [user]);

  // Set hydrated after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const login = async (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    // Fetch playlists from backend
    try {
      const response = await fetch(`/api/playlists?userId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        if (data.playlists.length === 0) {
          // Create default playlists
          const defaultPlaylists = [
            { name: 'Weekend Cartoons', videos: [] },
            { name: 'Educational Clips', videos: [] },
          ];
          for (const pl of defaultPlaylists) {
            await fetch('/api/playlists', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id, name: pl.name }),
            });
          }
          // Refetch
          const refetchResponse = await fetch(`/api/playlists?userId=${user.id}`);
          const refetchData = await refetchResponse.json();
          setPlaylists(refetchData.success ? refetchData.playlists : []);
        } else {
          setPlaylists(data.playlists);
        }
      } else {
        console.error('Failed to fetch playlists:', data.message);
        setPlaylists([]); // Fallback to empty
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]); // Fallback
    }
  };

  const logout = () => {
    setUser(null);
    setPlaylists([]);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const switchToChildMode = () => {
    setMode('child');
  };

  const switchToParentMode = useCallback(async () => {
    const password = prompt("Please enter your password to return to Parent Mode:");
    if (!password) return;
    if (!user) return;

    try {
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, password }),
      });
      const data = await response.json();
      if (data.success) {
        setMode('parent');
      } else {
        alert("Incorrect password.");
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      alert('An error occurred. Please try again.');
    }
  }, [user]);

  const handleAddToPlaylist = useCallback(async (playlistId: string) => {
    if (!videoToAddToPlaylist || !user) return;

    try {
      const response = await fetch('/api/playlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          playlistId,
          video: videoToAddToPlaylist,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Video "${videoToAddToPlaylist.videoTitle}" added to playlist!`);
        // Refetch playlists to update state
        const playlistsResponse = await fetch(`/api/playlists?userId=${user.id}`);
        const playlistsData = await playlistsResponse.json();
        if (playlistsData.success) {
          setPlaylists(playlistsData.playlists);
        }
      } else {
        alert(data.message || 'Failed to add video to playlist');
      }
    } catch (error) {
      console.error('Add to playlist error:', error);
      alert('An error occurred while adding the video to playlist');
    }

    setVideoToAddToPlaylist(null); // Close the modal
  }, [videoToAddToPlaylist, user]);

  const addToHistory = useCallback(async (video: Video) => {
    if (!user) return;
    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, video }),
      });
      const data = await response.json();
      if (data.success) {
        setHistory(prev => [video, ...prev]); // Add to front
      } else {
        console.error('Failed to add to history:', data.message);
      }
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  }, [user]);

  const addToScanHistory = useCallback(async (scan: any) => {
    if (!user) return;
    try {
      const response = await fetch('/api/scan-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...scan }),
      });
      const data = await response.json();
      if (data.success) {
        setScanHistory(prev => [scan, ...prev]); // Add to front
      } else {
        console.error('Failed to add to scan history:', data.message);
      }
    } catch (error) {
      console.error('Error adding to scan history:', error);
    }
  }, [user]);

  const clearScanHistory = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/scan-history?userId=${user.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setScanHistory([]);
      } else {
        console.error('Failed to clear scan history:', data.message);
      }
    } catch (error) {
      console.error('Error clearing scan history:', error);
    }
  }, [user]);

  const createPlaylist = useCallback(async (name: string) => {
    if (!user) return;
    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name }),
      });
      const data = await response.json();
      if (data.success) {
        setPlaylists(prev => [...prev, data.playlist]);
      } else {
        console.error('Failed to create playlist:', data.message);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  }, [user]);

  const value = {
    user,
    mode,
    playlists,
    videoToAddToPlaylist,
    analysisResult,
    videoDetails,
    currentUrl,
    searchResults,
    history,
    scanHistory,
    isHydrated,
    login,
    logout,
    switchToChildMode,
    switchToParentMode,
    setVideoToAddToPlaylist,
    handleAddToPlaylist,
    createPlaylist,
    setAnalysisResult,
    setVideoDetails,
    setCurrentUrl,
    setSearchResults,
    addToHistory,
    addToScanHistory,
    clearScanHistory,
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
