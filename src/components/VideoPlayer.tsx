import React from 'react';
import type { VideoDetails } from '@/types';

interface VideoPlayerProps {
  videoDetails: VideoDetails;
  onScanOption: (option: 'quick' | 'detailed') => void;
  isLoading?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoDetails, onScanOption, isLoading = false }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoDetails.id}`;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in text-left">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{videoDetails.title}</h2>
      <p className="text-center text-gray-700 font-semibold text-xl mb-6">{videoDetails.channelTitle}</p>

      <div className="aspect-video mb-6">
        <iframe
          src={embedUrl}
          title={`YouTube video player for ${videoDetails.title}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg shadow-lg"
        ></iframe>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Choose a Scan Option</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onScanOption('quick')}
            disabled={isLoading}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Scanning...' : 'Quick Scan'}
          </button>
          <button
            onClick={() => onScanOption('detailed')}
            disabled={isLoading}
            className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Scanning...' : 'Detailed Scan'}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Quick Scan provides a basic analysis, while Detailed Scan offers in-depth content evaluation.
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
