import React, { useState, useCallback } from 'react';
import { analyzeVideoContent } from './services/geminiService';
import { getVideoDetails } from './services/youtubeService';
import type { AnalysisReport, User, Video, Playlist, VideoDetails } from './types';
import Header from './components/Header';
import URLInputForm from './components/URLInputForm';
import Loader from './components/Loader';
import ScanResult from './components/ScanResult';
import ErrorDisplay from './components/ErrorDisplay';
import SavedVideos from './components/SavedVideos';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Playlists from './components/Playlists';
import History from './components/History';
import ChildView from './components/ChildView';
import AddToPlaylistModal from './components/AddToPlaylistModal';

// Mock Data
const MOCK_USER: User = { id: '1', email: 'parent@prismora.com', name: 'N' };
const MOCK_PLAYLISTS: Playlist[] = [
  { id: 'pl1', name: 'Weekend Cartoons', videos: [] },
  { id: 'pl2', name: 'Educational Clips', videos: [] },
];

function extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisReport | null>(null);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  
  const [view, setView] = useState<'home' | 'saved' | 'playlists' | 'history' | 'login' | 'signup'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<'parent' | 'child'>('parent');
  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [videoToAddToPlaylist, setVideoToAddToPlaylist] = useState<Video | null>(null);

  const handleLogin = () => {
    setUser(MOCK_USER);
    setPlaylists(MOCK_PLAYLISTS);
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setPlaylists([]);
    setView('home');
  };

  const handleNavigate = (targetView: 'home' | 'saved' | 'playlists' | 'history' | 'login' | 'signup') => {
    setView(targetView);
    setAnalysisResult(null);
    setVideoDetails(null);
    setError(null);
    setCurrentUrl('');
  };

  const handleSwitchToChildMode = () => {
    setMode('child');
  };

  const handleSwitchToParentMode = () => {
    const password = prompt("Please enter your password to return to Parent Mode:");
    if (password === 'password') {
      setMode('parent');
    } else {
      alert("Incorrect password.");
    }
  };

  const handleAddToPlaylist = useCallback((playlistId: string) => {
    if (!videoToAddToPlaylist) return;
    console.log(`Adding video ${videoToAddToPlaylist.videoTitle} to playlist ${playlistId}`);
    alert(`Video "${videoToAddToPlaylist.videoTitle}" added to playlist!`);
    setVideoToAddToPlaylist(null);
  }, [videoToAddToPlaylist]);

  const handleSubmit = useCallback(async (url: string) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("Invalid YouTube URL. Please check the link and try again.");
      return;
    }
    
    setView('home');
    setIsLoading(true);
    setAnalysisResult(null);
    setVideoDetails(null);
    setError(null);
    setCurrentUrl(url);

    try {
      const details = await getVideoDetails(videoId);
      setVideoDetails(details);

      const resultJsonString = await analyzeVideoContent(details.title, details.channelTitle);
      const cleanedJson = resultJsonString.replace(/```json\n|```/g, '').trim();
      const result: Omit<AnalysisReport, 'videoTitle' | 'channelName'> = JSON.parse(cleanedJson);
      
      setAnalysisResult({
          ...result,
          videoTitle: details.title,
          channelName: details.channelTitle,
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setError(`Failed to analyze the video. ${errorMessage} Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderMainContent = () => {
    switch (view) {
      case 'login':
        return <Login />;
      case 'signup':
        return <SignUp />;
      case 'saved':
        return <SavedVideos />;
      case 'playlists':
        return <Playlists playlists={playlists} />;
      case 'history':
        return <History />;
      case 'home':
      default:
        if (isLoading) return <Loader />;
        if (error) {
          return (
            <>
              <ErrorDisplay message={error} />
              <div className="mt-12">
                <p className="text-gray-600 mb-2">Try Scanning a YouTube Video link</p>
                <div className="mt-4 max-w-xl mx-auto">
                  <URLInputForm onSubmit={handleSubmit} isLoading={isLoading} />
                </div>
              </div>
            </>
          );
        }
        if (analysisResult && videoDetails && currentUrl) {
          return <ScanResult result={analysisResult} videoDetails={videoDetails} url={currentUrl} user={user} onAddToPlaylistRequest={(video: Video) => setVideoToAddToPlaylist(video)} />;
        }
        return (
          <>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">Empowering Parents,</h1>
            <h1 className="text-5xl md:text-6xl font-bold text-purple-600 mt-2">Protecting Children</h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">Take control of your child's digital world with AI-powered content filtering, smart monitoring, and personalized playlists. Keep them safe while they explore and learn.</p>
            <div className="mt-12">
              <p className="text-gray-600 mb-2">Try Scanning a YouTube Video link</p>
              <div className="mt-4 max-w-xl mx-auto">
                <URLInputForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            </div>
            <button className="mt-8 bg-purple-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">Learn More</button>
          </>
        );
    }
  };

  if (mode === 'child' && user) {
    return <ChildView playlists={playlists} onSwitchToParentMode={handleSwitchToParentMode} />;
  }

  return (
    <div className="flex min-h-screen font-sans">
      <aside className="w-16 bg-[#4A5568] flex flex-col items-center py-6 space-y-8 flex-shrink-0">
        <div className="w-8 h-8 bg-purple-400 rounded-md flex items-center justify-center text-white font-bold text-lg">*</div>
        <div className="w-8 h-8 bg-gray-500 rounded-full opacity-75"></div>
        <div className="w-8 h-8 bg-gray-500 rounded-full opacity-75"></div>
        <div className="w-8 h-8 bg-gray-500 rounded-full opacity-75"></div>
        <div className="mt-auto flex flex-col items-center space-y-4 pt-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-semibold">{user ? user.name : 'G'}</div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
      </aside>
      
      <div className="flex-1 bg-[#FEFDF0] overflow-y-auto">
        <main className="max-w-4xl mx-auto px-8 py-16 text-center">
            {renderMainContent()}
        </main>
      </div>

      {videoToAddToPlaylist && (
        <AddToPlaylistModal
          playlists={playlists}
          onClose={() => setVideoToAddToPlaylist(null)}
          onAddToPlaylist={handleAddToPlaylist}
        />
      )}
    </div>
  );
};

export default App;