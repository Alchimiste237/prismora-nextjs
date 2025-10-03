import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/StateContext';
import type { Video } from '../../types';

const SavedVideos: React.FC = () => {
	const [savedVideos, setSavedVideos] = useState<Video[]>([]);
	const { addToHistory, user } = useAppContext();

	useEffect(() => {
		if (user) {
			const savedVideosRaw = localStorage.getItem(`savedVideos_${user.id}`);
			if (savedVideosRaw) {
				setSavedVideos(JSON.parse(savedVideosRaw));
			}
		}
	}, [user]);

	const handleRemoveVideo = (urlToRemove: string) => {
		const updatedVideos = savedVideos.filter(video => video.url !== urlToRemove);
		setSavedVideos(updatedVideos);
		if (user) {
			localStorage.setItem(`savedVideos_${user.id}`, JSON.stringify(updatedVideos));
		}
	};

	return (
		<div className="w-full max-w-3xl mx-auto animate-fade-in text-left">
			<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Saved For Later</h2>
			{savedVideos.length === 0 ? (
				 <p className="text-gray-600 text-lg text-center">You have no videos saved for later.</p>
			) : (
				<ul className="space-y-4">
					{savedVideos.map((video) => (
						<li
							key={video.url}
							className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							<a
								href={video.url}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => addToHistory(video)}
								className="text-purple-600 hover:underline font-medium truncate"
								title={video.videoTitle}
							>
								{video.videoTitle}
							</a>
							<button
								onClick={() => handleRemoveVideo(video.url)}
								className="ml-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
								aria-label={`Remove ${video.videoTitle}`}
							>
								Remove
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SavedVideos;
