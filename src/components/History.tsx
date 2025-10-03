import React from 'react';
import type { Video } from '../../types';

// Mock data for demonstration
const MOCK_HISTORY: Video[] = [
	{ url: 'https://www.youtube.com/watch?v=example1', videoTitle: 'Fun Science Experiments for Kids' },
	{ url: 'https://www.youtube.com/watch?v=example2', videoTitle: 'Learning the Alphabet Song' },
	{ url: 'https://www.youtube.com/watch?v=example3', videoTitle: 'How to Draw a Cartoon Dinosaur' },
];

const History: React.FC = () => {
	return (
		<div className="w-full max-w-3xl mx-auto animate-fade-in text-left">
			<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Watching History</h2>
			{MOCK_HISTORY.length === 0 ? (
				<p className="text-gray-600 text-lg text-center">No watching history found.</p>
			) : (
				<ul className="space-y-4">
					{MOCK_HISTORY.map((video) => (
						<li key={video.url} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
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
