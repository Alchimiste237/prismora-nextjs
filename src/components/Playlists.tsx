import React from 'react';
import type { Playlist } from '../../types';

interface PlaylistsProps {
	playlists: Playlist[];
}

const Playlists: React.FC<PlaylistsProps> = ({ playlists }) => {
	return (
		<div className="w-full max-w-3xl mx-auto animate-fade-in text-left">
			<div className="flex justify-between items-center mb-8">
				<h2 className="text-3xl font-bold text-center text-gray-800">My Playlists</h2>
				<button className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">Create New</button>
			</div>
			{playlists.length === 0 ? (
				<p className="text-gray-600 text-lg text-center">You haven't created any playlists yet.</p>
			) : (
				<ul className="space-y-4">
					{playlists.map((playlist) => (
						<li key={playlist.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
							<h3 className="font-bold text-lg text-gray-800">{playlist.name}</h3>
							<p className="text-sm text-gray-500">{playlist.videos.length} videos</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Playlists;
