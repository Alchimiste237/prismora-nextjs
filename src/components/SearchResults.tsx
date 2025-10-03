
import React from 'react';
import type { VideoDetails } from '@/types';

interface SearchResultsProps {
  results: VideoDetails[];
  onVideoSelect: (video: VideoDetails) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onVideoSelect }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in text-left">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Search Results</h2>
      <div className="space-y-4">
        {results.map((video) => (
          <div
            key={video.id}
            onClick={() => onVideoSelect(video)}
            className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <img src={video.thumbnailUrl} alt={video.title} className="w-32 h-18 object-cover rounded-md mr-4" />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 leading-tight">{video.title}</h3>
              <p className="text-sm text-gray-500">{video.channelTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
