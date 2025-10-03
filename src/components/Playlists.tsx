import React from 'react';
import { useAppContext } from '../context/StateContext';
import type { Playlist } from '../../types';

interface PlaylistsProps {
	playlists: Playlist[];
}

const Playlists: React.FC<PlaylistsProps> = ({ playlists }) => {
	const { addToHistory, createPlaylist, user } = useAppContext();

	const handleCreatePlaylist = () => {
		const name = prompt('Enter playlist name:');
		if (name && user) {
			createPlaylist(name);
		}
	};
	return (
		<div className="w-full max-w-3xl mx-auto animate-fade-in text-left">
			<div className="flex justify-between items-center mb-8">
				<h2 className="text-3xl font-bold text-center text-gray-800">My Playlists</h2>
				<button onClick={handleCreatePlaylist} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">Create New</button>
			</div>
			{playlists.length === 0 ? (
				<p className="text-gray-600 text-lg text-center">You haven't created any playlists yet.</p>
			) : (
				<ul className="space-y-6">
					{playlists.map((playlist) => (
						<li key={playlist.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
							<h3 className="font-bold text-lg text-gray-800 mb-2">{playlist.name}</h3>
							<p className="text-sm text-gray-500 mb-4">{playlist.videos.length} videos</p>
							{playlist.videos.length > 0 && (
								<ul className="space-y-2">
									{playlist.videos.map((video, index) => (
										<li key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
											<img src={video.thumbnailUrl} alt={video.videoTitle} className="w-16 h-12 rounded mr-3" />
											<div>
												<p className="font-medium text-gray-800">{video.videoTitle}</p>
												<a href={video.url} target="_blank" rel="noopener noreferrer" onClick={() => addToHistory(video)} className="text-purple-600 hover:text-purple-800 text-sm">Watch</a>
											</div>
										</li>
									))}
								</ul>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Playlists;
