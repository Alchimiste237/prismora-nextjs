export interface AnalysisReport {
  videoTitle: string;
  channelName: string;
  adultVisuals: number;
  aggressiveBehavior: number;
  nonTraditionalRelationships: number;
  inappropriateLanguage: number;
  lgbtqRepresentation: number;
}

export const CATEGORY_LABELS: Record<keyof Omit<AnalysisReport, 'videoTitle' | 'channelName'>, string> = {
  adultVisuals: 'Adult Visuals',
  aggressiveBehavior: 'Aggressive Behavior',
  nonTraditionalRelationships: 'Non-Traditional Relationships',
  inappropriateLanguage: 'Inappropriate Language',
  lgbtqRepresentation: 'LGBTQ+ Representation',
};

export interface Video {
  url: string;
  videoTitle: string;
  thumbnailUrl?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Playlist {
    id: string;
    name: string;
    videos: Video[];
}

export interface VideoDetails {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
}
