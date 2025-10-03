import React, { useEffect } from 'react';
import { useAppContext } from '../context/StateContext';
import type { Video } from '../../types';

const History: React.FC = () => {
	const { history, user } = useAppContext();

	useEffect(() => {
		if (user) {
			// Fetch history on component mount if not already loaded
			// Assuming history is loaded in context on login
		}
	}, [user]);

	return (
		<div className="w-full max-w-3xl mx-auto animate-fade-in text-left">
			<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Watching History</h2>
			{history.length === 0 ? (
				<p className="text-gray-600 text-lg text-center">No watching history found.</p>
			) : (
				<ul className="space-y-4">
					{history.map((video, index) => (
						<li key={video.url || index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
							<a href={video.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
								{video.videoTitle}
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default History;
