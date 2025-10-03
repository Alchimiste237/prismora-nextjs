import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/StateContext';
import type { AnalysisReport, Video, User, VideoDetails } from '../../types';
import { CATEGORY_LABELS } from '../../types';
import ProgressBar from './ProgressBar';

interface ScanResultProps {
  result: AnalysisReport;
  videoDetails: VideoDetails;
  url: string;
  user: User | null;
  onAddToPlaylistRequest: (video: Video) => void;
}

const getPrimaryConcern = (report: AnalysisReport) => {
  const scores: { [key in keyof Omit<AnalysisReport, 'videoTitle'|'channelName'>]: number } = {
    adultVisuals: report.adultVisuals,
    aggressiveBehavior: report.aggressiveBehavior,
    nonTraditionalRelationships: report.nonTraditionalRelationships,
    inappropriateLanguage: report.inappropriateLanguage,
    lgbtqRepresentation: report.lgbtqRepresentation,
  };

  const highestCategory = Object.keys(scores).reduce((a, b) => scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b) as keyof typeof scores;
  
  return {
    label: CATEGORY_LABELS[highestCategory],
    percentage: report[highestCategory],
  };
};

const ScanResult: React.FC<ScanResultProps> = ({ result, videoDetails, url, user, onAddToPlaylistRequest }) => {
  const { addToHistory } = useAppContext();
  const primaryConcern = getPrimaryConcern(result);
  // Build a list of categories with labels and percentages for display
  const categories: { key: keyof Omit<AnalysisReport, 'videoTitle'|'channelName'>; label: string; percentage: number }[] = [
    { key: 'adultVisuals', label: CATEGORY_LABELS.adultVisuals, percentage: result.adultVisuals },
    { key: 'aggressiveBehavior', label: CATEGORY_LABELS.aggressiveBehavior, percentage: result.aggressiveBehavior },
    { key: 'nonTraditionalRelationships', label: CATEGORY_LABELS.nonTraditionalRelationships, percentage: result.nonTraditionalRelationships },
    { key: 'inappropriateLanguage', label: CATEGORY_LABELS.inappropriateLanguage, percentage: result.inappropriateLanguage },
    { key: 'lgbtqRepresentation', label: CATEGORY_LABELS.lgbtqRepresentation, percentage: result.lgbtqRepresentation },
  ];
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedVideosRaw = localStorage.getItem('savedVideos');
    if (savedVideosRaw) {
      const savedVideos: Video[] = JSON.parse(savedVideosRaw);
      const videoIsAlreadySaved = savedVideos.some(video => video.url === url);
      setIsSaved(videoIsAlreadySaved);
    }
  }, [url]);

  const handleSaveForLater = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          video: {
            url,
            videoTitle: result.videoTitle,
            thumbnailUrl: videoDetails.thumbnailUrl,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update localStorage for UI state
        const savedVideosRaw = localStorage.getItem('savedVideos');
        const savedVideos: Video[] = savedVideosRaw ? JSON.parse(savedVideosRaw) : [];
        if (!savedVideos.some(video => video.url === url)) {
          const newSavedVideo: Video = {
            url,
            videoTitle: result.videoTitle,
            thumbnailUrl: videoDetails.thumbnailUrl,
          };
          const updatedSavedVideos = [...savedVideos, newSavedVideo];
          localStorage.setItem('savedVideos', JSON.stringify(updatedSavedVideos));
        }
        setIsSaved(true);
      } else {
        alert(data.message || 'Failed to save video');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('An error occurred while saving the video');
    }
  }, [url, result.videoTitle, videoDetails.thumbnailUrl, user]);

  const handleAddToPlaylistClick = () => {
    onAddToPlaylistRequest({ url, videoTitle: result.videoTitle, thumbnailUrl: videoDetails.thumbnailUrl });
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in text-left">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{result.videoTitle}</h2>
      
      <div className="flex justify-center mb-4 rounded-lg overflow-hidden shadow-lg border-2 border-gray-300">
        <img src={videoDetails.thumbnailUrl} alt={`Thumbnail for ${result.videoTitle}`} className="w-full object-cover" />
      </div>
      
      <p className="text-center text-gray-700 font-semibold text-xl my-6">{result.channelName}</p>

      <div className="my-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Theme Analysis</h3>

        {/* Primary concern summary */}
        <div className="mb-4 p-4 rounded-lg border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-semibold">Primary Concern</p>
              <p className="text-lg font-bold text-red-800">{primaryConcern.label}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-extrabold text-red-700">{primaryConcern.percentage}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {categories.map(c => (
            <ProgressBar key={c.key} label={c.label} percentage={c.percentage} />
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-4 mt-8">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => addToHistory({ url, videoTitle: result.videoTitle, thumbnailUrl: videoDetails.thumbnailUrl })}
          className="w-full text-center bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Play Video
        </a>
        <button className="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105">Delete</button>
        {user && (
          <>
            <button 
              onClick={handleSaveForLater}
              disabled={isSaved}
              className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-purple-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSaved ? 'Saved' : 'Save for Later'}
            </button>
            <button 
              onClick={handleAddToPlaylistClick}
              className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">
              Save to Playlist
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ScanResult;
