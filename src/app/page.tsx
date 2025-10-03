
"use client";

import React, { useState, useCallback } from 'react';
import { analyzeVideoContent } from '../services/geminiService';
import { getVideoDetails, searchVideos } from '@/services/youtubeService';
import type { AnalysisReport, Video, VideoDetails } from '@/types';
import { useAppContext } from '@/context/StateContext';
import URLInputForm from '../../components/URLInputForm';
import Loader from '../../components/Loader';
import ScanResult from '../../components/ScanResult';
import ErrorDisplay from '../../components/ErrorDisplay';
import SearchResults from '@/../components/SearchResults';
import VideoPlayer from '../components/VideoPlayer';

function extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const HomePage: React.FC = () => {
  const {
    user,
    setVideoToAddToPlaylist,
    analysisResult,
    setAnalysisResult,
    videoDetails,
    setVideoDetails,
    currentUrl,
    setCurrentUrl,
    searchResults,
    setSearchResults,
    addToScanHistory,
  } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideoForPlayer, setSelectedVideoForPlayer] = useState<VideoDetails | null>(null);

  const performAnalysis = useCallback(async (videoId: string, details: VideoDetails) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setSearchResults([]);
    setError(null);
    setCurrentUrl(`https://www.youtube.com/watch?v=${videoId}`);
    setVideoDetails(details);

    try {
      const resultJsonString = await analyzeVideoContent(details.title, details.channelTitle);
      const cleanedJson = resultJsonString.replace(/```json\n|```/g, '').trim();
      const result: Omit<AnalysisReport, 'videoTitle' | 'channelName'> = JSON.parse(cleanedJson);
      
      const fullResult = {
          ...result,
          videoTitle: details.title,
          channelName: details.channelTitle,
      };

      setAnalysisResult(fullResult);

      // Add to scan history if user is logged in
      if (user) {
        addToScanHistory({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          analysisResult: fullResult,
          videoDetails: details,
        });
      }

    } catch (err) {
      console.error("Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to analyze the video. ${errorMessage} Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleVideoSelect = useCallback((video: VideoDetails) => {
      if (!user) {
        alert("Please log in to view videos directly on the platform.");
        return;
      }
      setSelectedVideoForPlayer(video);
  }, [user]);

  const handleScanOption = useCallback(async (option: 'quick' | 'detailed') => {
    if (!selectedVideoForPlayer) return;
    setSelectedVideoForPlayer(null); // Hide player, show loading
    await performAnalysis(selectedVideoForPlayer.id, selectedVideoForPlayer);
  }, [selectedVideoForPlayer, performAnalysis]);

  const handleDelete = useCallback(() => {
    setAnalysisResult(null);
    setVideoDetails(null);
    setCurrentUrl('');
    setSelectedVideoForPlayer(null);
  }, []);

  const handleSubmit = useCallback(async (query: string) => {
    const videoId = extractVideoId(query);
    
    // Clear previous results
    setError(null);
    setAnalysisResult(null);
    setVideoDetails(null);
    setSearchResults([]);
    setSelectedVideoForPlayer(null);
    setIsLoading(true);

    try {
      if (videoId) {
        // It's a URL, fetch details and analyze
        const details = await getVideoDetails(videoId);
        await performAnalysis(videoId, details);
      } else {
        // It's a search query
        const results = await searchVideos(query);
        setSearchResults(results);
      }
    } catch (err) {
        console.error("Submission failed:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`An error occurred. ${errorMessage} Please try again.`);
    } finally {
        setIsLoading(false);
    }
  }, [performAnalysis]);

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (error) return <ErrorDisplay message={error} />;

    if (selectedVideoForPlayer) {
      return <VideoPlayer videoDetails={selectedVideoForPlayer} onScanOption={handleScanOption} isLoading={isLoading} />;
    }

    if (analysisResult && videoDetails && currentUrl) {
      return <ScanResult
        result={analysisResult}
        videoDetails={videoDetails}
        url={currentUrl}
        user={user}
        onAddToPlaylistRequest={(video: Video) => setVideoToAddToPlaylist(video)}
        onDelete={handleDelete}
      />;
    }

    if (searchResults.length > 0) {
        return <SearchResults results={searchResults} onVideoSelect={handleVideoSelect} />
    }

    return (
      <>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">Empowering Parents,</h1>
        <h1 className="text-5xl md:text-6xl font-bold text-purple-600 mt-2">Protecting Children</h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">Take control of your child's digital world with AI-powered content filtering, smart monitoring, and personalized playlists. Keep them safe while they explore and learn.</p>
        <button className="mt-8 bg-purple-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">Learn More</button>
      </>
    );
  };
  
  return (
    <>
        <div className="mb-12">
            <p className="text-gray-600 mb-2">paste a YouTube video link to scan</p>
            <div className="mt-4 max-w-xl mx-auto">
                <URLInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
        {renderContent()}
    </>
  );
};

export default HomePage;
