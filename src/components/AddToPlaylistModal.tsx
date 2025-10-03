"use client";

import React from 'react';
import type { Playlist } from '../types';

interface AddToPlaylistModalProps {
	playlists: Playlist[];
	onClose: () => void;
	onAddToPlaylist: (playlistId: string) => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ playlists, onClose, onAddToPlaylist }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
				<div className="p-6 border-b">
					<h3 className="text-xl font-bold text-gray-800">Add to Playlist</h3>
				</div>
				<div className="p-6">
					{playlists.length > 0 ? (
						<ul className="space-y-2 max-h-60 overflow-y-auto">
							{playlists.map(playlist => (
								<li
									key={playlist.id}
									onClick={() => onAddToPlaylist(playlist.id)}
									className="p-3 rounded-md hover:bg-purple-100 cursor-pointer transition-colors text-left"
								>
									{playlist.name}
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-600">You don't have any playlists yet.</p>
					)}
				</div>
				<div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
					<button
						onClick={onClose}
						className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddToPlaylistModal;
