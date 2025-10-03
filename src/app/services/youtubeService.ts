import type { VideoDetails } from '../types';

// In a real production app, this key should be stored in a secure environment variable,
// not hardcoded in the source file.
const YOUTUBE_API_KEY = 'AIzaSyB1H6bV3O1Ujy1QxyrSwSQXQjdQ2EouSiE';
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3/videos';

export async function getVideoDetails(videoId: string): Promise<VideoDetails> {
  const url = `${API_BASE_URL}?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
      throw new Error(`Could not fetch video details from YouTube: ${errorMessage}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found on YouTube.');
    }

    const snippet = data.items[0].snippet;
    const thumbnails = snippet.thumbnails;

    const thumbnailUrl = thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;

    if (!thumbnailUrl) {
      throw new Error('Could not find a thumbnail for this video.');
    }

    return {
      id: videoId,
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      thumbnailUrl: thumbnailUrl,
    };
  } catch (error) {
    console.error('Error fetching from YouTube API:', error);
    if (error instanceof Error) {
        // Re-throw the specific error message for better UI feedback
        throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while fetching video details.');
  }
}