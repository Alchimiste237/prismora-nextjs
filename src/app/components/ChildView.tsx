import React from 'react';
import type { Playlist } from '../types';

interface ChildViewProps {
  playlists: Playlist[];
  onSwitchToParentMode: () => void;
}

const ChildView: React.FC<ChildViewProps> = ({ playlists, onSwitchToParentMode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-purple-50 font-sans p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-purple-600">Prismora Kids</h1>
        <button
          onClick={onSwitchToParentMode}
          className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Exit Kids Mode
        </button>
      </header>
      
      <main className="flex-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Approved Playlists</h2>
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map(playlist => (
              <div key={playlist.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:shadow-lg hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <h3 className="font-bold text-center text-gray-700">{playlist.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No playlists have been approved for Kids Mode yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChildView;
