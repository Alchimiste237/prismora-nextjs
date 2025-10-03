import type { VideoDetails } from '@/types';

const YOUTUBE_API_KEY = 'AIzaSyB1H6bV3O1Ujy1QxyrSwSQXQjdQ2EouSiE';
const VIDEOS_API_URL = 'https://www.googleapis.com/youtube/v3/videos';
const SEARCH_API_URL = 'https://www.googleapis.com/youtube/v3/search';

async function fetchYouTubeAPI(url: string, errorMessage: string) {
    if (!YOUTUBE_API_KEY) {
        throw new Error("NEXT_PUBLIC_YOUTUBE_API_KEY environment variable not set");
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            const message = errorData.error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(`${errorMessage}: ${message}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching from YouTube API:', error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred while fetching from YouTube.');
    }
}

export async function getVideoDetails(videoId: string): Promise<VideoDetails> {
  const url = `${VIDEOS_API_URL}?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`;
  const data = await fetchYouTubeAPI(url, 'Could not fetch video details');

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
}

export async function searchVideos(query: string): Promise<VideoDetails[]> {
    const url = `${SEARCH_API_URL}?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video&maxResults=10`;
    const data = await fetchYouTubeAPI(url, 'Could not perform search on YouTube');

    if (!data.items) {
        return [];
    }

    return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.high.url,
    }));
}

export {};
